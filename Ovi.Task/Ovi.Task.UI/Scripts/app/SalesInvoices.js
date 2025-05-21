(function () {
    var selectedrecord = null;
    var grdSalesInvoices = null;
    var grdSalesInvoicesElm = $("#grdSalesInvoices");
    var isdisabled;
    var isclosed;

    var returninvoicetype = "IADE";
    var openrecordstatus = "A";
    var closedrecordstatus = "K";

    var scr, psp, siv, rpsp, ptp;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnPrint", selectionrequired: true },
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
                { id: "#btnPrint", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnTransfer", selectionrequired: true }

            ]
        },
        {
            name: "psps",
            btns: []
        },
        {
            name: "returnpsp",
            btns: []
        },
        {
            name: "partialpayment",
            btns: []
        }
    ];

    ptp = new function () {
        var self = this;
        var selectedPartialPayment = null;
        var quoidlist = [];
        var grdPartialPayments = null;
        var grdPartialPaymentsElm = $("#grdPartialPayments");

        var AutoComplete = function () {
            $("#partialprogresspayment").autocomp({
                listurl: "/Api/ApiProgressPayment/List",
                geturl: "/Api/ApiProgressPayment/Get",
                field: "PSP_CODE",
                textfield: "PSP_DESC",
                termisnumeric: true,
                filter: [
                    { field: "PSP_CUSTOMER", value: selectedrecord.SIV_CUSTOMER, operator: "eq" },
                    { field: "PSP_CODE", value: quoidlist, operator: "nin" }
                ],
                callback: function (data) {

                }
            });
        };
        var BuildModals = function () {
            $("#btnpartialprogresspayment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.progresspayments[lang].title,
                    listurl: "/Api/ApiProgressPayment/List",
                    keyfield: "PSP_CODE",
                    codefield: "PSP_CODE",
                    textfield: "PSP_DESC",
                    returninput: "#partialprogresspayment",
                    columns: [
                        { type: "number", field: "PSP_CODE", title: gridstrings.progresspayments[lang].ppcode, width: 100 },
                        { type: "string", field: "PSP_ORG", title: gridstrings.progresspayments[lang].org, width: 200 },
                        { type: "string", field: "PSP_BRANCHDESC", title: gridstrings.progresspayments[lang].branchdesc, width: 200 },
                        { type: "string", field: "PSP_DESC", title: gridstrings.progresspayments[lang].desc, width: 200 },
                        { type: "datetime", field: "PSP_CREATED", title: gridstrings.progresspayments[lang].created, width: 200 }
                    ],
                    fields:
                    {
                        PSP_CREATED: { type: "date" },
                        PSP_CODE: { type: "number" }
                    },
                    filter: [
                        { field: "PSP_CUSTOMER", value: selectedrecord.SIV_CUSTOMER, operator: "eq" },
                        { field: "PSP_STATUS", value: "K2", operator: "neq" },
                        { field: "PSP_CODE", value: quoidlist, operator: "nin" }
                    ],
                    sort: [{ field: "PSP_CODE", dir: "desc" }],
                    callback: function (data) {

                    }
                });
            });
        };
        this.Remove = function () {
            if (selectedPartialPayment.PTP_ID) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPartialPayments/DelRec",
                            data: JSON.stringify(selectedPartialPayment.PTP_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.Save = function () {
            {
                if (!tms.Check("#partialpayment") || !selectedrecord)
                    return $.Deferred().reject();

                var partialpayment = JSON.stringify(
                    {
                        PTP_ID: selectedPartialPayment != null ? selectedPartialPayment.PTP_ID : 0,
                        PTP_DESC: $("#partialpaymentdesc").val(),
                        PTP_AMOUNT: $("#partialpaymentamount").val(),
                        PTP_PROGRESSPAYMENT: $("#partialprogresspayment").val(),
                        PTP_SALESINVOICE: selectedrecord.SIV_CODE,
                        PTP_CREATED: selectedPartialPayment != null ? selectedPartialPayment.PTP_CREATED : tms.Now(),
                        PTP_CREATEDBY: selectedPartialPayment != null ? selectedPartialPayment.PTP_CREATEDBY : user,
                        PTP_UPDATED: selectedPartialPayment != null ? tms.Now() : null,
                        PTP_UPDATEDBY: selectedPartialPayment != null ? user : null
                    });

                return tms.Ajax({
                    url: "/Api/ApiPartialPayments/Save",
                    contentType: "application/json",
                    data: partialpayment,
                    fn: function (d) {
                        msgs.success(d.data);
                        self.ResetUI();
                        self.List();
                    }
                });
            }
        };
        this.ResetUI = function () {
            selectedPartialPayment = null;
            $("#partialpaymentdesc").val("");
            $("#partialpaymentamount").val("");
            $("#partialprogresspayment").val("");

            $("#btnDeletePartialPayment").prop("disabled", true);
            if (selectedrecord.SIV_STATUS === "K") {
                $("#btnAddPartialPayment").attr("disabled", true);
                $("#btnSavePartialPayment").attr("disabled", true);
            }
        };
        var fillUserInterface = function () {
            tms.BeforeFill("#partialpayment");

            $("#partialpaymentdesc").val(selectedPartialPayment.PTP_DESC);
            $("#partialpaymentamount").val(parseFloat(selectedPartialPayment.PTP_AMOUNT).fixed(constants.pricedecimals));
            $("#partialprogresspayment").val(selectedPartialPayment.PTP_PROGRESSPAYMENT);

            if (selectedrecord.SIV_STATUS !== "K") {
                $("#btnDeletePartialPayment").prop("disabled", false);
            }
            else {
                $("#btnAddPartialPayment").attr("disabled", true);
                $("#btnSavePartialPayment").attr("disabled", true);
                $("#btnDeletePartialPayment").attr("disabled", true);
            }
        }
        var GridDataBound = function () {

        };
        var itemSelect = function (row) {
            selectedPartialPayment = grdPartialPayments.GetRowDataItem(row);
            fillUserInterface();
        };
        var GridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var gridfilter = [{ field: "PTP_SALESINVOICE", value: selectedrecord.SIV_CODE, operator: "eq", logic: "and" }];
            if (grdPartialPayments) {
                grdPartialPayments.ClearSelection();
                grdPartialPayments.RunFilter(gridfilter);
            } else {
                grdPartialPayments = new Grid({
                    keyfield: "PTP_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PTP_ID",
                            title: gridstrings.partialpay[lang].id,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PTP_DESC",
                            title: gridstrings.partialpay[lang].desc,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PTP_AMOUNT",
                            title: gridstrings.partialpay[lang].amount,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PTP_PROGRESSPAYMENT",
                            title: gridstrings.partialpay[lang].pp,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PTP_SALESINVOICE",
                            title: gridstrings.partialpay[lang].si,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PTP_CREATED",
                            title: gridstrings.partialpay[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PTP_CREATEDBY",
                            title: gridstrings.partialpay[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PTP_UPDATED",
                            title: gridstrings.partialpay[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PTP_UPDATEDBY",
                            title: gridstrings.partialpay[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        PTP_ID: { type: "number" },
                        PRL_CREATED: { type: "date" },
                        PTP_SALESINVOICE: { type: "number" },
                        PTP_PROGRESSPAYMENT: { type: "number" },
                        PTP_AMOUNT: { type: "number" },
                        PRL_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiPartialPayments/List",
                    selector: "#grdPartialPayments",
                    name: "grdPartialPayments",
                    height: 250,
                    primarycodefield: "PTP_ID",
                    primarytextfield: "PTP_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "PTP_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"purchaseorders.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabEvents = function () {
            $("#btnSavePartialPayment").click(self.Save);
            $("#btnAddPartialPayment").click(self.ResetUI);
            $("#btnDeletePartialPayment").click(self.Remove);

        };
        var GetProgressPayments = function () {
            var gridreq = {
                sort: [{ field: "PSP_CODE", dir: "asc" }],
                filter: {
                    filters: [{ field: "PSP_CUSTOMER", value: selectedrecord.SIV_CUSTOMER, operator: "eq", logic: "and" }]
                }
            };
            quoidlist = [];
            return tms.Ajax({
                url: "/Api/ApiProgressPayment/ListSalesInvoiceLines",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        quoidlist.push(d.data[i].PSP_CODE);
                    }
                }
            });
        };
        this.BuildTab = function () {
            self.List();
            self.ResetUI();
            $.when(GetProgressPayments()).done(function () {
                BuildModals();
                AutoComplete();
            });

        };
        var RegisterUIEvents = function () {
            RegisterTabEvents();

        };
        RegisterUIEvents();
    };
    rpsp = new function () {
        var self = this;
        var grdSalesInvoiceReturns = null;
        var grdSalesInvoiceReturnsELM = $("#grdSalesInvoiceReturns");
        var checkedlines = null;
        var totalreturn = 0;
        var progressPayments = null;
        var alreadyIn = null;

        var GridDataBound = function (e) {
            tms.NumericInput();
            var data = grdSalesInvoiceReturns.GetData();
            grdSalesInvoiceReturnsELM.find("#btnSaveReturnLines").off("click").on("click", function () {
                checkedlines = grdSalesInvoiceReturnsELM.find("input[data-name=\"returnvalues\"]");
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
            grdSalesInvoiceReturnsELM.find(".returnvalue").off("change").on("change", function () {
                totalreturn = 0;
                $(".returnvalue").each(function () {
                    totalreturn += parseFloat(this.value);
                });
                grdSalesInvoiceReturnsELM.find("#grdSalesInvoiceReturnsValue").html("<span style=\"color:#cf192d\"><strong> " +
                    applicationstrings[lang].returntotal +
                    ": </strong>" +
                    totalreturn.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    "</span>");
            });
            $("#btnSaveReturnLines").attr("disabled", true);
            if (selectedrecord.SIV_STATUS !== "K") {
                $("#btnSaveReturnLines").attr("disabled", false);
            }

            $(".returnvalue").change(function () {

            });

            $.each(data,
                function () {
                    totalreturn += parseFloat(this.PRC_RETURNPRICE) || 0;
                });

            grdSalesInvoiceReturnsELM.find("#grdSalesInvoiceReturnsValue").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].returntotal +
                ": </strong>" +
                totalreturn.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                "</span>");


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
                        SIR_ID: line[0].dataset.rec || 0,
                        SIR_PSPID: line[0].dataset.psp,
                        SIR_LINEID: line[0].dataset.prc,
                        SIR_SIVID: selectedrecord.SIV_CODE,
                        SIR_LINETOTAL: line[0].dataset.max,
                        SIR_RETURNTOTAL: line[0].value,
                        SIR_CREATED: tms.Now(),
                        SIR_CREATEDBY: user
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
                salesInvID: selectedrecord.SIV_CODE
            });

            return tms.Ajax({
                url: "/Api/ApiSalesInvoiceReturnLines/SaveReturnList",
                data: object,
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                }
            });
        };
        var GetProgressPayments = function () {
            progressPayments = null;
            var invoice = Array.from(selectedrecord.SIV_SALESINVOICE.split(","), Number);
            var gridreq = {
                sort: [{ field: "PSP_CODE", dir: "asc" }],
                filter: {
                    filters: [{ field: "PSP_SALESINVOICE", value: invoice, operator: "in", logic: "and" },
                        { field: "PSP_SALESINVOICEISRETURNED", value: "+", operator: "neq", logic: "and" }]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiProgressPayment/ListSalesInvoiceLines",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    progressPayments = d.data;
                }
            });
        };
        var BuildFilter = function () {
            var gridfilter = [];
            var quoidlist = [];
            for (var i = 0; i < progressPayments.length; i++) {
                quoidlist.push(progressPayments[i].PSP_CODE);
            }
            gridfilter.push({
                field: "PRC_PSPCODE",
                value: quoidlist,
                operator: "in",
                logic: "and"
            });
            return gridfilter;
        };
        var CheckAlreadyAddeds = function () {
            var quoidlist = [];

            for (var i = 0; i < progressPayments.length; i++) {
                quoidlist.push(progressPayments[i].PSP_CODE);
            }

            var gridreq = {
                sort: [{ field: "SIR_PSPID", dir: "asc" }],
                filter: {
                    filters: [{ field: "SIR_PSPID", value: quoidlist, operator: "in", logic: "and" }]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiSalesInvoiceReturnLines/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    alreadyIn = d.data;
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
            $("#grdSalesInvoiceReturnsValue").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].returntotal +
                ": </strong>" +
                totalreturn.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                "</span>");
        };
        this.List = function () {
            $("#allreturn").val("");
            if (selectedrecord) {
                totalreturn = 0;
                var gridfilter = null;
                $.when(GetProgressPayments()).done(function () {
                    $.when(CheckAlreadyAddeds()).done(function () {
                        var cols = [
                               {
                                   type: "number",
                                   field: "PRC_SALESINVOICE",
                                   title: gridstrings.progresspayments[lang].salesinvoiceno,
                                   width: 150
                               },
                               {
                                   type: "number",
                                   field: "PRC_PSPCODE",
                                   title: gridstrings.progresspayments[lang].ppcode,
                                   width: 150
                               },
                               {
                                   type: "string",
                                   field: "PRC_TYPEDESC",
                                   title: gridstrings.progresspayments[lang].desc,
                                   width: 350
                               },
                               {
                                   type: "number",
                                   field: "PRC_ACTLINE",
                                   title: "Aktivite",
                                   width: 150
                               },
                               {
                                   type: "na",
                                   field: "txtline4",
                                   template: "<div style=\"text-align:center;\">" +
                                       "<b><span style=\"float:left;\">#=  parseFloat((PRC_UNITPRICE + (PRC_USERUNITPRICE || 0)) * (PRC_QTY + (PRC_USERQTY || 0))).fixed(constants.pricedecimals)  #</span></b>" +
                                       "</div>",
                                   title: gridstrings.requesttopor[lang].totalprice,
                                   filterable: false,
                                   sortable: false,
                                   width: 250
                               },
                               {
                                   type: "na",
                                   field: "txtline2",
                                   template:
                                       "<div style=\"text-align:center;\">" +
                                           "<input data-rec=\"#= PRC_RETURNPRICEID #\" data-prc=\"#= PRC_ID #\" data-psp=\"#= PRC_PSPCODE #\" data-name=\"returnvalues\" data-line=\"#= PRC_ACTLINE #\" style=\"width:220px;\" value=\"#= parseFloat((PRC_RETURNPRICE || 0)).fixed(constants.pricedecimals) #\" type=\"text\" calc-group=\"1\" min=\"0\" data-max=\"#=  (PRC_UNITPRICE + (PRC_USERUNITPRICE || 0)) * (PRC_QTY + (PRC_USERQTY || 0))  #\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control returnvalue\" id=\"return-#= PRC_ID #\" />" +
                                           "</div>",
                                   title: "İade",
                                   filterable: false,
                                   sortable: false,
                                   width: 250
                               }
                        ];
                        if (selectedrecord.SIV_STATUS !== "A" || (alreadyIn && alreadyIn.length > 0)) {
                            var quoidlist = [];
                            var prclist = [];
                            gridfilter = [];
                            for (var i = 0; i < alreadyIn.length; i++) {
                                quoidlist.push(alreadyIn[i].SIR_PSPID);
                                prclist.push(alreadyIn[i].SIR_LINEID);
                            }
                            gridfilter.push({
                                field: "PRC_PSPCODE",
                                value: quoidlist,
                                operator: "in",
                                logic: "and"
                            });
                            gridfilter.push({
                                field: "PRC_ID",
                                value: prclist,
                                operator: "in",
                                logic: "and"
                            });
                        } else {
                            gridfilter = [];
                            gridfilter = BuildFilter();
                        }

                        grdSalesInvoiceReturns = new Grid({
                            keyfield: "PRC_PSPCODE",
                            columns: cols,
                            fields: {
                                PRC_SALESINVOICE: { type: "number" },
                                PRC_PSPCODE: { type: "number" },
                                PRC_ACTLINE: { type: "number" }
                            },
                            datasource: "/Api/ApiProgressPaymentPricing/List",
                            selector: "#grdSalesInvoiceReturns",
                            name: "grdSalesInvoiceReturns",
                            height: constants.defaultgridheight - 135,
                            primarycodefield: "PRC_PSPCODE",
                            primarytextfield: "PRC_TYPEDESC",
                            visibleitemcount: 10,
                            filterlogic: "or",
                            filter: gridfilter,
                            sort: [{ field: "PRC_PSPCODE", dir: "desc" }],
                            toolbarColumnMenu: true,
                            selectable: "multiple, row",
                            loadall: true,
                            toolbar: {
                                left: [
                                    "<button class=\"btn btn-default btn-sm\" id=\"btnSaveReturnLines\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].save#</button>",
                                    "<div style=\"padding-left: 5px;\" class=\"pull-left\" id=\"grdSalesInvoiceReturnsValue\"></div><div class=\"pull-left\"></div>"
                                ],
                                right: [
                                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].download #\" download=\"ProgressPayments.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                                ]
                            },
                            databound: GridDataBound
                        });
                    });
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnSaveReturnLines").on("click", Save);
            $("#btnApplyReturn").on("click", ApplyAllRetrun);

        };
        RegisterUIEvents();
    };
    psp = new function () {
        var self = this;
        var partialPayments = [];
        var grdSalesInvoiceProgressPayments = null;
        var grdSalesInvoiceProgressPaymentsElm = $("#grdSalesInvoiceProgressPayments");
        var isSavingEnabled = false;

        var BuildTaskTypes = function() {
            var gridreq = {
                loadall: true,
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
                    var strtasktypes = "";
                    $("#tasktypes option").remove();
                    for (var i = 0; i < d.data.length; i++) {
                        strtasktypes += "<option value=\"" +
                            d.data[i].SYC_CODE +
                            "\"> " +
                            d.data[i].SYC_DESCF +
                            "</option>";
                    }
                    $("#tasktypes").append(strtasktypes);
                }
            });
        }
        var BuildTaskCategories = function() {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "CAT_CODE", value: "*", operator: "neq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiCategories/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    var strtaskcategories = "";
                    $("#taskcategories option").remove();
                    for (var i = 0; i < d.data.length; i++) {
                        strtaskcategories += "<option value=\"" +
                            d.data[i].CAT_CODE +
                            "\"> " +
                            d.data[i].CAT_DESCF +
                            "</option>";
                    }
                    $("#taskcategories").append(strtaskcategories);
                }
            });
        }
        var Save = function () {
            var checkedlines = grdSalesInvoiceProgressPaymentsElm.find("input[data-name=\"chkPsp\"]:checked");
            var itemarr = [];
            if (checkedlines.length === 0) {
                msgs.error(applicationstrings[lang].invpspnotselected);
                return $.Deferred().reject();
            }

            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                itemarr.push({
                    Psp: line.data("id")
                });
            }

            var o = JSON.stringify({
                SalesInvoice: selectedrecord.SIV_CODE,
                Items: itemarr
            });

            return tms.Ajax({
                url: "/Api/ApiSalesInvoices/SaveProgressPayments",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord.SIV_STATUS = "H";
                    isdisabled = $.inArray(selectedrecord.SIV_STATUS, [openrecordstatus]) === -1;
                    self.ResetGrid();
                    self.List();
                }
            });
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdSalesInvoiceProgressPayments input[data-name=\"chkTask\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };

        var GridSummary = function() {
            
            var data = grdSalesInvoiceProgressPayments.GetData();
            var pspsum = 0;
            $.each(data, function () {
                pspsum += parseFloat(this.PSP_TOTAL) || 0;
            });
            var sumhtml = "<span style=\"color:#cf192d;line-height:2em;padding-left:1em;\"><strong> " +
                applicationstrings[lang].total +
                ": </strong>" +
                pspsum.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " TL" +
                "</span>";

            if (partialPayments.length > 0) {
                var sumpartial = partialPayments.reduce(function (s, a) {
                    return s + a.PTP_AMOUNT;
                }, 0);
                sumhtml +=  "<span style=\"color:#cf192d;line-height:2em;padding-left:1em;\"><strong> " +
                    applicationstrings[lang].total +
                    ": </strong>" +
                    sumpartial.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " TL" +
                    "</span>";
            }

            grdSalesInvoiceProgressPaymentsElm.find("#grdSumValue").html(sumhtml);
        }
        var GridDataBound = function (e) {
            grdSalesInvoiceProgressPaymentsElm.find("button.btn-delete").prop("disabled", !isdisabled);
            grdSalesInvoiceProgressPaymentsElm.find("#btnCheckAll").prop("disabled", isdisabled).off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdSalesInvoiceProgressPaymentsElm.find("#btnSaveTasks").prop("disabled", isdisabled).off("click").on("click", Save);

            var btnsearch = grdSalesInvoiceProgressPaymentsElm.find("#search");
            btnsearch.addClass("disabled");
            if (isSavingEnabled) {
                btnsearch.removeClass("disabled");
                btnsearch.off("click").on("click",
                    function() {
                        $(".sidebar.right").trigger("sidebar:open");
                    });
            }

            GridSummary();

        };
        var GetPartialPayments = function () {
            partialPayments = [];
            var gridreq = {
                sort: [{ field: "PTP_ID", dir: "asc" }],
                filter: {
                    filters: [{ field: "PTP_SALESINVOICE", value: selectedrecord.SIV_CODE, operator: "eq", logic: "and" }]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiPartialPayments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        if (d.data[i].PTP_PROGRESSPAYMENT) {
                            partialPayments.push(d.data[i].PTP_PROGRESSPAYMENT);
                        }
                    }
                }
            });
        };
        var BuildFilter = function () {
            
            var gridfilter = [];
            if (partialPayments) {
                gridfilter.push({ field: "PSP_CODE", value: partialPayments, operator: "nin" });
            }
            
            if (isSavingEnabled) {
                
                gridfilter.push({ field: "PSP_ORG", value: selectedrecord.SIV_ORG, operator: "eq", logic: "and" });
                gridfilter.push({ field: "PSP_CUSTOMER", value: selectedrecord.SIV_CUSTOMER, operator: "eq", logic: "and" });
                gridfilter.push({ field: "PSP_STATUS", value: closedrecordstatus, operator: "eq", logic: "and" });
                
                if (selectedrecord.SIV_PSPTYPE)
                    gridfilter.push({ field: "PSP_TYPE", value: selectedrecord.SIV_PSPTYPE, operator: "eq", logic: "and" });
                if (selectedrecord.SIV_BRANCH)
                    gridfilter.push({ field: "PSP_BRANCH", value: selectedrecord.SIV_BRANCH, operator: "eq", logic: "and" });               
                
                if (selectedrecord.SIV_PSPCREATEDSTART && selectedrecord.SIV_PSPCREATEDEND)
                    gridfilter.push({ field: "PSP_CREATED", value: selectedrecord.SIV_PSPCREATEDSTART, value2: selectedrecord.SIV_PSPCREATEDEND, operator: "between", logic: "and" });
                if (selectedrecord.SIV_PSPCREATEDSTART && !selectedrecord.SIV_PSPCREATEDEND)
                    gridfilter.push({ field: "PSP_CREATED", value: selectedrecord.SIV_PSPCREATEDSTART, operator: "gte", logic: "and" });
                if (!selectedrecord.SIV_PSPCREATEDSTART && selectedrecord.SIV_PSPCREATEDEND)
                    gridfilter.push({ field: "PSP_CREATED", value: selectedrecord.SIV_PSPCREATEDEND, operator: "lte", logic: "and" });

                // Search Filter
                var selectedtasktypes = $("#tasktypes").multipleSelect("getSelects", "value");
                if (selectedtasktypes.length > 0) {
                    gridfilter.push({ field: "PSP_TSKTASKTYPE", value: selectedtasktypes, operator: "in", logic: "and" });
                }

                var selectedtaskcategories = $("#taskcategories").multipleSelect("getSelects", "value");
                if (selectedtaskcategories.length > 0) {
                    gridfilter.push({ field: "PSP_CATEGORY", value: selectedtaskcategories, operator: "in", logic: "and" });

                }

                var datetaskcompletedstart = $("#taskdatecompleted_start").val().toDate();
                var datetaskcompletedend = $("#taskdatecompleted_end").val().toDate();
                if (datetaskcompletedend)
                    datetaskcompletedend = datetaskcompletedend.add(1, "days");
                
                if (datetaskcompletedstart && datetaskcompletedend)
                    gridfilter.push({ field: "PSP_TSKCOMPLETED", value: datetaskcompletedstart, value2: datetaskcompletedend, operator: "between", logic: "and" });
                if (datetaskcompletedstart && !datetaskcompletedend)
                    gridfilter.push({ field: "PSP_TSKCOMPLETED", value: datetaskcompletedstart, operator: "gte", logic: "and" });
                if (!datetaskcompletedstart && datetaskcompletedend)
                    gridfilter.push({ field: "PSP_TSKCOMPLETED", value: datetaskcompletedend, operator: "lte", logic: "and" });

                var datepspclosedstart = $("#pspdateclosed_start").val().toDate();
                var datepspclosedend = $("#pspdateclosed_end").val().toDate();
                if (datepspclosedend)
                    datepspclosedend = datepspclosedend.add(1, "days");
                
                if (datepspclosedstart && datepspclosedend)
                    gridfilter.push({ field: "PSP_DATECLOSED", value: datepspclosedstart, value2: datepspclosedend, operator: "between", logic: "and" });
                if (datepspclosedstart && !datepspclosedend)
                    gridfilter.push({ field: "PSP_DATECLOSED", value: datepspclosedstart, operator: "gte", logic: "and" });
                if (!datepspclosedstart && datepspclosedend)
                    gridfilter.push({ field: "PSP_DATECLOSED", value: datepspclosedend, operator: "lte", logic: "and" });


                var customerpm = $("#customerpm").data("user");
                if (customerpm)
                    gridfilter.push({ field: "PSP_CUSTOMERPM", value: customerpm, operator: "eq", logic: "and" });              

            } else {
                var invoice = selectedrecord.SIV_TYPE !== returninvoicetype ? selectedrecord.SIV_CODE : (selectedrecord.SIV_STATUS === openrecordstatus ? selectedrecord.SIV_SALESINVOICE : selectedrecord.SIV_CODE);
                gridfilter.push({ field: "PSP_SALESINVOICE", value: invoice, operator: "eq", logic: "and" });
                if (selectedrecord.SIV_TYPE === returninvoicetype)
                    gridfilter.push({ field: "PSP_SALESINVOICEISRETURNED", value: "+", operator: "neq", logic: "and" });
            }
            return gridfilter;
        }
        this.ResetGrid = function () {
            grdSalesInvoiceProgressPayments = null;
        }
        this.List = function () {
            var gridfilter = [];
            if (selectedrecord) {
                gridfilter = BuildFilter();
                if (grdSalesInvoiceProgressPayments) {
                    grdSalesInvoiceProgressPayments.ClearSelection();
                    grdSalesInvoiceProgressPayments.RunFilter(gridfilter);
                } else {
                    var cols =
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
                            field: "PSP_CUSTOMER",
                            title: gridstrings.progresspayments[lang].customer,
                            width: 250
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
                            field: "PSP_BRANCHREGION",
                            title: gridstrings.progresspayments[lang].branchregion,
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
                            field: "PSP_TOTAL",
                            title: gridstrings.progresspayments[lang].total,
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
                    if (selectedrecord.SIV_STATUS === openrecordstatus) {
                        cols.splice(0,
                            0,
                            {
                                type: "na",
                                title: "#",
                                field: "CHKPSP",
                                template:
                                    "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkPsp\" class=\"styled\" type=\"checkbox\" data-id=\"#= PSP_CODE #\" /><label></label>",
                                filterable: false,
                                sortable: false,
                                width: 35
                            });

                    }
                        var url = (selectedrecord.SIV_STATUS === openrecordstatus &&
                                selectedrecord.SIV_TYPE !== returninvoicetype)
                            ? "/Api/ApiProgressPayment/List"
                            : "/Api/ApiProgressPayment/ListSalesInvoiceLines";
                        grdSalesInvoiceProgressPayments = new Grid({
                            keyfield: "PSP_CODE",
                            columns: cols,
                            fields: {
                                PSP_CODE: { type: "number" },
                                PSP_CREATED: { type: "date" },
                                PSP_UPDATED: { type: "date" },
                                PSP_INVOICEDATE: { type: "date" },
                                PSP_TSKCOMPLETED: { type: "date" },
                                PSP_TSKCLOSED: { type: "date" },
                                PSP_TOTAL: { type: "number" }
                            },
                            datasource: url,
                            selector: "#grdSalesInvoiceProgressPayments",
                            name: "grdSalesInvoiceProgressPayments",
                            height: constants.defaultgridheight - 125,
                            primarycodefield: "PSP_CODE",
                            primarytextfield: "PSP_DESC",
                            visibleitemcount: 10,
                            filterlogic: "or",
                            filter: gridfilter,
                            sort: [{ field: "PSP_CODE", dir: "desc" }],
                            toolbarColumnMenu: true,
                            loadall: true,
                            selectable: "multiple, row",
                            toolbar: {
                                left: [
                                    "<div style=\"padding-right: 5px;\" class=\"pull-left\" id=\"grdSumValue\"></div>"
                                ],
                                right: [
                                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].download #\" download=\"ProgressPayments.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                                ]
                            },
                            databound: GridDataBound
                        });

                }
            }
        };
        this.BuildUI = function() {
            isSavingEnabled = !(selectedrecord.SIV_STATUS !== openrecordstatus || selectedrecord.SIV_TYPE === returninvoicetype);
            $("#btnSaveLines").prop("disabled", !isSavingEnabled);
            return $.when(BuildTaskTypes(), BuildTaskCategories(),GetPartialPayments()).done(function() {
                $("select[multiple]").multipleSelect({
                    selectAllText: applicationstrings[lang].selectall,
                    allSelected: applicationstrings[lang].allselected,
                    countSelected: applicationstrings[lang].countSelected
                });
            });
        }
        var ResetSidebarFilter = function() {

            $("#tasktypes").multipleSelect("setSelects", null);
            $("#taskcategories").multipleSelect("setSelects", null);
            $("#taskdatecompleted_start").val("");
            $("#taskdatecompleted_end").val("");
            $("#pspdatecompleted_start").val("");
            $("#pspdatecompleted_end").val("");
            $("#pspgroupno").val("");
            $("#customerpm").val("");
        }
        var RunSidebarFilter = function() {
            var gridfilter = BuildFilter();
            grdSalesInvoiceProgressPayments.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        }
        var RegisterUIEvents = function () {

            $("#btnSaveLines").on("click", Save);
            $("#filter").click(function () {
                RunSidebarFilter();
            });
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });

            $("#customerpm").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ],
                callback : function(d) {
                    $("#customerpm").data("user", d ? d.USR_DESC : "");
                }
            });
            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
        }
        RegisterUIEvents();
    };
    siv = new function () {
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var self = this;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMSALESINVOICES", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.SIV_CODE, operator: "eq" }
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
                        { field: "TYP_ENTITY", value: "SALESINVOICE", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data.TYP_CODE === returninvoicetype) {
                            $("div.SALES").addClass("hidden");
                            $("div.RETURN").removeClass("hidden");
                            $("#salesinvoice").attr("required", "required").addClass("required");
                        } else {
                            $("div.SALES").removeClass("hidden");
                            $("div.RETURN").addClass("hidden");
                            $("#salesinvoice").removeAttr("required").removeClass("required");
                        }

                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "SALESINVOICE",
                                source: selectedrecord ? selectedrecord.SIV_CODE : "0",
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
            $("#btnreturncustomer").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.customer[lang].title,
                    listurl: "/Api/ApiCustomers/List",
                    keyfield: "CUS_CODE",
                    codefield: "CUS_CODE",
                    textfield: "CUS_DESC",
                    returninput: "#returncustomer",
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
            $("#btnpsptype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#psptype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnsalesinvoice").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.salesinvoices[lang].title,
                    listurl: "/Api/ApiSalesInvoices/List",
                    keyfield: "SIV_CODE",
                    codefield: "SIV_CODE",
                    textfield: "SIV_CODE",
                    returninput: "#salesinvoice",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "SIV_CODE", title: gridstrings.salesinvoices[lang].code, width: 100 },
                        { type: "string", field: "SIV_DESC", title: gridstrings.salesinvoices[lang].desc, width: 400 },
                        { type: "string", field: "SIV_CUSTOMER", title: gridstrings.salesinvoices[lang].customer, width: 400 }

                    ],
                    filter: [
                        { field: "SIV_STATUS", value: closedrecordstatus, operator: "eq" },
                        { field: "SIV_TYPE", value: "SATIS", operator: "eq" },
                        { field: "SIV_CUSTOMER", value: $("#returncustomer").val(), operator: "eq" }
                    ]
                });
            });
            $("#btntasktype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_CODE",
                    returninput: "#tasktype",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
                    ]
                });
            });
            $("#btnreturncause").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#returncause",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "SALESINVOICERETURNCAUSE", operator: "eq" }
                    ]
                });
            });
            $("#btntaskcategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_CODE",
                    returninput: "#taskcategory",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CAT_CODE", value: "*", operator: "neq" },
                        { field: "CAT_ACTIVE", value: "+", operator: "eq" }
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
                    { field: "TYP_ENTITY", value: "SALESINVOICE", operator: "eq" }
                ],
                callback: function (data) {
                    if (data.TYP_CODE === returninvoicetype) {
                        $("div.SALES").addClass("hidden");
                        $("div.RETURN").removeClass("hidden");
                        $("#salesinvoice").attr("required", "required").addClass("required");
                    } else {
                        $("div.SALES").removeClass("hidden");
                        $("div.RETURN").addClass("hidden");
                        $("#salesinvoice").removeAttr("required").removeClass("required");
                    }

                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "SALESINVOICE",
                            source: selectedrecord ? selectedrecord.SIV_CODE : "0",
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#returncause").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "SALESINVOICERETURNCAUSE", operator: "eq" }
                ],
                callback: function (data) {

                }
            });
            $("#returncustomer").autocomp({
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
            $("#psptype").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" }
                ]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "SALESINVOICE",
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
                        { field: "STA_ENTITY", value: "SALESINVOICE", operator: "eq" },
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
            tms.Tab(selectedrecord.SIV_TYPE);

            $("#code").val(selectedrecord.SIV_CODE);
            $("#org").val(selectedrecord.SIV_ORG);
            $("#desc").val(selectedrecord.SIV_DESC).prop("disabled", isdisabled);
            $("#type").val(selectedrecord.SIV_TYPE);
            $("#customer").val(selectedrecord.SIV_CUSTOMER);
            $("#returncustomer").val(selectedrecord.SIV_CUSTOMER);
            $("#branch").val(selectedrecord.SIV_BRANCH).prop("disabled", isdisabled);
            $("#psptype").val(selectedrecord.SIV_PSPTYPE).prop("disabled", isdisabled);
            $("#tasktype").val(selectedrecord.SIV_TASKTYPE);
            $("#returncause").val(selectedrecord.SIV_RETURNCAUSE);
            $("#returncausedesc").val(selectedrecord.SIV_RETURNCAUSEDESC);
            $("#taskcategory").val(selectedrecord.SIV_TASKCATEGORY);
            $("#orderno").val(selectedrecord.SIV_ORDERNO);
            $("#createdby").val(selectedrecord.SIV_CREATEDBY);
            $("#created").val(moment(selectedrecord.SIV_CREATED).format(constants.longdateformat));
            $("#status").data("code", selectedrecord._status.STA_CODE);
            $("#status").data("pcode", selectedrecord._status.STA_PCODE);
            $("#status").data("text", selectedrecord._status.STA_DESCF);
            $("#btnbranch").prop("disabled", isdisabled);
            $("#btntasktype").prop("disabled", isdisabled);
            $("#pspcreatedstart").val(selectedrecord.SIV_PSPCREATEDSTART ? moment(selectedrecord.SIV_PSPCREATEDSTART).format(constants.dateformat) : "").prop("disabled", isdisabled);
            $("#pspcreatedend").val(selectedrecord.SIV_PSPCREATEDEND ? moment(selectedrecord.SIV_PSPCREATEDEND).format(constants.dateformat) : "").prop("disabled", isdisabled);
            $("#officialinvoiceno").val(selectedrecord.SIV_INVOICENO);
            $("#officialinvoicedate").val(selectedrecord.SIV_INVOICEDATE ? moment(selectedrecord.SIV_INVOICEDATE).format(constants.dateformat) : "");
            $("#invoicedescription").val(selectedrecord.SIV_INVOICEDESCRIPTION).prop("disabled", isclosed);
            $("#printtype").val(selectedrecord.SIV_PRINTTYPE).prop("disabled", isclosed);
            $("#interest").prop("checked", selectedrecord.SIV_INTEREST === "+");

            $("#salesinvoice").tagsinput("removeAll");
            if (selectedrecord.SIV_SALESINVOICE) {
                var invoicearray = selectedrecord.SIV_SALESINVOICE.split(",");
                for (var i = 0; i < invoicearray.length; i++) {
                    var invoiceitem = invoicearray[i];
                    $("#salesinvoice").tagsinput("add", { id: invoiceitem, text: invoiceitem }, ["ignore"]);
                }
            }
            $("#tasktype").tagsinput("removeAll");
            if (selectedrecord.SIV_TASKTYPE) {
                var tasktypearray = selectedrecord.SIV_TASKTYPE.split(",");
                for (var i = 0; i < tasktypearray.length; i++) {
                    var tasktypeitem = tasktypearray[i];
                    $("#tasktype").tagsinput("add", { id: tasktypeitem, text: tasktypeitem }, ["ignore"]);
                }
            }
            $("#taskcategory").tagsinput("removeAll");
            if (selectedrecord.SIV_TASKCATEGORY) {
                var taskcategoryarray = selectedrecord.SIV_TASKCATEGORY.split(",");
                for (var i = 0; i < taskcategoryarray.length; i++) {
                    var taskcategoryitem = taskcategoryarray[i];
                    $("#taskcategory").tagsinput("add", { id: taskcategoryitem, text: taskcategoryitem }, ["ignore"]);
                }
            }

            tooltip.show("#org", selectedrecord.SIV_ORGDESC);
            tooltip.show("#type", selectedrecord.SIV_TYPEDESC);
            tooltip.show("#customer", selectedrecord.SIV_CUSTOMERDESC);
            tooltip.show("#branch", selectedrecord.SIV_BRANCHDESC);
            tooltip.show("#psptype", selectedrecord.SIV_PSPTYPEDESC);
            tooltip.show("#tasktype", selectedrecord.SIV_TASKTYPEDESC);

            if (selectedrecord.SIV_TYPE === returninvoicetype) {
                $("div.SALES").addClass("hidden");
                $("div.RETURN").removeClass("hidden");
                $("#salesinvoice").attr("required", "required").addClass("required");
            } else {
                $("div.SALES").removeClass("hidden");
                $("div.RETURN").addClass("hidden");
                $("#salesinvoice").removeAttr("required").removeClass("required");
            }

            if (selectedrecord._status.STA_PCODE === "C") {
                $("#returncause").attr("disabled", true);
                $("#returncausedesc").attr("disabled", true);
                $("#btnreturncause").attr("disabled", true);
                $("#btnsalesinvoice").attr("disabled", true);
                $("#salesinvoice").attr("disabled", true);
                $("#btnreturncustomer").attr("disabled", true);
                $("#returncustomer").attr("disabled", true);
                $("#printtype").attr("disabled", true);
                $("#btntasktype").attr("disabled", true);
                $("#tasktype").attr("disabled", true);
                $("#taskcategory").attr("disabled", true);
                $("#btntaskcategory").attr("disabled", true);

            } else {
                $("#returncause").attr("disabled", false);
                $("#returncausedesc").attr("disabled", false);
                $("#btnreturncause").attr("disabled", false);
                $("#btnreturncustomer").attr("disabled", false);
                $("#returncustomer").attr("disabled", false);
                $("#btnsalesinvoice").attr("disabled", false);
                $("#salesinvoice").attr("disabled", false);
                $("#printtype").attr("disabled", false);
                $("#btntasktype").attr("disabled", false);
                $("#tasktype").attr("disabled", false);
                $("#taskcategory").attr("disabled", false);
                $("#btntaskcategory").attr("disabled", false);
                $("#btnAddPartialPayment").attr("disabled", false);
                $("#btnSavePartialPayment").attr("disabled", false);
                $("#btnDeletePartialPayment").attr("disabled", false);
            }

            $("#btnBrowse").removeAttr("disabled");
            $("#addComment,#fu").prop("disabled", false);

            if (selectedrecord._status.STA_PCODE === "R") {
                $("#officialinvoiceno").attr("disabled", false);
                $("#officialinvoicedate").attr("disabled", false);
            } else {
                $("#officialinvoiceno").attr("disabled", true);
                $("#officialinvoicedate").attr("disabled", true);
            }

            commentsHelper.showCommentsBlock({ subject: "SALESINVOICE", source: selectedrecord.SIV_CODE });
            documentsHelper.showDocumentsBlock({ subject: "SALESINVOICE", source: selectedrecord.SIV_CODE });
            LoadStatuses({
                pcode: selectedrecord._status.STA_PCODE,
                code: selectedrecord._status.STA_CODE,
                text: selectedrecord._status.STA_DESCF
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiSalesInvoices/Get",
                data: JSON.stringify(selectedrecord.SIV_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedrecord._status = d.stat;
                    isdisabled = $.inArray(selectedrecord.SIV_STATUS, [openrecordstatus]) === -1;
                    isclosed = $.inArray(selectedrecord.SIV_STATUS, ["H"]) === -1;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({
                        subject: "SALESINVOICE",
                        source: selectedrecord.SIV_CODE,
                        type: $("#type").val()
                    });
                    console.log(d.mikro);

                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            if ($("#status").val() === closedrecordstatus || $("#status").val() === "A3") {
                var officialinvoiceno = $("#officialinvoiceno").val();
                var officialinvoicedate = $("#officialinvoicedate").val();
                if (!officialinvoiceno || !officialinvoicedate) {
                    msgs.error(applicationstrings[lang].invoicerequiredfieldserr);
                    return $.Deferred().reject();
                }
            }

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "SALESINVOICE",
                source: selectedrecord ? selectedrecord.SIV_CODE : null,
                type: $("#type").val()
            });

            var isreturn = $("#type").val() === returninvoicetype;

            var o = JSON.stringify(
                {
                    SalesInvoice: {
                        SIV_CODE: (selectedrecord) ? selectedrecord.SIV_CODE : 0,
                        SIV_ORG: $("#org").val(),
                        SIV_TYPEENTITY: "SALESINVOICE",
                        SIV_TYPE: $("#type").val(),
                        SIV_DESC: $("#desc").val(),
                        SIV_STATUSENTITY: "SALESINVOICE",
                        SIV_STATUS: $("#status").val(),
                        SIV_SALESINVOICE: isreturn ? $("#salesinvoice").val() : null,
                        SIV_ORDERNO: $("#orderno").val(),
                        SIV_RETURNCAUSEDESC: isreturn ? $("#returncausedesc").val() : null,
                        SIV_RETURNCAUSE: isreturn ? $("#returncause").val() : null,
                        SIV_RETURNCAUSEENTITY: isreturn ? "SALESINVOICERETURNCAUSE" : null,
                        SIV_CUSTOMER: !isreturn ? $("#customer").val() : $("#returncustomer").val(),
                        SIV_BRANCH: !isreturn ? ($("#branch").val() || null) : null,
                        SIV_PSPTYPEENTITY: !isreturn ? ($("#psptype").val() ? "PROGRESSPAYMENT" : null) : null,
                        SIV_PSPTYPE: !isreturn ? ($("#psptype").val() || null) : null,
                        SIV_TASKTYPE: !isreturn ? ($("#tasktype").val() || null) : null,
                        SIV_TASKCATEGORY: !isreturn ? ($("#taskcategory").val() || null) : null,
                        SIV_PSPCREATEDSTART: !isreturn ? ($("#pspcreatedstart").val() ? moment.utc($("#pspcreatedstart").val(), constants.dateformat) : null) : null,
                        SIV_PSPCREATEDEND: !isreturn ? ($("#pspcreatedend").val() ? moment.utc($("#pspcreatedend").val(), constants.dateformat) : null) : null,
                        SIV_INVOICENO: ($("#officialinvoiceno").val() || null),
                        SIV_INVOICEDESCRIPTION: ($("#invoicedescription").val() || null),
                        SIV_PRINTTYPE: $("#printtype").val(),
                        SIV_INTEREST: $("#interest").prop("checked") ? "+" : "-",
                        SIV_INVOICEDATE: ($("#officialinvoicedate").val() ? moment.utc($("#officialinvoicedate").val(), constants.dateformat) : null),
                        SIV_CREATED: selectedrecord != null ? selectedrecord.SIV_CREATED : tms.Now(),
                        SIV_CREATEDBY: selectedrecord != null ? selectedrecord.SIV_CREATEDBY : user,
                        SIV_UPDATED: selectedrecord != null ? tms.Now() : null,
                        SIV_UPDATEDBY: selectedrecord != null ? user : null,
                        SIV_RECORDVERSION: selectedrecord != null ? selectedrecord.SIV_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiSalesInvoices/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r.SalesInvoice;
                    $("#SalesInvoiceId").val(selectedrecord.SIV_CODE);
                    psp.ResetGrid();
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
                            url: "/Api/ApiSalesInvoices/DelRec",
                            data: JSON.stringify(selectedrecord.SIV_CODE),
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
            $("#orderno").val("");
            $("#returncustomer").val("");
            $("#salesinvoice").tagsinput("removeAll");
            $("#customer").val("");
            $("#branch").val("").prop("disabled", false);
            $("#psptype").val("").prop("disabled", false);
            $("#tasktype").tagsinput("removeAll");
            $("#taskcategory").tagsinput("removeAll");
            $("#pspcreatedstart").val("").prop("disabled", false);
            $("#pspcreatedend").val("").prop("disabled", false);
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#officialinvoiceno").val("").prop("disabled", false);
            $("#officialinvoicedate").val("").prop("disabled", false);
            $("#invoicedescription").val("").prop("disabled", false);
            $("#printtype").val("SINGLELINE").prop("disabled", false);
            $("#returncause").val("");
            $("#returncausedesc").val("");
            $("#interest").prop("checked", false);


            var statctrl = $("#status");
            statctrl.data("code", "-");
            statctrl.data("pcode", "Q");
            statctrl.data("text", "");
            statctrl.val("");
            statctrl.find("option").remove();
            statctrl.addClass("required").prop("disabled", false).removeAttr("frozen");
            $("#returncause").attr("disabled", false);
            $("#returncausedesc").attr("disabled", false);
            $("#btnreturncause").attr("disabled", false);
            $("#btnreturncustomer").attr("disabled", false);
            $("#returncustomer").attr("disabled", false);
            $("#btnsalesinvoice").attr("disabled", false);
            $("#salesinvoice").attr("disabled", false);
            $("#printtype").attr("disabled", false);
            $("#btntasktype").attr("disabled", false);
            $("#tasktype").attr("disabled", false);
            $("#taskcategory").attr("disabled", false);
            $("#btntaskcategory").attr("disabled", false);
            $("#btnAddPartialPayment").attr("disabled", false);
            $("#btnSavePartialPayment").attr("disabled", false);
            $("#btnDeletePartialPayment").attr("disabled", false);
            tooltip.hide("#org");
            tooltip.hide("#type");
            tooltip.hide("#customer");
            tooltip.hide("#branch");
            tooltip.hide("#tasktype");
            tooltip.hide("#psptype");
            tooltip.hide("#taskcategory");
            tooltip.hide("#salesinvoice");

            $("#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            $("div.SALES").removeClass("hidden");
            $("div.RETURN").addClass("hidden");
            $("#salesinvoice").removeAttr("required").removeClass("required");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        this.Transfer = function () {
            if (!selectedrecord)
                return $.Deferred().reject();

            return tms.Ajax({
                url: "/Api/ApiSalesInvoices/Transfer",
                data: JSON.stringify(selectedrecord.SIV_CODE),
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
        var PrintSelecteds = function () {
            var selectedRows = grdSalesInvoices.GetSelected();
            var selectedarr = [];
            var element = $("#listofselecteds");
            element.find("*").remove();
            var str = "";
            for (var i = 0; i < selectedRows.length; i++) {
                var selSalesInvoice = grdSalesInvoices.GetRowDataItem(selectedRows[i]);
                str += " <input type=\"hidden\" value=\""+selSalesInvoice.SIV_CODE+"\" name=\"p[" + i + "]\" id=\"p_" + i + " \">";
                selectedarr.push(selSalesInvoice.SIV_CODE);
            }
            element.append(str);
            $("#modalprintall").modal("show");
          
        };
        var ItemSelect = function (row) {
            selectedrecord = grdSalesInvoices.GetRowDataItem(row);
            isdisabled = $.inArray(selectedrecord.SIV_STATUS, [openrecordstatus]) === -1;
            isclosed = $.inArray(selectedrecord.SIV_STATUS, ["H"]) === -1;
            $(".page-header h6").html(selectedrecord.SIV_CODE + " - " + selectedrecord.SIV_DESC);
            $("#SalesInvoiceId").val(selectedrecord.SIV_CODE);
            scr.Configure();
            tms.Tab(selectedrecord.SIV_TYPE);
        };
        var CheckSameStatusForAllRows = function () {
            var selectedRows = grdSalesInvoices.GetSelected();
            var statusArr = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var selrow = grdSalesInvoices.GetRowDataItem(selectedRows[i]);
                statusArr.pushUnique(selrow.SIV_STATUS);
            }
            return (statusArr.length === 1);
        }
        var ChangeStatusesForAll = function () {
            var selectedRows = grdSalesInvoices.GetSelected();
            var selectedarr = [];
            var selectedstatus = $("#statuschange").val();
            var invoiceno = $("#invoiceno").val() || null;
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

            for (var i = 0; i < selectedRows.length; i++) {
                var selSalesInvoice = grdSalesInvoices.GetRowDataItem(selectedRows[i]);
                var newSalesInvoice = $.extend(true, {}, selSalesInvoice);
                newSalesInvoice.SIV_STATUS = selectedstatus;
                if (selectedstatus === "K2") {
                    newSalesInvoice.SIV_INVOICENO = invoiceno;
                    newSalesInvoice.SIV_INVOICEDATE = invoicedate;
                }
                newSalesInvoice.SIV_UPDATED = tms.Now();
                newSalesInvoice.SIV_UPDATEDBY = user;
                selectedarr.push(newSalesInvoice);
            }
            return tms.Ajax({
                url: "/Api/ApiSalesInvoices/SaveList",
                data: JSON.stringify(selectedarr),
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                    $("#modalstatuschange").modal("hide");
                }
            });
        }
        var GridDataBound = function (e) {
            grdSalesInvoicesElm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
            grdSalesInvoicesElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdSalesInvoicesElm.contextMenu({
                selector: "div.k-grid-content tr",
                items: {
                    statuschange: {
                        name: applicationstrings[lang].statuschange,
                        callback: function () {
                            if (!CheckSameStatusForAllRows()) {
                                msgs.error(applicationstrings[lang].salesinvoiceselectionerror);
                                return false;
                            } else {
                                $.when(LoadAllStatuses()).done(function () {
                                    $("#invoicedetails").addClass("hidden");
                                    $("#invoiceno,#invoicedate").val("");
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
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdSalesInvoices) {
                grdSalesInvoices.ClearSelection();
                grdSalesInvoices.RunFilter(gridfilter);
            } else {
                grdSalesInvoices = new Grid({
                    keyfield: "SIV_CODE",
                    columns: [
                        {
                            type: "number",
                            field: "SIV_CODE",
                            title: gridstrings.salesinvoices[lang].code,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "SIV_DESC",
                            title: gridstrings.salesinvoices[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "SIV_STATUS",
                            title: gridstrings.salesinvoices[lang].status,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_STATUSDESC",
                            title: gridstrings.salesinvoices[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_ORG",
                            title: gridstrings.salesinvoices[lang].org,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "SIV_TYPE",
                            title: gridstrings.salesinvoices[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "SIV_TYPEDESC",
                            title: gridstrings.salesinvoices[lang].typedesc,
                            width: 150
                        },
                        {
                            type: "number",
                            field: "SIV_CUSPAYMENTPERIOD",
                            title: gridstrings.salesinvoices[lang].cuspaymentperiod,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SIV_CUSTOMERPM",
                            title: gridstrings.salesinvoices[lang].customerpm,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SIV_BRANCHPM",
                            title: gridstrings.salesinvoices[lang].branchpm,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SIV_INVOICEDESCRIPTION",
                            title: gridstrings.salesinvoices[lang].invoicedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_CUSTOMER",
                            title: gridstrings.salesinvoices[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_CUSTOMERDESC",
                            title: gridstrings.salesinvoices[lang].customerdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_BRANCH",
                            title: gridstrings.salesinvoices[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_BRANCHDESC",
                            title: gridstrings.salesinvoices[lang].branchdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_INVOICENO",
                            title: gridstrings.salesinvoices[lang].invoiceno,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "SIV_TOTAL",
                            title: gridstrings.salesinvoices[lang].totalprice,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "SIV_INVOICEDATE",
                            title: gridstrings.salesinvoices[lang].invoicedate,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "SIV_PSPCREATEDSTART",
                            title: gridstrings.salesinvoices[lang].pspcreatedstart,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "SIV_PSPCREATEDEND",
                            title: gridstrings.salesinvoices[lang].pspcreatedend,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_CREATEDBY",
                            title: gridstrings.salesinvoices[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "SIV_CREATED",
                            title: gridstrings.salesinvoices[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SIV_UPDATEDBY",
                            title: gridstrings.salesinvoices[lang].updatedby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "SIV_UPDATED",
                            title: gridstrings.salesinvoices[lang].updated,
                            width: 250
                        }
                    ],
                    fields: {
                        SIV_CODE: { type: "number" },
                        SIV_CUSPAYMENTPERIOD: { type: "number" },
                        SIV_TOTAL: { type: "number" },
                        SIV_CREATED: { type: "date" },
                        SIV_UPDATED: { type: "date" },
                        SIV_INVOICEDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiSalesInvoices/List",
                    selector: "#grdSalesInvoices",
                    name: "grdSalesInvoices",
                    height: constants.defaultgridheight - 100,
                    primarycodefield: "SIV_CODE",
                    primarytextfield: "SIV_DESC",
                    visibleitemcount: 10,
                    filterlogic: "or",
                    filter: gridfilter,
                    sort: [{ field: "SIV_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    selectable: "multiple, row",
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"SalesInvoices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var Print = function () {
            var selectedRows = grdSalesInvoices.GetSelected();
            if (selectedRows.length > 1) {
                PrintSelecteds();
            } else {
                $("#modalprint").modal();

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
                        case "#psps":
                            $.when(psp.BuildUI()).done(psp.List());
                            break;
                        case "#returnpsp":
                            rpsp.List();
                            break;
                        case "#partialpayment":
                            ptp.BuildTab();
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
            $("#btnPrint").click(Print);
            $("#btnTransfer").click(self.Transfer);

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
                if (vstatus == "K2") {
                    ctrl_invoicedetails.removeClass("hidden");
                } else {
                    ctrl_invoicedetails.addClass("hidden");
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
                commentsdiv: "#comments"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });
            $("#btnsavestatus").on("click", ChangeStatusesForAll);
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
                        siv.Save();
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        siv.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        siv.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        siv.Delete();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        siv.HistoryModal();
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
        siv.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());