(function () {
    var grdTaskAmountsM1 = null;
    var grdelm = $("#grdTaskAmountsM1");

    function loadPriorities() {
        var gridreq = {
            sort: [{ field: "PRI_CODE", dir: "desc" }],
            filter: {
                filters: [
                    { field: "PRI_ORGANIZATION", value: [organization, "*"], operator: "in" },
                    { field: "PRI_ACTIVE", value: "+", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiPriorities/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"styled\" type=\"checkbox\" value=\"" +
                        d.data[i].PRI_CODE +
                        "\"><label><span>" +
                        d.data[i].PRI_DESCF +
                        "</span></label></div>";
                }
                $("#priorities").append(strOptions);
            }
        });
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
                var strOptions = "";
                strOptions +=
                    "<div class=\"checkbox checkbox-primary\"><input id=\"chkallstatuses\" class=\"styled\" type=\"checkbox\"><label><span> * </span></label></div>";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"styled\" type=\"checkbox\" value=\"" +
                        d.data[i].STA_CODE +
                        "\"><label><span>" +
                        d.data[i].STA_DESCF +
                        "</span></label></div>";
                }
                statusesctrl.append(strOptions);
                statusesctrl.find("#chkallstatuses").on("click",
                    function () {
                        var ischecked = $(this).is(":checked");
                        statusesctrl.find("input").prop("checked", ischecked);
                    });
            }
        });
    }

    function itemSelect(row) {
        var selectedrecord = grdTaskAmountsM1.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $(".page-header h6").html(selectedrecord.ANT_TASKID + " - " + selectedrecord.ANT_TASKSHORTDESC);
    }

    function gridDataBound() {
        grdelm.find("[data-id]").unbind("click").click(function () {
            itemSelect($(this));
        });

        grdelm.find("[data-id]").unbind("dblclick").dblclick(function () {
            window.location = "/Task/Record/" + $(this).data("id");
        });

        grdelm.contextMenu({
            selector: "div.k-grid-content tr",
            items: {
                audit: {
                    name: applicationstrings[lang].newtab,
                    callback: function () {
                        var id = $(this).closest("[data-id]").data("id");
                        var win = window.open("/Task/Record/" + id, "_blank");
                    }
                }
            }
        });

        grdelm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function loadTaskAmountsM1() {
        var gridfilter = [];

        if ($.inArray("*", authorizeddepartmentsarr) === -1) {
            gridfilter.push({
                IsPersistent: true,
                field:"ACTIVITYDEPARTMENTAUTHTABLE.ANTTASKID",
                value: user,
                operator: "func",
                logic: "or"
            });
            gridfilter.push({ IsPersistent: true, field: "ANT_TASKDEPARTMENT", value: authorizeddepartmentsarr, operator: "in", logic: "or" });
        }
        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }

        grdTaskAmountsM1 = new Grid({
            keyfield: "ANT_TASKID",
            columns: [
                {
                    type: "number",
                    field: "ANT_TASKID",
                    title: gridstrings.taskamountsm1[lang].taskid,
                    width: 150
                },
                {
                    type: "string",
                    field: "ANT_TASKSHORTDESC",
                    title: gridstrings.taskamountsm1[lang].shortdescription,
                    width: 350
                },
                {
                    type: "number",
                    field: "ANT_ACTCOUNT",
                    title: gridstrings.taskamountsm1[lang].activitycount,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_TASKORGANIZATION",
                    title: gridstrings.taskamountsm1[lang].taskorganization,
                    width: 150
                },
                {
                    type: "string",
                    field: "ANT_TASKDEPARTMENT",
                    title: gridstrings.taskamountsm1[lang].taskdepartment,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_TASKCUSTOMER",
                    title: gridstrings.taskamountsm1[lang].taskcustomer,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKCUSTOMERDESC",
                    title: gridstrings.taskamountsm1[lang].taskcustomerdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_BRANCH",
                    title: gridstrings.taskamountsm1[lang].branch,
                    width: 150
                },
                {
                    type: "string",
                    field: "ANT_BRANCHDESC",
                    title: gridstrings.taskamountsm1[lang].branchdesc,
                    width: 150
                },
                {
                    type: "string",
                    field: "ANT_REGION",
                    title: gridstrings.taskamountsm1[lang].region,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_PROVINCE",
                    title: gridstrings.taskamountsm1[lang].province,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_CUSTOMERPM",
                    title: gridstrings.taskamountsm1[lang].customerprojectmanager,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_CUSTOMERGROUP",
                    title: gridstrings.taskamountsm1[lang].customergroup,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_CUSTOMERTYPE",
                    title: gridstrings.taskamountsm1[lang].customertype,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKSTATUS",
                    title: gridstrings.taskamountsm1[lang].taskstatus,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKSTATUSDESC",
                    title: gridstrings.taskamountsm1[lang].taskstatusdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKPRIORITY",
                    title: gridstrings.taskamountsm1[lang].taskpriority,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKTYPE",
                    title: gridstrings.taskamountsm1[lang].tasktype,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_TASKTASKTYPE",
                    title: gridstrings.taskamountsm1[lang].tasktasktype,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKCATEGORY",
                    title: gridstrings.taskamountsm1[lang].taskcategory,
                    width: 130
                },
                {
                    type: "number",
                    field: "ANT_PSPCODE",
                    title: gridstrings.taskamountsm1[lang].pspcode,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_PSPSTATUS",
                    title: gridstrings.taskamountsm1[lang].pspstatus,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKREQUESTEDBY",
                    title: gridstrings.taskamountsm1[lang].taskrequestedby,
                    width: 130
                },
                {
                    type: "string",
                    field: "ANT_TASKCREATEDBY",
                    title: gridstrings.taskamountsm1[lang].taskcreatedby,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_USRGROUP",
                    title: gridstrings.taskamountsm1[lang].usrgroup,
                    width: 130
                },
                {
                    type: "datetime",
                    field: "ANT_TASKCREATED",
                    title: gridstrings.taskamountsm1[lang].taskcreated,
                    width: 150
                },
                {
                    type: "datetime",
                    field: "ANT_TASKREQUESTED",
                    title: gridstrings.taskamountsm1[lang].taskrequested,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "ANT_TASKDEADLINE",
                    title: gridstrings.taskamountsm1[lang].taskdeadline,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "ANT_BOOKINGSTART",
                    title: gridstrings.taskamountsm1[lang].bookingstart,
                    width: 150
                },
                {
                    type: "datetime",
                    field: "ANT_TASKHOLDDATE",
                    title: gridstrings.taskamountsm1[lang].taskholddate,
                    width: 150
                },
                {
                    type: "datetime",
                    field: "ANT_TASKCOMPLETED",
                    title: gridstrings.taskamountsm1[lang].taskcompleted,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "ANT_TASKCLOSED",
                    title: gridstrings.taskamountsm1[lang].taskclosed,
                    width: 250
                },
                {
                    type: "string",
                    field: "ANT_TASKHOLDREASON",
                    title: gridstrings.taskamountsm1[lang].taskholdreason,
                    width: 150
                },
                {
                    type: "price",
                    field: "ANT_SERVPSP",
                    title: gridstrings.taskamountsm1[lang].servpsp,
                    width: 250
                },
                {
                    type: "price",
                    field: "ANT_PARTPSP",
                    title: gridstrings.taskamountsm1[lang].partpsp,
                    width: 250
                },
                {
                    type: "price",
                    field: "ANT_TOTALPSP",
                    title: gridstrings.taskamountsm1[lang].totalpsp,
                    width: 250
                }
            ],
            fields:
            {
                ANT_TASKID: { type: "number" },
                ANT_ACTCOUNT: { type: "number" },
                ANT_PSPCODE: { type: "number" },
                ANT_SERVPSP: { type: "number" },
                ANT_PARTPSP: { type: "number" },
                ANT_TOTALPSP: { type: "number" },
                ANT_TASKCREATED: { type: "date" },
                ANT_TASKREQUESTED: { type: "date" },
                ANT_TASKDEADLINE: { type: "date" },
                ANT_BOOKINGSTART: { type: "date" },
                ANT_TASKHOLDDATE: { type: "date" },
                ANT_TASKCOMPLETED: { type: "date" },
                ANT_TASKCLOSED: { type: "date" }
            },
            datasource: "/Api/ApiTask/ListAmountsM1",
            selector: "#grdTaskAmountsM1",
            name: "grdTaskAmountsM1",
            height: constants.defaultgridheight,
            primarycodefield: "ANT_TASKID",
            primarytextfield: "ANT_SHORTDESC",
            visibleitemcount: 10,
            filter: gridfilter,
            filterlogic: "or",
            hasfiltermenu: true,
            sort: [{ field: "ANT_TASKID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskAmounts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound
        });
    }

    function resetFilter() {
        $("#datecreated_start").val("");
        $("#datecreated_end").val("");
        $("#daterequested_start").val("");
        $("#daterequested_end").val("");
        $("#datecompleted_start").val("");
        $("#datecompleted_end").val("");
        $("#dateclosed_start").val("");
        $("#dateclosed_end").val("");
        $("#priorities input").each(function (e) {
            $(this).prop("checked", false);
        });
        $("#statuses input").each(function (e) {
            $(this).prop("checked", false);
        });
    }

    function runFilter() {
        var gridfilter = [];
        if ($.inArray("*", authorizeddepartmentsarr) === -1) {
            gridfilter.push({
                IsPersistent: true,
                field:"ACTIVITYDEPARTMENTAUTHTABLE.ANTTASKID",
                value: user,
                operator: "func",
                logic: "or"
            });
            gridfilter.push({ IsPersistent: true, field: "ANT_TASKDEPARTMENT", value: authorizeddepartmentsarr, operator: "in", logic: "or" });
        }
        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }

        var datecreatedstart = $("#datecreated_start").val().toDate();
        var datecreatedend = $("#datecreated_end").val().toDate();
        var daterequestedstart = $("#daterequested_start").val().toDate();
        var daterequestedend = $("#daterequested_end").val().toDate();
        var datecompletedstart = $("#datecompleted_start").val().toDate();
        var datecompletedend = $("#datecompleted_end").val().toDate();
        var dateclosedstart = $("#dateclosed_start").val().toDate();
        var dateclosedend = $("#dateclosed_end").val().toDate();

        if (datecreatedend)
            datecreatedend = datecreatedend.add(1, "days");
        if (daterequestedend)
            daterequestedend = daterequestedend.add(1, "days");
        if (datecompletedend)
            datecompletedend = datecompletedend.add(1, "days");
        if (dateclosedend)
            dateclosedend = dateclosedend.add(1, "days");

        var i;
        var item;

        var checkedpriorities = $("#priorities input:checked");
        var priorities = [];
        for (i = 0; i < checkedpriorities.length; i++) {
            item = checkedpriorities[i];
            priorities.push($(item).val());
        }

        var checkedstatuses = $("#statuses input:checked");
        var statuses = [];
        for (i = 0; i < checkedstatuses.length; i++) {
            item = checkedstatuses[i];
            statuses.push($(item).val());
        }
        if (priorities.length > 0)
            gridfilter.push({ field: "ANT_TASKPRIORITY", value: priorities, operator: "in", logic: "and" });
        if (statuses.length > 0)
            gridfilter.push({ field: "ANT_TASKSTATUS", value: statuses, operator: "in", logic: "and" });
        if (datecreatedstart && datecreatedend)
            gridfilter.push({ field: "ANT_TASKCREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });
        if (daterequestedstart && daterequestedend)
            gridfilter.push({ field: "ANT_TASKREQUESTED", value: daterequestedstart, value2: daterequestedend, operator: "between", logic: "and" });
        if (datecompletedstart && datecompletedend)
            gridfilter.push({ field: "ANT_TASKCOMPLETED", value: datecompletedstart, value2: datecompletedend, operator: "between", logic: "and" });
        if (dateclosedstart && dateclosedend)
            gridfilter.push({ field: "ANT_TASKCLOSED", value: dateclosedstart, value2: dateclosedend, operator: "between", logic: "and" });
        if (datecreatedstart && !datecreatedend)
            gridfilter.push({ field: "ANT_TASKCREATED", value: datecreatedstart, operator: "gte", logic: "and" });
        if (daterequestedstart && !daterequestedend)
            gridfilter.push({ field: "ANT_TASKREQUESTED", value: daterequestedstart, operator: "gte", logic: "and" });
        if (datecompletedstart && !datecompletedend)
            gridfilter.push({ field: "ANT_TASKCOMPLETED", value: datecompletedstart, operator: "gte", logic: "and" });
        if (dateclosedstart && !dateclosedend)
            gridfilter.push({ field: "ANT_TASKCLOSED", value: dateclosedstart, operator: "gte", logic: "and" });
        if (!datecreatedstart && datecreatedend)
            gridfilter.push({ field: "ANT_TASKCREATED", value: datecreatedend, operator: "lte", logic: "and" });
        if (!daterequestedstart && daterequestedend)
            gridfilter.push({ field: "ANT_TASKREQUESTED", value: daterequestedend, operator: "lte", logic: "and" });
        if (!datecompletedstart && datecompletedend)
            gridfilter.push({ field: "ANT_TASKCOMPLETED", value: datecompletedend, operator: "lte", logic: "and" });
        if (!dateclosedstart && dateclosedend)
            gridfilter.push({ field: "ANT_TASKCLOSED", value: dateclosedend, operator: "lte", logic: "and" });

        grdTaskAmountsM1.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function ready() {
        loadTaskAmountsM1();
        loadPriorities();
        loadStatuses();

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
}());