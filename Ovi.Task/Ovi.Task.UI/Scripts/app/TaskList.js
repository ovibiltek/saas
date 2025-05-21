(function () {
    var grdTasks = null;
    var grdelm = $("#grdTasks");
    var commentsHelper;
    var documentsHelper;

    function loadPriorities() {
        var priorities = $("#priorities");
        var gridreq = {
            sort: [{ field: "PRI_CODE", dir: "desc" }],
            filter: {
                filters: [
                    { field: "PRI_ORGANIZATION", value: [organization, "*"], operator: "in" },
                    { field: "PRI_ACTIVE", value: "+", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiPriorities/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"styled\" type=\"checkbox\" value=\"" +
                        d.data[i].PRI_CODE +
                        "\"><label><span>" +
                        d.data[i].PRI_DESCF +
                        "</span></label></div>";
                }
                priorities.find("*").remove();
                priorities.append(strOptions);
            }
        });
    }

    function loadStatuses() {
        var gridreq = {
            sort: [{ field: "STA_DESCF", dir: "asc" }],
            filter: {
                filters: [
                    { field: "STA_SHOWONSEARCH", value: "+", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiStatuses/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var statusesctrl = $("#statuses");
                let selectedOptions = statusesctrl.multipleSelect("getSelects");
                statusesctrl.find("option").remove();
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                        d.data[i].STA_CODE +
                        "\">" +
                        d.data[i].STA_DESCF +
                        "</option>";
                }
               
                statusesctrl.append(strOptions);
                statusesctrl.multipleSelect("refresh");
                statusesctrl.multipleSelect("setSelects", selectedOptions);
            }
        });
    }

    var LoadAllStatuses = function () {
        var gridreq = {
            sort: [{ field: "STA_DESC", dir: "asc" }],
            filter: {
                filters: [
                    { field: "STA_ENTITY", value: "TASK", operator: "eq" },
                    { field: "STA_CODE", value: "-", operator: "neq" }
                ]
            },
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiStatuses/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var statusctrl = $("#statuschange");
                var strOption = "";
                statusctrl.find("option:not(.default)").remove();
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    strOption += "<option data-pcode=\"" +
                        di.STA_PCODE +
                        "\" value=\"" +
                        di.STA_CODE +
                        "\">" +
                        di.STA_DESCF +
                        "</option>";
                }
                statusctrl.append(strOption);
            }
        });
    };

    function loadCategories() {
        var gridreq = {
            sort: [{ field: "CAT_DESC", dir: "asc" }],
            filter: {
                filters: [
                    { field: "CAT_ACTIVE", value: "+", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiCategories/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var categoriesctrl = $("#categories");
                let selectedOptions = categoriesctrl.multipleSelect("getSelects");
                categoriesctrl.find("option").remove();
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions += "<option value=\"" +
                        d.data[i].CAT_CODE +
                        "\">" +
                        d.data[i].CAT_DESC +
                        "</option>";
                }

                categoriesctrl.append(strOptions);
                categoriesctrl.multipleSelect("refresh");
                categoriesctrl.multipleSelect("setSelects", selectedOptions);
            }
        });
    }

    function loadTaskTypes() {
        var gridreq = {
            sort: [{ field: "SYC_CODE", dir: "asc" }],
            filter: {
                filters: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiSystemCodes/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var tasktypesctrl = $("#tasktypes");
                let selectedOptions = tasktypesctrl.multipleSelect("getSelects");
                tasktypesctrl.find("option").remove();
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions += "<option value=\"" +
                        d.data[i].SYC_CODE +
                        "\">" +
                        d.data[i].SYC_DESCRIPTION +
                        "</option>";
                }

                tasktypesctrl.append(strOptions);
                tasktypesctrl.multipleSelect("refresh");
                tasktypesctrl.multipleSelect("setSelects", selectedOptions);
            }
        });
    }

    function itemSelect(row) {
        var selectedrecord = grdTasks.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $(".page-header h6").html(selectedrecord.TSK_ID + " - " + selectedrecord.TSK_SHORTDESC);
    }

    var CheckSelectedTaskRows = function () {
        var selectedRows = grdTasks.GetSelected();
        var statusArr = [];
        for (var i = 0; i < selectedRows.length; i++) {
            var selrow = grdTasks.GetRowDataItem(selectedRows[i]);
            statusArr.pushUnique(selrow.TSK_STATUS);
        }
        return (statusArr.length === 1);

    }

    function gridDataBound() {
        grdelm.find("input.rating").rating("create", {
            showClear: false,
            showCaption: false,
            size: "xs",
            displayOnly: !customer,
            clearCaption: ""
        });

        grdelm.find("input.rating-input").on("rating:change", function (event, value, caption) {
            $(this).rating("clear");
            $("#ratingcomments").val("");
            $("#modalrating").data("id",$(this).data("id"));
            $("#modalrating").modal("show");
            $("#taskrating").rating("update", value);
        });

        grdelm.find("[data-id]").unbind("click").click(function () {
            var row = $(this).closest("tr[data-id]");
            itemSelect(row);
        });

        grdelm.find("[data-id]").unbind("dblclick").dblclick(function () {
            window.location = "/Task/Record/" + $(this).data("id");
        });

        grdelm.find(".btn-comments").unbind("click").click(function () {
            var id = $(this).closest("[data-id]").data("id");
            commentsHelper.showCommentsModal({
                subject: "TASK",
                source: id
            });
        });

        grdelm.contextMenu({
            selector: "div.k-grid-content tr",
            items: {
                task: {
                    name: applicationstrings[lang].newtab,
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html('<span><i class="fa fa-external-link" aria-hidden="true"></i> ' + item.name + "</span>");
                        return "context-menu-icon-updated";
                    },
                    callback: function () {
                        var id = $(this).closest("[data-id]").data("id");
                        var win = window.open("/Task/Record/" + id, "_blank");
                    }
                },
                quotation: {
                    name: applicationstrings[lang].quotations,
                    disabled: function (key, opt) {
                        var row = $(this).closest("[data-id]");
                        return row.data("hasquotation") == "-";
                    },
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html('<span><i class="fa fa-usd" aria-hidden="true"></i> ' + item.name + "</span>");
                        return "context-menu-icon-updated";
                    },
                    visible: function (key, opt) {
                        return !customer;
                    },
                    callback: function () {
                        var id = $(this).closest("[data-id]").data("id");
                        var win = window.open("/Quotations/ListByTask/" + id, "_blank");
                    }
                },
                supervision: {
                    name: applicationstrings[lang].supervisions,
                    disabled: function (key, opt) {
                        var row = $(this).closest("[data-id]");
                        return row.data("hassupervision") == "-";
                    },
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html('<span><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ' + item.name + "</span>");
                        return "context-menu-icon-updated";
                    },
                    visible: function (key, opt) {
                        return !customer;
                    },
                    callback: function () {
                        var id = $(this).closest("[data-id]").data("id");
                        var win = window.open("/Supervision/ListByTask/" + id, "_blank");
                    }
                },
                statuschange: {
                    name: applicationstrings[lang].statuschange,
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html('<span><i class="fa fa-flag" aria-hidden="true"></i> ' + item.name + "</span>");
                        return "context-menu-icon-updated";
                    },
                    callback: function () {
                        if (!CheckSelectedTaskRows()) {
                            msgs.error(applicationstrings[lang].taskselectionerror);
                            return false;
                        } else {
                            $.when(LoadAllStatuses()).done(function () {
                                $("#modalstatuschange").modal("show");
                            });
                        }
                    }
                }
            }
        });

        grdelm.find(".btn-docs").unbind("click").click(function () {
            var id = $(this).closest("[data-id]").data("id");
            documentsHelper.showDocumentsModal({
                subject: "TASK",
                source: id
            });
        });

        grdelm.find("#search").off("click").on("click", function () {
            $.when(loadPriorities(), loadStatuses(), loadTaskTypes(), loadCategories()).done(function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
        });

        grdelm.find(".btn-contactinfo").off("click").on("click", function () {
            var id = $(this).closest("[data-id]").data("id");
            return tms.Ajax({
                url: "/Api/ApiTask/GetTaskContactInfo",
                data: JSON.stringify(id),
                fn: function (d) {
                    let contactinfo = d.data;
                    let modalbody = "";

                    let adr = $.grep(contactinfo, function (e) {
                        return e.CON_TYPE === "ADR"
                    });
                    let pm = $.grep(contactinfo, function (e) {
                        return e.CON_TYPE === "PM"
                    });
                    let reg = $.grep(contactinfo, function (e) {
                        return e.CON_TYPE === "REG"
                    });
                    let sup = $.grep(contactinfo, function (e) {
                        return e.CON_TYPE === "SUP"
                    });


                    if (pm.length > 0) {
                        modalbody += "<strong>" + applicationstrings[lang].cuspm + "</strong> <br/>";
                        modalbody += (pm[0].CON_DESCRIPTION || "") + "<br/>";
                        modalbody += (("<a href=\"mailto:" + pm[0].CON_EMAIL + "\">" + pm[0].CON_EMAIL + "</a>") || "") + "<br/>"
                        modalbody += (pm[0].CON_PHONE || "") + "<br/>"
                    }

                    if (reg.length > 0) {
                        modalbody += "<hr />";
                        modalbody += "<strong>" + applicationstrings[lang].regresp + "</strong> <br/>";
                        for (var i = 0; i < reg.length; i++) {
                            if (i % 2 == 0) {
                                modalbody += "<div class=\"row\">";
                            }
                            modalbody += "<div class=\"col-md-6\">";
                            modalbody += (reg[i].CON_DESCRIPTION || "") + "<br/>";
                            modalbody += (("<a href=\"mailto:" + reg[i].CON_EMAIL + "\">" + reg[i].CON_EMAIL + "</a>") || "") + "<br/>"
                            modalbody += (reg[i].CON_PHONE || "");
                            modalbody += "</div>";
                            if (i % 2 != 0 || i == reg.length - 1) {
                                modalbody += "</div>";
                            }
                        } 
                    }

                    if (sup.length > 0) {
                        modalbody += "<hr />";
                        modalbody += "<strong>" + applicationstrings[lang].supplier + "</strong> <br/>";
                        for (var i = 0; i < sup.length; i++) {
                            if (i % 2 == 0) {
                                modalbody += "<div class=\"row\">";
                            }
                            modalbody += "<div class=\"col-md-6\">";
                            modalbody += (sup[i].CON_DESCRIPTION || "") + "<br/>";
                            modalbody += (("<a href=\"mailto:" + sup[i].CON_EMAIL + "\">" + sup[i].CON_EMAIL + "</a>") || "") + "<br/>"
                            modalbody += (sup[i].CON_PHONE || "");
                            modalbody += "</div>";

                            if (i % 2 != 0 || i == sup.length - 1) {
                                modalbody += "</div>";
                            }
                        }
                    }

                    if (adr.length > 0) {
                        modalbody += "<hr />";
                        modalbody += "<strong>" + applicationstrings[lang].address + "</strong> <br>";
                        modalbody += (adr[0].CON_ADDRESS || "");
                    }

                    $("#modaltaskcontactinfo .modal-body").html(modalbody);
                   
                    let contactmodal = $("#modaltaskcontactinfo").modal();
                    contactmodal.show();
                }
            });
        });
    }

    function getGridColumns() {
        var columns = [
            {
                type: "na",
                field: "ACTIONS",
                title: gridstrings.tasklist[lang].actions,
                template: "<div style=\"text-align:center;\">" +
                    "<button type=\"button\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(TSK_CMNTCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSK_CMNTCOUNT #</span></button> " +
                    "<button type=\"button\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(TSK_DOCCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSK_DOCCOUNT # </span></button> " +
                    "<button type=\"button\" title=\"#= applicationstrings[lang].contactinfo #\" class=\"btn btn-default btn-sm btn-contactinfo\" data-branch=\"#=TSK_BRANCH#\"><i class=\"fa fa-phone\"></i></button></div>",

                filterable: false,
                sortable: false,
                width: 150
            },
            {
                type: "na",
                field: "RATING",
                title: gridstrings.tasklist[lang].rating,
                template: "<div style=\"text-align:center;\">" +
                    "<input id=\"rating-#= TSK_ID#\" data-id=\"#= TSK_ID#\" type=\"number\" class=\"rating\" data-min=\"0\" data-max=\"5\" data-step=\"1\" value=\"#= TSK_RATING#\" #= TSK_RATING != null || (TSK_STATUSP !== 'C' && TSK_STATUS !== 'TAM')  ? \"disabled\" : \"\" #></input>" +
                    "</div>",
                filterable: false,
                sortable: false,
                width: 150
            },
            {
                type: "na",
                field: "PRIORITY",
                title: "#",
                template:
                    "<div class=\"priority\" title=\"#= TSK_PRIORITYDESC #\" style=\"color:white;background-color:#= TSK_PRIORITYCOLOR #\"><i class=\"#= TSK_PRIORITYCSS #\"></i></div>",
                filterable: false,
                sortable: false,
                width: 40
            },
            {
                type: "number",
                field: "TSK_ID",
                title: gridstrings.tasklist[lang].taskno,
                template: "<a href=\"/Task/Record/#= TSK_ID #\" target=\"_blank\">#= TSK_ID #</a>",
                width: 150
            },
            {
                type: "string",
                field: "TSK_SHORTDESC",
                title: gridstrings.tasklist[lang].description,
                width: 300
            },
            {
                type: "string",
                field: "TSK_NOTE",
                title: gridstrings.tasklist[lang].detail,
                width: 300
            },
            {
                type: "string",
                field: "TSK_STATUS",
                title: gridstrings.tasklist[lang].status,
                width: 130
            },
            {
                type: "x",
                field: "TSK_STATUSDESC",
                title: gridstrings.tasklist[lang].statusdesc,
                width: 150,
                template: "<span class=\" #= TSK_STATUSCSS #\">#= TSK_STATUSDESC #</span>"
            },
            {
                type: "string",
                field: "TSK_HOLDREASON",
                title: gridstrings.tasklist[lang].holdreason,
                width: 130
            },
            {
                type: "string",
                field: "TSK_HOLDREASONDESC",
                title: gridstrings.tasklist[lang].holdreasondesc,
                width: 250
            },
            {
                type: "datetime",
                field: "TSK_HOLDDATE",
                title: gridstrings.tasklist[lang].holddate,
                width: 150
            },
            {
                type: "string",
                field: "TSK_CUSTOMER",
                title: gridstrings.tasklist[lang].customer,
                width: 130
            },
            {
                type: "string",
                field: "TSK_CUSTOMERDESC",
                title: gridstrings.tasklist[lang].customerdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_BRANCH",
                title: gridstrings.tasklist[lang].branch,
                width: 130
            },
            {
                type: "string",
                field: "TSK_BRANCHDESC",
                title: gridstrings.tasklist[lang].branchdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_BRANCHREFERENCE",
                title: gridstrings.tasklist[lang].branchreference,
                width: 250
            },
            {
                type: "string",
                field: "TSK_LOCATION",
                title: gridstrings.tasklist[lang].location,
                width: 130
            },
            {
                type: "string",
                field: "TSK_LOCATIONDESC",
                title: gridstrings.tasklist[lang].locationdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_PROVINCE",
                title: gridstrings.tasklist[lang].province,
                width: 250
            },
            {
                type: "string",
                field: "TSK_EQUIPMENTCODE",
                title: gridstrings.tasklist[lang].equipment,
                width: 130
            },
            {
                type: "string",
                field: "TSK_EQUIPMENTDESC",
                title: gridstrings.tasklist[lang].equipmentdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CATEGORY",
                title: gridstrings.tasklist[lang].category,
                width: 130
            },
            {
                type: "string",
                field: "TSK_CATEGORYDESC",
                title: gridstrings.tasklist[lang].categorydesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_TASKTYPE",
                title: gridstrings.tasklist[lang].tasktype,
                width: 130
            },
            {
                type: "string",
                field: "TSK_TASKTYPEDESC",
                title: gridstrings.tasklist[lang].tasktypedesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_TYPE",
                title: gridstrings.tasklist[lang].type,
                width: 130
            },
            {
                type: "string",
                field: "TSK_TYPEDESC",
                title: gridstrings.tasklist[lang].typedesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_PRIORITY",
                title: gridstrings.tasklist[lang].priority,
                width: 130
            },
            {
                type: "string",
                field: "TSK_PRIORITYDESC",
                title: gridstrings.tasklist[lang].prioritydesc,
                width: 150
            },
            {
                type: "string",
                field: "TSK_CANCELLATIONREASON",
                title: gridstrings.tasklist[lang].cancellationreason,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CANCELLATIONREASONDESC",
                title: gridstrings.tasklist[lang].cancellationreasondesc,
                width: 250
            },
            {
                type: "number",
                field: "TSK_PSPCODE",
                title: gridstrings.tasklist[lang].pspcode,
                width: 150
            },
            {
                type: "string",
                field: "TSK_PSPSTATUSDESC",
                title: gridstrings.tasklist[lang].pspstatusdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_PRPCODE",
                title: gridstrings.tasklist[lang].prpcode,
                width: 150
            },
            {
                type: "string",
                field: "TSK_ORGANIZATION",
                title: gridstrings.tasklist[lang].organization,
                width: 250
            },
            {
                type: "string",
                field: "TSK_ORGANIZATIONDESC",
                title: gridstrings.tasklist[lang].organizationdesc,
                width: 250
            },
            {
                type: "number",
                field: "TSK_PROGRESS",
                title: gridstrings.tasklist[lang].progress,
                width: 150,
                template: "<div class=\"progress\">" +
                    "<div class=\"progress-bar progress-bar-striped # if(TSK_PROGRESS == 100) {# progress-bar-success #} else if(TSK_PROGRESS > 50 && TSK_PROGRESS < 100) {# progress-bar-info active #} else {# progress-bar-warning active #}#\" role=\"progressbar\" aria-valuenow=\"#= TSK_PROGRESS #\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: #= TSK_PROGRESS #%;\">" +
                    "#= TSK_PROGRESS #%" +
                    "</div>" +
                    "</div>"
            },
            {
                type: "number",
                field: "TSK_PROJECT",
                title: gridstrings.tasklist[lang].project,
                width: 200
            },
            {
                type: "string",
                field: "TSK_PROJECTDESC",
                title: gridstrings.tasklist[lang].projectdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_DEPARTMENT",
                title: gridstrings.tasklist[lang].department,
                width: 130
            },
            {
                type: "string",
                field: "TSK_DEPARTMENTDESC",
                title: gridstrings.tasklist[lang].departmentdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_ASSIGNEDTO",
                title: gridstrings.tasklist[lang].assignedto,
                width: 250
            },
            {
                type: "string",
                field: "TSK_ACTTRADE",
                title: gridstrings.tasklist[lang].trade,
                width: 250
            },
            {
                type: "string",
                field: "TSK_FOLLOWED",
                title: gridstrings.tasklist[lang].followed,
                width: 250
            },
            {
                type: "datetime",
                field: "TSK_CREATED",
                title: gridstrings.tasklist[lang].created,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CREATEDBY",
                title: gridstrings.tasklist[lang].createdby,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CREATEDBYDESC",
                title: gridstrings.tasklist[lang].createdbydesc,
                width: 250
            },
            {
                type: "date",
                field: "TSK_DEADLINE",
                title: gridstrings.tasklist[lang].deadline,
                width: 250
            },
            {
                type: "datetime",
                field: "TSK_APD",
                title: gridstrings.tasklist[lang].activeplandate,
                width: 250
            },
            {
                type: "datetime",
                field: "TSK_REQUESTED",
                title: gridstrings.tasklist[lang].requested,
                width: 250
            },
            {
                type: "string",
                field: "TSK_REQUESTEDBY",
                title: gridstrings.tasklist[lang].requestedby,
                width: 250
            },
            {
                type: "string",
                field: "TSK_REQUESTEDBYDESC",
                title: gridstrings.tasklist[lang].requestedbydesc,
                width: 250
            },
            {
                type: "datetime",
                field: "TSK_COMPLETED",
                title: gridstrings.tasklist[lang].completed,
                width: 250
            },
            {
                type: "datetime",
                field: "TSK_CLOSED",
                title: gridstrings.tasklist[lang].closed,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CFEKMAL",
                title: gridstrings.tasklist[lang].ekmal,
                width: 250
            },
            {
                type: "string",
                field: "TSK_REGION",
                title: gridstrings.tasklist[lang].region,
                width: 250
            },
            {
                type: "string",
                field: "TSK_REFERENCE",
                title: gridstrings.tasklist[lang].reference,
                width: 200
            },
            {
                type: "string",
                field: "TSK_CUSTOMERPM",
                title: gridstrings.tasklist[lang].customerpm,
                width: 250
            },
            {
                type: "string",
                field: "TSK_BRANCHPM",
                title: gridstrings.tasklist[lang].branchpm,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CUSTOMERGROUP",
                title: gridstrings.tasklist[lang].customergroup,
                width: 250
            },
            {
                type: "string",
                field: "TSK_CUSTOMERGROUPDESC",
                title: gridstrings.tasklist[lang].customergroupdesc,
                width: 250
            },
            {
                type: "string",
                field: "TSK_QUOTATION",
                title: gridstrings.tasklist[lang].hasquotation,
                width: 150
            },
            {
                type: "string",
                field: "TSK_SUPERVISION",
                title: gridstrings.tasklist[lang].hassupervision,
                width: 150
            },
            {
                type: "string",
                field: "TSK_QUOTATIONSTATUSDESC",
                title: gridstrings.tasklist[lang].quotationstatus,
                width: 150
            },
            {
                type: "string",
                field: "TSK_PURCHASEORDERREQ",
                title: gridstrings.tasklist[lang].haspurchaseorder,
                width: 150
            }
        ];

        if (!!customer) {
            columns = $.grep(columns, function (col) {
                return $.inArray(col.field, ["TSK_ASSIGNEDTO","TSK_ACTTRADE"]) === -1;
            });
        }

        return columns;
    }

    function loadTasks() {
        var gridfilter = GetFilter();
        if (grdTasks) {
            grdTasks.ClearSelection();
            grdTasks.RunFilter(gridfilter);
        } else {
            grdTasks = new Grid({
                keyfield: "TSK_ID",
                columns: getGridColumns(),
                fields:
                {
                    TSK_ID: { type: "number" },
                    TSK_PROGRESS: { type: "number" },
                    TSK_CREATED: { type: "date" },
                    TSK_APD: { type: "date" },
                    TSK_REQUESTED: { type: "date" },
                    TSK_DEADLINE: { type: "date" },
                    TSK_COMPLETED: { type: "date" },
                    TSK_CLOSED: { type: "date" },
                    TSK_PROJECT: { type: "number" },
                    TSK_PSPCODE: { type: "number" },
                    TSK_SALESINVOICE: { type: "number" }
                },
                datafields: [
                    {
                        name: "hasquotation",
                        field: "TSK_QUOTATION"
                    },
                    {
                        name: "hassupervision",
                        field: "TSK_SUPERVISION"
                    },
                    {
                        name: "haspurcahseorder",
                        field: "TSK_PURCHASEORDERREQ"
                    }
                ],
                datasource: "/Api/ApiTask/List",
                selector: "#grdTasks",
                name: "grdTasks",
                entity: "TASK",
                height: constants.defaultgridheight,
                primarycodefield: "TSK_ID",
                primarytextfield: "TSK_SHORTDESC",
                visibleitemcount: 10,
                filter: gridfilter,
                filterlogic: "or",
                hasfiltermenu: true,
                sort: [{ field: "TSK_ID", dir: "desc" }],
                selectable: "multiple, row",
                toolbarColumnMenu: true,
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"Tasks.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                    ]
                },
                databound: gridDataBound
            });
        }
    }

    function ResetSidebarFilter() {
        $("#mytasks").prop("checked", false);
        $("#inmyregion").prop("checked", false);
        $("#deadlineval").val("");
        $("#datecreated_start").val("");
        $("#datecreated_end").val("");
        $("#daterequested_start").val("");
        $("#daterequested_end").val("");
        $("#datecompleted_start").val("");
        $("#datecompleted_end").val("");
        $("#dateclosed_start").val("");
        $("#dateclosed_end").val("");
        $("#apd_start").val("");
        $("#apd_end").val("");
        $("#tradeoruser").val("");
        $("#priorities input").each(function (e) {
            $(this).prop("checked", false);
        });
        $("#statuses input").each(function (e) {
            $(this).prop("checked", false);
        });
    }

    function GetFilter() {
        var gridfilter = [];
        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }

        var mytasks = $("#mytasks").prop("checked");
        var inmyregion = $("#inmyregion").prop("checked");
        var deadlineval = $("#deadlineval").val();

        var datecreatedstart = $("#datecreated_start").val().toDate();
        var datecreatedend = $("#datecreated_end").val().toDate();
        var daterequestedstart = $("#daterequested_start").val().toDate();
        var daterequestedend = $("#daterequested_end").val().toDate();
        var datecompletedstart = $("#datecompleted_start").val().toDate();
        var datecompletedend = $("#datecompleted_end").val().toDate();
        var dateclosedstart = $("#dateclosed_start").val().toDate();
        var dateclosedend = $("#dateclosed_end").val().toDate();
        var apdstart = $("#apd_start").val().toDate();
        var apdend = $("#apd_end").val().toDate();
        var tradeoruser = $("#tradeoruser").val();

        if (datecreatedend)
            datecreatedend = moment(datecreatedend, constants.dateformat).add(1, "days");
        if (apdend)
            apdend = apdend.add(1, "days");
        if (daterequestedend)
            daterequestedend = daterequestedend.add(1, "days");
        if (datecompletedend)
            datecompletedend = datecompletedend.add(1, "days");
        if (dateclosedend)
            dateclosedend = dateclosedend.add(1, "days");

        var i;
        var item;

        var checkedpriorities = $("#priorities input:checked");
        var priorities = [];
        for (i = 0; i < checkedpriorities.length; i++) {
            item = checkedpriorities[i];
            priorities.push($(item).val());
        }

        
        var statuses = $("#statuses").multipleSelect("getSelects");
        var tasktypes = $("#tasktypes").multipleSelect("getSelects");
        var categories = $("#categories").multipleSelect("getSelects");

        if (mytasks) {
            gridfilter.push({ field: "MYTASKS", value: user, operator: "func", logic: "and" });
        }
        if (inmyregion) {
            gridfilter.push({ field:"INMYREGION.TSKID",value: user, operator: "func", logic: "and" });
        }
        if (deadlineval) {
            gridfilter.push({ field: "TASK.DEADLINE.TSKID", value: parseFloat(deadlineval), operator: "func", logic: "and" });
        }

        var tradeoruser_op = $("button.btn-filter-operator.btn-primary").data("filter-op");
        if (tradeoruser) {
            gridfilter.push({ field: "ACTIVITIYTRADEORUSER", value: tradeoruser_op, value2: tradeoruser, operator: "func", logic: "and" });
        }
        if (priorities.length > 0)
            gridfilter.push({ field: "TSK_PRIORITY", value: priorities, operator: "in", logic: "and" });

        if (statuses.length > 0)
            gridfilter.push({ field: "TSK_STATUS", value: statuses, operator: "in", logic: "and" });
        if (tasktypes.length > 0)
            gridfilter.push({ field: "TSK_TASKTYPE", value: tasktypes, operator: "in", logic: "and" });
        if (categories.length > 0)
            gridfilter.push({ field: "TSK_CATEGORY", value: categories, operator: "in", logic: "and" });

        if (datecreatedstart && datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });
        if (daterequestedstart && daterequestedend)
            gridfilter.push({ field: "TSK_REQUESTED", value: daterequestedstart, value2: daterequestedend, operator: "between", logic: "and" });
        if (datecompletedstart && datecompletedend)
            gridfilter.push({ field: "TSK_COMPLETED", value: datecompletedstart, value2: datecompletedend, operator: "between", logic: "and" });
        if (dateclosedstart && dateclosedend)
            gridfilter.push({ field: "TSK_CLOSED", value: dateclosedstart, value2: dateclosedend, operator: "between", logic: "and" });
        if (apdstart && apdend)
            gridfilter.push({ field: "TSK_APD", value: apdstart, value2: apdend, operator: "between", logic: "and" });
        if (datecreatedstart && !datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedstart, operator: "gte", logic: "and" });
        if (daterequestedstart && !daterequestedend)
            gridfilter.push({ field: "TSK_REQUESTED", value: daterequestedstart, operator: "gte", logic: "and" });
        if (datecompletedstart && !datecompletedend)
            gridfilter.push({ field: "TSK_COMPLETED", value: datecompletedstart, operator: "gte", logic: "and" });
        if (dateclosedstart && !dateclosedend)
            gridfilter.push({ field: "TSK_CLOSED", value: dateclosedstart, operator: "gte", logic: "and" });
        if (apdstart && !apdend)
            gridfilter.push({ field: "TSK_APD", value: apdstart, operator: "gte", logic: "and" });
        if (!datecreatedstart && datecreatedend)
            gridfilter.push({ field: "TSK_CREATED", value: datecreatedend, operator: "lte", logic: "and" });
        if (!daterequestedstart && daterequestedend)
            gridfilter.push({ field: "TSK_REQUESTED", value: daterequestedend, operator: "lte", logic: "and" });
        if (!datecompletedstart && datecompletedend)
            gridfilter.push({ field: "TSK_COMPLETED", value: datecompletedend, operator: "lte", logic: "and" });
        if (!dateclosedstart && dateclosedend)
            gridfilter.push({ field: "TSK_CLOSED", value: dateclosedend, operator: "lte", logic: "and" });
        if (!apdstart && apdend)
            gridfilter.push({ field: "TSK_APD", value: apdend, operator: "lte", logic: "and" });

        return gridfilter;
    }

    function RunSidebarFilter() {
        var gridfilter = GetFilter();
        grdTasks.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function loadDocumentTypes() {
        var gridreq = {
            sort: [{ field: "SYC_CODE", dir: "asc" }],
            filter: {
                filters: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "DOCTYPE", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiSystemCodes/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                $("#doctype option:not(.default)").remove();
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions += "<option value=\"" +
                        d.data[i].SYC_CODE +
                        "\">" +
                        d.data[i].SYC_DESCF +
                        "</option>";
                }
                $("#doctype").append(strOptions);
            }
        });
    };

    var ChangeStatusesForAll = function () {
        if (!tms.Check("#modalstatuschange"))
            return $.Deferred().reject();

        var selectedRows = grdTasks.GetSelected();
        var selectedTaskArr = [];
        var selectedstatus = $("#statuschange").val();

        if (selectedRows.length === 0) {
            msgs.error(applicationstrings[lang].selectarecord);
            return false;
        }

        if (!selectedstatus) {
            msgs.error(applicationstrings[lang].selectstatus);
            return false;
        }


        for (var i = 0; i < selectedRows.length; i++) {
            var selProgressPayment = grdTasks.GetRowDataItem(selectedRows[i]);
            selectedTaskArr.push(selProgressPayment.TSK_ID);
        }

        var prm = {
            Status: selectedstatus,
            Lines: selectedTaskArr
        }

        return tms.Ajax({
            url: "/Api/ApiTask/ChangeStatuses",
            data: JSON.stringify(prm),
            fn: function (d) {
                msgs.success(d.data);
                self.List();
                $("#modalstatuschange").modal("hide");
            }
        });
    }

    function ready() {
        $("select[multiple]").multipleSelect({
            selectAllText: applicationstrings[lang].selectall,
            allSelected: applicationstrings[lang].allselected,
            countSelected: applicationstrings[lang].countSelected
        });
        loadTasks();
        loadDocumentTypes();

        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
            modal: "#modaldocuments",
            documentsdiv: "#docs",
            progressbar : "#docuprogress"
        });
        commentsHelper = new comments({
            input: "#comment",
            chkvisibletocustomer: "#visibletocustomer",
            chkvisibletosupplier: "#visibletosupplier",
            btnaddcomment: "#addComment",
            modal: "#modalcomments",
            commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
            commentsdiv: "#comments"
        });

        $("#taskrating").rating("refresh", {
            showClear: false,
            showCaption: false,
            displayOnly: !customer,
            clearCaption: ""
        });
        $("#saverating").on("click", function() {
            var taskid = $("#modalrating").data("id");
            var rating = parseFloat($("#taskrating").val());
            if (rating === 0) {
                msgs.error(applicationstrings[lang].erremptyrating);
                return $.Deferred().reject();
            }

            return $.when(tms.Ajax({ url: "/Api/ApiTask/Get", data: JSON.stringify(taskid) })).done(function (d) {
                var task = d.data;
                var ratingcomments = $("#ratingcomments").val();
                if (rating) {
                    task.TSK_RATING = rating;
                    task.TSK_RATINGCOMMENTS = ratingcomments;
                    return $.when(tms.Ajax({ url: "/Api/ApiTask/SaveRating", data: JSON.stringify(task) })).done(function(ds) {
                        msgs.success(ds.data);
                        var modalrating = $("#modalrating");
                        modalrating.data("id", null);
                        modalrating.modal("hide");
                        return loadTasks();
                    });
                }
            });
        });

        $("#btnsavestatus").on("click", ChangeStatusesForAll);

        $("#filter").click(function () {
            RunSidebarFilter();
        });
        $("#clearfilter").click(function () {
            ResetSidebarFilter();
            RunSidebarFilter();
        });

        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });

       
    }

    $(document).ready(ready);
}());