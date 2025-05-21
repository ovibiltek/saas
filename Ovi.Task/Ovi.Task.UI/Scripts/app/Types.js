(function () {
    var selectedrecord = null;
    var scr, act, prm, typ;

    var screenconf = [
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnTranslations", selectionrequired: true }
            ]
        },
        {
            name: "activities",
            btns: []
        },
        {
            name: "typeparameters",
            btns: []
        }
    ];

    act = new function () {
        var selecteditem = null;
        var grdelm = $("#grdTypeActivities");
        var grdTypeActivities = null;
        var self = this;

        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#activities");

            $("#line").val("");
            $("#dep").val("");
            $("#checklisttmp").val("");
            $("#assignedto").tagsinput("removeAll");
            $("#actdesc").val("");
            $("#lmapprovalrequired").prop("checked", true);
            $("#hidden").prop("checked", false);
            $("#private").prop("checked", false);
            $("#createseparateactivity").prop("checked", false);
            $("#taskdepartment").prop("checked", false);
            $("#taskdescription").prop("checked", false);
            $("#dep").prop("disabled", false).addClass("required").prop("required");
            $("#btnDepartment").prop("disabled", false);

            tooltip.hide("#checklisttmp");
            tooltip.hide("#dep");
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#activities");

            $("#line").val(selecteditem.TAT_LINE);
            $("#dep").val(selecteditem.TAT_DEPARTMENT);
            $("#checklisttmp").val(selecteditem.TAT_CHKLISTTMP);
            $("#actdesc").val(selecteditem.TAT_DESC);
            $("#lmapprovalrequired").prop("checked", selecteditem.TAT_LMAPPROVALREQUIRED === "+");
            $("#createseparateactivity").prop("checked", selecteditem.TAT_CREATESEPARATEACTIVITY === "+");
            $("#hidden").prop("checked", selecteditem.TAT_HIDDEN === "+");
            $("#private").prop("checked", selecteditem.TAT_PRIVATE === "+");
            $("#taskdepartment").prop("checked", selecteditem.TAT_TASKDEPARTMENT === "+");
            $("#taskdescription").prop("checked", selecteditem.TAT_TASKDESC === "+");

            $("#status").val(selecteditem.TAT_STATUS);
            $("#predecessor").val(selecteditem.TAT_PREDECESSOR);

            var istaskdepartmentchecked = (selecteditem.TAT_TASKDEPARTMENT === "+");
            $("#dep").prop("disabled", istaskdepartmentchecked);
            $("#btnDepartment").prop("disabled", istaskdepartmentchecked);
            if (istaskdepartmentchecked) {
                $("#dep").removeClass("required").removeAttr("required");
            } else {
                $("#dep").addClass("required").prop("required");
            }

            var istaskdescchecked = (selecteditem.TAT_TASKDESC === "+");
            $("#actdesc").prop("disabled", istaskdescchecked);
            if (istaskdescchecked) {
                $("#actdesc").removeClass("required").removeAttr("required");
            } else {
                $("#actdesc").addClass("required").prop("required");
            }

            tooltip.show("#predecessor", selecteditem.TAT_PREDECESSORDESC);
            tooltip.show("#dep", selecteditem.TAT_DEPARTMENTDESC);
            tooltip.show("#checklisttmp", selecteditem.TAT_CHKLISTTMPDESC);

            $("#assignedto").tagsinput("removeAll");
            if (selecteditem.TAT_ASSIGNEDTO != null)
                for (var i = 0; i < selecteditem.TAT_ASSIGNEDTO.length; i++) {
                    $("#assignedto").tagsinput("add",
                        { id: selecteditem.TAT_ASSIGNEDTO[i].USR_CODE, text: selecteditem.TAT_ASSIGNEDTO[i].USR_DESC },
                        ["ignore"]);
                }

            $("#actdesc").focus();
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiActivityTemplates/Get",
                data: JSON.stringify(selecteditem.TAT_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUserInterface();
                }
            });
        };
        var ItemSelect = function (row) {
            selecteditem = grdTypeActivities.GetRowDataItem(row);
            LoadSelected();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [
                { field: "TAT_TYPE", value: "ACTIVITY", operator: "eq", logic: "and" },
                { field: "TAT_ENTITY", value: selectedrecord.TYP_ENTITY, operator: "eq", logic: "and" },
                { field: "TAT_CODE", value: selectedrecord.TYP_CODE, operator: "eq", logic: "and" }
            ];

            if (grdTypeActivities) {
                grdTypeActivities.ClearSelection();
                grdTypeActivities.RunFilter(grdFilter);
            } else {
                grdTypeActivities = new Grid({
                    keyfield: "TAT_ID",
                    columns: [
                        { type: "string", field: "TAT_LINE", title: gridstrings.typeactivities[lang].line, width: 100 },
                        {
                            type: "string",
                            field: "TAT_DESC",
                            title: gridstrings.typeactivities[lang].description,
                            template: "<span># if(TAT_TASKDESC == \"+\") {#" +
                                applicationstrings[lang].taskdesc +
                                "#} else {# #: TAT_DESC # #} #</span>",
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_PREDECESSOR",
                            title: gridstrings.typeactivities[lang].predecessor,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_DEPARTMENT",
                            title: gridstrings.typeactivities[lang].department,
                            template: "<span># if(TAT_TASKDEPARTMENT == \"+\") {#" +
                                applicationstrings[lang].taskdepartment +
                                "#} else {# #: TAT_DEPARTMENT # #} #</span>",
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_ASSIGNEDTO",
                            title: gridstrings.typeactivities[lang].assignedto,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TAT_CHKLISTTMP",
                            title: gridstrings.typeactivities[lang].checklisttemplate,
                            width: 100
                        }
                    ],
                    datasource: "/Api/ApiActivityTemplates/List",
                    selector: "#grdTypeActivities",
                    name: "grdTypeActivities",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "TAT_LINE", dir: "asc" }],
                    change: GridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#actdetails"))
                return;

            var o = JSON.stringify({
                TAT_ID: (selecteditem != null ? selecteditem.TAT_ID : 0),
                TAT_TYPE: "ACTIVITY",
                TAT_ENTITY: $("#entity").val(),
                TAT_CODE: $("#code").val(),
                TAT_LINE: $("#line").val(),
                TAT_STATUS: $("#status").val(),
                TAT_DESC: ($("#actdesc").val() || null),
                TAT_DEPARTMENT: ($("#dep").val() || null),
                TAT_TASKDEPARTMENT: $("#taskdepartment").prop("checked") ? "+" : "-",
                TAT_TASKDESC: $("#taskdescription").prop("checked") ? "+" : "-",
                TAT_ASSIGNEDTO: ($("#assignedto").val() || null),
                TAT_PREDECESSOR: ($("#predecessor").val() || null),
                TAT_CHKLISTTMP: ($("#checklisttmp").val() || null),
                TAT_LMAPPROVALREQUIRED: $("#lmapprovalrequired").prop("checked") ? "+" : "-",
                TAT_HIDDEN: $("#hidden").prop("checked") ? "+" : "-",
                TAT_PRIVATE: $("#private").prop("checked") ? "+" : "-",
                TAT_CREATESEPARATEACTIVITY: $("#createseparateactivity").prop("checked") ? "+" : "-",
                TAT_CREATED: selecteditem != null ? selecteditem.TAT_CREATED : tms.Now(),
                TAT_CREATEDBY: selecteditem != null ? selecteditem.TAT_CREATEDBY : user,
                TAT_UPDATED: selecteditem != null ? tms.Now() : null,
                TAT_UPDATEDBY: selecteditem != null ? user : null,
                TAT_RECORDVERSION: selecteditem != null ? selecteditem.TAT_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiActivityTemplates/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiActivityTemplates/DelRec",
                            data: JSON.stringify(selecteditem.TAT_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.FillStatuses = function () {
            var gridreq = {
                sort: [{ field: "STA_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "STA_ENTITY", value: selectedrecord.TYP_ENTITY, operator: "eq" },
                        { field: "STA_CODE", value: "-", operator: "neq" }
                    ]
                }
            };
            select({
                ctrl: "#status",
                url: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                textfield: "STA_DESCF",
                data: JSON.stringify(gridreq)
            }).Fill();
        };
        var RegisterUIEvents = function () {
            $("#btnAddActivity").click(self.ResetUI);
            $("#btnSaveActivity").click(self.Save);
            $("#btnDeleteActivity").click(self.Delete);

            $("#btnDepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#dep",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: ["*", selectedrecord.TYP_ORGANIZATION], operator: "in" },
                        { field: "DEP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        $("#dep").val(data.DEP_CODE).trigger("change");
                        tooltip.show("#dep", data.DEP_DESC);
                    }
                });
            });
            $("#btnAssignedTo").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#assignedto",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_DEPARTMENT", value: ["*", $("#dep").val() || department], operator: "in" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.user[lang].departmentusers,
                            filter: [
                                {
                                    field: "USR_DEPARTMENT",
                                    value: ["*", $("#dep").val() || department],
                                    operator: "in"
                                },
                                { field: "USR_ACTIVE", value: "+", operator: "eq" }
                            ]
                        },
                        {
                            text: gridstrings.user[lang].allusers,
                            filter: [
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        }
                    ]
                });
            });
            $("#btnpredecessor").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.typeactivities[lang].title,
                    listurl: "/Api/ApiActivityTemplates/List",
                    keyfield: "TAT_LINE",
                    codefield: "TAT_LINE",
                    textfield: "TAT_DESC",
                    returninput: "#predecessor",
                    columns: [
                        { type: "string", field: "TAT_LINE", title: gridstrings.typeactivities[lang].line, width: 100 },
                        {
                            type: "string",
                            field: "TAT_DESC",
                            title: gridstrings.typeactivities[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TAT_CODE", value: selectedrecord.TYP_CODE, operator: "eq" },
                        { field: "TAT_ENTITY", value: selectedrecord.TYP_ENTITY, operator: "eq" },
                        {
                            field:"PREDECESSORACTIVITY.TYP",
                            value: (selecteditem != null ? selecteditem.TAT_ID : 0),
                            operator: "func"
                        }
                    ]
                });
            });
            $("#btnChecklistTmp").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.checklisttemplate[lang].title,
                    listurl: "/Api/ApiChecklistTemplates/List",
                    keyfield: "CLT_CODE",
                    codefield: "CLT_CODE",
                    textfield: "CLT_DESC",
                    returninput: "#checklisttmp",
                    columns: [
                        {
                            type: "string",
                            field: "CLT_CODE",
                            title: gridstrings.checklisttemplate[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "CLT_DESC",
                            title: gridstrings.checklisttemplate[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "CLT_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });

            $("#dep").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    {
                        field: "DEP_ORG",
                        func: function () { return ["*", selectedrecord.TYP_ORGANIZATION]; },
                        operator: "in"
                    },
                    { field: "DEP_CODE", value: "*", operator: "neq" }
                ],
                callback: function (data) {
                    $("#dep").val(data.DEP_CODE).trigger("change");
                    tooltip.show("#dep", data.DEP_DESC);
                }
            });
            $("#taskdepartment").on("change",
                function () {
                    var ischecked = $(this).is(":checked");
                    var depctrl = $("#dep");
                    depctrl.val("");
                    depctrl.prop("disabled", ischecked);
                    $("#btnDepartment").prop("disabled", ischecked);
                    if (ischecked) {
                        depctrl.removeClass("required").removeAttr("required");
                        tooltip.hide("#dep");
                    } else {
                        depctrl.addClass("required").prop("required");
                    }
                });
            $("#taskdescription").on("change",
                function () {
                    var ischecked = $(this).is(":checked");
                    var actdesc = $("#actdesc");
                    actdesc.val("");
                    actdesc.prop("disabled", ischecked);
                    if (ischecked) {
                        actdesc.removeClass("required").removeAttr("required");
                    } else {
                        actdesc.addClass("required").prop("required");
                    }
                });
        };
        RegisterUIEvents();
    };
    prm = new function () {
        var selecteditem = null;
        var grdelm = $("#grdTypeParameters");
        var grdTypeParameters = null;
        var self = this;

        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#typeparameters");

            $("#paramgroup").val("");
            $("#paramcode").val("");
            $("#paramdesc").val("");
            $("#paramvalue").val("");
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#typeparameters");
            $("#paramgroup").val(selecteditem.TPA_GROUP);
            $("#paramcode").val(selecteditem.TPA_CODE);
            $("#paramdesc").val(selecteditem.TPA_DESC);
            $("#paramvalue").val(selecteditem.TPA_VALUE);
            $("#paramdesc").focus();
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiTypeParameters/Get",
                data: JSON.stringify(selecteditem.TPA_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUserInterface();
                }
            });
        };
        var ItemSelect = function (row) {
            selecteditem = grdTypeParameters.GetRowDataItem(row);
            LoadSelected();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [
                { field: "TPA_TYPEENTITY", value: selectedrecord.TYP_ENTITY, operator: "eq", logic: "and" },
                { field: "TPA_TYPECODE", value: selectedrecord.TYP_CODE, operator: "eq", logic: "and" }
            ];
            if (grdTypeParameters) {
                grdTypeParameters.ClearSelection();
                grdTypeParameters.RunFilter(grdFilter);
            } else {
                grdTypeParameters = new Grid({
                    keyfield: "TPA_ID",
                    columns: [
                        {
                            type: "string",
                            field: "TPA_GROUP",
                            title: gridstrings.typeparameters[lang].group,
                            width: 100
                        },
                        { type: "string", field: "TPA_CODE", title: gridstrings.typeparameters[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "TPA_DESC",
                            title: gridstrings.typeparameters[lang].description,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TPA_VALUE",
                            title: gridstrings.typeparameters[lang].value,
                            width: 100
                        }
                    ],
                    datasource: "/Api/ApiTypeParameters/List",
                    selector: "#grdTypeParameters",
                    name: "grdTypeParameters",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "TPA_ID", dir: "asc" }],
                    change: GridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#typeparameterdetails"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                TPA_ID: (selecteditem != null ? selecteditem.TPA_ID : 0),
                TPA_TYPEENTITY: $("#entity").val(),
                TPA_TYPECODE: $("#code").val(),
                TPA_GROUP: $("#paramgroup").val(),
                TPA_CODE: $("#paramcode").val(),
                TPA_DESC: $("#paramdesc").val(),
                TPA_VALUE: $("#paramvalue").val(),
                TPA_CREATED: selecteditem != null ? selecteditem.TPA_CREATED : tms.Now(),
                TPA_CREATEDBY: selecteditem != null ? selecteditem.TPA_CREATEDBY : user,
                TPA_UPDATED: selecteditem != null ? tms.Now() : null,
                TPA_UPDATEDBY: selecteditem != null ? user : null,
                TPA_RECORDVERSION: selecteditem != null ? selecteditem.TPA_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiTypeParameters/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                }
            });
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTypeParameters/DelRec",
                            data: JSON.stringify(selecteditem.TPA_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                            }
                        });
                    });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddTypeParameter").click(self.ResetUI);
            $("#btnSaveTypeParameter").click(self.Save);
            $("#btnDeleteTypeParameter").click(self.Delete);
        };
        RegisterUIEvents();
    };
    typ = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#entity").val("");
            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#autocodeprefix").val("");
            $("#active").prop("checked", true);
            $("#showinactionbox").prop("checked", false);
            $("#showinactionbox").prop("checked", false);

            $("#line").val("");
            $("#dep").val("");
            $("#checklisttemplate").val("");
            $("#assignedto").tagsinput("removeAll");

            
            $(".equipmentfields").addClass("hidden");

            // Hide Tooltips
            tooltip.hide("#org");
            tooltip.hide("#checklisttemplate");
            tooltip.hide("#dep");
            tooltip.hide("#currency");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMTYPES", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.TYP_SQLIDENTITY, operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMTYPES", operator: "eq" },
                    { field: "DES_PROPERTY", value: "TYP_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#entity").val() + "#" + $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab(selectedrecord.TYP_ENTITY);

            $("#entity").val(selectedrecord.TYP_ENTITY);
            $("#code").val(selectedrecord.TYP_CODE);
            $("#desc").val(selectedrecord.TYP_DESC);
            $("#org").val(selectedrecord.TYP_ORGANIZATION);
            $("#autocodeprefix").val(selectedrecord.TYP_AUTOCODEPREFIX);
            $("#active").prop("checked", selectedrecord.TYP_ACTIVE === "+");
            $("#showinactionbox").prop("checked", selectedrecord.TYP_SHOWINACTIONBOX === "+");

            tooltip.show("#org", selectedrecord.TYP_ORGANIZATIONDESC);

            $(".page-header>h6").html(selectedrecord.TYP_CODE + " - " + selectedrecord.TYP_DESCF);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var prm = {
                Code: selecteditem.data("id"),
                Entity: selecteditem.data("entity")
            };

            return tms.Ajax({
                url: "/Api/ApiTypes/Get",
                data: JSON.stringify(prm),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                    act.FillStatuses();
                }
            });
        };
        this.Remove = function () {
            if (selectedrecord) {
                var prm = {
                    Code: selectedrecord.TYP_CODE,
                    Entity: selectedrecord.TYP_ENTITY
                };

                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTypes/DelRec",
                            data: JSON.stringify(prm),
                            fn: function (d) {
                                msgs.success(d.data);
                                $(".list-group").list("refresh");
                                self.ResetUI();
                            }
                        });
                    });
            }
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                TYP_ENTITY: $("#entity").val().toUpper(),
                TYP_CODE: $("#code").val(),
                TYP_DESC: $("#desc").val(),
                TYP_ORGANIZATION: $("#org").val(),
                TYP_AUTOCODEPREFIX: ($("#autocodeprefix").val() || null),
                TYP_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                TYP_SHOWINACTIONBOX: $("#showinactionbox").prop("checked") ? "+" : "-",
                TYP_CREATED: selectedrecord != null ? selectedrecord.TYP_CREATED : tms.Now(),
                TYP_CREATEDBY: selectedrecord != null ? selectedrecord.TYP_CREATEDBY : user,
                TYP_UPDATED: selectedrecord != null ? tms.Now() : null,
                TYP_UPDATEDBY: selectedrecord != null ? user : null,
                TYP_SQLIDENTITY: selectedrecord != null ? selectedrecord.TYP_SQLIDENTITY : 0,
                TYP_RECORDVERSION: selectedrecord != null ? selectedrecord.TYP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiTypes/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.TYP_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    switch (target) {
                        case "#activities":
                            act.List();
                            act.ResetUI();
                            break;
                        case "#typeparameters":
                            prm.List();
                            prm.ResetUI();
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Remove);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnTranslations").click(self.TranslationModal);



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
            $("#btncurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#currency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });

            $("#entity").on("change",
                function() {
                    if ($(this).val() === "EQUIPMENT") {
                        $(".equipmentfields").removeClass("hidden");
                    } else {
                        $(".equipmentfields").addClass("hidden");
                    }
                });

            RegisterTabChange();
        };
        this.List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiTypes/List",
                fields: {
                    keyfield: "TYP_CODE",
                    descfield: "TYP_DESC",
                    entityfield: "TYP_ENTITY",
                    otherfields: [{ field: "TYP_ENTITY", label: gridstrings.type[lang].entity }]
                },
                sort: [{ field: "TYP_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                }
            });
        };
        this.BuildUI = function () {
            self.ResetUI();
            self.List();
            RegisterUiEvents();
        };
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "activities":
                                return "#btnSave";
                            case "typeparameters":
                                return "#btnSaveTypeParameter";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                typ.Save();
                                break;
                            case "activities":
                                act.Save();
                                break;
                            case "typeparameters":
                                prm.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnNew";
                            case "activities":
                                return "#btnAddActivity";
                            case "typeparameters":
                                return "#btnAddTypeParameter";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                typ.ResetUI();
                                break;
                            case "activities":
                                act.ResetUI();
                                break;
                            case "typeparameters":
                                prm.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        typ.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "activities":
                                return "#btnDelete";
                            case "typeparameters":
                                return "#btnDeleteTypeParameter";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                typ.Remove();
                                break;
                            case "activities":
                                act.Delete();
                                break;
                            case "typeparameters":
                                prm.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnTranslations",
                    f: function () {
                        typ.TranslationModal();
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
        };
        this.LoadSelected = function () {
            return $.when(typ.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "activities":
                        act.ResetUI();
                        act.List();
                        break;
                    case "typeparameters":
                        prm.ResetUI();
                        prm.List();
                        break;
                }
            });
        };
        this.Configure = function () {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function (e) { return e.name === activeTab; })[0];
            for (var i = 0; i < tab.btns.length; i++) {
                var btni = tab.btns[i];
                if (!btni.selectionrequired)
                    $(btni.id).removeAttr("disabled");
                else {
                    if (selectedrecord) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
    };

    function ready() {
        typ.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());