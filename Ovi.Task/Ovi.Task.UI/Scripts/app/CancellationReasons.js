(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#entity").val("");
        $("#code").val("");
        $("#desc").val("");
        $("#active").prop("checked", true);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMCANCELLATIONREASONS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMCANCELLATIONREASONS", operator: "eq" },
                { field: "DES_PROPERTY", value: "CNR_DESC", operator: "eq" },
                { field: "DES_CODE", value: ($("#entity").val() + "#" + $("#code").val()), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#entity").val(selectedrecord.CNR_ENTITY);
        $("#code").val(selectedrecord.CNR_CODE);
        $("#desc").val(selectedrecord.CNR_DESC);
        $("#active").prop("checked", selectedrecord.CNR_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.CNR_CODE + " - " + selectedrecord.CNR_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var prm = {
            CNR_CODE: selecteditem.data("id"),
            CNR_ENTITY: selecteditem.data("entity")
        };
        return tms.Ajax({
            url: "/Api/ApiCancellationReasons/Get",
            data: JSON.stringify(prm),
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
                        url: "/Api/ApiCancellationReasons/DelRec",
                        data: JSON.stringify({
                            CNR_CODE: selectedrecord.CNR_CODE,
                            CNR_ENTITY: selectedrecord.CNR_ENTITY
                        }),
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
            CNR_ENTITY: $("#entity").val(),
            CNR_CODE: $("#code").val().toUpper(),
            CNR_DESC: $("#desc").val(),
            CNR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            CNR_CREATED: selectedrecord != null ? selectedrecord.CNR_CREATED : tms.Now(),
            CNR_CREATEDBY: selectedrecord != null ? selectedrecord.CNR_CREATEDBY : user,
            CNR_UPDATED: selectedrecord != null ? tms.Now() : null,
            CNR_UPDATEDBY: selectedrecord != null ? user : null,
            CNR_RECORDVERSION: selectedrecord != null ? selectedrecord.CNR_RECORDVERSION : 0,
            CNR_SQLIDENTITY: selectedrecord != null ? selectedrecord.CNR_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiCancellationReasons/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.CNR_CODE).list("refresh");
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
            listurl: "/Api/ApiCancellationReasons/List",
            fields: {
                keyfield: "CNR_CODE",
                descfield: "CNR_DESCF",
                entityfield: "CNR_ENTITY",
                otherfields: [{ field: "CNR_ENTITY", label: gridstrings.type[lang].entity }]
            },
            sort: [{ field: "CNR_CODE", dir: "asc" }],
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