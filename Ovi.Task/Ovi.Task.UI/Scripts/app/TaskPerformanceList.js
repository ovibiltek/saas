(function () {
    var grdTaskPerformance = null;
    var grdTaskPerformanceElm = $("#grdTaskPerformance");

    function gridDataBound(e) {
        grdTaskPerformanceElm.find("#search").off("click").on("click", function () {
            $.when(loadStatuses()).done(function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
        });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function loadStatuses() {
        var gridreq = {
            sort: [{ field: "STA_DESCF", dir: "asc" }],
            filter: {
                filters: [
                    { field: "STA_SHOWONSEARCH", value: "+", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiStatuses/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var statusesctrl = $("#statuses");
                statusesctrl.find("*").remove();
                var strOptions = "";
                strOptions += "<div class=\"checkbox checkbox-primary\"><input id=\"chkallstatuses\" class=\"styled\" type=\"checkbox\"><label><span> * </span></label></div>";

                for (var i = 0; i < d.data.length; i++) {
                    strOptions +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"styled\" type=\"checkbox\" value=\"" +
                        d.data[i].STA_DESCF +
                        "\"><label><span>" +
                    d.data[i].STA_DESCF +
                        "</span></label></div>";
                }
                statusesctrl.append(strOptions);
                statusesctrl.find("#chkallstatuses").on("click", function () {
                    var ischecked = $(this).is(":checked");
                    statusesctrl.find("input").prop("checked", ischecked);
                });
            }
        });
    }

    function list() {
        grdTaskPerformance = new Grid({
            keyfield: "TSK_ID",
            columns: [
                { type: "number", field: "TSK_ID", title: gridstrings.taskperformancelist[lang].task, width: 150 },
                { type: "string", field: "TSK_ORGANIZATION", title: gridstrings.taskperformancelist[lang].org, width: 250 },
                { type: "string", field: "TSK_DEPARTMENT", title: gridstrings.taskperformancelist[lang].department, width: 250 },
                { type: "string", field: "TSK_SHORTDESC", title: gridstrings.taskperformancelist[lang].desc, width: 350 },
                { type: "string", field: "TSK_CUSTOMER", title: gridstrings.taskperformancelist[lang].customer, width: 150 },
                { type: "string", field: "TSK_CUSPM", title: gridstrings.taskperformancelist[lang].customerpm, width: 350 },
                { type: "string", field: "TSK_BRNDESC", title: gridstrings.taskperformancelist[lang].branchdesc, width: 250 },
                { type: "string", field: "TSK_BRNREGION", title: gridstrings.taskperformancelist[lang].region, width: 250 },
                { type: "string", field: "TSK_STADESC", title: gridstrings.taskperformancelist[lang].statusdesc, width: 250 },
                { type: "string", field: "TSK_TYPE", title: gridstrings.taskperformancelist[lang].type, width: 250 },
                { type: "string", field: "TSK_CATEGORY", title: gridstrings.taskperformancelist[lang].category, width: 250 },
                { type: "string", field: "TSK_CATDESC", title: gridstrings.taskperformancelist[lang].categorydesc, width: 250 },
                { type: "string", field: "TSK_REQUESTEDBY", title: gridstrings.taskperformancelist[lang].requestedby, width: 250 },
                { type: "string", field: "TSK_CREATEDBY", title: gridstrings.taskperformancelist[lang].createdby, width: 250 },
                { type: "string", field: "TSK_USERGROUP", title: gridstrings.taskperformancelist[lang].createdbyusergroup, width: 250 },
                { type: "datetime", field: "TSK_REQUESTED", title: gridstrings.taskperformancelist[lang].requestdate, width: 250 },
                { type: "string", field: "TSK_REQUESTED_MONTH", title: gridstrings.taskperformancelist[lang].requestmonth, width: 250 },
                { type: "datetime", field: "TSK_DEADLINE", title: gridstrings.taskperformancelist[lang].deadline, width: 250 },
                { type: "datetime", field: "TSK_CREATED", title: gridstrings.taskperformancelist[lang].created, width: 250 },
                { type: "datetime", field: "TSK_PADATE", title: gridstrings.taskperformancelist[lang].planneddate, width: 250 },
                { type: "datetime", field: "TSK_TSASCHFROM", title: gridstrings.taskperformancelist[lang].plandate, width: 250 },
                { type: "datetime", field: "TSK_MINBOOSTART", title: gridstrings.taskperformancelist[lang].boostart, width: 250 },
                { type: "datetime", field: "TSK_MAXBOOEND", title: gridstrings.taskperformancelist[lang].booend, width: 250 },
                { type: "qty", field: "TSK_TOTALBOO", title: gridstrings.taskperformancelist[lang].boosum, width: 250 },
                { type: "number", field: "TSK_TOTALBOOPERSON", title: gridstrings.taskperformancelist[lang].boousercount, width: 250 },
                { type: "datetime", field: "TSK_COMPLETED", title: gridstrings.taskperformancelist[lang].completed, width: 250 },
                { type: "string", field: "TSK_COMPLETEDMONTH", title: gridstrings.taskperformancelist[lang].completedmonth, width: 250 },
                { type: "datetime", field: "TSK_CLOSED", title: gridstrings.taskperformancelist[lang].closed, width: 250 },
                { type: "datetime", field: "TSK_PSPCREATED", title: gridstrings.taskperformancelist[lang].pspcreated, width: 250 },
                { type: "qty", field: "TSK_TOTALHOLD", title: gridstrings.taskperformancelist[lang].holdduration, width: 250 },
                { type: "qty", field: "TSK_TOTALHOLDCUSTOMER", title: gridstrings.taskperformancelist[lang].holddurationcustomer, width: 250 },
                { type: "qty", field: "TSK_TOTALHOLDPRO", title: gridstrings.taskperformancelist[lang].holddurationpro, width: 250 },
                { type: "number", field: "TSK_PSPCODE", title: gridstrings.taskperformancelist[lang].psp, width: 250 },
                { type: "qty", field: "TSK_PLANNINGTIME", title: gridstrings.taskperformancelist[lang].planningtime, width: 250 },
                { type: "qty", field: "TSK_ACTIONTIME", title: gridstrings.taskperformancelist[lang].actiontime, width: 250 },
                { type: "qty", field: "TSK_COMPLETEDTIME", title: gridstrings.taskperformancelist[lang].resolutiontime, width: 250 },
                { type: "qty", field: "TSK_CLOSINGTIME", title: gridstrings.taskperformancelist[lang].closingtime, width: 250 },
                { type: "qty", field: "TSK_PSPTIME", title: gridstrings.taskperformancelist[lang].psptime, width: 250 }
            ],
            fields: {
                TSK_ID: { type: "number" },
                TSK_REQUESTED: { type: "date" },
                TSK_DEADLINE: { type: "date" },
                TSK_CREATED: { type: "date" },
                TSK_PADATE: { type: "date" },
                TSK_TSASCHFROM: { type: "date" },
                TSK_MINBOOSTART: { type: "date" },
                TSK_MAXBOOEND: { type: "date" },
                TSK_TOTALBOO: { type: "number" },
                TSK_TOTALBOOPERSON: { type: "number" },
                TSK_COMPLETED: { type: "date" },
                TSK_PSPCREATED: { type: "date" },
                TSK_TOTALHOLD: { type: "number" },
                TSK_PSPCODE: { type: "number" },
                TSK_PLANNINGTIME: { type: "number" },
                TSK_ACTIONTIME: { type: "number" },
                TSK_COMPLETEDTIME: { type: "number" },
                TSK_CLOSINGTIME: { type: "number" },
                TSK_PSPTIME: { type: "number" },
                TSK_CLOSED: { type: "date" }
            },
            datasource: "/Api/ApiTask/ListPerformance",
            selector: "#grdTaskPerformance",
            name: "grdTaskPerformance",
            height: constants.defaultgridheight,
            primarycodefield: "TSK_ID",
            filter: null,
            sort: [{ field: "TSK_ID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"taskperformancelist.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
        $("#date_created_start").val("");
        $("#date_created_end").val("");
        $("#date_completed_start").val("");
        $("#date_completed_end").val("");
        $("#date_closed_start").val("");
        $("#date_closed_end").val("");

        $("#statuses input").each(function (e) {
            $(this).prop("checked", false);
        });
    }

    function runFilter() {
        var gridfilter = [];

        var date_start = $("#date_start").val().toDate();
        var date_end = $("#date_end").val().toDate();
        var date_created_start = $("#date_created_start").val().toDate();
        var date_created_end = $("#date_created_end").val().toDate();
        var date_completed_start = $("#date_completed_start").val().toDate();
        var date_completed_end = $("#date_completed_end").val().toDate();
        var date_closed_start = $("#date_closed_start").val().toDate();
        var date_closed_end = $("#date_closed_end").val().toDate();

        if (date_created_end)
            date_created_end = date_created_end.add(1, "days");
        if (date_end)
            date_end = date_end.add(1, "days");
        if (date_completed_end)
            date_completed_end = date_completed_end.add(1, "days");
        if (date_closed_end)
            date_closed_end = date_closed_end.add(1, "days");

        var i;
        var item;

        var checkedstatuses = $("#statuses input:checked");
        var statuses = [];
        for (i = 0; i < checkedstatuses.length; i++) {
            item = checkedstatuses[i];
            statuses.push($(item).val());
        }

        if (statuses.length > 0)
            gridfilter.push({ field: "TSK_STADESC", value: statuses, operator: "in", logic: "and" });
        if (date_created_start && date_created_end)
            gridfilter.push({ field: "TSK_CREATED", value: date_created_start, value2: date_created_end, operator: "between", logic: "and" });
        if (date_start && date_end)
            gridfilter.push({ field: "TSK_REQUESTED", value: date_start, value2: date_end, operator: "between", logic: "and" });
        if (date_completed_start && date_completed_end)
            gridfilter.push({ field: "TSK_COMPLETED", value: date_completed_start, value2: date_completed_end, operator: "between", logic: "and" });
        if (date_closed_start && date_closed_end)
            gridfilter.push({ field: "TSK_CLOSED", value: date_closed_start, value2: date_closed_end, operator: "between", logic: "and" });
        if (date_created_start && !date_created_end)
            gridfilter.push({ field: "TSK_CREATED", value: date_created_start, operator: "gte", logic: "and" });
        if (date_start && !date_end)
            gridfilter.push({ field: "TSK_REQUESTED", value: date_start, operator: "gte", logic: "and" });
        if (date_completed_start && !date_completed_end)
            gridfilter.push({ field: "TSK_COMPLETED", value: date_completed_start, operator: "gte", logic: "and" });
        if (date_closed_start && !date_closed_end)
            gridfilter.push({ field: "TSK_CLOSED", value: date_closed_start, operator: "gte", logic: "and" });
        if (!date_created_start && date_created_end)
            gridfilter.push({ field: "TSK_CREATED", value: date_created_end, operator: "lte", logic: "and" });
        if (!date_start && date_end)
            gridfilter.push({ field: "TSK_REQUESTED", value: date_end, operator: "lte", logic: "and" });
        if (!date_completed_start && date_completed_end)
            gridfilter.push({ field: "TSK_COMPLETED", value: date_completed_end, operator: "lte", logic: "and" });
        if (!date_closed_start && date_closed_end)
            gridfilter.push({ field: "TSK_CLOSED", value: date_closed_end, operator: "lte", logic: "and" });

        return gridfilter;
    }

    function RunSidebarFilter() {
        var gridfilter = runFilter();
        grdTaskPerformance.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function ready() {
        list();

        $("#filter").click(function () {
            RunSidebarFilter();
        });
        $("#clearfilter").click(function () {
            resetFilter();
            RunSidebarFilter();
        });

        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    $(document).ready(ready);
}());