(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#equipmenttype").val("");
        $("#periodictask").val("");
        $("#org").val("");
        $("#unitpurchaseprice").val("");
        $("#unitsalesprice").val("");
        $("#currency").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#equipmenttype");
        tooltip.hide("#periodictask");
        tooltip.hide("#org");
        tooltip.hide("#currency");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMEQUIPMENTMAINPRICES", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.EMP_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        if (tms.ActiveTab() === "record")
            tms.BeforeFill("#record");

        tms.Tab();

        $("#equipmenttype").val(selectedrecord.EMP_EQUIPMENTTYPE);
        $("#periodictask").val(selectedrecord.EMP_PERIODICTASK);
        $("#org").val(selectedrecord.EMP_ORG);
        $("#unitpurchaseprice").val(selectedrecord.EMP_UNITPURCHASEPRICE);
        $("#unitsalesprice").val(selectedrecord.EMP_UNITSALESPRICE);
        $("#currency").val(selectedrecord.EMP_CURR);
        $("#active").prop("checked", selectedrecord.EMP_ACTIVE === "+");


        tooltip.show("#equipmenttype", selectedrecord.EMP_TYPEDESC);
        tooltip.show("#periodictask", selectedrecord.EMP_PERIODICTASKDESC);
        tooltip.show("#org", selectedrecord.EMP_ORGDESC);
        tooltip.show("#currency", selectedrecord.EMP_CURRDESC);

        $(".page-header>h6").html(selectedrecord.EMP_EQUIPMENTTYPE);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiEquipmentMainPrices/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.EMP_ID;
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiEquipmentMainPrices/DelRec",
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

    function save() {
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = JSON.stringify({
            EMP_ID: selectedrecord ? selectedrecord.EMP_ID : 0,
            EMP_EQUIPMENTTYPEENTITY: "EQUIPMENT",
            EMP_EQUIPMENTTYPE: $("#equipmenttype").val(),
            EMP_PERIODICTASK: ($("#periodictask").val() || null),
            EMP_ORG: $("#org").val(),
            EMP_UNITPURCHASEPRICE: $("#unitpurchaseprice").val(),
            EMP_UNITSALESPRICE: $("#unitsalesprice").val(),
            EMP_CURR: $("#currency").val(),
            EMP_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            EMP_CREATED: selectedrecord != null ? selectedrecord.EMP_CREATED : tms.Now(),
            EMP_CREATEDBY: selectedrecord != null ? selectedrecord.EMP_CREATEDBY : user,
            EMP_UPDATED: selectedrecord != null ? tms.Now() : null,
            EMP_UPDATEDBY: selectedrecord != null ? user : null,
            EMP_RECORDVERSION: selectedrecord != null ? selectedrecord.EMP_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiEquipmentMainPrices/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.EMP_ID).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

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
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
        $("#btnequipmenttype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESC",
                returninput: "#equipmenttype",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                    { field: "TYP_ORGANIZATION", value: ["*"], operator: "in" }
                ]
            });
        });
        $("#btnperiodictask").click(function () {
            gridModal.show({
                modaltitle: gridstrings.periodictasks[lang].title,
                listurl: "/Api/ApiPeriodicTasks/List",
                keyfield: "PTK_CODE",
                codefield: "PTK_CODE",
                textfield: "PTK_DESC",
                returninput: "#periodictask",
                columns: [
                    {
                        type: "string",
                        field: "PTK_CODE",
                        title: gridstrings.periodictasks[lang].code,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "PTK_DESC",
                        title: gridstrings.periodictasks[lang].description,
                        width: 400
                    }
                ],
                filter: [
                    { field: "PTK_ACTIVE", value: "+", operator: "eq" }
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

        $("#periodictask").autocomp({
            listurl: "/Api/ApiPeriodicTasks/List",
            geturl: "/Api/ApiPeriodicTasks/Get",
            field: "PTK_CODE",
            textfield: "PTK_DESC",
            active: "PTK_ACTIVE",
            filter: [
                {
                    field: "PTK_ORGANIZATION",
                    func: function () { return ["*"] },
                    operator: "in"
                }
            ]
        });
        $("#currency").autocomp({
            listurl: "/Api/ApiCurrencies/List",
            geturl: "/Api/ApiCurrencies/Get",
            field: "CUR_CODE",
            textfield: "CUR_DESC",
            active: "CUR_ACTIVE"
        });
        $("#type").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            active: "TYP_ACTIVE",
            filter: [
                { field: "TYP_ORGANIZATION", value: ["*"], operator: "in" },
                { field: "TYP_CODE", value: "*", operator: "neq" },
                { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
            ]
        });
        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE",
        });
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

    function list() {
        $(".list-group").list({
            listurl: "/Api/ApiEquipmentMainPrices/List",
            fields: {
                keyfield: "EMP_ID",
                descfield: "EMP_EQUIPMENTTYPE",
                otherfields: [
                    { field: "EMP_PERIODICTASK", label: gridstrings.periodictasks[lang].periodictask }
                ]
            },
            keyfieldisvisible: false,
            sort: [{ field: "EMP_ID", dir: "asc" }],
            filterarr: ["EMP_TYPEDESC", "EMP_EQUIPMENTTYPE", "EMP_PERIODICTASK", "EMP_PERIODICTASKDESC"],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        registerUiEvents();
        list();
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());















