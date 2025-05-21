(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#org").val("");
        $("#group").val("");
        $("#active").prop("checked", true);
        $("#psp").prop("checked", false);
        $("#tasktyperequired").prop("checked", false);

    }

    function autoComplete() {
        $("#group").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [{ field: "SYC_GROUP", value: "KTG", operator: "eq" }]
        });

        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE"
        });
    }

    function buildModals() {
        $("#btngroup").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#group",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value:"KTG", operator: "eq" }
                ]
            });
        });
        $("#btnorg").click(function () {
            gridModal.show({
                modaltitle: gridstrings.org[lang].title,
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                keyfield: "ORG_CODE",
                codefield: "ORG_CODE",
                textfield: "ORG_DESCF",
                returninput: "#org",
                columns: [
                    { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                    { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                ],
                filter: [
                    { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
    }
    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMCATEGORIES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMCATEGORIES", operator: "eq" },
                { field: "DES_PROPERTY", value: "CAT_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.CAT_CODE);
        $("#desc").val(selectedrecord.CAT_DESC);
        $("#active").prop("checked", selectedrecord.CAT_ACTIVE === "+");
        $("#psp").prop("checked", selectedrecord.CAT_PSP === "+");
        $("#tasktyperequired").prop("checked", selectedrecord.CAT_TSKTYPEREQUIRED === "+");
        $("#org").val(selectedrecord.CAT_ORGANIZATION);
        $("#group").val(selectedrecord.CAT_GROUP);
        $(".page-header>h6").html(selectedrecord.CAT_CODE + " - " + selectedrecord.CAT_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiCategories/Get",
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
                        url: "/Api/ApiCategories/DelRec",
                        data: JSON.stringify(selectedrecord.CAT_CODE),
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
            CAT_CODE: $("#code").val().toUpper(),
            CAT_DESC: $("#desc").val(),
            CAT_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            CAT_PSP: $("#psp").prop("checked") ? "+" : "-",
            CAT_TSKTYPEREQUIRED: $("#tasktyperequired").prop("checked") ? "+" : "-",
            CAT_CREATED: selectedrecord != null ? selectedrecord.CAT_CREATED : tms.Now(),
            CAT_CREATEDBY: selectedrecord != null ? selectedrecord.CAT_CREATEDBY : user,
            CAT_UPDATED: selectedrecord != null ? tms.Now() : null,
            CAT_UPDATEDBY: selectedrecord != null ? user : null,
            CAT_SQLIDENTITY: selectedrecord != null ? selectedrecord.CAT_SQLIDENTITY : 0,
            CAT_RECORDVERSION: selectedrecord != null ? selectedrecord.CAT_RECORDVERSION : 0,
            CAT_GROUP: $("#group").val(),
            CAT_ORGANIZATION: $("#org").val()
        });

        return tms.Ajax({
            url: "/Api/ApiCategories/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.CAT_CODE).list("refresh");
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
            listurl: "/Api/ApiCategories/List",
            fields: {
                keyfield: "CAT_CODE",
                descfield: "CAT_DESCF"
            },
            sort: [{ field: "CAT_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        autoComplete();
        buildModals();
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