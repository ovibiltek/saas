(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var dorid = null;
    var scr, dor;
    var sleaveduration;
    var sleavesummary;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        }
    ];

    dor = new function () {
        var self = this;
        var grdDayOffRequests = null;
        var grdDayOffRequestsElm = $("#grdDayOffRequests");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;

        var ShowLeaveDurationInfo = function () {
            if (sleaveduration)
                $("#dayoffrequesttypeinfo").removeClass("hidden").html("<span class=\"badge badge-info\" >" +
                    applicationstrings[lang].dayoffrequesttypeinfo +
                    sleaveduration.LDU_TIME + " " + applicationstrings[lang].durationunit.DAY +
                    "</span>");
        }
        var ShowAnnualLeaveSummary = function () {
            if (sleavesummary) {
                $("div.annualleaveinfo").removeClass("hidden");
                $("#annualleavetotal").val(sleavesummary.UAL_QTYTOTAL);
                $("#annualleaveremaining").val(sleavesummary.UAL_REMAINING);
            } else {
                $("div.annualleaveinfo").addClass("hidden");
                $("#annualleavetotal").val("");
                $("#annualleaveremaining").val("");
            }
        }
        var GetLeaveDuration = function (type) {
            return tms.Ajax({
                url: "/Api/ApiLeaveDurations/GetLeaveDurationByType",
                data: JSON.stringify(type),
                fn: function (d) {
                    sleaveduration = d.data;
                }
            });
        }
        var GetAnnualLeaveSummary = function (user) {
            return tms.Ajax({
                url: "/Api/ApiUserAnnualLeaves/GetByUser",
                data: JSON.stringify(user),
                fn: function (d) {
                    sleavesummary = d.data;
                }
            });
        }
        var CalculateLeaveDuration = function () {
            var startdate_v = $("#startdate").val();
            var enddate_v = $("#enddate").val();

            if (startdate_v && enddate_v) {
                var startdate = moment.utc($("#startdate").val(), constants.longdateformat);
                var enddate = moment.utc($("#enddate").val(), constants.longdateformat);

                var p = {
                    User: user,
                    Start: startdate,
                    End: enddate
                }

                return tms.Ajax({
                    url: "/Api/ApiDayOffRequests/CalculateLeaveDuration",
                    data: JSON.stringify(p),
                    fn: function (d) {
                        $("#duration").val(d.data);
                    }
                });
            }
        }
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "DAYOFFREQUEST", operator: "eq" },
                            { field: "CNR_ACTIVE", value: "+", operator: "eq" }
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
                        { field: "CNR_ENTITY", value: "DAYOFFREQUEST", operator: "eq" }
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
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMDAYOFFREQUESTS", operator: "eq" },
                    { field: "AUD_REFID", value: dorid, operator: "eq" }
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
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        tooltip.hide("#type");
                        $("#dayoffrequesttypeinfo").addClass("hidden").html("");
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
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "DAYOFFREQUEST", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            if (data.TYP_CODE !== "YILLIK") {
                                $("div.annualleaveinfo").addClass("hidden");
                                $("#annualleavetotal").val("");
                                $("#annualleaveremaining").val("");
                            }
                            return $.when(GetLeaveDuration(data.TYP_CODE)).done(function () {
                                ShowLeaveDurationInfo();
                                customFieldsHelper.loadCustomFields({
                                    subject: "DAYOFFREQUEST",
                                    source: dorid,
                                    type: data.TYP_CODE
                                });
                            });
                        }
                    }
                });
            });
            $("#btnuser").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#user",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ],
                    callback: function (data) {
                        if (data && $("#type").val() === "YILLIK") {
                            return $.when(GetAnnualLeaveSummary(data.USR_CODE)).done(function () {
                                ShowAnnualLeaveSummary();
                            });
                        }
                    }
                });
            });
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }],
                callback: function (data) {
                    $("#type").val("");
                    tooltip.hide("#type");
                    $("#dayoffrequesttypeinfo").addClass("hidden").html("");
                }
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "DAYOFFREQUEST", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        if (data.TYP_CODE !== "YILLIK") {
                            $("div.annualleaveinfo").addClass("hidden");
                            $("#annualleavetotal").val("");
                            $("#annualleaveremaining").val("");
                        }
                        return $.when(GetLeaveDuration(data.TYP_CODE)).done(function () {
                            ShowLeaveDurationInfo();
                            customFieldsHelper.loadCustomFields({
                                subject: "DAYOFFREQUEST",
                                source: dorid,
                                type: data.TYP_CODE
                            });
                        });
                    }
                }
            });
            $("#user").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_ORG", func: function () { return [$("#org").val(), "*"]; }, operator: "in" },
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ],
                callback: function (data) {
                    if (data && $("#type").val() === "YILLIK") {
                        return $.when(GetAnnualLeaveSummary(data.USR_CODE)).done(function () {
                            ShowAnnualLeaveSummary();
                        });
                    }
                }
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "DAYOFFREQUEST",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    RequestedBy: $("#user").val(),
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
        var Check = function () {
            var startdate = moment($("#startdate").val(), constants.longdateformat);
            var enddate = moment($("#enddate").val(), constants.longdateformat);
            var duration = moment.duration(enddate.diff(startdate)).asDays();
            if (enddate < startdate) {
                msgs.error(applicationstrings[lang].dateerr1);
                return false;
            }

            if (duration > sleaveduration.LDU_TIME) {
                msgs.error(applicationstrings[lang].dayoffrequesttypeinfo + sleaveduration.LDU_TIME +
                    " " + applicationstrings[lang].durationunit.DAY);
                return false;
            }

            return true;
        }
        this.Save = function () {
            if (!tms.Check("#record") || !Check())
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({ subject: "DAYOFFREQUEST", source: dorid, type: $("#type").val() });
            var o = JSON.stringify(
                {
                    DayOffRequest: {
                        DOR_ID: (dorid || 0),
                        DOR_ORGANIZATION: $("#org").val(),
                        DOR_DESC: $("#description").val(),
                        DOR_TYPE: $("#type").val(),
                        DOR_TYPEENTITY: "DAYOFFREQUEST",
                        DOR_STATUSENTITY: "DAYOFFREQUEST",
                        DOR_STATUS: $("#status").val(),
                        DOR_START: ($("#startdate").val()
                            ? moment.utc($("#startdate").val(), constants.longdateformat)
                            : null),
                        DOR_END: ($("#enddate").val()
                            ? moment.utc($("#enddate").val(), constants.longdateformat)
                            : null),
                        DOR_USER: $("#user").val(),
                        DOR_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        DOR_DURATION: parseFloat($("#duration").val()),
                        DOR_CREATED: selectedrecord != null ? selectedrecord.DOR_CREATED : tms.Now(),
                        DOR_CREATEDBY: selectedrecord != null ? selectedrecord.DOR_CREATEDBY : user,
                        DOR_UPDATED: selectedrecord != null ? tms.Now() : null,
                        DOR_UPDATEDBY: selectedrecord != null ? user : null,
                        DOR_RECORDVERSION: selectedrecord != null ? selectedrecord.DOR_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiDayOffRequests/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    dorid = d.r.DayOffRequest.DOR_ID;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (dorid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiDayOffRequests/DelRec",
                            data: JSON.stringify(dorid),
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
            dorid = null;

            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);
            $("#dayoffrequesttypeinfo").addClass("hidden").html("");
            $("div.annualleaveinfo").addClass("hidden");

            $("#dorid").val("");
            $("#org").val("");
            $("#description").val("");
            $("#type").val("");
            $("#startdate").val("");
            $("#enddate").val("");
            $("#duration").val("");
            $("#user").val("");
            $("#approver").val("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#annualleavetotal").val("");
            $("#annualleaveremaining").val("");
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");

            $("#status").addClass("required");
            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            tooltip.hide("#type");
            tooltip.hide("#org");
            tooltip.hide("#user");

            customFieldsHelper.clearCustomFields();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#dorid").val(selectedrecord.DOR_ID);
            $("#org").val(selectedrecord.DOR_ORGANIZATION);
            $("#description").val(selectedrecord.DOR_DESC);
            $("#type").val(selectedrecord.DOR_TYPE);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#startdate").val(selectedrecord.DOR_START ? moment(selectedrecord.DOR_START).format(constants.longdateformat) : "");
            $("#enddate").val(selectedrecord.DOR_END ? moment(selectedrecord.DOR_END).format(constants.longdateformat) : "");
            $("#duration").val(selectedrecord.DOR_DURATION);
            $("#user").val(selectedrecord.DOR_USER);
            $("#approver").val(selectedrecord.DOR_LASTAPPROVER);
            $("#createdby").val(selectedrecord.DOR_CREATEDBY);
            $("#created").val(moment(selectedrecord.DOR_CREATED).format(constants.longdateformat));
            $("#cancellationreason").data("selected", selectedrecord.DOR_CANCELLATIONREASON);

            tooltip.show("#org", selectedrecord.DOR_ORGANIZATIONDESC);
            tooltip.show("#type", selectedrecord.DOR_TYPEDESC);
            tooltip.show("#user", selectedrecord.DOR_USERDESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            LoadCancellationReasons();
            commentsHelper.showCommentsBlock({ subject: "DAYOFFREQUEST", source: selectedrecord.DOR_ID });
            documentsHelper.showDocumentsBlock({ subject: "DAYOFFREQUEST", source: selectedrecord.DOR_ID });
            return $.when(customFieldsHelper.loadCustomFields({
                subject: "DAYOFFREQUEST",
                source: selectedrecord.QUO_ID,
                type: selectedrecord.QUO_TYPE
            })).done(function () {
                return $.when(LoadStatuses({
                    pcode: selectedstatus.STA_PCODE,
                    code: selectedstatus.STA_CODE,
                    text: selectedstatus.STA_DESCF
                })).done(function () {
                    EvaluateCurrentStatus();
                    return $.when(GetLeaveDuration(selectedrecord.DOR_TYPE)).done(function () {
                        ShowLeaveDurationInfo();
                        if (selectedrecord.DOR_TYPE === "YILLIK") {
                            return $.when(GetAnnualLeaveSummary(selectedrecord.DOR_USER)).done(function () {
                                ShowAnnualLeaveSummary();
                            });
                        } else {
                            sleavesummary = null;
                            ShowAnnualLeaveSummary();
                            return $.Deferred().resolve();
                        }
                    });
                });
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiDayOffRequests/Get",
                data: JSON.stringify(dorid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    FillUserInterface();
                    return $.when(GetLeaveDuration(selectedrecord.DOR_TYPE)).done(function () {
                        customFieldsHelper.loadCustomFields({
                            subject: "DAYOFFREQUEST",
                            source: dorid,
                            type: selectedrecord.DOR_TYPE
                        });
                    });
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdDayOffRequests.GetRowDataItem(row);
            dorid = selectedrecord.DOR_ID;
            $(".page-header h6").html(selectedrecord.DOR_ID + " - " + selectedrecord.DOR_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdDayOffRequestsElm.find("[data-id]").on("dblclick", function () { $(".nav-tabs a[href=\"#record\"]").tab("show"); });
            grdDayOffRequestsElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
        };
        var ResetSidebarFilter = function () {
            $("#datestart").val("");
            $("#dateend").val("");
        };
        var GetSidebarFilter = function () {
            var gridfilter = [];

            var datestart = $("#datestart").val().toDate();
            var dateend = $("#dateend").val().toDate();

            if (dateend)
                dateend = moment(dateend, constants.dateformat).add(1, "days");

            if (datestart) {
                gridfilter.push({ field: "DOR_START", value: datestart, operator: "gte", logic: "and" });
            }
            if (dateend) {
                dateend = moment(dateend, constants.dateformat).add(1, "days").format(constants.dateformat);
                gridfilter.push({ field: "DOR_END", value: dateend, operator: "lte", logic: "and" });
            }

            return gridfilter;
        }
        var RunSidebarFilter = function () {
            var gridfilter = GetSidebarFilter();
            grdDayOffRequests.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };
        this.List = function () {
            var gridfilter = GetSidebarFilter();
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            if (grdDayOffRequests) {
                grdDayOffRequests.ClearSelection();
                grdDayOffRequests.RunFilter([]);
            } else {
                grdDayOffRequests = new Grid({
                    keyfield: "DOR_ID",
                    columns: [
                        {
                            type: "number",
                            field: "DOR_ID",
                            title: gridstrings.dayoffrequests[lang].dorid,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "DOR_DESC",
                            title: gridstrings.dayoffrequests[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "DOR_ORGANIZATION",
                            title: gridstrings.dayoffrequests[lang].org,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "DOR_ORGANIZATIONDESC",
                            title: gridstrings.dayoffrequests[lang].orgdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "DOR_TYPE",
                            title: gridstrings.dayoffrequests[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "DOR_STATUS",
                            title: gridstrings.dayoffrequests[lang].status,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "DOR_STATUSDESC",
                            title: gridstrings.dayoffrequests[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "DOR_TYPEDESC",
                            title: gridstrings.dayoffrequests[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "DOR_USER",
                            title: gridstrings.dayoffrequests[lang].user,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "DOR_USERDESC",
                            title: gridstrings.dayoffrequests[lang].userdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "DOR_LASTAPPROVER",
                            title: gridstrings.dayoffrequests[lang].approver,
                            width: 350
                        },
                        {
                            type: "datetime",
                            field: "DOR_START",
                            title: gridstrings.dayoffrequests[lang].startdate,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "DOR_END",
                            title: gridstrings.dayoffrequests[lang].enddate,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        DOR_ID: { type: "number" },
                        DOR_START: { type: "date" },
                        DOR_END: { type: "date" }
                    },
                    datasource: "/Api/ApiDayOffRequests/List",
                    selector: "#grdDayOffRequests",
                    name: "grdDayOffRequests",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "DOR_ID",
                    primarytextfield: "DOR_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "DOR_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"DAYOFFREQUESTs.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
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
                    var activatedTab = e.target.hash; // activated tab
                    switch (activatedTab) {
                        case "#list":
                            selectedrecord = null;
                            dor.List();
                            break;
                        case "#record":
                            $("#btnSave").prop("disabled", false);
                            if (!selectedrecord)
                                dor.ResetUI();
                            else
                                dor.LoadSelected();
                            break;
                        case "#tasks":
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
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

            $("#status").on("change", EvaluateCurrentStatus);
            $("[loadstatusesonchange=\"yes\"]").on("change", function () {
                LoadStatuses({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")
                });
            });
            $("#startdate,#enddate").on("dp.change", function () { CalculateLeaveDuration(); });
            $("#filter").click(function () {
                RunSidebarFilter();
            });
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });

            RegisterTabChange();

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            self.List();
            if (!dorid) {
                $("#btnBrowse").attr("disabled", "disabled");
            }
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
                                dor.Save();
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
                                dor.ResetUI();
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
                                dor.LoadSelected();
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
                                dor.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                dor.HistoryModal();
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
        dor.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());