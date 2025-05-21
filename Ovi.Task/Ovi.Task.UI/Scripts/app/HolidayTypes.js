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
                { field: "AUD_SUBJECT", value: "TMHOLIDAYTYPES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMHOLIDAYTYPES", operator: "eq" },
                { field: "DES_PROPERTY", value: "HOT_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.HOT_CODE);
        $("#desc").val(selectedrecord.HOT_DESC);
        $("#active").prop("checked", selectedrecord.HOT_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.HOT_CODE + " - " + selectedrecord.HOT_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiHolidayTypes/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.HOT_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiHolidayTypes/DelRec",
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
            HOT_CODE: $("#code").val().toUpper(),
            HOT_DESC: $("#desc").val(),
            HOT_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            HOT_CREATED: selectedrecord != null ? selectedrecord.HOT_CREATED : tms.Now(),
            HOT_CREATEDBY: selectedrecord != null ? selectedrecord.HOT_CREATEDBY : user,
            HOT_UPDATED: selectedrecord != null ? tms.Now() : null,
            HOT_UPDATEDBY: selectedrecord != null ? user : null,
            HOT_RECORDVERSION: selectedrecord != null ? selectedrecord.HOT_RECORDVERSION : 0,
            HOT_SQLIDENTITY: selectedrecord != null ? selectedrecord.HOT_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiHolidayTypes/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.HOT_CODE).list("refresh");
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
            listurl: "/Api/ApiHolidayTypes/List",
            fields: {
                keyfield: "HOT_CODE",
                descfield: "HOT_DESCF"
            },
            sort: [{ field: "HOT_CODE", dir: "asc" }],
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