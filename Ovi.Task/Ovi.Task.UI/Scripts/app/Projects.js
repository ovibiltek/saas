(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var projectid = 0;
    var scr, prj, tsk, quo, fxc;
    var isdisabled;

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
            name: "tsk",
            btns: []
        },
        {
            name: "fixedcosts",
            btns: []
        },
        {
            name: "quotation",
            btns: []
        }
    ];

    var shr = new function () {
        this.CalculateExch = function (curr, basecurr) {
            if (!curr)
                return $.Deferred().reject();
            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: selectedrecord ? selectedrecord.PRJ_ORGCURR : basecurr || (selectedorganization ? selectedorganization.ORG_CURRENCY : null),
                CRR_STARTDATE: moment()
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch)
            });
        };
    }
    fxc = new function () {
        var $grdFixedCosts = $("#grdFixedCosts");
        var grdFixedCosts = null;
        var self = this;
        var selectedfixedcost = null;

        var LoadSubTypes = function (v) {
            var gridreq = {
                sort: [{ field: "MCT_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "MCT_ACTIVE", value: "+", operator: "eq" },
                        { field: "MCT_TYPE", value: v, operator: "eq" }
                    ]
                }
            };

            return select({
                ctrl: "#fixedcosttype",
                url: "/Api/ApiMiscCostTypes/List",
                keyfield: "MCT_CODE",
                textfield: "MCT_DESC",
                data: JSON.stringify(gridreq),
                callback: function (d) {
                    if ($("#typ").val() === "SERVICE")
                        $("#fixedcosttype").val("SERVIS");
                }
            }).Fill();
        };
        var CalculateTotal = function () {
            var v_misccostunitprice = $("#fixedcostunitprice").val();
            var v_misccostqty = $("#fixedcostqty").val();
            if (v_misccostunitprice && v_misccostqty) {
                var total = (parseFloat(v_misccostunitprice) *
                    parseFloat(v_misccostqty))
                    .fixed(constants.pricedecimals);
                return total;
            }
        };
        var CalculateExch = function () {
            var curr = $("#fixedcostcurr").val();
            if (curr) {
                return $.when(shr.CalculateExch(curr, organizationcurr)).done(function (d) {
                    if (d.data) {
                        if (curr === organizationcurr) {
                            $("#fixedcostexch").prop("disabled", true).removeAttr("required").removeClass("required");
                        } else {
                            $("#fixedcostexch").prop("disabled", false).attr("required", "required").addClass("required");
                        }
                        $("#fixedcostexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                        $("#fixedcosttotal").val(CalculateTotal());
                    } else {
                        $("#fixedcostexch").val("");
                        $("#fixedcosttotal").val("");
                    }
                });
            }
        };
        var FillUserInterface = function () {
            tms.UnBlock("#fixedcostsform");
            tms.BeforeFill("#fixedcosts");

            $("#fixedcostdate").val(moment(selectedfixedcost.FXC_DATE).format(constants.dateformat));
            $("#fixedcostdesc").val(selectedfixedcost.FXC_DESC);
            $("#typ").val(selectedfixedcost.FXC_PTYPE);
            $.when(LoadSubTypes(selectedfixedcost.FXC_PTYPE)).done(function () {
                $("#fixedcosttype").val(selectedfixedcost.FXC_TYPE);
            });
            $("#fixedcostunitprice").val(parseFloat(selectedfixedcost.FXC_UNITPRICE).fixed(constants.pricedecimals));
            $("#fixedcostcurr").val(selectedfixedcost.FXC_CURR);
            $("#fixedcostexch").val(parseFloat(selectedfixedcost.FXC_EXCH).fixed(constants.exchdecimals));
            $("#fixedcostqty").val(parseFloat(selectedfixedcost.FXC_QTY).fixed(constants.qtydecimals));
            $("#fixedcostuom").val(selectedfixedcost.FXC_UOM);
            $("#fixedcosttotal").val(parseFloat(selectedfixedcost.FXC_TOTAL).fixed(constants.pricedecimals));

            tooltip.show("#fixedcostcurr", selectedfixedcost.FXC_CURRDESC);
            tooltip.show("#fixedcostuom", selectedfixedcost.FXC_UOMDESC);
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiFixedCosts/Get",
                data: JSON.stringify(selectedfixedcost.FXC_ID),
                fn: function (d) {
                    selectedfixedcost = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selectedfixedcost = grdFixedCosts.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.ResetUI = function () {
            selectedfixedcost = null;

            tms.UnBlock("#fixedcostsform");
            tms.Reset("#fixedcosts");

            $("#fixedcostdate").val(tms.Now().format(constants.dateformat));
            $("#fixedcostdesc").val("");
            $("#typ").val("").trigger("change");
            $("#fixedcostunitprice").val("");
            $("#fixedcostunitsalesprice").val("");
            $("#fixedcostexch").val("");
            $("#fixedcostqty").val("");
            $("#fixedcostuom").val("");
            $("#fixedcosttotal").val("");

            tooltip.hide("#fixedcostcurr");
            tooltip.hide("#fixedcostuom");

            $("#fixedcostcurr").val(selectedrecord.PRJ_ORGCURR);
            $("#fixedcosttotalcurr").val(selectedrecord.PRJ_ORGCURR);

            tooltip.show("#fixedcostcurr", selectedrecord.PRJ_ORGCURRDESC);
            tooltip.show("#fixedcosttotalcurr", selectedrecord.PRJ_ORGCURRDESC);

            return CalculateExch();
        };
        var gridDataBound = function (e) {
            var data = grdFixedCosts.GetData();
            var sum = 0;
            $.each(data, function () { sum += parseFloat(this.FXC_TOTAL * this.FXC_EXCH) || 0; });
            $grdFixedCosts.find("#grdSumValue").html("<span style=\"color:#cf192d\"><strong>" + applicationstrings[lang].total + " : </strong>" + parseFloat(sum).fixed(constants.pricedecimals) + " " + selectedrecord.PRJ_ORGCURR + "</span>");
        }
        this.List = function () {
            var grdFilter = [{ field: "FXC_PROJECT", value: selectedrecord.PRJ_ID, operator: "eq", logic: "and" }];
            if (grdFixedCosts) {
                grdFixedCosts.ClearSelection();
                grdFixedCosts.RunFilter(grdFilter);
            } else {
                var columns = [
                    { type: "date", field: "FXC_DATE", title: gridstrings.fixedcosts[lang].date, width: 150 },
                    { type: "string", field: "FXC_DESC", title: gridstrings.fixedcosts[lang].desc, width: 250 },
                    { type: "string", field: "FXC_PTYPE", title: gridstrings.fixedcosts[lang].ptype, width: 150 },
                    { type: "string", field: "FXC_TYPEDESC", title: gridstrings.fixedcosts[lang].type, width: 250 },
                    { type: "price", field: "FXC_UNITPRICE", title: gridstrings.fixedcosts[lang].unitprice, width: 150 },
                    { type: "string", field: "FXC_CURR", title: gridstrings.fixedcosts[lang].curr, width: 150 },
                    { type: "qty", field: "FXC_QTY", title: gridstrings.fixedcosts[lang].qty, width: 150 },
                    { type: "string", field: "FXC_UOM", title: gridstrings.fixedcosts[lang].uom, width: 150 },
                    { type: "price", field: "FXC_TOTAL", title: gridstrings.fixedcosts[lang].total, width: 150 }
                ];

                grdFixedCosts = new Grid({
                    keyfield: "FXC_ID",
                    columns: columns,
                    datasource: "/Api/ApiFixedCosts/List",
                    selector: "#grdFixedCosts",
                    name: "grdFixedCosts",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "FXC_ID", dir: "desc" }],
                    change: gridChange,
                    toolbar: {
                        left: [
                            "<div id=\"grdSumValue\"></div>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"FixedCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
        var AddCheck = function () {
            var fixedcostexch = $("#fixedcostexch").val();
            if (!fixedcostexch) {
                msgs.error(applicationstrings[lang].fixedcostexch);
                return false;
            }
            return true;
        };
        this.Save = function () {
            if (!tms.Check("#fixedcosts") || !AddCheck())
                return $.Deferred().reject();

            var fixedcost = {
                FXC_ID: selectedfixedcost ? selectedfixedcost.FXC_ID : 0,
                FXC_PROJECT: selectedrecord.PRJ_ID,
                FXC_DATE: moment.utc($("#fixedcostdate").val(), constants.dateformat),
                FXC_DESC: $("#fixedcostdesc").val(),
                FXC_TYPE: $("#fixedcosttype").val(),
                FXC_PTYPE: $("#typ").val(),
                FXC_UNITPRICE: parseFloat($("#fixedcostunitprice").val()),
                FXC_CURR: $("#fixedcostcurr").val(),
                FXC_EXCH: $("#fixedcostexch").val(),
                FXC_QTY: parseFloat($("#fixedcostqty").val()),
                FXC_UOM: $("#fixedcostuom").val(),
                FXC_TOTAL: CalculateTotal(),
                FXC_CREATED: selectedfixedcost != null ? selectedfixedcost.FXC_CREATED : tms.Now(),
                FXC_CREATEDBY: selectedfixedcost != null ? selectedfixedcost.FXC_CREATEDBY : user,
                FXC_UPDATED: selectedfixedcost != null ? tms.Now() : null,
                FXC_UPDATEDBY: selectedfixedcost != null ? user : null,
                FXC_RECORDVERSION: selectedfixedcost != null ? selectedfixedcost.FXC_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiFixedCosts/Save",
                data: JSON.stringify(fixedcost),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedfixedcost) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiFixedCosts/DelRec",
                        data: JSON.stringify(selectedfixedcost.FXC_ID),
                        fn: function (d) {
                            msgs.success(d.data);
                            self.ResetUI();
                            self.List();
                        }
                    });
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnSaveFixedCost").click(self.Save);
            $("#btnAddFixedCost").click(self.ResetUI);
            $("#btnDeleteFixedCost").click(self.Delete);
            $("#btnfixedcostuom").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.uoms[lang].title,
                    listurl: "/Api/ApiUoms/List",
                    keyfield: "UOM_CODE",
                    codefield: "UOM_CODE",
                    textfield: "UOM_DESC",
                    returninput: "#fixedcostuom",
                    columns: [
                        { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                        { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnfixedcostcurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#fixedcostcurr",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (d) {
                        $("#fixedcosttotalcurr").val(d ? d.CUR_CODE : "");
                        if (d) {
                            tooltip.show("#fixedcosttotalcurr", d.CUR_DESC);
                            return CalculateExch();
                        }
                    }
                });
            });

            $("#fixedcostuom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });
            $("#typ").on("change", function () {
                var $this = $(this);
                LoadSubTypes($this.val());
            });
            $("#fixedcostcurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                callback: function (d) {
                    $("#fixedcosttotalcurr").val(d ? d.CUR_CODE : "");
                    if (d) {
                        tooltip.show("#fixedcosttotalcurr", d.CUR_DESC);
                        return CalculateExch();
                    }
                }
            });
            $("#fixedcostsform input[calc-group=\"1\"]").on("change", function () {
                var total = CalculateTotal();
                $("#fixedcosttotal").val(total);
            });
        };
        RegisterUIEvents();
    }
    quo = new function () {
        var commentsHelper;
        var documentsHelper;
        var self = this;
        var cost = 0;

        var RowValues = function (row) {
            // Quantities
            var fqtye = row.find("input[field-id=\"fqty\"]");
            var eqtye = row.find("input[field-id=\"eqty\"]");
            var lqtye = row.find("input[field-id=\"lqty\"]");
            var fqtyv = parseFloat(fqtye.val());
            var eqtyv = parseFloat(eqtye.val() || "0");

            // Prices
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
                eunitpricepercv = (parseFloat(funitpricev) !== 0 ? Math.round((eunitpricev / funitpricev) * 100, constants.pricedecimals) : 0);
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
            var exch = selectedrecord.PRJ_EXCH || 1;
            var curr = selectedrecord.PRJ_CURR;
            var quotation = $("#quotation table tbody");
            var rows = quotation.find("tr[data-linetype]");
            var laborcostssum = 0;
            var partssum = 0;
            var misccostssum = 0;
            var fixedcostssum = 0;
            var toolssum = 0;
            var quotationtotal = 0;
            var quotationamount = 0;
            var profit = 0;
            var tax2 = 0;
            var vat = 0;

            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                var totalinp = rowsi.find("input[field-id=\"total\"]");
                quotationtotal += parseFloat(totalinp.val());
                switch (rowsi.data("linetype")) {
                    case "LABORCOST":
                        laborcostssum += parseFloat(totalinp.val());
                        break;
                    case "PART":
                        partssum += parseFloat(totalinp.val());
                        break;
                    case "MISCCOST":
                        misccostssum += parseFloat(totalinp.val());
                        break;
                    case "FIXEDCOST":
                        fixedcostssum += parseFloat(totalinp.val());
                        break;
                    case "TOOL":
                        toolssum += parseFloat(totalinp.val());
                        break;
                }
            }

            profit = quotationtotal - cost;
            tax2 = quotationtotal * selectedrecord.PRJ_TAX2;
            vat = (quotationtotal + tax2) * 0.18;
            quotationamount = (quotationtotal + tax2 + vat);

            $("#quoexch").text(exch.toLocaleString(undefined, { maximumFractionDigits: constants.exchdecimals, minimumFractionDigits: constants.exchdecimals }));
            $("#laborcostssum").text(laborcostssum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#partssum").text(partssum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#misccostssum").text(misccostssum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#fixedcostssum").text(fixedcostssum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#toolssum").text(toolssum.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#tax2").text(tax2.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#quotationtotal").text((quotationtotal + tax2).toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
            $("#profit").text(profit.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR) + " (" + Math.round(((profit / cost) * 100) * 100 / 100) + "%)");
            $("#vat").text(vat.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR) + " (18%)");
            $("#quotationamount").text(quotationamount.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (curr || selectedrecord.PRJ_ORGCURR));
        };
        var CalculateLineValues = function () {
            var quotation = $("#quotation table tbody");
            var rows = quotation.find("tr[data-linetype]");
            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                RowValues(rowsi);
            }
        };
        var BuildQuotationTable = function (d) {
            var exch = selectedrecord.PRJ_EXCH || 1;

            var quotationTable = $("#quotation table tbody");
            quotationTable.find("*").remove();
            var strlines = "";
            var lastlinetype = "";

            var lastrowpositions = [];
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                if (di.PPR_TYPE != lastlinetype) {
                    if (i !== 0)
                        lastrowpositions.push(i - 1);
                    lastlinetype = di.PPR_TYPE;
                }
            }

            lastlinetype = "";
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var linetype = di.PPR_TYPE;
                var rowspan = "";

                if (linetype != lastlinetype && i !== 0) {
                    strlines += "<tr><td style=\"background:#3498db;padding: 2px;\" colspan=\"14\"></td></tr>";
                }

                strlines += "<tr " +
                    " data-id=\"" +
                    di.PPR_ID +
                    "\" data-task=\"" +
                    (di.PPR_TASK || "") +
                    "\" data-linetype=\"" +
                    di.PPR_TYPE +
                    "\">";
                if (linetype != lastlinetype) {
                    var lines = $.grep(d, function (e) { return e.PPR_TYPE === linetype; });
                    rowspan = "rowspan=\"" + lines.length + "\"";
                    strlines += "<td " + rowspan + ">";
                    strlines += "<strong>" + gridstrings.pricingtypes[lang][di.PPR_TYPE] + "</strong>";
                    strlines += "</td>";
                    lastlinetype = linetype;
                }
                strlines += "<td>";
                strlines += (di.PPR_TASK || "");
                strlines += "</td>";
                strlines += "<td>";
                strlines += (di.PPR_ACTLINE ? (di.PPR_ACTLINE + " / " + di.PPR_ACTDESC) : "");
                strlines += "</td>";
                strlines += "<td>";
                if (di.PPR_CODE)
                    strlines += "<a class=\"history\" data-type=\"" + di.PPR_TYPE + "\" data-code=\"" + di.PPR_CODE + "\"  href=\"#\"><i style=\"cursor:pointer\" class=\"fa fa-fw fa-info-circle\" aria-hidden=\"true\"></i> ";
                strlines += (di.PPR_DESC || "");
                if (di.PPR_CODE)
                    strlines += "</a>";
                strlines += "</td>";
                strlines +=
                    "<td><input field-id=\"fqty\" class=\"form-control\" disabled=\"disabled\" value=\"" +
                    parseFloat(di.PPR_QTY).fixed(constants.qtydecimals) +
                    "\"/></td>";
                strlines += "<td><input field-id=\"eqty\" " +
                    (isdisabled ? " disabled=\"disabled\"" : "") +
                    " calc-on-change class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PPR_USERQTY ? parseFloat(di.PPR_USERQTY).fixed(constants.qtydecimals) : "") +
                    "\"></td>";
                strlines +=
                    "<td><input field-id=\"lqty\" class=\"form-control\" disabled=\"disabled\" value=\"" +
                    parseFloat(di.PPR_QTY).fixed(constants.qtydecimals) +
                    "\"/></td>";
                strlines += "<td><input class=\"form-control\" disabled=\"disabled\" type=\"text\" value=\"" +
                    di.PPR_UOM +
                    "\"/></td>";
                strlines +=
                    "<td><input field-id=\"funitprice\" class=\"form-control\" disabled=\"disabled\" type=\"numeric\" value=\"" +
                    parseFloat(di.PPR_UNITPRICE / exch).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines += "<td><input field-id=\"eunitpricepercent\" " +
                    (isdisabled ? " disabled=\"disabled\"" : "") +
                    " calc-on-change class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PPR_USERUNITPRICE
                        ? Math.round((di.PPR_USERUNITPRICE / di.PPR_UNITPRICE) * 100, constants.pricedecimals)
                        : "") +
                    "\"></td>";
                strlines += "<td><input field-id=\"eunitprice\" " +
                    (isdisabled ? " disabled=\"disabled\"" : "") +
                    " valtype=\"PRICE\" calc-on-change class=\"form-control\" type=\"numeric\" value=\"" +
                    (di.PPR_USERUNITPRICE ? parseFloat(di.PPR_USERUNITPRICE / exch).fixed(constants.pricedecimals) : "") +
                    "\"></td>";
                strlines +=
                    "<td><input field-id=\"lunitprice\" class=\"form-control\" disabled=\"disabled\" type=\"numeric\" value=\"" +
                    parseFloat(di.PPR_UNITPRICE / exch).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines +=
                    "<td><input field-id=\"total\" class=\"form-control\" disabled=\"disabled\" type=\"numeric\" value=\"" +
                    parseFloat(di.PPR_QTY * di.PPR_UNITPRICE / exch).fixed(constants.pricedecimals) +
                    "\"/></td>";
                strlines += "</tr>";
            }

            quotationTable.append(strlines);
            quotationTable.find("[valtype=\"PRICE\"]").on("change", function () {
                var v = $(this).val();
                if (v) $(this).val(parseFloat(v).fixed(constants.pricedecimals));
            });
            quotationTable.find(".btn-comments").unbind("click").click(function () {
                var task = $(this).closest("[data-task]").data("task");
                commentsHelper.showCommentsModal({ subject: "TASK", source: task });
            });
            quotationTable.find(".btn-docs").unbind("click").click(function () {
                var task = $(this).closest("[data-task]").data("task");
                documentsHelper.showDocumentsModal({ subject: "TASK", source: task });
            });
            quotationTable.find("a.history").unbind("click").click(function () {
                var code = $(this).data("code");
                var type = $(this).data("type");
                var f = [
                    { field: "PPR_TYPE", value: type, operator: "eq" },
                    { field: "PPR_CODE", value: code, operator: "eq" }
                ];

                gridModal.show({
                    modaltitle: gridstrings.projectquotationhistory[lang].title,
                    listurl: "/Api/ApiProjectPricing/List",
                    keyfield: "PPR_ID",
                    codefield: "PPR_CODE",
                    textfield: "PPR_DESC",
                    columns: [
                        { type: "string", field: "PPR_TSKCUSTOMER", title: gridstrings.projectquotationhistory[lang].customer, width: 300 },
                        { type: "string", field: "PPR_DESC", title: gridstrings.projectquotationhistory[lang].description, width: 300 },
                        { type: "price", field: "PPR_UNITPRICEEXCH", title: gridstrings.projectquotationhistory[lang].unitprice, width: 200 },
                        { type: "price", field: "PPR_CALCULATEDUNITPRICEEXCH", title: gridstrings.projectquotationhistory[lang].userunitprice, width: 200 },
                        { type: "string", field: "PPR_PROJECTCURR", title: gridstrings.projectquotationhistory[lang].curr, width: 100 },
                        { type: "datetime", field: "PPR_CREATED", title: gridstrings.projectquotationhistory[lang].created, width: 200 }
                    ],
                    fields:
                    {
                        PPR_UNITPRICE: { type: "number" },
                        PPR_USERUNITPRICE: { type: "number" },
                        PPR_CREATED: { type: "date" }
                    },
                    filter: f,
                    sort: [{ field: "PPR_CREATED", dir: "desc" }]
                });
            });

            quotationTable.find("input[calc-on-change]").numericInput({ allowNegative: true, allowFloat: true });
            quotationTable.find("input[calc-on-change]").on("change", function () {
                var $this = $(this);
                var row = $this.closest("tr");
                row.find("input[calc-on-change]").removeAttr("edited");
                $this.attr("edited", "+");
                RowValues(row);
                CalculateSum();
            }).on("change2", function () {
                var $this = $(this);
                var row = $this.closest("tr");
                row.find("input[calc-on-change]").removeAttr("edited");
                $this.attr("edited", "+");
                RowValues(row);
            });
        };
        this.Save = function () {
            var amendedlines = [];
            var quotationTable = $("#quotation table tbody");
            var rows = quotationTable.find("tr[data-linetype]");

            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                var eqty = rowsi.find("input[field-id=\"eqty\"]").val();
                var eunitprice = rowsi.find("input[field-id=\"eunitprice\"]").val();
                var id = rowsi.data("id");
                amendedlines.push({
                    PPR_ID: id,
                    PPR_USERQTY: (eqty !== 0 ? parseFloat(eqty).fixed(constants.qtydecimals) : null),
                    PPR_USERUNITPRICE: (eunitprice !== 0
                        ? parseFloat(eunitprice * (selectedrecord.PRJ_EXCH || 1)).fixed(constants.pricedecimals)
                        : null)
                });
            }

            if (amendedlines.length > 0) {
                return tms.Ajax({
                    url: "/Api/ApiProjectPricing/SaveList",
                    data: JSON.stringify(amendedlines),
                    fn: function (d) {
                        msgs.success(d.data);
                        $("#amendment").val("");
                    }
                });
            }
        };
        this.List = function () {
            if (selectedrecord) {
                return tms.Ajax({
                    url: "/Api/ApiProjectPricing/ListByProject",
                    data: JSON.stringify(selectedrecord.PRJ_ID),
                    fn: function (d) {
                        cost = 0;
                        $.each(d.data, function (i, e) {
                            var unitprice = parseFloat((e.PPR_UNITPRICE / (selectedrecord.PRJ_EXCH || 1)).fixed(constants.pricedecimals));
                            cost += e.PPR_QTY * unitprice;
                        });
                        $("#cost").text(cost.toLocaleString(undefined, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) + " " + (selectedrecord.PRJ_CURR || selectedrecord.PRJ_ORGCURR));
                        BuildQuotationTable(d.data);
                        CalculateLineValues();
                        CalculateSum();
                        $("#btnSaveQuotation,#amendment").prop("disabled", isdisabled);
                    }
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnSaveQuotation").click(self.Save);
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
                btnaddcomment: "#addTaskComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-task=\"#source#\"] button.btn-comments span.txt",
                commentsdiv: "#tskcomments"
            });
            $("#amendment").on("change", function () {
                var val = $(this).val();
                $("#quotationtable input[field-id=\"eunitpricepercent\"]").val(val).trigger("change2");
                CalculateSum();
            });
        };
        RegisterUIEvents();
    };
    tsk = new function () {
        var self = this;
        var grdProjectTasks = null;
        var grdProjectTasksElm = $("#grdProjectTasks");
        var gridfilter = [];

        function itemSelect(row) {
            var selectedrecord = grdProjectTasks.GetRowDataItem(row);
            $("[data-id]").removeClass("k-state-selected");
            row.addClass("k-state-selected");
        }

        var gridDataBound = function () {
            grdProjectTasksElm.find("[data-id]").unbind("click").click(function () {
                itemSelect($(this));
            });

            grdProjectTasksElm.find(".btn-comments").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                commentsHelper.showCommentsModal({
                    subject: "TASK",
                    source: id
                });
            });

            grdProjectTasksElm.contextMenu({
                selector: "div.k-grid-content tr",
                items: {
                    audit: {
                        name: applicationstrings[lang].newtab,
                        callback: function () {
                            var id = $(this).closest("[data-id]").data("id");
                            var win = window.open("/Task/Record/" + id, "_blank");
                        }
                    }
                }
            });

            grdProjectTasksElm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                documentsHelper.showDocumentsModal({
                    subject: "TASK",
                    source: id
                });
            });
        };
        this.List = function () {
            gridfilter.push({ field: "TSK_PROJECT", value: selectedrecord.PRJ_ID, operator: "eq", logic: "and" });
            if (grdProjectTasks) {
                grdProjectTasks.ClearSelection();
                grdProjectTasks.RunFilter(gridfilter);
            } else {
                if ($.inArray("*", authorizeddepartmentsarr) === -1) {
                    gridfilter.push({
                        IsPersistent: true,
                        field:"ACTIVITYDEPARTMENTAUTHTABLE.TSKID",
                        value: user,
                        operator: "func",
                        logic: "or"
                    });
                    gridfilter.push({
                        IsPersistent: true,
                        field: "TSK_DEPARTMENT",
                        value: authorizeddepartmentsarr,
                        operator: "in",
                        logic: "or"
                    });
                    gridfilter.push({
                        IsPersistent: true,
                        field: "TSK_CREATEDBYDEPARTMENT",
                        value: authorizeddepartmentsarr,
                        operator: "in",
                        logic: "or"
                    });
                    gridfilter.push({
                        IsPersistent: true,
                        field: "TSK_CREATEDBY",
                        value: user,
                        operator: "eq",
                        logic: "or"
                    });
                    gridfilter.push({
                        IsPersistent: true,
                        field: "TSK_REQUESTEDBY",
                        value: user,
                        operator: "eq",
                        logic: "or"
                    });
                    gridfilter.push({
                        IsPersistent: true,
                        field: "TSK_ASSIGNEDTO",
                        value: user,
                        operator: "contains",
                        logic: "or"
                    });
                    gridfilter.push({
                        IsPersistent: true,
                        field: "TSK_FOLLOWED",
                        value: user,
                        operator: "contains",
                        logic: "or"
                    });
                }

                grdProjectTasks = new Grid({
                    keyfield: "TSK_ID",
                    columns: [
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
                            type: "number",
                            field: "TSK_PSPCODE",
                            title: gridstrings.tasklist[lang].pspcode,
                            width: 150
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
                            type: "string",
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
                        }
                    ],
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
                        TSK_PSPCODE: { type: "number" }
                    },
                    datasource: "/Api/ApiTask/List",
                    selector: "#grdProjectTasks",
                    name: "grdProjectTasks",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "TSK_ID",
                    primarytextfield: "TSK_SHORTDESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    hasfiltermenu: false,
                    sort: [{ field: "TSK_ID", dir: "desc" }],
                    toolbarColumnMenu: false,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Tasks.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
    };
    prj = new function () {
        var self = this;
        var grdProjects = null;
        var grdProjectsElm = $("#grdProjects");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var taskCustomFieldsHelper;
        var organizationcurr = null;

        var GetFilter;
        var LoadTypes;
        var LoadSideBarStatuses;
        var RunSidebarFilter;
        var ResetSidebarFilter;

        var CalculateExch = function () {
            var curr = $("#currency").val();
            if (curr) {
                return $.when(shr.CalculateExch(curr, organizationcurr)).done(function (d) {
                    if (d.data) {
                        if (curr === organizationcurr) {
                            $("#exch").prop("disabled", true).removeAttr("required").removeClass("required");
                        } else {
                            $("#exch").prop("disabled", false).attr("required", "required").addClass("required");
                        }
                        $("#exch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#exch").val("");
                    }
                });
            }
        };
        this.Print = function () {
            $("#modalprint").modal("show");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPROJECTS", operator: "eq" },
                    { field: "AUD_REFID", value: projectid, operator: "eq" }
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
                        organizationcurr = null;
                        $("#type").val("");
                        tooltip.hide("#type");
                        if (d) {
                            $("#currency").val(d.ORG_CURRENCY);
                            tooltip.show("#currency", d.ORG_CURRENCYDESC);
                            organizationcurr = d.ORG_CURRENCY;
                            return CalculateExch();
                        }
                    }
                });
            });
            $("#btnregion").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.regions[lang].title,
                    listurl: "/Api/ApiRegions/List",
                    keyfield: "REG_CODE",
                    codefield: "REG_CODE",
                    textfield: "REG_DESCF",
                    returninput: "#region",
                    columns: [
                        { type: "string", field: "REG_CODE", title: gridstrings.regions[lang].code, width: 100 },
                        { type: "string", field: "REG_DESCF", title: gridstrings.regions[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "REG_ACTIVE", value: "+", operator: "eq" }
                    ]
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
                        { field: "TYP_ENTITY", value: "PROJECT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "PROJECT",
                                source: projectid,
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
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#customerdesc").val(data ? data.CUS_DESC : "");
                        $("#contactperson").val(data ? data.CUS_CONTACTPERSON01 : "");
                        $("#contactphone").val(data ? data.CUS_PHONE01 : "");
                        $("#contactemail").val(data ? data.CUS_CSR : "");
                    }
                });
            });
            $("#btnprovince").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.addresssection[lang].title,
                    listurl: "/Api/ApiAddressSections/List",
                    keyfield: "ADS_CODE",
                    codefield: "ADS_CODE",
                    textfield: "ADS_DESC",
                    returninput: "#province",
                    columns: [
                        { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "ADS_DESC",
                            title: gridstrings.addresssection[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                        { field: "ADS_TYPE", value: "IL", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#region").val("");
                        tooltip.hide("#region");
                        if (data) {
                            $("#region").val(data.ADS_REGION);
                            tooltip.show("#region", data.ADS_REGIONDESC);
                        }
                    }
                });
            });
            $("#btndistrict").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.addresssection[lang].title,
                    listurl: "/Api/ApiAddressSections/List",
                    keyfield: "ADS_CODE",
                    codefield: "ADS_CODE",
                    textfield: "ADS_DESC",
                    returninput: "#district",
                    columns: [
                        { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "ADS_DESC",
                            title: gridstrings.addresssection[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                        { field: "ADS_TYPE", value: "ILCE", operator: "eq" },
                        { field: "ADS_PARENT", value: $("#province").val(), operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#region").val("");
                        tooltip.hide("#region");
                        if (data) {
                            $("#region").val(data.ADS_REGION);
                            tooltip.show("#region", data.ADS_REGIONDESC);
                        }
                    }
                });
            });
            $("#btndepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#department",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_CODE", value: "*", operator: "neq" },
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [selectedrecord.PRJ_ORGANIZATION, "*"], operator: "in" }
                    ]
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
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_CUSTOMER", value: selectedrecord.PRJ_CUSTOMER, operator: "eq" }
                    ],
                    callback: function (data) {
                        if (data && data.BRN_LOCATION) {
                            $("#location").val(data.BRN_LOCATION);
                            tooltip.show("#location", data.BRN_LOCATIONDESC);
                        } else {
                            $("#location").val("");
                            tooltip.hide("#location");
                        }
                    }
                });
            });
            $("#btnlocation").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.location[lang].title,
                    listurl: "/Api/ApiLocations/List",
                    keyfield: "LOC_CODE",
                    codefield: "LOC_CODE",
                    textfield: "LOC_DESC",
                    returninput: "#location",
                    columns: [
                        { type: "string", field: "LOC_CODE", title: gridstrings.location[lang].location, width: 100 },
                        { type: "string", field: "LOC_DESC", title: gridstrings.location[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "LOC_ACTIVE", value: "+", operator: "eq" },
                        { field: "LOC_BRANCH", value: $("#branch").val(), operator: "eq" },
                        { field: "LOC_DEPARTMENT", value: [$("#department").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btncategory").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#category",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CAT_ACTIVE", value: "+", operator: "eq" },
                        { field: "CAT_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btntasktype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/ListByDepartment",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#tasktype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "TYP_DEPARTMENT", value: [$("#department").val(), "*"], operator: "in" },
                        { field: "TYP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        if (data) {
                            taskCustomFieldsHelper.loadCustomFields({
                                subject: "TASK",
                                source: 0,
                                type: data.TYP_CODE
                            });
                        }
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
                    filter: [{ field: "CUR_ACTIVE", value: "+", operator: "eq" }],
                    callback: function () {
                        return CalculateExch();
                    }
                });
            });
            $("#btnparent").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.project[lang].title,
                    listurl: "/Api/ApiProjects/List",
                    keyfield: "PRJ_ID",
                    codefield: "PRJ_ID",
                    textfield: "PRJ_DESC",
                    returninput: "#parent",
                    columns: [
                        { type: "string", field: "PRJ_ID", title: gridstrings.project[lang].project, width: 100 },
                        { type: "string", field: "PRJ_DESC", title: gridstrings.project[lang].description, width: 400 }
                    ],
                    filter: [{ field: "PRJ_ID", value: selectedrecord ? selectedrecord.PRJ_ID : 0, operator: "neq" }]
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
                    organizationcurr = null;
                    $("#type").val("");
                    tooltip.hide("#type");
                    if (d) {
                        organizationcurr = d.ORG_CURRENCY;
                        $("#org").val(d.ORG_CODE);
                        $("#currency").val(d.ORG_CURRENCY);
                        tooltip.show("#org", d.ORG_DESCF);
                        tooltip.show("#currency", d.ORG_CURRENCYDESC);
                    }
                    return CalculateExch();
                }
            });
            $("#region").autocomp({
                listurl: "/Api/ApiRegions/List",
                geturl: "/Api/ApiRegions/Get",
                field: "REG_CODE",
                textfield: "REG_DESCF",
                active: "REG_ACTIVE",
                callback: function (data) {
                    if (data) {
                        $("#region").val(data.REG_CODE);
                        tooltip.show("#region", data.REG_DESCF);
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
                    { field: "TYP_ENTITY", value: "PROJECT", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({
                            subject: "PROJECT",
                            source: projectid,
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
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }],
                callback: function (data) {
                    $("#customerdesc").val(data ? data.CUS_DESC : "");
                    $("#contactperson").val(data ? data.CUS_CONTACTPERSON01 : "");
                    $("#contactphone").val(data ? data.CUS_PHONE01 : "");
                    $("#contactemail").val(data ? data.CUS_CSR : "");
                }
            });
            $("#province").autocomp({
                listurl: "/Api/ApiAddressSections/List",
                geturl: "/Api/ApiAddressSections/Get",
                field: "ADS_CODE",
                textfield: "ADS_DESC",
                active: "ADS_ACTIVE",
                filter: [
                    { field: "ADS_TYPE", value: "IL", operator: "eq" }
                ],
                callback: function (data) {
                    $("#region").val("");
                    tooltip.hide("#region");
                    if (data) {
                        $("#region").val(data.ADS_REGION);
                        tooltip.show("#region", data.ADS_REGIONDESC);
                    }
                }
            });
            $("#district").autocomp({
                listurl: "/Api/ApiAddressSections/List",
                geturl: "/Api/ApiAddressSections/Get",
                field: "ADS_CODE",
                textfield: "ADS_DESC",
                active: "ADS_ACTIVE",
                filter: [
                    { field: "ADS_TYPE", value: "ILCE", operator: "eq" },
                    { field: "ADS_PARENT", func: function () { return $("#province").val() }, operator: "eq" }
                ],
                callback: function (data) {
                    $("#region").val("");
                    tooltip.hide("#region");
                    if (data) {
                        $("#region").val(data.ADS_REGION);
                        tooltip.show("#region", data.ADS_REGIONDESC);
                    }
                }
            });
            $("#location").autocomp({
                listurl: "/Api/ApiLocations/List",
                geturl: "/Api/ApiLocations/Get",
                field: "LOC_CODE",
                textfield: "LOC_DESC",
                active: "LOC_ACTIVE",
                filter: [
                    {
                        field: "LOC_ORG",
                        func: function () { return selectedrecord.PRJ_ORGANIZATION; },
                        includeall: true
                    },
                    { field: "LOC_BRANCH", relfield: "#branch", includeall: true }
                ]
            });
            $("#department").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    { field: "DEP_ORG", func: function () { return selectedrecord.PRJ_ORGANIZATION; }, includeall: true }
                ]
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [
                    {
                        field: "BRN_CUSTOMER",
                        func: function () { return selectedrecord.PRJ_CUSTOMER; },
                        includeall: false
                    }
                ],
                callback: function (data) {
                    if (data && data.BRN_LOCATION) {
                        $("#location").val(data.BRN_LOCATION);
                        tooltip.show("#location", data.BRN_LOCATIONDESC);
                    } else {
                        $("#location").val("");
                        tooltip.hide("#location");
                    }
                }
            });
            $("#tasktype").autocomp({
                listurl: "/Api/ApiTypes/ListByDepartment",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESCF",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_DEPARTMENT", relfield: "#department", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" }
                ],
                callback: function (data) {
                    if (data) {
                        taskCustomFieldsHelper.loadCustomFields({
                            subject: "TASK",
                            source: 0,
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }]
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                callback: function () {
                    return CalculateExch();
                }
            });
            $("#parent").autocomp({
                listurl: "/Api/ApiProjects/List",
                geturl: "/Api/ApiProjects/Get",
                field: "PRJ_ID",
                textfield: "PRJ_DESC",
                filter: [{ field: "PRJ_ID", value: selectedrecord ? selectedrecord.PRJ_ID : 0, operator: "neq" }]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "PROJECT",
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
        var LoadPriorities = function () {
            var gridreq = {
                sort: [{ field: "PRI_CODE", dir: "desc" }],
                filter: {
                    filters: [
                        { field: "PRI_ORGANIZATION", value: [selectedrecord.PRJ_ORGANIZATION, "*"], operator: "in" },
                        { field: "PRI_ACTIVE", value: "+", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiPriorities/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#priority option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option style=\"color:" +
                            d.data[i].PRI_COLOR +
                            "\" value=\"" +
                            d.data[i].PRI_CODE +
                            "\">" +
                            d.data[i].PRI_DESCF +
                            "</option>";
                    }
                    $("#priority").append(strOptions);
                    $("#priority").val($("#priority").data("selected"));
                }
            });
        };
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "PROJECT", operator: "eq" },
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
                        { field: "CNR_ENTITY", value: "PROJECT", operator: "eq" }
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
        var LoadChannels = function () {
            var gridreq = {
                sort: [{ field: "SYC_CODE", dir: "desc" }],
                filter: {
                    filters: [
                        { field: "SYC_GROUP", value: "CHANNEL", operator: "eq" },
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#channel option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].SYC_CODE +
                            "\">" +
                            d.data[i].SYC_DESCRIPTION +
                            "</option>";
                    }
                    $("#channel").append(strOptions);
                    $("#channel").val($("#channel").data("selected"));
                }
            });
        }
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
                    $("#record [disableoncomplete]:not([overridable=\"false\"]) ").prop("disabled", false);
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
        this.Save = function () {
            if (!tms.Check("#project,#divCustomFields"))
                return $.Deferred().reject();

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues({
                    subject: "PROJECT",
                    source: projectid,
                    type: $("#type").val()
                });
            var o = JSON.stringify(
                {
                    Project: {
                        PRJ_ID: (projectid || 0),
                        PRJ_ORGANIZATION: $("#org").val(),
                        PRJ_DESC: $("#description").val(),
                        PRJ_TYPE: $("#type").val(),
                        PRJ_TYPEENTITY: "PROJECT",
                        PRJ_STATUSENTITY: "PROJECT",
                        PRJ_STATUS: $("#status").val(),
                        PRJ_ESTIMATEDSTART: ($("#estimatedstart").val() ? moment.utc($("#estimatedstart").val(), constants.dateformat) : null),
                        PRJ_ESTIMATEDEND: ($("#estimatedend").val() ? moment.utc($("#estimatedend").val(), constants.dateformat) : null),
                        PRJ_OFFERDEADLINE: ($("#offerdeadline").val() ? moment.utc($("#offerdeadline").val(), constants.longdateformat) : null),
                        PRJ_CUSTOMER: ($("#customer").val() || null),
                        PRJ_PROVINCE: ($("#province").val() || null),
                        PRJ_CHANNEL: $("#channel").val(),
                        PRJ_DISTRICT: ($("#district").val() || null),
                        PRJ_REGION: ($("#region").val() || null),
                        PRJ_CURR: ($("#currency").val() || null),
                        PRJ_EXCH: ($("#exch").val() || null),
                        PRJ_PAYMENTTERM: ($("#paymentterm").val() || null),
                        PRJ_CONTACTPERSON: ($("#contactperson").val() || null),
                        PRJ_CONTACTPHONE: ($("#contactphone").val() || null),
                        PRJ_CONTACTEMAIL: ($("#contactemail").val() || null),
                        PRJ_PARENT: ($("#parent").val() || null),
                        PRJ_TAX2: (selectedrecord != null ? selectedrecord.PRJ_TAX2 : 0),
                        PRJ_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        PRJ_CANCELLATIONDESC: ($("#cancellationdesc").val() || null),
                        PRJ_CREATED: selectedrecord != null ? selectedrecord.PRJ_CREATED : tms.Now(),
                        PRJ_CREATEDBY: selectedrecord != null ? selectedrecord.PRJ_CREATEDBY : user,
                        PRJ_UPDATED: selectedrecord != null ? tms.Now() : null,
                        PRJ_UPDATEDBY: selectedrecord != null ? user : null,
                        PRJ_RECORDVERSION: selectedrecord != null ? selectedrecord.PRJ_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiProjects/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    projectid = d.r.Project.PRJ_ID;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (projectid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiProjects/DelRec",
                            data: JSON.stringify(projectid),
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
            projectid = 0;

            tms.Reset("#record");

            $("#projectid").val("");
            $("#org").val("");
            $("#description").val("");
            $("#type").val("");
            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();
            $("#estimatedstart").val("");
            $("#estimatedend").val("");
            $("#offerdeadline").val("");
            $("#customer").val("");
            $("#customerdesc").val("");
            $("#channel").val("");
            $("#province").val("");
            $("#district").val("");
            $("#region").val("");
            $("#currency").val("");
            $("#exch").val("");
            $("#paymentterm").val("");
            $("#contactperson").val("");
            $("#contactphone").val("");
            $("#contactemail").val("");
            $("#parent").val("");
            $("#totaltaskcount").val("");
            $("#totalactivitycount").val("");
            $("#offerrevisioncount").html("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#active").prop("checked", true);
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");

            tooltip.hide("#type");
            tooltip.hide("#region");
            tooltip.hide("#parent");
            tooltip.hide("#org");
            tooltip.hide("#province");
            tooltip.hide("#district");
            tooltip.hide("#region");
            tooltip.hide("#currency");

            $("#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            self.ResetTaskUI();
            LoadChannels();

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        this.ResetTaskUI = function () {
            tms.Block("#taskdetails div.panel-body");

            $("#taskdescription").val("");
            $("#department").val("");
            $("#tasktype").val("");
            $("#category").val("");
            $("#branch").val("");
            $("#location").val("");
            $("#requestedby").val(user);
            $("#daterequested").val(tms.Now().format(constants.longdateformat));
            $("#priority").data("selected", "NORMAL");
            $("#priority").val("NORMAL");
            $("#deadline").val("");

            tooltip.hide("#department");
            tooltip.hide("#tasktype");
            tooltip.hide("#category");
            tooltip.hide("#branch");
            tooltip.hide("#location");

            taskCustomFieldsHelper.clearCustomFields();
        };
        this.GenerateTask = function () {
            if (!tms.Check("#taskdetails")) {
                return $.Deferred().reject();
            }

            var customfieldvalues = taskCustomFieldsHelper.getCustomFieldScreenValues({
                subject: "TASK",
                source: 0,
                type: $("#tasktype").val()
            });

            var o = {
                Task: {
                    TSK_ID: 0,
                    TSK_ORGANIZATION: selectedrecord.PRJ_ORGANIZATION,
                    TSK_PROJECT: selectedrecord.PRJ_ID,
                    TSK_DEPARTMENT: $("#department").val(),
                    TSK_LOCATION: $("#location").val(),
                    TSK_CATEGORY: $("#category").val(),
                    TSK_TYPE: $("#tasktype").val(),
                    TSK_TYPEENTITY: "TASK",
                    TSK_SHORTDESC: $("#taskdescription").val(),
                    TSK_STATUS: "T",
                    TSK_PRIORITY: $("#priority").val(),
                    TSK_PROGRESS: 0,
                    TSK_FOLLOWED: null,
                    TSK_REQUESTEDBY: $("#requestedby").val(),
                    TSK_RATING: 0,
                    TSK_HIDDEN: "-",
                    TSK_DEADLINE: ($("#deadline").val() ? moment.utc($("#deadline").val(), constants.dateformat) : null),
                    TSK_REQUESTED: ($("#daterequested").val() ? moment.utc($("#daterequested").val(), constants.longdateformat) : null),
                    TSK_CLOSED: null,
                    TSK_COMPLETED: null,
                    TSK_RECORDVERSION: 0,
                    TSK_CUSTOMER: selectedrecord.PRJ_CUSTOMER,
                    TSK_BRANCH: ($("#branch").val() || null),
                    TSK_PSPCODE: null,
                    TSK_PRPCODE: null,
                    TSK_HOLDREASON: null,
                    TSK_HOLDDATE: null,
                    TSK_PTASK: null,
                    TSK_CHK01: "-",
                    TSK_CHK02: "-",
                    TSK_CHK03: "-",
                    TSK_CHK04: "-",
                    TSK_CHK05: "-"
                },
                CustomFieldValues: customfieldvalues
            };

            var jsonstr = JSON.stringify(o);
            return tms.Ajax({
                url: "/Api/ApiTask/Save",
                data: jsonstr,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetTaskUI();
                    self.LoadSelected();
                }
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#project");

            tms.Tab();
            tms.UnBlock("#taskdetails div.panel-body");

            $("#projectid").val(selectedrecord.PRJ_ID);
            $("#org").val(selectedrecord.PRJ_ORGANIZATION);
            $("#description").val(selectedrecord.PRJ_DESC);
            $("#type").val(selectedrecord.PRJ_TYPE);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#estimatedstart").val(selectedrecord.PRJ_ESTIMATEDSTART ? moment(selectedrecord.PRJ_ESTIMATEDSTART).format(constants.dateformat) : "");
            $("#estimatedend").val(selectedrecord.PRJ_ESTIMATEDEND ? moment(selectedrecord.PRJ_ESTIMATEDEND).format(constants.dateformat) : "");
            $("#offerdeadline").val(selectedrecord.PRJ_OFFERDEADLINE ? moment(selectedrecord.PRJ_OFFERDEADLINE).format(constants.longdateformat) : "");
            $("#customer").val(selectedrecord.PRJ_CUSTOMER);
            $("#customerdesc").val(selectedrecord.PRJ_CUSTOMERDESC);
            $("#channel").data("selected", selectedrecord.PRJ_CHANNEL);
            $("#province").val(selectedrecord.PRJ_PROVINCE);
            $("#district").val(selectedrecord.PRJ_DISTRICT);
            $("#region").val(selectedrecord.PRJ_REGION);
            $("#currency").val(selectedrecord.PRJ_CURR);
            $("#exch").val(selectedrecord.PRJ_EXCH ? parseFloat(selectedrecord.PRJ_EXCH).fixed(constants.exchdecimals) : "");
            $("#paymentterm").val(selectedrecord.PRJ_PAYMENTTERM);
            $("#contactperson").val(selectedrecord.PRJ_CONTACTPERSON);
            $("#contactphone").val(selectedrecord.PRJ_CONTACTPHONE);
            $("#contactemail").val(selectedrecord.PRJ_CONTACTEMAIL);
            $("#parent").val(selectedrecord.PRJ_PARENT);
            $("#totaltaskcount").val(selectedrecord.PRJ_TASKCOUNT);
            $("#totalactivitycount").val(selectedrecord.PRJ_ACTIVITYCOUNT);
            $("#offerrevisioncount").html("<span id=\"btnofferrevisioncount\" class=\"badge badge-info\"> " + selectedrecord.PRJ_OFFERREVCOUNT + "</span>");
            $("#createdby").val(selectedrecord.PRJ_CREATEDBY);
            $("#created").val(moment(selectedrecord.PRJ_CREATED).format(constants.longdateformat));
            $("#cancellationreason").data("selected", selectedrecord.PRJ_CANCELLATIONREASON);
            $("#cancellationdesc").val(selectedrecord.PRJ_CANCELLATIONDESC);

            tooltip.show("#org", selectedrecord.PRJ_ORGANIZATIONDESC);
            tooltip.show("#type", selectedrecord.PRJ_TYPEDESC);
            tooltip.show("#parent", selectedrecord.PRJ_PARENTDESC);
            tooltip.show("#customer", selectedrecord.BRN_CUSTOMERDESC);
            tooltip.show("#province", selectedrecord.PRJ_PROVINCEDESC);
            tooltip.show("#district", selectedrecord.PRJ_DISTRICTDESC);
            tooltip.show("#region", selectedrecord.PRJ_REGIONDESC);
            tooltip.show("#currency", selectedrecord.PRJ_CURRDESC);

            if (selectedrecord.PRJ_CURR === organizationcurr) {
                $("#exch").removeClass("required")
                    .prop("disabled", true)
                    .attr("overridable", false)
                    .removeAttr("required");
            } else {
                $("#exch").addClass("required")
                    .prop("disabled", false)
                    .attr("overridable", true)
                    .attr("required");
            }

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#btnBrowse").removeAttr("disabled");
            $("#comment,#addComment,#fu,#btnDelete").prop("disabled", false);

            commentsHelper.showCommentsBlock({ subject: "PROJECT", source: selectedrecord.PRJ_ID });
            documentsHelper.showDocumentsBlock({ subject: "PROJECT", source: selectedrecord.PRJ_ID });
            $.when(customFieldsHelper.loadCustomFields({ subject: "PROJECT", source: projectid, type: selectedrecord.PRJ_TYPE })).done(function () {
                $.when(LoadStatuses({ pcode: selectedstatus.STA_PCODE, code: selectedstatus.STA_CODE, text: selectedstatus.STA_DESCF })).done(function () {
                    EvaluateCurrentStatus();
                });
            });

            LoadPriorities();
            LoadChannels();
            LoadCancellationReasons();

            $("#btnofferrevisioncount").on("click", function () {
                gridModal.show({
                    modaltitle: gridstrings.projectofferrevisions[lang].title,
                    listurl: "/Api/ApiProjectOfferRevisions/List",
                    keyfield: "PRV_ID",
                    codefield: "PRV_ID",
                    textfield: "PRV_REVNO",
                    sort: [{ field: "PRV_REVNO", dir: "asc" }],
                    columns: [
                        { type: "number", field: "PRV_REVNO", title: gridstrings.projectofferrevisions[lang].revno, width: 150 },
                        { type: "price", field: "PRV_LABORSUM", title: gridstrings.projectofferrevisions[lang].laborsum, width: 150 },
                        { type: "price", field: "PRV_MISCCOST", title: gridstrings.projectofferrevisions[lang].misccost, width: 150 },
                        { type: "price", field: "PRV_PART", title: gridstrings.projectofferrevisions[lang].part, width: 150 },
                        { type: "price", field: "PRV_TOOL", title: gridstrings.projectofferrevisions[lang].tool, width: 150 },
                        { type: "price", field: "PRV_FIXEDCOST", title: gridstrings.projectofferrevisions[lang].fixedcost, width: 150 },
                        { type: "price", field: "PRV_EXCH", title: gridstrings.projectofferrevisions[lang].exch, width: 150 },
                        { type: "price", field: "PRV_TOTAL", title: gridstrings.projectofferrevisions[lang].total, width: 150 },
                        { type: "price", field: "PRV_COST", title: gridstrings.projectofferrevisions[lang].cost, width: 150 },
                        { type: "price", field: "PRV_PROFIT", title: gridstrings.projectofferrevisions[lang].profit, width: 150 },
                        { type: "string", field: "PRV_CURR", title: gridstrings.projectofferrevisions[lang].curr, width: 150 },
                        { type: "datetime", field: "PRV_UPDATED", title: gridstrings.projectofferrevisions[lang].updated, width: 150 },
                        { type: "string", field: "PRV_UPDATEDBY", title: gridstrings.projectofferrevisions[lang].updatedby, width: 150 }
                    ],
                    fields:
                    {
                        PRV_REVNO: { type: "number" },
                        PRV_LABORSUM: { type: "number" },
                        PRV_MISCCOST: { type: "number" },
                        PRV_PART: { type: "number" },
                        PRV_TOOL: { type: "number" },
                        PRV_FIXEDCOST: { type: "number" },
                        PRV_EXCH: { type: "number" },
                        PRV_TOTAL: { type: "number" },
                        PRV_UPDATED: { type: "date" }
                    },
                    filter: [
                        { field: "PRV_PROJECT", value: projectid, operator: "eq" }
                    ]
                });
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiProjects/Get",
                data: JSON.stringify(projectid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    isdisabled = $.inArray(selectedrecord.PRJ_STATUS, ["P2", "RT"]) === -1;
                    FillUserInterface();
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdProjects.GetRowDataItem(row);
            projectid = selectedrecord.PRJ_ID;
            organizationcurr = selectedrecord.PRJ_ORGCURR;
            $(".page-header h6").html(selectedrecord.PRJ_ID + " - " + selectedrecord.PRJ_DESC);
            isdisabled = $.inArray(selectedrecord.PRJ_STATUS, ["P2", "RT"]) === -1;
            $("#ProjectId").val(selectedrecord.PRJ_ID);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdProjectsElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdProjectsElm.find("#search").off("click").on("click", function () {
                $.when(LoadTypes(), LoadSideBarStatuses()).done(function () {
                    $(".sidebar.right").trigger("sidebar:open");
                });
            });
            grdProjectsElm.contextMenu({
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
                            var win = window.open("/Projects/Record/" + id, "_blank");
                        }
                    },
                    quotation: {
                        name: applicationstrings[lang].quotations,
                        disabled: function (key, opt) {
                            var row = opt.$trigger.closest("[data-id]");
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
                            var win = window.open("/Quotations/ListByProject/" + id, "_blank");
                        }
                    }
                }
            });
        };
        this.List = function () {
            var gridfilter = GetFilter();
            if (grdProjects) {
                grdProjects.ClearSelection();
                grdProjects.RunFilter(gridfilter);
            } else {
                grdProjects = new Grid({
                    keyfield: "PRJ_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PRJ_ID",
                            title: gridstrings.projects[lang].projectid,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_DESC",
                            title: gridstrings.projects[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PRJ_ORGANIZATION",
                            title: gridstrings.projects[lang].org,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_ORGANIZATIONDESC",
                            title: gridstrings.projects[lang].orgdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_STATUS",
                            title: gridstrings.projects[lang].status,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_STATUSDESC",
                            title: gridstrings.projects[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_TYPE",
                            title: gridstrings.projects[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_TYPEDESC",
                            title: gridstrings.projects[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_CUSTOMER",
                            title: gridstrings.projects[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_CUSTOMERDESC",
                            title: gridstrings.projects[lang].customerdesc,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PRJ_TASKCOUNT",
                            title: gridstrings.projects[lang].ptaskcnt,
                            width: 150
                        },
                        {
                            type: "number",
                            field: "PRJ_ACTIVITYCOUNT",
                            title: gridstrings.projects[lang].pactcnt,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "PRJ_ESTIMATEDSTART",
                            title: gridstrings.projects[lang].estimatedstart,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "PRJ_ESTIMATEDEND",
                            title: gridstrings.projects[lang].estimatedend,
                            width: 250
                        }, {
                            type: "datetime",
                            field: "PRJ_OFFERDEADLINE",
                            title: gridstrings.projects[lang].offerdeadline,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_PROVINCE",
                            title: gridstrings.projects[lang].province,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_PROVINCEDESC",
                            title: gridstrings.projects[lang].provincedesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRJ_DISTRICT",
                            title: gridstrings.projects[lang].district,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_DISTRICTDESC",
                            title: gridstrings.projects[lang].districtdesc,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRJ_PARENT",
                            title: gridstrings.projects[lang].parent,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_PARENTDESC",
                            title: gridstrings.projects[lang].parentdesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRJ_CANCELLATIONREASON",
                            title: gridstrings.projects[lang].cancellationreason,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRJ_CANCELLATIONREASONDESC",
                            title: gridstrings.projects[lang].cancellationreasondesc,
                            width: 300
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOCOST",
                            title: gridstrings.projects[lang].cost,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOPROFIT",
                            title: gridstrings.projects[lang].profit,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOPROFITPERCENT",
                            title: gridstrings.projects[lang].profitpercent,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOTAX2",
                            title: gridstrings.projects[lang].tax2,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOTOTAL",
                            title: gridstrings.projects[lang].quotationtotal,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOVAT",
                            title: gridstrings.projects[lang].vat,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "PRJ_QUOTATIONFINAL",
                            title: gridstrings.projects[lang].quotationamount,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRJ_QUOCURR",
                            title: gridstrings.projects[lang].curr,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "PRJ_CREATED",
                            title: gridstrings.projects[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_CREATEDBY",
                            title: gridstrings.projects[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "PRJ_UPDATED",
                            title: gridstrings.projects[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_UPDATEDBY",
                            title: gridstrings.projects[lang].updatedby,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRJ_HASQUOTATION",
                            title: gridstrings.projects[lang].hasquotation,
                            width: 150
                        }
                    ],
                    fields:
                    {
                        PRJ_ID: { type: "number" },
                        PRJ_PARENT: { type: "number" },
                        PRJ_ESTIMATEDSTART: { type: "date" },
                        PRJ_ESTIMATEDEND: { type: "date" },
                        PRJ_OFFERDEADLINE: { type: "date" },
                        PRJ_TASKCOUNT: { type: "number" },
                        PRJ_ACTIVITYCOUNT: { type: "number" },
                        PRJ_QUOCOST: { type: "number" },
                        PRJ_QUOPROFIT: { type: "number" },
                        PRJ_QUOPROFITPERCENT: { type: "number" },
                        PRJ_QUOTAX2: { type: "number" },
                        PRJ_QUOTOTAL: { type: "number" },
                        PRJ_QUOVAT: { type: "number" },
                        PRJ_QUOTATIONFINAL: { type: "number" },
                        PRJ_DOCUMENTCOUNT: { type: "number" }
                    },
                    datafields: [
                        {
                            name: "hasquotation",
                            field: "PRJ_HASQUOTATION"
                        }
                    ],
                    datasource: "/Api/ApiProjects/List",
                    selector: "#grdProjects",
                    name: "grdProjects",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "PRJ_ID",
                    primarytextfield: "PRJ_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [
                        { field: "PRJ_ORDER", dir: "asc" },
                        { field: "PRJ_ID", dir: "desc" }
                    ],
                    toolbarColumnMenu: true,
                    hasfiltermenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"projects.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        prj.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (selectedrecord)
                            prj.LoadSelected();
                        else
                            prj.ResetUI();
                        break;
                    case "#tasks":
                        tsk.List();
                        break;
                    case "#fixedcosts":
                        fxc.ResetUI();
                        fxc.List();
                        break;
                    case "#quotation":
                        quo.List();
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
            $("#btnPrint").click(self.Print);
            $("#btngeneratetask").click(self.GenerateTask);

            $("[loadstatusesonchange=\"yes\"]").on("change", function () {
                LoadStatuses({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")
                });
            });

            $("#status").on("change", EvaluateCurrentStatus);
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
            taskCustomFieldsHelper = new customfields({ container: "#cftaskcontainer" });

            $("#filter").click(function () {
                RunSidebarFilter();
            });
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });

            $("button.btn-filter-operator").on("click", function () {
                $("button.btn-filter-operator").removeClass("btn-primary").addClass("btn-default");
                $(this).addClass("btn-primary").removeClass("btn-default");
            });

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });

            BuildModals();
            AutoComplete();
        };

        LoadSideBarStatuses = function () {
            var gridreq = {
                sort: [{ field: "STA_DESCF", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "STA_SHOWONSEARCH", value: "+", operator: "eq" },
                        { field: "STA_ENTITY", value: "PROJECT", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiStatuses/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    var statusesctrl = $("#statuses");
                    statusesctrl.find("*").remove();
                    var strOptions = "";
                    strOptions += "<div class=\"checkbox checkbox-primary\"><input id=\"chkallstatuses\" class=\"styled\" type=\"checkbox\"><label><span> * </span></label></div>";

                    for (var i = 0; i < d.data.length; i++) {
                        strOptions +=
                            "<div class=\"checkbox checkbox-primary\"><input class=\"styled\" type=\"checkbox\" value=\"" +
                            d.data[i].STA_CODE +
                            "\"><label><span>" +
                            d.data[i].STA_DESCF +
                            "</span></label></div>";
                    }
                    statusesctrl.append(strOptions);
                    statusesctrl.find("#chkallstatuses").on("click", function () {
                        var ischecked = $(this).is(":checked");
                        statusesctrl.find("input").prop("checked", ischecked);
                    });
                }
            });
        }
        LoadTypes = function () {
            var gridreq = {
                sort: [{ field: "TYP_DESCF", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "TYP_ENTITY", value: "PROJECT", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiTypes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    var typesctrl = $("#types");
                    typesctrl.find("*").remove();
                    var strOptions = "";
                    strOptions += "<div class=\"checkbox checkbox-primary\"><input id=\"chkalltypes\" class=\"styled\" type=\"checkbox\"><label><span> * </span></label></div>";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions +=
                            "<div class=\"checkbox checkbox-primary\"><input class=\"styled\" type=\"checkbox\" value=\"" +
                            d.data[i].TYP_CODE +
                            "\"><label><span>" +
                            d.data[i].TYP_DESCF +
                            "</span></label></div>";
                    }
                    typesctrl.append(strOptions);
                    typesctrl.find("#chkalltypes").on("click", function () {
                        var ischecked = $(this).is(":checked");
                        typesctrl.find("input").prop("checked", ischecked);
                    });
                }
            });
        };

        ResetSidebarFilter = function () {
            $("#datecreated_start").val("");
            $("#datecreated_end").val("");
            $("#types input").each(function (e) {
                $(this).prop("checked", false);
            });
            $("#statuses input").each(function (e) {
                $(this).prop("checked", false);
            });
        };
        GetFilter = function () {
            var gridfilter = [];

            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            var datecreatedstart = $("#datecreated_start").val();
            var datecreatedend = $("#datecreated_end").val();

            if (datecreatedend)
                datecreatedend = moment(datecreatedend, constants.dateformat).add(1, "days").format(constants.dateformat);

            var i;
            var item;

            var checkedtypes = $("#types input:checked");
            var types = [];
            for (i = 0; i < checkedtypes.length; i++) {
                item = checkedtypes[i];
                types.push($(item).val());
            }

            var checkedstatuses = $("#statuses input:checked");
            var statuses = [];
            for (i = 0; i < checkedstatuses.length; i++) {
                item = checkedstatuses[i];
                statuses.push($(item).val());
            }

            if (types.length > 0) {
                gridfilter.push({ field: "PRJ_TYPEENTITY", value: "PROJECT", operator: "eq", logic: "and" });
                gridfilter.push({ field: "PRJ_TYPE", value: types, operator: "in", logic: "and" });
            }
            if (statuses.length > 0) {
                gridfilter.push({ field: "PRJ_STATUSENTITY", value: "PROJECT", operator: "eq", logic: "and" });
                gridfilter.push({ field: "PRJ_STATUS", value: statuses, operator: "in", logic: "and" });
            }
            if (datecreatedstart && datecreatedend)
                gridfilter.push({ field: "PRJ_CREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });
            if (datecreatedstart && !datecreatedend)
                gridfilter.push({ field: "PRJ_CREATED", value: datecreatedstart, operator: "gte", logic: "and" });
            if (!datecreatedstart && datecreatedend)
                gridfilter.push({ field: "PRJ_CREATED", value: datecreatedend, operator: "lte", logic: "and" });

            return gridfilter;
        };
        RunSidebarFilter = function () {
            var gridfilter = GetFilter();
            grdProjects.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            var path = tms.Path();
            if (path.Action === "Record" && path.Param1) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                projectid = decodeURI(path.Param1);
                return self.LoadSelected();
            }
            self.List();
            if (!projectid) {
                $("#requestedby").val(user);
                $("#daterequested").val(tms.Now().format(constants.longdateformat));
                $("#btnBrowse").attr("disabled", "disabled");
            }
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
                            case "fixedcosts":
                                return "#btnSaveFixedCost";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                prj.Save();
                                break;
                            case "fixedcosts":
                                fxc.Save();
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
                            case "fixedcosts":
                                return "#btnNew";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                prj.ResetUI();
                                break;
                            case "fixedcosts":
                                fxc.ResetUI();
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
                                prj.LoadSelected();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "fixedcosts":
                                return "#btnDeleteFixedCost";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                prj.Delete();
                                break;
                            case "fixedcosts":
                                fxc.Delete();
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
                                prj.HistoryModal();
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
        this.ContextMenu = function () {
            $.contextMenu({
                selector: "#record",
                build: function ($trigger, e) {
                    if (e.target.nodeName === "DIV")
                        return {
                            zIndex: 10,
                            items: {
                                quotation: {
                                    name: applicationstrings[lang].quotations,
                                    disabled: function (key, opt) {
                                        return selectedrecord.PRJ_HASQUOTATION == "-";
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html('<span><i class="fa fa-usd" aria-hidden="true"></i> ' + item.name + "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/Quotations/ListByProject/" + selectedrecord.PRJ_ID, "_blank");
                                    }
                                },
                                newquotation: {
                                    name: applicationstrings[lang].newquotation,
                                    disabled: function (key, opt) {
                                        switch (tms.ActiveTab()) {
                                            case "record":
                                                return selectedstatus.STA_PCODE === "C";
                                                break;
                                        }
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html('<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' + item.name + "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/Quotations/NewByProject/" + selectedrecord.PRJ_ID, "_blank");
                                    }
                                }
                            }
                        };
                    else if (e.target.nodeName === "IMG") {
                        var src = e.target.src;
                        return {
                            zIndex: 10,
                            items: {
                                openlinkinnewwindow: {
                                    name: applicationstrings[lang].openlinkinnewwindow,
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html('<span><i class="fa fa-external-link" aria-hidden="true"></i> ' + item.name + "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    callback: function (itemKey, opt) {
                                        var win = window.open(src.newUrl(["id", "guid"]), "_blank");
                                    }
                                }
                            }
                        };
                    }
                    return false;
                }
            });
        }
    };

    function ready() {
        prj.BuildUI();
        scr.BindHotKeys();
        scr.ContextMenu();
    }

    $(document).ready(ready);
}());