(function () {
    var selectedrecord = null;

    var BuildModals = function() {
        $("#btnParentSystemCode").click(function() {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#parentSystemCode",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", Operator: "eq" },
                    { field: "SYC_CODE", value: $("#code").val(), Operator: "neq" }
                ],
                callback: function (d) {
                    $("#parentSystemCode").data("group", d ? d.SYC_GROUP : null);
                }
            });
        });
        $("#btngroup").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemGroupCodes/List",
                keyfield: "SGC_CODE",
                codefield: "SGC_CODE",
                textfield: "SGC_DESCF",
                returninput: "#group",
                columns: [
                    { type: "string", field: "SGC_CODE", title: gridstrings.systemgroupcodes[lang].code, width: 100 },
                    { type: "string", field: "SGC_DESCF", title: gridstrings.systemgroupcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SGC_ACTIVE", value: "+", Operator: "eq" }
                ]
            });
        });
    };

    var autoComplete = function() {
        $("#parentSystemCode").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [
                { field: "SYC_CODE", value: $("#code").val(), Operator: "neq" }
            ],
            callback: function (d) {
                $("#parentSystemCode").data("group", d ? d.SYC_GROUP : null);
            }
        });
        $("#group").autocomp({
            listurl: "/Api/ApiSystemGroupCodes/List",
            geturl: "/Api/ApiSystemGroupCodes/Get",
            field: "SGC_CODE",
            textfield: "SGC_DESCF",
            active: "SGC_ACTIVE"
        });
    };

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#group").val("");
        $("#parentSystemCode").val("");
        $("#parentSystemCode").data("group", null);
        $("#order").val("");

        $("#active").prop("checked", true);

        tooltip.hide("#parentSystemCode");
        tooltip.hide("#group");

    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMSYSCODES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMSYSCODES", operator: "eq" },
                { field: "DES_PROPERTY", value: "SYC_DESCRIPTION", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.SYC_CODE);
        $("#desc").val(selectedrecord.SYC_DESCRIPTION);
        $("#group").val(selectedrecord.SYC_GROUP);
        $("#active").prop("checked", selectedrecord.SYC_ACTIVE === "+");
        $("#parentSystemCode").val(selectedrecord.SYC_PARENT);
        $("#parentSystemCode").data("group",selectedrecord.SYC_PARENTGROUP);
        $("#group").val(selectedrecord.SYC_GROUP);
        $("#order").val(selectedrecord.SYC_ORDER);


        tooltip.show("#parentSystemCode", selectedrecord.SYC_PARENTDESC);
        tooltip.show("#group", selectedrecord.SYC_GROUPDESC);

        $(".page-header>h6").html(selectedrecord.SYC_CODE + " - " + selectedrecord.SYC_DESCRIPTION);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        var group = selecteditem.data("group");

        return tms.Ajax({
            url: "/Api/ApiSystemCodes/Get",
            data: JSON.stringify({ SYC_GROUP: group, SYC_CODE: code }),
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
                        url: "/Api/ApiSystemCodes/DelRec",
                        data: JSON.stringify(selectedrecord),
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
            SYC_CODE: $("#code").val().toUpper(),
            SYC_DESCRIPTION: $("#desc").val(),
            SYC_GROUP: $("#group").val(),
            SYC_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            SYC_PARENT: ($("#parentSystemCode").val().toUpper() || null),
            SYC_PARENTGROUP: ($("#parentSystemCode").data("group") || null),
            SYC_ORDER: $("#order").val(),
            SYC_CREATED: selectedrecord != null ? selectedrecord.SYC_CREATED : tms.Now(),
            SYC_CREATEDBY: selectedrecord != null ? selectedrecord.SYC_CREATEDBY : user,
            SYC_UPDATED: selectedrecord != null ? tms.Now() : null,
            SYC_UPDATEDBY: selectedrecord != null ? user : null,
            SYC_RECORDVERSION: selectedrecord != null ? selectedrecord.SYC_RECORDVERSION : 0,
            SYC_SQLIDENTITY: selectedrecord != null ? selectedrecord.SYC_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiSystemCodes/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.SYC_CODE).list("refresh");
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
        BuildModals();
        autoComplete();
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiSystemCodes/List",
            fields: {
                keyfield: "SYC_CODE",
                descfield: "SYC_DESCF",
                datafields: [{ field: "SYC_GROUP", name : "group" }],
                otherfields: [{ field: "SYC_GROUP", label: gridstrings.systemcodes[lang].group, dataprop: true }]
            },
            sort: [{ field: "SYC_CODE", dir: "asc" }],
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