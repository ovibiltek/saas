(function () {
    var selectedrecord = null;
    var scr;

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
            name: "lines",
            btns: []
        }
    ];

    var rvl = new function () {
        var grdPartTransactionLines = null;
        var grdPartTransactionLinesElm = $("#grdPartTransactionLines");
        var selecteditem = null;
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

        var FillUI = function () {
            tms.BeforeFill("#lines");
            scr.RecordStatusCheck();

            $("#part").data("id", selecteditem.PTL_PART);
            $("#part").val(selecteditem.PTL_PARTCODE);
            $("#bin").val(selecteditem.PTL_BIN);
            $("#quantity").val(selecteditem.PTL_QTY);
            $("#price").val(selecteditem.PTL_PRICE);

            tooltip.show("#bin", selecteditem.PTL_BINDESC);
            tooltip.show("#part", selecteditem.PTL_PARTDESC);
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiPartTransactionLine/Get",
                data: JSON.stringify(selecteditem.PTL_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selecteditem = grdPartTransactionLines.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPartTransactionLine/DelRec",
                            data: JSON.stringify(selecteditem.PTL_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.List = function () {
            var grdFilter = [{ field: "PTL_TRANSACTION", value: selectedrecord.PTR_ID, operator: "eq", logic: "and" }];
            if (grdPartTransactionLines) {
                grdPartTransactionLines.ClearSelection();
                grdPartTransactionLines.RunFilter(grdFilter);
            } else {
                grdPartTransactionLines = new Grid({
                    keyfield: "PTL_ID",
                    columns: [
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
                            type: "string",
                            field: "PTL_PARTCODE",
                            title: gridstrings.PartTransactionLines[lang].partcode,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_PARTDESC",
                            title: gridstrings.PartTransactionLines[lang].partdesc,
                            width: 250
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
                        {
                            type: "string",
                            field: "PTL_BIN",
                            title: gridstrings.PartTransactionLines[lang].bin,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_BINDESC",
                            title: gridstrings.PartTransactionLines[lang].bindesc,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PTL_PRICE",
                            title: gridstrings.PartTransactionLines[lang].price,
                            width: 150
                        },
                        {
                            type: "qty",
                            field: "PTL_QTY",
                            title: gridstrings.PartTransactionLines[lang].quantity,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "PTL_TRANSACTIONDATE",
                            title: gridstrings.PartTransactionLines[lang].transactiondate,
                            width: 150
                        }
                    ],
                    fields: {
                        PTL_TRANSACTION: { type: "number" },
                        PTL_LINE: { type: "number" },
                        PTL_TRANSACTIONDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiPartTransactionLine/List",
                    selector: "#grdPartTransactionLines",
                    name: "grdPartTransactionLines",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "PTL_ID", dir: "asc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Lines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    }
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#lines"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PTL_ID: (selecteditem != null ? selecteditem.PTL_ID : 0),
                PTL_TRANSACTION: selectedrecord.PTR_ID,
                PTL_TRANSACTIONDATE: tms.Now(),
                PTL_PART: $("#part").data("id"),
                PTL_TYPE: selectedrecord.PTR_TYPE,
                PTL_WAREHOUSE: selectedrecord.PTR_WAREHOUSE,
                PTL_BIN: $("#bin").val(),
                PTL_PRICE: parseFloat($("#price").val()),
                PTL_QTY: parseFloat($("#quantity").val()),
                PTL_CREATED: selecteditem != null ? selecteditem.PTL_CREATED : tms.Now(),
                PTL_CREATEDBY: selecteditem != null ? selecteditem.PTL_CREATEDBY : user,
                PTL_RECORDVERSION: selecteditem != null ? selecteditem.PTL_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPartTransactionLine/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#lines");
            scr.RecordStatusCheck();

            $("#part").val("");
            $("#part").data("id", null);
            $("#bin").val("");
            $("#price").val("");
            $("#quantity").val("");

            tooltip.hide("#part");
            tooltip.hide("#bin");
        };
        var AutoComplete = function () {
            $("#part").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                filter: [
                    {
                        field: "PAR_ORG",
                        func: function () { return ["*", selectedrecord.PTR_ORGANIZATION]; },
                        operator: "in"
                    }
                ],
                callback: function (data) {
                    $("#part").data("id", data.PAR_ID);
                }
            });
            $("#bin").autocomp({
                listurl: "/Api/ApiBins/List",
                geturl: "/Api/ApiBins/Get",
                field: "BIN_CODE",
                textfield: "BIN_DESC",
                active: "BIN_ACTIVE",
                filter: [
                    {
                        field: "BIN_WAREHOUSE",
                        func: function () { return selectedrecord.PTR_WAREHOUSE; },
                        operator: "eq"
                    }
                ]
            });
        };
        var LookupButtons = function () {
            $("#btnpart").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.partstock[lang].title,
                    listurl: "/Api/ApiWarehouses/StockByWarehouse",
                    keyfield: "STK_PART",
                    codefield: "STK_PARTCODE",
                    textfield: "STK_PARTDESC",
                    returninput: "#part",
                    columns: [
                        { type: "string", field: "STK_PARTCODE", title: gridstrings.partstock[lang].parcode, width: 100 },
                        { type: "string", field: "STK_PARTDESC", title: gridstrings.partstock[lang].pardesc, width: 300 },
                        { type: "qty", field: "STK_WHQTY", title: gridstrings.partstock[lang].parqty, width: 100 },
                        { type: "string", field: "STK_PARTUOM", title: gridstrings.partstock[lang].paruom, width: 100 }
                    ],
                    fields:
                    {
                        STK_WHQTY: { type: "number" }
                    },
                    filter: [
                        { field: "STK_WAREHOUSE", value: selectedrecord.PTR_WAREHOUSE, operator: "eq" },
                        { field: "STK_PARTORG", value: ["*", selectedrecord.PTR_ORGANIZATION], operator: "in" }
                    ],
                    treefilter: function (id, callback) {
                        $.when(GetLevels()).done(function (d) {
                            var data = GenerateTreeData(d.data);
                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [{ field: "PARTLEVEL.STKPART", value: selectedItem.id, operator: "func" }];
                                        callback(filter);
                                    }

                                }
                            });
                        });
                    },
                    callback: function (d) {
                        tooltip.hide("#part");
                        $("#part").data("id", (d ? d.STK_PART : null));
                        $("#partdesc").val((d ? d.STK_PARTDESC : ""));
                        $("#partuom").val((d ? d.STK_PARTUOM : ""));
                        $("#bin").val("");
                        $("#binqty").val("");
                    }
                });
            });
            $("#btnbin").click(function () {
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
                        { field: "BIN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BIN_WAREHOUSE", value: selectedrecord.PTR_WAREHOUSE, operator: "eq" }
                    ]
                });
            });
        };
        var RegisterUIEvents = function () {
            $("#btnAddIRLine").click(self.ResetUI);
            $("#btnSaveIRLine").click(self.Save);
            $("#btnDeleteIRLine").click(self.Delete);

            LookupButtons();
            AutoComplete();
        };
        RegisterUIEvents();
    };
    var irv = new function () {
        var self = this;

        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPartTransaction/DelRec",
                            data: JSON.stringify(selectedrecord.PTR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                $(".list-group").list("refresh");
                            }
                        });
                    });
            }
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();
            scr.RecordStatusCheck();

            $("#btnDelete,#btnUndo").prop("disabled", selectedrecord.PTR_STATUS === "APP");
            $("#code").val(selectedrecord.PTR_ID);
            $("#description").val(selectedrecord.PTR_DESCRIPTION);
            $("#org").val(selectedrecord.PTR_ORGANIZATION);
            $("#trxtype").val(selectedrecord.PTR_TYPE);
            $("#warehouse").val(selectedrecord.PTR_WAREHOUSE);
            $("#transactiondate").val(moment(selectedrecord.PTR_TRANSACTIONDATE).format(constants.longdateformat));
            $("#integrationref").val(selectedrecord.PTR_INTREF);
            $("#created").val(moment(selectedrecord.PTR_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.PTR_CREATEDBY);
            $("#status").val(selectedrecord.PTR_STATUS);

            tooltip.show("#org", selectedrecord.PTR_ORGANIZATIONDESC);
            tooltip.show("#warehouse", selectedrecord.PTR_WAREHOUSEDESC);
            tooltip.show("#createdby", selectedrecord.PTR_CREATEDBYDESC);

            $(".page-header>h6").html(selectedrecord.PTR_ID + " - " + selectedrecord.PTR_DESCRIPTION);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiPartTransaction/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");
            scr.RecordStatusCheck();

            $("#code").val("");
            $("#description").val("");
            $("#org").val("");
            $("#trxtype").val("R");
            $("#warehouse").val("");
            $("#transactiondate").val(tms.Now().format(constants.longdateformat));
            $("#integrationref").val("");
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#createdby").val(user);
            $("#status").val("N");

            tooltip.hide("#org");
            tooltip.hide("#warehouse");
            tooltip.show("#createdby", userdesc);
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PTR_ID: selectedrecord ? selectedrecord.PTR_ID : 0,
                PTR_DESCRIPTION: $("#description").val(),
                PTR_TYPE: $("#trxtype").val(),
                PTR_ORGANIZATION: ($("#org").val() || null),
                PTR_TRANSACTIONDATE: moment.utc($("#transactiondate").val(), constants.longdateformat),
                PTR_WAREHOUSE: $("#warehouse").val(),
                PTR_STATUS: $("#status").val(),
                PTR_INTREF: ($("#integrationref").val() || null),
                PTR_CREATED: selectedrecord != null ? selectedrecord.PTR_CREATED : tms.Now(),
                PTR_CREATEDBY: selectedrecord != null ? selectedrecord.PTR_CREATEDBY : user,
                PTR_UPDATED: selectedrecord != null ? tms.Now() : null,
                PTR_UPDATEDBY: selectedrecord != null ? user : null,
                PTR_RECORDVERSION: selectedrecord != null ? selectedrecord.PTR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPartTransaction/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.PTR_ID).list("refresh");
                }
            });
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPARTTRANS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    if (target === "#lines") {
                        rvl.List();
                        rvl.ResetUI();
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            RegisterTabChange();
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }],
                callback: function () {
                    $("#warehouse").val("");
                    tooltip.hide("#warehouse");
                }
            });

            $("#warehouse").autocomp({
                listurl: "/Api/ApiWarehouses/List",
                geturl: "/Api/ApiWarehouses/Get",
                field: "WAH_CODE",
                textfield: "WAH_DESC",
                filter: [{ field: "WAH_ORG", relfield: "#org", includeall: false }],
                active: "WAH_ACTIVE"
            });
        };
        var LookupButtons = function () {
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
                        { field: "ORG_CODE", value: "*", operator: "neq" },
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function () {
                        $("#warehouse").val("");
                        tooltip.hide("#warehouse");
                    }
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
                        { field: "WAH_ORG", value: $("#org").val(), operator: "eq" }
                    ]
                });
            });
        };
        this.BuildUI = function () {
            self.ResetUI();

            $("#transactiondate").val(tms.Now().format(constants.longdateformat));
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#createdby").val(user);

            tooltip.show("#createdby", userdesc);

            AutoComplete();
            LookupButtons();

            

            var predefinedfilters = [
                { filters: [{ field: "PTR_TYPE", value: ["R", "ST"], operator: "in", logic: "and" }] }
            ];
            if (inbox) {
                predefinedfilters[0].filters.push({ value: inbox, value2: user, operator: "inbox" });
            }

            $(".list-group").list({
                listurl: "/Api/ApiPartTransaction/List",
                fields: {
                    keyfield: "PTR_ID",
                    descfield: "PTR_DESCRIPTION",
                    otherfields: [
                        {
                            func: function (di) {
                                var status = di["PTR_STATUS"];
                                var color = "#00000";
                                if (status == "RET")
                                    color = "red";
                                else if (status == "WA")
                                    color = "blue";
                                else if (status == "APP")
                                    color = "green";
                                else
                                    color = "black";
                                return "<span style=\"color:" + color + "\">" + applicationstrings[lang].inventoryreceiptstatuses[status] + "</span>";
                            },
                            label: applicationstrings[lang].status
                        },
                        { field: "PTR_WAREHOUSE", label: applicationstrings[lang].warehouse },
                    ],
                    datafields: [
                        { name: "status", field: "PTR_STATUS" }
                    ]
                },
                sort: [
                    { field: "PTR_ID", dir: "desc" }
                ],
                type: "A",
                srch: {
                    filters: [
                        { field: "PTR_ID", operator: "eq", logic: "or" },
                        { field: "PTR_DESCRIPTION", operator: "contains", logic: "or" },
                        { field: "PTR_WAREHOUSE", operator: "contains", logic: "or" }
                    ],
                    logic: "and"
                },
                predefinedfilters: predefinedfilters,
                itemclick: function (event, item) {
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                },               
                callback: function (elm) {
                }
            });

            RegisterUiEvents();
        };
    };
    scr = new function () {
        var self = this;

        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "lines":
                                return "#btnSaveIRLine";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                irv.Save();
                                break;
                            case "lines":
                                rvl.Save();
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
                            case "lines":
                                return "#btnAddIRLine";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                irv.ResetUI();
                                break;
                            case "lines":
                                rvl.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        irv.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "lines":
                                return "#btnDeleteIRLine";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                irv.Delete();
                                break;
                            case "lines":
                                rvl.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        irv.HistoryModal();
                    }
                }
            ]);
        };
        this.RecordStatusCheck = function () {
            var statusctrl = $("#status");

            if (selectedrecord) {
                switch (selectedrecord.PTR_STATUS) {
                    case "N":
                        self.EDRecord(false);
                        self.EDLine(false);
                        statusctrl.find("option[value=\"APP\"]").prop("disabled", false);
                        break;
                    case "WA":
                        self.EDRecord(false);
                        self.EDLine(true);
                        statusctrl.find("option[value=\"APP\"]").prop("disabled", false);
                        statusctrl.find("option[value=\"RET\"]").prop("disabled", false);
                        break;
                    case "APP":
                        self.EDRecord(true);
                        self.EDLine(true);
                        break;
                    case "RET":
                        self.EDRecord(false);
                        self.EDLine(false);
                        statusctrl.find("option[value=\"APP\"]").prop("disabled", false);
                        break;

                }
            } else {
                statusctrl.find("option[value=\"APP\"]").prop("disabled", true);
                statusctrl.find("option[value=\"RET\"]").prop("disabled", true);
                self.EDRecord(false);
                self.EDLine(false);
            }
        };
        this.EDRecord = function (s) {
            $("#description").prop("disabled", s);
            $("#integrationref").prop("disabled", s);
            $("#trxtype:not(:disabled)").prop("disabled", s);
            $("#status").prop("disabled", s);
        };
        this.EDLine = function (s) {
            $("#part:not(:disabled),#btnpart:not(:disabled),#bin,#quantity,#price,#btnbin").prop("disabled", s);
            $("#btnAddIRLine,#btnSaveIRLine").prop("disabled", s);
            if (s)
                $("#btnDeleteIRLine").prop("disabled", true);
        };
        this.LoadSelected = function () {
            $.when(irv.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "lines":
                        rvl.List();
                        rvl.ResetUI();
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
        irv.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());