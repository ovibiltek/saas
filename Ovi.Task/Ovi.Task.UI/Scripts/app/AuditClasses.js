(function () {
    var selectedrecord = null;
    var scr, auc;

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


    auc = new function () {
        var self = this;
        var grdAuditClasses = null;
        var grdAuditClassesElm = $("#grdAuditClasses");

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");
            $("#btnBrowse").attr("disabled", "disabled");

            $("#audclasses").val("");
            $("#auddesc").val("");
            $("#audnamespace").val("");
            $("#audtype").val("");
            
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMAUDITCLASSES", operator: "eq" },
                    { field: "AUD_REFID", value: $("#audclasses").val(), operator: "eq" }
                ]
            });
        };

        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#btnBrowse").removeAttr("disabled");

            $("#audclasses").val(selectedrecord.AUC_CLASS);
            $("#auddesc").val(selectedrecord.AUC_DESC);
            $("#audnamespace").val(selectedrecord.AUC_NAMESPACE);
            $("#audtype").val(selectedrecord.AUC_TYPE);

            $(".page-header>h6").html(selectedrecord.AUC_CLASS + " - " + selectedrecord.AUC_DESC);

        };

        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiAuditClasses/Get",
                data: JSON.stringify(selectedrecord.AUC_ID),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiAuditClasses/DelRec",
                        data: JSON.stringify(selectedrecord.AUC_ID),
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

            var o = JSON.stringify({
                    AUC_ID: selectedrecord ? selectedrecord.AUC_ID : 0,
                    AUC_CLASS: $("#audclasses").val(),
                    AUC_DESC: $("#auddesc").val(),
                    AUC_NAMESPACE: $("#audnamespace").val(),
                    AUC_TYPE: $("#audtype").val(),
                    AUC_CREATED: selectedrecord != null ? selectedrecord.AUC_CREATED : tms.Now(),
                    AUC_CREATEDBY: selectedrecord != null ? selectedrecord.AUC_CREATEDBY : user,
                    AUC_UPDATED: selectedrecord != null ? tms.Now() : null,
                    AUC_UPDATEDBY: selectedrecord != null ? user : null,
                    AUC_RECORDVERSION: selectedrecord != null ? selectedrecord.CUS_RECORDVERSION : 0
            })

            return tms.Ajax({
                url: "/Api/ApiAuditClasses/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    return self.LoadSelected();
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        auc.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            auc.ResetUI();
                        else
                            auc.LoadSelected();
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

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });

        };
        var ItemSelect = function (row) {
            selectedrecord = grdAuditClasses.GetRowDataItem(row);
            $(".page-header h6").html(selectedrecord.AUC_CLASS + " - " + selectedrecord.AUC_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdAuditClassesElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdAuditClassesElm.find("#search").off("click").on("click", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdAuditClasses) {
                grdAuditClasses.ClearSelection();
                grdAuditClasses.RunFilter(gridfilter);
            } else {
                grdAuditClasses = new Grid({
                    keyfield: "AUC_ID",
                    columns: [
                        {
                            type: "string",
                            field: "AUC_CLASS",
                            title: gridstrings.auditclasses[lang].class,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "AUC_DESC",
                            title: gridstrings.auditclasses[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "AUC_NAMESPACE",
                            title: gridstrings.auditclasses[lang].namespace,
                            width: 250
                        },

                        {
                            type: "string",
                            field: "AUC_TYPE",
                            title: gridstrings.auditclasses[lang].type,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "AUC_CREATED",
                            title: gridstrings.auditclasses[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "AUC_CREATEDBY",
                            title: gridstrings.auditclasses[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "AUC_UPDATED",
                            title: gridstrings.auditclasses[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "AUC_UPDATEDBY",
                            title: gridstrings.auditclasses[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        AUC_ID: { type: "number" },
                        AUC_CREATED: { type: "datetime" },
                        AUC_UPDATED: { type: "datetime" }
                    },
                    datasource: "/Api/ApiAuditClasses/List",
                    selector: "#grdAuditClasses",
                    name: "grdAuditClasses",
                    height: constants.defaultgridheight - 100,
                    primarycodefield: "AUC_ID",
                    primarytextfield: "AUC_CLASS",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "AUC_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    hasfiltermenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"AuditClasses.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
                          
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                auc.Save();
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
                           
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                auc.ResetUI();
                                break;
                         
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        auc.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                        
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                auc.Delete();
                                break; 
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        auc.HistoryModal();
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
        auc.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());