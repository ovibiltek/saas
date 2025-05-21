(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#org").val("");
        $("#type").val("");
        $("#chargingperiod").val("");
        $("#unitprice").val("");
        $("#currency").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#org");
        tooltip.hide("#type");
        tooltip.hide("#currency");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMTOOLS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.TOO_CODE);
        $("#desc").val(selectedrecord.TOO_DESCRIPTION);
        $("#org").val(selectedrecord.TOO_ORGANIZATION);
        $("#type").val(selectedrecord.TOO_TYPE);
        $("#chargingperiod").val(selectedrecord.TOO_CHARGINGPERIOD);
        $("#unitprice").val(parseFloat(selectedrecord.TOO_UNITPRICE).fixed(constants.pricedecimals));
        $("#currency").val(selectedrecord.TOO_CURRENCY);

        $("#active").prop("checked", selectedrecord.TOO_ACTIVE === "+");

        tooltip.show("#org", selectedrecord.TOO_ORGANIZATIONDESC);
        tooltip.show("#type", selectedrecord.TOO_TYPEDESC);
        tooltip.show("#currency", selectedrecord.TOO_CURRENCYDESC);

        $(".page-header>h6").html(selectedrecord.TOO_CODE + " - " + selectedrecord.TOO_DESCRIPTION);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiTools/Get",
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
                        url: "/Api/ApiTools/DelRec",
                        data: JSON.stringify(selectedrecord.TOO_CODE),
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
            TOO_CODE: $("#code").val().toUpper(),
            TOO_DESCRIPTION: $("#desc").val(),
            TOO_ORGANIZATION: $("#org").val(),
            TOO_TYPE: $("#type").val(),
            TOO_CHARGINGPERIOD: $("#chargingperiod").val(),
            TOO_UNITPRICE: $("#unitprice").val() ? parseFloat($("#unitprice").val()) : null,
            TOO_CURRENCY: ($("#currency").val() || null),
            TOO_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            TOO_CREATED: selectedrecord != null ? selectedrecord.TOO_CREATED : tms.Now(),
            TOO_CREATEDBY: selectedrecord != null ? selectedrecord.TOO_CREATEDBY : user,
            TOO_UPDATED: selectedrecord != null ? tms.Now() : null,
            TOO_UPDATEDBY: selectedrecord != null ? user : null,
            TOO_RECORDVERSION: selectedrecord != null ? selectedrecord.TOO_RECORDVERSION : 0,
            TOO_SQLIDENTITY: selectedrecord != null ? selectedrecord.TOO_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiTools/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.TOO_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

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
        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE"
        });
        $("#btntype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#type",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "TOOLTYPE", operator: "eq" }
                ]
            });
        });
        $("#type").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [{ field: "SYC_GROUP", value: "TOOLTYPE", operator: "eq" }]
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
                    { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 300 }
                ],
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
        $("#currency").autocomp({
            listurl: "/Api/ApiCurrencies/List",
            geturl: "/Api/ApiCurrencies/Get",
            field: "CUR_CODE",
            textfield: "CUR_DESC",
            active: "CUR_ACTIVE"
        });
        $("#unitprice").on("change",
            function () {
                var v = $(this).val();
                if (v)
                    $("#currency").addClass("required").attr("required");
                else
                    $("#currency").removeClass("required").removeAttr("required");
            });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiTools/List",
            fields: {
                keyfield: "TOO_CODE",
                descfield: "TOO_DESCRIPTION",
                otherfields: [{ field: "TOO_TYPE", label: gridstrings.tools[lang].type }]
            },
            sort: [{ field: "TOO_CODE", dir: "asc" }],
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