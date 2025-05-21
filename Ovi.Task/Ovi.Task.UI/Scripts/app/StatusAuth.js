(function () {
    var selectedrecord = null;
    var grdStatusAuth = null;
    var grdelm = $("#grdStatusAuth");

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#entity").val("");
        $("#type").val("");
        $("#department").val("");
        $("#authorized").val("");
        $("#from").val("");
        $("#to").val("");
        $("#active").prop("checked", true);
        $("#showonworkflow").prop("checked", false);

        tooltip.hide("#from");
        tooltip.hide("#to");
        tooltip.hide("#type");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMSTATUSAUTH", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.SAU_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#entity").val(selectedrecord.SAU_ENTITY);
        $("#type").val(selectedrecord.SAU_TYPE);
        $("#department").val(selectedrecord.SAU_DEPARTMENT);
        $("#authorized").val(selectedrecord.SAU_AUTHORIZED);
        $("#from").val(selectedrecord.SAU_FROM);
        $("#to").val(selectedrecord.SAU_TO);
        $("#active").prop("checked", selectedrecord.SAU_ACTIVE === "+");
        $("#showonworkflow").prop("checked", selectedrecord.SAU_SHOWONWORKFLOW === "+");

        tooltip.show("#from", selectedrecord.SAU_FROMDESC);
        tooltip.show("#to", selectedrecord.SAU_TODESC);
        tooltip.show("#type", selectedrecord.SAU_TYPEDESC);

        $(".page-header>h6").html(selectedrecord.SAU_TYPE +
            " - " +
            selectedrecord.SAU_FROM +
            "." +
            selectedrecord.SAU_TO);
    }

    function itemSelect(row) {
        selectedrecord = grdStatusAuth.GetRowDataItem(row);
        fillUserInterface();
    }

    function gridDatabound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        if (grdStatusAuth) {
            grdStatusAuth.ClearSelection();
            grdStatusAuth.Refresh();
        } else {
            grdStatusAuth = new Grid({
                keyfield: "SAU_ID",
                columns: [
                    {
                        type: "string",
                        field: "SAU_ENTITY",
                        title: gridstrings.statusauthorizations[lang].entity,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_TYPE",
                        title: gridstrings.statusauthorizations[lang].type,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_TYPEDESC",
                        title: gridstrings.statusauthorizations[lang].description,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "SAU_DEPARTMENT",
                        title: gridstrings.statusauthorizations[lang].department,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_AUTHORIZED",
                        title: gridstrings.statusauthorizations[lang].authorized,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_FROM",
                        title: gridstrings.statusauthorizations[lang].from,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_FROMDESC",
                        title: gridstrings.statusauthorizations[lang].fromdesc,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_TO",
                        title: gridstrings.statusauthorizations[lang].to,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "SAU_TODESC",
                        title: gridstrings.statusauthorizations[lang].todesc,
                        width: 100
                    }
                ],
                datasource: "/Api/ApiStatusAuth/List",
                selector: "#grdStatusAuth",
                name: "grdStatusAuth",
                height: 300,
                primarycodefield: "SAU_ID",
                primarytextfield: "SAU_FROM",
                filter: null,
                sort: [
                    { field: "SAU_ENTITY", dir: "asc" },
                    { field: "SAU_TYPE", dir: "asc" }
                ],
                toolbarColumnMenu: true,
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"StatusAuth.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                    ]
                },
                databound: gridDatabound,
                change: gridChange
            });
        }
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.SAU_ID;
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiStatusAuth/DelRec",
                        data: JSON.stringify(code),
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

        var o = JSON.stringify({
            SAU_ID: (selectedrecord) ? selectedrecord.SAU_ID : 0,
            SAU_ENTITY: $("#entity").val(),
            SAU_TYPE: $("#type").val(),
            SAU_DEPARTMENT: $("#department").val(),
            SAU_FROM: $("#from").val(),
            SAU_TO: $("#to").val(),
            SAU_AUTHORIZED: $("#authorized").val(),
            SAU_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            SAU_SHOWONWORKFLOW: $("#showonworkflow").prop("checked") ? "+" : "-",
            SAU_CREATED: selectedrecord != null ? selectedrecord.SAU_CREATED : tms.Now(),
            SAU_CREATEDBY: selectedrecord != null ? selectedrecord.SAU_CREATEDBY : user,
            SAU_UPDATED: selectedrecord != null ? tms.Now() : null,
            SAU_UPDATEDBY: selectedrecord != null ? user : null,
            SAU_RECORDVERSION: selectedrecord != null ? selectedrecord.SAU_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiStatusAuth/Save",
            data: o,
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

        $("#from").autocomp({
            listurl: "/Api/ApiStatuses/List",
            geturl: "/Api/ApiStatuses/Get",
            field: "STA_CODE",
            textfield: "STA_DESC",
            filter: [{ field: "STA_ENTITY", func: function () { return $("#entity").val(); } }]
        });
        $("#to").autocomp({
            listurl: "/Api/ApiStatuses/List",
            geturl: "/Api/ApiStatuses/Get",
            field: "STA_CODE",
            textfield: "STA_DESC",
            filter: [{ field: "STA_ENTITY", func: function () { return $("#entity").val(); } }]
        });
        $("#type").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            active: "TYP_ACTIVE",
            filter: [
                {
                    field: "TYP_ENTITY",
                    relfield: "#entity",
                    includeall: true
                }
            ]
        });
        $("#btnFrom").click(function () {
            gridModal.show({
                modaltitle: gridstrings.status[lang].title,
                listurl: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                codefield: "STA_CODE",
                textfield: "STA_DESC",
                returninput: "#from",
                columns: [
                    { type: "string", field: "STA_CODE", title: gridstrings.status[lang].status, width: 100 },
                    { type: "string", field: "STA_DESC", title: gridstrings.status[lang].description, width: 300 }
                ],
                filter: [{ field: "STA_ENTITY", value: $("#entity").val(), operator: "eq" }]
            });
        });
        $("#btnTo").click(function () {
            gridModal.show({
                modaltitle: gridstrings.status[lang].title,
                listurl: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                codefield: "STA_CODE",
                textfield: "STA_DESC",
                returninput: "#to",
                columns: [
                    { type: "string", field: "STA_CODE", title: gridstrings.status[lang].status, width: 100 },
                    { type: "string", field: "STA_DESC", title: gridstrings.status[lang].description, width: 300 }
                ],
                filter: [{ field: "STA_ENTITY", value: $("#entity").val(), operator: "eq" }]
            });
        });
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
                    { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 300 }
                ],
                filter: [
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_ENTITY", value: $("#entity").val(), operator: "eq" }
                ]
            });
        });
        select({
            ctrl: "#authorized",
            url: "/api/ApiUserGroups/List",
            keyfield: "UGR_CODE",
            textfield: "UGR_DESC",
            optgroup: "optgroup[data-type=\"USRGRP\"]",
            data: JSON.stringify({
                filter: { filters: [{ field: "UGR_ACTIVE", value: "+", operator: "eq" }] } 
            })
        }).Fill();
    }

    function buildUI() {
        resetUI();
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
                    fillUserInterface();
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
        list();
        bindHotKeys();
    }

    $(document).ready(ready);
}());