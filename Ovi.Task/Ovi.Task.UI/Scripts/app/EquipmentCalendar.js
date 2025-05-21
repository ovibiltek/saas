(function () {
    var commentsHelper;
    var documentsHelper;
    var data = null;
    var year = new Date().getFullYear();
    var grdEquipmentCalendarTaskList = null;
    var grdEquipmentCalendarTaskListElm = $("#grdEquipmentCalendarTaskList");
    var grdFilter = null;

    var customer = null;
    var branch = null;
    var equipmenttype = null;
    var equipmentid = null;


    var gridDataBound = function () {
        grdEquipmentCalendarTaskListElm.find(".btn-comments").unbind("click").click(function () {
            var id = $(this).closest("[data-id]").data("task");
            commentsHelper.showCommentsModal({
                subject: "TASK",
                source: id
            });
        });
        grdEquipmentCalendarTaskListElm.find(".btn-docs").unbind("click").click(function () {
            var id = $(this).closest("[data-id]").data("task");
            documentsHelper.showDocumentsModal({
                subject: "TASK",
                source: id
            });
        });
        grdEquipmentCalendarTaskListElm.contextMenu({
            selector: "div.k-grid-content tr",
            items: {
                task: {
                    name: applicationstrings[lang].gototask,
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html('<span><i class="fa fa-external-link" aria-hidden="true"></i> ' + item.name + "</span>");
                        return "context-menu-icon-updated";
                    },
                    callback: function () {
                        var id = $(this).closest("[data-id]").data("task");
                        var win = window.open("/Task/Record/" + id, "_blank");
                    }
                },
                eqp: {
                    name: applicationstrings[lang].gotoequipment,
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html('<span><i class="fa fa-external-link" aria-hidden="true"></i> ' + item.name + "</span>");
                        return "context-menu-icon-updated";
                    },
                    callback: function () {
                        var id = $(this).closest("[data-id]").data("equipment");
                        var win = window.open("/Equipments/Index/" + id, "_blank");
                    }
                }

            }
        });
    };

    var List = function () {
        grdEquipmentCalendarTaskList = new Grid({
            keyfield: "TSE_ID",
            columns: [
                {
                    type: "na",
                    field: "ACTIONS",
                    title: gridstrings.tasklist[lang].actions,
                    template: "<div style=\"text-align:center;\">" +
                        "<button type=\"button\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(TSE_CMNTCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSE_CMNTCOUNT #</span></button> " +
                        "<button type=\"button\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(TSE_DOCCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSE_DOCCOUNT # </span></button></div>",
                    filterable: false,
                    sortable: false,
                    width: 125
                },
                {
                    type: "number",
                    field: "TSE_TSKID",
                    title: gridstrings.taskequipmentlist[lang].taskid,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TSKDESC",
                    title: gridstrings.taskequipmentlist[lang].taskdesc,
                    width: 300
                },
                {
                    type: "number",
                    field: "TSE_STATUS",
                    title: gridstrings.taskequipmentlist[lang].status,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_STATUSDESC",
                    title: gridstrings.taskequipmentlist[lang].statusdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TSKCAT",
                    title: gridstrings.taskequipmentlist[lang].taskcat,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TSKCATDESC",
                    title: gridstrings.taskequipmentlist[lang].taskcatdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TSKTYPE",
                    title: gridstrings.taskequipmentlist[lang].tasktype,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TYPE",
                    title: gridstrings.taskequipmentlist[lang].type,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_CUSTOMER",
                    title: gridstrings.taskequipmentlist[lang].customer,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_BRANCH",
                    title: gridstrings.taskequipmentlist[lang].branch,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_BRANCHDESC",
                    title: gridstrings.taskequipmentlist[lang].branchdesc,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "TSE_CREATED",
                    title: gridstrings.taskequipmentlist[lang].created,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "TSE_COMPLETED",
                    title: gridstrings.taskequipmentlist[lang].completed,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "TSE_ACTPLANDATE",
                    title: gridstrings.taskequipmentlist[lang].activeplandate,
                    width: 200
                },
                {
                    type: "number",
                    field: "TSE_EQPID",
                    title: gridstrings.taskequipmentlist[lang].eqpid,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPCODE",
                    title: gridstrings.taskequipmentlist[lang].eqpcode,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPTYPE",
                    title: gridstrings.taskequipmentlist[lang].eqptype,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPDESC",
                    title: gridstrings.taskequipmentlist[lang].eqpdesc,
                    width: 200
                }
            ],
            fields:
            {
                TSE_ACTPLANDATE: { type: "date" },
                TSE_TSKID: { type: "number" },
                TSE_CREATED: { type: "date" },
                TSE_COMPLETED: { type: "date" },
                TSE_EQPID: { type: "number" }
            },
            datafields: [
            {
                name: "Task",
                field: "TSE_TSKID"
            },
            {
                name: "Equipment",
                field: "TSE_EQPID"
            }],
            hasfiltermenu: true,
            toolbarColumnMenu: true,
            filter: grdFilter,
            datasource: "/Api/ApiEquipments/GetTaskEquipmentListView",
            selector: "#grdEquipmentCalendarTaskList",
            name: "grdEquipmentCalendarTaskList",
            height: constants.defaultgridheight,
            sort: [{ field: "TSE_CREATED", dir: "desc" }],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Stock.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound
        });
    };

    var GetCounts = function () {
        var prm = {
            Customer: customer,
            Branch: branch,
            EquipmentType: equipmenttype,
            Equipment: equipmentid,
            Year: year
        }

        return tms.Ajax({
            url: "/Api/ApiEquipments/GetCalendarCounts",
            data: JSON.stringify(prm)
        });
    }

    var SetData = function (data) {
        if (data) {
            var dataSource = [];
            for (var i = 0; i < data.length; i++) {
                var di = data[i];
                var event = {
                    id: di.TSE_ID,
                    name: "Aktivite Sayısı : " + di.TSE_COUNT,
                    startDate: moment(di.TSE_DATE).startOf("day"),
                    endDate: moment(di.TSE_DATE).startOf("day")
                }
                dataSource.push(event);
            }
            $("#calendar").data("calendar").setDataSource(dataSource);
        }
    }

    var BuildGridFilter = function () {
        customer = $("#customer").val() || null;
        branch = $("#branch").val() || null;
        equipmenttype = $("#type").val() || null;
        equipmentid = $("#equipment").data("id") || null;
        if (customer)
            grdFilter.push({ field: "TSE_CUSTOMER", value: customer, operator: "eq" });
        if (branch)
            grdFilter.push({ field: "TSE_BRANCH", value: branch, operator: "eq" });
        if (equipmenttype)
            grdFilter.push({ field: "TSE_EQPTYPE", value: equipmenttype, operator: "eq" });
        if (equipmentid)
            grdFilter.push({ field: "TSE_EQPID", value: equipmentid, operator: "eq" });
    }

    var CalendarCtrl = function () {
        $("#calendar").calendar({
            language: lang.toLowerCase(),
            clickDay: function (e) {
                var day = $(e.element).attr("day");
                var dayStart = day.toDate();
                var dayEnd = day.toDate().add(1, "days");
                grdFilter = [{ field: "TSE_DATE", value: dayStart, value2: dayEnd, operator: "between" }];
                $("div.day-content.has-data").css("background-color", "#108ce2");
                var dayContentDiv = $(e.element).find("div.day-content");
                if (dayContentDiv.hasClass("has-data"))
                    dayContentDiv.css("background-color", "red");
                $("#date").text(dayStart.format(constants.dateformat));
                BuildGridFilter();
                List();
            },
            renderEnd: function (e) {
                if (e.currentYear != year) {
                    year = e.currentYear;
                    if (grdEquipmentCalendarTaskList) {
                        grdEquipmentCalendarTaskList.ClearData();
                        grdEquipmentCalendarTaskList = null;
                    }
                    $.when(GetCounts()).done(function (d) {
                        data = d.data;
                        SetData(d.data);
                    });
                }
            },
            customDayRenderer: function (element, date) {

                $(element).closest("td").attr("day", moment(date).format(constants.dateformat));
                var item = $.grep(data, function (e) { return moment.duration(moment(e.TSE_DATE).diff(moment(date))).asDays() === 0; });
                if (item.length > 0) {
                    $(element).css("background-color", "#108ce2");
                    $(element).css("color", "white");
                    $(element).css("margin", "2px");
                    $(element).addClass("has-data");
                    tooltip.show(element, item[0].TSE_COUNT, { classes: "qtip-dark qtip-custom" }, { my: "bottom center", at: "top center", target: $(element) });
                }
            }
        });
    }

    var BuildCalendar = function () {
        $.when(GetCounts()).done(function (d) {
            data = d.data;
            CalendarCtrl();
            SetData(d.data);
        });
    }

    var AutoComplete = function () {
        $("#customer").autocomp({
            listurl: "/Api/ApiCustomers/List",
            geturl: "/Api/ApiCustomers/Get",
            field: "CUS_CODE",
            textfield: "CUS_DESC",
            active: "CUS_ACTIVE",
            callback: function (data) {
                $("#branch").val("");
                tooltip.hide("#branch");
            }
        });
        $("#branch").autocomp({
            listurl: "/Api/ApiBranches/List",
            geturl: "/Api/ApiBranches/Get",
            field: "BRN_CODE",
            textfield: "BRN_DESC",
            active: "BRN_ACTIVE",
            filter: [
                { field: "BRN_CUSTOMER", relfield: "#customer", includeall: false }
            ]
        });
        $("#type").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            active: "TYP_ACTIVE",
            filter: [
                { field: "TYP_CODE", value: "*", operator: "neq" },
                { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
            ]
        });
        $("#equipment").autocomp({
            listurl: "/Api/ApiEquipments/List",
            geturl: "/Api/ApiEquipments/Get",
            field: "EQP_CODE",
            textfield: "EQP_DESC",
            active: "EQP_ACTIVE",
            screen: "M_EQUIPMENTS",
            callback: function (d) {
                tooltip.hide("#equipment");
                $("#equipment").data("id", (d ? d.EQP_ID : null));
                $("#equipment").val(d ? d.EQP_CODE : "");
                if (d) {
                    tooltip.show("#equipment", d.EQP_DESC);
                }
            }
        });
    }

    var BuildModals = function () {
        $("#btncustomer").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customer[lang].title,
                listurl: "/Api/ApiCustomers/List",
                keyfield: "CUS_CODE",
                codefield: "CUS_CODE",
                textfield: "CUS_DESC",
                returninput: "#customer",
                columns: [
                    { type: "string", field: "CUS_CODE", title: gridstrings.customer[lang].code, width: 100 },
                    { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 300 }
                ],
                filter: [
                    { field: "CUS_ACTIVE", value: "+", operator: "eq" }
                ],
                callback: function (data) {
                    $("#branch").val("");
                    tooltip.hide("#branch");
                }
            });
        });
        $("#btnbranch").click(function () {
            gridModal.show({
                modaltitle: gridstrings.branches[lang].title,
                listurl: "/Api/ApiBranches/List",
                keyfield: "BRN_CODE",
                codefield: "BRN_CODE",
                textfield: "BRN_DESC",
                returninput: "#branch",
                columns: [
                    { type: "string", field: "BRN_CODE", title: gridstrings.branches[lang].code, width: 100 },
                    { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 400 },
                    { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                ],
                filter: [
                    { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                    { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                ]
            });
        });
        $("#btntype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESC",
                returninput: "#type",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                ]
            });
        });
        $("#btnequipment").click(function () {
            gridModal.show({
                modaltitle: gridstrings.equipments[lang].title,
                listurl: "/Api/ApiEquipments/List",
                keyfield: "EQP_CODE",
                codefield: "EQP_CODE",
                textfield: "EQP_DESC",
                returninput: "#equipment",
                screen: "M_EQUIPMENTS",
                columns: [
                    { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 100 },
                    { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 300 },
                    { type: "string", field: "EQP_TYPE", title: gridstrings.equipments[lang].eqptype, width: 250 },
                    { type: "string", field: "EQP_CUSTOMERDESC", title: gridstrings.equipments[lang].eqpcustomerdesc, width: 300 },
                    { type: "string", field: "EQP_BRANCHDESC", title: gridstrings.equipments[lang].eqpbranchdesc, width: 300 },
                    { type: "string", field: "EQP_BRANDDESC", title: gridstrings.equipments[lang].branddesc, width: 250 },
                    { type: "string", field: "EQP_MODEL", title: gridstrings.equipments[lang].model, width: 250 },
                    { type: "string", field: "EQP_SERIALNO", title: gridstrings.equipments[lang].serialno, width: 250 }
                ],
                filter: [
                    { field: "EQP_ACTIVE", value: "+", operator: "eq" }
                ],
                callback: function (d) {
                    tooltip.hide("#equipment");
                    $("#equipment").data("id", (d ? d.EQP_ID : null));
                    $("#equipment").val(d ? d.EQP_CODE : "");
                    if (d) {
                        tooltip.show("#equipment", d.EQP_DESC);
                    }
                }
            });
        });
    }

    var RegisterUIEvents = function () {
        BuildModals();
        AutoComplete();
        commentsHelper = new comments({
            input: "#comment",
            chkvisibletocustomer: "#visibletocustomer",
            chkvisibletosupplier: "#visibletosupplier",
            btnaddcomment: "#addComment",
            modal: "#modalcomments",
            commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
            commentsdiv: "#comments"
        });
        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
            modal: "#modaldocuments",
            documentsdiv: "#docs",
            progressbar: "#docuprogress"
        });

        $("#btnfilter").on("click",
            function () {
                $("#date").text("");
                customer = $("#customer").val() || null;
                branch = $("#branch").val() || null;
                equipmenttype = $("#type").val() || null;
                equipmentid = $("#equipment").data("id") || null;
                if (grdEquipmentCalendarTaskList) {
                    grdEquipmentCalendarTaskList.ClearData();
                    grdEquipmentCalendarTaskList = null;
                }
                return $.when(GetCounts()).done(function (d) {
                    data = d.data;
                    SetData(d.data);
                });
            });

    }

    var Ready = function () {
        BuildCalendar();
        RegisterUIEvents();
    }

    $(document).ready(Ready);


}());