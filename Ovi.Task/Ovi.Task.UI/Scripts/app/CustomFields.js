(function () {
    var selectedrecord = null;
    var selectedluline = null;
    var descriptions = null;
    var grdCustomFields = null;
    var grdCustomFieldsElm = $("#grdCustomFields");

    var lookup = new function () {
        var grdLULines = null;
        var grdLULinesElm = $("#grdLULines");
        var deleteLULine;

        var gridDatabound = function () {
            $(".lu-remove").unbind("click").click(function () {
                deleteLULine($(this).closest("tr"));
            });
        };
        var itemSelect = function (row) {
            selectedluline = grdLULines.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var listLULines = function () {
            grdLULines = new Grid({
                keyfield: "TML_ID",
                columns: [
                    {
                        type: "other",
                        field: "other",
                        title: "#",
                        template:
                        "<button class=\"btn btn-xs btn-danger lu-remove\" type=\"button\" data-id=\"#=TML_ID#\"><i class=\"fa fa-trash fa-fw\"></i></button>",
                        filterable: false,
                        sortable: false,
                        width: 40
                    },
                    { type: "string", field: "TML_ITEMCODE", title: gridstrings.lookup[lang].code, width: 200 },
                    { type: "string", field: "TML_ITEMDESC", title: gridstrings.lookup[lang].desc, width: 200 }
                ],
                datasource: "/Api/ApiLookupLines/List",
                selector: "#grdLULines",
                name: "grdLULines",
                height: 370,
                primarycodefield: "TML_ITEMCODE",
                primarytextfield: "TML_ITEMDESC",
                filter: [
                    { field: "TML_CODE", value: selectedrecord.CFD_CODE, operator: "eq", logic: "and" },
                    { field: "TML_TYPE", value: "CUSTOMFIELD", operator: "eq", logic: "and" }
                ],
                sort: [{ field: "TML_ID", dir: "asc" }],
                databound: gridDatabound,
                change: gridChange
            });
        };
        deleteLULine = function (row) {
            selectedluline = grdLULines.GetRowDataItem(row);
            if (selectedluline) {
                $("#lookupvalues").modal("hide");
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                       return tms.Ajax({
                            url: "/Api/ApiLookupLines/DelRec",
                            data: JSON.stringify(selectedluline.TML_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                selectedluline = null;
                                listLULines();
                                $("#lookupvalues").modal("show");
                            }
                        });
                    }).one("click",
                    "#cancel",
                    function () {
                        $("#lookupvalues").modal("show");
                    });
            }
        };

        this.defineLULines = function () {
            listLULines();
            $("#lookupvalues").modal("show");
        };
        var addLULine = function () {
            if (!tms.Check("#lookupvalues"))
                return $.Deferred.resolve();

            var o = {
                TML_ID: (selectedluline != null ? selectedluline.TML_ID : 0),
                TML_TYPE: "CUSTOMFIELD",
                TML_CODE: $("#code").val(),
                TML_ITEMCODE: $("#txtCode").val(),
                TML_ITEMDESC: $("#txtDesc").val(),
                TML_CREATED: selectedluline != null ? selectedluline.TML_CREATED : tms.Now(),
                TML_CREATEDBY: selectedluline != null ? selectedluline.TML_CREATEDBY : user,
                TML_RECORDVERSION: selectedluline != null ? selectedluline.TML_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiLookupLines/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    selectedluline = null;
                    msgs.success(d.data);
                    $("#txtCode").val("");
                    $("#txtDesc").val("");
                    listLULines();
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnAddLULine").click(addLULine);
        };
        RegisterUIEvents();
    };

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#description").val("");
        $("#fieldtype").val("");
        $("#active").prop("checked", true);
        $("#allowfreetext").prop("checked", false);
        $("#customfieldclass").val("");

        tooltip.hide("#customfieldclass");
        $("div.entity").addClass("hidden");
        $(".cmd-define-lulines").addClass("hidden");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMCUSTOMFIELDS", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.CFD_CODE, operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMCUSTOMFIELDS", operator: "eq" },
                { field: "DES_PROPERTY", value: "CFD_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function ChangeUI(v) {
        switch (v) {
            case "LOOKUP":
                $("div.entity").addClass("hidden");
                $("#entity").removeClass("required");
                $("div.allowfreetext").removeClass("hidden");
                if (selectedrecord) {
                    $(".cmd-define-lulines").removeClass("hidden");
                }
                break;
            case "ENTITY":
                $("div.entity").removeClass("hidden");
                $(".cmd-define-lulines").addClass("hidden");
                $("div.allowfreetext").addClass("hidden");
                if (!selectedrecord) {
                    $("#entity").addClass("required");
                }
                break;
            default:
                $(".cmd-define-lulines").addClass("hidden");
                $("div.entity").addClass("hidden");
                $("div.allowfreetext").addClass("hidden");
                $("#entity").removeClass("required");
                break;
        }
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.CFD_CODE);
        $("#description").val(selectedrecord.CFD_DESC);
        $("#fieldtype").val(selectedrecord.CFD_FIELDTYPE);
        $("#active").prop("checked", selectedrecord.CFD_ACTIVE === "+");
        $("#allowfreetext").prop("checked",
            selectedrecord.CFD_FIELDTYPE === "LOOKUP" ? (selectedrecord.CFD_ALLOWFREETEXT === "+") : false);
        $("#entity").val(selectedrecord.CFD_FIELDTYPE === "ENTITY" ? selectedrecord.CFD_ENTITY : "");
        $("#customfieldclass").val(selectedrecord.CFD_CLASS);

        tooltip.show("#customfieldclass", selectedrecord.CFD_CLASSDESC);

        ChangeUI(selectedrecord.CFD_FIELDTYPE);
        $(".page-header>h6").html(selectedrecord.CFD_CODE + " - " + selectedrecord.CFD_DESCF);
    }

    function loadSelected() {
        return tms.Ajax({
            url: "/Api/ApiCustomFields/Get",
            data: JSON.stringify(selectedrecord.CFD_CODE),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
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

    function fillEntities() {
        var str = "";
        var eo = lu.list();
        for (var e in eo) {
            if (eo.hasOwnProperty(e)) {
                var modal = eo[e].modal;
                str += "<option value=\"" + modal.entity + "\">" + modal.modaltitle + "</option>";
            }
        }
        $("#entity").append(str);
    }

    function buildUI() {
        resetUI();
        fillEntities();
        bindHotKeys();
        registerUiEvents();
    }

    function itemSelect(row) {
        selectedrecord = grdCustomFields.GetRowDataItem(row);
        loadSelected();
    }

    function gridDatabound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        if (grdCustomFields) {
            grdCustomFields.Refresh();
        } else {
            grdCustomFields = new Grid({
                keyfield: "CFD_CODE",
                columns: [
                    { type: "string", field: "CFD_CODE", title: gridstrings.customfields[lang].code, width: 50 },
                    {
                        type: "string",
                        field: "CFD_FIELDTYPE",
                        title: gridstrings.customfields[lang].fieldtype,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "CFD_DESCF",
                        title: gridstrings.customfields[lang].description,
                        width: 200
                    }
                ],
                datasource: "/Api/ApiCustomFields/List",
                selector: "#grdCustomFields",
                name: "grdCustomFields",
                height: 370,
                primarycodefield: "CFD_CODE",
                primarytextfield: "CFD_DESCF",
                filter: null,
                sort: [{ field: "CFD_CODE", dir: "desc" }],
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"CustomFields.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                    ]
                },
                databound: gridDatabound,
                change: gridChange
            });
        }
    }

    function remove() {
        if (selectedrecord) {
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiCustomFields/DelRec",
                        data: JSON.stringify(selectedrecord.CFD_CODE),
                        fn: function (d) {
                            msgs.success(d.data);
                            resetUI();
                            list();
                        }
                    });
                });
        }
    }

    function save() {
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = {
            CFD_CODE: $("#code").val().toUpper(),
            CFD_FIELDTYPE: $("#fieldtype option:selected").val(),
            CFD_ENTITY: ($("#fieldtype option:selected").val() === "ENTITY"
                ? $("#entity option:selected").val()
                : null),
            CFD_DESC: $("#description").val(),
            CFD_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            CFD_CLASS: ($("#customfieldclass").val() || null),
            CFD_ALLOWFREETEXT: $("#allowfreetext").prop("checked") ? "+" : "-",
            CFD_CREATED: selectedrecord != null ? selectedrecord.CFD_CREATED : tms.Now(),
            CFD_CREATEDBY: selectedrecord != null ? selectedrecord.CFD_CREATEDBY : user,
            CFD_UPDATED: selectedrecord != null ? tms.Now() : null,
            CFD_UPDATEDBY: selectedrecord != null ? user : null,
            CFD_RECORDVERSION: selectedrecord != null ? selectedrecord.CFD_RECORDVERSION : 0
        };

        return tms.Ajax({
            url: "/Api/ApiCustomFields/Save",
            data: JSON.stringify(o),
            fn: function (d) {
                msgs.success(d.data);
                resetUI();
                list();
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
        $("#btnDefineLookupLines").click(lookup.defineLULines);
        $("#fieldtype").on("change",
            function () {
                var v = $(this).val();
                ChangeUI(v);
            });
        $("#btncustomfieldclass").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#customfieldclass",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "CFCLASS", operator: "eq" }
                ]
            });
        });
        $("#customfieldclass").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [{ field: "SYC_GROUP", value: "CFCLASS", operator: "eq" }]
        });
    }

    function ready() {
        buildUI();
        list();
    }

    $(document).ready(ready);
}());