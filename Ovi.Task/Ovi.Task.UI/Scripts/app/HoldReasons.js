(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#department").val(""),
        $("#active").prop("checked", true);
        $("#tms").prop("checked", false);
        $("#mobile").prop("checked", false);
        $("#class").val("");

        tooltip.hide("#class");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMHOLDREASONS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMHOLDREASONS", operator: "eq" },
                { field: "DES_PROPERTY", value: "HDR_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.HDR_CODE);
        $("#desc").val(selectedrecord.HDR_DESC);
        $("#department").val(selectedrecord.HDR_DEPARTMENT);
        $("#active").prop("checked", selectedrecord.HDR_ACTIVE === "+");
        $("#tms").prop("checked", selectedrecord.HDR_TMS === "+");
        $("#mobile").prop("checked", selectedrecord.HDR_MOBILE === "+");
        $("#class").val(selectedrecord.HDR_CLASS);
        tooltip.show("#class", selectedrecord.HDR_CLASSDESC);
        $(".page-header>h6").html(selectedrecord.HDR_CODE + " - " + selectedrecord.HDR_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiHoldReasons/Get",
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
                        url: "/Api/ApiHoldReasons/DelRec",
                        data: JSON.stringify(selectedrecord.HDR_CODE),
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
            return;

        var o = JSON.stringify({
            HDR_CODE: $("#code").val().toUpper(),
            HDR_DESC: $("#desc").val(),
            HDR_CLASS: $("#class").val(),
            HDR_DEPARTMENT: $("#department").val(),
            HDR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            HDR_TMS: $("#tms").prop("checked") ? "+" : "-",
            HDR_MOBILE: $("#mobile").prop("checked") ? "+" : "-",
            HDR_CREATED: selectedrecord != null ? selectedrecord.HDR_CREATED : tms.Now(),
            HDR_CREATEDBY: selectedrecord != null ? selectedrecord.HDR_CREATEDBY : user,
            HDR_UPDATED: selectedrecord != null ? tms.Now() : null,
            HDR_UPDATEDBY: selectedrecord != null ? user : null,
            HDR_RECORDVERSION: selectedrecord != null ? selectedrecord.HDR_RECORDVERSION : 0,
            HDR_SQLIDENTITY: selectedrecord != null ? selectedrecord.HDR_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiHoldReasons/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.HDR_CODE).list("refresh");
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
        $("#btnclass").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#class",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "HOLDREASONCLASS", operator: "eq" }
                ]
            });
        });
        $("#class").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [{ field: "SYC_GROUP", value: "HOLDREASONCLASS", operator: "eq" }]
        });
       // $("#department").autocomp({
       //     listurl: "/Api/ApiDepartments/List",
       //     geturl: "/Api/ApiDepartments/Get",
       //     field: "DEP_CODE",
       //     textfield: "DEP_DESC",
       //     active: "DEP_ACTIVE",
       //     filter: [{ field: "DEP_ORG", relfield: "#org", includealls: true }]
       // });
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
                    { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                    { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                ],
                filter: [
                    { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                    { field: "DEP_ORG", value: ["*"], operator: "in" }
                ]
            });
        });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiHoldReasons/List",
            fields: {
                keyfield: "HDR_CODE",
                descfield: "HDR_DESCF"
            },
            sort: [{ field: "HDR_CODE", dir: "asc" }],
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