(function () {
    var selectedrecord = null;
    var selectedlinerecord = null;
    var selectedlinerecordremain = null;
    var purchaseorderid = 0;
    var purchaseorderlineid = 0;
    var scr, por, prt, wrh, trck;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
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
                { id: "#btnPrint", selectionrequired: true }
            ]
        },
        {
            name: "part",
            btns: []
        },
        {
            name: "track",
            btns: []
        }
    ];

    var shr = new function () {
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
    trck = new function () {
        var self = this;

        this.Save = function () {
            if (!tms.Check("#track"))
                return $.Deferred().reject();

            var trackLinesTable = $("#track table tbody");
            var rows = trackLinesTable.find("tr.track-line");

            var arrvalues = [];

            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]);

                var id = row.data("id");
                var porid = row.data("porid");
                var cargocompany = row.find("input[field-id=\"cargocompany\"]").val() ? row.find("input[field-id=\"cargocompany\"]").val() : null;
                var cargodate = row.find("input[field-id=\"cargodate\"]").val() ? row.find("input[field-id=\"cargodate\"]").val() : null;
                var cargono = row.find("input[field-id=\"cargonumber\"]").val() ? row.find("input[field-id=\"cargonumber\"]").val() : null;

                arrvalues.push({
                    PRT_ID: id,
                    PRT_PORID: porid,
                    PRT_CARGOCOMPANY: cargocompany,
                    PRT_CARGODATE: moment.utc(cargodate, constants.longdateformat),
                    PRT_CARGONUMBER: cargono
                });
            }

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrderLines/SaveTracks",
                data: JSON.stringify(arrvalues),
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                }
            });

        };
        var FillUserInterface = function () {
            $("#cargosupplier").text(selectedrecord.POR_SUPPLIERDESC);
            $("#cargosuppliercity").text(selectedrecord.POR_SUPPLIERPROVIENCE ? selectedrecord.POR_SUPPLIERPROVIENCE : "-");
            $("#cargosuppliercountry").text(selectedrecord.POR_SUPPLIERDISTRICT ? selectedrecord.POR_SUPPLIERDISTRICT : "-");
            $("#cargosupplieradress").text(selectedrecord.POR_SUPPLIERADR ? selectedrecord.POR_SUPPLIERADR : "-");
            $("#cargosupplierphone").text(selectedrecord.POR_SUPPLIERPHONE ? selectedrecord.POR_SUPPLIERPHONE : "-");
            $("#cargosuppliermobilephone").text(selectedrecord.POR_SUPPLIERGSM ? selectedrecord.POR_SUPPLIERGSM : "-");
            $("#cargosupplierauth").text(selectedrecord.POR_SUPPLIERAUTH ? selectedrecord.POR_SUPPLIERAUTH : "-");
        };
        var RegisterTabEvents = function () {
            $("#btnSaveLines").click(self.Save);
        };
        var BuildLinesTable = function (d) {
            var purchaseordertracktable = $("#track table tbody");
            purchaseordertracktable.find("tr.track-line").remove();
            var strlinestrack = "";

            for (var i = 0; i < d.length; i++) {
                var di = d[i];

                strlinestrack += "<tr class=\"track-line str-track\" data-porid=\"" +
                    di.PRT_PORID +
                    "\"  data-linetype=\"TMPURCHASEORDERLINETRACK\" data-id=\"" +
                    di.PRT_ID +
                    "\">";
                strlinestrack += "<td>";
                strlinestrack += di.PRT_PART;
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += di.PRT_PARTDESC;
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += "<input field-id=\"cargocompany\" class=\"form-control\" type=\"text\" value=\"" + (di.PRT_CARGOCOMPANY != null ? di.PRT_CARGOCOMPANY : "") + "\"/>";
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += "<input type=\"text\" maxlength=\"16\" field-id=\"cargodate\" ctrltype=\"datetimepicker\" class=\"form-control cargo-date\" value=\"" +
                                 (di.PRT_CARGODATE != null ? moment(di.PRT_CARGODATE).format(constants.longdateformat) : "") + "\"/>";
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += "<input field-id=\"cargonumber\" class=\"form-control\" type=\"text\" value=\"" + (di.PRT_CARGONUMBER != null ? di.PRT_CARGONUMBER : "") + "\"/>";
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += di.PRT_TOTALORDERQTY + "&nbsp;" + di.PRT_PARTUOM;
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += di.PRT_TOTALENTRY + "&nbsp;" + di.PRT_PARTUOM;
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += di.PRT_TOTALRETURN + "&nbsp;" + di.PRT_PARTUOM;
                strlinestrack += "</td>";
                strlinestrack += "<td>";
                strlinestrack += di.PRT_WAITINGQUAN + "&nbsp;" + di.PRT_PARTUOM;
                strlinestrack += "</td>";
                strlinestrack += "</tr>";
            }

            $(strlinestrack).insertAfter($("#sectioncargo"));
            $(".cargo-date").datetimepicker();
        };
        this.List = function () {
            if (selectedrecord) {
                var gridreq = {
                    PRT_ID: 0,
                    PRT_PORID: selectedrecord.POR_ID,
                };
                return tms.Ajax({
                    url: "/Api/ApiPurchaseOrderLines/GetTrackView",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        BuildLinesTable(d.data);
                    }
                });
            }
        };

        this.Ready = function () {
            self.List();
            FillUserInterface();
        };
        RegisterTabEvents();
    };
    wrh = new function () {
        var self = this;
        var waitngForReturnQuan = 0;
        var CalculateRemaining = function () {
            if (!selectedlinerecord)
                return $.Deferred().reject();


            var remaindata = JSON.stringify(
                {
                    PLS_ID: 0,
                    PLS_PORID: selectedlinerecord.PRL_PORID,
                    PLS_LINE: selectedlinerecord.PRL_LINE,
                    PLS_PART: selectedlinerecord.PRL_PARTID,
                    PLS_QTY: 0,
                    PLS_REMAININGQTY: 0
                });

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrderLines/GetRemaining",
                contentType: "application/json",
                data: remaindata,
                fn: function (d) {
                    if (d.data.length === 0)
                        return;

                    selectedlinerecordremain = d.data;
                    $("#waitingforEntryQuan").val(selectedlinerecordremain.PLS_REMAININGQTY);
                    waitngForReturnQuan = (selectedlinerecord.PRL_QUANTITY * selectedlinerecord.PRL_UOMMULTI) -
                        selectedlinerecordremain.PLS_REMAININGQTY;
                    $("#waitingforReturnQuan").val(waitngForReturnQuan);
                }
            });
        };
        var RegisterTabEvents = function () {
            $("#modalsave").click(self.Save);
            $("#modalReturnSave").click(self.ReturnSave);
            $("#addalltowarehouse").click(self.SaveAll);
        };
        var fillUserInterface = function () {
            $("#amounttobePurchase").val("");
            $("#waybill").val("");
            $("#purchasedPartQuantity").val(selectedlinerecord.PRL_QUANTITY * selectedlinerecord.PRL_UOMMULTI);
            $("#purchasedPartForReturnQuantity").val(selectedlinerecord.PRL_QUANTITY * selectedlinerecord.PRL_UOMMULTI);
            $("#purchasedPartQuantityuom").val(selectedlinerecord.PRL_PARUOM);
            $("#amounttobePurchaseuom").val(selectedlinerecord.PRL_PARUOM);
            $("#waitingforEntryQuanuom").val(selectedlinerecord.PRL_PARUOM);
            $("#purchasedPartForReturnQuantityuom").val(selectedlinerecord.PRL_PARUOM);
            $("#waitingforReturnQuanuom").val(selectedlinerecord.PRL_PARUOM);
            $("#amounttobeReturnuom").val(selectedlinerecord.PRL_PARUOM);
        };
        this.SaveAll = function () {
            if (!tms.Check("#modaladdalltowarehouse"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                POS_ID: selectedrecord.POR_ID,
                POS_WAYBILL: $("#allwaybill").val()
            });

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrders/SavePartTransaction",
                contentType: "application/json",
                data: o,
                fn: function (d) {
                    $("#modaladdalltowarehouse").modal("hide");
                    msgs.success(d.data);
                }
            });
        }
        this.Save = function () {
            if (!tms.Check("#modaladdtowarehouse"))
                return $.Deferred().reject();
            var amounttobePurchase = $("#amounttobePurchase").val();

            if (selectedlinerecordremain.PLS_REMAININGQTY < parseInt(amounttobePurchase)) {
                return msgs.error(applicationstrings[lang].purchaseordererror);
            }

            var issuereturn = {
                Transaction: {
                    PTR_ID: 0,
                    PTR_DESCRIPTION: selectedrecord.POR_DESCRIPTION,
                    PTR_TYPE: "R",
                    PTR_ORGANIZATION: selectedrecord.POR_ORG,
                    PTR_TRANSACTIONDATE: tms.Now(),
                    PTR_WAREHOUSE: selectedrecord.POR_WAREHOUSE,
                    PTR_STATUS: "N",
                    PTR_CREATED: tms.Now(),
                    PTR_CREATEDBY: user,
                    PTR_RECORDVERSION: 0
                },
                TransactionLines: [
                    {
                        PTL_ID: 0,
                        PTL_LINE: 10,
                        PTL_TRANSACTIONDATE: tms.Now(),
                        PTL_PART: selectedlinerecord.PRL_PARTID,
                        PTL_TYPE: "R",
                        PTL_PURCHASEORDER: selectedrecord.POR_ID,
                        PTL_PURCHASEORDERLINE: selectedlinerecord.PRL_LINE,
                        PTL_WAREHOUSE: selectedrecord.POR_WAREHOUSE,
                        PTL_BIN: "*",
                        PTL_QTY: $("#amounttobePurchase").val(),
                        PTL_WAYBILL: $("#waybill").val(),
                        PTL_PRICE: (selectedlinerecord.PRL_UNITPRICE / selectedlinerecord.PRL_UOMMULTI) * selectedlinerecord.PRL_EXCHANGERATE,
                        PTL_CREATED: tms.Now(),
                        PTL_CREATEDBY: user
                    }
                ]
            };

            return tms.Ajax({
                url: "/Api/ApiIssueReturn/Save",
                data: JSON.stringify(issuereturn),
                fn: function (d) {
                    msgs.success(d.data);
                    CalculateRemaining();
                    self.ResetUI();
                }
            });
        };
        this.ReturnSave = function () {
            if (!tms.Check("#modalreturnfromwarehouse"))
                return $.Deferred().reject();

            var amounttobeReturn = $("#amounttobeReturn").val();

            if (waitngForReturnQuan < parseInt(amounttobeReturn)) {
                return msgs.error(applicationstrings[lang].purchaseordererror);
            }

            var issuereturnforReturn = {
                Transaction: {
                    PTR_ID: 0,
                    PTR_DESCRIPTION: selectedrecord.POR_DESCRIPTION,
                    PTR_TYPE: "I",
                    PTR_ORGANIZATION: selectedrecord.POR_ORG,
                    PTR_TRANSACTIONDATE: tms.Now(),
                    PTR_WAREHOUSE: selectedrecord.POR_WAREHOUSE,
                    PTR_STATUS: "N",
                    PTR_CREATED: tms.Now(),
                    PTR_CREATEDBY: user,
                    PTR_RECORDVERSION: 0
                },
                TransactionLines: [
                    {
                        PTL_ID: 0,
                        PTL_LINE: 10,
                        PTL_TRANSACTIONDATE: tms.Now(),
                        PTL_PART: selectedlinerecord.PRL_PARTID,
                        PTL_TYPE: "I",
                        PTL_PURCHASEORDER: selectedrecord.POR_ID,
                        PTL_PURCHASEORDERLINE: selectedlinerecord.PRL_LINE,
                        PTL_WAREHOUSE: selectedrecord.POR_WAREHOUSE,
                        PTL_BIN: "*",
                        PTL_QTY: $("#amounttobeReturn").val(),
                        PTL_PRICE: (selectedlinerecord.PRL_UNITPRICE / selectedlinerecord.PRL_UOMMULTI) * selectedlinerecord.PRL_EXCHANGERATE,
                        PTL_CREATED: tms.Now(),
                        PTL_CREATEDBY: user
                    }
                ]
            };

            return tms.Ajax({
                url: "/Api/ApiIssueReturn/Save",
                data: JSON.stringify(issuereturnforReturn),
                fn: function (d) {
                    msgs.success(d.data);
                    CalculateRemaining();
                    self.ResetUI();
                }
            });
        };
        this.ResetUI = function () {
            $("#amounttobePurchase").val("");
            $("#waybill").val("");
            $("#amounttobeReturn").val("");

        };
        this.Ready = function () {
            self.ResetUI();
            CalculateRemaining();
            fillUserInterface();
        };
        RegisterTabEvents();

    };
    prt = new function () {
        var grdPurchaseOrderParts = null;
        var partuom = null;
        var grdStock = null;
        var grdPurchaseOrderPartsElm = $("#grdPurchaseOrderParts");
        var grandTotal = 0;


        var self = this;
        var StockList = function () {
            var grdFilter = [{ field: "STK_PARTCODE", value: selectedlinerecord.PRL_PARTCODE, operator: "eq", logic: "and" }];
            if (grdStock) {
                grdStock.ClearSelection();
                grdStock.RunFilter(grdFilter);
            } else {
                grdStock = new Grid({
                    keyfield: "STK_ID",
                    columns: [
                        { type: "string", field: "STK_PARTCODE", title: gridstrings.stock[lang].part, width: 200 },
                        { type: "string", field: "STK_PARTDESC", title: gridstrings.stock[lang].partdesc, width: 350 },
                        { type: "string", field: "STK_WAREHOUSE", title: gridstrings.stock[lang].warehouse, width: 200 },
                        { type: "string", field: "STK_WAREHOUSEDESC", title: gridstrings.stock[lang].warehousedesc, width: 200 },
                        { type: "string", field: "STK_BIN", title: gridstrings.stock[lang].bin, width: 200 },
                        { type: "string", field: "STK_BINDESC", title: gridstrings.stock[lang].bindesc, width: 200 },
                        { type: "qty", field: "STK_QTY", title: gridstrings.stock[lang].qty, width: 200 },
                        { type: "price", field: "STK_AVGPRICE", title: gridstrings.stock[lang].avgprice, width: 200 },
                        { type: "string", field: "STK_PARTUOM", title: gridstrings.stock[lang].uom, width: 200 }
                    ],
                    fields: {
                        STK_QTY: { type: "number" },
                        STK_AVGPRICE: { type: "number" }
                    },
                    datasource: "/Api/ApiWarehouses/StockView",
                    selector: "#grdStock",
                    name: "grdStock",
                    height: 250,
                    visibleitemcount: 10,
                    filter: grdFilter,
                    sort: [{ field: "STK_BIN", dir: "asc" }]

                });
            }
        };
        var LoadVATs = function () {
            var vatctrl = $("#vat");
            var vatOption = "";
            vatctrl.find("option").remove();

            vatOption += "<option selected=\"selected\" data-code=\"" + 0 + "\" value=\"" + 0 + "\">" + "% 0" + "</option>";
            vatOption += "<option selected=\"selected\" data-code=\"" + 1 + "\" value=\"" + 1 + "\">" + "% 1" + "</option>";
            vatOption += "<option selected=\"selected\" data-code=\"" + 8 + "\" value=\"" + 8 + "\">" + "% 8" + "</option>";
            vatOption += "<option selected=\"selected\" data-code=\"" + 18 + "\" value=\"" + 18 + "\">" + "% 18" + "</option>";

            vatctrl.append(vatOption);

        };
        var CalculateExch = function () {
            var basecurr = selectedrecord.POR_ORGCURR;
            var tocurr = $("#partcurrency").val();
            if (basecurr) {
                return $.when(shr.CalculateExch(tocurr, basecurr)).done(function (d) {
                    if (d.data) {
                        if (basecurr === tocurr) {
                            $("#partexchangerate").prop("disabled", true).removeAttr("required").removeClass("required");
                        } else {
                            $("#partexchangerate").prop("disabled", false).attr("required", "required").addClass("required");
                        }
                        $("#partexchangerate").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#partexchangerate").val("");
                    }
                });
            }
        };
        var CalculateTotal = function () {
            var v_partunitprice = $("#quantity").val();
            var v_partcostqty = $("#partunitprice").val();
            var v_discountrate = $("#discountrate").val();
            if (v_partunitprice && v_partcostqty) {
                var total = (parseFloat(v_partunitprice) * parseFloat(v_partcostqty)).fixed(constants.pricedecimals);
                var discountedtotal = 0;
                var discountedunitprice = 0;

                if (v_discountrate) {
                    discountedtotal = parseFloat(total - (total * parseFloat(v_discountrate)) / 100)
                        .fixed(constants.pricedecimals);
                    discountedunitprice = parseFloat(parseFloat(v_partcostqty) - (parseFloat(v_partcostqty) * parseFloat(v_discountrate)) / 100)
                        .fixed(constants.pricedecimals);
                    $("#discountedprice").val(discountedunitprice);
                    $("#totalpartprice").val(discountedtotal);

                } else {
                    $("#discountrate").val("0.00");
                    $("#discountedprice").val(total);
                    $("#totalpartprice").val(total);
                }
            }
        };
        var CalculateTotalTax = function () {
            var v_partvat = $("#vat").val();
            var v_parttax2 = $("#tax2").val();
            var v_totalprice = $("#totalpartprice").val();

            if (v_totalprice) {
                var tax = 0;
                var tax2 = 0;
                var price = v_totalprice;
                if (v_partvat) {
                    tax = (parseFloat(v_totalprice) * parseFloat(v_partvat)) / 100;
                    price = parseFloat(price) + parseFloat(tax);
                }

                if (v_parttax2) {
                    tax2 = (parseFloat(price) * parseFloat(v_parttax2)) / 100;
                    tax = parseFloat(tax) + parseFloat(tax2);
                    price = parseFloat(v_totalprice) + parseFloat(tax);
                }
                $("#totalparttaxes").val(parseFloat(tax).fixed(constants.pricedecimals));
                $("#totalpartpricewithvat").val(parseFloat(price).fixed(constants.pricedecimals));
            }
        };
        var itemSelect = function (row) {
            selectedlinerecord = grdPurchaseOrderParts.GetRowDataItem(row);
            purchaseorderlineid = selectedlinerecord.PRL_ID;
            $("#btnstock").prop("disabled", false);
            fillUserInterface();
            wrh.Ready();
            StockList();
        };

        var ChildBuilder = function (parent, list) {

            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                if (!parent.subs) {
                    parent.subs = [];
                }
                parent.subs.push(child);
                ChildBuilder(child, list);
            }
        };
        var GenerateTreeData = function (d) {
            var data = [];
            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    title: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    subs: []
                };
                ChildBuilder(parent, d);
                data.push(parent);
            }
            return data;
        };
        var GetLevels = function () {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: "PART", operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq)
            });
        };
        var BuildModals = function () {
            $("#btnpartcurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#partcurrency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        {
                            type: "string",
                            field: "CUR_DESC",
                            title: gridstrings.currencies[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (d) {
                        if (d) {
                            tooltip.show("#partcurrency", d.CUR_DESC);
                            $("#totalpartpricecurr").val(d.CUR_CODE);
                            $("#totalpartpricewithvatcurr").val(d.CUR_CODE);
                            $("#totalparttaxescurr").val(d.CUR_CODE);
                            return CalculateExch();
                        }
                    }
                });
            });
            $("#btnuom").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.uoms[lang].title,
                    listurl: "/Api/ApiUoms/List",
                    keyfield: "UOM_CODE",
                    codefield: "UOM_CODE",
                    textfield: "UOM_DESC",
                    returninput: "#uom",
                    columns: [
                        { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                        { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (d) {
                        if (d) {
                            tooltip.show("#uom", d.UOM_DESC);

                            if (d.UOM_CODE === partuom) {
                                $("#uommulti").val("1");
                                $("#uommulti").prop("disabled", true).removeAttr("required").removeClass("required");
                            } else {
                                $("#uommulti").val("");
                                $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
                            }
                        }
                    }
                });
            });
            $("#btnparts").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_CODE",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#parts",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 400 }
                    ],
                    filter: [
                        { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                        { field: "PAR_ORG", value: [selectedrecord.POR_ORG, "*"], operator: "in" }
                    ],
                    treefilter: function (id, callback) {
                        $.when(GetLevels()).done(function (d) {
                            var data = GenerateTreeData(d.data);
                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [{ field: "PARTLEVEL.PARID", value: selectedItem.id, operator: "func" }];
                                        callback(filter);
                                    }

                                }
                            });
                        });
                    },
                    callback: function (d) {
                        tooltip.show("#parts", d.PAR_DESC);
                        $("#partdesc").val(d.PAR_DESC);

                        $("#parts").data("id", (d ? d.PAR_ID : null));
                        $("#paruom").val(d ? d.PAR_UOM : "");
                        $("#partcurrency").val(d ? d.PAR_CURR : "");
                        partuom = (d ? d.PAR_UOM : null);
                        $("#uommulti").val("");
                        $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
                        $("#uom").val("");
                        tooltip.hide("#uom");
                        return CalculateExch();
                    }
                });
            });
        };
        var AutoComplete = function () {
            $("#partcurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                ],
                callback: function (d) {
                    if (d) {
                        tooltip.show("#partcurrency", d.CUR_DESC);
                        $("#totalpartpricecurr").val(d.CUR_CODE);
                        $("#totalparttaxescurr").val(d.CUR_CODE);
                        $("#totalpartpricewithvatcurr").val(d.CUR_CODE);
                        return CalculateExch();
                    }
                }
            });
            $("#uom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                filter: [
                    { field: "UOM_ACTIVE", value: "+", operator: "eq" },
                ],
                callback: function (d) {
                    if (d) {
                        tooltip.show("#uom", d.UOM_DESC);

                        if (d.UOM_CODE === partuom) {
                            $("#uommulti").val("1");
                            $("#uommulti").prop("disabled", true).removeAttr("required").removeClass("required");
                        } else {
                            $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
                            $("#uommulti").val("");
                        }
                    }
                }
            });
            $("#parts").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                filter: [
                    { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                    { field: "PAR_ORG", func: function () { return [selectedrecord.POR_ORG, "*"] }, operator: "in" }
                ],
                callback: function (d) {
                    tooltip.show("#parts", d.PAR_DESC);
                    $("#partdesc").val(d.PAR_DESC);
                    $("#parts").data("id", (d ? d.PAR_ID : null));
                    $("#paruom").val(d ? d.PAR_UOM : "");
                    partuom = (d ? d.PAR_UOM : null);
                    $("#uommulti").val("");
                    $("#partcurrency").val(d ? d.PAR_CURR : null);
                    $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
                    $("#uom").val("");
                    tooltip.hide("#uom");
                    return CalculateExch();
                }
            });
        };
        var GridDataBound = function () {
            grdPurchaseOrderPartsElm.find("[data-id]").on("dblclick",
                function () {
                    //TODO: ??
                });

            grdPurchaseOrderPartsElm.find("#grdSumValue").html("<span style=\"color:#cf192d\"><strong>" + applicationstrings[lang].total + " : </strong>" + parseFloat(selectedrecord.POR_PARTTOTAL + selectedrecord.POR_TOTALTAXES).fixed(constants.pricedecimals) + " TL </span>");

        };
        var GridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var List = function () {
            var gridfilter = [{ field: "PRL_PORID", value: selectedrecord.POR_ID, operator: "eq", logic: "and" }];
            if (grdPurchaseOrderParts) {
                grdPurchaseOrderParts.ClearSelection();
                grdPurchaseOrderParts.RunFilter(gridfilter);
            } else {
                grdPurchaseOrderParts = new Grid({
                    keyfield: "PRL_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PRL_ID",
                            title: gridstrings.purchaseorderlines[lang].purchaseorderlineid,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_LINE",
                            title: gridstrings.purchaseorderlines[lang].line,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRL_PARTCODE",
                            title: gridstrings.purchaseorderlines[lang].partcode,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PRL_PARTDESC",
                            title: gridstrings.purchaseorderlines[lang].partdesc,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PRL_QUANTITY",
                            title: gridstrings.purchaseorderlines[lang].quantity,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRL_PARUOM",
                            title: gridstrings.purchaseorderlines[lang].uom,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRL_REQUESTEDUOM",
                            title: gridstrings.purchaseorderlines[lang].requesteduom,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_UOMMULTI",
                            title: gridstrings.purchaseorderlines[lang].uommulti,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "PRL_REQUESTEDDATE",
                            title: gridstrings.purchaseorderlines[lang].requesteddate,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_UNITPRICE",
                            title: gridstrings.purchaseorderlines[lang].unitprice,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRL_CURRENCY",
                            title: gridstrings.purchaseorderlines[lang].currency,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_EXCHANGERATE",
                            title: gridstrings.purchaseorderlines[lang].exchangerate,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_VATTAX",
                            title: gridstrings.purchaseorderlines[lang].vattax,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_TAX2",
                            title: gridstrings.purchaseorderlines[lang].tax2,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_DISCOUNT",
                            title: gridstrings.purchaseorderlines[lang].discount,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PRL_DISCOUNTEDUNITPRICE",
                            title: gridstrings.purchaseorderlines[lang].discountedunitprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PRL_DISCOUNTEDTOTALPRICE",
                            title: gridstrings.purchaseorderlines[lang].discountedtotalprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PRL_TOTALVAT",
                            title: gridstrings.purchaseorderlines[lang].totalvat,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PRL_GRANDTOTAL",
                            title: gridstrings.purchaseorderlines[lang].grandtotal,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRL_CREATED",
                            title: gridstrings.purchaseorderlines[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRL_CREATEDBY",
                            title: gridstrings.purchaseorderlines[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRL_UPDATED",
                            title: gridstrings.purchaseorderlines[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRL_UPDATEDBY",
                            title: gridstrings.purchaseorderlines[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRL_RECORDVERSION",
                            title: gridstrings.purchaseorderlines[lang].recordversion,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        PRL_ID: { type: "number" },
                        PRL_TOTALVAT: { type: "number" },
                        PRL_DISCOUNTEDUNITPRICE: { type: "number" },
                        PRL_GRANDTOTAL: { type: "number" },
                        PRL_DISCOUNTEDTOTALPRICE: { type: "number" },
                        PRL_CREATED: { type: "date" },
                        PRL_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiPurchaseOrderLines/List",
                    selector: "#grdPurchaseOrderParts",
                    name: "grdPurchaseOrderParts",
                    height: 250,
                    primarycodefield: "PRL_ID",
                    primarytextfield: "PRL_DESCRIPTION",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "PRL_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        left: [
                            "<div id=\"grdSumValue\"></div>"
                        ],
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
        this.Save = function () {
            if (!tms.Check("#part"))
                return $.Deferred().reject();

            var taskDetail = JSON.stringify(
                {
                    PRL_ID: (purchaseorderlineid || 0),
                    PRL_PARTID: $("#parts").data("id"),
                    PRL_PARTNOTE: $("#partnote").val(),
                    PRL_LINE: selectedlinerecord != null ? selectedlinerecord.PRL_LINE : null,
                    PRL_QUANTITY: $("#quantity").val(),
                    PRL_REQUESTEDUOM: $("#uom").val(),
                    PRL_UOMMULTI: $("#uommulti").val(),
                    PRL_REQUESTEDDATE: moment.utc($("#partrequestdate").val(), constants.dateformat),
                    PRL_UNITPRICE: $("#partunitprice").val(),
                    PRL_CURRENCY: $("#partcurrency").val(),
                    PRL_EXCHANGERATE: $("#partexchangerate").val(),
                    PRL_VATTAX: $("#vat").val(),
                    PRL_TAX2: $("#tax2").val(),
                    PRL_DISCOUNT: $("#discountrate").val(),
                    PRL_PORID: selectedrecord != null ? selectedrecord.POR_ID : null,
                    PRL_REQ: selectedlinerecord != null ? selectedlinerecord.PRL_REQ : null,
                    PRL_REQLINEID: selectedlinerecord != null ? selectedlinerecord.PRL_REQLINEID : null,
                    PRL_REQLINE: selectedlinerecord != null ? selectedlinerecord.PRL_REQLINE : null,
                    PRL_CREATED: selectedlinerecord != null ? selectedlinerecord.PRL_CREATED : tms.Now(),
                    PRL_CREATEDBY: selectedlinerecord != null ? selectedlinerecord.PRL_CREATEDBY : user,
                    PRL_UPDATED: selectedlinerecord != null ? tms.Now() : null,
                    PRL_UPDATEDBY: selectedlinerecord != null ? user : null,
                    PRL_RECORDVERSION: selectedlinerecord != null ? selectedlinerecord.PRL_RECORDVERSION : 0
                });

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrderLines/Save",
                contentType: "application/json",
                data: taskDetail,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    List();
                }
            });
        };
        this.Remove = function () {
            if (purchaseorderlineid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPurchaseOrderLines/Delete",
                            data: JSON.stringify(purchaseorderlineid),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                List();
                            }
                        });
                    });
            }
        };
        var fillUserInterface = function () {
            tms.UnBlock("#partsform");
            tms.BeforeFill("#parts");

            $("#purchaseorderlineno").val(selectedlinerecord.PRL_ID);
            $("#parts").val(selectedlinerecord.PRL_PARTCODE);
            $("#partnote").val(selectedlinerecord.PRL_PARTNOTE);
            $("#parts").prop("disabled", true);
            $("#parts").data("id", selectedlinerecord.PRL_PARTID);
            $("#parts").data("cur", selectedlinerecord.PRL_PARTCURR);
            $("#quantity").val(selectedlinerecord.PRL_QUANTITY);
            $("#paruom").val(selectedlinerecord.PRL_PARUOM);
            $("#uom").val(selectedlinerecord.PRL_REQUESTEDUOM);
            $("#partcurrency").val(selectedlinerecord.PRL_CURRENCY);
            $("#partexchangerate").val(parseFloat(selectedlinerecord.PRL_EXCHANGERATE).fixed(constants.pricedecimals));
            $("#vat").val(selectedlinerecord.PRL_VATTAX);
            $("#partrequestdate").val(moment(selectedlinerecord.PRL_REQUESTEDDATE).format(constants.dateformat));
            $("#tax2").val(selectedlinerecord.PRL_TAX2);
            $("#partunitprice").val(selectedlinerecord.PRL_UNITPRICE);
            $("#discountrate").val(selectedlinerecord.PRL_DISCOUNT);
            $("#uommulti").val(selectedlinerecord.PRL_UOMMULTI);
            $("#partdesc").val(selectedlinerecord.PRL_PARTDESC);
            $("#requestdetail").val((selectedlinerecord.PRL_REQ ? selectedlinerecord.PRL_REQ + " - " : "") + (selectedlinerecord.PRL_REQLINE ? selectedlinerecord.PRL_REQLINE : ""));

            $("#totalpartpricecurr").val(selectedlinerecord.PRL_CURRENCY);
            $("#totalpartpricewithvatcurr").val(selectedlinerecord.PRL_CURRENCY);
            $("#totalparttaxescurr").val(selectedlinerecord.PRL_CURRENCY);
            $("#discountedpricecurr").val(selectedlinerecord.PRL_CURRENCY);

            tooltip.show("#uom", selectedlinerecord.PRL_REQUESTEDUOMDESC);
            tooltip.show("#partcurrency", selectedlinerecord.PRL_CURRENCY);
            tooltip.show("#parts", selectedlinerecord.PRL_PARTDESC);
            tooltip.show("#paruom", selectedlinerecord.PRL_PARUOMDESC);

            CalculateExch();
            CalculateTotal();
            CalculateTotalTax();
            $("#btnDeletePart").prop("disabled", false);

            if (selectedlinerecord.PRL_REQUESTEDUOM === selectedlinerecord.PRL_PARUOM) {
                $("#uommulti").prop("disabled", true).removeAttr("required").removeClass("required");
            } else {
                $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
            }

            if (selectedstatus.STA_PCODE === "C") tms.Block("#partsform");
        };
        var RegisterTabEvents = function () {
            $("#btnSavePart").click(self.Save);
            $("#btnAddPart").click(self.ResetUI);
            $("#btnDeletePart").click(self.Remove);
            $("#btnstock").click(function () {
                $("#modalstock").modal();
            });
        };
        var RegisterUIEvents = function () {
            LoadVATs();
            BuildModals();
            AutoComplete();

            $("#partsform input[calc-group=\"1\"]").on("change",
                function () {
                    CalculateTotal();
                    CalculateTotalTax();
                });

            $("#partsform select[calc-group=\"1\"]").on("change",
                function () {
                    CalculateTotalTax();
                });

            RegisterTabEvents();
        };
        this.ResetUI = function () {
            tms.UnBlock("#partsform");
            tms.Reset("#parts");

            selectedlinerecord = null;
            $("#btnstock").prop("disabled", true);

            purchaseorderlineid = null;
            $("#purchaseorderlineno").val("");
            $("#parts").val("");
            $("#partnote").val("");
            $("#parts").prop("disabled", false);
            $("#parts").data("id", null);
            $("#quantity").val("");
            $("#paruom").val("");
            $("#uom").val("");
            $("#uommulti").val("");
            $("#discountrate").val("");
            $("#discountedprice").val("");
            $("#discountedpricecurr").val("");
            $("#partcurrency").val("");
            $("#totalpartpricecurr").val("");
            $("#totalpartpricewithvatcurr").val("");
            $("#totalparttaxescurr").val("");
            $("#partexchangerate").val("");
            $("#tax2").val("");
            $("#partrequestdate").val("");
            $("#partunitprice").val("");
            $("#vat").val("");
            $("#partdesc").val("");
            $("#requestdetail").val("");


            $("#totalpartprice").val("");
            $("#totalpartpricewithvat").val("");
            $("#totalparttaxes").val("");

            $("#btnDeletePart").prop("disabled", true);
            tooltip.hide("#uom");
            tooltip.hide("#paruom");
            tooltip.hide("#parts");
            tooltip.hide("#partcurrency");
            wrh.ResetUI();

            if (selectedstatus.STA_PCODE === "C") tms.Block("#partsform");
        };
        this.Ready = function () {
            List();
            self.ResetUI();
        };
        RegisterUIEvents();
    };
    por = new function () {
        var grdPurchaseOrders = null;
        var grdPurchaseOrdersElm = $("#grdPurchaseOrders");
        var purchaseOrderCommentsHelper;
        var purchaseOrderDocumentsHelper;
        var organizationcurr = null;

        var GetFilter = function() {
            var gridfilter = [];

            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            if ($("#listfiltertaskid").val())
                gridfilter.push({ field: "ORDERHASTASK", value: $("#listfiltertaskid").val(), operator: "func", logic: "and" });

            if ($("#listfilterquoid").val())
                gridfilter.push({ field: "ORDERHASQUOTATION", value: $("#listfilterquoid").val(), operator: "func", logic: "and" });

            if ($("#listfiltereqid").val())
                gridfilter.push({ field: "ORDERHASREQID", value: $("#listfiltereqid").val(), operator: "func", logic: "and" });

            return gridfilter;
        };
        function ResetSidebarFilter() {
            $("#listfilterquoid").val("");
            $("#listfiltereqid").val("");
            $("#listfiltertaskid").val("");
        };
        function RunSidebarFilter() {
            var gridfilter = GetFilter();
            grdPurchaseOrders.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };
        var Print = function () {
            $("#modalprint").modal();
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
                        $("#warehouse").val("");
                        $("#requestedby").val("");
                        $("#supplier").val("");
                        tooltip.hide("#supplier");
                        tooltip.hide("#requestedby");
                        tooltip.hide("#warehouse");
                        LoadStatuses({
                            code: $("#status").data("code"),
                            pcode: $("#status").data("pcode"),
                            text: $("#status").data("text")
                        });

                        $("#currency").val(d.ORG_CURRENCY);
                        tooltip.show("#currency", d.ORG_CURRENCYDESC);
                        organizationcurr = d.ORG_CURRENCY;
                        return CalculateExch();
                    }
                }
            });
            $("#requestedby").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                filter: [
                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                    { field: "USR_ORG", relfield: "#org", includeall: true }
                ]
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_ENTITY", value: "PURCHASEORDER", operator: "eq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d) {
                        LoadStatuses({
                            code: $("#status").data("code"),
                            pcode: $("#status").data("pcode"),
                            text: $("#status").data("text")
                        });
                    }
                }

            });
            $("#warehouse").autocomp({
                listurl: "/Api/ApiWarehouses/List",
                geturl: "/Api/ApiWarehouses/Get",
                field: "WAH_CODE",
                textfield: "WAH_DESC",
                filter: [
                    { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                    { field: "WAH_ORG", relfield: "#org", includeall: true }
                ]
            });
            $("#supplier").autocomp({
                listurl: "/Api/ApiSuppliers/List",
                geturl: "/Api/ApiSuppliers/Get",
                field: "SUP_CODE",
                textfield: "SUP_DESC",
                filter: [
                    { field: "SUP_ACTIVE", value: "+", operator: "eq" },
                    { field: "SUP_ORGANIZATION", relfield: "#org", includeall: true }
                ],
                callback: function (data) {
                    $("#suppaymentterm").val(data.SUP_PAYMENTPERIOD);
                    $("#supdesc").val(data.SUP_DESC);
                }
            });
            $("#suppaymentterm").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "PAYMENTTERM", operator: "eq" }
                ],
                active: "SYC_ACTIVE"
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
        };
        var BuildModals = function () {
            purchaseOrderDocumentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
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
                        {
                            type: "string",
                            field: "ORG_CODE",
                            title: gridstrings.org[lang].organization,
                            width: 100
                        },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        $("#warehouse").val("");
                        $("#requestedby").val("");
                        $("#supplier").val("");
                        tooltip.hide("#supplier");
                        tooltip.hide("#requestedby");
                        tooltip.hide("#warehouse");
                        $("#org").val(data.ORG_CODE).trigger("change");
                        tooltip.show("#org", data.ORG_DESCF);
                        LoadStatuses({
                            code: $("#status").data("code"),
                            pcode: $("#status").data("pcode"),
                            text: $("#status").data("text")
                        });

                        organizationcurr = null;
                        if (data) {
                            $("#currency").val(data.ORG_CURRENCY);
                            tooltip.show("#currency", data.ORG_CURRENCYDESC);
                            organizationcurr = data.ORG_CURRENCY;
                            return CalculateExch();
                        }
                    }
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
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" }
                    ]
                });
            });
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
                        { field: "WAH_ORG", value: ["*", $("#org").val()], operator: "in" }
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
                        { field: "SUP_ORGANIZATION", value: ["*", $("#org").val()], operator: "in" }
                    ],
                    callback: function (data) {
                        $("#suppaymentterm").val(data.SUP_PAYMENTPERIOD);
                        $("#supdesc").val(data.SUP_DESC);
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
                        {
                            type: "string",
                            field: "TYP_DESCF",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: "PURCHASEORDER", operator: "eq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "TYP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        LoadStatuses({
                            code: $("#status").data("code"),
                            pcode: $("#status").data("pcode"),
                            text: $("#status").data("text")
                        });
                        $("#purchaseordertask").val("");
                        $("#purchaseorderactivity").val("");
                    }
                });
            });
            $("#btnsuppaymentterm").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#suppaymentterm",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "PAYMENTTERM", operator: "eq" }
                    ],
                });
            });
        };
        var RegisterUiEvents = function () {
            $(".btn").css("cursor", "pointer");

            $("#status").change(function () {
                var $this = $(this);
                var value = $this.find("option:selected").val();

                $("div.holdreasonctrl").addClass("hidden");
                $("#holdreason").removeClass("required");

                $("#divcancellationreason").addClass("hidden");
                $("#cancellationreason").removeClass("required");

                switch (value) {
                    case "BEK":
                        $("div.holdreasonctrl").removeClass("hidden");
                        $("#holdreason").addClass("required");
                        break;
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        $("#cancellationreason").attr("required", "").addClass("required");
                        break;
                }
            });

            scr.BindHotKeys();
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                    if (($.inArray(activatedTab, ["#list", "#record", "#parts", "#track"]) === -1)) {
                        deferreds.push(por.LoadSelected(true));
                    }
                    $.when.apply($, deferreds).done(function () {
                        switch (activatedTab) {
                            case "#list":
                                por.ResetUI();
                                List();
                                if (window.history && window.history.pushState)
                                    window.history.pushState("forward", null, "/PurchaseOrders/Index#no-back");
                                break;
                            case "#record":
                                $("#btnSave").prop("disabled", false);
                                if (!selectedrecord)
                                    por.ResetUI();
                                else
                                    por.LoadSelected();
                                break;
                            case "#part":
                                prt.Ready();
                                break;
                            case "#track":
                                trck.Ready();
                                break;
                        }
                        scr.Configure();
                    });
                });
        };
        var RegisterTabEvents = function () {
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    por.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(por.Save);
            $("#btnDelete").click(por.Delete);
            $("#btnUndo").click(por.LoadSelected);
            $("#btnPrint").click(Print);
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });
            $("#filter").click(function () {
                RunSidebarFilter();
            });

            $("[loadstatusesonchange=\"yes\"]").on("change",
                function () {
                    LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });

            purchaseOrderDocumentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });

            purchaseOrderCommentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
            RegisterTabChange();
            BuildModals();
            AutoComplete();
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "PURCHASEORDER",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    MDepartment: department,
                    TDepartment: department,
                    RequestedBy: $("#requestedby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-code=\"" +
                            status.code +
                            "\" data-pcode=\"" +
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
                            strOption += "<option data-code=\"" +
                                di.SAU_TO +
                                "\" data-pcode=\"" +
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
        var FillTabCounts = function (id) {
            return tms.Ajax({
                url: "/Api/ApiPurchaseOrders/GetTabCounts",
                data: JSON.stringify(id),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        var tab = $(".nav-tabs a[href=\"#" + d.data[i].TAB + "\"]");
                        tab.find("span").remove();
                        tab.append(" <span class=\"badge " +
                            (d.data[i].CNT > 0 ? " badge-danger" : "") +
                            "\">" +
                            d.data[i].CNT +
                            "</span>");
                    }
                }
            });
        };
        var GridDataBound = function () {
            grdPurchaseOrdersElm.find("[data-id]").on("dblclick",
                function () {
                    $.when(FillTabCounts(purchaseorderid)).done(function () {
                        $(".nav-tabs a[href=\"#record\"]").tab("show");
                    });
                });

            grdPurchaseOrdersElm.find("#search").off("click").on("click", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });

        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        
        var List = function () {
            var gridfilter = GetFilter();

            var path = tms.Path();

            if (grdPurchaseOrders) {
                grdPurchaseOrders.ClearSelection();
                grdPurchaseOrders.RunFilter(gridfilter);
            } else {
                grdPurchaseOrders = new Grid({
                    keyfield: "POR_ID",
                    columns: [
                        {
                            type: "number",
                            field: "POR_ID",
                            title: gridstrings.purchaseorders[lang].purchaseorderid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_DESCRIPTION",
                            title: gridstrings.purchaseorders[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "POR_ORG",
                            title: gridstrings.purchaseorders[lang].organization,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_TYPE",
                            title: gridstrings.purchaseorders[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_STATUS",
                            title: gridstrings.purchaseorders[lang].status,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "POR_STATUSDESC",
                            title: gridstrings.purchaseorders[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "POR_WAREHOUSE",
                            title: gridstrings.purchaseorders[lang].warehouse,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "POR_PARTTOTAL",
                            title: gridstrings.purchaseorders[lang].parttotal,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "POR_TOTALTAXES",
                            title: gridstrings.purchaseorders[lang].totaltaxes,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "POR_TASK",
                            title: gridstrings.purchaseorders[lang].task,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_REQUESTEDBY",
                            title: gridstrings.purchaseorders[lang].requestedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "POR_REQUESTED",
                            title: gridstrings.purchaseorders[lang].requested,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_SUPPLIER",
                            title: gridstrings.purchaseorders[lang].supplier,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_CURRENCY",
                            title: gridstrings.purchaseorders[lang].currency,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "POR_EXCHANGERATE",
                            title: gridstrings.purchaseorders[lang].exchangerate,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_CREATEDBY",
                            title: gridstrings.purchaseorders[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "POR_CREATED",
                            title: gridstrings.purchaseorders[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "POR_UPDATEDBY",
                            title: gridstrings.purchaseorders[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "POR_UPDATED",
                            title: gridstrings.purchaseorders[lang].updated,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "POR_RECORDVERSION",
                            title: gridstrings.purchaseorders[lang].recordversion,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        POR_ID: { type: "number" },
                        POR_TASK: { type: "number" },
                        POR_EXCHANGERATE: { type: "number" },
                        POR_PARTTOTAL: { type: "number" },
                        POR_TOTALTAXES: { type: "number" },
                        POR_CREATED: { type: "date" },
                        POR_REQUESTED: { type: "date" },
                        POR_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiPurchaseOrders/List",
                    selector: "#grdPurchaseOrders",
                    name: "grdPurchaseOrders",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "POR_ID",
                    primarytextfield: "POR_DESCRIPTION",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    hasfiltermenu: true,
                    sort: [{ field: "POR_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                       
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"purchaseorders.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify(
                {
                    POR_ID: (purchaseorderid || 0),
                    POR_ORG: $("#org").val(),
                    POR_TYPEENTITY: "PURCHASEORDER",
                    POR_TYPE: $("#type").val(),
                    POR_DESCRIPTION: $("#description").val(),
                    POR_REQUESTEDBY: $("#requestedby").val(),
                    POR_REQUESTED: moment.utc($("#requestdate").val(), constants.dateformat),
                    POR_STATUSENTITY: "PURCHASEORDER",
                    POR_STATUS: $("#status").val(),
                    POR_PAYMENTTERM:  ($("#suppaymentterm").val() || null),
                    POR_WAREHOUSE: $("#warehouse").val(),
                    POR_SUPPLIER: $("#supplier").val(),
                    POR_CURRENCY: $("#currency").val(),
                    POR_DELIVERYADR: $("#deliveryadr").val(),
                    POR_EXCHANGERATE: $("#exchangerate").val(),
                    POR_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                    POR_CREATED: selectedrecord != null ? selectedrecord.POR_CREATED : tms.Now(),
                    POR_CREATEDBY: selectedrecord != null ? selectedrecord.POR_CREATEDBY : user,
                    POR_UPDATED: selectedrecord != null ? tms.Now() : null,
                    POR_UPDATEDBY: selectedrecord != null ? user : null,
                    POR_RECORDVERSION: selectedrecord != null ? selectedrecord.POR_RECORDVERSION : 0
                });

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrders/Save",
                data: o,
                contentType: "application/json",
                fn: function (d) {
                    msgs.success(d.data);
                    purchaseorderid = d.r.POR_ID;
                    $("#Purchaseorder").val(purchaseorderid);
                    return por.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (purchaseorderid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPurchaseOrders/Delete",
                            data: JSON.stringify(purchaseorderid),
                            fn: function (d) {
                                msgs.success(d.data);
                                por.ResetUI();
                                List();
                            }
                        });
                    });
            }
        };
        var ItemSelect = function (row) {
            selectedrecord = grdPurchaseOrders.GetRowDataItem(row);
            purchaseorderid = selectedrecord.POR_ID;
            organizationcurr = selectedrecord.POR_ORGCURR;

            $("#Purchaseorder").val(selectedrecord.POR_ID);
            $(".page-header h6").html(selectedrecord.POR_ID + " - " + selectedrecord.POR_DESCRIPTION);
            scr.Configure();
            tms.Tab();
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
                    CalculateExch();
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
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#purchaseorderno").val(selectedrecord.POR_ID);
            $("#description").val(selectedrecord.POR_DESCRIPTION);
            $("#org").val(selectedrecord.POR_ORG);
            $("#type").val(selectedrecord.POR_TYPE);
            $("#status").val(selectedrecord.POR_STATUS);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#warehouse").val(selectedrecord.POR_WAREHOUSE);
            $("#requestedby").val(selectedrecord.POR_REQUESTEDBY);
            $("#requestdate").val(moment(selectedrecord.POR_REQUESTED).format(constants.longdateformat));
            $("#supplier").val(selectedrecord.POR_SUPPLIER);
            $("#suppaymentterm").val(selectedrecord.POR_PAYMENTTERM);
            $("#supdesc").val(selectedrecord.POR_SUPPLIERDESC);
            $("#currency").val(selectedrecord.POR_CURRENCY);
            $("#exchangerate").val(selectedrecord.POR_EXCHANGERATE ? parseFloat(selectedrecord.POR_EXCHANGERATE).fixed(constants.exchdecimals) : "");
            $("#parttotal").val(selectedrecord.POR_PARTTOTAL ? parseFloat(selectedrecord.POR_PARTTOTAL).fixed(constants.pricedecimals) : 0);
            $("#totaltaxes").val(selectedrecord.POR_TOTALTAXES ? parseFloat(selectedrecord.POR_TOTALTAXES).fixed(constants.pricedecimals) : 0);
            $("#deliveryadr").val(selectedrecord.POR_DELIVERYADR);
            $("#total").val(0);
            $("#createdby").val(selectedrecord.POR_CREATEDBY);
            $("#createddate").val(moment(selectedrecord.POR_CREATED).format(constants.longdateformat));

            $("#parttoalcurr").val(selectedrecord.POR_CURRENCY);
            $("#totaltaxescurr").val(selectedrecord.POR_CURRENCY);
            $("#totalcurr").val(selectedrecord.POR_CURRENCY);

            //TODO: TOPLAM a Dİğer Ücretlerde Katılmalı 

            var total = (parseFloat((selectedrecord.POR_PARTTOTAL ? selectedrecord.POR_PARTTOTAL : 0)) + parseFloat((selectedrecord.POR_TOTALTAXES ? selectedrecord.POR_TOTALTAXES : 0))).fixed(constants.pricedecimals);

            $("#total").val(total);

            tooltip.show("#type", selectedrecord.POR_TYPE);
            tooltip.show("#org", selectedrecord.POR_ORG);
            tooltip.show("#supplier", selectedrecord.POR_SUPPLIERDESC);
            tooltip.show("#requestedby", selectedrecord.POR_REQUESTEDBY);
            tooltip.show("#warehouse", selectedrecord.POR_WAREHOUS);

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            if (selectedrecord.POR_CURRENCY === organizationcurr) {
                $("#exchangerate").removeClass("required")
                    .prop("disabled", true)
                    .attr("overridable", false)
                    .removeAttr("required");
            } else {
                $("#exchangerate").addClass("required")
                    .prop("disabled", false)
                    .attr("overridable", true)
                    .attr("required");
            }

            purchaseOrderCommentsHelper.showCommentsBlock({ subject: "PURCHASEORDER", source: selectedrecord.POR_ID });
            purchaseOrderDocumentsHelper.showDocumentsBlock({ subject: "PURCHASEORDER", source: selectedrecord.POR_ID });

            return $.when(LoadStatuses({
                pcode: selectedstatus.STA_PCODE,
                code: selectedstatus.STA_CODE,
                text: selectedstatus.STA_DESCF
            })).done(function () {
                EvaluateCurrentStatus();
            });
        };
        this.LoadSelected = function (dataonly) {
            return tms.Ajax({
                url: "/Api/ApiPurchaseOrders/Get",
                data: JSON.stringify(purchaseorderid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    FillTabCounts(selectedrecord.POR_ID);
                    if (!dataonly) {
                        FillUserInterface();
                    }
                }
            });
        };

        this.BuildUI = function () {
            RegisterUiEvents();
            RegisterTabEvents();

            List();
            //GetGrandTotal();
            LoadStatuses({
                code: $("#status").data("code"),
                pcode: $("#status").data("pcode"),
                text: $("#status").data("text")
            });
        };
        this.ResetUI = function () {
            selectedrecord = null;
            purchaseorderid = null;

            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);
            var tab = $(".nav-tabs a[href=\"#part\"]");
            tab.find("span").remove();

            $("#purchaseorderno").val("");
            $("#description").val("");
            $("#org").val("");
            $("#total").val("");
            $("#type").val("");
            $("#status").val("");
            $("#warehouse").val("");
            $("#suppaymentterm").val("");
            $("#requestedby").val("");
            $("#requested").val("");
            $("#supplier").val("");
            $("#currency").val("");
            $("#exchangerate").val("");
            $("#deliveryadr").val("");
            $("#parttotal").val("");
            $("#totaltaxes").val("");
            $("#totalparttaxes").val("");
            $("#total").val("");
            $("#createdby").val(user);
            $("#createddate").val(tms.Now().format(constants.longdateformat));
            $("#parttoalcurr").val("");
            $("#totaltaxescurr").val("");
            $("#totalcurr").val("");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);

            tooltip.hide("#type");
            tooltip.hide("#org");
            tooltip.hide("#supplier");
            tooltip.hide("#requestedby");
            tooltip.hide("#warehouse");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");
            LoadStatuses({
                code: $("#status").data("code"),
                pcode: $("#status").data("pcode"),
                text: $("#status").data("text")
            });


            $("#exchangerate").prop("disabled", false).attr("required", "required").addClass("required");

            purchaseOrderCommentsHelper.clearComments();
            purchaseOrderDocumentsHelper.clearDocuments();
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
                                por.Save();
                                break;
                            case "part":
                                prt.Save();
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
                                por.ResetUI();
                                break;
                            case "part":
                                prt.ResetUI();
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
                                por.LoadSelected();
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
                                por.Delete();
                                break;
                            case "part":
                                prt.Remove();
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
                                por.HistoryModal();
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
            if (tab.more && typeof (tab.more) === "function")
                return tab.more();
        };
        this.ContextMenu = function () {
            $.contextMenu({
                selector: "#record,#part",
                build: function ($trigger, e) {
                    if (e.target.nodeName === "DIV")
                        return {
                            zIndex: 1001,
                            items: {
                                addwarehouse: {
                                    name: applicationstrings[lang].addtoWarehouse,
                                    disabled: function (key, opt) {
                                        //TODO: Check Waiting quan
                                        var arrayAuth = (tmsparameters.PORECEIPTAUTH).split(',');
                                        if (selectedlinerecordremain && selectedlinerecord && selectedrecord.POR_STATUS === "K"
                                            && arrayAuth.includes(usergroup) && selectedlinerecordremain.PLS_REMAININGQTY > 0) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        if (!customer) {
                                            switch (tms.ActiveTab()) {
                                                case "record":
                                                    return false;
                                                case "part":
                                                    return true;
                                            }
                                        }
                                        return false;
                                    },
                                    callback: function () {
                                        $("#modaladdtowarehouse").modal();
                                    }
                                },
                                addwarehouseList: {
                                    name: applicationstrings[lang].addtoWarehouseasList,
                                    disabled: function (key, opt) {
                                        //TODO: Check Waiting quan
                                        var arrayAuth = (tmsparameters.PORECEIPTAUTH).split(',');
                                        if (selectedrecord.POR_STATUS === "K" && arrayAuth.includes(usergroup)) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        if (!customer) {
                                            switch (tms.ActiveTab()) {
                                                case "record":
                                                    return true;
                                                case "part":
                                                    return false;
                                            }
                                        }
                                        return false;
                                    },
                                    callback: function () {
                                        $("#allwaybill").val("");
                                        $("#modaladdalltowarehouse").modal();
                                    }
                                },
                                returnwarehouse: {
                                    name: applicationstrings[lang].refundFromWarehouse,
                                    disabled: function (key, opt) {
                                        var arrayAuth = (tmsparameters.PORECEIPTAUTH).split(',');
                                        if (selectedlinerecordremain && selectedlinerecord && selectedrecord.POR_STATUS === "K"
                                            && arrayAuth.includes(usergroup)
                                            && selectedlinerecordremain.PLS_REMAININGQTY < (selectedlinerecord.PRL_QUANTITY * selectedlinerecord.PRL_UOMMULTI)) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        if (!customer) {
                                            switch (tms.ActiveTab()) {
                                                case "record":
                                                    return false;
                                                case "part":
                                                    return true;
                                            }
                                        }
                                        return false;
                                    },
                                    callback: function () {
                                        $("#modalreturnfromwarehouse").modal();
                                    }
                                }
                            }
                        };
                    return false;
                }
            });
        };
    };

    function ready() {
        por.BuildUI();
        scr.ContextMenu();
    }

    $(document).ready(ready);
}());