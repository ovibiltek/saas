$(function () {
    var grdGrid = null;
    var columnarray = null;
    var columns = [];
    var fields = {};
    var data = null;
    var search_inputs = [];
    var gridfilter = [];
    var gridselector = "#grdGrid-" + grdscrcode;
    function getGridData() {
        return tms.Ajax({
            url: "/Api/ApiGridDesigner/GetGridDataByScrCode",
            data: JSON.stringify(grdscrcode),
            fn: function (m) {
                data = m.data;
                columnarray = JSON.parse(data["GRD_COLUMNARRAY"]);
                buildGrid();
            }
        })
    }

    function setTitles(titles) {
        var _titles = {};
        $.each(titles, function (k, v) {
            var col = v.column;
            var tlt = v.title;
            _titles[col] = tlt;
        });
        return _titles;
    }

    function buildColumns() {
        columns = [];
        var titles = setTitles(JSON.parse(data["GRD_STRINGARRAY"]));

        $.each(columnarray, function (k, v) {
            if (!v.disabled) {
                var title = titles[v.column];
                var column = { type: v.fieldtype, field: v.column, title: title[lang], width: Number(v.width) };
                columns.push(column);
                var ftype = v.fieldtype;
                switch (ftype) {
                    case 'string':
                        ftype = 'string';
                        break;
                    case 'date':
                    case 'datetime':
                        ftype = 'date';
                        break;
                    default:
                        ftype = 'number';
                        break;
                }
                fields[v.column] = { type: ftype };
            }
        });
    }

    function gridDataBound(e) {
        $(gridselector).find("[data-id]").unbind("click").click(function () {
            itemSelect($(this));
        });

        if (data["GRD_RIGHTCLICKARRAY"] != null && data["GRD_RIGHTCLICKARRAY"] != []) {
            let rcf_list = JSON.parse(data["GRD_RIGHTCLICKARRAY"]);

            let rcf_item = {};
            $.each(rcf_list, function (k, v) {
                let rcf = v;
                let rcf_url = rcf["Url"];
                let rcf_data = rcf["Data"];

                let rcf_name = rcf["Names"].find(x => Object.keys(x).find(key => key === lang))[lang];

                if (rcf_url != null && rcf_url != "" & rcf_data != null && rcf_data != "" & rcf_name != null && rcf_name != "") {
                    rcf_item[rcf_name] = {
                        name: rcf_name, callback: function () {
                            let id = $(this).closest("[data-id]");
                            let obj = grdGrid.GetRowDataItem(id);

                            let d = obj[rcf_data];

                            let win = window.open(rcf_url + d, "_blank");
                        }
                    };
                }
            });

            if (!jQuery.isEmptyObject(rcf_item)) {
                $(gridselector).contextMenu({
                    selector: "div.k-grid-content tr",
                    items: rcf_item
                });
            }
        }

        $(gridselector).find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function itemSelect(row) {
        var selectedrecord = grdGrid.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $(".page-header h6").html(selectedrecord[data["GRD_PRIMARYCODEFIELD"]] + " - " + selectedrecord[data["GRD_PRIMARYTEXTFIELD"]]);
    }

    function gridChange(e) {
    }

    function buildGrid() {
        buildColumns();
        buildDetailedSearchBar();
        var info_obj = JSON.parse(data["GRD_INFO"]);
        var tabletitle_obj = JSON.parse(data["GRD_TITLE"]);
        var str_info = "";
        var str_tabletitle = "";

        $.each(info_obj, function (k, v) {
            if (v[lang] != undefined) {
                str_info = v[lang];
            }
        });

        $.each(tabletitle_obj, function (k, v) {
            if (v[lang] != undefined) {
                str_tabletitle = v[lang];
            }
        });

        $("#table_title").html(str_tabletitle);
        $("#info").html(str_info);

        let toolbar_right = [];

        if (str_info != null && str_info != "")
            toolbar_right.push("<a title=\"#= applicationstrings[lang].recordcount #\" data-toggle=\"modal\" data-target=\"\\#infoModal\" class=\"btn btn-primary btn-sm\" id=\"btninfo\"><i  class=\"fa fa-info\"></i></a>")

        toolbar_right.push("<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i id=\"dd\" class=\"fa fa-eye\"></i></a>");
        toolbar_right.push("<a title=\"#= applicationstrings[lang].download #\" download=\"" + str_tabletitle + ".xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>");

        if (search_inputs.length > 0)
            toolbar_right.push("<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>");

        toolbar_right.push("<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>");

        grdGrid = new Grid({
            keyfield: data["GRD_KEYFIELD"],
            columns: columns,
            fields: fields,
            datasource: "/Api/ApiGridDesigner/GetTableData?code=" + data["GRD_CODE"],
            selector: gridselector,
            name: "grdGrid-" + data["GRD_SCREENCODE"],
            height: constants.defaultgridheight,
            primarycodefield: data["GRD_PRIMARYCODEFIELD"],
            primarytextfield: data["GRD_PRIMARYTEXTFIELD"],
            toolbar: {
                right: toolbar_right
            },
            sort: [{ field: data["GRD_ORDERFIELD"], dir: data["GRD_ORDERDIRECTION"] }],
            filter: gridfilter,
            toolbarColumnMenu: true,
            filterlogic: "or",
            hasfiltermenu: true,
            databound: gridDataBound,
            change: gridChange,
            screen : data["GRD_SCREENCODE"]
        });
    }

    function buildDetailedSearchBar() {
        let strsearch = "";
        search_inputs = [];
        $.each(columns, function (k, v) {
            if (v.type === "datetime") {
                strsearch += ' <div class="row">' +
                    ' <div class="col-md-12">' +
                    '<div class="page-header">' +
                    '<h5>' + v.title + '</h5>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-sm-6">' +
                    '<input type="text" ctrltype="datepicker" class="i-filter form-control" id="' + v.field + '_start">' +
                    '</div>' +
                    '<div class="col-sm-6">' +
                    '<input type="text" ctrltype="datepicker" class="i-filter form-control" id="' + v.field + '_end">' +
                    '</div>' +
                    '</div>';

                search_inputs.push(v.field);
            }
        });
        $("#detailedsearch").append(strsearch);
        $.each(search_inputs, function (k, v) {
            $("#" + v + "_start").datetimepicker({ format: 'DD/MM/YYYY' });
            $("#" + v + "_end").datetimepicker({ format: 'DD/MM/YYYY' });
        });
    }

    function runFilter() {
        gridfilter = [];
        $.each(search_inputs, function (k, v) {
            let val_1 = $("#" + v + "_start").val().toDate();
            let val_2 = $("#" + v + "_end").val().toDate();
            if (val_1)
                val_1 = val_1.format(constants.dateformat2);
            if (val_2) {
                val_2 = val_2.add(1, "days").format(constants.dateformat2);
            }

            if (val_1 && val_2) {
                gridfilter.push({ field: v, value: val_1, value2: val_2, operator: "between", logic: "and" });
            }

            if (val_1 && !val_2)
                gridfilter.push({ field: v, value: val_1, operator: "gte", logic: "and" });
            if (!val_1 && val_2)
                gridfilter.push({ field: v, value: val_2, operator: "lte", logic: "and" });
        });

        grdGrid.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function resetFilter() {
        $.each(search_inputs, function (k, v) {
            $("#" + v + "_start").val("");
            $("#" + v + "_end").val("");
        });
    }

    function ready() {
        getGridData();
        $("#filter").click(function () {
            runFilter();
        });
        $("#clearfilter").click(function () {
            resetFilter();
            runFilter();
        });
        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    $(document).ready(ready);
})