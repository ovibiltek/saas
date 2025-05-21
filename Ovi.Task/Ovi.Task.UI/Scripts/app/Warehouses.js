(function () {
    var selectedrecord = null;
    var scr, bin, wah, stk, trx;

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
            name: "bins",
            btns: []
        },
        {
            name: "stock",
            btns: []
        },
        {
            name: "trx",
            btns: []
        }
    ];

    trx = new function () {
        var self = this;
        var grdPartTransactionLines = null;

        this.List = function () {
            var grdFilter = [
                { field: "PTL_WAREHOUSE", value: selectedrecord.WAH_CODE, operator: "eq", logic: "and" },
                { field: "PTL_TRANSTATUS", value: "APP", operator: "eq", logic: "and" }
            ];

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
                            type: "string",
                            field: "PTL_TRANSACTIONDESC",
                            title: gridstrings.PartTransactionLines[lang].transactiondesc,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PTL_LINE",
                            title: gridstrings.PartTransactionLines[lang].line,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_TYPE",
                            title: gridstrings.PartTransactionLines[lang].type,
                            width: 150
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
                            type: "datetime",
                            field: "PTL_TRANSACTIONDATE",
                            title: gridstrings.PartTransactionLines[lang].transactiondate,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_CREATEDBY",
                            title: gridstrings.PartTransactionLines[lang].createdby,
                            width: 250
                        }
                    ],
                    fields: {
                        PTL_TRANSACTION: { type: "number" },
                        PTL_LINE: { type: "number" },
                        PTL_QTY: { type: "number" },
                        PTL_TRANSACTIONDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiPartTransactionLine/List",
                    selector: "#grdPartTransactionLines",
                    name: "grdPartTransactionLines",
                    height: constants.defaultgridheight - 125,
                    filter: grdFilter,
                    sort: [{ field: "PTL_ID", dir: "desc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Lines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    }
                });
            }
        };
    };
    stk = new function () {
        var self = this;
        var grdStock = null;

        this.List = function () {
            var grdFilter = [{ field: "STK_WAREHOUSE", value: selectedrecord.WAH_CODE, operator: "eq", logic: "and" }];
            if (grdStock) {
                grdStock.ClearSelection();
                grdStock.RunFilter(grdFilter);
            } else {
                grdStock = new Grid({
                    keyfield: "STK_ID",
                    columns: [
                        { type: "string", field: "STK_PARTCODE", title: gridstrings.stock[lang].part, width: 200 },
                        { type: "string", field: "STK_PARTDESC", title: gridstrings.stock[lang].partdesc, width: 350 },
                        {
                            type: "string",
                            field: "STK_WAREHOUSE",
                            title: gridstrings.stock[lang].warehouse,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "STK_WAREHOUSEDESC",
                            title: gridstrings.stock[lang].warehousedesc,
                            width: 200
                        },
                        { type: "string", field: "STK_BIN", title: gridstrings.stock[lang].bin, width: 200 },
                        { type: "string", field: "STK_BINDESC", title: gridstrings.stock[lang].bindesc, width: 200 },
                        { type: "qty", field: "STK_QTY", title: gridstrings.stock[lang].qty, width: 200 },
                        { type: "string", field: "STK_PARTUOM", title: gridstrings.stock[lang].uom, width: 200 }
                    ],
                    fields:
                    {
                        STK_QTY: { type: "number" }
                    },
                    datasource: "/Api/ApiWarehouses/StockView",
                    selector: "#grdStock",
                    name: "grdStock",
                    height: constants.defaultgridheight - 98,
                    filter: grdFilter,
                    sort: [{ field: "STK_BIN", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Stock.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
    };
    bin = new function () {
        var grdBins = null;
        var grdBinsElm = $("#grdBins");
        var selectedBin = null;
        var self = this;

        this.ResetUI = function () {
            selectedBin = null;
            tms.Reset("#bins");

            $("#bincode").val("");
            $("#bindesc").val("");
            $("#binactive").prop("checked", true);
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#bins");
            $("#bincode").val(selectedBin.BIN_CODE);
            $("#bindesc").val(selectedBin.BIN_DESC);
            $("#binactive").prop("checked", selectedBin.BIN_ACTIVE === "+");
        };
        var LoadSelectedBin = function () {
            return tms.Ajax({
                url: "/Api/ApiBins/Get",
                data: JSON.stringify(selectedBin),
                fn: function (d) {
                    selectedBin = d.data;
                    FillUserInterface();
                }
            });
        };
        var ItemSelect = function (row) {
            selectedBin = grdBins.GetRowDataItem(row);
            LoadSelectedBin();
        };

        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        this.Save = function () {
            if (!tms.Check("#bins"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                BIN_CODE: $("#bincode").val(),
                BIN_DESC: $("#bindesc").val(),
                BIN_ACTIVE: $("#binactive").prop("checked") ? "+" : "-",
                BIN_WAREHOUSE: selectedrecord.WAH_CODE,
                BIN_CREATED: selectedBin != null ? selectedBin.BIN_CREATED : tms.Now(),
                BIN_CREATEDBY: selectedBin != null ? selectedBin.BIN_CREATEDBY : user,
                BIN_UPDATED: selectedBin != null ? tms.Now() : null,
                BIN_UPDATEDBY: selectedBin != null ? user : null,
                BIN_RECORDVERSION: selectedBin != null ? selectedBin.BIN_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiBins/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                }
            });
        };
        this.Delete = function () {
            if (selectedBin) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiBins/DelRec",
                            data: JSON.stringify(selectedBin),
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
            var grdFilter = [{ field: "BIN_WAREHOUSE", value: selectedrecord.WAH_CODE, operator: "eq", logic: "and" }];
            if (grdBins) {
                grdBins.ClearSelection();
                grdBins.RunFilter(grdFilter);
            } else {
                grdBins = new Grid({
                    keyfield: ["BIN_WAREHOUSE", "BIN_CODE"],
                    columns: [
                        { type: "string", field: "BIN_CODE", title: gridstrings.bins[lang].code, width: 200 },
                        { type: "string", field: "BIN_DESC", title: gridstrings.bins[lang].desc, width: 200 },
                        { type: "string", field: "BIN_WAREHOUSE", title: gridstrings.bins[lang].warehouse, width: 200 },
                        {
                            type: "na",
                            field: "ACTIVE",
                            title: gridstrings.bins[lang].active,
                            template:
                                "<input type=\"checkbox\" disabled=\"disabled\" #= BIN_ACTIVE == '+' ? 'checked=\"checked\"' : '' # />",
                            filterable: false,
                            sortable: false,
                            width: 50
                        }
                    ],
                    datasource: "/Api/ApiBins/List",
                    selector: "#grdBins",
                    name: "grdBins",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "BIN_CODE", dir: "asc" }],
                    change: GridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Bins.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddBin").click(self.ResetUI);
            $("#btnSaveBin").click(self.Save);
            $("#btnDeleteBin").click(self.Delete);
        };
        RegisterUIEvents();
    };
    wah = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#tool").val("");
            $("#warehouseman").val("");
            $("#parent").val("");
            $("#pricingmethod").val("");
            $("#active").prop("checked", true);
            $("#forallorganizations").prop("checked", false);

            tooltip.hide("#org");
            tooltip.hide("#parent");
            tooltip.hide("#warehouseman");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMWAREHOUSES", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMWAREHOUSES", operator: "eq" },
                    { field: "DES_PROPERTY", value: "WAH_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");
            tms.Tab();

            $("#code").val(selectedrecord.WAH_CODE);
            $("#desc").val(selectedrecord.WAH_DESC);
            $("#org").val(selectedrecord.WAH_ORG);
            $("#tool").val(selectedrecord.WAH_TOOL);
            $("#parent").val(selectedrecord.WAH_PARENT);
            $("#fulladr").val(selectedrecord.WAH_FULLADDRESS);
            $("#pricingmethod").val(selectedrecord.WAH_PRICINGMETHOD);
            $("#warehouseman").val(selectedrecord.WAH_WAREHOUSEMAN);
            $("#active").prop("checked", selectedrecord.WAH_ACTIVE === "+");
            $("#forallorganizations").prop("checked", selectedrecord.WAH_PUBLIC === "+");

            tooltip.show("#org", selectedrecord.WAH_ORGDESC);
            tooltip.show("#parent", selectedrecord.WAH_PARENTDESC);
            tooltip.show("#warehouseman", selectedrecord.WAH_WAREHOUSEMANDESC);

            $(".page-header>h6").html(selectedrecord.WAH_CODE + " - " + selectedrecord.WAH_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");

            return tms.Ajax({
                url: "/Api/ApiWarehouses/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        tms.Ajax({
                            url: "/Api/ApiWarehouses/DelRec",
                            data: JSON.stringify(selectedrecord.WAH_CODE),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                $(".list-group").list("refresh");
                            }
                        });
                    });
            }
        };
        this.Save = function () {
            if (!tms.Check())
                return $.Deferred().reject();

            var o = JSON.stringify({
                WAH_CODE: $("#code").val().toUpper(),
                WAH_DESC: $("#desc").val(),
                WAH_ORG: $("#org").val(),
                WAH_PARENT: $("#parent").val(),
                WAH_PRICINGMETHOD: $("#pricingmethod").val(),
                WAH_FULLADDRESS: $("#fulladr").val(),
                WAH_WAREHOUSEMAN: $("#warehouseman").val(),
                WAH_TOOL: ($("#tool").val() || null),
                WAH_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                WAH_PUBLIC: $("#forallorganizations").prop("checked") ? "+" : "-",
                WAH_CREATED: selectedrecord != null ? selectedrecord.WAH_CREATED : tms.Now(),
                WAH_CREATEDBY: selectedrecord != null ? selectedrecord.WAH_CREATEDBY : user,
                WAH_UPDATED: selectedrecord != null ? tms.Now() : null,
                WAH_UPDATEDBY: selectedrecord != null ? user : null,
                WAH_RECORDVERSION: selectedrecord != null ? selectedrecord.WAH_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiWarehouses/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.WAH_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    switch (target) {
                        case "#bins":
                            bin.List();
                            bin.ResetUI();
                            break;
                        case "#stock":
                            stk.List();
                            break;
                        case "#trx":
                            trx.List();
                            break;
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
            $("#btnTranslations").click(self.TranslationModal);

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
                    ]
                });
            });
            $("#btnparent").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.warehouses[lang].title,
                    listurl: "/Api/ApiWarehouses/List",
                    keyfield: "WAH_CODE",
                    codefield: "WAH_CODE",
                    textfield: "WAH_DESCF",
                    returninput: "#parent",
                    columns: [
                        { type: "string", field: "WAH_CODE", title: gridstrings.warehouses[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "WAH_DESCF",
                            title: gridstrings.warehouses[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                        { field: "WAH_CODE", value: $("#code").val(), operator: "neq" }
                    ]
                });
            });
            $("#btnwarehouseman").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#warehouseman",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                filter: [
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ],
            });
            $("#parent").autocomp({
                listurl: "/Api/ApiWarehouses/List",
                geturl: "/Api/ApiWarehouses/Get",
                field: "WAH_CODE",
                textfield: "WAH_DESCF",
                active: "WAH_ACTIVE",
                filter: [{ field: "WAH_CODE", func: function () { return $("#code").val(); }, operator: "neq" }]
            });
            $("#warehouseman").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [{ field: "USR_CODE", value: "*", operator: "neq" }]
            });

            RegisterTabChange();
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiWarehouses/List",
                fields: {
                    keyfield: "WAH_CODE",
                    descfield: "WAH_DESCF"
                },
                sort: [{ field: "WAH_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                }
            });
        };
        this.BuildUI = function () {
            wah.ResetUI();
            List();
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
                            case "bins":
                                return "#btnSaveBin";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                wah.Save();
                                break;
                            case "bins":
                                bin.Save();
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
                            case "bins":
                                return "#btnAddBin";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                wah.ResetUI();
                                break;
                            case "bins":
                                bin.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnTranslations",
                    f: function () {
                        wah.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "bins":
                                return "#btnDeleteBin";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                wah.Delete();
                                break;
                            case "bins":
                                bin.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        wah.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function () {
                        wah.TranslationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            var activeTab = tms.ActiveTab();
            return $.when(wah.LoadSelected()).done(function () {
                switch (activeTab) {
                    case "bins":
                        bin.ResetUI();
                        bin.List();
                        break;
                    case "stock":
                        stk.List();
                        break;
                    case "trx":
                        trx.List();
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
        wah.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());