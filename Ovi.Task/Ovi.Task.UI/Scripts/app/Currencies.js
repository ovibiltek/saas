(function () {
    var selectedrecord = null;
    var exch, scr, curr;

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
            name: "exch",
            btns: []
        }
    ];

    exch = new function () {
        var grdExchRates = null;
        var $grdExchRates = $("#grdExchRates");
        var selectedExch = null;
        var self = this;

        this.ResetUI = function () {
            selectedExch = null;
            tms.Reset("#exch");

            $("#basecurrency").val("");
            $("#startdate").val("");
            $("#exchangerate").val("");
            $("#enddate").val("");

            tooltip.hide("#basecurrency");
        };
        var FillExchUI = function () {
            tms.BeforeFill("#exch");

            $("#basecurrency").val(selectedExch.CRR_BASECURR);
            $("#startdate").val(moment(selectedExch.CRR_STARTDATE).format(constants.dateformat));
            $("#enddate").val(moment(selectedExch.CRR_ENDDATE).format(constants.dateformat));
            $("#exchangerate").val(selectedExch.CRR_EXCH);

            tooltip.show("#basecurrency", selectedExch.CRR_BASECURRDESC);
        };
        var LoadSelectedExch = function () {
            return tms.Ajax({
                url: "/Api/ApiExchRates/Get",
                data: JSON.stringify(selectedExch.CRR_ID),
                fn: function (d) {
                    selectedExch = d.data;
                    FillExchUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedExch = grdExchRates.GetRowDataItem(row);
            LoadSelectedExch();
        };

        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.Save = function () {
            if (!tms.Check("#exch"))
                return;

            var o = JSON.stringify({
                CRR_ID: selectedExch != null ? selectedExch.CRR_ID : 0,
                CRR_CURR: selectedrecord.CUR_CODE,
                CRR_BASECURR: $("#basecurrency").val(),
                CRR_EXCH: $("#exchangerate").val(),
                CRR_STARTDATE: moment.utc($("#startdate").val(), constants.dateformat),
                CRR_ENDDATE: moment.utc($("#enddate").val(), constants.dateformat),
                CRR_CREATED: selectedExch != null ? selectedExch.CRR_CREATED : tms.Now(),
                CRR_CREATEDBY: selectedExch != null ? selectedExch.CRR_CREATEDBY : user,
                CRR_UPDATED: selectedExch != null ? tms.Now() : null,
                CRR_UPDATEDBY: selectedExch != null ? user : null,
                CRR_RECORDVERSION: selectedExch != null ? selectedExch.CRR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiExchRates/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedExch) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiExchRates/DelRec",
                            data: JSON.stringify(selectedExch.CRR_ID),
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
            var grdFilter = [{ field: "CRR_CURR", value: selectedrecord.CUR_CODE, operator: "eq", logic: "and" }];
            if (grdExchRates) {
                grdExchRates.ClearSelection();
                grdExchRates.RunFilter(grdFilter);
            } else {
                grdExchRates = new Grid({
                    keyfield: "CRR_ID",
                    columns: [
                        {
                            type: "string",
                            field: "CRR_BASECURR",
                            title: gridstrings.exch[lang].basecurrency,
                            width: 200
                        },
                        { type: "string", field: "CRR_EXCH", title: gridstrings.exch[lang].exch, width: 200 },
                        { type: "date", field: "CRR_STARTDATE", title: gridstrings.exch[lang].startdate, width: 100 },
                        { type: "date", field: "CRR_ENDDATE", title: gridstrings.exch[lang].enddate, width: 100 }
                    ],
                    datasource: "/Api/ApiExchRates/List",
                    selector: "#grdExchRates",
                    name: "grdExchRates",
                    height: 140,
                    filter: grdFilter,
                    sort: [{ field: "CRR_BASECURR", dir: "asc" }],
                    change: gridChange
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddExch").click(self.ResetUI);
            $("#btnSaveExch").click(self.Save);
            $("#btnDeleteExch").click(self.Delete);
            $("#exchangerate").numericInput({ allowNegative: false, allowFloat: true });
            $("#basecurrency").autocomp({
                listurl: "/Api/ApiCurrencies/ListByOrganization",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#btnbasecurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/ListByOrganization",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#basecurrency",
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
                    ]
                });
            });
        };
        RegisterUIEvents();
    };
    curr = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#active").prop("checked", true);

            tooltip.hide("#org");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCURRENCIES", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMCURRENCIES", operator: "eq" },
                    { field: "DES_PROPERTY", value: "CUR_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");
            tms.Tab();

            $("#code").val(selectedrecord.CUR_CODE);
            $("#desc").val(selectedrecord.CUR_DESC);
            $("#active").prop("checked", selectedrecord.CUR_ACTIVE === "+");

            $(".page-header>h6").html(selectedrecord.CUR_CODE + " - " + selectedrecord.CUR_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiCurrencies/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
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
                            url: "/Api/ApiCurrencies/DelRec",
                            data: JSON.stringify(selectedrecord.CUR_CODE),
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
                return;

            var o = JSON.stringify({
                CUR_CODE: $("#code").val().toUpper(),
                CUR_DESC: $("#desc").val(),
                CUR_ORGANIZATION: $("#org").val(),
                CUR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                CUR_CREATED: selectedrecord != null ? selectedrecord.CUR_CREATED : tms.Now(),
                CUR_CREATEDBY: selectedrecord != null ? selectedrecord.CUR_CREATEDBY : user,
                CUR_UPDATED: selectedrecord != null ? tms.Now() : null,
                CUR_UPDATEDBY: selectedrecord != null ? user : null,
                CUR_SQLIDENTITY: selectedrecord != null ? selectedrecord.CUR_SQLIDENTITY : 0,
                CUR_RECORDVERSION: selectedrecord != null ? selectedrecord.CUR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiCurrencies/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.CUR_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    if (target === "#exch") {
                        exch.List();
                        exch.ResetUI();
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
                listurl: "/Api/ApiCurrencies/List",
                fields: { keyfield: "CUR_CODE", descfield: "CUR_DESC" },
                sort: [{ field: "CUR_CODE", dir: "asc" }],
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
                            case "exch":
                                return "#btnSaveExch";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                curr.Save();
                                break;
                            case "exch":
                                exch.Save();
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
                            case "exch":
                                return "#btnAddExch";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                curr.ResetUI();
                                break;
                            case "exch":
                                exch.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        curr.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "exch":
                                return "#btnDeleteExch";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                curr.Delete();
                                break;
                            case "exch":
                                exch.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        curr.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function () {
                        curr.TranslationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(curr.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "exch":
                        act.ResetUI();
                        exch.List();
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
        curr.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());