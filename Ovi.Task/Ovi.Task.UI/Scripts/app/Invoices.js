(function () {
    var selectedrecord = null;
    var grdInvoices = null;
    var grdInvoicesElm = $("#grdInvoices");
    var isdisabled;
    var isclosed;
    var returninvarr = [];

    var closedrecordstatus = "K2";

    var scr, inv, lns, rlns;

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
                { id: "#btnPrint", selectionrequired: true },
                { id: "#btnTransfer", selectionrequired: true }

            ]
        },
        {
            name: "lines",
            btns: []
        }, {
            name: "returnlines",
            btns: []
        }
    ];

    rlns = new function () {
        var self = this;
        var totalreturn = 0;
        var totalinvoice = 0;

        var grdInvoiceReturns = null;
        var alreadyIn = null;
        var inAnotherInvoice = null;
        var checkedlines = null;
        var grdInvoiceReturnsElm = $("#grdInvoiceReturns");


        var CheckIfAnotherInvoiceExist = function () {
			
			if (returninvarr.length === 0)
				return $.Deferred().resolve(0);
				
            var gridreq = {
                sort: [{ field: "IRL_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "IRL_RETURNINV", value: returninvarr, operator: "in", logic: "and" },
                        { field: "IRL_INVOICECODE", value: selectedrecord.INV_CODE, operator: "neq", logic: "and" }
                    ]
                },
                action : "CNT"
            };

            return tms.Ajax({
                url: "/Api/ApiInvoiceReturnLines/List",
                data: JSON.stringify(gridreq)
            });
        };
        var CheckIfAlreadyAdded = function () {
			
			if (returninvarr.length === 0)
				return $.Deferred().resolve(0);
			
            var gridreq = {
                sort: [{ field: "IRL_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "IRL_RETURNINV", value: returninvarr, operator: "in", logic: "and" },
                        { field: "IRL_INVOICECODE", value: selectedrecord.INV_CODE, operator: "eq", logic: "and" }
                    ]
                },
                action: "CNT"
            };

            return tms.Ajax({
                url: "/Api/ApiInvoiceReturnLines/List",
                data: JSON.stringify(gridreq)
            });
        };
        var Save = function () {
            var lines = [];
            var error = false;
            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                if (parseInt(line[0].dataset.max) < parseInt(line[0].value)) {
                    error = true;
                }

                if (line[0].value > 0) {
                    var o = {
                        IRL_ID: line[0].dataset.rec || 0,
                        IRL_RETURNINV: line[0].dataset.inv,
                        IRL_DETAILID: line[0].dataset.detailid,
                        IRL_DETAILTYPE: line[0].dataset.detailtype,
                        IRL_INVOICECODE: selectedrecord.INV_CODE,
                        IRL_TASK: line[0].dataset.tsk,
                        IRL_ACTIVITY: line[0].dataset.activity,
                        IRL_RETURNTOTAL: line[0].value,
                        IRL_CREATEDBY: user,
                        IRL_CREATED: tms.Now()
                    }
                    lines.push(o);
                }
            }
            if (error) {
                msgs.error(applicationstrings[lang].returnhigherthanmax);
                return $.Deferred().reject();
            }
            var object = JSON.stringify({
                returnlines: lines,
                invoiceID: selectedrecord.INV_CODE
            });

            return tms.Ajax({
                url: "/Api/ApiInvoiceReturnLines/SaveReturnList",
                data: object,
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                }
            });
        };
        var ApplyAllRetrun = function () {
            var inputs = $(".returnvalue");
            totalreturn = 0;
            for (var i = 0; i < inputs.length; i++) {
                if ($(inputs[i]).data("max") > 0) {
                    var value = ($(inputs[i]).data("max") * $("#allreturn").val()) / 100;
                    $(inputs[i]).val(parseFloat(value).fixed(constants.pricedecimals));
                    totalreturn += parseFloat(parseFloat(value).fixed(constants.pricedecimals)) || 0;
                }
            }
            $("#grdInvoiceReturnAmount span.returnamount").html(
                totalreturn.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }));
        };
        var GridDataBound = function (e) {

            totalreturn = 0;
            totalinvoice = 0;

            tms.NumericInput();

            var data = grdInvoiceReturns.GetData();
            grdInvoiceReturnsElm.find("#btnSaveReturnLines").off("click").on("click", function () {
                checkedlines = grdInvoiceReturnsElm.find("input[data-name=\"returnvalues\"]");
                var returncount = 0;
                for (var i = 0; i < checkedlines.length; i++) {
                    var line = $(checkedlines[i]);
                    if (line[0].value > 0) {
                        returncount++;
                    }
                }
                if (returncount === 0) {
                    msgs.error(applicationstrings[lang].invlinenotselected);
                    return $.Deferred().reject();
                } else {
                    Save();
                }
            });
            grdInvoiceReturnsElm.find(".returnvalue").off("change").on("change", function () {
                totalreturn = 0;
                $('.returnvalue').each(function () {
                    totalreturn += parseFloat(this.value);
                });
                grdInvoiceReturnsElm.find("#grdInvoiceReturnAmount span.returnamount").html(
                    totalreturn.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }));
            });

            $.each(data,
                function () {
                    totalreturn += parseFloat(this.SIL_ALREADYRETURNED) || 0;
                    totalinvoice += parseFloat(this.SIL_TOTAL) || 0;
                });

            grdInvoiceReturnsElm.find("#grdInvoiceReturnAmount").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].invtotal +
                ": </strong><span class=\"totalamount\">" +
                totalinvoice.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) + "</span>" +
                " <strong>" +
            applicationstrings[lang].returntotal +
                ": </strong><span class=\"returnamount\"> " +
                totalreturn.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                "</span></span>");
        };
        this.List = function () {
            $("#allreturn").val("");
            var gridfilter = [];
            return $.when(CheckIfAlreadyAdded()).done(function (d1) {
                return $.when(CheckIfAnotherInvoiceExist()).done(function (d2) {
                    if (selectedrecord) {
                        totalreturn = 0;
                        gridfilter.push({ field: "SIL_INVOICE", value: returninvarr, operator: "in", logic: "and" });
                        gridfilter.push({ field: "SIL_INVOICESTATUS", value: "K2", operator: "eq", logic: "and" });
                        if (d1.data > 0) {
                            gridfilter.push({field: "SIL_IRLINVOICECODE", value: selectedrecord.INV_CODE, operator: "eq", logic: "and" });
                        }
                        else {
                            if (d2.data && d2.data.length > 0) {
                                gridfilter.push({ field: "SIL_IRLID", operator: "isnull", logic: "and" });
                            }
                        }
                    }
                    if (grdInvoiceReturns) {
                        grdInvoiceReturns.ClearSelection();
                        grdInvoiceReturns.RunFilter(gridfilter);
                    } else {
                        grdInvoiceReturns = new Grid({
                            keyfield: "SIL_ID",
                            columns: [
                                {
                                    type: "number",
                                    field: "SIL_INVOICE",
                                    title: gridstrings.invoicereturn[lang].invoice,
                                    width: 150
                                },
                                {
                                    type: "string",
                                    field: "SIL_INVOICENO",
                                    title: gridstrings.invoicereturn[lang].invoiceNo,
                                    width: 150
                                },
                                {
                                    type: "number",
                                    field: "SIL_TASK",
                                    title: gridstrings.invoicereturn[lang].task,
                                    width: 150
                                },
                                {
                                    type: "number",
                                    field: "SIL_ACTIVITY",
                                    title: gridstrings.invoicereturn[lang].activity,
                                    width: 150
                                },
                                {
                                    type: "string",
                                    field: "SIL_DESC",
                                    title: gridstrings.invoicereturn[lang].desc,
                                    width: 350
                                },
                                {
                                    type: "na",
                                    field: "txtline4",
                                    template: "<div style=\"text-align:center;\">" +
                                        "<b><span style=\"float:left;\">#=  parseFloat(SIL_TOTAL).fixed(constants.pricedecimals)  #</span></b>" +
                                        "</div>",
                                    title: gridstrings.invoicereturn[lang].totalprice,
                                    filterable: false,
                                    sortable: false,
                                    width: 250
                                },
                                {
                                    type: "na",
                                    field: "txtline2",
                                    template:
                                        "<div style=\"text-align:center;\">" +
                                            "<input data-rec=\"#= SIL_IRLID #\" data-detailtype=\"#= SIL_TYPE #\" data-detailid=\"#= SIL_DETAILID #\" data-activity=\"#= SIL_ACTIVITY #\" data-tsk=\"#= SIL_TASK #\" data-inv=\"#= SIL_INVOICE #\" data-name=\"returnvalues\"  data-prc=\"#= SIL_ID #\" style=\"width:220px;\" value=\"#= parseFloat(SIL_ALREADYRETURNED).fixed(constants.pricedecimals) #\" type=\"text\" calc-group=\"1\" min=\"0\" data-max=\"#= SIL_TOTAL #\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control returnvalue\" id=\"return-#= SIL_ID #\" />" +
                                            "</div>",
                                    title: gridstrings.invoicereturn[lang].return,
                                    filterable: false,
                                    sortable: false,
                                    width: 250
                                },
                                {
                                    type: "string",
                                    field: "SIL_CURR",
                                    title: gridstrings.invoicereturn[lang].curr,
                                    width: 350
                                },
                            ],
                            fields: {
                                SIL_TASK: { type: "number" },
                                SIL_INVOICE: { type: "number" },
                                SIL_ACTIVITY: { type: "number" }
                            },
                            datasource: "/Api/ApiInvoice/InvoiceLineDeteils",
                            selector: "#grdInvoiceReturns",
                            name: "grdInvoiceReturns",
                            height: constants.defaultgridheight - 125,
                            primarycodefield: "SIL_ID",
                            primarytextfield: "SIL_DESC",
                            visibleitemcount: 10,
                            filterlogic: "or",
                            filter: gridfilter,
                            sort: [{ field: "SIL_ID", dir: "desc" }],
                            toolbarColumnMenu: true,
                            loadall: true,
                            toolbar: {
                                left: [
                                    "<button class=\"btn btn-default btn-sm\" id=\"btnSaveReturnLines\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].save#</button>",
                                    "<div style=\"padding-left: 5px;\" class=\"pull-left\" id=\"grdInvoiceReturnAmount\"></div><div class=\"pull-left\"></div>"
                                ],
                                right: [
                                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].download #\" download=\"invoices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                                ]
                            },
                            databound: GridDataBound
                        });
                    }

                });            
            });           
        };
        var RegisterUIEvents = function () {
            $("#btnApplyReturn").on("click", ApplyAllRetrun);

        };
        RegisterUIEvents();
    };
    lns = new function () {
        var self = this;
        var grdInvoiceLines = null;
        var grdInvoiceLinesElm = $("#grdInvoiceLines");
        var commentsHelper;
        var documentsHelper;

        var BuildFilter = function () {
            var gridfilter = [];
            if (selectedrecord) {
                var datestart = selectedrecord.INV_STARTDATE;
                var dateend = selectedrecord.INV_ENDDATE;
                if (dateend)
                    dateend = moment(dateend).add(1, "days");

                if (selectedrecord.INV_TSKCATEGORY)
                    gridfilter.push({ field: "TSA_TSKCATEGORY", value: selectedrecord.INV_TSKCATEGORY, operator: "eq", logic: "and" });
                if (selectedrecord.INV_CUSTOMER)
                    gridfilter.push({ field: "TSA_TSKCUSTOMER", value: selectedrecord.INV_CUSTOMER, operator: "eq", logic: "and" });
                if (selectedrecord.INV_SUPPLIER)
                    gridfilter.push({ field: "TSA_SUPPLIER", value: selectedrecord.INV_SUPPLIER, operator: "eq", logic: "and" });
                if (datestart && dateend)
                    gridfilter.push({ field: "TSA_TSKCOMPLETED", value: datestart, value2: dateend, operator: "between", logic: "and" });
                if (datestart && !dateend)
                    gridfilter.push({ field: "TSA_TSKCOMPLETED", value: datestart, operator: "gte", logic: "and" });
                if (!datestart && dateend)
                    gridfilter.push({ field: "TSA_TSKCOMPLETED", value: dateend, operator: "lte", logic: "and" });

                gridfilter.push({ field: "TSA_TSKIPP", value: "+", operator: "eq", logic: "and" });
                gridfilter.push({ field: "TSA_TSKORGANIZATION", value: selectedrecord.INV_ORG, operator: "eq", logic: "and" });

                if (selectedrecord.INV_STATUS !== "A")
                    gridfilter.push({ field: "TSA_INVOICE", value: selectedrecord.INV_CODE, operator: "eq", logic: "and" });
                else
                    gridfilter.push({ field: "TSA_INVOICE", operator: "isnull", logic: "and" });
            }

            return gridfilter;
        }
        var Save = function () {
            var checkedlines = grdInvoiceLinesElm.find("input[data-name=\"chkLine\"]:checked");
            var linearr = [];
            if (checkedlines.length === 0) {
                msgs.error(applicationstrings[lang].invlinenotselected);
                return $.Deferred().reject();
            }

            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                linearr.push(line.data("id"));
            }

            var o = JSON.stringify({
                Invoice: selectedrecord.INV_CODE,
                Lines: linearr
            });

            return tms.Ajax({
                url: "/Api/ApiInvoice/SaveLines",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                }
            });
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdInvoiceLines input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var CalculateSum = function () {
            var data = grdInvoiceLines.GetData();
            var checkedlines = grdInvoiceLinesElm.find("input[data-name=\"chkLine\"]:checked");
            var sumselected = 0;
            var sumall = 0;
            $.each(data, function () {
                var $dataitem = this;
                var item = $.grep(checkedlines, function (i) { return $(i).data("id") === $dataitem.TSA_ID; });
                if (item.length > 0)
                    sumselected += parseFloat($dataitem.TSA_MSCTOTAL) || 0;
                sumall += parseFloat($dataitem.TSA_MSCTOTAL) || 0;
            });
            $("#grdInvoiceLineSum")
                .html("<span style=\"color:#cf192d\"><strong>"
                    + applicationstrings[lang].total + ": </strong>"
                    + sumselected.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals })
                    + " / " + sumall.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals })
                    + " " + selectedrecord.INV_ORGCURR
                    + "</span>");
            $("#grdInvoiceLineSumDiv").removeClass("hidden");
        }
        var GridDataBound = function (e) {
            var checkinputs = $("#grdInvoiceLines input[data-name=\"chkLine\"]:not(:disabled)");
            grdInvoiceLinesElm.find("button.btn-delete").prop("disabled", !isdisabled || selectedrecord._status.STA_PCODE === "C");
            grdInvoiceLinesElm.find(".btn-comments").unbind("click").click(function () {
                var id = $(this).data("task");
                commentsHelper.showCommentsModal({ subject: "TASK", source: id });
            });
            grdInvoiceLinesElm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).data("task");
                documentsHelper.showDocumentsModal({ subject: "TASK", source: id });
            });
            grdInvoiceLinesElm.find(".btn-supinvlinedetails").unbind("click").click(function () {
                var task = $(this).data("task");
                var activityline = $(this).data("activityline");
                gridModal.show({
                    modaltitle: gridstrings.supinvlinedetails[lang].title,
                    listurl: "/Api/ApiInvoice/ListLineDetails",
                    keyfield: "SIL_ID",
                    codefield: "SIL_ID",
                    textfield: "SIL_DESC",
                    columns: [
                        { type: "date", field: "SIL_DATE", title: gridstrings.supinvlinedetails[lang].date, width: 200 },
                        { type: "string", field: "SIL_DESC", title: gridstrings.supinvlinedetails[lang].desc, width: 400 },
                        { type: "number", field: "SIL_QTY", title: gridstrings.supinvlinedetails[lang].qty, width: 200 },
                        { type: "string", field: "SIL_UOM", title: gridstrings.supinvlinedetails[lang].uom, width: 150 },
                        { type: "price", field: "SIL_UNITPRICE", title: gridstrings.supinvlinedetails[lang].unitprice, width: 200 },
                        { type: "price", field: "SIL_TOTAL", title: gridstrings.supinvlinedetails[lang].total, width: 200 },
                        { type: "string", field: "SIL_CURR", title: gridstrings.supinvlinedetails[lang].curr, width: 150 }
                    ],
                    fields: {
                        SIL_DATE: { type: "date" },
                        SIL_UNITPRICE: { type: "number" },
                        SIL_QTY: { type: "number" },
                        SIL_TOTAL: { type: "number" }
                    },
                    filter: [
                        { field: "SIL_TASK", value: task, operator: "eq" },
                        { field: "SIL_ACTIVITY", value: activityline, operator: "eq" }
                    ]
                });
            });
            grdInvoiceLinesElm.find(".btn-delete").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiInvoice/RemoveLineFromInvoice",
                            data: JSON.stringify(id),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.List();
                            }
                        });
                    });
            });
            grdInvoiceLinesElm.find("#btnCheckAll").prop("disabled", isdisabled).off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdInvoiceLinesElm.find("#btnSaveLines").prop("disabled", isdisabled).off("click").on("click", Save);
            checkinputs.off("change").on("change", CalculateSum);
            CalculateSum();
        };
        this.List = function () {
            $.when(inv.LoadSelected()).done(function () {
                var gridfilter = BuildFilter();
                if (grdInvoiceLines) {
                    grdInvoiceLines.ClearSelection();
                    grdInvoiceLines.RunFilter(gridfilter);
                } else {
                    var c = [
                        {
                            type: "na",
                            title: "#",
                            field: "chkLine",
                            template:
                                "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" #= TSA_INVOICE ? 'checked=\"checked\"' : '' #  #= TSA_INVOICE ? 'disabled=\"disabled\"' : '' # data-id=\"#= TSA_ID #\" /><label></label>",
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
                                "<button type=\"button\" data-task=\"#= TSA_TASK #\" data-activityline=\"#= TSA_LINE #\" title=\"#= applicationstrings[lang].comments #\" class=\"btn btn-default btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSA_TSKCMNTCOUNT #</span></button> " +
                                "<button type=\"button\" data-task=\"#= TSA_TASK #\" data-activityline=\"#= TSA_LINE #\" title=\"#= applicationstrings[lang].documents #\" class=\"btn btn-default btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSA_TSKDOCCOUNT # </span></button> " +
                                "<button type=\"button\" data-task=\"#= TSA_TASK #\" data-activityline=\"#= TSA_LINE #\" title=\"#= applicationstrings[lang].linedetails #\" class=\"btn btn-default btn-sm btn-supinvlinedetails\"><i class=\"fa fa-list\"></i>  <span class=\"txt\">#= TSA_MSCQTY # </span></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "TSA_TASK",
                            title: gridstrings.invoicelines[lang].taskno,
                            width: 100,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKSHORTDESC",
                            title: gridstrings.invoicelines[lang].description,
                            width: 350,
                            filterable: false
                        },
                        {
                            type: "number",
                            field: "TSA_LINE",
                            title: gridstrings.invoicelines[lang].activity,
                            width: 100,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.invoicelines[lang].description,
                            width: 350,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKCUSTOMER",
                            title: gridstrings.invoicelines[lang].customer,
                            width: 200,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKCUSTOMERDESC",
                            title: gridstrings.invoicelines[lang].customerdesc,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKBRANCH",
                            title: gridstrings.invoicelines[lang].branch,
                            width: 200,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKBRANCHDESC",
                            title: gridstrings.invoicelines[lang].branchdesc,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "price",
                            field: "TSA_MSCTOTAL",
                            title: gridstrings.invoicelines[lang].total,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKCATEGORY",
                            title: gridstrings.invoicelines[lang].category,
                            width: 200,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TSKCATEGORYDESC",
                            title: gridstrings.invoicelines[lang].categorydesc,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "datetime",
                            field: "TSA_CREATED",
                            title: gridstrings.invoicelines[lang].created,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_CREATEDBY",
                            title: gridstrings.invoicelines[lang].createdby,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_TRADE",
                            title: gridstrings.invoicelines[lang].trade,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "datetime",
                            field: "TSA_TSKREQUESTED",
                            title: gridstrings.invoicelines[lang].requested,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "datetime",
                            field: "TSA_DATECOMPLETED",
                            title: gridstrings.invoicelines[lang].completed,
                            width: 250,
                            filterable: false
                        },
                        {
                            type: "string",
                            field: "TSA_MOBILENOTE",
                            title: gridstrings.invoicelines[lang].mobilenote,
                            width: 250,
                            filterable: false
                        }                  
                    ];

                    grdInvoiceLines = new Grid({
                        keyfield: "TSA_ID",
                        columns: c,
                        fields: {
                            TSA_ID: { type: "number" },
                            TSA_DATECOMPLETED: { type: "date" },
                            TSA_CREATED: { type: "date" },
                            TSA_TSKREQUESTED: { type: "date" },
                            TSA_MSCTOTAL: { type: "number" }
                        },
                        datasource: "/Api/ApiInvoice/ListLines",
                        selector: "#grdInvoiceLines",
                        name: "grdInvoiceLines",
                        height: constants.defaultgridheight - 150,
                        primarycodefield: "TSA_ID",
                        primarytextfield: "TSA_DESC",
                        visibleitemcount: 10,
                        filter: gridfilter,
                        filterlogic: "or",
                        sort: [{ field: "TSA_ID", dir: "desc" }],
                        toolbarColumnMenu: true,
                        loadall: true,
                        toolbar: {
                            left: [
                                "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>",
                                "<button class=\"btn btn-default btn-sm\" id=\"btnSaveLines\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].save#</button>"
                            ],
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"InvoiceLines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                            ]
                        },
                        databound: GridDataBound
                    });
                }
            });
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
                btnaddcomment: "#addTaskComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"cmd\"] button.btn-comments span.txt",
                commentsdiv: "#tskcomments"
            });
        };
        RegisterUIEvents();
    };
    inv = new function () {
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var self = this;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMINVOICES", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.INV_CODE, operator: "eq" }
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
                    callback: function (d) {
                        $("#type").val("");
                        $("#customer").val("");
                        tooltip.hide("#type");
                        tooltip.hide("#customer");
                        $("#invoicetotalcurr").val(d ? d.ORG_CURRENCY : "");
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
                        { field: "TYP_ENTITY", value: "INVOICE", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "INVOICE",
                                source: selectedrecord ? selectedrecord.INV_CODE : "0",
                                type: data.TYP_CODE
                            });
                            $("#returnInvoices").tagsinput("removeAll");
                            $("#returnInvoiceDiv").addClass("hidden");
                            if (data.TYP_CODE === "IADE") {
                                $("#returnInvoiceDiv").removeClass("hidden");
                            }
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
                        { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 300 },
                        { type: "string", field: "CUS_PPTASKCNT", title: gridstrings.customer[lang].pptaskcnt, width: 100 }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnsupplier").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.suppliers[lang].title,
                    listurl: "/Api/ApiSuppliers/List",
                    keyfield: "SUP_CODE",
                    codefield: "SUP_CODE",
                    textfield: "SUP_DESC",
                    returninput: "#supplier",
                    columns: [
                        { type: "string", field: "SUP_CODE", title: gridstrings.suppliers[lang].code, width: 100 },
                        { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 400 }
                    ],
                    callback: function (d) {
                        $("#returnInvoices").tagsinput("removeAll");
                        $("#supplier").data("tfs", d ? d.SUP_CHK01 : "-");
                    }
                });
            });
            $("#btntaskcategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#taskcategory",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CAT_CODE", value: "*", operator: "neq" }]
                });
            });
            $("#btnReturnInvoices").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.invoices[lang].title,
                    listurl: "/Api/ApiInvoice/List",
                    keyfield: "INV_CODE",
                    codefield: "INV_CODE",
                    textfield: "INV_CODE",
                    returninput: "#returnInvoices",
                    multiselect: true,
                    columns: [
                        { type: "number", field: "INV_CODE", title: gridstrings.salesinvoices[lang].code, width: 100 },
                        { type: "string", field: "INV_DESC", title: gridstrings.salesinvoices[lang].desc, width: 400 },
                        { type: "string", field: "INV_SUPPLIER", title: gridstrings.salesinvoices[lang].supplier, width: 400 }

                    ],
                    filter: [
                        { field: "INV_STATUS", value: closedrecordstatus, operator: "eq" },
                        { field: "INV_TYPE", value: "IADE", operator: "neq" },
                        { field: "INV_SUPPLIER", value: $("#supplier").val(), operator: "eq" }
                    ],
                    sort: [{ field: "INV_CODE", dir: "desc" }]
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
                callback: function (d) {
                    $("#type").val("");
                    $("#customer").val("");
                    tooltip.hide("#type");
                    tooltip.hide("#customer");
                    $("#invoicetotalcurr").val(d ? d.ORG_CURRENCY : "");
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
                    { field: "TYP_ENTITY", value: "INVOICE", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "INVOICE",
                            source: selectedrecord ? selectedrecord.INV_CODE : "0",
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
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }]
            });
            $("#supplier").autocomp({
                listurl: "/Api/ApiSuppliers/List",
                geturl: "/Api/ApiSuppliers/Get",
                field: "SUP_CODE",
                textfield: "SUP_DESC",
                callback: function (d) {
                    $("#supplier").data("tfs", d ? d.SUP_CHK01 : "-");
                }
            });
            $("#taskcategory").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [
                    { field: "CAT_CODE", value: "*", operator: "neq" }
                ]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "INVOICE",
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
        var CalculateInvoiceTotalWithInterest = function (v, curr) {
            if (v) {
                var rate = tmsparameters["INTERESTRATE"];
                var diff = parseInt(v * rate / 100);
                $("#interestamount").val(diff.toFixed(constants.pricedecimals));
                $("#invoicetotalwithinterest").val((v + diff).toFixed(constants.pricedecimals));
                $("#interestamountcurr").val(curr);
                $("#invoicetotalwithinterestcurr").val(curr);
            }
            else {
                $("#interestamount").val("");
                $("#invoicetotalwithinterest").val("");
                $("#interestamountcurr").val("");
                $("#invoicetotalwithinterestcurr").val("");
            }
           
        }
        var FillUserInterface = function () {

            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.INV_CODE);
            $("#org").val(selectedrecord.INV_ORG);
            $("#type").val(selectedrecord.INV_TYPE);
            $("#supplier").val(selectedrecord.INV_SUPPLIER);
            $("#desc").val(selectedrecord.INV_DESC).prop("disabled", isdisabled);
            $("#customer").val(selectedrecord.INV_CUSTOMER).prop("disabled", isdisabled);
            $("#taskcategory").val(selectedrecord.INV_TSKCATEGORY).prop("disabled", isdisabled);
            $("#taskcompletedstart").val(selectedrecord.INV_STARTDATE ? moment(selectedrecord.INV_STARTDATE).format(constants.dateformat) : "").prop("disabled", isdisabled);
            $("#taskcompletedend").val(selectedrecord.INV_ENDDATE ? moment(selectedrecord.INV_ENDDATE).format(constants.dateformat) : "").prop("disabled", isdisabled);
            $("#invoiceno").val(selectedrecord.INV_INVOICE).prop("disabled", $.inArray(selectedrecord.INV_STATUS, ["A", "H", "K","H2"]) === -1);
            $("#invoicedate").val(selectedrecord.INV_INVOICEDATE ? moment(selectedrecord.INV_INVOICEDATE).format(constants.dateformat) : "").prop("disabled", $.inArray(selectedrecord.INV_STATUS, ["A", "H", "K","H2"]) === -1);
            $("#invoicetotal").val(selectedrecord.INV_TOTAL).prop("disabled", $.inArray(selectedrecord.INV_STATUS, ["A", "H", "K","H2"]) === -1);
            $("#invoicetotalcurr").val(selectedrecord.INV_ORGCURR);
            $("#createdby").val(selectedrecord.INV_CREATEDBY);
            $("#orderNo").val(selectedrecord.INV_ORDERNODESC);
            $("#created").val(moment(selectedrecord.INV_CREATED).format(constants.longdateformat));

            $("#supplier").data("tfs", selectedrecord.INV_INTEREST);
            $("#interest").prop("checked", selectedrecord.INV_INTEREST === '+');

            if (selectedrecord.INV_INTEREST === '+') {
                $("div.tfs").removeClass("hidden");
                if (selectedrecord.INV_TOTALWITHINTEREST != null && selectedrecord.INV_TOTAL != null) {
                    var diff = selectedrecord.INV_TOTALWITHINTEREST - selectedrecord.INV_TOTAL;
                    $("#interestamount").val(diff.toFixed(constants.pricedecimals));
                    $("#invoicetotalwithinterest").val(selectedrecord.INV_TOTALWITHINTEREST.toFixed(constants.pricedecimals));
                    $("#interestamountcurr").val(selectedrecord.INV_ORGCURR);
                    $("#invoicetotalwithinterestcurr").val(selectedrecord.INV_ORGCURR);
                }
                $("#invoicetotal").off("change").on("change", function () {
                    var v = parseFloat($(this).val());
                    CalculateInvoiceTotalWithInterest(v, selectedrecord.INV_ORGCURR);
                });
            }
            else {
                $("div.tfs").addClass("hidden");
                $("#invoicetotal").off("change");
                CalculateInvoiceTotalWithInterest(null,null);
            }

            $("#returnInvoiceDiv").addClass("hidden");
            if (selectedrecord.INV_TYPE === "IADE") {
                $("#returnInvoiceDiv").removeClass("hidden");
            }

            $("#status").data("code", selectedrecord._status.STA_CODE);
            $("#status").data("pcode", selectedrecord._status.STA_PCODE);
            $("#status").data("text", selectedrecord._status.STA_DESCF);
            $("#btntaskcategory").prop("disabled", isdisabled);
            $("#btnReturnInvoices").prop("disabled", isdisabled);
            $("#btncustomer").prop("disabled", isdisabled);

            tooltip.show("#org", selectedrecord.INV_ORGDESC);
            tooltip.show("#type", selectedrecord.INV_TYPEDESC);
            tooltip.show("#customer", selectedrecord.INV_CUSTOMERDESC);
            tooltip.show("#supplier", selectedrecord.INV_SUPPLIERDESC);
            tooltip.show("#taskcategory", selectedrecord.INV_TSKCATEGORYDESC);

            $("#btnBrowse").removeAttr("disabled");
            $("#addComment,#fu,#comment").prop("disabled", false);

            commentsHelper.showCommentsBlock({ subject: "INVOICE", source: selectedrecord.INV_CODE });
            documentsHelper.showDocumentsBlock({ subject: "INVOICE", source: selectedrecord.INV_CODE });
            LoadStatuses({
                pcode: selectedrecord._status.STA_PCODE,
                code: selectedrecord._status.STA_CODE,
                text: selectedrecord._status.STA_DESCF
            });
        };
        var FillReturnInvoices = function (returnInvoices) {
            $("#returnInvoices").tagsinput("removeAll");
            if (returnInvoices && returnInvoices.length > 0) {

                for (var i = 0; i < returnInvoices.length; i++) {
                    var invoiceitem = returnInvoices[i];
                    $("#returnInvoices").tagsinput("add", { id: invoiceitem.INV_CODE, text: invoiceitem.INV_CODE }, ["ignore"]);
                }
            }
        };
        var CheckInvoiceDate = function () {
            return true;
        }
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiInvoice/Get",
                data: JSON.stringify((selectedrecord || selectedrecord).INV_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedrecord._status = d.stat;
                    isdisabled = $.inArray(selectedrecord.INV_STATUS, ["A"]) === -1;
                    isclosed = $.inArray(selectedrecord.INV_STATUS, ["H"]) === -1;
                    FillUserInterface();
                    returninvarr = d.returnInvoices != null ? d.returnInvoices.map(function (e) { return e.INV_CODE; }) : [];
                    FillReturnInvoices(d.returnInvoices);
                    customFieldsHelper.loadCustomFields({
                        subject: "INVOICE",
                        source: selectedrecord.INV_CODE,
                        type: $("#type").val()
                    });
                    console.log(d.mikro);
                }
            });
        };
        this.Save = function () {
            if (!CheckInvoiceDate())
                return $.Deferred().reject();

            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "INVOICE",
                source: selectedrecord ? selectedrecord.INV_CODE : null,
                type: $("#type").val()
            });
            var o = JSON.stringify(
                {
                    Invoice: {
                        INV_CODE: (selectedrecord) ? selectedrecord.INV_CODE : 0,
                        INV_ORG: $("#org").val(),
                        INV_TYPEENTITY: "INVOICE",
                        INV_TYPE: $("#type").val(),
                        INV_DESC: $("#desc").val(),
                        INV_STATUSENTITY: "INVOICE",
                        INV_STATUS: $("#status").val(),
                        INV_CUSTOMER: ($("#customer").val() || null),
                        INV_RETURNINVOICE: ($("#returnInvoices").val() || null),
                        INV_TSKCATEGORY: ($("#taskcategory").val() || null),
                        INV_INVOICE: ($("#invoiceno").val() || null),
                        INV_TOTAL: ($("#invoicetotal").val() || null),
                        INV_TOTALWITHINTEREST: ($("#invoicetotalwithinterest").val() || null),
                        INV_SUPPLIER: $("#supplier").val(),
                        INV_INTEREST: $("#supplier").data("tfs"),
                        INV_INVOICEDATE: ($("#invoicedate").val() ? moment.utc($("#invoicedate").val(), constants.dateformat) : null),
                        INV_STARTDATE: ($("#taskcompletedstart").val() ? moment.utc($("#taskcompletedstart").val(), constants.dateformat) : null),
                        INV_ENDDATE: ($("#taskcompletedend").val() ? moment.utc($("#taskcompletedend").val(), constants.dateformat) : null),
                        INV_ORDERNO: selectedrecord != null ? selectedrecord.INV_ORDERNO : null,
                        INV_CREATED: selectedrecord != null ? selectedrecord.INV_CREATED : tms.Now(),
                        INV_CREATEDBY: selectedrecord != null ? selectedrecord.INV_CREATEDBY : user,
                        INV_UPDATED: selectedrecord != null ? tms.Now() : null,
                        INV_UPDATEDBY: selectedrecord != null ? user : null,
                        INV_RECORDVERSION: selectedrecord != null ? selectedrecord.INV_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiInvoice/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r.Invoice;
                    $("#Invoice").val(selectedrecord.INV_CODE);
                    $("#InvoiceType").val(selectedrecord.INV_TYPE);
                    self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiInvoice/DelRec",
                            data: JSON.stringify(selectedrecord.INV_CODE),
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
            $("#type").val("");
            $("#supplier").val("");
            $("#orderNo").val("");
            $("#desc").val("").prop("disabled", false);
            $("#customer").val("").prop("disabled", false);
            $("#customer").val("").prop("disabled", false);
            $("#taskcategory").val("").prop("disabled", false);
            $("#taskcompletedstart").val("").prop("disabled", false);
            $("#taskcompletedend").val("").prop("disabled", false);
            $("#invoiceno").val("").prop("disabled", false);
            $("#invoicedate").val("").prop("disabled", false);
            $("#invoicetotal").val("").prop("disabled", false);
            $("#invoicetotalcurr").val("");
            $("#btntaskcategory").prop("disabled", false);
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#returnInvoices").tagsinput("removeAll");

            $("#interest").prop("checked", false);
            $("div.tfs").addClass("hidden");
            $("#invoicetotal").off("change");
            $("#supplier").data("tfs", null);
            CalculateInvoiceTotalWithInterest(null, null);

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
            tooltip.hide("#taskcategory");
            tooltip.hide("#supplier");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        this.Print = function () {
            $("#modalprint").modal("show");
        }
        var ItemSelect = function (row) {
            selectedrecord = grdInvoices.GetRowDataItem(row);
            $("#Invoice").val(selectedrecord.INV_CODE);
            $("#InvoiceType").val(selectedrecord.INV_TYPE);
            $(".page-header h6").html(selectedrecord.INV_CODE + " - " + selectedrecord.INV_DESC);
            scr.Configure();
            tms.Tab();
        };
        var ResetSidebarFilter = function () {
            $("#datecreated_start").val("");
            $("#datecreated_end").val("");
            $("#fcustomer").val("");
        };
        var GetSidebarFilter = function () {
            var gridfilter = [];

            var datestart = $("#datecreated_start").val().toDate();
            var dateend = $("#datecreated_end").val().toDate();

            if (dateend)
                dateend = moment(dateend, constants.dateformat).add(1, "days");

            var customer = $("#fcustomer").val();

            if (datestart && dateend)
                gridfilter.push({ field: "INV_CREATED", value: datestart, value2: dateend, operator: "between", logic: "and" });
            if (datestart && !dateend)
                gridfilter.push({ field: "INV_CREATED", value: datestart, operator: "gte", logic: "and" });
            if (!datestart && dateend)
                gridfilter.push({ field: "INV_CREATED", value: dateend, operator: "lte", logic: "and" });
            if (customer)
                gridfilter.push({ field: "INV_CUSTOMERDESC", value: customer, operator: "contains", logic: "and" });

            return gridfilter;
        }
        var RunSidebarFilter = function () {
            var gridfilter = GetSidebarFilter();
            grdInvoices.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };
        var GridDataBound = function (e) {
            grdInvoicesElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
            grdInvoicesElm.find("[data-id]").unbind("dblclick").dblclick(function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
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
            if (grdInvoices) {
                grdInvoices.ClearSelection();
                grdInvoices.RunFilter(gridfilter);
            } else {
                grdInvoices = new Grid({
                    keyfield: "INV_CODE",
                    columns: [
                        {
                            type: "number",
                            field: "INV_CODE",
                            title: gridstrings.invoices[lang].invcode,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "INV_DESC",
                            title: gridstrings.invoices[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "INV_ORDERNODESC",
                            title: gridstrings.invoices[lang].orderno,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_STATUSDESC",
                            title: gridstrings.invoices[lang].status,
                            width: 250
                        },
                        { type: "string", field: "INV_ORG", title: gridstrings.invoices[lang].org, width: 150 },
                        {
                            type: "string",
                            field: "INV_TYPE",
                            title: gridstrings.invoices[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "INV_TYPEDESC",
                            title: gridstrings.invoices[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_TSKCATEGORY",
                            title: gridstrings.invoices[lang].taskcategory,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "INV_TSKCATEGORYDESC",
                            title: gridstrings.invoices[lang].taskcategorydesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_CUSTOMER",
                            title: gridstrings.invoices[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_CUSTOMERDESC",
                            title: gridstrings.invoices[lang].customerdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_SUPPLIER",
                            title: gridstrings.invoices[lang].supplier,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_SUPPLIERACCOUNT",
                            title: gridstrings.invoices[lang].supplieracc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_SUPPLIERDESC",
                            title: gridstrings.invoices[lang].supplierdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_INVOICE",
                            title: gridstrings.invoices[lang].invoiceno,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "INV_INVOICEDATE",
                            title: gridstrings.invoices[lang].invoicedate,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "INV_STARTDATE",
                            title: gridstrings.invoices[lang].startdate,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "INV_ENDDATE",
                            title: gridstrings.invoices[lang].enddate,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "INV_CREATED",
                            title: gridstrings.invoices[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_CREATEDBY",
                            title: gridstrings.invoices[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "INV_UPDATED",
                            title: gridstrings.invoices[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_UPDATEDBY",
                            title: gridstrings.invoices[lang].updatedby,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "INV_INTEREST",
                            title: gridstrings.invoices[lang].interest,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "INV_MATCHEDTOTAL",
                            title: gridstrings.invoices[lang].matchedtotal,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "INV_TOTAL",
                            title: gridstrings.invoices[lang].total,
                            width: 250
                        }
                    ],
                    fields: {
                        INV_CODE: { type: "number" },
                        INV_CREATED: { type: "date" },
                        INV_UPDATED: { type: "date" },
                        INV_INVOICEDATE: { type: "date" },
                        INV_STARTDATE: { type: "date" },
                        INV_ENDDATE: { type: "date" },
                        INV_TOTAL: { type: "number" }
                    },
                    datasource: "/Api/ApiInvoice/List",
                    selector: "#grdInvoices",
                    name: "grdInvoices",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "INV_CODE",
                    primarytextfield: "INV_DESC",
                    visibleitemcount: 10,
                    filterlogic: "or",
                    filter: gridfilter,
                    sort: [{ field: "INV_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"invoices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.Transfer = function () {
            if (!selectedrecord) 
                return $.Deferred().reject();

            return tms.Ajax({
                url: "/Api/ApiInvoice/Transfer",
                data: JSON.stringify(selectedrecord.INV_CODE),
                fn: function (d) {
                    if (d.result.Result.isSuccess) {
                        msgs.success(d.data);
                    }
                    else {
                        msgs.error(d.result.Result.Message);
                    }
                }
            });
        }
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
                        case "#returnlines":
                            $.when(self.LoadSelected()).done(function () {
                                rlns.List();
                            });
                            break;
                        case "#lines":
                            $.when(self.LoadSelected()).done(function () {
                                lns.List();
                            });
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
            $("#btnPrint").click(self.Print);
            $("#btnTransfer").click(self.Transfer);

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
            commentsHelper = new comments({ input: "#comment", btnaddcomment: "#addComment", commentsdiv: "#comments" });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            $("#filter").click(RunSidebarFilter);
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
        };
        this.BuildUI = function () {
            BuildModals();
            AutoComplete();
            RegisterUiEvents();
            self.List();

            scr.Configure();
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
                        inv.Save();
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        inv.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        inv.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        inv.Delete();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        inv.HistoryModal();
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
        inv.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());