(function () {
    var rtp;
    var shr;
    
    shr = new function () {
        this.CalculateExch = function (curr, basecurr) {
            if (!curr)
                return $.Deferred().reject();
            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: basecurr,
                CRR_STARTDATE: moment()
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch)
            });
        };
    };
    rtp = new function () {
        var self = this;
        var grdRequisitionLines = null;
        var checkedlines = null;
        var istaskdiff = false;
        var task = null;
        var orderOrg = null;
        var paymentterm = null;
        var organizationcurr = null;
        var grdRequisitionLinesElm = $("#grdRequisitionLines");
        var iswrhdiff = false;
       
        var isreqdiff = false;
        var ResetModal = function () {
            $("#description").val("");
            $("#warehouse").val("");
            $("#supplier").val("");
            $("#currency").val("TL");
            $("#exchangerate").val(parseFloat(1).fixed(constants.exchdecimals));

            if (checkedlines.length > 0) {
                $("#fulladr").val($(checkedlines[0]).data("adr"));
                $("#warehouse").val($(checkedlines[0]).data("wrh"));
                if (!isreqdiff) {
                    $("#description").val($(checkedlines[0]).data("desc"));
                }
            } else {
                $("#fulladr").val("");
                $("#warehouse").val("");
            }
        };
        var GetOrgCur = function () {
            return tms.Ajax({
                url: "/Api/ApiOrgs/Get",
                data: JSON.stringify(orderOrg),
                fn: function (d) {
                    organizationcurr = d.data.ORG_CURRENCY;
                }
            });
        }; 
        var CalculateExch = function () {
            var curr = $("#currency").val();
            if (curr) {
                return $.when(shr.CalculateExch(curr, organizationcurr)).done(function (d) {
                    if (d.data) {
                        if (curr === organizationcurr) {
                            $("#exchangerate").prop("disabled", true).removeAttr("required").removeClass("required");
                        } else {
                            $("#exchangerate").prop("disabled", false).attr("required", "required").addClass("required");
                        }
                        $("#exchangerate").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#exchangerate").val("");
                    }
                });
            }
        };
        var BuildFilter = function () {
            var gridfilter = [{ field: "PQC_HSTATUS", value: "K", operator: "eq", logic: "and" }];

            return gridfilter;
        };
        var GridDataBound = function (e) {
            var checkinputs = $("#grdRequisitionLines input[data-name=\"chkLine\"]:not(:disabled)");
            
            tms.NumericInput();
            grdRequisitionLinesElm.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdRequisitionLinesElm.find("#btnSaveLines").off("click").on("click", function () {
                checkedlines = grdRequisitionLinesElm.find("input[data-name=\"chkLine\"]:checked");
                if (checkedlines.length === 0) {
                    msgs.error(applicationstrings[lang].reqlinenotselected);
                    return $.Deferred().reject();
                }
                iswrhdiff = false;
                isreqdiff = false;
                for (var i = 1; i < checkedlines.length; i++) {
                    if ($(checkedlines[i]).data("wrh") !== $(checkedlines[i - 1]).data("wrh")) {
                        iswrhdiff = true;
                    }

                    if ($(checkedlines[i]).data("hid") !== $(checkedlines[i - 1]).data("hid")) {
                        isreqdiff = true;
                    }
                    
                    if ($(checkedlines[i]).data("task") !== $(checkedlines[i - 1]).data("task")) {
                        istaskdiff = true;
                    }
                }
               
                   
               
                    
                task = $(checkedlines[0]).data("task");
                orderOrg = $(checkedlines[0]).data("org");
                if (!iswrhdiff) {
                    $.when(GetOrgCur()).done(function () {
                        ResetModal();
                        $("#createpurchaseorder").modal("show");
                    });
                }
                else {
                    msgs.error(applicationstrings[lang].multiplewrhselected);
                }
               
            });
           
            $("input[calc-group=\"1\"]").off("change").on("change",
                function () {
                    var rowid = $(this).data("id");
                    var quan = "#quantity-" + rowid;
                    var price = "#unitprice-" + rowid;
                    var discountrate = "#discountrate-" + rowid;
                    var discounted = "#discountedprice-" + rowid;
                    var span = "#" + rowid;

                    if ($(quan).val() <= 0 || !$(quan).val()) {
                        msgs.error(applicationstrings[lang].countmustbegreaterthenzero);
                        return $.Deferred().reject();
                    };
                    if ($(price).val() <= 0 || !$(price).val()) {
                        msgs.error(applicationstrings[lang].pricemustbegreaterthenzero);
                        return $.Deferred().reject();
                    };
                    if ($(discountrate).val() < 0 || !$(discountrate).val()) {
                        msgs.error(applicationstrings[lang].pricemustbegreaterthenzero);
                        return $.Deferred().reject();
                    };


                    var calc = $(quan).val() * $(price).val();
                    var discountedcalc = $(price).val() - (($(price).val() * $(discountrate).val()) / 100);
                    var discountedtotal = $(quan).val() * discountedcalc;
                    $(span).text(parseFloat(discountedtotal).fixed(constants.pricedecimals));
                    $(discounted).text(parseFloat(discountedcalc).fixed(constants.pricedecimals));
                });

            var data = grdRequisitionLines.GetData();
            var orderedlist = _.groupBy(data, "PQC_HID");
            var rowcolor = "";
            var i = 0;
            for (var item in orderedlist) {
                rowcolor = (i % 2 === 0 ? "#dddddd" : "");
                if (orderedlist.hasOwnProperty(item)) {
                    var firstelm = _.first(orderedlist[item], 1);
                    grdRequisitionLinesElm.find("tr[data-hid=\"" + item + "\"]").css({ "background": rowcolor });
                    if (firstelm.length >= 1) {
                        var first = firstelm[0].PQC_ID;
                        var row = grdRequisitionLinesElm.find("tr[data-id=\"" + first + "\"]");
                        row.find("td").css({ "border-top": "10px solid #3984c5" });
                    }
                }
                i++;
            }

        };
        var Save = function () {
            if (!tms.Check("#createpurchaseorder"))
                return $.Deferred().reject();

            var linearr = [];
            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                var quanid = "#quantity-" + line.data("id");
                var unitpriceid = "#unitprice-" + line.data("id");
                var discountrate = "#discountrate-" + line.data("id");
                if (orderOrg !== line.data("org")) {
                    msgs.error("Organizasyonlar Farklı Olamaz.");
                    return $.Deferred().reject();
                };

                if ($(quanid).val() <= 0 || !$(quanid).val()) {
                    msgs.error(applicationstrings[lang].countmustbegreaterthenzero);
                    return $.Deferred().reject();
                };
                if ($(unitpriceid).val() <= 0 || !$(unitpriceid).val()) {
                    msgs.error(applicationstrings[lang].pricemustbegreaterthenzero);
                    return $.Deferred().reject();
                };
                if ($(discountrate).val() < 0 || !$(discountrate).val()) {
                    msgs.error(applicationstrings[lang].pricemustbegreaterthenzero);
                    return $.Deferred().reject();
                };

                var obj = { line: line.data("id"), quantity: $(quanid).val(), unitofprice: $(unitpriceid).val(), discountrate: $(discountrate).val() }
                linearr.push(obj);
            }

            var o = JSON.stringify(
                {
                    Record: {
                        POR_ID: 0,
                        POR_ORG: orderOrg,
                        POR_TYPEENTITY: "PURCHASEORDER",
                        POR_TYPE: "TALEP",
                        POR_DESCRIPTION: $("#description").val(),
                        POR_REQUESTEDBY: user,
                        POR_REQUESTED: tms.Now(),
                        POR_STATUSENTITY: "PURCHASEORDER",
                        POR_STATUS: "A",
                        POR_TASK: istaskdiff ? null : task,
                        POR_WAREHOUSE: $("#warehouse").val(),
                        POR_SUPPLIER: $("#supplier").val(),
                        POR_PAYMENTTERM: paymentterm,
                        POR_DELIVERYADR: $("#fulladr").val(),
                        POR_CURRENCY: $("#currency").val(),
                        POR_EXCHANGERATE: $("#exchangerate").val(),
                        POR_CREATED: tms.Now(),
                        POR_CREATEDBY: user,
                        POR_UPDATED: null,
                        POR_UPDATEDBY: null,
                        POR_RECORDVERSION: 0
                    },
                    Lines: linearr
                });


            return tms.Ajax({
                url: "/Api/ApiRequisitonToPurchaseOrder/Convert",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    $("#createpurchaseorder").modal("hide");
                    ResetModal();
                    self.List();
                }
            });
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdRequisitionLines input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var RegisterUIEvents = function () {
            $("#btnwarehouse").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.warehouses[lang].title,
                    listurl: "/Api/ApiWarehouses/List",
                    keyfield: "WAH_CODE",
                    codefield: "WAH_CODE",
                    textfield: "WAH_DESC",
                    returninput: "#warehouse",
                    columns: [
                        { type: "string", field: "WAH_CODE", title: gridstrings.warehouses[lang].code, width: 100 },
                        { type: "string", field: "WAH_DESC", title: gridstrings.warehouses[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                        { field: "WAH_ORG", value: ["*", orderOrg], operator: "in" }
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
                        { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 400 },
                        { type: "string", field: "SUP_TYPEDESC", title: gridstrings.suppliers[lang].typedesc, width: 400 },
                        { type: "string", field: "SUP_PROVINCEDESC", title: gridstrings.suppliers[lang].provincedesc, width: 400 }
                    ],
                    filter: [
                        { field: "SUP_ACTIVE", value: "+", operator: "eq" },
                        { field: "SUP_ORGANIZATION", value: ["*", orderOrg], operator: "in" }
                    ],
                    callback: function (e) {
                        paymentterm = e.SUP_PAYMENTPERIOD;
                    }
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
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function () {
                        return CalculateExch();
                    }
                });
            });
            $("#warehouse").autocomp({
                listurl: "/Api/ApiWarehouses/List",
                geturl: "/Api/ApiWarehouses/Get",
                field: "WAH_CODE",
                textfield: "WAH_DESC",
                filter: [
                    { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                    { field: "WAH_ORG", value: ["*", orderOrg], includeall: true }
                ]
            });
            $("#supplier").autocomp({
                listurl: "/Api/ApiSuppliers/List",
                geturl: "/Api/ApiSuppliers/Get",
                field: "SUP_CODE",
                textfield: "SUP_DESC",
                filter: [
                    { field: "SUP_ACTIVE", value: "+", operator: "eq" },
                    { field: "SUP_ORGANIZATION", value: ["*", orderOrg], includeall: true }
                ],
                callback: function(e) {
                    paymentterm = e.SUP_PAYMENTPERIOD;
                }
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                ],
                callback: function () {
                    return CalculateExch();
                }
            });

            $("#btncreatepurchaseorder").click(Save);
        };
        this.List = function () {
            var gridfilter = BuildFilter();
            if (grdRequisitionLines) {
                grdRequisitionLines.ClearSelection();
                grdRequisitionLines.RunFilter(gridfilter);
            } else {
                var c = [
                    {
                        type: "na",
                        title: "#",
                        field: "chkLine",
                        template:
                            "<div style=\"text-align:center;\">" +
                            "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" data-activity=\"#= PQC_HTASKACTIVITY #\" data-task=\"#= PQC_HTASK #\" data-org=\"#= PQC_HORG #\" data-id=\"#= PQC_ID #\" data-adr=\"#= PQC_HADR #\" data-wrh=\"#= PQC_HWAREHOUSE #\" data-desc=\"#= PQC_HDESC #\" data-hid=\"#= PQC_HID #\" /><label></label>" +
                            "</div>",
                        filterable: false,
                        sortable: false,
                        width: 35
                    },
                    {
                        type: "number",
                        field: "PQC_HID",
                        title: gridstrings.requesttopor[lang].hid,
                        width: 100

                    },
                    {
                        type: "string",
                        field: "PQC_LLINE",
                        title: gridstrings.requesttopor[lang].line,
                        width: 100

                    },
                    {
                        type: "string",
                        field: "PQC_HDESC",
                        title: gridstrings.requesttopor[lang].hdesc,
                        width: 300

                    },
                    {
                        type: "string",
                        field: "PQC_HORG",
                        title: gridstrings.requesttopor[lang].horg,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "PQC_HTYPE",
                        title: gridstrings.requesttopor[lang].htype,
                        width: 350
                    },
                    {
                        type: "string",
                        field: "PQC_HSTATUSDESC",
                        title: gridstrings.requesttopor[lang].hstatus,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "PQC_HQUOTATION",
                        title: gridstrings.requesttopor[lang].hquatation,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "PQC_HTASK",
                        title: gridstrings.requesttopor[lang].htask,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "PQC_HTASKACTIVITY",
                        title: gridstrings.requesttopor[lang].htaskactivity,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_REGION",
                        title: gridstrings.requesttopor[lang].region,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_CUSTOMERCODE",
                        title: gridstrings.requesttopor[lang].customer,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_HSUPPLIER",
                        title: gridstrings.requesttopor[lang].hsuppliercode,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "PQC_HSUPDESC",
                        title: gridstrings.requesttopor[lang].hsupplier,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_HWAREHOUSE",
                        title: gridstrings.requesttopor[lang].hwarehouse,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_HREQUESTEDBY",
                        title: gridstrings.requesttopor[lang].hrequestedby,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LPARTCODE",
                        title: gridstrings.requesttopor[lang].lpartcode,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LPARTDESC",
                        title: gridstrings.requesttopor[lang].lpartdesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LTYPE",
                        title: gridstrings.requesttopor[lang].ltype,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LTYPEDESC",
                        title: gridstrings.requesttopor[lang].ltypedesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LPARTNOTE",
                        title: gridstrings.requesttopor[lang].lpartnote,
                        width: 250
                    },
                  
                    {
                        type: "string",
                        field: "PQC_HADR",
                        title: "ADRES",
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LUOM",
                        title: gridstrings.requesttopor[lang].luom,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LREQUOM",
                        title: gridstrings.requesttopor[lang].lrequom,
                        width: 250
                    },
                    {
                        type: "na",
                        field: "txtline1",
                        title: gridstrings.requesttopor[lang].lquan,
                        template:
                            "<div style=\"text-align:center;\">" +
                            "<input  data-id=\"#= PQC_ID #\" style=\"width:220px;\" value=\"#= PQC_LQUANTITY #\" type=\"text\" calc-group=\"1\" min=\"0\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control\" id=\"quantity-#= PQC_ID #\" />" +
                            "</div>",
                        filterable: false,
                        sortable: false,
                        width: 250
                    },
                    {
                        type: "na",
                        field: "txtline2",
                        template:
                                "<div style=\"text-align:center;\">" +
                                "<input data-id=\"#= PQC_ID #\" valtype=\"PRICE\" style=\"width:220px;\" value=\"#= PQC_LUNITPRICE ? parseFloat(PQC_LUNITPRICE).fixed(constants.pricedecimals) : 0.0 #\" type=\"text\" calc-group=\"1\" min=\"0\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control quantity\" id=\"unitprice-#= PQC_ID #\" />" +
                                "</div>",
                        title: gridstrings.requesttopor[lang].unitprice,
                        filterable: false,
                        sortable: false,
                        width: 250
                    },
                    {
                        type: "na",
                        field: "txtline2",
                        template:
                            "<div style=\"text-align:center;\">" +
                                "<input data-id=\"#= PQC_ID #\" style=\"width:220px;\" value=\"0.0\" type=\"text\" calc-group=\"1\" min=\"0\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control quantity\" id=\"discountrate-#= PQC_ID #\" />" +
                                "</div>",
                        title: gridstrings.requesttopor[lang].discount,
                        filterable: false,
                        sortable: false,
                        width: 250
                    },
                    {
                        type: "na",
                        field: "txtline2",
                        template:
                            "<div style=\"text-align:center;\">" +
                                "<b><span id=\"discountedprice-#= PQC_ID #\" style=\"float:left;\">#=  parseFloat(PQC_LUNITPRICE).fixed(constants.pricedecimals)  #</span></b>" +
                                "</div>",
                        title: gridstrings.requesttopor[lang].discountprice,
                        filterable: false,
                        sortable: false,
                        width: 250
                    },
                    {
                        type: "na",
                        field: "txtline4",
                        template: "<div style=\"text-align:center;\">" +
                          "<b><span id=\"#= PQC_ID #\" style=\"float:left;\">#=  parseFloat(PQC_TOTALPRICE).fixed(constants.pricedecimals)  #</span></b>" +
                            "</div>",
                        title: gridstrings.requesttopor[lang].totalprice,
                        filterable: false,
                        sortable: false,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "PQC_LCURRENCY",
                        title: gridstrings.requesttopor[lang].curr,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "PQC_LVATTAX",
                        title: gridstrings.requesttopor[lang].vat,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "PQC_LTAX2",
                        title: gridstrings.requesttopor[lang].tax2,
                        width: 250
                    }

                ];

                grdRequisitionLines = new Grid({
                    keyfield: "PQC_ID",
                    columns: c,
                    fields: {
                        PQC_LTAX2: { type: "number" },
                        PQC_HID: { type: "number" },
                        PQC_LVATTAX: { type: "number" },
                        PQC_HTASKACTIVITY: { type: "number" },
                        PQC_HTASK: { type: "number" },
                        PQC_HQUOTATION: { type: "number" },
                        PQC_TOTALPRICE: { type: "number" },
                        PQC_LUNITPRICE: { type: "number" }
                    },
                    datafields : [
                        { name : "hid", field: "PQC_HID" }
                    ],
                    datasource: "/Api/ApiRequisitonToPurchaseOrder/List",
                    selector: "#grdRequisitionLines",
                    name: "grdRequisitionLines",
                    height: constants.defaultgridheight - 10,
                    primarycodefield: "PQC_ID",
                    primarytextfield: "PQC_HDESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "PQC_HID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    loadall: true,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>",
                            "<button class=\"btn btn-default btn-sm\" id=\"btnSaveLines\"><i class=\"fa fa-plus fa-fw\"></i>#=applicationstrings[lang].createpo#</button>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"purchaseorderrequisitions.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound
                });
            }
        }
        RegisterUIEvents();
    };

    function ready() {
        rtp.List();
    }

    $(document).ready(ready);
}());