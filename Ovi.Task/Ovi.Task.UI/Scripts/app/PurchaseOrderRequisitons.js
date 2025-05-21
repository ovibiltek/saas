(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var selectedlinerecord = null;
    var selectedlinerecordremain = null;
    var purchaseorderid = 0;
    var purchaseorderlineid = 0;
    var scr, por, prt;
    //var mobilePhoneHelper;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true }

            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true }
            ]
        },
        {
            name: "divpart",
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
    prt = new function () {
        var grdPurchaseOrderParts = null;
        var partuom = null;
        var grdStock = null;
        var grdPurchaseOrderPartsElm = $("#grdPurchaseOrderParts");

        var self = this;
        var StockList = function () {
            var grdFilter = [{ field: "STK_PARTCODE", value: $("#part").val(), operator: "eq", logic: "and" }];
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
                    height: 370,
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
            var basecurr = selectedrecord.PRQ_ORGCURR;
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
            if (v_partunitprice && v_partcostqty) {
                var total = (parseFloat(v_partunitprice) * parseFloat(v_partcostqty)).fixed(constants.pricedecimals);
                $("#totalpartprice").val(total);
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
            purchaseorderlineid = selectedlinerecord.PQL_ID;
            $("#btnstock").prop("disabled", false);
            FillUserInterface();
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

        var CalculateTotals = function () {
            if ($("#partunitprice").val() && $("#quantity").val()) {
                var totalprice = parseFloat($("#partunitprice").val()).fixed(constants.pricedecimals) * parseFloat($("#quantity").val()).fixed(constants.pricedecimals);
                var totaltax = (totalprice * parseFloat($("#vat").val()).fixed(constants.pricedecimals)) / 100;
                $("#totalpartprice").val(parseFloat(totalprice).fixed(constants.pricedecimals));
                $("#totalparttaxes").val(parseFloat(totaltax).fixed(constants.pricedecimals));
                $("#totalpartpricewithvat").val(parseFloat(totaltax + totalprice).fixed(constants.pricedecimals));
            }
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
                            CalculateTotals();

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
                    returninput: "#part",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 400 }
                    ],
                    filter: [
                        { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                        { field: "PAR_ORG", value: [selectedrecord.PRQ_ORG, "*"], operator: "in" }
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
                        tooltip.show("#part", d.PAR_DESC);
                        $("#partdesc").val(d.PAR_DESC);

                        $("#part").data("id", (d ? d.PAR_ID : null));
                        $("#paruom").val(d ? d.PAR_UOM : "");
                        $("#partcurrency").val(d ? d.PAR_CURR : "");
                        partuom = (d ? d.PAR_UOM : null);
                        $("#uommulti").val("");
                        $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
                        $("#uom").val("");
                        tooltip.hide("#uom");
                        $("#btnstock").prop("disabled", false);
                        StockList();
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
                        CalculateTotals();
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
            $("#part").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                filter: [
                    { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                    { field: "PAR_ORG", func: function () { return [selectedrecord.PRQ_ORG, "*"] }, operator: "in" }
                ],
                callback: function (d) {
                    tooltip.show("#part", d.PAR_DESC);
                    $("#partdesc").val(d.PAR_DESC);
                    $("#part").data("id", (d ? d.PAR_ID : null));
                    $("#paruom").val(d ? d.PAR_UOM : "");
                    partuom = (d ? d.PAR_UOM : null);
                    $("#uommulti").val("");
                    $("#partcurrency").val(d ? d.PAR_CURR : null);
                    $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
                    $("#uom").val("");
                    tooltip.hide("#uom");
                    $("#btnstock").prop("disabled", false);
                    StockList();
                    return CalculateExch();
                }
            });
        };
        var GridDataBound = function () {
            grdPurchaseOrderPartsElm.find("[data-id]").on("dblclick",
                function () {
                    //TODO: ??
                });
        };
        var GridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var List = function () {
            var gridfilter = [{ field: "PQL_REQ", value: selectedrecord.PRQ_ID, operator: "eq", logic: "and" }];
            if (grdPurchaseOrderParts) {
                grdPurchaseOrderParts.ClearSelection();
                grdPurchaseOrderParts.RunFilter(gridfilter);
            } else {
                grdPurchaseOrderParts = new Grid({
                    keyfield: "PQL_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PQL_ID",
                            title: gridstrings.purchaseorderlines[lang].purchaseorderlineid,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PQL_LINE",
                            title: gridstrings.purchaseorderlines[lang].line,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PQL_PARTCODE",
                            title: gridstrings.purchaseorderlines[lang].partcode,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PQL_PARTDESC",
                            title: gridstrings.purchaseorderlines[lang].partdesc,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PQL_QUANTITY",
                            title: gridstrings.purchaseorderlines[lang].quantity,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PQL_PARUOM",
                            title: gridstrings.purchaseorderlines[lang].uom,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PQL_POSTATUS",
                            title:  gridstrings.purchaseorderlines[lang].postatus,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PQL_REQUESTEDUOM",
                            title: gridstrings.purchaseorderlines[lang].requesteduom,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PQL_UOMMULTI",
                            title: gridstrings.purchaseorderlines[lang].uommulti,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "PQL_REQUESTEDDATE",
                            title: gridstrings.purchaseorderlines[lang].requesteddate,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PQL_CREATED",
                            title: gridstrings.purchaseorderlines[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PQL_CREATEDBY",
                            title: gridstrings.purchaseorderlines[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PQL_UPDATED",
                            title: gridstrings.purchaseorderlines[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PQL_UPDATEDBY",
                            title: gridstrings.purchaseorderlines[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PQL_RECORDVERSION",
                            title: gridstrings.purchaseorderlines[lang].recordversion,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        PQL_ID: { type: "number" },
                        PQL_CREATED: { type: "date" },
                        PQL_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiPurchaseOrderRequisitionLines/List",
                    selector: "#grdPurchaseOrderParts",
                    name: "grdPurchaseOrderParts",
                    height: 250,
                    primarycodefield: "PQL_ID",
                    primarytextfield: "PQL_DESCRIPTION",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "PQL_ID", dir: "asc" }],
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
        this.Save = function () {
            if (!tms.Check("#divpart"))
                return $.Deferred().reject();

            var pql = JSON.stringify({
                PQL_ID: (purchaseorderlineid || 0),
                PQL_PARTID: $("#part").data("id"),
                PQL_PARTNOTE: $("#partnote").val(),
                PQL_LINE: selectedlinerecord != null ? selectedlinerecord.PQL_LINE : null,
                PQL_QUANTITY: $("#quantity").val(),
                PQL_REQUESTEDUOM: $("#uom").val(),
                PQL_UOMMULTI: $("#uommulti").val(),
                PQL_REQUESTEDDATE: moment.utc($("#partrequestdate").val(), constants.dateformat),
                PQL_UNITPRICE: 0,
                PQL_CURRENCY: "TL",
                PQL_EXCHANGERATE: 1,
                PQL_VATTAX: 18,
                PQL_TAX2: 0,
                PQL_REQ: selectedrecord != null ? selectedrecord.PRQ_ID : null,
                PQL_CREATED: selectedlinerecord != null ? selectedlinerecord.PQL_CREATED : tms.Now(),
                PQL_CREATEDBY: selectedlinerecord != null ? selectedlinerecord.PQL_CREATEDBY : user,
                PQL_UPDATED: selectedlinerecord != null ? tms.Now() : null,
                PQL_UPDATEDBY: selectedlinerecord != null ? user : null,
                PQL_RECORDVERSION: selectedlinerecord != null ? selectedlinerecord.PQL_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrderRequisitionLines/Save",
                contentType: "application/json",
                data: pql,
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
                            url: "/Api/ApiPurchaseOrderRequisitionLines/Delete",
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
        var FillUserInterface = function () {
            tms.UnBlock("#partform");
            tms.BeforeFill("#divpart");

            $("#purchaseorderlineno").val(selectedlinerecord.PQL_ID);
            $("#part").val(selectedlinerecord.PQL_PARTCODE);
            $("#partnote").val(selectedlinerecord.PQL_PARTNOTE);
            $("#part").prop("disabled", true);
            $("#part").data("id", selectedlinerecord.PQL_PARTID);
            $("#part").data("cur", selectedlinerecord.PQL_PARTCURR);
            $("#quantity").val(selectedlinerecord.PQL_QUANTITY);
            $("#paruom").val(selectedlinerecord.PQL_PARUOM);
            $("#uom").val(selectedlinerecord.PQL_REQUESTEDUOM);
            $("#partcurrency").val(selectedlinerecord.PQL_CURRENCY);
            $("#partexchangerate").val(parseFloat(selectedlinerecord.PQL_EXCHANGERATE).fixed(constants.pricedecimals));
            $("#vat").val(selectedlinerecord.PQL_VATTAX);
            $("#partrequestdate").val(moment(selectedlinerecord.PQL_REQUESTEDDATE).format(constants.dateformat));
            $("#tax2").val(selectedlinerecord.PQL_TAX2);
            $("#partunitprice").val(selectedlinerecord.PQL_UNITPRICE);
            $("#uommulti").val(selectedlinerecord.PQL_UOMMULTI);
            $("#partdesc").val(selectedlinerecord.PQL_PARTDESC);

            $("#totalpartpricecurr").val(selectedlinerecord.PQL_CURRENCY);
            $("#totalpartpricewithvatcurr").val(selectedlinerecord.PQL_CURRENCY);
            $("#totalparttaxescurr").val(selectedlinerecord.PQL_CURRENCY);

            tooltip.show("#uom", selectedlinerecord.PQL_REQUESTEDUOMDESC);
            tooltip.show("#partcurrency", selectedlinerecord.PQL_CURRENCY);
            tooltip.show("#part", selectedlinerecord.PQL_PARTDESC);
            tooltip.show("#paruom", selectedlinerecord.PQL_PARUOMDESC);

            CalculateExch();
            CalculateTotal();
            CalculateTotalTax();
            $("#btnDeletePart").prop("disabled", false);

            if (selectedlinerecord.PQL_REQUESTEDUOM === selectedlinerecord.PQL_PARUOM) {
                $("#uommulti").prop("disabled", true).removeAttr("required").removeClass("required");
            } else {
                $("#uommulti").prop("disabled", false).attr("required", "required").addClass("required");
            }
        };
        var RegisterTabEvents = function () {
            $("#btnSavePart").click(self.Save);
            $("#btnAddPart").click(self.ResetUI);
            $("#btnDeletePart").click(self.Remove);
            $("#btnstock").click(function () {
                $("#modalstock").modal();
            });
            $("#vat").on("change",
                function () {
                    CalculateTotals();
                });
            $("#partunitprice").on("change",
                function () {
                    CalculateTotals();
                });
            $("#quantity").on("change",
                function () {
                    CalculateTotals();
                });
        };
        var RegisterUIEvents = function () {
            LoadVATs();
            BuildModals();
            AutoComplete();

            $("#partform input[calc-group=\"1\"]").on("change",
                function () {
                    CalculateTotal();
                    CalculateTotalTax();
                });

            $("#partform select[calc-group=\"1\"]").on("change",
                function () {
                    CalculateTotalTax();
                });

            RegisterTabEvents();
        };
        this.ResetUI = function () {
            tms.UnBlock("#partform");
            tms.Reset("#divpart");
            $("#btnstock").prop("disabled", true);

            selectedlinerecord = null;
            purchaseorderlineid = null;
            $("#purchaseorderlineno").val("");
            $("#part").val("");
            $("#partnote").val("");
            $("#part").prop("disabled", false);
            $("#part").data("id", null);
            $("#quantity").val("");
            $("#paruom").val("");
            $("#uom").val("");
            $("#uommulti").val("");
            $("#partcurrency").val(selectedrecord.PRQ_CURRENCY);
            $("#totalpartpricecurr").val(selectedrecord.PRQ_CURRENCY);
            $("#totalpartpricewithvatcurr").val(selectedrecord.PRQ_CURRENCY);
            $("#totalparttaxescurr").val(selectedrecord.PRQ_CURRENCY);
            $("#partexchangerate").val(selectedrecord.PRQ_EXCHANGERATE ? parseFloat(selectedrecord.PRQ_EXCHANGERATE).fixed(constants.exchdecimals) : parseFloat(0.0).fixed(constants.exchdecimals));
            $("#tax2").val("");
            $("#partrequestdate").val(tms.Now().format(constants.longdateformat));
            $("#partunitprice").val("");
            $("#vat").val("18");
            $("#partdesc").val("");


            $("#totalpartprice").val("");
            $("#totalpartpricewithvat").val("");
            $("#totalparttaxes").val("");

            $("#btnDeletePart").prop("disabled", true);
            tooltip.hide("#uom");
            tooltip.hide("#paruom");
            tooltip.hide("#part");
            tooltip.hide("#partcurrency");
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
        var loadedTask = null;
        var GetWarehouseByActivity = function (task, activity) {
            var o = {
                Task: task,
                Activity: activity
            };
            return tms.Ajax({
                url: "/Api/ApiWarehouses/GetWarehouseByActivity",
                data: JSON.stringify(o),
                fn: function (d) {
                    $("#warehouse").val(d.data);
                }
            });
        }
        var LoadAdrTypes = function () {
            var vatctrl = $("#adrtype");
            var vatOption = "";
            vatctrl.find("option").remove();

            vatOption += "<option selected=\"selected\" value=\"\">" + applicationstrings[lang].pleaseselect + "</option>";
            vatOption += "<option value=\"TOWAREHOUSE\">" + applicationstrings[lang].deliverytowarehouse + "</option>";
            vatOption += "<option value=\"TOCREW\">" + applicationstrings[lang].deliverytocrew + "</option>";
            vatOption += "<option value=\"TOCUSTOMER\">" + applicationstrings[lang].deliverytocustomer + "</option>";

            vatctrl.append(vatOption);

        };
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "PURCHASEORDERREQUEST", operator: "eq" },
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
                        { field: "CNR_ENTITY", value: "PURCHASEORDERREQUEST", operator: "eq" }
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
        var LoadTaskActivities = function (taskid) {
            var gridreq = {
                sort: [{ field: "TSA_LINE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "TSA_TASK", value: taskid, operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivities/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#purchaseorderactivity").prop("disabled", true);
                    $("#purchaseorderactivity option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].TSA_LINE +
                            "\"" +
                            (d.data[i].TSA_COMPLETED === "+" ? " disabled=\"disabled\"" : "") +
                            ">" +
                            d.data[i].TSA_LINE +
                            " - " +
                            d.data[i].TSA_DESC +
                            "</option>";
                    }
                    $("#purchaseorderactivity").append(strOptions);
                    $("#purchaseorderactivity").val($("#purchaseorderactivity").data("selected"));
                    if (selectedrecord) {
                        $("#purchaseorderactivity").val(selectedrecord.PRQ_TASKACTIVITY);
                       
                      $("#purchaseorderactivity").prop("disabled", true);
                       
                    }
                    else {
                        $("#purchaseorderactivity").prop("disabled", false);
                    }
                    

                }
            });
        };
        var NewPurchaseOrderByQuatation = function (quoid) {
            return $.when(tms.Ajax({ url: "/Api/ApiQuotations/Get", data: JSON.stringify(quoid) })).done(function (d) {
                var quo = d.data;
                organizationcurr = quo.QUO_ORGANIZATIONCURR;
                $("#description").val(quo.QUO_DESCRIPTION);
                $("#org").val(quo.QUO_ORGANIZATION);
                $("#requestedby").val(user);
                $("#purchaseorderquo").val(quo.QUO_ID);
                $("#type").val("DIGER");
                $("#type").prop("disabled", true);
                $("#btntype").prop("disabled", true);
                $("#purchaseordertask").val(quo.QUO_TASK);
               // $("#purchaseorderactivity").val(quo.QUO_ACTIVITY);
                $("#currency").val(quo.QUO_CURR);
                //GetWarehoueByActivity(quo.QUO_TASK, quo.QUO_ACTIVITY);
                $("#purchaseorderactivity").attr("required", true).addClass("required");
              
                tooltip.show("#type", "DIGER");
                tooltip.show("#org", quo.QUO_ORGANIZATIONDESC);
                //tooltip.show("#requestedby", quo.QUO_MANAGERDESC);
                $.when(LoadTaskActivities(quo.QUO_TASK)).done(function () {
                    
                    $("#purchaseorderactivity").val(quo.QUO_ACTIVITY);
                    GetActivityInfo();
                    LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });
            });
        };
        var GetActivityInfo = function () {
            let line = $("#purchaseorderactivity").val();
            GetWarehouseByActivity($("#purchaseordertask").val(), line);

        }
        var NewPurchaseOrderByTaskActivity = function (task, line) {
            return $.when(tms.Ajax({ url: "/Api/ApiTask/Get", data: JSON.stringify(task) })).done(function (d) {
                loadedTask = d.data;
                organizationcurr = loadedTask.TSK_ORGCURRENCY;
                $("#type").val("DIGER");
                $("#type").prop("disabled", true);
                $("#btntype").prop("disabled", true);
                $("#purchaseordertask").val(task);
                $("#purchaseorderactivity").data("branch", loadedTask.TSK_BRANCH);
                $("#org").val(loadedTask.TSK_ORGANIZATION);
                $("#purchaseorderregion").val(loadedTask.TSK_REGION);
                $("#requestedby").val(user);
                $("#purchaseorderactivity").attr("required", true).addClass("required");
                $("#purchaseordertask").attr("required", true).addClass("required");
                tooltip.show("#type", "DIGER");
                tooltip.show("#org", loadedTask.TSK_ORGANIZATION);
                $.when(LoadTaskActivities(task)).done(function () {
                    if (line)
                        $("#purchaseorderactivity").val(line);
                    GetActivityInfo();
                    LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });
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
                        $("#supplier").val("");
                        tooltip.hide("#supplier");
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
                    { field: "TYP_ENTITY", value: "PURCHASEORDERREQUEST", operator: "eq" },
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
                ]
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                    { field: "CUR_CODE", value: "*", operator: "neq" }
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
                        $("#supplier").val("");
                        tooltip.hide("#supplier");
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
                    ]
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
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
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
                        { field: "TYP_ENTITY", value: "PURCHASEORDERREQUEST", operator: "eq" },
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
                        $("#purchaseorderquo").val("");
                        $("#purchaseordertask").val("");
                        $("#purchaseorderactivity").val("");
                        $("#purchaseorderactivity option:not(.default)").remove();
                    }
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
            $("#adrtype").change(function () {
                var $this = $(this);
                var value = $this.find("option:selected").val();
                $("#fulladr").val("");
                $("#relatedperson").val("");
               // mobilePhoneHelper.clear();
                $("#usrphonenumber").val("");
                switch (value) {
                   
                    case "TOCREW":
                        if ($("#purchaseordertask").val()) {
                            return $.when(tms.Ajax({
                                url: "/Api/ApiSuppliers/GetAdrByTSA", data: JSON.stringify({
                                    Task: $("#purchaseordertask").val(),
                                    Line: $("#purchaseorderactivity").val()
                                })
                            })).done(function (d) {
                                if (d) {
                                    console.log(d.data);
                                    $("#fulladr").val("");
                                    $("#relatedperson").val("");
                                    //mobilePhoneHelper.clear();
                                    $("#usrphonenumber").val("");
                                    if (d.data) {
                                        let supdata = d.data.split("$");
                                        console.log(supdata);

                                        $("#fulladr").val(supdata[0].trim());
                                        $("#relatedperson").val(supdata[2].trim());
                                        let phonenumber = supdata[1].replace(/\s+/g, '');
                                        //mobilePhoneHelper.setvalue(phonenumber);
                                        if (phonenumber) {
                                            switch (phonenumber[0]) {
                                                case '+':
                                                    phonenumber = phonenumber.substring(3);
                                                    break;
                                                case '9':
                                                    phonenumber = phonenumber.substring(2);
                                                    break;
                                                case '0':
                                                    phonenumber = phonenumber.substring(1);
                                                    break;
                                                default:
                                                    break;

                                            }
                                        }
                                        $("#usrphonenumber").val(phonenumber);
                                    }
                                   
                                }
                            });
                        }
                        break;
                }
            });
            $("#purchaseorderactivity").change(GetActivityInfo);
            scr.BindHotKeys();
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                    if (($.inArray(activatedTab, ["#list", "#record", "#divpart", "#track"]) === -1)) {
                        deferreds.push(por.LoadSelected(true));
                    }
                    $.when.apply($, deferreds).done(function () {
                        switch (activatedTab) {
                            case "#list":
                                por.ResetUI();
                                List();
                                if (window.history && window.history.pushState)
                                    window.history.pushState("forward", null, "/PurchaseOrders/Requisition#no-back");
                                break;
                            case "#record":
                                $("#btnSave").prop("disabled", false);
                                if (!selectedrecord)
                                    por.ResetUI();
                                else
                                    por.LoadSelected();
                                break;
                            case "#divpart":
                                prt.Ready();
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
            LoadAdrTypes();
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

            RegisterTabChange();
            BuildModals();
            AutoComplete();
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "PURCHASEORDERREQUEST",
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
                url: "/Api/ApiPurchaseOrderRequisitions/GetTabCounts",
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
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var List = function () {
            var gridfilter = [];

            var path = tms.Path();

            if (path.Action === "ListByTask" && path.Param1) {
                gridfilter.push({ IsPersistent: true, value: path.Param1, field: "PRQ_TASK", operator: "eq" });
            }

            if (path.Action === "ListByQuotation" && path.Param1) {
                gridfilter.push({ IsPersistent: true, value: path.Param1, field: "PRQ_QUOTATION", operator: "eq" });
            }

            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            if (grdPurchaseOrders) {
                grdPurchaseOrders.ClearSelection();
                grdPurchaseOrders.RunFilter(gridfilter);
            } else {
                grdPurchaseOrders = new Grid({
                    keyfield: "PRQ_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PRQ_ID",
                            title: gridstrings.purchaseorders[lang].purchaseorderid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_DESCRIPTION",
                            title: gridstrings.purchaseorders[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PRQ_ORG",
                            title: gridstrings.purchaseorders[lang].organization,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_TYPE",
                            title: gridstrings.purchaseorders[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_STATUS",
                            title: gridstrings.purchaseorders[lang].status,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRQ_STATUSDESC",
                            title: gridstrings.purchaseorders[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "PRQ_QUOTATION",
                            title: gridstrings.purchaseorders[lang].quo,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "PRQ_TASK",
                            title: gridstrings.purchaseorders[lang].task,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "PRQ_TASKACTIVITY",
                            title: gridstrings.purchaseorders[lang].activity,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRQ_TASKREGION",
                            title: gridstrings.purchaseorders[lang].region,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_WAREHOUSE",
                            title: gridstrings.purchaseorders[lang].warehouse,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_REQUESTEDBY",
                            title: gridstrings.purchaseorders[lang].requestedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRQ_REQUESTED",
                            title: gridstrings.purchaseorders[lang].reqdate,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_SUPPLIER",
                            title: gridstrings.purchaseorders[lang].supplier,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_CURRENCY",
                            title: gridstrings.purchaseorders[lang].currency,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRQ_EXCHANGERATE",
                            title: gridstrings.purchaseorders[lang].exchangerate,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_CREATEDBY",
                            title: gridstrings.purchaseorders[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRQ_CREATED",
                            title: gridstrings.purchaseorders[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRQ_UPDATEDBY",
                            title: gridstrings.purchaseorders[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRQ_UPDATED",
                            title: gridstrings.purchaseorders[lang].updated,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PRQ_RECORDVERSION",
                            title: gridstrings.purchaseorders[lang].recordversion,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        PRQ_ID: { type: "number" },
                        PRQ_QUOTATION: { type: "number" },
                        PRQ_EXCHANGERATE: { type: "number" },
                        PRQ_CREATED: { type: "date" },
                        PRQ_REQUESTED: { type: "date" },
                        PRQ_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiPurchaseOrderRequisitions/List",
                    selector: "#grdPurchaseOrders",
                    name: "grdPurchaseOrders",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "PRQ_ID",
                    primarytextfield: "PRQ_DESCRIPTION",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    hasfiltermenu: true,
                    sort: [{ field: "PRQ_ID", dir: "desc" }],
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
        this.Save = function () {
            
            if (!tms.Check("#record") && $("#status").val() !== "IPT" )
                return $.Deferred().reject();

            var o = JSON.stringify(
                {
                    PRQ_ID: (purchaseorderid || 0),
                    PRQ_ORG: $("#org").val(),
                    PRQ_TYPEENTITY: "PURCHASEORDERREQUEST",
                    PRQ_TYPE: $("#type").val(),
                    PRQ_DESCRIPTION: $("#description").val(),
                    PRQ_REQUESTEDBY: $("#requestedby").val(),
                    PRQ_REQUESTED: moment.utc($("#requestdate").val(), constants.dateformat),
                    PRQ_STATUSENTITY: "PURCHASEORDERREQUEST",
                    PRQ_STATUS: $("#status").val(),
                    PRQ_WAREHOUSE: $("#warehouse").val(),
                    PRQ_REQDELADR: $("#fulladr").val(),
                    PRQ_REQDELADRTYPE: $("#adrtype").val(),
                    PRQ_SUPPLIER: null,
                    PRQ_QUOTATION: $("#purchaseorderquo").val(),
                    PRQ_TASK: $("#purchaseordertask").val(),
                    PRQ_TASKACTIVITY: $("#purchaseorderactivity").val(),
                    PRQ_CURRENCY: null,
                    PRQ_EXCHANGERATE: null,
                    PRQ_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                    PRQ_CREATED: selectedrecord != null ? selectedrecord.PRQ_CREATED : tms.Now(),
                    PRQ_CREATEDBY: selectedrecord != null ? selectedrecord.PRQ_CREATEDBY : user,
                    PRQ_UPDATED: selectedrecord != null ? tms.Now() : null,
                    PRQ_UPDATEDBY: selectedrecord != null ? user : null,
                    PRQ_RECORDVERSION: selectedrecord != null ? selectedrecord.PRQ_RECORDVERSION : 0,
                    PRQ_REQDELPHONENUMBER: $("#usrphonenumber").val(),
                    PRQ_REQDELRELATEDPERSON: $("#relatedperson").val()
                });

            return tms.Ajax({
                url: "/Api/ApiPurchaseOrderRequisitions/Save",
                data: o,
                contentType: "application/json",
                fn: function (d) {
                    msgs.success(d.data);
                    purchaseorderid = d.r.PRQ_ID;
                    FillTabCounts(purchaseorderid);
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
                            url: "/Api/ApiPurchaseOrderRequisitions/Delete",
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
        var GetWarehouse = function () {
            var o = JSON.stringify({
                UserName : user,
                org  : organization
            });

            return tms.Ajax({
                url: "/Api/ApiWarehouses/GetWarehousebyWarehouseman",
                data: o,
                fn: function (d) {
                    if (d.data) {
                        $("#warehouse").val(d.data);
                    }
                }
            });
        }
        var ItemSelect = function (row) {
            selectedrecord = grdPurchaseOrders.GetRowDataItem(row);
            purchaseorderid = selectedrecord.PRQ_ID;
            organizationcurr = selectedrecord.PRQ_ORGCURR;

            $("#Purchaseorder").val(selectedrecord.PRQ_ID);
            $(".page-header h6").html(selectedrecord.PRQ_ID + " - " + selectedrecord.PRQ_DESCRIPTION);
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
            tms.UnBlock("#partsform");
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#purchaseorderno").val(selectedrecord.PRQ_ID);
            $("#description").val(selectedrecord.PRQ_DESCRIPTION);
            $("#org").val(selectedrecord.PRQ_ORG);
            $("#type").val(selectedrecord.PRQ_TYPE);
            $("#status").val(selectedrecord.PRQ_STATUS);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#warehouse").val(selectedrecord.PRQ_WAREHOUSE);
            $("#requestedby").val(selectedrecord.PRQ_REQUESTEDBY);
            $("#fulladr").val(selectedrecord.PRQ_REQDELADR);
            $("#adrtype").val(selectedrecord.PRQ_REQDELADRTYPE);
            $("#requestdate").val(moment(selectedrecord.PRQ_REQUESTED).format(constants.longdateformat));
            $("#supplier").val(selectedrecord.PRQ_SUPPLIER);
            $("#currency").val(selectedrecord.PRQ_CURRENCY);
            $("#exchangerate").val(selectedrecord.PRQ_EXCHANGERATE ? parseFloat(selectedrecord.PRQ_EXCHANGERATE).fixed(constants.exchdecimals) : parseFloat(0.0).fixed(constants.exchdecimals));
            $("#purchaseorderquo").val(selectedrecord.PRQ_QUOTATION);
            $("#purchaseordertask").val(selectedrecord.PRQ_TASK);
           
            $("#othertotal").val(parseFloat(0.0).fixed(constants.pricedecimals));
            $("#total").val(parseFloat(0.0).fixed(constants.pricedecimals));
            $("#createdby").val(selectedrecord.PRQ_CREATEDBY);
            $("#createddate").val(moment(selectedrecord.PRQ_CREATED).format(constants.longdateformat));
            $("#purchaseorderactivity").data("branch", selectedrecord.PRQ_TASKBRANCH);
            $("#purchaseorderregion").val(selectedrecord.PRQ_TASKREGION);
            $("#parttoalcurr").val(selectedrecord.PRQ_CURRENCY);
            $("#totaltaxescurr").val(selectedrecord.PRQ_CURRENCY);
            $("#othertotalcurr").val(selectedrecord.PRQ_CURRENCY);
            $("#totalcurr").val(selectedrecord.PRQ_CURRENCY);
            $("#usrphonenumber").val(selectedrecord.PRQ_REQDELPHONENUMBER);
            $("#relatedperson").val(selectedrecord.PRQ_REQDELRELATEDPERSON);
            $("#cancellationreason").data("selected", selectedrecord.PRQ_CANCELLATIONREASON);
            tooltip.show("#type", selectedrecord.PRQ_TYPE);
            tooltip.show("#org", selectedrecord.PRQ_ORG);
            tooltip.show("#supplier", selectedrecord.PRQ_SUPPLIERDESC);
            tooltip.show("#requestedby", selectedrecord.PRQ_REQUESTEDBY);
            tooltip.show("#warehouse", selectedrecord.PRQ_WAREHOUSE);
            $.when(LoadTaskActivities(selectedrecord.PRQ_TASK)).done(function () {
                $("#purchaseorderactivity").val(selectedrecord.PRQ_TASKACTIVITY);
                $("#purchaseorderactivity").attr("disabled", true);
            });
            
            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            if (selectedrecord.PRQ_CURRENCY === organizationcurr) {
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

            purchaseOrderCommentsHelper.showCommentsBlock({ subject: "PURCHASEORDERREQUISITON", source: selectedrecord.PRQ_ID });
            purchaseOrderDocumentsHelper.showDocumentsBlock({ subject: "PURCHASEORDERREQUISITON", source: selectedrecord.PRQ_ID });
            LoadCancellationReasons();

            if (selectedstatus.STA_PCODE === "C") tms.Block("#partsform");

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
                url: "/Api/ApiPurchaseOrderRequisitions/Get",
                data: JSON.stringify(purchaseorderid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    FillTabCounts(selectedrecord.PRQ_ID);
                    if (!dataonly) {
                        FillUserInterface();
                    }
                }
            });
        };

        this.BuildUI = function () {
            //mobilePhoneHelper = new mobilephone({
            //    prefix: "#usrphonenumberpfx",
            //    number: "#usrphonenumber"
            //});
            RegisterUiEvents();
            RegisterTabEvents();
            var path = tms.Path();
            $("#requested").datetimepicker({
                format:'LT'
            });
            if (path.Action === "NewByQuotation" && path.Param1) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                NewPurchaseOrderByQuatation(path.Param1);
            }
            else if (path.Action === "NewByTask" && path.Param1 /*&& path.Param2*/) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                NewPurchaseOrderByTaskActivity(path.Param1, path.Param2);
            }
            
            List();
            LoadStatuses({
                code: $("#status").data("code"),
                pcode: $("#status").data("pcode"),
                text: $("#status").data("text")
            });
        };
        this.ResetUI = function () {
            selectedrecord = null;
            purchaseorderid = null;
            tms.UnBlock("#partsform");
            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);
            var tab = $(".nav-tabs a[href=\"#part\"]");
            tab.find("span").remove();

            $("#type").prop("disabled", false);
            $("#btntype").prop("disabled", false);
            $("#purchaseorderno").val("");
            $("#adrtype").val("");
            $("#fulladr").val("");
            $("#description").val("");
            $("#purchaseorderactivity").removeAttr("required").removeClass("required");
            $("#purchaseorderactivity").prop("disabled", true);
            $("#purchaseordertask").removeAttr("required").removeClass("required");
            $("#purchaseordertask").prop("disabled", true);
            $("#org").val(organization);
            tooltip.show("#org", organizationdesc);

            $("#total").val("");
            $("#type").val("");
            $("#status").val("");
            $("#adrtype").val("");
            $("#fulladr").val("");
            $("#warehouse").val("");
            $("#requestedby").val(user);
            $("#requested").val(tms.Now().format(constants.longdateformat));
            $("#supplier").val("");
            $("#currency").val("");
            $("#exchangerate").val("");
            $("#totalparttaxes").val("");
            $("#purchaseordertask").val("");
            $("#purchaseorderquo").val("");
            $("#purchaseorderactivity").val("");
            $("#purchaseorderactivity option:not(.default)").remove();
            $("#othertotal").val("");
            $("#total").val("");
            $("#purchaseorderquo").val("");
            $("#createdby").val(user);
            $("#createddate").val(tms.Now().format(constants.longdateformat));
            $("#parttoalcurr").val("");
            $("#totaltaxescurr").val("");
            $("#othertotalcurr").val("");
            $("#totalcurr").val("");
            $("#purchaseorderactivity option:not(.default)").remove();
            $("#relatedperson").val("");

            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);

            tooltip.hide("#type");
            
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

            //mobilePhoneHelper.clear();
            $("#usrphonenumber").val("");
            $("#exchangerate").prop("disabled", false).attr("required", "required").addClass("required");

            GetWarehouse();
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
     
    };
 
    function ready() {
       
        por.BuildUI();
      
    }

    $(document).ready(ready);
}());