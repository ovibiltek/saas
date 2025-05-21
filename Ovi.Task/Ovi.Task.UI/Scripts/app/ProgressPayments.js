(function () {
    var selectedrecord = null;
    var grdProgressPayments = null;
    var grdProgressPaymentsElm = $("#grdProgressPayments");
    var isdisabled;
    var isclosed;

    var scr, tsk, pp, ppp;

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
        },
        {
            name: "tasks",
            btns: []
        },
        {
            name: "pricing",
            btns: []
        }
    ];

    tsk = new function () {
        var self = this;
        var grdProgressPaymentTasks = null;
        var grdProgressPaymentTasksElm = $("#grdProgressPaymentTasks");
        var commentsHelper;
        var documentsHelper;

        var Save = function () {
            var checkedlines = grdProgressPaymentTasksElm.find("input[data-name=\"chkTask\"]:checked");
            var itemarr = [];
            if (checkedlines.length === 0) {
                msgs.error(applicationstrings[lang].pptasknotselected);
                return $.Deferred().reject();
            }

            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                itemarr.push({
                    Task: line.data("id"),
                    Prp: line.data("pp")
                });
            }

            var o = JSON.stringify({
                Psp: selectedrecord.PSP_CODE,
                Items: itemarr
            });

            return tms.Ajax({
                url: "/Api/ApiProgressPayment/SaveTasks",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord.PSP_STATUS = "H";
                    isdisabled = $.inArray(selectedrecord.PSP_STATUS, ["A"]) === -1;
                    self.List();
                }
            });
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdProgressPaymentTasks input[data-name=\"chkTask\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var GridDataBound = function (e) {
            grdProgressPaymentTasksElm.find("button.btn-delete").prop("disabled", !isdisabled);
            grdProgressPaymentTasksElm.find(".btn-comments").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                commentsHelper.showCommentsModal({
                    subject: "TASK",
                    source: id
                });
            });
            grdProgressPaymentTasksElm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                documentsHelper.showDocumentsModal({
                    subject: "TASK",
                    source: id
                });
            });
            grdProgressPaymentTasksElm.find(".btn-delete").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiProgressPayment/RemoveTaskFromPsp",
                            data: JSON.stringify(id),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.List();
                            }
                        });
                    });
            });
            grdProgressPaymentTasksElm.find("#btnCheckAll").prop("disabled", isdisabled).off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdProgressPaymentTasksElm.find("#btnSaveTasks").prop("disabled", isdisabled).off("click").on("click", Save);
        };
        this.List = function () {
            if (selectedrecord) {
                var gridfilter = [];

                if (selectedrecord.PSP_TASKTYPE)
                    gridfilter.push({ field: "TSK_TYPE", value: selectedrecord.PSP_TASKTYPE, operator: "eq", logic: "and" });
                if (selectedrecord.PSP_BRANCH)
                    gridfilter.push({ field: "TSK_BRANCH", value: selectedrecord.PSP_BRANCH, operator: "eq", logic: "and" });
                if (selectedrecord.PSP_CUSTOMER)
                    gridfilter.push({ field: "TSK_CUSTOMER", value: selectedrecord.PSP_CUSTOMER, operator: "eq", logic: "and" });

                gridfilter.push({ field: "TSK_IPP", value: "+", operator: "eq", logic: "and" });
                gridfilter.push({ field: "TSK_ORGANIZATION", value: selectedrecord.PSP_ORG, operator: "eq", logic: "and" });
                gridfilter.push({ field:"TSKCATEGORYPSP",value:"", operator: "func", logic: "and" });

                if (selectedrecord.PSP_STATUS !== "A")
                    gridfilter.push({ field: "TSK_PSPCODE", value: selectedrecord.PSP_CODE, operator: "eq", logic: "and" });
                else
                    gridfilter.push({ field: "TSK_PSPCODE", operator: "isnull", logic: "and" });

                if (grdProgressPaymentTasks) {
                    grdProgressPaymentTasks.ClearSelection();
                    grdProgressPaymentTasks.RunFilter(gridfilter);
                } else {
                    var c = [
                        {
                            type: "na",
                            title: "#",
                            field: "CHKTASK",
                            template:
                                "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkTask\" class=\"styled\" type=\"checkbox\" #= TSK_PSPCODE ? 'checked=\"checked\"' : '' #  #= (TSK_PSPCODE || !TSK_PRICINGPARAM || !TSK_DATEBOOKED) ? 'disabled=\"disabled\"' : '' # data-pp=\"#= TSK_PRICINGPARAM #\" data-id=\"#= TSK_ID #\" /><label></label>",
                            filterable: false,
                            sortable: false,
                            width: 35
                        },
                        {
                            type: "na",
                            field: "DELETE",
                            title: "-",
                            template: "<button type=\"button\" title=\"#= applicationstrings[lang].delete #\" class=\"btn btn-danger btn-sm btn-delete\"><i class=\"fa fa-trash\"></i> </button>",
                            filterable: false,
                            sortable: false,
                            width: 45
                        },
                        {
                            type: "na",
                            field: "ACTIONS",
                            title: gridstrings.tasklist[lang].actions,
                            template: "<div style=\"text-align:center;\">" +
                                "<button type=\"button\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(TSK_CMNTCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSK_CMNTCOUNT #</span></button> " +
                                "<button type=\"button\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(TSK_DOCCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSK_DOCCOUNT # </span></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 125
                        },
                        {
                            type: "string",
                            field: "TSK_PRICINGPARAM",
                            title: gridstrings.tasklist[lang].pricingcode,
                            width: 200,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_CUSTOMER",
                            title: gridstrings.tasklist[lang].customer,
                            width: 100,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_BRANCH",
                            title: gridstrings.tasklist[lang].branch,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "number",
                            field: "TSK_ID",
                            title: gridstrings.tasklist[lang].taskno,
                            width: 100,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_SHORTDESC",
                            title: gridstrings.tasklist[lang].description,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_TYPEDESC",
                            title: gridstrings.tasklist[lang].typedesc,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_CATEGORYDESC",
                            title: gridstrings.tasklist[lang].categorydesc,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_STATUSDESC",
                            title: gridstrings.tasklist[lang].statusdesc,
                            width: 150,
                            template: "<h6><span class=\"#= TSK_STATUSCSS #\">#= TSK_STATUSDESC #</span></h6>",
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSK_REQUESTEDBY",
                            title: gridstrings.tasklist[lang].requestedby,
                            width: 150,
                            filterable: false
                        },
                        {
                            type: "date",
                            field: "TSK_CREATED",
                            title: gridstrings.tasklist[lang].created,
                            width: 150,
                            filterable: false
                        },
                        {
                            type: "datetime",
                            field: "TSK_COMPLETED",
                            title: gridstrings.tasklist[lang].completed,
                            width: 150,
                            filterable: false
                        }
                    ];

                    grdProgressPaymentTasks = new Grid({
                        keyfield: "TSK_ID",
                        columns: c,
                        fields: {
                            TSK_ID: { type: "number" },
                            TSK_COMPLETED: { type: "date" }
                        },
                        datasource: "/Api/ApiTask/ListProgressPaymentView",
                        selector: "#grdProgressPaymentTasks",
                        name: "grdProgressPaymentTasks",
                        height: constants.defaultgridheight - 125,
                        primarycodefield: "TSK_ID",
                        primarytextfield: "TSK_SHORTDESC",
                        visibleitemcount: 10,
                        filter: gridfilter,
                        filterlogic: "or",
                        sort: [{ field: "TSK_ID", dir: "desc" }],
                        toolbarColumnMenu: true,
                        loadall: true,
                        toolbar: {
                            left: [
                                "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>",
                                "<button class=\"btn btn-default btn-sm\" id=\"btnSaveTasks\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].save#</button>"
                            ],
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"ProgressPaymentTasks.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                            ]
                        },
                        databound: GridDataBound
                    });
                }
            }
        };
        var RegisterUIEvents = function () {
            documentsHelper = new documents({
                input: "#futsk",
                filename: "#filenametsk",
                uploadbtn: "#btnuploadtsk",
                container: "#fuploadtsk",
                documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"cmd\"] button.btn-docs span.txt",
                modal: "#modaldocuments",
                documentsdiv: "#docstsk"
            });
            commentsHelper = new comments({
                input: "#tskcomment",
                chkvisibletocustomer: "#visibletocustomer",
                chkvisibletosupplier: "#visibletosupplier",
                btnaddcomment: "#addTaskComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"cmd\"] button.btn-comments span.txt",
                commentsdiv: "#tskcomments"
            });
        };
        RegisterUIEvents();
    };
    ppp = new function () {
        var commentsHelper;
        var documentsHelper;
        var cost = 0;
        var calculated = 0;
        var self = this;

        var RowValues = function (row) {
            var fqtye = row.find("input[field-id=\"fqty\"]");
            var eqtye = row.find("input[field-id=\"eqty\"]");
            var lqtye = row.find("input[field-id=\"lqty\"]");
            var fqtyv = parseFloat(fqtye.val());
            var eqtyv = parseFloat(eqtye.val() || "0");

            var funitpricee = row.find("input[field-id=\"funitprice\"]");
            var eunitpricee = row.find("input[field-id=\"eunitprice\"]");
            var eunitpriceperce = row.find("input[field-id=\"eunitpricepercent\"]");

            var lunitpricee = row.find("input[field-id=\"lunitprice\"]");
            var funitpricev = parseFloat(funitpricee.val() || "0");
            var eunitpricev = parseFloat(eunitpricee.val() || "0");
            var eunitpricepercv = parseFloat(eunitpriceperce.val() || "0");

            lqtye.css("background-color", eqtyv !== 0 ? "#EC4342" : "");
            lqtye.css("color", eqtyv !== 0 ? "#FFF" : "");
            lqtye.val((fqtyv + eqtyv).fixed(constants.qtydecimals));

            if (eunitpriceperce.attr("edited")) {
                eunitpricev = (funitpricev * eunitpricepercv / 100);
                eunitpricee.val(eunitpricev !== 0 ? eunitpricev.fixed(constants.pricedecimals) : "");
            } else {
                eunitpricepercv = (parseFloat(funitpricev) !== 0 ? (eunitpricev / funitpricev * 100).fixed(2) : 0);
                eunitpriceperce.val(parseFloat(eunitpricepercv) !== 0 ? eunitpricepercv : "");
            }

            lunitpricee.css("background-color", eunitpricev !== 0 ? "#EC4342" : "");
            lunitpricee.css("color", eunitpricev !== 0 ? "#FFF" : "");
            lunitpricee.val((funitpricev + eunitpricev).fixed(constants.qtydecimals));

            var lqtyv = parseFloat(lqtye.val());
            var lunitpricev = parseFloat(lunitpricee.val());

            var totale = row.find("input[field-id=\"total\"]");
            totale.val((lqtyv * lunitpricev).fixed(constants.pricedecimals));
        };
        var CalculateSum = function () {
            var BuildPricingTable = $("#pricing table tbody");
            var rows = BuildPricingTable.find("tr[data-linetype]");
            var servicefeesum = 0;
            var hourlyfeesum = 0;
            var partsum = 0;
            var misccostsum = 0;
            var servicechargessum = 0;
            var equipmentmaintenancesum = 0;
            var amount = 0;
            var profit = 0;
         

            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                var totalinp = rowsi.find("input[field-id=\"total\"]");
                amount += parseFloat(totalinp.val());
                switch (rowsi.data("linetype")) {
                    case "SERVICEFEE":
                        servicefeesum += parseFloat(totalinp.val());
                        break;
                    case "HOURLYFEE":
                        hourlyfeesum += parseFloat(totalinp.val());
                        break;
                    case "PART":
                        partsum += parseFloat(totalinp.val());
                        break;
                    case "MISCCOST":
                        misccostsum += parseFloat(totalinp.val());
                        break;
                    case "SERVICECODE":
                        servicechargessum += parseFloat(totalinp.val());
                        break;
                    case "EQUIPMENT":
                        equipmentmaintenancesum += parseFloat(totalinp.val());
                        break;
                }
            }

            profit = amount - cost;
           
            $("#servicesum").text(servicefeesum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#hourlysum").text(hourlyfeesum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#partsum").text(partsum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#misccostsum").text(misccostsum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#servicechargessum").text(servicechargessum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#equipmentmaintenancesum").text(equipmentmaintenancesum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#amount").text(amount.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
            $("#profit").text(profit.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR + (cost !== 0 ? " (" + Math.round(((profit / cost) * 100) * 100 / 100) + "%)" : ""));
            $("#profitmargin").text( (cost !== 0 ?  Math.round(((profit / amount) * 100) * 100 / 100) + "%" : ""));
        };
        var CalculateLineValues = function () {
            var BuildPricingTable = $("#pricing table tbody");
            var rows = BuildPricingTable.find("tr[data-linetype]");
            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                RowValues(rowsi);
            }
        };
        var BuildPricingTable = function (d) {
            var BuildPricingTable = $("#pricing table tbody");
            BuildPricingTable.find("*").remove();
            var strlines = "";
            var lasttskid = 0;
            var lastact = 0;
            var lastrowpositions = [];
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                if (di.PRC_TASK != lasttskid) {
                    if (i !== 0)
                        lastrowpositions.push(i - 1);
                    lasttskid = di.PRC_TASK;
                }
            }

            lasttskid = 0;
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var tskid = di.PRC_TASK;
                var act = di.PRC_ACTLINE;
                var rowspan = "";

                if (tskid != lasttskid && i !== 0) {
                    strlines += "<tr><td style=\"background:#3498db;padding: 2px;\" colspan=\"14\"></td></tr>";
                }

                strlines += "<tr " +
                    " data-id=\"" +
                    di.PRC_ID +
                    "\" data-task=\"" +
                    di.PRC_TASK +
                    "\" data-linetype=\"" +
                    di.PRC_TYPE +
                    "\">";
                if (tskid != lasttskid) {
                    var lines = $.grep(d, function (e) { return e.PRC_TASK === tskid; });
                    var quotation = $.grep(d, function (e) { return e.PRC_QUOTATION !== 0; });

                    rowspan = "rowspan=\"" + lines.length + "\"";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<strong style=\"display:block;\"><a target=\"_blank\" href=\"/Task/Record/" + di.PRC_TASK + "\">" + di.PRC_TASK + "</a></strong>";
                    strlines += (quotation.length > 0
                        ? "<strong class=\"pp-quotation-box\"><a target=\"_blank\" href=\"/Quotations/ListByTask/" +
                        di.PRC_TASK +
                        "\"><i class=\"fa fa-bolt\" aria-hidden=\"true\"></i> " +
                        applicationstrings[lang].whasquotation +
                        "</a></strong>"
                        : "");
                    strlines += "<div style=\"margin-top:10px;\" class=\"btn-group\" role=\"group\">" +
                        "<button type=\"button\" title=\"" +
                        applicationstrings[lang].comments +
                        "\" class=\"btn " + (di.PRC_TASKCMNTCOUNT > 0 ? "btn-info-light" : "btn-default") + " btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\">" +
                        di.PRC_TASKCMNTCOUNT +
                        "</span></button> " +
                        "<button type=\"button\" title=\"" +
                        applicationstrings[lang].documents +
                        "\" class=\"btn " + (di.PRC_TASKDOCCOUNT > 0 ? "btn-info-light" : "btn-default") + " btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">" +
                        di.PRC_TASKDOCCOUNT +
                        "</span></button></div>";

                    strlines += "</td>";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<strong>" + di.PRC_TASKDESC + "</strong><br/>";
                    strlines += di.PRC_CUSTOMER + " - " + di.PRC_BRANCH;
                    strlines += "</td>";
                    lasttskid = tskid;
                    lastact = 0;
                }
                if (act != lastact) {
                    var actlines = $.grep(d, function (e) { return e.PRC_TASK === lasttskid && e.PRC_ACTLINE === act; });
                    rowspan = "rowspan=\"" + actlines.length + "\"";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<p><strong>" + di.PRC_ACTLINE + "</strong></p>";
                    strlines += "<p><strong>" + di.PRC_ACTDESC + "</strong></p>";
                    strlines += "<p><strong>" + di.PRC_ACTTRADE + "</strong></p>";
                    strlines += "</td>";
                    lastact = act;
                }
                strlines += "<td>";
                strlines += gridstrings.progresspaymentpricing[lang][di.PRC_TYPE];
                if (!customer) {
                    strlines += "<br/><strong>" + di.PRC_COST.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " / " + (di.PRC_COST * (di.PRC_TYPE !== "HOURLYFEE" ? di.PRC_QTY : 1)).toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + di.PRC_CURR + "</strong>";
                }
                strlines += "</td>";
                strlines += "<td>";
                if (di.PRC_CODE)
                    strlines += "<a class=\"history\" data-type=\"" + di.PRC_TYPE + "\" data-code=\"" + di.PRC_CODE + "\"  href=\"#\"><i style=\"cursor:pointer\" class=\"fa fa-fw fa-info-circle\" aria-hidden=\"true\"></i> ";
                strlines += di.PRC_TYPEDESC;
                if (di.PRC_CODE)
                    strlines += "</a>";
                if (di.PRC_TYPE === "PART")
                    strlines += "<br/><strong style=\"color:red\">" + applicationstrings[lang].calcmethod[di.PRC_CALCMETHOD] + "</strong>";
                strlines += "</td>";
                strlines +=
                    "<td><input field-id=\"fqty\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_QTY).fixed(constants.qtydecimals) +
                    "\"/></td>";
                strlines += "<td  " + (customer ? "class=\"hidden\"" : "") + "><input field-id=\"eqty\" " +
                    (isclosed ? " disabled=\"disabled\"" : "") +
                    " calc-on-change data-method=\"QTY\" class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PRC_USERQTY ? parseFloat(di.PRC_USERQTY).fixed(constants.qtydecimals) : "") +
                    "\"></td>";
                strlines +=
                    "<td  " + (customer ? "class=\"hidden\"" : "") + "><input field-id=\"lqty\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_QTY).fixed(constants.qtydecimals) +
                    "\"/></td>";
                strlines += "<td><input class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    di.PRC_UOM +
                    "\"/></td>";
                strlines +=
                    "<td><input field-id=\"funitprice\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_UNITPRICE).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines += "<td " + (customer ? "class=\"hidden\"" : "") + "><input field-id=\"eunitpricepercent\" " +
                    (isclosed ? " disabled=\"disabled\"" : "") +
                    " valtype=\"PRICE\" calc-on-change data-method=\"UNITPRICE\" class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PRC_USERUNITPRICE
                        ? parseFloat((di.PRC_USERUNITPRICE / di.PRC_UNITPRICE) * 100).fixed(constants.pricedecimals)
                        : "") +
                    "\"></td>";
                strlines += "<td " + (customer ? "class=\"hidden\"" : "") + "><input field-id=\"eunitprice\" " +
                    (isclosed ? " disabled=\"disabled\"" : "") +
                    " valtype=\"PRICE\" calc-on-change data-method=\"UNITPRICE\" class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PRC_USERUNITPRICE ? parseFloat(di.PRC_USERUNITPRICE).fixed(constants.pricedecimals) : "") +
                    "\"></td>";
                strlines +=
                    "<td " + (customer ? "class=\"hidden\"" : "") + "><input field-id=\"lunitprice\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_UNITPRICE).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines +=
                    "<td><input field-id=\"total\" class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    parseFloat(di.PRC_QTY * di.PRC_UNITPRICE).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines += "</tr>";
            }

            BuildPricingTable.append(strlines);
            BuildPricingTable.find("[valtype=\"PRICE\"]").on("change", function () {
                var v = $(this).val();
                if (v) $(this).val(parseFloat(v).fixed(constants.pricedecimals));
            });
            BuildPricingTable.find(".btn-comments").unbind("click").click(function () {
                var task = $(this).closest("[data-task]").data("task");
                commentsHelper.showCommentsModal({ subject: "TASK", source: task });
            });
            BuildPricingTable.find(".btn-docs").unbind("click").click(function () {
                var task = $(this).closest("[data-task]").data("task");
                documentsHelper.showDocumentsModal({ subject: "TASK", source: task });
            });
            BuildPricingTable.find("input[calc-on-change]").numericInput({ allowNegative: true, allowFloat: true });
            BuildPricingTable.find("input[calc-on-change]").on("change", function () {
                var $this = $(this);
                var row = $this.closest("tr");
                row.find("input[calc-on-change]").removeAttr("edited");
                $this.attr("edited", "+");
                RowValues(row);
                CalculateSum();
            });
            BuildPricingTable.find("a.history").unbind("click").click(function () {
                var code = $(this).data("code");
                var type = $(this).data("type");
                var f = [
                    { field: "PRC_TYPE", value: type, operator: "eq" },
                    { field: "PRC_CODE", value: code, operator: "eq" }
                ];

                gridModal.show({
                    modaltitle: gridstrings.progresspaymentpricing[lang].title,
                    listurl: "/Api/ApiProgressPaymentPricing/List",
                    keyfield: "PRC_ID",
                    codefield: "PRC_CODE",
                    textfield: "PRC_TYPEDESC",
                    columns: [
                        { type: "string", field: "PRC_CUSTOMER", title: gridstrings.progresspaymentpricing[lang].customer, width: 300 },
                        { type: "string", field: "PRC_TYPEDESC", title: gridstrings.progresspaymentpricing[lang].description, width: 300 },
                        { type: "price", field: "PRC_COST", title: gridstrings.progresspaymentpricing[lang].cost, width: 200 },
                        { type: "price", field: "PRC_UNITPRICE", title: gridstrings.progresspaymentpricing[lang].unitprice, width: 200 },
                        { type: "price", field: "PRC_CALCPRICE", title: gridstrings.progresspaymentpricing[lang].userunitprice, width: 200 },
                        { type: "string", field: "PRC_CURR", title: gridstrings.progresspaymentpricing[lang].curr, width: 100 },
                        { type: "datetime", field: "PRC_CREATED", title: gridstrings.progresspaymentpricing[lang].created, width: 200 }
                    ],
                    fields:
                    {
                        PRC_COST: { type: "number" },
                        PRC_UNITPRICE: { type: "number" },
                        PRC_USERUNITPRICE: { type: "number" },
                        PRC_CREATED: { type: "date" }
                    },
                    filter: f,
                    sort: [{ field: "PRC_CREATED", dir: "desc" }]
                });
            });
        };
        this.Save = function () {
            var amendedlines = [];
            var BuildPricingTable = $("#pricing table tbody");
            var rows = BuildPricingTable.find("tr[data-linetype]");

            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                var eqty = rowsi.find("input[field-id=\"eqty\"]").val();
                var eunitprice = rowsi.find("input[field-id=\"eunitprice\"]").val();
                var id = rowsi.data("id");
                amendedlines.push({
                    PRC_ID: id,
                    PRC_USERQTY: ((!!eqty && eqty !== "0") ? parseFloat(eqty).fixed(constants.qtydecimals) : null),
                    PRC_USERUNITPRICE: ((!!eunitprice && eunitprice !== "0")
                        ? parseFloat(eunitprice).fixed(constants.pricedecimals)
                        : null)
                });
            }

            if (amendedlines.length > 0) {
                return tms.Ajax({
                    url: "/Api/ApiProgressPaymentPricing/SaveList",
                    data: JSON.stringify({
                        ProgressPayment: selectedrecord.PSP_CODE,
                        ProgressPaymentPricingList: amendedlines
                    }),
                    fn: function (d) {
                        msgs.success(d.data);
                    }
                });
            }
        };
        this.List = function () {
            if (selectedrecord) {
                return tms.Ajax({
                    url: "/Api/ApiProgressPaymentPricing/ListByProgressPayment",
                    data: JSON.stringify(selectedrecord.PSP_CODE),
                    fn: function (d) {
                        calculated = 0;
                        cost = 0;
                        $.each(d.data, function (i, e) { calculated += e.PRC_QTY * e.PRC_UNITPRICE; });
                        $.each(d.data, function (i, e) { cost += (e.PRC_TYPE !== "HOURLYFEE" ? e.PRC_QTY : 1) * e.PRC_COST; });
                        $("#calculated").text(calculated.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
                        $("#cost").text(cost.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + selectedrecord.PSP_ORGCURR);
                        BuildPricingTable(d.data);
                        CalculateLineValues();
                        CalculateSum();
                        $("#btnSavePricing").prop("disabled", (d.data.length === 0 || isclosed)).off().on("click", function () {
                            var $this = $(this);
                            $this.prop("disabled", true);
                            $.when(self.Save()).always(function () {
                                $this.prop("disabled", false);
                            });
                        });
                    }
                });
            }
        };
        var RegisterUIEvents = function () {
            documentsHelper = new documents({
                input: "#futsk",
                filename: "#filenametsk",
                uploadbtn: "#btnuploadtsk",
                container: "#fuploadtsk",
                documentcounttext: "tr[data-task=\"#source#\"] button.btn-docs span.txt",
                modal: "#modaldocuments",
                documentsdiv: "#docstsk"
            });

            commentsHelper = new comments({
                input: "#tskcomment",
                chkvisibletocustomer: "#visibletocustomer",
                chkvisibletosupplier: "#visibletosupplier",
                btnaddcomment: "#addTaskComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-task=\"#source#\"] button.btn-comments span.txt",
                commentsdiv: "#tskcomments"
            });
        };
        RegisterUIEvents();
    };
    pp = new function () {
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var self = this;

        function buildLookupLines(code, ctrl) {

            var gridreq = {
                sort: [{ field: "TML_ITEMCODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "TML_CODE", value: code, operator: "eq" },
                        { field: "TML_TYPE", value: "CUSTOMFIELD", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiLookupLines/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    let selectedOptions = ctrl.multipleSelect("getSelects");
                    ctrl.find("option").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {

                        strOptions += "<option value=\"" +
                            d.data[i].TML_ITEMCODE +
                            "\">" +
                            d.data[i].TML_ITEMDESC +
                            "</option>";
                    }

                    ctrl.append(strOptions);
                    ctrl.multipleSelect("refresh");
                    ctrl.multipleSelect("setSelects", selectedOptions);
                }
            });
        }

        var CheckInvoiceOptions = function () {

            var selectedinvoiceoption = $("#invoiceoptions option:selected").val();
            if (!selectedinvoiceoption) 
                return true;

            var selectedRows = grdProgressPayments.GetSelected();
            var customerArr = [];
            var orgArr = [];
            var checkorgresult = true;
            var checkcustomerresult = true;

            for (var i = 0; i < selectedRows.length; i++) {
                var selrow = grdProgressPayments.GetRowDataItem(selectedRows[i]);
                customerArr.pushUnique(selrow.PSP_CUSTOMER);
                orgArr.pushUnique(selrow.PSP_ORG);
            }

            checkorgresult = (orgArr.length === 1);
            checkcustomerresult = (customerArr.length === 1);
            return checkorgresult && checkcustomerresult;
        }
        var CheckSelectedProgressPaymentRows = function () {
            var selectedRows = grdProgressPayments.GetSelected();
            var statusArr = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var selrow = grdProgressPayments.GetRowDataItem(selectedRows[i]);
                statusArr.pushUnique(selrow.PSP_STATUS);
            }
            $("#invoicedescription").val("");
            if (selectedRows.length === 1) {
                $("#invoicedescription").val(selectedrecord.PSP_DESC);
            }

            return (statusArr.length === 1);

        }

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPROGRESSPAYMENTS", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.PSP_CODE, operator: "eq" }
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
                        { field: "ORG_CODE", value: "*", operator: "neq" },
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        $("#customer").val("");
                        $("#branch").val("");
                        tooltip.hide("#type");
                        tooltip.hide("#customer");
                        tooltip.hide("#branch");
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
                        { field: "TYP_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "PROGRESSPAYMENT",
                                source: selectedrecord ? selectedrecord.PSP_CODE : "0",
                                type: data.TYP_CODE
                            });
                        }
                    }
                });
            });
            $("#btntasktype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#tasktype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ]
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
                        {
                            type: "string",
                            field: "CUS_DESC",
                            title: gridstrings.customer[lang].description,
                            width: 300
                        },
                        {
                            type: "string",
                            field: "CUS_PPTASKCNT",
                            title: gridstrings.customer[lang].pptaskcnt,
                            width: 100
                        }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function () {
                        $("#branch").val("");
                        tooltip.hide("#branch");
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
                        { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 300 },
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 },
                        {
                            type: "string",
                            field: "BRN_PPTASKCNT",
                            title: gridstrings.branches[lang].pptaskcnt,
                            width: 100
                        }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
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
                filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }],
                callback: function (data) {
                    $("#type").val("");
                    $("#customer").val("");
                    $("#branch").val("");
                    tooltip.hide("#type");
                    tooltip.hide("#customer");
                    tooltip.hide("#branch");
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
                    { field: "TYP_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "PROGRESSPAYMENT",
                            source: selectedrecord ? selectedrecord.PSP_CODE : "0",
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#tasktype").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "TASK", operator: "eq" }
                ]
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }],
                calback: function (data) {
                    $("#branch").val("");
                    tooltip.hide("#branch");
                }
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [{ field: "BRN_CUSTOMER", relfield: "#customer", includeall: false }]
            });
            $("#pspgroupcode").autocomp({
                listurl: "/Api/ApiProgressPaymentGroupCodes/List",
                geturl: "/Api/ApiProgressPaymentGroupCodes/Get",
                field: "PSG_ID",
                textfield: "PSG_ID",
                termisnumeric : true
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "PROGRESSPAYMENT",
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
        var LoadAllStatuses = function () {
            var gridreq = {
                sort: [{ field: "STA_DESC", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "STA_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" },
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
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.PSP_CODE);
            $("#org").val(selectedrecord.PSP_ORG);
            $("#desc").val(selectedrecord.PSP_DESC).prop("disabled", isdisabled);
            $("#type").val(selectedrecord.PSP_TYPE);
            $("#customer").val(selectedrecord.PSP_CUSTOMER);
            $("#branch").val(selectedrecord.PSP_BRANCH).prop("disabled", isdisabled);
            $("#tasktype").val(selectedrecord.PSP_TASKTYPE).prop("disabled", isdisabled);
            $("#pspgroupcode").val(selectedrecord.PSP_GROUP).prop("disabled", selectedrecord._status.STA_PCODE === "C");
            $("#createdby").val(selectedrecord.PSP_CREATEDBY);
            $("#created").val(moment(selectedrecord.PSP_CREATED).format(constants.longdateformat));
            $("#status").data("code", selectedrecord._status.STA_CODE);
            $("#status").data("pcode", selectedrecord._status.STA_PCODE);
            $("#status").data("text", selectedrecord._status.STA_DESCF);
            $("#btnbranch").prop("disabled", isdisabled);
            $("#btntasktype").prop("disabled", isdisabled);
            $("#pspinvoiceno").val(selectedrecord.PSP_INVOICENO).prop("disabled", selectedrecord._status.STA_PCODE === "C");
            $("#pspinvoicedate").val(selectedrecord.PSP_INVOICEDATE ? moment(selectedrecord.PSP_INVOICEDATE).format(constants.dateformat) : "").prop("disabled", selectedrecord._status.STA_PCODE === "C");
            $("#allowzerototal").prop("checked", selectedrecord.PSP_ALLOWZEROTOTAL === "+");
            $("#btnBrowse").removeAttr("disabled");
            $("#addComment,#fu").prop("disabled", false);

            commentsHelper.showCommentsBlock({ subject: "PROGRESSPAYMENT", source: selectedrecord.PSP_CODE });
            documentsHelper.showDocumentsBlock({ subject: "PROGRESSPAYMENT", source: selectedrecord.PSP_CODE });
            LoadStatuses({
                pcode: selectedrecord._status.STA_PCODE,
                code: selectedrecord._status.STA_CODE,
                text: selectedrecord._status.STA_DESCF
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiProgressPayment/Get",
                data: JSON.stringify(selectedrecord.PSP_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedrecord._status = d.stat;
                    isdisabled = $.inArray(selectedrecord.PSP_STATUS, ["A"]) === -1;
                    isclosed = $.inArray(selectedrecord.PSP_STATUS, ["H"]) === -1;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({
                        subject: "PROGRESSPAYMENT",
                        source: selectedrecord.PSP_CODE,
                        type: $("#type").val()
                    });
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "PROGRESSPAYMENT",
                source: selectedrecord ? selectedrecord.PSP_CODE : null,
                type: $("#type").val()
            });
            var o = JSON.stringify(
                {
                    ProgressPayment: {
                        PSP_CODE: (selectedrecord) ? selectedrecord.PSP_CODE : 0,
                        PSP_ORG: $("#org").val(),
                        PSP_TYPEENTITY: "PROGRESSPAYMENT",
                        PSP_TYPE: $("#type").val(),
                        PSP_DESC: $("#desc").val(),
                        PSP_STATUS: $("#status").val(),
                        PSP_CUSTOMER: $("#customer").val(),
                        PSP_BRANCH: ($("#branch").val() || null),
                        PSP_TASKTYPEENTITY: ($("#tasktype").val() ? "TASK" : null),
                        PSP_TASKTYPE: ($("#tasktype").val() || null),
                        PSP_INVOICENO: ($("#pspinvoiceno").val() || null),
                        PSP_INVOICEDATE: ($("#pspinvoicedate").val() ? moment.utc($("#pspinvoicedate").val(), constants.dateformat) : null),
                        PSP_ALLOWZEROTOTAL: $("#allowzerototal").prop("checked") ? "+" : "-",
                        PSP_CREATED: selectedrecord != null ? selectedrecord.PSP_CREATED : tms.Now(),
                        PSP_CREATEDBY: selectedrecord != null ? selectedrecord.PSP_CREATEDBY : user,
                        PSP_UPDATED: selectedrecord != null ? tms.Now() : null,
                        PSP_UPDATEDBY: selectedrecord != null ? user : null,
                        PSP_RECORDVERSION: selectedrecord != null ? selectedrecord.PSP_RECORDVERSION : 0,
                        PSP_DATECLOSED: selectedrecord != null ? selectedrecord.PSP_DATECLOSED : null,
                        PSP_TOTAL: selectedrecord != null ? selectedrecord.PSP_TOTAL : null,
                        PSP_COST: selectedrecord != null ? selectedrecord.PSP_COST : null,
                        PSP_GROUP: ($("#pspgroupcode").val() || null)

                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiProgressPayment/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r.ProgressPayment;
                    self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiProgressPayment/DelRec",
                            data: JSON.stringify(selectedrecord.PSP_CODE),
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
            tms.Reset("#record");

            $("#code").val("");
            $("#org").val("");
            $("#desc").val("").prop("disabled", false);
            $("#type").val("");
            $("#customer").val("");
            $("#branch").val("").prop("disabled", false);
            $("#tasktype").val("").prop("disabled", false);
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#pspgroupcode").val("");
           
            $("#allowzerototal").prop("checked", false);

            var statctrl = $("#status");
            statctrl.data("code", "-");
            statctrl.data("pcode", "Q");
            statctrl.data("text", "");
            statctrl.val("");
            statctrl.find("option").remove();
            statctrl.addClass("required").prop("disabled", false).removeAttr("frozen");

            tooltip.hide("#org");
            tooltip.hide("#type");
            tooltip.hide("#customer");
            tooltip.hide("#branch");
            tooltip.hide("#tasktype");

            $("#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var ItemSelect = function (row) {
            selectedrecord = grdProgressPayments.GetRowDataItem(row);
            isdisabled = $.inArray(selectedrecord.PSP_STATUS, ["A"]) === -1;
            isclosed = $.inArray(selectedrecord.PSP_STATUS, ["H"]) === -1;
            $(".page-header h6").html(selectedrecord.PSP_CODE + " - " + selectedrecord.PSP_DESC);
            scr.Configure();
            tms.Tab();
        };
        var ResetSidebarFilter = function () {
            $("#datecreated_start").val("");
            $("#datecreated_end").val("");
            $("#datetskcompleted_start").val("");
            $("#datetskcompleted_end").val("");
            $("#datetskclosed_start").val("");
            $("#datetskclosed_end").val("");
            $("#fcustomer").val("");
        };
        var GetSidebarFilter = function () {
            var gridfilter = [];

            var datestart = $("#datecreated_start").val().toDate();
            var dateend = $("#datecreated_end").val().toDate();
            var datetskcompletedstart = $("#datetskcompleted_start").val().toDate();
            var datetskcompletedend = $("#datetskcompleted_end").val().toDate();
            var datetskclosedstart = $("#datetskclosed_start").val().toDate();
            var datetskclosedend = $("#datetskclosed_end").val().toDate();

            if (dateend)
                dateend = moment(dateend, constants.dateformat).add(1, "days");
            if (datetskcompletedend)
                datetskcompletedend = moment(datetskcompletedend, constants.dateformat).add(1, "days");
            if (datetskclosedend)
                datetskclosedend = moment(datetskclosedend, constants.dateformat).add(1, "days");

            var customer = $("#fcustomer").val();

            if (datestart && dateend)
                gridfilter.push({ field: "PSP_CREATED", value: datestart, value2: dateend, operator: "between", logic: "and" });

            if (datetskcompletedstart && datetskcompletedend)
                gridfilter.push({ field: "PSP_TSKCOMPLETED", value: datetskcompletedstart, value2: datetskcompletedend, operator: "between", logic: "and" });

            if (datetskclosedstart && datetskclosedend)
                gridfilter.push({ field: "PSP_TSKCLOSED", value: datetskclosedstart, value2: datetskclosedend, operator: "between", logic: "and" });

            if (datestart && !dateend)
                gridfilter.push({ field: "PSP_CREATED", value: datestart, operator: "gte", logic: "and" });
            if (!datestart && dateend)
                gridfilter.push({ field: "PSP_CREATED", value: dateend, operator: "lte", logic: "and" });

            if (datetskcompletedstart && !datetskcompletedend)
                gridfilter.push({ field: "PSP_TSKCOMPLETED", value: datetskcompletedstart, operator: "gte", logic: "and" });
            if (!datetskcompletedstart && datetskcompletedend)
                gridfilter.push({ field: "PSP_TSKCOMPLETED", value: datetskcompletedend, operator: "lte", logic: "and" });

            if (datetskclosedstart && !datetskclosedend)
                gridfilter.push({ field: "PSP_TSKCLOSED", value: datetskclosedstart, operator: "gte", logic: "and" });
            if (!datetskclosedstart && datetskclosedend)
                gridfilter.push({ field: "PSP_TSKCLOSED", value: datetskclosedend, operator: "lte", logic: "and" });

            if (customer)
                gridfilter.push({ field: "PSP_CUSTOMERDESC", value: customer, operator: "contains", logic: "and" });


            var ext01_selected = $("#ext01").multipleSelect("getSelects");
            var ext02_selected = $("#ext02").multipleSelect("getSelects");
            var ext03_selected = $("#ext03").multipleSelect("getSelects");

            if (ext01_selected.length > 0)
                gridfilter.push({ field:"SHAYA.FTIP", value: ext01_selected, operator: "func", logic: "and" });
            if (ext02_selected.length > 0)
                gridfilter.push({ field: "SHAYA.HYIL", value: ext02_selected, operator: "func", logic: "and" });
            if (ext03_selected.length > 0)
                gridfilter.push({ field: "SHAYA.HAY", value: ext03_selected, operator: "func", logic: "and" });

            return gridfilter;
        }
        var RunSidebarFilter = function () {
            var gridfilter = GetSidebarFilter();
            grdProgressPayments.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };

        var ChangeStatusesForAll = function () {
            if (!tms.Check("#modalstatuschange"))
                return $.Deferred().reject();

            var selectedRows = grdProgressPayments.GetSelected();
            var selectedProgressPaymentArr = [];
            var selectedstatus = $("#statuschange").val();
            var invoiceno = $("#invoiceno").val() || null;
            var invoicedescription = $("#invoicedescription").val() || null;
            var orderno = $("#orderno").val() || null;
            var invoiceoption = $("#invoiceoptions option:selected").val() || null;
            var printtype = $("#printtype option:selected").val() || null;
            var allowzerototalforselected = $("#allowzerototalforselected").prop("checked") ? "+" : "-";


            var invoicedate = $("#invoicedate").val()
                ? moment.utc($("#invoicedate").val(), constants.dateformat)
                : null;

            if (selectedRows.length === 0) {
                msgs.error(applicationstrings[lang].selectarecord);
                return false;
            }

            if (!selectedstatus) {
                msgs.error(applicationstrings[lang].selectstatus);
                return false;
            }

            if (!CheckInvoiceOptions()) {
                msgs.error(applicationstrings[lang].progresspaymentinvoiceoptionserror);
                return false;
            }

            for (var i = 0; i < selectedRows.length; i++) {
                var selProgressPayment = grdProgressPayments.GetRowDataItem(selectedRows[i]);
                selectedProgressPaymentArr.push(selProgressPayment.PSP_CODE);
            }

            var pspoptions = {
                InvoiceOption: selectedstatus === "K" ? invoiceoption : null,
                InvoiceDescription: selectedstatus === "K" ? invoicedescription : null,
                PrintType: selectedstatus === "K" ? printtype : null,
                OrderNo: selectedstatus === "K" ? orderno : null,
                InvoiceNo : selectedstatus === "K2" ? invoiceno : null,
                InvoiceDate: selectedstatus === "K2" ? invoicedate : null,
                Status : selectedstatus,
                Lines: selectedProgressPaymentArr,
                AllowZeroTotal: allowzerototalforselected
            }

            return tms.Ajax({
                url: "/Api/ApiProgressPayment/SaveList",
                data: JSON.stringify(pspoptions),
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                    $("#modalstatuschange").modal("hide");
                }
            });
        }
        var GridDataBound = function (e) {
            grdProgressPaymentsElm.find("#search").off("click").on("click", function () {
                $.when(buildLookupLines("SH.FTIP", $("#ext01")), buildLookupLines("SH.HYIL", $("#ext02")), buildLookupLines("SH.HAY", $("#ext03"))).done(function () {
                    $(".sidebar.right").trigger("sidebar:open");
                });

            });
            grdProgressPaymentsElm.find("[data-id]").unbind("dblclick").dblclick(function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdProgressPaymentsElm.contextMenu({
                selector: "div.k-grid-content tr",
                items: {
                    statuschange: {
                        name: applicationstrings[lang].statuschange,
                        callback: function () {
                            if (!CheckSelectedProgressPaymentRows()) {
                                msgs.error(applicationstrings[lang].progresspaymentselectionerror);
                                return false;
                            } else {
                                $.when(LoadAllStatuses()).done(function () {
                                    $("#invoicedetails").addClass("hidden");
                                    $("#invoiceno,#invoicedate,#invoiceoptions").val("");
                                    $("#modalstatuschange").modal("show");
                                });
                            }
                        }
                    }
                }
            });
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        this.List = function () {
            var gridfilter = GetSidebarFilter();
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdProgressPayments) {
                grdProgressPayments.ClearSelection();
                grdProgressPayments.RunFilter(gridfilter);
            } else {

                var columns = 
                [
                    {
                        type: "number",
                        field: "PSP_CODE",
                        title: gridstrings.progresspayments[lang].ppcode,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PSP_DESC",
                        title: gridstrings.progresspayments[lang].desc,
                        width: 350
                    },
                    {
                        type: "string",
                        field: "PSP_STATUSDESC",
                        title: gridstrings.progresspayments[lang].status,
                        width: 250
                    },
                    { type: "string", field: "PSP_ORG", title: gridstrings.progresspayments[lang].org, width: 150 },
                    {
                        type: "string",
                        field: "PSP_TYPE",
                        title: gridstrings.progresspayments[lang].type,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PSP_CATEGORY",
                        title: gridstrings.progresspayments[lang].category,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "PSP_CATEGORYDESC",
                        title: gridstrings.progresspayments[lang].categorydesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_TSKTYPEDESC",
                        title: gridstrings.progresspayments[lang].tsktypedesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_CUSTOMER",
                        title: gridstrings.progresspayments[lang].customer,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "PSP_SLSINVOICE",
                        title: gridstrings.progresspayments[lang].salesinvoiceno,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PSP_CUSTOMERDESC",
                        title: gridstrings.progresspayments[lang].customerdesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_CUSTOMERPM",
                        title: gridstrings.progresspayments[lang].customerpm,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_CUSTOMERGROUP",
                        title: gridstrings.progresspayments[lang].customergroup,
                        width: 250
                        },
                    {
                        type: "string",
                        field: "PSP_CUSTOMERPSP",
                        title: gridstrings.progresspayments[lang].customerpsp,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCH",
                        title: gridstrings.progresspayments[lang].branch,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCHDESC",
                        title: gridstrings.progresspayments[lang].branchdesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCHPM",
                        title: gridstrings.progresspayments[lang].branchpm,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCHAUTHNOTES",
                        title: gridstrings.progresspayments[lang].branchauthorizednotes,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCHTYPE",
                        title: gridstrings.progresspayments[lang].branchtype,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCHREGION",
                        title: gridstrings.progresspayments[lang].branchregion,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_BRANCHREFERENCE",
                        title: gridstrings.progresspayments[lang].branchreference,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_TSKDEPARTMENT",
                        title: gridstrings.progresspayments[lang].tskdepartment,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_TSKTASKTYPE",
                        title: gridstrings.progresspayments[lang].tsktasktype,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_TSKREFERENCE",
                        title: gridstrings.progresspayments[lang].tskreference,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_INVOICENO",
                        title: gridstrings.progresspayments[lang].invoiceno,
                        width: 250
                    },
                    {
                        type: "date",
                        field: "PSP_INVOICEDATE",
                        title: gridstrings.progresspayments[lang].invoicedate,
                        width: 250
                    },
                    {
                        type: "price",
                        field: "PSP_COST",
                        title: gridstrings.progresspayments[lang].cost,
                        width: 250
                    },
                    {
                        type: "price",
                        field: "PSP_TOTAL",
                        title: gridstrings.progresspayments[lang].total,
                        width: 250
                    },
                    {
                        type: "price",
                        field: "PSP_PROFIT",
                        title: gridstrings.progresspayments[lang].profit,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "PSP_GROUP",
                        title: gridstrings.progresspayments[lang].groupcode,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "PSP_TSKCOMPLETED",
                        title: gridstrings.progresspayments[lang].tskcompleted,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "PSP_TSKCLOSED",
                        title: gridstrings.progresspayments[lang].tskclosed,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_CREATEDBY",
                        title: gridstrings.progresspayments[lang].createdby,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "PSP_CREATED",
                        title: gridstrings.progresspayments[lang].created,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PSP_UPDATEDBY",
                        title: gridstrings.progresspayments[lang].updatedby,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "PSP_UPDATED",
                        title: gridstrings.progresspayments[lang].updated,
                        width: 250
                    }
                ];

                var fields = {
                    PSP_CODE: { type: "number" },
                    PSP_CREATED: { type: "date" },
                    PSP_UPDATED: { type: "date" },
                    PSP_SLSINVOICE: { type: "number" },
                    PSP_INVOICEDATE: { type: "date" },
                    PSP_TSKCOMPLETED: { type: "date" },
                    PSP_TSKCLOSED: { type: "date" },
                    PSP_COST: { type: "number" },
                    PSP_TOTAL: { type: "number" },
                    PSP_PROFIT: { type: "number" },
                    PSP_GROUP: { type: "number" }
                };

                if (customer) {
                    columns = $.grep(columns,
                        function (e) { return ($.inArray(e.field, ["PSP_PROFIT","PSP_COST"]) == -1); });
                    delete fields.PSP_PROFIT;
                    delete fields.PSP_COST;

                }

                grdProgressPayments = new Grid({
                    keyfield: "PSP_CODE",
                    columns: columns,
                    fields : fields,
                    datasource: "/Api/ApiProgressPayment/List",
                    selector: "#grdProgressPayments",
                    name: "grdProgressPayments",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "PSP_CODE",
                    primarytextfield: "PSP_DESC",
                    visibleitemcount: 10,
                    filterlogic: "or",
                    filter: gridfilter,
                    sort: [{ field: "PSP_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    selectable: "multiple, row",
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"ProgressPayments.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
                    var target = $(e.target).attr("href");
                    switch (target) {
                        case "#list":
                            self.List();
                            break;
                        case "#record":
                            if (!selectedrecord)
                                self.ResetUI();
                            else
                                self.LoadSelected();
                            break;
                        case "#tasks":
                            tsk.List();
                            break;
                        case "#pricing":
                            ppp.List();
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
            $("#btnNew").click(function () {
                self.ResetUI();
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);

            $("[loadstatusesonchange=\"yes\"]").on("change", function () {
                LoadStatuses({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")
                });
            });

            $("#statuschange").on("change", function () {
                var vstatus = $(this).val();
                var ctrl_invoicedetails = $("#invoicedetails");
                var ctrl_salesinvoiceoptions = $("#salesinvoiceoptions");
                $("#invoicedescription").removeAttr("required").removeClass("required");
                if (vstatus == "K") {
                    ctrl_salesinvoiceoptions.removeClass("hidden");
                    ctrl_invoicedetails.addClass("hidden");
                    $("#invoicedescription").attr("required", "").addClass("required");
                } else if (vstatus == "K2") {
                    ctrl_invoicedetails.removeClass("hidden");
                    ctrl_salesinvoiceoptions.addClass("hidden");
                } else {
                    ctrl_invoicedetails.addClass("hidden");
                    ctrl_salesinvoiceoptions.addClass("hidden");
                }
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
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments",
                chkvisibletocustomer: "#pspvisibletocustomer",
                chkvisibletosupplier: "#pspvisibletosupplier"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            $("#filter").click(RunSidebarFilter);
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });

            $("#btnsavestatus").on("click", ChangeStatusesForAll);

            $("select[multiple]").multipleSelect({
                selectAllText: applicationstrings[lang].selectall,
                allSelected: applicationstrings[lang].allselected,
                countSelected: applicationstrings[lang].countSelected
            });
        };
        this.BuildUI = function () {
            BuildModals();
            AutoComplete();
            RegisterUiEvents();
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
                    e: "#btnSave",
                    f: function () {
                        pp.Save();
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        pp.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        pp.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        pp.Delete();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        pp.HistoryModal();
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
        pp.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());