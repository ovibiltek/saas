(function () {
    var selectedrecord = null;
    var scr, cust, prce, tsk, cca, cec, tsm,cte ;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "pricing",
            btns: []
        },
        {
            name: "tasks",
            btns: []
        },
        {
            name: "checkamount",
            btns: []
        },
        {
            name: "eqpconfig",
            btns: []
        },
        {
            name: "taskstatusmail",
            btns: []
        },
        {
            name: "kpi",
            btns: []
        }
    ];


    tsm = new function () {
        var grdTaskStatusMail = null;
        var grdTaskStatusMailElm = $("#grdTaskStatusMail");
        var selectedTaskStatusMailConfig = null;
        var self = this;

        var Delete = function () {
            if (selectedTaskStatusMailConfig) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskStatusMailConfig/DelRec",
                            data: JSON.stringify(selectedTaskStatusMailConfig.TSM_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var Save = function () {
            if (!tms.Check("#taskstatusmail"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                TSM_ID: selectedTaskStatusMailConfig != null ? selectedTaskStatusMailConfig.TSM_ID : 0,
                TSM_CUSTOMER: selectedrecord.CUS_CODE,
                TSM_STATUSENTITY: "TASK",
                TSM_STATUS: ($("#taskstatus").val() || null),
                TSM_INCCATEGORIES: ($("#taskinccategories").val() || null),
                TSM_EXCCATEGORIES: ($("#taskexccategories").val() || null),
                TSM_SENDATTACH: $("#addAttachments").prop("checked") ? "+" : "-",
                TSM_BRNCSR: $("#brncsr").prop("checked") ? "+" : "-",
                TSM_BRNREGRESPONSIBLE: $("#brnregresponsible").prop("checked") ? "+" : "-",
                TSM_BRNAUTHORIZED: $("#brnauthorized").prop("checked") ? "+" : "-",
                TSM_CUSPM: $("#brncustomerpm").prop("checked") ? "+" : "-",
                TSM_MAILTO: $("#mailto").val(),
                TSM_CREATED: selectedTaskStatusMailConfig != null ? selectedTaskStatusMailConfig.TSM_CREATED : tms.Now(),
                TSM_CREATEDBY: selectedTaskStatusMailConfig != null ? selectedTaskStatusMailConfig.TSM_CREATEDBY : user,
                TSM_UPDATED: selectedTaskStatusMailConfig != null ? tms.Now() : null,
                TSM_UPDATEDBY: selectedTaskStatusMailConfig != null ? user : null,
                TSM_RECORDVERSION: selectedTaskStatusMailConfig != null ? selectedTaskStatusMailConfig.TSM_RECORDVERSION : 0

            });

            return tms.Ajax({
                url: "/Api/ApiTaskStatusMailConfig/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedTaskStatusMailConfig = d.r;
                   
                    self.List();
                    return self.LoadSelected();
                }
            });
        };
        var itemSelect = function (row) {
            selectedTaskStatusMailConfig = grdTaskStatusMail.GetRowDataItem(row);
            self.LoadSelected();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "taskstatusmail")
                tms.BeforeFill("#taskstatusmail");

            tms.Tab();

            $("#taskstatus").val(selectedTaskStatusMailConfig.TSM_STATUS);
            $("#addAttachments").prop("checked", selectedTaskStatusMailConfig.TSM_SENDATTACH === "+");
            $("#mailto").val(selectedTaskStatusMailConfig.TSM_MAILTO);

            $("#taskinccategories").tagsinput("removeAll");
            if (selectedTaskStatusMailConfig.IncludedCategories && selectedTaskStatusMailConfig.IncludedCategories.length > 0) {
                for (var i = 0; i < selectedTaskStatusMailConfig.IncludedCategories.length; i++) {
                    var category = selectedTaskStatusMailConfig.IncludedCategories[i];
                    $("#taskinccategories").tagsinput("add", { id: category.CAT_CODE, text: category.CAT_DESC }, ["ignore"]);
                }
            }

            $("#taskexccategories").tagsinput("removeAll");
            if (selectedTaskStatusMailConfig.ExcludedCategories && selectedTaskStatusMailConfig.ExcludedCategories.length > 0) {
                for (var i = 0; i < selectedTaskStatusMailConfig.ExcludedCategories.length; i++) {
                    var category = selectedTaskStatusMailConfig.ExcludedCategories[i];
                    $("#taskexccategories").tagsinput("add", { id: category.CAT_CODE, text: category.CAT_DESC }, ["ignore"]);
                }
            }

            $("#brncsr").prop("checked", selectedTaskStatusMailConfig.TSM_BRNCSR === "+");
            $("#brnregresponsible").prop("checked", selectedTaskStatusMailConfig.TSM_BRNREGRESPONSIBLE === "+");
            $("#brnauthorized").prop("checked", selectedTaskStatusMailConfig.TSM_BRNAUTHORIZED === "+");
            $("#brncustomerpm").prop("checked", selectedTaskStatusMailConfig.TSM_CUSPM === "+");
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiTaskStatusMailConfig/Get",
                data: JSON.stringify(selectedTaskStatusMailConfig.TSM_ID),
                fn: function (d) {
                    selectedTaskStatusMailConfig = d.data;
                    selectedTaskStatusMailConfig.IncludedCategories = d.IncludedCategories;
                    selectedTaskStatusMailConfig.ExcludedCategories = d.ExcludedCategories;
                    FillUserInterface();
                }
            });
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var RegisterTabEvents = function () {
            $("#btntaskstatus").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiStatuses/List",
                    keyfield: "STA_CODE",
                    codefield: "STA_CODE",
                    textfield: "STA_DESCF",
                    returninput: "#taskstatus",
                    columns: [
                        { type: "string", field: "STA_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "STA_DESCF", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "STA_ENTITY", value: "TASK", operator: "eq" }
                    ]
                });
            });
            $("#btnSaveTaskStatusMail").click(Save);
            $("#btnAddTaskStatusMail").click(self.ResetUI);
            $("#btnDeleteTaskStatusMail").click(Delete);
            $("#btntaskinccategories").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    multiselect: true,
                    returninput: "#taskinccategories",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CAT_CODE", value: "*", operator: "neq" }]
                });
            });
            $("#btntaskexccategories").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    multiselect: true,
                    returninput: "#taskexccategories",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CAT_CODE", value: "*", operator: "neq" }]
                });
            });
        };
        this.ResetUI = function () {
            selectedTaskStatusMailConfig = null;
            tms.Reset("#taskstatusmail");

            $("#taskstatus").val("");
            $("#taskinccategories").tagsinput("removeAll");
            $("#taskexccategories").tagsinput("removeAll");
            $("#mailto").val("");
            $("#addAttachments").prop("checked", false);
            $("#brncsr").prop("checked", false);
            $("#brnregresponsible").prop("checked", false);
            $("#brnauthorized").prop("checked", false);
            $("#brncustomerpm").prop("checked", false);

        };
        this.List = function () {
            var grdFilter = [
             { field: "TSM_CUSTOMER", value: selectedrecord.CUS_CODE, operator: "eq", logic: "and" }
            ];
            if (grdTaskStatusMail) {
                grdTaskStatusMail.ClearSelection();
                grdTaskStatusMail.RunFilter(grdFilter);
            } else {
                grdTaskStatusMail = new Grid({
                    keyfield: "TSM_ID",
                    columns: [
                        {
                            type: "number",
                            field: "TSM_ID",
                            title: gridstrings.taskstatusmails[lang].id,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSM_STATUS",
                            title: gridstrings.taskstatusmails[lang].status,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSM_INCCATEGORIES",
                            title: gridstrings.taskstatusmails[lang].includedcategories,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_EXCCATEGORIES",
                            title: gridstrings.taskstatusmails[lang].excludedcategories,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_SENDATTACH",
                            title: gridstrings.taskstatusmails[lang].attach,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_MAILTO",
                            title: gridstrings.taskstatusmails[lang].mailto,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_BRNCSR",
                            title: gridstrings.taskstatusmails[lang].brncsr,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_BRNREGRESPONSIBLE",
                            title: gridstrings.taskstatusmails[lang].brnregresponsible,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_BRNAUTHORIZED",
                            title: gridstrings.taskstatusmails[lang].brnauthorized,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_CUSPM",
                            title: gridstrings.taskstatusmails[lang].brncustomerpm,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_CREATEDBY",
                            title: gridstrings.taskstatusmails[lang].createdby,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "TSM_CREATED",
                            title: gridstrings.taskstatusmails[lang].created,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "TSM_UPDATED",
                            title: gridstrings.taskstatusmails[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSM_UPDATEDBY",
                            title: gridstrings.taskstatusmails[lang].updatedby,
                            width: 150
                        }
                    ],
                    datasource: "/Api/ApiTaskStatusMailConfig/List",
                    selector: "#grdTaskStatusMail",
                    name: "grdTaskStatusMail",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "TSM_ID", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Activities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    change: gridChange
                });
            }

        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };
        RegisterTabEvents();
    };
    cec = new function () {
        var grdEqpconfig = null;
        var $grdEqpconfig = $("#grdEqpconfig");
        var selectedequipmentconfig = null;
        var self = this;

        this.Delete = function () {
            if (selectedequipmentconfig) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiCustomerEquipmentConfig/DelRec",
                            data: JSON.stringify(selectedequipmentconfig.CEC_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var itemSelect = function (row) {
            selectedequipmentconfig = grdEqpconfig.GetRowDataItem(row);
            self.LoadSelected();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "eqpconfig")
                tms.BeforeFill("#eqpconfig");

            tms.Tab();

            if (selectedequipmentconfig.tasktypes) {
                for (var i = 0; i < selectedequipmentconfig.tasktypes.length; i++)
                    $("#eqpconfigtasktype").tagsinput("add",
                        { 
                            id: selectedequipmentconfig.tasktypes[i].SYC_CODE, 
                            text:  selectedequipmentconfig.tasktypes[i].SYC_DESCRIPTION
                        },
                        ["ignore"]);
            }

            $("#eqpconfigtaskcategory").val(selectedequipmentconfig.CEC_TSKCAT);
            tooltip.show("#eqpconfigtasktype", selectedequipmentconfig.CEC_TSKCATDESC);
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiCustomerEquipmentConfig/Get",
                data: JSON.stringify(selectedequipmentconfig.CEC_ID),
                fn: function (d) {
                    selectedequipmentconfig = d.data;
                    selectedequipmentconfig.tasktypes = d.tasktypes;
                    FillUserInterface();
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#eqpconfig"))
                return $.Deferred().reject();

            if ($("#eqpconfigtasktype").tagsinput("items").length <= 0) {
                msgs.error(applicationstrings[lang].tasktypeerr);
                return $.Deferred().reject();
            }

            var o = JSON.stringify({
                CEC_ID: selectedequipmentconfig != null ? selectedequipmentconfig.CEC_ID : 0,
                CEC_TSKTYPE: $("#eqpconfigtasktype").val(),
                CEC_TSKTYPEENTITY: "TASK",
                CEC_TSKCAT: $("#eqpconfigtaskcategory").val(),
                CEC_CUSTOMER: selectedrecord.CUS_CODE,
                CEC_CREATED: selectedequipmentconfig != null ? selectedequipmentconfig.CEC_CREATED : tms.Now(),
                CEC_CREATEDBY: selectedequipmentconfig != null ? selectedequipmentconfig.CEC_CREATEDBY : user,
                CEC_UPDATED: selectedequipmentconfig != null ? tms.Now() : null,
                CEC_UPDATEDBY: selectedequipmentconfig != null ? user : null,
                CEC_RECORDVERSION: selectedequipmentconfig != null ? selectedequipmentconfig.CEC_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiCustomerEquipmentConfig/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedequipmentconfig = d.r;
                    self.List();
                    return self.LoadSelected();
                }
            });
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [
                { field: "CEC_CUSTOMER", value: selectedrecord.CUS_CODE, operator: "eq", logic: "and" }
            ];
            if (grdEqpconfig) {
                grdEqpconfig.ClearSelection();
                grdEqpconfig.RunFilter(grdFilter);
            } else {
                grdEqpconfig = new Grid({
                    keyfield: "CEC_ID",
                    columns: [
                        {
                            type: "number",
                            field: "CEC_ID",
                            title: gridstrings.customereqpconfig[lang].id,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "CEC_TSKTYPE",
                            title: gridstrings.customereqpconfig[lang].tsktype,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "CEC_TSKCAT",
                            title: gridstrings.customereqpconfig[lang].tskcat,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "CEC_CREATED",
                            title: gridstrings.customereqpconfig[lang].created,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CEC_CREATEDBY",
                            title: gridstrings.customereqpconfig[lang].createdby,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "CEC_UPDATED",
                            title: gridstrings.customereqpconfig[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CEC_UPDATEDBY",
                            title: gridstrings.customereqpconfig[lang].updatedby,
                            width: 150
                        }
                    ],
                    datasource: "/Api/ApiCustomerEquipmentConfig/List",
                    selector: "#grdEqpconfig",
                    name: "grdEqpconfig",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "CEC_ID", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Activities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    change: gridChange
                });
            }
        };
        var RegisterTabEvents = function () {
            $("#btnAddEqpconfig").click(self.ResetUI);
            $("#btnSaveEqpconfig").click(self.Save);
            $("#btnDeleteEqpconfig").click(self.Delete);
            $("#btneqpconfigtasktype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_CODE",
                    returninput: "#eqpconfigtasktype",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
                    ]
                });
            });
            $("#eqpconfigtaskcategory").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                active: "CAT_ACTIVE",
                callback: function (d) {
                }
            });
            $("#btneqpconfigtaskcategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#eqpconfigtaskcategory",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }],
                    callback: function (d) {

                    }
                });
            });
        };
        this.ResetUI = function () {
            selectedequipmentconfig = null;
            tms.Reset("#eqpconfig");

            $("#eqpconfigtasktype").val("");
            $("#eqpconfigtasktype").tagsinput("removeAll");
            $("#eqpconfigtaskcategory").val("");
        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };

        RegisterTabEvents();
    };
    tsk = new function () {
        var self = this;
        var grdCustomerTasks = null;
        var grdCustomerTasksElm = $("#grdCustomerTasks");
        var gridfilter = [];

        function itemSelect(row) {
            grdCustomerTasksElm.find("[data-id]").removeClass("k-state-selected");
            row.addClass("k-state-selected");
        }
        var gridDataBound = function () {
            grdCustomerTasksElm.find("[data-id]").unbind("click").click(function () {
                itemSelect($(this));
            });
            grdCustomerTasksElm.contextMenu({
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
        };
        this.List = function () {
            gridfilter.push({ field: "TSK_CUSTOMER", value: selectedrecord.CUS_CODE, operator: "eq", logic: "and" });
            if (grdCustomerTasks) {
                grdCustomerTasks.ClearSelection();
                grdCustomerTasks.RunFilter(gridfilter);
            } else {
                if ($.inArray("*", authorizeddepartmentsarr) === -1) {
                    gridfilter.push({ IsPersistent: true, field:"ACTIVITYDEPARTMENTAUTHTABLE.TSKID", value: user, operator: "func", logic: "or" });
                    gridfilter.push({ IsPersistent: true, field: "TSK_DEPARTMENT", value: authorizeddepartmentsarr, operator: "in", logic: "or" });
                }

                grdCustomerTasks = new Grid({
                    keyfield: "TSK_ID",
                    columns: [
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
                            width: 300
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
                        {
                            type: "string",
                            field: "TSK_CREATEDBY",
                            title: gridstrings.tasklist[lang].createdby,
                            width: 250
                        },
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
                        {
                            type: "string",
                            field: "TSK_REQUESTEDBY",
                            title: gridstrings.tasklist[lang].requestedby,
                            width: 250
                        },
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
                        }
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
                        TSK_PSPCODE: { type: "number" }
                    },
                    datasource: "/Api/ApiTask/List",
                    selector: "#grdCustomerTasks",
                    name: "grdCustomerTasks",
                    height: constants.defaultgridheight - 100,
                    primarycodefield: "TSK_ID",
                    primarytextfield: "TSK_SHORTDESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    hasfiltermenu: false,
                    sort: [{ field: "TSK_ID", dir: "desc" }],
                    toolbarColumnMenu: false,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Tasks.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
    };
    prce = new function () {
        var grdPricing = null;
        var $grdPricing = $("#grdPricing");
        var selectedPricing = null;
        var self = this;

        var ShowPricingParameterDetails = function (pricingParameterCode) {
            return tms.Ajax({
                url: "/Api/ApiPricingParameters/Get",
                data: JSON.stringify(pricingParameterCode),
                fn: function (d) {
                    var pricingparameterdetails = $("#pricingparameterdetails");
                    pricingparameterdetails.find("*").remove();

                    var strdetailsblock = "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].servicefee;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_SERVICEFEE;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    strdetailsblock += "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].hourlyfee;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_HOURLYFEE;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    strdetailsblock += "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].criticaltimevalue;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_CRITICALTIMEVALUE;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    strdetailsblock += "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].currency;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_CURRENCY;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    pricingparameterdetails.append(strdetailsblock);
                }
            });
        }
        var FillPPRUI = function () {
            if (selectedPricing) {
                tms.BeforeFill("#pricing");

                $("#pricingcode").val(selectedPricing.PPR_PRICINGCODE);
                $("#startdate").val(moment(selectedPricing.PPR_STARTDATE).format(constants.dateformat));
                $("#enddate").val(moment(selectedPricing.PPR_ENDDATE).format(constants.dateformat));
                $("#taskcategory").val(selectedPricing.PPR_TASKCATEGORY);
                $("#periodictask").val(selectedPricing.PPR_PERIODICTASK);
                $("#note").val(selectedPricing.PPR_NOTE);

                tooltip.show("#pricingcode", selectedPricing.PPR_PRICINGDESC);
                tooltip.show("#taskcategory", selectedPricing.PPR_TASKCATEGORYDESC);
                tooltip.show("#periodictask", selectedPricing.PPR_PERIODICTASKDESC);

                ShowPricingParameterDetails(selectedPricing.PPR_PRICINGCODE);

                if (selectedPricing.PPR_TASKCATEGORY === "BK")
                    $("#divperiodictask").removeClass("hidden");
                else
                    $("#divperiodictask").addClass("hidden");
            }
        };
        var LoadSelectedPPR = function () {
            return tms.Ajax({
                url: "/Api/ApiPricingParameterRelations/Get",
                data: JSON.stringify(selectedPricing.PPR_ID),
                fn: function (d) {
                    selectedPricing = d.data;
                    FillPPRUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedPricing = grdPricing.GetRowDataItem(row);
            LoadSelectedPPR();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [
                { field: "PPR_ENTITY", value: "CUSTOMER", operator: "eq", logic: "and" },
                { field: "PPR_CODE", value: selectedrecord.CUS_CODE, operator: "eq", logic: "and" }
            ];
            if (grdPricing) {
                grdPricing.ClearSelection();
                grdPricing.RunFilter(grdFilter);
            } else {
                grdPricing = new Grid({
                    keyfield: "PPR_ID",
                    columns: [
                        {
                            type: "string",
                            field: "PPR_PRICINGCODE",
                            title: gridstrings.pricingparameterrelations[lang].pricingcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PPR_PRICINGDESC",
                            title: gridstrings.pricingparameterrelations[lang].description,
                            width: 450
                        },
                        {
                            type: "date",
                            field: "PPR_STARTDATE",
                            title: gridstrings.pricingparameterrelations[lang].startdate,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "PPR_ENDDATE",
                            title: gridstrings.pricingparameterrelations[lang].enddate,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PPR_TASKCATEGORY",
                            title: gridstrings.pricingparameterrelations[lang].taskcategory,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PPR_TASKCATEGORYDESC",
                            title: gridstrings.pricingparameterrelations[lang].taskcategorydesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PPR_PERIODICTASK",
                            title: gridstrings.pricingparameterrelations[lang].periodictask,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PPR_PERIODICTASKDESC",
                            title: gridstrings.pricingparameterrelations[lang].periodictaskdesc,
                            width: 250
                        }
                    ],
                    datasource: "/Api/ApiPricingParameterRelations/List",
                    selector: "#grdPricing",
                    name: "grdPricing",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "PPR_ID", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Activities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#pricing"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PPR_ID: (selectedPricing != null ? selectedPricing.PPR_ID : 0),
                PPR_ENTITY: "CUSTOMER",
                PPR_CODE: selectedrecord.CUS_CODE,
                PPR_PRICINGCODE: $("#pricingcode").val().toUpper(),
                PPR_STARTDATE: moment.utc($("#startdate").val(), constants.dateformat),
                PPR_ENDDATE: moment.utc($("#enddate").val(), constants.dateformat),
                PPR_TASKCATEGORY: $("#taskcategory").val(),
                PPR_PERIODICTASK: ($("#periodictask").val() || null),
                PPR_NOTE: ($("#note").val() || null),
                PPR_CREATED: selectedPricing != null ? selectedPricing.PPR_CREATED : tms.Now(),
                PPR_CREATEDBY: selectedPricing != null ? selectedPricing.PPR_CREATEDBY : user,
                PPR_UPDATED: selectedPricing != null ? tms.Now() : null,
                PPR_UPDATEDBY: selectedPricing != null ? user : null,
                PPR_RECORDVERSION: selectedPricing != null ? selectedPricing.PPR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPricingParameterRelations/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedPricing) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPricingParameterRelations/DelRec",
                            data: JSON.stringify(selectedPricing.PPR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.ResetUI = function () {
            selectedPricing = null;
            tms.Reset("#pricing");

            $("#pricingcode").val("");
            $("#startdate").val("");
            $("#enddate").val("");
            $("#taskcategory").val("");
            $("#periodictask").val("");
            $("#note").val("");

            tooltip.hide("#pricingcode");
            tooltip.hide("#taskcategory");
            tooltip.hide("#periodictask");

            $("#divperiodictask").addClass("hidden");
            $("#pricingparameterdetails").find("*").remove();
        };
        var RegisterTabEvents = function () {
            $("#btnAddPricing").click(self.ResetUI);
            $("#btnSavePricing").click(self.Save);
            $("#btnDeletePricing").click(self.Delete);

            $("#pricingcode").autocomp({
                listurl: "/Api/ApiPricingParameters/List",
                geturl: "/Api/ApiPricingParameters/Get",
                field: "PRP_CODE",
                textfield: "PRP_DESC",
                active: "PRP_ACTIVE",
                filter: [{ field: "PRP_ORG", relfield: "#org", includeall: true }],
                callback: function (d) {
                    if (d)
                        ShowPricingParameterDetails(d.PRP_CODE);
                }
            });
            $("#btnpricingcode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.pricingparameters[lang].title,
                    listurl: "/Api/ApiPricingParameters/List",
                    keyfield: "PRP_CODE",
                    codefield: "PRP_CODE",
                    textfield: "PRP_DESC",
                    returninput: "#pricingcode",
                    columns: [
                        {
                            type: "string",
                            field: "PRP_CODE",
                            title: gridstrings.pricingparameters[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PRP_DESC",
                            title: gridstrings.pricingparameters[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "PRP_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "PRP_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (d) {
                        if (d)
                            ShowPricingParameterDetails(d.PRP_CODE);
                    }
                });
            });
            $("#btnperiodictask").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.periodictasks[lang].title,
                    listurl: "/Api/ApiPeriodicTasks/List",
                    keyfield: "PTK_CODE",
                    codefield: "PTK_CODE",
                    textfield: "PTK_DESC",
                    returninput: "#periodictask",
                    columns: [
                        {
                            type: "string",
                            field: "PTK_CODE",
                            title: gridstrings.periodictasks[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PTK_DESC",
                            title: gridstrings.periodictasks[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "PTK_ORGANIZATION", value: [selectedrecord.CUS_ORG, "*"], operator: "in" },
                        { field: "PTK_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#periodictask").autocomp({
                listurl: "/Api/ApiPeriodicTasks/List",
                geturl: "/Api/ApiPeriodicTasks/Get",
                field: "PTK_CODE",
                textfield: "PTK_DESC",
                active: "PTK_ACTIVE",
                filter: [{ field: "PTK_ORGANIZATION", func: function () { return [selectedrecord.CUS_ORG, "*"] }, operator: "in" }]
            });
            $("#taskcategory").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                active: "CAT_ACTIVE",
                callback: function (d) {
                    $("#periodictask").val();
                    tooltip.hide("#periodictask");
                    if (d && d.CAT_CODE === "BK")
                        $("#divperiodictask").removeClass("hidden");
                    else
                        $("#divperiodictask").addClass("hidden");
                }
            });
            $("#btntaskcategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#taskcategory",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }],
                    callback: function (d) {
                        $("#periodictask").val();
                        tooltip.hide("#periodictask");
                        if (d && d.CAT_CODE === "BK")
                            $("#divperiodictask").removeClass("hidden");
                        else
                            $("#divperiodictask").addClass("hidden");
                    }
                });
            });
        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };

        RegisterTabEvents();
    };
    cust = new function () {

        var self = this;
        var grdCustomers = null;
        var grdCustomersElm = $("#grdCustomers");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var pmmaster = null;

        this.ResetUI = function () {

            selectedrecord = null;
            pmmaster = null;

            tms.Reset("#record");
            $("#btnBrowse").attr("disabled", "disabled");

            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#title").val("");
            $("#accountcode").val("");
            $("#paymentperiod").val("");
            $("#progresspaymentperiod").val("");
            $("#phone01").val("");
            $("#phone02").val("");
            $("#email").val("");
            $("#postalcode").val("");
            $("#fax").val("");
            $("#web").val("");
            $("#contactperson01").val("");
            $("#contactperson02").val("");
            $("#taxoffice").val("");
            $("#taxno").val("");
            $("#priority").val("");
            $("#emergencyrespondtime").val("");
            $("#province").val("");
            $("#district").val("");
            $("#address").val("");
            $("#sector").val("");
            $("#workingstatus").val("");
            $("#csr").val("");
            $("#oo").val("");
            $("#pm").tagsinput("removeAll");
            $("#sa").val("");
            $("#reportingresponsible").val("");
            $("#pspresponsible").val("");
            $("#branchprefix").val("");

            $("#type").val("");
            $("#notify").val("");
            $("#billingaddress").val("");
            $("#notes").val("");
            $("#customergroup").val("");
            $("#checkstartlabordistance").prop("checked", false);
            $("#checkendlabordistance").prop("checked", false);

            $("#active").prop("checked", true);
            $("#barcodelength").val("");

            tooltip.hide("#org");
            tooltip.hide("#sector");
            tooltip.hide("#workingstatus");
            tooltip.hide("#oo");
            tooltip.hide("#sa");
            tooltip.hide("#pspresponsible");
            tooltip.hide("#reportingresponsible");
            tooltip.hide("#type");
            tooltip.hide("#customergroup");
            tooltip.hide("#province");
            tooltip.hide("#district");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCUSTOMERS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE"
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "CUSTOMER", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "CUSTOMER",
                            source: null,
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#oo").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
            $("#sa").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
            $("#reportingresponsible").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
            $("#pspresonsible").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
            $("#customergroup").autocomp({
                listurl: "/Api/ApiCustomerGroups/List",
                geturl: "/Api/ApiCustomerGroups/Get",
                field: "CUG_CODE",
                textfield: "CUG_DESC",
                active: "CUG_ACTIVE"
            });
            $("#sector").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "SECTOR", operator: "eq" }]
            });
            $("#workingstatus").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "CUSWORKINGSTATUS", operator: "eq" }],
                callback: function (data) {
                    if (data) {
                        $("#paymentperiod").removeAttr("required").removeClass("required");
                        if (data.SYC_CODE === "REEL") {
                            $("#paymentperiod").attr("required", "required").addClass("required");
                        }
                    }
                }
            });
            $("#province").autocomp({
                listurl: "/Api/ApiAddressSections/List",
                geturl: "/Api/ApiAddressSections/Get",
                field: "ADS_CODE",
                textfield: "ADS_DESC",
                active: "ADS_ACTIVE",
                filter: [
                    { field: "ADS_TYPE", value: "IL", operator: "eq" }
                ]
            });
            $("#district").autocomp({
                listurl: "/Api/ApiAddressSections/List",
                geturl: "/Api/ApiAddressSections/Get",
                field: "ADS_CODE",
                textfield: "ADS_DESC",
                active: "ADS_ACTIVE",
                filter: [
                    { field: "ADS_TYPE", value: "ILCE", operator: "eq" },
                    { field: "ADS_PARENT", func: function () { return $("#province").val() }, operator: "eq" }
                ]
            });
        };
        var BuildModals = function () {
            $("#btnorg").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/ListUserOrganizations",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#org",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: {
                        filter: {
                            filters: [
                                { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    }
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
                        { field: "TYP_ENTITY", value: "CUSTOMER", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "CUSTOMER",
                                source: null,
                                type: data.TYP_CODE
                            });
                        }
                    }
                });
            });
            $("#btnoo").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#oo",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnsa").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#sa",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnreportingresponsible").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#reportingresponsible",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });

            $("#btnpmusers").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#pm",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnpspresponsible").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#pspresponsible",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btncustomergroup").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.customergroups[lang].title,
                    listurl: "/Api/ApiCustomerGroups/List",
                    keyfield: "CUG_CODE",
                    codefield: "CUG_CODE",
                    textfield: "CUG_DESC",
                    returninput: "#customergroup",
                    columns: [
                        { type: "string", field: "CUG_CODE", title: gridstrings.customergroups[lang].code, width: 100 },
                        { type: "string", field: "CUG_DESC", title: gridstrings.customergroups[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "CUG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnsector").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#sector",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "SECTOR", operator: "eq" }
                    ]
                });
            });
            $("#btnworkingstatus").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#workingstatus",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "CUSWORKINGSTATUS", operator: "eq" }
                    ],
                    callback: function (data) {
                        if (data) {
                            $("#paymentperiod").removeAttr("required").removeClass("required");
                            if (data.SYC_CODE === "REEL") {
                                $("#paymentperiod").attr("required", "required").addClass("required");
                            }
                        }
                    }
                });
            });
            $("#btnprovince").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.addresssection[lang].title,
                    listurl: "/Api/ApiAddressSections/List",
                    keyfield: "ADS_CODE",
                    codefield: "ADS_CODE",
                    textfield: "ADS_DESC",
                    returninput: "#province",
                    columns: [
                        { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "ADS_DESC",
                            title: gridstrings.addresssection[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                        { field: "ADS_TYPE", value: "IL", operator: "eq" }
                    ]
                });
            });
            $("#btndistrict").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.addresssection[lang].title,
                    listurl: "/Api/ApiAddressSections/List",
                    keyfield: "ADS_CODE",
                    codefield: "ADS_CODE",
                    textfield: "ADS_DESC",
                    returninput: "#district",
                    columns: [
                        { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "ADS_DESC",
                            title: gridstrings.addresssection[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                        { field: "ADS_TYPE", value: "ILCE", operator: "eq" },
                        { field: "ADS_PARENT", value: $("#province").val(), operator: "eq" }
                    ]
                });
            });
        };
        var FillPMUsers = function (pmUsers) {
            $("#pm").tagsinput("removeAll");
            if (pmUsers && pmUsers.length > 0) {
                for (var i = 0; i < pmUsers.length; i++) {
                    var user = pmUsers[i];
                    $("#pm").tagsinput("add", { id: user.USR_CODE, text: user.USR_DESC, primary: (pmmaster === user.USR_CODE ? "+" : "-") }, ["ignore"]);
                }
            }
        }
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#btnBrowse").removeAttr("disabled");

            
            $("#code").val(selectedrecord.CUS_CODE);
            $("#desc").val(selectedrecord.CUS_DESC);
            $("#org").val(selectedrecord.CUS_ORG);
            $("#title").val(selectedrecord.CUS_TITLE);
            $("#accountcode").val(selectedrecord.CUS_ACCOUNTCODE);
            $("#paymentperiod").val(selectedrecord.CUS_PAYMENTPERIOD);
            $("#progresspaymentperiod").val(selectedrecord.CUS_PROGRESSPAYMENTPERIOD);
            $("#phone01").val(selectedrecord.CUS_PHONE01);
            $("#phone02").val(selectedrecord.CUS_PHONE02);
            $("#fax").val(selectedrecord.CUS_FAX);
            $("#web").val(selectedrecord.CUS_WEB);
            $("#email").val(selectedrecord.CUS_EMAIL);
            $("#postalcode").val(selectedrecord.CUS_POSTALCODE);
            $("#contactperson01").val(selectedrecord.CUS_CONTACTPERSON01);
            $("#contactperson02").val(selectedrecord.CUS_CONTACTPERSON02);
            $("#taxoffice").val(selectedrecord.CUS_TAXOFFICE);
            $("#taxno").val(selectedrecord.CUS_TAXNO);
            $("#priority").val(selectedrecord.CUS_PRIORITY);
            $("#emergencyrespondtime").val(selectedrecord.CUS_EMERGENCYRESPONDTIME);
            $("#province").val(selectedrecord.CUS_PROVINCE);
            $("#district").val(selectedrecord.CUS_DISTRICT);
            $("#address").val(selectedrecord.CUS_ADDRESS);
            $("#sector").val(selectedrecord.CUS_SECTOR);
            $("#workingstatus").val(selectedrecord.CUS_WORKINGSTATUS);
            $("#type").val(selectedrecord.CUS_TYPE);
            $("#csr").val(selectedrecord.CUS_CSR);
            $("#oo").val(selectedrecord.CUS_OO);
            $("#sa").val(selectedrecord.CUS_SA);
            $("#pspresponsible").val(selectedrecord.CUS_PSP);
            $("#reportingresponsible").val(selectedrecord.CUS_REPORTINGRESPONSIBLE);
            $("#branchprefix").val(selectedrecord.CUS_BRANCHPREFIX);
            $("#billingaddress").val(selectedrecord.CUS_BILLINGADDRESS);
            $("#barcodelength").val(selectedrecord.CUS_BARCODELENGTH);
            $("#notes").val(selectedrecord.CUS_NOTES);
            $("#customergroup").val(selectedrecord.CUS_GROUP);
            $("#notify").prop("checked", selectedrecord.CUS_NOTIFY === "+");
            $("#active").prop("checked", selectedrecord.CUS_ACTIVE === "+");
            $("#checkstartlabordistance").prop("checked", selectedrecord.CUS_CHECKSTARTLABORDISTANCE === "+");
            $("#checkendlabordistance").prop("checked", selectedrecord.CUS_CHECKENDLABORDISTANCE === "+");

            tooltip.show("#org", selectedrecord.CUS_ORGDESC);
            tooltip.show("#sector", selectedrecord.CUS_SECTORDESC);
            tooltip.show("#workingstatus", selectedrecord.CUS_WORKINGSTATUSDESC);
            tooltip.show("#oo", selectedrecord.CUS_OODESC);
            tooltip.show("#sa", selectedrecord.CUS_SADESC);
            tooltip.show("#pspresponsible", selectedrecord.CUS_PSPDESC);

            tooltip.show("#reportingresponsible", selectedrecord.CUS_REPORTINGRESPONSIBLEDESC);

            tooltip.show("#type", selectedrecord.CUS_TYPEDESC);
            tooltip.show("#customergroup", selectedrecord.CUS_GROUPDESC);
            tooltip.show("#province", selectedrecord.CUS_PROVINCEDESC);
            tooltip.show("#district", selectedrecord.CUS_DISTRICTDESC);

            $(".page-header>h6").html(selectedrecord.CUS_CODE + " - " + selectedrecord.CUS_DESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#paymentperiod").removeAttr("required").removeClass("required");
            if (selectedrecord.CUS_WORKINGSTATUS === "REEL") {
                $("#paymentperiod").attr("required", "required").addClass("required");
            }

            pmmaster = selectedrecord.CUS_PMMASTER;
            commentsHelper.showCommentsBlock({ subject: "CUSTOMER", source: selectedrecord.CUS_CODE });
            documentsHelper.showDocumentsBlock({ subject: "CUSTOMER", source: selectedrecord.CUS_CODE });
            customFieldsHelper.loadCustomFields({ subject: "CUSTOMER", source: selectedrecord.CUS_CODE, type: selectedrecord.CUS_TYPE });
        };
        var ResetFilter = function () {
            $("#createdstart").val("");
            $("#createdstart").val("");
        }
        var RunFilter = function () {
            var gridfilter = [];
            var createdstart = $("#createdstart").val();
            var createdend = $("#createdend").val();
            if (createdend)
                createdend = moment(createdend, constants.dateformat).add(1, "days").format(constants.dateformat);

            if (createdstart && createdend)
                gridfilter.push({ field: "CUS_CREATED", value: createdstart, value2: createdend, operator: "between", logic: "and" });
            if (createdstart && !createdend)
                gridfilter.push({ field: "CUS_CREATED", value: createdstart, operator: "gte", logic: "and" });
            if (!createdstart && createdend)
                gridfilter.push({ field: "CUS_CREATED", value: createdend, operator: "lte", logic: "and" });

            grdCustomers.RunFilter(gridfilter);

            $(".sidebar.right").trigger("sidebar:close");
        }
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiCustomers/Get",
                data: JSON.stringify(selectedrecord.CUS_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                    FillPMUsers(d.pmusers);
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiCustomers/DelRec",
                        data: JSON.stringify(selectedrecord.CUS_CODE),
                        fn: function (d) {
                            msgs.success(d.data);
                            self.ResetUI();
                            self.List();
                        }
                    });
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues({
                    subject: "CUSTOMER",
                    source: $("#code").val().toUpper(),
                    type: $("#type").val()
                });

            var o = JSON.stringify({
                Customer: {
                    CUS_CODE: $("#code").val().toUpper(),
                    CUS_DESC: $("#desc").val(),
                    CUS_ORG: $("#org").val(),
                    CUS_TYPE: $("#type").val(),
                    CUS_TYPEENTITY: "CUSTOMER",
                    CUS_TITLE: ($("#title").val() || null),
                    CUS_ACCOUNTCODE: ($("#accountcode").val() || null),
                    CUS_PAYMENTPERIOD: ($("#paymentperiod").val() || null),
                    CUS_PROGRESSPAYMENTPERIOD: ($("#progresspaymentperiod").val() || null),
                    CUS_EMAIL: ($("#email").val() || null),
                    CUS_PHONE01: ($("#phone01").val() || null),
                    CUS_PHONE02: ($("#phone02").val() || null),
                    CUS_FAX: ($("#fax").val() || null),
                    CUS_WEB: ($("#web").val() || null),
                    CUS_CONTACTPERSON01: ($("#contactperson01").val() || null),
                    CUS_CONTACTPERSON02: ($("#contactperson02").val() || null),
                    CUS_TAXOFFICE: ($("#taxoffice").val() || null),
                    CUS_TAXNO: ($("#taxno").val() || null),
                    CUS_PRIORITY: ($("#priority").val() || null),
                    CUS_PROVINCE: ($("#province").val() || null),
                    CUS_DISTRICT: ($("#district").val() || null),
                    CUS_SECTOR: ($("#sector").val() || null),
                    CUS_WORKINGSTATUS: $("#workingstatus").val(),
                    CUS_CSR: ($("#csr").val() || null),
                    CUS_OO: ($("#oo").val() || null),
                    CUS_PM: ($("#pm").val() || null),
                    CUS_PMMASTER: pmmaster,
                    CUS_SA: ($("#sa").val() || null),
                    CUS_PSP: ($("#pspresponsible").val() || null),
                    CUS_EMERGENCYRESPONDTIME: ($("#emergencyrespondtime").val() || null),
                    CUS_REPORTINGRESPONSIBLE: ($("#reportingresponsible").val() || null),
                    CUS_POSTALCODE: ($("#postalcode").val() || null),
                    CUS_ADDRESS: ($("#address").val() || null),
                    CUS_BILLINGADDRESS: ($("#billingaddress").val() || null),
                    CUS_BARCODELENGTH: ($("#barcodelength").val() || null),
                    CUS_NOTES: ($("#notes").val() || null),
                    CUS_GROUP: ($("#customergroup").val() || null),
                    CUS_NOTIFY: $("#notify").prop("checked") ? "+" : "-",
                    CUS_CHECKSTARTLABORDISTANCE: $("#checkstartlabordistance").prop("checked") ? "+" : "-",
                    CUS_CHECKENDLABORDISTANCE: $("#checkendlabordistance").prop("checked") ? "+" : "-",
                    CUS_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                    CUS_CREATED: selectedrecord != null ? selectedrecord.CUS_CREATED : tms.Now(),
                    CUS_CREATEDBY: selectedrecord != null ? selectedrecord.CUS_CREATEDBY : user,
                    CUS_UPDATED: selectedrecord != null ? tms.Now() : null,
                    CUS_UPDATEDBY: selectedrecord != null ? user : null,
                    CUS_SQLIDENTITY: selectedrecord != null ? selectedrecord.CUS_SQLIDENTITY : 0,
                    CUS_RECORDVERSION: selectedrecord != null ? selectedrecord.CUS_RECORDVERSION : 0,
                    CUS_SEQ: selectedrecord != null ? selectedrecord.CUS_SEQ : null,
                    CUS_REFERENCE: selectedrecord != null ? selectedrecord.CUS_REFERENCE : null,
                    CUS_REFERENCE: $("#branchprefix").val().toUpper(),
                    CUS_BRANCHPREFIX: $("#branchprefix").val(),
                    CUS_BRANCHCOUNT: selectedrecord != null ? selectedrecord.CUS_BRANCHCOUNT:0
                },
                CustomFieldValues: customfieldvalues
            });

            return tms.Ajax({
                url: "/Api/ApiCustomers/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    return self.LoadSelected();
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var activatedTab = e.target.hash; // activated tab
                    switch (activatedTab) {
                        case "#list":
                            selectedrecord = null;
                            cust.List();
                            break;
                        case "#record":
                            $("#btnSave").prop("disabled", false);
                            if (!selectedrecord)
                                cust.ResetUI();
                            else
                                cust.LoadSelected();
                            break;
                        case "#pricing":
                            prce.Ready();
                            break;
                        case "#tasks":
                            tsk.List();
                            break;
                        case "#eqpconfig":
                            cec.List();
                            break;
                        case "#taskstatusmail":
                            tsm.Ready();
                            break;
                        case "#tskeqpcontrol":
                            $.when(cte.LoadTypes()).done(function () {
                                cte.LoadCustomerTaskTypes();
                            });
                            break;
                        case "#checkamount":
                            $.when(cca.LoadCategories()).done(cca.LoadCustomerCategories);
                            break;
                        case "#kpi":
                            dynamicChart.ResetChartTab("#kpi");
                            dynamicChart.GenerateCharts("CUSTOMER", "#kpi", selectedrecord.CUS_CODE);
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterTabEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            RegisterTabChange();

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            $("#filter").click(function () { RunFilter(); });
            $("#clearfilter").click(function () {
                ResetFilter();
                RunFilter();
            });

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });

            AutoComplete();
            BuildModals();
        };
        var ItemSelect = function (row) {
            selectedrecord = grdCustomers.GetRowDataItem(row);
            $(".page-header h6").html(selectedrecord.CUS_CODE + " - " + selectedrecord.CUS_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdCustomersElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdCustomersElm.find("#search").off("click").on("click", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdCustomers) {
                grdCustomers.ClearSelection();
                grdCustomers.RunFilter(gridfilter);
            } else {
                grdCustomers = new Grid({
                    keyfield: "CUS_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "CUS_CODE",
                            title: gridstrings.customer[lang].code,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CUS_DESC",
                            title: gridstrings.customer[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "CUS_TITLE",
                            title: gridstrings.customer[lang].customertitle,
                            width: 250
                        },

                        {
                            type: "string",
                            field: "CUS_ORG",
                            title: gridstrings.customer[lang].organization,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CUS_ORGDESC",
                            title: gridstrings.customer[lang].organizationdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_TYPE",
                            title: gridstrings.customer[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CUS_TYPEDESC",
                            title: gridstrings.customer[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_ACCOUNTCODE",
                            title: gridstrings.customer[lang].accountcode,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "CUS_PAYMENTPERIOD",
                            title: gridstrings.customer[lang].paymentperiod,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "CUS_PROGRESSPAYMENTPERIOD",
                            title: gridstrings.customer[lang].progresspaymentperiod,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_PHONE01",
                            title: gridstrings.customer[lang].phone01,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_PHONE02",
                            title: gridstrings.customer[lang].phone02,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_FAX",
                            title: gridstrings.customer[lang].fax,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_WEB",
                            title: gridstrings.customer[lang].web,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_CSR",
                            title: gridstrings.customer[lang].csr,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_CONTACTPERSON01",
                            title: gridstrings.customer[lang].contactperson01,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_CONTACTPERSON02",
                            title: gridstrings.customer[lang].contactperson02,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_PROVINCEDESC",
                            title: gridstrings.customer[lang].province,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_DISTRICTDESC",
                            title: gridstrings.customer[lang].district,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_TAXOFFICE",
                            title: gridstrings.customer[lang].taxoffice,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_TAXNO",
                            title: gridstrings.customer[lang].taxno,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_PRIORITY",
                            title: gridstrings.customer[lang].priority,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_CHECKSTARTLABORDISTANCE",
                            title: gridstrings.customer[lang].checkstartlabordistance,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CUS_CHECKENDLABORDISTANCE",
                            title: gridstrings.customer[lang].checkendlabordistance,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CUS_ACTIVE",
                            title: gridstrings.customer[lang].active,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CUS_NOTIFY",
                            title: gridstrings.customer[lang].notify,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "CUS_CREATED",
                            title: gridstrings.customer[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_CREATEDBY",
                            title: gridstrings.customer[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "CUS_LASTTASKCREATED",
                            title: gridstrings.customer[lang].lasttaskcreated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_WORKINGSTATUSDESC",
                            title: gridstrings.customer[lang].workingcondition,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CUS_SECTORDESC",
                            title: gridstrings.customer[lang].sector,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_PMDESC",
                            title: gridstrings.customer[lang].pm,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_PSPDESC",
                            title: gridstrings.customer[lang].psp,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_REPORTINGRESPONSIBLEDESC",
                            title: gridstrings.customer[lang].reportingresponsible,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "CUS_UPDATED",
                            title: gridstrings.customer[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_UPDATEDBY",
                            title: gridstrings.customer[lang].updatedby,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CUS_GROUP",
                            title: gridstrings.customer[lang].customergroup,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        CUS_PAYMENTPERIOD: { type: "number" },
                        CUS_PROGRESSPAYMENTPERIOD: { type: "number" },
                        CUS_CREATED: { type: "date" },
                        CUS_LASTTASKCREATED: { type: "date" },
                        CUS_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiCustomers/List",
                    selector: "#grdCustomers",
                    name: "grdCustomers",
                    height: constants.defaultgridheight - 100,
                    primarycodefield: "CUS_CODE",
                    primarytextfield: "CUS_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "CUS_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    hasfiltermenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Customers.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>",
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.BuildUI = function () {
            self.List();
            if (!selectedrecord)
                $("#btnBrowse").attr("disabled", "disabled");

            $("div.bootstrap-tagsinput").contextMenu({
                selector: "span.tag",
                items: {
                    setasprimary: {
                        name: applicationstrings[lang].setasprimary,
                        icon: function (opt, $itemElement, itemKey, item) {
                            $itemElement.html('<span><i class="fa fa-star" aria-hidden="true"></i> ' + item.name + "</span>");
                            return "context-menu-icon-updated";
                        },
                        callback: function (a, b) {
                            $(b.selector).removeClass("label-danger").addClass("label-info");
                            this.removeClass("label-info").addClass("label-danger");
                            pmmaster = this.data().item.id;
                        }
                    }
                }
            });
        };
        RegisterTabEvents();
    };
    cca = new function () {
        var self = this;

        this.LoadCategories = function () {
            var checkamounts = $("#checkamount div.checkamounts");
            checkamounts.find(".checkbox").remove();

            var grdreq = {
                filter: { Filters: [{ field: "CAT_ACTIVE", operator: "eq", value: "+" }] },
                sort: [{ field: "CAT_CODE", dir: "asc" }]
            };
            return tms.Ajax({
                url: "/Api/ApiCategories/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strCategoriesList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strCategoriesList += "<div class=\"checkbox checkbox-primary\">";
                            strCategoriesList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].CAT_CODE +
                                "\">";
                            strCategoriesList += "<label>";
                            strCategoriesList += "<strong>" + d.data[i].CAT_CODE + "</strong>" + " - " + d.data[i].CAT_DESC;
                            strCategoriesList += "</label>";
                            strCategoriesList += "</div>";
                        }
                        checkamounts.append(strCategoriesList);
                    }
                }
            });
        };
        this.LoadCustomerCategories = function () {
            var checkamounts = $("#checkamount div.checkamounts");
            if (selectedrecord) {
                var gridreq = {
                    sort: [{ field: "CCA_ID", dir: "asc" }],
                    filter: {
                        Filters: [
                            { field: "CCA_CUSTOMER", value: selectedrecord.CUS_CODE, operator: "eq" }
                        ]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiCustomerCheckAmount/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        checkamounts.find("input").prop("checked", false);
                        for (var i = 0; i < d.data.length; i++) {
                            checkamounts.find("input[value=\"" + d.data[i].CCA_CATEGORY + "\"]").prop("checked", true);
                        }
                    }
                });
            }

            return null;
        };
        this.Save = function () {
            var checkamounts = $("#checkamount div.checkamounts input:checked");
            var categorylist = [];

            for (var i = 0; i < checkamounts.length; i++) {
                var p = $(checkamounts[i]);
                categorylist.push({
                    CCA_CUSTOMER: selectedrecord.CUS_CODE,
                    CCA_CATEGORY: p.val(),
                    CCA_CREATED: tms.Now(),
                    CCA_CREATEDBY: user
                });
            }

            tms.Ajax({
                url: "/Api/ApiCustomerCheckAmount/Save",
                data: JSON.stringify({ Id: selectedrecord.CUS_CODE, Items: categorylist }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveCheckAmounts").click(self.Save);
        };
        RegisterUIEvents();
    };

    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "pricing":
                                return "#btnSavePricing";
                            case "partprices":
                                return "#btnSavePartPrice";
                            case "checkamount":
                                return "#btnSaveCheckAmounts";
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                cust.Save();
                                break;
                            case "pricing":
                                prce.Save();
                                break;
                            case "checkamount":
                                qat.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnNew";
                            case "pricing":
                                return "#btnAddPricing";
                            case "partprices":
                                return "#btnAddPartPrice";
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                cust.ResetUI();
                                break;
                            case "pricing":
                                prce.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        cust.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "pricing":
                                return "#btnDeletePricing";
                            case "partprices":
                                return "#btnDeletePartPrice";

                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                cust.Delete();
                                break;
                            case "pricing":
                                prce.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        cust.HistoryModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            $.when(cust.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "checkamount":
                        cca.LoadCustomerCategories();
                        break;
                }
            });
        };
        this.Configure = function () {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function (e) { return e.name === activeTab; })[0];
            for (var i = 0; i < tab.btns.length; i++) {
                var btni = tab.btns[i];
                if (!btni.selectionrequired)
                    $(btni.id).removeAttr("disabled");
                else {
                    if (selectedrecord) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };

    };


    function ready() {
        cust.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());