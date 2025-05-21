(function () {
    var selectedrecord = null;
    var scr, reg;

    reg = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");

            $("#planningresponsible").val("");
            $("#supervisor").val("");
            $("#responsible").tagsinput("removeAll");
            $("#reportingresponsible").tagsinput("removeAll");

            $("#responsiblecnt").text("");
            $("#active").prop("checked", true);

            tooltip.hide("#planningresponsible");
            tooltip.hide("#supervisor");

            $("#reportingresponsible").parent().find("div.bootstrap-tagsinput").addClass("required");

        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMREGIONS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMREGIONS", operator: "eq" },
                    { field: "DES_PROPERTY", value: "REG_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {

            tms.BeforeFill("#record");

            $("#code").val(selectedrecord.r.REG_CODE);
            $("#desc").val(selectedrecord.r.REG_DESC);
            $("#planningresponsible").val(selectedrecord.r.REG_PLANNINGRESPONSIBLE);
            $("#supervisor").val(selectedrecord.r.REG_SUPERVISOR);
            $("#active").prop("checked", selectedrecord.r.REG_ACTIVE === "+");

            $("#responsible").tagsinput("removeAll");
            if (selectedrecord.responsibleusers != null)
                for (var i = 0; i < selectedrecord.responsibleusers.length; i++) {
                    $("#responsible").tagsinput("add",
                        {
                            id: selectedrecord.responsibleusers[i].USR_CODE,
                            text: selectedrecord.responsibleusers[i].USR_DESC
                        },
                        ["ignore"]);
                }

            $("#reportingresponsible").tagsinput("removeAll");
            if (selectedrecord.reportingresponsibleusers != null)
                for (var i = 0; i < selectedrecord.reportingresponsibleusers.length; i++) {
                    $("#reportingresponsible").tagsinput("add",
                        {
                            id: selectedrecord.reportingresponsibleusers[i].USR_CODE,
                            text: selectedrecord.reportingresponsibleusers[i].USR_DESC
                        },
                        ["ignore"]);
                }

            tooltip.show("#planningresponsible", selectedrecord.r.REG_PLANNINGRESPONSIBLE);
            tooltip.show("#supervisor", selectedrecord.r.REG_SUPERVISOR);
            $(".page-header>h6").html(selectedrecord.r.REG_CODE + " - " + selectedrecord.r.REG_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiRegions/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d;
                    FillUserInterface();
                }
            });
        };
        this.Remove = function () {
            if (selectedrecord) {
                var code = selectedrecord.r.REG_CODE;
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiRegions/DelRec",
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
                REG_CODE: $("#code").val().toUpper(),
                REG_DESC: $("#desc").val(),
                REG_REPORTINGRESPONSIBLE: ($("#reportingresponsible").val() || null),
                REG_PLANNINGRESPONSIBLE: ($("#planningresponsible").val() || null),
                REG_SUPERVISOR: ($("#supervisor").val() || null),
                REG_RESPONSIBLE: ($("#responsible").val() || null),
                REG_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                REG_CREATED: selectedrecord != null ? selectedrecord.r.REG_CREATED : tms.Now(),
                REG_CREATEDBY: selectedrecord != null ? selectedrecord.r.REG_CREATEDBY : user,
                REG_UPDATED: selectedrecord != null ? tms.Now() : null,
                REG_UPDATEDBY: selectedrecord != null ? user : null,
                REG_SQLIDENTITY: selectedrecord != null ? selectedrecord.r.REG_SQLIDENTITY : 0,
                REG_RECORDVERSION: selectedrecord != null ? selectedrecord.r.REG_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiRegions/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.r.REG_CODE).list("refresh");
                }
            });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Remove);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnTranslations").click(self.TranslationModal);

            $("#btnreportingresponsible").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#reportingresponsible",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnplanningresponsible").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#planningresponsible",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnsupervisor").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#supervisor",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnresponsible").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#responsible",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#planningresponsible").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
            $("#supervisor").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });

            $("#responsible").on("itemAdded", function () {
                $("#responsiblecnt").text("(" + $("#responsible").tagsinput("items").length + " " + applicationstrings[lang].person + ")");
            }).on("itemRemoved", function () {
                var itemcount = $("#responsible").tagsinput("items").length;
                $("#responsiblecnt").text(itemcount !== 0 ? "(" + itemcount + " " + applicationstrings[lang].person + ")" : "");
            });
            $("#reportingresponsible").on("itemAdded", function () {
                $("#reportingresponsiblecnt").text("(" + $("#reportingresponsible").tagsinput("items").length + " " + applicationstrings[lang].person + ")");
            }).on("itemRemoved", function () {
                var itemcount = $("#reportingresponsible").tagsinput("items").length;
                $("#reportingresponsiblecnt").text(itemcount !== 0 ? "(" + itemcount + " " + applicationstrings[lang].person + ")" : "");
            });
            $("#btnaddme1").click(function () { $("#reportingresponsible").tagsinput("add", { id: user, text: userdesc }); });
            $("#btnaddme2").click(function () { $("#responsible").tagsinput("add", { id: user, text: userdesc }); });
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiRegions/List",
                fields: {
                    keyfield: "REG_CODE",
                    descfield: "REG_DESCF"
                },
                sort: [{ field: "REG_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    scr.LoadSelected();
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
                    e: "#btnSave",
                    f: function () {
                        reg.Save();
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function() {
                        reg.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function() {
                        reg.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function() {
                        reg.Remove();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function() {
                        reg.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function() {
                        reg.TranslationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            $.when(reg.LoadSelected()).done(function () {
            });
        };
    };

    function ready() {
        reg.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());