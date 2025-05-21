(function () {
    var selectedrecord = null;
    var scr, cug;

    cug = new function () {
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
                    { field: "AUD_SUBJECT", value: "TMCUSTOMERGROUPS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            $("#code").val(selectedrecord.CUG_CODE);
            $("#desc").val(selectedrecord.CUG_DESC);
            $("#active").prop("checked", selectedrecord.CUG_ACTIVE === "+");
            $(".page-header>h6").html(selectedrecord.CUG_CODE + " - " + selectedrecord.CUG_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiCustomerGroups/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Remove = function () {
            if (selectedrecord) {
                var code = selectedrecord.CUG_CODE;
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiCustomerGroups/DelRec",
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
                CUG_CODE: $("#code").val().toUpper(),
                CUG_DESC: $("#desc").val(),
                CUG_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                CUG_CREATED: selectedrecord != null ? selectedrecord.CUG_CREATED : tms.Now(),
                CUG_CREATEDBY: selectedrecord != null ? selectedrecord.CUG_CREATEDBY : user,
                CUG_UPDATED: selectedrecord != null ? tms.Now() : null,
                CUG_UPDATEDBY: selectedrecord != null ? user : null,
                CUG_SQLIDENTITY: selectedrecord != null ? selectedrecord.CUG_SQLIDENTITY : 0,
                CUG_RECORDVERSION: selectedrecord != null ? selectedrecord.CUG_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiCustomerGroups/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.CUG_CODE).list("refresh");
                }
            });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Remove);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiCustomerGroups/List",
                fields: {
                    keyfield: "CUG_CODE",
                    descfield: "CUG_DESC"
                },
                sort: [{ field: "CUG_CODE", dir: "asc" }],
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
                        cug.Save();
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        cug.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        cug.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        cug.Remove();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        cug.HistoryModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            $.when(cug.LoadSelected()).done(function () {
            });
        };
    };

    function ready() {
        cug.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());