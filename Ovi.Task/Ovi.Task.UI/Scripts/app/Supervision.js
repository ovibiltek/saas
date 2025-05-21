(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var scr, spv, spr;
    var supervisionid = 0;
    var supervisor;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnPrint", selectionrequired: true }
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
                { id: "#btnPrint", selectionrequired: true }
            ]
        },
        {
            name: "results",
            btns: []
        }
    ];
    spr = new function () {
        var self = this;
        var results = null;
        var CalculateTotalScore = function () {
            var resultsContainer = $("#tblResults tbody");
            var rows = resultsContainer.find("tr");
            var totalscore = 0;
            for (var i = 0; i < rows.length; i++) {
                var score = $(rows[i]).find(".score").text();
                if (score)
                    totalscore += parseInt(score);
            }
            $("#totalscore").text(totalscore);
        }
        var BuildResultsTable = function (d) {
            var resultsContainer = $("#tblResults tbody");
            resultsContainer.find("*").remove();
            var strRow = "";
            for (var i = 0; i < d.data.length; i++) {
                var rline = d.data[i];
                var answers = $.grep(d.answers, function (i) {
                    return i.SVA_QUESTION === rline.SVR_QUESTION;
                });
                var selectedanswer = $.grep(answers, function (i) {
                    return i.SVA_ID === rline.SVR_ANSWER;
                });

                strRow += "<tr data-id=\"" + rline.SVR_ID + "\">";
                strRow += "<td>";
                strRow += (i + 1);
                strRow += "</td>";
                strRow += "<td>";
                strRow += rline.SVR_QUESTIONDESC;
                strRow += "</td>";
                strRow += "<td>";
                strRow += "<select class=\"form-control answer\">";
                strRow += "<option value=\"\">" + applicationstrings[lang].pleaseselect + "</option>";
                for (var j = 0; j < answers.length; j++) {
                    var selected = (rline.SVR_ANSWER === answers[j].SVA_ID ? "selected=\"selected\"" : "");
                    strRow += "<option " + selected + " data-score=\"" + answers[j].SVA_SCORE + "\" value=\"" + answers[j].SVA_ID + "\">" + answers[j].SVA_ANSWER + "</option>";
                }
                strRow += "</select>";
                strRow += "</td>";
                strRow += "<td class=\"score\">";
                if (selectedanswer.length > 0) {
                    strRow += selectedanswer[0].SVA_SCORE;
                }
                strRow += "</td>";
                strRow += "<td>";
                strRow += "<input class=\"form-control note\" value=\"" + (rline.SVR_NOTE || "") + "\"></input>";
                strRow += "</td>";
                strRow += "<td>";
                strRow += (rline.SVR_UPDATED ? moment(rline.SVR_UPDATED).format(constants.longdateformat) : "");
                strRow += "</td>";
                strRow += "<td>";
                strRow += (rline.SVR_UPDATEDBY || "");
                strRow += "</td>";
                strRow += "</tr>";
            }

            resultsContainer.append(strRow);
            CalculateTotalScore();
            resultsContainer.find("select.answer").on("change", function () {
                var $this = $(this);
                var row = $this.closest("tr[data-id]");
                var v = $this.find("option:selected").data("score");
                row.find(".score").text(v != null ? v : "");
                CalculateTotalScore();
            });
        }
        this.ListResults = function () {
            var gridreq = {
                sort: [{ field: "SVR_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "SVR_SUPERVISION", value: supervisionid, operator: "eq" },
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiSupervisionResults/ListResults",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    results = d.data;
                    $("#btnSaveResults").prop("disabled", selectedrecord.SPV_PSTATUS === "C");
                    BuildResultsTable(d);
                }
            });
        }
        this.Save = function () {
            var resultsarr = [];
            var resultsContainer = $("#tblResults tbody");
            var rows = resultsContainer.find("tr");
            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]);
                var resultid = row.data("id");
                var result = $.grep(results, function (e) { return e.SVR_ID === parseInt(resultid); })[0];
                result.SVR_ANSWER = (row.find("select.answer").val() || null);
                result.SVR_NOTE = (row.find("input.note").val() || null);
                result.SVR_UPDATED = tms.Now();
                result.SVR_UPDATEDBY = user;
                resultsarr.push(result);
            }
            return tms.Ajax({
                url: "/Api/ApiSupervisionResults/SaveList",
                data: JSON.stringify(resultsarr),
                fn: function (d) {
                    msgs.success(d.data);
                    return self.ListResults();
                }
            });
        }
        var RegisterTabEvents = function () {
            $("#btnSaveResults").on("click", self.Save);
        }
        RegisterTabEvents();
    }

    spv = new function () {
        var self = this;
        var grdSupervision = null;
        var grdSupervisionElm = $("#grdSupervision");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var LoadTaskActivities;

        var GetFilter = function () {
            var gridfilter = [];
           
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            var path = tms.Path();
            if (path.Action === "ListByTask" && path.Param1) {
                gridfilter.push({ IsPersistent: true, value: path.Param1, field: "SPV_TASK", operator: "eq" });
            }

            var datecreatedstart = $("#datecreated_start").val().toDate();
            var datecreatedend = $("#datecreated_end").val().toDate();
            if (datecreatedstart && datecreatedend)
                gridfilter.push({ field: "SPV_CREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });

            return gridfilter;
        };
        function ResetSidebarFilter() {
            $("#listfilterquoid").val("");
            $("#listfiltereqid").val("");
            $("#listfiltertaskid").val("");
        };
        function RunSidebarFilter() {
            var gridfilter = GetFilter();
            grdSupervision.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMSUPERVISION", operator: "eq" },
                    { field: "AUD_REFID", value: supervisionid, operator: "eq" }
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
                    callback: function (d) {
                        if (d) {
                            $("#type").val("");
                            $("#requestedby").val("");
                            $("#task").val("");
                            $("#customer").val("");
                            $("#branch").val("");
                            $("#supervisor").val("");

                            tooltip.hide("#type");
                            tooltip.hide("#customer");
                            tooltip.hide("#branch");
                            tooltip.hide("#task");
                            tooltip.hide("#supervisor");
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
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "SUPERVISION", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "SUPERVISION",
                                source: supervisionid,
                                type: data.TYP_CODE
                            });
                        }
                    }
                });
            });
            $("#btncustomer").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.customer[lang].title,
                    listurl: "/Api/ApiCustomers/List",
                    keyfield: "CUS_CODE",
                    codefield: "CUS_CODE",
                    textfield: "CUS_DESC",
                    returninput: "#customer",
                    columns: [
                        { type: "string", field: "CUS_CODE", title: gridstrings.customer[lang].code, width: 100 },
                        { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" },
                    ],
                    callback: function (d) {
                        $("#branch").val("");
                        tooltip.hide("#branch");
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
                    fields: { TSK_ID: { type: "number" } },
                    callback: function (t) {
                        if (t) {
                            $("#customer").val(t.TSK_CUSTOMER);
                            $("#branch").val(t.TSK_BRANCH);
                            $("#category").val(t.TSK_CATEGORY);
                            tooltip.show("#customer", t.TSK_CUSTOMERDESC);
                            tooltip.show("#branch", t.TSK_BRANCHDESC);
                            tooltip.show("#category", t.TSK_CATEGORYDESC);

                            LoadTaskActivities(t.TSK_ID);
                        } else {
                            $("#activity").val("");
                            $("#activity option:not(.default)").remove();
                            $("#customer").val("");
                            $("#branch").val("");
                            $("#category").val("");

                            tooltip.hide("#customer");
                            tooltip.hide("#branch");
                            tooltip.hide("#category");
                        }
                    }
                });
            });
            $("#btnbranch").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.branches[lang].title,
                    listurl: "/Api/ApiBranches/List",
                    keyfield: "BRN_CODE",
                    codefield: "BRN_CODE",
                    textfield: "BRN_DESC",
                    returninput: "#branch",
                    columns: [
                        { type: "string", field: "BRN_CODE", title: gridstrings.branches[lang].code, width: 100 },
                        { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 400 },
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                    ]
                });
            });
            $("#btncategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESC",
                    returninput: "#category",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESC", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CAT_ACTIVE", value: "+", operator: "eq" },
                        { field: "CAT_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnrequestedby").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#requestedby",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: $("#org").val(), operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                });
            });
            $("#btnsupervisor").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#supervisor",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: $("#org").val(), operator: "eq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
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
                filter: [
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d) {
                        $("#type").val("");
                        $("#requestedby").val("");
                        $("#task").val("");
                        $("#customer").val("");
                        $("#branch").val("");
                        $("#supervisor").val("");

                        tooltip.hide("#type");
                        tooltip.hide("#customer");
                        tooltip.hide("#branch");
                        tooltip.hide("#task");
                        tooltip.hide("#supervisor");
                    }
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
                    { field: "TYP_ENTITY", value: "SUPERVISION", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "SUPERVISION",
                            source: supervisionid,
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [
                    { field: "CUS_ORG", relfield: "#org", includeall: true }
                ],
                callback: function (d) {
                    $("#branch").val("");
                    tooltip.hide("#branch");
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
                ],
                callback: function (t) {
                    if (t) {
                        $("#customer").val(t.TSK_CUSTOMER);
                        $("#branch").val(t.TSK_BRANCH);
                        $("#category").val(t.TSK_CATEGORY);
                        tooltip.show("#customer", t.TSK_CUSTOMERDESC);
                        tooltip.show("#branch", t.TSK_BRANCHDESC);
                        tooltip.show("#category", t.TSK_CATEGORYDESC);

                        LoadTaskActivities(t.TSK_ID);
                    } else {
                        $("#activity").val("");
                        $("#activity option:not(.default)").remove();
                        $("#customer").val("");
                        $("#branch").val("");
                        $("#category").val("");

                        tooltip.hide("#customer");
                        tooltip.hide("#branch");
                        tooltip.hide("#category");
                    }
                }
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                filter: [
                    { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                    { field: "BRN_ORG", relfield: "#org", includeall: true },
                    { field: "BRN_CUSTOMER", relfield: "#customer" }
                ]
            });
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESC",
                filter: [
                    { field: "CAT_ACTIVE", value: "+", operator: "eq" },
                    { field: "CAT_CODE", value: "*", operator: "neq" }
                ]
            });
            $("#requestedby").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                filter: [
                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                    { field: "USR_ORG", value: $("#org").val(), operator: "eq" }
                ]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "SUPERVISION",
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
                            { field: "CNR_ENTITY", value: "SUPERVISION", operator: "eq" },
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
                        { field: "CNR_ENTITY", value: "SUPERVISION", operator: "eq" }
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
        LoadTaskActivities = function (taskid) {
            var gridreq = {
                sort: [{ field: "TSA_LINE", dir: "asc" }],
                filter: {
                    filters: [{ field: "TSA_TASK", value: taskid, operator: "eq" }]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivities/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#activity option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].TSA_LINE +
                            "\"" +
                            //(d.data[i].TSA_COMPLETED === "+" ? " disabled=\"disabled\"" : "") +
                            ">" +
                            d.data[i].TSA_LINE +
                            " - " +
                            d.data[i].TSA_DESC +
                            "</option>";
                    }
                    var ctrlactivity = $("#activity");
                    ctrlactivity.append(strOptions);
                    ctrlactivity.val($("#activity").data("selected"));
                    ctrlactivity.prop("disabled", false);
                }
            });
        };
        this.Print = function () {
            $("#modalprint").modal("show");
        }
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "SUPERVISION",
                source: supervisionid
            });
            var o = JSON.stringify(
                {
                    Supervision: {
                        SPV_ID: (supervisionid || 0),
                        SPV_ORG: $("#org").val(),
                        SPV_TYPEENTITY: "SUPERVISION",
                        SPV_TYPE: $("#type").val(),
                        SPV_DESC: $("#description").val(),
                        SPV_REQUESTEDBY: $("#requestedby").val(),
                        SPV_STATUSENTITY: "SUPERVISION",
                        SPV_STATUS: $("#status").val(),
                        SPV_SUPERVISOR: ($("#supervisor").val() || null),
                        SPV_TASK: ($("#task").val() || null),
                        SPV_ACTIVITY: ($("#activity").val() || $("#activity").data("selected")),
                        SPV_BRANCH: ($("#branch").val() || null),
                        SPV_CUSTOMER: ($("#customer").val() || null),
                        SPV_CATEGORY: ($("#category").val() || null),
                        SPV_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        SPV_CREATED: selectedrecord != null ? selectedrecord.SPV_CREATED : tms.Now(),
                        SPV_CREATEDBY: selectedrecord != null ? selectedrecord.SPV_CREATEDBY : user,
                        SPV_UPDATED: selectedrecord != null ? tms.Now() : null,
                        SPV_UPDATEDBY: selectedrecord != null ? user : null,
                        SPV_RECORDVERSION: selectedrecord != null ? selectedrecord.SPV_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiSupervision/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    supervisionid = d.r.Supervision.SPV_ID;
                    $("#Supervision").val(supervisionid);
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (supervisionid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiSupervision/DelRec",
                            data: JSON.stringify(supervisionid),
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
            supervisionid = null;
            selectedstatus = null;
            supervisor = null;

            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);

            $("#supervisionid").val("");
            $("#description").val("");
            $("#org").val("");
            $("#type").val("");
            $("#requestedby").val("");
            $("#task").val("");
            $("#customer").val("");
            $("#branch").val("");
            $("#category").val("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");
            $("#supervisor").tagsinput("removeAll");
            $("#activity option:not(.default)").remove();
            $("#activity").val("").data("selected", null);

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            tooltip.hide("#org");
            tooltip.hide("#type");
            tooltip.hide("#customer");
            tooltip.hide("#branch");
            tooltip.hide("#task");
            tooltip.hide("#category");

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

            $("#supervisionid").val(selectedrecord.SPV_ID);
            $("#description").val(selectedrecord.SPV_DESC);
            $("#org").val(selectedrecord.SPV_ORG);
            $("#type").val(selectedrecord.SPV_TYPE);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#requestedby").val(selectedrecord.SPV_REQUESTEDBY);
            $("#task").val(selectedrecord.SPV_TASK);
            $("#customer").val(selectedrecord.SPV_CUSTOMER);
            $("#branch").val(selectedrecord.SPV_BRANCH);
            $("#category").val(selectedrecord.SPV_CATEGORY);
            $("#created").val(moment(selectedrecord.SPV_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.SPV_CREATEDBY);
            $("#cancellationreason").data("selected", selectedrecord.SPV_CANCELLATIONREASON);
            $("#activity").data("selected", selectedrecord.SPV_ACTIVITY);

            tooltip.show("#org", selectedrecord.SPV_ORGDESC);
            tooltip.show("#type", selectedrecord.SPV_TYPEDESC);
            tooltip.show("#customer", selectedrecord.SPV_CUSTOMERDESC);
            tooltip.show("#branch", selectedrecord.SPV_BRANCHDESC);
            tooltip.show("#task", selectedrecord.SPV_TASKSHORTDESC);
            tooltip.show("#category", selectedrecord.SPV_CATEGORYDESC);

            $("#supervisor").tagsinput("removeAll");
            if (supervisor && supervisor.length > 0) {
                for (var i = 0; i < supervisor.length; i++) {
                    var sv = supervisor[i];
                    $("#supervisor").tagsinput("add", { id: sv.USR_CODE, text: sv.USR_DESC }, ["ignore"]);
                }
            }

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            if (selectedrecord.SPV_TASK) {
                LoadTaskActivities(selectedrecord.SPV_TASK);
            }
            LoadCancellationReasons();
            commentsHelper.showCommentsBlock({ subject: "SUPERVISION", source: selectedrecord.SPV_ID });
            documentsHelper.showDocumentsBlock({ subject: "SUPERVISION", source: selectedrecord.SPV_ID });;
            return $.when(customFieldsHelper.loadCustomFields({
                subject: "SUPERVISION",
                source: selectedrecord.SPV_ID,
                type: selectedrecord.SPV_TYPE
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
                url: "/Api/ApiSupervision/Get",
                data: JSON.stringify(supervisionid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    supervisor = d.supervisor;
                    if (!dataonly) {
                        FillUserInterface();
                        customFieldsHelper.loadCustomFields({
                            subject: "SUPERVISION",
                            source: supervisionid,
                            type: $("#type").val()
                        });
                    }
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdSupervision.GetRowDataItem(row);
            supervisionid = selectedrecord.SPV_ID;
            $("#Supervision").val(selectedrecord.SPV_ID);
            $(".page-header h6").html(selectedrecord.SPV_ID + " - " + selectedrecord.SPV_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdSupervisionElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
            grdSupervisionElm.find("[data-id]").on("dblclick",
                function () {
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
                });
        };
        this.List = function () {
            var gridfilter = GetFilter();


            if (grdSupervision) {
                grdSupervision.ClearSelection();
                grdSupervision.RunFilter(gridfilter);
            } else {
                grdSupervision = new Grid({
                    keyfield: "SPV_ID",
                    columns: [
                        {
                            type: "number",
                            field: "SPV_ID",
                            title: gridstrings.supervision[lang].supervisionid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_DESC",
                            title: gridstrings.supervision[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "SPV_ORG",
                            title: gridstrings.supervision[lang].organization,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_ORGDESC",
                            title: gridstrings.supervision[lang].organizationdesc,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_TYPE",
                            title: gridstrings.supervision[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_TYPEDESC",
                            title: gridstrings.supervision[lang].typedesc,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_STATUS",
                            title: gridstrings.supervision[lang].status,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SPV_STATUSDESC",
                            title: gridstrings.supervision[lang].statusdesc,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_REQUESTEDBY",
                            title: gridstrings.supervision[lang].requestedby,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SPV_TASK",
                            title: gridstrings.supervision[lang].task,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SPV_TASKSHORTDESC",
                            title: gridstrings.supervision[lang].taskshortdesc,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_TASKTYPE",
                            title: gridstrings.supervision[lang].tasktype,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_REGION",
                            title: gridstrings.supervision[lang].region,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_SUPPLIER",
                            title: gridstrings.supervision[lang].supplier,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_TRADE",
                            title: gridstrings.supervision[lang].trade,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SPV_SCORE",
                            title: gridstrings.supervision[lang].score,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_CUSTOMER",
                            title: gridstrings.supervision[lang].customer,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_CUSTOMERDESC",
                            title: gridstrings.supervision[lang].customerdesc,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_CUSTOMERGROUP",
                            title: gridstrings.supervision[lang].customergroup,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_BRANCH",
                            title: gridstrings.supervision[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SPV_BRANCHDESC",
                            title: gridstrings.supervision[lang].branchdesc,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "SPV_CATEGORY",
                            title: gridstrings.supervision[lang].category,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_CATEGORYDESC",
                            title: gridstrings.supervision[lang].categorydesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_SUPERVISOR",
                            title: gridstrings.supervision[lang].supervisor,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "SPV_CREATEDBY",
                            title: gridstrings.supervision[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SPV_CREATED",
                            title: gridstrings.supervision[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPV_UPDATEDBY",
                            title: gridstrings.supervision[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SPV_UPDATED",
                            title: gridstrings.supervision[lang].updated,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        SPV_ID: { type: "number" },
                        SPV_TASK: { type: "number" },
                        SPV_SCORE: { type: "number" },
                        SPV_CREATED: { type: "date" },
                        SPV_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiSupervision/ListView",
                    selector: "#grdSupervision",
                    name: "grdSupervision",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "SPV_ID",
                    primarytextfield: "SPV_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "SPV_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"supervision.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
                            if ($.inArray(path.Action, ["ListByTask", "Index"]) === -1 &&
                                window.history &&
                                window.history.pushState)
                                window.history.pushState("forward", null, "/Supervision/Index#no-back");
                            spv.ResetUI();
                            spv.List();
                            break;
                        case "#record":
                            $("#btnSave").prop("disabled", false);
                            if (!selectedrecord)
                                spv.ResetUI();
                            else
                                spv.LoadSelected();
                            break;
                        case "#results":
                            spr.ListResults();
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
            $("#filter").click(function () {
                RunSidebarFilter();
            });
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });
            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });


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

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });
            commentsHelper =
                new comments({ input: "#comment", btnaddcomment: "#addComment", commentsdiv: "#comments" });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            BuildModals();
            AutoComplete();
        };
        var NewSupervisionByTask = function (tskid) {
            return $.when(tms.Ajax({ url: "/Api/ApiTask/Get", data: JSON.stringify(tskid) })).done(function (d) {
                var tsk = d.data;
                $("#org").val(tsk.TSK_ORGANIZATION);
                $("#description").val(tsk.TSK_SHORTDESC);
                $("#task").val(tsk.TSK_ID);
                $("#customer").val(tsk.TSK_CUSTOMER);
                $("#branch").val(tsk.TSK_BRANCH);
                $("#category").val(tsk.TSK_CATEGORY);
                $("#requestedby").val(user);

                tooltip.show("#org", tsk.TSK_ORGANIZATIONDESC);
                tooltip.show("#task", tsk.TSK_SHORTDESC);
                tooltip.show("#customer", tsk.TSK_CUSTOMERDESC);
                tooltip.show("#branch", tsk.TSK_BRANCHDESC);
                tooltip.show("#category", tsk.TSK_CATEGORYDESC);
                tooltip.show("#requestedby", userdesc);
            });
        }
        var NewSupervisionByTaskRating = function (tskid) {

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");

            LoadStatusesForRating({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")

                });

           return $.when(tms.Ajax({ url: "/Api/ApiTask/Get", data: JSON.stringify(tskid) })).done(function (d) {
                var tsk = d.data;
                $("#org").val(tsk.TSK_ORGANIZATION);
                $("#description").val("");
                $("#task").val(tsk.TSK_ID);
                $("#type").val("PUANLAMA");
                $("#customer").val(tsk.TSK_CUSTOMER);
                $("#branch").val(tsk.TSK_BRANCH);
                $("#category").val(tsk.TSK_CATEGORY);
                $("#requestedby").val(user);

                tooltip.show("#org", tsk.TSK_ORGANIZATIONDESC);
                tooltip.show("#type", tsk.TSK_TYPEDESC);
                tooltip.show("#task", tsk.TSK_SHORTDESC);
                tooltip.show("#customer", tsk.TSK_CUSTOMERDESC);
                tooltip.show("#branch", tsk.TSK_BRANCHDESC);
                tooltip.show("#category", tsk.TSK_CATEGORYDESC);
                tooltip.show("#requestedby", userdesc);
            });
        }
        var LoadStatusesForRating = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "SUPERVISION",
                    Fromcode: status.code,
                    Typ: "PUANLAMA",
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

        this.BuildUI = function () {
            RegisterTabEvents();

            var path = tms.Path();
            if (path.Action === "NewByTask" && path.Param1) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                NewSupervisionByTask(path.Param1);
            }

            path = tms.Path();
            if (path.Action === "NewByTaskRating" && path.Param1) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                NewSupervisionByTaskRating(path.Param1);
            }
          
            self.List();
            if (!selectedrecord)
                $("#btnBrowse").attr("disabled", "disabled");
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
                            case "results":
                                return "#btnSaveResults";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                spv.Save();
                                break;
                            case "results":
                                spr.Save();
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
                                spv.ResetUI();
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
                                spv.LoadSelected();
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
                                spv.Delete();
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
        spv.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());