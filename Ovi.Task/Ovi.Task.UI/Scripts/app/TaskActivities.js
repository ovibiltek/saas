(function () {
    var grdTaskActivities = null;
    var grdelm = $("#grdTaskActivities");
    var commentsHelper;
    var documentsHelper;

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
        var selectedrecord = grdTaskActivities.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $(".page-header h6").html(selectedrecord.TSK_ID + " - " + selectedrecord.TSK_SHORTDESC);
    }

    function gridDataBound() {
        grdelm.find("[data-id]").unbind("click").click(function () {
            itemSelect($(this));
        });

        grdelm.find("[data-id]").unbind("dblclick").dblclick(function () {
            window.location = "/Task/Record/" + $(this).data("id");
        });

        grdelm.find(".btn-comments").unbind("click").click(function () {
            var id = $(this).closest("[data-id]").data("id");
            commentsHelper.showCommentsModal({
                subject: "TASK",
                source: id
            });
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

        grdelm.find(".btn-docs").unbind("click").click(function () {
            var id = $(this).closest("[data-id]").data("id");
            documentsHelper.showDocumentsModal({
                subject: "TASK",
                source: id
            });
        });

        grdelm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function loadTaskActivities() {
        var gridfilter = [];

        if ($.inArray("*", authorizeddepartmentsarr) === -1) {
            gridfilter.push({
                IsPersistent: true,
                field:"ACTIVITYDEPARTMENTAUTHTABLE.TSKID",
                value: user,
                operator: "func",
                logic: "or"
            });
            gridfilter.push({ IsPersistent: true, field: "TSK_DEPARTMENT", value: authorizeddepartmentsarr, operator: "in", logic: "or" });
        }
        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }

        grdTaskActivities = new Grid({
            keyfield: "TSK_ID",
            columns: [
                {
                    type: "na",
                    field: "ACTIONS",
                    title: gridstrings.tasklist[lang].actions,
                    template: "<div style=\"text-align:center;\">" +
                    "<button type=\"button\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(TSK_CMNTCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSK_CMNTCOUNT #</span></button> " +
                    "<button type=\"button\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(TSK_DOCCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSK_DOCCOUNT # </span></button></div>",
                    filterable: false,
                    sortable: false,
                    width: 125
                },
                {
                    type: "na",
                    field: "PRIORITY",
                    title: "#",
                    template:
                    "<div class=\"priority\" title=\"#= TSK_PRIORITYDESC #\" style=\"color:white;background-color:#= TSK_PRIORITYCOLOR #\"><i class=\"#= TSK_PRIORITYCSS #\"></i></div>",
                    filterable: false,
                    sortable: false,
                    width: 40
                },
                {
                    type: "number",
                    field: "TSK_ID",
                    title: gridstrings.tasklist[lang].taskno,
                    template: "<a href=\"/Task/Record/#= TSK_ID #\" target=\"_blank\">#= TSK_ID #</a>",
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_SHORTDESC",
                    title: gridstrings.tasklist[lang].description,
                    width: 350
                },
                {
                    type: "string",
                    field: "TSK_STATUS",
                    title: gridstrings.tasklist[lang].status,
                    width: 130
                },
                {
                    type: "x",
                    field: "TSK_STATUSDESC",
                    title: gridstrings.tasklist[lang].statusdesc,
                    width: 150,
                    template: "<span class=\" #= TSK_STATUSCSS #\">#= TSK_STATUSDESC #</span>"
                },
                {
                    type: "string",
                    field: "TSK_HOLDREASON",
                    title: gridstrings.tasklist[lang].holdreason,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_HOLDREASONDESC",
                    title: gridstrings.tasklist[lang].holdreasondesc,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "TSK_HOLDDATE",
                    title: gridstrings.tasklist[lang].holddate,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_CUSTOMER",
                    title: gridstrings.tasklist[lang].customer,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_CUSTOMERDESC",
                    title: gridstrings.tasklist[lang].customerdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_BRANCH",
                    title: gridstrings.tasklist[lang].branch,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_BRANCHDESC",
                    title: gridstrings.tasklist[lang].branchdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_LOCATION",
                    title: gridstrings.tasklist[lang].location,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_LOCATIONDESC",
                    title: gridstrings.tasklist[lang].locationdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_CATEGORY",
                    title: gridstrings.tasklist[lang].category,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_CATEGORYDESC",
                    title: gridstrings.tasklist[lang].categorydesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_TASKTYPE",
                    title: gridstrings.tasklist[lang].tasktype,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_TASKTYPEDESC",
                    title: gridstrings.tasklist[lang].tasktypedesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_TYPE",
                    title: gridstrings.tasklist[lang].type,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_TYPEDESC",
                    title: gridstrings.tasklist[lang].typedesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_PRIORITY",
                    title: gridstrings.tasklist[lang].priority,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_PRIORITYDESC",
                    title: gridstrings.tasklist[lang].prioritydesc,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_CANCELLATIONREASON",
                    title: gridstrings.tasklist[lang].cancellationreason,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_CANCELLATIONREASONDESC",
                    title: gridstrings.tasklist[lang].cancellationreasondesc,
                    width: 250
                },
                {
                    type: "number",
                    field: "TSK_PSPCODE",
                    title: gridstrings.tasklist[lang].pspcode,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_PRPCODE",
                    title: gridstrings.tasklist[lang].prpcode,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_ORGANIZATION",
                    title: gridstrings.tasklist[lang].organization,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_ORGANIZATIONDESC",
                    title: gridstrings.tasklist[lang].organizationdesc,
                    width: 250
                },
                {
                    type: "number",
                    field: "TSK_PROGRESS",
                    title: gridstrings.tasklist[lang].progress,
                    width: 150,
                    template: "<div class=\"progress\">" +
                    "<div class=\"progress-bar progress-bar-striped # if(TSK_PROGRESS == 100) {# progress-bar-success #} else if(TSK_PROGRESS > 50 && TSK_PROGRESS < 100) {# progress-bar-info active #} else {# progress-bar-warning active #}#\" role=\"progressbar\" aria-valuenow=\"#= TSK_PROGRESS #\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: #= TSK_PROGRESS #%;\">" +
                    "#= TSK_PROGRESS #%" +
                    "</div>" +
                    "</div>"
                },
                {
                    type: "string",
                    field: "TSK_PROJECT",
                    title: gridstrings.tasklist[lang].project,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSK_PROJECTDESC",
                    title: gridstrings.tasklist[lang].projectdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_DEPARTMENT",
                    title: gridstrings.tasklist[lang].department,
                    width: 130
                },
                {
                    type: "string",
                    field: "TSK_DEPARTMENTDESC",
                    title: gridstrings.tasklist[lang].departmentdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_ASSIGNEDTO",
                    title: gridstrings.tasklist[lang].assignedto,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_ACTTRADE",
                    title: gridstrings.tasklist[lang].trade,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_FOLLOWED",
                    title: gridstrings.tasklist[lang].followed,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "TSK_CREATED",
                    title: gridstrings.tasklist[lang].created,
                    width: 250
                },
                { type: "string", field: "TSK_CREATEDBY", title: gridstrings.tasklist[lang].createdby, width: 250 },
                { type: "string", field: "TSK_CREATEDBYDESC", title: gridstrings.tasklist[lang].createdbydesc, width: 250 },

                {
                    type: "date",
                    field: "TSK_DEADLINE",
                    title: gridstrings.tasklist[lang].deadline,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "TSK_APD",
                    title: gridstrings.tasklist[lang].activeplandate,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "TSK_REQUESTED",
                    title: gridstrings.tasklist[lang].requested,
                    width: 250
                },
                { type: "string", field: "TSK_REQUESTEDBY", title: gridstrings.tasklist[lang].requestedby, width: 250 },
                { type: "string", field: "TSK_REQUESTEDBYDESC", title: gridstrings.tasklist[lang].requestedbydesc, width: 250 },
                {
                    type: "datetime",
                    field: "TSK_COMPLETED",
                    title: gridstrings.tasklist[lang].completed,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "TSK_CLOSED",
                    title: gridstrings.tasklist[lang].closed,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_CFEKMAL",
                    title: gridstrings.tasklist[lang].ekmal,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_REGION",
                    title: gridstrings.tasklist[lang].region,
                    width: 250
                },
                {
                    type: "number",
                    field: "TSK_REFERENCE",
                    title: gridstrings.tasklist[lang].reference,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSK_CUSTOMERPM",
                    title: gridstrings.tasklist[lang].customerpm,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_BRANCHPM",
                    title: gridstrings.tasklist[lang].branchpm,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_CUSTOMERGROUP",
                    title: gridstrings.tasklist[lang].customergroup,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_CUSTOMERGROUPDESC",
                    title: gridstrings.tasklist[lang].customergroupdesc,
                    width: 250
                },
                { type: "number", field: "TSK_TSALINE", title: gridstrings.taskactivities[lang].line, width: 150 },
                {
                    type: "string",
                    field: "TSK_TSADESC",
                    title: gridstrings.taskactivities[lang].description,
                    width: 350
                },
                {
                    type: "string",
                    field: "TSK_TSATRADE",
                    title: gridstrings.taskactivities[lang].trade,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_TSATRADEDESC",
                    title: gridstrings.taskactivities[lang].tradedesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_TSAASSIGNEDTO",
                    title: gridstrings.taskactivities[lang].assignedto,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_TSACOMPLETED",
                    title: gridstrings.taskactivities[lang].completed,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_TSAMOBILENOTE",
                    title: gridstrings.taskactivities[lang].mobilenote,
                    width: 350
                },
                {
                    type: "datetime",
                    field: "TSK_TSASCHFROM",
                    title: gridstrings.taskactivities[lang].schfrom,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "TSK_TSASCHTO",
                    title: gridstrings.taskactivities[lang].schto,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_TSACHK01",
                    title: gridstrings.taskactivities[lang].notinpsp,
                    width: 250
                },
                {
                    type: "number",
                    field: "TSK_TSAINVOICE",
                    title: gridstrings.taskactivities[lang].invoice,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_INVINVOICE",
                    title: gridstrings.taskactivities[lang].supplierinvoice,
                    width: 250
                },
                {
                    type: "string",
                    field: "TSK_QUOTATION",
                    title: gridstrings.tasklist[lang].hasquotation,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_SUPERVISION",
                    title: gridstrings.tasklist[lang].hassupervision,
                    width: 150
                },
                {
                    type: "string",
                    field: "TSK_PURCHASEORDERREQ",
                    title: gridstrings.tasklist[lang].haspurchaseorder,
                    width: 150
                },
            ],
            fields:
            {
                TSK_ID: { type: "number" },
                TSK_PROGRESS: { type: "number" },
                TSK_CREATED: { type: "date" },
                TSK_APD: { type: "date" },
                TSK_REQUESTED: { type: "date" },
                TSK_DEADLINE: { type: "date" },
                TSK_COMPLETED: { type: "date" },
                TSK_CLOSED: { type: "date" },
                TSK_PSPCODE: { type: "number" },
                TSK_TSASCHFROM: { type: "date" },
                TSK_TSASCHTO: { type: "date" },
                TSK_TSALINE: { type: "number" },
                TSK_TSAINVOICE: { type: "number" },
                TSK_TSASERVICECODE: { type: "number" },
                TSK_TSAQUANTITY: { type: "number" }
            },
            datasource: "/Api/ApiTask/ListActivities",
            selector: "#grdTaskActivities",
            name: "grdTaskActivities",
            height: constants.defaultgridheight,
            primarycodefield: "TSK_ID",
            primarytextfield: "TSK_SHORTDESC",
            visibleitemcount: 10,
            filter: gridfilter,
            filterlogic: "or",
            hasfiltermenu: true,
            sort: [{ field: "TSK_ID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskActivities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound
        });
    }

    function resetFilter() {
        $("#mytasks").prop("checked", false);
        $("#inmyregion").prop("checked", false);
        $("#deadlineval").val("");
        $("#datecreated_start").val("");
        $("#datecreated_end").val("");
        $("#daterequested_start").val("");
        $("#daterequested_end").val("");
        $("#datecompleted_start").val("");
        $("#datecompleted_end").val("");
        $("#dateclosed_start").val("");
        $("#dateclosed_end").val("");
        $("#apd_start").val("");
        $("#apd_end").val("");
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
                field:"ACTIVITYDEPARTMENTAUTHTABLE.TSKID",
                value: user,
                operator: "func",
                logic: "or"
            });
            gridfilter.push({ IsPersistent: true, field: "TSK_DEPARTMENT", value: authorizeddepartmentsarr, operator: "in", logic: "or" });
        }
        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }

        var mytasks = $("#mytasks").prop("checked");
        var inmyregion = $("#inmyregion").prop("checked");
        var deadlineval = $("#deadlineval").val();

        var datecreatedstart = $("#datecreated_start").val().toDate();
        var datecreatedend = $("#datecreated_end").val().toDate();
        var daterequestedstart = $("#daterequested_start").val().toDate();
        var daterequestedend = $("#daterequested_end").val().toDate();
        var datecompletedstart = $("#datecompleted_start").val().toDate();
        var datecompletedend = $("#datecompleted_end").val().toDate();
        var dateclosedstart = $("#dateclosed_start").val().toDate();
        var dateclosedend = $("#dateclosed_end").val().toDate();
        var apdstart = $("#apd_start").val().toDate();
        var apdend = $("#apd_end").val().toDate();

        if (datecreatedend)
            datecreatedend = datecreatedend.add(1, "days").format(constants.dateformat);
        if (apdend)
            apdend = moment(apdend, constants.dateformat).add(1, "days");
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

        if (mytasks) {
            gridfilter.push(
                { field: "MYTASKS", value: user, operator: "func", logic: "and" });
        }
        if (inmyregion) {
            gridfilter.push({
                field: "INMYREGION.TSKID",
                value: user,
                operator: "func",
                logic: "and"
            });
        }
        if (deadlineval) {
            gridfilter.push({
                field:"TASK.DEADLINE.TSKID",
                value: parseFloat(deadlineval),
                operator: "func",
                logic: "and"
            });
        }

        if (priorities.length > 0)
            gridfilter.push({ field: "TSK_PRIORITY", value: priorities, operator: "in", logic: "and" });
        if (statuses.length > 0)
            gridfilter.push({ field: "TSK_STATUS", value: statuses, operator: "in", logic: "and" });
        if (datecreatedstart && datecreatedend)
            gridfilter.push({
                field: "TSK_CREATED",
                value: datecreatedstart,
                value2: datecreatedend,
                operator: "between",
                logic: "and"
            });
        if (daterequestedstart && daterequestedend)
            gridfilter.push({
                field: "TSK_REQUESTED",
                value: daterequestedstart,
                value2: daterequestedend,
                operator: "between",
                logic: "and"
            });
        if (datecompletedstart && datecompletedend)
            gridfilter.push({
                field: "TSK_COMPLETED",
                value: datecompletedstart,
                value2: datecompletedend,
                operator: "between",
                logic: "and"
            });
        if (dateclosedstart && dateclosedend)
            gridfilter.push({
                field: "TSK_CLOSED",
                value: dateclosedstart,
                value2: dateclosedend,
                operator: "between",
                logic: "and"
            });
        if (apdstart && apdend)
            gridfilter.push({ field: "TSK_APD", value: apdstart, value2: apdend, operator: "between", logic: "and" });
        if (datecreatedstart && !datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedstart, operator: "gte", logic: "and" });
        if (daterequestedstart && !daterequestedend)
            gridfilter.push({ field: "TSK_REQUESTED", value: daterequestedstart, operator: "gte", logic: "and" });
        if (datecompletedstart && !datecompletedend)
            gridfilter.push({ field: "TSK_COMPLETED", value: datecompletedstart, operator: "gte", logic: "and" });
        if (dateclosedstart && !dateclosedend)
            gridfilter.push({ field: "TSK_CLOSED", value: dateclosedstart, operator: "gte", logic: "and" });
        if (apdstart && !apdend)
            gridfilter.push({ field: "TSK_APD", value: apdstart, operator: "gte", logic: "and" });
        if (!datecreatedstart && datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedend, operator: "lte", logic: "and" });
        if (!daterequestedstart && daterequestedend)
            gridfilter.push({ field: "TSK_REQUESTED", value: daterequestedend, operator: "lte", logic: "and" });
        if (!datecompletedstart && datecompletedend)
            gridfilter.push({ field: "TSK_COMPLETED", value: datecompletedend, operator: "lte", logic: "and" });
        if (!dateclosedstart && dateclosedend)
            gridfilter.push({ field: "TSK_CLOSED", value: dateclosedend, operator: "lte", logic: "and" });
        if (!apdstart && apdend)
            gridfilter.push({ field: "TSK_APD", value: apdend, operator: "lte", logic: "and" });

        grdTaskActivities.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function ready() {
        loadTaskActivities();
        loadPriorities();
        loadStatuses();

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