$(function () {
    var selectedinboxgroup = "";
    var calendartable = $("#calendartable");
    var editModeOn = false;

    var selecteduser = {
        code: user,
        desc: window.userdesc
    };

    var activeKPI = null;

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
        this.Content = function (d, who, wkd, typ) {
            var strPopContent;
            var tasks;
            var i;

            switch (typ) {
                case "stasks":
                    tasks = $.grep(d,
                        function (e) {
                            return $.inArray(e.TCA_TYPE, ["ASSIGNED", "TRADE"]) !== -1 &&
                                e.TCA_BRNCODE === who &&
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

    function BuildCalendarItemsObject(d) {
        var calendar = {};
        for (var i = 0; i < d.data.length; i++) {
            var di = d.data[i];

            if (!calendar.hasOwnProperty(di.TCA_BRNCODE))
                calendar[di.TCA_BRNCODE] = {
                    Code: di.TCA_BRNCODE,
                    Desc: di.TCA_BRANCH,
                    Element: $("div[data-branch=\"" + di.TCA_BRNCODE + "\"]"),
                    Days: {}
                };
            if (!calendar[di.TCA_BRNCODE].Days.hasOwnProperty(di.TCA_WEEKDAY))
                calendar[di.TCA_BRNCODE].Days[di.TCA_WEEKDAY] = {
                    DayNo: di.TCA_WEEKDAY,
                    AssignedCount: 0,
                    AssignedItems: [],
                    TradeUsers: null
                };

            if ($.inArray(di.TCA_TYPE, ["ASSIGNED", "TRADE"]) !== -1) {
                calendar[di.TCA_BRNCODE].Days[di.TCA_WEEKDAY].AssignedCount += 1;
                calendar[di.TCA_BRNCODE].Days[di.TCA_WEEKDAY].AssignedItems.push(di);
            }
            calendar[di.TCA_BRNCODE].Days[di.TCA_WEEKDAY].TradeUsers = $.grep(d.tradeusers, function (e) {
                return di.TCA_RELATEDUSER === e.WTU_TRADE && e.WTU_DATE === di.TCA_DATE;
            });
        }

        return calendar;
    }

    function getItems() {
        var sdate = $("#date").val();
        var syear = moment(sdate, constants.dateformat).get("year");
        var sweek = moment(sdate, constants.dateformat).isoWeek();

        $(".calendar-data-cell>div").text("");
        var params = { Year: syear, Week: sweek };

        return tms.Ajax({
            url: "/Api/ApiCalendar/GetCustomerItems",
            data: JSON.stringify(params),
            fn: function (d) {
                $("span.taskitem,span.countitem,div.qtip").remove();
                d.data.sortBy(function (o) { return o.TCA_FROM; });
                var calendar = BuildCalendarItemsObject(d);

                for (var branch in calendar) {
                    if (calendar.hasOwnProperty(branch)) {
                        var brn = calendar[branch];
                        for (var weekday in brn.Days) {
                            if (brn.Days.hasOwnProperty(weekday)) {
                                var day = brn.Days[weekday];
                                var activitycount = brn.Element.find("div[data-activity-count=\"" + day.DayNo + "\"]");
                                var tradeusercount = brn.Element.find("div[data-trade-usercount=\"" + day.DayNo + "\"]");
                                var itemscell = brn.Element.find("div[data-day-items=\"" + day.DayNo + "\"]");
                                var activitystatus = brn.Element.find("div[data-activity-status=\"" + day.DayNo + "\"]");

                                activitycount.html("<span class=\"countitem\">" + day.AssignedCount + "</span>");
                                if (!activitycount.data("store")) {
                                    activitycount.data("store", pop.Content(day.AssignedItems, brn.Code, day.DayNo, "stasks"));
                                    activitycount.clickover({
                                        html: true,
                                        content: function () { return $(this).data("store"); },
                                        title: pop.Title(brn.Desc, applicationstrings[lang].single),
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
                calendartable.find("div.row[data-unit]").has("span.taskitem").detach().prependTo("#calendartable div.row.body");
                $("[title]:not([data-hasqtip])").each(function () {
                    tooltip.showwithoutwrapping($(this), $(this).attr("title"));
                });
            }
        });
    }

    function getBranches() {
        var gridreq = {
            filter: {
                filters: [
                    { field: "BRN_CUSTOMER", value: customer.split(","), operator: "in" },
                    { field: "BRN_ACTIVE", value: "+", operator: "eq" }
                ]
            },
            loadall: true,
            sort: [{ field: "BRN_DESC", dir: "asc" }]
        };

        return tms.Ajax({
            url: "/Api/ApiBranches/List",
            data: JSON.stringify(gridreq),
            quietly: true,
            fn: function (d) {
                var i;

                calendartable.find("div.body div.row").remove();
                if (d.data) {
                    var strappend = "";
                    for (i = 0; i < d.data.length; i++) {
                        if (d.data[i]) {
                            strappend += "<div class=\"row\" data-unit=\"BRANCH\" data-branch=\"" +
                                d.data[i].BRN_CODE +
                                "\"><div class=\"col-md-2 cal-cell\"><div class=\"row\"><div class=\"col-md-10\"><span data-branch=\"" +
                                d.data[i].BRN_CODE +
                                "\" class=\"user\"><strong class=\"badge badge-info\">" +
                                d.data[i].BRN_CUSTOMERDESC +
                                "</strong></span></br><span>" +
                                d.data[i].BRN_DESC +
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
                                    "</div>";
                            }
                            strappend +="</div>";
                        }
                    }

                    if (strappend)
                        calendartable.find("div.body").append(strappend);
                }
            }
        });
    }

    function registerDragAndDrop(container) {
        $(container).find(".draggable").draggable({
            snap: "true",
            zIndex: 100,
            revert: function () {
                return true;
            }
        });
        $(container).find(".droppable").droppable({
            tolerance: "intersect",
            drop: function (ev, ui) {
                $(ui.draggable).detach().css({ top: 0, left: 0, background: "#c8e8ff" }).insertBefore(this);
            }
        });
    }

    function inboxCounts(tab) {
        var $inbox = $(".inbox[data-type=\"" + tab + "\"]");
        $inbox.find("*").remove();

        var inboxprm = {
            InboxGroup: tab,
            ShowAll: editModeOn ? "+" : "-",
            Refresh : '+'
        };

        return tms.Ajax({
            url: "/Api/ApiInbox/Run",
            data: JSON.stringify(inboxprm),
            fn: function (d) {
                var strinbox = "";
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    var title = di.INB_INFO.replace(/["']/g, "&quot;");
                    if (di.INB_CSS && di.INB_CSS.indexOf("fa-fw") === -1)
                        di.INB_CSS = di.INB_CSS + " fa-fw";
                    strinbox += "<li data-visible=\"" + (di.INB_VISIBLE || "-") + "\" data-shownonzero=\"" + (di.INB_SHOWNONZERO || "-") + "\" data-code=\"" + di.INB_CODE + "\" class=\"list-group-item " + (editModeOn ? "draggable droppable" : "") + "\">";
                    strinbox += "<div class=\"row\">";
                    if (editModeOn) {
                        strinbox += "<div class=\"col-md-3\">";
                        strinbox += "<div class=\"row\">";
                        strinbox += "<div class=\"col-md-4\">";
                        strinbox += "<span class=\"inb-order\"><strong>" + (i + 1) + "</strong></span>";
                        strinbox += "</div>";
                        strinbox += "<div class=\"col-md-8\">";
                        strinbox += "<div class=\"btn-group\" style=\"margin-right: 5px;\">";
                        strinbox += "<button class=\"btn btn-xs " + (di.INB_VISIBLE === "+" ? "btn-primary" : "btn-default") + " btn-visible\"><i class=\"fa " + (di.INB_VISIBLE === "+" ? "fa-eye" : "fa-eye-slash") + "\" aria-hidden=\"true\"></i></button>";
                        strinbox += "<button class=\"btn btn-xs " + (di.INB_SHOWNONZERO === "-" ? "btn-primary" : "btn-default") + " btn-shownonzero\"><i class=\"fa " + (di.INB_SHOWNONZERO === "-" ? "fa-circle-o" : "fa-ban") + "\" aria-hidden=\"true\"></i></button>";
                        strinbox += "</div>";
                        strinbox += "</div>";
                        strinbox += "</div>";
                        strinbox += "</div>";
                    }
                    strinbox += "<div class=\"col-md-" + (editModeOn ? "9" : "12") + "\">";
                    strinbox += "<span class=\"inbox-cnt badge " +
                        (di.INB_CNT === 0 ? "badge-info" : "badge-danger") +
                        " pull-right\">" +
                        di.INB_CNT +
                        "</span>";
                    strinbox += "<a title=\"" +
                        title +
                        "\" href=\"" +
                        di.INB_HREF +
                        "/" +
                        di.INB_CODE +
                        "\"><i " +
                        (di.INB_COLOR ? " style=\"color:" + di.INB_COLOR + "\"" : "") +
                        "class=\"" +
                        di.INB_CSS +
                        "\" /> " +
                        di.INB_DESC;
                    strinbox += "</a>";
                    strinbox += "</div>";
                    strinbox += "</div>";
                    strinbox += "</li>";
                }
                $inbox.append(strinbox);
                $inbox.find("a[title]").each(function () {
                    tooltip.showwithoutwrapping($(this), $(this).attr("title"));
                });

                if (editModeOn) {
                    $inbox.find("button.btn-visible").on("click", function () {
                        var $this = $(this);
                        var notclicked = $this.hasClass("btn-default");
                        $this.removeClass(notclicked ? "btn-default" : "btn-primary").addClass(notclicked ? "btn-primary" : "btn-default");
                        $this.closest("li").data("visible", notclicked ? "+" : "-");
                        $this.find("i").removeClass(notclicked ? "fa-eye-slash" : "fa-eye").addClass(notclicked ? "fa-eye" : "fa-eye-slash");
                    });
                    $inbox.find("button.btn-shownonzero").on("click", function () {
                        var $this = $(this);
                        var notclicked = $this.hasClass("btn-default");
                        $this.removeClass(notclicked ? "btn-default" : "btn-primary").addClass(notclicked ? "btn-primary" : "btn-default");
                        $this.closest("li").data("shownonzero", notclicked ? "-" : "+");
                        $this.find("i").removeClass(notclicked ? "fa-ban" : "fa-circle-o").addClass(notclicked ? "fa-circle-o" : "fa-ban");
                    });
                    registerDragAndDrop($inbox);
                }

                var countbadges = $("ul.inbox span.inbox-cnt");
                for (var j = 0; j < countbadges.length; j++) {
                    var cntbadge = $(countbadges[j]);
                    cntbadge.counterUp({ delay: 10, time: 100 });
                    cntbadge.closest("li").hover(
                        function () {
                            $(this).find(".inbox-cnt").animate({ "width": "100px" });
                        },
                        function () {
                            $(this).find(".inbox-cnt").animate({ "width": "80px" });
                        }
                    );
                }
            }
        });
    }

    function KPIChart(ctrl, params) {
        return tms.Ajax({
            url: "/Api/ApiKPI/GetData",
            data: JSON.stringify(params),
            fn: function (d) {
                if (d.data)
                    chart.BuildChart(d.data, ctrl);
            }
        });
    }

    function KPINavigation() {
        return tms.Ajax({
            url: "/Api/ApiKPI/ListByUser",
            data: JSON.stringify(user),
            fn: function (d) {
                if (d.data.length > 0) {
                    var kpinav = $("#kpinav");
                    var kpinavstr = "";
                    for (var i = 0; i < d.data.length; i++) {
                        kpinavstr += "<span title=\"" +
                            d.data[i].KPI_DESCF +
                           
                            d.data[i].KPI_INFO +
                            "\" data-kpi=\"" +
                            d.data[i].KPI_CODE +
                            "\" class=\"badge " +
                            (i === 0 ? "badge-info" : "") +
                            "\" id=\"btnKPI" +
                            (i + 1) +
                            "\" style=\"cursor: pointer;\">" +
                            (i + 1) +
                            "</span> ";
                    }
                    kpinav.append(kpinavstr);
                    kpinav.find("span").on("click",
                        function () {
                            kpinav.find("span").removeClass("badge-info");
                            $(this).addClass("badge-info");
                            activeKPI = $(this).data("kpi");
                            KPIChart("#chart01",
                                {
                                    KPI: $(this).data("kpi"),
                                    Year: $("#chart01-year").val(),
                                    Month: $("#chart01-month").val()
                                });
                            KPIChart("#chart02",
                                {
                                    KPI: $(this).data("kpi"),
                                    Year: $("#chart02-year").val(),
                                    Month: $("#chart02-month").val()
                                });
                        });
                    KPIChart("#chart01",
                        { KPI: d.data[0].KPI_CODE, Year: $("#chart01-year").val(), Month: $("#chart01-month").val() });
                    KPIChart("#chart02",
                        { KPI: d.data[0].KPI_CODE, Year: $("#chart02-year").val(), Month: $("#chart02-month").val() });

                    activeKPI = d.data[0].KPI_CODE;
                }
            }
        });
    }

    function buildCalendarHeader() {
        var sdate = $("#date").val();
        var firstday = moment(sdate, constants.dateformat).startOf("isoweek");
        for (var i = 0; i < 8; i++) {
            var day = firstday.clone().add(i, "days");
            $("th[day-index=\"" + (i + 1) + "\"]").data("date", moment(day).format(constants.sqldateformat)).html(
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
                "</div>");
            $("div[day-index=\"" + (i + 1) + "\"]").data("date", moment(day).format(constants.sqldateformat)).html(
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
                "</div>");
        }
    }

    function buildWeeklyView() {
        $.when(getBranches()).done(function () {
            var deferreds = [];
            deferreds.push(buildCalendarHeader());
            $.when.apply($, deferreds).done(function () {
                getItems();
            });
        });
    }

    function registerUiEvents() {
        $("#btnRefresh").click(function () {
            $(".popover").remove();
            sessionStorage["Main-date"] = $("#date").val();
            buildWeeklyView();
        });
        $("#refreshInbox").click(function () { inboxCounts(selectedinboxgroup); });
        $("#editInbox").click(function () {
            var $this = $(this);
            var notclicked = $this.hasClass("btn-default");
            $this.removeClass(notclicked ? "btn-default" : "btn-primary").addClass(notclicked ? "btn-primary" : "btn-default");
            if (notclicked) {
                editModeOn = true;
                $("#saveInbox").removeClass("hidden");
                inboxCounts(selectedinboxgroup);
            } else {
                editModeOn = false;
                $("#saveInbox").addClass("hidden");
                inboxCounts(selectedinboxgroup);
            }
        });
        $("#saveInbox").click(function () {
            var itemArray = [];
            var $inbox = $(".inbox[data-type=\"" + selectedinboxgroup + "\"]");
            var items = $inbox.find("li[data-code]");
            for (var i = 0; i < items.length; i++) {
                var item = $(items[i]);
                var inboxitem = {
                    UIN_INBOX: item.data("code"),
                    UIN_ORDER: i,
                    UIN_USER: user,
                    UIN_VISIBLE: item.data("visible"),
                    UIN_SHOWNONZERO: item.data("shownonzero")
                };
                itemArray.push(inboxitem);
            }

            var userInbox = {
                User: user,
                InboxGroup: selectedinboxgroup,
                Items: itemArray
            };

            return tms.Ajax({
                url: "/Api/ApiInbox/SaveUserInbox",
                data: JSON.stringify(userInbox),
                fn: function (d) {
                    msgs.success(d.data);
                    editModeOn = false;
                    $("#saveInbox").addClass("hidden");
                    $("#editInbox").removeClass("btn-primary").addClass("btn-default");
                    inboxCounts(selectedinboxgroup);
                }
            });
        });
    }

    function buildMain() {
        KPINavigation();
        //buildWeeklyView();
    }

    function buildUi() {
        $("select").select2({ minimumResultsForSearch: Infinity, dropdownAutoWidth: true });
        $("div.activityview").find(".panel-heading").on("dblclick", function () {
            var Mainhead = $("div.tms-Main-head");
            if (Mainhead.is(":visible"))
                Mainhead.hide();
            else
                Mainhead.show();
        });
        $("select[group-ctrl=\"chart01\"]").on("change", function () {
            KPIChart("#chart01", { KPI: activeKPI, Year: $("#chart01-year").val(), Month: $("#chart01-month").val() });
        });
        $("select[group-ctrl=\"chart02\"]").on("change", function () {
            KPIChart("#chart02", { KPI: activeKPI, Year: $("#chart02-year").val(), Month: $("#chart02-month").val() });
        });
        $(document).on("shown.bs.tab", "#inboxgroup a[data-toggle=\"tab\"]", function (e) {
            var target = $(e.target).attr("href");
            switch (target) {
                case "#personal":
                    selectedinboxgroup = "PERSONAL";
                    inboxCounts(selectedinboxgroup);
                    break;
                case "#public":
                    selectedinboxgroup = "PUBLIC";
                    inboxCounts(selectedinboxgroup);
                    break;
            }
        });
        var sessiondate = sessionStorage["Main-date"];
        if (sessiondate) {
            $("#date").val(sessiondate);
        }
        if (defaultinbox) {
            if (tms.ActiveTab("#inboxgroup") === defaultinbox.toLowerCase()) {
                selectedinboxgroup = defaultinbox;
                inboxCounts(defaultinbox);
            } else {
                $("#inboxgroup a[href=\"#" + defaultinbox.toLowerCase() + "\"]").tab("show");
            }
        }
    }

    var ready = function () {
        var timediff = tms.GetTimeDiff();
        registerUiEvents();
        buildUi();
        buildMain();
    };

    $(document).ready(ready);
})