(function () {

    var selectedMenuItem;
    var inbox;
    var kpi;
    var calendar;
    var activityMap;
    var editModeOn = false;
    var docheight = shared.documentHeight();
    var map;
    var markersArray = [];
    var center = {
        lat: 40.98055008615914,
        lng: 29.102968275547028
    };
    var selectedplnunit;
    var oms;
    var taskmarker = null;
    var taskcircle = null;
    var filtermode = "LIST";



    kpi = new function () {
        function KPIChart(ctrl, params, dataonly) {  
            return tms.Ajax({
                url: "/Api/ApiKPI/GetData",
                data: JSON.stringify(params),
                fn: function (d) {
                    if (d.data.Type === 'BAR') {
                        chart.BuildBarChart(d.data, ctrl);
                    }
                    else {
                        chart.BuildChart(d.data, ctrl);
                    }              
                }
            });
        }
        var BuildChart = function (d) {
            if (d) {
                var strkpi = "";
                for (var i = 0; i < d.length; i++) {

                    var di = d[i];
                    if (i % 3 === 0) {
                        strkpi += "<div class=\"row\">";
                    }
                    strkpi += "<div class=\"col-md-4\">";
                    strkpi += "<div class=\"chart panel panel-default\" data-id=\"" + di.KPI_CODE + "\" id=\"panel-" + di.KPI_CODE + "\">\
                        <div class=\"panel-heading\">\
                        <div class=\"row\">\
                        <div class=\"col-md-10\">\
                        <h5><i class=\"fa fa-inbox\"></i> " + di.KPI_DESC + "</h5>\
                        </div>\
                        </div>\
                        </div>\
                        <div class=\"panel-body\" style=\"padding: 5px;height:300px;\">\
                        <div style=\"height:275px;\" id=\"" + di.KPI_CODE + "\"></div>\
                        </div>\
                        </div>";

                    strkpi += "</div>";
                    if (i % 3 === 2) {
                        strkpi += "</div>";
                    }
                }

                var kpicontent = $("#kpi div.content");
                kpicontent.find("*").remove();
                kpicontent.append(strkpi);

                for (var i = 0; i < d.length; i++) {
                    var di = d[i];
                    KPIChart("#" + di.KPI_CODE, {
                        KPI: di.KPI_CODE,
                        Year: $("#chart-year").val(),
                        Month: $("#chart-month").val(),
                        Region: $("#chart-region").val(),
                        Customer: $("#chart-customer").val()
                    });
                }
            }
        }
        this.ListKpi = function () {
            return tms.Ajax({
                url: "/Api/ApiKPI/ListByUser",
                data: JSON.stringify(user),
                fn: function (d) {
                    BuildChart(d.data);
                }
            });
        }

        var ListRegions = function () {
            var gridreq = {
                sort: [{ field: "REG_CODE", dir: "desc" }],
                filter: [
                    { field: "REG_ACTIVE", value: "+", operator: "eq" }
                ]
            };

            tms.Ajax({
                url: "/Api/ApiRegions/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {

                    $("#chart-region option").remove();
                    var strregions = ' <option selected value="">*</option>';

                    for (var i = 0; i < d.data.length; i++) {
                        strregions += "<option value=\"" +
                            d.data[i].REG_CODE +
                            "\">" +
                            d.data[i].REG_DESC +
                            "</option>";
                    }
                    $("#chart-region").append(strregions);
                }
            });
        }

        var ListCustomers = function () {
            var gridreq = {
                sort: [{ field: "CUS_CODE", dir: "desc" }],
                filter: [
                    { field: "CUS_ACTIVE", value: "+", operator: "eq" }
                ]
            };

            tms.Ajax({
                url: "/Api/ApiCustomers/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {

                    $("#chart-customer option").remove();
                    var strcustomers = ' <option selected value="">*</option>';

                    for (var i = 0; i < d.data.length; i++) {
                        strcustomers += "<option value=\"" +
                            d.data[i].CUS_CODE +
                            "\">" +
                            d.data[i].CUS_DESC +
                            "</option>";
                    }
                    $("#chart-customer").append(strcustomers);
                }
            });
        }

        var RegisterFunctionEvents = function () {
            $("select[group-ctrl=\"chart\"]").on("change", function () {
                var charts = $("div.content div.chart");
                for (var i = 0; i < charts.length; i++) {
                    var kpi = $(charts[i]).data("id");
                    KPIChart("#" + kpi, {
                        KPI: kpi,
                        Year: $("#chart-year").val(),
                        Month: $("#chart-month").val(),
                        Region: $("#chart-region").val(),
                        Customer: $("#chart-customer").val()

                    });
                }
            });

            ListRegions();
            ListCustomers();


        }
        RegisterFunctionEvents();
    }
    inbox = new function () {
        var self = this;
        var registerDragAndDrop = function (container) {
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

        var inboxCounts = function (group, refresh) {

            var $inbox = $("#" + group);
            var $inboxbody = $inbox.find(".panel-body");
            $inboxbody.find("*").remove();

            var inboxprm = {
                InboxGroup: group,
                ShowAll: editModeOn ? "+" : "-",
                Refresh: refresh ? "+" : "-"
            };

            return tms.Ajax({
                url: "/Api/ApiInbox/Run",
                data: JSON.stringify(inboxprm),
                fn: function (d) {
                    var strinbox = "";
                    if (d.data.length === 0) {
                        $inboxbody.closest(".col-md-4").remove();
                        return;
                    } else {
                        $inboxbody.closest(".inbox-group").removeClass("hidden");


                        var ilen = $inbox.find("h4 > span").length;
                        if (ilen === 0)
                            $inbox.find("h4").append(" <span class=\"badge badge-info\">" + d.data.length + "</span>");
                    }


                    strinbox += "<ul class=\"inbox list-group\">";
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        var title = di.INB_INFO.replace(/["']/g, "&quot;");
                        if (di.INB_CSS && di.INB_CSS.indexOf("fa-fw") === -1)
                            di.INB_CSS = di.INB_CSS + " fa-fw";
                        strinbox += "<li data-uinid=\"" + di.INB_UINID + "\" data-visible=\"" + (di.INB_VISIBLE || "-") + "\" data-shownonzero=\"" + (di.INB_SHOWNONZERO || "-") + "\" data-code=\"" + di.INB_CODE + "\" class=\"list-group-item " + (editModeOn ? "draggable droppable" : "") + "\">";
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
                        strinbox += "<span data-countable=\"" + (di.INB_RESULTTYPE === "PRICE"  ? "-" : "+") + "\" class=\"inbox-cnt counter badge " +
                            (di.INB_CNT === 0 ? "inbox-blue" : "inbox-red") +
                            " pull-right\">" +
                            (di.INB_RESULTTYPE === "PRICE" ? (di.INB_CNT || "0").toLocaleString(culture, true) : di.INB_CNT) +
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
                            " inbox-icon\" /> " +
                            di.INB_DESC;
                        strinbox += "</a>";
                        strinbox += "</div>";
                        strinbox += "</div>";
                        strinbox += "</li>";
                    }
                    strinbox += "</ul>";
                    $inboxbody.append(strinbox);
                    $inboxbody.find("a[title]").each(function () {
                        tooltip.showwithoutwrapping($(this), $(this).attr("title"));
                    });

                    if (editModeOn) {
                        $inboxbody.find("button.btn-visible").on("click", function () {
                            var $this = $(this);
                            var notclicked = $this.hasClass("btn-default");
                            $this.removeClass(notclicked ? "btn-default" : "btn-primary").addClass(notclicked ? "btn-primary" : "btn-default");
                            $this.closest("li").data("visible", notclicked ? "+" : "-");
                            $this.find("i").removeClass(notclicked ? "fa-eye-slash" : "fa-eye").addClass(notclicked ? "fa-eye" : "fa-eye-slash");
                        });
                        $inboxbody.find("button.btn-shownonzero").on("click", function () {
                            var $this = $(this);
                            var notclicked = $this.hasClass("btn-default");
                            $this.removeClass(notclicked ? "btn-default" : "btn-primary").addClass(notclicked ? "btn-primary" : "btn-default");
                            $this.closest("li").data("shownonzero", notclicked ? "-" : "+");
                            $this.find("i").removeClass(notclicked ? "fa-ban" : "fa-circle-o").addClass(notclicked ? "fa-circle-o" : "fa-ban");
                        });
                        registerDragAndDrop($inboxbody);
                    }

                    var countbadges = $inboxbody.find("ul.inbox span.inbox-cnt");
                    for (var j = 0; j < countbadges.length; j++) {
                        var cntbadge = $(countbadges[j]);
                        if (cntbadge.data("countable") === "+")
                            cntbadge.counterUp({ delay: 10 });
                       
                    }
                }
            });
        }
        var BuildInboxGroups = function (d,refresh) {

            if (d) {
                var strInboxPanels = "";
                for (var i = 0; i < d.length; i++) {

                    var di = d[i];
                    //if (i % 3 === 0) {
                    //    strInboxPanels += "<div class=\"row\">";
                    //}

                    strInboxPanels += "<div class=\"col-md-4\">";
                    strInboxPanels += "<div class=\"inbox-group panel panel-info hidden\" id=\"" + di.SYC_CODE + "\">\
                        <div class=\"panel-heading\">\
                        <div class=\"row\">\
                        <div class=\"col-md-10\">\
                        <h4><i class=\"fa fa-inbox\"></i> " + di.SYC_DESCF + "</h4>\
                        </div>\
                        <div class=\"col-md-2 pos-right\">\
                        <div class=\"btn-group\">\
                        <button function-id=\"refreshInbox\" class=\"btn btn-default btn-xs\"><i class=\"fa fa-refresh\"></i></button>\
                        <button function-id=\"editInbox\" class=\"btn btn-default btn-xs\"><i class=\"fa fa-pencil\"></i></button>\
                        <button function-id=\"saveInbox\" class=\"btn btn-success btn-xs hidden\"><i class=\"fa fa-save\"></i></button>\
                        </div>\
                        </div>\
                        </div>\
                        </div>\
                        <div class=\"panel-body\" style=\"padding: 5px;height:300px;\">\
                        </div>\
                        </div>";
                    strInboxPanels += "</div>";
                    //if (i % 3 === 2) {
                    //    strInboxPanels += "</div>";
                    //}
                }

                var divinboxgroups = $("#inboxgroups");
                divinboxgroups.find("*").remove();
                divinboxgroups.append(strInboxPanels);

                $("button[function-id=\"refreshInbox\"]").click(function () {
                    var $this = $(this);
                    var inboxgroup = $this.closest("div.inbox-group").attr("id");
                    inboxCounts(inboxgroup,"+");
                });
                $("button[function-id=\"editInbox\"]").click(function () {
                    var $this = $(this);
                    var notclicked = $this.hasClass("btn-default");
                    $this.removeClass(notclicked ? "btn-default" : "btn-primary").addClass(notclicked ? "btn-primary" : "btn-default");
                    var divinboxgroup = $this.closest("div.inbox-group");
                    var inboxgroup = divinboxgroup.attr("id");
                    if (notclicked) {
                        editModeOn = true;
                        divinboxgroup.find("button[function-id=\"saveInbox\"]").removeClass("hidden");
                        inboxCounts(inboxgroup);
                    } else {
                        editModeOn = false;
                        divinboxgroup.find("button[function-id=\"saveInbox\"]").addClass("hidden");
                        inboxCounts(inboxgroup);
                    }
                });
                $("button[function-id=\"saveInbox\"]").click(function () {
                    var $this = $(this);
                    var itemArray = [];
                    var divinboxgroup = $this.closest("div.inbox-group");
                    var inboxgroup = divinboxgroup.attr("id");
                    var items = divinboxgroup.find("li[data-code]");
                    var editbtn = divinboxgroup.find("button[function-id=\"editInbox\"]");


                    for (var i = 0; i < items.length; i++) {
                        var item = $(items[i]);
                        var inboxitem = {
                            UIN_ID: item.data("uinid"),
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
                        InboxGroup: inboxgroup,
                        Items: itemArray
                    };

                    return tms.Ajax({
                        url: "/Api/ApiInbox/SaveUserInbox",
                        data: JSON.stringify(userInbox),
                        fn: function (d) {
                            msgs.success(d.data);
                            editModeOn = false;
                            $this.addClass("hidden");
                            editbtn.removeClass("btn-primary").addClass("btn-default");
                            inboxCounts(inboxgroup, refresh);
                        }
                    });
                });

                for (var i = 0; i < d.length; i++) {
                    var di = d[i];
                    inboxCounts(di.SYC_CODE, refresh);
                }

            }

        }
        this.ListInboxGroups = function (refresh) {

            var gridreq = {
                filter: {
                    filters: [
                        { field: "SYC_GROUP", value: "INBOXGROUP", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    BuildInboxGroups(d.data, refresh);
                }
            });
        }
    }
    calendar = new function() {
        var selecteduser;
        var calendartable = $("#calendartable");
        var scrollticker;
        var page = 1;
        var related = [];


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
                        { field:"SUPPLIERTRADE.TSKID", value: user, operator: "func" }
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
                skip : page - 1
            };

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
                            if (d.data[i]) {
                                related.push(d.data[i].TRD_CODE);
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
                        { field: "AUTHORIZEDUNIT.U", value: user, operator: "func" },
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
                            var user = d.data[i];
                            if (!!user) {
                                related.push(user.USR_CODE);
                                strappend += "<div class=\"row\" data-unit=\"USER\" data-usr=\"" +
                                    user.USR_CODE +
                                    "\"><div class=\"col-md-2 cal-cell\"><div class=\"row cal-content\"><div class=\"col-md-10\">" +
                                    tms.UserPic(user.USR_PIC, user.USR_PICGUID) +
                                    "<span data-usr=\"" +
                                    user.USR_CODE +
                                    "\" class=\"user\">" +
                                    user.USR_DESC +
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
                        { field: "SUPPLIERTRADE.TRDCODE", value: user, operator: "func" },
                        { field: "AUTHORIZEDUNIT.T", value: user, operator: "func" }
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

            if (page !== 1)
                return $.Deferred().resolve();

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
                buildWeeklyView();
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

        this.BuildUi = function () {
            selecteduser = {
                code: user,
                desc: window.userdesc
            };
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

            buildMain();
        }

        registerUiEvents();
    }
    var maps = new function () {
        var self = this;

        this.DeleteOverlays = function () {
            for (var i = 0; i < markersArray.length; i++) {
                oms.removeMarker(markersArray[i]);
            }
            markersArray.length = 0;
        };
        this.FillListData = function (d) {
            var data = {};
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var trade = (di.ACT_DURTRADE || di.ACT_TRADE);
                data[trade] = {
                    Count: $.grep(d, function (i) {
                        return (i.ACT_DURTRADE || i.ACT_TRADE) === trade
                    }).length,
                    Last: $.grep(d, function (i) {
                        return (i.ACT_DURTRADE || i.ACT_TRADE) === trade && i.ACT_ROWNUM === 1
                    })[0]
                }
            }
            for (var trade in data) {
                if (data.hasOwnProperty(trade)) {
                    var o = data[trade];
                    var tradeli = $("a.list-group-item[data-id=\"" + trade + "\"]");
                    tradeli.find("div.add-info").remove();
                    var str = "<p><div class=\"add-info\">" +
                        "<span class=\"badge badge-danger\"><strong>" +
                        applicationstrings[lang].actcount +
                        " : </strong>" +
                        o.Count +
                        "</span> ";
                    if (o.Last) {
                        str += "<span class=\"badge badge-info\"><strong>" +
                            applicationstrings[lang].lastaction +
                            " : </strong>" +
                            o.Last.ACT_LOCDESC + " / " + moment.duration(tms.Now2().diff(moment(o.Last.ACT_DUREND || o.Last.ACT_DURSTART), "minutes"), "minutes").humanize() +
                            "</span>";
                    }
                    str += "</div></p>";
                    tradeli.append(str);
                }
            }
        }
        this.CenterMap = function (location) {
            map.setCenter(location);
        };
        this.PlaceMarker = function (location, data) {
            var contentString = "<div style=\"width:350px;\" id=\"content\">" +
                "<div id=\"activityinfo\">" +
                "<div><h2>" +
                (data.ACT_DURTRADE || data.ACT_TRADE || "") +
                "</h2></div>" +
                "<div style=\"margin-top:10px;\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> " +
                (data.ACT_TRADEUSRS || "") +
                "</div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> <b>" +
                (data.ACT_DURSTART ? moment(data.ACT_DURSTART).format(constants.longdateformat) : "?") +
                " - " +
                (data.ACT_DUREND ? moment(data.ACT_DUREND).format(constants.longdateformat) : "?") +
                "</b></span></div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-calendar\" aria-hidden=\"true\"></i> <b>" +
                (data.ACT_SCHFROM ? moment(data.ACT_SCHFROM).format(constants.longdateformat) : "?") +
                " - " +
                (data.ACT_SCHTO ? moment(data.ACT_SCHTO).format(constants.longdateformat) : "?") +
                "</b></span></div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-location-arrow\" aria-hidden=\"true\"></i> <b>" +
                data.ACT_CUSDESC +
                "-" +
                data.ACT_BRNDESC +
                "</b></span></div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-cog\" aria-hidden=\"true\"></i> " +
                data.ACT_TASK +
                "-" +
                data.ACT_LINE +
                ":" +
                data.ACT_DESC +
                "</span></div>" +
                "</div>";

            var markerfillcolor = (data.ACT_DURSTART && !data.ACT_DUREND) ? "#398439" : ((data.ACT_DURSTART && data.ACT_DUREND) ? "#d43f3a" : "#269abc");
            var marker = new google.maps.Marker({
                map: map,
                icon: {
                    path: fontawesome.markers.MAP_MARKER,
                    scale: 0.5,
                    strokeWeight: 0.2,
                    strokeColor: "white",
                    strokeOpacity: 1,
                    fillColor: markerfillcolor,
                    fillOpacity: 1
                },
                label: (data.ACT_DURTRADE || data.ACT_TRADE),
                animation: google.maps.Animation.DROP,
                position: location
            });
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                trade: (data.ACT_DURTRADE || data.ACT_TRADE),
                task: data.ACT_TASK,
                line: data.ACT_LINE
            });
            google.maps.event.addListener(marker, "spider_click", function (e) {
                var content = $(infowindow.content);
                if (content.find("#planinfo").length === 0) {
                    var queryparams = {
                        Trade: infowindow.trade,
                        Customer: null,
                        Type: null,
                        Category: null,
                        PeriodicTask: null,
                        Rownum: 0
                    }
                    switch (filtermode) {
                        case "LIST":
                            queryparams.DateStart = $("#datestart").val() ?
                                moment.utc($("#datestart").val(), constants.dateformat) :
                                null;
                            queryparams.DateEnd = $("#dateend").val() ?
                                moment.utc($("#dateend").val(), constants.dateformat) :
                                null;
                            break;
                        case "FIND":
                            queryparams.DateStart = $("#date").val() ?
                                moment.utc($("#date").val(), constants.dateformat) :
                                null;
                            break;
                    }

                    $.when(self.GetMapData(queryparams, false)).done(function (dd) {
                        var plndata = $.grep(dd.data,
                            function (x) {
                                return !(x.ACT_TASK === infowindow.task && x.ACT_LINE === infowindow.line)
                            });
                        if (plndata.length > 0) {
                            var strtradeplan = "<div style=\"width:350px;\" id=\"planinfo\">";
                            strtradeplan += "<h2>" + applicationstrings[lang].plannedtasks + "</h2>";
                            for (var i = 0; i < plndata.length; i++) {
                                var planrow = plndata[i];
                                strtradeplan += "<div class=\"row custom\">";
                                strtradeplan += "<div class=\"col-md-12\"><strong>";
                                strtradeplan += planrow.ACT_TASK + "-" + planrow.ACT_LINE + ":" + planrow.ACT_DESC;
                                strtradeplan += "</strong></div>";
                                strtradeplan += "</div>";
                                strtradeplan += "<div class=\"row\">";
                                strtradeplan += "<div class=\"col-md-12\"><span class=\"badge badge-info\">";
                                strtradeplan += (planrow.ACT_SCHFROM ?
                                        moment(planrow.ACT_SCHFROM).format(constants.longdateformat) :
                                        "?") +
                                    " - " +
                                    (planrow.ACT_SCHTO ?
                                        moment(planrow.ACT_SCHTO).format(constants.longdateformat) :
                                        "?");
                                strtradeplan += "</span></div>";
                                strtradeplan += "</div>";
                            }
                            strtradeplan += "</div>";
                            strtradeplan = infowindow.content + strtradeplan;
                            infowindow.setContent(strtradeplan);
                        }
                    });
                }
                infowindow.open(map, marker);
            });
            oms.addMarker(marker);
            markersArray.push(marker);
        };
        this.FillMap = function (d) {
            var continuing = $.grep(d, function (e) {
                return (!e.ACT_DUREND && e.ACT_DURSTART);
            });
            var planned = $.grep(d, function (e) {
                return (!e.ACT_DUREND && !e.ACT_DURSTART);
            });
            var completed = $.grep(d, function (e) {
                return (e.ACT_DUREND && e.ACT_DURSTART);
            });

            $(".page-header h6").html(
                applicationstrings[lang].continuing +
                " : <span class=\"badge badge-success\">" +
                continuing.length +
                "</span> " +
                applicationstrings[lang].planned +
                " : <span class=\"badge badge-info\">" +
                planned.length +
                "</span>" +
                applicationstrings[lang].completed +
                " : <span class=\"badge badge-danger\">" +
                completed.length +
                "</span>");
            self.DeleteOverlays();
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var lat = Number(di.ACT_DURENDLAT || di.ACT_DURSTARTLAT || di.ACT_LOCLATITUDE);
                var lng = Number(di.ACT_DURENDLNG || di.ACT_DURSTARTLNG || di.ACT_LOCLONGITUDE);
                self.PlaceMarker({
                    lat: lat,
                    lng: lng
                }, di);
            }
            if (taskmarker) {
                if (taskcircle)
                    taskcircle.setMap(null);
                var distance = Number($("#distance").val() || "60") * 1000;
                oms.addMarker(taskmarker);
                markersArray.push(taskmarker);
                taskcircle = new google.maps.Circle({
                    map: map,
                    radius: distance,
                    fillOpacity: 0.3,
                    fillColor: "#AA0000",
                    strokeColor: "white"
                });
                taskcircle.bindTo("center", taskmarker, "position");
            }
        };
        this.GetMapData = function (d, f) {
            return tms.Ajax({
                url: f ? "/Api/ApiTaskActivityDurationsMap/Find" : "/Api/ApiTaskActivityDurationsMap/List",
                data: JSON.stringify(d)
            });
        };
        this.InitMap = function () {
            $("#map").css("height", docheight - 150);
            map = new google.maps.Map(document.getElementById("map"), {
                center: center,
                zoom: 6
            });
            oms = new OverlappingMarkerSpiderfier(map, {
                markersWontMove: true,
                markersWontHide: true,
                basicFormatEvents: true
            });
            google.maps.event.addListenerOnce(map, "idle", function () {
                $.when(self.GetMapData({
                    Trade: null,
                    Customer: null,
                    Type: null,
                    Category: null,
                    PeriodicTask: null,
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                }, false)).done(function (d) {
                    self.FillListData(d.data);
                    self.FillMap(d.data);
                });
            });
        };
    };
    activityMap = new function () {
      

        var ListTrades = function () {
            $("#mapunit").list({
                listurl: "/Api/ApiTrades/List",
                loadall: true,
                fields: {
                    keyfield: "TRD_CODE",
                    descfield: "TRD_DESC"
                },
                height: docheight - 250,
                sort: [{
                    field: "TRD_CODE",
                    dir: "asc"
                }],
                itemclick: function (event, item) {
                    var selected = $("a.list-group-item.active").data("id");
                    $.when(maps.GetMapData({
                        Trade: selected,
                        Customer: ($("#customer").val() || null),
                        Type: ($("#type").val() || null),
                        Category: ($("#category").val() || null),
                        PeriodicTask: ($("#periodictask").val() || null),
                        DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                        DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                        Rownum: null
                    }, false)).done(function (d) {
                        maps.FillMap(d.data);
                    });
                }
            });
        }
        var ListUsers = function () {
            $(".list-group").list({
                listurl: "/Api/ApiUsers/List",
                loadall: true,
                fields: {
                    keyfield: "USR_CODE",
                    descfield: "USR_DESC"
                },
                height: docheight - 250,
                sort: [{
                    field: "USR_CODE",
                    dir: "asc"
                }],
                type: "A",
                srch: {
                    filters: [{
                        field: "USR_CODE",
                        operator: "contains",
                        logic: "or"
                    },
                    {
                        field: "USR_DESC",
                        operator: "contains",
                        logic: "or"
                    }
                    ],
                    logic: "and"
                },
                predefinedfilters: [{
                    filters: [
                        {
                            field: "USR_CODE",
                            value: "*",
                            operator: "neq"
                        },
                        {
                            field: "USR_TYPE",
                            value: ["CUSTOMER"],
                            operator: "nin"
                        }
                    ],
                    logic: "and"
                }],
                itemclick: function (event, item) { }
            });
        }
        var BuildModals = function () {
            $("#btncustomer").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.customer[lang].title,
                    listurl: "/Api/ApiCustomers/List",
                    keyfield: "CUS_CODE",
                    codefield: "CUS_CODE",
                    textfield: "CUS_DESC",
                    returninput: "#customer",
                    columns: [{
                        type: "string",
                        field: "CUS_CODE",
                        title: gridstrings.customer[lang].code,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "CUS_DESC",
                        title: gridstrings.customer[lang].description,
                        width: 300
                    }
                    ],
                    filter: [{
                        field: "CUS_ACTIVE",
                        value: "+",
                        operator: "eq"
                    }]
                });
            });
            $("#btncategory").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#category",
                    columns: [{
                        type: "string",
                        field: "CAT_CODE",
                        title: gridstrings.category[lang].code,
                        width: 100
                    },
                        {
                            type: "string",
                            field: "CAT_DESCF",
                            title: gridstrings.category[lang].description,
                            width: 400
                        }
                    ],
                    filter: [{
                        field: "CAT_ACTIVE",
                        value: "+",
                        operator: "eq"
                    }]
                });
            });
            $("#btntype").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#type",
                    columns: [{
                        type: "string",
                        field: "TYP_CODE",
                        title: gridstrings.type[lang].type,
                        width: 100
                    },
                        {
                            type: "string",
                            field: "TYP_DESCF",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [{
                        field: "TYP_ENTITY",
                        value: "TASK",
                        operator: "eq"
                    },
                        {
                            field: "TYP_CODE",
                            value: "*",
                            operator: "neq"
                        }
                    ]
                });
            });
            $("#btntask").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.tasklist[lang].title,
                    listurl: "/Api/ApiTask/List",
                    keyfield: "TSK_ID",
                    codefield: "TSK_ID",
                    textfield: "TSK_SHORTDESC",
                    returninput: "#task",
                    columns: [{
                        type: "number",
                        field: "TSK_ID",
                        title: gridstrings.tasklist[lang].taskno,
                        width: 100
                    },
                        {
                            type: "string",
                            field: "TSK_SHORTDESC",
                            title: gridstrings.tasklist[lang].description,
                            width: 400
                        }
                    ],
                    fields: {
                        TSK_ID: {
                            type: "number"
                        }
                    },
                    callback: function (d) {
                        if (d) {
                            return $.when(tms.Ajax({
                                url: "/Api/ApiLocations/GET",
                                data: JSON.stringify(d.TSK_LOCATION)
                            }).done(function (dx) {
                                var locdata = dx.data;
                                if (locdata.LOC_LATITUDE && locdata.LOC_LONGITUDE) {
                                    taskmarker = new google.maps.Marker({
                                        map: map,
                                        icon: {
                                            path: fontawesome.markers.MAP_MARKER,
                                            scale: 0.5,
                                            strokeWeight: 0.2,
                                            strokeColor: "white",
                                            strokeOpacity: 1,
                                            fillColor: "#EFA44A",
                                            fillOpacity: 1
                                        },
                                        label: d.TSK_BRANCHDESC,
                                        animation: google.maps.Animation.DROP,
                                        position: {
                                            lat: Number(locdata.LOC_LATITUDE),
                                            lng: Number(locdata.LOC_LONGITUDE)
                                        }
                                    });
                                }
                            }));
                        }
                    }
                });
            });
        }
        var AutoComplete = function () {
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE"
            });
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [{
                    field: "CAT_ACTIVE",
                    value: "+",
                    operator: "eq"
                }]
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/ListByDepartment",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESCF",
                filter: [{
                    field: "TYP_ENTITY",
                    value: "TASK",
                    operator: "eq"
                },
                    {
                        field: "TYP_CODE",
                        value: "*",
                        operator: "neq"
                    }
                ]
            });
            $("#task").autocomp({
                listurl: "/Api/ApiTask/List",
                geturl: "/Api/ApiTask/Get",
                field: "TSK_ID",
                textfield: "TSK_SHORTDESC",
                termisnumeric: true,
                callback: function (d) {
                    if (d) {
                        return $.when(tms.Ajax({
                            url: "/Api/ApiLocations/GET",
                            data: JSON.stringify(d.TSK_LOCATION)
                        }).done(function (dx) {
                            var locdata = dx.data;
                            if (locdata.LOC_LATITUDE && locdata.LOC_LONGITUDE) {
                                taskmarker = new google.maps.Marker({
                                    map: map,
                                    icon: {
                                        path: fontawesome.markers.MAP_MARKER,
                                        scale: 0.5,
                                        strokeWeight: 0.2,
                                        strokeColor: "white",
                                        strokeOpacity: 1,
                                        fillColor: "#EFA44A",
                                        fillOpacity: 1
                                    },
                                    label: d.TSK_BRANCHDESC,
                                    animation: google.maps.Animation.DROP,
                                    position: {
                                        lat: Number(locdata.LOC_LATITUDE),
                                        lng: Number(locdata.LOC_LONGITUDE)
                                    }
                                });
                            }
                        }));
                    }
                }
            });
        }
        var RegisterUIEvents = function () {
            $(".sidebar.right").sidebar({
                side: "right"
            });
            $("#closesiderbar").on("click", function () {
                $(".sidebar.right").trigger("sidebar:close");
            });
            $("#search").off("click").on("click", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
            $("#modalshared").on("hidden.bs.modal", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
            $("input[type=radio][name=plnunit]").on("change", function () {
                selectedplnunit = this.value;
                $(".list-group").list("destroy");
                if (this.value == "T") {
                    ListTrades();
                } else {
                    ListUsers();
                }
            });
            $("#datestart, #dateend").val(tms.Now().format(constants.dateformat));
            $("#filter").on("click", function () {
                var activeTab = tms.ActiveTab("#filteroptions");
                if (activeTab == "list") {
                    filtermode = "LIST";
                    var chkdays = moment.duration(tms.Now2().diff(moment($("#datestart").val(), constants.dateformat))).days();
                    if (chkdays > 30) {
                        msgs.error(applicationstrings[lang].mapstartdayerr);
                        return $.Deferred().reject();
                    }
                    return $.when(maps.GetMapData({
                        Trade: null,
                        Customer: ($("#customer").val() || null),
                        Type: ($("#type").val() || null),
                        Category: ($("#category").val() || null),
                        PeriodicTask: ($("#periodictask").val() || null),
                        DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                        DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                        Rownum: null
                    }, false)).done(function (d) {
                        if (taskmarker) {
                            if (taskcircle)
                                taskcircle.setMap(null);
                            taskmarker = null;
                        }
                        maps.FillListData(d.data);
                        maps.FillMap(d.data);
                        $(".sidebar.right").trigger("sidebar:close");
                    });
                } else if (activeTab == "find") {
                    filtermode = "FIND";
                    var task = $("#task").val();
                    if (!task) {
                        msgs.error(applicationstrings[lang].selectatask);
                        return $.Deferred().reject();
                    }
                    var chkdays = moment.duration(tms.Now2().diff(moment($("#date").val(), constants.dateformat))).days();
                    if (chkdays > 0) {
                        msgs.error(applicationstrings[lang].pastdate);
                        return $.Deferred().reject();
                    }
                    return $.when(maps.GetMapData({
                        Task: task,
                        Date: $("#date").val() ? moment.utc($("#date").val(), constants.dateformat) : null,
                        Distance: ($("#distance").val() || null)
                    }, true)).done(function (d) {
                        var rows = $.grep(d.data, function (i) {
                            return $.inArray(i.ACT_ROWNUM, [0, 1]) !== -1
                        });
                        $("a.list-group-item").find("div.add-info").remove();
                        maps.FillMap(rows);
                        $(".sidebar.right").trigger("sidebar:close");
                    });
                }
            });
            $("#clearfilter").on("click", function () {
                $("#customer").val("");
                $("#task").val("");
                $("#date").val("");
                $("#distance").val("");
                $("#type").val("");
                $("#category").val("");
                $("#periodictask").val("");
                $("#datestart, #dateend").val(tms.Now().format(constants.dateformat));
                tooltip.hide("#customer,#type,#category,#periodictask,#task");
                $("a.list-group-item.active").removeClass("active");
                return $.when(maps.GetMapData({
                    Trade: null,
                    Customer: null,
                    Type: null,
                    Category: null,
                    PeriodicTask: null,
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                })).done(function (d) {
                    maps.FillListData(d.data);
                    maps.FillMap(d.data);
                    $(".sidebar.right").trigger("sidebar:close");
                });
            });

            BuildModals();
            AutoComplete();
        }
        this.BuildUI = function () {
            RegisterUIEvents();
            ListTrades();
            maps.InitMap();
        }

    }

    function menuItemClick(clicked_id) {
        var sidebar = document.getElementById("sideBar");
        var elem = sidebar.getElementsByTagName("li");
        for (var i = 0; i < elem.length; i++) {
            elem[i].className = "menuItem";
        }

        selectedMenuItem = document.getElementById(clicked_id);
        selectedMenuItem.className = "selectedMenuItem";
        toggle(document.querySelectorAll(".target"));
    }

    function toggle(elements, specifiedDisplay) {


        var element, index;

        elements = elements.length ? elements : [elements];
        for (index = 0; index < elements.length; index++) {
            element = elements[index];

            if (isElementHidden(element)) {
                element.style.display = "";

                if (isElementHidden(element)) {
                    if (element.id === selectedMenuItem.id) {
                        element.style.display = specifiedDisplay || "block";
                        switch (selectedMenuItem.id) {
                        case "inbox":
                            inbox.ListInboxGroups();
                            break;
                        case "kpi":
                            kpi.ListKpi();
                            break;
                        case "calendar":
                            calendar.BuildUi();
                            break;
                        case "activityMap":
                            activityMap.BuildUI();
                            break;
                        }
                    }
                }
            } else {
                if (element.id !== selectedMenuItem.id) {
                    element.style.display = "none";
                }
            }
        }

        function isElementHidden(element) {
            return window.getComputedStyle(element, null).getPropertyValue("display") === "none";
        }
    }

    function RegisterUIEvents() {
        $("#sideBar li.menuItem").on("click", function () {
            var $this = $(this);
            var id = $this.attr("id");
            menuItemClick(id);
        });
        $("#refreshAllInboxes").on("click", function () {
            inbox.ListInboxGroups(true);
        });

        
               
    };

    

    RegisterUIEvents();

    $(document).ready(function() {
        menuItemClick(defaultMainsection || "inbox");
    });


})();