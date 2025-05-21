(function () {
    var selectedrecord = null;
    var grdLocalization = null;
    var grdelm = $("#grdLocalizations");

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#language").val("");
        $("#text").val("");

        tooltip.hide("#language");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMMSGS", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.MSG_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.MSG_CODE);
        $("#language").val(selectedrecord.MSG_LANG);
        $("#text").val(selectedrecord.MSG_TEXT);

        $(".page-header>h6").html(selectedrecord.MSG_CODE + " - " + selectedrecord.MSG_TEXT);
        tooltip.show("#language", selectedrecord.MSG_LANGDESC);
    }

    function loadSelected() {
        return tms.Ajax({
            url: "/Api/ApiMessages/Get",
            data: JSON.stringify(selectedrecord.MSG_ID),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);
    }

    function buildUI() {
        resetUI();

        $("#language").autocomp({
            listurl: "/Api/ApiLanguage/List",
            geturl: "/Api/ApiLanguage/Get",
            field: "LNG_CODE",
            textfield: "LNG_DESCRIPTION"
        });
        $("#btnlanguage").click(function () {
            gridModal.show({
                modaltitle: gridstrings.language[lang].title,
                listurl: "/Api/ApiLanguage/List",
                keyfield: "LNG_CODE",
                codefield: "LNG_CODE",
                textfield: "LNG_DESCRIPTION",
                returninput: "#language",
                columns: [
                    { type: "string", field: "LNG_CODE", title: gridstrings.language[lang].language, width: 100 },
                    {
                        type: "string",
                        field: "LNG_DESCRIPTION",
                        title: gridstrings.language[lang].description,
                        width: 300
                    }
                ]
            });
        });

        registerUiEvents();
    }

    function itemSelect(row) {
        selectedrecord = grdLocalization.GetRowDataItem(row);
        loadSelected();
    }

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        if (grdLocalization) {
            grdLocalization.RunFilter([]);
        } else {
            grdLocalization = new Grid({
                keyfield: "MSG_ID",
                columns: [
                    { type: "string", field: "MSG_CODE", title: gridstrings.messages[lang].code, width: 50 },
                    { type: "string", field: "MSG_LANG", title: gridstrings.messages[lang].language, width: 50 },
                    { type: "string", field: "MSG_TEXT", title: gridstrings.messages[lang].text, width: 200 }
                ],
                datasource: "/Api/ApiMessages/List",
                selector: "#grdLocalizations",
                name: "grdLocalizations",
                height: 370,
                primarycodefield: "MSG_ID",
                primarytextfield: "MSG_CODE",
                filter: null,
                sort: [{ field: "MSG_CODE", dir: "desc" }],
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"Localizations.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                    ]
                },
                databound: gridDataBound,
                change: gridChange
            });
        }
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.MSG_ID;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiMessages/DelRec",
                                data: JSON.stringify(code),
                                fn: function (d) {
                                    msgs.success(d.data);
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
            MSG_ID: (selectedrecord) ? selectedrecord.MSG_ID : 0,
            MSG_CODE: $("#code").val().toUpper(),
            MSG_LANG: $("#language").val(),
            MSG_TEXT: $("#text").val(),
            MSG_RECORDVERSION: selectedrecord != null ? selectedrecord.MSG_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiMessages/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                resetUI();
                list();
            }
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

    function ready() {
        buildUI();
        list();
        bindHotKeys();
    }

    $(document).ready(ready);
}());