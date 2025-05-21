$(function () {
    var calendartable = $("#calendartable");
    var page = 1;
    var related = [];
    var scrollticker;

    var selecteduser = {
        code: user,
        desc: window.userdesc
    };

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
                case "stasks":
                    tasks = $.grep(d,
                        function (e) {
                            return $.inArray(e.TCA_TYPE, ["ASSIGNED", "TRADE"]) !== -1 &&
                                e.TCA_RELATEDUSER === usr &&
                                e.TCA_WEEKDAY === wkd;
                        });
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
                    for (i = 0; i < tasks.length; i++) {
                        strPopContent += "<div class=\"row po-line\">";
                        strPopContent += "<div class=\"col-md-1\"><a href=\"/Task/Record/" +
                            tasks[i].TCA_TASK +
                            "\">" +
                            tasks[i].TCA_TASK +
                            "</a></div>";
                        strPopContent += "<div class=\"col-md-1\">" + tasks[i].TCA_ACTLINE + "</div>";
                        strPopContent += "<div class=\"col-md-2\">" + tasks[i].TCA_ACTDESC + "</div>";
                        strPopContent += "<div class=\"col-md-2\">" +
                            applicationstrings[lang].activitystatuses[tasks[i].TCA_ACTSTATUS] +
                            "</div>";
                        strPopContent += "<div class=\"col-md-2\">" + tasks[i].TCA_CUSTOMER + "</div>";
                        strPopContent += "<div class=\"col-md-2\">" + tasks[i].TCA_BRANCH + "</div>";
                        strPopContent += "<div class=\"col-md-1\">" +
                            moment(tasks[i].TCA_FROM).format(constants.timeformat) +
                            "</div>";
                        strPopContent += "<div class=\"col-md-1\">" +
                            moment(tasks[i].TCA_TO).format(constants.timeformat) +
                            "</div>";
                        strPopContent += "</div>";
                    }
                    break;
                case "followed":
                    tasks = $.grep(d,
                        function (e) {
                            return e.TCA_TYPE === "FOLLOWED" && e.TCA_RELATEDUSER === usr && e.TCA_WEEKDAY === wkd;
                        });
                    strPopContent = "<div class=\"row po-header\">";
                    strPopContent += "<div class=\"col-md-1\"><strong>" +
                        applicationstrings[lang].taskno +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-3\"><strong>" +
                        applicationstrings[lang].description +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].status +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-3\"><strong>" +
                        applicationstrings[lang].customer +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-3\"><strong>" +
                        applicationstrings[lang].branch +
                        "</strong></div>";
                    strPopContent += "</div>";
                    for (i = 0; i < tasks.length; i++) {
                        strPopContent += "<div class=\"row po-line\">";
                        strPopContent += "<div class=\"col-md-1\"><a href=\"/Task/Record/" +
                            tasks[i].TCA_TASK +
                            "\">" +
                            tasks[i].TCA_TASK +
                            "</a></div>";
                        strPopContent += "<div class=\"col-md-3\">" + tasks[i].TCA_ACTDESC + "</div>";
                        strPopContent += "<div class=\"col-md-2\">" +
                            applicationstrings[lang].activitystatuses[tasks[i].TCA_ACTSTATUS] +
                            "</div>";
                        strPopContent += "<div class=\"col-md-3\">" + tasks[i].TCA_CUSTOMER + "</div>";
                        strPopContent += "<div class=\"col-md-3\">" + tasks[i].TCA_BRANCH + "</div>";
                        strPopContent += "</div>";
                    }
                    break;
                case "unplannedtasks":
                    var gd = d;
                    if (usr != null) {
                        gd = $.grep(d, function (e) { return e.TSK_USER === usr; });
                    }
                    strPopContent = "<div class=\"row po-header\">";
                    strPopContent += "<div class=\"col-md-1\"><strong>" +
                        applicationstrings[lang].taskno +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-3\"><strong>" +
                        applicationstrings[lang].taskdesc +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].customer +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-2\"><strong>" +
                        applicationstrings[lang].branch +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-1\"><strong>" +
                        applicationstrings[lang].activity +
                        "</strong></div>";
                    strPopContent += "<div class=\"col-md-3\"><strong>" +
                        applicationstrings[lang].actdesc +
                        "</strong></div>";
                    strPopContent += "</div>";
                    for (i = 0; i < gd.length; i++) {
                        strPopContent += "<div class=\"row po-line\"" +
                            (gd[i].TSK_CREATEDBYUSERTYPE === "A" ? "style=\"font-weight:bold;background:#e7f4ff;\"" : "") +
                            ">";
                        strPopContent += "<div class=\"col-md-1\"><a href=\"/Task/Record/" +
                            gd[i].TSK_ID +
                            "\">" +
                            gd[i].TSK_ID +
                            "</a></div>";
                        strPopContent += "<div class=\"col-md-3\">" + gd[i].TSK_SHORTDESC + "</div>";
                        strPopContent += "<div class=\"col-md-2\">" + gd[i].TSK_CUSTOMER + "</div>";
                        strPopContent += "<div class=\"col-md-2\">" + gd[i].TSK_BRANCH + "</div>";
                        strPopContent += "<div class=\"col-md-1\">" + gd[i].TSK_ACTLINE + "</div>";
                        strPopContent += "<div class=\"col-md-3\">" + gd[i].TSK_ACTDESC + "</div>";
                        strPopContent += "</div>";
                    }
                    break;
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

    function activityStatusFormatter(line) {
        var actstatcls = "";
        var iconcls = "";
        switch (line.TCA_ACTSTAT) {
            case "ACTIVE":
                actstatcls = "running";
                iconcls = "fa-play";
                break;
            case "COMPLETED":
                actstatcls = "completed";
                iconcls = "fa-check";
                break;
            case "PAUSED":
                actstatcls = "stopped";
                iconcls = "fa-pause";
                break;
            case "WAITING":
                actstatcls = "stopped";
                iconcls = "fa-question";
                break;
        }
        return {
            actstatcls: actstatcls,
            iconcls: iconcls
        };
    }

    function getUnplannedDepartmentTasks() {
        var gridreq = {
            filter: {
                filters: [
                    { field: "TSK_DEPARTMENT", value: $("#departments").multipleSelect("getSelects"), operator: "in" },
                    { field: "TSK_USER", value: "*", operator: "eq" },
                    { field:"SUPPLIERTRADE.TSKID",value: user, operator: "func" }
                   
                ]
            },
            sort: [
                { field: "TSK_CREATEDBYUSERTYPE", dir: "asc" },
                { field: "TSK_ID", dir: "asc" }
            ],
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiCalendar/ListUnplannedTasks",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var box = $("div.updeptasks");
                box.find("*").remove();
                if (d.data.length > 0) {
                    box.append("<p class=\"countcircle\">" + d.data.length + "</p>");
                    box.data("store", pop.Content(d.data, null, null, "unplannedtasks"));
                    box.clickover({
                        html: true,
                        content: function () { return $(this).data("store") },
                        title: applicationstrings[lang].unplannedtasks,
                        placement: pop.Placement,
                        global_close: 1,
                        container: "body"
                    });
                }
            }
        });
    }

    function showUnplannedWeeklyView(d, cntobj) {
        for (var user in cntobj) {
            if (cntobj.hasOwnProperty(user)) {
                //var cntcell = $("tr[data-usr=\"" + user + "\"] td:first-child .upcnt");
                var cntcell = $("div[data-usr=\"" + user + "\"] div:first-child .upcnt");
                cntcell.html("<p class=\"countcircle\">" + cntobj[user] + "</p>");
                cntcell.data("store", pop.Content(d, user, null, "unplannedtasks"));
                cntcell.clickover({
                    html: true,
                    content: function () { return $(this).data("store"); },
                    title: applicationstrings[lang].unplannedtasks,
                    placement: pop.Placement,
                    global_close: 1,
                    container: "body"
                });
            }
        }
    }

    function showUnplannedMonthlyView(d, cntobj) {
        var cntcell = $("#monthlyview div.fc-toolbar div.fc-center div.upcnt");
        cntcell.append("<p class=\"countcircle\">" + cntobj[selecteduser.code] + "</p>");
        cntcell.data("store", pop.Content(d, selecteduser.code, null, "unplannedtasks"));
        cntcell.clickover({
            html: true,
            content: function () { return $(this).data("store") },
            title: applicationstrings[lang].unplannedtasks,
            placement: pop.Placement,
            global_close: 1,
            container: "body"
        });
    }

    function getUnplannedUserTasks(handlefunction, singleuser) {
        var gridreq = {
            filter: { filters: [] },
            sort: [
                { field: "TSK_CREATEDBYUSERTYPE", dir: "asc" },
                { field: "TSK_ID", dir: "asc" }
            ],
            loadall: true
        };

        if (!singleuser)
            gridreq.filter.filters.push({ field: "TSK_DEPARTMENT", value: $("#departments").multipleSelect("getSelects"), operator: "in" });
        else
            gridreq.filter.filters.push({ field: "TSK_USER", value: selecteduser.code, operator: "eq" });

        return tms.Ajax({
            url: "/Api/ApiCalendar/ListUnplannedTasks",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                if (d.data.length > 0) {
                    var cntobj = {};
                    for (var i = 0; i < d.data.length; i++)
                        cntobj[d.data[i].TSK_USER] = (cntobj[d.data[i].TSK_USER] || 0) + 1;
                    handlefunction(d.data, cntobj);
                }
            }
        });
    }

    function moveTask(tsk) {
        return tms.Ajax({
            url: "/Api/ApiCalendar/MoveTask",
            data: JSON.stringify(tsk)
        });
    }

    function buildProgress(v) {
        var progressstr = "";
        if (v >= 100) {
            progressstr =
                "<div class=\"progress-bar progress-bar-dangerest progress-bar-striped\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:100%\">" +
                "&nbsp;" +
                "</div>";
        } else if (v === 100) {
            progressstr =
                "<div class=\"progress-bar progress-bar-danger progress-bar-striped\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:100%\">" +
                "&nbsp;" +
                "</div>";
        } else if (v === 0) {
            progressstr =
                "<div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:100%\">" +
                "&nbsp;" +
                "</div>";
        } else {
            progressstr = "<div class=\"progress\">" +
                "<div class=\"progress-bar progress-bar-danger progress-bar-striped\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:" +
                v +
                "%\">" +
                "&nbsp;" +
                "</div>" +
                "<div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:" +
                (100 - v) +
                "%\">" +
                "&nbsp;" +
                "</div>";
        }
        return progressstr;
    }

    function buildCalendarItemsObject(d) {
        var calendar = {};

        for (var i = 0; i < d.data.length; i++) {
            var di = d.data[i];

            if ($.inArray(di.TCA_DEPARTMENT, $("#departments").multipleSelect("getSelects")) === -1)
                continue;

            if (!calendar.hasOwnProperty(di.TCA_RELATEDUSER))
                calendar[di.TCA_RELATEDUSER] = {
                    Code: di.TCA_RELATEDUSER,
                    Desc: di.TCA_RELATEDUSERDESC,
                    Element: $("div[data-usr=\"" + di.TCA_RELATEDUSER + "\"]"),
                    Days: {}
                };
            if (!calendar[di.TCA_RELATEDUSER].Days.hasOwnProperty(di.TCA_WEEKDAY))
                calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY] = {
                    DayNo: di.TCA_WEEKDAY,
                    AssignedCount: 0,
                    FollowedCount: 0,
                    TradeUsers: null,
                    AssignedItems: [],
                    FollowedItems: [],
                    PlannedDurationArr: []
                };

            if ($.inArray(di.TCA_TYPE, ["ASSIGNED", "TRADE"]) !== -1) {
                calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY].AssignedCount += 1;
                calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY].AssignedItems.push(di);
                if (di.TCA_TO && di.TCA_FROM) {
                    if (di.TCA_COMPLETED !== "+") {
                        var duration = moment.duration(moment(di.TCA_TO).diff(moment(di.TCA_FROM))).asSeconds();
                        calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY].PlannedDurationArr.push(duration);
                    }
                }
            }
            if (di.TCA_TYPE === "FOLLOWED" && di.TCA_RELATEDUSER === user) {
                calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY].FollowedCount += 1;
                calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY].FollowedItems.push(di);
            }
            calendar[di.TCA_RELATEDUSER].Days[di.TCA_WEEKDAY].TradeUsers = $.grep(d.tradeusers, function (e) {
                return di.TCA_RELATEDUSER === e.WTU_TRADE && e.WTU_DATE === di.TCA_DATE;
            });
        }
        return calendar;
    }

    function getItems() {
        var sdate = $("#date").val();
        var syear = moment(sdate, constants.dateformat).get("year");
        var sweek = moment(sdate, constants.dateformat).isoWeek();
        var type = $("#unit option:selected").data("value");

        $(".calendar-data-cell>div").text("");
        var params = { Year: syear, Week: sweek, Type: type, RelatedArr: related };

        return tms.Ajax({
            url: "/Api/ApiCalendar/GetItems",
            data: JSON.stringify(params),
            fn: function (d) {
                $("span.taskitem,span.countitem,div.qtip").remove();
                var myrow = $("div[data-usr=\"" + user + "\"]");
                myrow.css({ "background": "#E6FFE2" });

                d.data.sortBy(function (o) { return o.TCA_FROM; });
                var calendar = buildCalendarItemsObject(d);

                for (var user in calendar) {
                    if (calendar.hasOwnProperty(user)) {
                        var usr = calendar[user];
                        for (var weekday in usr.Days) {
                            if (usr.Days.hasOwnProperty(weekday)) {
                                var day = usr.Days[weekday];
                                var activitycount = usr.Element.find("div[data-activity-count=\"" + day.DayNo + "\"]");
                                var tradeusercount = usr.Element.find("div[data-trade-usercount=\"" + day.DayNo + "\"]");
                                var itemscell = usr.Element.find("div[data-day-items=\"" + day.DayNo + "\"]");
                                var activitystatus = usr.Element.find("div[data-activity-status=\"" + day.DayNo + "\"]");

                                if (day.PlannedDurationArr.length > 0) {
                                    var sum = 0;
                                    $.each(day.PlannedDurationArr, function () { sum += parseFloat(this) || 0; });
                                    var v = Math.round((sum / 30600) * 100);
                                    var calcell = itemscell.closest("div.cal-cell");
                                    var progressdiv = calcell.find("div.cal-progress");
                                    progressdiv.html(buildProgress(v));
                                }

                                activitycount.html("<span class=\"countitem\">" + day.AssignedCount + "</span>");
                                if (!activitycount.data("store")) {
                                    activitycount.data("store", pop.Content(day.AssignedItems, usr.Code, day.DayNo, "stasks"));
                                    activitycount.clickover({
                                        html: true,
                                        content: function () { return $(this).data("store"); },
                                        title: pop.Title(usr.Desc, applicationstrings[lang].single),
                                        placement: pop.Placement,
                                        global_close: 1,
                                        container: "body"
                                    });
                                }
                                if (tradeusercount.find("span").length === 0) {
                                    if (day.TradeUsers && day.TradeUsers.length > 0) {
                                        tradeusercount.html("<span title=\"<b>" +
                                            day.TradeUsers[0].WTU_USERS +
                                            "</b>\"><i class=\"fa fa-user\" aria-hidden=\"true\"></i> " +
                                            day.TradeUsers[0].WTU_CNT +
                                            "</span>");
                                    }
                                }

                                // Followed
                                for (var x = 0; x < day.FollowedItems.length; x++) {
                                    var followcell = myrow.find("div[data-day-follow=\"" + day.DayNo + "\"]");
                                    followcell.html("<span class=\"countitem\">" + day.FollowedCount + "</span>");
                                    if (!followcell.data("store")) {
                                        followcell.data("store", pop.Content(day.FollowedItems, usr.Code, day.DayNo, "followed"));
                                        followcell.clickover({
                                            html: true,
                                            content: function () { return $(this).data("store"); },
                                            title: pop.Title(usr.Desc, applicationstrings[lang].followed),
                                            placement: pop.Placement,
                                            global_close: 1,
                                            container: "body"
                                        });
                                    }
                                }

                                var strItems = "";
                                var activitystatusHtml = "";
                                var itemCount = 0;

                                for (var j = 0; j < day.AssignedItems.length; j++) {
                                    var r = day.AssignedItems[j];
                                    if (r.TCA_ACTSTAT !== "X") {
                                        var actstatus = activityStatusFormatter(r);
                                        activitystatusHtml = "<span title=\"<b>" +
                                            applicationstrings[lang][r.TCA_ACTSTAT] +
                                            " " +
                                            (r.TCA_DURSTART ? moment(r.TCA_DURSTART).format(constants.timeformat) : "?") +
                                            " - " +
                                            (r.TCA_DUREND ? moment(r.TCA_DUREND).format(constants.timeformat) : "?") +
                                            "</b> [" +
                                            r.TCA_TASK +
                                            "-" +
                                            r.TCA_ACTLINE +
                                            "][" +
                                            r.TCA_CUSTOMER +
                                            " " +
                                            r.TCA_BRANCH +
                                            "] " +
                                            r.TCA_ACTDESC +
                                            "\" class=\"countitem " +
                                            actstatus.actstatcls +
                                            "\"><i class=\"fa " +
                                            actstatus.iconcls +
                                            "\" aria-hidden=\"true\"></i></span>";
                                    }

                                    if (itemCount < 3) {
                                        strItems += "<span data-href=\"" +
                                            "/Task/Record/" +
                                            r.TCA_TASK +
                                            "\" data-id=\"" +
                                            r.TCA_TASK +
                                            "\" data-line=\"" +
                                            r.TCA_ACTLINE +
                                            "\" iscompleted=\"" +
                                            r.TCA_COMPFL +
                                            "\" msflag=\"" +
                                            r.TCA_USRMSFLAG +
                                            "\" title=\"[" +
                                            r.TCA_PRIORITY +
                                            "][" +
                                            r.TCA_CUSTOMER +
                                            " " +
                                            r.TCA_BRANCH +
                                            "] " +
                                            r.TCA_ACTDESC +
                                            " " +
                                            moment(r.TCA_FROM).format(constants.timeformat) +
                                            "/" +
                                            moment(r.TCA_TO).format(constants.timeformat) +
                                            "\" class=\"draggable taskitem" +
                                            (r.TCA_COMPFL === "+" ? " completed\"" : " notcompleted\"") +
                                            ">" +
                                            "<span style=\"margin:2px;color:" +
                                            r.TCA_PRIORITYCOLOR +
                                            "\"><i style=\"background:#FFF\" class=\"" +
                                            r.TCA_PRIORITYCSS +
                                            "\"></i></span>" +
                                            r.TCA_TASK +
                                            "-" +
                                            r.TCA_ACTDESC.substring(0, 15) +
                                            "</span>";
                                        itemCount++;
                                    }
                                }

                                itemscell.html(strItems);
                                activitystatus.html(activitystatusHtml);
                            }
                        }
                    }
                }

                var isDragging = false;
                $("[data-href]").mousedown(function () { isDragging = false; })
                    .mousemove(function () { isDragging = true; })
                    .mouseup(function () {
                        var wasDragging = isDragging;
                        isDragging = false;
                        if (!wasDragging) {
                            location.href = $(this).data("href");
                        }
                    });

                if (calendartable.data("isauthorized") === "+") {
                    $("xxx.draggable").draggable({
                        snap: "true",
                        revert: function (event) {
                            if ($(this).attr("msFlag") === "M") {
                                msgs.error(applicationstrings[lang].multipleusers);
                                event = false;
                            }
                            if ($(this).attr("iscompleted") === "+") {
                                msgs.error(applicationstrings[lang].activitycompleted);
                                event = false;
                            }
                            $(this).data("fc", !event);
                            return !event;
                        }
                    });
                }

                $("[title]:not([data-hasqtip])").each(function () {
                    tooltip.showwithoutwrapping($(this), $(this).attr("title"));
                });
            }
        });
    }

    function registerDrop() {
        $("xxx.droppable").droppable({
            hoverClass: "drop-hover",
            tolerance: "intersect",
            accept: ".draggable",
            greedy: true,
            drop: function (event, ui) {
                var moveto = $(this).parent().data("usr");
                var unit = $(this).parent().data("unit");
                var id = ui.draggable.data("id");
                var line = ui.draggable.data("line");
                var indx = $(this).index();
                var date = $("#calendartable .days div[day-index=\"" + indx + "\"").data("date");

                setTimeout(function () {
                    $(ui.draggable).promise().done(function () {
                        if (!ui.draggable.data("fc")) {
                            $.when(moveTask({
                                Unit: unit,
                                User: moveto,
                                Id: id,
                                Line: line,
                                Date: date
                            })).done(function () {
                                buildScheduler();
                                getItems();
                            });
                        }
                    });
                },
                    100);
            }
        });
    }

    function getDepartmentTrades() {
        var gridreq = {
            filter: {
                filters: [
                    { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                    { field: "TRD_CODE", value: "*", operator: "neq" },
                    { field:"SUPPLIERTRADE.TRDCODE",value: user, operator: "func" },
                    { field:"AUTHORIZEDUNIT.T",value: user, operator: "func" }
                ]
            },
            sort: [{ field: "TRD_DESC", dir: "asc" }],
            loadall: false,
            page: page,
            skip: page - 1        };

        var sessiontrade = localStorage["Main-trade"];
        if (sessiontrade) {
            gridreq.filter.filters.push({ field: "TRD_CODE", value: sessiontrade.split(","), operator: "in" });
        }

        return tms.Ajax({
            url: "/Api/ApiTrades/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var i;
                var selecteddepartments = $("#departments").multipleSelect("getSelects", "text").join();
                $("#departmenttitle").text(selecteddepartments.length > 30
                    ? selecteddepartments.substring(0, 30) + "..."
                    : selecteddepartments);

                calendartable.find("div.calendartablemsg01").addClass("hide");
                calendartable.find("div.days").removeClass("hide");
                if (page === 1)
                    calendartable.find("div.body div.row").remove();

                if (d.data) {
                    var strappend = "";
                    for (i = 0; i < d.data.length; i++) {
                        related.push(d.data[i].TRD_CODE);
                        if (d.data[i]) {
                            strappend +=
                                "<div class=\"row\" data-unit=\"TRADE\" data-usr=\"" +
                                d.data[i].TRD_CODE +
                                "\">" +
                                "<div class=\"col-md-2 cal-cell\">" +
                                "<div class=\"row cal-content\">" +
                                "<div class=\"col-md-10\">" +
                                "<span data-usr=\"" +
                                d.data[i].TRD_CODE +
                                "\" class=\"user\">" +
                                d.data[i].TRD_DESC +
                                "</span>" +
                                "</div>" +
                                "<div class=\"col-md-2 upcnt\">" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                            for (var j = 1; j < 8; j++) {
                                strappend += "<div class=\"col-md-1 cal-cell noselect droppable\">" +
                                    "<div class=\"row cal-head-days\">" +
                                    "<div class=\"col-md-10 no-padding \" data-day-items=\"" + j + "\"></div>" +
                                    "<div class=\"col-md-2 day-container no-padding\">" +
                                    "<div class=\"info-label\" data-activity-count=\"" + j + "\"></div>" +
                                    "<div class=\"info-label\" data-trade-usercount=\"" + j + "\"></div>" +
                                    "<div class=\"info-label\" data-activity-status=\"" + j + "\"></div>" +
                                    "<div class=\"info-label\" data-day-follow=\"" + j + "\"></div>" +
                                    "</div>" +
                                    "</div>" +
                                    "<div class=\"cal-progress\">" + buildProgress(0) + "</div>" +
                                    "</div>";
                            }
                            strappend += "</div>";
                        }
                    }

                    if (strappend)
                        calendartable.find("div.body").append(strappend);
                }

                $("span.user").click(function () {
                    var $this = $(this);
                    selecteduser = {
                        code: $this.data("usr"),
                        desc: $this.text()
                    };
                    $("#monthly").trigger("click");
                });
                registerDrop();
            }
        });
    }

    function getDepartmentUsers() {
        var gridreq = {
            filter: {
                filters: [
                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                    { field: "USR_CODE", value: "*", operator: "neq" },
                    { field:"SUPPLIERUSER.USRCODE",value: user, operator: "func" },
                    { field:"AUTHORIZEDUNIT.U",value: user, operator: "func" },
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            },
            sort: [{ field: "USR_DESC", dir: "asc" }],
            loadall: false,
            page: page,
            skip: page - 1
        };

        return tms.Ajax({
            url: "/Api/ApiUsers/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var userindex = $.map(d.data, function (obj, index) {
                    if (obj.USR_CODE === user)
                        return index;
                });

                if (userindex) {
                    d.data.move(userindex[0], 0);
                }

                var i;
                var selecteddepartments = $("#departments").multipleSelect("getSelects", "text").join();
                $("#departmenttitle").text(selecteddepartments.length > 30
                    ? selecteddepartments.substring(0, 30) + "..."
                    : selecteddepartments);

                calendartable.find("div.calendartablemsg01").addClass("hide");
                calendartable.find("div.days").removeClass("hide");
                if (page === 1)
                    calendartable.find("div.body div.row").remove();
                if (d.data) {
                    var strappend = "";
                    for (i = 0; i < d.data.length; i++) {
                        if (d.data[i])
                            related.push(user.USR_CODE);
                            strappend += "<div class=\"row\" data-unit=\"USER\" data-usr=\"" +
                                d.data[i].USR_CODE +
                                "\"><div class=\"col-md-2 cal-cell\"><div class=\"row cal-content\"><div class=\"col-md-10\">" +
                                tms.UserPic(d.data[i].USR_PIC, d.data[i].USR_PICGUID ) +
                                "<span data-usr=\"" +
                                d.data[i].USR_CODE +
                                "\" class=\"user\">" +
                                d.data[i].USR_DESC +
                                "</span></div><div class=\"col-md-2 upcnt\"></div></div></div>";
                        for (var j = 1; j < 8; j++) {
                            strappend += "<div class=\"col-md-1 cal-cell noselect droppable\">" +
                                "<div class=\"row cal-head-days\">" +
                                "<div class=\"col-md-10 no-padding \" data-day-items=\"" + j + "\"></div>" +
                                "<div class=\"col-md-2 day-container no-padding\">" +
                                "<div class=\"info-label\" data-activity-count=\"" + j + "\"></div>" +
                                "<div class=\"info-label\" data-trade-usercount=\"" + j + "\"></div>" +
                                "<div class=\"info-label\" data-activity-status=\"" + j + "\"></div>" +
                                "<div class=\"info-label\" data-day-follow=\"" + j + "\"></div>" +
                                "</div>" +
                                "</div>" +
                                "<div class=\"cal-progress\">" + buildProgress(0) + "</div>" +
                                "</div>";
                        }
                        strappend += "</div>";
                    }

                    if (strappend)
                        calendartable.find("div.body").append(strappend);
                }

                $("span.user").click(function () {
                    var $this = $(this);
                    selecteduser = {
                        code: $this.data("usr"),
                        desc: $this.text()
                    };
                    $("#monthly").trigger("click");
                });
                registerDrop();
            }
        });
    }

    function buildTrades() {
        var gridreq = {
            filter: {
                filters: [
                    { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                    { field: "TRD_CODE", value: "*", operator: "neq" },
                    { field:"SUPPLIERTRADE.TRDCODE" ,value: user, operator: "func" },
                    { field: "AUTHORIZEDUNIT.T",value: user, operator: "func" }
                ]
            },
            sort: [{ field: "TRD_DESC", dir: "asc" }],
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiTrades/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strtrades = "";
                $("#trade option").remove();
                for (var i = 0; i < d.data.length; i++) {
                    strtrades += "<option value=\"" +
                        d.data[i].TRD_CODE +
                        "\">" +
                        d.data[i].TRD_DESC +
                        "</option>";
                }
                $("#trade").append(strtrades);
                $("#trade").multipleSelect("refresh");
                var sessiontrade = localStorage["Main-trade"];
                if (sessiontrade) {
                    var selectedtrades = (sessiontrade).split(",");
                    $("#trade").multipleSelect("setSelects", selectedtrades);
                }
            }
        });
    }

    function buildDepartments() {
        return tms.Ajax({
            url: "/Api/ApiDepartments/GetDepartments",
            data: JSON.stringify(user),
            fn: function (d) {
                var strdepartments = "";
                $("#departments option").remove();
                for (var i = 0; i < d.data.length; i++) {
                    strdepartments += "<option value=\"" +
                        d.data[i].DEP_CODE +
                        "\">" +
                        d.data[i].DEP_DESC +
                        "</option>";
                }
                var sessiondepartment = localStorage["Main-department"];
                var selecteddepartments = (sessiondepartment || department).split(",");
                $("#departments").append(strdepartments);
                $("#departments").multipleSelect("refresh");
                $("#departments").multipleSelect("setSelects", selecteddepartments);
            }
        });
    }

    function buildCalendarHeader() {
        var sdate = $("#date").val();
        var firstday = moment(sdate, constants.dateformat).startOf("isoweek");
        for (var i = 0; i < 8; i++) {
            var day = firstday.clone().add(i, "days");
            $("div[day-index=\"" + (i + 1) + "\"]").attr("data-date", moment(day).format(constants.sqldateformat)).html(
                "<div class=\"row cal-head-days\">" +
                "<div class=\"col-lg-5 col-md-6 no-padding label-big\">" +
                day.format("DD") +
                "</div>" +
                "<div class=\"col-lg-7 col-md-6 no-padding\">" +
                "<div class=\"row\" style=\"padding-top:0.6em\">" +
                "<div class=\"col-md-12 label-normal\">" +
                day.format("ddd") +
                "</div>" +
                "<div class=\"col-md-12 label-small\">" +
                day.format("MMM, YY") +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>").css("background", "");
        }
    }

    function buildMonthlyHoursView() {
        var mvctrl = $("#monthlyhoursview");
        var currentdate = mvctrl.fullCalendar("getDate");

        var syear = moment(currentdate, constants.dateformat).get("year");
        var smonth = moment(currentdate, constants.dateformat).month() + 1;

        var params = {
            Year: syear,
            Month: smonth,
            User: selecteduser.code
        };

        return tms.Ajax({
            url: "/Api/ApiCalendar/GetMonthlyHours",
            data: JSON.stringify(params),
            fn: function (d) {
                mvctrl.fullCalendar("removeEvents");
                var events = [];
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    events.push({
                        title: " [ " + di.TCA_ACTUALHOURS + " / " + di.TCA_PLANNEDHOURS + " ] ",
                        start: di.TCA_FROM,
                        end: di.TCA_TO,
                        d: di,
                        o: di.TCA_TYPE
                    });
                }
                mvctrl.fullCalendar("addEventSource", events);
                $("#monthlyhoursview div.fc-toolbar div.fc-center")
                    .html("<div class=\"row cal-content\"><div class=\"col-md-12\"><strong>" +
                        selecteduser.desc +
                        "</strong></div></div>");
            }
        });
    }

    function buildMonthlyView() {
        var mvctrl = $("#monthlyview");
        var currentdate = mvctrl.fullCalendar("getDate");

        var syear = moment(currentdate, constants.dateformat).get("year");
        var smonth = moment(currentdate, constants.dateformat).month() + 1;

        var params = {
            Year: syear,
            Month: smonth,
            User: selecteduser.code
        };

        return $.when(markMonthlyHolidays(params)).done(function () {
            return tms.Ajax({
                url: "/Api/ApiCalendar/GetMonthlyItems",
                data: JSON.stringify(params),
                fn: function (d) {
                    mvctrl.fullCalendar("removeEvents");
                    var events = [];
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
                    mvctrl.fullCalendar("addEventSource", events);
                    $("#monthlyview div.fc-toolbar .fc-center")
                        .html("<div class=\"row cal-content\"><div class=\"col-md-10\"><strong>" +
                            selecteduser.desc +
                            "</strong></div><div class=\"col-md-2\"><div class=\"upcnt\"></div></div>");
                    getUnplannedUserTasks(showUnplannedMonthlyView, true);
                }
            });
        });
    }

    function markMonthlyHolidays(params) {
        return tms.Ajax({
            url: "/Api/ApiHolidays/GetMonthlyHolidays",
            data: JSON.stringify(params),
            fn: function (d) {
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    var day = moment(di.HOL_DATE).format(constants.dateformat2);
                    $("#monthlyview td.fc-day[data-date=\"" + day + "\"]")
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

    function markWeeklyHolidays() {
        var sdate = $("#date").val();
        var day = moment(sdate, constants.dateformat);
        return tms.Ajax({
            url: "/Api/ApiHolidays/GetMonthlyHolidays",
            data: JSON.stringify({
                Year: day.year(),
                Month: day.month() + 1
            }),
            fn: function (d) {
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    var datestr = moment(di.HOL_DATE).format(constants.sqldateformat);
                    var datediv = $("div[data-date=\"" + datestr + "\"]");
                    datediv.css("background", "#525252");
                    datediv.append("<div class=\"row\"><div class=\"col-md-offset-1 col-md-10 col-md-offset-1 label-small\">" + di.HOL_DESC + "</div></div>");
                };
            }
        });
    }

    function buildWeeklyView() {
        var unit = $("#unit").val();
        var unitfunc = {
            T: function () { return getDepartmentTrades(); },
            P: function () { return getDepartmentUsers(); }
        };

        $.when(unitfunc[unit]()).done(function () {
            // Second set of deferreds
            var deferreds = [];
            if (page === 1) {
                deferreds.push(buildCalendarHeader());
                deferreds.push(getUnplannedDepartmentTasks());
                deferreds.push(getUnplannedUserTasks(showUnplannedWeeklyView));
            }
            $.when.apply($, deferreds).done(function () {
                $.when(markWeeklyHolidays()).done(function () {
                    getItems();
                });
            });
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
            case "TRADE":
                var poptitle = "";
                element.css({ "padding": "0.2em", "background": "#3085d1" });
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

    function monthlyHoursCalendarEventRenderer(event, element) {
        element.css({ "padding": "0.2em", "background": "#CC002C", "border-color": "#CC002C" });
        element.find("span.fc-time").remove();
        element.data("store", pop.Content(event.d, null, null, "stask"));
        element.clickover({
            html: true,
            content: function () { return $(this).data("store") },
            title: event.d.TCA_RELATEDUSERDESC,
            placement: pop.Placement,
            global_close: 1,
            container: "body"
        });
    }

    function registerUiEvents() {
        $("#btnRefresh, #btnRun").click(function () {
            $(".popover").remove();
            localStorage["Main-date"] = $("#date").val();
            localStorage["Main-department"] = $("#departments").multipleSelect("getSelects").join();
            localStorage["Main-trade"] = $("#trade").multipleSelect("getSelects").join();
            localStorage["Main-unit"] = $("#unit").val();
            page = 1;
            related = [];
            buildWeeklyView();
        });
        $("#weekly").change(function () {
            $("#monthlyview").hide();
            $("#monthlyhoursview").hide();
            calendartable.show();
            $("#monthlyview").fullCalendar("destroy");
            //buildWeeklyView();
        });
        $("#monthly").change(function () {
            calendartable.hide();
            $("#monthlyhoursview").hide();
            $("#monthlyhoursview").fullCalendar("destroy");
            $("#monthlyview").show();
            $("#monthlyview").fullCalendar({
                header: { left: "title", center: "", right: "prev,next" },
                firstDay: 1,
                eventRender: monthlyTasksCalendarEventRenderer,
                eventOrder: "o",
                fixedWeekCount: false,
                height: 650,
                views: { month: { eventLimit: 3 } }
            });
            $("#monthlyview .fc-prev-button,#monthlyview .fc-next-button").click(buildMonthlyView);
            buildMonthlyView();
        });
        $("#monthlyhours").change(function () {
            calendartable.hide();
            $("#monthlyview").hide();
            $("#monthlyview").fullCalendar("destroy");
            $("#monthlyhoursview").show();
            $("#monthlyhoursview").fullCalendar({
                header: { left: "title", center: "", right: "prev,next" },
                firstDay: 1,
                eventRender: monthlyHoursCalendarEventRenderer,
                eventOrder: "o",
                fixedWeekCount: false,
                height: 650,
                views: { month: { eventLimit: 3 } }
            });
            $("#monthlyhoursview .fc-prev-button,#monthlyhoursview .fc-next-button").click(buildMonthlyHoursView);
            buildMonthlyHoursView();
        });
        $("#unit").on("change", function () {
            var v = $(this).val();
            if (v == "P")
                $("#trade").parent().hide();
            else
                $("#trade").parent().show();
        });
        $("#calendartable div.body")
            .on("scroll", function (e) {
                if (scrollticker) { window.clearTimeout(scrollticker); scrollticker = null; }
                scrollticker = window.setTimeout(function () {
                    if (e.currentTarget.scrollTop > 0 && e.currentTarget.scrollTop >= e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - 20) {
                        page++;
                        buildWeeklyView();
                    }
                }, 50);

            });
    }

    function buildMain() {
        var deferreds = [];
        var actviewavailable = !($("#activityview").hasClass("hidden-xs"));
        if (viewweeklycalendar === "+" && actviewavailable) {
            deferreds.push(buildDepartments());
            deferreds.push(buildTrades());
        }

        $.when.apply($, deferreds).done(function () {
            if (actviewavailable) {
                if (viewweeklycalendar !== "+")
                    $("#monthly").trigger("click");
                else
                    buildWeeklyView();
            }
        });
    }

    function buildUi() {
        $("select:not([multiple])").select2({ minimumResultsForSearch: Infinity, dropdownAutoWidth: true });
        $("select[multiple]").multipleSelect({
            selectAllText: applicationstrings[lang].selectall,
            allSelected: applicationstrings[lang].allselected,
            countSelected: applicationstrings[lang].countSelected
        });
        $("div.activityview").find(".panel-heading").on("dblclick", function () {
            var Mainhead = $("div.tms-Main-head");
            if (Mainhead.is(":visible"))
                Mainhead.hide();
            else
                Mainhead.show();
        });

        var lsdate = localStorage["Main-date"];
        if (lsdate) {
            $("#date").val(lsdate);
        }

        var lsunit = localStorage["Main-unit"];
        if (lsunit) {
            $("#unit").val(lsunit).trigger("change");
        }
        $("#calendartable div.body").css("max-height", shared.documentHeight() - 275);
        console.log(shared.documentHeight());
    }

    var ready = function () {
        buildUi();
        registerUiEvents();
        buildMain();
    };

    $(document).ready(ready);
})