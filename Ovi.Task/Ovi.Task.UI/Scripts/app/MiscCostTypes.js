(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#typ").val("");
        $("#active").prop("checked", true);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMMISCCOSTTYPES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMMISCCOSTTYPES", operator: "eq" },
                { field: "DES_PROPERTY", value: "MCT_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.MCT_CODE);
        $("#desc").val(selectedrecord.MCT_DESC);
        $("#typ").val(selectedrecord.MCT_TYPE);
        $("#active").prop("checked", selectedrecord.MCT_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.MCT_CODE + " - " + selectedrecord.MCT_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiMiscCostTypes/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.MCT_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiMiscCostTypes/DelRec",
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
        if (!tms.Check())
            return $.Deferred().reject();

        var o = JSON.stringify({
            MCT_CODE: $("#code").val().toUpper(),
            MCT_DESC: $("#desc").val(),
            MCT_TYPE: $("#typ").val(),
            MCT_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            MCT_CREATED: selectedrecord != null ? selectedrecord.MCT_CREATED : tms.Now(),
            MCT_CREATEDBY: selectedrecord != null ? selectedrecord.MCT_CREATEDBY : user,
            MCT_UPDATED: selectedrecord != null ? tms.Now() : null,
            MCT_UPDATEDBY: selectedrecord != null ? user : null,
            MCT_RECORDVERSION: selectedrecord != null ? selectedrecord.MCT_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiMiscCostTypes/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.MCT_CODE).list("refresh");
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
            listurl: "/Api/ApiMiscCostTypes/List",
            fields: {
                keyfield: "MCT_CODE",
                descfield: "MCT_DESCF"
            },
            sort: [{ field: "MCT_CODE", dir: "asc" }],
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