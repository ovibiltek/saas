(function () {
    var selectedrecord = null;
    var scr, ptk, ptp, act, pvw;

    var screenconf = [
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnTranslations", selectionrequired: true }
            ]
        },
        {
            name: "taskparameters",
            btns: []
        },
        {
            name: "activities",
            btns: []
        },
        {
            name: "preview",
            btns: []
        }
    ];

    pvw = new function () {
        var self = this;
        var grdPeriodicTasksPreview = null;

        this.List = function () {
            var grdFilter = [{ field: "PTP_PTASK", value: selectedrecord.PTK_CODE, operator: "eq", logic: "and" }];
            if (grdPeriodicTasksPreview) {
                grdPeriodicTasksPreview.ClearSelection();
                grdPeriodicTasksPreview.RunFilter(grdFilter);
            } else {
                grdPeriodicTasksPreview = new Grid({
                    keyfield: "PTP_ID",
                    columns: [
                        {
                            type: "string",
                            field: "PTP_SHORTDESC",
                            title: gridstrings.tasklist[lang].description,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "PTP_STATUS",
                            title: gridstrings.tasklist[lang].status,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_CUSTOMER",
                            title: gridstrings.tasklist[lang].customer,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PTP_BRANCH",
                            title: gridstrings.tasklist[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_CATEGORY",
                            title: gridstrings.tasklist[lang].category,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_TYPE",
                            title: gridstrings.tasklist[lang].type,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_PRIORITY",
                            title: gridstrings.tasklist[lang].priority,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_DEPARTMENT",
                            title: gridstrings.tasklist[lang].department,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_LOCATION",
                            title: gridstrings.tasklist[lang].location,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_EQUIPMENTCODE",
                            title: gridstrings.tasklist[lang].equipment,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_EQUIPMENTDESC",
                            title: gridstrings.tasklist[lang].equipmentdesc,
                            width: 130
                        },
                        {
                            type: "string",
                            field: "PTP_TRADE",
                            title: gridstrings.tasklist[lang].tasktrade,
                            width: 130
                        },
                        {
                            type: "datetime",
                            field: "PTP_DEADLINE",
                            title: gridstrings.tasklist[lang].deadline,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        PTP_ID: { type: "number" },
                        PTP_DEADLINE: { type: "date" }
                    },
                    datasource: "/Api/ApiPeriodicTasks/ListPreview",
                    selector: "#grdPeriodicTasksPreview",
                    name: "grdPeriodicTasksPreview",
                    height: constants.defaultgridheight - 150,
                    filter: grdFilter,
                    sort: [{ field: "PTP_ID", dir: "desc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"PeriodicTasksPreview.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    }
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnList").click(function () {
                if (!tms.Check("#preview"))
                    return $.Deferred().reject();

                var o = JSON.stringify({
                    PeriodicTask: selectedrecord.PTK_CODE,
                    StartDate: moment.utc($("#prmstart").val(), constants.dateformat),
                    EndDate: moment.utc($("#prmend").val(), constants.dateformat),
                    Generate: "-"
                });

                return tms.Ajax({
                    url: "/Api/ApiPeriodicTasks/Generate",
                    data: o,
                    fn: function (d) {
                        self.List();
                    }
                });
            });
            $("#btnGenerate").click(function () {
                $("#confirmgenerate").modal().off("click", "#ok").one("click", "#ok", function () {
                    if (!tms.Check("#preview"))
                        return $.Deferred().reject();

                    var o = JSON.stringify({
                        PeriodicTask: selectedrecord.PTK_CODE,
                        StartDate: moment.utc($("#prmstart").val(), constants.dateformat),
                        EndDate: moment.utc($("#prmend").val(), constants.dateformat),
                        Generate: "+"
                    });

                    return tms.Ajax({
                        url: "/Api/ApiPeriodicTasks/Generate",
                        data: o,
                        fn: function (d) {
                            self.List();
                        }
                    });
                });
            });
        };
        RegisterUIEvents();
    };
    act = new function () {
        var selecteditem = null;
        var grdelm = $("#grdPeriodicTaskActivities");
        var grdPeriodicTaskActivities = null;
        var self = this;

        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#activities");

            $("#line").val("");
            $("#dep").val("");
            $("#checklisttmp").val("");
            $("#assignedto").tagsinput("removeAll");
            $("#actdesc").val("");
            $("#lmapprovalrequired").prop("checked", false);
            $("#hidden").prop("checked", false);
            $("#private").prop("checked", false);
            $("#createseparateactivity").prop("checked", false);
            $("#taskdepartment").prop("checked", false);
            $("#taskdescription").prop("checked", false);
            $("#dep").prop("disabled", false).addClass("required").prop("required");
            $("#btnDepartment").prop("disabled", false);
            $("#trade").val("");

            tooltip.hide("#trade");
            tooltip.hide("#checklisttmp");
            tooltip.hide("#dep");
        };
        var FillUI = function () {
            tms.BeforeFill("#activities");

            $("#line").val(selecteditem.TAT_LINE);
            $("#dep").val(selecteditem.TAT_DEPARTMENT);
            $("#checklisttmp").val(selecteditem.TAT_CHKLISTTMP);
            $("#actdesc").val(selecteditem.TAT_DESC);
            $("#lmapprovalrequired").prop("checked", selecteditem.TAT_LMAPPROVALREQUIRED === "+");
            $("#createseparateactivity").prop("checked", selecteditem.TAT_CREATESEPARATEACTIVITY === "+");
            $("#hidden").prop("checked", selecteditem.TAT_HIDDEN === "+");
            $("#private").prop("checked", selecteditem.TAT_PRIVATE === "+");
            $("#taskdepartment").prop("checked", selecteditem.TAT_TASKDEPARTMENT === "+");
            $("#taskdescription").prop("checked", selecteditem.TAT_TASKDESC === "+");
            $("#status").val(selecteditem.TAT_STATUS);
            $("#predecessor").val(selecteditem.TAT_PREDECESSOR);
            $("#trade").val(selecteditem.TAT_TRADE);

            tooltip.show("#trade", selecteditem.TAT_TRADEDESC);
            tooltip.show("#predecessor", selecteditem.TAT_PREDECESSORDESC);
            tooltip.show("#dep", selecteditem.TAT_DEPARTMENTDESC);
            tooltip.show("#checklisttmp", selecteditem.TAT_CHKLISTTMPDESC);

            var istaskdepartmentchecked = (selecteditem.TAT_TASKDEPARTMENT === "+");
            $("#dep").prop("disabled", istaskdepartmentchecked);
            $("#btnDepartment").prop("disabled", istaskdepartmentchecked);
            if (istaskdepartmentchecked) {
                $("#dep").removeClass("required").removeAttr("required");
            } else {
                $("#dep").addClass("required").prop("required");
            }

            var istaskdescchecked = (selecteditem.TAT_TASKDESC === "+");
            $("#actdesc").prop("disabled", istaskdescchecked);
            if (istaskdescchecked) {
                $("#actdesc").removeClass("required").removeAttr("required");
            } else {
                $("#actdesc").addClass("required").prop("required");
            }

            $("#assignedto").tagsinput("removeAll");
            if (selecteditem.TAT_ASSIGNEDTO != null) {
                for (var i = 0; i < selecteditem.TAT_ASSIGNEDTO.length; i++) {
                    $("#assignedto").tagsinput("add",
                        { id: selecteditem.TAT_ASSIGNEDTO[i].USR_CODE, text: selecteditem.TAT_ASSIGNEDTO[i].USR_DESC },
                        ["ignore"]);
                }
            }
            $("#actdesc").focus();
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiActivityTemplates/Get",
                data: JSON.stringify(selecteditem.TAT_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selecteditem = grdPeriodicTaskActivities.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [
                { field: "TAT_TYPE", value: "PTASK", operator: "eq", logic: "and" },
                { field: "TAT_ENTITY", value: "TASK", operator: "eq", logic: "and" },
                { field: "TAT_CODE", value: selectedrecord.PTK_CODE, operator: "eq", logic: "and" }
            ];
            if (grdPeriodicTaskActivities) {
                grdPeriodicTaskActivities.ClearSelection();
                grdPeriodicTaskActivities.RunFilter(grdFilter);
            } else {
                grdPeriodicTaskActivities = new Grid({
                    keyfield: "TAT_ID",
                    columns: [
                        { type: "string", field: "TAT_LINE", title: gridstrings.typeactivities[lang].line, width: 100 },
                        {
                            type: "string",
                            field: "TAT_DESC",
                            title: gridstrings.typeactivities[lang].description,
                            template: "<span># if(TAT_TASKDESC == \"+\") {#" +
                                applicationstrings[lang].taskdesc +
                                "#} else {# #: TAT_DESC # #} #</span>",
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_PREDECESSOR",
                            title: gridstrings.typeactivities[lang].predecessor,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_DEPARTMENT",
                            title: gridstrings.typeactivities[lang].department,
                            template: "<span># if(TAT_TASKDEPARTMENT == \"+\") {#" +
                                applicationstrings[lang].taskdepartment +
                                "#} else {# #: TAT_DEPARTMENT # #} #</span>",
                            width: 100
                        },

                        {
                            type: "string",
                            field: "TAT_ASSIGNEDTO",
                            title: gridstrings.typeactivities[lang].assignedto,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_TRADE",
                            title: gridstrings.typeactivities[lang].trade,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_CHKLISTTMP",
                            title: gridstrings.typeactivities[lang].checklisttemplate,
                            width: 100
                        }
                    ],
                    datasource: "/Api/ApiActivityTemplates/List",
                    selector: "#grdPeriodicTaskActivities",
                    name: "grdPeriodicTaskActivities",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "TAT_LINE", dir: "asc" }],
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#actdetails"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                TAT_ID: (selecteditem != null ? selecteditem.TAT_ID : 0),
                TAT_TYPE: "PTASK",
                TAT_ENTITY: "TASK",
                TAT_CODE: $("#code").val(),
                TAT_LINE: $("#line").val(),
                TAT_STATUS: $("#status").val(),
                TAT_DESC: ($("#actdesc").val() || null),
                TAT_DEPARTMENT: ($("#dep").val() || null),
                TAT_TASKDEPARTMENT: $("#taskdepartment").prop("checked") ? "+" : "-",
                TAT_TASKDESC: $("#taskdescription").prop("checked") ? "+" : "-",
                TAT_TRADE: ($("#trade").val() || null),
                TAT_ASSIGNEDTO: ($("#assignedto").val() || null),
                TAT_PREDECESSOR: ($("#predecessor").val() || null),
                TAT_CHKLISTTMP: ($("#checklisttmp").val() || null),
                TAT_LMAPPROVALREQUIRED: $("#lmapprovalrequired").prop("checked") ? "+" : "-",
                TAT_HIDDEN: $("#hidden").prop("checked") ? "+" : "-",
                TAT_PRIVATE: $("#private").prop("checked") ? "+" : "-",
                TAT_CREATESEPARATEACTIVITY: $("#createseparateactivity").prop("checked") ? "+" : "-",
                TAT_CREATED: selecteditem != null ? selecteditem.TAT_CREATED : tms.Now(),
                TAT_CREATEDBY: selecteditem != null ? selecteditem.TAT_CREATEDBY : user,
                TAT_UPDATED: selecteditem != null ? tms.Now() : null,
                TAT_UPDATEDBY: selecteditem != null ? user : null,
                TAT_RECORDVERSION: selecteditem != null ? selecteditem.TAT_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiActivityTemplates/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Remove = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiActivityTemplates/DelRec",
                        data: JSON.stringify(selecteditem.TAT_ID),
                        fn: function (d) {
                            msgs.success(d.data);
                            self.ResetUI();
                            self.List();
                        }
                    });
                });
            }
        };
        this.FillStatuses = function () {
            var gridreq = {
                sort: [{ field: "STA_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "STA_ENTITY", value: selectedrecord.PTK_TYPEENTITY, operator: "eq" },
                        { field: "STA_CODE", value: "-", operator: "neq" }
                    ]
                }
            };
            return $.when(select({
                ctrl: "#status",
                url: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                textfield: "STA_DESCF",
                data: JSON.stringify(gridreq)
            }).Fill()).done(function () {
                $("#status").val("T").prop("disabled", true);
            });
        };
        var RegisterUIEvents = function () {
            $("#btnAddActivity").click(self.ResetUI);
            $("#btnSaveActivity").click(self.Save);
            $("#btnDeleteActivity").click(self.Remove);

            $("#btnDepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#dep",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [selectedrecord.PTK_ORGANIZATION, "*"], operator: "in" },
                        { field: "DEP_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnAssignedTo").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#assignedto",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_DEPARTMENT", value: ["*", $("#dep").val() || department], operator: "in" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.user[lang].departmentusers,
                            filter: [
                                {
                                    field: "USR_DEPARTMENT",
                                    value: ["*", $("#dep").val() || department],
                                    operator: "in"
                                },
                                { field: "USR_ACTIVE", value: "+", operator: "eq" }
                            ]
                        },
                        {
                            text: gridstrings.user[lang].allusers,
                            filter: [
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        }
                    ]
                });
            });
            $("#btntrade").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#trade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }

                    ],
                    filter: [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_ORGANIZATION", value: [selectedrecord.PTK_ORGANIZATION, "*"], operator: "in" },
                        { field: "TRD_DEPARTMENT", value: [$("#dep").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnpredecessor").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.typeactivities[lang].title,
                    listurl: "/Api/ApiActivityTemplates/List",
                    keyfield: "TAT_LINE",
                    codefield: "TAT_LINE",
                    textfield: "TAT_DESC",
                    returninput: "#predecessor",
                    columns: [
                        { type: "string", field: "TAT_LINE", title: gridstrings.typeactivities[lang].line, width: 100 },
                        {
                            type: "string",
                            field: "TAT_DESC",
                            title: gridstrings.typeactivities[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TAT_CODE", value: selectedrecord.TYP_CODE, operator: "eq" },
                        { field: "TAT_ENTITY", value: selectedrecord.TYP_ENTITY, operator: "eq" },
                        {
                            field:"PREDECESSORACTIVITY.TYP",
                            value: (selecteditem != null ? selecteditem.TAT_ID : 0),
                            operator: "func"
                        }
                    ]
                });
            });
            $("#btnChecklistTmp").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.checklisttemplate[lang].title,
                    listurl: "/Api/ApiChecklistTemplates/List",
                    keyfield: "CLT_CODE",
                    codefield: "CLT_CODE",
                    textfield: "CLT_DESC",
                    returninput: "#checklisttmp",
                    columns: [
                        {
                            type: "string",
                            field: "CLT_CODE",
                            title: gridstrings.checklisttemplate[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "CLT_DESC",
                            title: gridstrings.checklisttemplate[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "CLT_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });

            $("#trade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    { field: "TRD_ORGANIZATION", func: function () { return [selectedrecord.PTK_ORGANIZATION, "*"] }, includeall: true },
                    { field: "TRD_DEPARTMENT", func: function () { return [$("#dep").val(), "*"]; }, operator: "in" }
                ]
            });
            $("#dep").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_ORG", func: function () { return [selectedrecord.PTK_ORGANIZATION, "*"] }, operator: "in" },
                    { field: "DEP_CODE", value: "*", operator: "neq" }
                ]
            });

            $("#taskdepartment").on("change", function () {
                var ischecked = $(this).is(":checked");
                var depctrl = $("#dep");
                depctrl.val("");
                depctrl.prop("disabled", ischecked);
                $("#btnDepartment").prop("disabled", ischecked);
                if (ischecked) {
                    depctrl.removeClass("required").removeAttr("required");
                    tooltip.hide("#dep");
                } else {
                    depctrl.addClass("required").prop("required");
                }
            });
            $("#taskdescription").on("change", function () {
                var ischecked = $(this).is(":checked");
                var actdesc = $("#actdesc");
                actdesc.val("");
                actdesc.prop("disabled", ischecked);
                if (ischecked) {
                    actdesc.removeClass("required").removeAttr("required");
                } else {
                    actdesc.addClass("required").prop("required");
                }
            });
            $("#trade").on("change", function () {
                var trade = $(this).val();
                if (!trade) {
                    $("#assignedto, #btnAssignedTo").prop("disabled", false);
                }
                else {
                    $("#assignedto").tagsinput("removeAll");
                    $("#assignedto,#btnAssignedTo").prop("disabled", true);
                }
            });
            $("#assignedto").on("change", function () {
                var assignedto = $(this).val();
                if (!assignedto) {
                    $("#trade,#btntrade").prop("disabled", false);
                }
                else {
                    $("#trade").val("");
                    $("#trade,#btntrade").prop("disabled", true);
                    tooltip.hide("#trade");
                }
            });
        };
        RegisterUIEvents();
    };
    ptp = new function () {
        var selecteditem = null;
        var grdelm = $("#grdPeriodicTaskParameters");
        var grdPeriodicTaskParameters = null;
        var self = this;

        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#taskparameters");

            $("#prmid").val("");
            $("#prmlocation").val("");
            $("#prmequipment").val("");
            $("#prmequipment").data("id", null);
            $("#prmdepartment").val("");
            $("#prmbranch").val("");
            $("#prmplandate").val("");
            $("#prmresponsible").val("");
            $("#prmactive").prop("checked", false);
            $("#prmworkpermit").prop("checked", false);
            $("#prmreporting").prop("checked", false);
            $("#prmtrade").val("");


            tooltip.hide("#prmlocation");
            tooltip.hide("#prmequipment");
            tooltip.hide("#prmdepartment");
            tooltip.hide("#prmbranch");
            tooltip.hide("#prmresponsible");
            tooltip.hide("#prmtrade");

        };
        var FillUI = function () {
            tms.BeforeFill("#taskparameters");

            $("#prmid").val(selecteditem.PTP_ID);
            $("#prmlocation").val(selecteditem.PTP_LOCATION);
            $("#prmequipment").val(selecteditem.PTP_EQUIPMENTCODE);
            $("#prmequipment").data("id", selecteditem.PTP_EQUIPMENT);
            $("#prmdepartment").val(selecteditem.PTP_DEPARTMENT);
            $("#prmbranch").val(selecteditem.PTP_BRANCH);
            $("#prmtrade").val(selecteditem.PTP_TRADE);
            $("#prmplandate").val(moment(selecteditem.PTP_PLANDATE).format(constants.longdateformat));
            $("#prmresponsible").val(selecteditem.PTP_RESPONSIBLE);
            $("#prmactive").prop("checked", selecteditem.PTP_ACTIVE === "+");
            $("#prmworkpermit").prop("checked", selecteditem.PTP_WORKPERMIT === "+");
            $("#prmreporting").prop("checked", selecteditem.PTP_REPORTING === "+");

            tooltip.show("#prmlocation", selecteditem.PTP_LOCATIONDESC);
            tooltip.show("#prmequipment", selecteditem.PTP_EQUIPMENTDESC);
            tooltip.show("#prmdepartment", selecteditem.PTP_DEPARTMENTDESC);
            tooltip.show("#prmbranch", selecteditem.PTP_BRANCHDESC);
            tooltip.show("#prmresponsible", selecteditem.PTP_RESPONSIBLEDESC);
            tooltip.show("#prmtrade", selecteditem.PTP_TRADEDESC);

        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiPeriodicTaskParameters/Get",
                data: JSON.stringify(selecteditem.PTP_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selecteditem = grdPeriodicTaskParameters.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [{ field: "PTP_PTASK", value: selectedrecord.PTK_CODE, operator: "eq", logic: "and" }];
            if (grdPeriodicTaskParameters) {
                grdPeriodicTaskParameters.ClearSelection();
                grdPeriodicTaskParameters.RunFilter(grdFilter);
            } else {
                grdPeriodicTaskParameters = new Grid({
                    keyfield: "PTP_ID",
                    columns: [
                        {
                            type: "string",
                            field: "PTP_LOCATION",
                            title: gridstrings.ptaskparameters[lang].location,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_LOCATIONDESC",
                            title: gridstrings.ptaskparameters[lang].locationdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_EQUIPMENTCODE",
                            title: gridstrings.ptaskparameters[lang].equipment,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_EQUIPMENTDESC",
                            title: gridstrings.ptaskparameters[lang].equipmentdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_DEPARTMENT",
                            title: gridstrings.ptaskparameters[lang].department,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_DEPARTMENTDESC",
                            title: gridstrings.ptaskparameters[lang].departmentdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_BRANCH",
                            title: gridstrings.ptaskparameters[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_BRANCHDESC",
                            title: gridstrings.ptaskparameters[lang].branchdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_TRADE",
                            title: gridstrings.ptaskparameters[lang].trade,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_TRADEDESC",
                            title: gridstrings.ptaskparameters[lang].tradedesc,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "PTP_PLANDATE",
                            title: gridstrings.ptaskparameters[lang].plandate,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_RESPONSIBLEDESC",
                            title: gridstrings.ptaskparameters[lang].responsibledesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTP_WORKPERMIT",
                            title: gridstrings.ptaskparameters[lang].workpermit,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTP_REPORTING",
                            title: gridstrings.ptaskparameters[lang].reporting,
                            width: 150
                        }
                    ],
                    fields : {
                        PTP_PLANDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiPeriodicTaskParameters/List",
                    selector: "#grdPeriodicTaskParameters",
                    name: "grdPeriodicTaskParameters",
                    height: 300,
                    filter: grdFilter,
                    sort: [{ field: "PTP_ID", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"PeriodicTaskParameters.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    },
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#taskparameters"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PTP_ID: (selecteditem != null ? selecteditem.PTP_ID : 0),
                PTP_PTASK: selectedrecord.PTK_CODE,
                PTP_LOCATION: $("#prmlocation").val(),
                PTP_EQUIPMENT: ($("#prmequipment").data("id") || null),
                PTP_DEPARTMENT: $("#prmdepartment").val(),
                PTP_BRANCH: $("#prmbranch").val(),
                PTP_TRADE: ($("#prmtrade").val() || null),
                PTP_PLANDATE: moment.utc($("#prmplandate").val(), constants.longdateformat),
                PTP_RESPONSIBLE: ($("#prmresponsible").val() || null),
                PTP_ACTIVE: $("#prmactive").prop("checked") ? "+" : "-",
                PTP_WORKPERMIT: $("#prmworkpermit").prop("checked") ? "+" : "-",
                PTP_REPORTING: $("#prmreporting").prop("checked") ? "+" : "-",
                PTP_CREATED: selecteditem != null ? selecteditem.PTP_CREATED : tms.Now(),
                PTP_CREATEDBY: selecteditem != null ? selecteditem.PTP_CREATEDBY : user,
                PTP_UPDATED: selecteditem != null ? tms.Now() : null,
                PTP_UPDATEDBY: selecteditem != null ? user : null,
                PTP_RECORDVERSION: selecteditem != null ? selecteditem.PTP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPeriodicTaskParameters/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Remove = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiPeriodicTaskParameters/DelRec",
                        data: JSON.stringify(selecteditem.PTP_ID),
                        fn: function (d) {
                            msgs.success(d.data);
                            self.ResetUI();
                            self.List();
                        }
                    });
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddTaskParameter").click(self.ResetUI);
            $("#btnSaveTaskParameter").click(self.Save);
            $("#btnDeleteTaskParameter").click(self.Remove);

            $("#btnprmlocation").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.location[lang].title,
                    listurl: "/Api/ApiLocations/List",
                    keyfield: "LOC_CODE",
                    codefield: "LOC_CODE",
                    textfield: "LOC_DESC",
                    returninput: "#prmlocation",
                    columns: [
                        { type: "string", field: "LOC_CODE", title: gridstrings.location[lang].location, width: 100 },
                        { type: "string", field: "LOC_DESC", title: gridstrings.location[lang].description, width: 300 },
                    ],
                    filter: [
                        { field: "LOC_ORG", value: [selectedrecord.PTK_ORGANIZATION, "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data.LOC_DEPARTMENT !== "*") {
                            $("#prmdepartment").val(data.LOC_DEPARTMENT);
                            tooltip.show("#prmdepartment", data.LOC_DEPARTMENTDESC);
                        }
                        $("#prmbranch").val(data.LOC_BRANCH);
                        tooltip.show("#prmbranch", data.LOC_BRANCHDESC);
                    }
                });
            });
            $("#btnprmequipment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.equipments[lang].title,
                    listurl: "/Api/ApiEquipments/List",
                    keyfield: "EQP_CODE",
                    codefield: "EQP_CODE",
                    textfield: "EQP_DESC",
                    returninput: "#prmequipment",
                    columns: [
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 100 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 400 },
                        { type: "string", field: "EQP_TYPE", title: gridstrings.equipments[lang].eqptype, width: 400 },
                        { type: "string", field: "EQP_ZONE", title: gridstrings.equipments[lang].zonedesc, width: 400 },
                        { type: "string", field: "EQP_BRAND", title: gridstrings.equipments[lang].brand, width: 400 },
                        { type: "string", field: "EQP_MODEL", title: gridstrings.equipments[lang].model, width: 400 },
                        { type: "string", field: "EQP_SERIALNO", title: gridstrings.equipments[lang].serialno, width: 400 }
                    ],
                    filter: [
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                        { field: "EQP_ORG", value: [selectedrecord.PTK_ORGANIZATION, "*"], operator: "in" },
                        { field: "EQP_LOCATION", value: [$("#prmlocation").val(), "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        tooltip.hide("#equipment");
                        $("#prmequipment").data("id", (d ? d.EQP_ID : null));
                        $("#prmequipment").val(d ? d.EQP_CODE : "");
                        if (d) {
                            tooltip.show("#prmequipment", d.EQP_DESC);
                        }
                    }
                });
            });
            $("#btnprmresponsible").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#prmresponsible",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnprmdepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#prmdepartment",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [selectedrecord.PTK_ORGANIZATION, "*"], operator: "in" }
                    ]
                });
            });
            $("#btnprmtrade").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#prmtrade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }

                    ],
                    filter: [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_ORGANIZATION", value: [selectedrecord.PTK_ORGANIZATION, "*"], operator: "in" },
                        { field: "TRD_DEPARTMENT", value: [$("#prmdepartment").val(), "*"], operator: "in" }
                    ]
                });
            });


            $("#prmlocation").autocomp({
                listurl: "/Api/ApiLocations/List",
                geturl: "/Api/ApiLocations/Get",
                field: "LOC_CODE",
                textfield: "LOC_DESC",
                filter: [
                    { field: "LOC_ORG", func: function () { return [selectedrecord.PTK_ORGANIZATION, "*"]; }, operator: "in" }
                ],
                callback: function (data) {
                    if (data.LOC_DEPARTMENT !== "*") {
                        $("#prmdepartment").val(data.LOC_DEPARTMENT);
                        tooltip.show("#prmdepartment", data.LOC_DEPARTMENTDESC);
                    }
                    $("#prmbranch").val(data.LOC_BRANCH);
                    tooltip.show("#prmbranch", data.LOC_BRANCHDESC);
                }
            });
            $("#prmequipment").autocomp({
                listurl: "/Api/ApiEquipments/List",
                geturl: "/Api/ApiEquipments/Get",
                field: "EQP_CODE",
                textfield: "EQP_DESC",
                active: "EQP_ACTIVE",
                filter: [
                    { field: "EQP_ORG", func: function () { return [selectedrecord.PTK_ORGANIZATION, "*"]; }, operator: "in" },
                    { field: "EQP_LOCATION", relfield: "#prmlocation", includeall: true }
                ],
                callback: function (d) {
                    tooltip.hide("#prmequipment");
                    $("#prmequipment").data("id", (d ? d.EQP_ID : null));
                    $("#prmequipment").val(d ? d.EQP_CODE : "");
                    if (d) {
                        tooltip.show("#prmequipment", d.EQP_DESC);
                    }
                }
            });
            $("#prmresponsible").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE"
            });
            $("#prmdepartment").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_ORG", func: function () { return [selectedrecord.PTK_ORGANIZATION, "*"]; } }
                ]
            });
            $("#prmtrade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    {
                        field: "TRD_ORGANIZATION",
                        func: function() { return [selectedrecord.PTK_ORGANIZATION, "*"] },
                        includeall: true
                    },
                    {
                        field: "TRD_DEPARTMENT",
                        func: function() { return [$("#prmdepartment").val(), "*"]; },
                        operator: "in"
                    }
                ]
            });
        };
        RegisterUIEvents();
    };
    ptk = new function () {
        var self = this;
        var LoadPriorities;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#description").val("");
            $("#organization").val("");
            $("#type").val("");
            $("#type").data("entity", null);
            $("#tasktype").val("");
            $("#category").val("");
            $("#frequency").val("");
            $("#frequencypart").val("D");
            $("#priority").val("");
            $("#uctrfrequency").val("");
            $("#uctrfrequencypart").val("D");
            $("#autocreate").prop("checked", false);
            $("#autocreationtime").val("").prop("disabled", true).removeClass("required");
            $("#ignoremondays").prop("checked", false);
            $("#ignoretuesdays").prop("checked", false);
            $("#ignorewednesdays").prop("checked", false);
            $("#ignorethursdays").prop("checked", false);
            $("#ignorefridays").prop("checked", false);
            $("#ignoresaturdays").prop("checked", false);
            $("#ignoresundays").prop("checked", false);
            $("#ignoreofficialholidays").prop("checked", false);
            $("#active").prop("checked", true);

            tooltip.hide("#organization");
            tooltip.hide("#type");
            tooltip.hide("#tasktype");
            tooltip.hide("#category");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPERIODICTASKS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMPERIODICTASKS", operator: "eq" },
                    { field: "DES_PROPERTY", value: "PTK_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.PTK_CODE);
            $("#description").val(selectedrecord.PTK_DESC);
            $("#organization").val(selectedrecord.PTK_ORGANIZATION);
            $("#type").val(selectedrecord.PTK_TYPE);
            $("#category").val(selectedrecord.PTK_CATEGORY);
            $("#tasktype").val(selectedrecord.PTK_TASKTYPE);
            $("#type").data("entity", selectedrecord.PTK_TYPEENTITY);
            $("#frequency").val(selectedrecord.PTK_FREQUENCY);
            $("#frequencypart").val(selectedrecord.PTK_FREQUENCYPART);
            $("#uctrfrequency").val(selectedrecord.PTK_RFREQUENCY);
            $("#uctrfrequencypart").val(selectedrecord.PTK_RFREQUENCYPART);
            $("#autocreate").prop("checked", selectedrecord.PTK_AUTOCREATE === "+");
            $("#autocreationtime").val(selectedrecord.PTK_AUTOCREATIONTIME).prop("disabled", selectedrecord.PTK_AUTOCREATE !== "+");
            $("#ignoremondays").prop("checked", selectedrecord.PTK_IGNOREMONDAYS === "+");
            $("#ignoretuesdays").prop("checked", selectedrecord.PTK_IGNORETUESDAYS === "+");
            $("#ignorewednesdays").prop("checked", selectedrecord.PTK_IGNOREWEDNESDAYS === "+");
            $("#ignorethursdays").prop("checked", selectedrecord.PTK_IGNORETHURSDAYS === "+");
            $("#ignorefridays").prop("checked", selectedrecord.PTK_IGNOREFRIDAYS === "+");
            $("#ignoresaturdays").prop("checked", selectedrecord.PTK_IGNORESATURDAYS === "+");
            $("#ignoresundays").prop("checked", selectedrecord.PTK_IGNORESUNDAYS === "+");
            $("#ignoreofficialholidays").prop("checked", selectedrecord.PTK_IGNOREOFFICIALHOLIDAYS === "+");
            $("#active").prop("checked", selectedrecord.PTK_ACTIVE === "+");

            if (selectedrecord.PTK_AUTOCREATE === "+")
                $("#autocreationtime").addClass("required");
            else
                $("#autocreationtime").removeClass("required");

            tooltip.show("#organization", selectedrecord.PTK_ORGANIZATIONDESC);
            tooltip.show("#type", selectedrecord.PTK_TYPEDESC);
            tooltip.show("#tasktype", selectedrecord.PTK_TASKTYPEDESC);
            tooltip.show("#category", selectedrecord.PTK_CATEGORYDESC);

            $(".page-header>h6").html(selectedrecord.PTK_CODE + " - " + selectedrecord.PTK_DESC);

            $.when(LoadPriorities()).done(function () {
                $("#priority").val(selectedrecord.PTK_PRIORITY);
            });
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");

            return tms.Ajax({
                url: "/Api/ApiPeriodicTasks/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Remove = function () {
            var code = selectedrecord.PTK_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPeriodicTasks/DelRec",
                            data: JSON.stringify(code),
                            fn: function (d) {
                                msgs.success(d.data);
                                $(".list-group").list("refresh");
                                self.ResetUI();
                            }
                        });
                    });
            }
        };
        var GetFrequency = function (d, t) {
            switch (t) {
                case "D":
                    return moment.duration(d, "days");
                case "M":
                    return moment.duration(d, "months");
                case "Y":
                    return moment.duration(d, "years");
            }
        };
        var CheckNonStandart = function () {
            var frequencyv = parseInt($("#frequency").val() || "0");
            if (frequencyv == 0) {
                msgs.error(applicationstrings[lang].frequencyzerovalue);
                return false;
            }

            var autocreatev = $("#autocreate").is(":checked");
            if (autocreatev) {
                var autocreationtimev = parseInt($("#autocreationtime").val() || "0");
                if (autocreationtimev == 0) {
                    msgs.error(applicationstrings[lang].autocreationzerovalue);
                    return false;;
                }
            }

            var uctrfrequencyv = parseInt($("#uctrfrequency").val() || "0");
            if (uctrfrequencyv !== 0) {
                var frequencyv = parseInt($("#frequency").val());
                var frequencypartv = $("#frequencypart").val();
                var uctrfrequencypartv = $("#uctrfrequencypart").val();
                var m1 = GetFrequency(frequencyv, frequencypartv);
                var m2 = GetFrequency(uctrfrequencyv, uctrfrequencypartv);
                var diff = m1.subtract(m2);
                if (m1.as("days") <= 0) {
                    msgs.error(applicationstrings[lang].frequencyerr);
                    return false;
                }
            }

            var ignoreddays = $("input[type=\"checkbox\"].ignore:checked");
            if (ignoreddays.length === 7) {
                msgs.error(applicationstrings[lang].ignoreddayserr);
                return false;
            }

            return true;
        };
        this.Save = function () {
            if (!tms.Check("#record") || !CheckNonStandart())
                return $.Deferred().reject();

            var o = JSON.stringify({
                PTK_CODE: $("#code").val().toUpper(),
                PTK_DESC: $("#description").val(),
                PTK_ORGANIZATION: $("#organization").val(),
                PTK_TYPEENTITY: $("#type").data("entity"),
                PTK_TYPE: $("#type").val(),
                PTK_TASKTYPE: ($("#tasktype").val() || null),
                PTK_CATEGORY: $("#category").val(),
                PTK_FREQUENCY: $("#frequency").val(),
                PTK_FREQUENCYPART: $("#frequencypart").val(),
                PTK_PRIORITY: $("#priority").val(),
                PTK_RFREQUENCY: $("#uctrfrequency").val(),
                PTK_RFREQUENCYPART: $("#uctrfrequencypart").val(),
                PTK_AUTOCREATE: $("#autocreate").prop("checked") ? "+" : "-",
                PTK_AUTOCREATIONTIME: ($("#autocreationtime").val() || null),
                PTK_IGNOREMONDAYS: $("#ignoremondays").prop("checked") ? "+" : "-",
                PTK_IGNORETUESDAYS: $("#ignoretuesdays").prop("checked") ? "+" : "-",
                PTK_IGNOREWEDNESDAYS: $("#ignorewednesdays").prop("checked") ? "+" : "-",
                PTK_IGNORETHURSDAYS: $("#ignorethursdays").prop("checked") ? "+" : "-",
                PTK_IGNOREFRIDAYS: $("#ignorefridays").prop("checked") ? "+" : "-",
                PTK_IGNORESATURDAYS: $("#ignoresaturdays").prop("checked") ? "+" : "-",
                PTK_IGNORESUNDAYS: $("#ignoresundays").prop("checked") ? "+" : "-",
                PTK_IGNOREOFFICIALHOLIDAYS: $("#ignoreofficialholidays").prop("checked") ? "+" : "-",
                PTK_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                PTK_CREATED: selectedrecord != null ? selectedrecord.PTK_CREATED : tms.Now(),
                PTK_CREATEDBY: selectedrecord != null ? selectedrecord.PTK_CREATEDBY : user,
                PTK_UPDATED: selectedrecord != null ? tms.Now() : null,
                PTK_UPDATEDBY: selectedrecord != null ? user : null,
                PTK_SQLIDENTITY: selectedrecord != null ? selectedrecord.PTK_SQLIDENTITY : 0,
                PTK_RECORDVERSION: selectedrecord != null ? selectedrecord.PTK_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPeriodicTasks/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    $(".list-group").list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    switch (target) {
                        case "#activities":
                            act.FillStatuses();
                            act.List();
                            act.ResetUI();
                            break;
                        case "#taskparameters":
                            ptp.List();
                            ptp.ResetUI();
                            break;
                        case "#preview":
                            pvw.List();
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Remove);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnTranslations").click(self.TranslationModal);
            RegisterTabChange();
        };
        LoadPriorities = function () {
            var gridreq = {
                sort: [{ field: "PRI_CODE", dir: "desc" }],
                filter: {
                    filters: [
                        { field: "PRI_ORGANIZATION", value: [$("#organization").val(), "*"], operator: "in" },
                        { field: "PRI_ACTIVE", value: "+", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiPriorities/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#priority option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option style=\"color:" +
                            d.data[i].PRI_COLOR +
                            "\" value=\"" +
                            d.data[i].PRI_CODE +
                            "\">" +
                            d.data[i].PRI_DESCF +
                            "</option>";
                    }
                    $("#priority").append(strOptions);
                    $("#priority").val($("#priority").data("selected"));
                }
            });
        };

        this.BuildUI = function () {
            $("#btnDelete,#btnUndo,#btnHistory,#btnTranslations").prop("disabled", true);

            $("#organization").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                includeall: false
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESCF",
                active: "TYP_ACTIVE",
                filter: [{ field: "TYP_ENTITY", value: "TASK", operator: "eq" }],
                includeall: false,
                callback: function (data) {
                    $("#type").data("entity", data.TYP_ENTITY);
                    tooltip.show("#type", data.TYP_ENTITYDESC);
                }
            });
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [
                    { field: "CAT_ACTIVE", value: "+", operator: "eq" }
                ]
            });
            $("#tasktype").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }]
            });

            $("#btnorganization").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/ListUserOrganizations",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#organization",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btntype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESCF",
                    returninput: "#type",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#type").data("entity", data.TYP_ENTITY);
                        tooltip.show("#type", data.TYP_ENTITYDESC);
                    }
                });
            });
            $("#btncategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#category",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "CAT_DESCF",
                            title: gridstrings.category[lang].description,
                            width: 400
                        }
                    ],
                    filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }]
                });
            });
            $("#btntasktype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#tasktype",
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

            $("#organization").change(function () { LoadPriorities(); });
            $("#autocreate").change(function () {
                var ischecked = $(this).is(":checked");
                $("#autocreationtime").prop("disabled", !ischecked);
                $("#autocreationtime").val("");
                if (ischecked)
                    $("#autocreationtime").addClass("required");
                else
                    $("#autocreationtime").removeClass("required");
            });

            $(".list-group").list({
                listurl: "/Api/ApiPeriodicTasks/List",
                fields: {
                    keyfield: "PTK_CODE",
                    descfield: "PTK_DESC"
                },
                sort: [{ field: "PTK_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                }
            });

            RegisterUiEvents();
        };
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
                            case "activities":
                                return "#btnSaveActivity";
                            case "taskparameters":
                                return "#btnSaveTypeParameter";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                ptk.Save();
                                break;
                            case "activities":
                                act.Save();
                                break;
                            case "taskparameters":
                                ptp.Save();
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
                            case "activities":
                                return "#btnAddActivity";
                            case "taskparameters":
                                return "#btnAddTypeParameter";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                ptk.ResetUI();
                                break;
                            case "activities":
                                act.ResetUI();
                                break;
                            case "taskparameters":
                                ptp.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        ptk.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "activities":
                                return "#btnDeleteActivity";
                            case "taskparameters":
                                return "#btnDeleteTypeParameter";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                ptk.Remove();
                                break;
                            case "activities":
                                act.Remove();
                                break;
                            case "taskparameters":
                                ptp.Remove();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnTranslations",
                    f: function () {
                        ptk.TranslationModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function () {
                        translationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(ptk.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "activities":
                        act.List();
                        act.ResetUI();
                        break;
                    case "taskparameters":
                        ptp.List();
                        ptp.ResetUI();
                        break;
                    case "preview":
                        pvw.List();
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
        ptk.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());