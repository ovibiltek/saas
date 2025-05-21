(function () {
    var grdTaskActivities = null;
    var grdTaskActivitiesElm = $("#grdTaskActivities");
    var commentsHelper;
    var documentsHelper;
    var selecteduser = null;
    var selectedactivity = null;
    var selectedmonthdata = null;
    var revisionNeeded = false;
    var selecteddate = null;
    var docheight = shared.documentHeight();
    var selectedplnview = "M";
    var selectedplnunit = "T";
    var dailydata = null;

    var pop = new function () {
        this.Placement = function (tip, element) {
            var offset = $(element).offset();
            var height = $(document).outerHeight();
            var width = $(document).outerWidth();
            var vert = 0.5 * height - offset.top;
            var vertPlacement = vert > 0 ? "bottom" : "top";
            var horiz = 0.5 * width - offset.left;
            var horizPlacement = horiz > 0 ? "right" : "left";
            var placement = Math.abs(horiz) > Math.abs(vert) ? horizPlacement : vertPlacement;
            return placement;
        };
        this.Content = function (d, usr, wkd, typ) {
            var strPopContent;
            var tasks;
            var i;

            switch (typ) {
                case "stask":
                    strPopContent = "<div class=\"row po-header\">";
                    strPopContent += "<div class=\"col-md-1\"><strong>" +
                        applicationstrings[lang].taskno +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-1\"><strong>" +
                        applicationstrings[lang].activity +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].description +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].status +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].customer +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].branch +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-1\"><strong>" +
                        applicationstrings[lang].start +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-1\"><strong>" + applicationstrings[lang].end + "</strong></div>";
                    strPopContent += "</div>";
                    strPopContent += "<div class=\"row po-line\">";
                    strPopContent += "<div class=\"col-md-1\"><a href=\"/Task/Record/" +
                        d.TCA_TASK +
                        "\">" +
                        d.TCA_TASK +
                        "</a></div>";
                    strPopContent += "<div class=\"col-md-1\">" + d.TCA_ACTLINE + "</div>";
                    strPopContent += "<div class=\"col-md-2\">" + d.TCA_ACTDESC + "</div>";
                    strPopContent += "<div class=\"col-md-2\">" +
                        applicationstrings[lang].activitystatuses[d.TCA_ACTSTATUS] +
                        "</div>";
                    strPopContent += "<div class=\"col-md-2\">" + d.TCA_CUSTOMER + "</div>";
                    strPopContent += "<div class=\"col-md-2\">" + d.TCA_BRANCH + "</div>";
                    strPopContent += "<div class=\"col-md-1\">" +
                        moment(d.TCA_FROM).format(constants.timeformat) +
                        "</div>";
                    strPopContent += "<div class=\"col-md-1\">" + moment(d.TCA_TO).format(constants.timeformat) + "</div>";
                    strPopContent += "</div>";
                    break;
                case "sfollowed":
                    strPopContent = "<div class=\"row po-header\">";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].taskno +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-8\"><strong>" +
                        applicationstrings[lang].description +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].status +
                        "</strong></div>";
                    strPopContent += "</div>";
                    strPopContent += "<div class=\"row po-line\">";
                    strPopContent += "<div class=\"col-md-2\"><a href=\"/Task/Record/" +
                        d.TCA_TASK +
                        "\">" +
                        d.TCA_TASK +
                        "</a></div>";
                    strPopContent += "<div class=\"col-md-8\">" + d.TCA_ACTDESC + "</div>";
                    strPopContent += "<div class=\"col-md-2\">" +
                        applicationstrings[lang].activitystatuses[d.TCA_ACTSTATUS] +
                        "</div>";
                    strPopContent += "</div>";
                    break;
            }

            return strPopContent;
        };
        this.Title = function (t1, t2) {
            return "<div class=\"row\"><div class=\"col-md-12\"><div class=\"pull-left\">" +
                t1 +
                "</div>" +
                "<div class=\"pull-right\">" +
                t2 +
                "</div></div></div>";
        };
    };

    function runFilter() {
        var gridfilter = [];

        var inmyregion = $("#inmyregion").prop("checked");
        var listplanned = $("#listplanned").prop("checked");
        var deadlineval = $("#deadlineval").val();

        var datecreatedstart = $("#datecreated_start").val().toDate();
        var datecreatedend = $("#datecreated_end").val().toDate();
        var apdstart = $("#apd_start").val().toDate();
        var apdend = $("#apd_end").val().toDate();

        if (datecreatedend)
            datecreatedend = datecreatedend.add(1, "days");
        if (apdend)
            apdend = apdend.add(1, "days");

        if (inmyregion)
            gridfilter.push({ field:'TASK.INMYREGION.TSATASK', value: user, operator: "func", logic: "and" });

        if (!listplanned)
            gridfilter.push({ field: "TSA_PLANNED", value: "+", operator: "neq", logic: "and" });

        if (datecreatedstart && datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });
        if (datecreatedstart && !datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedstart, operator: "gte", logic: "and" });
        if (!datecreatedstart && datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedend, operator: "lte", logic: "and" });

        if (apdstart && apdend)
            gridfilter.push({ field: "TSA_SCHFROM", value: apdstart, value2: apdend, operator: "between", logic: "and" });
        if (apdstart && !apdend)
            gridfilter.push({ field: "TSA_SCHFROM", value: apdstart, operator: "gte", logic: "and" });
        if (!apdstart && apdend)
            gridfilter.push({ field: "TSA_SCHFROM", value: apdend, operator: "lte", logic: "and" });

        if (deadlineval) {
            gridfilter.push({ field: "TASK.DEADLINE.TSATASK", value: parseFloat(deadlineval), operator: "func", logic: "and" });
        }

        grdTaskActivities.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function resetFilter() {
        $("#datecreated_start").val("");
        $("#datecreated_end").val("");
        $("#apd_start").val("");
        $("#apd_end").val("");
        $("#deadlineval").val("");
        $("#inmyregion").prop("checked", false);
        $("#listplanned").prop("checked", false);
    }

    function gridDataBound(e) {
        grdTaskActivitiesElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
        grdTaskActivitiesElm.find(".btn-comments").unbind("click").click(function () {
            var act = grdTaskActivities.GetRowDataItem($(this).closest("[data-id]"));
            commentsHelper.showCommentsModal({
                subject: "TASK",
                source: act.TSA_TASK
            });
        });
        grdTaskActivitiesElm.find(".btn-docs").unbind("click").click(function () {
            var act = grdTaskActivities.GetRowDataItem($(this).closest("[data-id]"));
            documentsHelper.showDocumentsModal({
                subject: "TASK",
                source: act.TSA_TASK
            });
        });
        grdTaskActivitiesElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function itemSelect(row) {
        selectedactivity = grdTaskActivities.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $("#advancedplanning h6").html(selectedactivity.TSA_TASK + " - " + selectedactivity.TSA_DESC);
    }

    function buildMonthlyHolidays(params) {
        return tms.Ajax({
            url: "/Api/ApiHolidays/GetMonthlyHolidays",
            data: JSON.stringify(params),
            fn: function (d) {
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    var day = moment(di.HOL_DATE).format(constants.dateformat2);
                    $("#cal td.fc-day[data-date=\"" + day + "\"]")
                        .html(di.HOL_DESC)
                        .css({
                            "background-color": "#D8FDE1",
                            "text-align": "center",
                            "vertical-align": "bottom",
                            "padding-bottom": "8px"
                        }).addClass("holiday");
                };
            }
        });
    };

    function getMonthlyItems(params) {
        return tms.Ajax({
            url: "/Api/ApiCalendar/GetMonthlyItems",
            data: JSON.stringify(params),
            fn: function (d) {
                var sctrl = $("#cal");
                sctrl.fullCalendar("removeEvents");
                var events = [];
                selectedmonthdata = d.data;
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    events.push({
                        title: di.TCA_ACTDESC,
                        start: di.TCA_FROM,
                        end: di.TCA_TO,
                        d: di,
                        o: di.TCA_TYPE
                    });
                }
                sctrl.fullCalendar("addEventSource", events);
                $("#cal div.fc-toolbar .fc-center")
                    .html("<div class=\"row cal-content\"><div class=\"col-md-10\"><strong>" + selecteduser.Code +
                    "</strong></div><div class=\"col-md-2\"><div class=\"upcnt\"></div></div>");
            }
        });
    }

    function buildMonthlyPlanCalendar() {
        var sctrl = $("#cal");
        var currentdate = sctrl.fullCalendar("getDate");
        var syear = moment(currentdate, constants.dateformat).get("year");
        var smonth = moment(currentdate, constants.dateformat).month() + 1;
        var params = { Year: syear, Month: smonth, User: selecteduser ? selecteduser.Code : null };

        return $.when(buildMonthlyHolidays(params)).done(function () {
            if (!selecteduser)
                return $.Deferred().reject();
            return getMonthlyItems(params);
        });
    }

    function list() {
        var gridfilter = [];
        if (grdTaskActivities) {
            grdTaskActivities.ClearSelection();
            grdTaskActivities.RunFilter(gridfilter);
        } else {
            gridfilter.push({ field: "TSA_PLANNED", value: "+", operator: "neq", logic: "and" });
            grdTaskActivities = new Grid({
                keyfield: "TSA_ID",
                columns: [
                    {
                        type: "na",
                        field: "ACTIONS",
                        title: gridstrings.tasklist[lang].actions,
                        template: "<div style=\"text-align:center;\">" +
                        "<button type=\"button\" title=\"#= applicationstrings[lang].comments #\" class=\"btn btn-default btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSK_CMNTCOUNT #</span></button> " +
                        "<button type=\"button\" title=\"#= applicationstrings[lang].documents #\" class=\"btn btn-default btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSK_DOCCOUNT # </span></button></div>",
                        filterable: false,
                        sortable: false,
                        width: 125
                    },
                    { type: "number", field: "TSA_TASK", title: gridstrings.tasklist[lang].taskno, width: 150 },
                    { type: "string", field: "TSK_SHORTDESC", title: gridstrings.tasklist[lang].description, width: 450 },
                    { type: "string", field: "TSK_ORGANIZATION", title: gridstrings.tasklist[lang].organization, width: 250 },
                    { type: "string", field: "TSK_STATUS", title: gridstrings.tasklist[lang].status, width: 250 },
                    { type: "string", field: "TSK_STATUSDESC", title: gridstrings.tasklist[lang].statusdesc, width: 250 },
                    { type: "string", field: "CUS_CODE", title: gridstrings.tasklist[lang].customer, width: 150 },
                    { type: "string", field: "CUS_DESC", title: gridstrings.tasklist[lang].customerdesc, width: 350 },
                    { type: "string", field: "BRN_CODE", title: gridstrings.tasklist[lang].branch, width: 200 },
                    { type: "string", field: "BRN_DESC", title: gridstrings.tasklist[lang].branchdesc, width: 350 },
                    { type: "string", field: "TSK_TYPE", title: gridstrings.tasklist[lang].type, width: 200 },
                    { type: "string", field: "TSK_TYPEDESC", title: gridstrings.tasklist[lang].typedesc, width: 250 },
                    { type: "string", field: "TSK_CATEGORY", title: gridstrings.tasklist[lang].category, width: 200 },
                    { type: "string", field: "TSK_CATEGORYDESC", title: gridstrings.tasklist[lang].categorydesc, width: 250 },
                    { type: "string", field: "TSK_PROJECT", title: gridstrings.tasklist[lang].project, width: 250 },
                    { type: "string", field: "PRJ_DESC", title: gridstrings.tasklist[lang].projectdesc, width: 350 },
                    { type: "string", field: "TSK_DEPARTMENT", title: gridstrings.tasklist[lang].department, width: 350 },
                    { type: "datetime", field: "TSK_DEADLINE", title: gridstrings.tasklist[lang].deadline, width: 250 },
                    { type: "number", field: "TSA_LINE", title: gridstrings.taskactivities[lang].line, width: 150 },
                    { type: "string", field: "TSA_DESC", title: gridstrings.taskactivities[lang].description, width: 450 },
                    { type: "string", field: "TSK_PRIORITY", title: gridstrings.tasklist[lang].priority, width: 150 },
                    { type: "datetime", field: "TSA_SCHFROM", title: gridstrings.taskactivities[lang].schfrom, width: 250 },
                    { type: "datetime", field: "TSA_SCHTO", title: gridstrings.taskactivities[lang].schto, width: 250 },
                    { type: "string", field: "TSA_TRADE", title: gridstrings.taskactivities[lang].trade, width: 150 },
                    { type: "string", field: "TSA_ASSIGNEDTO", title: gridstrings.taskactivities[lang].assignedto, width: 150 },
                    { type: "date", field: "TSK_CREATED", title: gridstrings.tasklist[lang].created, width: 250 },
                    { type: "string", field: "TSA_CREATEDBY", title: gridstrings.tasklist[lang].createdby, width: 150 }
                ],
                fields: {
                    TSA_TASK: { type: "number" },
                    TSK_CREATED: { type: "date" },
                    TSA_SCHFROM: { type: "date" },
                    TSA_SCHTO: { type: "date" },
                    TSK_DEADLINE: { type: "date" }
                },
                datasource: "/Api/ApiTaskActivities/ListAdvPlanningActivities",
                selector: "#grdTaskActivities",
                name: "grdTaskActivities",
                height: 250,
                primarycodefield: "TSA_ID",
                filter: gridfilter,
                hasfiltermenu: true,
                sort: [{ field: "TSA_ID", dir: "desc" }],
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"activities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                    ]
                },
                databound: gridDataBound,
                change: gridChange
            });
        }
    }

    function listTrades() {
        $("#list-group-head").find("*").remove();
        $(".list-group").list({
            listurl: "/Api/ApiTrades/List",
            fields: { keyfield: "TRD_CODE", descfield: "TRD_DESC" },
            height: docheight - 150,
            sort: [{ field: "TRD_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                selecteduser = {
                    Code: $("a.list-group-item.active").data("id"),
                    Type: "T"
                };
                buildMonthlyPlanCalendar();
            }
        });
    }

    function listUsers() {
        var list_group = $(".list-group");
        var list_group_head = $("#list-group-head");
        if (list_group_head.find("button.btn-groupusers").length == 0)
            list_group_head.append("<button class=\"btn btn-primary btn-xs btn-groupusers\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> " + applicationstrings[lang].groupusers + "</button>");
        list_group.list({
            listurl: "/Api/ApiUsers/List",
            fields: { keyfield: "USR_CODE", descfield: "USR_DESC" },
            height: docheight - 150,
            sort: [{ field: "USR_CODE", dir: "asc" }],
            type: "A",
            srch: {
                filters: [
                    { field: "USR_CODE", operator: "contains", logic: "or" },
                    { field: "USR_DESC", operator: "contains", logic: "or" }
                ],
                logic: "and"
            },
            predefinedfilters: [{
                filters: [
                    { field: "USR_CODE", value: "*", operator: "neq" },
                    { field: "USR_TYPE", value: ["CUSTOMER"], operator: "nin" }], logic: "and"
            }],
            itemclick: function (event, item) {
                selecteduser = {
                    Code: $("a.list-group-item.active").data("id"),
                    Type: "U"
                };
                buildMonthlyPlanCalendar();
            }
        });
    }

    function monthlyTasksCalendarEventRenderer(event, element) {
        switch (event.d.TCA_TYPE) {
            case "FOLLOWED":
                element.css({
                    "background": "#000",
                    "border-color": "#FFF",
                    "padding": "0.2em"
                });
                element.data("store", pop.Content(event.d, null, null, "sfollowed"));
                element.clickover({
                    html: true,
                    content: function () { return $(this).data("store") },
                    title: pop.Title(event.d.TCA_RELATEDUSERDESC, applicationstrings[lang].followed),
                    placement: pop.Placement,
                    global_close: 1,
                    container: "body"
                });
                break;
            case "ASSIGNED":
            case "T":
                var poptitle = "";
                element.css({ "padding": "0.2em", "background": "#74AD5A" });
                poptitle = pop.Title(event.d.TCA_RELATEDUSERDESC, applicationstrings[lang].single);

                if (event.d.TCA_COMPFL === "+") {
                    element.css({ "padding": "0.2em", "background": "#E5E5E5", "color": "#7D7C7E" });
                }

                element.data("store", pop.Content(event.d, null, null, "stask"));
                element.clickover({
                    html: true,
                    content: function () { return $(this).data("store") },
                    title: poptitle,
                    placement: pop.Placement,
                    global_close: 1,
                    container: "body"
                });
                break;
        }
    }

    function buildActivityTable(dayevents) {
        var dslice = 0;
        var slices = [];
        var dailyactivities = $("#dailyactivities");
        dailyactivities.find("*").remove();
        var str = "";
        str += "<div class=\"row header\">";
        str += "<div class=\"col-md-2\">";
        str += "</div>";
        str += "<div class=\"col-md-5\" style=\"padding-right:0px;\">";
        str += "<div class=\"row\">";
        for (var j = 0; j < 12; j++) {
            str += "<div class=\"col-md-1 hour head\">";
            str += "<span class=\"adp-hour\">" + ("00" + j).slice(-2) + "</span>";
            str += "</div>";
        }
        str += "</div>";
        str += "</div>";
        str += "<div class=\"col-md-5\">";
        str += "<div class=\"row\">";
        for (var j = 12; j < 24; j++) {
            str += "<div class=\"col-md-1 hour head\">";
            str += "<span class=\"adp-hour\">" + j + "</span>";
            str += "</div>";
        }
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";

        for (var i = 0; i < dayevents.length; i++) {
            var daye = dayevents[i];
            var task = (selectedplnview === "M" ? daye.d.TCA_TASK : daye.TSA_TASK);
            var actline = (selectedplnview === "M" ? daye.d.TCA_ACTLINE : daye.TSA_LINE);
            var actdesc = (selectedplnview === "M" ? daye.d.TCA_ACTDESC : daye.TSA_DESC);
            var from = (selectedplnview === "M" ? daye.d.TCA_FROM : daye.TSA_SCHFROM);
            var to = (selectedplnview === "M" ? daye.d.TCA_TO : daye.TSA_SCHTO);

            var start = moment.duration(moment(from).diff(moment(from).startOf("day"))).asMinutes();
            var end = moment.duration(moment(to).diff(moment(to).startOf("day"))).asMinutes();
            str += "<div class=\"row item\">";
            str += "<div class=\"col-md-2\">";
            str += task + " - " + actline + " " + (actdesc.length > 15 ? actdesc.substring(0, 15) + "..." : actdesc);
            str += "</div>";
            str += "<div class=\"col-md-5\" style=\"padding-right:0px;\">";
            str += "<div class=\"row\">";
            for (var j = 0; j < 12; j++) {
                str += "<div data-hour=\"" + j + "\" class=\"col-md-1 hour\">";
                dslice = (j * 60) + 15;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 30;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 45;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + ((j * 60) + 45) + " class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 60;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                str += "</div>";
            }
            str += "</div>";
            str += "</div>";
            str += "<div class=\"col-md-5\">";
            str += "<div class=\"row\">";
            for (var j = 12; j < 24; j++) {
                str += "<div data-hour=\"" + j + "\" class=\"col-md-1 hour\">";
                dslice = (j * 60) + 15;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 30;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 45;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 60;
                if (dslice > start && dslice <= end)
                    slices.push(dslice);
                str += "<div " + (dslice > start && dslice <= end ? "style=\"background:#cf192d;\"" : "") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
                str += "</div>";
                str += "</div>";
            }
            str += "</div>";
            str += "</div>";
            str += "</div>";
            str += "</div>";
            str += "</div>";
        }

        str += "<div class=\"row footer\">";
        str += "<div class=\"col-md-2\">";
        str += "</div>";
        str += "<div class=\"col-md-5\" style=\"padding-right:0px;\">";
        str += "<div class=\"row\">";
        for (var j = 0; j < 12; j++) {
            str += "<div class=\"col-md-1 hour\">";
            dslice = (j * 60) + 15;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
            str += "</div>";
            dslice = (j * 60) + 30;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
            str += "</div>";
            dslice = (j * 60) + 45;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + ((j * 60) + 45) + " class=\"quarter\">&nbsp;";
            str += "</div>";
            dslice = (j * 60) + 60;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
            str += "</div>";
            str += "</div>";
        }
        str += "</div>";
        str += "</div>";
        str += "<div class=\"col-md-5\">";
        str += "<div class=\"row\">";
        for (var j = 12; j < 24; j++) {
            str += "<div class=\"col-md-1 hour\">";
            dslice = (j * 60) + 15;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
            str += "</div>";
            dslice = (j * 60) + 30;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
            str += "</div>";
            dslice = (j * 60) + 45;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + ((j * 60) + 45) + " class=\"quarter\">&nbsp;";
            str += "</div>";
            dslice = (j * 60) + 60;
            str += "<div " + ($.inArray(dslice, slices) !== -1 ? "style=\"background:#cf192d;\"" : "style=\"background:#f5fda1\"") + " data-slice=" + dslice + " class=\"quarter\">&nbsp;";
            str += "</div>";
            str += "</div>";
        }
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";

        dailyactivities.append(str);
    }

    function buildCalendar() {
        $("#cal").fullCalendar({
            header: { left: "title", center: "", right: "prev,next" },
            firstDay: 1,
            eventOrder: "o",
            fixedWeekCount: false,
            displayEventTime: true,
            height: shared.documentHeight() - 100,
            views: { month: { eventLimit: 3 } },
            defaultView: "month",
            timeFormat: constants.timeformat,
            eventRender: monthlyTasksCalendarEventRenderer,
            eventAfterRender: function (event, $el, view) {
                $el.find(".fc-content").marquee({
                    delayBeforeStart: 5000,
                    pauseOnCycle: true,
                    pauseOnHover: true,
                    startVisible: true
                });
                var formattedTime = moment(event.start).format(constants.timeformat) + " - " + moment(event.end || event.start).format(constants.timeformat);
                if ($el.find(".fc-title").length === 0) {
                    $el.find(".fc-time").text(formattedTime + " - " + event.title);
                }
                else {
                    $el.find(".fc-time").text(formattedTime);
                }
            },
            dayClick: function (date, jsEvent, view) {
                if (selectedactivity) {
                    $("#cal td.fc-day:not(.holiday)").css("background-color", "");
                    if ($(this).is(":not(.holiday)"))
                        $(this).css("background-color", "#edf3ff");
                    $("#divreason").addClass("hidden");
                    $("#reason").val("").removeClass("required").removeProp("required");
                    $("#newplan h6").html("<strong>" + selecteduser.Code + " / " + selectedactivity.TSA_LINE + " - " + selectedactivity.TSA_DESC + "</strong>");
                    $("#dailyplan h6").html("<strong>" + date.format(constants.dateformat) + "</strong>");
                    $("#from").val(selectedactivity.TSA_SCHFROM ? moment(selectedactivity.TSA_SCHFROM).format(constants.longdateformat) : date.format(constants.dateformat));
                    $("#to").val(selectedactivity.TSA_SCHTO ? moment(selectedactivity.TSA_SCHTO).format(constants.longdateformat) : date.format(constants.dateformat));
                    var events = $("#cal").fullCalendar("clientEvents");
                    var dayevents = $.grep(events, function (e) { return (e.start.format(constants.sqldateformat) == date.format(constants.sqldateformat)); });
                    buildActivityTable(dayevents);
                    selecteddate = date;
                    $("#modalplan").modal("show");
                } else {
                    msgs.error(applicationstrings[lang].selectanactivity);
                }
            }
        });

        $("#cal .fc-prev-button,#cal .fc-next-button").click(buildMonthlyPlanCalendar);
        buildMonthlyPlanCalendar();
    }

    function refreshUI() {
        if (selectedplnview === "M") {
            var sctrl = $("#cal");
            var currentdate = sctrl.fullCalendar("getDate");
            var syear = moment(currentdate, constants.dateformat).get("year");
            var smonth = moment(currentdate, constants.dateformat).month() + 1;
            var params = { Year: syear, Month: smonth, User: selecteduser ? selecteduser.Code : null };

            $.when(getMonthlyItems(params)).done(function () {
                if (selecteddate) {
                    var events = $("#cal").fullCalendar("clientEvents");
                    var dayevents = $.grep(events, function (e) { return (e.start.format(constants.sqldateformat) == selecteddate.format(constants.sqldateformat)); });
                    buildActivityTable(dayevents);
                }
                list();
            });
        }
        else if (selectedplnview === "D") {
            $.when(buildDailyPlan()).done(function (d) {
                dailydata = d.data;
                var dayevents = $.grep(dailydata, function (e) { return e.TSA_ASSIGNED == selecteduser.Code; });
                buildActivityTable(dayevents);
                list();
            });
        }
    }

    function saveActivity() {
        var schfrom = $("#from").val() ? moment.utc($("#from").val(), constants.longdateformat) : null;
        var schto = $("#to").val() ? moment.utc($("#to").val(), constants.longdateformat) : null;

        if (schfrom && schto && schto.diff(schfrom, "minutes") < 0) {
            msgs.error(applicationstrings[lang].dateerr1);
            return;
        }

        var o = {
            TaskActivity: {
                TSA_ID: (selectedactivity != null ? selectedactivity.TSA_ID : 0),
                TSA_TRADE: (selecteduser && selecteduser.Type === "T" ? selecteduser.Code : "*"),
                TSA_ASSIGNEDTO: (selecteduser && selecteduser.Type === "U" ? selecteduser.Code : null),
                TSA_SCHFROM: schfrom,
                TSA_SCHTO: schto,
                TSA_UPDATED: selectedactivity != null ? tms.Now() : null,
                TSA_UPDATEDBY: selectedactivity != null ? user : null,
                TSA_RECORDVERSION: selectedactivity != null ? selectedactivity.TSA_RECORDVERSION : 0
            },
            Reason: $("#reason").val()
        };

        return tms.Ajax({
            url: "/Api/ApiTaskActivities/SavePlan",
            data: JSON.stringify(o),
            fn: function (d) {
                msgs.success(d.data);
                selectedactivity = d.activity;
                refreshUI();
            }
        });
    }

    function checkRevision() {
        if (selectedactivity) {
            var hc = false;
            var schfrom = $("#from");
            var schto = $("#to");
            var nv = null;
            var ov = null;

            nv = schfrom.val();
            ov = selectedactivity.TSA_SCHFROM
                ? moment(selectedactivity.TSA_SCHFROM).format(constants.longdateformat)
                : null;
            hc = (ov && nv !== ov);
            if (hc) return true;

            nv = schto.val();
            ov = selectedactivity.TSA_SCHTO
                ? moment(selectedactivity.TSA_SCHTO).format(constants.longdateformat)
                : null;
            hc = (ov && nv !== ov);
            if (hc) return true;
        }

        return false;
    };

    function buildDailyPlan() {
        return $.when(getDailyPlan()).done(function (d) {
            $("div[data-slice]").css("background", "").removeClass("hasplan");
            dailydata = d.data;
            for (var i = 0; i < d.data.length; i++) {
                var di = d.data[i];
                var assigned = di.TSA_ASSIGNED;
                var rowassigned = $("div[data-assigned=\"" + assigned + "\"]");
                var slices = rowassigned.find("div[data-slice]");
                var start = moment.duration(moment(di.TSA_SCHFROM).diff(moment(di.TSA_SCHFROM).startOf("day"))).asMinutes();
                var end = moment.duration(moment(di.TSA_SCHTO).diff(moment(di.TSA_SCHTO).startOf("day"))).asMinutes();
                for (var j = 0; j < slices.length; j++) {
                    var dslice = parseInt($(slices[j]).data("slice"));
                    if (dslice > start && dslice <= end) {
                        var s = $(slices[j]);
                        s.attr("rowid", di.TSA_ROWID);
                        s.css("background", "#cf192d").addClass("hasplan");
                        tooltip.show(s, di.TSA_TASK + " / " + di.TSA_LINE + " - " + di.TSA_DESC + " / " + moment(di.TSA_SCHFROM).format(constants.timeformat) + " - " + moment(di.TSA_SCHTO).format(constants.timeformat));
                    }
                }
                $("#dailycalendar").find("div.row[data-assigned]").has("div.hasplan").detach().prependTo("#dailycalendar div.body");
            }
        });
    }

    function getDailyPlan() {
        return tms.Ajax({
            url: "Api/ApiCalendar/GetDailyPlan",
            data: JSON.stringify({
                Date: moment.utc($("#date").val(), constants.dateformat),
                Type: selectedplnunit
            })
        });
    }

    function buildDailyView(d) {
        var dslice = 0;
        var slices = [];

        var dailycalendar = $("#dailycalendar");
        dailycalendar.find("*").remove();
        var str = "";
        str += "<div style=\"overflow-y:scroll;\" class=\"row header\">";
        str += "<div class=\"col-md-3\">";
        if (selectedplnunit === "U")
            str += "<button class=\"btn btn-primary btn-xs\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> " + applicationstrings[lang].groupusers + "</button>";
        str += "</div>";
        str += "<div class=\"col-md-9\">";
        str += "<div class=\"row\">";
        str += "<div class=\"col-md-6\" style=\"padding-right:0px;\">";
        str += "<div class=\"row\">";
        for (var j = 0; j < 12; j++) {
            str += "<div class=\"col-md-1 hour head\">";
            str += "<span class=\"adp-hour\">" + ("00" + j).slice(-2) + "</span>";
            str += "</div>";
        }
        str += "</div>";
        str += "</div>";
        str += "<div class=\"col-md-6\">";
        str += "<div class=\"row\">";
        for (var j = 12; j < 24; j++) {
            str += "<div class=\"col-md-1 hour head\">";
            str += "<span class=\"adp-hour\">" + j + "</span>";
            str += "</div>";
        }
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        str += "</div>";

        str += "<div style=\"overflow-y:scroll;height:" + (docheight - 500) + "px;\" class=\"body\">";
        for (var i = 0; i < d.length; i++) {
            var rowi = d[i];
            str += "<div data-assigned=\"" + (selectedplnunit === "T" ? rowi.TRD_CODE : rowi.USR_CODE) + "\" class=\"row item\">";
            str += "<div class=\"col-md-3\">";
            str += "<a data-code=\"" + (selectedplnunit === "T" ? rowi.TRD_CODE : rowi.USR_CODE) + "\" href=\"#\"><strong>" + (selectedplnunit === "T" ? rowi.TRD_DESC : rowi.USR_DESC) + "</strong></a>";
            str += "</div>";
            str += "<div class=\"col-md-9\">";
            str += "<div class=\"row\">";
            str += "<div class=\"col-md-6\" style=\"padding-right:0px;\">";
            str += "<div class=\"row\">";
            for (var j = 0; j < 12; j++) {
                str += "<div data-hour=\"" + j + "\" class=\"col-md-1 hour\">";
                dslice = (j * 60) + 15;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 30;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 45;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 60;
                str += "<div  data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                str += "</div>";
            }
            str += "</div>";
            str += "</div>";
            str += "<div class=\"col-md-6\">";
            str += "<div class=\"row\">";
            for (var j = 12; j < 24; j++) {
                str += "<div data-hour=\"" + j + "\" class=\"col-md-1 hour\">";
                dslice = (j * 60) + 15;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 30;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 45;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                dslice = (j * 60) + 60;
                str += "<div data-slice=" + dslice + " style=\"height:30px;\" class=\"quarter\">&nbsp;";
                str += "</div>";
                str += "</div>";
            }
            str += "</div>";
            str += "</div>";
            str += "</div>";
            str += "</div>";
            str += "</div>";
        }

        str += "</div>";

        dailycalendar.append(str);
    }

    function showDailyView() {
        var gridreq = null;
        if (selectedplnunit === "T") {
            gridreq = {
                filter: { filters: [{ field: "TRD_ACTIVE", value: "+", operator: "eq" }, { field: "TRD_CODE", value: "*", operator: "neq" }] },
                sort: [{ field: "TRD_CODE", dir: "asc" }],
                loadall: true
            };
        }
        else if (selectedplnunit === "U") {
            gridreq = {
                filter: {
                    filters: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_TYPE", value: ["CUSTOMER"], operator: "nin" }
                    ]
                },
                sort: [{ field: "USR_CODE", dir: "asc" }],
                loadall: true
            };
        }

        return tms.Ajax({
            url: selectedplnunit === "T" ? "/Api/ApiTrades/List" : "/Api/ApiUsers/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                buildDailyView(d.data);
            }
        });
    }

    function registerUIEvents() {
        $("input[type=radio][name=plnunit]").on("change", function () {
            selectedplnunit = this.value;
            if (selectedplnview === "M") {
                $(".list-group").list("destroy");
                if (this.value == "T") {
                    listTrades();
                } else {
                    listUsers();
                }
            } else {
                $.when(showDailyView()).done(function () {
                    buildDailyPlan();
                });
            }
        });
        $("input[type=radio][name=plnview]").on("change", function () {
            selectedplnview = this.value;
            if (this.value == "D") {
                $("#dailyview").removeClass("hidden");
                $("#monthlyview").addClass("hidden");
                $("#datectrl").removeClass("hidden");
                $("#date").val(moment().format(constants.dateformat));
                $.when(showDailyView()).done(function () {
                    buildDailyPlan();
                });
            } else {
                $("#dailyview").addClass("hidden");
                $("#monthlyview").removeClass("hidden");
                $("#datectrl").addClass("hidden");
                $(".list-group").list("destroy");
                if (selectedplnunit == "T") {
                    listTrades();
                } else {
                    listUsers();
                }
            }
        });
        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
            modal: "#modaldocuments",
            documentsdiv: "#docs"
        });
        commentsHelper = new comments({
            input: "#comment",
            chkvisibletocustomer: "#visibletocustomer",
            chkvisibletosupplier: "#visibletosupplier",
            btnaddcomment: "#addComment",
            modal: "#modalcomments",
            commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
            commentsdiv: "#comments"
        });
        $(document).on("click", "#dailycalendar a[data-code]", function () {
            $("div[data-assigned]").removeClass("k-state-selected");
            $(this).parents("div[data-assigned]").addClass("k-state-selected");
            selecteduser = { Code: $(this).data("code"), Type: selectedplnunit };
            if (selectedactivity) {
                var date = moment.utc($("#date").val(), constants.dateformat);
                $("#divreason").addClass("hidden");
                $("#reason").val("").removeClass("required").removeProp("required");
                $("#newplan h6").html("<strong>" + selecteduser.Code + " / " + selectedactivity.TSA_LINE + " - " + selectedactivity.TSA_DESC + "</strong>");
                $("#dailyplan h6").html("<strong>" + date.format(constants.dateformat) + "</strong>");
                $("#from").val(selectedactivity.TSA_SCHFROM ? moment(selectedactivity.TSA_SCHFROM).format(constants.longdateformat) : date.format(constants.dateformat));
                $("#to").val(selectedactivity.TSA_SCHTO ? moment(selectedactivity.TSA_SCHTO).format(constants.longdateformat) : date.format(constants.dateformat));
                var dayevents = $.grep(dailydata, function (e) { return e.TSA_ASSIGNED == selecteduser.Code; });
                buildActivityTable(dayevents);
                selecteddate = date;
                $("#modalplan").modal("show");
            } else {
                msgs.error(applicationstrings[lang].selectanactivity);
            }
        });
        $(document).on("mouseenter", "#dailycalendar div.hasplan", function () {
            var rowid = $(this).attr("rowid");
            $("#dailycalendar div.hasplan[rowid=\"" + rowid + "\"]").css("background", "#4d51f1");
        });
        $(document).on("mouseleave", "#dailycalendar div.hasplan", function () {
            var rowid = $(this).attr("rowid");
            $("#dailycalendar div.hasplan[rowid=\"" + rowid + "\"]").css("background", "#cf192d");
        });
        $("#filter").click(function () {
            runFilter();
        });
        $("#clearfilter").click(function () {
            resetFilter();
            runFilter();
        });
        $("#from,#to").on("dp.change", function () {
            if (checkRevision()) {
                revisionNeeded = true;
                $("#divreason").removeClass("hidden");
                $("#reason").addClass("required").prop("required", true);
                window.hasChanges = true;
            } else {
                revisionNeeded = false;
                $("#divreason").addClass("hidden");
                $("#reason").val("").removeClass("required").removeProp("required");
            }
        });
        $("#date").on("dp.change", function () {
            $.when(showDailyView()).done(function () {
                buildDailyPlan();
            });
        });
        $("#btnSaveActivity").on("click", saveActivity);
        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    function ready() {
        list();
        buildCalendar();
        listTrades();
        registerUIEvents();
    }

    $(document).ready(ready);
}())