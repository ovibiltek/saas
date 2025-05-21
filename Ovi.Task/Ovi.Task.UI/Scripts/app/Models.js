(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#brand").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#brand");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMMODELS", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.MDL_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.MDL_CODE);
        $("#brand").val(selectedrecord.MDL_BRAND);
        $("#active").prop("checked", selectedrecord.MDL_ACTIVE === "+");
        tooltip.show("#brand", selectedrecord.MDL_BRANDDESC);
        $(".page-header>h6").html(selectedrecord.MDL_CODE + " - " + selectedrecord.MDL_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiModel/Get",
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
                        url: "/Api/ApiModel/DelRec",
                        data: JSON.stringify(selectedrecord.MDL_ID),
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
            MDL_ID: selectedrecord ? selectedrecord.MDL_ID : 0,
            MDL_CODE: $("#code").val().toUpper(),
            MDL_BRAND: $("#brand").val(),
            MDL_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            MDL_CREATED: selectedrecord != null ? selectedrecord.MDL_CREATED : tms.Now(),
            MDL_CREATEDBY: selectedrecord != null ? selectedrecord.MDL_CREATEDBY : user,
            MDL_UPDATED: selectedrecord != null ? tms.Now() : null,
            MDL_UPDATEDBY: selectedrecord != null ? user : null,
            MDL_RECORDVERSION: selectedrecord != null ? selectedrecord.MDL_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiModel/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.MDL_ID).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

        $("#btnbrand").click(function () {
            gridModal.show({
                modaltitle: gridstrings.brand[lang].title,
                listurl: "/Api/ApiBrands/List",
                keyfield: "BRA_CODE",
                codefield: "BRA_CODE",
                textfield: "BRA_DESCF",
                returninput: "#brand",
                columns: [
                    { type: "string", field: "BRA_CODE", title: gridstrings.brand[lang].code, width: 100 },
                    { type: "string", field: "BRA_DESCF", title: gridstrings.brand[lang].descriptionription, width: 400 }
                ],
                filter: [
                    { field: "BRA_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
        $("#brand").autocomp({
            listurl: "/Api/ApiBrands/List",
            geturl: "/Api/ApiBrands/Get",
            field: "BRA_CODE",
            textfield: "BRA_DESCF",
            active: "BRA_ACTIVE"
        });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiModel/List",
            fields: {
                keyfield: "MDL_ID",
                otherfields: [
                    { field: "MDL_CODE", label: gridstrings.brand[lang].code },
                    { field: "MDL_BRANDDESC", label: gridstrings.brand[lang].brand }
                ]
            },
            keyfieldisvisible: false,
            textfieldvisible: false,
            sort: [{ field: "MDL_CODE", dir: "asc" }],
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
            }
        ]);
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());