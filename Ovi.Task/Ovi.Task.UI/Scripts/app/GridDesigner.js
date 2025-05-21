

$(function () {

    var columns = [];
    var columnarray = [];
    var tablename = "";
    var title = "";
    var info = "";
    var selectedbuttons = "";
    var selectedrecord = null;
    var buttonArray = [];
    var langs = null;
    var tabledata = null;
    var gridid = null;
    var titletable = null;
    var coltable = null;
    var rcf_list = [];
    var screenconf = [

        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },

            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSaveGrid", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true }

            ]
        },
        {
            name: "colconf",
            btns: [
                { id: "#btnSaveGrid", selectionrequired: true }
            ]
        }

    ];

    function setColArray() {
        var cols = [];
        for (var i = 0; i < columns.length; i++) {
            var n = columns[i];
            var col = { column: n, fieldtype: $("#" + n + "-fieldtype").val(), width: $("#" + n + "-columnwidth").val(), disabled: $("#" + n + "-disabled").is(":checked") };

            cols.push(col);
        }

        return cols;
    }

    function setTitleArray() {
        let titles = [];
        $.each(langs, function (k, v) {
            let slc = $("#title-" + v.LNG_CODE);
            let title = {};
            let code = v.LNG_CODE;
            title[code] = slc.val();

            titles.push(title);
        });

        return titles;
    }

    function setInfoArray() {
        let infos = [];
        $.each(langs, function (k, v) {
            let slc = $("#info-" + v.LNG_CODE);
            let info = {};
            let code = v.LNG_CODE;
            info[code] = slc.val();

            infos.push(info);
        });
        return infos;
    }

    function setRightClickArray() {
        let rcf = {};
        let names = [];
        $.each(langs, function (k, v) {
            let slc = $("#rightclickname-" + v.LNG_CODE);
            let name = {};
            let code = v.LNG_CODE;
            name[code] = slc.val();
            names.push(name);

        });
        rcf["Names"] = names;
        rcf["Data"] = $("#rightclickdata").val();
        rcf["Url"] = $("#rightclickurl").val();


        return rcf;
    }

    function addRcf() {
        const rcf = setRightClickArray();
        rcf_list.push(rcf);
        refreshRcf();

    }

    function refreshRcf() {
        if (rcf_list.length > 0) {
            let rcf_string = "";
            $.each(rcf_list, function (k, v) {
                let r_name = v["Names"].find(x => Object.keys(x).find(key => key === lang))[lang];
                rcf_string += '<option value="' + r_name + '">' + r_name + '</option>';
            });

            $("#rcf_list").html(rcf_string);
            $("#rcf_list").trigger("change");
        }
        else {
            $("#rcf_list").html("");

        }
    }

    function clearRcf() {
        $(".rightclick").val("");
        $("#rightclickdata").val("");
        $("#rightclickurl").val("");

    }

    function updateRcf() {
        let rcf = rcf_list.find(x => x.Names.find(n => n[lang] === $("#rcf_list").val()));
        let ind = rcf_list.indexOf(rcf);
        rcf.Data = $("#rightclickdata").val();
        rcf.Url = $("#rightclickurl").val();
        let new_names = []


        $.each(langs, function (k, v) {
            let new_n = $("#rightclickname-" + v.LNG_CODE).val();
            let nkey = v.LNG_CODE;
            let _n = {};
            _n[nkey] = new_n;
            new_names.push(_n);
        });
        rcf.Names = new_names;
        rcf_list[ind] = rcf;

        refreshRcf();
    }

    function deleteRcf() {
        let rcf = rcf_list.find(x => x.Names.find(n => n[lang] === $("#rcf_list").val()));
        let ind = rcf_list.indexOf(rcf);

        rcf_list.splice(ind, 1);
        refreshRcf();

    }

    function fillRcf() {

        let rcf = rcf_list.find(x => x.Names.find(n => n[lang] === $("#rcf_list").val()));
        let ind = rcf_list.indexOf(rcf);


        $("#rightclickdata").val(rcf.Data);
        $("#rightclickurl").val(rcf.Url);

        $.each(rcf.Names, function (k, v) {
            let key = Object.keys(v)[0];

            $("#rightclickname-" + key).val(v[key]);
        });

    }

    function hideUI() {
        $("#divgridheaderconfiguration").hide();
        $("#divgridcolumnconfiguration").hide();
    }

    function showUI() {
        $("#divgridheaderconfiguration").show();
        $("#divgridcolumnconfiguration").show();
    }

    function setColStringArray() {
        var colstrings = [];
        for (var i = 0; i < columns.length; i++) {
            var n = columns[i];
            var coltitles = {};
            for (var j = 0; j < langs.length; j++) {

                coltitles[langs[j].LNG_CODE] = $("#" + n + "-" + langs[j].LNG_CODE + "-title").val();
            }

            var string = { column: n, title: coltitles };
            colstrings.push(string);

        }

        return colstrings;
    }

    function getColumns() {
        var tablename = $('#code').val();
        return tms.Ajax({
            url: "/Api/ApiGridDesigner/GetColumnInfo",
            data: JSON.stringify(tablename),
            fn: function (m) {
                columns = [];
                tabledata = m.data;
                $.each(m.data, function (k, v) {
                    columns.push(v["COLUMN_NAME"]);
                });
            }
        })
    }

    function AutoFillBlanks() {
        if (!selectedrecord) {
            var data = tabledata;
            if (data.length > 0) {
                $("#keyfield").val = data.find(x => x.ORDINAL_POSITION === 1).COLUMN_NAME;
                $("#orderfield").val = data.find(x => x.ORDINAL_POSITION === 1).COLUMN_NAME;
                $("#primarycodefield").val = data.find(x => x.ORDINAL_POSITION === 1).COLUMN_NAME;
            }
            $("#rightclickdata").val("");
            $(".rightclick").val("");
            $("#rcf_list").html("");
            $("#rightclickurl").val("");
            for (var i = 0; i < columns.length; i++) {
                var colname = columns[i];

                $("#" + colname + "-fieldtype").val(SQLtoJSTypeConverter(data.find(x => x.COLUMN_NAME === colname).DATA_TYPE));
                $("#" + colname + "-columnwidth").val("250");
                for (var j = 0; j < langs.length; j++) {
                    var splittedcolname = colname.split("_")[1];
                    $("#" + colname + "-" + langs[j].LNG_CODE + "-title").val(splittedcolname);
                }
            }
        }
        else {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");
            if (tms.ActiveTab() === "colconf")
                tms.BeforeFill("#colconf");
            tms.Tab();
            $("#code").val(selectedrecord.GRD_CODE);
            $("#screencode").val(selectedrecord.GRD_SCREENCODE);
            let grid_titles = [];
            let grid_infos = [];
            grid_titles = JSON.parse(selectedrecord.GRD_TITLE);
            grid_infos = JSON.parse(selectedrecord.GRD_INFO);
            $("#rightclickdata").val("");
            $(".rightclick").val("");
            $("#rcf_list").html("");
            $("#rightclickurl").val("");

            $.each(grid_titles, function (k, v) {
                let key = Object.keys(v)[0];

                $("#title-" + key).val(v[key]);

            });
            $.each(grid_infos, function (k, v) {
                let key = Object.keys(v)[0];
                $("#info-" + key).val(v[key]);

            });
            if (selectedrecord.GRD_RIGHTCLICKARRAY != null) {

                rcf_list = JSON.parse(selectedrecord.GRD_RIGHTCLICKARRAY);
                refreshRcf();
            }
            else {
                $(".rightclick").val("");
                $("#rightclickdata").val("");
                $("#rightclickurl").val("");
            }


            $("#keyfield").val(selectedrecord.GRD_KEYFIELD);
            $("#primarytextfield").val(selectedrecord.GRD_PRIMARYTEXTFIELD);
            $("#primarycodefield").val(selectedrecord.GRD_PRIMARYCODEFIELD);
            $("#orderfield").val(selectedrecord.GRD_ORDERFIELD);
            $("#orderdirection").val(selectedrecord.GRD_ORDERDIRECTION);
            var coldata = JSON.parse(selectedrecord.GRD_COLUMNARRAY);

            var titledata = JSON.parse(selectedrecord.GRD_STRINGARRAY);
            for (var i = 0; i < coldata.length; i++) {
                var colname = coldata[i].column;

                $("#" + colname + "-fieldtype").val(coldata.find(x => x.column === colname).fieldtype);
                $("#" + colname + "-columnwidth").val(coldata.find(x => x.column === colname).width);
                if (coldata.find(x => x.column === colname).disabled)
                    $("#" + colname + "-disabled").prop("checked", true);

                for (var j = 0; j < langs.length; j++) {
                    var lngj = langs[j];
                    $("#" + colname + "-" + lngj.LNG_CODE + "-title").val(titledata.find(x => x.column === colname).title[lngj.LNG_CODE]);
                }

            }
        }

    }

    function SQLtoJSTypeConverter(typename) {


        switch (typename) {

            case "nvarchar":
            case "char":
            case "nchar":
            case "ntext":
            case "text":
            case "varchar":
            case "image":
            case "xml":
                return "string";

            case "bigint":
            case "float":
            case "real":
            case "smallint":
            case "tinyint":
            case "int":
            case "numeric":
            case "decimal":
            case "money":
            case "smallmoney":
                return "number";

            case "datetime":
            case "smalldatetime":
            case "date":
            case "time":
            case "datetime2":
                return "datetime";


        }

    }

    function buildTable() {
        $("#colconftable").show();
        $("#displayarea").empty();
        for (var i = 0; i < columns.length; i++) {

            var n = columns[i];

            var tr = " <tr>  <td> " + n + "</td>   <td> <select name=\"" + n + "-fieldtype  \" id=\"" + n + "-fieldtype\"> <option value=\"string\" selected=\"selected\">String</option> " +
                "<option value=\"datetime\"> DateTime </option>  <option value=\"number\">Number  </option > <option value=\"price\">Price </option >  <option value=\"qty\"> Quantity  </select > " +
                "    </td >   <td><input class=\"form-control\" type=\"text\" maxlength=\"50\" " +
                "id=\"" + n + "-columnwidth\" name=\"" + n + "-columnwidth\"  /></td> <td><input class=\"form-control\" type=\"checkbox\"  id=\"" + n + "-disabled\" name=\"" + n + "-disabled\"   /></td> </tr > ";

            $("#displayarea").append(tr);
        }
        if ($.fn.dataTable.isDataTable('#colconftable')) {
            coltable = $('#colconftable').DataTable();
        }
        else {
            coltable = $('#colconftable').DataTable({


                paging: false
            });
        }

    }

    function buildTitleTable() {

        $("#titletable").show();
        $("#stringtitle").empty();
        $("#stringtitle").append("<th>" + applicationstrings[lang].column + "</th>")
        for (var i = 0; i < langs.length; i++) {
            var strth = " <th>" + applicationstrings[lang].columntitle + "-" + langs[i].LNG_DESCRIPTION + " - " + langs[i].LNG_CODE + "</th>";
            $("#stringtitle").append(strth);
        }
        $("#displayareaforcolumntitle").empty();
        for (var i = 0; i < columns.length; i++) {

            var n = columns[i];
            var tr = " <tr>  <td> " + n + "</td>";
            for (var j = 0; j < langs.length; j++) {

                tr += "<td><input class=\"form-control\" type=\"text\" name=\"" + n + "-" + langs[j].LNG_CODE + "-title\" id=\"" + n + "-" + langs[j].LNG_CODE + "-title\"  /></td>";
            }

            $("#displayareaforcolumntitle").append(tr);
        }
        if ($.fn.dataTable.isDataTable('#titletable')) {
            titletable = $('#titletable').DataTable();
        }
        else {
            titletable = $('#titletable').DataTable({

                paging: false
            });
        }

        AutoFillBlanks();


    }

    function buildSelections() {
        buttonArr = ["recordcount", "download", "filter", "save"];
        fieldTypeArr = ["string", "datetime", "number", "price", "qty"]
        orderDirArr = ["Desc", "Asc"];
        buildCustomSelection(columns, "keyfield");
        buildCustomSelection(columns, "orderfield");
        buildCustomSelection(columns, "primarycodefield");
        buildCustomSelection(columns, "primarytextfield");
        buildCustomSelection(columns, "columns");
        buildCustomSelection(columns, "rightclickdata");
        /* buildLanguages();*/
        buildCustomSelection(buttonArr, "buttons");
        buildCustomSelection(fieldTypeArr, "fieldtypes");
        buildCustomSelection(orderDirArr, "orderdirection");

    }

    function buildLanguages() {
        var gridreq = {
            sort: [{ field: "LNG_CODE", dir: "asc" }]
        };

        return tms.Ajax({
            url: "/Api/ApiLanguage/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                langs = d.data;
                var strlanguages = "";
                $("#infolangs option").remove();
                $("#titlelangs option").remove();
                for (var i = 0; i < d.data.length; i++) {
                    strlanguages += '<option value="' +
                        d.data[i].LNG_CODE +
                        '">' +
                        d.data[i].LNG_CODE +
                        "</option>";
                }
                $("#infolangs").append(strlanguages);
                $("#infolangs").val('TR');

                $("#rightclicklangs").append(strlanguages);
                $("#rightclicklangs").val('TR');

                $("#titlelangs").append(strlanguages);
                $("#titlelangs").val('TR');
                var infostring = "";
                var titlestring = "";
                var rightclickstring = "";
                $.each(langs, function (k, v) {
                    infostring += ' <textarea  type="text" class="form-control info" id="info-' + v.LNG_CODE + '"></textarea>';
                    if (v.LNG_CODE == 'TR') {
                        titlestring += ' <input  type="text" required class="title form-control required" id="title-' + v.LNG_CODE + '">';
                    }
                    else {
                        titlestring += ' <input  type="text"  class="title form-control" id="title-' + v.LNG_CODE + '">';
                    }

                    rightclickstring += ' <input  type="text"  class="rightclick form-control  " id="rightclickname-' + v.LNG_CODE + '">';
                });

                $("#titlegroup").html(titlestring);
                $("#infogroup").html(infostring);
                $("#rightclickgroup").html(rightclickstring);
                $(".info").hide();
                $(".title").hide();
                $(".rightclick").hide();
                $("#rightclickname-TR").show();
                $("#info-TR").show();
                $("#title-TR").show();

                $("#rightclicklangs").change(function () {
                    let lng = $(this).val();
                    let selector = '#rightclickname-' + lng;
                    $(".rightclick").hide();
                    $(selector).show()
                });

                $("#infolangs").change(function () {
                    let lng = $(this).val();
                    let selector = '#info-' + lng;
                    $(".info").hide();
                    $(selector).show()
                });

                $("#titlelangs").change(function () {
                    let lng = $(this).val();
                    let selector = '#title-' + lng;
                    $(".title").hide();
                    $(selector).show()
                });


            }
        });

    }

    function buildCustomSelection(array = [], slc_id = "") {
        var stroptions = "";
        slc_id = "#" + slc_id;
        $(slc_id + " option").remove();
        for (var i = 0; i < array.length; i++) {
            stroptions += "<option value=\"" +
                array[i] +
                "\">" +
                array[i] +
                "</option>";
        }
        $(slc_id).append(stroptions);
    }

    var scr = new function () {
        this.Configure = function () {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function (e) { return e.name === activeTab; })[0];
            for (var i = 0; i < tab.btns.length; i++) {
                var btni = tab.btns[i];
                if (!btni.selectionrequired)
                    $(btni.id).removeAttr("disabled");
                else {
                    if (selectedrecord) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
    };

    var grds = new function () {

        var self = this;
        var grdGrids = null;
        var grdGridsElm = $("#grdGrids");
        this.List = function () {
            if (grdGrids) {
                grdGrids.ClearSelection();
                grdGrids.RunFilter([]);
            }
            else {
                grdGrids = new Grid({
                    keyfield: "GRD_SCREENCODE",
                    columns: [
                        {
                            type: "string",
                            field: "GRD_SCREENCODE",
                            title: gridstrings.griddesigner[lang].screencode,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "GRD_CODE",
                            title: gridstrings.griddesigner[lang].tablecode,
                            width: 200
                        },
                        {
                            type: "na",
                            field: "GRD_TITLE",
                            template: '<div class="asd">#=JSON.parse(GRD_TITLE).find(x => Object.keys(x).find(key => key === lang))[lang]#</div> ',
                            title: gridstrings.griddesigner[lang].title,
                            width: 200
                        }
                      

                    ],
                    datasource: "/Api/ApiGridDesigner/List",
                    selector: "#grdGrids",
                    name: "grdGrids",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "GRD_SCREENCODE",
                    primarytextfield: "GRD_CODE",
                    visibleitemcount: 10,
                    sort: [{ field: "GRD_SCREENCODE", dir: "asc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Grids.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange

                });
            }
        };
        this.Save = function () {
            if ((!tms.Check("#record") || !tms.Check("#colconf")))
                return $.Deferred().reject();
            if ($("#screencode").val() == "" || $("#title-TR").val() == "" || $("#keyfield").val() == "" || $("#orderfield").val() == "" || $("#primarytextfield").val() == "" || $("#primarycodefield").val() == "" || $("#orderdirection").val() == "")
                return msgs.error(applicationstrings[lang].fillrequired);
            if (selectedrecord != null) {

                var o = JSON.stringify({
                    GRD_ID: selectedrecord.GRD_ID,
                    GRD_CODE: $('#code').val(),
                    GRD_SCREENCODE: $("#screencode").val(),
                    GRD_TITLE: JSON.stringify(setTitleArray()),
                    GRD_STRINGARRAY: JSON.stringify(setColStringArray()),
                    GRD_COLUMNARRAY: JSON.stringify(setColArray()),
                    GRD_INFO: JSON.stringify(setInfoArray()),
                    GRD_BUTTONARRAY: JSON.stringify(buttonArray),
                    GRD_RIGHTCLICKARRAY: JSON.stringify(rcf_list),
                    GRD_KEYFIELD: $("#keyfield").val(),
                    GRD_PRIMARYTEXTFIELD: $("#primarytextfield").val(),
                    GRD_PRIMARYCODEFIELD: $("#primarycodefield").val(),
                    GRD_ORDERFIELD: $("#orderfield").val(),
                    GRD_ORDERDIRECTION: $("#orderdirection").val(),
                    GRD_CREATED: selectedrecord.GRD_CREATED,
                    GRD_CREATEDBY: selectedrecord.GRD_CREATEDBY,
                    GRD_UPDATED: tms.Now(),
                    GRd_UPDATEDBY: user
                });

                return tms.Ajax({
                    url: "/Api/ApiGridDesigner/Save",
                    data: o,
                    fn: function (d) {
                        selectedrecord = null;
                        msgs.success(d.data);
                        $("[data-id]").removeClass("k-state-selected");
                        grds.ResetUI();
                        $(".nav-tabs a[href=\"#list\"]").tab("show");
                        $("[data-id]").removeClass("k-state-selected");
                    }
                });

            }
            else {
                var gq = { loadall: true };
                tms.Ajax({
                    url: "/Api/ApiScreens/List",
                    data: JSON.stringify(gq),
                    fn: function (d) {

                        //var tt = false;
                        //$.each(d.data, function (k, v) {
                        //    if (v.SCR_CODE == $("#screencode").val()) {

                        //        return tt = true;

                        //    }

                        //});

                        //if (tt)
                        //    return msgs.error(applicationstrings[lang].screenexists);

                        var o = JSON.stringify({
                            GRD_CODE: $('#code').val(),
                            GRD_SCREENCODE: $("#screencode").val(),
                            GRD_TITLE: JSON.stringify(setTitleArray()),
                            GRD_STRINGARRAY: JSON.stringify(setColStringArray()),
                            GRD_COLUMNARRAY: JSON.stringify(setColArray()),
                            GRD_INFO: JSON.stringify(setInfoArray()),
                            GRD_BUTTONARRAY: JSON.stringify(buttonArray),
                            GRD_RIGHTCLICKARRAY: JSON.stringify(rcf_list),
                            GRD_KEYFIELD: $("#keyfield").val(),
                            GRD_PRIMARYTEXTFIELD: $("#primarytextfield").val(),
                            GRD_PRIMARYCODEFIELD: $("#primarycodefield").val(),
                            GRD_ORDERFIELD: $("#orderfield").val(),
                            GRD_ORDERDIRECTION: $("#orderdirection").val(),
                            GRD_CREATED: tms.Now(),
                            GRD_CREATEDBY: user,
                            GRD_UPDATED: null,
                            GRd_UPDATEDBY: null
                        });
                        return tms.Ajax({
                            url: "/Api/ApiGridDesigner/Save",
                            data: o,
                            fn: function (d) {

                                msgs.success(d.data);
                                selectedrecord = d.r;
                                grds.ResetUI();
                                $(".nav-tabs a[href=\"#list\"]").tab("show");
                                $("[data-id]").removeClass("k-state-selected");

                            }
                        });
                    }
                });



            }



        };
        this.Delete = function () {
            if (selectedrecord != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiGridDesigner/DelRec",
                            data: JSON.stringify(selectedrecord.GRD_ID),
                            fn: function (d) {
                                selectedrecord = null;
                                msgs.success(d.data);
                                self.ResetUI();                                
                                self.List();
                            }
                        });
                    });
            }
        };
        this.ResetUI = function () {
            selectedrecord = null;
            gridid = null;
            tms.Reset("#record");
            tms.Reset("#colconf");
            $("#colconftable").hide();
            $("#titletable").hide();
            $("#code").val("");
            $("#screencode").val("");
            $(".info").val("");
            $(".title").val("");
            $("#keyfield").val("");
            $("#primarytextfield").val("");
            $("#primarycodefield").val("");
            $("#orderfield").val("");
            $(".rightclick").val("");
            $("#rightclickdata").val("");
            $("#rightclickurl").val("");
            hideUI();
        };
        var RegisterTabEvents = function () {
            $("#btnNew").click(function () {
                selectedrecord = null;
                $("#code").val("");
                if (tms.ActiveTab() === "record") {
                    self.ResetUI();
                    $("[data-id]").removeClass("k-state-selected");
                }
                else {
                    self.ResetUI();
                    $("[data-id]").removeClass("k-state-selected");
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
                }
            });
            $("#btnSaveGrid").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            RegisterTabChange();
            BuildModals();
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var activatedTab = e.target.hash; // activated tab
                    switch (activatedTab) {
                        case "#list":
                            selectedrecord = null;
                            self.List();
                        case "#record":
                        case "#colconf":
                                self.LoadSelected();
                    }
                    scr.Configure();
                });
        };
        var BuildModals = function () {
            $("#btntables").click(function () {
                gridModal.show({
                    modaltitle: applicationstrings[lang].tables,
                    listurl: "/Api/ApiGridDesigner/GetAllTables",
                    keyfield: "TABLE_NAME",
                    codefield: "TABLE_NAME",
                    textfield: "TABLE_NAME",
                    returninput: "#code",
                    sort: [{ field: "TABLE_NAME", dir: "desc" }],
                    columns: [
                        { type: "string", field: "TABLE_NAME", title: "Table Name", width: 100 },

                    ],
                    screen: "GRIDDESIGNER",
                    callback: function (data) {
                        FillUserInterface();
                    }
                });
            });

        };
        var FillUserInterface = function () {
            return $.when(getColumns()).done(function () {
                showUI();
                buildSelections();
                buildTable();
                buildTitleTable();
            });
        };
        this.LoadSelected = function () {
            if (selectedrecord) {
                return tms.Ajax({
                    url: "/Api/ApiGridDesigner/Get",
                    data: JSON.stringify(selectedrecord.GRD_ID),
                    fn: function (d) {
                        selectedrecord = d.data;
                        $("#code").val(selectedrecord.GRD_CODE);
                        FillUserInterface();
                    }
                });
            }
            else {
                self.ResetUI();
            }
        };
        var GridChange = function (e) {

            ItemSelect(e.sender.select());

        };
        var GridDataBound = function () {
            grdGridsElm.find("[data-id]").on("dblclick",
                function () {
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
                });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdGrids.GetRowDataItem(row);
            gridid = selectedrecord.GRD_ID;
            $(".page-header h6").html(selectedrecord.GRD_SCREENCODE + " - " + selectedrecord.GRD_CODE);
            scr.Configure();
            tms.Tab();
        };
        this.BuildUi = function () {
            buildLanguages();
            $("#add_rcf").click(function () {
                addRcf();
            });
            $("#rcf_list").change(function () {

                fillRcf();
            });
            $("#delete_rcf").click(function () {
                deleteRcf();
            });
            $("#update_rcf").click(function () {
                updateRcf();
            });
            $("#clear_rcf").click(function () {
                clearRcf();
            });
            self.List();
        };
        RegisterTabEvents();
    };


    function ready() {

        grds.ResetUI();
        grds.BuildUi();
    }

    $(document).ready(ready);
})