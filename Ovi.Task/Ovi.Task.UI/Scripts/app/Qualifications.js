(function () {
    var selectedrecord = null;
    var scr, qua;

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
    ];
    qua = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#active").prop("checked", true);

        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMQUALIFICATIONS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMQUALIFICATIONS", operator: "eq" },
                    { field: "DES_PROPERTY", value: "QUL_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {

            (tms.ActiveTab() === "record")
            tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.QUL_CODE);
            $("#desc").val(selectedrecord.QUL_DESC);
            $("#active").prop("checked", selectedrecord.QUL_ACTIVE === "+");


            $(".page-header>h6").html(selectedrecord.QUL_CODE + " - " + selectedrecord.QUL_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            tms.Ajax({
                url: "/Api/ApiQualifications/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Remove = function () {
            if (selectedrecord) {
                var code = selectedrecord.QUL_CODE;
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        tms.Ajax({
                            url: "/Api/ApiQualifications/DelRec",
                            data: JSON.stringify(code),
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
                QUL_CODE: $("#code").val().toUpper(),
                QUL_DESC: $("#desc").val(),
                QUL_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                QUL_CREATED: selectedrecord != null ? selectedrecord.QUL_CREATED : tms.Now(),
                QUL_CREATEDBY: selectedrecord != null ? selectedrecord.QUL_CREATEDBY : user,
                QUL_UPDATED: selectedrecord != null ? tms.Now() : null,
                QUL_UPDATEDBY: selectedrecord != null ? user : null,
                QUL_SQLIDENTITY: selectedrecord != null ? selectedrecord.QUL_SQLIDENTITY : 0,
                QUL_RECORDVERSION: selectedrecord != null ? selectedrecord.QUL_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiQualifications/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.QUL_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var activatedTab = e.target.hash; // activated tab
                    switch (activatedTab) {
                        case "#record":
                            qua.List();
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

            //$("#org").autocomp({
            //    listurl: "/Api/ApiOrgs/ListUserOrganizations",
            //    geturl: "/Api/ApiOrgs/Get",
            //    field: "ORG_CODE",
            //    textfield: "ORG_DESCF",
            //    active: "ORG_ACTIVE"
            //});
            //$("#manager").autocomp({
            //    listurl: "/Api/ApiUsers/List",
            //    geturl: "/Api/ApiUsers/Get",
            //    field: "USR_CODE",
            //    textfield: "USR_DESC",
            //    active: "USR_ACTIVE",
            //    filter: [{ field: "USR_CODE", value: "*", operator: "neq" }]
            //});

            //$("#btnorg").click(function () {
            //    gridModal.show({
            //        modaltitle: gridstrings.org[lang].title,
            //        listurl: "/Api/ApiOrgs/ListUserOrganizations",
            //        keyfield: "ORG_CODE",
            //        codefield: "ORG_CODE",
            //        textfield: "ORG_DESCF",
            //        returninput: "#org",
            //        columns: [
            //            { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
            //            { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
            //        ],
            //        filter: [
            //            { field: "ORG_ACTIVE", value: "+", operator: "eq" }
            //        ]
            //    });
            //});
            //$("#btnmanager").click(function () {
            //    gridModal.show({
            //        modaltitle: gridstrings.user[lang].title,
            //        listurl: "/Api/ApiUsers/List",
            //        keyfield: "USR_CODE",
            //        codefield: "USR_CODE",
            //        textfield: "USR_DESC",
            //        returninput: "#manager",
            //        columns: [
            //            { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
            //            { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
            //        ],
            //        filter: [
            //            { field: "USR_ACTIVE", value: "+", operator: "eq" },
            //            { field: "USR_CODE", value: "*", operator: "neq" }
            //        ]
            //    });
            //});
            //$("#btnauthorized").click(function () {
            //    gridModal.show({
            //        modaltitle: gridstrings.user[lang].title,
            //        listurl: "/Api/ApiUsers/List",
            //        keyfield: "USR_CODE",
            //        codefield: "USR_CODE",
            //        textfield: "USR_DESC",
            //        returninput: "#authorized",
            //        multiselect: true,
            //        columns: [
            //            { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
            //            { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
            //        ],
            //        filter: [
            //            { field: "USR_ACTIVE", value: "+", operator: "eq" },
            //            { field: "USR_CODE", value: "*", operator: "neq" }
            //        ]
            //    });
            //});
            //$("#authorized").on("itemAdded",
            //    function () {
            //        $("#authorizedcnt").text("(" +
            //            $("#authorized").tagsinput("items").length +
            //            " " +
            //            applicationstrings[lang].person +
            //            ")");
            //    }).on("itemRemoved",
            //    function () {
            //        var itemcount = $("#authorized").tagsinput("items").length;
            //        $("#authorizedcnt").text(itemcount !== 0
            //            ? "(" + itemcount + " " + applicationstrings[lang].person + ")"
            //            : "");
            //    });

            //RegisterTabChange();
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiQualifications/List",
                fields: {
                    keyfield: "QUL_CODE",
                    descfield: "QUL_DESC"
                },
                sort: [{ field: "QUL_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    //scr.LoadSelected();
                    self.LoadSelected();
                }
            });
        };
        this.BuildUI = function () {
            self.ResetUI();
            List();
            RegisterUiEvents();
        };
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                if (!$("#btnSave").prop("disabled")) {
                                    qua.Save();
                                }
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    f: function () {
                        if (!$("#btnNew").prop("disabled"))
                            qua.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    f: function () {
                        if (!$("#btnUndo").prop("disabled"))
                            qua.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    f: function () {
                        if (!$("#btnDelete").prop("disabled"))
                            qua.Remove();
                    }
                },
                {
                    k: "ctrl+h",
                    f: function () {
                        if (!$("#btnHistory").prop("disabled"))
                            qua.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    f: function () {
                        if (!$("#btnTranslations").prop("disabled"))
                            qua.TranslationModal();
                    }
                }
            ]);
        };
        //this.LoadSelected = function () {
        //    $.when(qua.LoadSelected()).done(function () {
        //        //switch (tms.ActiveTab()) {
        //        //    case "tasktypes":
        //        //        typ.LoadquaartmentTaskTypes();
        //        //        break;
        //        //    case "categories":
        //        //        cat.LoadquaartmentCategories();
        //        //        break;
        //        //}
        //    });
        //};
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
        qua.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());