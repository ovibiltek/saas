(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#type").val("");
        $("#parent").val("");
        $("#region").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#region");
        tooltip.hide("#parent");

        $("#parent,#btnparent").prop("disabled", true);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMADDRESSSECTIONS", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.ADS_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.ADS_CODE);
        $("#desc").val(selectedrecord.ADS_DESC);
        $("#type").val(selectedrecord.ADS_TYPE);
        $("#parent").val(selectedrecord.ADS_PARENT);
        $("#region").val(selectedrecord.ADS_REGION);
        $("#active").prop("checked", selectedrecord.ADS_ACTIVE === "+");
        $("#parent,#btnparent").prop("disabled", selectedrecord.ADS_TYPE === "IL");

        tooltip.show("#parent", selectedrecord.ADS_PARENTDESC);
        tooltip.show("#parent", selectedrecord.ADS_REGIONDESC);

        $(".page-header>h6").html(selectedrecord.ADS_CODE + " - " + selectedrecord.ADS_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiAddressSections/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.ADS_ID;
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiAddressSections/DelRec",
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
            ADS_ID: (selectedrecord) ? selectedrecord.ADS_ID : 0,
            ADS_CODE: ($("#code").val() || null),
            ADS_DESC: ($("#desc").val() || null),
            ADS_TYPE: $("#type").val(),
            ADS_PARENT: ($("#parent").val() || null),
            ADS_REGION: ($("#region").val() || null),
            ADS_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            ADS_CREATED: selectedrecord != null ? selectedrecord.ADS_CREATED : tms.Now(),
            ADS_CREATEDBY: selectedrecord != null ? selectedrecord.ADS_CREATEDBY : user,
            ADS_UPDATED: selectedrecord != null ? tms.Now() : null,
            ADS_UPDATEDBY: selectedrecord != null ? user : null,
            ADS_RECORDVERSION: selectedrecord != null ? selectedrecord.ADS_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiAddressSections/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.ADS_ID).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

        $("#type").on("change",
            function () {
                switch ($(this).val()) {
                    case "IL":
                        $("#parent,#btnparent").prop("disabled", true);
                        break;
                    default:
                        $("#parent,#btnparent").prop("disabled", false);
                        break;
                }
            });
        $("#parent").autocomp({
            listurl: "/Api/ApiAddressSections/List",
            geturl: "/Api/ApiAddressSections/Get",
            field: "ADS_CODE",
            textfield: "ADS_DESC",
            active: "ADS_ACTIVE",
            filter: [
                {
                    field: "ADS_TYPE",
                    func: function () { return $("#type option:selected").data("parent"); },
                    operator: "eq"
                }
            ]
        });
        $("#btnparent").click(function () {
            gridModal.show({
                modaltitle: gridstrings.addresssection[lang].title,
                listurl: "/Api/ApiAddressSections/List",
                keyfield: "ADS_CODE",
                codefield: "ADS_CODE",
                textfield: "ADS_DESC",
                returninput: "#parent",
                columns: [
                    { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                    { type: "string", field: "ADS_DESC", title: gridstrings.addresssection[lang].description, width: 400 }
                ],
                filter: [
                    { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                    { field: "ADS_TYPE", value: $("#type option:selected").data("parent"), operator: "eq" }
                ]
            });
        });
        $("#region").autocomp({
            listurl: "/Api/ApiRegions/List",
            geturl: "/Api/ApiRegions/Get",
            field: "REG_CODE",
            textfield: "REG_DESCF",
            active: "REG_ACTIVE",
            callback: function (data) {
                if (data) {
                    $("#region").val(data.REG_CODE);
                    tooltip.show("#region", data.REG_DESCF);
                }
            }
        });
        $("#btnregion").click(function () {
            gridModal.show({
                modaltitle: gridstrings.regions[lang].title,
                listurl: "/Api/ApiRegions/List",
                keyfield: "REG_CODE",
                codefield: "REG_CODE",
                textfield: "REG_DESCF",
                returninput: "#region",
                columns: [
                    { type: "string", field: "REG_CODE", title: gridstrings.regions[lang].code, width: 100 },
                    { type: "string", field: "REG_DESCF", title: gridstrings.regions[lang].description, width: 400 }
                ],
                filter: [
                    { field: "REG_ACTIVE", value: "+", operator: "eq" }
                ]
            });
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
            listurl: "/Api/ApiAddressSections/List",
            fields: {
                keyfield: "ADS_ID",
                descfield: "ADS_DESC",
                otherfields: [
                    { field: "ADS_TYPE", label: gridstrings.addresssection[lang].type },
                    { field: "ADS_PARENTDESC", label: gridstrings.addresssection[lang].parentdesc }
                ]
            },
            keyfieldisvisible: false,
            sort: [{ field: "ADS_CODE", dir: "asc" }],
            filterarr: ["ADS_CODE", "ADS_DESC", "ADS_TYPE", "ADS_PARENTDESC"],
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