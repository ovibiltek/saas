(function () {
    var grdTimeKeepingLines = null;
    var grdTimeKeepingLinesElm = $("#grdTimeKeepingLines");

    function gridDataBound(e) {
        grdTimeKeepingLinesElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdTimeKeepingLines = new Grid({
            keyfield: ["TKD_TIMEKEEPING", "TKD_DATE", "TKD_USER"],
            columns: [
                { type: "number", field: "TKD_TIMEKEEPING", title: gridstrings.timekeepinglines[lang].timekeeping, width: 150 },
                { type: "string", field: "TKD_TIMEKEEPINGDESC", title: gridstrings.timekeepinglines[lang].timekeepingdesc, width: 250 },
                { type: "string", field: "TKD_USER", title: gridstrings.timekeepinglines[lang].user, width: 250 },
                { type: "string", field: "TKD_USERDESC", title: gridstrings.timekeepinglines[lang].userdesc, width: 350 },
                { type: "date", field: "TKD_DATE", title: gridstrings.timekeepinglines[lang].date, width: 250 },
                { type: "string", field: "TKD_SHIFT", title: gridstrings.timekeepinglines[lang].shift, width: 250 },
                { type: "string", field: "TKD_EXCEPTION", title: gridstrings.timekeepinglines[lang].exception, width: 350 },
                { type: "string", field: "TKD_MINSTART", title: gridstrings.timekeepinglines[lang].minstart, width: 150 },
                { type: "string", field: "TKD_MAXEND", title: gridstrings.timekeepinglines[lang].maxend, width: 150 },
                { type: "string", field: "TKD_DIFF", title: gridstrings.timekeepinglines[lang].diff, width: 150 },
                { type: "string", field: "TKD_SUM", title: gridstrings.timekeepinglines[lang].sum, width: 150 },
                { type: "string", field: "TKD_TIMEONROUTE", title: gridstrings.timekeepinglines[lang].timeonroute, width: 200 },
                { type: "string", field: "TKD_NORMAL", title: gridstrings.timekeepinglines[lang].normal, width: 150 },
                { type: "string", field: "TKD_OVERTIME", title: gridstrings.timekeepinglines[lang].overtime, width: 150 },
                { type: "string", field: "TKD_STATUS", title: gridstrings.timekeepinglines[lang].status, width: 200 },
                { type: "number", field: "TKD_APPROVALLINE", title: gridstrings.timekeepinglines[lang].approvalline, width: 200 },
                { type: "string", field: "TKD_APPROVER", title: gridstrings.timekeepinglines[lang].approver, width: 200 },
                { type: "string", field: "TKD_APPROVERDESC", title: gridstrings.timekeepinglines[lang].approverdesc, width: 200 }
            ],
            fields: {
                TKD_TIMEKEEPING: { type: "number" },
                TKD_APPROVALLINE: { type: "number" },
                TKD_DATE: { type: "date" }
            },
            datasource: "/Api/ApiTimekeepingLines/ListView",
            selector: "#grdTimeKeepingLines",
            name: "grdTimeKeepingLines",
            height: constants.defaultgridheight,
            filter: null,
            sort: [
                { field: "TKD_TIMEKEEPING", dir: "asc" },
                { field: "TKD_USER", dir: "asc" },
                { field: "TKD_DATE", dir: "asc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"timekeepinglines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            toolbarColumnMenu: true,
            databound: gridDataBound,
            change: gridChange
        });
    }

    function resetFilter() {
        $("#date_start").val("");
        $("#date_end").val("");
    }

    function runFilter() {
        var gridfilter = [];

        var datestart = $("#date_start").val().toDate();
        var dateend = $("#date_end").val().toDate();

        if (dateend)
            dateend = dateend.add(1, "days");

        if (datestart && dateend)
            gridfilter.push({ field: "TKD_DATE", value: datestart, value2: dateend, operator: "between", logic: "and" });

        if (datestart && !dateend)
            gridfilter.push({ field: "TKD_DATE", value: datestart, operator: "gte", logic: "and" });

        if (!datestart && dateend)
            gridfilter.push({ field: "TKD_DATE", value: dateend, operator: "lte", logic: "and" });

        grdTimeKeepingLines.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function ready() {
        list();

        $("#filter").click(function () { runFilter(); });
        $("#clearfilter").click(function () {
            resetFilter();
            runFilter();
        });

        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    $(document).ready(ready);
}());