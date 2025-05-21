(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#active").prop("checked", true);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMBRANDS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMBRANDS", operator: "eq" },
                { field: "DES_PROPERTY", value: "BRA_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.BRA_CODE);
        $("#desc").val(selectedrecord.BRA_DESC);
        $("#active").prop("checked", selectedrecord.BRA_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.BRA_CODE + " - " + selectedrecord.BRA_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiBrands/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiBrands/DelRec",
                        data: JSON.stringify(selectedrecord.BRA_CODE),
                        fn: function (d) {
                            msgs.success(d.data);
                            resetUI();
                            $(".list-group").list("refresh");
                        }
                    });
                });
        }
    }

    function save() {
        if (!tms.Check())
            return $.Deferred().reject();

        var o = JSON.stringify({
            BRA_CODE: $("#code").val().toUpper(),
            BRA_DESC: $("#desc").val(),
            BRA_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            BRA_CREATED: selectedrecord != null ? selectedrecord.BRA_CREATED : tms.Now(),
            BRA_CREATEDBY: selectedrecord != null ? selectedrecord.BRA_CREATEDBY : user,
            BRA_UPDATED: selectedrecord != null ? tms.Now() : null,
            BRA_UPDATEDBY: selectedrecord != null ? user : null,
            BRA_SQLIDENTITY: selectedrecord != null ? selectedrecord.BRA_SQLIDENTITY : 0,
            BRA_RECORDVERSION: selectedrecord != null ? selectedrecord.BRA_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiBrands/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.BRA_CODE).list("refresh");
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

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiBrands/List",
            fields: {
                keyfield: "BRA_CODE",
                descfield: "BRA_DESCF"
            },
            sort: [{ field: "BRA_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        List();
        registerUiEvents();
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

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());