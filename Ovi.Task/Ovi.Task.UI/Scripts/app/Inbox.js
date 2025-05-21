(function () {
    var selectedrecord = null;
    var infobox = null;
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
        }
    ];
    var scr;

    var inb = new function () {
        var self = this;
        var grdInbox = null;
        var grdInboxElm = $("#grdInbox");
        var RegisterUiEvents;

        var TestSql = function () {
            if (selectedrecord) {
                var code = selectedrecord.INB_CODE;
                return tms.Ajax({
                    url: "/Api/ApiInbox/ValidateInbox",
                    data: JSON.stringify(code),
                    fn: function (d) {
                        selectedrecord = d.r;
                        msgs.success(d.data);
                        $("#isvalidated").prop("checked", true);
                    }
                });
            }
        }

        var LoadInboxGroups = function (v) {
            var gridreq = {
                sort: [{ field: "SYC_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "SYC_GROUP", value: "INBOXGROUP", operator: "eq" }
                    ]
                }
            };
            return select({
                ctrl: "#inboxgroup",
                url: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                textfield: "SYC_DESCF",
                data: JSON.stringify(gridreq)
            }).Fill();
        };

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMINBOX", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        }

        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMINBOX", operator: "eq" },
                    { field: "DES_PROPERTY", value: "INB_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        }

        var gridDataBound = function () {
            grdInboxElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
        };

        var ItemSelect = function (row) {
            grdInboxElm.find("[data-id]").removeClass("k-state-selected");
            row.addClass("k-state-selected");
            selectedrecord = grdInbox.GetRowDataItem(row);
            $(".page-header h6").html(selectedrecord.INB_CODE + " - " + selectedrecord.INB_DESC);
            scr.Configure();
            tms.Tab();
        };

        var gridChange = function (e) {
            ItemSelect(e.sender.select());
        };

        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.INB_CODE);
            $("#desc").val(selectedrecord.INB_DESC);
            $("#css").val(selectedrecord.INB_CSS);
            $("#order").val(selectedrecord.INB_ORDER);
            $("#color").val(selectedrecord.INB_COLOR);
            $("#sql").val(selectedrecord.INB_SQL);
            $("#condition").val(selectedrecord.INB_CONDITION);
            $("#inboxtype").val(selectedrecord.INB_TYPE);
            $("#inboxgroup").val(selectedrecord.INB_GROUP);
            $("#resulttype").val(selectedrecord.INB_RESULTTYPE);
            $("#screen").val(selectedrecord.INB_SCREEN);
            $("#active").prop("checked", selectedrecord.INB_ACTIVE === "+");
            $("#isvalidated").prop("checked", selectedrecord.INB_ISVALIDATED === "+");
            $("#cssi").removeClass().addClass(selectedrecord.INB_CSS);
            tooltip.show("#screen", selectedrecord.INB_SCREENDESCF);

            if (selectedrecord.INB_COLOR)
                $(".colpicker").colorpicker("setValue", selectedrecord.INB_COLOR);
            else {
                $(".colpicker i").removeAttr("style");
                $("#color").val("");
            }
            infobox.setParam({
                filter: [
                    { field: "DES_CLASS", value: "TMINBOX", operator: "eq" },
                    { field: "DES_PROPERTY", value: "INB_INFO", operator: "eq" },
                    { field: "DES_CODE", value: selectedrecord.INB_CODE, operator: "eq" }
                ],

                containerid: "#infobox",
                textarea: true
            });
            infobox.loadTranslationData();
        };

        this.List = function () {
            if (grdInbox) {
                grdInbox.ClearSelection();
                grdInbox.RunFilter([]);
            } else {
                grdInbox = new Grid({
                    keyfield: "INB_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "INB_CODE",
                            title: gridstrings.inbox[lang].code,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "INB_DESC",
                            title: gridstrings.inbox[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "INB_SQL",
                            title: gridstrings.inbox[lang].sql,
                            width: 500
                        },
                        {
                            type: "string",
                            field: "INB_CONDITION",
                            title: gridstrings.inbox[lang].condition,
                            width: 500
                        },
                        {
                            type: "number",
                            field: "INB_ORDER",
                            title: gridstrings.inbox[lang].order,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "INB_TYPE",
                            title: gridstrings.inbox[lang].type,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INB_CSS",
                            title: gridstrings.inbox[lang].css,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INB_COLOR",
                            title: gridstrings.inbox[lang].color,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "INB_SCREEN",
                            title: gridstrings.inbox[lang].screen,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INB_ACTIVE",
                            title: gridstrings.inbox[lang].active,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INB_ISVALIDATED",
                            title: gridstrings.inbox[lang].isvalidated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INB_INFO",
                            title: gridstrings.inbox[lang].information,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        INB_ORDER: { type: "number" }
                    },
                    datasource: "/Api/ApiInbox/List",
                    selector: "#grdInbox",
                    name: "grdInbox",
                    height: constants.defaultgridheight - 100,
                    primarycodefield: "INB_CODE",
                    primarytextfield: "INB_DESC",
                    visibleitemcount: 10,
                    sort: [{ field: "INB_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"INBOX.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound,
                    change: gridChange
                });
            }
        };

        this.BuildUI = function () {

            RegisterUiEvents();

            LoadInboxGroups();
            self.List();

            $("#screen").autocomp({
                listurl: "/Api/ApiScreens/List",
                geturl: "/Api/ApiScreens/Get",
                field: "SCR_CODE",
                textfield: "SCR_DESCF",
                active: "SCR_ACTIVE"
            });
            $("#btnScreen").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.screen[lang].title,
                    listurl: "/Api/ApiScreens/List",
                    keyfield: "SCR_CODE",
                    codefield: "SCR_CODE",
                    textfield: "SCR_DESCF",
                    returninput: "#screen",
                    columns: [
                        { type: "string", field: "SCR_CODE", title: gridstrings.screen[lang].screen, width: 100 },
                        { type: "string", field: "SCR_DESCF", title: gridstrings.screen[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "SCR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });

            $("#css").change(function () {
                $("#cssi").removeClass().addClass($(this).val());
            });
            $(".colpicker").colorpicker({ format: "hex" });
            $("#css").iconpicker({ hideOnSelect: true, placement: "right" }).on("iconpickerSelected", function (e) {
                $(this).val(e.iconpickerInstance.options.iconBaseClass + " " + e.iconpickerInstance.getValue(e.iconpickerValue)).trigger("change");
            });

            infobox = new translation.box();
            infobox.setParam({
                containerid: "#infobox",
                textarea: true
            });
            infobox.loadUI(scr.BindHotKeys);
            self.ResetUI();
        };

        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var textctrls = $("#infobox [data-lang]");
            var vals = [];

            for (var i = 0; i < textctrls.length; i++) {
                vals.push({
                    DES_LANG: $(textctrls[i]).data("lang"),
                    DES_TEXT: $(textctrls[i]).val(),
                    DES_CLASS: "TMINBOX",
                    DES_PROPERTY: "INB_INFO",
                    DES_CODE: $("#code").val().toUpper()
                });
            }

            var o = JSON.stringify({
                inbox: {
                    INB_CODE: $("#code").val().toUpper(),
                    INB_DESC: $("#desc").val(),
                    INB_SQL: $("#sql").val(),
                    INB_CONDITION: $("#condition").val(),
                    INB_ORDER: ($("#order").val() ? parseInt($("#order").val()) : null),
                    INB_TYPE: $("#inboxtype").val(),
                    INB_GROUP: $("#inboxgroup").val(),
                    INB_RESULTTYPE: $("#resulttype").val(),
                    INB_CSS: $("#css").val(),
                    INB_COLOR: $("#color").val(),
                    INB_SCREEN: $("#screen").val(),
                    INB_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                    INB_ISVALIDATED: "-",
                    INB_INFO: $("#informationtext").val(),
                    INB_RECORDVERSION: selectedrecord != null ? selectedrecord.INB_RECORDVERSION : 0,
                    INB_SQLIDENTITY: selectedrecord != null ? selectedrecord.INB_SQLIDENTITY : 0
                },
                descriptions: vals
            });

            return tms.Ajax({
                url: "/Api/ApiInbox/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r.inbox;
                    FillUserInterface();
                    $("#isvalidated").prop("checked", false);
                }
            });
        };

        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiInbox/DelRec",
                            data: JSON.stringify(selectedrecord.INB_CODE),
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

            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#css").val("");
            $("#sql").val("");
            $("#color").val("");
            $("#condition").val("");
            $("#order").val("");
            $("#inboxgroup").val("");
            $("#inboxtype").val("PERSONAL");
            $("#resulttype").val("QUANTITY");
            $("#screen").val("");
            $("#active").prop("checked", true);
            $("#isvalidated").prop("checked", false);
            $(".colpicker i").removeAttr("style");

            tooltip.hide("#screen");
            infobox.resetUI();
            $("#cssi").removeClass();
        };

        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiInbox/Get",
                data: JSON.stringify(selectedrecord.INB_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };

        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        $(".page-header>h6").html("");
                        self.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            inb.ResetUI();
                        else
                            inb.LoadSelected();
                        break;
                }
            });
        };

        RegisterUiEvents = function () {
            $("#btnNew").click(function () {
                self.ResetUI();
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnTranslations").click(self.TranslationModal);
            $("#btnTestSql").click(TestSql);
        };

        RegisterTabChange();
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: "#btnSave",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                inb.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                inb.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        inb.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                inb.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        inb.HistoryModal();
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
        inb.BuildUI();
        scr.BindHotKeys();
    }
    $(document).ready(ready);
}());