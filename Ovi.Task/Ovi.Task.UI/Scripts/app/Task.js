(function () {
    var map;
    var markersArray = [];
    var checklistlocked = false;
    var checklistdisabled = false;
    var task = { TSK_ID: 0 };
    var taskListVisible = false;
    var selectedactivity = null;
    var selectedbookedhour = null;
    var selectedissuereturn = null;
    var selectedmeterreading = null;
    var selectedquotation = null;
    var pstat;
    var currentpcode;
    var orgrecord = null;
    var workflowcollapsed = true;
    var selectedtaskactivitychecklist = null;


    var scr;
    var act;
    var chklist;

    var screenconf = [
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnWorkflow", selectionrequired: true },
                { id: "#btnPrint", selectionrequired: true }
            ]
        },
        {
            name: "activities",
            btns: []
        },
        {
            name: "bookedhours",
            btns: []
        },
        {
            name: "parts",
            btns: []
        },
        {
            name: "misccosts",
            btns: []
        },
        {
            name: "meterreadings",
            btns: []
        },
        {
            name: "planning",
            btns: []
        },
        {
            name: "toolusage",
            btns: []
        },
        {
            name: "progresspayment",
            btns: []
        },
        {
            name: "closingcodes",
            btns: []
        },
        {
            name: "tasktrx",
            btns: []
        },
        {
            name: "pricing",
            btns: []
        },
        {
            name: "taskactivitychecklists",
            btns: []
        }
    ];
    var tree = new function () {
        var self = this;

        this.ChildBuilder = function (parent, list) {

            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                if (!parent.subs) {
                    parent.subs = [];
                }
                parent.subs.push(child);
                self.ChildBuilder(child, list);
            }
        };
        this.GenerateTreeData = function (d) {
            var data = [];
            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    title: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    subs: []
                };
                self.ChildBuilder(parent, d);
                data.push(parent);
            }
            return data;
        };
        this.GetLevels = function (entity) {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: entity, operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq)
            });
        };
    };
    var rev = new function () {
        var self = this;
        var revisionNeeded;

        this.SetRevisionCount = function () {
            return tms.Ajax({
                url: "/Api/ApiTaskActivities/GetRevisionCount",
                data: JSON.stringify({ REV_TASK: task.TSK_ID, REV_LINE: selectedactivity.TSA_LINE }),
                quietly: true,
                fn: function (d) {
                    $("#revisioncount").text(d.data.length);
                }
            });
        };
        this.LoadRevisions = function () {
            var gridreq = {
                sort: [{ field: "REV_NO", dir: "desc" }],
                filter: {
                    filters: [
                        { field: "REV_TASK", value: task.TSK_ID, operator: "eq" },
                        { field: "REV_LINE", value: selectedactivity.TSA_LINE, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivities/ListRevisions",
                data: JSON.stringify(gridreq),
                quietly: true,
                fn: function (d) {
                    var strlist = "<div class=\"rev-items\">";
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        strlist += "<div href=\"#\" class=\"well\">";
                        strlist += "<p><span class=\"badge\">" + di.REV_NO + "</span></p>";
                        strlist += "<p>" +
                            applicationstrings[lang].schfrom +
                            " :" +
                            moment(di.REV_SCHFROM).format(constants.longdateformat) +
                            "</p>";
                        strlist += "<p>" +
                            applicationstrings[lang].schto +
                            " :" +
                            moment(di.REV_SCHTO).format(constants.longdateformat) +
                            "</p>";
                        strlist += "<p><i class=\"fa fa-pencil\"></i> " + di.REV_REASON + "</p>";
                        strlist += "<hr />";
                        strlist += "<p>" +
                            di.REV_CREATEDBY +
                            " - " +
                            moment(di.REV_CREATED).format(constants.longdateformat) +
                            "</p>";
                        strlist += "</div>";
                    }
                    strlist += "</div>";
                    $("#modaltaskrevision .modal-body *").remove();
                    $("#modaltaskrevision .modal-body").append(strlist);
                    $("#modaltaskrevision").modal("show");
                }
            });
        };
        var CheckRevision = function () {
            if (task.TSK_ID) {
                var hc = false;
                var schfrom = $("#schfrom");
                var schto = $("#schto");
                var nv = null;
                var ov = null;

                nv = schfrom.val();
                ov = schfrom.data("lvalue");
                hc = (ov && nv !== ov);
                if (hc) return true;

                nv = schto.val();
                ov = schto.data("lvalue");
                hc = (ov && nv !== ov);
                if (hc) return true;
            }

            return false;
        };
        $("#btnRevisionHistory").click(self.LoadRevisions);
        $("#schfrom,#schto").on("dp.change",
            function () {
                if (CheckRevision()) {
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
    };
    var aeq = new function () {
        var grdActivityEquipments = null;
        var grdActivityEquipmentsElm = $("#grdActivityEquipments");
        var deleteActEqpLine;
        var statusctrl = "barcode";
        var selectedActivityEquipment = null;
        var self = this;
        var maintenanceequipmentdiv;
        var alreadysavedequipment = [];

        this.SetEquipmentCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "TAE_TSAID", value: selectedactivity.TSA_ID, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#actequipmentcnt").html(d.data);
                }
            });
        }
        var gridDatabound = function () {
            grdActivityEquipmentsElm.find(".lu-remove").prop("disabled", pstat === "C");
            grdActivityEquipmentsElm.find(".lu-remove").unbind("click").click(function () {
                deleteActEqpLine($(this).closest("tr"));
            });
        };
        var itemSelect = function (row) {
            selectedActivityEquipment = grdActivityEquipments.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var listActivityEquipments = function () {
            grdActivityEquipments = new Grid({
                keyfield: "TAE_ID",
                columns: [
                    {
                        type: "other",
                        field: "other",
                        title: "#",
                        template:
                            "<button class=\"btn btn-xs btn-danger lu-remove\" type=\"button\" data-id=\"#=TAE_ID#\"><i class=\"fa fa-trash fa-fw\"></i></button>",
                        filterable: false,
                        sortable: false,
                        width: 40
                    },
                    { type: "string", field: "TAE_EQPTYPE", title: gridstrings.equipments[lang].eqptype, width: 200 },
                    { type: "string", field: "TAE_EQPCODE", title: gridstrings.equipments[lang].eqpcode, width: 200 },
                    { type: "string", field: "TAE_EQPDESC", title: gridstrings.equipments[lang].eqpdesc, width: 200 },
                    { type: "number", field: "TAE_QUANTITY", title: gridstrings.stock[lang].qty, width: 200 }
                ],
                datasource: "/Api/ApiTaskActivityEquipments/List",
                selector: "#grdActivityEquipments",
                name: "grdActivityEquipments",
                height: 370,
                primarycodefield: "TAE_EQPID",
                primarytextfield: "TAE_EQPDESC",
                filter: [
                    { field: "TAE_TSAID", value: selectedactivity.TSA_ID, operator: "eq", logic: "and" }
                ],
                sort: [{ field: "TAE_ID", dir: "asc" }],
                databound: gridDatabound,
                change: gridChange
            });
        };
        var GetAlreadyInEquipments = function () {
            alreadysavedequipment = [];
            var gridreq = {
                filter: {
                    filters: [
                        { field: "TAE_TSAID", value: selectedactivity.TSA_ID, operator: "eq", logic: "and" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    if (d.data) {
                        $.each(d.data, function (i) {
                            if (d.data[i].TAE_EQPID)
                                alreadysavedequipment.push(d.data[i].TAE_EQPID);
                        });
                    }
                }
            });
        };
        var LoadEquipments = function () {
            console.log(alreadysavedequipment);
            maintenanceequipmentdiv.find("*").remove();
            var gridreq = {
                screen: "M_EQUIPMENTS",
                groupedFilters: [
                    {
                        filters: [
                            { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                            { field: "EQP_BRANCH", value: task.TSK_BRANCH, operator: "eq" },
                            { field: "EQP_ORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                            { field: "EQP_ID", value: alreadysavedequipment, operator: "nin" }
                        ],
                        logic: "and"
                    }
                ],
                loadall: true
            };

            if ($("#filterCheckBoxes").val()) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "EQP_TYPEDESC", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" },
                        { field: "EQP_CODE", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" },
                        { field: "EQP_BRAND", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" },
                        { field: "EQP_MODEL", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" }
                    ],
                    logic: "or"
                });
            }

            return tms.Ajax({
                url: "/Api/ApiEquipments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    if (d.data) {
                        var strEqpList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strEqpList += "<div data-screen=\"" + d.data[i].EQP_CODE + "\" class=\"row custom\">";
                            strEqpList += "<div class=\"col-md-12\">";
                            strEqpList += " <div class=\"checkbox checkbox-primary\">";
                            strEqpList += "<input name=\"checkequipments\" data-type=\"" + d.data[i].EQP_TYPE + "\" class=\"styled\" type=\"checkbox\" id=\"" + d.data[i].EQP_ID + "\" value=\"" + d.data[i].EQP_CODE + "\">";
                            strEqpList += "<label for=\"" + d.data[i].EQP_CODE + "\">";
                            strEqpList += "<strong>" + d.data[i].EQP_CODE + "</strong>" + " - " + d.data[i].EQP_TYPEDESC + " - " + d.data[i].EQP_BRAND + " - " + d.data[i].EQP_MODEL + " - " + d.data[i].EQP_ZONE;
                            strEqpList += "</label>";
                            strEqpList += "</div>";
                            strEqpList += "</div>";
                            strEqpList += "</div>";
                        }
                        maintenanceequipmentdiv.append(strEqpList);
                        maintenanceequipmentdiv.find("input[type=\"checkbox\"]").on("change", function () {
                            $(this).blur();
                        });
                    }
                }
            });
        };
        deleteActEqpLine = function (row) {
            selectedActivityEquipment = grdActivityEquipments.GetRowDataItem(row);
            if (selectedActivityEquipment) {
                $("#modalTaskActivityEquipments").modal("hide");
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivityEquipments/Delete",
                            data: JSON.stringify(selectedActivityEquipment.TAE_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                selectedActivityEquipment = null;
                                self.SetEquipmentCount();
                                listActivityEquipments();
                                $.when(GetAlreadyInEquipments()).done(function () {
                                    return LoadEquipments();
                                });
                                $("#modalTaskActivityEquipments").modal("show");
                            }
                        });
                    }).one("click",
                    "#cancel",
                    function () {
                        $("#modalTaskActivityEquipments").modal("show");
                    });
            }
        };
        this.showActivityEquipmentMaintenanceModal = function () {
            listActivityEquipments();
            $.when(GetAlreadyInEquipments()).done(function () {
                return LoadEquipments();
            });
            $("#modalTaskActivityEquipments").modal("show");
        };
        var EvaluateCurrentBarcode = function () {
            statusctrl = $("#isbarcode").val();

            if (statusctrl === "barcode") {
                $(".activityequipment").removeClass("hidden");
                $("#taskactivityequipment").attr("required", "").addClass("required");
                $(".activityequipmenttype").addClass("hidden");
                $("#taskactivityequipmentquan").removeAttr("required").removeClass("required");
                $("#taskactivityequipmenttype").removeAttr("required").removeClass("required");
            } else {
                $(".activityequipment").addClass("hidden");
                $("#taskactivityequipment").removeAttr("required").removeClass("required");
                $(".activityequipmenttype").removeClass("hidden");
                $("#taskactivityequipmentquan").attr("required", "").addClass("required");
                $("#taskactivityequipmenttype").attr("required", "").addClass("required");
            }
        };
        var resetModalInputFields = function () {
            $("#taskactivityequipmenttype").val("");
            $("#taskactivityequipmentquan").val("");
            $("#taskactivityequipment").val("");
            $("#taskactivityequipment").data("id", null).data("type", null);
            $("#isbarcode").val("barcode");
            tooltip.hide("#taskactivityequipmenttype");
            tooltip.hide("#taskactivityequipment");
            EvaluateCurrentBarcode();
        };
        var AddCheckedOnes = function () {
            var equipments = maintenanceequipmentdiv.find("div.row");

            if (equipments.length < 0) {
                console.log("öğe yok?");
                return;
            }

            $('input[name="checkequipments"]:checked').each(function () {
                var o = {
                    TAE_ID: 0,
                    TAE_TSAID: selectedactivity.TSA_ID,
                    TAE_EQPID: this.id,
                    TAE_EQPTYPE: $(this).data("type"),
                    TAE_QUANTITY: 1,
                    TAE_EQPTYPEENTITY: "EQUIPMENT",
                    TAE_CREATED: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATED : tms.Now(),
                    TAE_CREATEDBY: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATEDBY : user,
                    TAE_UPDATED: selectedActivityEquipment != null ? tms.Now() : null,
                    TAE_UPDATEDBY: selectedActivityEquipment != null ? user : null,
                    TAE_RECORDVERSION: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_RECORDVERSION : 0
                };

                return tms.Ajax({
                    url: "/Api/ApiTaskActivityEquipments/Save",
                    data: JSON.stringify(o),
                    fn: function (d) {
                        self.SetEquipmentCount();
                    }
                });
            });
        };
        var addActEqpLine = function () {
            if (!tms.Check("#modalTaskActivityEquipments"))
                return $.Deferred.resolve();

            var o = {
                TAE_ID: 0,
                TAE_TSAID: selectedactivity.TSA_ID,
                TAE_EQPID: statusctrl === "barcode" ? $("#taskactivityequipment").data("id") : null,
                TAE_EQPTYPE: statusctrl === "barcode" ? $("#taskactivityequipment").data("type") : $("#taskactivityequipmenttype").val(),
                TAE_QUANTITY: statusctrl === "barcode" ? 1 : $("#taskactivityequipmentquan").val(),
                TAE_EQPTYPEENTITY: "EQUIPMENT",
                TAE_CREATED: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATED : tms.Now(),
                TAE_CREATEDBY: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATEDBY : user,
                TAE_UPDATED: selectedActivityEquipment != null ? tms.Now() : null,
                TAE_UPDATEDBY: selectedActivityEquipment != null ? user : null,
                TAE_RECORDVERSION: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    selectedActivityEquipment = null;
                    resetModalInputFields();
                    self.SetEquipmentCount();
                    listActivityEquipments();
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            maintenanceequipmentdiv = $("#maintenanceequipments");
            $("#btnTaskActivityEquipment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.equipments[lang].title,
                    listurl: "/Api/ApiEquipments/List",
                    keyfield: "EQP_CODE",
                    codefield: "EQP_CODE",
                    textfield: "EQP_DESC",
                    returninput: "#taskactivityequipment",
                    screen: "M_EQUIPMENTS",
                    columns: [
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 100 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 400 }
                    ],
                    filter: [
                        { field: "EQP_BRANCH", value: task.TSK_BRANCH, operator: "eq" },
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                        { field: "EQP_ORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        $("#taskactivityequipment").data("id", data ? data.EQP_ID : null);
                        $("#taskactivityequipment").data("type", data ? data.EQP_TYPE : null);
                    }
                });
            });
            $("#btnTaskActivityEquipmentType").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#taskactivityequipmenttype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [task.TSK_ORGANIZATION, "*"], operator: "in" }
                    ],
                    callback: function (data) {
                    }
                });
            });

            $("#taskactivityequipment").autocomp({
                listurl: "/Api/ApiEquipments/List",
                geturl: "/Api/ApiEquipments/Get",
                field: "EQP_CODE",
                textfield: "EQP_DESC",
                active: "EQP_ACTIVE",
                screen: "M_EQUIPMENTS",
                filter: function () {
                    return [
                        { field: "EQP_BRANCH", value: task.TSK_BRANCH, operator: "eq" },
                        { field: "EQP_ORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" }
                    ];
                },
                callback: function (data) {
                    $("#taskactivityequipment").data("id", data ? data.EQP_ID : null);
                    $("#taskactivityequipment").data("type", data ? data.EQP_TYPE : null);
                }
            });
            $("#taskactivityequipmenttype").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
                ],
                callback: function (data) {
                }
            });

            $("#isbarcode").on("change", EvaluateCurrentBarcode);
            $("#btnfilterCheckBoxes").click(function () {
                LoadEquipments();
            });
            $("#btnTaskActivityEquipmentSave").click(function () {
                if (statusctrl === "barcode") {
                    $.when(AddCheckedOnes()).done(function () {
                        self.SetEquipmentCount();
                        listActivityEquipments();
                        $.when(GetAlreadyInEquipments()).done(function () { return LoadEquipments(); });
                    });
                } else {
                    addActEqpLine();
                }
            });
        };
        RegisterUIEvents();
    };
    var asr = new function () {
        var grdActivityServiceCodes = null;
        var grdActivityServiceCodesElm = $("#grdActivityServiceCodes");
        var selectedServiceCode = null;
        var deleteActivityServiceCode;
        var self = this;

        var ChildBuilder = function (parent, list) {
            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            childs = childs.sortBy(function (o) { return o.TLV_CODE; });
            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                if (!parent.subs) {
                    parent.subs = [];
                }
                parent.subs.push(child);
                ChildBuilder(child, list);
            }
        };
        var GenerateTreeData = function (d) {
            var data = [];
            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            parentless = parentless.sortBy(function (o) { return o.TLV_CODE; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    title: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    subs: []
                };
                ChildBuilder(parent, d);
                data.push(parent);
            }
            return data;
        };
        var GetLevels = function () {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: "SERVICECODE", operator: "eq" }
                    ]
                },
                sort: [{ field: "TLV_CODE", dir: "desc" }]
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq)
            });
        };

        this.SetServiceCodeCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "ASR_ACTIVITY", value: selectedactivity.TSA_ID, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityServiceCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#actservicecodecnt").html(d.data);
                }
            });
        }
        var gridDatabound = function () {
            grdActivityServiceCodesElm.find(".lu-remove").prop("disabled", pstat === "C");
            grdActivityServiceCodesElm.find(".lu-remove").unbind("click").click(function () {
                deleteActivityServiceCode($(this).closest("tr"));
            });
        };
        var itemSelect = function (row) {
            selectedServiceCode = grdActivityServiceCodes.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var resetModalInputFields = function () {
            $("#servicecode").val("");
            $("#serviceqty").val("");
            $("#serviceqty-uom").html("");
            tooltip.hide("#servicecode");
        }
        var listActivityServiceCodes = function () {
            grdActivityServiceCodes = new Grid({
                keyfield: "ASR_ID",
                columns: [
                    {
                        type: "other",
                        field: "other",
                        title: "#",
                        template:
                            "<button class=\"btn btn-xs btn-danger lu-remove\" type=\"button\"   data-id=\"#=ASR_ID#\"><i class=\"fa fa-trash fa-fw\"></i></button>",
                        filterable: false,
                        sortable: false,
                        width: 40
                    },
                    { type: "number", field: "ASR_SERVICECODE", title: gridstrings.servicecodes[lang].code, width: 200 },
                    { type: "string", field: "ASR_SERVICECODEDESC", title: gridstrings.servicecodes[lang].description, width: 300 },
                    { type: "string", field: "ASR_SERVICECODEUOM", title: gridstrings.servicecodes[lang].uom, width: 150 },
                    { type: "qty", field: "ASR_QUANTITY", title: gridstrings.servicecodes[lang].qty, width: 150 },
                    { type: "datetime", field: "ASR_CREATED", title: gridstrings.servicecodes[lang].created, width: 200 },
                    { type: "string", field: "ASR_CREATEDBY", title: gridstrings.servicecodes[lang].createdby, width: 200 }
                ],
                fields:
                {
                    ASR_SERVICECODE: { type: "number" },
                    ASR_QUANTITY: { type: "number" },
                    ASR_CREATED: { type: "date" }
                },
                datasource: "/Api/ApiTaskActivityServiceCodes/List",
                selector: "#grdActivityServiceCodes",
                name: "grdActivityServiceCodes",
                height: 370,
                primarycodefield: "ASR_SERVICECODE",
                primarytextfield: "ASR_SERVICECODEDESC",
                filter: [
                    { field: "ASR_ACTIVITY", value: selectedactivity.TSA_ID, operator: "eq", logic: "and" }
                ],
                sort: [{ field: "ASR_ID", dir: "desc" }],
                databound: gridDatabound,
                change: gridChange
            });
        };
        deleteActivityServiceCode = function (row) {
            selectedServiceCode = grdActivityServiceCodes.GetRowDataItem(row);
            if (selectedServiceCode) {
                $("#modalTaskActivityServiceCodes").modal("hide");
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivityServiceCodes/Delete",
                            data: JSON.stringify(selectedServiceCode.ASR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                selectedServiceCode = null;
                                self.SetServiceCodeCount();
                                listActivityServiceCodes();
                                $("#modalTaskActivityServiceCodes").modal("show");
                            }
                        });
                    }).one("click",
                    "#cancel",
                    function () {
                        $("#modalTaskActivityServiceCodes").modal("show");
                    });
            }
        };
        this.showActivityServiceCodesModal = function () {
            listActivityServiceCodes();
            $("#modalTaskActivityServiceCodes").modal("show");
        };
        var addActivityServiceCode = function () {
            if (!tms.Check("#modalTaskActivityServiceCodes"))
                return $.Deferred.resolve();

            var o = {
                ASR_ID: 0,
                ASR_ACTIVITY: selectedactivity.TSA_ID,
                ASR_SERVICECODE: $("#servicecode").val(),
                ASR_QUANTITY: $("#serviceqty").val(),
                ASR_CREATED: selectedServiceCode != null ? selectedServiceCode.ASR_CREATED : tms.Now(),
                ASR_CREATEDBY: selectedServiceCode != null ? selectedServiceCode.ASR_CREATEDBY : user,
                ASR_UPDATED: selectedServiceCode != null ? tms.Now() : null,
                ASR_UPDATEDBY: selectedServiceCode != null ? user : null,
                ASR_RECORDVERSION: selectedServiceCode != null ? selectedServiceCode.ASR_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityServiceCodes/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    selectedServiceCode = null;
                    resetModalInputFields();
                    msgs.success(d.data);
                    self.SetServiceCodeCount();
                    listActivityServiceCodes();
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnServiceCode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.servicecodes[lang].title,
                    modalinfo: applicationstrings[lang].servicecodesmodalinfo,
                    listurl: "/Api/ApiServiceCodes/List",
                    keyfield: "SRV_CODE",
                    codefield: "SRV_CODE",
                    textfield: "SRV_DESCRIPTIONF",
                    returninput: "#servicecode",
                    columns: [
                        {
                            type: "number",
                            field: "SRV_CODE",
                            title: gridstrings.servicecodes[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "SRV_DESCRIPTIONF",
                            title: gridstrings.servicecodes[lang].description,
                            width: 400
                        },
                        {
                            type: "string",
                            field: "SRV_TASKTYPEDESC",
                            title: gridstrings.servicecodes[lang].tasktypedescription,
                            width: 400
                        }
                    ],
                    fields: {
                        SRV_CODE: { type: "number" }
                    },
                    filter: [
                        { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                        { field: "SRV_ORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "IsContractedTaskServiceCode", value: task.TSK_ID, operator: "custom" }

                    ],
                    quickfilter: [
                        {
                            text: gridstrings.servicecodes[lang].contractedservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedTaskServiceCode", value: task.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.servicecodes[lang].allservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(GetLevels()).done(function (d) {
                            var data = GenerateTreeData(d.data);

                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [{ field: "SERVICECODELEVEL", value: selectedItem.id, operator: "func" }];
                                        callback(filter);
                                    }
                                }
                            });
                        });
                    },
                    callback: function (data) {
                        $("#serviceqty-uom").html(data ? data.SRV_UOM : "");
                    }
                });
            });
            $("#servicecode").autocomp({
                listurl: "/Api/ApiServiceCodes/List",
                geturl: "/Api/ApiServiceCodes/Get",
                field: "SRV_CODE",
                textfield: "SRV_DESCRIPTIONF",
                active: "SRV_ACTIVE",
                termisnumeric: true,
                filter: [{ field: "SRV_ORG", func: function () { return task.TSK_ORGANIZATION; }, includeall: true }],
                callback: function (data) {
                    $("#serviceqty-uom").html(data ? data.SRV_UOM : "");
                }
            });
            $("#btnTaskActivityServiceCodesSave").click(addActivityServiceCode);
        };
        RegisterUIEvents();
    };
    chklist = new function () {
        var self = this;
        var BuildChecklist;
        var checklistCommentsHelper;
        var checklistDocumentsHelper;

        this.SetCheckListCount = function () {
            return $.when(self.LoadCheckList()).done(function (d) {
                var cnt = d.data.length;
                var completed = $.grep(d.data, function (item) { return item.CHK_CHECKED === "+"; }).length;
                $("#checklistcount").text(cnt !== 0 ? completed + "/" + cnt : "0");
            });
        };
        var CalcCheckListItemRates = function () {
            var checklistitemsdiv = $("div.checklistitems");
            var v_rateinputs = checklistitemsdiv.find("div.checklistitem[data-rate]");
            var e_rateinputs = checklistitemsdiv.find("div.checklistitem:not([data-rate])");

            var manual = 0;
            var auto = 0;
            var j;

            for (j = 0; j < v_rateinputs.length; j++) {
                var v_ri = $(v_rateinputs[j]);
                manual += parseInt(v_ri.data("rate"));
            }

            for (j = 0; j < e_rateinputs.length; j++) {
                var e_ri = $(e_rateinputs[j]);
                var autoval = parseInt((100 - manual) / e_rateinputs.length);
                auto += autoval;
                e_ri.attr("data-rate", autoval).data("rate", autoval);
            }

            if (auto + manual !== 100) {
                var diff = 100 - (auto + manual);
                for (var i = 0; i < diff; i++) {
                    var aval = parseInt($(e_rateinputs[i]).data("rate"));
                    $(e_rateinputs[i])
                        .attr("data-rate", aval + 1)
                        .data("rate", aval + 1);
                }
            }
        };
        this.LoadCheckList = function () {
            var gridreq = {
                sort: [{ field: "CHK_NO", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "CHK_TACID", value: selectedtaskactivitychecklist.TAC_ID, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiChecklists/List",
                data: JSON.stringify(gridreq)
            });
        };
        var RegisterChecklistEvnt = function () {
            $(".onoff").on("switchChange.bootstrapSwitch",
                function (event, state) {
                    var $that = $(this);
                    return tms.Ajax({
                        url: "/Api/ApiCheckListSwitch/Save",
                        data: JSON.stringify({
                            CHS_TASK: task.TSK_ID,
                            CHS_ID: $(this).data("sw"),
                            CHS_CHKID: $(this).closest(".data-container").data("id"),
                            CHS_USER: user,
                            CHS_VALUE: (state ? "+" : "-")
                        }),
                        quietly: true,
                        fn: function (d) {
                            if (d.data === 0)
                                $that.removeData("sw");
                            else
                                $that.data("sw", d.data);
                        }
                    });
                });
            var checklistitems = $("div.checklistitems");
            checklistitems.find("select").on("change", function () {
                var $this = $(this);
                var opt = $this.find("option:selected");
                $this.closest("div.checklistitem")
                    .find("button.btn-comments")
                    .removeClass(opt.data("comments") === "+" ? "btn-default" : "btn-required")
                    .addClass(opt.data("comments") === "+" ? "btn-required" : "btn-default");
                $this.closest("div.checklistitem")
                    .find("button.btn-documents")
                    .removeClass(opt.data("documents") === "+" ? "btn-default" : "btn-required")
                    .addClass(opt.data("documents") === "+" ? "btn-required" : "btn-default");
            });
            checklistitems.find("button.btn-comments").unbind("click").click(function () {
                var $this = $(this);
                checklistCommentsHelper.showCommentsModal({
                    subject: "CHECKLISTITEM",
                    source: $this.data("id")
                });
            });
            checklistitems.find("button.btn-documents").unbind("click").click(function () {
                var $this = $(this);
                checklistDocumentsHelper.showDocumentsModal({
                    subject: "CHECKLISTITEM",
                    source: $this.data("id")
                });
            });
        };
        var GetCompletedRate = function () {
            var completedperc = 0;
            var checklistitemsdiv = $("div.checklistitems");
            var ccheck = checklistitemsdiv.find("div.checklistitem.checked");
            for (var i = 0; i < ccheck.length; i++) {
                var dataperc = $(ccheck[i]).data("perc");
                var rate = $(ccheck[i]).data("rate");
                if (dataperc) {
                    completedperc += parseInt(parseInt(dataperc) * parseInt(rate) / 100);
                }
                else {
                    completedperc += parseInt(rate);
                }
            }
            return completedperc;
        }
        var BuildProgressBar = function () {
            var completedperc = GetCompletedRate();
            $("#chklistprogress").attr("aria-valuenow", completedperc)
                .css("width", completedperc + "%")
                .text(completedperc + " %")
                .removeClass()
                .addClass(tms.ProgressClass(completedperc));
        };
        var GetCheckListSwitchData = function () {
            var gr = {
                filter: {
                    filters: [
                        { field: "CHS_TASK", value: task.TSK_ID, operator: "eq" },
                        { field: "CHS_USER", value: user, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiCheckListSwitch/List",
                data: JSON.stringify(gr),
                quietly: true
            });
        };
        var CheckListSwitch = function () {
            return $.when(GetCheckListSwitchData()).done(function (d) {
                for (var j = 0; j < d.data.length; j++) {
                    var $row = $(".row[data-id=\"" + d.data[j].CHS_CHKID + "\"]");
                    var $onoff = $row.find(".onoff");
                    $onoff.bootstrapSwitch("state", (d.data[j].CHS_VALUE === "+"), true);
                    $onoff.data("sw", d.data[j].CHS_ID);
                }
                $("div.checklistitems input.onoff").each(function () {
                    if ($(this).data("disabled"))
                        $(this).bootstrapSwitch("disabled", true, false);
                });
            });
        };
        var GetCheckListItemValue = function (cle) {
            var e = $(cle);
            var etype = e.data("type");
            var itemvalue = null;
            var value = null;
            switch (etype) {
                case "YESNO":
                    value = e.find("select option:selected").val();
                    itemvalue = {
                        v: value || null,
                        t: "TEXT",
                        c: (!!value),
                        e: e.find("select")
                    };
                    break;
                case "CHECKBOX":
                case null:
                    value = e.find("input:checked").val();
                    itemvalue = {
                        v: value ? "+" : "-",
                        t: "TEXT",
                        c: (!!value),
                        e: e.find("input")
                    };
                    break;
                case "NUMERIC":
                    value = e.find("input").val();
                    itemvalue = {
                        v: (value ? parseFloat(value) : null),
                        t: "NUMERIC",
                        c: (!!value),
                        e: e.find("input")
                    };
                    break;
                case "DATE":
                    var value = e.find("input").val();
                    itemvalue = {
                        v: (value ? moment.utc(value, constants.dateformat) : null),
                        t: "DATE",
                        c: (!!value),
                        e: e.find("input")
                    };
                    break;
                case "FREETEXT":
                case "BARCODE":
                    value = (e.find("input").val() || null);
                    itemvalue = {
                        v: value,
                        t: "TEXT",
                        c: (!!value),
                        e: e.find("input")
                    };
                    break;
                case "LOOKUP":
                    value = (e.find("select option:selected").val() || null);
                    itemvalue = {
                        v: value,
                        t: "TEXT",
                        c: (!!value),
                        e: e.find("select")
                    };
                    break;
            }
            return itemvalue;
        }
        var SaveCheckListItems = function (checklistitems) {
            return tms.Ajax({
                url: "/Api/ApiChecklists/SaveItems",
                data: JSON.stringify(checklistitems),
                fn: function (d) {
                    return $.when(BuildChecklist()).done(function () {
                        var progress = GetCompletedRate();
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivityChecklists/UpdateCheckListProgress",
                            data: JSON.stringify({
                                TAC_ID: selectedtaskactivitychecklist.TAC_ID,
                                TAC_CHKLISTPROGRESS: progress
                            }),
                            quietly: true,
                            fn: function (d) {
                                msgs.success(d.data);
                                tac.List();
                            }
                        });
                    });
                }
            });
        }

        var BuildCheckListItem = function (checklistitem, lookuplines) {
            var id = checklistitem.CHK_ID;
            var type = checklistitem.CHK_TYPE;
            var text = checklistitem.CHK_TEXT;
            var templatelineid = checklistitem.CHK_TEMPLATELINEID;
            var required = checklistitem.CHK_NECESSARY === "+";
            var htmlinput = "text";
            var disabled = checklistdisabled ? "disabled=\"disabled\"" : "";

            switch (type) {
                case "YESNO":
                    htmlinput = "<div class=\"row\">";
                    htmlinput += "<div class=\"col-md-8\">";
                    htmlinput += "<span>" + text + "</span>";
                    htmlinput += "</div>";
                    htmlinput += "<div  class=\"col-md-4\">";
                    htmlinput += "<select class=\"form-control\" " + disabled + ">";
                    htmlinput += "<option value=\"\"" +
                        (!checklistitem.CHK_TEXTVALUE ? "selected=\"selected\"" : "") +
                        ">" +
                        applicationstrings[lang].pleaseselect +
                        "</option>";
                    htmlinput += "<option value=\"YES\"" +
                        (checklistitem.CHK_TEXTVALUE === "YES" ? "selected=\"selected\"" : "") +
                        ">" +
                        applicationstrings[lang].yes +
                        "</option>";
                    htmlinput += "<option value=\"NO\"" +
                        (checklistitem.CHK_TEXTVALUE === "NO" ? "selected=\"selected\"" : "") +
                        ">" +
                        applicationstrings[lang].no +
                        "</option>";
                    htmlinput += "</select>";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    break;
                case "CHECKBOX":
                case null:
                    htmlinput = "<div class=\"row\">";
                    htmlinput += "<div class=\"col-md-8\">";
                    htmlinput += "<span>" + text + "</span>";
                    htmlinput += "</div>";
                    htmlinput += "<div class=\"col-md-4\">";
                    htmlinput += "<div class=\"checkbox checkbox-primary\">";
                    htmlinput += "<input " +
                        disabled +
                        " class=\"styled\" type=\"checkbox\" name=\"check-" +
                        id +
                        "\" id=\"check-" +
                        id +
                        "\"" +
                        (checklistitem.CHK_TEXTVALUE === "+" ? "checked=\"checked\"" : "") +
                        "\">";
                    htmlinput += "<label></label>";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    break;
                case "NUMERIC":
                    htmlinput = "<div class=\"row\">";
                    htmlinput += "<div class=\"col-md-8\">";
                    htmlinput += "<span>" + text + "</span>";
                    htmlinput += "</div>";
                    htmlinput += "<div class=\"col-md-4\">";
                    htmlinput += "<input " +
                        disabled +
                        " class=\"form-control\" f-type=\"numeric\" type=\"text\" name=\"numeric-" +
                        id +
                        "\" id=\"numeric-" +
                        id +
                        "\" value=\"" +
                        (checklistitem.CHK_NUMERICVALUE || "") +
                        "\">";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    break;
                case "DATE":
                    htmlinput = "<div class=\"row\">";
                    htmlinput += "<div class=\"col-md-8\">";
                    htmlinput += "<span>" + text + "</span>";
                    htmlinput += "</div>";
                    htmlinput += "<div class=\"col-md-4\">";
                    htmlinput += "<input " +
                        disabled +
                        " class=\"form-control\" f-type=\"date\" type=\"text\" name=\"date-" +
                        id +
                        "\" id=\"date-" +
                        id +
                        "\" value=\"" +
                        (checklistitem.CHK_DATETIMEVALUE
                            ? moment(checklistitem.CHK_DATETIMEVALUE).format(constants.dateformat)
                            : "") +
                        "\">";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    break;
                case "FREETEXT":
                case "BARCODE":
                    htmlinput = "<div class=\"row\">";
                    htmlinput += "<div class=\"col-md-8\">";
                    htmlinput += "<span>" + text + "</span>";
                    htmlinput += "</div>";
                    htmlinput += "<div class=\"col-md-4\">";
                    htmlinput += "<input " +
                        disabled +
                        " class=\"form-control\"  type=\"text\" name=\"freetext-" +
                        id +
                        "\" id=\"freetext-" +
                        id +
                        "\" value=\"" +
                        (checklistitem.CHK_TEXTVALUE || "") +
                        "\"" +
                         (checklistitem.CHK_COMPARE ? " data-compare=\"" + checklistitem.CHK_COMPARE + "\"" : "")
                        + ">";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    break;
                case "LOOKUP":
                    htmlinput = "<div class=\"row\">";
                    htmlinput += "<div class=\"col-md-8\">";
                    htmlinput += "<span>" + text + "</span>";
                    htmlinput += "</div>";
                    htmlinput += "<div class=\"col-md-4\">";
                    htmlinput += "<select " +
                        disabled +
                        " class=\"form-control\" name=\"lookup-" +
                        id +
                        "\" id=\"lookup-" +
                        id +
                        "\">";
                    htmlinput += "<option value=\"\">" + applicationstrings[lang].pleaseselect + "</option>";
                    var lulines = $.grep(lookuplines, function (i) { return i.TML_CODE === templatelineid.toString(); });
                    if (lulines) {
                        for (var i = 0; i < lulines.length; i++) {
                            var luline = lulines[i];
                            var isoptionselected = luline.TML_ITEMCODE === (checklistitem.CHK_TEXTVALUE || checklistitem.CHK_DEFAULT);
                            var selectedstr = isoptionselected ? " selected=\"selected\"" : "";
                            htmlinput += "<option  " + selectedstr + " data-comments=\"" + luline.TML_COMMENTS + "\"data-documents=\"" + luline.TML_DOCUMENTS + "\"  value=\"" + luline.TML_ITEMCODE + "\">" + luline.TML_ITEMDESC + "</option>";
                        }
                    }
                    htmlinput += "</select>";
                    htmlinput += "</div>";
                    htmlinput += "</div>";
                    break;
            }
            return htmlinput;
        }
        var BuildCheckListUI = function (checklistdata, lookuplines) {
            var checklistitemsdiv = $("div.checklistitems");
            var collapsedid = "#" + checklistitemsdiv.find("div.collapse.in").attr("id");
            console.log(collapsedid);
            var itemcount = checklistdata.length;
            $("#accordion").remove();
            $("#checklistcount").text("0");
            if (itemcount > 0) {
                var checkeditemcount = $.grep(checklistdata, function (i) { return (i.CHK_CHECKED === "+"); }).length;
                $("#checklistcount").text(checkeditemcount + "/" + itemcount);

                var topics = $.map(
                    _.sortBy(_.uniq(
                        checklistdata, x => x.CHK_TOPIC + "_" + (x.CHK_TOPICORDER || "")
                    ), x => x.CHK_TOPICORDER), function (item, index) {
                        return {
                            Code: item.CHK_TOPIC || "NA",
                            Text: item.CHK_TOPICDESC || "NA",
                            AllowNewLine: item.CHK_TOPICNEWLINE || "-",
                            Order: item.CHK_TOPICORDER || null
                        };
                    })

                if (topics != null) {

                    var chklistpanel = "<div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">"
                    for (var i = 0; i < topics.length; i++) {
                        var topic = topics[i];
                        var topicitems = $.grep(checklistdata, function (item) {
                            return (item.CHK_TOPIC || "NA") === topic.Code
                                && (1 === (topic.Order != null ? (item.CHK_TOPICORDER === topic.Order ? 1 : 0) : 1));
                        });

                        topicextstr = (topic.Order != null ? "-" + topic.Order : "");

                        chklistpanel += "<div class=\"panel panel-default\">"
                        chklistpanel += "<div class=\"panel-heading\" role =\"tab\" id=\"heading-" + topic.Code.replaceAll(".", "-") + topicextstr + "\">"
                        chklistpanel += "<button class=\"btn btn-xs btn-default\" role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#collapse-" + topic.Code.replaceAll(".", "-") + topicextstr + "\">"
                        chklistpanel += "<i class=\"fa fa-check-square-o fa-fw fa-ml-5\"></i> " + topic.Text + (topic.Order != null ? " - " + topic.Order : "")
                        chklistpanel += "</button>"
                        if (topic.AllowNewLine == "+" && !customer) {
                            chklistpanel += "<div class=\"pull-right\">";
                            if (topic.Order === 1) {
                                chklistpanel += "<a class=\"btn btn-xs btn-success btn-copy-topic\" data-tacid=\"" + selectedtaskactivitychecklist.TAC_ID + "\"  data-topic=\"" + topic.Code + "\"><i class=\"fa fa-plus-square fa-fw\"></i> " + applicationstrings[lang].addnew + "</a>";
                            }
                            if (topic.Order !== 1) {
                                chklistpanel += "&nbsp;<a class=\"btn btn-xs btn-danger btn-remove-topic\" data-order=\"" + topic.Order + "\" data-tacid=\"" + selectedtaskactivitychecklist.TAC_ID + "\"  data-topic=\"" + topic.Code + "\"><i class=\"fa fa-times fa-fw\"></i> " + applicationstrings[lang].remove + "</a>";
                            }
                            chklistpanel += "</div>"
                        }
                        chklistpanel += "</div>"
                        chklistpanel += "<div id = \"collapse-" + topic.Code.replaceAll(".", "-") + topicextstr + "\" class=\"panel-collapse collapse\" role = \"tabpanel\" aria-labelledby=\"heading-" + topic.Code.replaceAll(".", "-") + topicextstr + "\">"
                        chklistpanel += "<div class=\"panel-body\">"

                        chklistpanel += "<div class=\"row chklist-header custom well\">";
                        chklistpanel += "<div class=\"col-md-1\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].no + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "<div class=\"col-md-5\">";
                        chklistpanel += "<div class=\"row\">";
                        chklistpanel += "<div class=\"col-md-8\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].description + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "<div class=\"col-md-4\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].option + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "</div>";
                        chklistpanel += "</div>";
                        chklistpanel += "<div class=\"col-md-2\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].commentsanddocuments + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "<div class=\"col-md-3\">";
                        chklistpanel += "<div class=\"row\">"
                        chklistpanel += "<div class=\"col-md-6\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].updatedby + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "<div class=\"col-md-6\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].updated + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "</div>";
                        chklistpanel += "</div>";
                        chklistpanel += "<div class=\"col-md-1\">";
                        chklistpanel += "<strong>" + gridstrings.checklist[lang].followup + "</strong>";
                        chklistpanel += "</div>";
                        chklistpanel += "</div>";

                        for (var j = 0; j < topicitems.length; j++) {
                            var chkitem = topicitems[j];

                            chklistpanel += "<div data-id=\"" +
                                chkitem.CHK_ID +
                                "\" class=\"row custom data-container checklistitem" +
                                (chkitem.CHK_CHECKED === "+" ? " checked" : "") +
                                (chkitem.CHK_NECESSARY === "+" ? " required" : "") +
                                "\"" +
                                (chkitem.CHK_RATE ? " data-rate=\"" + chkitem.CHK_RATE + "\"" : "") +
                                (chkitem.CHK_PERC === "+" ? " data-perc=\"" + (chkitem.CHK_TEXTVALUE || "0") + "\"" : "") +
                                ">";
                            chklistpanel +=
                                "<div class=\"col-md-1\"><span style=\"color:#FFF;margin-top:5px;\" class=\"number badge badge-" + (chkitem.CHK_CHECKED === "+" ? "success" : + "info") + "\">" +
                                (j + 1) +
                                "</span></div>";
                            chklistpanel += "<div data-type=\"" + chkitem.CHK_TYPE + "\" class=\"col-md-5 ui-field-input\">";
                            chklistpanel += BuildCheckListItem(chkitem, lookuplines);
                            chklistpanel += "</div>";
                            chklistpanel += "<div class=\"col-md-2\">";
                            chklistpanel += "<button " + " class=\"btn btn-default btn-sm btn-comments\" data-id=\"" + chkitem.CHK_ID + "\" id=\"btn-" + chkitem.CHK_ID + "\"><i class=\"fa fa-comment\"></i> <span class=\"count\">" + chkitem.CHK_CMNCOUNT + "</span></button> ";
                            chklistpanel += "<button " + " class=\"btn btn-default btn-sm btn-documents\" data-id=\"" + chkitem.CHK_ID + "\" id=\"btn-" + chkitem.CHK_ID + "\"><i class=\"fa fa-file\"></i> <span class=\"count\">" + chkitem.CHK_DOCCOUNT + "</span></button>";
                            chklistpanel += "</div>";
                            chklistpanel += "<div class=\"col-md-3\">";
                            chklistpanel += "<div class=\"row\">";
                            chklistpanel += "<div class=\"col-md-6\">";
                            chklistpanel += (chkitem.CHK_UPDATEDBY ? chkitem.CHK_UPDATEDBYDESC : "");
                            chklistpanel += "</div>";
                            chklistpanel += "<div class=\"col-md-6\">";
                            chklistpanel += (chkitem.CHK_UPDATED
                                ? moment(chkitem.CHK_UPDATED).format(constants.longdateformat)
                                : "");
                            chklistpanel += "</div>";
                            chklistpanel += "</div>";
                            chklistpanel += "</div>";
                            chklistpanel += "<div class=\"col-md-1 pos-left\">";
                            chklistpanel += "<input type=\"checkbox\" " +
                                (chkitem.CHK_CHECKED === "+" ? "data-disabled=\"true\"" : "") +
                                " class=\"onoff\">";
                            chklistpanel += "</div>";
                            chklistpanel += "</div>";
                        }

                        chklistpanel += "</div>"
                        chklistpanel += "</div>"
                        chklistpanel += "</div>"
                    }

                    chklistpanel += "</div>";
                }

                checklistitemsdiv.append(chklistpanel);
                $(collapsedid).addClass("in").collapse("show");

                $(".onoff").bootstrapSwitch();
                checklistitemsdiv.find("[f-type=\"date\"]").datetimepicker({
                    format: constants.dateformat,
                    showClear: true,
                    icons: { clear: "fa fa-eraser" }
                });

                $("a.btn-copy-topic").off("click").on("click", function () {
                    var tacid = $(this).data("tacid");
                    var topic = $(this).data("topic");
                    return tms.Ajax({
                        url: "/Api/ApiChecklists/CopyChecklistTopic",
                        data: JSON.stringify({
                            TacId: tacid,
                            Topic: topic
                        }),
                        fn: function (d) {
                            msgs.success(d.data);
                            BuildChecklist();
                        }
                    });
                });


                $("a.btn-remove-topic").off("click").on("click", function () {
                    var tacid = $(this).data("tacid");
                    var topic = $(this).data("topic");
                    var order = $(this).data("order");
                    return tms.Ajax({
                        url: "/Api/ApiChecklists/RemoveChecklistTopic",
                        data: JSON.stringify({
                            TacId: tacid,
                            Topic: topic,
                            Order: order
                        }),
                        fn: function (d) {
                            msgs.success(d.data);
                            BuildChecklist();
                        }
                    });
                });


                checklistitemsdiv.find("input[f-type=\"numeric\"]")
                    .numericInput({ allowNegative: true, allowFloat: true });

                checklistitemsdiv.find("select").each(function (i, e) {
                    var $this = $(this);
                    var opt = $this.find("option:selected");
                    $this.closest("div.checklistitem")
                        .find("button.btn-comments")
                        .removeClass(opt.data("comments") === "+" ? "btn-default" : "btn-required")
                        .addClass(opt.data("comments") === "+" ? "btn-required" : "btn-default");
                    $this.closest("div.checklistitem")
                        .find("button.btn-documents")
                        .removeClass(opt.data("documents") === "+" ? "btn-default" : "btn-required")
                        .addClass(opt.data("documents") === "+" ? "btn-required" : "btn-default");
                });

                CalcCheckListItemRates();
                RegisterChecklistEvnt();
                CheckListSwitch();
            }

            BuildProgressBar();
        };
        BuildChecklist = function () {
            return $.when(self.LoadCheckList()).done(function (d) {
                BuildCheckListUI(d.data, d.lookuplines);
            });
        };
        this.Ready = function () {

            $("#checklistcontrols").removeClass("hidden");
            return $.when(tms.Ajax({
                url: "/Api/ApiTaskActivities/GetByActivity",
                data: JSON.stringify({
                    TSA_TASK: selectedtaskactivitychecklist.TAC_TASK,
                    TSA_LINE: selectedtaskactivitychecklist.TAC_ACTIVITY
                })
            })).done(function (d) {
                var chkactivity = d.data;
                if (chkactivity) {
                    checklistdisabled =
                        !!customer ||
                        selectedtaskactivitychecklist.TAC_COMPLETED === "+" ||
                        act.Check.CheckIfActivityCompletedOrRejected() ||
                        !(act.Check.CheckIfLMOfAny(chkactivity.TSA_DEPARTMENT) ||
                            act.Check.CheckIfInAssignedUsers() ||
                            chkactivity.TSA_CREATEDBY === user
                        );
                    $("#btnSaveChecklist").prop("disabled", checklistdisabled);
                    return $.when(BuildChecklist()).done(function () {
                        if (!act.Check.CheckIfActivityApprovedOrNA())
                            $("#checklistitems [disable-when-act-na]").prop("disabled", true);
                        if (checklistdisabled) {
                            $("#checklistitems [hide-when-act-inappropriate]").hide();
                            $("#checklistitems [disable-when-act-inappropriate]").prop("disabled", true);
                        }
                    });
                }
            });
        }

        this.ResetUI = function () {
            $("div.checklistitems").find("*").remove();
            $("#checklistcount").text("");
            BuildProgressBar();
            $("#checklistcontrols").addClass("hidden");
        }

        RegisterUIEvents = function () {
            $("#btnSaveChecklist").on("click",
                function () {
                    var $this = $(this);
                    $this.addClass("ui-disabled");

                    var checklistitemsarr = [];
                    var checklistitems = $("div.checklistitems div.checklistitem");

                    for (var i = 0; i < checklistitems.length; i++) {
                        var chkitem = checklistitems[i];
                        var id = $(chkitem).data("id");
                        var ctrl = $(chkitem).find(".ui-field-input");
                        var itemvalue = GetCheckListItemValue(ctrl);
                        //var note = ($(chkitem).find(".ui-field-note").find("input").val() || null);

                        var o = {
                            CHK_ID: id,
                            CHK_UPDATED: tms.Now(),
                            CHK_UPDATEDBY: user,
                            //CHK_NOTE: note,
                            CHK_TEXTVALUE: (itemvalue.t === "TEXT" ? itemvalue.v : null),
                            CHK_NUMERICVALUE: (itemvalue.t === "NUMERIC" ? itemvalue.v : null),
                            CHK_DATETIMEVALUE: (itemvalue.t === "DATE" ? itemvalue.v : null),
                            CHK_CHECKED: itemvalue.c ? "+" : "-"
                        }

                        checklistitemsarr.push(o);
                    }
                    return $.when(SaveCheckListItems(checklistitemsarr)).always(function () {
                        $this.removeClass("ui-disabled");
                    });
                });
            checklistCommentsHelper = new comments({
                input: "#m_comment",
                btnaddcomment: "#m_addComment",
                modal: "#modalcomments",
                commentcounttext: "div.checklistitem[data-id=\"#source#\"] button.btn-comments span.count",
                commentsdiv: "#m_comments",
                chkvisibletocustomer: "#m_visibletocustomer",
                chkvisibletosupplier: "#m_visibletosupplier"
            });
            checklistDocumentsHelper = new documents({
                input: "#m_fu",
                filename: "#m_filename",
                uploadbtn: "#m_btnupload",
                container: "#m_fupload",
                documentcounttext: "div.checklistitem[data-id=\"#source#\"] button.btn-documents span.count",
                modal: "#modaldocuments",
                documentsdiv: "#m_docs",
                progressbar: "#m_docuprogress"
            });
        };

        RegisterUIEvents();

    };
    var quototask = new function () {
        var grdquototask = null;
        var grdquototaskElm = $("#grdquototask");
        var checkedlines = null;
        var self = this;

        var gridChange = function (e) {
            //itemSelect(e.sender.select());
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdquototask input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var Save = function () {
            var listofchecked = [];
            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                var quanid = "#quantity-" + line.data("id");

                if ($(quanid).val() <= 0 || !$(quanid).val()) {
                    msgs.error(applicationstrings[lang].countmustbegreaterthenzero2);
                    return $.Deferred().reject();
                };

                var o = {
                    Type: line.data("type"),
                    LineId: line.data("id"),
                    Quantity: $(quanid).val(),
                    Line: selectedactivity.TSA_LINE,
                    User: user
                }
                listofchecked.push(o);
            }

            var p = {
                Task : selectedactivity.TSA_TASK,
                Activity : selectedactivity.TSA_ID,
                Lines : listofchecked
            }

            return tms.Ajax({
                url: "/Api/ApiQuotations/QuotationToActivity",
                data: JSON.stringify(p),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ListQuotations();
                }
            });
        };
        var gridDataBound = function () {
            var checkinputs = $("#grdquototask input[data-name=\"chkLine\"]:not(:disabled)");
            tms.NumericInput();
            grdquototaskElm.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdquototaskElm.find("#btnSaveLines").off("click").on("click", function () {
                checkedlines = grdquototaskElm.find("input[data-name=\"chkLine\"]:checked");
                if (checkedlines.length === 0) {
                    msgs.error(applicationstrings[lang].invlinenotselected);
                    return $.Deferred().reject();
                }
                Save();
            });
        };
        this.ListQuotations = function () {
            var grdFilter = [
                { field: "QLN_QUOTATION", value: selectedquotation.QUO_ID, operator: "eq", logic: "and" },
                { field: "QLN_TYPE", value: "PART", operator: "neq", logic: "and" },
                { field: "QLN_COPY", value: "-", operator: "eq", logic: "and" }

            ];
            var columns = [
                {
                    type: "na",
                    title: "#",
                    field: "chkLine",
                    template:
                        "<div style=\"text-align:center;\">" +
                            "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\"  data-id=\"#= QLN_LINEID #\" data-type=\"#= QLN_TYPE #\" /><label></label>" +
                            "</div>",
                    filterable: false,
                    sortable: false,
                    width: 35
                },
                { type: "number", field: "QLN_QUOTATION", title: gridstrings.quocopy[lang].quo, width: 100 },
                {
                    type: "string",
                    field: "QLN_SUBTYPE",
                    title: gridstrings.quocopy[lang].type,
                    width: 100
                },
                { type: "string", field: "QLN_DESCRIPTION", title: gridstrings.quocopy[lang].desc, width: 250 },
                { type: "string", field: "QLN_UOM", title: gridstrings.quocopy[lang].uom, width: 100 },
                {
                    type: "na",
                    field: "txtline2",
                    template:
                        "<div style=\"text-align:center;\">" +
                            "<input style=\"width:70px;\" value=\"#= QLN_QUANTITY #\" type=\"text\" calc-group=\"1\" min=\"0\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control\" id=\"quantity-#= QLN_LINEID #\" />" +
                            "</div>",
                    title: gridstrings.quocopy[lang].quan,
                    filterable: false,
                    sortable: false,
                    width: 100
                },
                { type: "price", field: "QLN_UNITPURCHASEPRICE", title: gridstrings.quocopy[lang].unitprice, width: 100 },
                { type: "string", field: "QLN_PURCHASECURR", title: gridstrings.quocopy[lang].curr, width: 100 },
                { type: "price", field: "QLN_PURCHASEEXCH", title: gridstrings.quocopy[lang].exch, width: 100 },
                { type: "price", field: "QLN_UNITSALESPRICE", title: gridstrings.quocopy[lang].salesprice, width: 100 },
                { type: "string", field: "QLN_CURR", title: gridstrings.quocopy[lang].curr, width: 100 },
                { type: "price", field: "QLN_EXCH", title: gridstrings.quocopy[lang].exch, width: 100 }
            ];
            var fields = {
                QLN_QUANTITY: { type: "number" },
                QLN_UNITSALESPRICE: { type: "number" },
                QLN_PURCHASEEXCH: { type: "number" },
                QLN_UNITPURCHASEPRICE: { type: "number" },
                QLN_EXCH: { type: "number" },
                QLN_QUOTATION: { type: "number" }
            };

            if (supplier) {
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QLN_UNITSALESPRICE"]) == -1); });
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QLN_EXCH"]) == -1); });
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QLN_CURR"]) == -1); });
                delete fields.QLN_UNITSALESPRICE;
                delete fields.QLN_EXCH;
            }

            if (grdquototask) {
                grdquototask.ClearSelection();
                grdquototask.RunFilter(grdFilter);
            } else {
                grdquototask = new Grid({
                    keyfield: "QLN_NO",
                    columns: columns,
                    fields: fields,

                    datasource: "/Api/ApiQuotations/ListLinesView",
                    selector: "#grdquototask",
                    name: "grdquototask",
                    height: 500,
                    filter: grdFilter,
                    sort: [{ field: "QLN_NO", dir: "desc" }],
                    databound: gridDataBound,
                    change: gridChange,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>",
                            "<button class=\"btn btn-default btn-sm\" id=\"btnSaveLines\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].save#</button>"
                        ]
                    }
                });
            }
        };
        this.CheckQuotation = function () {
            var grdFilter = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "QUO_TASK", value: selectedactivity.TSA_TASK, operator: "eq", logic: "and" },
                        { field: "QUO_ACTIVITY", value: selectedactivity.TSA_LINE, operator: "eq", logic: "and" },
                        { field: "QUO_STATUS", value: "K", operator: "eq", logic: "and" }
                    ]
                }
            };

            tms.Ajax({
                url: "/Api/ApiQuotations/List",
                data: JSON.stringify(grdFilter),
                fn: function (d) {
                    if (d.data.length === 1) {
                        selectedquotation = d.data[0];
                    } 
                }
            });
        };
        var RegisterUIEvents = function () {

        };
        RegisterUIEvents();
    };
    act = new function () {
        var self = this;
        var $grdActivities = $("#grdActivities");
        var grdActivities = null;
        var taskActivityDocumentsHelper;
        var taskActivityCommentsHelper;
        var selectedactduration;
        var colorHash = new ColorHash();

        var SaveComment = function (source, text) {
            if (!text)
                return $.Deferred().resolve();

            var cmnt = {
                CMN_SUBJECT: "TASK",
                CMN_SOURCE: source,
                CMN_TEXT: text,
                CMN_VISIBLETOCUSTOMER: "-",
                CMN_VISIBLETOSUPPLIER: "+"
            };
            return tms.Ajax({
                url: "/Api/ApiComments/Save",
                data: JSON.stringify(cmnt)
            });
        }
        var SendBack = function () {
            if (!tms.Check("#modalsendback"))
                return $.Deferred().reject();

            var o = {
                TSA_ID: selectedactivity.TSA_ID
            }

            return tms.Ajax({
                url: "/Api/ApiTaskActivities/SendBack",
                data: JSON.stringify(o),
                fn: function (d) {
                    msgs.success(d.data);
                    $("#modalsendback").modal("hide");
                    self.List();
                }
            });
        };
        this.ActivityCalendar = new function () {
            var selecteduser = null;
            var ActivityCalendarEventRenderer = function (event, element) {
                element.css({
                    "background": colorHash.hex(event.d.TCA_RELATEDUSER),
                    "border-color": "#FFF",
                    "padding": "0.2em",
                    "text-decoration": (event.d.TCA_COMPFL === "+" ? "line-through" : "none")
                });
            }
            var GetMonthlyItems = function (params) {
                return tms.Ajax({
                    url: "/Api/ApiCalendar/GetMonthlyItems",
                    data: JSON.stringify(params),
                    fn: function (d) {
                        var sctrl = $("#activitycalendar");
                        sctrl.fullCalendar("removeEvents");
                        var events = [];
                        var finaldata = $.grep(d.data,
                            function (e, i) {
                                return $.inArray(e.TCA_TYPE, ["ASSIGNED", "TRADE"]) !== -1;
                            });
                        for (var i = 0; i < finaldata.length; i++) {
                            var di = finaldata[i];
                            events.push({
                                title: di.TCA_ACTDESC,
                                start: di.TCA_FROM,
                                end: di.TCA_TO,
                                d: di,
                                o: di.TCA_TYPE
                            });
                        }
                        sctrl.fullCalendar("addEventSource", events);
                    }
                });
            }
            var BuildMonthlyHolidays = function (params) {
                return tms.Ajax({
                    url: "/Api/ApiHolidays/GetMonthlyHolidays",
                    data: JSON.stringify(params),
                    fn: function (d) {
                        for (var i = 0; i < d.data.length; i++) {
                            var di = d.data[i];
                            var day = moment(di.HOL_DATE).format(constants.dateformat2);
                            $("#activitycalendar td.fc-day[data-date=\"" + day + "\"]")
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
            var BuildMonthlyPlanCalendar = function () {
                var activitycalendarctrl = $("#activitycalendar");
                var currentdate = activitycalendarctrl.fullCalendar("getDate");
                var syear = moment(currentdate, constants.dateformat).get("year");
                var smonth = moment(currentdate, constants.dateformat).month() + 1;
                var assignedto = $("#assignedto").val();

                var params = { Year: syear, Month: smonth, user: selecteduser };
                return $.when(BuildMonthlyHolidays(params)).done(function () {
                    return GetMonthlyItems(params);
                });
            }
            var BuildActivityCalendar = function () {
                $("#activitycalendar").fullCalendar({
                    header: { left: "title", right: "prev,next" },
                    firstDay: 1,
                    eventOrder: "o",
                    fixedWeekCount: false,
                    displayEventTime: true,
                    showNonCurrentDates: false,
                    height: shared.documentHeight() - 275,
                    views: { month: { eventLimit: 3 } },
                    defaultView: "month",
                    timeFormat: constants.timeformat,
                    eventRender: ActivityCalendarEventRenderer,
                    eventAfterRender: function (event, $el, view) {
                        $el.find(".fc-content").marquee({
                            delayBeforeStart: 5000,
                            pauseOnCycle: true,
                            pauseOnHover: true,
                            startVisible: true
                        });
                        var formattedTime = moment(event.start).format(constants.timeformat) +
                            " - " +
                            moment(event.end || event.start).format(constants.timeformat);
                        if ($el.find(".fc-title").length === 0) {
                            $el.find(".fc-time").text(formattedTime + " - " + event.title);
                        } else {
                            $el.find(".fc-time").text(formattedTime);
                        }
                    },
                    dayClick: function (date, jsEvent, view) {
                    }
                });
                $("#activitycalendar .fc-prev-button,#activitycalendar .fc-next-button")
                    .click(BuildMonthlyPlanCalendar);
                BuildMonthlyPlanCalendar();
            }
            this.ShowActivityCalendar = function () {
                var trade = $("#trade").val();
                var assignedto = $("#assignedto").val();
                var modalactivitycalendar = $("#modalactivitycalendar");
                var selectedtradeorusers = $("#selectedtradeorusers");
                selectedtradeorusers.find("*").remove();
                if (!trade || (trade === "*" && !assignedto)) {
                    msgs.error(applicationstrings[lang].selecttradeoruser);
                    return false;
                }
                if (trade !== "*") {
                    var tradeColor = colorHash.hex(trade);
                    selecteduser = trade;
                    selectedtradeorusers.append("<span style=\"margin-right: 5px;\"><strong><i style=\"color:" +
                        tradeColor +
                        "\" class=\"fa fa-fw fa-2x fa-circle\" aria-hidden=\"true\"></i> " +
                        trade +
                        "</strong></span>");
                } else {
                    var assignedtoarr = $("#assignedto").tagsinput("items");
                    selecteduser = assignedto;
                    var assignedtostrblock = "";
                    for (var i = 0; i < assignedtoarr.length; i++) {
                        var assignee = assignedtoarr[i];
                        var assigneeColor = colorHash.hex(assignee.id);
                        assignedtostrblock += "<span style=\"margin-right: 5px;\"><strong><i style=\"color:" +
                            assigneeColor +
                            "\" class=\"fa fa-fw fa-2x fa-circle\" aria-hidden=\"true\"></i> " +
                            "( " +
                            assignee.id +
                            " ) " +
                            assignee.text +
                            "</strong></span>";
                    }
                    selectedtradeorusers.append(assignedtostrblock);
                }

                modalactivitycalendar.find("div.modal-body").css({ "height": shared.documentHeight() - 200 });
                modalactivitycalendar.modal("show");
                BuildActivityCalendar();
            }
        }
        this.Check = new function () {
            var acref = this;

            this.CheckIfAuthorized = function (dep) {

                //return usergroup === "ADMIN" ||
                //    $.inArray(dep, lmdepartments) !== -1 ||
                //    $.inArray("*", lmdepartments) !== -1;
                return true;
            };
            this.CheckIfLMOfAny = function () {
                return (lmdepartments.length > 0);
            };
            this.CheckIfActivityCompletedOrRejected = function () {
                if (!selectedactivity) return false;
                return (selectedactivity.TSA_COMPLETED === "+" || selectedactivity.TSA_STATUS === "REJ");
            };
            this.CheckIfActivityRejected = function () {
                if (!selectedactivity) return false;
                return (selectedactivity.TSA_STATUS === "REJ");
            };
            this.CheckIfActivityApprovedOrNA = function () {
                if (!selectedactivity) return false;
                return ($.inArray(selectedactivity.TSA_STATUS, ["APP", "NA"]) !== -1);
            };
            this.CheckIfInAssignedUsers = function () {
                if (!selectedactivity || !selectedactivity.TSA_ASSIGNEDTOARR) return false;
                var result = $.grep(selectedactivity.TSA_ASSIGNEDTOARR,
                    function (i) {
                        return i.USR_CODE === user ||
                            (i.USR_CODE === "*" && i.USR_DEPARTMENT === selectedactivity.TSA_DEPARTMENT);
                    });
                return (result && result.length > 0);
            };
        };
        var FillUserInterface = function () {
            tms.UnBlock("#activitiesform div.inline-toolbar,.act-left,.act-right");
            tms.BeforeFill("#activities");

            var isAuthorizedUser = self.Check.CheckIfAuthorized(selectedactivity.TSA_DEPARTMENT);
            var isAssignedUser = self.Check.CheckIfInAssignedUsers(selectedactivity.TSA_DEPARTMENT);
            var isActivityRejected = self.Check.CheckIfActivityRejected(selectedactivity.TSA_DEPARTMENT);
            var isActivityCompleted = self.Check.CheckIfActivityCompletedOrRejected(selectedactivity.TSA_DEPARTMENT);

            asr.SetServiceCodeCount();
            aeq.SetEquipmentCount();
            rev.SetRevisionCount(selectedactivity);
            taskActivityCommentsHelper.showCommentsBlock({ subject: "ACTIVITY", source: selectedactivity.TSA_ID });
            taskActivityDocumentsHelper.showDocumentsBlock({ subject: "ACTIVITY", source: selectedactivity.TSA_ID });

            $("#btnSaveActivity").prop("disabled",
                !(isAuthorizedUser || isAssignedUser) || isActivityRejected || isActivityCompleted);
            $("#btnDeleteActivity").prop("disabled", !isAuthorizedUser || isActivityCompleted);

            $("#actdesc").prop("disabled", !(isAuthorizedUser || isAssignedUser) || isActivityCompleted);
            $("#schfrom").prop("disabled", !(isAuthorizedUser || isAssignedUser) || isActivityCompleted);
            $("#schto").prop("disabled", !(isAuthorizedUser || isAssignedUser) || isActivityCompleted);
            $("#actdesc").prop("disabled", !(isAuthorizedUser || isAssignedUser) || isActivityCompleted);
            $("#trade").prop("disabled", !isAuthorizedUser || isActivityCompleted);
            $("#btntrade").prop("disabled", !isAuthorizedUser || isActivityCompleted);
            $("#assignedto").prop("disabled", !isAuthorizedUser || isActivityCompleted || selectedactivity.TSA_TRADE !== "*");
            $("#btnaddme").prop("disabled", !isAuthorizedUser || isActivityCompleted || selectedactivity.TSA_TRADE !== "*");
            $("#btnAssignedTo").prop("disabled", !isAuthorizedUser || isActivityCompleted || selectedactivity.TSA_TRADE !== "*");
            $("#predecessor").prop("disabled", true);
            $("#btnpredecessor").prop("disabled", true);
            $("#actprivate").prop("disabled", !isAuthorizedUser || isActivityCompleted);
            if ($("#logistics").length > 0)
                $("#logistics").prop("disabled", !isAuthorizedUser || isActivityCompleted);
            $("#projectedtime").prop("disabled", isActivityCompleted);
            $("#actmobilenote").prop("disabled", isActivityCompleted);
            $("#actcompleted").prop("disabled",
                !(((isAuthorizedUser || isAssignedUser) &&
                        $.inArray(selectedactivity.TSA_STATUS, ["NA", "APP"]) !== -1) &&
                    !isActivityCompleted));

            $("#line").val(selectedactivity.TSA_LINE);
            $("#dep").val(selectedactivity.TSA_DEPARTMENT);
            $("#actdesc").val(selectedactivity.TSA_DESC);
            $("#trade").val(selectedactivity.TSA_TRADE);
            $("#predecessor").val(selectedactivity.TSA_PREDECESSOR);
            $("#projectedtime").val(selectedactivity.TSA_PROJECTEDTIME);
            $("#actmobilenote").val(selectedactivity.TSA_MOBILENOTE);
            $("#lmapprovalrequired").prop("checked", selectedactivity.TSA_LMAPPROVALREQUIRED === "+");
            $("#actprivate").prop("checked", selectedactivity.TSA_PRIVATE === "+");
            $("#actcompleted").prop("checked", selectedactivity.TSA_COMPLETED === "+");
            if ($("#logistics").length > 0)
                $("#logistics").prop("checked", selectedactivity.TSA_CHK01 === "+");

            $("#schfrom").val(selectedactivity.TSA_SCHFROM
                ? moment(selectedactivity.TSA_SCHFROM).format(constants.longdateformat)
                : null);
            $("#schfrom").data("lvalue",
                selectedactivity.TSA_SCHFROM
                ? moment(selectedactivity.TSA_SCHFROM).format(constants.longdateformat)
                : null);
            $("#schto").val(selectedactivity.TSA_SCHTO
                ? moment(selectedactivity.TSA_SCHTO).format(constants.longdateformat)
                : null);
            $("#schto").data("lvalue",
                selectedactivity.TSA_SCHTO
                ? moment(selectedactivity.TSA_SCHTO).format(constants.longdateformat)
                : null);

            $("#divreason").addClass("hidden");
            $("#reason").val("").removeClass("required").removeProp("required");
            $("#docuprogressact").text("0%").css("width", "0");

            tooltip.show("#predecessor", selectedactivity.TSA_PREDECESSORDESC);
            tooltip.show("#dep", selectedactivity.TSA_DEPARTMENTDESC);
            tooltip.show("#trade", selectedactivity.TSA_TRADEDESC);

            $("#assignedto").tagsinput("removeAll");
            if (selectedactivity.TSA_ASSIGNEDTOARR != null)
                for (var i = 0; i < selectedactivity.TSA_ASSIGNEDTOARR.length; i++) {
                    $("#assignedto").tagsinput("add",
                        {
                            id: selectedactivity.TSA_ASSIGNEDTOARR[i].USR_CODE,
                            text: selectedactivity.TSA_ASSIGNEDTOARR[i].USR_DESC
                        },
                        ["ignore"]);
                }
            if ($.inArray(selectedactivity.TSA_STATUS, ["AWA", "ACA"]) !== -1 && isAuthorizedUser) {
                $(".actapprovalbtnscontainer").show();
            } else {
                $(".actapprovalbtnscontainer").hide();
            }

            $("#actdesc").focus();
            $("#btnChecklist").prop("disabled", false);
            $("#btnActivityEquipmentMaintenance").prop("disabled", false);
            $("#btnActivityServiceCode").prop("disabled", false);
            $("#btnRevisionHistory").prop("disabled", false);
            $("#btnTaskActivityEquipmentSave").prop("disabled", false);
            $("#btnTaskActivityServiceCodesSave").prop("disabled", false);

            if (pstat === "C") {
                tms.Block("#activitiesform div.inline-toolbar,.act-left,.act-right");
                $("#btnTaskActivityEquipmentSave").prop("disabled", true);
                $("#btnTaskActivityServiceCodesSave").prop("disabled", true);
            }
        };
        var UpdateActivityStatus = function (status) {
            if (!tms.Check("#activities"))
                dfd.reject();

            var schfrom = $("#schfrom").val() ? moment.utc($("#schfrom").val(), constants.longdateformat) : null;
            var schto = $("#schto").val() ? moment.utc($("#schto").val(), constants.longdateformat) : null;

            if (schfrom && schto && schto.diff(schfrom, "minutes") < 0) {
                msgs.error(applicationstrings[lang].dateerr1);
                dfd.reject();
            }

            var o = JSON.stringify({
                TSA_ID: selectedactivity.TSA_ID,
                TSA_STATUS: status,
                TSA_ASSIGNEDTO: ($("#assignedto").val() || null),
                TSA_UPDATED: selectedactivity != null ? tms.Now() : null,
                TSA_UPDATEDBY: selectedactivity != null ? user : null,
                TSA_RECORDVERSION: selectedactivity != null ? selectedactivity.TSA_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiTaskActivities/UpdateStatus",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    $(".actapprovalbtnscontainer").hide();
                    selectedactivity.TSA_STATUS = status;
                }
            });
        };
        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMTASKACTIVITIES", operator: "eq" },
                    { field: "AUD_REFID", value: task.TSK_ID, operator: "eq" }
                ]
            });
        };
        var PlaceMarker = function (location, markerfillcolor) {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
            map.setCenter(location);
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
                animation: google.maps.Animation.DROP,
                position: location
            });
            markersArray.push(marker);
        };
        var ListDurations = function () {
            var gridreq = {
                sort: [{ field: "DUR_ID", dir: "desc" }],
                filter: {
                    filters: [
                        { field: "DUR_TASK", value: task.TSK_ID, operator: "eq" },
                        { field: "DUR_ACTIVITY", value: selectedactivity.TSA_LINE, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityDuration/List",
                data: JSON.stringify(gridreq),
                quietly: true,
                fn: function (d) {
                    var adur = $("#activitydurations");
                    var strlist = "<div class=\"dur-items\">";
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        var markerfillcolor = !di.DUR_END ? "#398439" : "#d43f3a";
                        strlist += "<div href=\"#\" class=\"well\">";
                        strlist += "<p><span class=\"badge " +
                            (di.DUR_END ? "badge-danger" : "badge-success") +
                            "\">" +
                            di.DUR_TRADE +
                            "</span><span class=\"pull-right\"><a class=\"lnk-map\" href=\"#\" data-lat=\"" +
                            (di.DUR_ENDLAT || di.DUR_STARTLAT) +
                            "\" data-fillcolor=\"" +
                            markerfillcolor +
                            "\" data-lng=\"" +
                            (di.DUR_ENDLNG || di.DUR_STARTLNG) +
                            "\"><i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i> " +
                            applicationstrings[lang].map +
                            "</a>&nbsp;";

                        // if (usergroup === "ADMIN")
                        strlist += "<a class=\"lnk-edit\" href=\"#\" data-id=\"" +
                            di.DUR_ID +
                            "\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> " +
                            applicationstrings[lang].edit +
                            "</a></span>";
                        strlist += "</p>";
                        strlist += "<p><strong>" +
                            applicationstrings[lang].schfrom +
                            "</strong> :" +
                            moment(di.DUR_START).format(constants.longdateformat) +
                            "</p>";
                        strlist += "<p><strong>" +
                            applicationstrings[lang].schto +
                            "</strong> :" +
                            (di.DUR_END ? moment(di.DUR_END).format(constants.longdateformat) : "?") +
                            "</p>";
                        if (di.DUR_END)
                            strlist += "<p><i class=\"fa fa-pencil\"></i> " + di.DUR_ENDDTYPE + "</p>";
                        strlist += "<hr />";
                        strlist += "<p>" +
                            di.DUR_CREATEDBY +
                            " - " +
                            moment(di.DUR_CREATED).format(constants.longdateformat) +
                            "</p>";
                        strlist += "</div>";
                    }
                    strlist += "</div>";
                    adur.find("*").remove();
                    adur.append(strlist);
                    adur.find("a.lnk-map").on("click",
                        function () {
                            var loc = { lat: $(this).data("lat"), lng: $(this).data("lng") };
                            if (!map)
                                map = new google.maps.Map(document.getElementById("map"), { center: loc, zoom: 11 });
                            PlaceMarker(loc, $(this).data("fillcolor"));
                            $("#modalmap").modal("show");
                        });
                    adur.find("a.lnk-edit").on("click",
                        function () {
                            if (pstat === "C") return false;
                            var $this = $(this);
                            return tms.Ajax({
                                url: "/Api/ApiTaskActivityDuration/Get",
                                data: JSON.stringify($this.data("id")),
                                fn: function (d) {
                                    selectedactduration = d.data;
                                    $("#activitydurationstart")
                                        .val(d.data.DUR_START ? moment(d.data.DUR_START).format(constants.longdateformat) : "");
                                    $("#activitydurationend")
                                        .val(d.data.DUR_END ? moment(d.data.DUR_END).format(constants.longdateformat) : "");
                                    $("#activitydurationstarttype").val(d.data.DUR_STARTTYPE);
                                    $("#activitydurationendtype").val(d.data.DUR_ENDDTYPE);
                                    $("#modalactivityduration").modal("show");
                                }
                            });
                        });
                }
            });
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiTaskActivities/Get",
                data: JSON.stringify(selectedactivity.TSA_ID),
                fn: function (d) {
                    selectedactivity = d.data;
                    ListDurations();
                    FillUserInterface();
                    quototask.CheckQuotation();
                }
            });
        };
        var itemSelect = function (row) {
            selectedactivity = grdActivities.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            var data = grdActivities.GetData();
            var completed = $.grep(data, function (e) { return e.TSA_COMPLETED === "+" });
            $grdActivities.find("#grdSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].total +
                " : </strong>" +
                completed.length +
                " / " +
                data.length +
                "</span>");
            $grdActivities.find("#btnActHistory").off("").on("click", HistoryModal);
            $grdActivities.contextMenu({
                selector: "tr[data-id]",
                items: {
                    audit: {
                        name: applicationstrings[lang].audit,
                        callback: function () {
                            auditModal.show({
                                filter: [
                                    { field: "AUD_SUBJECT", value: "TMTASKACTIVITIES", operator: "eq" },
                                    {
                                        field: "AUD_SECONDARYREFID",
                                        value: $(this).closest("tr[data-id]").data("id"),
                                        operator: "eq"
                                    }
                                ]
                            });
                        }
                    },
                    signature: {
                        name: applicationstrings[lang].signature,
                        callback: function () {
                            var modal_body = $("#modalsignature div.modal-body");
                            modal_body.find("*").remove();
                            if (selectedactivity.TSA_DRAWINGNOTE)
                                modal_body.append("<div class=\"well\">" + selectedactivity.TSA_DRAWINGNOTE + "</div>");
                            modal_body.append("<img src=\"/File.ashx?id=" + $(this).closest("tr[data-id]").data("id") + "&type=svg\"/>");
                            $("#modalsignature").modal("show");
                        }
                    },
                    opentherecord: {
                        name: applicationstrings[lang].opentherecord,
                        icon: function (opt, $itemElement, itemKey, item) {
                            $itemElement.html('<span><i class="fa fa-refresh" aria-hidden="true"></i> ' + item.name + "</span>");
                            return "context-menu-icon-updated";
                        },
                        disabled: function (key, opt) {
                            return !(
                                !!selectedactivity &&
                                !selectedactivity.TSA_INVOICE &&
                                selectedactivity.TSA_COMPLETED === "+" &&
                                selectedactivity.TSA_RELEASED === "+" &&
                                task.TSK_STATUSP !== "C" &&
                                !task.TSK_PSP
                            );
                        },
                        callback: function (e, i) {
                            selectedactivity.TSA_COMPLETED = "-";
                            selectedactivity.TSA_UPDATED = tms.Now();
                            selectedactivity.TSA_UPDATEDBY = user;
                            act.Save(null, { TaskActivity: selectedactivity, Reason: null });
                        }
                    }
                }
            });
        }
        this.ResetUI = function () {
            tms.UnBlock("#activitiesform div.inline-toolbar,.act-left,.act-right");
            tms.Reset("#activities");

            var isLM = self.Check.CheckIfLMOfAny();
            var isAuthorizedUser = self.Check.CheckIfAuthorized(task.TSK_DEPARTMENT);

            $("#btnAddActivity").prop("disabled", !isLM);
            $("#btnSaveActivity").prop("disabled", !isLM);
            $("#btnChecklist").prop("disabled", true);
            $("#btnActivityEquipmentMaintenance").prop("disabled", true);
            $("#btnActivityServiceCode").prop("disabled", true);
            $("#btnRevisionHistory").prop("disabled", true);

            $("#actprivate").prop("disabled", !isLM);
            $("#schfrom").prop("disabled", !isLM);
            $("#schto").prop("disabled", !isLM);
            $("#actdesc").prop("disabled", !isLM);
            $("#dep").prop("disabled", !isLM);
            $("#btnDepartment").prop("disabled", !isLM);
            $("#trade").prop("disabled", !isLM);
            $("#btntrade").prop("disabled", !isLM);
            $("#predecessor").prop("disabled", !isLM);
            $("#btnpredecessor").prop("disabled", !isLM);

            $("#assignedto").prop("disabled", true);
            $("#btnaddme").prop("disabled", true);
            $("#btnAssignedTo").prop("disabled", true);
            $("#actcompleted").prop("disabled", true);
            $("#lmapprovalrequired").prop("disabled", true);
            $("#line").val("");

            if (isAuthorizedUser) {
                $("#dep").val(task.TSK_DEPARTMENT);
                tooltip.show("#dep", task.TSK_DEPARTMENTDESC);
            }

            $("#trade").val("");
            $("#predecessor").val("");
            $("#checklisttmp").val("");
            $("#assignedto").tagsinput("removeAll");
            $("#actdesc").val("");
            $("#projectedtime").val(pstat !== "C" ? "0" : "");
            $("#actcompleted").prop("checked", false);

            if ($("#logistics").length > 0)
                $("#logistics").prop("checked", false);

            $("#schfrom").val(pstat !== "C" ? tms.Now().startOf('day').format(constants.longdateformat) : "");
            $("#schto").val(pstat !== "C" ? tms.Now().startOf('day').format(constants.longdateformat) : "");
            $("#schfrom").data("lvalue", null);
            $("#schto").data("lvalue", null);
            $("#actmobilenote").val("");
            $("#docuprogressact").text("0%").css("width", "0");
            $("#assignedtocnt").text("");

            $("#divreason").addClass("hidden");
            $("#reason").val("").removeClass("required").removeProp("required");

            tooltip.hide("#checklisttmp");
            tooltip.hide("#trade");
            tooltip.hide("#predecessor");

            $("#checklistcount").text("0");
            $(".actapprovalbtnscontainer").hide();

            selectedactivity = null;

            if (pstat === "C") tms.Block("#activitiesform div.inline-toolbar,.act-left,.act-right");
        };
        this.List = function () {
            var grdFilter = [
                { field:"ACTIVITYISHIDDEN",value: user, operator: "func", logic: "and" },
                { field: "TSA_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }
            ];
            if (grdActivities) {
                grdActivities.ClearSelection();
                grdActivities.RunFilter(grdFilter);
            } else {
                grdActivities = new Grid({
                    keyfield: "TSA_ID",
                    columns: [
                        { type: "number", field: "TSA_LINE", title: gridstrings.taskactivities[lang].line, width: 150 },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "TSA_DEPARTMENT",
                            title: gridstrings.taskactivities[lang].department,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSA_TRADE",
                            title: gridstrings.taskactivities[lang].trade,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSA_ASSIGNEDTO",
                            title: gridstrings.taskactivities[lang].assignedto,
                            width: 150
                        },
                        {
                            type: "number",
                            field: "TSA_CHKLISTPROGRESS",
                            title: gridstrings.taskactivities[lang].chklistprogress,
                            width: 150,
                            template: "<div class=\"progress\">" +
                                "<div class=\"progress-bar progress-bar-striped #= tms.ProgressClass(TSA_CHKLISTPROGRESS) # progress-checklist\" role=\"progressbar\" aria-valuenow=\"#= TSA_CHKLISTPROGRESS #\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: #= TSA_CHKLISTPROGRESS #%;\">" +
                                "#= TSA_CHKLISTPROGRESS #%" +
                                "</div>" +
                                "</div>"
                        },
                        {
                            type: "na",
                            field: "TSA_COMPLETED",
                            title: gridstrings.taskactivities[lang].completed,
                            width: 150,
                            template: "<i class=\"# if(TSA_COMPLETED == \"+\") {# fa fa-check #} else {} #\"></i>"
                        },
                        {
                            type: "na",
                            field: "TSA_RELEASED",
                            title: gridstrings.taskactivities[lang].released,
                            width: 150,
                            template: "<i class=\"# if(TSA_RELEASED == \"+\") {# fa fa-check #} else {} #\"></i>"
                        },
                        {
                            type: "na",
                            field: "TSA_PRIVATE",
                            title: gridstrings.taskactivities[lang].hidden,
                            width: 150,
                            template: "<i class=\"# if(TSA_PRIVATE == \"+\") {# fa fa-check #} else {} #\"></i>"
                        },
                        {
                            type: "na",
                            field: "TSA_STATUS",
                            title: gridstrings.taskactivities[lang].status,
                            width: 150,
                            template:
                                "<i class=\"# if(TSA_STATUS == \"APP\") {# fa fa-check #} else if (TSA_STATUS == \"AWA\") {#fa fa-spinner#} else if (TSA_STATUS == \"ACA\") {#fa fa-spinner#} else if (TSA_STATUS == \"REJ\") {#fa fa-ban#} else if (TSA_STATUS == \"NA\") {#fa fa-asterisk#} #\"></i> #=gridstrings.taskactivities[lang].datamap[TSA_STATUS]#"
                        },
                        {
                            type: "datetime",
                            field: "TSA_SCHFROM",
                            title: gridstrings.taskactivities[lang].schfrom,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "TSA_SCHTO",
                            title: gridstrings.taskactivities[lang].schto,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TSA_INVOICE",
                            title: gridstrings.taskactivities[lang].invoice,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TSA_QUOTATIONSTATUS",
                            title: gridstrings.taskactivities[lang].quotationstatus,
                            width: 250
                        },{
                            type: "string",
                            field: "TSA_QUOTATIONSTATUSDESC",
                            title: gridstrings.taskactivities[lang].quotationstatusdesc,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        TSA_LINE: { type: "number" },
                        TSA_CHKLISTPROGRESS: { type: "number" },
                        TSA_SCHFROM: { type: "date" },
                        TSA_SCHTO: { type: "date" }
                    },
                    datasource: "/Api/ApiTaskActivities/List",
                    selector: "#grdActivities",
                    name: "grdActivities",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "TSA_LINE", dir: "asc" }],
                    change: gridChange,
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Activities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>",
                            "<a class=\"btn btn-default btn-sm\" id=\"grdSumValue\"><i class=\"fa fa-floppy-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnActHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
        this.Save = function (e, activity) {
            if (!tms.Check("#activities"))
                return $.Deferred().reject();

            var schfrom = $("#schfrom").val() ? moment.utc($("#schfrom").val(), constants.longdateformat) : null;
            var schto = $("#schto").val() ? moment.utc($("#schto").val(), constants.longdateformat) : null;

            if (schfrom && schto && schto.diff(schfrom, "minutes") < 0) {
                msgs.error(applicationstrings[lang].dateerr1);
                return;
            }

            var o = {
                TaskActivity: {
                    TSA_ID: (selectedactivity != null ? selectedactivity.TSA_ID : 0),
                    TSA_TEMPID: (selectedactivity != null ? selectedactivity.TSA_TEMPID : null),
                    TSA_TASK: task.TSK_ID,
                    TSA_LINE: $("#line").val(),
                    TSA_DESC: ($("#actdesc").val() || null),
                    TSA_DEPARTMENT: $("#dep").val(),
                    TSA_TRADE: $("#trade").val(),
                    TSA_ASSIGNEDTO: ($("#assignedto").val() || null),
                    TSA_PREDECESSOR: ($("#predecessor").val() || null),
                    TSA_PROJECTEDTIME: ($("#projectedtime").val() || null),
                    TSA_RELEASED: (selectedactivity !== null
                        ? selectedactivity.TSA_RELEASED
                        : ($("#predecessor").val() ? "-" : "+")),
                    TSA_CHKLISTLOCKED: selectedactivity != null ? selectedactivity.TSA_CHKLISTLOCKED : "-",
                    TSA_CHKLISTPROGRESS: selectedactivity != null ? selectedactivity.TSA_CHKLISTPROGRESS : null,
                    TSA_LMAPPROVALREQUIRED: $("#lmapprovalrequired").prop("checked") ? "+" : "-",
                    TSA_STATUS: selectedactivity != null ? selectedactivity.TSA_STATUS : "NA",
                    TSA_COMPLETED: $("#actcompleted").prop("checked") ? "+" : "-",
                    TSA_PRIVATE: $("#actprivate").prop("checked") ? "+" : "-",
                    TSA_HIDDEN: "-",
                    TSA_CHK01: $("#logistics").length > 0 ? $("#logistics").prop("checked") ? "+" : "-" : "-",
                    TSA_CHK02: "-",
                    TSA_CHK03: "-",
                    TSA_CHK04: "-",
                    TSA_CHK05: "-",
                    TSA_MOBILENOTE: ($("#actmobilenote").val() || null),
                    TSA_SCHFROM: schfrom,
                    TSA_SCHTO: schto,
                    TSA_DATECOMPLETED: selectedactivity != null ? selectedactivity.TSA_DATECOMPLETED : null,
                    TSA_COMPLETEDBY: selectedactivity != null ? selectedactivity.TSA_COMPLETEDBY : null,
                    TSA_CREATED: selectedactivity != null ? selectedactivity.TSA_CREATED : tms.Now(),
                    TSA_CREATEDBY: selectedactivity != null ? selectedactivity.TSA_CREATEDBY : user,
                    TSA_UPDATED: selectedactivity != null ? tms.Now() : null,
                    TSA_UPDATEDBY: selectedactivity != null ? user : null,
                    TSA_RECORDVERSION: selectedactivity != null ? selectedactivity.TSA_RECORDVERSION : 0,
                    TSA_INVOICE: selectedactivity != null ? selectedactivity.TSA_INVOICE : null
                },
                Reason: $("#reason").val()
            };

            $.extend(o, activity);

            return tms.Ajax({
                url: "/Api/ApiTaskActivities/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedactivity) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivities/DelRec",
                            data: JSON.stringify(selectedactivity.TSA_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };

        var RegisterTabEvents = function () {
            $("#btnAddActivity").click(self.ResetUI);
            $("#btnSaveActivity").click(self.Save);
            $("#btnDeleteActivity").click(self.Delete);
            $(".approval-btn").click(function () {
                if (selectedactivity) {
                    $.when(UpdateActivityStatus($(this).data("status"))).done(function () {
                        self.Save();
                    });
                }
            });
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
                        { field: "DEP_ORG", value: ["*", task.TSK_ORGANIZATION], operator: "in" },
                        { field: "DEP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        var isAuthorizedUser = self.Check.CheckIfAuthorized(data.DEP_CODE);
                        if (!isAuthorizedUser) {
                            $("#trade").val("*");
                            $("#assignedto").tagsinput("removeAll");
                            $("#assignedto").prop("disabled", true);
                            $("#btnAssignedTo").prop("disabled", true);
                        } else {
                            $("#trade").val("");
                            tooltip.hide("#trade");
                        }
                        $("#trade").prop("disabled", !isAuthorizedUser);
                        $("#btntrade").prop("disabled", !isAuthorizedUser);
                        $("#lmapprovalrequired").prop("checked", !isAuthorizedUser);
                    }
                });
            });
            $("#btntrade").click(function () {
                let GetTradeFilter = function (isInitFilter = false) {
                    let filter = [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_ORGANIZATION", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "TRD_DEPARTMENT", value: [$("#dep").val(), "*"], operator: "in" }
                    ];
                    if ($("#filterbyregion").prop("checked") || isInitFilter) {
                        filter.push({ field: "TRADEREGION", value: task.TSK_BRANCH, operator: "func", logic: "and" })
                    }
                    if ($("#filterbyprovince").prop("checked")) {
                        filter.push({ field: "TRADEPROVINCE", value: task.TSK_BRANCH, operator: "func", logic: "and" })
                    }
                    if ($("#filterbycounty").prop("checked")) {
                        filter.push({ field: "TRADECOUNTY", value: task.TSK_BRANCH, operator: "func", logic: "and" })
                    }
                    if ($("#filterbytaskcategory").prop("checked")) {
                        filter.push({ field: "TRADETASKCATEGORY", value: task.TSK_TASKTYPE, operator: "func", logic: "and" })
                    }
                    return filter;
                }
                let _isInitFilter = false;
                let tradeFilter = GetTradeFilter(_isInitFilter);
                var _grdTradeModal = gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#trade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 150 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 400 },
                        {
                            type: "na",
                            field: "PRS_PROGRESS",
                            title: gridstrings.trades[lang].capacity,
                            width: 250,
                            template: "<div class=\"progress\">" +
                                "<div class=\"progress-bar progress-bar-striped # if (TRD_USEDCAPACITY == TRD_CAPACITY) {# progress-bar-warning #} else if (TRD_USEDCAPACITY > TRD_CAPACITY) {# progress-bar-danger #}  else {# progress-bar-active active #}#\" role=\"progressbar\" aria-valuenow=\"#= TRD_USEDCAPACITY #\" aria-valuemin=\"0\" aria-valuemax=\"#=TRD_CAPACITY#\" style=\"width: #= (TRD_USEDCAPACITY <= TRD_CAPACITY ?  (TRD_USEDCAPACITY / TRD_CAPACITY) : 1) * 100 #%;\">" +
                                "#= TRD_USEDCAPACITY #" + "/" + "#= TRD_CAPACITY #" +
                                "</div>" +
                                "</div>",
                            filterable: false
                        },
                        { type: "string", field: "TRD_SUPPLIER", title: gridstrings.trades[lang].supplier, width: 300 },
                        { type: "string", field: "TRD_REGION", title: gridstrings.trades[lang].region, width: 300 },
                        { type: "string", field: "TRD_PROVINCE", title: gridstrings.trades[lang].province, width: 300 }
                    ],
                    filter: tradeFilter,
                    stdtoolbar: [
                        ' <div class="checkbox checkbox-primary checkbox-inline">   <input type="checkbox" class="checkbox_trade_filter" id="filterbyregion" />  <label>' + applicationstrings[lang].matchbyregion + '</label> </div > ',
                        ' <div class="checkbox checkbox-primary checkbox-inline">   <input type="checkbox" class="checkbox_trade_filter" id="filterbyprovince" />  <label>' + applicationstrings[lang].matchbyprovince + '</label> </div > ',
                        ' <div class="checkbox checkbox-primary checkbox-inline">   <input type="checkbox"  class="checkbox_trade_filter" id="filterbycounty" />  <label>' + applicationstrings[lang].matchbycounty + '</label> </div > ',
                        ' <div class="checkbox checkbox-primary checkbox-inline">   <input type="checkbox"  class="checkbox_trade_filter" id="filterbytaskcategory" />  <label>' + applicationstrings[lang].matchbycategory + '</label> </div > ',
                    ],


                    callback: function (data) {
                        var isAuthorizedUser = self.Check.CheckIfAuthorized($("#dep").val());
                        if (data.TRD_CODE !== "*") $("#assignedto").tagsinput("removeAll");
                        $("#assignedto").prop("disabled", data.TRD_CODE !== "*" || !isAuthorizedUser);
                        $("#btnAssignedTo").prop("disabled", data.TRD_CODE !== "*" || !isAuthorizedUser);
                        $("#btnaddme").prop("disabled", data.TRD_CODE !== "*" || !isAuthorizedUser);
                    },
                    customOff: ClearTradeModal
                });
                var grdTradeModal = _grdTradeModal.getInstance();

                function ClearTradeModal() {
                    $("#filterbyprovince").prop("checked", false);
                    $("#filterbycounty").prop("checked", false);
                    $("#filterbytaskcategory").prop("checked", false);
                }

                $(document).on("change", "input[class='checkbox_trade_filter']", function () {

                    grdTradeModal.RunFilter(GetTradeFilter());


                });
            });
            $("#btnpredecessor").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_LINE",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#predecessor",
                    columns: [
                        { type: "number", field: "TSA_LINE", title: gridstrings.taskactivities[lang].line, width: 100 },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" },
                        {
                            field:"PREDECESSORACTIVITY.TSK",
                            value: (selectedactivity != null ? selectedactivity.TSA_ID : 0),
                            operator: "func"
                        }
                    ]
                });
            });

            $("#dep").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_ORG", func: function () { return task.TSK_ORGANIZATION; }, includeall: true },
                    { field: "DEP_CODE", value: "*", operator: "neq" }
                ],
                callback: function (data) {
                    var isAuthorizedUser = self.Check.CheckIfAuthorized(data.DEP_CODE);
                    if (!isAuthorizedUser) {
                        $("#trade").val("*");
                        $("#assignedto").tagsinput("removeAll");
                        $("#assignedto").prop("disabled", true);
                        $("#btnAssignedTo").prop("disabled", true);
                        $("#btnaddme").prop("disabled", true);
                    } else {
                        $("#trade").val("");
                        tooltip.hide("#trade");
                    }
                    $("#trade").prop("disabled", !isAuthorizedUser);
                    $("#btntrade").prop("disabled", !isAuthorizedUser);
                    $("#lmapprovalrequired").prop("checked", !isAuthorizedUser);
                }
            });
            $("#trade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    { field: "TRD_ORGANIZATION", func: function () { return task.TSK_ORGANIZATION; }, includeall: true },
                    { field: "TRD_DEPARTMENT", func: function () { return [$("#dep").val(), "*"]; }, operator: "in" }
                ],
                callback: function (data) {
                    var isAuthorizedUser = self.Check.CheckIfAuthorized($("#dep").val());
                    if (data.TRD_CODE !== "*") $("#assignedto").tagsinput("removeAll");
                    $("#assignedto").prop("disabled", data.TRD_CODE !== "*" || !isAuthorizedUser);
                    $("#btnAssignedTo").prop("disabled", data.TRD_CODE !== "*" || !isAuthorizedUser);
                    $("#btnaddme").prop("disabled", data.TRD_CODE !== "*" || !isAuthorizedUser);
                }
            });
            $("#predecessor").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                termisnumeric: true,
                filter: [
                    { field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" },
                    {
                        field:"PREDECESSORACTIVITY.TSK",
                        func: function () {
                            return (selectedactivity != null ? selectedactivity.TSA_ID : 0);
                        },
                        operator: "func"
                    }
                ]
            });
            $("#btnAssignedTo").click(function () {
                var seldepartment = $("#dep").val();
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
                        { field: "USR_ORG", value: ["*", task.TSK_ORGANIZATION], operator: "in" },
                        { field: "USR_TYPE", value: ["CUSTOMER"], operator: "nin" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.user[lang].allusers,
                            filter: [
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        },
                        {
                            text: gridstrings.user[lang].departmentusers,
                            filter: [
                                { field: "USR_DEPARTMENT", value: seldepartment, operator: "eq" },
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        }
                    ]
                });
            });
            $("#btnaddme").click(function () {
                $("#assignedto").tagsinput("add", { id: user, text: userdesc });
                $("#lmapprovalrequired").prop("checked", false);
            });
            $("#assignedto").on("itemAdded",
                function () {
                    $("#assignedtocnt").text("(" +
                        $("#assignedto").tagsinput("items").length +
                        " " +
                        applicationstrings[lang].person +
                        ")");
                }).on("itemRemoved",
                function () {
                    var itemcount = $("#assignedto").tagsinput("items").length;
                    $("#assignedtocnt").text(itemcount !== 0
                        ? "(" + itemcount + " " + applicationstrings[lang].person + ")"
                        : "");
                });

            $("#schfrom,#schto").on("dp.change", function () {
                var fval = $("#schfrom").val();
                var tval = $("#schto").val();
                if (fval && tval) {
                    var calchours = moment(tval, constants.longdateformat)
                        .diff(moment(fval, constants.longdateformat));
                    $("#projectedtime").val(moment.duration(calchours).asHours());
                }
            });
            $("#btnSaveActivityDuration").click(function () {
                var actdurationstart = $("#activitydurationstart").val();
                var actdurationend = $("#activitydurationend").val();
                if (actdurationstart && actdurationend) {
                    selectedactduration.DUR_START = moment.utc(actdurationstart, constants.longdateformat);
                    selectedactduration.DUR_END = moment.utc(actdurationend, constants.longdateformat);
                    selectedactduration.DUR_STARTTYPE = $("#activitydurationstarttype").val();
                    selectedactduration.DUR_ENDDTYPE = $("#activitydurationendtype").val();
                    return tms.Ajax({
                        url: "/Api/ApiTaskActivityDuration/Save",
                        data: JSON.stringify(selectedactduration),
                        fn: function (d) {
                            msgs.success(d.data);
                            ListDurations();
                            $("#modalactivityduration").modal("hide");
                        }
                    });
                } else {
                    msgs.error(applicationstrings[lang].actdurationdatecontrol);
                }
            });
            $("#btnActivityCalendar").click(self.ActivityCalendar.ShowActivityCalendar);
            $("#btnActivityEquipmentMaintenance").click(aeq.showActivityEquipmentMaintenanceModal);
            $("#btnActivityServiceCode").click(asr.showActivityServiceCodesModal);
            $("#btnsendBack").click(function () {
                if (!tms.Check("#modalsendback"))
                    return $.Deferred().reject();

                var comment = $("#sendbackcomment").val();
                $.when(SaveComment(task.TSK_ID, comment)).done(function () {
                    SendBack();
                });
            });

            taskActivityDocumentsHelper = new documents({
                input: "#fuact",
                filename: "#filenameact",
                uploadbtn: "#btnuploadact",
                container: "#fuploadact",
                documentsdiv: "#docsact",
                progressbar: "#docuprogressact"
            });
            taskActivityCommentsHelper = new comments({
                input: "#actcomment",
                btnaddcomment: "#addActivityComment",
                commentsdiv: "#activitycomments"
            });
        };
        RegisterTabEvents();
    };
    var pln = new function () {

        this.part = new function () {
            var self = this;
            var $grdPlannedParts = $("#grdPlannedParts");
            var grdPlannedParts = null;
            var selectedplannedpart = null;

            var FillUserInterface = function () {
                tms.UnBlock("#plannedpartsform");
                tms.BeforeFill("#plnpart");

                $("#plannedpartactivity").val(selectedplannedpart.PPA_ACTIVITY);
                $("#plannedpartdate").val(moment(selectedplannedpart.PPA_DATE).format(constants.dateformat));
                $("#plannedpart").val(selectedplannedpart.PPA_PARTCODE);
                $("#plannedpart").data("id", selectedplannedpart.PPA_PART);
                $("#plannedpartunitprice").val(selectedplannedpart.PPA_UNITPRICE
                    ? parseFloat(selectedplannedpart.PPA_UNITPRICE).fixed(constants.pricedecimals)
                    : null);
                $("#plannedpartqty").val(parseFloat(selectedplannedpart.PPA_QTY).fixed(constants.qtydecimals));
                $("#plannedparttotal").val(selectedplannedpart.PPA_TOTAL
                    ? parseFloat(selectedplannedpart.PPA_TOTAL).fixed(constants.pricedecimals)
                    : null);
                $("#plannedpartuom").val(selectedplannedpart.PPA_PARTUOM);
                $("#plannedpartcurr").val(selectedplannedpart.PPA_CURR);
                $("#plannedparttotalcurr").val(selectedplannedpart.PPA_CURR);
                $("#plannedpartexch").val(selectedplannedpart.PPA_EXCH.fixed(constants.exchdecimals));

                tooltip.show("#plannedpartcurr", selectedplannedpart.PPA_CURRDESC);
                tooltip.show("#plannedparttotalcurr", selectedplannedpart.PPA_CURRDESC);
                tooltip.show("#plannedpart", selectedplannedpart.PPA_PARTDESC);
                tooltip.show("#plannedpartuom", selectedplannedpart.PPA_PARTUOMDESC);

                if (pstat === "C") tms.Block("#plannedpartsform");
            };
            var LoadSelected = function () {
                return tms.Ajax({
                    url: "/Api/ApiPlannedParts/Get",
                    data: JSON.stringify(selectedplannedpart.PPA_ID),
                    fn: function (d) {
                        selectedplannedpart = d.data;
                        FillUserInterface();
                    }
                });
            };
            var itemSelect = function (row) {
                selectedplannedpart = grdPlannedParts.GetRowDataItem(row);
                LoadSelected();
            };
            var gridChange = function (e) {
                itemSelect(e.sender.select());
            };

            var CalculateTotal = function () {
                var v_plannedpartqty = $("#plannedpartqty").val();
                var v_plannedpartunitprice = $("#plannedpartunitprice").val();
                if (v_plannedpartunitprice && v_plannedpartqty) {
                    var total =
                        (parseFloat(v_plannedpartunitprice) * parseFloat(v_plannedpartqty)).fixed(constants
                            .pricedecimals);
                    return total;
                }
            };
            this.List = function () {
                var grdFilter = [{ field: "PPA_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
                if (grdPlannedParts) {
                    grdPlannedParts.ClearSelection();
                    grdPlannedParts.RunFilter(grdFilter);
                } else {
                    grdPlannedParts = new Grid({
                        keyfield: "PPA_ID",
                        columns: [
                            {
                                type: "number",
                                field: "PPA_ACTIVITY",
                                title: gridstrings.plannedparts[lang].activity,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "PPA_ACTIVITYDESC",
                                title: gridstrings.plannedparts[lang].activitydesc,
                                width: 350
                            },
                            { type: "date", field: "PPA_DATE", title: gridstrings.plannedparts[lang].date, width: 250 },
                            {
                                type: "string",
                                field: "PPA_PARTCODE",
                                title: gridstrings.plannedparts[lang].part,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "PPA_PARTDESC",
                                title: gridstrings.plannedparts[lang].partdesc,
                                width: 350
                            },
                            {
                                type: "price",
                                field: "PPA_UNITPRICE",
                                title: gridstrings.plannedparts[lang].unitprice,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "PPA_CURR",
                                title: gridstrings.plannedparts[lang].curr,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "PPA_PARTUOM",
                                title: gridstrings.plannedparts[lang].uom,
                                width: 150
                            },
                            {
                                type: "price",
                                field: "PPA_TOTAL",
                                title: gridstrings.plannedparts[lang].total,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "PPA_CURR",
                                title: gridstrings.plannedparts[lang].curr,
                                width: 150
                            }
                        ],
                        datasource: "/Api/ApiPlannedParts/List",
                        selector: "#grdPlannedParts",
                        name: "grdPlannedParts",
                        height: 250,
                        filter: grdFilter,
                        sort: [{ field: "PPA_ID", dir: "desc" }],
                        change: gridChange,
                        toolbar: {
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"PlannedParts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                            ]
                        }
                    });
                }
            };
            this.ResetUI = function () {
                selectedplannedpart = null;
                tms.Reset("#plnpart");

                $("#plannedpartactivity").val("");
                $("#plannedpartdate").val("");
                $("#plannedpart").val("");
                $("#plannedpartqty").val("");
                $("#plannedpartuom").val("");
                $("#plannedpartunitprice").val("");
                $("#plannedparttotal").val("");

                if (orgrecord) {
                    $("#plannedpartcurr,#plannedparttotalcurr,#plannedpartorgcurr").val(orgrecord.ORG_CURRENCY);
                    tooltip.show("#plannedpartcurr,#plannedparttotalcurr,#plannedpartorgcurr",
                        orgrecord.ORG_CURRENCYDESC);
                }

                tooltip.hide("#plannedpartactivity");
                tooltip.hide("#plannedpart");
                tooltip.hide("#plannedpartuom");
            };
            this.Save = function () {
                if (!tms.Check("#plnpart"))
                    return $.Deferred().reject();

                var plnpart = {
                    PPA_ID: selectedplannedpart ? selectedplannedpart.PPA_ID : 0,
                    PPA_TASK: task.TSK_ID,
                    PPA_ACTIVITY: $("#plannedpartactivity").val(),
                    PPA_DATE: moment.utc($("#plannedpartdate").val(), constants.dateformat),
                    PPA_PART: $("#plannedpart").data("id"),
                    PPA_UNITPRICE: parseFloat($("#plannedpartunitprice").val()),
                    PPA_CURR: $("#plannedpartcurr").val(),
                    PPA_EXCH: parseFloat($("#plannedpartexch").val()),
                    PPA_QTY: parseFloat($("#plannedpartqty").val()),
                    PPA_TOTAL: CalculateTotal(),
                    PPA_CREATED: selectedplannedpart != null ? selectedplannedpart.PPA_CREATED : tms.Now(),
                    PPA_CREATEDBY: selectedplannedpart != null ? selectedplannedpart.PPA_CREATEDBY : user,
                    PPA_UPDATED: selectedplannedpart != null ? tms.Now() : null,
                    PPA_UPDATEDBY: selectedplannedpart != null ? user : null,
                    PPA_RECORDVERSION: selectedplannedpart != null ? selectedplannedpart.PPA_RECORDVERSION : 0
                };

                return tms.Ajax({
                    url: "/Api/ApiPlannedParts/Save",
                    data: JSON.stringify(plnpart),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });
            };
            this.Delete = function () {
                if (selectedplannedpart) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiPlannedParts/DelRec",
                                data: JSON.stringify(selectedplannedpart.PPA_ID),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                }
            };

            var ChildBuilder = function (parent, list) {
                var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
                if (childs.length === 0) return;

                for (var i = 0; i < childs.length; i++) {
                    var di = childs[i];
                    var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                    if (!parent.subs) {
                        parent.subs = [];
                    }
                    parent.subs.push(child);
                    ChildBuilder(child, list);
                }
            };
            var GenerateTreeData = function (d) {
                var data = [];
                var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
                for (var i = 0; i < parentless.length; i++) {
                    var di = parentless[i];
                    var parent = {
                        title: di.TLV_CODE + " - " + di.TLV_DESC,
                        id: di.TLV_ID,
                        subs: []
                    };
                    ChildBuilder(parent, d);
                    data.push(parent);
                }
                return data;
            };
            var GetLevels = function () {
                var gridreq = {
                    loadall: true,
                    filter: {
                        filters: [
                            { field: "TLV_TYPEENTITY", value: "PART", operator: "eq" }
                        ]
                    }
                };
                return tms.Ajax({
                    url: "/Api/ApiTypeLevels/List",
                    data: JSON.stringify(gridreq)
                });
            };

            var RgstrTabEvents = function () {
                $("#btnSavePlannedPart").click(self.Save);
                $("#btnAddPlannedPart").click(self.ResetUI);
                $("#btnDeletePlannedPart").click(self.Delete);

                $("#btnplannedpartactivity").on("click",
                    function () {
                        gridModal.show({
                            modaltitle: gridstrings.taskactivities[lang].title,
                            listurl: "/Api/ApiTaskActivities/List",
                            keyfield: "TSA_ID",
                            codefield: "TSA_LINE",
                            textfield: "TSA_DESC",
                            returninput: "#plannedpartactivity",
                            columns: [
                                {
                                    type: "string",
                                    field: "TSA_LINE",
                                    title: gridstrings.taskactivities[lang].line,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "TSA_DESC",
                                    title: gridstrings.taskactivities[lang].description,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_ASSIGNEDTO",
                                    title: gridstrings.taskactivities[lang].assignedto,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_TRADE",
                                    title: gridstrings.taskactivities[lang].trade,
                                    width: 200
                                }
                            ],
                            filter: [
                                { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" },
                                { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                            ]
                        });
                    });
                $("#btnplannedpart").on("click",
                    function () {
                        gridModal.show({
                            modaltitle: gridstrings.parts[lang].title,
                            listurl: "/Api/ApiParts/List",
                            keyfield: "PAR_ID",
                            codefield: "PAR_CODE",
                            textfield: "PAR_DESC",
                            returninput: "#plannedpart",
                            columns: [
                                {
                                    type: "string",
                                    field: "PAR_CODE",
                                    title: gridstrings.parts[lang].parcode,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "PAR_DESC",
                                    title: gridstrings.parts[lang].pardesc,
                                    width: 300
                                },
                                {
                                    type: "price",
                                    field: "PAR_UNITSALESPRICE",
                                    title: gridstrings.parts[lang].parunitsalesprice,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "PAR_CURR",
                                    title: gridstrings.parts[lang].parcurr,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "PAR_UOM",
                                    title: gridstrings.partstock[lang].paruom,
                                    width: 100
                                }
                            ],
                            fields: { PAR_UNITSALESPRICE: { type: "number" } },
                            filter: [{ field: "PAR_ACTIVE", value: "+", operator: "eq" }],
                            treefilter: function (id, callback) {
                                $.when(GetLevels()).done(function (d) {
                                    var data = GenerateTreeData(d.data);
                                    var levelTree = $(id).comboTree({
                                        source: data,
                                        isMultiple: false,
                                        singleItemClick: function (selectedItem) {
                                            if (callback && typeof (callback) == "function") {
                                                var filter = [{ field: "PARTLEVEL.PARID", value: selectedItem.id, operator: "func" }];
                                                callback(filter);
                                            }
                                        }
                                    });
                                });
                            },
                            callback: function (d) {
                                tooltip.hide("#plannedpart");
                                tooltip.hide("#plannedpartuom");
                                $("#plannedpartunitprice").val("");
                                $("#plannedparttotal").val("");
                                $("#plannedpart").data("id", (d ? d.PAR_ID : null));
                                $("#plannedpartuom").val((d ? d.PAR_UOM : ""));
                                $("#plannedpartcurr,#plannedparttotalcurr").val((d ? d.PAR_CURR : ""));

                                if (d) {
                                    tooltip.show("#plannedpart", d.PAR_DESC);
                                    tooltip.show("#plannedpartuom", d.PAR_UOMDESC);
                                    tooltip.show("#plannedpartcurr,#plannedparttotalcurr", d.PAR_CURRDESC);
                                    return $.when(tms.Ajax({
                                        url: "/Api/ApiParts/GetPartPrice",
                                        data: JSON.stringify({
                                            Task: task.TSK_ID,
                                            Part: d.PAR_ID,
                                            Curr: d.PAR_CURR
                                        })
                                    })).done(function (p) {
                                        $("#plannedpartunitprice").val(p.data || "");
                                        var v = CalculateTotal();
                                        $("#plannedparttotal").val(v);
                                    });
                                }
                            }
                        });
                    });
                $("#plannedpartactivity").autocomp({
                    listurl: "/Api/ApiTaskActivities/List",
                    geturl: "/Api/ApiTaskActivities/Get",
                    termisnumeric: true,
                    field: "TSA_LINE",
                    textfield: "TSA_DESC",
                    filter: [
                        { field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" },
                        { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                    ]
                });
                $("#plannedpartqty").on("change",
                    function () {
                        var v = CalculateTotal();
                        $("#plannedparttotal").val(v);
                    });
            };
            RgstrTabEvents();
        };
        this.msc = new function () {
            var self = this;
            var $grdPlannedMiscCosts = $("#grdPlannedMiscCosts");
            var grdPlannedMiscCosts = null;
            var selectedmisccost = null;

            var LoadSubTypes = function (v) {
                var gridreq = {
                    sort: [{ field: "MCT_CODE", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "MCT_ACTIVE", value: "+", operator: "eq" },
                            { field: "MCT_TYPE", value: v, operator: "eq" }
                        ]
                    }
                };

                return select({
                    ctrl: "#planned_misccosttype",
                    url: "/Api/ApiMiscCostTypes/List",
                    keyfield: "MCT_CODE",
                    textfield: "MCT_DESC",
                    data: JSON.stringify(gridreq)
                }).Fill();
            };
            var CalculateTotal = function () {
                var v_plannedmisccostunitprice = $("#plannedmisccostunitprice").val();
                var v_plannedmisccostqty = $("#plannedmisccostqty").val();
                if (v_plannedmisccostunitprice && v_plannedmisccostqty) {
                    var total = (parseFloat(v_plannedmisccostunitprice) *
                        parseFloat(v_plannedmisccostqty)).fixed(constants.pricedecimals);
                    return total;
                }
            };
            var CalculateExch = function () {
                var curr = $("#plannedmisccostcurr").val();
                var date = $("#plannedmisccostdate").val();

                if (!curr || !date)
                    return $.Deferred().reject();

                var exch = {
                    CRR_CURR: curr,
                    CRR_BASECURR: orgrecord.ORG_CURRENCY,
                    CRR_STARTDATE: moment.utc(date, constants.dateformat)
                };
                return tms.Ajax({
                    url: "/Api/ApiExchRates/QueryExch",
                    data: JSON.stringify(exch)
                });
            };
            var FillUserInterface = function () {
                tms.UnBlock("#plannedmisccostsform");
                tms.BeforeFill("#plnmisccosts");

                $("#plannedmisccostactivity").val(selectedmisccost.MSC_ACTIVITY);
                $("#plannedmisccostdate").val(moment(selectedmisccost.MSC_DATE).format(constants.dateformat));
                $("#plannedmisccostdesc").val(selectedmisccost.MSC_DESC);
                $("#planned_misccosttype_parent").val(selectedmisccost.MSC_PTYPE);
                $.when(LoadSubTypes(selectedmisccost.MSC_PTYPE)).done(function () {
                    $("#planned_misccosttype").val(selectedmisccost.MSC_TYPE);
                });
                $("#plannedmisccostunitprice").val(parseFloat(selectedmisccost.MSC_UNITPRICE)
                    .fixed(constants.pricedecimals));
                $("#plannedmisccostunitsalesprice").val(selectedmisccost.MSC_UNITSALESPRICE !== null
                    ? parseFloat(selectedmisccost.MSC_UNITSALESPRICE).fixed(constants.pricedecimals)
                    : "");
                $("#plannedmisccostcurr").val(selectedmisccost.MSC_CURR);
                $("#plannedmisccostexch").val(parseFloat(selectedmisccost.MSC_EXCH).fixed(constants.exchdecimals));
                $("#plannedmisccostqty").val(parseFloat(selectedmisccost.MSC_QTY).fixed(constants.qtydecimals));
                $("#plannedmisccostuom").val(selectedmisccost.MSC_UOM);
                $("#plannedmisccosttotal").val(parseFloat(selectedmisccost.MSC_TOTAL).fixed(constants.pricedecimals));

                tooltip.show("#plannedmisccostactivity", selectedmisccost.MSC_ACTIVITYDESC);
                tooltip.show("#plannedmisccostcurr", selectedmisccost.MSC_CURRDESC);
                tooltip.show("#plannedmisccostuom", selectedmisccost.MSC_UOMDESC);

                if (pstat === "C") tms.Block("#plannedmisccostsform");
            };
            var AddCheck = function () {
                var misccostdate = moment($("#plannedmisccostdate").val(), constants.dateformat);
                var misccostexch = $("#plannedmisccostexch").val();
                if (misccostdate < moment(task.TSK_REQUESTED).startOf("day")) {
                    msgs.error(applicationstrings[lang].misccostdate);
                    return false;
                }
                if (!misccostexch) {
                    msgs.error(applicationstrings[lang].misccostexch);
                    return false;
                }
                return true;
            };
            var LoadSelected = function () {
                return tms.Ajax({
                    url: "/Api/ApiPlannedMiscCosts/Get",
                    data: JSON.stringify(selectedmisccost.MSC_ID),
                    fn: function (d) {
                        selectedmisccost = d.data;
                        FillUserInterface();
                    }
                });
            };
            this.Save = function () {
                if (!tms.Check("#plnmisccosts") || !AddCheck())
                    return $.Deferred().reject();

                var misccost = {
                    MSC_ID: selectedmisccost ? selectedmisccost.MSC_ID : 0,
                    MSC_TASK: task.TSK_ID,
                    MSC_ACTIVITY: $("#plannedmisccostactivity").val(),
                    MSC_DATE: moment.utc($("#plannedmisccostdate").val(), constants.dateformat),
                    MSC_DESC: $("#plannedmisccostdesc").val(),
                    MSC_TYPE: $("#planned_misccosttype").val(),
                    MSC_PTYPE: $("#planned_misccosttype_parent").val(),
                    MSC_UNITPRICE: parseFloat($("#plannedmisccostunitprice").val()),
                    MSC_UNITSALESPRICE:
                        parseFloat($("#plannedmisccostunitprice")
                            .val()), // ($("#plannedmisccostunitsalesprice").val() ? parseFloat($("#plannedmisccostunitsalesprice").val()) : null),
                    MSC_CURR: $("#plannedmisccostcurr").val(),
                    MSC_EXCH: $("#plannedmisccostexch").val(),
                    MSC_QTY: parseFloat($("#plannedmisccostqty").val()),
                    MSC_UOM: $("#plannedmisccostuom").val(),
                    MSC_TOTAL: CalculateTotal(),
                    MSC_CREATED: selectedmisccost != null ? selectedmisccost.MSC_CREATED : tms.Now(),
                    MSC_CREATEDBY: selectedmisccost != null ? selectedmisccost.MSC_CREATEDBY : user,
                    MSC_UPDATED: selectedmisccost != null ? tms.Now() : null,
                    MSC_UPDATEDBY: selectedmisccost != null ? user : null,
                    MSC_RECORDVERSION: selectedmisccost != null ? selectedmisccost.MSC_RECORDVERSION : 0
                };

                return tms.Ajax({
                    url: "/Api/ApiPlannedMiscCosts/Save",
                    data: JSON.stringify(misccost),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });
            };
            this.Delete = function () {
                if (selectedmisccost) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiPlannedMiscCosts/DelRec",
                                data: JSON.stringify(selectedmisccost.MSC_ID),
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
                selectedmisccost = null;
                tms.Reset("#plnmisccosts");

                $("#plannedmisccostactivity").val("");
                $("#plannedmisccostdate").val(tms.Now().format(constants.dateformat));
                $("#plannedmisccostdesc").val("");
                $("#planned_misccosttype").val("").trigger("change");
                $("#plannedmisccostunitprice").val("");
                $("#plannedmisccostunitsalesprice").val("");
                $("#plannedmisccostcurr").val("");
                $("#plannedmisccostexch").val("1.00");
                $("#plannedmisccostqty").val("");
                $("#plannedmisccostuom").val("");
                $("#plannedmisccosttotal").val("");

                tooltip.hide("#plannedmisccostactivity");
                tooltip.hide("#plannedmisccostcurr");
                tooltip.hide("#plannedmisccostuom");

                if (orgrecord) {
                    $("#plannedmisccostcurr").val(orgrecord.ORG_CURRENCY);
                    $("#plannedmisccosttotalcurr").val(orgrecord.ORG_CURRENCY);
                    tooltip.show("#plannedmisccostcurr", orgrecord.ORG_CURRENCYDESC);
                    tooltip.show("#plannedmisccosttotalcurr", orgrecord.ORG_CURRENCYDESC);
                }
            };
            var itemSelect = function (row) {
                selectedmisccost = grdPlannedMiscCosts.GetRowDataItem(row);
                LoadSelected();
            };
            var gridChange = function (e) {
                itemSelect(e.sender.select());
            };
            this.List = function () {
                var grdFilter = [{ field: "MSC_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
                if (grdPlannedMiscCosts) {
                    grdPlannedMiscCosts.ClearSelection();
                    grdPlannedMiscCosts.RunFilter(grdFilter);
                } else {
                    grdPlannedMiscCosts = new Grid({
                        keyfield: "MSC_ID",
                        columns: [
                            {
                                type: "number",
                                field: "MSC_ACTIVITY",
                                title: gridstrings.misccosts[lang].activity,
                                width: 150
                            },
                            { type: "date", field: "MSC_DATE", title: gridstrings.misccosts[lang].date, width: 150 },
                            { type: "string", field: "MSC_DESC", title: gridstrings.misccosts[lang].desc, width: 250 },
                            {
                                type: "string",
                                field: "MSC_PTYPE",
                                title: gridstrings.misccosts[lang].ptype,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "MSC_TYPEDESC",
                                title: gridstrings.misccosts[lang].type,
                                width: 250
                            },
                            {
                                type: "price",
                                field: "MSC_UNITPRICE",
                                title: gridstrings.misccosts[lang].unitprice,
                                width: 150
                            },
                            {
                                type: "price",
                                field: "MSC_UNITSALESPRICE",
                                title: gridstrings.misccosts[lang].unitsalesprice,
                                width: 150
                            },
                            { type: "string", field: "MSC_CURR", title: gridstrings.misccosts[lang].curr, width: 150 },
                            { type: "qty", field: "MSC_QTY", title: gridstrings.misccosts[lang].qty, width: 150 },
                            { type: "string", field: "MSC_UOM", title: gridstrings.misccosts[lang].uom, width: 150 },
                            { type: "price", field: "MSC_TOTAL", title: gridstrings.misccosts[lang].total, width: 150 }
                        ],
                        datasource: "/Api/ApiPlannedMiscCosts/List",
                        selector: "#grdPlannedMiscCosts",
                        name: "grdPlannedMiscCosts",
                        height: 250,
                        filter: grdFilter,
                        sort: [{ field: "MSC_ID", dir: "desc" }],
                        change: gridChange,
                        toolbar: {
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"MiscCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                            ]
                        }
                    });
                }
            };
            var RgstrTabEvents = function () {
                $("#btnSavePlannedMiscCost").click(self.Save);
                $("#btnAddPlannedMiscCost").click(self.ResetUI);
                $("#btnDeletePlannedMiscCost").click(self.Delete);
                $("#btnplannedmisccostactivity").on("click",
                    function () {
                        gridModal.show({
                            modaltitle: gridstrings.taskactivities[lang].title,
                            listurl: "/Api/ApiTaskActivities/List",
                            keyfield: "TSA_ID",
                            codefield: "TSA_LINE",
                            textfield: "TSA_DESC",
                            returninput: "#plannedmisccostactivity",
                            columns: [
                                {
                                    type: "string",
                                    field: "TSA_LINE",
                                    title: gridstrings.taskactivities[lang].line,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "TSA_DESC",
                                    title: gridstrings.taskactivities[lang].description,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_ASSIGNEDTO",
                                    title: gridstrings.taskactivities[lang].assignedto,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_TRADE",
                                    title: gridstrings.taskactivities[lang].trade,
                                    width: 200
                                }
                            ],
                            filter: [
                                { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" },
                                { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                            ]
                        });
                    });
                $("#btnplannedmisccostcurr").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.currencies[lang].title,
                        listurl: "/Api/ApiCurrencies/List",
                        keyfield: "CUR_CODE",
                        codefield: "CUR_CODE",
                        textfield: "CUR_DESC",
                        returninput: "#plannedmisccostcurr",
                        columns: [
                            { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                            {
                                type: "string",
                                field: "CUR_DESC",
                                title: gridstrings.currencies[lang].description,
                                width: 400
                            }
                        ],
                        filter: [
                            { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                        ],
                        callback: function (d) {
                            $("#plannedmisccostcurr").trigger("blur");
                        }
                    });
                });
                $("#btnplannedmisccostuom").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.uoms[lang].title,
                        listurl: "/Api/ApiUoms/List",
                        keyfield: "UOM_CODE",
                        codefield: "UOM_CODE",
                        textfield: "UOM_DESC",
                        returninput: "#plannedmisccostuom",
                        columns: [
                            { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                            { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                        ],
                        filter: [
                            { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                        ]
                    });
                });
                $("#plannedmisccostuom").autocomp({
                    listurl: "/Api/ApiUoms/List",
                    geturl: "/Api/ApiUoms/Get",
                    field: "UOM_CODE",
                    textfield: "UOM_DESC",
                    active: "UOM_ACTIVE"
                });
                $("#plannedmisccostactivity").autocomp({
                    listurl: "/Api/ApiTaskActivities/List",
                    geturl: "/Api/ApiTaskActivities/Get",
                    field: "TSA_LINE",
                    textfield: "TSA_DESC",
                    termisnumeric: true,
                    filter: [
                        { field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" },
                        { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                    ]
                });
                $("#plannedmisccostcurr").autocomp({
                    listurl: "/Api/ApiCurrencies/List",
                    geturl: "/Api/ApiCurrencies/Get",
                    field: "CUR_CODE",
                    textfield: "CUR_DESC",
                    filter: [{ field: "CUR_ACTIVE", value: "+", operator: "eq" }]
                });
                $("#misccostcurr").autocomp({
                    listurl: "/Api/ApiCurrencies/List",
                    geturl: "/Api/ApiCurrencies/Get",
                    field: "CUR_CODE",
                    textfield: "CUR_DESC",
                    active: "CUR_ACTIVE"
                });
                $("#btnmisccostcurr").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.currencies[lang].title,
                        listurl: "/Api/ApiCurrencies/List",
                        keyfield: "CUR_CODE",
                        codefield: "CUR_CODE",
                        textfield: "CUR_DESC",
                        returninput: "#misccostcurr",
                        columns: [
                            { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                            {
                                type: "string",
                                field: "CUR_DESC",
                                title: gridstrings.currencies[lang].description,
                                width: 400
                            }
                        ],
                        filter: [
                            { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                            { field: "CUR_CODE", value: "*", operator: "neq" }
                        ],
                        callback: function (d) {
                            $("#misccostcurr").trigger("blur");
                        }
                    });
                });

                $("#planned_misccosttype_parent").on("change",
                    function () {
                        var $this = $(this);
                        LoadSubTypes($this.val());
                    });
                $("#plnmisccosts input[calc-group=\"1\"]").on("change",
                    function () {
                        $("#plannedmisccosttotal").val(CalculateTotal());
                    });
                $("#plannedmisccostcurr").on("change",
                    function () {
                        $("#plannedmisccosttotalcurr").val($(this).val());
                        $.when(CalculateExch()).done(function (d) {
                            $("#plannedmisccostexch").val(d.data
                                ? parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals)
                                : "");
                        });
                    });
            };

            RgstrTabEvents();
        };
        this.tool = new function () {
            var self = this;
            var $grdPlannedTools = $("#grdPlannedTools");
            var grdPlannedTools = null;
            var selectedplannedtool = null;

            var CalculateExch = function () {
                var curr = $("#plannedtoolcurr").val();
                var date = moment();
                if (!curr)
                    return $.Deferred().reject();

                var exch = {
                    CRR_CURR: curr,
                    CRR_BASECURR: orgrecord.ORG_CURRENCY,
                    CRR_STARTDATE: moment.utc(date, constants.dateformat)
                };
                return tms.Ajax({
                    url: "/Api/ApiExchRates/QueryExch",
                    data: JSON.stringify(exch)
                });
            };
            var FillUserInterface = function () {
                tms.UnBlock("#plannedtoolsform");
                tms.BeforeFill("#plntool");

                $("#plannedtoolactivity").val(selectedplannedtool.TPL_ACTIVITY);
                $("#plannedtool").val(selectedplannedtool.TPL_TOOL);
                $("#plannedtooldate").val(moment(selectedplannedtool.TPL_PLANDATE).format(constants.dateformat));
                $("#toolplanperiod").val(parseFloat(selectedplannedtool.TPL_PERIOD).fixed(constants.qtydecimals));
                $("#plannedtoolunitprice").val(parseFloat(selectedplannedtool.TPL_UNITPRICE)
                    .fixed(constants.pricedecimals));
                $("#plannedtoolcurr,#plannedtooltotalcurr").val(selectedplannedtool.TPL_CURR);
                $("#toolchargingperiod")
                    .val(applicationstrings[lang].chargingperiods[selectedplannedtool.TPL_CHARGINGPERIOD]);
                $("#plannedtooltotal").val(parseFloat(selectedplannedtool.TPL_TOTAL).fixed(constants.pricedecimals));
                $("#plannedtoolexch").val(parseFloat(selectedplannedtool.TPL_EXCH).fixed(constants.exchdecimals));

                tooltip.show("#plannedtoolactivity", selectedplannedtool.TPL_ACTIVITYDESC);
                tooltip.show("#plannedtool", selectedplannedtool.TPL_TOOLDESC);
                tooltip.show("plannedtoolcurr,#plannedtooltotalcurr", selectedplannedtool.TPL_CURRDESC);

                if (pstat === "C") tms.Block("#plannedtoolsform");
            };
            var LoadSelected = function () {
                return tms.Ajax({
                    url: "/Api/ApiPlannedTools/Get",
                    data: JSON.stringify(selectedplannedtool.TPL_ID),
                    fn: function (d) {
                        selectedplannedtool = d.data;
                        FillUserInterface();
                    }
                });
            };
            var CalculateTotal = function () {
                var v_plannedtoolunitprice = $("#plannedtoolunitprice").val();
                var v_toolplanperiod = $("#toolplanperiod").val();
                if (v_plannedtoolunitprice && v_toolplanperiod) {
                    var total = (parseFloat(v_plannedtoolunitprice) * parseFloat(v_toolplanperiod));
                    return total;
                }
            };
            var itemSelect = function (row) {
                selectedplannedtool = grdPlannedTools.GetRowDataItem(row);
                LoadSelected();
            };
            var gridChange = function (e) {
                itemSelect(e.sender.select());
            };

            this.Save = function () {
                if (!tms.Check("#plntool"))
                    return $.Deferred().reject();

                var plntool = {
                    TPL_ID: selectedplannedtool ? selectedplannedtool.TPL_ID : 0,
                    TPL_TASK: task.TSK_ID,
                    TPL_ACTIVITY: $("#plannedtoolactivity").val(),
                    TPL_PLANDATE: moment.utc($("#plannedtooldate").val(), constants.dateformat),
                    TPL_TOOL: $("#plannedtool").val(),
                    TPL_PERIOD: parseFloat($("#toolplanperiod").val()),
                    TPL_UNITPRICE: parseFloat($("#plannedtoolunitprice").val()),
                    TPL_CURR: $("#plannedtoolcurr").val(),
                    TPL_EXCH: parseFloat($("#plannedtoolexch").val()),
                    TPL_TOTAL: CalculateTotal(),
                    TPL_CREATED: selectedplannedtool != null ? selectedplannedtool.TPL_CREATED : tms.Now(),
                    TPL_CREATEDBY: selectedplannedtool != null ? selectedplannedtool.TPL_CREATEDBY : user,
                    TPL_UPDATED: selectedplannedtool != null ? tms.Now() : null,
                    TPL_UPDATEDBY: selectedplannedtool != null ? user : null,
                    TPL_RECORDVERSION: selectedplannedtool != null ? selectedplannedtool.TPL_RECORDVERSION : 0
                };

                return tms.Ajax({
                    url: "/Api/ApiPlannedTools/Save",
                    data: JSON.stringify(plntool),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });
            };
            this.Delete = function () {
                if (selectedplannedtool) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiPlannedTools/DelRec",
                                data: JSON.stringify(selectedplannedtool.TPL_ID),
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
                selectedplannedtool = null;
                tms.Reset("#plntool");

                $("#plannedtoolactivity").val("");
                $("#plannedtool").val("");
                $("#plannedtooldate").val(tms.Now().format(constants.dateformat));
                $("#toolplanperiod").val("");
                $("#toolchargingperiod").val("");
                $("#plannedtoolunitprice").val("");
                $("#plannedtoolexch").val("");
                $("plannedtoolcurr,#plannedtooltotalcurr").val("");
                $("#plannedtooltotal").val("");

                tooltip.hide("#plannedtoolactivity");
                tooltip.hide("#plannedtoolcurr,#plannedtooltotalcurr");

                if (orgrecord) {
                    $("#plannedtoolcurr,#plannedtooltotalcurr").val(orgrecord.ORG_CURRENCY);
                    tooltip.show("#plannedtoolcurr,#plannedtooltotalcurr", orgrecord.ORG_CURRENCYDESC);
                }
            };

            this.List = function () {
                var grdFilter = [{ field: "TPL_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
                if (grdPlannedTools) {
                    grdPlannedTools.ClearSelection();
                    grdPlannedTools.RunFilter(grdFilter);
                } else {
                    grdPlannedTools = new Grid({
                        keyfield: "TPL_ID",
                        columns: [
                            {
                                type: "number",
                                field: "TPL_ACTIVITY",
                                title: gridstrings.plannedtools[lang].activity,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "TPL_ACTIVITYDESC",
                                title: gridstrings.plannedtools[lang].activitydesc,
                                width: 350
                            },
                            {
                                type: "date",
                                field: "TPL_PLANDATE",
                                title: gridstrings.plannedtools[lang].plandate,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "TPL_TOOL",
                                title: gridstrings.plannedtools[lang].tool,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "TPL_TOOLDESC",
                                title: gridstrings.plannedtools[lang].tooldesc,
                                width: 350
                            },
                            {
                                type: "number",
                                field: "TPL_PERIOD",
                                title: gridstrings.plannedtools[lang].period,
                                width: 250
                            },
                            {
                                type: "price",
                                field: "TPL_UNITPRICE",
                                title: gridstrings.plannedtools[lang].unitprice,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "TPL_CURR",
                                title: gridstrings.plannedtools[lang].curr,
                                width: 150
                            },
                            {
                                type: "price",
                                field: "TPL_EXCH",
                                title: gridstrings.plannedtools[lang].exch,
                                width: 150
                            },
                            {
                                type: "price",
                                field: "TPL_TOTAL",
                                title: gridstrings.plannedtools[lang].total,
                                width: 150
                            }
                        ],
                        datasource: "/Api/ApiPlannedTools/List",
                        selector: "#grdPlannedTools",
                        name: "grdPlannedTools",
                        height: 250,
                        filter: grdFilter,
                        sort: [{ field: "TPL_ID", dir: "desc" }],
                        change: gridChange,
                        toolbar: {
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"PlannedTools.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                            ]
                        }
                    });
                };
            };
            var RgstrTabEvents = function () {
                $("#btnSavePlannedTool").click(self.Save);
                $("#btnAddPlannedTool").click(self.ResetUI);
                $("#btnDeletePlannedTool").click(self.Delete);

                $("#btnplannedtoolactivity").on("click",
                    function () {
                        gridModal.show({
                            modaltitle: gridstrings.taskactivities[lang].title,
                            listurl: "/Api/ApiTaskActivities/List",
                            keyfield: "TSA_ID",
                            codefield: "TSA_LINE",
                            textfield: "TSA_DESC",
                            returninput: "#plannedtoolactivity",
                            columns: [
                                {
                                    type: "string",
                                    field: "TSA_LINE",
                                    title: gridstrings.taskactivities[lang].line,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "TSA_DESC",
                                    title: gridstrings.taskactivities[lang].description,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_ASSIGNEDTO",
                                    title: gridstrings.taskactivities[lang].assignedto,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_TRADE",
                                    title: gridstrings.taskactivities[lang].trade,
                                    width: 200
                                }
                            ],
                            filter: [
                                { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" },
                                { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                            ]
                        });
                    });
                $("#plannedtoolactivity").autocomp({
                    listurl: "/Api/ApiTaskActivities/List",
                    geturl: "/Api/ApiTaskActivities/Get",
                    field: "TSA_LINE",
                    textfield: "TSA_DESC",
                    termisnumeric: true,
                    filter: [
                        { field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" },
                        { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                    ]
                });
                $("#btnplannedtool").on("click",
                    function () {
                        gridModal.show({
                            modaltitle: gridstrings.tools[lang].title,
                            listurl: "/Api/ApiTools/List",
                            keyfield: "TOO_CODE",
                            codefield: "TOO_CODE",
                            textfield: "TOO_DESCRIPTION",
                            returninput: "#plannedtool",
                            columns: [
                                {
                                    type: "string",
                                    field: "TOO_CODE",
                                    title: gridstrings.tools[lang].code,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "TOO_DESCRIPTION",
                                    title: gridstrings.tools[lang].description,
                                    width: 300
                                }
                            ],
                            filter: [
                                { field: "TOO_ACTIVE", value: "+", operator: "eq" }
                            ],
                            callback: function (d) {
                                tooltip.hide("#plannedtool");

                                $("#plannedtool").val((d ? d.TOO_CODE : ""));
                                $("#plannedtoolunitprice")
                                    .val(d ? d.TOO_UNITPRICE.fixed(constants.pricedecimals) : "");
                                $("#plannedtoolcurr, #plannedtooltotalcurr").val(d ? d.TOO_CURRENCY : "");
                                $("#toolchargingperiod")
                                    .val(d ? applicationstrings[lang].chargingperiods[d.TOO_CHARGINGPERIOD] : "");
                                if (d)
                                    tooltip.show("#plannedtool", d.TOO_DESCRIPTION);
                                var v = CalculateTotal();
                                if (v)
                                    $("#plannedtooltotal").val(v.fixed(constants.pricedecimals));

                                $.when(CalculateExch()).done(function (d) {
                                    if (d.data) {
                                        $("#plannedtoolexch")
                                            .val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                                    } else {
                                        $("#plannedtoolexch").val("");
                                    }
                                });
                            }
                        });
                    });
                $("#plannedtool").autocomp({
                    listurl: "/Api/ApiTools/List",
                    geturl: "/Api/ApiTools/Get",
                    field: "TOO_CODE",
                    textfield: "TOO_DESCRIPTION",
                    filter: [
                        { field: "TOO_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (d) {
                        tooltip.hide("#plannedtool");

                        $("#plannedtool").val((d ? d.TOO_CODE : ""));
                        $("#plannedtoolunitprice").val(d ? d.TOO_UNITPRICE.fixed(constants.pricedecimals) : "");
                        $("#plannedtoolcurr, #plannedtooltotalcurr").val(d ? d.TOO_CURRENCY : "");
                        $("#toolchargingperiod").val(d
                            ? applicationstrings[lang].chargingperiods[d.TOO_CHARGINGPERIOD]
                            : "");
                        if (d)
                            tooltip.show("#plannedtool", d.TOO_DESCRIPTION);
                        var v = CalculateTotal();
                        if (v)
                            $("#plannedtooltotal").val(v.fixed(constants.pricedecimals));

                        $.when(CalculateExch()).done(function (d) {
                            if (d.data) {
                                $("#plannedtoolexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                            } else {
                                $("#plannedtoolexch").val("");
                            }
                        });
                    }
                });
                $("#plannedtoolsform input[calc-group=\"1\"]").on("change",
                    function () {
                        $.when(CalculateExch()).done(function (d) {
                            if (d.data) {
                                $("#plannedtoolexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                                var total = CalculateTotal();
                                $("#plannedtooltotal").val(total.fixed(constants.pricedecimals));
                            } else {
                                $("#plannedtoolexch").val("");
                                $("#plannedtooltotal").val("");
                            }
                        });
                    });
            }
            RgstrTabEvents();
        }
        this.labor = new function () {
            var self = this;
            var $grdLabors = $("#grdLabors");
            var grdLabors = null;
            var selectedplannedlabor = null;
            var selectedplassignedto = null;

            this.ResetUI = function () {
                selectedplannedlabor = null;
                tms.Reset("#plnlabor");

                $("#plannedlaboractivity").val("");
                $("#plannedstartdate").val("");
                $("#plannedduration").val("");
                $("#planneddurationunit").val("");
                $("#plannedprovince").val("");
                $("#plannedtrade").val("");
                $("#plannedassignedto").tagsinput("removeAll");
                $("#plannedassignedtocnt").text("");

                tooltip.hide("#plannedlaboractivity");
                tooltip.hide("#plannedtrade");
            }
            var FillUserInterface = function () {
                tms.UnBlock("#plannedlaborform");
                tms.BeforeFill("#plnlabor");

                $("#plannedlaboractivity").val(selectedplannedlabor.LAB_ACTIVITY);
                $("#plannedstartdate").val(moment(selectedplannedlabor.LAB_DATE).format(constants.longdateformat));
                $("#plannedduration").val(selectedplannedlabor.LAB_DURATION);
                $("#planneddurationunit").val(selectedplannedlabor.LAB_DURATIONUNIT);
                $("#plannedprovince").val(selectedplannedlabor.LAB_PROVINCE);
                $("#plannedtrade").val(selectedplannedlabor.LAB_TRADE);

                $("#plannedassignedto").tagsinput("removeAll");
                if (selectedplannedlabor.LAB_ASSIGNEDTO != null)
                    for (var i = 0; i < selectedplassignedto.length; i++) {
                        $("#plannedassignedto").tagsinput("add",
                            { id: selectedplassignedto[i].USR_CODE, text: selectedplassignedto[i].USR_DESC },
                            ["ignore"]);
                    }

                tooltip.show("#plannedlaboractivity", selectedplannedlabor.LAB_ACTIVITYDESC);
                tooltip.show("#plannedprovince", selectedplannedlabor.LAB_PROVINCEDESC);
                tooltip.show("#plannedtrade", selectedplannedlabor.LAB_TRADEDESC);
            };
            var LoadSelected = function () {
                return tms.Ajax({
                    url: "/Api/ApiLabors/Get",
                    data: JSON.stringify(selectedplannedlabor.LAB_ID),
                    fn: function (d) {
                        selectedplannedlabor = d.data;
                        selectedplassignedto = d.users;
                        FillUserInterface();
                    }
                });
            };
            this.Save = function () {
                if (!tms.Check("#plnlabor"))
                    return $.Deferred().reject();

                var plnlabor = {
                    LAB_ID: selectedplannedlabor ? selectedplannedlabor.LAB_ID : 0,
                    LAB_TASK: task.TSK_ID,
                    LAB_ACTIVITY: $("#plannedlaboractivity").val(),
                    LAB_DATE: moment.utc($("#plannedstartdate").val(), constants.longdateformat),
                    LAB_DURATION: $("#plannedduration").val(),
                    LAB_DURATIONUNIT: $("#planneddurationunit").val(),
                    LAB_PROVINCE: $("#plannedprovince").val(),
                    LAB_TRADE: $("#plannedtrade").val(),
                    LAB_ASSIGNEDTO: ($("#plannedassignedto").val() || null),
                    LAB_TOTAL: 0,
                    LAB_CURR: orgrecord.ORG_CURRENCY,
                    LAB_CREATED: selectedplannedlabor != null ? selectedplannedlabor.LAB_CREATED : tms.Now(),
                    LAB_CREATEDBY: selectedplannedlabor != null ? selectedplannedlabor.LAB_CREATEDBY : user,
                    LAB_UPDATED: selectedplannedlabor != null ? tms.Now() : null,
                    LAB_UPDATEDBY: selectedplannedlabor != null ? user : null,
                    LAB_RECORDVERSION: selectedplannedlabor != null ? selectedplannedlabor.LAB_RECORDVERSION : 0
                };

                return tms.Ajax({
                    url: "/Api/ApiLabors/Save",
                    data: JSON.stringify(plnlabor),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });
            };
            var itemSelect = function (row) {
                selectedplannedlabor = grdLabors.GetRowDataItem(row);
                LoadSelected();
            };
            var gridChange = function (e) {
                itemSelect(e.sender.select());
            };
            this.List = function () {
                var grdFilter = [
                    { field: "LAB_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }
                ];
                if (grdLabors) {
                    grdLabors.ClearSelection();
                    grdLabors.RunFilter(grdFilter);
                } else {
                    grdLabors = new Grid({
                        keyfield: "LAB_ID",
                        columns: [
                            {
                                type: "number",
                                field: "LAB_ACTIVITY",
                                title: gridstrings.plannedlabors[lang].activity,
                                width: 150
                            },
                            {
                                type: "datetime",
                                field: "LAB_DATE",
                                title: gridstrings.plannedlabors[lang].date,
                                width: 250
                            },
                            {
                                type: "number",
                                field: "LAB_DURATION",
                                title: gridstrings.plannedlabors[lang].duration,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "LAB_DURATIONUNIT",
                                title: gridstrings.plannedlabors[lang].durationunit,
                                width: 150,
                                template: "<span>#= applicationstrings[lang].durationunit[LAB_DURATIONUNIT] #</span>"
                            },
                            {
                                type: "string",
                                field: "LAB_PROVINCEDESC",
                                title: gridstrings.plannedlabors[lang].province,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "LAB_TRADE",
                                title: gridstrings.plannedlabors[lang].trade,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "LAB_ASSIGNEDTO",
                                title: gridstrings.plannedlabors[lang].assignedto,
                                width: 350
                            },
                            {
                                type: "price",
                                field: "LAB_TOTAL",
                                title: gridstrings.plannedlabors[lang].total,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "LAB_CURR",
                                title: gridstrings.plannedlabors[lang].curr,
                                width: 150
                            }
                        ],
                        fields:
                        {
                            LAB_ACTIVITY: { type: "number" },
                            LAB_DATE: { type: "date" },
                            LAB_DURATION: { type: "number" },
                            LAB_TOTAL: { type: "number" }
                        },
                        datasource: "/Api/ApiLabors/List",
                        selector: "#grdLabors",
                        name: "grdLabors",
                        height: 250,
                        filter: grdFilter,
                        sort: [{ field: "LAB_ACTIVITY", dir: "asc" }],
                        change: gridChange,
                        toolbar: {
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"PlannedLabors.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                            ]
                        }
                    });
                }
            }
            this.Delete = function () {
                if (selectedplannedlabor) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            tms.Ajax({
                                url: "/Api/ApiLabors/DelRec",
                                data: JSON.stringify(selectedplannedlabor.LAB_ID),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                }
            };
            var RgstrTabEvents = function () {
                $("#btnSavePlannedLabor").click(self.Save);
                $("#btnAddPlannedLabor").click(self.ResetUI);
                $("#btnDeletePlannedLabor").click(self.Delete);

                $("#btnplannedlaboractivity").on("click",
                    function () {
                        gridModal.show({
                            modaltitle: gridstrings.taskactivities[lang].title,
                            listurl: "/Api/ApiTaskActivities/List",
                            keyfield: "TSA_ID",
                            codefield: "TSA_LINE",
                            textfield: "TSA_DESC",
                            returninput: "#plannedlaboractivity",
                            columns: [
                                {
                                    type: "string",
                                    field: "TSA_LINE",
                                    title: gridstrings.taskactivities[lang].line,
                                    width: 100
                                },
                                {
                                    type: "string",
                                    field: "TSA_DESC",
                                    title: gridstrings.taskactivities[lang].description,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_ASSIGNEDTO",
                                    title: gridstrings.taskactivities[lang].assignedto,
                                    width: 300
                                },
                                {
                                    type: "string",
                                    field: "TSA_TRADE",
                                    title: gridstrings.taskactivities[lang].trade,
                                    width: 200
                                }
                            ],
                            filter: [
                                { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" },
                                { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                            ]
                        });
                    });
                $("#plannedlaboractivity").autocomp({
                    listurl: "/Api/ApiTaskActivities/List",
                    geturl: "/Api/ApiTaskActivities/Get",
                    field: "TSA_LINE",
                    textfield: "TSA_DESC",
                    termisnumeric: true,
                    filter: [
                        { field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" },
                        { field: "TSA_COMPLETED", value: "+", operator: "neq" }
                    ]
                });

                $("#btnplannedprovince").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.addresssection[lang].title,
                        listurl: "/Api/ApiAddressSections/List",
                        keyfield: "ADS_CODE",
                        codefield: "ADS_CODE",
                        textfield: "ADS_DESC",
                        returninput: "#plannedprovince",
                        columns: [
                            {
                                type: "string",
                                field: "ADS_CODE",
                                title: gridstrings.addresssection[lang].code,
                                width: 100
                            },
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
                $("#plannedprovince").autocomp({
                    listurl: "/Api/ApiAddressSections/List",
                    geturl: "/Api/ApiAddressSections/Get",
                    field: "ADS_CODE",
                    textfield: "ADS_DESC",
                    active: "ADS_ACTIVE",
                    filter: [
                        { field: "ADS_TYPE", value: "IL", operator: "eq" }
                    ]
                });

                $("#btnplannedtrade").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.trades[lang].title,
                        listurl: "/Api/ApiTrades/List",
                        keyfield: "TRD_CODE",
                        codefield: "TRD_CODE",
                        textfield: "TRD_DESC",
                        returninput: "#plannedtrade",
                        columns: [
                            { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                            {
                                type: "string",
                                field: "TRD_DESC",
                                title: gridstrings.trades[lang].description,
                                width: 300
                            }
                        ],
                        filter: [
                            { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                            { field: "TRD_ORGANIZATION", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                            { field: "TRD_DEPARTMENT", value: [task.TSK_DEPARTMENT, "*"], operator: "in" }
                        ],
                        callback: function (data) {
                            if (data.TRD_CODE !== "*") $("#plannedassignedto").tagsinput("removeAll");
                            $("#plannedassignedto,#btnPlannedAssignedTo,#btnplnaddme")
                                .prop("disabled", data.TRD_CODE !== "*");
                        }
                    });
                });
                $("#plannedtrade").autocomp({
                    listurl: "/Api/ApiTrades/List",
                    geturl: "/Api/ApiTrades/Get",
                    field: "TRD_CODE",
                    textfield: "TRD_DESC",
                    active: "TRD_ACTIVE",
                    filter: [
                        {
                            field: "TRD_ORGANIZATION",
                            func: function () { return task.TSK_ORGANIZATION; },
                            includeall: true
                        },
                        {
                            field: "TRD_DEPARTMENT",
                            func: function () { return [task.TSK_DEPARTMENT, "*"]; },
                            operator: "in"
                        }
                    ],
                    callback: function (data) {
                        if (data.TRD_CODE !== "*") $("#plannedassignedto").tagsinput("removeAll");
                        $("#plannedassignedto,#btnPlannedAssignedTo,#btnplnaddme")
                            .prop("disabled", data.TRD_CODE !== "*");
                    }
                });

                $("#btnPlannedAssignedTo").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.user[lang].title,
                        listurl: "/Api/ApiUsers/List",
                        keyfield: "USR_CODE",
                        codefield: "USR_CODE",
                        textfield: "USR_DESC",
                        returninput: "#plannedassignedto",
                        multiselect: true,
                        columns: [
                            { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                            { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                        ],
                        filter: [
                            { field: "USR_ACTIVE", value: "+", operator: "eq" },
                            { field: "USR_ORG", value: ["*", task.TSK_ORGANIZATION], operator: "in" }
                        ],
                        quickfilter: [
                            {
                                text: gridstrings.user[lang].allusers,
                                filter: [
                                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                    { field: "USR_CODE", value: "*", operator: "neq" }
                                ]
                            },
                            {
                                text: gridstrings.user[lang].departmentusers,
                                filter: [
                                    { field: "USR_DEPARTMENT", value: task.TSK_DEPARTMENT, operator: "eq" },
                                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                    { field: "USR_CODE", value: "*", operator: "neq" }
                                ]
                            }
                        ]
                    });
                });
                $("#btnplnaddme").click(function () {
                    $("#plannedassignedto").tagsinput("add", { id: user, text: userdesc });
                });
                $("#plannedassignedto").on("itemAdded",
                    function () {
                        $("#plannedassignedtocnt").text("(" +
                            $("#plannedassignedto").tagsinput("items").length +
                            " " +
                            applicationstrings[lang].person +
                            ")");
                    }).on("itemRemoved",
                    function () {
                        var itemcount = $("#plannedassignedto").tagsinput("items").length;
                        $("#plannedassignedtocnt").text(itemcount !== 0
                            ? "(" + itemcount + " " + applicationstrings[lang].person + ")"
                            : "");
                    });
            }
            RgstrTabEvents();
        }
        this.preview = new function () {
            this.List = function () {
                var gridreq = {
                    sort: [{ field: "TPP_TYPE", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "TPP_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }
                        ]
                    }
                };
                return tms.Ajax({
                    url: "/Api/ApiTask/ListPlanPreview",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        var body = $("#plnpreview table tbody");
                        var cost = 0;
                        body.find("*").remove();
                        if (d.data) {
                            $.each(d.data, function (i, e) { cost += e.TPP_TOTAL });
                            var strLines = "";
                            for (var i = 0; i < d.data.length; i++) {
                                var di = d.data[i];
                                strLines += "<tr><td>" +
                                    gridstrings.pricingtypes[lang][di.TPP_TYPE] +
                                    "</td><td><span class=\"pull-right\">" +
                                    parseFloat(di.TPP_TOTAL)
                                    .toLocaleString(undefined,
                                        {
                                            maximumFractionDigits: constants.pricedecimals,
                                            minimumFractionDigits: constants.pricedecimals
                                        }) +
                                    "</span></td><td>" +
                                    di.TPP_CURR +
                                    "</td></tr>";
                            }
                            strLines += "<tr><td>" +
                                applicationstrings[lang].total +
                                "</td><td><span class=\"pull-right\">" +
                                parseFloat(cost)
                                .toLocaleString(undefined,
                                    {
                                        maximumFractionDigits: constants.pricedecimals,
                                        minimumFractionDigits: constants.pricedecimals
                                    }) +
                                "</span></td><td>" +
                                orgrecord.ORG_CURRENCY +
                                "</td></tr>";
                            body.append(strLines);
                        }
                    }
                });
            }
        }

        var RegisterTabChange = function () {
            $(document).on("shown.bs.tab",
                "#navplanning a[data-toggle=\"tab\"]",
                function (e) {
                    var target = $(e.target).attr("href");
                    if (target === "#plnpart") {
                        pln.part.List();
                        pln.part.ResetUI();
                    } else if (target === "#plnmisccosts") {
                        pln.msc.List();
                        pln.msc.ResetUI();
                    } else if (target === "#plntool") {
                        pln.tool.List();
                        pln.tool.ResetUI();
                    } else if (target === "#plnlabor") {
                        pln.labor.List();
                        pln.labor.ResetUI();
                    } else if (target === "#plnpreview") {
                        pln.preview.List();
                    }
                });
        };
        var RegisterTabEvents = function () {
            RegisterTabChange();
        };

        RegisterTabEvents();
    };
    var mc = new function () {
        var $grdMiscCosts = $("#grdMiscCosts");
        var grdMiscCosts = null;
        var self = this;
        var selectedmisccost = null;

        var RestoreDefaultFieldStates = function () {
            $("#misccostdesc").addClass("required").prop("disabled", false).val("");
            $("#misccostuom").prop("disabled", false).addClass("required").val("");
            $("#btnmisccostuom").prop("disabled", false);

            $("#misccostpart").removeClass("required isempty").prop("disabled", true).data("id", null).val("");
            $("#btnmisccostpart").prop("disabled", true);
            tooltip.hide("#misccostpart");

        }
        var PartIsNotFound = function () {
            RestoreDefaultFieldStates();
        }
        var PartIsFound = function () {
            $("#misccostpart")
                .addClass("required")
                .prop("disabled", false)
                .data("id", null)
                .val("");
            $("#btnmisccostpart").prop("disabled", false);
            $("#misccostdesc").removeClass("required").prop("disabled", true).val("");
            $("#misccostuom").prop("disabled", true).val("");
            $("#btnmisccostuom").prop("disabled", true);
            tooltip.hide("#misccostpart");
        }
        var GetContractPartPrice = function (part) {
            var gridreq = {
                sort: [{ field: "CPP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetPartPriceForTask", value: task.TSK_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var HistoryModal = function () {
            var f = [
                { field: "AUD_SUBJECT", value: "TMMISCCOSTS", operator: "eq" },
                { field: "AUD_REFID", value: task.TSK_ID, operator: "eq" }
            ];
            if (supplier)
                f.push({ field: "AUD_SOURCE", value: "MSC_UNITSALESPRICE", operator: "neq" });

            auditModal.show({ filter: f });
        };
        var LoadSubTypes = function (v) {
            var gridreq = {
                sort: [{ field: "MCT_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "MCT_ACTIVE", value: "+", operator: "eq" },
                        { field: "MCT_TYPE", value: v, operator: "eq" }
                    ]
                }
            };

            return select({
                ctrl: "#misccosttype",
                url: "/Api/ApiMiscCostTypes/List",
                keyfield: "MCT_CODE",
                textfield: "MCT_DESC",
                data: JSON.stringify(gridreq),
                callback: function (d) {
                    if ($("#typ").val() === "SERVICE")
                        $("#misccosttype").val("SERVIS");
                }
            }).Fill();
        };
        var CalculateTotal = function () {
            var v_misccostunitprice = $("#misccostunitprice").val();
            var v_misccostqty = $("#misccostqty").val();
            var v_misccostexch = $("#misccostexch").val();
            if (v_misccostunitprice && v_misccostqty) {
                var total = (parseFloat(v_misccostunitprice) *
                        parseFloat(v_misccostqty) *
                        parseFloat(v_misccostexch))
                    .fixed(constants.pricedecimals);
                return total;
            }
        };
        var CalculateExch = function () {
            var curr = $("#misccostcurr").val();
            var date = $("#misccostdate").val();

            if (!curr || !date)
                return $.Deferred().reject();

            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: orgrecord.ORG_CURRENCY,
                CRR_STARTDATE: moment.utc(date, constants.dateformat)
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch)
            });
        };
        var FillUserInterface = function () {

            tms.UnBlock("#misccostsform");
            tms.BeforeFill("#misccosts");

            if (selectedmisccost.MSC_PTYPE == "PART") {
                $("#misccostpartcontainer").removeClass("hidden");
                $("#partisnotfound").prop("checked", !selectedmisccost.MSC_PART).trigger("change");
                $("#misccostpartreference").val(selectedmisccost.MSC_PARTREFERENCE);
                if (selectedmisccost.MSC_PART) {
                    $("#misccostpart").val(selectedmisccost.MSC_PARTCODE);
                    $("#misccostpart").data("id", selectedmisccost.MSC_PART);
                    tooltip.show("#misccostpart", selectedmisccost.MSC_PARTDESC);
                }
            } else {
                $("#misccostpartcontainer").addClass("hidden");
                RestoreDefaultFieldStates();
            }

            $("#mcactivity").val(selectedmisccost.MSC_ACTIVITY);
            $("#misccostdate").val(moment(selectedmisccost.MSC_DATE).format(constants.dateformat));
            $("#misccostdesc").val(selectedmisccost.MSC_DESC);
            $("#typ").val(selectedmisccost.MSC_PTYPE);
            $.when(LoadSubTypes(selectedmisccost.MSC_PTYPE)).done(function () {
                $("#misccosttype").val(selectedmisccost.MSC_TYPE);
            });
            $("#misccostunitprice").val(parseFloat(selectedmisccost.MSC_UNITPRICE).fixed(constants.pricedecimals));
            $("#misccostunitsalesprice").val(selectedmisccost.MSC_UNITSALESPRICE !== null
                ? parseFloat(selectedmisccost.MSC_UNITSALESPRICE).fixed(constants.pricedecimals)
                : "");
            $("#misccostcurr").val(selectedmisccost.MSC_CURR);
            $("#misccostexch").val(parseFloat(selectedmisccost.MSC_EXCH).fixed(constants.exchdecimals));
            $("#misccostqty").val(parseFloat(selectedmisccost.MSC_QTY).fixed(constants.qtydecimals));
            $("#misccostuom").val(selectedmisccost.MSC_UOM);
            $("#misccosttotal").val(parseFloat(selectedmisccost.MSC_TOTAL).fixed(constants.pricedecimals));
            $("#misccostunitprice").prop("disabled", selectedmisccost.MSC_FIXED === "+" && !!supplier);

            tooltip.show("#mcactivity", selectedmisccost.MSC_ACTIVITYDESC);
            tooltip.show("#misccostcurr", selectedmisccost.MSC_CURRDESC);
            tooltip.show("#misccostuom", selectedmisccost.MSC_UOMDESC);

            if (pstat === "C") tms.Block("#misccostsform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiMiscCosts/Get",
                data: JSON.stringify(selectedmisccost.MSC_ID),
                fn: function (d) {
                    selectedmisccost = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selectedmisccost = grdMiscCosts.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.ResetUI = function () {
            selectedmisccost = null;
            tms.UnBlock("#misccostsform");
            tms.Reset("#misccosts");

            $("#mcactivity").val("");
            $("#misccostdate").val(tms.Now().format(constants.dateformat));
            $("#misccostdesc").val("");
            $("#typ").val("").trigger("change");
            $("#misccostunitprice").val("");
            $("#misccostunitsalesprice").val("");
            $("#misccostcurr").val("");
            $("#misccostexch").val("1.00");
            $("#misccostqty").val("");
            $("#misccostuom").val("");
            $("#misccosttotal").val("");
            $("#misccostpart").data("id", null);
            $("#misccostpart").val("");
            $("#misccostpartreference").val("");

            tooltip.hide("#mcactivity");
            tooltip.hide("#misccostcurr");
            tooltip.hide("#misccostuom");
            tooltip.hide("#misccostpart");

            $("#misccostpartcontainer").addClass("hidden");
            RestoreDefaultFieldStates();

            $("#misccostunitprice").prop("disabled", false);


            if (orgrecord) {
                $("#misccostcurr").val(orgrecord.ORG_CURRENCY);
                $("#misccosttotalcurr").val(orgrecord.ORG_CURRENCY);
                tooltip.show("#misccostcurr", orgrecord.ORG_CURRENCYDESC);
                tooltip.show("#misccosttotalcurr", orgrecord.ORG_CURRENCYDESC);
            }

            if (pstat === "C") tms.Block("#misccostsform");
        };
        var gridDataBound = function (e) {
            var data = grdMiscCosts.GetData();
            var sumcost = 0;
            var sumsales = 0;
            $.each(data,
                function () {
                    sumcost += parseFloat(this.MSC_UNITPRICE * this.MSC_EXCH * this.MSC_QTY) || 0;
                    sumsales += parseFloat(this.MSC_UNITSALESPRICE * this.MSC_EXCH * this.MSC_QTY) || 0;
                });
            $grdMiscCosts.find("#grdCostSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].totalcost +
                ": </strong>" +
                sumcost.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY +
                "</span>");
            if (!supplier)
                $grdMiscCosts.find("#grdSalesSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                    applicationstrings[lang].totalsales +
                    ": </strong>" +
                    sumsales.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " " +
                    orgrecord.ORG_CURRENCY +
                    "</span>");
            $grdMiscCosts.find("#btnMiscCostHistory").off("click").on("click", HistoryModal);
            $grdMiscCosts.contextMenu({
                selector: "tr[data-id]",
                items: {
                    profitrate: {
                        name: applicationstrings[lang].setprofitmargin,
                        callback: function () {
                            $("#modalMisccostProfitMargin").modal("show");
                        }
                    },

                }
            });
        }
        this.List = function () {
            var grdFilter = [{ field: "MSC_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
            if (grdMiscCosts) {
                grdMiscCosts.ClearSelection();
                grdMiscCosts.RunFilter(grdFilter);
            } else {
                var columns = [
                    { type: "number", field: "MSC_ACTIVITY", title: gridstrings.misccosts[lang].activity, width: 150 },
                    { type: "date", field: "MSC_DATE", title: gridstrings.misccosts[lang].date, width: 150 },
                    { type: "string", field: "MSC_DESC", title: gridstrings.misccosts[lang].desc, width: 250 },
                    { type: "string", field: "MSC_PTYPE", title: gridstrings.misccosts[lang].ptype, width: 150 },
                    { type: "string", field: "MSC_TYPEDESC", title: gridstrings.misccosts[lang].type, width: 250 },
                    { type: "price", field: "MSC_UNITPRICE", title: gridstrings.misccosts[lang].unitprice, width: 150 },
                    { type: "price", field: "MSC_UNITSALESPRICE", title: gridstrings.misccosts[lang].unitsalesprice, width: 150 },
                    { type: "string", field: "MSC_CURR", title: gridstrings.misccosts[lang].curr, width: 150 },
                    { type: "qty", field: "MSC_QTY", title: gridstrings.misccosts[lang].qty, width: 150 },
                    { type: "string", field: "MSC_UOM", title: gridstrings.misccosts[lang].uom, width: 150 },
                    { type: "price", field: "MSC_TOTAL", title: gridstrings.misccosts[lang].total, width: 150 },
                    { type: "string", field: "MSC_PARTCODE", title: gridstrings.misccosts[lang].partcode, width: 150 },
                    { type: "string", field: "MSC_PARTREFERENCE", title: gridstrings.misccosts[lang].partreference, width: 150 }

                ];

                var fields = {
                    MSC_ACTIVITY: { type: "number" },
                    MSC_DATE: { type: "date" },
                    MSC_UNITPRICE: { type: "number" },
                    MSC_UNITSALESPRICE: { type: "number" },
                    MSC_QTY: { type: "number" },
                    MSC_TOTAL: { type: "number" }
                };

                if (supplier) {
                    columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["MSC_UNITSALESPRICE"]) == -1); });
                    delete fields.MSC_UNITSALESPRICE;
                }

                grdMiscCosts = new Grid({
                    keyfield: "MSC_ID",
                    columns: columns,
                    fields: fields,
                    datasource: "/Api/ApiMiscCosts/List",
                    selector: "#grdMiscCosts",
                    name: "grdMiscCosts",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "MSC_ID", dir: "desc" }],
                    change: gridChange,
                    loadall: true,
                    toolbar: {
                        left: [
                            "<div style=\"padding-right: 5px;\" class=\"pull-left\" id=\"grdCostSumValue\"></div><div class=\"pull-left\"  id=\"grdSalesSumValue\"></div>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"MiscCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnMiscCostHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
        var AddCheck = function () {
            var misccostdate = moment($("#misccostdate").val(), constants.dateformat);
            var misccostexch = $("#misccostexch").val();
            if (misccostdate < moment(task.TSK_REQUESTED).startOf("day")) {
                msgs.error(applicationstrings[lang].misccostdate);
                return false;
            }
            if (!misccostexch) {
                msgs.error(applicationstrings[lang].misccostexch);
                return false;
            }
            return true;
        };
        this.Save = function () {
            if (!tms.Check("#misccosts") || !AddCheck())
                return $.Deferred().reject();

            var misccost = {
                MSC_ID: selectedmisccost ? selectedmisccost.MSC_ID : 0,
                MSC_TASK: task.TSK_ID,
                MSC_ACTIVITY: $("#mcactivity").val(),
                MSC_DATE: moment.utc($("#misccostdate").val(), constants.dateformat),
                MSC_DESC: $("#misccostdesc").val(),
                MSC_TYPE: $("#misccosttype").val(),
                MSC_PTYPE: $("#typ").val(),
                MSC_PART: ($("#misccostpart").data("id") || null),
                MSC_PARTREFERENCE: ($("#misccostpartreference").val() || null),
                MSC_UNITPRICE: parseFloat($("#misccostunitprice").val()),
                MSC_UNITSALESPRICE: ($("#misccostunitsalesprice").val()
                    ? parseFloat($("#misccostunitsalesprice").val())
                    : null),
                MSC_CURR: $("#misccostcurr").val(),
                MSC_EXCH: $("#misccostexch").val(),
                MSC_QTY: parseFloat($("#misccostqty").val()),
                MSC_UOM: $("#misccostuom").val(),
                MSC_INVOICE: null,
                MSC_TOTAL: CalculateTotal(),
                MSC_FIXED: selectedmisccost != null ? selectedmisccost.MSC_FIXED : "-",
                MSC_CREATED: selectedmisccost != null ? selectedmisccost.MSC_CREATED : tms.Now(),
                MSC_CREATEDBY: selectedmisccost != null ? selectedmisccost.MSC_CREATEDBY : user,
                MSC_UPDATED: selectedmisccost != null ? tms.Now() : null,
                MSC_UPDATEDBY: selectedmisccost != null ? user : null,
                MSC_RECORDVERSION: selectedmisccost != null ? selectedmisccost.MSC_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiMiscCosts/Save",
                data: JSON.stringify(misccost),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedmisccost) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiMiscCosts/DelRec",
                            data: JSON.stringify(selectedmisccost.MSC_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };

        var BuildModals = function () {
            $("#btnmcactivity").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_ID",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#mcactivity",
                    columns: [
                        {
                            type: "string",
                            field: "TSA_LINE",
                            title: gridstrings.taskactivities[lang].line,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 100
                        }
                    ],
                    filter: [{ field: "TSA_TASK", value: task.TSK_ID, operator: "eq" }]
                });
            });
            $("#btnmisccostuom").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.uoms[lang].title,
                    listurl: "/Api/ApiUoms/List",
                    keyfield: "UOM_CODE",
                    codefield: "UOM_CODE",
                    textfield: "UOM_DESC",
                    returninput: "#misccostuom",
                    columns: [
                        { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                        { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });        
            $("#btnmisccostpart").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    modalinfo: applicationstrings[lang].partmodalinfo,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_ID",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#misccostpart",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 400 }
                    ],
                    filter: [
                        { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                        { field: "IsContractedTaskPart", value: task.TSK_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedTaskPart", value: task.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.parts[lang].allparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(tree.GetLevels("PART")).done(function (d) {
                            var data = tree.GenerateTreeData(d.data);
                            $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [{ field: "PARTLEVEL.PARID", value: selectedItem.id, operator: "func" }];
                                        callback(filter);
                                    }

                                }
                            });
                        });
                    },
                    callback: function (d) {
                        $("#misccostdesc").val(d ? d.PAR_DESC : "");
                        $("#misccostuom").val(d ? d.PAR_UOM : "");
                        $("#misccostpart").data("id", d ? d.PAR_ID : null);
                        if (d)
                            tooltip.show("#misccostpart", d.PAR_DESC);
                        else
                            tooltip.hide("#misccostpart");

                        return $.when(GetContractPartPrice(d.PAR_ID)).done(function (cpp) {
                            if (cpp.data && cpp.data.length > 0) {
                                $("#misccostpartreference").val(cpp.data[0].CPP_REFERENCE);
                                $("#misccostunitprice").prop("disabled", supplier && cpp.data[0].CPP_UNITPURCHASEPRICE !== null);
                                $("#misccostunitprice").val(cpp.data[0].CPP_UNITPURCHASEPRICE);
                                if (!supplier)
                                    $("#misccostunitsalesprice").val(cpp.data[0].CPP_UNITSALESPRICE);
                                $("#misccostcurr").val(cpp.data[0].CPP_CURR).trigger("change");
                            }
                        });
                    }
                });
            });     
            $("#btnmisccostcurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#misccostcurr",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "CUR_DESC",
                            title: gridstrings.currencies[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (d) {
                        $("#misccostcurr").trigger("blur");
                    }
                });
            });
        }

        var AutoComplete = function () {
            $("#misccostuom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });
            $("#mcactivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" }]
            });
            $("#misccostpart").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                callback: function (d) {
                    $("#misccostdesc").val(d ? d.PAR_DESC : "");
                    $("#misccostuom").val(d ? d.PAR_UOM : "");
                    $("#misccostpart").data("id", d ? d.PAR_ID : null);
                    if (d)
                        tooltip.show("#misccostpart", d.PAR_DESC);
                    else
                        tooltip.hide("#misccostpart");

                    return $.when(GetContractPartPrice(d.PAR_ID)).done(function (cpp) {
                        if (cpp.data && cpp.data.length > 0) {
                            $("#misccostpartreference").val(cpp.data[0].CPP_REFERENCE);
                            $("#misccostunitprice").prop("disabled", supplier && cpp.data[0].CPP_UNITPURCHASEPRICE !== null);
                            $("#misccostunitprice").val(cpp.data[0].CPP_UNITPURCHASEPRICE);
                            if (!supplier)
                                $("#misccostunitsalesprice").val(cpp.data[0].CPP_UNITSALESPRICE);
                            $("#misccostcurr").val(cpp.data[0].CPP_CURR).trigger("change");
                        }
                    });
                }
            });
            $("#misccostcurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });

        }
        var RegisterUIEvents = function () {
            $("#btnSaveMiscCost").click(self.Save);
            $("#btnAddMiscCost").click(self.ResetUI);
            $("#btnDeleteMiscCost").click(self.Delete);

            BuildModals();
            AutoComplete();
        
            $("#typ").on("change", function () {
                    var $this = $(this);
                    if ($this.val() == "PART") {
                        $("#misccostpartcontainer").removeClass("hidden");
                        $("#partisnotfound").prop("checked", false).trigger("change");
                    }  else {
                        $("#misccostpartcontainer").addClass("hidden");
                        RestoreDefaultFieldStates();
                    }
                    LoadSubTypes($this.val());
                });
            $("#partisnotfound").on("change", function () {
                    var $this = $(this);
                    if ($this.is(":checked")) {
                        PartIsNotFound();
                    } else {
                        PartIsFound();
                    }
                });
            $("#misccostsform input[calc-group=\"1\"]").on("change", function () {
                    var total = CalculateTotal();
                    $("#misccosttotal").val(total);
                });
            $("#misccostsform input[calc-group=\"2\"]").on("change", function () {
                    $.when(CalculateExch()).done(function (d) {
                        if (d.data) {
                            $("#misccostexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                            $("#misccosttotal").val(CalculateTotal());
                        } else {
                            $("#misccostexch").val("");
                            $("#misccosttotal").val("");
                        }
                    });
            });

            $("#btnSaveMisccostProfitMargin").click(function () {
                var selectedMcRows = grdMiscCosts.GetSelected();
                var misccostArray = [];
                for (var i = 0; i < selectedMcRows.length; i++) {
                    var selectedmc = grdMiscCosts.GetRowDataItem(selectedMcRows[i]);
                    selectedmc.MSC_UNITSALESPRICE = selectedmc.MSC_UNITPRICE + ((selectedmc.MSC_UNITPRICE * $("#misccostSaveProfitMargin").val()) / 100)
                    misccostArray.push(selectedmc);
                }

                return tms.Ajax({
                    url: "/Api/ApiMiscCosts/SetMisccostProfitMargin",
                    data: JSON.stringify(misccostArray),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });

            });
        };
        RegisterUIEvents();
    };
    var bh = new function () {
        var $grdBooHours = $("#grdBooHours");
        var grdBooHours = null;
        var self = this;

        var BookedHoursSummary = function () {
            return tms.Ajax({
                url: "/Api/ApiBookedHours/BookedHoursSummary",
                data: JSON.stringify(task.TSK_ID),
                quietly: true,
                fn: function (d) {
                    if (d.data.length === 0) {
                        $(".bookedhourssummaryblck").hide();
                        return;
                    }

                    var strBookedHours = "<div class=\"row custom\">";
                    strBookedHours += "<div class=\"col-md-6\"></div>";
                    strBookedHours += "<div class=\"col-md-6\">" + applicationstrings[lang].ap + "</div>";
                    strBookedHours += "</div>";

                    var boousers = [];
                    $.each(d.data,
                        function (i, el) {
                            if ($.inArray(el.BOO_USER, boousers) === -1)
                                boousers.push(el.BOO_USER);
                        });
                    for (var i = 0; i < boousers.length; i++) {
                        var actualhrs = $.grep(d.data,
                            function (el) {
                                return (el.BOO_USER === boousers[i] && el.BOO_TYPE === "A");
                            });
                        var plannedhrs = $.grep(d.data,
                            function (el) {
                                return (el.BOO_USER === boousers[i] && el.BOO_TYPE === "P");
                            });

                        var actualhrsstr = "0";
                        var plannedhrsstr = "0";
                        if (actualhrs.length > 0)
                            actualhrsstr = moment.duration(Math.round(actualhrs[0].BOO_HOURS * 60), "minutes")
                                .format("h [sa] m [dk]");

                        if (plannedhrs.length > 0)
                            plannedhrsstr = moment.duration(Math.round(plannedhrs[0].BOO_HOURS * 60), "minutes")
                                .format("h [sa] m [dk]");

                        strBookedHours += "<div class=\"row custom\">";
                        strBookedHours += "<div class=\"col-md-6\">";
                        strBookedHours += boousers[i];
                        strBookedHours += "</div>";
                        strBookedHours += "<div class=\"col-md-6\">";
                        strBookedHours += "<span class=\"actual badge badge-info\">" + actualhrsstr + "</span> ";
                        strBookedHours += "<span class=\"planned badge badge-success\">" +
                            plannedhrsstr +
                            "</span>";
                        strBookedHours += "</div>";
                        strBookedHours += "</div>";
                    }

                    $("#bookedhourssummaryblck *").remove();
                    $("#bookedhourssummaryblck").append(strBookedHours);
                }
            });
        };
        var FillUserInterface = function () {
            tms.UnBlock("#bookedhoursform");
            tms.BeforeFill("#bookedhours");

            $("#activity").val(selectedbookedhour.BOO_LINE);
            $("#boouser").val(selectedbookedhour.BOO_USER);
            $("#bookdate").val(moment(selectedbookedhour.BOO_DATE).format(constants.dateformat));
            $("#bookstart").val(moment().startOf("day").seconds(selectedbookedhour.BOO_START)
                .format(constants.timeformat));
            $("#bookend").val(moment().startOf("day").seconds(selectedbookedhour.BOO_END)
                .format(constants.timeformat));
            $("#calchours").val(selectedbookedhour.BOO_CALCHOURS);
            $("input[name=rtype][value=" + selectedbookedhour.BOO_TYPE + "]").prop("checked", true);
            $("#overtimetype").val(selectedbookedhour.BOO_OTYPE);

            tooltip.show("#activity", selectedbookedhour.BOO_LINEDESC);
            tooltip.show("#boouser", selectedbookedhour.BOO_USERDESC);

            if (pstat === "C") tms.Block("#bookedhoursform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiBookedHours/Get",
                data: JSON.stringify(selectedbookedhour.BOO_ID),
                fn: function (d) {
                    selectedbookedhour = d.data;
                    FillUserInterface();
                }
            });
        };
        var gridDataBound = function () {
            BookedHoursSummary();
        };
        var itemSelect = function (row) {
            selectedbookedhour = grdBooHours.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.ResetUI = function () {
            selectedbookedhour = null;
            tms.UnBlock("#bookedhoursform");
            tms.Reset("#bookedhours");

            $("input[name=rtype][value=A]").prop("checked", true);
            $("#activity").val("");
            $("#boouser").val("");
            $("#bookdate").val("");
            $("#bookstart").val("");
            $("#bookend").val("");
            $("#calchours").val("");
            $("#overtimetype").val("N");

            tooltip.hide("#activity");
            tooltip.hide("#boouser");

            if (pstat === "C") tms.Block("#bookedhoursform");
        };
        this.List = function () {
            var grdFilter = [{ field: "BOO_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
            if (grdBooHours) {
                grdBooHours.ClearSelection();
                grdBooHours.RunFilter(grdFilter);
            } else {
                grdBooHours = new Grid({
                    keyfield: "BOO_ID",
                    columns: [
                        {
                            type: "number",
                            field: "BOO_LINE",
                            title: gridstrings.bookedhours[lang].line,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BOO_LINEDESC",
                            title: gridstrings.bookedhours[lang].linedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BOO_USERDESC",
                            title: gridstrings.bookedhours[lang].user,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BOO_OTYPE",
                            title: gridstrings.bookedhours[lang].otype,
                            width: 150
                        },
                        { type: "date", field: "BOO_DATE", title: gridstrings.bookedhours[lang].date, width: 250 },
                        {
                            type: "time",
                            field: "BOO_START",
                            title: gridstrings.bookedhours[lang].start,
                            width: 150,
                            template:
                                "#= BOO_START == null ? '' : moment().startOf('day').seconds(BOO_START).format(constants.timeformat) #"
                        },
                        {
                            type: "time",
                            field: "BOO_END",
                            title: gridstrings.bookedhours[lang].end,
                            width: 150,
                            template:
                                "#= BOO_END == null ? '' : moment().startOf('day').seconds(BOO_END).format(constants.timeformat) #"
                        },
                        {
                            type: "string",
                            field: "BOO_TYPE",
                            title: gridstrings.bookedhours[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BOO_CREATEDBY",
                            title: gridstrings.bookedhours[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "BOO_CREATED",
                            title: gridstrings.bookedhours[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BOO_UPDATEDBY",
                            title: gridstrings.bookedhours[lang].updatedby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "BOO_UPDATED",
                            title: gridstrings.bookedhours[lang].updated,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        BOO_LINE: { type: "number" },
                        BOO_DATE: { type: "date" },
                        BOO_START: { type: "time" },
                        BOO_END: { type: "time" },
                        BOO_CREATED: { type: "date" },
                        BOO_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiBookedHours/List",
                    selector: "#grdBooHours",
                    name: "grdBooHours",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "BOO_ID", dir: "desc" }],
                    databound: gridDataBound,
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"BookedHours.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        var AddCheck = function () {
            var boodate = moment($("#bookdate").val(), constants.dateformat);
            var startsec = moment.duration($("#bookstart").val(), constants.timeformat).asSeconds();
            var bootime = boodate.clone().add(startsec, "s");

            if (boodate > tms.Now()) {
                msgs.error(applicationstrings[lang].boodate01);
                return false;
            }
            if (bootime < moment(task.TSK_REQUESTED)) {
                msgs.error(applicationstrings[lang].boodate02);
                return false;
            }
            return true;
        };
        this.Save = function () {
            if (!tms.Check("#bookedhours") || !AddCheck())
                return $.Deferred().reject();

            var startsec = moment.duration($("#bookstart").val(), constants.timeformat).asSeconds();
            var endsec = moment.duration($("#bookend").val(), constants.timeformat).asSeconds();
            var calchours = Math.round(((endsec - startsec) / 3600) * 100) / 100;
            var type = $("input[name=\"rtype\"]:checked").val();

            if (endsec < startsec) {
                msgs.error(applicationstrings[lang].startenderr);
                return $.Deferred().reject();
            }

            var boohr = {
                BOO_ID: selectedbookedhour ? selectedbookedhour.BOO_ID : 0,
                BOO_DATE: moment.utc($("#bookdate").val(), constants.dateformat),
                BOO_START: startsec,
                BOO_END: endsec,
                BOO_CALCHOURS: calchours,
                BOO_OTYPE: $("#overtimetype").val(),
                BOO_TASK: task.TSK_ID,
                BOO_LINE: $("#activity").val(),
                BOO_TYPE: type,
                BOO_AUTO: "-",
                BOO_TRADE: selectedbookedhour ? selectedbookedhour.BOO_TRADE : "*",
                BOO_USER: $("#boouser").val(),
                BOO_CREATED: selectedbookedhour != null ? selectedbookedhour.BOO_CREATED : tms.Now(),
                BOO_CREATEDBY: selectedbookedhour != null ? selectedbookedhour.BOO_CREATEDBY : user,
                BOO_UPDATED: selectedbookedhour != null ? tms.Now() : null,
                BOO_UPDATEDBY: selectedbookedhour != null ? user : null,
                BOO_RECORDVERSION: selectedbookedhour != null ? selectedbookedhour.BOO_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiBookedHours/Save",
                data: JSON.stringify(boohr),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedbookedhour) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiBookedHours/DelRec",
                            data: JSON.stringify(selectedbookedhour.BOO_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var CalcBookedHours = function () {
            var startsec = moment.duration($("#bookstart").val(), constants.timeformat).asSeconds();
            var endsec = moment.duration($("#bookend").val(), constants.timeformat).asSeconds();
            var calchours = Math.round(((endsec - startsec) / 3600) * 100) / 100;
            $("#calchours").val(calchours);
        };
        var RegisterTabEvents = function () {
            $("#btnSaveBookedHours").click(self.Save);
            $("#btnAddBookedHours").click(self.ResetUI);
            $("#btnDeleteBookedHours").click(self.Delete);
            $("#btnActivity").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_ID",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#activity",
                    columns: [
                        {
                            type: "number",
                            field: "TSA_LINE",
                            title: gridstrings.taskactivities[lang].line,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_ASSIGNEDTO",
                            title: gridstrings.taskactivities[lang].assignedto,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "TSA_TRADE",
                            title: gridstrings.taskactivities[lang].trade,
                            width: 200
                        }
                    ],
                    fields: {
                        TSA_LINE: { type: "number" }
                    },
                    filter: [
                        { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" }
                    ]
                });
            });
            $("#btnboouser").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#boouser",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", task.TSK_ORGANIZATION], operator: "in" },
                        { field: "USR_BOO", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#bookstart,#bookend").on("dp.change",
                function () {
                    CalcBookedHours();
                });
            $("#activity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" }]
            });
            $("#boouser").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_ORG", func: function () { return [task.TSK_ORGANIZATION, "*"]; }, operator: "in" },
                    { field: "USR_TYPE", value: ["CUSTOMER"], operator: "nin" }
                ]
            });
        };
        RegisterTabEvents();
    };
    var cc = new function () {
        var selectedTaskClosingCode = null;
        var self = this;

        this.Save = function () {
            if (!tms.Check("#closingcodes"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                CLC_TASK: task.TSK_ID,
                CLC_FAILURE: ($("#failure").val() || null),
                CLC_FAILUREDESC: ($("#failuredesc").val() || null),
                CLC_CAUSE: ($("#cause").val() || null),
                CLC_CAUSEDESC: ($("#causedesc").val() || null),
                CLC_ACTION: ($("#action").val() || null),
                CLC_ACTIONDESC: ($("#actiondesc").val() || null),
                CLC_CREATED: selectedTaskClosingCode != null ? selectedTaskClosingCode.CLC_CREATED : tms.Now(),
                CLC_CREATEDBY: selectedTaskClosingCode != null ? selectedTaskClosingCode.CLC_CREATEDBY : user,
                CLC_UPDATED: selectedTaskClosingCode != null ? tms.Now() : null,
                CLC_UPDATEDBY: selectedTaskClosingCode != null ? user : null,
                CLC_RECORDVERSION: selectedTaskClosingCode != null ? selectedTaskClosingCode.CLC_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiTaskClosingCodes/Save",
                data: o,
                fn: function (d) {
                    if (d) {
                        msgs.success(d.data);
                        selectedTaskClosingCode = d.r;
                    }
                }
            });
        };
        this.ResetUI = function () {
            tms.Reset("#closingcodes");

            $("#failure").val("");
            $("#failuredesc").val("");
            $("#cause").val("");
            $("#causedesc").val("");
            $("#action").val("");
            $("#actiondesc").val("");

            tooltip.hide("#failure");
            tooltip.hide("#cause");
            tooltip.hide("#action");

            $("#closingcodesform :input").prop("disabled", pstat === "C");
        };
        var FillUserInterface = function () {
            if (!selectedTaskClosingCode)
                return;
            $("#failure").val(selectedTaskClosingCode.CLC_FAILURE);
            $("#failuredesc").val(selectedTaskClosingCode.CLC_FAILUREDESC);
            $("#cause").val(selectedTaskClosingCode.CLC_CAUSE);
            $("#causedesc").val(selectedTaskClosingCode.CLC_CAUSEDESC);
            $("#action").val(selectedTaskClosingCode.CLC_ACTION);
            $("#actiondesc").val(selectedTaskClosingCode.CLC_ACTIONDESC);

            tooltip.show("#failure", selectedTaskClosingCode.CLC_FAILURECODEDESC);
            tooltip.show("#cause", selectedTaskClosingCode.CLC_CAUSECODEDESC);
            tooltip.show("#action", selectedTaskClosingCode.CLC_ACTIONCODEDESC);

            if (selectedTaskClosingCode.CLC_FAILURE === "DIGER") {
                $("div.failure-div").removeClass("hidden");
                $("#failuredesc").attr("required", "required").addClass("required")
                    .val(selectedTaskClosingCode.CLC_FAILUREDESC);
            } else {
                $("div.failure-div").addClass("hidden");
                $("#failuredesc").removeAttr("required").removeClass("required").val("");
            }
            if (selectedTaskClosingCode.CLC_CAUSE === "DIGER") {
                $("div.cause-div").removeClass("hidden");
                $("#causedesc").attr("required", "required").addClass("required")
                    .val(selectedTaskClosingCode.CLC_CAUSEDESC);
            } else {
                $("div.cause-div").addClass("hidden");
                $("#causedesc").removeAttr("required").removeClass("required").val("");
            }
            if (selectedTaskClosingCode.CLC_ACTION === "DIGER") {
                $("div.action-div").removeClass("hidden");
                $("#actiondesc").attr("required", "required").addClass("required")
                    .val(selectedTaskClosingCode.CLC_ACTIONDESC);
            } else {
                $("div.action-div").addClass("hidden");
                $("#actiondesc").removeAttr("required").removeClass("required").val("");
            }
        };
        this.LoadTaskClosingCodes = function () {
            return tms.Ajax({
                url: "/Api/ApiTaskClosingCodes/Get",
                data: JSON.stringify(task.TSK_ID),
                fn: function (d) {
                    selectedTaskClosingCode = d.data;
                    FillUserInterface();
                }
            });
        };

        var GetFailureCodes = function () {
            var gridreq = {
                filter: {
                    filters: [
                        { field: "FMP_ENTITY", value: "FAILURE", operator: "eq" },
                        { field: "FMP_FIELD", value: "EQUIPMENTTYPE", operator: "eq" },
                        { field: "FMP_VALUE", value: [task.TSK_EQUIPMENTTYPE, "*"], operator: "in" }
                    ]
                },
                loadall: true
            };
            return tms.Ajax({ url: "/Api/ApiFieldMaps/List", data: JSON.stringify(gridreq) });
        }
        var GetCauseCodes = function () {
            var gridreq = {
                filter: {
                    filters: [
                        { field: "FMP_ENTITY", value: "CAUSE", operator: "eq" },
                        { field: "FMP_FIELD", value: "FAILURE", operator: "eq" },
                        { field: "FMP_VALUE", value: [$("#failure").val(), "*"], operator: "in" }
                    ]
                },
                loadall: true
            };
            return tms.Ajax({ url: "/Api/ApiFieldMaps/List", data: JSON.stringify(gridreq) });
        }
        var GetActionCodes = function () {
            var gridreq = {
                filter: {
                    filters: [
                        { field: "FMP_ENTITY", value: "ACTION", operator: "eq" },
                        { field: "FMP_FIELD", value: "CAUSE", operator: "eq" },
                        { field: "FMP_VALUE", value: [$("#cause").val(), "*"], operator: "in" }
                    ]
                },
                loadall: true
            };
            return tms.Ajax({ url: "/Api/ApiFieldMaps/List", data: JSON.stringify(gridreq) });
        }
        var RegisterTabEvents = function () {
            $("#btnSaveClosingCodes").click(self.Save);
            $("#btnFailure").click(function () {
                return $.when(GetFailureCodes()).done(function (d) {
                    var codes = $.map(d.data, function (e) { return e.FMP_CODE; });
                    gridModal.show({
                        modaltitle: gridstrings.failures[lang].title,
                        listurl: "/Api/ApiFailures/List",
                        keyfield: "FAL_CODE",
                        codefield: "FAL_CODE",
                        textfield: "FAL_DESC",
                        returninput: "#failure",
                        columns: [
                            { type: "string", field: "FAL_CODE", title: gridstrings.failures[lang].code, width: 100 },
                            { type: "string", field: "FAL_DESC", title: gridstrings.failures[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "FAL_ACTIVE", value: "+", operator: "eq" },
                            { field: "FAL_CODE", value: "*", operator: "neq" },
                            { field: "FAL_CODE", value: codes, operator: "in" }
                        ],
                        callback: function (d) {
                            $("#cause").val("");
                            $("#action").val("");
                            tooltip.hide("#cause");
                            tooltip.hide("#action");
                            $("div.cause-div").addClass("hidden");
                            $("div.action-div").addClass("hidden");
                            $("#causedesc").removeClass("required isempty").removeAttr("required").val("");
                            $("#actiondesc").removeClass("required isempty").removeAttr("required").val("");
                            if (d.FAL_CODE === "DIGER") {
                                $("div.failure-div").removeClass("hidden");
                                $("#failuredesc").attr("required", "required").addClass("required").val("");
                            } else {
                                $("div.failure-div").addClass("hidden");
                                $("#failuredesc").removeClass("required isempty").removeAttr("required").val("");
                            }
                        }
                    });
                });
            });
            $("#btnCause").click(function () {
                return $.when(GetCauseCodes()).done(function (d) {
                    var codes = $.map(d.data, function (e) { return e.FMP_CODE; });
                    gridModal.show({
                        modaltitle: gridstrings.causes[lang].title,
                        listurl: "/Api/ApiCauses/List",
                        keyfield: "CAU_CODE",
                        codefield: "CAU_CODE",
                        textfield: "CAU_DESC",
                        returninput: "#cause",
                        columns: [
                            { type: "string", field: "CAU_CODE", title: gridstrings.causes[lang].code, width: 100 },
                            { type: "string", field: "CAU_DESC", title: gridstrings.causes[lang].desc, width: 300 }
                        ],
                        filter: [
                            { field: "CAU_ACTIVE", value: "+", operator: "eq" },
                            { field: "CAU_CODE", value: "*", operator: "neq" },
                            { field: "CAU_CODE", value: codes, operator: "in" }
                        ],
                        callback: function (d) {
                            $("#action").val("");
                            tooltip.hide("#action");
                            $("div.action-div").addClass("hidden");
                            $("#actiondesc").removeClass("required isempty").removeAttr("required").val("");
                            if (d.CAU_CODE === "DIGER") {
                                $("div.cause-div").removeClass("hidden");
                                $("#causedesc").attr("required", "required").addClass("required").val("");
                            } else {
                                $("div.cause-div").addClass("hidden");
                                $("#causedesc").removeClass("required isempty").removeAttr("required").val("");
                            }
                        }
                    });
                });
            });
            $("#btnAction").click(function () {
                return $.when(GetActionCodes()).done(function (d) {
                    var codes = $.map(d.data, function (e) { return e.FMP_CODE; });
                    gridModal.show({
                        modaltitle: gridstrings.actions[lang].title,
                        listurl: "/Api/ApiActions/List",
                        keyfield: "ACT_CODE",
                        codefield: "ACT_CODE",
                        textfield: "ACT_DESC",
                        returninput: "#action",
                        columns: [
                            { type: "string", field: "ACT_CODE", title: gridstrings.actions[lang].code, width: 100 },
                            { type: "string", field: "ACT_DESC", title: gridstrings.actions[lang].desc, width: 300 }
                        ],
                        filter: [
                            { field: "ACT_ACTIVE", value: "+", operator: "eq" },
                            { field: "ACT_CODE", value: "*", operator: "neq" },
                            { field: "ACT_CODE", value: codes, operator: "in" }
                        ],
                        callback: function (d) {
                            if (d.ACT_CODE === "DIGER") {
                                $("div.action-div").removeClass("hidden");
                                $("#actiondesc").attr("required", "required").addClass("required").val("");
                            } else {
                                $("div.action-div").addClass("hidden");
                                $("#actiondesc").removeClass("required isempty").removeAttr("required").val("");
                            }
                        }
                    });
                });
            });
            $("#failure").autocomp({
                listurl: "/Api/ApiFailures/List",
                geturl: "/Api/ApiFailures/Get",
                field: "FAL_CODE",
                textfield: "FAL_DESC",
                active: "FAL_ACTIVE",
                beforeAjaxFilter: function () {
                    var $d = $.Deferred();
                    $.when(GetFailureCodes()).done(function (d) {
                        var codes = $.map(d.data, function (e) { return e.FMP_CODE; });
                        $d.resolve([{ field: "FAL_CODE", value: codes, operator: "in" }]);
                    });
                    return $d.promise();
                },
                filter: [{ field: "FAL_CODE", value: "*", operator: "neq" }],
                callback: function (d) {
                    $("#cause").val("");
                    $("#action").val("");
                    $("div.cause-div").addClass("hidden");
                    $("div.action-div").addClass("hidden");
                    $("#causedesc").removeClass("required isempty").removeAttr("required").val("");
                    $("#actiondesc").removeClass("required isempty").removeAttr("required").val("");

                    if (d && d.FAL_CODE === "DIGER") {
                        $("div.failure-div").removeClass("hidden");
                        $("#failuredesc").attr("required", "required").addClass("required").val("");
                    } else {
                        $("div.failure-div").addClass("hidden");
                        $("#failuredesc").removeClass("required isempty").removeAttr("required").val("");
                    }
                }
            });
            $("#cause").autocomp({
                listurl: "/Api/ApiCauses/List",
                geturl: "/Api/ApiCauses/Get",
                field: "CAU_CODE",
                textfield: "CAU_DESC",
                active: "CAU_ACTIVE",
                beforeAjaxFilter: function () {
                    var $d = $.Deferred();
                    $.when(GetCauseCodes()).done(function (d) {
                        var codes = $.map(d.data, function (e) { return e.FMP_CODE; });
                        $d.resolve([{ field: "CAU_CODE", value: codes, operator: "in" }]);
                    });
                    return $d.promise();
                },
                filter: [
                    { field: "CAU_FAILURE", relfield: "#failure", includeall: true },
                    { field: "CAU_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    $("#action").val("");
                    $("div.action-div").addClass("hidden");
                    $("#actiondesc").removeClass("required isempty").removeAttr("required").val("");
                    if (d && d.CAU_CODE === "DIGER") {
                        $("div.cause-div").removeClass("hidden");
                        $("#causedesc").attr("required", "required").addClass("required").val("");
                    } else {
                        $("div.cause-div").addClass("hidden");
                        $("#causedesc").removeClass("required isempty").removeAttr("required").val("");
                    }
                }
            });
            $("#action").autocomp({
                listurl: "/Api/ApiActions/List",
                geturl: "/Api/ApiActions/Get",
                field: "ACT_CODE",
                textfield: "ACT_DESC",
                active: "ACT_ACTIVE",
                beforeAjaxFilter: function () {
                    var $d = $.Deferred();
                    $.when(GetActionCodes()).done(function (d) {
                        var codes = $.map(d.data, function (e) { return e.FMP_CODE; });
                        $d.resolve([{ field: "ACT_CODE", value: codes, operator: "in" }]);
                    });
                    return $d.promise();
                },
                filter: [
                    { field: "ACT_CAUSE", relfield: "#cause", includeall: true },
                    { field: "ACT_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d && d.ACT_CODE === "DIGER") {
                        $("div.action-div").removeClass("hidden");
                        $("#actiondesc").attr("required", "required").addClass("required").val("");
                    } else {
                        $("div.action-div").addClass("hidden");
                        $("#actiondesc").removeClass("required isempty").removeAttr("required").val("");
                    }
                }
            });
        };
        RegisterTabEvents();
    };
    var tu = new function () {
        var self = this;
        var grdToolUsage = $("#grdToolUsage");
        var grdToolUsage = null;
        var selectedtoolusage = null;

        var CalculateExch = function () {
            var curr = $("#toolusagecurr").val();
            var date = moment();
            if (!curr)
                return $.Deferred().reject();

            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: orgrecord.ORG_CURRENCY,
                CRR_STARTDATE: moment.utc(date, constants.dateformat)
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch)
            });
        };
        var FillUserInterface = function () {
            tms.UnBlock("#toolusageform");
            tms.BeforeFill("#toolusage");

            $("#toolusageactivity").val(selectedtoolusage.TOU_ACTIVITY);
            $("#toolusagetool").val(selectedtoolusage.TOU_TOOL);
            $("#toolusagedate").val(moment(selectedtoolusage.TOU_PLANDATE).format(constants.dateformat));
            $("#toolusageperiod").val(parseFloat(selectedtoolusage.TOU_PERIOD).fixed(constants.qtydecimals));
            $("#toolusageunitprice").val(parseFloat(selectedtoolusage.TOU_UNITPRICE).fixed(constants.pricedecimals));
            $("#toolusagecurr,#toolusagetotalcurr").val(selectedtoolusage.TOU_CURR);
            $("#toolusagechargingperiod")
                .val(applicationstrings[lang].chargingperiods[selectedtoolusage.TOU_CHARGINGPERIOD]);
            $("#toolusagetotal").val(parseFloat(selectedtoolusage.TOU_TOTAL).fixed(constants.pricedecimals));
            $("#toolusageexch").val(parseFloat(selectedtoolusage.TOU_EXCH).fixed(constants.exchdecimals));

            tooltip.show("#toolusageactivity", selectedtoolusage.TOU_ACTIVITYDESC);
            tooltip.show("#toolusagetool", selectedtoolusage.TOU_TOOLDESC);
            tooltip.show("#toolusagecurr,#toolusagetotalcurr", selectedtoolusage.TOU_CURRDESC);

            if (pstat === "C") tms.Block("#toolusageform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiToolUsage/Get",
                data: JSON.stringify(selectedtoolusage.TOU_ID),
                fn: function (d) {
                    selectedtoolusage = d.data;
                    FillUserInterface();
                }
            });
        };
        var CalculateTotal = function () {
            var v_toolusageunitprice = $("#toolusageunitprice").val();
            var v_toolusageperiod = $("#toolusageperiod").val();
            if (v_toolusageunitprice && v_toolusageperiod) {
                var total = (parseFloat(v_toolusageunitprice) * parseFloat(v_toolusageperiod));
                return total;
            }
        };
        var itemSelect = function (row) {
            selectedtoolusage = grdToolUsage.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };

        this.Save = function () {
            if (!tms.Check("#toolusage"))
                return $.Deferred().reject();

            var toolusage = {
                TOU_ID: selectedtoolusage ? selectedtoolusage.TOU_ID : 0,
                TOU_TASK: task.TSK_ID,
                TOU_ACTIVITY: $("#toolusageactivity").val(),
                TOU_DATE: moment.utc($("#toolusagedate").val(), constants.dateformat),
                TOU_TOOL: $("#toolusagetool").val(),
                TOU_PERIOD: parseFloat($("#toolusageperiod").val()),
                TOU_UNITPRICE: parseFloat($("#toolusageunitprice").val()),
                TOU_CURR: $("#toolusagecurr").val(),
                TOU_EXCH: parseFloat($("#toolusageexch").val()),
                TOU_TOTAL: CalculateTotal(),
                TOU_CREATED: selectedtoolusage != null ? selectedtoolusage.TOU_CREATED : tms.Now(),
                TOU_CREATEDBY: selectedtoolusage != null ? selectedtoolusage.TOU_CREATEDBY : user,
                TOU_UPDATED: selectedtoolusage != null ? tms.Now() : null,
                TOU_UPDATEDBY: selectedtoolusage != null ? user : null,
                TOU_RECORDVERSION: selectedtoolusage != null ? selectedtoolusage.TOU_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiToolUsage/Save",
                data: JSON.stringify(toolusage),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedtoolusage) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiToolUsage/DelRec",
                            data: JSON.stringify(selectedtoolusage.TOU_ID),
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
            selectedtoolusage = null;
            tms.Reset("#toolusage");

            $("#toolusageactivity").val("");
            $("#toolusagetool").val("");
            $("#toolusagedate").val(tms.Now().format(constants.dateformat));
            $("#toolusageperiod").val("");
            $("#toolusageexch").val("");
            $("#toolusagechargingperiod").val("");
            $("#toolusageunitprice").val("");
            $("#toolusagecurr, #toolusagetotalcurr").val("");
            $("#toolusagetotal").val("");

            tooltip.hide("#toolusageactivity");
            tooltip.hide("#toolusagecurr,#toolusagetotalcurr");

            if (orgrecord) {
                $("#toolusagecurr,#toolusagetotalcurr").val(orgrecord.ORG_CURRENCY);
                tooltip.show("#toolusagecurr,#toolusagetotalcurr", orgrecord.ORG_CURRENCYDESC);
            }
        };

        this.List = function () {
            var grdFilter = [{ field: "TOU_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
            if (grdToolUsage) {
                grdToolUsage.ClearSelection();
                grdToolUsage.RunFilter(grdFilter);
            } else {
                grdToolUsage = new Grid({
                    keyfield: "TOU_ID",
                    columns: [
                        {
                            type: "number",
                            field: "TOU_ACTIVITY",
                            title: gridstrings.toolusage[lang].activity,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TOU_ACTIVITYDESC",
                            title: gridstrings.toolusage[lang].activitydesc,
                            width: 350
                        },
                        {
                            type: "date",
                            field: "TOU_DATE",
                            title: gridstrings.toolusage[lang].date,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TOU_TOOL",
                            title: gridstrings.toolusage[lang].tool,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TOU_TOOLDESC",
                            title: gridstrings.toolusage[lang].tooldesc,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "TOU_PERIOD",
                            title: gridstrings.toolusage[lang].period,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "TOU_UNITPRICE",
                            title: gridstrings.toolusage[lang].unitprice,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TOU_CURR",
                            title: gridstrings.toolusage[lang].curr,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "TOU_EXCH",
                            title: gridstrings.toolusage[lang].exch,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "TOU_TOTAL",
                            title: gridstrings.toolusage[lang].total,
                            width: 150
                        }
                    ],
                    datasource: "/Api/ApiToolUsage/List",
                    selector: "#grdToolUsage",
                    name: "grdToolUsage",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "TOU_ID", dir: "desc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"toolusage.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            };
        };
        var RgstrTabEvents = function () {
            $("#btnSaveToolUsage").click(self.Save);
            $("#btnAddToolUsage").click(self.ResetUI);
            $("#btnDeleteToolUsage").click(self.Delete);

            $("#btntoolusageactivity").on("click",
                function () {
                    gridModal.show({
                        modaltitle: gridstrings.taskactivities[lang].title,
                        listurl: "/Api/ApiTaskActivities/List",
                        keyfield: "TSA_ID",
                        codefield: "TSA_LINE",
                        textfield: "TSA_DESC",
                        returninput: "#toolusageactivity",
                        columns: [
                            {
                                type: "string",
                                field: "TSA_LINE",
                                title: gridstrings.taskactivities[lang].line,
                                width: 100
                            },
                            {
                                type: "string",
                                field: "TSA_DESC",
                                title: gridstrings.taskactivities[lang].description,
                                width: 300
                            },
                            {
                                type: "string",
                                field: "TSA_ASSIGNEDTO",
                                title: gridstrings.taskactivities[lang].assignedto,
                                width: 300
                            },
                            {
                                type: "string",
                                field: "TSA_TRADE",
                                title: gridstrings.taskactivities[lang].trade,
                                width: 200
                            }
                        ],
                        filter: [
                            { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" }
                        ]
                    });
                });
            $("#toolusageactivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                termisnumeric: true,
                filter: [
                    { field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" }
                ]
            });
            $("#btntoolusagetool").on("click",
                function () {
                    gridModal.show({
                        modaltitle: gridstrings.tools[lang].title,
                        listurl: "/Api/ApiTools/List",
                        keyfield: "TOO_CODE",
                        codefield: "TOO_CODE",
                        textfield: "TOO_DESCRIPTION",
                        returninput: "#toolusagetool",
                        columns: [
                            {
                                type: "string",
                                field: "TOO_CODE",
                                title: gridstrings.tools[lang].code,
                                width: 100
                            },
                            {
                                type: "string",
                                field: "TOO_DESCRIPTION",
                                title: gridstrings.tools[lang].description,
                                width: 300
                            }
                        ],
                        filter: [{ field: "TOO_ACTIVE", value: "+", operator: "eq" }],
                        callback: function (d) {
                            tooltip.hide("#toolusagetool");

                            $("#toolusagetool").val((d ? d.TOO_CODE : ""));
                            $("#toolusageunitprice").val(d ? d.TOO_UNITPRICE.fixed(constants.pricedecimals) : "");
                            $("#toolusagecurr, #toolusagetotalcurr").val(d ? d.TOO_CURRENCY : "");
                            $("#toolusagechargingperiod")
                                .val(d ? applicationstrings[lang].chargingperiods[d.TOO_CHARGINGPERIOD] : "");
                            if (d)
                                tooltip.show("#toolusagetool", d.TOO_DESCRIPTION);
                            var v = CalculateTotal();
                            if (v)
                                $("#toolusagetotal").val(v.fixed(constants.pricedecimals));

                            $.when(CalculateExch()).done(function (d) {
                                if (d.data) {
                                    $("#toolusageexch")
                                        .val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                                } else {
                                    $("#toolusageexch").val("");
                                }
                            });
                        }
                    });
                });
            $("#toolusagetool").autocomp({
                listurl: "/Api/ApiTools/List",
                geturl: "/Api/ApiTools/Get",
                field: "TOU_CODE",
                textfield: "TOU_DESCRIPTION",
                filter: [
                    { field: "TOU_ACTIVE", value: "+", operator: "eq" }
                ],
                callback: function (d) {
                    tooltip.hide("#toolusagetool");

                    $("#toolusagetool").val((d ? d.TOO_CODE : ""));
                    $("#toolusageunitprice").val(d ? d.TOO_UNITPRICE.fixed(constants.pricedecimals) : "");
                    $("#toolusagecurr, #toolusagetotalcurr").val(d ? d.TOO_CURRENCY : "");
                    $("#toolusagechargingperiod").val(d
                        ? applicationstrings[lang].chargingperiods[d.TOO_CHARGINGPERIOD]
                        : "");
                    if (d)
                        tooltip.show("#toolusagetool", d.TOO_DESCRIPTION);
                    var v = CalculateTotal();
                    if (v)
                        $("#toolusagetotal").val(v.fixed(constants.pricedecimals));

                    $.when(CalculateExch()).done(function (d) {
                        if (d.data) {
                            $("#toolusageexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                        } else {
                            $("#toolusageexch").val("");
                        }
                    });
                }
            });
            $("#toolusageform input[calc-group=\"1\"]").on("change",
                function () {
                    $.when(CalculateExch()).done(function (d) {
                        if (d.data) {
                            $("#toolusageexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                            var total = CalculateTotal();
                            $("#toolusagetotal").val(total.fixed(constants.pricedecimals));
                        } else {
                            $("#toolusageexch").val("");
                            $("#toolusagetotal").val("");
                        }
                    });
                });
        }
        RgstrTabEvents();
    };
    var cfunc = new function () {
        var self = this;

        this.DoTypeSpecificCustomisation = function () {
            var tmptype = $("#type").val();
            switch (tmptype) {
                default:
                    break;
            }
        };
    };
    var pt = new function () {
        var $grdIssueReturn = $("#grdIssueReturn");
        var grdIssueReturn = null;
        var self = this;

        var GetContractPartPrice = function (part) {
            var gridreq = {
                sort: [{ field: "CPP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetPartPriceForTask", value: task.TSK_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }

        var itemSelect = function (row) {
            selectedissuereturn = grdIssueReturn.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.Save = function () {
            if (!tms.Check("#parts"))
                return $.Deferred().reject();

            var issuereturn = {
                Transaction: {
                    PTR_DESCRIPTION: task.TSK_SHORTDESC,
                    PTR_TYPE: $("#trxtype").val(),
                    PTR_ORGANIZATION: task.TSK_ORGANIZATION,
                    PTR_TRANSACTIONDATE: tms.Now(),
                    PTR_WAREHOUSE: $("#warehouse").val(),
                    PTR_STATUS: "N",
                    PTR_CREATED: tms.Now(),
                    PTR_CREATEDBY: user
                },
                TransactionLines: [
                    {
                        PTL_TRANSACTIONDATE: tms.Now(),
                        PTL_PART: $("#part").data("id"),
                        PTL_PARTREFERENCE: ($("#partreference").val() || null),
                        PTL_TYPE: $("#trxtype").val(),
                        PTL_TASK: task.TSK_ID,
                        PTL_ACTIVITY: $("#iractivity").val(),
                        PTL_WAREHOUSE: $("#warehouse").val(),
                        PTL_BIN: $("#bin").val(),
                        PTL_QTY: $("#reqqty").val(),
                        PTL_PRICE: $("#bin").data("avgprice"),
                        PTL_CREATED: tms.Now(),
                        PTL_CREATEDBY: user
                    }
                ]
            };

            return tms.Ajax({
                url: "/Api/ApiIssueReturn/Save",
                data: JSON.stringify(issuereturn),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.ResetUI = function () {
            selectedissuereturn = null;
            tms.UnBlock("#partsform");
            tms.Reset("#parts");

            $("#activity").val("");
            $("#trxtype").val("");
            $("#warehouse").val("");
            $("#part").val("").data("id", null);
            $("#partdesc").val("");
            $("#partuom").val("");
            $("#partreference").val("");
            $("#bin").val("");
            $("#bin").data("avgprice", null);
            $("#binpartprice").val("");
            $("#binqty").val("");
            $("#reqqty").val("");

            if (pstat === "C") tms.Block("#partsform");
        };
        this.List = function () {
            var grdFilter = [{ field: "PTL_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
            if (grdIssueReturn) {
                grdIssueReturn.ClearSelection();
                grdIssueReturn.RunFilter(grdFilter);
            } else {
                var grdcols = [
                    {
                        type: "number",
                        field: "PTL_TRANSACTION",
                        title: gridstrings.PartTransactionLines[lang].transaction,
                        width: 150
                    },
                    {
                        type: "number",
                        field: "PTL_LINE",
                        title: gridstrings.PartTransactionLines[lang].line,
                        width: 150
                    },
                    {
                        type: "number",
                        field: "PTL_ACTIVITY",
                        title: gridstrings.PartTransactionLines[lang].activity,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_PARTCODE",
                        title: gridstrings.PartTransactionLines[lang].partcode,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_PARTDESC",
                        title: gridstrings.PartTransactionLines[lang].partdesc,
                        width: 350
                    },
                    {
                        type: "string",
                        field: "PTL_PARTREFERENCE",
                        title: gridstrings.PartTransactionLines[lang].partreference,
                        width: 350
                    },
                    {
                        type: "qty",
                        field: "PTL_QTY",
                        title: gridstrings.PartTransactionLines[lang].quantity,
                        width: 150,
                        template: "<span>#= PTL_TYPE == 'RT' ? -1 * PTL_QTY : PTL_QTY #</span>"
                    },
                    {
                        type: "na",
                        field: "TYPEDESC",
                        title: gridstrings.PartTransactionLines[lang].typedesc,
                        template: "<div>#= gridstrings.PartTransactionLines[lang].types[PTL_TYPE] #</div>",
                        filterable: false,
                        sortable: false,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_WAREHOUSE",
                        title: gridstrings.PartTransactionLines[lang].warehouse,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_WAREHOUSEDESC",
                        title: gridstrings.PartTransactionLines[lang].warehousedesc,
                        width: 250
                    },
                    { type: "string", field: "PTL_BIN", title: gridstrings.PartTransactionLines[lang].bin, width: 150 },
                    {
                        type: "string",
                        field: "PTL_BINDESC",
                        title: gridstrings.PartTransactionLines[lang].bindesc,
                        width: 250
                    },
                    {
                        type: "date",
                        field: "PTL_TRANSACTIONDATE",
                        title: gridstrings.PartTransactionLines[lang].transactiondate,
                        width: 150
                    }
                ];

                var grdfields = {
                    PTL_TRANSACTION: { type: "number" },
                    PTL_LINE: { type: "number" },
                    PTL_ACTIVITY: { type: "number" },
                    PTL_QTY: { type: "number" },
                    PTL_TRANSACTIONDATE: { type: "date" }
                };

                if (!customer) {
                    grdfields.PTL_PRICE = { type: "number" };
                    grdcols.splice(6,
                        0,
                        {
                            type: "price",
                            field: "PTL_PRICE",
                            title: gridstrings.PartTransactionLines[lang].price,
                            width: 150
                        });
                }

                grdIssueReturn = new Grid({
                    keyfield: "PTL_ID",
                    columns: grdcols,
                    fields: grdfields,
                    datasource: "/Api/ApiPartTransactionLine/List",
                    selector: "#grdIssueReturn",
                    name: "grdIssueReturn",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "PTL_ID", dir: "asc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"IssueReturn.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };

        var ChildBuilder = function (parent, list) {
            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                if (!parent.subs) {
                    parent.subs = [];
                }
                parent.subs.push(child);
                ChildBuilder(child, list);
            }
        };
        var GenerateTreeData = function (d) {
            var data = [];
            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    title: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    subs: []
                };
                ChildBuilder(parent, d);
                data.push(parent);
            }
            return data;
        };
        var GetLevels = function () {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: "PART", operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq)
            });
        };

        var RegisterTabEvents = function () {
            $("#btnIRActivity").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_ID",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#iractivity",
                    columns: [
                        {
                            type: "string",
                            field: "TSA_LINE",
                            title: gridstrings.taskactivities[lang].line,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 100
                        }
                    ],
                    filter: [
                        { field: "TSA_TASK", value: task.TSK_ID, operator: "eq" }
                    ]
                });
            });
            $("#btnwarehouse").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.warehouses[lang].title,
                    listurl: "/Api/ApiWarehouses/List",
                    keyfield: "WAH_CODE",
                    codefield: "WAH_CODE",
                    textfield: "WAH_DESC",
                    returninput: "#warehouse",
                    columns: [
                        { type: "string", field: "WAH_CODE", title: gridstrings.warehouses[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "WAH_DESC",
                            title: gridstrings.warehouses[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                        { field: "WAH_ORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in", logic: "or" },
                        { field: "WAH_PUBLIC", value: "+", operator: "eq", logic: "or" }                    ],
                    callback: function () {
                        $("#part").val("").data("id", null);
                        $("#partdesc").val("");
                        $("#partuom").val("");
                        $("#bin").val("");
                        $("#binqty").val("");
                        $("#binpartprice").val("");
                    }
                });
            });
            $("#btnparts").click(function() {
                gridModal.show({
                    modaltitle: gridstrings.partstock[lang].title,
                    modalinfo: applicationstrings[lang].partmodalinfo,
                    listurl: "/Api/ApiWarehouses/StockByWarehouse",
                    keyfield: "STK_PART",
                    codefield: "STK_PARTCODE",
                    textfield: "STK_PARTDESC",
                    returninput: "#part",
                    columns: [
                        {
                            type: "string",
                            field: "STK_PARTCODE",
                            title: gridstrings.partstock[lang].parcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "STK_PARTDESC",
                            title: gridstrings.partstock[lang].pardesc,
                            width: 300
                        },
                        {
                            type: "number",
                            field: "STK_WHQTY",
                            title: gridstrings.partstock[lang].parqty,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "STK_PARTUOM",
                            title: gridstrings.partstock[lang].paruom,
                            width: 100
                        }
                    ],
                    fields: {
                        STK_WHQTY: { type: "number" }
                    },
                    filter: [
                        { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                        { field: "STK_PARTORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "IsContractedTaskPart", value: task.TSK_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                                { field: "STK_PARTORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                                { field: "IsContractedTaskPart", value: task.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.parts[lang].allparts,
                            filter: [
                                { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                                { field: "STK_PARTORG", value: [task.TSK_ORGANIZATION, "*"], operator: "in" },
                            ]
                        }
                    ],
                    treefilter: function(id, callback) {
                        $.when(GetLevels()).done(function(d) {
                            var data = GenerateTreeData(d.data);
                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function(selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [
                                            {
                                                field:"PARTLEVEL.STKPART",
                                                value: selectedItem.id,
                                                operator: "func"
                                            }
                                        ];
                                        callback(filter);
                                    }
                                }
                            });
                        });
                    },
                    callback: function(d) {
                        tooltip.hide("#part");
                        $("#part").data("id", (d ? d.STK_PART : null));
                        $("#partdesc").val((d ? d.STK_PARTDESC : ""));
                        $("#partuom").val((d ? d.STK_PARTUOM : ""));
                        $("#bin").val("");
                        $("#binqty").val("");
                        $("#binpartprice").val("");
                        return $.when(GetContractPartPrice(d.STK_PART)).done(function(p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#partreference").val(r.CPP_REFERENCE);
                            }
                        });
                    }
                });
            });
            $("#btnbin").click(function() {
                var trxtype = $("#trxtype").val();
                var partid = $("#part").data("id");
                var warehouse = $("#warehouse").val();
                if (!trxtype) {
                    msgs.error(applicationstrings[lang].trxtype);
                    return false;
                }
                if (!warehouse) {
                    msgs.error(applicationstrings[lang].selectawarehouse);
                    return false;
                }
                if (!partid) {
                    msgs.error(applicationstrings[lang].selectapart);
                    return false;
                }
                switch (trxtype) {
                case "I":
                    gridModal.show({
                        modaltitle: gridstrings.bins[lang].title,
                        listurl: "/Api/ApiStock/List",
                        keyfield: "STK_BIN",
                        codefield: "STK_BIN",
                        textfield: "STK_BINDESC",
                        returninput: "#bin",
                        columns: [
                            { type: "string", field: "STK_BIN", title: gridstrings.bins[lang].code, width: 100 },
                            { type: "string", field: "STK_BINDESC", title: gridstrings.bins[lang].desc, width: 300 }
                        ],
                        filter: [
                            { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                            { field: "STK_PART", value: $("#part").data("id"), operator: "eq" }
                        ],
                        callback: function(d) {
                            $("#binqty").val(d.STK_QTY);
                            $("#bin").data("avgprice", d.STK_AVGPRICE);
                            $("#binpartprice").val(d.STK_AVGPRICE.fixed(constants.pricedecimals) +
                                " " +
                                orgrecord.ORG_CURRENCY);
                        }
                    });
                    break;
                case "RT":
                    gridModal.show({
                        modaltitle: gridstrings.bins[lang].title,
                        listurl: "/Api/ApiBins/List",
                        keyfield: "BIN_CODE",
                        codefield: "BIN_CODE",
                        textfield: "BIN_DESC",
                        returninput: "#bin",
                        columns: [
                            { type: "string", field: "BIN_CODE", title: gridstrings.bins[lang].code, width: 100 },
                            { type: "string", field: "BIN_DESC", title: gridstrings.bins[lang].desc, width: 300 }
                        ],
                        filter: [
                            { field: "BIN_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" }
                        ],
                        callback: function(d) {
                            var f = {
                                filter: {
                                    filters: [
                                        { field: "STK_WAREHOUSE", value: d.BIN_WAREHOUSE, operator: "eq" },
                                        { field: "STK_BIN", value: d.BIN_CODE, operator: "eq" },
                                        { field: "STK_PART", value: $("#part").data("id"), operator: "eq" }
                                    ]
                                }
                            };
                            return $.when(tms.Ajax({
                                url: "/Api/ApiStock/List",
                                data: JSON.stringify(f)
                            })).done(function(d1) {
                                var stockvalue = ((d1.data && d1.data.length > 0) ? d1.data[0] : null);
                                $("#binqty").val(stockvalue ? stockvalue.STK_QTY : 0);
                                $("#bin").data("avgprice", stockvalue ? stockvalue.STK_AVGPRICE : 0);
                                var partpricestr =
                                    (stockvalue
                                            ? stockvalue.STK_AVGPRICE.fixed(constants.pricedecimals)
                                            : (0).fixed(constants.pricedecimals)) +
                                        " " +
                                        orgrecord.ORG_CURRENCY;
                                $("#binpartprice").val(partpricestr);
                            });
                        }
                    });
                    break;
                }
            });
            $("#iractivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function() { return task.TSK_ID; }, operator: "eq" }]
            });
            $("#warehouse").autocomp({
                listurl: "/Api/ApiWarehouses/List",
                geturl: "/Api/ApiWarehouses/Get",
                field: "WAH_CODE",
                textfield: "WAH_DESC",
                active: "WAH_ACTIVE",
                filter: [
                    { field: "WAH_ORG", func: function () { return [task.TSK_ORGANIZATION, "*"]; }, operator: "in", logic: "or" },
                    { field: "WAH_PUBLIC", value: "+", operator: "eq", logic: "or" }
                ],
                callback: function() {
                    $("#part").val("").data("id", null);
                    $("#partdesc").val("");
                    $("#partuom").val("");
                    $("#bin").val("");
                    $("#binqty").val("");
                    $("#binpartprice").val("");
                }
            });
            $("#trxtype").on("change", function() {
                    $("#bin").val("");
                    $("#binqty").val("");
                    $("#binpartprice").val("");
                    tooltip.hide("#bin");
                });
            $("#btnSaveIssueReturn").click(self.Save);
            $("#btnAddIssueReturn").click(self.ResetUI);
        };
        RegisterTabEvents();
    };
    var mr = new function () {
        var $grdMeterReadings = $("#grdMeterReadings");
        var grdMeterReadings = null;
        var self = this;

        var FillUserInterface = function () {
            tms.UnBlock("#meterreadingsform");
            tms.BeforeFill("#meterreadings");

            $("#btnSaveMeterReading").prop("disabled", true);
            $("#mractivity").val(selectedmeterreading.REA_ACTIVITY);
            $("#meterreadingdate").val(moment(selectedmeterreading.REA_DATE).format(constants.dateformat));
            $("#mractive").val(selectedmeterreading.REA_ACTIVE);
            $("#mrinductive").val(selectedmeterreading.REA_INDUCTIVE);
            $("#mrcapacitive").val(selectedmeterreading.REA_CAPACITIVE);

            tooltip.show("#mractivity", selectedmeterreading.REA_ACTIVITYDESC);

            if (pstat === "C") tms.Block("#meterreadingsform");
        };
        var LoadSelected = function () {
            tms.Ajax({
                url: "/Api/ApiMeterReadings/Get",
                data: JSON.stringify(selectedmeterreading.REA_ID),
                fn: function (d) {
                    selectedmeterreading = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selectedmeterreading = grdMeterReadings.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.ResetUI = function () {
            selectedmeterreading = null;

            tms.UnBlock("#meterreadingsform");
            tms.Reset("#meterreadings");

            $("#btnSaveMeterReading").prop("disabled", false);

            $("#mractivity").val("");
            $("#meterreadingdate").val(tms.Now().format(constants.dateformat));
            $("#mractive").val("");
            $("#mrinductive").val("");
            $("#mrcapacitive").val("");

            tooltip.hide("#mractivity");

            if (pstat === "C") tms.Block("#meterreadingsform");
        };
        this.List = function () {
            var grdFilter = [{ field: "REA_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];
            if (grdMeterReadings) {
                grdMeterReadings.ClearSelection();
                grdMeterReadings.RunFilter(grdFilter);
            } else {
                grdMeterReadings = new Grid({
                    keyfield: "REA_ID",
                    columns: [
                        {
                            type: "number",
                            field: "REA_ACTIVITY",
                            title: gridstrings.meterreadings[lang].activity,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "date",
                            field: "REA_DATE",
                            title: gridstrings.meterreadings[lang].date,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "number",
                            field: "REA_ACTIVE",
                            title: gridstrings.meterreadings[lang].active,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "number",
                            field: "REA_INDUCTIVE",
                            title: gridstrings.meterreadings[lang].inductive,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "number",
                            field: "REA_CAPACITIVE",
                            title: gridstrings.meterreadings[lang].capacitive,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "number",
                            field: "REA_R1",
                            title: gridstrings.meterreadings[lang].r1,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "number",
                            field: "REA_R2",
                            title: gridstrings.meterreadings[lang].r2,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "datetime",
                            field: "REA_CREATED",
                            title: gridstrings.meterreadings[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REA_CREATEDBY",
                            title: gridstrings.meterreadings[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "REA_UPDATED",
                            title: gridstrings.meterreadings[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REA_UPDATEDBY",
                            title: gridstrings.meterreadings[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        REA_ACTIVITY: { type: "number" },
                        REA_DATE: { type: "date" },
                        REA_ACTIVE: { type: "number" },
                        REA_INDUCTIVE: { type: "number" },
                        REA_CAPACITIVE: { type: "number" },
                        REA_R1: { type: "number" },
                        REA_R2: { type: "number" },
                        REA_CREATED: { type: "date" },
                        REA_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiMeterReadings/List",
                    selector: "#grdMeterReadings",
                    name: "grdMeterReadings",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "REA_DATE", dir: "desc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"MeterReadings.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#meterreadings"))
                return $.Deferred().reject();

            var mr = {
                REA_ID: selectedmeterreading ? selectedmeterreading.REA_ID : 0,
                REA_TASK: task.TSK_ID,
                REA_ACTIVITY: $("#mractivity").val(),
                REA_DATE: moment.utc($("#meterreadingdate").val(), constants.dateformat),
                REA_ACTIVE: parseFloat($("#mractive").val()),
                REA_INDUCTIVE: parseFloat($("#mrinductive").val()),
                REA_CAPACITIVE: parseFloat($("#mrcapacitive").val()),
                REA_CREATED: selectedmeterreading != null ? selectedmeterreading.REA_CREATED : tms.Now(),
                REA_CREATEDBY: selectedmeterreading != null ? selectedmeterreading.REA_CREATEDBY : user,
                REA_UPDATED: selectedmeterreading != null ? tms.Now() : null,
                REA_UPDATEDBY: selectedmeterreading != null ? user : null,
                REA_RECORDVERSION: selectedmeterreading != null ? selectedmeterreading.REA_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiMeterReadings/Save",
                data: JSON.stringify(mr),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedmeterreading) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiMeterReadings/DelRec",
                            data: JSON.stringify(selectedmeterreading.REA_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var RegisterTabEvents = function () {
            $("#btnSaveMeterReading").click(self.Save);
            $("#btnAddMeterReading").click(self.ResetUI);
            $("#btnDeleteMeterReading").click(self.Delete);

            $("#btnmractivity").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_ID",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#mractivity",
                    columns: [
                        {
                            type: "string",
                            field: "TSA_LINE",
                            title: gridstrings.taskactivities[lang].line,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 100
                        }
                    ],
                    filter: [{ field: "TSA_TASK", value: task.TSK_ID, operator: "eq" }]
                });
            });
            $("#mractivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" }]
            });
        };
        RegisterTabEvents();
    };
    var pp = new function () {
        var cost = 0;
        var calculated = 0;
        var self = this;

        var RowValues = function (row) {

            // Quantities
            var fqtye = row.find("input[field-id=\"fqty\"]");
            var eqtye = row.find("input[field-id=\"eqty\"]");
            var lqtye = row.find("input[field-id=\"lqty\"]");
            var fqtyv = parseFloat(fqtye.val());
            var eqtyv = parseFloat(eqtye.val() || "0");

            // Prices
            var funitpricee = row.find("input[field-id=\"funitprice\"]");
            var eunitpricee = row.find("input[field-id=\"eunitprice\"]");
            var eunitpriceperce = row.find("input[field-id=\"eunitpricepercent\"]");

            var lunitpricee = row.find("input[field-id=\"lunitprice\"]");
            var funitpricev = parseFloat(funitpricee.val() || "0");
            var eunitpricev = parseFloat(eunitpricee.val() || "0");
            var eunitpricepercv = parseFloat(eunitpriceperce.val() || "0");

            lqtye.css("background-color", eqtyv !== 0 ? "#EC4342" : "");
            lqtye.css("color", eqtyv !== 0 ? "#FFF" : "");
            lqtye.val((fqtyv + eqtyv).fixed(constants.qtydecimals));

            if (eunitpriceperce.attr("edited")) {
                eunitpricev = (funitpricev * eunitpricepercv / 100);
                eunitpricee.val(eunitpricev !== 0 ? eunitpricev.fixed(constants.pricedecimals) : "");
            } else {
                eunitpricepercv = (parseFloat(funitpricev) !== 0 ? (eunitpricev / funitpricev * 100).fixed(2) : 0);
                eunitpriceperce.val(parseFloat(eunitpricepercv) !== 0 ? eunitpricepercv : "");
            }

            lunitpricee.css("background-color", eunitpricev !== 0 ? "#EC4342" : "");
            lunitpricee.css("color", eunitpricev !== 0 ? "#FFF" : "");
            lunitpricee.val((funitpricev + eunitpricev).fixed(constants.qtydecimals));

            var lqtyv = parseFloat(lqtye.val());
            var lunitpricev = parseFloat(lunitpricee.val());

            var totale = row.find("input[field-id=\"total\"]");
            totale.val((lqtyv * lunitpricev).fixed(constants.pricedecimals));
        };
        var CalculateSum = function () {
            var BuildPricingTable = $("#progresspayment table tbody");
            var rows = BuildPricingTable.find("tr[data-linetype]");
            var servicefeesum = 0;
            var hourlyfeesum = 0;
            var partsum = 0;
            var misccostsum = 0;
            var amount = 0;
            var profit = 0;

            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                var totalinp = rowsi.find("input[field-id=\"total\"]");
                amount += parseFloat(totalinp.val());
                switch (rowsi.data("linetype")) {
                    case "SERVICEFEE":
                        servicefeesum += parseFloat(totalinp.val());
                        break;
                    case "HOURLYFEE":
                        hourlyfeesum += parseFloat(totalinp.val());
                        break;
                    case "PART":
                        partsum += parseFloat(totalinp.val());
                        break;
                    case "MISCCOST":
                        misccostsum += parseFloat(totalinp.val());
                        break;
                }
            }

            profit = amount - cost;

            $("#servicesum").text(servicefeesum.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY);
            $("#hourlysum").text(hourlyfeesum.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY);
            $("#partsum").text(partsum.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY);
            $("#misccostsum").text(misccostsum.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY);
            $("#amount").text(amount.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY);
            $("#profit")
                .text(profit.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " " +
                    orgrecord.ORG_CURRENCY +
                    (cost !== 0 ? " (" + Math.round(((profit / cost) * 100) * 100 / 100) + "%)" : ""));
        };
        var CalculateLineValues = function () {
            var BuildPricingTable = $("#progresspayment table tbody");
            var rows = BuildPricingTable.find("tr[data-linetype]");
            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                RowValues(rowsi);
            }
        };
        var BuildPricingTable = function (d) {
            var BuildPricingTable = $("#progresspayment table tbody");
            BuildPricingTable.find("*").remove();
            var strlines = "";
            var lasttskid = 0;
            var lastact = 0;
            var lastrowpositions = [];
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                if (di.PRC_TASK != lasttskid) {
                    if (i !== 0)
                        lastrowpositions.push(i - 1);
                    lasttskid = di.PRC_TASK;
                }
            }

            lasttskid = 0;
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var tskid = di.PRC_TASK;
                var act = di.PRC_ACTLINE;
                var rowspan = "";

                if (tskid != lasttskid && i !== 0) {
                    strlines += "<tr><td style=\"background:#3498db;padding: 2px;\" colspan=\"14\"></td></tr>";
                }

                strlines += "<tr " +
                    " data-id=\"" +
                    di.PRC_ID +
                    "\" data-task=\"" +
                    di.PRC_TASK +
                    "\" data-linetype=\"" +
                    di.PRC_TYPE +
                    "\">";
                if (tskid != lasttskid) {
                    var lines = $.grep(d, function (e) { return e.PRC_TASK === tskid; });
                    rowspan = "rowspan=\"" + lines.length + "\"";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<strong>" + di.PRC_TASK + "</strong>";
                    strlines += "</td>";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<strong>" + di.PRC_TASKDESC + "</strong><br/>";
                    strlines += di.PRC_CUSTOMER + " - " + di.PRC_BRANCH;
                    strlines += "</td>";
                    lasttskid = tskid;
                    lastact = 0;
                }
                if (act != lastact) {
                    var actlines = $.grep(d, function (e) { return e.PRC_TASK === lasttskid && e.PRC_ACTLINE === act; });
                    rowspan = "rowspan=\"" + actlines.length + "\"";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<strong>" + di.PRC_ACTLINE + "</strong>";
                    strlines += "</td>";
                    lastact = act;
                }
                strlines += "<td>";
                strlines += gridstrings.progresspaymentpricing[lang][di.PRC_TYPE];
                strlines += "<br/><strong>" +
                    di.PRC_COST.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " / " +
                    (di.PRC_COST * (di.PRC_TYPE !== "HOURLYFEE" ? di.PRC_QTY : 1)).toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " " +
                    di.PRC_CURR +
                    "</strong>";
                strlines += "</td>";
                strlines += "<td>";
                strlines += di.PRC_TYPEDESC;
                if (di.PRC_TYPE === "PART")
                    strlines += "<br/><strong style=\"color:red\">" +
                        applicationstrings[lang].calcmethod[di.PRC_CALCMETHOD] +
                        "</strong>";
                strlines += "</td>";
                strlines +=
                    "<td><input field-id=\"fqty\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_QTY).fixed(constants.qtydecimals) +
                    "\"/></td>";
                strlines += "<td><input field-id=\"eqty\" disabled=\"disabled\" " +
                    " calc-on-change data-method=\"QTY\" class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PRC_USERQTY ? parseFloat(di.PRC_USERQTY).fixed(constants.qtydecimals) : "") +
                    "\"></td>";
                strlines +=
                    "<td><input field-id=\"lqty\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_QTY).fixed(constants.qtydecimals) +
                    "\"/></td>";
                strlines += "<td><input class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    di.PRC_UOM +
                    "\"/></td>";
                strlines +=
                    "<td><input field-id=\"funitprice\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_UNITPRICE).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines += "<td><input field-id=\"eunitpricepercent\" disabled=\"disabled\"" +
                    " valtype=\"PRICE\" calc-on-change data-method=\"UNITPRICE\" class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PRC_USERUNITPRICE
                        ? parseFloat((di.PRC_USERUNITPRICE / di.PRC_UNITPRICE) * 100).fixed(constants.pricedecimals)
                        : "") +
                    "\"></td>";
                strlines += "<td><input field-id=\"eunitprice\" disabled=\"disabled\"" +
                    " valtype=\"PRICE\" calc-on-change data-method=\"UNITPRICE\" class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PRC_USERUNITPRICE ? parseFloat(di.PRC_USERUNITPRICE).fixed(constants.pricedecimals) : "") +
                    "\"></td>";
                strlines +=
                    "<td><input field-id=\"lunitprice\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_UNITPRICE).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines +=
                    "<td><input field-id=\"total\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_QTY * di.PRC_UNITPRICE).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines += "</tr>";
            }

            BuildPricingTable.append(strlines);
            BuildPricingTable.find("[valtype=\"PRICE\"]").on("change",
                function () {
                    var v = $(this).val();
                    if (v) $(this).val(parseFloat(v).fixed(constants.pricedecimals));
                });
            BuildPricingTable.find("input[calc-on-change]").numericInput({ allowNegative: true, allowFloat: true });
            BuildPricingTable.find("input[calc-on-change]").on("change",
                function () {
                    var $this = $(this);
                    var row = $this.closest("tr");
                    row.find("input[calc-on-change]").removeAttr("edited");
                    $this.attr("edited", "+");
                    RowValues(row);
                    CalculateSum();
                });
        };
        this.List = function () {
            if (task.TSK_ID) {
                return tms.Ajax({
                    url: "/Api/ApiProgressPaymentPricing/ListByTask",
                    data: JSON.stringify(task.TSK_ID),
                    fn: function (d) {
                        calculated = 0;
                        cost = 0;
                        $.each(d.data, function (i, e) { calculated += e.PRC_QTY * e.PRC_UNITPRICE; });
                        $.each(d.data,
                            function (i, e) { cost += (e.PRC_TYPE !== "HOURLYFEE" ? e.PRC_QTY : 1) * e.PRC_COST; });
                        $("#calculated").text(calculated.toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                }) +
                            " " +
                            orgrecord.ORG_CURRENCY);
                        $("#cost").text(cost.toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                }) +
                            " " +
                            orgrecord.ORG_CURRENCY);
                        BuildPricingTable(d.data);
                        CalculateLineValues();
                        CalculateSum();
                    }
                });
            }
        };
    };
    var tsktrx = new function () {
        var self = this;
        var grdTaskTrx = null;
        this.List = function () {
            var grdFilter = [{ field: "TLN_TSK", value: task.TSK_ID, operator: "eq", logic: "and" }];
            if (grdTaskTrx) {
                grdTaskTrx.ClearSelection();
                grdTaskTrx.RunFilter(grdFilter);
            } else {
                grdTaskTrx = new Grid({
                    keyfield: "TLN_ID",
                    columns: [
                        {
                            type: "na",
                            title: gridstrings.tasktrx[lang].type,
                            width: 150,
                            template: "<span>#= gridstrings.tasktrx[lang].typestrings[TLN_TYPE]#</span>"
                        },
                        {
                            type: "string",
                            field: "TLN_DESC",
                            title: gridstrings.tasktrx[lang].description,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TLN_QTY",
                            title: gridstrings.tasktrx[lang].qty,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "TLN_DATE",
                            title: gridstrings.tasktrx[lang].trxdate,
                            width: 150
                        }
                    ],
                    fields: {
                        TLN_DATE: { type: "date" }
                    },
                    datasource: "/Api/ApiTask/ListTaskSummaryForCustomer",
                    selector: "#grdTaskTrx",
                    name: "grdTaskTrx",
                    height: constants.defaultgridheight - 98,
                    filter: grdFilter,
                    sort: [{ field: "TLN_ID", dir: "desc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskTrx.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    }
                });
            }
        };
    };
    var tskpricing = new function () {
        var self = this;
        var updateType = "";
        var updateActivity = "";
        var updateCode = "";
        var grdPricingElm = $("#grdPricing");
        var grdPricing = null;
        var grdPricingRow = null;

        this.GeneratePricing = function (taskid) {
            return tms.Ajax({
                url: "/Api/ApiTask/GeneratePricing",
                data: JSON.stringify({ TSK_ID: taskid })
            });
        }
        var Save = function () {
            if (!tms.Check("#modalupdateprice"))
                return $.Deferred().reject();

            var o = {
                Task: task.TSK_ID,
                Type: updateType,
                Line: updateActivity,
                RecordId: grdPricingRow.TPR_RECORDID,
                AllowZero: $("#allowzero").prop("checked") ? "+" : "-",
                Code: updateCode,
                OldUnitPrice: parseFloat(grdPricingRow.TPR_UNITPRICE).fixed(constants.pricedecimals),
                OldUnitSalePrice: parseFloat(grdPricingRow.TPR_UNITSALESPRICE).fixed(constants.pricedecimals),
                NewUnitPrice: $("#newunitprice").val(),
                NewUnitSalePrice: $("#newsalesunitprice").val()
            }

            if (updateType === "EQUIPMENT" || updateType === "SERVICECODE" || updateType === "PART") {
                return tms.Ajax({
                    url: "/Api/ApiTaskActivities/EditPrices",
                    data: JSON.stringify(o),
                    fn: function (d) {
                        msgs.success(d.data);
                        $("#modalupdateprice").modal("hide");
                        $.when(self.GeneratePricing(task.TSK_ID)).done(function() {
                            self.List();
                        });
                    }
                });
            }
            else {
                msgs.error(applicationstrings[lang].cannotupdateprice);
            }
        };
        var gridDataBound = function (e) {
            var data = grdPricing.GetData();
            var sumPurchasePrice = 0;
            var sumSellPrice = 0;

            grdPricingElm.contextMenu({
                selector: "div.k-grid-content tr",
                items: {
                    updateprice: {
                        name: applicationstrings[lang].editprices,
                        disabled: function (key, opt) {
                            var row = grdPricing.GetRowDataItem($(this).closest("tr"));
                            var arraySalesAuth = (tmsparameters.UPDATEUNITSALESPRICE).split(',');
                            var arrayUnitAuth = (tmsparameters.UPDATEUNITPRICE).split(',');
                            var auth = arrayUnitAuth + "," + arraySalesAuth;
                            // $.inArray(row.TPR_PRICINGMETHOD, ["-","ENSON"]) === -1 
                           if ((!auth.includes(usergroup) || currentpcode === "C" || !(row.TPR_TYPECODE === "EQUIPMENT" || row.TPR_TYPECODE === "SERVICECODE" || row.TPR_TYPECODE === "PART"))) {
                               return true;
                           }
                            return false;
                        },
                        icon: function (opt, $itemElement, itemKey, item) {
                            $itemElement.html('<span><i class="fa fa-usd" aria-hidden="true"></i> ' + item.name + "</span>");
                            return "context-menu-icon-updated";
                        },
                        visible: function (key, opt) {
                            return !supplier;
                        },
                        callback: function () {
                            var arraySalesAuth = (tmsparameters.UPDATEUNITSALESPRICE).split(',');
                            var arrayUnitAuth = (tmsparameters.UPDATEUNITPRICE).split(',');
                            grdPricingRow = grdPricing.GetRowDataItem($(this).closest("tr"));
                            updateType = grdPricingRow.TPR_TYPECODE;
                            updateActivity = grdPricingRow.TPR_ACTIVITY;
                            updateCode = grdPricingRow.TPR_CODE;

                            console.log(grdPricingRow);
                            $("#newsalesunitprice").prop("disabled", false);
                            $("#newunitprice").prop("disabled", false);
                            $("#allowzero").prop("disabled", false);

                            if (!arraySalesAuth.includes(usergroup)) {
                                $("#newsalesunitprice").prop("disabled", true);
                                $("#allowzero").prop("disabled", true);

                            }
                            if (!arrayUnitAuth.includes(usergroup)) {
                                $("#newunitprice").prop("disabled", true);
                            }
                            $(".unitprice").attr("hidden",false);
                            if (updateType === "PART") {
                                $(".unitprice").attr("hidden",true);
                            }

                            $("#allowzero").prop("checked", grdPricingRow.TPR_ALLOWZERO === '+' ? true : false);
                            $("#newsalesunitprice").val(parseFloat(grdPricingRow.TPR_UNITSALESPRICE).fixed(constants.pricedecimals));
                            $("#newunitprice").val(parseFloat(grdPricingRow.TPR_UNITPRICE).fixed(constants.pricedecimals));
                            $("#defaultunitprice").val(parseFloat(grdPricingRow.TPR_UNITPRICE).fixed(constants.pricedecimals));
                            $("#defaultsalesunitprice").val(parseFloat(grdPricingRow.TPR_UNITSALESPRICE).fixed(constants.pricedecimals));
                            $("#modalupdateprice").modal();
                        }
                    }
                }
            });

            $.each(data,
                function () {
                    sumPurchasePrice += parseFloat(this.TPR_TOTALPRICE * this.TPR_EXCH) || 0;
                    sumSellPrice += parseFloat(this.TPR_TOTALSALESPRICE * this.TPR_EXCH) || 0;
                });
            grdPricingElm.find("#grdUnitPriceSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].totalcost +
                ": </strong>" +
                sumPurchasePrice.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                orgrecord.ORG_CURRENCY +
                "</span>");
            if (!supplier)
                grdPricingElm.find("#grdUnitSalesPriceSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                    applicationstrings[lang].totalsales +
                    ": </strong>" +
                    sumSellPrice.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " " +
                    orgrecord.ORG_CURRENCY +
                    "</span>");
        }
        this.List = function () {
            var grdFilter = [{ field: "TPR_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }];

            if (grdPricing) {
                grdPricing.ClearSelection();
                grdPricing.RunFilter(grdFilter);
            } else {
                var columns = [
                    {
                        type: "number",
                        field: "TPR_ACTIVITY",
                        title: gridstrings.taskpricing[lang].activity,
                        width: 50
                    },
                    {
                        type: "string",
                        field: "TPR_TYPE",
                        title: gridstrings.taskpricing[lang].type,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_CODE",
                        title: gridstrings.taskpricing[lang].code,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_DESC",
                        title: gridstrings.taskpricing[lang].desc,
                        width: 300
                    },
                    {
                        type: "string",
                        field: "TPR_PRICINGMETHOD",
                        title: gridstrings.taskpricing[lang].from,
                        template: "#= applicationstrings[lang].calcmethod[TPR_PRICINGMETHOD] || TPR_PRICINGMETHOD #",
                        width: 150
                    },
                    {
                        type: "qty",
                        field: "TPR_QTY",
                        title: gridstrings.taskpricing[lang].qty,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_UOM",
                        title: gridstrings.taskpricing[lang].uom,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_UNITPRICE",
                        title: gridstrings.taskpricing[lang].unitprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_TOTALPRICE",
                        title: gridstrings.taskpricing[lang].totalunitprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_UNITSALESPRICE",
                        title: gridstrings.taskpricing[lang].unitsalesprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_TOTALSALESPRICE",
                        title: gridstrings.taskpricing[lang].unittotalsalesprice,
                        width: 150
                    },
                    {
                        type: "number",
                        field: "TPR_CURR",
                        title: gridstrings.taskpricing[lang].curr,
                        width: 150
                    },
                    {
                        type: "exch",
                        field: "TPR_EXCH",
                        title: gridstrings.taskpricing[lang].exch,
                        width: 150
                    }
                ];
                var fields = {
                    TPR_QTY: { type: "number" },
                    TPR_TOTALSALESPRICE: { type: "number" },
                    TPR_UNITSALESPRICE: { type: "number" },
                    TPR_TOTALPRICE: { type: "number" },
                    TPR_UNITPRICE: { type: "number" },
                    TPR_EXCH: { type: "number" }
                };
                if (supplier) {
                    columns = $.grep(columns,
                        function (e) {
                            return ($.inArray(e.field, ["TPR_UNITSALESPRICE", "TPR_TOTALSALESPRICE"]) == -1);
                        });
                    delete fields.TPR_UNITSALESPRICE;
                    delete fields.TPR_TOTALSALESPRICE;
                }

                grdPricing = new Grid({
                    keyfield: "TPR_ID",
                    columns: columns,
                    fields: fields,
                    datasource: "/Api/ApiTask/TaskPricing",
                    selector: "#grdPricing",
                    name: "grdPricing",
                    height: constants.defaultgridheight - 98,
                    filter: grdFilter,
                    sort: [{ field: "TPR_ID", dir: "desc" }],
                    loadall: true,
                    datafields :[
                        {name:"recordid" , field:"TPR_RECORDID"}
                    ],
                    toolbar: {
                        left: [
                            "<div style=\"padding-right: 5px;\" class=\"pull-left\" id=\"grdUnitPriceSumValue\"></div><div class=\"pull-left\"  id=\"grdUnitSalesPriceSumValue\"></div>"

                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskTrx.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
        var RegisterTabEvents = function () {
            $("#updateprice").click(Save);
            $("#allowzero").change(function () {
                if (this.checked) {
                    $("#newsalesunitprice").prop("disabled", true);
                    $("#newsalesunitprice").val("0.00");
                } else {
                    $("#newsalesunitprice").prop("disabled", false);
                }
            });
        }
        RegisterTabEvents();
    };
    var tsk = new function () {
        var self = this;
        var taskDocumentsHelper;
        var taskCommentsHelper;
        var customFieldsHelper;
        var LoadPriorities;
        var LoadDocumentTypes;
        var LoadHoldReasons;
        var LoadTasks;
        var LoadCancellationReasons;

        var BuildWorkflowArray = function (data, fromstatus, arr) {
            var next = $.grep(data,
                function (i) {
                    return (i.SAU_FROM === fromstatus && i.SAU_TYPE === $("#type").val());
                });

            if (next.length === 0) {
                next = $.grep(data,
                    function (i) {
                        return (i.SAU_FROM === fromstatus && i.SAU_TYPE === "*");
                    });
            }

            if (next.length !== 0) {
                arr.push({
                    Code: next[0].SAU_TO,
                    Desc: next[0].SAU_TODESC
                });
                return BuildWorkflowArray(data, next[0].SAU_TO, arr);
            } else {
                return arr;
            }
        };
        var BuildStatusAuditArray = function () {
            var fa = {
                filter: {
                    filters: [
                        { field: "AUD_SUBJECT", value: "TMTASKS", operator: "eq" },
                        { field: "AUD_REFID", value: task.TSK_ID, operator: "eq" },
                        { field: "AUD_SOURCE", value: "TSK_STATUS", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiHistory/List",
                data: JSON.stringify(fa),
                quietly: true
            });
        };
        var BuildWorkflow = function () {
            var f = {
                filter: {
                    filters: [
                        { field: "SAU_TYPE", value: ["*", $("#type").val()], operator: "in" },
                        { field: "SAU_ENTITY", value: "TASK", operator: "eq" },
                        { field: "SAU_SHOWONWORKFLOW", value: "+", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiStatusAuth/ListWorkflowItems",
                data: JSON.stringify(f),
                fn: function (d) {
                    $.when(BuildStatusAuditArray()).done(function (rdat) {
                        var daud = rdat.data;
                        var prearr = $.map(daud, function (a) { return a.AUD_TO; });
                        prearr.push("T");
                        var arr = [];
                        var strworkflow = "";
                        arr = BuildWorkflowArray(d.data, "-", arr);
                        strworkflow += "<div class=\"row bs-wizard\" style=\"border-bottom:0;\">";
                        for (var i = 0; i < arr.length; i++) {
                            var audcnt = $.grep(prearr, function (e) { return (e === arr[i].Code); }).length;
                            if (arr[i].Code === $("#status").val())
                                strworkflow += "<div class=\"col-md-1 bs-wizard-step active\">";
                            else if (audcnt > 0)
                                strworkflow += "<div class=\"col-md-1 bs-wizard-step complete\">";
                            else
                                strworkflow += "<div class=\"col-md-1 bs-wizard-step disabled\">";

                            strworkflow +=
                                "<div class=\"text-center bs-wizard-stepnum\"><span class=\"badge badge-warning\">" +
                                audcnt +
                                "</span></div>";
                            strworkflow += "<div style=\"margin-right:-" +
                                arr.length +
                                "px\" class=\"progress\"><div class=\"progress-bar\"></div></div>";
                            strworkflow += "<a href=\"#\" class=\"bs-wizard-dot\"></a>";
                            strworkflow += "<div class=\"bs-wizard-info text-center\">" + arr[i].Desc + "</div>";
                            strworkflow += "</div>";
                        }
                        strworkflow += "</div>";
                        $(".workflow .row").remove();
                        $(".workflow").append(strworkflow);
                    });
                }
            });
        };
        var CheckSimilarRecords = function () {
            var customer = $("#customer").val();
            var branch = $("#branch").val();
            var tasktype = $("#tasktype").val();
            var category = $("#category").val();
            if (customer && branch && tasktype && category) {
                var checkdate = tms.Now().subtract({ "minutes": tmsparameters.SRCF }).format(constants.longdateformat);
                var f = {
                    filter: {
                        filters: [
                            { field: "TSK_CUSTOMER", value: customer, operator: "eq" },
                            { field: "TSK_BRANCH", value: branch, operator: "eq" },
                            { field: "TSK_TASKTYPE", value: tasktype, operator: "eq" },
                            { field: "TSK_CATEGORY", value: category, operator: "eq" },
                            { field: "TSK_CREATED", value: checkdate, operator: "gte" }
                        ]
                    }
                };
                return $.when(tms.Ajax({
                    url: "/Api/ApiTask/List",
                    data: JSON.stringify(f)
                })).done(function (d) {
                    if (d.data.length > 0) {
                        msgs.info(applicationstrings[lang].similarrecordfound, { tapToDismiss: true });
                    }
                });
            }
        }
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "TASK",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    MDepartment: department,
                    TDepartment: $("#taskdep").val(),
                    RequestedBy: $("#requestedby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-code=\"" +
                            status.code +
                            "\" data-pcode=\"" +
                            status.pcode +
                            "\" value=\"" +
                            status.code +
                            "\">" +
                            status.text +
                            "</option>";
                    if (d.data.length === 0) {
                        statusctrl.removeClass("required").prop("disabled", true);
                    } else {
                        for (var i = 0; i < d.data.length; i++) {
                            var di = d.data[i];
                            strOption += "<option data-code=\"" +
                                di.SAU_TO +
                                "\" data-pcode=\"" +
                                di.SAU_PTO +
                                "\" value=\"" +
                                di.SAU_TO +
                                "\">" +
                                di.SAU_TODESC +
                                "</option>";
                        }
                        statusctrl.addClass("required").prop("disabled", false).removeAttr("frozen");
                    }
                    statusctrl.append(strOption);
                }
            });
        };
        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMTASKS", operator: "eq" },
                    { field: "AUD_REFID", value: task.TSK_ID, operator: "eq" }
                ]
            });
        };
        var HistoryModalCustomFields = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCUSTOMFIELDVALUES", operator: "eq" },
                    { field: "AUD_REFID", value: task.TSK_ID, operator: "eq" }
                ]
            });
        };
        var BuildModals = function () {
            $("#btnproject").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.project[lang].title,
                    listurl: "/Api/ApiProjects/List",
                    keyfield: "PRJ_ID",
                    codefield: "PRJ_ID",
                    textfield: "PRJ_DESC",
                    returninput: "#project",
                    columns: [
                        { type: "number", field: "PRJ_ID", title: gridstrings.project[lang].project, width: 100 },
                        { type: "string", field: "PRJ_DESC", title: gridstrings.project[lang].description, width: 400 }
                    ],
                    fields: {
                        PRJ_ID: { type: "number" }
                    },
                    filter: [
                        { field: "PRJ_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnlocation").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.location[lang].title,
                    listurl: "/Api/ApiLocations/List",
                    keyfield: "LOC_CODE",
                    codefield: "LOC_CODE",
                    textfield: "LOC_DESC",
                    returninput: "#location",
                    columns: [
                        {
                            type: "string",
                            field: "LOC_CODE",
                            title: gridstrings.location[lang].location,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "LOC_DESC",
                            title: gridstrings.location[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "LOC_ACTIVE", value: "+", operator: "eq" },
                        { field: "LOC_BRANCH", value: $("#branch").val(), operator: "eq" }
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
                        { type: "string", field: "EQP_BRANDDESC", title: gridstrings.equipments[lang].branddesc, width: 250 },
                        { type: "string", field: "EQP_MODEL", title: gridstrings.equipments[lang].model, width: 250 },
                        { type: "string", field: "EQP_SERIALNO", title: gridstrings.equipments[lang].serialno, width: 250 }
                    ],
                    filter: [
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                        { field: "EQP_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "EQP_LOCATION", value: [$("#location").val(), "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        tooltip.hide("#equipment");
                        $("#equipment").data("id", (d ? d.EQP_ID : null));
                        $("#equipment").val(d ? d.EQP_CODE : "");
                        $("#equipmentdesc").val(d ? d.EQP_DESC : "");
                        if (d) {
                            tooltip.show("#equipment", d.EQP_DESC);
                        }
                    }
                });
            });
            $("#btnorg").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/ListUserOrganizations",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#org",
                    columns: [
                        {
                            type: "string",
                            field: "ORG_CODE",
                            title: gridstrings.org[lang].organization,
                            width: 100
                        },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        $("#project").val("");
                        $("#customer").val("");
                        $("#customerdesc").val("");
                        $("#branch").val("");
                        $("#branchdesc").val("");
                        $("#location").val("");
                        tooltip.hide("#project");
                        tooltip.hide("#customer");
                        tooltip.hide("#branch");
                        tooltip.hide("#location");
                        $("#org").val(data.ORG_CODE).trigger("change");
                        tooltip.show("#org", data.ORG_DESCF);
                        if (!customer) {
                            $("#taskdep").val("");
                            $("#type").val("");
                            tooltip.hide("#taskdep");
                            tooltip.hide("#type");
                        }
                    }
                });
            });
            $("#btnFollowed").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#followed",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.user[lang].allusers,
                            filter: [
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        },
                        {
                            text: gridstrings.user[lang].departmentusers,
                            filter: [
                                { field: "USR_DEPARTMENT", value: department, operator: "eq" },
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        }
                    ]
                });
            });
            $("#btnrequestedby").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#requestedby",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" }
                    ]
                });
            });
            $("#btntype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/ListByDepartment",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#type",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        {
                            type: "string",
                            field: "TYP_DESCF",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "TYP_DEPARTMENT", value: [$("#taskdep").val(), "*"], operator: "in" },
                        { field: "TYP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "TASK",
                                source: task.TSK_ID,
                                type: data.TYP_CODE
                            });
                            cfunc.DoTypeSpecificCustomisation();
                        }
                    }
                });
            });
            $("#btncategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/ListByDepartment",
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
                    filter: [
                        { field: "CAT_CODE", value: "*", operator: "neq" },
                        { field: "CAT_DEPARTMENT", value: [$("#taskdep").val(), "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        $("#tasktype").removeAttr("required").removeClass("required");
                        if (d) {
                            if (d.CAT_TSKTYPEREQUIRED === "+" && !customer) {
                                $("#tasktype").attr("required", "required").addClass("required");
                            }
                            if (d.CAT_CODE === "BK") {
                                $("#divperiodictask").removeClass("hidden");
                            } else {
                                $("#divperiodictask").addClass("hidden");
                            }
                        } else {
                            $("#divperiodictask").addClass("hidden");
                        }
                    }
                });
            });
            $("#btnHistory").click(HistoryModal);
            $("#btnCustomFieldsHistory").click(HistoryModalCustomFields);
            $("#btnTaskDepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#taskdep",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_CODE", value: "*", operator: "neq" },
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
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
                        {
                            type: "string",
                            field: "CUS_DESC",
                            title: gridstrings.customer[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        $("#customerdesc").val(data ? data.CUS_DESC : "");
                        $("#branch").val("");
                        $("#branchdesc").val("");
                        $("#location").val("");
                        tooltip.hide("#branch");
                        tooltip.hide("#location");
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
                        { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 300 },
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#branchdesc").val(data ? data.BRN_DESC : "");
                        if (data && data.BRN_LOCATION) {
                            $("#location").val(data.BRN_LOCATION);
                            tooltip.show("#location", data.BRN_LOCATIONDESC);
                        } else {
                            $("#location").val("");
                            tooltip.hide("#location");
                        }
                    }
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
                        { field: "PTK_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "PTK_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncontracts").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.contracts[lang].title,
                    listurl: "/Api/ApiContracts/List",
                    keyfield: "CON_ID",
                    codefield: "CON_ID",
                    textfield: "CON_DESC",
                    returninput: "#contract",
                    columns: [
                        {
                            type: "string",
                            field: "CON_ID",
                            title: gridstrings.contracts[lang].contractno,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "CON_DESC",
                            title: gridstrings.contracts[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "CON_CUSTOMER", value: $("#customer").val(), operator: "eq" },
                        { field: "CON_STARTDATE", value: tms.Now(), operator: "lt" },
                        { field: "CON_ENDDATE", value: tms.Now(), operator: "gt" }
                    ]
                });
            });

        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                callback: function (data) {
                    $("#project").val("");
                    $("#customer").val("");
                    $("#customerdesc").val("");
                    $("#branch").val("");
                    $("#branchdesc").val("");
                    $("#location").val("");
                    tooltip.hide("#project");
                    tooltip.hide("#customer");
                    tooltip.hide("#branch");
                    tooltip.hide("#location");
                    if (!customer) {
                        $("#taskdep").val("");
                        $("#type").val("");
                        tooltip.hide("#taskdep");
                        tooltip.hide("#type");
                    }
                },
                filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }]
            });
            $("#requestedby").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                filter: [{ field: "USR_ORG", relfield: "#org", includeall: true }],
                active: "USR_ACTIVE"
            });
            $("#project").autocomp({
                listurl: "/Api/ApiProjects/List",
                geturl: "/Api/ApiProjects/Get",
                field: "PRJ_ID",
                textfield: "PRJ_DESC",
                termisnumeric: true,
                filter: [{ field: "PRJ_ORGANIZATION", relfield: "#org", includeall: true }]
            });
            $("#location").autocomp({
                listurl: "/Api/ApiLocations/List",
                geturl: "/Api/ApiLocations/Get",
                field: "LOC_CODE",
                textfield: "LOC_DESC",
                active: "LOC_ACTIVE",
                filter: [
                    { field: "LOC_ORG", relfield: "#org", includeall: true },
                    { field: "LOC_BRANCH", relfield: "#branch", includeall: true }
                ]
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/ListByDepartment",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESCF",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_DEPARTMENT", relfield: "#taskdep", includeall: true }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "TASK",
                            source: task.TSK_ID,
                            type: data.TYP_CODE
                        });
                        cfunc.DoTypeSpecificCustomisation();
                    }
                }
            });
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/ListByDepartment",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [
                    { field: "CAT_DEPARTMENT", relfield: "#taskdep", includeall: true },
                    { field: "CAT_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    $("#tasktype").removeAttr("required").removeClass("required");
                    if (d) {
                        if (d.CAT_TSKTYPEREQUIRED === "+" && !customer) {
                            $("#tasktype").attr("required", "required").addClass("required");
                        }
                        if (d.CAT_CODE === "BK") {
                            $("#divperiodictask").removeClass("hidden");
                        } else {
                            $("#divperiodictask").addClass("hidden");
                        }
                    } else {
                        $("#divperiodictask").addClass("hidden");
                    }

                }
            });
            $("#taskdep").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    { field: "DEP_ORG", relfield: "#org", includeall: true }
                ]
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }],
                callback: function (data) {
                    $("#customerdesc").val(data ? data.CUS_DESC : "");
                    $("#branch").val("");
                    $("#branchdesc").val("");
                    $("#location").val("");
                    tooltip.hide("#branch");
                    tooltip.hide("#location");
                }
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [{ field: "BRN_CUSTOMER", relfield: "#customer", includeall: false }],
                callback: function (data) {
                    $("#branchdesc").val(data ? data.BRN_DESC : "");
                    if (data && data.BRN_LOCATION) {
                        $("#location").val(data.BRN_LOCATION);
                        tooltip.show("#location", data.BRN_LOCATIONDESC);
                    } else {
                        $("#location").val("");
                        tooltip.hide("#location");
                    }
                }
            });
            $("#tasktype").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }]
            });
            $("#equipment").autocomp({
                listurl: "/Api/ApiEquipments/List",
                geturl: "/Api/ApiEquipments/Get",
                field: "EQP_CODE",
                textfield: "EQP_DESC",
                active: "EQP_ACTIVE",
                screen: "M_EQUIPMENTS",
                filter: [
                    { field: "EQP_ORG", relfield: "#org", includeall: true },
                    { field: "EQP_LOCATION", relfield: "#location", includeall: true }
                ],
                callback: function (d) {
                    tooltip.hide("#equipment");
                    $("#equipment").data("id", (d ? d.EQP_ID : null));
                    $("#equipment").val(d ? d.EQP_CODE : "");
                    $("#equipmentdesc").val(d ? d.EQP_DESC : "");
                    if (d) {
                        tooltip.show("#equipment", d.EQP_DESC);
                    }
                }
            });
            $("#periodictask").autocomp({
                listurl: "/Api/ApiPeriodicTasks/List",
                geturl: "/Api/ApiPeriodicTasks/Get",
                field: "PTK_CODE",
                textfield: "PTK_DESC",
                active: "PTK_ACTIVE",
                filter: [
                    {
                        field: "PTK_ORGANIZATION",
                        func: function () { return [$("#org").val(), "*"] },
                        operator: "in"
                    }
                ]
            });            
            $("#contract").autocomp({
                listurl: "/Api/ApiContracts/List",
                geturl: "/Api/ApiContracts/Get",
                field: "CON_ID",
                textfield: "CON_DESC",
                termisnumeric: true,
                filter: [
                    {
                        field: "CON_CUSTOMER",
                        relfield: "#customer",
                        operator: "eq"
                    },
                    {
                        field: "CON_STARTDATE",
                        value: tms.Now(),
                        operator: "lt"
                    },
                    {
                        field: "CON_ENDDATE",
                        value: tms.Now(),
                        operator: "gt"
                    }
                ]
            });

        };

        var RegisterTabChange = function () {
            $(document).on("shown.bs.tab",
                "#navtasks a[data-toggle=\"tab\"]",
                function (e) {
                    return $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                });
        };
        var RegisterUiEvents = function () {
            $(".btn").css("cursor", "pointer");
            $("#btnSave").click(function () {
                var $this = $(this);
                $this.prop("disabled", true);
                $.when(self.Save()).always(function () {
                    $this.prop("disabled", false);
                });
            });
            $("#btnNew").click(self.New);
            $("#btnDelete").click(self.Remove);
            $("#btnPrint").click(self.Print);
            $("#btnUndo").click(function () { self.LoadTask() });
            $("#org").change(function () { LoadPriorities(); });
            $("#status").change(function () {
                var $this = $(this);
                var value = $this.find("option:selected").val();

                $("div.holdreasonctrl").addClass("hidden");
                $("#holdreason").removeClass("required");

                $("#divcancellationreason").addClass("hidden");
                $("#cancellationreason").removeClass("required");

                switch (value) {
                    case "BEK":
                        $("div.holdreasonctrl").removeClass("hidden");
                        $("#holdreason").addClass("required");
                        break;
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        $("#cancellationreason").attr("required", "").addClass("required");
                        break;
                }
            });
            $("#btnaddme2").click(function () { $("#followed").tagsinput("add", { id: user, text: userdesc }); });
            $("#btnOpenList").click(function () {
                if (!taskListVisible) {
                    $("#tasklist").css({ "display": "block" });
                    $("#taskcontent").addClass("col-md-9").removeClass("col-md-12");
                    LoadTasks();
                    taskListVisible = true;
                } else {
                    $("#tasklist").css({ "display": "none" });
                    $("#taskcontent").addClass("col-md-12").removeClass("col-md-9");
                    taskListVisible = false;
                }
            });
            $("[loadstatusesonchange=\"yes\"]").on("change",
                function () {
                    LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });
            $("#followed").on("itemAdded",
                function () {
                    $("#followedcnt").text("(" +
                        $("#followed").tagsinput("items").length +
                        " " +
                        applicationstrings[lang].person +
                        ")");
                }).on("itemRemoved",
                function () {
                    var itemcount = $("#followed").tagsinput("items").length;
                    $("#followedcnt").text(itemcount !== 0
                        ? "(" + itemcount + " " + applicationstrings[lang].person + ")"
                        : "");
                });
            $("#btnWorkflow").on("click",
                function () {
                    if (workflowcollapsed) {
                        BuildWorkflow();
                    }
                    workflowcollapsed = !workflowcollapsed;
                });

            $("[checksimilaronchange]").on("autocompletechange", CheckSimilarRecords);

            RegisterTabChange();

            scr.BindHotKeys();
        };
        this.BuildUI = function () {
            BuildModals();
            AutoComplete();

            taskDocumentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress",
                downloadbutton: "#btnDownload",
                checkbox: true,
                enableclipboardpaste : true
            });
            taskCommentsHelper = new comments({
                input: "#comment",
                chkvisibletocustomer: "#visibletocustomer",
                chkvisibletosupplier: "#visibletosupplier",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer", screen: "TASK" });

            $("#activity").numericInput({ allowNegative: false, allowFloat: false });
            $("div.isEmpty>.bootstrap-tagsinput").addClass("required");
            if (supplier)
                $("#misccostunitsalesprice").closest("div.row").hide();

            RegisterUiEvents();

            self.LoadTask();
        };
        var AddCheck = function () {
            var daterequested = moment($("#daterequested").val(), constants.longdateformat);
            var deadline = moment($("#deadline").val(), constants.dateformat);
            var completed = moment($("#completed").val(), constants.longdateformat);
            if (daterequested > tms.Now()) {
                msgs.error(applicationstrings[lang].daterequested);
                return false;
            }
            if (completed < daterequested) {
                msgs.error(applicationstrings[lang].completeerr);
                return false;
            }
            if (deadline < moment(daterequested).startOf("day")) {
                msgs.error(applicationstrings[lang].deadline);
                return false;
            }
            return true;
        };
        var CheckCustomerBusinessRules = function () {
            if (task.TSK_CUSTOMERGROUP === "SHAYA") {
                var old_status = task.TSK_STATUS;
                var new_status = $("#status option:selected").val();

                if (old_status !== "K" && new_status === "K") { 
                    ftip = $("#txtSHFTIP").val();
                    fyil = $("#txtSHHYIL").val();
                    fay = $("#txtSHHAY").val();
                    if (!(!!ftip && !!fyil && !!fay)) {
                        msgs.error(customstrings[lang].shaya_err001);
                        return false;
                    }
                }
            }
            return true;
        }

        var CompletedClosedDates = function () {
            var new_status = $("#status option:selected").val();
            var new_pcode = $("#status option:selected").data("pcode");
            var old_status = task.TSK_STATUS;
            var old_pcode = pstat;
            var completedate = null;
            var closeddate = null;

            if (old_status === new_status) {
                completedate = $("#completed").val() ? moment.utc($("#completed").val(), constants.longdateformat) : null;
                closeddate = $("#closed").val() ? moment.utc($("#closed").val(), constants.longdateformat) : null;
            } else if (old_status !== "TAM" && new_status === "TAM") {
                completedate = tms.Now();
                closeddate = task.TSK_CLOSED;
            } else if (old_status === "TAM" && new_status !== "TAM" && new_pcode === "C") {
                completedate = task.TSK_COMPLETED;
                closeddate = task.TSK_CLOSED;
            } else if (old_status === "TAM" && new_status !== "TAM" && new_pcode !== "C") {
                completedate = (new_status === "TMK" ? task.TSK_COMPLETED : null);
                closeddate = task.TSK_CLOSED;
            }

            if (old_pcode !== "C" && new_pcode === "C") {
                completedate = task.TSK_COMPLETED;
                closeddate = tms.Now();
            } else if (old_pcode === "C" && new_pcode !== "C") {
                completedate = (($.inArray(new_status, ["TAM", "TMK"]) !== -1) ? task.TSK_COMPLETED : null);
                closeddate = null;
            }

            return {
                Completed: completedate,
                Closed: closeddate
            };
        }

        this.Save = function () {
            var selectedstatus = $("#status option:selected").val();
            var currentstatus = $("#status").data("code");
            var holdreason = $("#holdreason").val();
            var cancellationreason = $("#cancellationreason");

            if ((selectedstatus === "IPT")) {
                var container = cancellationreason.closest("div.row");
                if (!tms.Check(container)) {
                    return $.Deferred().reject();
                }
            }
            if ((currentstatus !== "IPT" && selectedstatus !== "IPT") && (!tms.Check("#record") || !AddCheck() || !CheckCustomerBusinessRules())) {
                return $.Deferred().reject();
            }

            var ccdates = CompletedClosedDates();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "TASK",
                source: task.TSK_ID,
                type: $("#type").val()
            });
            var o = {
                Task: {
                    TSK_ID: (task.TSK_ID) ? task.TSK_ID : 0,
                    TSK_ORGANIZATION: $("#org").val(),
                    TSK_PROJECT: ($("#project").val() || null),
                    TSK_DEPARTMENT: ($("#taskdep").val() || null),
                    TSK_LOCATION: ($("#location").val() || null),
                    TSK_EQUIPMENT: ($("#equipment").data("id") || null),
                    TSK_EQUIPMENTREQUIRED: $("#equipmentrequired").prop("checked") ? "+" : "-",
                    TSK_CATEGORY: $("#category").val(),
                    TSK_TYPE: $("#type").val(),
                    TSK_TYPEENTITY: "TASK",
                    TSK_TASKTYPE: ($("#tasktype").val() || null),
                    TSK_SHORTDESC: $("#shortdesc").val(),
                    TSK_NOTE: ($("#tasknote").val() || null),
                    TSK_STATUS: selectedstatus,
                    TSK_PRIORITY: $("#priority").val(),
                    TSK_PROGRESS: 0,
                    TSK_FOLLOWED: ($("#followed").val() || null),
                    TSK_REQUESTEDBY: $("#requestedby").val(),
                    TSK_HIDDEN: $("#hidden").prop("checked") ? "+" : "-",
                    TSK_DEADLINE: ($("#deadline").val()
                        ? moment.utc($("#deadline").val(), constants.dateformat)
                        : null),
                    TSK_REQUESTED: ($("#daterequested").val()
                        ? moment.utc($("#daterequested").val(), constants.longdateformat)
                        : null),
                    TSK_CLOSED: ccdates.Closed,
                    TSK_COMPLETED: ccdates.Completed,
                    TSK_RECORDVERSION: (task.TSK_RECORDVERSION) ? task.TSK_RECORDVERSION : 0,
                    TSK_RATING: (task.TSK_RATING) ? task.TSK_RATING : null,
                    TSK_RATINGCOMMENTS: (task.TSK_RATINGCOMMENTS) ? task.TSK_RATINGCOMMENTS : null,
                    TSK_CUSTOMER: ($("#customer").val() || null),
                    TSK_BRANCH: ($("#branch").val() || null),
                    TSK_PSPCODE: task.TSK_PSPCODE,
                    TSK_PRPCODE: task.TSK_PRPCODE,
                    TSK_REFERENCE: ($("#reference").val() || null),
                    TSK_HOLDREASON: (selectedstatus === "BEK" ? holdreason : null),
                    TSK_HOLDDATE: (((task.TSK_STATUS !== "BEK" && selectedstatus === "BEK") ||
                            (task.TSK_STATUS === "BEK" && task.TSK_HOLDREASON !== holdreason))
                        ? tms.Now()
                        : (selectedstatus !== "BEK" ? null : task.TSK_HOLDDATE)),
                    TSK_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                    TSK_CANCELLATIONDESC: ($("#cancellationdesc").val() || null),
                    TSK_PTASK: ($("#periodictask").val() || null),
                    TSK_CHK01: (task.TSK_CHK01 || "-"),
                    TSK_CHK02: (task.TSK_CHK02 || "-"),
                    TSK_CHK03: (task.TSK_CHK03 || "-"),
                    TSK_CHK04: (task.TSK_CHK04 || "-"),
                    TSK_CHK05: (task.TSK_CHK05 || "-"),
                    TSK_CONTRACTID: ($("#contract").val() || null)

                },
                CustomFieldValues: customfieldvalues
            };

            var jsonstr = JSON.stringify(o);

            return tms.Ajax({
                url: "/Api/ApiTask/Save",
                data: jsonstr,
                headers: {
                    'confirmation': '+',
                    'p1' : task.TSK_ID
                },
                fn: function (d) {
                    msgs.success(d.data);
                    if (!task.TSK_ID) {
                        if (window.history && window.history.pushState)
                            window.history.pushState("forward", null, "/Task/Record/" + d.id + "#no-back");
                    }
                    return self.LoadTask();
                }
            });
        };
        this.Remove = function () {
            if (task.TSK_ID) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTask/DelRec",
                            data: JSON.stringify(task.TSK_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.New();
                            }
                        });
                    });
            }
        };
        LoadTasks = function () {
            var gridfilter = [];

            if ($.inArray("*", authorizeddepartmentsarr) === -1) {
                gridfilter.push({
                    field:"ACTIVITYDEPARTMENTAUTHTABLE.TSKID",
                    value: user,
                    operator: "func",
                    logic: "or"
                });
                gridfilter.push({
                    field: "TSK_DEPARTMENT",
                    value: authorizeddepartmentsarr,
                    operator: "in",
                    logic: "or"
                });
                gridfilter.push({ field: "TSK_CREATEDBY", value: user, operator: "eq", logic: "or" });
                gridfilter.push({ field: "TSK_REQUESTEDBY", value: user, operator: "eq", logic: "or" });
                gridfilter.push({ field: "TSK_ASSIGNEDTO", value: user, operator: "contains", logic: "or" });
                gridfilter.push({ field: "TSK_FOLLOWED", value: user, operator: "contains", logic: "or" });
            }

            $(".list-group").list({
                listurl: "/Api/ApiTask/List",
                type: "A",
                fields: {
                    keyfield: "TSK_ID",
                    descfield: "TSK_SHORTDESC",
                    otherfields: [
                        { field: "TSK_STATUSDESC", label: gridstrings.tasklist[lang].statusdesc },
                        { field: "TSK_CUSTOMER", label: gridstrings.tasklist[lang].customer },
                        { field: "TSK_BRANCH", label: gridstrings.tasklist[lang].branch }
                    ]
                },
                srch: {
                    filters: [
                        { field: "TSK_ID", operator: "eq", logic: "or" },
                        { field: "TSK_SHORTDESC", operator: "contains", logic: "or" },
                        { field: "TSK_CUSTOMER", operator: "contains", logic: "or" },
                        { field: "TSK_BRANCH", operator: "contains", logic: "or" },
                        { field: "TSK_STATUSDESC", operator: "contains", logic: "or" }
                    ],
                    logic: "and"
                },
                predefinedfilters: [{ filters: gridfilter, logic: "and" }],
                sort: [{ field: "TSK_ID", dir: "desc" }],
                itemclick: function (event, item) {
                    if (window.history && window.history.pushState)
                        window.history.pushState("forward", null, "/Task/Record/" + $(item).data("id") + "#no-back");
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                }
            });
        };

        LoadHoldReasons = function () {
            var gridreq = {
                sort: [{ field: "HDR_CODE", dir: "asc" }],
                filter: [
                    {
                        filters: [
                            { field: "HDR_ACTIVE", value: "+", operator: "eq" },
                            { field: "HDR_TMS", value: "+", operator: "eq" }
                        ]
                    },
                ]
            };

            var selectedholdreason = $("#holdreason").data("selected");
            var p = {
                UserGroup: usergroup,
                SelectedHoldReason: selectedholdreason,
                GridRequest: gridreq
            }

            return tms.Ajax({
                url: "/Api/ApiHoldReasons/ListByUserGroup",
                data: JSON.stringify(p),
                fn: function (d) {
                    var holdreason = $("#holdreason");
                    holdreason.find("option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        if (d.data[i]) {
                            strOptions += "<option value=\"" +
                                d.data[i].HDR_CODE +
                                "\">" +
                                d.data[i].HDR_DESCF +
                                "</option>";
                        }
                    }
                    holdreason.append(strOptions);
                    holdreason.val(holdreason.data("selected"));
                    if (holdreason.data("selected") === "TEKLIF.ASAMASINDA") {
                        $("div.quotationstatusdiv").removeClass("hidden");
                        $("#quotationstatus").text(task.TSK_QUOTATIONSTATUSDESC || "-");
                    } else {
                        $("div.quotationstatusdiv").addClass("hidden");
                        $("#quotationstatus").text("-");
                    }
                }
            });
        };
        LoadPriorities = function () {
            var gridreq = {
                sort: [{ field: "PRI_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "PRI_ACTIVE", value: "+", operator: "eq" },
                            { field: "PRI_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                        ],
                        logic: "or"
                    }
                ]
            };

            var selectedpriority = $("#priority").data("selected");
            if (selectedpriority) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "PRI_CODE", value: selectedpriority, operator: "eq" }
                    ],
                    logic: "or"
                });
            }

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
        LoadDocumentTypes = function () {
            var gridreq = {
                sort: [{ field: "SYC_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "DOCTYPE", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#doctype option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].SYC_CODE +
                            "\">" +
                            d.data[i].SYC_DESCF +
                            "</option>";
                    }
                    $("#doctype").append(strOptions);
                }
            });
        };
        LoadCancellationReasons = function () {
            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "TASK", operator: "eq" },
                            { field: "CNR_ACTIVE", value: "+", operator: "eq" }
                        ],
                        logic: "or"
                    }
                ]
            };

            var selectedcancellationreason = $("#cancellationreason").data("selected");
            if (selectedcancellationreason) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "CNR_CODE", value: selectedcancellationreason, operator: "eq" },
                        { field: "CNR_ENTITY", value: "TASK", operator: "eq" }
                    ],
                    logic: "or"
                });
            }

            return tms.Ajax({
                url: "/Api/ApiCancellationReasons/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#cancellationreason option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].CNR_CODE +
                            "\">" +
                            d.data[i].CNR_DESCF +
                            "</option>";
                    }
                    $("#cancellationreason").append(strOptions);
                    $("#cancellationreason").val(selectedcancellationreason);
                }
            });
        };

        var FillTabCounts = function (id) {
            return tms.Ajax({
                url: "/Api/ApiTask/GetTabCounts",
                data: JSON.stringify(id),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        var tab = $("#navtasks a[href=\"" + d.data[i].TAB + "\"]");
                        tab.find("span").remove();
                        tab.append(" <span class=\"badge " +
                            (d.data[i].CNT > 0 ? " badge-danger" : "") +
                            "\">" +
                            d.data[i].CNT +
                            "</span>");
                    }
                }
            });
        };
        var EvaluateCurrentStatus = function () {
            var statusctrl = $("#status");
            var selectedoption = statusctrl.find("option:selected");
            var currentcode = statusctrl.data("code");
            currentpcode = statusctrl.data("pcode");
            var code = selectedoption.data("code");
            var pcode = selectedoption.data("pcode");
            switch (currentpcode) {
                case "C":
                    $("#cfcontainer").find("input,select,button").prop("disabled", true);
                    $("#divHeader [disableoncomplete]").prop("disabled", true);
                    break;
                default:
                    $("#divHeader [disableoncomplete]").prop("disabled", false);
                    break;
            }

            if (task.TSK_ID) {
                $("#type,#btntype").prop("disabled", true);
                $("#type").removeClass("required");
                $("div.holdreasonctrl").addClass("hidden");
                $("#holdreason").removeClass("required");
                $("#divcancellationreason").addClass("hidden");
                $("#cancellationreason").removeAttr("required").removeClass("required");

                switch (code) {
                    case "T":
                        $("#type,#btntype").prop("disabled", !!customer);
                        $("#type").addClass("required");
                        break;
                    case "BEK":
                        $("div.holdreasonctrl").removeClass("hidden");
                        $("#holdreason").addClass("required");
                        break;
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        $("#cancellationreason").prop("disabled", code === currentcode).attr("required", "").addClass("required");
                        break;
                }
            }
        };
        var DoAdditionalTaskThings = function () {
            var deferreds = [];
            if (task.TSK_ID) {
                deferreds.push(taskCommentsHelper.showCommentsBlock({ subject: "TASK", source: task.TSK_ID }));
                deferreds.push(taskDocumentsHelper.showDocumentsBlock({ subject: "TASK", source: task.TSK_ID }));
            }

            var tasktype = $("#type").val();
            if (tasktype)
                deferreds.push(
                    customFieldsHelper.loadCustomFields({ subject: "TASK", source: task.TSK_ID, type: tasktype }));

            deferreds.push(LoadPriorities());
            deferreds.push(LoadDocumentTypes());
            deferreds.push(LoadHoldReasons());
            deferreds.push(LoadCancellationReasons());

            $.when.apply($, deferreds).done(function (d1, d2, d3, d4, d5, d6, d7) {
                var selectedcustomfieldvalues = d3;
                $.when(LoadStatuses({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")
                })).done(function () {
                    cfunc.DoTypeSpecificCustomisation();
                    $("#record").removeClass("hidden");
                    EvaluateCurrentStatus();
                });
            });
        };
        var FillUserInterface = function (d) {
            if (tms.ActiveTab() === "record") {
                tms.BeforeFill("#record");
                $("#btnDelete").prop("disabled", !["ADMIN", "YONETICILER"].includes(usergroup));
            }

            tms.Tab();

            task = d.data;
            var statusdetails = d.exdata[0];
            var followed = d.exdata[1];
            pstat = statusdetails.STA_PCODE;

            $("#taskno").val(task.TSK_ID);
            $("#org").val(task.TSK_ORGANIZATION);
            $("#taskdep").val(task.TSK_DEPARTMENT);
            $("#type").val(task.TSK_TYPE);
            $("#shortdesc").val(task.TSK_SHORTDESC);
            $("#requestedby").val(task.TSK_REQUESTEDBY).prop("disabled", !!customer);
            $("#project").val(task.TSK_PROJECT);
            $("#location").val(task.TSK_LOCATION).prop("disabled", !!customer);
            $("#equipment").data("id", task.TSK_EQUIPMENT);
            $("#equipment").val(task.TSK_EQUIPMENTCODE);
            $("#equipmentrequired").prop("checked", task.TSK_EQUIPMENTREQUIRED === "+");
            $("#equipmentdesc").val(task.TSK_EQUIPMENTDESC);
            $("#category").val(task.TSK_CATEGORY);
            $("#tasktype").val(task.TSK_TASKTYPE);
            $("#status").data("code", statusdetails.STA_CODE);
            $("#status").data("pcode", statusdetails.STA_PCODE);
            $("#status").data("text", statusdetails.STA_DESCF);
            $("#priority").data("selected", task.TSK_PRIORITY);
            $("#daterequested").val(moment(task.TSK_REQUESTED).format(constants.longdateformat)).prop("disabled", !!customer);
            $("#deadline").val(task.TSK_DEADLINE ? moment(task.TSK_DEADLINE).format(constants.dateformat) : "");
            $("#closed").val(task.TSK_CLOSED ? moment(task.TSK_CLOSED).format(constants.longdateformat) : "");
            $("#completed").val(task.TSK_COMPLETED ? moment(task.TSK_COMPLETED).format(constants.longdateformat) : "");
            $("#datecreated").val(moment(task.TSK_CREATED).format(constants.longdateformat));
            $("#createdby").val(task.TSK_CREATEDBY);
            $("#customer").val(task.TSK_CUSTOMER);
            $("#branch").val(task.TSK_BRANCH);
            $("#holdreason").data("selected", task.TSK_HOLDREASON);
            $("#holddate").html(task.TSK_LASTHOLDDURATION
                ? "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> " +
                moment.duration(task.TSK_LASTHOLDDURATION, "minutes").humanize()
                : "-");
            $("#holddurationsum").html(task.TSK_HOLDDURATION
                ? "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> " +
                moment.duration(task.TSK_HOLDDURATION, "minutes").humanize()
                : "-");
            $("#holddurationcount").html(task.TSK_HOLDCOUNT > 0
                ? "<span id=\"btnholddurationcount\" class=\"badge badge-info\"><i class=\"fa fa-pause-circle\" aria-hidden=\"true\"></i> " +
                task.TSK_HOLDCOUNT +
                "</span>"
                : "");
            $("#activeplanningdate")
                .val(task.TSK_APD != null ? moment(task.TSK_APD).format(constants.longdateformat) : "");
            $("#customerdesc").val(task.TSK_CUSTOMERDESC);
            $("#branchdesc").val(task.TSK_BRANCHDESC);
            $("#pspcode").val(task.TSK_PSPCODE);
            $("#prpcode").val(task.TSK_PRPCODE);
            $("#contract").val(task.TSK_CONTRACTID);

            $("#reference").val(task.TSK_REFERENCE);
            $("#cancellationreason").data("selected", task.TSK_CANCELLATIONREASON);
            $("#cancellationdesc").val(task.TSK_CANCELLATIONDESC);
            $("#tasknote").val(task.TSK_NOTE);

            $("#btnorg,#btnTaskDepartment,#btncustomer").prop("disabled", true);
            $("#btnlocation,#btnrequestedby").prop("disabled", !!customer);
            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            $("#tasktype").removeAttr("required").removeClass("required");
            if (task.TSK_CATTSKTYPEREQUIRED == "+" && statusdetails.STA_PCODE !== "C" && !customer) {
                $("#tasktype").attr("required", "required").addClass("required");
            }
            if (task.TSK_CATEGORY === "BK") {
                $("#periodictask").val(task.TSK_PTASK);
                $("#divperiodictask").removeClass("hidden");
            } else {
                $("#divperiodictask").addClass("hidden");
                $("#periodictask").val("");
            }
            tooltip.show("#type", task.TSK_TYPEDESC);
            tooltip.show("#org", task.TSK_ORGANIZATIONDESC);
            tooltip.show("#taskdep", task.TSK_DEPARTMENTDESC);
            tooltip.show("#type", task.TSK_TYPEDESC);
            tooltip.show("#requestedby", task.TSK_REQUESTEDBYDESC);
            tooltip.show("#project", task.TSK_PROJECTDESC);
            tooltip.show("#location", task.TSK_LOCATIONDESC);
            tooltip.show("#equipment", task.TSK_EQUIPMENTDESC);
            tooltip.show("#category", task.TSK_CATEGORYDESC);
            tooltip.show("#tasktype", task.TSK_TASKTYPEDESC);
            tooltip.show("#customer", task.TSK_CUSTOMERDESC);
            tooltip.show("#branch", task.TSK_BRANCHDESC);
            tooltip.show("#createdby", task.TSK_CREATEDBYDESC);
            tooltip.show("#contract", task.TSK_CONTRACTDESC);


            if (task.TSK_CUSTOMERNOTES || task.TSK_BRANCHNOTES) {
                $("#warnings").removeClass("hidden")
                    .html((task.TSK_CUSTOMERNOTES || "") + (task.TSK_BRANCHNOTES || ""));
            }

            $(".page-header h6").text(task.TSK_ID + " - " + task.TSK_SHORTDESC);
            $("#btnDownload").on("click",
                function () {
                    window.location = "/Download.ashx?subject=TASK&source=" + task.TSK_ID;
                });
            $("#btnholddurationcount").on("click",
                function () {
                    gridModal.show({
                        modaltitle: gridstrings.holdreasonhistory[lang].title,
                        listurl: "/Api/ApiHoldReasons/ListHoldReasonView",
                        keyfield: "TSK_ID",
                        codefield: "TSK_ID",
                        textfield: "TSK_HOLDREASON",
                        sort: [{ field: "TSK_HOLDORDER", dir: "asc" }],
                        columns: [
                            {
                                type: "string",
                                field: "TSK_HOLDREASONDESC",
                                title: gridstrings.holdreasonhistory[lang].holdreasondesc,
                                width: 100
                            },
                            {
                                type: "na",
                                field: "TSK_HOLDDURATION",
                                title: gridstrings.holdreasonhistory[lang].holdduration,
                                width: 100,
                                template: "<span>#= moment.duration(TSK_HOLDDURATION,'minutes').humanize() #</span>"
                            }
                        ],
                        filter: [
                            { field: "TSK_ID", value: task.TSK_ID, operator: "eq" }
                        ]
                    });
                });

            var i;
            if (followed) {
                for (i = 0; i < followed.length; i++)
                    $("#followed").tagsinput("add",
                        { id: followed[i].USR_CODE, text: followed[i].USR_DESC },
                        ["ignore"]);
            }

            DoAdditionalTaskThings();
        };
        var LoadOrganizationRecord = function (org) {
            return tms.Ajax({
                url: "/Api/ApiOrgs/Get",
                data: JSON.stringify(org),
                fn: function (d) {
                    orgrecord = d.data;
                }
            });
        };
        this.New = function () {
            if (window.history && window.history.pushState)
                window.history.pushState("forward", null, "/Task/New#no-back");

            self.Reset();
            DoAdditionalTaskThings();
        };
        this.Reset = function () {
            task = { TSK_ID: 0 };
            tms.Reset("#record");

            $("#taskno").val("");
            $("#org").val(organization !== "*" ? organization : "");
            $("#taskdep").val(!!customer ? "OPERASYON" : "").prop("disabled", !!customer);
            $("#type").val(!!customer ? "DIS" : "").prop("disabled", !!customer);
            $("#category").val("");
            $("#shortdesc").val("");
            $("#requestedby").val(user).prop("disabled", !!customer);
            $("#project").val("");
            $("#location").val("");
            $("#equipment").val("");
            $("#equipment").data("id", null);
            $("#equipmentrequired").prop("checked", false);
            $("#equipmentdesc").val("");
            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();
            $("#priority").data("selected", "NORMAL");
            $("#priority").val("NORMAL");
            $("#deadline").val("");
            $("#daterequested").val(tms.Now().format(constants.longdateformat)).prop("disabled", !!customer);
            $("#completed").val("");
            $("#closed").val("");
            $("#followed").tagsinput("removeAll");
            $("#followedcnt").text("");
            $("#reference").val("");
            $("#customer").val(!!customer ? (customer.split(",").length === 1 ? customer : "") : "");
            $("#customerdesc").val(!!customer ? (customer.split(",").length === 1 ? customerdesc : "") : "");
            $("#branch").val("");
            $("#branchdesc").val("");
            $("#datecreated").val(tms.Now().format(constants.longdateformat));
            $("#createdby").val(user);
            $("#holdreason").data("selected", "");
            $("#holddate").html("");
            $("#holddurationsum").html("");
            $("#holddurationcount").html("");
            $("#activeplanningdate").val("");
            $("#pspcode").val("");
            $("#prpcode").val("");
            $("#tasknote").val("");
            $("#contract").val("");
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");
            $("div.holdreasonctrl").addClass("hidden");
            $("#holdreason option:not(.default)").remove();
            $("#holdreason").removeAttr("required").removeClass("required");
            $("#holddurationsum").closest("div.row").addClass("hidden");
            $("#divperiodictask").addClass("hidden");

            $("#btnorg,#btnTaskDepartment").prop("disabled", false);
            $("#btnrequestedby,#btntype,#btnTaskDepartment").prop("disabled", !!customer);
            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");
            $("#btnDownload").attr("href", "#");

            if (!!customer) {
                tooltip.show("#taskdep", "Operasyon");
                tooltip.show("#type", "Dış görevler (müşteri talepleri)");
                $("#tasktype").attr("required", "required").addClass("required");
            } else {
                tooltip.hide("#taskdep");
                tooltip.hide("#type");
                $("#tasktype").removeAttr("required").removeClass("required");

            }

            tooltip.show("#requestedby", userdesc);
            if (organization !== "*")
                tooltip.show("#org", organizationdesc);
            tooltip.show("#createdby", userdesc);
            tooltip.hide("#category");
            tooltip.hide("#tasktype");
            tooltip.hide("#project");
            tooltip.hide("#location");
            tooltip.hide("#equipment");
            tooltip.hide("#customer");
            tooltip.hide("#branch");
            tooltip.hide("#contract");


            customFieldsHelper.clearCustomFields();
            taskCommentsHelper.clearComments();
            taskDocumentsHelper.clearDocuments();

            $("a>span.badge").remove();
            tms.ResetCompleted("#record");
        };
        this.LoadTask = function () {
            var path = tms.Path();
            switch (path.Action) {
                case "New":
                    self.Reset();
                    if (path.Param1) {
                        $("#type").val(initialType.Code);
                        tooltip.show("#type", initialType.Desc);
                    }
                    DoAdditionalTaskThings();
                    break;
                case "Record":
                    if (path.Param1) {
                        return $.when(FillTabCounts(path.Param1)).done(function () {
                            return $.when(tms.Ajax({ url: "/Api/ApiTask/Get", data: JSON.stringify(path.Param1) })).done(
                                function (d1) {
                                    return $.when(tms.Ajax({
                                        url: "/Api/ApiCategories/Get",
                                        data: JSON.stringify(d1.data.TSK_CATEGORY)
                                    })).done(function (d2) {
                                        d1.data.TSK_CATTSKTYPEREQUIRED = d2.data.CAT_TSKTYPEREQUIRED;
                                        FillUserInterface(d1);
                                        return LoadOrganizationRecord(d1.data.TSK_ORGANIZATION);
                                    });
                                });
                        });
                    }
                    break;
            }
        };
        this.Print = function () {
            $("#TaskId").val(task.TSK_ID);
            $("#modalprint").modal("show");
        }
    };
    var tac = new function () {
        var $grdTaskActivityChecklists = $("#grdTaskActivityChecklists");
        var grdTaskActivityChecklists = null;
        var self = this;

        var FillUserInterface = function () {

            tms.UnBlock("#taskactivitychecklistform");
            tms.BeforeFill("#taskactivitychecklists");

            $("#btnSaveTaskActivityChecklist").prop("disabled", true);
            $("#chkactivity").val(selectedtaskactivitychecklist.TAC_ACTIVITY);
            $("#chktemplate").val(selectedtaskactivitychecklist.TAC_CHKTMP);
            $("#chkdescription").val(selectedtaskactivitychecklist.TAC_DESCRIPTION);

            tooltip.show("#chkactivity", selectedtaskactivitychecklist.TAC_ACTIVITYDESC);
            tooltip.show("#chktemplate", selectedtaskactivitychecklist.TAC_CHKTMPDESC);

            $("#btnCompleteTaskActivityChecklist").prop("disabled", selectedtaskactivitychecklist.TAC_COMPLETED === "+");

            if (pstat === "C") tms.Block("#taskactivitychecklistform");

            chklist.Ready();

        };
        var LoadSelected = function () {
            tms.Ajax({
                url: "/Api/ApiTaskActivityChecklists/Get",
                data: JSON.stringify(selectedtaskactivitychecklist.TAC_ID),
                fn: function (d) {
                    selectedtaskactivitychecklist = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selectedtaskactivitychecklist = grdTaskActivityChecklists.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };

        var gridDataBound = function (e) {
            var data = grdTaskActivityChecklists.GetData();
            for (var i = 0; i < data.length; i++) {
                var di = data[i];
                if (di.TAC_AUTO === "+") {
                    $grdTaskActivityChecklists.find("tr[data-id=\"" + di.TAC_ID + "\"]").css({ background: "#ffdbdb", color: "#000" });
                }
                if (di.TAC_COMPLETED === "+") {
                    $grdTaskActivityChecklists.find("tr[data-id=\"" + di.TAC_ID + "\"]").css({ background: "#bbffd2", color: "#000" });
                }
            }
        }
        this.ResetUI = function () {
            selectedtaskactivitychecklist = null;
            chklist.ResetUI();

            tms.UnBlock("#taskactivitychecklistform");
            tms.Reset("#taskactivitychecklists");

            $("#btnSaveTaskActivityChecklist").prop("disabled", false);

            $("#chkactivity").val("");
            $("#chktemplate").val("");
            $("#chkdescription").val("");


            tooltip.hide("#chkactivity");
            tooltip.hide("#chktemplate");


            if (pstat === "C") tms.Block("#taskactivitychecklistform");
        };
        this.List = function () {
            var grdFilter = [
                { field: "TAC_TASK", value: task.TSK_ID, operator: "eq", logic: "and" },
                { field: "TAC_HIDDEN", value: "-", operator: "eq", logic: "and" }
            ];
            if (grdTaskActivityChecklists) {
                grdTaskActivityChecklists.ClearSelection();
                grdTaskActivityChecklists.RunFilter(grdFilter);
            } else {
                grdTaskActivityChecklists = new Grid({
                    keyfield: "TAC_ID",
                    columns: [
                        {
                            type: "number",
                            field: "TAC_ACTIVITY",
                            title: gridstrings.taskactivitychecklists[lang].activity,
                            width: 200,
                            format: "n2"
                        },
                        {
                            type: "string",
                            field: "TAC_ACTIVITYDESC",
                            title: gridstrings.taskactivitychecklists[lang].activitydesc,
                            width: 200,
                        },
                        {
                            type: "string",
                            field: "TAC_CHKTMP",
                            title: gridstrings.taskactivitychecklists[lang].template,
                            width: 200,
                        },
                        {
                            type: "string",
                            field: "TAC_CHKTMPDESC",
                            title: gridstrings.taskactivitychecklists[lang].templatedesc,
                            width: 200,
                        },
                        {
                            type: "string",
                            field: "TAC_DESCRIPTION",
                            title: gridstrings.taskactivitychecklists[lang].description,
                            width: 200,
                        },
                        {
                            type: "na",
                            field: "TAC_CHKLISTPROGRESS",
                            title: gridstrings.taskactivitychecklists[lang].chklistprogress,
                            width: 150,
                            template: "<div class=\"progress\">" +
                                "<div class=\"progress-bar progress-bar-striped #= tms.ProgressClass(TAC_CHKLISTPROGRESS) # progress-checklist\" role=\"progressbar\" aria-valuenow=\"#= TAC_CHKLISTPROGRESS #\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: #= TAC_CHKLISTPROGRESS #%;\">" +
                                "#= TAC_CHKLISTPROGRESS #%" +
                                "</div>" +
                                "</div>"
                        },
                        {
                            type: "string",
                            field: "TAC_COMPLETED",
                            title: gridstrings.taskactivitychecklists[lang].completed,
                            width: 200,
                        },
                        {
                            type: "string",
                            field: "TAC_SEQUENTIAL",
                            title: gridstrings.taskactivitychecklists[lang].sequential,
                            width: 200,
                        },
                        {
                            type: "string",
                            field: "TAC_AUTO",
                            title: gridstrings.taskactivitychecklists[lang].auto,
                            width: 200,
                        },
                        {
                            type: "datetime",
                            field: "TAC_CREATED",
                            title: gridstrings.taskactivitychecklists[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TAC_CREATEDBY",
                            title: gridstrings.taskactivitychecklists[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "TAC_UPDATED",
                            title: gridstrings.taskactivitychecklists[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TAC_UPDATEDBY",
                            title: gridstrings.taskactivitychecklists[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        TAC_ACTIVITY: { type: "number" },
                        TAC_CREATED: { type: "date" },
                        TAC_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiTaskActivityChecklists/List",
                    selector: "#grdTaskActivityChecklists",
                    name: "grdTaskActivityChecklists",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "TAC_ID", dir: "desc" }],
                    change: gridChange,
                    databound: gridDataBound,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Checklists.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#taskactivitychecklists"))
                return $.Deferred().reject();

            var mr = {
                TAC_ID: selectedmeterreading ? selectedmeterreading.TAC_ID : 0,
                TAC_TASK: task.TSK_ID,
                TAC_ACTIVITY: $("#chkactivity").val(),
                TAC_CHKTMP: $("#chktemplate").val(),
                TAC_DESCRIPTION: $("#chkdescription").val(),
                TAC_HIDDEN: selectedtaskactivitychecklist != null ? selectedtaskactivitychecklist.TAC_HIDDEN : "-",
                TAC_COMPLETED: selectedtaskactivitychecklist != null ? selectedtaskactivitychecklist.TAC_COMPLETED : "-",
                TAC_CREATED: selectedtaskactivitychecklist != null ? selectedtaskactivitychecklist.TAC_CREATED : tms.Now(),
                TAC_CREATEDBY: selectedtaskactivitychecklist != null ? selectedtaskactivitychecklist.TAC_CREATEDBY : user,
                TAC_UPDATED: selectedtaskactivitychecklist != null ? tms.Now() : null,
                TAC_UPDATEDBY: selectedtaskactivitychecklist != null ? user : null,
                TAC_RECORDVERSION: selectedtaskactivitychecklist != null ? selectedtaskactivitychecklist.TAC_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityChecklists/Save",
                data: JSON.stringify(mr),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedtaskactivitychecklist) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivityChecklists/DelRec",
                            data: JSON.stringify(selectedtaskactivitychecklist.TAC_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var RegisterTabEvents = function () {
            $("#btnSaveTaskActivityChecklist").click(self.Save);
            $("#btnAddTaskActivityChecklist").click(self.ResetUI);
            $("#btnDeleteTaskActivityChecklist").click(self.Delete);

            $("#btnchkactivity").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_ID",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#chkactivity",
                    columns: [
                        {
                            type: "string",
                            field: "TSA_LINE",
                            title: gridstrings.taskactivities[lang].line,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 100
                        }
                    ],
                    filter: [{ field: "TSA_TASK", value: task.TSK_ID, operator: "eq" }]
                });
            });
            $("#chkactivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function () { return task.TSK_ID; }, operator: "eq" }]
            });

            $("#btnchktemplate").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.checklisttemplate[lang].title,
                    listurl: "/Api/ApiChecklistTemplates/List",
                    keyfield: "CLT_CODE",
                    codefield: "CLT_CODE",
                    textfield: "CLT_DESC",
                    returninput: "#chktemplate",
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
                            width: 100
                        }
                    ],
                    filter: [
                        { field: "CLT_ACTIVE", value: "+", operator: "eq" },
                        { field: "CLT_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        $("#chkdescription").val(d ? d.CLT_DESC : "");
                    }
                });
            });
            $("#chktemplate").autocomp({
                listurl: "/Api/ApiChecklistTemplates/List",
                geturl: "/Api/ApiChecklistTemplates/Get",
                termisnumeric: false,
                field: "CLT_CODE",
                textfield: "CLT_DESC",
                active: "CLT_ACTIVE",
                filter: [
                    { field: "CLT_ORG", func: function () { return [$("#org").val(), "*"] }, operator: "in" }
                ],
                callback: function (d) {
                    $("#chkdescription").val(d ? d.CLT_DESC : "");
                }
            });
            $("#btnCompleteTaskActivityChecklist").click(function () {
                return tms.Ajax({
                    url: "/Api/ApiTaskActivityChecklists/Complete",
                    data: JSON.stringify(selectedtaskactivitychecklist.TAC_ID),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });
            });

        };
        RegisterTabEvents();
    }
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
                            case "bookedhours":
                                return "#btnSaveBookedHours";
                            case "closingcodes":
                                return "#btnSaveClosingCodes";
                            case "misccosts":
                                return "#btnSaveMiscCost";
                            case "meterreadings":
                                return "#btnSaveMeterReading";
                            case "toolusage":
                                return "#btnSaveToolUsage";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                            default:
                                tsk.Save();
                                break;
                            case "activities":
                                act.Save();
                                break;
                            case "bookedhours":
                                bh.Save();
                                break;
                            case "closingcodes":
                                cc.Save();
                                break;
                            case "misccosts":
                                mc.Save();
                                break;
                            case "meterreadings":
                                mr.Save();
                                break;
                            case "toolusage":
                                tu.Save();
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
                            case "bookedhours":
                                return "#btnAddBookedHours";
                            case "misccosts":
                                return "#btnAddMiscCost";
                            case "meterreadings":
                                return "#btnAddMeterReading";
                            case "toolusage":
                                return "#btnAddToolUsage";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                            default:
                                task.New();
                                break;
                            case "activities":
                                act.ResetUI();
                                break;
                            case "bookedhours":
                                bh.ResetUI();
                                break;
                            case "misccosts":
                                mc.ResetUI();
                                break;
                            case "meterreadings":
                                mr.ResetUI();
                                break;
                            case "toolusage":
                                tu.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        task.LoadTask();
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
                            case "bookedhours":
                                return "#btnDeleteBookedHours";
                            case "misccosts":
                                return "#btnDeleteMiscCost";
                            case "meterreadings":
                                return "#btnDeleteMeterReading";
                            case "toolusage":
                                return "#btnDeleteToolUsage";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                            default:
                                tsk.Remove();
                                break;
                            case "activities":
                                act.Delete();
                                break;
                            case "bookedhours":
                                bh.Delete();
                                break;
                            case "misccosts":
                                mc.Delete();
                                break;
                            case "meterreadings":
                                mr.Delete();
                                break;
                            case "toolusage":
                                tu.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        HistoryModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(tsk.LoadTask()).done(function () {
                switch (tms.ActiveTab()) {
                    case "activities":
                        act.List();
                        act.ResetUI();
                        break;
                    case "bookedhours":
                        bh.List();
                        bh.ResetUI();
                        break;
                    case "closingcodes":
                        cc.LoadTaskClosingCodes();
                        cc.ResetUI();
                        break;
                    case "parts":
                        pt.List();
                        pt.ResetUI();
                        break;
                    case "misccosts":
                        mc.List();
                        mc.ResetUI();
                        break;
                    case "meterreadings":
                        mr.List();
                        mr.ResetUI();
                        break;
                    case "toolusage":
                        tu.List();
                        tu.ResetUI();
                        break;
                    case "planning":
                        pln.part.List();
                        pln.part.ResetUI();
                        break;
                    case "progresspayment":
                        pp.List();
                        break;
                    case "tasktrx":
                        tsktrx.List();
                        break;
                    case "pricing":
                        $.when(tskpricing.GeneratePricing(task.TSK_ID)).done(function () {
                            tskpricing.List();
                        });
                        break;
                    case "taskactivitychecklists":
                        tac.List();
                        tac.ResetUI();
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
                    if (task.TSK_ID) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
        this.ContextMenu = function () {
            $.contextMenu({
                selector: "#record,#activities",
                build: function ($trigger, e) {
                    if (e.target.nodeName === "DIV")
                        return {
                            zIndex: 10,
                            items: {
                                quotation: {
                                    name: applicationstrings[lang].quotations,
                                    disabled: function (key, opt) {
                                        return task.TSK_QUOTATION == "-";
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html('<span><i class="fa fa-usd" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return true;                                       
                                    },
                                    callback: function () {
                                        var win = window.open("/Quotations/ListByTask/" + task.TSK_ID, "_blank");
                                    }
                                },
                                newquotation: {
                                    name: applicationstrings[lang].newquotation,
                                    disabled: function (key, opt) {
                                        switch (tms.ActiveTab()) {
                                            case "record":
                                                return pstat === "C";
                                                break;
                                            case "activities":
                                                return (!selectedactivity ||
                                                    act.Check.CheckIfActivityCompletedOrRejected());
                                                break;
                                        }
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                       
                                        var win = window.open("/Quotations/NewByTask/" +
                                            task.TSK_ID +
                                            (selectedactivity && !act.Check.CheckIfActivityCompletedOrRejected() ? "/" + selectedactivity.TSA_LINE : ""),
                                            "_blank");
                                    }
                                },
                                
                                quotationdetails: {
                                    name: "Teklif Detayları",

                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        gridModal.show({
                                            modaltitle: "Teklif Detayları",
                                            listurl: "/Api/ApiQuotations/List",
                                            keyfield: "QUO_ID",
                                            returninput: "quotationdetails",
                                            columns: [
                                                {
                                                    type: "number",
                                                    field: "QUO_ID",
                                                    title: gridstrings.quotations[lang].quotationno,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_DESCRIPTION",
                                                    title: gridstrings.quotations[lang].description,
                                                    width: 350
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_ORGANIZATION",
                                                    title: gridstrings.quotations[lang].organization,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_ORGANIZATIONDESC",
                                                    title: gridstrings.quotations[lang].organizationdesc,
                                                    width: 250
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_TYPE",
                                                    title: gridstrings.quotations[lang].type,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_TYPEDESC",
                                                    title: gridstrings.quotations[lang].typedesc,
                                                    width: 250
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_STATUS",
                                                    title: gridstrings.quotations[lang].status,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_STATUSDESC",
                                                    title: gridstrings.quotations[lang].statusdesc,
                                                    width: 250
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_SUPPLIER",
                                                    title: gridstrings.quotations[lang].supplier,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_SUPPLIERDESC",
                                                    title: gridstrings.quotations[lang].supplierdesc,
                                                    width: 350
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_PMDESC",
                                                    title: gridstrings.quotations[lang].pm,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_REVNO",
                                                    title: gridstrings.quotations[lang].revision,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_REFERENCENO",
                                                    title: gridstrings.quotations[lang].referenceno,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_CANCELLATIONREASON",
                                                    title: gridstrings.quotations[lang].cancellationreason,
                                                    width: 300
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_PAYMENTDUE",
                                                    title: gridstrings.quotations[lang].paymentdue,
                                                    width: 200
                                                },
                                                {
                                                    type: "date",
                                                    field: "QUO_SUPPLYPERIOD",
                                                    title: gridstrings.quotations[lang].supplyperiod,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_REMINDINGPERIOD",
                                                    title: gridstrings.quotations[lang].reminding,
                                                    width: 200
                                                },
                                                {
                                                    type: "price",
                                                    field: "QUO_PARTPURCHASE",
                                                    title: gridstrings.quotations[lang].partpurchase,
                                                    width: 200
                                                },
                                                {
                                                    type: "price",
                                                    field: "QUO_SERVICEPURCHASE",
                                                    title: gridstrings.quotations[lang].servicepurchase,
                                                    width: 200
                                                },
                                                {
                                                    type: "price",
                                                    field: "QUO_TOTALPURCHASE",
                                                    title: gridstrings.quotations[lang].totalpurchase,
                                                    width: 200
                                                },
                                                {
                                                    type: "price",
                                                    field: "QUO_PARTSALES",
                                                    title: gridstrings.quotations[lang].partsales,
                                                    width: 200
                                                },
                                                {
                                                    type: "price",
                                                    field: "QUO_SERVICESALES",
                                                    title: gridstrings.quotations[lang].servicesales,
                                                    width: 200
                                                },
                                                {
                                                    type: "price",
                                                    field: "QUO_TOTALSALES",
                                                    title: gridstrings.quotations[lang].totalsales,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_CURR",
                                                    title: gridstrings.quotations[lang].curr,
                                                    width: 200
                                                },
                                                {
                                                    type: "exch",
                                                    field: "QUO_EXCH",
                                                    title: gridstrings.quotations[lang].exch,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_TASK",
                                                    title: gridstrings.quotations[lang].task,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_TASKDESC",
                                                    title: gridstrings.quotations[lang].taskdescription,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_TASKREFERENCE",
                                                    title: gridstrings.quotations[lang].taskreference,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_PROJECT",
                                                    title: gridstrings.quotations[lang].project,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_PROJECTDESC",
                                                    title: gridstrings.quotations[lang].projectdescription,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_ACTIVITY",
                                                    title: gridstrings.quotations[lang].activity,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_CUSTOMER",
                                                    title: gridstrings.quotations[lang].customer,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_CUSTOMERDESC",
                                                    title: gridstrings.quotations[lang].customerdesc,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_BRANCH",
                                                    title: gridstrings.quotations[lang].branch,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_BRANCHDESC",
                                                    title: gridstrings.quotations[lang].branchdesc,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_BRANCHREFERENCE",
                                                    title: gridstrings.quotations[lang].branchreference,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_LOCATION",
                                                    title: gridstrings.quotations[lang].location,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_LOCATIONDESC",
                                                    title: gridstrings.quotations[lang].locationdesc,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "QUO_VALIDITYPERIOD",
                                                    title: gridstrings.quotations[lang].validityperiod,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_CREATEDBY",
                                                    title: gridstrings.quotations[lang].createdby,
                                                    width: 250
                                                },
                                                {
                                                    type: "datetime",
                                                    field: "QUO_CREATED",
                                                    title: gridstrings.quotations[lang].created,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "QUO_UPDATEDBY",
                                                    title: gridstrings.quotations[lang].updatedby,
                                                    width: 250
                                                },
                                                {
                                                    type: "datetime",
                                                    field: "QUO_UPDATED",
                                                    title: gridstrings.quotations[lang].updated,
                                                    width: 200
                                                }
                                            ],
                                            fields: {
                                                
                                                QUO_ID: { type: "number" },
                                                QUO_PAYMENTDUE: { type: "number" },
                                                QUO_SUPPLYPERIOD: { type: "date" },
                                                QUO_PARTPURCHASE: { type: "number" },
                                                QUO_SERVICEPURCHASE: { type: "number" },
                                                QUO_TOTALPURCHASE: { type: "number" },
                                                QUO_PARTSALES: { type: "number" },
                                                QUO_SERVICESALES: { type: "number" },
                                                QUO_TOTALSALES: { type: "number" },
                                                QUO_CREATED: { type: "date" },
                                                QUO_UPDATED: { type: "date" },
                                                QUO_REMINDINGPERIOD: { type: "number" },
                                                QUO_ACTIVITY: { type: "number" },
                                                QUO_REVNO: { type: "number" },
                                                QUO_VALIDITYPERIOD: { type: "number" },
                                                QUO_EXCH: { type: "number" }
                                            
                                            },
                                            sort: [
                                                { field: "QUO_ID", dir: "desc" }
                                            ],
                                            filter: [{ field: "QUO_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }],
                                        });
                                    }
                                },
                                sep1: !customer ? "---------" : { visible: false },
                                supervision: {
                                    name: applicationstrings[lang].supervisions,
                                    disabled: function (key, opt) {
                                        return task.TSK_SUPERVISION == "-";
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/Supervision/ListByTask/" + task.TSK_ID, "_blank");
                                    }
                                },
                                newsupervision: {
                                    name: applicationstrings[lang].newsupervision,
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/Supervision/NewByTask/" + task.TSK_ID, "_blank");
                                    }
                                },
                                sep2: !customer ? "---------" : { visible: false },
                                purchaseorders: {
                                    name: applicationstrings[lang].purchaseorderrequisitions,
                                    disabled: function (key, opt) {
                                        return task.TSK_PURCHASEORDERREQ == "-";
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/PurchaseOrders/ListByTask/" + task.TSK_ID);
                                    }
                                },
                                newpurchaseorder: {
                                    name: applicationstrings[lang].newpurchaseorderrequisition,
                                    disabled: function (key, opt) {
                                        if (task) return false;
                                        //switch (tms.ActiveTab()) {
                                        //    case "activities":
                                        //        return false;
                                        //}

                                        return true;
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                       
                                            var win = window.open("/PurchaseOrders/NewByTask/" +
                                                task.TSK_ID +
                                                (selectedactivity ? "/" + selectedactivity.TSA_LINE : ""),
                                                "_blank");
                                       
                                       
                                    }
                                },
                                purchaseorderdetails: {
                                    name: applicationstrings[lang].prqdetails,
                                    disabled: function (key, opt) {
                                        return task.TSK_PURCHASEORDERREQ == "-";
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    }, 
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        gridModal.show({
                                            modaltitle: applicationstrings[lang].prqdetails,
                                            listurl: "/Api/ApiPurchaseOrderRequisitions/List",
                                            keyfield: "PRQ_ID",
                                            returninput: "prqdetails",
                                            columns: [
                                                {
                                                    type: "number",
                                                    field: "PRQ_ID",
                                                    title: gridstrings.purchaseorders[lang].purchaseorderid,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_DESCRIPTION",
                                                    title: gridstrings.purchaseorders[lang].description,
                                                    width: 350
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_ORG",
                                                    title: gridstrings.purchaseorders[lang].organization,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_TYPE",
                                                    title: gridstrings.purchaseorders[lang].type,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_STATUS",
                                                    title: gridstrings.purchaseorders[lang].status,
                                                    width: 250
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_STATUSDESC",
                                                    title: gridstrings.purchaseorders[lang].statusdesc,
                                                    width: 250
                                                },
                                                {
                                                    type: "number",
                                                    field: "PRQ_QUOTATION",
                                                    title: gridstrings.purchaseorders[lang].quo,
                                                    width: 250
                                                },
                                                {
                                                    type: "number",
                                                    field: "PRQ_TASK",
                                                    title: gridstrings.purchaseorders[lang].task,
                                                    width: 250
                                                },
                                                {
                                                    type: "number",
                                                    field: "PRQ_TASKACTIVITY",
                                                    title: gridstrings.purchaseorders[lang].activity,
                                                    width: 250
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_TASKREGION",
                                                    title: gridstrings.purchaseorders[lang].region,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_WAREHOUSE",
                                                    title: gridstrings.purchaseorders[lang].warehouse,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_REQUESTEDBY",
                                                    title: gridstrings.purchaseorders[lang].requestedby,
                                                    width: 200
                                                },
                                                {
                                                    type: "datetime",
                                                    field: "PRQ_REQUESTED",
                                                    title: gridstrings.purchaseorders[lang].reqdate,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_SUPPLIER",
                                                    title: gridstrings.purchaseorders[lang].supplier,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_CURRENCY",
                                                    title: gridstrings.purchaseorders[lang].currency,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "PRQ_EXCHANGERATE",
                                                    title: gridstrings.purchaseorders[lang].exchangerate,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_CREATEDBY",
                                                    title: gridstrings.purchaseorders[lang].createdby,
                                                    width: 200
                                                },
                                                {
                                                    type: "datetime",
                                                    field: "PRQ_CREATED",
                                                    title: gridstrings.purchaseorders[lang].created,
                                                    width: 200
                                                },
                                                {
                                                    type: "string",
                                                    field: "PRQ_UPDATEDBY",
                                                    title: gridstrings.purchaseorders[lang].updatedby,
                                                    width: 200
                                                },
                                                {
                                                    type: "datetime",
                                                    field: "PRQ_UPDATED",
                                                    title: gridstrings.purchaseorders[lang].updated,
                                                    width: 200
                                                },
                                                {
                                                    type: "number",
                                                    field: "PRQ_RECORDVERSION",
                                                    title: gridstrings.purchaseorders[lang].recordversion,
                                                    width: 200
                                                }
                                            ],
                                            fields:
                                            {
                                                PRQ_ID: { type: "number" },
                                                PRQ_QUOTATION: { type: "number" },
                                                PRQ_EXCHANGERATE: { type: "number" },
                                                PRQ_CREATED: { type: "date" },
                                                PRQ_REQUESTED: { type: "date" },
                                                PRQ_UPDATED: { type: "date" }
                                            },
                                            sort: [
                                                { field: "PRQ_ID", dir: "desc" }
                                            ],
                                            filter: [{ field: "PRQ_TASK", value: task.TSK_ID, operator: "eq", logic: "and" }],
                                        });
                                    }
                                },
                                sep3: !customer ? "---------" : { visible: false },
                                sendback: {
                                    name: applicationstrings[lang].sendback,
                                    disabled: function (key, opt) {
                                        if (tms.ActiveTab() !== "activities") return true;
                                        if (!selectedactivity) return true;
                                        if (selectedactivity.TSA_CHK02 !== "+") return true;
                                        if (currentpcode === "C") return true;
                                        return false;
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        $("#modalsendback").modal("show");
                                    }
                                },
                                sep4: !customer ? "---------" : { visible: false },
                                quototask: {
                                    name: applicationstrings[lang].quototask,
                                    disabled: function (key, opt) {
                                        if (tms.ActiveTab() !== "activities") return true;
                                        if (!selectedactivity) return true;
                                        if (currentpcode === "C") return true;
                                        if (!selectedquotation) return true;
                                        return false;
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer && tms.ActiveTab() === "activities";
                                    },
                                    callback: function () {
                                        $("#quototaskdiv").modal("show");
                                        quototask.ListQuotations();
                                    }
                                }
                            }
                        };
                    else if (e.target.nodeName === "IMG") {
                        var src = e.target.src;
                        return {
                            zIndex: 10,
                            items: {
                                openlinkinnewwindow: {
                                    name: applicationstrings[lang].openlinkinnewwindow,
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-external-link" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    callback: function (itemKey, opt) {
                                        var win = window.open(src.newUrl(["id", "guid"]), "_blank");
                                    }
                                }
                            }
                        };
                    }
                    return false;
                }
            });
        }
    };

    function ready() {
        scr.ContextMenu();
        tsk.BuildUI();
    }

    $(document).ready(ready);
}());