(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var entrustid = null;
    var part = null
    var equipment=null;
    var scr, etr, tsk, enp, eeq;

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
            name: "entrustpart",
            btns: []
        },
        {
            name: "entrustequipments",
            btns: []
        }
    ];

    etr = new function () {
        var self = this;
        var grdEntrusts = null;
        var grdEntrustsElm = $("#grdEntrusts");

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMENTRUSTS", operator: "eq" },
                    { field: "AUD_REFID", value: entrustid, operator: "eq" }
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
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        tooltip.hide("#type");
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
                        { field: "TYP_ENTITY", value: "ENTRUST", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            if (entrustid)
                                customFieldsHelper.loadCustomFields({
                                    subject: "ENTRUST",
                                    source: entrustid,
                                    type: data.TYP_CODE
                                });
                        }
                    }
                });
            });
            $("#btnpersonal").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#personal",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
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
                    $("#type").val("");
                    tooltip.hide("#type");
                    if (data) {
                        $("#org").val(data.ORG_CODE).trigger("change");
                        tooltip.show("#org", data.ORG_DESCF);
                    }
                }
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
                    { field: "TYP_ENTITY", value: "ENTRUST", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        if (entrustid)
                            customFieldsHelper.loadCustomFields({
                                subject: "ENTRUST",
                                source: entrustid,
                                type: data.TYP_CODE
                            });
                    }
                }
            });
            $("#personal").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_ORG", func: function () { return [$("#org").val(), "*"]; }, operator: "in" },
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "ENTRUST",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    RequestedBy: $("#createdby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-pcode=\"" +
                            status.pcode +
                            "\" data-code=\"" +
                            status.code +
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
                            strOption += "<option data-pcode=\"" +
                                di.SAU_PTO +
                                "\" data-code=\"" +
                                di.SAU_TO +
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
        var EvaluateCurrentStatus = function () {
            var statusctrl = $("#status");
            var selectedoption = statusctrl.find("option:selected");
            var currentcode = statusctrl.data("code");
            var currentpcode = statusctrl.data("pcode");
            var code = selectedoption.data("code");
            var pcode = selectedoption.data("pcode");
            switch (currentpcode) {
                case "C":
                    $("#cfcontainer").find("input,select,button").prop("disabled", true);
                    $("#record").find("input,select,button").prop("disabled", true);
                    $("#status").prop("disabled", false);
                    break;

                default:
                    $("#record [disableoncomplete]").prop("disabled", false);
                    break;
            }

            if (selectedrecord) {
                $("#divcancellationreason").addClass("hidden");
                $("#cancellationreason").removeAttr("required").removeClass("required");
                switch (code) {
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        $("#cancellationreason").attr("required", "").addClass("required");
                        break;
                }
            }
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            


            var o = JSON.stringify({
                ETR_ID: (entrustid || 0),
                ETR_DESC: $("#endesc").val(),
                ETR_ORG: $("#org").val(),
                ETR_TYPEENTITY: "ENTRUST",
                ETR_TYPE: $("#type").val(),
                ETR_STATUSENTITY: "ENTRUST",
                ETR_STATUS: $("#status").val(),
                ETR_USER: $("#personal").val(),
                ETR_CREATED: selectedrecord != null ? selectedrecord.ETR_CREATED : tms.Now(),
                ETR_CREATEDBY: selectedrecord != null ? selectedrecord.ETR_CREATEDBY : user,
                ETR_UPDATED: selectedrecord != null ? tms.Now() : null,
                ETR_UPDATEDBY: selectedrecord != null ? user : null,
                ETR_RECORDVERSION: selectedrecord != null ? selectedrecord.ETR_RECORDVERSION : 0
            });



            if ($("#status").val() != "A") {
                if (part == false && equipment == false) {
                    msgs.error(applicationstrings[lang].partorequiperr);
                } else {
                    tms.Ajax({
                        url: "/Api/ApiEntrusts/Save",
                        data: o,
                        fn: function(d) {
                            msgs.success(d.data);
                            entrustid = d.r.ETR_ID;
                            self.List();
                            return self.LoadSelected();
                        }
                    });
                }
            }
            else {
                tms.Ajax({
                    url: "/Api/ApiEntrusts/Save",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        entrustid = d.r.ETR_ID;
                        self.List();
                        return self.LoadSelected();
                    }
                });
            }
        };
        this.CheckPartAndEquipment = function () {
            part = null
            equipment = null;

            tms.Ajax({
                url: "/Api/ApiEntrustEquipments/GetByEntrust",
                data: JSON.stringify(entrustid),
                fn: function (d) {
                    if (d.data == null) {
                        equipment = false;
                    }
                }
            });

            tms.Ajax({
                url: "/Api/ApiEntrustParts/GetByEntrust",
                data: JSON.stringify(entrustid),
                fn: function (d) {
                    if (d.data == null) {
                        part = false;
                    }
                }
            });
        };
        this.Delete = function () {
            if (entrustid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiEntrusts/DelRec",
                            data: JSON.stringify(entrustid),
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
            selectedrecord = null;
            entrustid = null;

            tms.Reset("#record");
            customFieldsHelper.clearCustomFields();

            $("#enid").val("");
            $("#org").val("");
            $("#endesc").val("");
            $("#type").val("");
            $("#personal").val("");
            $("#createdby").val("");
            $("#created").val("");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#endesc").prop("disabled", false);
            $("#status option").remove();

            tooltip.hide("#type");
            tooltip.hide("#org");

        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            self.CheckPartAndEquipment();
            $("#endesc").prop("disabled", false);


            $("#enid").val(selectedrecord.ETR_ID);
            $("#org").val(selectedrecord.ETR_ORG);
            $("#endesc").val(selectedrecord.ETR_DESC);
            $("#type").val(selectedrecord.ETR_TYPE);
            $("#personal").val(selectedrecord.ETR_USER);
            $("#created").val(selectedrecord.ETR_CREATED);
            $("#createdby").val(selectedrecord.ETR_CREATEDBY);

            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);


            tooltip.show("#org", selectedrecord.ETR_ORGDESC);
            tooltip.show("#type", selectedrecord.ETR_TYPEDESC);

            $.when(customFieldsHelper.loadCustomFields({ subject: "ENTRUST", source: selectedrecord.ETR_ID, type: selectedrecord.ETR_TYPE })).done(function () {
                $.when(LoadStatuses({ pcode: selectedstatus.STA_PCODE, code: selectedstatus.STA_CODE, text: selectedstatus.STA_DESCF })).done(function () {
                    EvaluateCurrentStatus();
                });
            });

        };
        this.LoadSelected = function() {
            return tms.Ajax({
                url: "/Api/ApiEntrusts/Get",
                data: JSON.stringify(entrustid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({
                        subject: "ENTRUST",
                        source: entrustid,
                        type: $("#type").val()
                    });
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdEntrusts.GetRowDataItem(row);
            entrustid = selectedrecord.ETR_ID;
            $(".page-header h6").html(selectedrecord.ETR_ID + " - " + selectedrecord.ETR_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdEntrustsElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdEntrusts) {
                grdEntrusts.ClearSelection();
                grdEntrusts.RunFilter(gridfilter);
            } else {
                grdEntrusts = new Grid({
                    keyfield: "ETR_ID",
                    columns: [
                        {
                            type: "number",
                            field: "ETR_ID",
                            title: gridstrings.entrusts[lang].entrustid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "ETR_DESC",
                            title: gridstrings.entrusts[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "ETR_ORG",
                            title: gridstrings.entrusts[lang].org,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "ETR_ORGDESC",
                            title: gridstrings.entrusts[lang].orgdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "ETR_TYPE",
                            title: gridstrings.entrusts[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "ETR_TYPEDESC",
                            title: gridstrings.entrusts[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "ETR_STATUS",
                            title: gridstrings.entrusts[lang].status,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "ETR_STATUSDESC",
                            title: gridstrings.entrusts[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "ETR_USER",
                            title: gridstrings.entrusts[lang].personal,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "ETR_CREATEDBY",
                            title: gridstrings.entrusts[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "ETR_CREATED",
                            title: gridstrings.entrusts[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "ETR_UPDATEDBY",
                            title: gridstrings.entrusts[lang].updatedby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "ETR_UPDATED",
                            title: gridstrings.entrusts[lang].updated,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        ETR_ID: { type: "number" },
                        ETR_CREATED: { type: "date" },
                        ETR_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiEntrusts/List",
                    selector: "#grdEntrusts",
                    name: "grdEntrusts",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "ETR_ID",
                    primarytextfield: "ETR_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "ETR_ID", dir: "asc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"contracts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        etr.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            etr.ResetUI();
                        else
                            etr.LoadSelected();
                        break;
                    case "#entrustpart":
                        enp.Ready();
                        break;
                    case "#entrustequipments":
                        eeq.Ready();
                        break;
                }

                scr.Configure();
            });
        };
        var RegisterTabEvents = function () {
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#status").on("change", EvaluateCurrentStatus);
            $("[loadstatusesonchange=\"yes\"]").on("change", function () {
                LoadStatuses({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")
                });
            });

            RegisterTabChange();

            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            self.List();
            if (!entrustid)
                $("#btnBrowse").attr("disabled", "disabled");

           
        };

        RegisterTabEvents();
    };
    enp = new function () {
        var grdEntrustParts = null;
        var $grdEntrustParts = $("#grdEntrustParts");
        var selectedEntrustPart = null;
        var self = this;

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


        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMENTRUSTPARTS", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.ETR_ID, operator: "eq" }
                ]
            });
        };
        var FillUI = function () {
            if (selectedEntrustPart) {
                tms.BeforeFill("#entrustpart");


                $("#enpart").data("id", selectedEntrustPart.ENP_PART);
                $("#enpart").val(selectedEntrustPart.ENP_PARTCODE);
                $("#enpartdesc").val(selectedEntrustPart.ENP_PARTDESC);
                $("#enpartuom").val(selectedEntrustPart.ENP_QUANTITY);

                tooltip.show("#enpart", selectedEntrustPart.ENP_PARTCODE);
            }
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiEntrustParts/Get",
                data: JSON.stringify(selectedEntrustPart.ENP_ID),
                fn: function (d) {
                    selectedEntrustPart = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedEntrustPart = grdEntrustParts.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            var data = grdEntrustParts.GetData();
            //$grdEntrustParts.find("#btnPartPriceHistory").off("click").on("click", HistoryModal);
        }
        this.List = function () {
            var grdFilter = [
                { field: "ENP_ENTRUSTID", value: selectedrecord.ETR_ID, operator: "eq", logic: "and" }
            ];
            if (grdEntrustParts) {
                grdEntrustParts.ClearSelection();
                grdEntrustParts.RunFilter(grdFilter);
            } else {
                grdEntrustParts = new Grid({
                    keyfield: "ENP_ID",
                    columns: [
                        {
                            type: "number",
                            field: "ENP_ENTRUSTID",
                            title: gridstrings.entrustparts[lang].entrustid,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "ENP_ENTRUSTDESC",
                            title: gridstrings.entrustparts[lang].entrustdesc,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "ENP_PARTCODE",
                            title: gridstrings.entrustparts[lang].partcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "ENP_PARTDESC",
                            title: gridstrings.entrustparts[lang].partdesc,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "ENP_QUANTITY",
                            title: gridstrings.entrustparts[lang].quantity,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "ENP_CREATED",
                            title: gridstrings.entrustparts[lang].created,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "ENP_CREATEDBY",
                            title: gridstrings.entrustparts[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "ENP_UPDATED",
                            title: gridstrings.entrustparts[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "ENP_UPDATEDBY",
                            title: gridstrings.entrustparts[lang].updatedby,
                            width: 150
                        }
                    ],
                    fields:
                    {
                        ENP_ENTRUSTID: { type: "number" },
                        ENP_QUANTITY: { type: "number" },
                        ENP_CREATED: { type: "date" },
                        ENP_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiEntrustParts/List",
                    selector: "#grdEntrustParts",
                    name: "grdEntrustParts",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "ENP_ID", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"PartPrices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnPartPriceHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"

                        ]
                    },
                    change: gridChange,
                    databound: gridDataBound
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#entrustpart"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                ENP_ID: (selectedEntrustPart != null ? selectedEntrustPart.ENP_ID : 0),
                ENP_ENTRUSTID: selectedrecord.ETR_ID,
                ENP_PART: $("#enpart").data("id"),
                ENP_QUANTITY: $("#enpartuom").val(),
                ENP_CREATED: selectedEntrustPart != null ? selectedEntrustPart.ENP_CREATED : tms.Now(),
                ENP_CREATEDBY: selectedEntrustPart != null ? selectedEntrustPart.ENP_CREATEDBY : user,
                ENP_UPDATED: selectedEntrustPart != null ? tms.Now() : null,
                ENP_UPDATEDBY: selectedEntrustPart != null ? user : null,
                ENP_RECORDVERSION: selectedEntrustPart != null ? selectedEntrustPart.ENP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiEntrustParts/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedEntrustPart) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiEntrustParts/DelRec",
                            data: JSON.stringify(selectedEntrustPart.ENP_ID),
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
            selectedEntrustPart = null;
            tms.Reset("#entrustpart");

            $("#enpart").val("");
            $("#enpart").data("id", null);
            $("#enpartdesc").val("");
            $("#enpartuom").val("");

        };
        var AutoComplete = function () {
            $("#enpart").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                filter: [{ field: "PAR_ORG", func: function () { return ["*", selectedrecord.ETR_ORG]; }, operator: "in" }],
                callback: function (d) {
                    $("#enpart").data("id", d ? d.PAR_ID : null);
                    $("#enpartdesc").val(d ? d.PAR_DESC : "");
                }
            });
        };
        var LookupButtons = function () {
            $("#btnenpart").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_ID",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#enpart",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 300 }
                    ],
                    filter: [{ field: "PAR_ORG", value: ["*", selectedrecord.ETR_ORG], operator: "in" }],
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
                        $("#enpart").data("id", (d ? d.PAR_ID : null));
                        $("#enpartdesc").val((d ? d.PAR_DESC : ""));
                        $("#enpart").val((d ? d.PAR_CODE : ""));
                    }
                });
            });
        };
        var RegisterTabEvents = function () {
            $("#btnAddEntrustPart").click(self.ResetUI);
            $("#btnSaveEntrustPart").click(self.Save);
            $("#btnDeleteEntrustPart").click(self.Delete);

            AutoComplete();
            LookupButtons();
        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };
        RegisterTabEvents();
    };
    eeq = new function () {
        var grdEntrustEquipments = null;
        var $grdEntrustEquipments = $("#grdEntrustEquipments");
        var selectedEntrustEquipment = null;
        var self = this;


        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMENTRUSTEQUIPMENTS", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.ETR_ID, operator: "eq" }
                ]
            });
        };
        var FillUI = function () {
            if (selectedEntrustEquipment) {
                tms.BeforeFill("#entrustequipments");


                $("#enequipment").val(selectedEntrustEquipment.EEQ_EQUIPMENTCODE);
                $("#enequipment").data("id", selectedEntrustEquipment.EEQ_EQUIPMENT);
                $("#equipmenthealth").val(selectedEntrustEquipment.EEQ_HEALTH);
                $("#enequipmentdesc").val(selectedEntrustEquipment.EEQ_EQUIPMENTDESC);

                tooltip.show("#enequipment", selectedEntrustEquipment.EEQ_EQUIPMENTDESC);
                tooltip.show("#equipmenthealth", selectedEntrustEquipment.EEQ_HEALTHDESC );

            }
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiEntrustEquipments/Get",
                data: JSON.stringify(selectedEntrustEquipment.EEQ_ID),
                fn: function (d) {
                    selectedEntrustEquipment = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedEntrustEquipment = grdEntrustEquipments.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            var data = grdEntrustEquipments.GetData();
            //$grdEntrustParts.find("#btnPartPriceHistory").off("click").on("click", HistoryModal);
        }
        this.List = function () {
            var grdFilter = [
                { field: "EEQ_ENTRUSTID", value: selectedrecord.ETR_ID, operator: "eq", logic: "and" }
            ];
            if (grdEntrustEquipments) {
                grdEntrustEquipments.ClearSelection();
                grdEntrustEquipments.RunFilter(grdFilter);
            } else {
                grdEntrustEquipments = new Grid({
                    keyfield: "EEQ_ID",
                    columns: [
                        {
                            type: "number",
                            field: "EEQ_ENTRUSTID",
                            title: gridstrings.entrustequipments[lang].entrustid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "EEQ_ENTRUSTDESC",
                            title: gridstrings.entrustequipments[lang].entrustdesc,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "EEQ_EQUIPMENT",
                            title: gridstrings.entrustequipments[lang].equipment,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "EEQ_EQUIPMENTDESC",
                            title: gridstrings.entrustequipments[lang].equipmentdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EEQ_HEALTHDESC",
                            title: gridstrings.entrustequipments[lang].equipmenthealth,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "EEQ_CREATED",
                            title: gridstrings.entrustequipments[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "EEQ_CREATEDBY",
                            title: gridstrings.entrustequipments[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "EEQ_UPDATED",
                            title: gridstrings.entrustequipments[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "EEQ_UPDATEDBY",
                            title: gridstrings.entrustequipments[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        EEQ_ENTRUSTID: { type: "number" },
                        EEQ_EQUIPMENT: { type: "number" },
                        EEQ_CREATED: { type: "datetime" },
                        EEQ_UPDATED: { type: "datetime" }
                    },
                    datasource: "/Api/ApiEntrustEquipments/List",
                    selector: "#grdEntrustEquipments",
                    name: "grdEntrustEquipments",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "EEQ_ID", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"PartPrices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnPartPriceHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"

                        ]
                    },
                    change: gridChange,
                    databound: gridDataBound
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#entrustequipments"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                EEQ_ID: selectedEntrustEquipment ? selectedEntrustEquipment.EEQ_ID : 0,
                EEQ_ENTRUSTID: selectedrecord.ETR_ID,
                EEQ_EQUIPMENT: ($("#enequipment").data("id")),
                EEQ_HEALTH: $("#equipmenthealth").val(),
                EEQ_CREATED: selectedEntrustEquipment != null ? selectedEntrustEquipment.EEQ_CREATED : tms.Now(),
                EEQ_CREATEDBY: selectedEntrustEquipment != null ? selectedEntrustEquipment.EEQ_CREATEDBY : user,
                EEQ_UPDATED: selectedEntrustEquipment != null ? tms.Now() : null,
                EEQ_UPDATEDBY: selectedEntrustEquipment != null ? user : null,
                EEQ_RECORDVERSION: selectedEntrustEquipment != null ? selectedEntrustEquipment.EEQ_RECORDVERSION : 0

            });

            return tms.Ajax({
                url: "/Api/ApiEntrustEquipments/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedEntrustEquipment) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiEntrustEquipments/DelRec",
                            data: JSON.stringify(selectedEntrustEquipment.EEQ_ID),
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
            selectedEntrustEquipment = null;
            tms.Reset("#entrustequipments");

            $("#enequipment").val("");
            $("#enequipment").data("id", null);
            $("#enequipmentdesc").val("");
            $("#equipmenthealth").val("");


            tooltip.hide("#enequipment");
            tooltip.hide("#equipmenthealth");

        };
        var AutoComplete = function () {
            $("#enequipment").autocomp({
                listurl: "/Api/ApiEquipments/List",
                geturl: "/Api/ApiEquipments/Get",
                field: "EQP_CODE",
                textfield: "EQP_DESC",
                active: "EQP_ACTIVE",
                filter: [
                    { field: "EQP_ORG", func: function () { return [selectedrecord.ETR_ORG, "*"]; }, operator: "in" }
                ],
                callback: function (d) {
                    tooltip.hide("#enequipment");
                    $("#enequipment").data("id", (d ? d.EQP_ID : null));
                    $("#enequipment").val(d ? d.EQP_CODE : "");
                    if (d) {
                        $("#enequipmentdesc").val(d ? d.EQP_DESC : "");
                    }
                }
            });
            $("#equipmenthealth").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "EQUIPMENTHEALTH", operator: "eq" }]
            });
        };
        var LookupButtons = function () {
            $("#btnenequipment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.equipments[lang].title,
                    listurl: "/Api/ApiEquipments/List",
                    keyfield: "EQP_CODE",
                    codefield: "EQP_CODE",
                    textfield: "EQP_DESC",
                    returninput: "#prmequipment",
                    columns: [
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 100 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 400 }
                    ],
                    filter: [
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                        { field: "EQP_ORG", value: [selectedrecord.ETR_ORG, "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        $("#enequipment").data("id", (d ? d.EQP_ID : null));
                        $("#enequipment").val(d ? d.EQP_CODE : "");
                        if (d) {
                            $("#enequipmentdesc").val((d ? d.EQP_DESC : ""));
                        }
                    }
                });
            });
            $("#btnequipmenthealth").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#equipmenthealth",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "EQUIPMENTHEALTH", operator: "eq" }
                    ]
                });
            });
        };
        var RegisterTabEvents = function () {
            $("#btnAddEntrustEquipments").click(self.ResetUI);
            $("#btnSaveEntrustEquipments").click(self.Save);
            $("#btnDeleteEntrustEquipments").click(self.Delete);

            AutoComplete();
            LookupButtons();
        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };
        RegisterTabEvents();
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
                            case "entrustpart":
                                return "#btnSaveEntrustPart";
                            case "entrustequipments":
                                return "#btnSaveEntrustEquipments";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                etr.Save();
                                break;
                            case "entrustpart":
                                enp.Save();
                                break;
                            case "entrustequipments":
                                eeq.Save();
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
                            case "entrustpart":
                                return "#btnAddEntrustPart";
                            case "entrustequipments":
                                return "#btnAddEntrustEquipments";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                etr.ResetUI();
                                break;
                            case "entrustpart":
                                enp.ResetUI();
                                break;
                            case "entrustequipments":
                                eeq.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                etr.LoadSelected();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "entrustpart":
                                return "#btnDeleteEntrustPart"
                            case "entrustequipments":
                                return "#btnDeleteEntrustEquipments";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                etr.Delete();
                                break;
                            case "entrustpart":
                                enp.Delete();
                                break;
                            case "entrustequipments":
                                eeq.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                etr.HistoryModal();
                                break;
                        }
                    }
                }
            ]);
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
        etr.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());