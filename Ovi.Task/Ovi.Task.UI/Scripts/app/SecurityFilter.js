(function () {
    var selectedrecord = null;
    var infobox = null;

    function testSql() {
        if (selectedrecord) {
            var code = selectedrecord.SCF_CODE;
            return tms.Ajax({
                url: "/Api/ApiSecurityFilter/ValidateSecurityFilter",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.r;
                    msgs.success(d.data);
                    $("#isvalidated").prop("checked", true);
                }
            });
        }
    }

    function resetUI() {
        selectedrecord = null;

        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#condition").val("");
        $("#screen").val("");
        $("#columnfilter").val("");
        $("#active").prop("checked", true);
        $("#isvalidated").prop("checked", false);

        tooltip.hide("#screen");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMSECURITYFILTERS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.SCF_CODE);
        $("#desc").val(selectedrecord.SCF_DESC);
        $("#condition").val(selectedrecord.SCF_CONDITION);
        $("#screen").val(selectedrecord.SCF_SCREEN);
        $("#columnfilter").val(selectedrecord.SCF_COLUMNFILTER);
        $("#active").prop("checked", selectedrecord.SCF_ACTIVE === "+");
        $("#isvalidated").prop("checked", selectedrecord.SCF_ISVALIDATED === "+");

        tooltip.show("#screen", selectedrecord.SCF_SCREENDESCF);
        $(".page-header>h6").html(selectedrecord.SCF_CODE + " - " + selectedrecord.SCF_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiSecurityFilter/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.SCF_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiSecurityFilter/DelRec",
                            data: JSON.stringify(code),
                            fn: function (d) {
                                $(".list-group").list("refresh");
                                resetUI();
                            }
                        });
                    });
            }
        }
    }

    function save() {
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = JSON.stringify({
            SCF_CODE: $("#code").val().toUpper(),
            SCF_DESC: $("#desc").val(),
            SCF_CONDITION: $("#condition").val(),
            SCF_SCREEN: $("#screen").val(),
            SCF_COLUMNFILTER: ($("#columnfilter").val() || null),
            SCF_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            SCF_ISVALIDATED: "-",
            SCF_CREATED: selectedrecord != null ? selectedrecord.SCF_CREATED : tms.Now(),
            SCF_CREATEDBY: selectedrecord != null ? selectedrecord.SCF_CREATEDBY : user,
            SCF_UPDATED: selectedrecord != null ? tms.Now() : null,
            SCF_UPDATEDBY: selectedrecord != null ? user : null,
            SCF_RECORDVERSION: selectedrecord != null ? selectedrecord.SCF_RECORDVERSION : 0,
            SCF_SQLIDENTITY: selectedrecord != null ? selectedrecord.SCF_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiSecurityFilter/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $("#isvalidated").prop("checked", false);
                $(".list-group").data("id", selectedrecord.SCF_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(fillUserInterface);
        $("#btnHistory").click(historyModal);
        $("#btnTestSql").click(testSql);
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

    function buildUI() {
        $("#screen").autocomp({
            listurl: "/Api/ApiScreens/List",
            geturl: "/Api/ApiScreens/Get",
            field: "SCR_CODE",
            textfield: "SCR_DESCF",
            active: "SCR_ACTIVE"
        });
        $("#btnScreen").click(function () {
            gridModal.show({
                modaltitle: gridstrings.screen[lang].title,
                listurl: "/Api/ApiScreens/List",
                keyfield: "SCR_CODE",
                codefield: "SCR_CODE",
                textfield: "SCR_DESCF",
                returninput: "#screen",
                columns: [
                    { type: "string", field: "SCR_CODE", title: gridstrings.screen[lang].screen, width: 100 },
                    { type: "string", field: "SCR_DESCF", title: gridstrings.screen[lang].description, width: 400 }
                ],
                filter: [
                    { field: "SCR_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
        $(".list-group").list({
            listurl: "/Api/ApiSecurityFilter/List",
            fields: {
                keyfield: "SCF_CODE",
                descfield: "SCF_DESC"
            },
            sort: [{ field: "SCF_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected(item);
            }
        });

        resetUI();
    }

    function ready() {
        buildUI();
        registerUiEvents();
    }

    $(document).ready(ready);
}());