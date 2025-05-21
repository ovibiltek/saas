(function () {
    var grdBookedHours = null;
    var grdBookedHoursElm = $("#grdBookedHours");

    function gridDataBound(e) {
        grdBookedHoursElm.find("#search").off("click").on("click",
            function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdBookedHours = new Grid({
            keyfield: "BOO_ID",
            columns: [
                { type: "string", field: "BOO_USER", title: gridstrings.bookedhoursview[lang].user, width: 150 },
                { type: "string", field: "BOO_USRDESC", title: gridstrings.bookedhoursview[lang].userdesc, width: 250 },
                { type: "string", field: "BOO_TRADE", title: gridstrings.bookedhoursview[lang].trade, width: 250 },
                { type: "string", field: "BOO_CATDESC", title: gridstrings.bookedhoursview[lang].catdesc, width: 250 },
                { type: "number", field: "BOO_TASK", title: gridstrings.bookedhoursview[lang].task, width: 150 },
                { type: "string", field: "BOO_TSKSHORTDESC", title: gridstrings.bookedhoursview[lang].taskshortdesc, width: 350 },
                { type: "string", field: "BOO_BRANCH", title: gridstrings.bookedhoursview[lang].branch, width: 250 },
                { type: "string", field: "BOO_BRANCHDESC", title: gridstrings.bookedhoursview[lang].branchdesc, width: 250 },
                { type: "string", field: "BOO_CUSTOMER", title: gridstrings.bookedhoursview[lang].customer, width: 250 },
                { type: "string", field: "BOO_CUSTOMERDESC", title: gridstrings.bookedhoursview[lang].customerdesc, width: 250 },
                { type: "string", field: "BOO_CREATEDBY", title: gridstrings.bookedhoursview[lang].createdby, width: 250 },
                { type: "string", field: "BOO_AUTO", title: gridstrings.bookedhoursview[lang].auto, width: 100 },
                { type: "date", field: "BOO_DATE", title: gridstrings.bookedhoursview[lang].date, width: 200 },
                { type: "time", field: "BOO_START", title: gridstrings.bookedhoursview[lang].start, width: 150, template: "#= BOO_START == null ? '' : moment().startOf('day').seconds(BOO_START).format(constants.timeformat) #" },
                { type: "time", field: "BOO_END", title: gridstrings.bookedhoursview[lang].end, width: 150, template: "#= BOO_END == null ? '' : moment().startOf('day').seconds(BOO_END).format(constants.timeformat) #" },
                { type: "string", field: "BOO_TIME", title: gridstrings.bookedhoursview[lang].time, width: 200 },
                { type: "number", field: "BOO_MINUTES", title: gridstrings.bookedhoursview[lang].minutes, width: 200 }
            ],
            fields: {
                BOO_DATE: { type: "date" },
                BOO_MINUTES: { type: "number" },
                BOO_START: { type: "time" },
                BOO_END: { type: "time" },
                BOO_TASK: { type: "number" }
            },
            datasource: "/Api/ApiBookedHours/ListView",
            selector: "#grdBookedHours",
            name: "grdBookedHours",
            height: constants.defaultgridheight,
            primarycodefield: "BOO_ID",
            filter: null,
            sort: [{ field: "BOO_ID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"bookedhours.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function resetFilter() {
        $("#date_start").val("");
        $("#date_end").val("");
        $("#user").val("");
    }

    function runFilter() {
        var gridfilter = [];

        var datestart = $("#date_start").val().toDate();
        var dateend = $("#date_end").val().toDate();
        var user = $("#user").val();

        if (dateend)
            dateend = moment(dateend, constants.dateformat).add(1, "days");

        if (datestart && dateend)
            gridfilter.push({ field: "BOO_DATE", value: datestart, value2: dateend, operator: "between", logic: "and" });
        if (datestart && !dateend)
            gridfilter.push({ field: "BOO_DATE", value: datestart, operator: "gte", logic: "and" });
        if (!datestart && dateend)
            gridfilter.push({ field: "BOO_DATE", value: dateend, operator: "lte", logic: "and" });
        if (user)
            gridfilter.push({ field: "BOO_USRDESC", value: user, operator: "contains", logic: "and" });

        grdBookedHours.RunFilter(gridfilter);
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