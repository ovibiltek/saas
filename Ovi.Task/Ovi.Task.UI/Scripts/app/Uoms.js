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
                { field: "AUD_SUBJECT", value: "TMUOMS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMUOMS", operator: "eq" },
                { field: "DES_PROPERTY", value: "UOM_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");
        $("#code").val(selectedrecord.UOM_CODE);
        $("#desc").val(selectedrecord.UOM_DESC);
        $("#active").prop("checked", selectedrecord.UOM_ACTIVE === "+");
        $(".page-header>h6").html(selectedrecord.UOM_CODE + " - " + selectedrecord.UOM_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiUoms/Get",
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
                        url: "/Api/ApiUoms/DelRec",
                        data: JSON.stringify(selectedrecord.UOM_CODE),
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
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = JSON.stringify({
            UOM_CODE: $("#code").val().toUpper(),
            UOM_DESC: $("#desc").val(),
            UOM_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            UOM_CREATED: selectedrecord != null ? selectedrecord.UOM_CREATED : tms.Now(),
            UOM_CREATEDBY: selectedrecord != null ? selectedrecord.UOM_CREATEDBY : user,
            UOM_UPDATED: selectedrecord != null ? tms.Now() : null,
            UOM_UPDATEDBY: selectedrecord != null ? user : null,
            UOM_RECORDVERSION: selectedrecord != null ? selectedrecord.UOM_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiUoms/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.UOM_CODE).list("refresh");
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

    function list() {
        $(".list-group").list({
            listurl: "/Api/ApiUoms/List",
            fields: {
                keyfield: "UOM_CODE",
                descfield: "UOM_DESC"
            },
            sort: [
                { field: "UOM_CODE", dir: "asc" }
            ],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        list();
        registerUiEvents();
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());