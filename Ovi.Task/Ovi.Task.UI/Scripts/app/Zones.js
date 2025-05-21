(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#type").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#type");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMZONES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMZONES", operator: "eq" },
                { field: "DES_PROPERTY", value: "ZON_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.ZON_CODE);
        $("#desc").val(selectedrecord.ZON_DESC);
        $("#type").val(selectedrecord.ZON_TYPE);
        $("#active").prop("checked", selectedrecord.ZON_ACTIVE === "+");

        tooltip.show("#type", selectedrecord.ZON_TYPEDESC);

        $(".page-header>h6").html(selectedrecord.ZON_CODE + " - " + selectedrecord.ZON_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiZones/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.ZON_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiZones/DelRec",
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
            ZON_CODE: $("#code").val().toUpper(),
            ZON_DESC: $("#desc").val(),
            ZON_TYPEENTITY: "CUSTOMER",
            ZON_TYPE: $("#type").val(),
            ZON_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            ZON_CREATED: selectedrecord != null ? selectedrecord.ZON_CREATED : tms.Now(),
            ZON_CREATEDBY: selectedrecord != null ? selectedrecord.ZON_CREATEDBY : user,
            ZON_UPDATED: selectedrecord != null ? tms.Now() : null,
            ZON_UPDATEDBY: selectedrecord != null ? user : null,
            ZON_RECORDVERSION: selectedrecord != null ? selectedrecord.ZON_RECORDVERSION : 0,
            ZON_SQLIDENTITY: selectedrecord != null ? selectedrecord.ZON_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiZones/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.ZON_CODE).list("refresh");
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

        $("#btntype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESC",
                returninput: "#type",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_ENTITY", value: "CUSTOMER", operator: "eq" },
                    { field: "TYP_ORGANIZATION", value: "*", operator: "eq" }
                ]
            });
        });
        $("#type").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            active: "TYP_ACTIVE",
            filter: [
                { field: "TYP_ORGANIZATION", value: "*", includeall: false },
                { field: "TYP_CODE", value: "*", operator: "neq" },
                { field: "TYP_ENTITY", value: "CUSTOMER", operator: "eq" }
            ]
        });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiZones/List",
            fields: {
                keyfield: "ZON_CODE",
                descfield: "ZON_DESCF"
            },
            sort: [{ field: "ZON_CODE", dir: "asc" }],
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