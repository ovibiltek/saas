(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#description").val("");
        $("#order").val("");
        $("#active").prop("checked", true);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMCUSTOMFIELDGROUPS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMCUSTOMFIELDGROUPS", operator: "eq" },
                { field: "DES_PROPERTY", value: "CFG_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.CFG_CODE);
        $("#description").val(selectedrecord.CFG_DESC);
        $("#order").val(selectedrecord.CFG_ORDER);
        $("#active").prop("checked", selectedrecord.CFG_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.CFG_CODE + " - " + selectedrecord.CFG_DESCF);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiCustomFieldGroups/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.CFG_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiCustomFieldGroups/DelRec",
                                data: JSON.stringify(code),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    resetUI();
                                    $(".list-group").list("refresh");
                                }
                            });
                        });
            }
        }
    }

    function save() {
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = JSON.stringify({
            CFG_CODE: $("#code").val().toUpper(),
            CFG_DESC: $("#description").val(),
            CFG_ORDER: $("#order").val(),
            CFG_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            CFG_CREATED: selectedrecord != null ? selectedrecord.CFG_CREATED : tms.Now(),
            CFG_CREATEDBY: selectedrecord != null ? selectedrecord.CFG_CREATEDBY : user,
            CFG_UPDATED: selectedrecord != null ? tms.Now() : null,
            CFG_UPDATEDBY: selectedrecord != null ? user : null,
            CFG_RECORDVERSION: selectedrecord != null ? selectedrecord.CFG_RECORDVERSION : 0,
            CFG_SQLIDENTITY: selectedrecord != null ? selectedrecord.CFG_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiCustomFieldGroups/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.CFG_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);
        $("#btnTranslations").click(translationModal);
    }

    function bindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    save();
                }
            },
            {
                k: "ctrl+r",
                e: "#btnNew",
                f: function () {
                    resetUI();
                }
            },
            {
                k: "ctrl+u",
                e: "#btnUndo",
                f: function () {
                    loadSelected();
                }
            },
            {
                k: "ctrl+d",
                e: "#btnDelete",
                f: function () {
                    remove();
                }
            },
            {
                k: "ctrl+h",
                e: "#btnHistory",
                f: function () {
                    historyModal();
                }
            },
            {
                k: "ctrl+q",
                e: "#btnTranslations",
                f: function () {
                    translationModal();
                }
            }
        ]);
    }

    function buildUI() {
        resetUI();

        $(".list-group").list({
            listurl: "/Api/ApiCustomFieldGroups/List",
            fields: {
                keyfield: "CFG_CODE",
                descfield: "CFG_DESC"
            },
            sort: [{ field: "CFG_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });

        registerUiEvents();
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());