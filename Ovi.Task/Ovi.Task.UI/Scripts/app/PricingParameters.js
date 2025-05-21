(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#org").val("");
        $("#labortype").val("");
        $("#servicefee").val("");
        $("#hourlyfee").val("");
        $("#criticaltimevalue").val("");
        $("#currency").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#org");
        tooltip.hide("#currency");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMPRICINGPARAMETERS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.PRP_CODE);
        $("#desc").val(selectedrecord.PRP_DESC);
        $("#org").val(selectedrecord.PRP_ORG);
        $("#labortype").val(selectedrecord.PRP_LABORTYPE);
        $("#servicefee").val(parseFloat(selectedrecord.PRP_SERVICEFEE).fixed(constants.pricedecimals));
        $("#hourlyfee").val(parseFloat(selectedrecord.PRP_HOURLYFEE).fixed(constants.pricedecimals));
        $("#criticaltimevalue").val(parseFloat(selectedrecord.PRP_CRITICALTIMEVALUE).fixed(constants.pricedecimals));
        $("#currency").val(selectedrecord.PRP_CURRENCY);
        $("#active").prop("checked", selectedrecord.PRP_ACTIVE === "+");

        tooltip.show("#org", selectedrecord.PRP_ORGDESC);
        tooltip.show("#currency", selectedrecord.PRP_CURRENCYDESC);

        $(".page-header>h6").html(selectedrecord.PRP_CODE + " - " + selectedrecord.PRP_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiPricingParameters/Get",
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
                        url: "/Api/ApiPricingParameters/DelRec",
                        data: JSON.stringify(selectedrecord.PRP_CODE),
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
        if (!tms.Check("#record"))
            return;

        var o = JSON.stringify({
            PRP_CODE: $("#code").val().toUpper(),
            PRP_DESC: $("#desc").val(),
            PRP_ORG: $("#org").val(),
            PRP_LABORTYPE: $("#labortype").val(),
            PRP_SERVICEFEE: $("#servicefee").val(),
            PRP_HOURLYFEE: $("#hourlyfee").val(),
            PRP_CRITICALTIMEVALUE: $("#criticaltimevalue").val(),
            PRP_CURRENCY: $("#currency").val(),
            PRP_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            PRP_CREATED: selectedrecord != null ? selectedrecord.PRP_CREATED : tms.Now(),
            PRP_CREATEDBY: selectedrecord != null ? selectedrecord.PRP_CREATEDBY : user,
            PRP_UPDATED: selectedrecord != null ? tms.Now() : null,
            PRP_UPDATEDBY: selectedrecord != null ? user : null,
            PRP_RECORDVERSION: selectedrecord != null ? selectedrecord.PRP_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiPricingParameters/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.PRP_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

        AutoComplete();
        LookupButtons();
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

    function AutoComplete() {
        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE"
        });
        $("#currency").autocomp({
            listurl: "/Api/ApiCurrencies/List",
            geturl: "/Api/ApiCurrencies/Get",
            field: "CUR_CODE",
            textfield: "CUR_DESC",
            active: "CUR_ACTIVE"
        });
    }

    function LookupButtons() {
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
                filter: {
                    filter: {
                        filters: [
                            { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                        ]
                    }
                }
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
                    { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 300 }
                ],
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiPricingParameters/List",
            fields: {
                keyfield: "PRP_CODE",
                descfield: "PRP_DESC"
            },
            sort: [{ field: "PRP_CODE", dir: "asc" }],
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

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());