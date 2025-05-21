(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");
        $("#code").val("");
        $("#desc").val("");
        $("#value").val("");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMPARAMETERS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");
        $("#code").val(selectedrecord.PRM_CODE);
        $("#desc").val(selectedrecord.PRM_DESC);
        $("#value").val(selectedrecord.PRM_VALUE);
        $("#encrypt").prop("checked", selectedrecord.PRM_ISENCRYPTED === "+");
        $(".page-header>h6").html(selectedrecord.PRM_CODE + " - " + selectedrecord.PRM_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiParameters/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.PRM_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiParameters/DelRec",
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
            PRM_CODE: $("#code").val().toUpper(),
            PRM_DESC: $("#desc").val(),
            PRM_VALUE: $("#value").val(),
            PRM_ISENCRYPTED: $("#encrypt").prop("checked") ? "+" : "-",
            PRM_CREATED: selectedrecord != null ? selectedrecord.PRM_CREATED : tms.Now(),
            PRM_CREATEDBY: selectedrecord != null ? selectedrecord.PRM_CREATEDBY : user,
            PRM_UPDATED: selectedrecord != null ? tms.Now() : null,
            PRM_UPDATEDBY: selectedrecord != null ? user : null,
            PRM_RECORDVERSION: selectedrecord != null ? selectedrecord.PRM_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiParameters/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.PRM_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);
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
            }
        ]);
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiParameters/List",
            fields: {
                keyfield: "PRM_CODE",
                descfield: "PRM_DESC"
            },
            sort: [{ field: "PRM_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected(item);
            }
        });
    }

    function buildUI() {
        resetUI();
        List();
        registerUiEvents();
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());