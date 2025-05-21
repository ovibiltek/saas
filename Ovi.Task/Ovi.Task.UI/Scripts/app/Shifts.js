(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#description").val("");
        $("#org").val("");
        $("#starttime1").val("");
        $("#duration1").val("");
        $("#starttime2").val("");
        $("#duration2").val("");
        $("#active").prop("checked", true);

        tooltip.hide("#org");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMSHIFTS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.SHF_CODE);
        $("#description").val(selectedrecord.SHF_DESCRIPTION);
        $("#org").val(selectedrecord.SHF_ORGANIZATION);
        $("#starttime1").val(selectedrecord.SHF_STARTTIME1 !== null
            ? moment().startOf("day").seconds(selectedrecord.SHF_STARTTIME1).format(constants.timeformat)
            : "");
        $("#starttime2").val(selectedrecord.SHF_STARTTIME2 !== null
            ? moment().startOf("day").seconds(selectedrecord.SHF_STARTTIME2).format(constants.timeformat)
            : "");
        $("#duration1").val(selectedrecord.SHF_DURATION1);
        $("#duration2").val(selectedrecord.SHF_DURATION2);
        $("#active").prop("checked", selectedrecord.SHF_ACTIVE === "+");

        tooltip.show("#org", selectedrecord.SHF_ORGANIZATIONDESC);
        $(".page-header>h6").html(selectedrecord.SHF_CODE + " - " + selectedrecord.SHF_DESCRIPTION);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var id = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiShifts/Get",
            data: JSON.stringify(id),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var id = selectedrecord.SHF_CODE;
            if (id != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiShifts/DelRec",
                            data: JSON.stringify(id),
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

        var starttime1 = $("#starttime1").val()
            ? moment.duration($("#starttime1").val(), constants.timeformat).asSeconds()
            : null;
        var starttime2 = $("#starttime2").val()
            ? moment.duration($("#starttime2").val(), constants.timeformat).asSeconds()
            : null;

        var o = JSON.stringify({
            SHF_CODE: $("#code").val().toUpper(),
            SHF_DESCRIPTION: $("#description").val(),
            SHF_ORGANIZATION: $("#org").val(),
            SHF_STARTTIME1: starttime1,
            SHF_STARTTIME2: starttime2,
            SHF_DURATION1: $("#duration1").val() ? parseFloat($("#duration1").val()) : null,
            SHF_DURATION2: $("#duration2").val() ? parseFloat($("#duration2").val()) : null,
            SHF_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            SHF_CREATED: selectedrecord != null ? selectedrecord.SHF_CREATED : tms.Now(),
            SHF_CREATEDBY: selectedrecord != null ? selectedrecord.SHF_CREATEDBY : user,
            SHF_UPDATED: selectedrecord != null ? tms.Now() : null,
            SHF_UPDATEDBY: selectedrecord != null ? user : null,
            SHF_RECORDVERSION: selectedrecord != null ? selectedrecord.SHF_RECORDVERSION : 0,
            SHF_SQLIDENTITY: selectedrecord != null ? selectedrecord.SHF_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiShifts/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.SHF_CODE).list("refresh");
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
                    { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ]
            });
        });
        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE",
            filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }]
        });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiShifts/List",
            fields: {
                keyfield: "SHF_CODE",
                descfield: "SHF_DESCRIPTION"
            },
            sort: [{ field: "SHF_DESCRIPTION", dir: "asc" }],
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