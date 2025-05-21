(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#entity").val("");
        $("#parentcode").val("");
        $("#css").val("");
        $("#order").val("");
        $("#showonsearch").prop("checked", false);
        $("#approvalstep").prop("checked", false);
        $("#newappointment").prop("checked", false);
        $("#progresspayment").prop("checked", false);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMSTATUSES", operator: "eq" },
                { field: "AUD_REFID", value: $("#entity").val() + "#" + $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMSTATUSES", operator: "eq" },
                { field: "DES_PROPERTY", value: "STA_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#entity").val() + "#" + $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#entity").val(selectedrecord.STA_ENTITY);
        $("#code").val(selectedrecord.STA_CODE);
        $("#desc").val(selectedrecord.STA_DESCF);
        $("#css").val(selectedrecord.STA_CSS);
        $("#order").val(selectedrecord.STA_ORDER);
        $("#parentcode").val(selectedrecord.STA_PCODE);
        $("#showonsearch").prop("checked", selectedrecord.STA_SHOWONSEARCH === "+");
        $("#approvalstep").prop("checked", selectedrecord.STA_APPROVALSTEP === "+");
        $("#newappointment").prop("checked", selectedrecord.STA_NEWAPPOINTMENT === "+");
        $("#progresspayment").prop("checked", selectedrecord.STA_PROGRESSPAYMENT === "+");

        $(".page-header>h6").html(selectedrecord.STA_CODE + " - " + selectedrecord.STA_DESCF);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        var entity = selecteditem.data("entity");
        var o = {
            STA_CODE: code,
            STA_ENTITY: entity
        };
        return tms.Ajax({
            url: "/Api/ApiStatuses/Get",
            data: JSON.stringify(o),
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
                        url: "/Api/ApiStatuses/DelRec",
                        data: JSON.stringify(selectedrecord),
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
            STA_CODE: $("#code").val().toUpper(),
            STA_PCODE: $("#parentcode").val(),
            STA_DESC: $("#desc").val(),
            STA_ENTITY: $("#entity").val(),
            STA_CSS: $("#css").val(),
            STA_ORDER: ($("#order").val() || null),
            STA_SHOWONSEARCH: $("#showonsearch").prop("checked") ? "+" : "-",
            STA_APPROVALSTEP: $("#approvalstep").prop("checked") ? "+" : "-",
            STA_NEWAPPOINTMENT: $("#newappointment").prop("checked") ? "+" : "-",
            STA_PROGRESSPAYMENT: $("#progresspayment").prop("checked") ? "+" : "-",
            STA_CREATED: selectedrecord != null ? selectedrecord.STA_CREATED : tms.Now(),
            STA_CREATEDBY: selectedrecord != null ? selectedrecord.STA_CREATEDBY : user,
            STA_UPDATED: selectedrecord != null ? tms.Now() : null,
            STA_UPDATEDBY: selectedrecord != null ? user : null,
            STA_RECORDVERSION: selectedrecord != null ? selectedrecord.STA_RECORDVERSION : 0,
            STA_SQLIDENTITY: selectedrecord != null ? selectedrecord.STA_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiStatuses/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group")
                    .data("id", selectedrecord.STA_CODE)
                    .data("entity", selectedrecord.STA_ENTITY)
                    .list("refresh");
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
                e: "#btnDelete",
                k: "ctrl+d",
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

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiStatuses/List",
            fields: {
                entityfield: "STA_ENTITY",
                keyfield: "STA_CODE",
                descfield: "STA_DESCF",
                otherfields: [{ field: "STA_ENTITY", label: gridstrings.statusauthorizations[lang].entity }]
            },
            sort: [{ field: "STA_CODE", dir: "asc" }],
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