(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#color").val("");
        $("#org").val("");
        $("#css").val("");
        $("#cssi").removeClass();
        $("#active").prop("checked", true);
        $(".colpicker i").removeAttr("style");

        tooltip.hide("#org");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMPRIORITIES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMPRIORITIES", operator: "eq" },
                { field: "DES_PROPERTY", value: "PRI_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.PRI_CODE);
        $("#desc").val(selectedrecord.PRI_DESCF);
        $("#org").val(selectedrecord.PRI_ORGANIZATION);
        $(".colpicker").colorpicker("setValue", selectedrecord.PRI_COLOR);
        $("#css").val(selectedrecord.PRI_CSS);
        $("#active").prop("checked", selectedrecord.PRI_ACTIVE === "+");
        $("#cssi").removeClass().addClass(selectedrecord.PRI_CSS);

        tooltip.show("#org", selectedrecord.PRI_ORGANIZATIONDESC);
        $(".page-header>h6").html(selectedrecord.PRI_CODE + " - " + selectedrecord.PRI_DESCF);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiPriorities/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.PRI_CODE;
            $("#confirm").modal().off("click", "#delete")
                .one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPriorities/DelRec",
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
            return;

        var o = JSON.stringify({
            PRI_CODE: $("#code").val().toUpper(),
            PRI_DESC: $("#desc").val(),
            PRI_ORGANIZATION: $("#org").val(),
            PRI_COLOR: $("#color").val(),
            PRI_CSS: $("#css").val(),
            PRI_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            PRI_CREATED: selectedrecord != null ? selectedrecord.PRI_CREATED : tms.Now(),
            PRI_CREATEDBY: selectedrecord != null ? selectedrecord.PRI_CREATEDBY : user,
            PRI_UPDATED: selectedrecord != null ? tms.Now() : null,
            PRI_UPDATEDBY: selectedrecord != null ? user : null,
            PRI_SQLIDENTITY: selectedrecord != null ? selectedrecord.PRI_SQLIDENTITY : 0,
            PRI_RECORDVERSION: selectedrecord != null ? selectedrecord.PRI_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiPriorities/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.PRI_CODE).list("refresh");
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

    function buildUI() {
        $(".colpicker").colorpicker({ format: "hex" });
        $("#btnDelete,#btnUndo,#btnHistory,#btnTranslations").prop("disabled", true);

        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE"
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
                filter: [{ field: "ORG_ACTIVE", value: "+", operator: "eq" }]
            });
        });

        $("#css").change(function () {
            $("#cssi").removeClass().addClass($(this).val());
        });

        $("#css").iconpicker({
            hideOnSelect: true
        }).on("iconpickerSelected",
            function (e) {
                $(this).val(e.iconpickerInstance.options.iconBaseClass +
                    " " +
                    e.iconpickerInstance.getValue(e.iconpickerValue)).trigger("change");
            });

        $(".list-group").list({
            listurl: "/Api/ApiPriorities/List",
            fields: {
                keyfield: "PRI_CODE",
                descfield: "PRI_DESCF"
            },
            sort: [{ field: "PRI_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected(item);
            }
        });

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