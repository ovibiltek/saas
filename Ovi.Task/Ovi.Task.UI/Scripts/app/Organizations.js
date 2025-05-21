(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#email").val("");
        $("#type").val("");
        $("#customer").val("");
        $("#department").val("");
        $("#branch").val("");
        $("#currency").val("");
        $("#active").prop("checked", true);
        $("#locationrequired").prop("checked", true);
        $("#autoclosetask").prop("checked", false);

        tooltip.hide("#type");
        tooltip.hide("#customer");
        tooltip.hide("#branch");
        tooltip.hide("#department");
        tooltip.hide("#currency");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMORGS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMORGS", operator: "eq" },
                { field: "DES_PROPERTY", value: "ORG_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.ORG_CODE);
        $("#desc").val(selectedrecord.ORG_DESC);
        $("#email").val(selectedrecord.ORG_EMAIL);
        $("#type").val(selectedrecord.ORG_TSKTYPE);
        $("#customer").val(selectedrecord.ORG_TSKCUSTOMER);
        $("#department").val(selectedrecord.ORG_TSKDEPARTMENT);
        $("#branch").val(selectedrecord.ORG_TSKBRANCH);
        $("#currency").val(selectedrecord.ORG_CURRENCY);
        $("#active").prop("checked", selectedrecord.ORG_ACTIVE === "+");
        $("#locationrequired").prop("checked", selectedrecord.ORG_LOCATIONREQUIRED === "+");
        $("#autoclosetask").prop("checked", selectedrecord.ORG_AUTOCLOSETASK === "+");

        tooltip.show("#type", selectedrecord.ORG_TSKTYPEDESC);
        tooltip.show("#customer", selectedrecord.ORG_TSKCUSTOMERDESC);
        tooltip.show("#department", selectedrecord.ORG_TSKDEPARTMENTDESC);
        tooltip.show("#branch", selectedrecord.ORG_TSKBRANCHDESC);
        tooltip.show("#currency", selectedrecord.ORG_CURRENCYDESC);
        $(".page-header>h6").html(selectedrecord.ORG_CODE + " - " + selectedrecord.ORG_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiOrgs/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.ORG_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiOrgs/DelRec",
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
            ORG_CODE: $("#code").val().toUpper(),
            ORG_DESC: $("#desc").val(),
            ORG_EMAIL: ($("#email").val() || null),
            ORG_TSKTYPE: ($("#type").val() || null),
            ORG_TSKTYPEENTITY: "TASK",
            ORG_TSKCUSTOMER: ($("#customer").val() || null),
            ORG_TSKDEPARTMENT: ($("#department").val() || null),
            ORG_TSKBRANCH: ($("#branch").val() || null),
            ORG_CURRENCY: $("#currency").val(),
            ORG_LOCATIONREQUIRED: $("#locationrequired").prop("checked") ? "+" : "-",
            ORG_AUTOCLOSETASK: $("#autoclosetask").prop("checked") ? "+" : "-",
            ORG_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            ORG_CREATED: selectedrecord != null ? selectedrecord.ORG_CREATED : tms.Now(),
            ORG_CREATEDBY: selectedrecord != null ? selectedrecord.ORG_CREATEDBY : user,
            ORG_UPDATED: selectedrecord != null ? tms.Now() : null,
            ORG_UPDATEDBY: selectedrecord != null ? user : null,
            ORG_SQLIDENTITY: selectedrecord != null ? selectedrecord.ORG_SQLIDENTITY : 0,
            ORG_RECORDVERSION: selectedrecord != null ? selectedrecord.ORG_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiOrgs/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.ORG_CODE).list("refresh");
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

        $("#type").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESCF",
            filter: [
                { field: "TYP_ORGANIZATION", relfield: "#code", includeall: true },
                { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                { field: "TYP_CODE", value: "*", operator: "neq" }
            ]
        });
        $("#department").autocomp({
            listurl: "/Api/ApiDepartments/List",
            geturl: "/Api/ApiDepartments/Get",
            field: "DEP_CODE",
            textfield: "DEP_DESC",
            active: "DEP_ACTIVE",
            filter: [
                { field: "DEP_CODE", value: "*", operator: "neq" },
                { field: "DEP_ORG", relfield: "#code", includeall: true }
            ]
        });
        $("#customer").autocomp({
            listurl: "/Api/ApiCustomers/List",
            geturl: "/Api/ApiCustomers/Get",
            field: "CUS_CODE",
            textfield: "CUS_DESC",
            active: "CUS_ACTIVE",
            filter: [{ field: "CUS_ORG", relfield: "#code", includeall: true }],
            callback: function (data) {
                $("#branch").val("");
                tooltip.hide("#branch");
            }
        });
        $("#branch").autocomp({
            listurl: "/Api/ApiBranches/List",
            geturl: "/Api/ApiBranches/Get",
            field: "BRN_CODE",
            textfield: "BRN_DESC",
            active: "BRN_ACTIVE",
            filter: [{ field: "BRN_CUSTOMER", relfield: "#customer", includeall: false }]
        });
        $("#currency").autocomp({
            listurl: "/Api/ApiCurrencies/List",
            geturl: "/Api/ApiCurrencies/Get",
            field: "CUR_CODE",
            textfield: "CUR_DESC",
            active: "CUR_ACTIVE",
            filter: [
                { field: "CUR_CODE", value: "*", operator: "neq" }
            ]
        });

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
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "TASK", operator: "eq" }
                ]
            });
        });
        $("#btndepartment").click(function () {
            gridModal.show({
                modaltitle: gridstrings.dep[lang].title,
                listurl: "/Api/ApiDepartments/List",
                keyfield: "DEP_CODE",
                codefield: "DEP_CODE",
                textfield: "DEP_DESC",
                returninput: "#department",
                columns: [
                    { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                    { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 400 }
                ],
                filter: [
                    { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    { field: "DEP_ORG", value: [$("#code").val(), "*"], operator: "in" },
                ]
            });
        });
        $("#btncustomer").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customer[lang].title,
                listurl: "/Api/ApiCustomers/List",
                keyfield: "CUS_CODE",
                codefield: "CUS_CODE",
                textfield: "CUS_DESC",
                returninput: "#customer",
                columns: [
                    { type: "string", field: "CUS_CODE", title: gridstrings.customer[lang].code, width: 100 },
                    { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 400 }
                ],
                filter: [
                    { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                    { field: "CUS_CODE", value: "*", operator: "neq" },
                    { field: "CUS_ORG", value: [$("#code").val(), "*"], operator: "in" }
                ]
            });
        });
        $("#btnbranch").click(function () {
            gridModal.show({
                modaltitle: gridstrings.branches[lang].title,
                listurl: "/Api/ApiBranches/List",
                keyfield: "BRN_CODE",
                codefield: "BRN_CODE",
                textfield: "BRN_DESC",
                returninput: "#branch",
                columns: [
                    { type: "string", field: "BRN_CODE", title: gridstrings.branches[lang].code, width: 100 },
                    { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 400 },
                    { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                ],
                filter: [
                    { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                    { field: "BRN_CODE", value: "*", operator: "neq" },
                    { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                ]
            });
        });
        $("#btncurrency").click(function () {
            gridModal.show({
                modaltitle: gridstrings.currencies[lang].title,
                listurl: "/Api/ApiCurrencies/List",
                keyfield: "CUR_CODE",
                codefield: "CUR_CODE",
                textfield: "CUR_DESC",
                returninput: "#currency",
                columns: [
                    { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                    { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                ],
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                    { field: "CUR_CODE", value: "*", operator: "neq" }
                ]
            });
        });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiOrgs/List",
            fields: {
                keyfield: "ORG_CODE",
                descfield: "ORG_DESCF"
            },
            sort: [{ field: "ORG_CODE", dir: "asc" }],
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