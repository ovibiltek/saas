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
                { field: "AUD_SUBJECT", value: "TMSYSTEMGROUPCODES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMSYSTEMGROUPCODES", operator: "eq" },
                { field: "DES_PROPERTY", value: "SGC_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.SGC_CODE);
        $("#desc").val(selectedrecord.SGC_DESC);
        $("#active").prop("checked", selectedrecord.SGC_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.SGC_CODE + " - " + selectedrecord.SGC_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiSystemGroupCodes/Get",
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
                        url: "/Api/ApiSystemGroupCodes/DelRec",
                        data: JSON.stringify(selectedrecord.SGC_CODE),
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
            SGC_CODE: $("#code").val().toUpper(),
            SGC_DESC: $("#desc").val(),
            SGC_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            SGC_CREATED: selectedrecord != null ? selectedrecord.SGC_CREATED : tms.Now(),
            SGC_CREATEDBY: selectedrecord != null ? selectedrecord.SGC_CREATEDBY : user,
            SGC_UPDATED: selectedrecord != null ? tms.Now() : null,
            SGC_UPDATEDBY: selectedrecord != null ? user : null,
            SGC_RECORDVERSION: selectedrecord != null ? selectedrecord.SGC_RECORDVERSION : 0,
            SGC_SQLIDENTITY: selectedrecord != null ? selectedrecord.SGC_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiSystemGroupCodes/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.SGC_CODE).list("refresh");
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
            listurl: "/Api/ApiSystemGroupCodes/List",
            fields: {
                keyfield: "SGC_CODE",
                descfield: "SGC_DESCF"
            },
            sort: [{ field: "SGC_CODE", dir: "asc" }],
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