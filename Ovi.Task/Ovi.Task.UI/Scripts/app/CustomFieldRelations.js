(function () {
    var selectedrecord = null;
    var selectedluline = null;
    var grdCustomFieldRelations = null;
    var grdCustomFieldRelationsElm = $("#grdCustomFieldRelations");

    /* AUTH LOGIC */

    var auth = new function () {
        var grdCustomFieldAuth = null;

        var gridDataBound = function (e) {
            $("#grdCustomFieldAuth").contextMenu({
                selector: "tr[data-id=\"true\"]",
                items: {
                    audit: {
                        name: "Audit",
                        callback: function () {
                            auditModal.show({
                                filter: [
                                    { field: "AUD_SUBJECT", value: "TMCUSTOMFIELDAUTH", operator: "eq" },
                                    {
                                        field: "AUD_REFID",
                                        value: $(this).attr("data-key-1") +
                                            "#" +
                                            $(this).attr("data-key-2") +
                                            "#" +
                                            $(this).attr("data-key-3"),
                                        operator: "eq"
                                    }
                                ]
                            });
                        }
                    }
                }
            });
        };
        var listAuthLines = function () {
            grdCustomFieldAuth = new Grid({
                keyfield: ["CFA_ENTITY", "CFA_TYPE", "CFA_CODE", "CFA_GROUP"],
                columns: [
                    { type: "string", field: "CFA_GROUP", title: gridstrings.customfieldauth[lang].group, width: 200 },
                    {
                        type: "na",
                        field: "OPTIONAL",
                        title: gridstrings.customfieldauth[lang].optional,
                        template:
                            "<input type=\"radio\" value=\"O\" name=\"#= CFA_ENTITY + '-' + CFA_TYPE + '-' + CFA_CODE + '-' + CFA_GROUP #\"  #= CFA_OPTIONAL == '+' ? 'checked=\"checked\"' : '' # />",
                        filterable: false,
                        sortable: false,
                        width: 50
                    },
                    {
                        type: "na",
                        field: "REQUIRED",
                        title: gridstrings.customfieldauth[lang].required,
                        template:
                            "<input type=\"radio\" value=\"R\" name=\"#= CFA_ENTITY + '-' + CFA_TYPE + '-' + CFA_CODE + '-' + CFA_GROUP #\" #= CFA_REQUIRED == '+' ? 'checked=\"checked\"' : '' # />",
                        filterable: false,
                        sortable: false,
                        width: 50
                    },
                    {
                        type: "na",
                        field: "PROTECTED",
                        title: gridstrings.customfieldauth[lang].protected,
                        template:
                            "<input type=\"radio\" value=\"P\" name=\"#= CFA_ENTITY + '-' + CFA_TYPE + '-' + CFA_CODE + '-' + CFA_GROUP #\" #= CFA_PROTECTED == '+' ? 'checked=\"checked\"' : '' # />",
                        filterable: false,
                        sortable: false,
                        width: 50
                    },
                    {
                        type: "na",
                        field: "HIDDEN",
                        title: gridstrings.customfieldauth[lang].hidden,
                        template:
                            "<input type=\"radio\" value=\"H\" name=\"#= CFA_ENTITY + '-' + CFA_TYPE + '-' + CFA_CODE + '-' + CFA_GROUP #\" #= CFA_HIDDEN == '+' ? 'checked=\"checked\"' : '' # />",
                        filterable: false,
                        sortable: false,
                        width: 50
                    }
                ],
                datasource: "/Api/ApiCustomFieldAuth/ListView",
                selector: "#grdCustomFieldAuth",
                name: "grdCustomFieldAuth",
                height: 370,
                loadall: true,
                filter: [
                    { field: "CFA_ENTITY", value: selectedrecord.CFR_ENTITY, operator: "eq", logic: "and" },
                    { field: "CFA_TYPE", value: selectedrecord.CFR_TYPE, operator: "eq", logic: "and" },
                    { field: "CFA_CODE", value: selectedrecord.CFR_CODE, operator: "eq", logic: "and" }
                ],
                sort: [{ field: "CFA_GROUP", dir: "asc" }],
                databound: gridDataBound
            });
        };
        this.defineAuthLines = function () {
            listAuthLines();
            $("#auth").modal("show");
        };
        var saveCustomFieldAuth = function () {
            var authlinesarr = [];
            var lines = $("#grdCustomFieldAuth").find("tr[data-keytype=\"multiple\"]");
            for (var i = 0; i < lines.length; i++) {
                var linei = $(lines[i]);
                var entity = linei.attr("data-key-1");
                var type = linei.attr("data-key-2");
                var code = linei.attr("data-key-3");
                var group = linei.attr("data-key-4");
                var selval = $("input[name=\"" + entity + "-" + type + "-" + code + "-" + group + "\"]:checked").val();
                var so = {
                    CFA_ENTITY: entity,
                    CFA_TYPE: type,
                    CFA_CODE: code,
                    CFA_GROUP: group,
                    CFA_CREATED: tms.Now(),
                    CFA_CREATEDBY: user
                };
                switch (selval) {
                    case "O":
                        so.CFA_OPTIONAL = "+";
                        so.CFA_REQUIRED = "-";
                        so.CFA_PROTECTED = "-";
                        break;
                    case "R":
                        so.CFA_REQUIRED = "+";
                        so.CFA_OPTIONAL = "-";
                        so.CFA_PROTECTED = "-";
                        break;
                    case "P":
                        so.CFA_PROTECTED = "+";
                        so.CFA_OPTIONAL = "-";
                        so.CFA_REQUIRED = "-";
                        break;
                    case "H":
                        so.CFA_PROTECTED = "-";
                        so.CFA_OPTIONAL = "-";
                        so.CFA_REQUIRED = "-";
                        break;
                    default:
                        break;
                }

                authlinesarr.push(so);
            }

            return tms.Ajax({
                url: "/Api/ApiCustomFieldAuth/Save",
                data: JSON.stringify(authlinesarr),
                fn: function (d) {
                    msgs.success(d.data);
                    $("#auth").modal("hide");
                }
            });
        };
        $("#auth button[data-action=\"save\"]").click(saveCustomFieldAuth);
    };

    /* AUTH LOGIC */

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#entity").val("");
        $("#type").val("");
        $("#cfcode").val("");
        $("#cfgroup").val("");
        $("#order").val("");

        tooltip.hide("#type");
        tooltip.hide("#cfcode");
        tooltip.hide("#cfgroup");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMCUSTOMFIELDRELATIONS", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.CFR_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#entity").val(selectedrecord.CFR_ENTITY);
        $("#type").val(selectedrecord.CFR_TYPE);
        $("#cfcode").val(selectedrecord.CFR_CODE);
        $("#cfgroup").val(selectedrecord.CFR_GROUP);
        $("#order").val(selectedrecord.CFR_ORDER);

        tooltip.show("#type", selectedrecord.CFR_TYPEDESC);
        tooltip.show("#cfcode", selectedrecord.CFR_CODEDESC);
        tooltip.show("#cfgroup", selectedrecord.CFR_GROUPDESC);

        $(".page-header>h6").html(selectedrecord.CFR_TYPE + " - " + selectedrecord.CFR_CODE);
    }

    function loadSelected() {
        return tms.Ajax({
            url: "/Api/ApiCustomFieldRelations/Get",
            data: JSON.stringify(selectedrecord.CFR_ID),
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
            }
        ]);
    }

    function BuildModals() {
        $("#btntype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESC",
                returninput: "#type",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_ENTITY", value: $("#entity").val(), operator: "eq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_ORGANIZATION", value: [organization, "*"], operator: "in" }
                ],
                callback: function (data) {
                    if (data) {
                        $("#entity").val(data.TYP_ENTITY);
                    }
                }
            });
        });

        $("#btncustomfield").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customfields[lang].title,
                listurl: "/Api/ApiCustomFields/List",
                keyfield: "CFD_CODE",
                codefield: "CFD_CODE",
                textfield: "CFD_DESC",
                returninput: "#cfcode",
                columns: [
                    { type: "string", field: "CFD_CODE", title: gridstrings.customfields[lang].code, width: 100 },
                    { type: "string", field: "CFD_DESC", title: gridstrings.customfields[lang].description, width: 400 }
                ],
                filter: [
                    { field: "CFD_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });

        $("#btncustomfieldgroup").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customfieldgroups[lang].title,
                listurl: "/Api/ApiCustomFieldGroups/List",
                keyfield: "CFG_CODE",
                codefield: "CFG_CODE",
                textfield: "CFG_DESC",
                returninput: "#cfgroup",
                columns: [
                    { type: "string", field: "CFG_CODE", title: gridstrings.customfieldgroups[lang].code, width: 100 },
                    {
                        type: "string",
                        field: "CFG_DESC",
                        title: gridstrings.customfieldgroups[lang].description,
                        width: 400
                    }
                ],
                filter: [
                    { field: "CFG_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
    }

    function AutoComplete() {
        $("#type").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            active: "TYP_ACTIVE",
            filter: [
                { field: "TYP_ENTITY", func: function () { return $("#entity").val() }, operator: "eq" },
                { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                { field: "TYP_ACTIVE", value: [organization, "*"], operator: "in" }
            ],
            callback: function (data) {
                if (data) {
                    $("#entity").val(data.TYP_ENTITY);
                }
            }
        });

        $("#cfcode").autocomp({
            listurl: "/Api/ApiCustomFields/List",
            geturl: "/Api/ApiCustomFields/Get",
            field: "CFD_CODE",
            textfield: "CFD_DESC",
            active: "CFD_ACTIVE",
            filter: [
                { field: "CFD_ACTIVE", value: "+", operator: "eq" }
            ]
        });

        $("#cfgroup").autocomp({
            listurl: "/Api/ApiCustomFieldGroups/List",
            geturl: "/Api/ApiCustomFieldGroups/Get",
            field: "CFG_CODE",
            textfield: "CFG_DESC",
            active: "CFG_ACTIVE",
            filter: [
                { field: "CFG_ACTIVE", value: "+", operator: "eq" }
            ]
        });
    }

    function buildUI() {
        resetUI();
        BuildModals();
        AutoComplete();
        bindHotKeys();
    }

    function itemSelect(row) {
        selectedrecord = grdCustomFieldRelations.GetRowDataItem(row);
        loadSelected();
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function gridDataBound() {
        grdCustomFieldRelationsElm.find(".btn-auth").on("click",
            function (e) {
                var row = $(this).closest("[data-id]");
                grdCustomFieldRelations.SelectRow(row);
                itemSelect(row);
                auth.defineAuthLines();
            });
    }

    function list() {
        if (grdCustomFieldRelations) {
            grdCustomFieldRelations.ClearSelection();
            grdCustomFieldRelations.RunFilter([]);
        } else {
            grdCustomFieldRelations = new Grid({
                keyfield: "CFR_ID",
                columns: [
                    {
                        type: "na",
                        field: "AUTH",
                        title: gridstrings.customfieldrelations[lang].actions,
                        template:
                            "<div style=\"text-align:center\"><button type=\"button\" class=\"btn btn-default btn-sm btn-auth\"><i class=\"fa fa-user-secret\"></i></button></div>",
                        filterable: false,
                        sortable: false,
                        width: 50
                    },
                    {
                        type: "string",
                        field: "CFR_ENTITY",
                        title: gridstrings.customfieldrelations[lang].entity,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "CFR_TYPE",
                        title: gridstrings.customfieldrelations[lang].type,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "CFR_TYPEDESC",
                        title: gridstrings.customfieldrelations[lang].typedesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "CFR_CODE",
                        title: gridstrings.customfieldrelations[lang].code,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "CFR_CODEDESC",
                        title: gridstrings.customfieldrelations[lang].codedesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "CFR_GROUP",
                        title: gridstrings.customfieldrelations[lang].group,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "CFR_GROUPDESC",
                        title: gridstrings.customfieldrelations[lang].groupdesc,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "CFR_ORDER",
                        title: gridstrings.customfieldrelations[lang].order,
                        width: 200
                    }
                ],
                datasource: "/Api/ApiCustomFieldRelations/List",
                selector: "#grdCustomFieldRelations",
                name: "grdCustomFieldRelations",
                height: 370,
                primarycodefield: "CFR_TYPE",
                primarytextfield: "CFR_CODE",
                filter: null,
                sort: [{ field: "CFR_TYPE", dir: "desc" }],
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"CustomFieldRelations.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                    ]
                },
                databound: gridDataBound,
                change: gridChange
            });
        }
    }

    function remove() {
        if (selectedrecord) {
            $("#confirm").modal().off("click", "#delete")
                .one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiCustomFieldRelations/DelRec",
                            data: JSON.stringify(selectedrecord.CFR_ID),
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
            CFR_ID: selectedrecord != null ? selectedrecord.CFR_ID : 0,
            CFR_ENTITY: $("#entity").val(),
            CFR_TYPE: $("#type").val(),
            CFR_CODE: $("#cfcode").val(),
            CFR_GROUP: ($("#cfgroup").val() || null),
            CFR_ORDER: $("#order").val(),
            CFR_CREATED: selectedrecord != null ? selectedrecord.CFR_CREATED : tms.Now(),
            CFR_CREATEDBY: selectedrecord != null ? selectedrecord.CFR_CREATEDBY : user,
            CFR_UPDATED: selectedrecord != null ? tms.Now() : null,
            CFR_UPDATEDBY: selectedrecord != null ? user : null,
            CFR_RECORDVERSION: selectedrecord != null ? selectedrecord.CFR_RECORDVERSION : 0
        };

        return tms.Ajax({
            url: "/Api/ApiCustomFieldRelations/Save",
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
        $("#btnUndo").click(fillUserInterface);
        $("#btnHistory").click(historyModal);
    }

    function ready() {
        buildUI();
        list();
        registerUiEvents();
    }

    $(document).ready(ready);
}());