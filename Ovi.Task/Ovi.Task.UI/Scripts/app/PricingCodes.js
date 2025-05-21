(function () {
    var selectedrecord = null;
    var prc, scr, prp;

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
            name: "pricing",
            btns: []
        }
    ];

    prp = new function () {
        var grdPricings = null;
        var $grdPricings = $("#grdPricings");
        var selectedPricing = null;
        var self = this;

        this.ResetUI = function () {
            selectedPricing = null;
            tms.Reset("#pricing");

            $("#currency").val("");
            $("#price").val("");
            $("#startdate").val("");
            $("#enddate").val("");

            tooltip.hide("#currency");
        };
        var FillPricingUI = function () {
            tms.BeforeFill("#pricing");

            $("#currency").val(selectedPricing.PCP_CURR);
            $("#startdate").val(moment(selectedPricing.PCP_STARTDATE).format(constants.dateformat));
            $("#enddate").val(moment(selectedPricing.PCP_ENDDATE).format(constants.dateformat));
            $("#price").val(selectedPricing.PCP_PRICE);

            tooltip.show("#currency", selectedPricing.PCP_CURRDESC);
        };
        var LoadSelectedPricing = function () {
            return tms.Ajax({
                url: "/Api/ApiPricingCodeParameters/Get",
                data: JSON.stringify(selectedPricing.PCP_ID),
                fn: function (d) {
                    selectedPricing = d.data;
                    FillPricingUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedPricing = grdPricings.GetRowDataItem(row);
            LoadSelectedPricing();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.Save = function () {
            if (!tms.Check("#pricing"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PCP_ID: selectedPricing != null ? selectedPricing.PCP_ID : 0,
                PCP_PRICINGCODE: selectedrecord.PRC_CODE,
                PCP_CURR: $("#currency").val(),
                PCP_PRICE: parseFloat($("#price").val()).fixed(constants.pricedecimals),
                PCP_STARTDATE: moment.utc($("#startdate").val(), constants.dateformat),
                PCP_ENDDATE: moment.utc($("#enddate").val(), constants.dateformat),
                PCP_CREATED: selectedPricing != null ? selectedPricing.PCP_CREATED : tms.Now(),
                PCP_CREATEDBY: selectedPricing != null ? selectedPricing.PCP_CREATEDBY : user,
                PCP_UPDATED: selectedPricing != null ? tms.Now() : null,
                PCP_UPDATEDBY: selectedPricing != null ? user : null,
                PCP_RECORDVERSION: selectedPricing != null ? selectedPricing.PCP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPricingCodeParameters/Save",
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
                            url: "/Api/ApiPricingCodeParameters/DelRec",
                            data: JSON.stringify(selectedPricing.PCP_ID),
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
            var grdFilter = [{ field: "PCP_PRICINGCODE", value: selectedrecord.PRC_CODE, operator: "eq", logic: "and" }];
            if (grdPricings) {
                grdPricings.ClearSelection();
                grdPricings.RunFilter(grdFilter);
            } else {
                grdPricings = new Grid({
                    keyfield: "PCP_ID",
                    columns: [
                        { type: "number", field: "PCP_PRICE", title: gridstrings.pricings[lang].price, width: 200 },
                        { type: "string", field: "PCP_CURR", title: gridstrings.pricings[lang].currency, width: 200 },
                        { type: "date", field: "PCP_STARTDATE", title: gridstrings.pricings[lang].startdate, width: 100 },
                        { type: "date", field: "PCP_ENDDATE", title: gridstrings.pricings[lang].enddate, width: 100 }
                    ],
                    fields:
                    {
                        PCP_PRICE: { type: "number" }
                    },
                    datasource: "/Api/ApiPricingCodeParameters/List",
                    selector: "#grdPricings",
                    name: "grdPricings",
                    height: 140,
                    filter: grdFilter,
                    sort: [{ field: "PCP_STARTDATE", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddPricingParemeter").click(self.ResetUI);
            $("#btnSavePricingParameter").click(self.Save);
            $("#btnDeletePricingParameter").click(self.Delete);
            $("#price").numericInput({ allowNegative: false, allowFloat: true });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#btncurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#currency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CUR_ACTIVE", value: "+", operator: "eq" }]
                });
            });
        };
        RegisterUIEvents();
    };
    prc = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#group").val("");
            $("#active").prop("checked", true);
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPRICINGCODES", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMPRICINGCODES", operator: "eq" },
                    { field: "DES_PROPERTY", value: "PRC_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");
            tms.Tab();

            $("#code").val(selectedrecord.PRC_CODE);
            $("#desc").val(selectedrecord.PRC_DESC);
            $("#group").val(selectedrecord.PRC_GROUP);
            $("#active").prop("checked", selectedrecord.PRC_ACTIVE === "+");
            $(".page-header>h6").html(selectedrecord.PRC_CODE + " - " + selectedrecord.PRC_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiPricingCodes/Get",
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
                        return tms.Ajax({
                            url: "/Api/ApiPricingCodes/DelRec",
                            data: JSON.stringify(selectedrecord.PRC_CODE),
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
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PRC_CODE: $("#code").val().toUpper(),
                PRC_DESC: $("#desc").val(),
                PRC_GROUP: $("#group").val(),
                PRC_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                PRC_CREATED: selectedrecord != null ? selectedrecord.PRC_CREATED : tms.Now(),
                PRC_CREATEDBY: selectedrecord != null ? selectedrecord.PRC_CREATEDBY : user,
                PRC_UPDATED: selectedrecord != null ? tms.Now() : null,
                PRC_UPDATEDBY: selectedrecord != null ? user : null,
                PRC_SQLIDENTITY: selectedrecord != null ? selectedrecord.PRC_SQLIDENTITY : 0,
                PRC_RECORDVERSION: selectedrecord != null ? selectedrecord.PRC_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPricingCodes/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.PRC_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    if (target === "#pricing") {
                        prp.List();
                        prp.ResetUI();
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
            RegisterTabChange();
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiPricingCodes/List",
                fields: { keyfield: "PRC_CODE", descfield: "PRC_DESC" },
                sort: [{ field: "PRC_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                }
            });
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            self.ResetUI();
            List();
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
                            case "pricing":
                                return "#btnSavePricing";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                prc.Save();
                                break;
                            case "pricing":
                                prp.Save();
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
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                prc.ResetUI();
                                break;
                            case "pricing":
                                prp.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        prc.LoadSelected();
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
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                prc.Delete();
                                break;
                            case "Pricing":
                                prp.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        prc.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function () {
                        prc.TranslationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(prc.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "pricing":
                        prp.ResetUI();
                        prp.List();
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
        prc.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());