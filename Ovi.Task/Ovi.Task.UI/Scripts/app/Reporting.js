(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var scr, rep;
    var reportingid = 0;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
            ]
        }
    ];

    rep = new function () {
        var self = this;
        var grdReporting = null;
        var grdReportingElm = $("#grdReporting");
        var documentsHelper;
        var commentsHelper;
        var listCommentsHelper;
        var listDocumentsHelper;
        var customFieldsHelper;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMREPORTING", operator: "eq" },
                    { field: "AUD_REFID", value: reportingid, operator: "eq" }
                ]
            });
        };
        var BuildModals = function () {
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
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (d) {
                        if (d) {
                            $("#type").val("");
                            $("#task").val("");
                            tooltip.hide("#type");
                            tooltip.hide("#task");
                        }
                    }
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
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ENTITY", value: "REPORTING", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "REPORTING",
                                source: reportingid,
                                type: data.TYP_CODE
                            });
                        }
                    }
                });
            });
            $("#btntask").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.tasklist[lang].title,
                    listurl: "/Api/ApiTask/List",
                    keyfield: "TSK_ID",
                    codefield: "TSK_ID",
                    textfield: "TSK_SHORTDESC",
                    returninput: "#task",
                    columns: [
                        { type: "number", field: "TSK_ID", title: gridstrings.tasklist[lang].taskno, width: 100 },
                        {
                            type: "string",
                            field: "TSK_SHORTDESC",
                            title: gridstrings.tasklist[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TSK_ORGANIZATION", value: $("#org").val(), operator: "eq" },
                        { field: "TSK_STATUS", value: "IPT", operator: "neq" }
                    ],
                    sort: [{ field: "TSK_ID", dir: "desc" }],
                    fields: { TSK_ID: { type: "number" } }
                });
            });
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                filter: [
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d) {
                        $("#type").val("");
                        $("#task").val("");

                        tooltip.hide("#type");
                        tooltip.hide("#task");
                    }
                }
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "REPORTING", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "REPORTING",
                            source: reportingid,
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#task").autocomp({
                listurl: "/Api/ApiTasks/List",
                geturl: "/Api/ApiTasks/Get",
                field: "TSK_ID",
                textfield: "TSK_SHORTDESC",
                termisnumeric: true,
                filter: [
                    { field: "TSK_ORGANIZATION", relfield: "#org" },
                    { field: "TSK_STATUS", value: "IPT", operator: "neq" }
                ]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "REPORTING",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    RequestedBy: $("#createdby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-pcode=\"" +
                            status.pcode +
                            "\" data-code=\"" +
                            status.code +
                            "\" value=\"" +
                            status.code +
                            "\">" +
                            status.text +
                            "</option>";
                    if (d.data.length === 0) {
                        statusctrl.removeClass("required").prop("disabled", true);
                    } else {
                        for (var i = 0; i < d.data.length; i++) {
                            var di = d.data[i];
                            strOption += "<option data-pcode=\"" +
                                di.SAU_PTO +
                                "\" data-code=\"" +
                                di.SAU_TO +
                                "\" value=\"" +
                                di.SAU_TO +
                                "\">" +
                                di.SAU_TODESC +
                                "</option>";
                        }
                        statusctrl.addClass("required").prop("disabled", false).removeAttr("frozen");
                    }
                    statusctrl.append(strOption);
                }
            });
        };
        var EvaluateCurrentStatus = function () {
            var statusctrl = $("#status");
            var selectedoption = statusctrl.find("option:selected");
            var currentcode = statusctrl.data("code");
            var currentpcode = statusctrl.data("pcode");
            var code = selectedoption.data("code");
            var pcode = selectedoption.data("pcode");
            switch (currentpcode) {
                case "C":
                    $("#cfcontainer").find("input,select,button").prop("disabled", true);
                    $("#record [disableoncomplete]").prop("disabled", true);
                    break;

                default:
                    $("#record [disableoncomplete]").prop("disabled", false);
                    break;
            }

            if (selectedrecord) {
                $("#divcancellationreason").addClass("hidden");
                $("#cancellationreason").removeAttr("required").removeClass("required");
                switch (code) {
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        $("#cancellationreason").attr("required", "").addClass("required");
                        break;
                }
            }
        };
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "REPORTING", operator: "eq" }
                        ],
                        logic: "or"
                    }
                ]
            };

            var selectedcancellationreason = $("#cancellationreason").data("selected");
            if (selectedcancellationreason) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "CNR_CODE", value: selectedcancellationreason, operator: "eq" },
                        { field: "CNR_ENTITY", value: "REPORTING", operator: "eq" }
                    ],
                    logic: "or"
                });
            }

            return tms.Ajax({
                url: "/Api/ApiCancellationReasons/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#cancellationreason option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].CNR_CODE +
                            "\">" +
                            d.data[i].CNR_DESCF +
                            "</option>";
                    }
                    $("#cancellationreason").append(strOptions);
                    $("#cancellationreason").val(selectedcancellationreason);
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "REPORTING",
                source: reportingid
            });
            var o = JSON.stringify(
                {
                    Reporting: {
                        REP_ID: (reportingid || 0),
                        REP_ORG: $("#org").val(),
                        REP_TYPEENTITY: "REPORTING",
                        REP_TYPE: $("#type").val(),
                        REP_DESC: $("#description").val(),
                        REP_STATUSENTITY: "REPORTING",
                        REP_STATUS: $("#status").val(),
                        REP_TSK: ($("#task").val() || null),
                        REP_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        REP_CREATED: selectedrecord != null ? selectedrecord.REP_CREATED : tms.Now(),
                        REP_CREATEDBY: selectedrecord != null ? selectedrecord.REP_CREATEDBY : user,
                        REP_UPDATED: selectedrecord != null ? tms.Now() : null,
                        REP_UPDATEDBY: selectedrecord != null ? user : null,
                        REP_RECORDVERSION: selectedrecord != null ? selectedrecord.REP_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiReporting/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    reportingid = d.r.Reporting.REP_ID;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (reportingid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiReporting/DelRec",
                            data: JSON.stringify(reportingid),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.ResetUI = function () {
            selectedrecord = null;
            reportingid = null;
            selectedstatus = null;

            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);

            $("#reportingid").val("");
            $("#description").val("");
            $("#org").val("");
            $("#type").val("");
            $("#task").val("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            tooltip.hide("#org");
            tooltip.hide("#type");
            tooltip.hide("#task");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#reportingid").val(selectedrecord.REP_ID);
            $("#description").val(selectedrecord.REP_DESC);
            $("#org").val(selectedrecord.REP_ORG);
            $("#type").val(selectedrecord.REP_TYPE);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#task").val(selectedrecord.REP_TSK);
            $("#created").val(moment(selectedrecord.REP_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.REP_CREATEDBY);
            $("#cancellationreason").data("selected", selectedrecord.REP_CANCELLATIONREASON);

            tooltip.show("#org", selectedrecord.REP_ORGDESC);
            tooltip.show("#type", selectedrecord.REP_TYPEDESC);
            tooltip.show("#task", selectedrecord.REP_TSKDESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            LoadCancellationReasons();
            commentsHelper.showCommentsBlock({ subject: "REPORTING", source: selectedrecord.REP_ID });
            documentsHelper.showDocumentsBlock({ subject: "REPORTING", source: selectedrecord.REP_ID });;
            return $.when(customFieldsHelper.loadCustomFields({
                subject: "REPORTING",
                source: selectedrecord.REP_ID,
                type: selectedrecord.REP_TYPE
            })).done(function () {
                return $.when(LoadStatuses({
                    pcode: selectedstatus.STA_PCODE,
                    code: selectedstatus.STA_CODE,
                    text: selectedstatus.STA_DESCF
                })).done(function () {
                    EvaluateCurrentStatus();
                });
            });
        };
        this.LoadSelected = function (dataonly) {
            return tms.Ajax({
                url: "/Api/ApiReporting/Get",
                data: JSON.stringify(reportingid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    if (!dataonly) {
                        FillUserInterface();
                        customFieldsHelper.loadCustomFields({
                            subject: "REPORTING",
                            source: reportingid,
                            type: $("#type").val()
                        });
                    }
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdReporting.GetRowDataItem(row);
            reportingid = selectedrecord.REP_ID;
            $(".page-header h6").html(selectedrecord.REP_ID + " - " + selectedrecord.REP_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdReportingElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdReportingElm.find(".btn-comments").unbind("click").click(function () {
                var id = $(this).closest("[data-taskid]").data("taskid");
                console.log(id);
                listCommentsHelper.showCommentsModal({
                    subject: "TASK",
                    source: id
                });
            });
            grdReportingElm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).closest("[data-taskid]").data("taskid");
                $("#btnDownload").data("task", id);
                listDocumentsHelper.showDocumentsModal({
                    subject: "TASK",
                    source: id,
                    showall : "+"
                });
            });


            grdReportingElm.contextMenu({
                selector: "div.k-grid-content tr",
                items: {
                    newtab: {
                        name: applicationstrings[lang].newtab,
                        callback: function () {
                            var task = $(this).closest("[data-id]").data("task");
                            var win = window.open("/Task/Record/" + task, "_blank");
                        }
                    }
                }
            });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            if (grdReporting) {
                grdReporting.ClearSelection();
                grdReporting.RunFilter(gridfilter);
            } else {
                grdReporting = new Grid({
                    keyfield: "REP_ID",
                    columns: [
                        {
                            type: "na",
                            field: "ACTIONS",
                            title: gridstrings.reporting[lang].actions,
                            template: "<div style=\"text-align:center;\">" +
                                "<button type=\"button\" data-taskid=\"#= REP_TSK #\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(REP_CMNTCNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= REP_CMNTCNT #</span></button> " +
                                "<button type=\"button\"  data-taskid=\"#= REP_TSK #\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(REP_DOCCNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= REP_DOCCNT # </span></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 125
                        },
                        {
                            type: "number",
                            field: "REP_ID",
                            title: gridstrings.reporting[lang].reportingid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_DESC",
                            title: gridstrings.reporting[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "REP_ORG",
                            title: gridstrings.reporting[lang].organization,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_TYPE",
                            title: gridstrings.reporting[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_STATUS",
                            title: gridstrings.reporting[lang].status,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_STATUSDESC",
                            title: gridstrings.reporting[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "REP_TSK",
                            title: gridstrings.reporting[lang].task,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_TSKDESC",
                            title: gridstrings.reporting[lang].taskdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_TSKSTATUSDESC",
                            title: gridstrings.reporting[lang].taskstatus,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_TSKCATEGORYDESC",
                            title: gridstrings.reporting[lang].taskcategory,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_CUSCODE",
                            title: gridstrings.reporting[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_CUSDESC",
                            title: gridstrings.reporting[lang].customerdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_BRNCODE",
                            title: gridstrings.reporting[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_BRNDESC",
                            title: gridstrings.reporting[lang].branchdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_BRNREGION",
                            title: gridstrings.reporting[lang].branchregion,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_REGIONREPORTINGRESPONSIBLE",
                            title: gridstrings.reporting[lang].regionreportingresponsible,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_CUSTOMERREPORTINGRESPONSIBLE",
                            title: gridstrings.reporting[lang].customerreportingresponsible,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "REP_TSKASSIGNEDTO",
                            title: gridstrings.tasklist[lang].assignedto,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_TSKACTTRADE",
                            title: gridstrings.tasklist[lang].trade,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_SUPPLIER",
                            title: gridstrings.reporting[lang].supplier,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_SUPPLIERDESC",
                            title: gridstrings.reporting[lang].supplierdesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_CREATEDBY",
                            title: gridstrings.reporting[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "REP_CREATED",
                            title: gridstrings.reporting[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "REP_UPDATEDBY",
                            title: gridstrings.reporting[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "REP_UPDATED",
                            title: gridstrings.reporting[lang].updated,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        REP_ID: { type: "number" },
                        REP_TASK: { type: "number" },
                        REP_CREATED: { type: "date" },
                        REP_UPDATED: { type: "date" }
                    },
                    datafields: [
                        {
                            name: "task",
                            field: "REP_TSK"
                        }
                    ],
                    datasource: "/Api/ApiReporting/ListView",
                    selector: "#grdReporting",
                    name: "grdReporting",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "REP_ID",
                    primarytextfield: "REP_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "REP_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"reporting.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var activatedTab = e.target.hash;
                    var path = tms.Path();
                    switch (activatedTab) {
                        case "#list":
                            rep.ResetUI();
                            rep.List();
                            break;
                        case "#record":
                            $("#btnSave").prop("disabled", false);
                            if (!selectedrecord)
                                rep.ResetUI();
                            else
                                rep.LoadSelected();
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterTabEvents = function () {
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnPrint").click(self.Print);
            $("#btnDownload").on("click", function () {
                window.location = "/Download.ashx?subject=TASK&source=" + $(this).data("task");
            });

            $("#status").on("change", EvaluateCurrentStatus);
            $("[loadstatusesonchange=\"yes\"]").on("change",
                function () {
                    LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });

            RegisterTabChange();

            customFieldsHelper = new customfields({ container: "#cfcontainer" });
          
            BuildModals();
            AutoComplete();
        };

        this.BuildUI = function () {
            RegisterTabEvents();
            self.List();

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename" ,
                uploadbtn: "#btnupload",
                container:  "#fupload" ,
                documentsdiv: "#docs",
                progressbar: "#docuprogress" 
            });
            listDocumentsHelper = new documents({
                input: "#listfu",
                filename: "#listfilename",
                uploadbtn: "#btnlistupload" ,
                container: "#flistupload",
                documentcounttext: "tr[data-task=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
                modal: "#modaldocuments",
                documentsdiv: "#listdocs" ,
                progressbar: "#listdocuprogress",
                downloadbutton: "#btnDownload"

            });
            listCommentsHelper = new comments({
                input: "#listcomment",
                chkvisibletocustomer: "#visibletocustomer",
                chkvisibletosupplier: "#visibletosupplier",
                btnaddcomment: "#addlistComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-task=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
                commentsdiv: "#listcomments"
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });

            if (!selectedrecord)
                $("#btnBrowse").attr("disabled", "disabled");
        };
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: "#btnSave",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                rep.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                rep.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                rep.LoadSelected();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                rep.Delete();
                                break;
                        }
                    }
                }
            ]);
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
        rep.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());