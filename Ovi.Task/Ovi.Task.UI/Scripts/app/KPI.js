(function () {
    var selectedrecord = null;
    var infobox = null;

    function autoComplete() {
        $("#group").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [{ field: "SYC_GROUP", value: ["KPIGROUP", "SCRKPITAB"], operator: "in" }]
        });
    }

    function buildModals() {
        $("#btngroup").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#group",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: ["KPIGROUP", "SCRKPITAB"], operator: "in" }
                ]
            });
        });
    }

    function testSql() {
        if (selectedrecord) {
            var code = selectedrecord.KPI_CODE;
            return tms.Ajax({
                url: "/Api/ApiKPI/ValidateKPI",
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
        $("#order").val("");
        $("#sql").val("");
        $("#minvalue").val("");
        $("#maxvalue").val("");
        $("#threshold").val("");
        $("#inboxgroup").val("PIECHART");
        $("#active").prop("checked", true);
        $("#isvalidated").prop("checked", false);
        $("#gaugeoptions").addClass("hidden");
        $("#group").val("");
        $("#size").val("");
        $("#userinfo").val();
        tooltip.hide("#group");
        infobox.resetUI();
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMKPI", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMKPI", operator: "eq" },
                { field: "DES_PROPERTY", value: "KPI_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.KPI_CODE);
        $("#desc").val(selectedrecord.KPI_DESC);
        $("#sql").val(selectedrecord.KPI_SQL);
        $("#kpitype").val(selectedrecord.KPI_TYPE);
        $("#order").val(selectedrecord.KPI_ORDER);
        $("#minvalue").val(selectedrecord.KPI_MINVALUE);
        $("#maxvalue").val(selectedrecord.KPI_MAXVALUE);
        $("#threshold").val(selectedrecord.KPI_THRESHOLD);
        $("#group").val(selectedrecord.KPI_GROUP);
        $("#size").val(selectedrecord.KPI_SIZE);
        $("#active").prop("checked", selectedrecord.KPI_ACTIVE === "+");
        $("#isvalidated").prop("checked", selectedrecord.KPI_ISVALIDATED === "+");
        $("#userinfo").val(selectedrecord.KPI_USERINFO);
        tooltip.show("#group", selectedrecord.KPI_GROUPDESC);

        if (selectedrecord.KPI_TYPE === "GAUGE")
            $("#gaugeoptions").removeClass("hidden");
        else
            $("#gaugeoptions").addClass("hidden");
        infobox.setParam({
            filter: [
                { field: "DES_CLASS", value: "TMKPI", operator: "eq" },
                { field: "DES_PROPERTY", value: "KPI_INFO", operator: "eq" },
                { field: "DES_CODE", value: selectedrecord.KPI_CODE, operator: "eq" }
            ],
            containerid: "#infobox",
            textarea: true
        });
        infobox.loadTranslationData();

        $(".page-header>h6").html(selectedrecord.KPI_CODE + " - " + selectedrecord.KPI_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiKPI/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.KPI_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiKPI/DelRec",
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

        var textctrls = $("#infobox [data-lang]");
        var vals = [];

        for (var i = 0; i < textctrls.length; i++) {
            vals.push({
                DES_LANG: $(textctrls[i]).data("lang"),
                DES_TEXT: $(textctrls[i]).val(),
                DES_CLASS: "TMKPI",
                DES_PROPERTY: "KPI_INFO",
                DES_CODE: $("#code").val().toUpper()
            });
        }

        var o = JSON.stringify({
            kpi: {
                KPI_CODE: $("#code").val().toUpper(),
                KPI_DESC: $("#desc").val(),
                KPI_SQL: $("#sql").val(),
                KPI_ORDER: ($("#order").val() ? parseInt($("#order").val()) : null),
                KPI_TYPE: $("#kpitype").val(),
                KPI_MINVALUE: $("#minvalue").val(),
                KPI_MAXVALUE: $("#maxvalue").val(),
                KPI_THRESHOLD: $("#threshold").val(),
                KPI_GROUP: $("#group").val(),
                KPI_SIZE: $("#size").val(),
                KPI_USERINFO:$("#userinfo").val(),
                KPI_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                KPI_ISVALIDATED: "-",
                KPI_RECORDVERSION: selectedrecord != null ? selectedrecord.KPI_RECORDVERSION : 0,
                KPI_SQLIDENTITY: selectedrecord != null ? selectedrecord.KPI_SQLIDENTITY : 0
            },
            descriptions: vals
        });

        return tms.Ajax({
            url: "/Api/ApiKPI/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $("#isvalidated").prop("checked", false);
                $(".list-group").data("id", selectedrecord.KPI_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(fillUserInterface);
        $("#kpitype").on("change", function () {
            var v = $(this).val();
            if (v === "GAUGE")
                $("#gaugeoptions").removeClass("hidden");
            else
                $("#gaugeoptions").addClass("hidden");
        });
        autoComplete();
        buildModals();
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
        $("#btnHistory").click(historyModal);
        $("#btnTranslations").click(translationModal);
        $("#btnTestSql").click(testSql);

        $(".list-group").list({
            listurl: "/Api/ApiKPI/List",
            fields: {
                keyfield: "KPI_CODE",
                descfield: "KPI_DESCF"
            },
            sort: [{ field: "KPI_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected(item);
            }
        });

        infobox = new translation.box();
        infobox.setParam({
            containerid: "#infobox",
            textarea: true
        });
        infobox.loadUI(bindHotKeys);

        resetUI();
    }

    function ready() {
        buildUI();
        registerUiEvents();
    }

    $(document).ready(ready);
}());