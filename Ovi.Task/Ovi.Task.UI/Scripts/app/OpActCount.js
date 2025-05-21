(function () {
    var grdOpActCounts = null;
    var grdOpActCountsElm = $("#grdOpActCounts");

    function gridDataBound(e) {
        grdOpActCountsElm.find("#search").off("click").on("click",
            function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdOpActCounts = new Grid({
            keyfield: "ACT_ID",
            columns: [
                { type: "date", field: "ACT_DATE", title: gridstrings.opactcount[lang].date, width: 150 },
                { type: "string", field: "ACT_TYPE", title: gridstrings.opactcount[lang].type, width: 150 },
                { type: "string", field: "ACT_CATEGORY", title: gridstrings.opactcount[lang].category, width: 150 },
                { type: "number", field: "ACT_CREATEDCNT", title: gridstrings.opactcount[lang].createdcnt, width: 150 },
                {
                    type: "number",
                    field: "ACT_COMPLETEDCNT",
                    title: gridstrings.opactcount[lang].completedcnt,
                    width: 150
                },
                { type: "number", field: "ACT_DELAYCNT", title: gridstrings.opactcount[lang].delayedcnt, width: 150 },
                {
                    type: "number",
                    field: "ACT_DELAYCMLCNT",
                    title: gridstrings.opactcount[lang].delayedcmlcnt,
                    width: 150
                }
            ],
            fields: {
                ACT_DATE: { type: "date" },
                ACT_CREATEDCNT: { type: "number" },
                ACT_COMPLETEDCNT: { type: "number" },
                ACT_DELAYCNT: { type: "number" },
                ACT_DELAYCMLCNT: { type: "number" }
            },
            datasource: "/Api/ApiTaskActivities/OpActCount",
            selector: "#grdOpActCounts",
            name: "grdOpActCounts",
            height: constants.defaultgridheight,
            primarycodefield: "ACT_ID",
            filter: null,
            sort: [
                { field: "ACT_DATE", dir: "desc" },
                { field: "ACT_TYPE", dir: "asc" },
                { field: "ACT_CATEGORY", dir: "asc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"taskcounts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function resetFilter() {
        $("#date_start").val("");
        $("#date_end").val("");
        $("#category").val("");
    }

    function runFilter() {
        var gridfilter = [];

        var datestart = $("#date_start").val().toDate();
        var dateend = $("#date_end").val().toDate();
        var category = $("#category").val();

        if (dateend)
            dateend = moment(dateend, constants.dateformat).add(1, "days");

        if (datestart && dateend)
            gridfilter.push({ field: "ACT_DATE", value: datestart, value2: dateend, operator: "between", logic: "and" });
        if (datestart && !dateend)
            gridfilter.push({ field: "ACT_DATE", value: datestart, operator: "gte", logic: "and" });
        if (!datestart && dateend)
            gridfilter.push({ field: "ACT_DATE", value: dateend, operator: "lte", logic: "and" });
        if (category)
            gridfilter.push({ field: "ACT_CATEGORY", value: category, operator: "contains", logic: "and" });

        grdOpActCounts.RunFilter(gridfilter);
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