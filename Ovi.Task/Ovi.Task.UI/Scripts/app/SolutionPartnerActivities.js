(function () {
    var scr, spa;
    var selectedActivity;
    var selectedTask;
    var selectedquotation;
    var selectedissuereturn;
    var selectedTaskCategory;
    var selectedTaskOrganization;
    var pstat;
    var quoLines = [];
    var miscCostParentType = null;

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

    var shr = new function () {
        this.CalculateExch = function (curr, basecurr) {
            if (!curr)
                return $.Deferred().reject();

            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: selectedTask ? selectedTask.TSK_ORGCURRENCY : basecurr || (selectedTaskOrganization ? selectedTaskOrganization.ORG_CURRENCY : null),
                CRR_STARTDATE: moment()
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch),
                fn: function (d) {
                    if (basecurr === curr) {
                        $("#quomisccostpurchaseexch").prop("disabled", true);
                    } else {
                        $("#quomisccostpurchaseexch").prop("disabled", false);
                    }
                }
            });
        };
    }
    var quo = new function () {
        var self = this;
        var quototal = 0;


        var UpdateExch = function () {
            var misccostpurchasepricecurr = $("#misccostpurchasepricecurr").val();
            if (misccostpurchasepricecurr) {
                $.when(shr.CalculateExch(misccostpurchasepricecurr, "TL")).done(function (d) {
                    if (d.data) {
                        $("#quomisccostpurchaseexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#quomisccostpurchaseexch").val("");
                    }
                });
            }

        }
        var GetContractServiceCodePrice = function (servicecode) {

            var gridreq = {
                sort: [{ field: "CSP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetServicePriceForTask", value: selectedTask.TSK_ID, value2: servicecode, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractServicePrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var GetContractPartPrice = function (part) {

            var gridreq = {
                sort: [{ field: "CPP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetPartPriceForTask", value: selectedTask.TSK_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var ModifyPricingSection = function () {
            var misccostqty = ($("#quomisccostqty").val() || null);
            var misccostunitpurchaseprice = ($("#quomisccostunitpurchaseprice").val() || null);
            var misccostpurchasediscountrate = ($("#quomisccostpurchasediscountrate").val() || null);
            var misccostpurchasediscountedunitprice = null;

            ModifyRequiredFields(misccostunitpurchaseprice);

            $("#quomisccostpurchasediscountedunitprice").val("");
            if (misccostunitpurchaseprice && misccostpurchasediscountrate) {
                misccostpurchasediscountedunitprice =
                    (misccostunitpurchaseprice * (100 - misccostpurchasediscountrate)) / 100;
                $("#quomisccostpurchasediscountedunitprice")
                    .val(misccostpurchasediscountedunitprice.fixed(constants.pricedecimals));
            }
            $("#quomisccosttotalpurchaseprice").val("");
            if (misccostqty && misccostunitpurchaseprice)
                $("#quomisccosttotalpurchaseprice")
                    .val((misccostqty * (misccostpurchasediscountedunitprice || misccostunitpurchaseprice)).fixed(
                        constants.pricedecimals));


        }
        var RestoreDefaultFieldStates = function () {
            $("#quomisccostdesc").addClass("required").prop("disabled", false).val("");
            $("#quomisccostuom").prop("disabled", false).addClass("required").val("");
            $("#btnquomisccostuom").prop("disabled", false);

            $("#quomisccostpart").removeClass("required").prop("disabled", true).data("id", null).val("");
            $("#btnquomisccostpart").prop("disabled", true);
            tooltip.hide("#quomisccostpart");
            $("#quomisccostpart").data("id", null);
            $("#quomisccostservicecode").data("id", null);

            $("#quomisccostservicecode").removeClass("required").prop("disabled", true).val("");
            $("#btnquomisccostservicecode").prop("disabled", true);
            tooltip.hide("#quomisccostservicecode");
        }
        var PartIsNotFound = function () {
            RestoreDefaultFieldStates();
        }
        var PartIsFound = function () {
            $("#quomisccostpart")
                .addClass("required")
                .prop("disabled", false)
                .data("id", null)
                .val("");
            $("#btnquomisccostpart").prop("disabled", false);
            $("#quomisccostdesc").removeClass("required").prop("disabled", true).val("");
            $("#quomisccostuom").prop("disabled", true).val("");
            $("#btnquomisccostuom").prop("disabled", true);
            tooltip.hide("#quomisccostpart");
        }
        var ServiceCodeIsNotFound = function () {
            RestoreDefaultFieldStates();
        }
        var ServiceCodeIsFound = function () {
            $("#quomisccostservicecode")
                .addClass("required")
                .prop("disabled", false)
                .data("id", null)
                .val("");
            $("#btnquomisccostservicecode").prop("disabled", false);
            $("#quomisccostdesc").removeClass("required").prop("disabled", true).val("");
            $("#quomisccostuom").prop("disabled", true).val("");
            $("#btnquomisccostuom").prop("disabled", true);
            tooltip.hide("#quomisccostservicecode");
        }
        var ModifyRequiredFields = function (misccostunitpurchaseprice) {
            if (misccostunitpurchaseprice != null) {
                $("#misccostpurchasepricecurr").attr("required", "required").addClass("required");
                $("#quomisccostpurchaseexch").attr("required", "required").addClass("required");
            } else {
                $("#misccostpurchasepricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#quomisccostpurchaseexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }

         
        }
        this.ResetUI = function () {
            tms.UnBlock("#quotationmisccostsform");
            tms.Reset("#quotationmisccosts");

            $("#quomisccostid").val("");
            $("#quomisccostdesc").val("").prop("disabled", false).addClass("required");
            $("#quomisccosttypeparent").val("").trigger("change");
            $("#quomisccosttype").val("");
            $("#quomisccostqty").val("");
            $("#quomisccostuom").val("");
            $("#quomisccostunitpurchaseprice").val("");
            $("#quomisccostpurchasediscountrate").val("");
            $("#quomisccostpurchasediscountedunitprice").val("");
            $("#quomisccosttotalpurchaseprice").val("");
            $("#quomisccostunitsalesprice").val("");
            $("#quomisccostreference").val("");
            $("#quomisccostsalesdiscountrate").val("");
            $("#quomisccostsalesdiscountedunitprice").val("");
            $("#quomisccosttotalpurchaseprice").val("");
            $("#misccostpurchasepricecurr").val("");
            $("#quomisccostpurchaseexch").val("");
            $("#quomisccostsalesexch").val("");

            ModifyRequiredFields(null, null);

            tooltip.hide("#misccostpurchasepricecurr");
            tooltip.hide("#quomisccostsalespricecurr");

            $("#quomisccostunitsalesprice").prop("disabled", false);
            $("#quomisccostpurchasediscountrate").prop("disabled", false);
            $("#quomisccostsalespricecurr").prop("disabled", false);
            $("#btnquomisccostsalespricecurr").prop("disabled", false);

            $("#quomisccostunitpurchaseprice").prop("disabled", false);
            $("#quomisccostsalesdiscountrate").prop("disabled", false);
            $("#misccostpurchasepricecurr").prop("disabled", false);
            $("#btnmisccostpurchasepricecurr").prop("disabled", false);
            $("#quomisccostpurchaseexch").prop("disabled", false);

            if (supplier)
                $("#quotationmisccosts_sales").hide();

        }
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
                ctrl: "#quomisccosttype",
                url: "/Api/ApiMiscCostTypes/List",
                keyfield: "MCT_CODE",
                textfield: "MCT_DESC",
                data: JSON.stringify(gridreq),
                callback: function (d) {
                    $("#quomisccosttype").val("SERVIS");
                }
            }).Fill();
        };
        var AddToArray = function () {
            if (!tms.Check("#modalQuotation"))
                return $.Deferred().reject();

            var selectedmisccostptype = $("#quomisccosttypeparent").val();

            var misccost = {
                MSC_ID: 0,
                MSC_QUOTATION: 0,
                MSC_PTYPE: selectedmisccostptype,
                MSC_PART: (selectedmisccostptype == "PART" ? $("#quomisccostpart").data("id") || null : null),
                MSC_SERVICECODE: (selectedmisccostptype == "SERVICE" ? $("#quomisccostservicecode").val() || null : null),
                MSC_DESC: (selectedmisccostptype === "PART"
                    ? (!$("#quomisccostpart").data("id") ? $("#quomisccostdesc").val() : null)
                    : $("#quomisccostdesc").val()),
                MSC_TYPE: $("#quomisccosttype").val(),
                MSC_QTY: $("#quomisccostqty").val(),
                MSC_UOM: $("#quomisccostuom").val(),
                MSC_BRAND: $("#quomisccostbrand").val(),
                MSC_UNITPURCHASEPRICE: ($("#quomisccostunitpurchaseprice").val() || null),
                MSC_PURCHASEDISCOUNTRATE: ($("#quomisccostpurchasediscountrate").val() || null),
                MSC_PURCHASEDISCOUNTEDUNITPRICE: ($("#quomisccostpurchasediscountedunitprice").val() || null),
                MSC_TOTALPURCHASEPRICE: ($("#quomisccosttotalpurchaseprice").val() || null),
                MSC_REFERENCE: ($("#quomisccostreference").val() || null),
                MSC_PURCHASEPRICECURR: ($("#misccostpurchasepricecurr").val() || null),
                MSC_PURCHASEEXCH: ($("#quomisccostpurchaseexch").val() || null),
                MSC_UNITSALESPRICE: null,
                MSC_SALESDISCOUNTRATE: null,
                MSC_SALESDISCOUNTEDUNITPRICE: null,
                MSC_TOTALSALESPRICE: null,
                MSC_SALESPRICECURR: null,
                MSC_SALESEXCH: null,
                MSC_CREATED: tms.Now(),
                MSC_CREATEDBY: user,
                MSC_UPDATED: null,
                MSC_UPDATEDBY: null,
                MSC_RECORDVERSION: 0,
                MSC_COPY: "-"
            };

            quoLines.push(misccost);
            var strquotable = "";

            var unitprice = $("#quomisccosttotalpurchaseprice").val() || null;
            var exch = $("#quomisccostpurchaseexch").val() || null;
            quototal = quototal + (unitprice * exch);

            strquotable += "<tr class=\"sectionlines str-track\">";
            strquotable += "<td>";
            strquotable +=  $("#quomisccostdesc").val();
            strquotable += "</td>";
            strquotable += "<td>";
            strquotable += $("#quomisccosttype").val();
            strquotable += "</td>";
            strquotable += "<td>";
            strquotable += $("#quomisccostqty").val();
            strquotable += "</td>";
            strquotable += "<td>";
            strquotable += $("#quomisccostuom").val();
            strquotable += "</td>";
            strquotable += "<td>";
            strquotable += unitprice != null ? parseFloat(unitprice).fixed(constants.pricedecimals) || "" : "";
            strquotable += "</td>";
            strquotable += "<td>";
            strquotable += ($("#quomisccostpurchasediscountrate").val() || ""),
            strquotable += "</td>";
            strquotable += "<td>";
            strquotable += ($("#quomisccostpurchasediscountedunitprice").val() || ""),
                strquotable += "</td>";
            strquotable += "<td>";
            strquotable += ($("#quomisccosttotalpurchaseprice").val() || ""),
                strquotable += "</td>";
            strquotable += "<td>";
            strquotable += ($("#misccostpurchasepricecurr").val() || ""),
            strquotable += "</td>";
            strquotable += "</tr>";

            $(strquotable).insertAfter($("#sectionlines"));

            $("#quototal").text(parseFloat(quototal).fixed(constants.pricedecimals) + " TL");

            self.ResetUI();
        };
        var SaveQuo = function () {
            if (quoLines.length > 0) {
                var quo = {
                    TaskID: selectedTask.TSK_ID,
                    Activity: selectedActivity.TSA_LINE,
                    Lines: quoLines
                };
                $("#confirmquo").modal().off("click", "#yes").one("click",
                    "#yes",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiQuotations/CreateQuotationFromSingleScreen",
                            data: JSON.stringify(quo),
                            fn: function (d) {
                                msgs.success(d.data);
                                spa.LoadSelected(selectedActivity.TSA_ID);
                                $("#modalQuotation").modal("hide");
                            }
                        });
                    });
            } else {
                return msgs.error(applicationstrings[lang].quolines);
            }


        }
        var RgstrTabEvents = function () {
            $("#btnAddQuo").click(AddToArray);
            $("#btnSendQuo").click(SaveQuo);


            $("#btnquomisccostuom").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.uoms[lang].title,
                    listurl: "/Api/ApiUoms/List",
                    keyfield: "UOM_CODE",
                    codefield: "UOM_CODE",
                    textfield: "UOM_DESC",
                    returninput: "#quomisccostuom",
                    columns: [
                        { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                        { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#quomisccostuom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });

            $("#btnquomisccostpurchasepricecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#misccostpurchasepricecurr",
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
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function () {
                        return UpdateExch();
                    }
                });
            });


            $("#btnquomisccostpart").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    modalinfo: applicationstrings[lang].partmodalinfo,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_ID",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#quomisccostpart",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 400 }
                    ],
                    filter: [
                        { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedTaskPart", value: selectedTask.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.parts[lang].allparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(tree.GetLevels("PART")).done(function (d) {
                            var data = tree.GenerateTreeData(d.data);
                            $(id).comboTree({
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
                        $("#quomisccostdesc").val(d ? d.PAR_DESC : "");
                        $("#quomisccostuom").val(d ? d.PAR_UOM : "");
                        $("#quomisccostpart").data("id", d ? d.PAR_ID : null);
                        $("#quomisccostbrand").val(d ? d.PAR_BRAND : "");

                        if (d)
                            tooltip.show("#misccostpart", d.PAR_DESC);
                        else
                            tooltip.hide("#misccostpart");

                        ModifyRequiredFields(null, null);
                        return $.when(GetContractPartPrice(d.PAR_ID)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#misccostreference").val(r.CPP_REFERENCE);
                                if (r.CPP_UNITPURCHASEPRICE !== null) {
                                    $("#misccostunitpurchaseprice").val(r.CPP_UNITPURCHASEPRICE);
                                    $("#misccostpurchasepricecurr").val(r.CPP_CURR);
                                }
                                if (r.CPP_UNITSALESPRICE !== null) {
                                    $("#misccostunitsalesprice").val(r.CPP_UNITSALESPRICE);
                                    $("#misccostsalespricecurr").val(r.CPP_CURR);
                                }
                                ModifyPricingSection();
                            }
                            return UpdateExch();
                        });
                    }
                });
            });
            $("#quomisccostpart").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                callback: function (d) {
                    $("#quomisccostdesc").val(d ? d.PAR_DESC : "");
                    $("#quomisccostuom").val(d ? d.PAR_UOM : "");
                    $("#quomisccostpart").data("id", d ? d.PAR_ID : null);
                    $("#quomisccostbrand").val(d ? d.PAR_BRAND : "");
                    if (d)
                        tooltip.show("#quomisccostpart", d.PAR_DESC);
                    else
                        tooltip.hide("#quomisccostpart");

                    ModifyRequiredFields(null,  null);
                    return $.when(GetContractPartPrice(d.PAR_ID)).done(function (p) {
                        if (p.data && p.data.length > 0) {
                            var r = p.data[0];
                            $("#quomisccostreference").val(r.CPP_REFERENCE);
                            if (r.CPP_UNITPURCHASEPRICE !== null) {
                                $("#misccostpurchasepricecurr").val(r.CPP_CURR);
                            }
                            if (r.CPP_UNITSALESPRICE !== null) {
                                $("#quomisccostunitsalesprice").val(r.CPP_UNITSALESPRICE);
                                $("#quomisccostsalespricecurr").val(r.CPP_CURR);
                            }
                            ModifyPricingSection();
                        }
                        return UpdateExch();
                    });
                }
            });

            $("#btnquomisccostservicecode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.servicecodes[lang].title,
                    modalinfo: applicationstrings[lang].servicecodesmodalinfo,
                    listurl: "/Api/ApiServiceCodes/List",
                    keyfield: "SRV_CODE",
                    codefield: "SRV_CODE",
                    textfield: "SRV_DESCRIPTIONF",
                    returninput: "#quomisccostservicecode",
                    columns: [
                        {
                            type: "number",
                            field: "SRV_CODE",
                            title: gridstrings.servicecodes[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "SRV_DESCRIPTIONF",
                            title: gridstrings.servicecodes[lang].description,
                            width: 400
                        }
                    ],
                    fields: {
                        SRV_CODE: { type: "number" }
                    },
                    filter: [
                        { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                        { field: "SRV_ORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.servicecodes[lang].contractedservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedTaskServiceCode", value: selectedTask.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.servicecodes[lang].allservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(tree.GetLevels("SERVICECODE")).done(function (d) {
                            var data = tree.GenerateTreeData(d.data);
                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [{ field: "SERVICECODELEVEL", value: selectedItem.id, operator: "func" }];
                                        callback(filter);
                                    }

                                }
                            });
                        });
                    },
                    callback: function (d) {

                        $("#quomisccostdesc").val(d ? d.SRV_DESCRIPTIONF : "");
                        $("#quomisccostuom").val(d ? d.SRV_UOM : "");
                        $("#quomisccostservicecode").data("id", d ? d.SRV_CODE : null);
                        if (d)
                            tooltip.show("#quomisccostservicecode", d.SRV_DESCRIPTIONF);
                        else
                            tooltip.hide("#quomisccostservicecode");

                        ModifyRequiredFields(null, null);
                        return $.when(GetContractServiceCodePrice(d.SRV_CODE)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#misccostreference").val(r.CSP_REFERENCE);
                                if (r.CSP_UNITPURCHASEPRICE !== null) {
                                    $("#misccostunitpurchaseprice").val(r.CSP_UNITPURCHASEPRICE);
                                    $("#misccostpurchasepricecurr").val(r.CSP_CURR);
                                }
                                if (r.CSP_UNITSALESPRICE !== null) {
                                    $("#misccostunitsalesprice").val(r.CSP_UNITSALESPRICE);
                                    $("#misccostsalespricecurr").val(r.CSP_CURR);
                                }
                                ModifyPricingSection();
                            }
                            return UpdateExch();
                        });
                    }
                });
            });
            $("#quomisccostservicecode").autocomp({
                listurl: "/Api/ApiServiceCodes/List",
                geturl: "/Api/ApiServiceCodes/Get",
                field: "SRV_CODE",
                textfield: "SRV_DESCRIPTIONF",
                active: "SRV_ACTIVE",
                termisnumeric: true,
                filter: [{ field: "SRV_ORG", func: function () { return selectedrecord.QUO_ORGANIZATION; }, includeall: true }],
                callback: function (d) {
                    $("#quomisccostdesc").val(d ? d.SRV_DESCRIPTIONF : "");
                    $("#quomisccostuom").val(d ? d.SRV_UOM : "");
                    if (d)
                        tooltip.show("#quomisccostservicecode", d.SRV_DESCRIPTIONF);
                    else
                        tooltip.hide("#quomisccostservicecode");

                    ModifyRequiredFields(null,null);
                    return $.when(GetContractServiceCodePrice(d.SRV_CODE)).done(function (p) {
                        if (p.data && p.data.length > 0) {
                            var r = p.data[0];
                            $("#quomisccostreference").val(r.CSP_REFERENCE);
                            if (r.CSP_UNITPURCHASEPRICE !== null) {
                                $("#quomisccostunitpurchaseprice").val(r.CSP_UNITPURCHASEPRICE);
                                $("#misccostpurchasepricecurr").val(r.CSP_CURR);
                            }
                            if (r.CSP_UNITSALESPRICE !== null) {
                                $("#quomisccostunitsalesprice").val(r.CSP_UNITSALESPRICE);
                                $("#quomisccostsalespricecurr").val(r.CSP_CURR);
                            }
                            ModifyPricingSection();
                        }
                        return UpdateExch();
                    });
                }
            });

            $("#quotationsform input[calc-group=\"3\"]").on("blur",
                function () {
                    return ModifyPricingSection();
                });

            $("#misccostpurchasepricecurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                filter: [{ field: "CUR_CODE", value: "*", operator: "neq" }],
                callback: function () {
                    return UpdateExch();
                }
            });
            $("#quomisccostsalespricecurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                filter: [{ field: "CUR_CODE", value: "*", operator: "neq" }],
                callback: function () {
                    return UpdateExch();
                }
            });
            $("#quomisccostdate").on("dp.change",
                function (e) {
                    var preDate = moment(e.oldDate, constants.dateformat);
                    var newDate = moment(e.date, constants.dateformat);
                    if (preDate !== newDate) {
                        return UpdateExch();
                    }
                });

            $("#quomisccosttypeparent").on("change",
                function () {
                    var $this = $(this);
                    $("#quomisccostreference").val("");
                    if ($this.val() == "PART") {
                        $("#quomisccostservicecontainer").addClass("hidden");
                        $("#quomisccostpartcontainer").removeClass("hidden");
                        $("#quopartisnotfound").prop("checked", false).trigger("change");
                    } else if ($this.val() == "SERVICE") {
                        $("#quomisccostpartcontainer").addClass("hidden");
                        $("#quomisccostservicecontainer").removeClass("hidden");
                        $("#quoservicecodeisnotfound").prop("checked", false).trigger("change");
                    } else {
                        $("#quomisccostpartcontainer").addClass("hidden");
                        $("#quomisccostservicecontainer").addClass("hidden");
                        RestoreDefaultFieldStates();
                    }
                    LoadSubTypes($this.val());
                });
            $("#quopartisnotfound").on("change",
                function () {
                    var $this = $(this);
                    if ($this.is(":checked")) {
                        PartIsNotFound();
                    } else {
                        PartIsFound();
                    }
                });
            $("#quoservicecodeisnotfound").on("change",
                function () {
                    var $this = $(this);
                    if ($this.is(":checked")) {
                        ServiceCodeIsNotFound();
                    } else {
                        ServiceCodeIsFound();
                    }
                });
        }
        RgstrTabEvents();
    }
    var issueReturn = new function () {
        var self = this;
        var grdIssueReturn = null;
        var grdIssueReturnElm = $("#grdIssueReturn");

        var GetContractPartPrice = function (part) {
            var gridreq = {
                sort: [{ field: "CPP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetPartPriceForTask", value: selectedTask.TSK_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var itemSelect = function (row) {
            selectedissuereturn = grdIssueReturn.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var List = function () {
            var grdFilter = [{ field: "PTL_TASK", value: selectedTask.TSK_ID, operator: "eq", logic: "and" }];
            if (grdIssueReturn) {
                grdIssueReturn.ClearSelection();
                grdIssueReturn.RunFilter(grdFilter);
            } else {
                var grdcols = [
                    {
                        type: "number",
                        field: "PTL_TRANSACTION",
                        title: gridstrings.PartTransactionLines[lang].transaction,
                        width: 150
                    },
                    {
                        type: "number",
                        field: "PTL_LINE",
                        title: gridstrings.PartTransactionLines[lang].line,
                        width: 150
                    },
                    {
                        type: "number",
                        field: "PTL_ACTIVITY",
                        title: gridstrings.PartTransactionLines[lang].activity,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_PARTCODE",
                        title: gridstrings.PartTransactionLines[lang].partcode,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_PARTDESC",
                        title: gridstrings.PartTransactionLines[lang].partdesc,
                        width: 350
                    },
                    {
                        type: "string",
                        field: "PTL_PARTREFERENCE",
                        title: gridstrings.PartTransactionLines[lang].partreference,
                        width: 350
                    },
                    {
                        type: "qty",
                        field: "PTL_QTY",
                        title: gridstrings.PartTransactionLines[lang].quantity,
                        width: 150,
                        template: "<span>#= PTL_TYPE == 'RT' ? -1 * PTL_QTY : PTL_QTY #</span>"
                    },
                    {
                        type: "na",
                        field: "TYPEDESC",
                        title: gridstrings.PartTransactionLines[lang].typedesc,
                        template: "<div>#= gridstrings.PartTransactionLines[lang].types[PTL_TYPE] #</div>",
                        filterable: false,
                        sortable: false,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_WAREHOUSE",
                        title: gridstrings.PartTransactionLines[lang].warehouse,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "PTL_WAREHOUSEDESC",
                        title: gridstrings.PartTransactionLines[lang].warehousedesc,
                        width: 250
                    },
                    { type: "string", field: "PTL_BIN", title: gridstrings.PartTransactionLines[lang].bin, width: 150 },
                    {
                        type: "string",
                        field: "PTL_BINDESC",
                        title: gridstrings.PartTransactionLines[lang].bindesc,
                        width: 250
                    },
                    {
                        type: "date",
                        field: "PTL_TRANSACTIONDATE",
                        title: gridstrings.PartTransactionLines[lang].transactiondate,
                        width: 150
                    }
                ];

                var grdfields = {
                    PTL_TRANSACTION: { type: "number" },
                    PTL_LINE: { type: "number" },
                    PTL_ACTIVITY: { type: "number" },
                    PTL_QTY: { type: "number" },
                    PTL_TRANSACTIONDATE: { type: "date" }
                };

                if (!customer) {
                    grdfields.PTL_PRICE = { type: "number" };
                    grdcols.splice(6,
                        0,
                        {
                            type: "price",
                            field: "PTL_PRICE",
                            title: gridstrings.PartTransactionLines[lang].price,
                            width: 150
                        });
                }

                grdIssueReturn = new Grid({
                    keyfield: "PTL_ID",
                    columns: grdcols,
                    fields: grdfields,
                    datasource: "/Api/ApiPartTransactionLine/List",
                    selector: "#grdIssueReturn",
                    name: "grdIssueReturn",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "PTL_ID", dir: "asc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"IssueReturn.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#parts"))
                return $.Deferred().reject();

            var issuereturn = {
                Transaction: {
                    PTR_DESCRIPTION: selectedTask.TSK_SHORTDESC,
                    PTR_TYPE: $("#trxtype").val(),
                    PTR_ORGANIZATION: selectedTask.TSK_ORGANIZATION,
                    PTR_TRANSACTIONDATE: tms.Now(),
                    PTR_WAREHOUSE: $("#warehouse").val(),
                    PTR_STATUS: "N",
                    PTR_CREATED: tms.Now(),
                    PTR_CREATEDBY: user
                },
                TransactionLines: [
                    {
                        PTL_TRANSACTIONDATE: tms.Now(),
                        PTL_PART: $("#part").data("id"),
                        PTL_PARTREFERENCE: ($("#partreference").val() || null),
                        PTL_TYPE: $("#trxtype").val(),
                        PTL_TASK: selectedTask.TSK_ID,
                        PTL_ACTIVITY: selectedActivity.TSA_LINE,
                        PTL_WAREHOUSE: $("#warehouse").val(),
                        PTL_BIN: $("#bin").val(),
                        PTL_QTY: $("#reqqty").val(),
                        PTL_PRICE: $("#bin").data("avgprice"),
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
                    self.ResetUI();
                    self.SetWarehousePartCounts();
                    List();
                }
            });
        };
        this.ResetUI = function () {
            selectedissuereturn = null;
            tms.UnBlock("#partsform");
            tms.Reset("#parts");

            $("#activity").val("");
            $("#trxtype").val("");
            $("#warehouse").val("");
            $("#part").val("").data("id", null);
            $("#partdesc").val("");
            $("#partuom").val("");
            $("#partreference").val("");
            $("#bin").val("");
            $("#bin").data("avgprice", null);
            $("#binqty").val("");
            $("#reqqty").val("");

            if (pstat === "C") tms.Block("#partsform");
        };
        this.SetWarehousePartCounts = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "PTL_TASK", value: selectedTask.TSK_ID, operator: "eq", logic: "and" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiPartTransactionLine/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#issuereturncount").html(d.data);
                    if (d.data > 0)
                        $("#btnIssueReturn").removeClass("btn-primary").addClass("btn-success");
                    else
                        $("#btnIssueReturn").removeClass("btn-success").addClass("btn-primary");
                }
            });
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
        var RegisterTabEvents = function () {
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
                        {
                            type: "string",
                            field: "WAH_DESC",
                            title: gridstrings.warehouses[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                        { field: "WAH_ORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" }
                    ],
                    callback: function () {
                        $("#part").val("").data("id", null);
                        $("#partdesc").val("");
                        $("#partuom").val("");
                        $("#bin").val("");
                        $("#binqty").val("");
                    }
                });
            });
            $("#btnparts").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.partstock[lang].title,
                    modalinfo: applicationstrings[lang].partmodalinfo,
                    listurl: "/Api/ApiWarehouses/StockByWarehouse",
                    keyfield: "STK_PART",
                    codefield: "STK_PARTCODE",
                    textfield: "STK_PARTDESC",
                    returninput: "#part",
                    columns: [
                        {
                            type: "string",
                            field: "STK_PARTCODE",
                            title: gridstrings.partstock[lang].parcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "STK_PARTDESC",
                            title: gridstrings.partstock[lang].pardesc,
                            width: 300
                        },
                        {
                            type: "number",
                            field: "STK_WHQTY",
                            title: gridstrings.partstock[lang].parqty,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "STK_PARTUOM",
                            title: gridstrings.partstock[lang].paruom,
                            width: 100
                        }
                    ],
                    fields: {
                        STK_WHQTY: { type: "number" }
                    },
                    filter: [
                        { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                        { field: "STK_PARTORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "IsContractedTaskPart", value: selectedTask.TSK_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                                { field: "STK_PARTORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                                { field: "IsContractedTaskPart", value: selectedTask.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.parts[lang].allparts,
                            filter: [
                                { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                                { field: "STK_PARTORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(GetLevels()).done(function (d) {
                            var data = GenerateTreeData(d.data);
                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [
                                            {
                                                field: "PARTLEVEL.STKPART", value: selectedItem.id, operator: "func"
                                            }
                                        ];
                                        callback(filter);
                                    }
                                }
                            });
                        });
                    },
                    callback: function (d) {
                        tooltip.hide("#part");
                        $("#part").data("id", (d ? d.STK_PART : null));
                        $("#partdesc").val((d ? d.STK_PARTDESC : ""));
                        $("#partuom").val((d ? d.STK_PARTUOM : ""));
                        $("#bin").val("");
                        $("#binqty").val("");
                        return $.when(GetContractPartPrice(d.STK_PART)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#partreference").val(r.CPP_REFERENCE);
                            }
                        });
                    }
                });
            });
            $("#btnbin").click(function () {
                var trxtype = $("#trxtype").val();
                var partid = $("#part").data("id");
                var warehouse = $("#warehouse").val();
                if (!trxtype) {
                    msgs.error(applicationstrings[lang].trxtype);
                    return false;
                }
                if (!warehouse) {
                    msgs.error(applicationstrings[lang].selectawarehouse);
                    return false;
                }
                if (!partid) {
                    msgs.error(applicationstrings[lang].selectapart);
                    return false;
                }
                switch (trxtype) {
                    case "I":
                        gridModal.show({
                            modaltitle: gridstrings.bins[lang].title,
                            listurl: "/Api/ApiStock/List",
                            keyfield: "STK_BIN",
                            codefield: "STK_BIN",
                            textfield: "STK_BINDESC",
                            returninput: "#bin",
                            columns: [
                                { type: "string", field: "STK_BIN", title: gridstrings.bins[lang].code, width: 100 },
                                { type: "string", field: "STK_BINDESC", title: gridstrings.bins[lang].desc, width: 300 }
                            ],
                            filter: [
                                { field: "STK_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" },
                                { field: "STK_PART", value: $("#part").data("id"), operator: "eq" }
                            ],
                            callback: function (d) {
                                $("#binqty").val(d.STK_QTY);
                                $("#bin").data("avgprice", d.STK_AVGPRICE);
                            }
                        });
                        break;
                    case "RT":
                        gridModal.show({
                            modaltitle: gridstrings.bins[lang].title,
                            listurl: "/Api/ApiBins/List",
                            keyfield: "BIN_CODE",
                            codefield: "BIN_CODE",
                            textfield: "BIN_DESC",
                            returninput: "#bin",
                            columns: [
                                { type: "string", field: "BIN_CODE", title: gridstrings.bins[lang].code, width: 100 },
                                { type: "string", field: "BIN_DESC", title: gridstrings.bins[lang].desc, width: 300 }
                            ],
                            filter: [
                                { field: "BIN_WAREHOUSE", value: $("#warehouse").val(), operator: "eq" }
                            ],
                            callback: function (d) {
                                var f = {
                                    filter: {
                                        filters: [
                                            { field: "STK_WAREHOUSE", value: d.BIN_WAREHOUSE, operator: "eq" },
                                            { field: "STK_BIN", value: d.BIN_CODE, operator: "eq" },
                                            { field: "STK_PART", value: $("#part").data("id"), operator: "eq" }
                                        ]
                                    }
                                };
                                return $.when(tms.Ajax({
                                    url: "/Api/ApiStock/List",
                                    data: JSON.stringify(f)
                                })).done(function (d1) {
                                    var stockvalue = ((d1.data && d1.data.length > 0) ? d1.data[0] : null);
                                    $("#binqty").val(stockvalue ? stockvalue.STK_QTY : 0);
                                    $("#bin").data("avgprice", stockvalue ? stockvalue.STK_AVGPRICE : 0);

                                });
                            }
                        });
                        break;
                }
            });
            $("#iractivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function () { return selectedTask.TSK_ID; }, operator: "eq" }]
            });
            $("#warehouse").autocomp({
                listurl: "/Api/ApiWarehouses/List",
                geturl: "/Api/ApiWarehouses/Get",
                field: "WAH_CODE",
                textfield: "WAH_DESC",
                active: "WAH_ACTIVE",
                filter: [
                    { field: "WAH_ORG", func: function () { return [selectedTask.TSK_ORGANIZATION, "*"]; }, operator: "in" }
                ],
                callback: function () {
                    $("#part").val("").data("id", null);
                    $("#partdesc").val("");
                    $("#partuom").val("");
                    $("#bin").val("");
                    $("#binqty").val("");
                }
            });
            $("#trxtype").on("change", function () {
                $("#bin").val("");
                $("#binqty").val("");
                tooltip.hide("#bin");
            });
            $("#btnSaveWarehouseParts").click(self.Save);
            $("#btnAddWarehouseParts").click(self.ResetUI);
        };
        this.showIssueReturnModel = function () {
            List();
            $("#modalIssueReturns").modal("show");

        };
        RegisterTabEvents();
    };
    var quototask = new function () {
        var grdquototask = null;
        var grdquototaskElm = $("#grdquototask");
        var checkedlines = null;
        var self = this;

        var gridChange = function (e) {
            //itemSelect(e.sender.select());
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdquototask input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var Save = function () {
            var listofchecked = [];
            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);
                var quanid = "#quantity-" + line.data("id");

                if ($(quanid).val() <= 0 || !$(quanid).val()) {
                    msgs.error(applicationstrings[lang].countmustbegreaterthenzero2);
                    return $.Deferred().reject();
                };

                var o = {
                    Type: line.data("type"),
                    LineId: line.data("id"),
                    Quantity: $(quanid).val(),
                    Line: selectedActivity.TSA_LINE,
                    User: user
                }
                listofchecked.push(o);
            }

            var p = {
                Task : selectedActivity.TSA_TASK,
                Activity : selectedActivity.TSA_ID,
                Lines : listofchecked
            }

            return tms.Ajax({
                url: "/Api/ApiQuotations/QuotationToActivity",
                data: JSON.stringify(p),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ListQuotations();
                }
            });
        };
        var gridDataBound = function () {
            var checkinputs = $("#grdquototask input[data-name=\"chkLine\"]:not(:disabled)");
            tms.NumericInput();
            grdquototaskElm.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdquototaskElm.find("#btnSaveLines").off("click").on("click", function () {
                checkedlines = grdquototaskElm.find("input[data-name=\"chkLine\"]:checked");
                if (checkedlines.length === 0) {
                    msgs.error(applicationstrings[lang].invlinenotselected);
                    return $.Deferred().reject();
                }
                Save();
            });
        };
        this.ListQuotations = function () {
            var grdFilter = [
                { field: "QLN_QUOTATION", value: selectedquotation.QUO_ID, operator: "eq", logic: "and" },
                { field: "QLN_TYPE", value: "PART", operator: "neq", logic: "and" },
                { field: "QLN_COPY", value: "-", operator: "eq", logic: "and" }

            ];
            var columns = [
                {
                    type: "na",
                    title: "#",
                    field: "chkLine",
                    template:
                        "<div style=\"text-align:center;\">" +
                            "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" data-quotation=\"#= QLN_QUOTATION #\"  data-id=\"#= QLN_LINEID #\" data-type=\"#= QLN_TYPE #\" /><label></label>" +
                            "</div>",
                    filterable: false,
                    sortable: false,
                    width: 35
                },
                { type: "number", field: "QLN_QUOTATION", title: gridstrings.quocopy[lang].quo, width: 100 },
                {
                    type: "string",
                    field: "QLN_SUBTYPE",
                    title: gridstrings.quocopy[lang].type,
                    width: 100
                },
                { type: "string", field: "QLN_DESCRIPTION", title: gridstrings.quocopy[lang].desc, width: 250 },
                { type: "string", field: "QLN_UOM", title: gridstrings.quocopy[lang].uom, width: 100 },
                {
                    type: "na",
                    field: "txtline2",
                    template:
                        "<div style=\"text-align:center;\">" +
                            "<input style=\"width:70px;\" value=\"#= QLN_QUANTITY #\" type=\"text\" calc-group=\"1\" min=\"0\" ctrltype=\"numeric\" allowfloat=\"true\" class=\"form-control\" id=\"quantity-#= QLN_LINEID #\" />" +
                            "</div>",
                    title: gridstrings.quocopy[lang].quan,
                    filterable: false,
                    sortable: false,
                    width: 100
                },
                { type: "price", field: "QLN_UNITPURCHASEPRICE", title: gridstrings.quocopy[lang].unitprice, width: 100 },
                { type: "string", field: "QLN_PURCHASECURR", title: gridstrings.quocopy[lang].curr, width: 100 },
                { type: "price", field: "QLN_PURCHASEEXCH", title: gridstrings.quocopy[lang].exch, width: 100 },
                { type: "price", field: "QLN_UNITSALESPRICE", title: gridstrings.quocopy[lang].salesprice, width: 100 },
                { type: "string", field: "QLN_CURR", title: gridstrings.quocopy[lang].curr, width: 100 },
                { type: "price", field: "QLN_EXCH", title: gridstrings.quocopy[lang].exch, width: 100 }
            ];
            var fields = {
                QLN_QUANTITY: { type: "number" },
                QLN_UNITSALESPRICE: { type: "number" },
                QLN_PURCHASEEXCH: { type: "number" },
                QLN_UNITPURCHASEPRICE: { type: "number" },
                QLN_EXCH: { type: "number" },
                QLN_QUOTATION: { type: "number" }
            };

            if (supplier) {
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QLN_UNITSALESPRICE"]) == -1); });
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QLN_EXCH"]) == -1); });
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QLN_CURR"]) == -1); });
                delete fields.QLN_UNITSALESPRICE;
                delete fields.QLN_EXCH;
            }

            if (grdquototask) {
                grdquototask.ClearSelection();
                grdquototask.RunFilter(grdFilter);
            } else {
                grdquototask = new Grid({
                    keyfield: "QLN_NO",
                    columns: columns,
                    fields: fields,
                    datasource: "/Api/ApiQuotations/ListLinesView",
                    selector: "#grdquototask",
                    name: "grdquototask",
                    height: 500,
                    filter: grdFilter,
                    sort: [{ field: "QLN_NO", dir: "desc" }],
                    databound: gridDataBound,
                    change: gridChange,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>",
                            "<button class=\"btn btn-default btn-sm\" id=\"btnSaveLines\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].save#</button>"
                        ]
                    }
                });
            }
        };
        this.CheckQuotation = function () {
            var grdFilter = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "QUO_TASK", value: selectedActivity.TSA_TASK, operator: "eq", logic: "and" },
                        { field: "QUO_ACTIVITY", value: selectedActivity.TSA_LINE, operator: "eq", logic: "and" },
                        { field: "QUO_STATUS", value: "K", operator: "eq", logic: "and" }
                    ]
                }
            };

            tms.Ajax({
                url: "/Api/ApiQuotations/List",
                data: JSON.stringify(grdFilter),
                fn: function (d) {
                    if (d.data.length === 1) {
                        selectedquotation = d.data[0];
                    } else {
                        //HATA MESAJI, teklif bulunamadı veya hatalı teklif.
                    }
                }
            });
        };
        var RegisterUIEvents = function () {

        };
        RegisterUIEvents();
    };
    var tree = new function () {
        var self = this;

        this.ChildBuilder = function (parent, list) {

            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                if (!parent.subs) {
                    parent.subs = [];
                }
                parent.subs.push(child);
                self.ChildBuilder(child, list);
            }
        };
        this.GenerateTreeData = function (d) {
            var data = [];
            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    title: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    subs: []
                };
                self.ChildBuilder(parent, d);
                data.push(parent);
            }
            return data;
        };
        this.GetLevels = function (entity) {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: entity, operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq)
            });
        };
    };
    var bhrs = new function () {
        var self = this;
        var $grdBooHours = $("#grdBooHours");
        var grdBooHours = null;
        var selectedbookedhour = null;

        this.SetBookedHoursCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "BOO_TASK", value: selectedTask.TSK_ID, operator: "eq", logic: "and" },
                        { field: "BOO_LINE", value: selectedActivity.TSA_LINE, operator: "eq", logic: "and" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiBookedHours/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#bookedhourscnt").html(d.data);
                    if (d.data > 0)
                        $("#btnBookedHours").removeClass("btn-primary").addClass("btn-success");
                    else
                        $("#btnBookedHours").removeClass("btn-success").addClass("btn-primary");
                }
            });
        };
        var BookedHoursSummary = function () {
            return tms.Ajax({
                url: "/Api/ApiBookedHours/BookedHoursSummary",
                data: JSON.stringify(selectedTask.TSK_ID),
                quietly: true,
                fn: function (d) {
                    if (d.data.length === 0) {
                        $(".bookedhourssummaryblck").hide();
                        return;
                    }

                    var strBookedHours = "<div class=\"row custom\">";
                    strBookedHours += "<div class=\"col-md-6\"></div>";
                    strBookedHours += "<div class=\"col-md-6\">" + applicationstrings[lang].ap + "</div>";
                    strBookedHours += "</div>";

                    var boousers = [];
                    $.each(d.data,
                        function (i, el) {
                            if ($.inArray(el.BOO_USER, boousers) === -1)
                                boousers.push(el.BOO_USER);
                        });
                    for (var i = 0; i < boousers.length; i++) {
                        var actualhrs = $.grep(d.data,
                            function (el) {
                                return (el.BOO_USER === boousers[i] && el.BOO_TYPE === "A");
                            });
                        var plannedhrs = $.grep(d.data,
                            function (el) {
                                return (el.BOO_USER === boousers[i] && el.BOO_TYPE === "P");
                            });

                        var actualhrsstr = "0";
                        var plannedhrsstr = "0";
                        if (actualhrs.length > 0)
                            actualhrsstr = moment.duration(Math.round(actualhrs[0].BOO_HOURS * 60), "minutes")
                                .format("h [sa] m [dk]");

                        if (plannedhrs.length > 0)
                            plannedhrsstr = moment.duration(Math.round(plannedhrs[0].BOO_HOURS * 60), "minutes")
                                .format("h [sa] m [dk]");

                        strBookedHours += "<div class=\"row custom\">";
                        strBookedHours += "<div class=\"col-md-6\">";
                        strBookedHours += boousers[i];
                        strBookedHours += "</div>";
                        strBookedHours += "<div class=\"col-md-6\">";
                        strBookedHours += "<span class=\"actual badge badge-info\">" + actualhrsstr + "</span> ";
                        strBookedHours += "<span class=\"planned badge badge-success\">" +
                            plannedhrsstr +
                            "</span>";
                        strBookedHours += "</div>";
                        strBookedHours += "</div>";
                    }

                    $("#bookedhourssummaryblck *").remove();
                    $("#bookedhourssummaryblck").append(strBookedHours);
                }
            });
        };
        var FillUserInterface = function () {
            tms.UnBlock("#bookedhoursform");
            tms.BeforeFill("#bookedhours");

            $("#activity").val(selectedbookedhour.BOO_LINE);
            $("#boouser").val(selectedbookedhour.BOO_USER);
            $("#bookdate").val(moment(selectedbookedhour.BOO_DATE).format(constants.dateformat));
            $("#bookstart").val(moment().startOf("day").seconds(selectedbookedhour.BOO_START)
                .format(constants.timeformat));
            $("#bookend").val(moment().startOf("day").seconds(selectedbookedhour.BOO_END)
                .format(constants.timeformat));
            $("#calchours").val(selectedbookedhour.BOO_CALCHOURS);
            $("input[name=rtype][value=" + selectedbookedhour.BOO_TYPE + "]").prop("checked", true);
            $("#overtimetype").val(selectedbookedhour.BOO_OTYPE);

            tooltip.show("#activity", selectedbookedhour.BOO_LINEDESC);
            tooltip.show("#boouser", selectedbookedhour.BOO_USERDESC);

            if (selectedTask.TSK_STATUSP === "C") tms.Block("#bookedhoursform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiBookedHours/Get",
                data: JSON.stringify(selectedbookedhour.BOO_ID),
                fn: function (d) {
                    selectedbookedhour = d.data;
                    FillUserInterface();
                }
            });
        };
        var gridDataBound = function () {
            BookedHoursSummary();
        };
        var itemSelect = function (row) {
            selectedbookedhour = grdBooHours.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.ResetUI = function () {
            selectedbookedhour = null;
            tms.UnBlock("#bookedhoursform");
            tms.Reset("#bookedhours");

            $("input[name=rtype][value=A]").prop("checked", true);
            $("#activity").val("");
            $("#boouser").val("");
            $("#bookdate").val("");
            $("#bookstart").val("");
            $("#bookend").val("");
            $("#calchours").val("");
            $("#overtimetype").val("N");

            tooltip.hide("#activity");
            tooltip.hide("#boouser");

            if (selectedTask.TSK_STATUSP === "C") tms.Block("#bookedhoursform");
        };
        var List = function () {
            var grdFilter = [
                { field: "BOO_TASK", value: selectedTask.TSK_ID, operator: "eq", logic: "and" },
                { field: "BOO_LINE", value: selectedActivity.TSA_LINE, operator: "eq", logic: "and" }
            ];
            if (grdBooHours) {
                grdBooHours.ClearSelection();
                grdBooHours.RunFilter(grdFilter);
            } else {
                grdBooHours = new Grid({
                    keyfield: "BOO_ID",
                    columns: [
                        {
                            type: "string",
                            field: "BOO_USERDESC",
                            title: gridstrings.bookedhours[lang].user,
                            width: 250
                        },
                        { type: "date", field: "BOO_DATE", title: gridstrings.bookedhours[lang].date, width: 250 },
                        {
                            type: "time",
                            field: "BOO_START",
                            title: gridstrings.bookedhours[lang].start,
                            width: 150,
                            template:
                                "#= BOO_START == null ? '' : moment().startOf('day').seconds(BOO_START).format(constants.timeformat) #"
                        },
                        {
                            type: "time",
                            field: "BOO_END",
                            title: gridstrings.bookedhours[lang].end,
                            width: 150,
                            template:
                                "#= BOO_END == null ? '' : moment().startOf('day').seconds(BOO_END).format(constants.timeformat) #"
                        },
                        {
                            type: "string",
                            field: "BOO_CREATEDBY",
                            title: gridstrings.bookedhours[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "BOO_CREATED",
                            title: gridstrings.bookedhours[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BOO_UPDATEDBY",
                            title: gridstrings.bookedhours[lang].updatedby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "BOO_UPDATED",
                            title: gridstrings.bookedhours[lang].updated,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        BOO_LINE: { type: "number" },
                        BOO_DATE: { type: "date" },
                        BOO_START: { type: "time" },
                        BOO_END: { type: "time" },
                        BOO_CREATED: { type: "date" },
                        BOO_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiBookedHours/List",
                    selector: "#grdBooHours",
                    name: "grdBooHours",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "BOO_ID", dir: "desc" }],
                    databound: gridDataBound,
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"BookedHours.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        var AddCheck = function () {
            var boodate = moment($("#bookdate").val(), constants.dateformat);
            var startsec = moment.duration($("#bookstart").val(), constants.timeformat).asSeconds();
            var bootime = boodate.clone().add(startsec, "s");

            if (boodate > tms.Now()) {
                msgs.error(applicationstrings[lang].boodate01);
                return false;
            }
            if (bootime < moment(selectedTask.TSK_REQUESTED)) {
                msgs.error(applicationstrings[lang].boodate02);
                return false;
            }
            return true;
        };
        this.Save = function () {
            if (!tms.Check("#bookedhours") || !AddCheck())
                return $.Deferred().reject();

            var startsec = moment.duration($("#bookstart").val(), constants.timeformat).asSeconds();
            var endsec = moment.duration($("#bookend").val(), constants.timeformat).asSeconds();
            var calchours = Math.round(((endsec - startsec) / 3600) * 100) / 100;

            if (endsec < startsec) {
                msgs.error(applicationstrings[lang].startenderr);
                return $.Deferred().reject();
            }

            var boohr = {
                BOO_ID: selectedbookedhour ? selectedbookedhour.BOO_ID : 0,
                BOO_DATE: moment.utc($("#bookdate").val(), constants.dateformat),
                BOO_START: startsec,
                BOO_END: endsec,
                BOO_CALCHOURS: calchours,
                BOO_OTYPE: "N",
                BOO_TASK: selectedTask.TSK_ID,
                BOO_LINE: selectedActivity.TSA_LINE,
                BOO_TYPE: "A",
                BOO_AUTO: "-",
                BOO_TRADE: selectedbookedhour ? selectedbookedhour.BOO_TRADE : "*",
                BOO_USER: $("#boouser").val(),
                BOO_CREATED: selectedbookedhour != null ? selectedbookedhour.BOO_CREATED : tms.Now(),
                BOO_CREATEDBY: selectedbookedhour != null ? selectedbookedhour.BOO_CREATEDBY : user,
                BOO_UPDATED: selectedbookedhour != null ? tms.Now() : null,
                BOO_UPDATEDBY: selectedbookedhour != null ? user : null,
                BOO_RECORDVERSION: selectedbookedhour != null ? selectedbookedhour.BOO_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiBookedHours/Save",
                data: JSON.stringify(boohr),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.SetBookedHoursCount();
                    List();
                }
            });
        };
        this.Delete = function () {
            if (selectedbookedhour) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiBookedHours/DelRec",
                            data: JSON.stringify(selectedbookedhour.BOO_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.SetBookedHoursCount();
                                List();
                            }
                        });
                    });
            }
        };
        var CalcBookedHours = function () {
            var startsec = moment.duration($("#bookstart").val(), constants.timeformat).asSeconds();
            var endsec = moment.duration($("#bookend").val(), constants.timeformat).asSeconds();
            var calchours = Math.round(((endsec - startsec) / 3600) * 100) / 100;
            $("#calchours").val(calchours);
        };
        var RegisterUIEvents = function () {
            $("#btnSaveBookedHours").click(self.Save);
            $("#btnAddBookedHours").click(self.ResetUI);
            $("#btnDeleteBookedHours").click(self.Delete);
            $("#btnboouser").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#boouser",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", selectedTask.TSK_ORGANIZATION], operator: "in" },
                        { field: "USR_TYPE", value: ["CUSTOMER"], operator: "nin" }
                    ]
                });
            });
            $("#bookstart,#bookend").on("dp.change",
                function () {
                    CalcBookedHours();
                });
            $("#boouser").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_ORG", func: function () { return [selectedTask.TSK_ORGANIZATION, "*"]; }, operator: "in" },
                    { field: "USR_TYPE", value: ["CUSTOMER"], operator: "nin" }
                ]
            });
        };
        this.showModal = function () {
            self.ResetUI();
            List();
            $("#modalbookedhours").modal("show");
        };
        RegisterUIEvents();
    };
    var asr = new function () {
        var grdActivityServiceCodes = null;
        var grdActivityServiceCodesElm = $("#grdActivityServiceCodes");
        var selectedServiceCode = null;
        var deleteActivityServiceCode;
        var self = this;

        var ChildBuilder = function (parent, list) {

            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            childs = childs.sortBy(function (o) { return o.TLV_CODE; });
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
            parentless = parentless.sortBy(function (o) { return o.TLV_CODE; });
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
                        { field: "TLV_TYPEENTITY", value: "SERVICECODE", operator: "eq" }
                    ]
                },
                sort: [{ field: "TLV_CODE", dir: "desc" }]
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq)
            });
        };

        var GetContractServicePrice = function (servicecode) {
            var gridreq = {
                sort: [{ field: "CSP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetServicePriceForTask", value: selectedTask.TSK_ID, value2: servicecode, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractServicePrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        this.SetServiceCodeCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "ASR_ACTIVITY", value: selectedActivity.TSA_ID, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityServiceCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#actservicecodecnt").html(d.data);
                    if (d.data > 0)
                        $("#btnActivityServiceCode").removeClass("btn-primary").addClass("btn-success");
                    else
                        $("#btnActivityServiceCode").removeClass("btn-success").addClass("btn-primary");
                }
            });
        }
        var gridDatabound = function () {
            grdActivityServiceCodesElm.find(".lu-remove").unbind("click").click(function () {
                deleteActivityServiceCode($(this).closest("tr"));
            });
        };//
        var itemSelect = function (row) {
            selectedServiceCode = grdActivityServiceCodes.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var resetModalInputFields = function () {
            $("#servicecode").val("");
            $("#serviceqty").val("");
            $("#serviceqty-uom").html("");
            tooltip.hide("#servicecode");
        }
        var listActivityServiceCodes = function () {
            grdActivityServiceCodes = new Grid({
                keyfield: "ASR_ID",
                columns: [
                    {
                        type: "other",
                        field: "other",
                        title: "#",
                        template:
                            "<button class=\"btn btn-xs btn-danger lu-remove\" type=\"button\" data-id=\"#=ASR_ID#\"><i class=\"fa fa-trash fa-fw\"></i></button>",
                        filterable: false,
                        sortable: false,
                        width: 40
                    },
                    { type: "number", field: "ASR_SERVICECODE", title: gridstrings.servicecodes[lang].code, width: 170 },
                    { type: "string", field: "ASR_SERVICECODEDESC", title: gridstrings.servicecodes[lang].description, width: 300 },
                    { type: "string", field: "ASR_SERVICECODEUOM", title: gridstrings.servicecodes[lang].uom, width: 100 },
                    { type: "qty", field: "ASR_QUANTITY", title: gridstrings.servicecodes[lang].qty, width: 100 },
                    { type: "price", field: "ASR_UNITPRICE", title: gridstrings.servicecodes[lang].price, width: 200 },
                    { type: "datetime", field: "ASR_CREATED", title: gridstrings.servicecodes[lang].created, width: 200 },
                    { type: "string", field: "ASR_CREATEDBY", title: gridstrings.servicecodes[lang].createdby, width: 200 }
                ],
                fields:
                {
                    ASR_SERVICECODE: { type: "number" },
                    ASR_UNITPRICE: { type: "number" },
                    ASR_QUANTITY: { type: "number" },
                    ASR_CREATED: { type: "date" }
                },
                datasource: "/Api/ApiTaskActivityServiceCodes/List",
                selector: "#grdActivityServiceCodes",
                name: "grdActivityServiceCodes",
                height: 370,
                primarycodefield: "ASR_SERVICECODE",
                primarytextfield: "ASR_SERVICECODEDESC",
                filter: [
                    { field: "ASR_ACTIVITY", value: selectedActivity.TSA_ID, operator: "eq", logic: "and" }
                ],
                sort: [{ field: "ASR_ID", dir: "desc" }],
                databound: gridDatabound,
                change: gridChange
            });
        };
        deleteActivityServiceCode = function (row) {
            selectedServiceCode = grdActivityServiceCodes.GetRowDataItem(row);
            if (selectedServiceCode) {
                $("#modalTaskActivityServiceCodes").modal("hide");
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivityServiceCodes/Delete",
                            data: JSON.stringify(selectedServiceCode.ASR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                selectedServiceCode = null;
                                self.SetServiceCodeCount();
                                spa.PricingList();
                                listActivityServiceCodes();
                                $("#modalTaskActivityServiceCodes").modal("show");
                            }
                        });
                    }).one("click",
                    "#cancel",
                    function () {
                        $("#modalTaskActivityServiceCodes").modal("show");
                    });
            }
        };
        this.showActivityServiceCodesModal = function () {
            listActivityServiceCodes();
            $("#modalTaskActivityServiceCodes").modal("show");
        };
        var addActivityServiceCode = function () {
            if (!tms.Check("#modalTaskActivityServiceCodes"))
                return $.Deferred.resolve();

            var o = {
                ASR_ID: 0,
                ASR_ACTIVITY: selectedActivity.TSA_ID,
                ASR_SERVICECODE: $("#servicecode").val(),
                ASR_QUANTITY: $("#serviceqty").val(),
                ASR_CREATED: selectedServiceCode != null ? selectedServiceCode.ASR_CREATED : tms.Now(),
                ASR_CREATEDBY: selectedServiceCode != null ? selectedServiceCode.ASR_CREATEDBY : user,
                ASR_UPDATED: selectedServiceCode != null ? tms.Now() : null,
                ASR_UPDATEDBY: selectedServiceCode != null ? user : null,
                ASR_RECORDVERSION: selectedServiceCode != null ? selectedServiceCode.ASR_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityServiceCodes/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    selectedServiceCode = null;
                    resetModalInputFields();
                    msgs.success(d.data);
                    spa.PricingList();

                    self.SetServiceCodeCount();
                    listActivityServiceCodes();
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnServiceCode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.servicecodes[lang].title,
                    modalinfo: applicationstrings[lang].servicecodesmodalinfo,
                    listurl: "/Api/ApiServiceCodes/List",
                    keyfield: "SRV_CODE",
                    codefield: "SRV_CODE",
                    textfield: "SRV_DESCRIPTIONF",
                    returninput: "#servicecode",
                    columns: [
                        {
                            type: "number",
                            field: "SRV_CODE",
                            title: gridstrings.servicecodes[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "SRV_DESCRIPTIONF",
                            title: gridstrings.servicecodes[lang].description,
                            width: 400
                        },
                        {
                            type: "string",
                            field: "SRV_TASKTYPEDESC",
                            title: gridstrings.servicecodes[lang].tasktypedescription,
                            width: 400
                        }
                    ],
                    fields: {
                        SRV_CODE: { type: "number" }
                    },
                    filter: [
                        { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                        { field: "SRV_ORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "IsContractedTaskServiceCode", value: selectedTask.TSK_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.servicecodes[lang].contractedservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedTaskServiceCode", value: selectedTask.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.servicecodes[lang].allservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(GetLevels()).done(function (d) {
                            var data = GenerateTreeData(d.data);
                            var levelTree = $(id).comboTree({
                                source: data,
                                isMultiple: false,
                                singleItemClick: function (selectedItem) {
                                    if (callback && typeof (callback) == "function") {
                                        var filter = [{ field: "SERVICECODELEVEL", value: selectedItem.id, operator: "func" }];
                                        callback(filter);
                                    }
                                }
                            });
                        });
                    },
                    callback: function (data) {
                        $("#serviceqty-uom").html(data ? data.SRV_UOM : "");
                    }
                });
            });
            $("#servicecode").autocomp({
                listurl: "/Api/ApiServiceCodes/List",
                geturl: "/Api/ApiServiceCodes/Get",
                field: "SRV_CODE",
                textfield: "SRV_DESCRIPTIONF",
                active: "SRV_ACTIVE",
                termisnumeric: true,
                filter: [{ field: "SRV_ORG", func: function () { return selectedTask.TSK_ORGANIZATION; }, includeall: true }],
                callback: function (data) {
                    $("#serviceqty-uom").html(data ? data.SRV_UOM : "");
                }
            });
            $("#btnservicecurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#servicecurrency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function () {

                    }
                });
            });
            $("#servicecurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                ],
                callback: function () {
                }
            });
            $("#btnTaskActivityServiceCodesSave").click(addActivityServiceCode);
        };
        RegisterUIEvents();
    };
    var aeq = new function () {
        var grdActivityEquipments = null;
        var grdActivityEquipmentsElm = $("#grdActivityEquipments");
        var statusctrl = "barcode";
        var selectedActivityEquipment = null;
        var self = this;
        var maintenanceequipmentdiv;
        var alreadysavedequipment = [];
        var alreadysavedequipment = [];

        this.SetEquipmentCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "TAE_TSAID", value: selectedActivity.TSA_ID, operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#actequipmentcnt").html(d.data);
                    if (d.data > 0)
                        $("#btnActivityEquipmentMaintenance").removeClass("btn-primary").addClass("btn-success");
                    else
                        $("#btnActivityEquipmentMaintenance").removeClass("btn-success").addClass("btn-primary");

                }
            });
        }
        var gridDatabound = function () {
            grdActivityEquipmentsElm.find(".lu-remove").unbind("click").click(function () {
                deleteActEqpLine($(this).closest("tr"));
            });
        };
        var itemSelect = function (row) {
            selectedActivityEquipment = grdActivityEquipments.GetRowDataItem(row);
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var listActivityEquipments = function () {
            grdActivityEquipments = new Grid({
                keyfield: "TAE_ID",
                columns: [
                    {
                        type: "other",
                        field: "other",
                        title: "#",
                        template:
                            "<button class=\"btn btn-xs btn-danger lu-remove\" type=\"button\" data-id=\"#=TAE_ID#\"><i class=\"fa fa-trash fa-fw\"></i></button>",
                        filterable: false,
                        sortable: false,
                        width: 40
                    },
                    { type: "string", field: "TAE_EQPTYPE", title: gridstrings.equipments[lang].eqptype, width: 200 },
                    { type: "number", field: "TAE_QUANTITY", title: gridstrings.stock[lang].qty, width: 100 },
                    { type: "price", field: "TAE_UNITPRICE", title: gridstrings.equipments[lang].price, width: 200 },
                    { type: "stribf", field: "TAE_CURRENCY", title: gridstrings.pricings[lang].currency, width: 200 },
                    { type: "string", field: "TAE_EQPCODE", title: gridstrings.equipments[lang].eqpcode, width: 200 },
                    { type: "string", field: "TAE_EQPDESC", title: gridstrings.equipments[lang].eqpdesc, width: 200 }
                ],
                fields: {
                    TAE_QUANTITY: { type: "number" },
                    TAE_UNITPRICE: { type: "number" }
                },
                datasource: "/Api/ApiTaskActivityEquipments/List",
                selector: "#grdActivityEquipments",
                name: "grdActivityEquipments",
                height: 370,
                primarycodefield: "TAE_EQPID",
                primarytextfield: "TAE_EQPDESC",
                filter: [
                    { field: "TAE_TSAID", value: selectedActivity.TSA_ID, operator: "eq", logic: "and" }
                ],
                sort: [{ field: "TAE_ID", dir: "asc" }],
                databound: gridDatabound,
                change: gridChange
            });
        };
        var GetAlreadyInEquipments = function () {
            alreadysavedequipment = [];
            var gridreq = {
                filter: {
                    filters: [
                        { field: "TAE_TSAID", value: selectedActivity.TSA_ID, operator: "eq", logic: "and" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    if (d.data) {
                        $.each(d.data, function (i) {
                            if (d.data[i].TAE_EQPID)
                                alreadysavedequipment.push(d.data[i].TAE_EQPID);
                        });
                    }
                }
            });
        };
        var LoadEquipments = function () {
            maintenanceequipmentdiv.find("*").remove();
            var gridreq = {
                screen: "M_EQUIPMENTS",
                groupedFilters: [
                    {
                        filters: [
                            { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                            { field: "EQP_BRANCH", value: selectedTask.TSK_BRANCH, operator: "eq" },
                            { field: "EQP_ORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                            { field: "EQP_ID", value: alreadysavedequipment, operator: "nin" }
                        ],
                        logic: "and"
                    }
                ],
                loadall: true
            };

            if ($("#filterCheckBoxes").val()) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "EQP_TYPEDESC", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" },
                        { field: "EQP_CODE", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" },
                        { field: "EQP_BRAND", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" },
                        { field: "EQP_MODEL", value: $("#filterCheckBoxes").val(), operator: "contains", logic: "or" }
                    ],
                    logic: "or"
                });
            }

            return tms.Ajax({
                url: "/Api/ApiEquipments/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    if (d.data) {
                        var strEqpList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strEqpList += "<div data-screen=\"" + d.data[i].EQP_CODE + "\" class=\"row custom\">";
                            strEqpList += "<div class=\"col-md-12\">";
                            strEqpList += " <div class=\"checkbox checkbox-primary\">";
                            strEqpList += "<input name=\"checkequipments\" data-type=\"" + d.data[i].EQP_TYPE + "\" class=\"styled\" type=\"checkbox\" id=\"" + d.data[i].EQP_ID + "\" value=\"" + d.data[i].EQP_CODE + "\">";
                            strEqpList += "<label for=\"" + d.data[i].EQP_CODE + "\">";
                            strEqpList += "<strong>" + d.data[i].EQP_CODE + "</strong>" + " - " + d.data[i].EQP_TYPEDESC + " - " + d.data[i].EQP_BRAND + " - " + d.data[i].EQP_MODEL + " - " + d.data[i].EQP_ZONE;
                            strEqpList += "</label>";
                            strEqpList += "</div>";
                            strEqpList += "</div>";
                            strEqpList += "</div>";
                        }
                        maintenanceequipmentdiv.append(strEqpList);
                        maintenanceequipmentdiv.find("input[type=\"checkbox\"]").on("change", function () {
                            $(this).blur();
                        });
                    }
                }
            });
        };
        var deleteActEqpLine = function (row) {
            selectedActivityEquipment = grdActivityEquipments.GetRowDataItem(row);
            if (selectedActivityEquipment) {
                $("#modalTaskActivityEquipments").modal("hide");
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTaskActivityEquipments/Delete",
                            data: JSON.stringify(selectedActivityEquipment.TAE_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                selectedActivityEquipment = null;
                                self.SetEquipmentCount();
                                listActivityEquipments();
                                spa.PricingList();
                                $.when(GetAlreadyInEquipments()).done(function () {
                                    return LoadEquipments();
                                });
                                $("#modalTaskActivityEquipments").modal("show");
                            }
                        });
                    }).one("click",
                    "#cancel",
                    function () {
                        $("#modalTaskActivityEquipments").modal("show");
                    });
            }
        };
        this.showActivityEquipmentMaintenanceModal = function () {
            listActivityEquipments();
            $.when(GetAlreadyInEquipments()).done(function () {
                return LoadEquipments();
            });
            $("#modalTaskActivityEquipments").modal("show");
        };
        var EvaluateCurrentBarcode = function () {
            statusctrl = $("#isbarcode").val();

            if (statusctrl === "barcode") {
                $(".activityequipment").removeClass("hidden");
                $(".activityequipmenttype").addClass("hidden");
                $("#taskactivityequipmentquan").removeAttr("required").removeClass("required");
                $("#taskactivityequipmenttype").removeAttr("required").removeClass("required");
            } else {
                $(".activityequipment").addClass("hidden");
                $(".activityequipmenttype").removeClass("hidden");
                $("#taskactivityequipmentquan").attr("required", "").addClass("required");
                $("#taskactivityequipmenttype").attr("required", "").addClass("required");
            }
        };
        var resetModalInputFields = function () {
            $("#taskactivityequipmenttype").val("");
            $("#taskactivityequipmentquan").val("");
            tooltip.hide("#taskactivityequipmenttype");
            EvaluateCurrentBarcode();
        }
        var AddCheckedOnes = function () {
            var equipments = maintenanceequipmentdiv.find("div.row");
            var o = [];
            if (equipments.length < 0) {
                return $.Deferred().reject();
            }

            $('input[name="checkequipments"]:checked').each(function () {
                var singleEquipment = {
                    TAE_ID: 0,
                    TAE_TSAID: selectedActivity.TSA_ID,
                    TAE_EQPID: this.id,
                    TAE_EQPTYPE: $(this).data("type"),
                    TAE_QUANTITY: 1,
                    TAE_EQPTYPEENTITY: "EQUIPMENT",
                    TAE_CREATED: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATED : tms.Now(),
                    TAE_CREATEDBY: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATEDBY : user,
                    TAE_UPDATED: selectedActivityEquipment != null ? tms.Now() : null,
                    TAE_UPDATEDBY: selectedActivityEquipment != null ? user : null,
                    TAE_RECORDVERSION: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_RECORDVERSION : 0
                };
                o.push(singleEquipment);
            });

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/SaveList",
                data: JSON.stringify(o),
                fn: function (d) {
                    spa.PricingList();
                    return $.when(GetAlreadyInEquipments()).done(function () {
                        return $.when(listActivityEquipments()).done(function () {
                            return $.when(self.SetEquipmentCount()).done(function () {
                                return LoadEquipments();
                            });
                        });
                    });
                }
            });
        };
        var addActEqpLine = function () {
            if (!tms.Check("#modalTaskActivityEquipments"))
                return $.Deferred.resolve();

            var o = {
                TAE_ID: 0,
                TAE_TSAID: selectedActivity.TSA_ID,
                TAE_EQPID: null,
                TAE_EQPTYPE: $("#taskactivityequipmenttype").val(),
                TAE_QUANTITY: $("#taskactivityequipmentquan").val(),
                TAE_EQPTYPEENTITY: "EQUIPMENT",
                TAE_CREATED: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATED : tms.Now(),
                TAE_CREATEDBY: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_CREATEDBY : user,
                TAE_UPDATED: selectedActivityEquipment != null ? tms.Now() : null,
                TAE_UPDATEDBY: selectedActivityEquipment != null ? user : null,
                TAE_RECORDVERSION: selectedActivityEquipment != null ? selectedActivityEquipment.TAE_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiTaskActivityEquipments/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    selectedActivityEquipment = null;
                    resetModalInputFields();
                    self.SetEquipmentCount();
                    listActivityEquipments();
                    spa.PricingList();
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            maintenanceequipmentdiv = $("#maintenanceequipments");
            $("#btnTaskActivityEquipmentType").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#taskactivityequipmenttype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" }
                    ],
                    callback: function (data) {

                    }
                });
            });
            $("#taskactivityequipmenttype").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    {
                        field: "TYP_ORGANIZATION", func: function () {
                            return [selectedTask.TSK_ORGANIZATION, "*"];
                        }, operator: "in"
                    },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
                ],
                callback: function (data) {

                }
            });
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
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function () {

                    }
                });
            });
            $("#partcurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                filter: [
                    { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                ],
                callback: function () {
                }
            });
            $("#isbarcode").on("change", EvaluateCurrentBarcode);
            $("#btnTaskActivityEquipmentSave").click(function () {
                if (statusctrl === "barcode") {
                    AddCheckedOnes();
                } else {
                    addActEqpLine();
                }
            });
            $("#btnfilterCheckBoxes").click(function () {
                LoadEquipments();
            });
        };
        RegisterUIEvents();
    };
    var msc = new function () {
        var grdMiscCosts = null;
        var grdMiscCostsElm = $("#grdMiscCosts");
        var selectedmisccost;
        var self = this;

        var GetContractPartPrice = function (part) {
            var gridreq = {
                sort: [{ field: "CPP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetPartPriceForTask", value: selectedTask.TSK_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var RestoreDefaultFieldStates = function () {
            $("#misccostdesc").addClass("required").prop("disabled", false).val("");
            $("#misccostuom").prop("disabled", false).addClass("required").val("");
            $("#btnmisccostuom").prop("disabled", false);

            $("#misccostpart").removeClass("required isempty").prop("disabled", true).data("id", null).val("");
            $("#btnmisccostpart").prop("disabled", true);
            tooltip.hide("#misccostpart");

        }
        var PartIsNotFound = function () {
            RestoreDefaultFieldStates();
        }
        var PartIsFound = function () {
            $("#misccostpart")
                .addClass("required")
                .prop("disabled", false)
                .data("id", null)
                .val("");
            $("#btnmisccostpart").prop("disabled", false);
            $("#misccostdesc").removeClass("required").prop("disabled", true).val("");
            $("#misccostuom").prop("disabled", true).val("");
            $("#btnmisccostuom").prop("disabled", true);
            tooltip.hide("#misccostpart");
        }
        this.SetOtherCostCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "MSC_TASK", value: selectedActivity.TSA_TASK, operator: "eq" },
                        { field: "MSC_ACTIVITY", value: selectedActivity.TSA_LINE, operator: "eq" },
                        { field: "MSC_PTYPE", value: "SERVICE", operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiMiscCosts/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#miscCostServiceCodes").html(d.data);
                    if (d.data > 0)
                        $("#btnMiscCostServiceCodes").removeClass("btn-primary").addClass("btn-success");
                    else
                        $("#btnMiscCostServiceCodes").removeClass("btn-success").addClass("btn-primary");
                }
            });
        };
        this.SetPartCostCount = function () {
            var gridreq = {
                action: "CNT",
                filter: {
                    filters: [
                        { field: "MSC_TASK", value: selectedActivity.TSA_TASK, operator: "eq" },
                        { field: "MSC_ACTIVITY", value: selectedActivity.TSA_LINE, operator: "eq" },
                        { field: "MSC_PTYPE", value: "PART", operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiMiscCosts/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#MiscCostPartCnt").html(d.data);
                    if (d.data > 0)
                        $("#btnMiscCostPart").removeClass("btn-primary").addClass("btn-success");
                    else
                        $("#btnMiscCostPart").removeClass("btn-success").addClass("btn-primary");
                }
            });
        };
        var getSelectedTaskOrganization = function () {
            return tms.Ajax({
                url: "/Api/ApiOrgs/Get",
                data: JSON.stringify(selectedTask.TSK_ORGANIZATION),
                fn: function (d) {
                    selectedTaskOrganization = d.data;
                }
            });
        };
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
                ctrl: "#misccosttype",
                url: "/Api/ApiMiscCostTypes/List",
                keyfield: "MCT_CODE",
                textfield: "MCT_DESC",
                data: JSON.stringify(gridreq),
                callback: function (d) {
                    if (miscCostParentType === "SERVICE")
                        $("#misccosttype").val("SERVIS");
                }
            }).Fill();
        };
        var CalculateTotal = function () {
            var v_misccostunitprice = $("#misccostunitprice").val();
            var v_misccostqty = $("#misccostqty").val();
            var v_misccostexch = $("#misccostexch").val();
            if (v_misccostunitprice && v_misccostqty) {
                var total = (parseFloat(v_misccostunitprice) *
                        parseFloat(v_misccostqty) *
                        parseFloat(v_misccostexch))
                    .fixed(constants.pricedecimals);
                return total;
            }
        };
        var CalculateExch = function () {
            var curr = $("#misccostcurr").val();
            var date = $("#misccostdate").val();

            if (!curr || !date)
                return $.Deferred().reject();

            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: selectedTaskOrganization.ORG_CURRENCY,
                CRR_STARTDATE: moment.utc(date, constants.dateformat)
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch)
            });
        };
        var FillUserInterface = function () {
            tms.UnBlock("#misccostsform");
            tms.BeforeFill("#misccosts");

            if (miscCostParentType == "PART") {
                $("#misccostpartcontainer").removeClass("hidden");
                $("#partisnotfound").prop("checked", !selectedmisccost.MSC_PART).trigger("change");
                $("#misccostpartreference").val(selectedmisccost.MSC_PARTREFERENCE);
                if (selectedmisccost.MSC_PART) {
                    $("#misccostpart").val(selectedmisccost.MSC_PARTCODE);
                    $("#misccostpart").data("id", selectedmisccost.MSC_PART);
                    tooltip.show("#misccostpart", selectedmisccost.MSC_PARTDESC);
                }
            } else {
                $("#misccostpartcontainer").addClass("hidden");
                RestoreDefaultFieldStates();
            }

            $("#mcactivity").val(selectedmisccost.MSC_ACTIVITY);
            $("#misccostdate").val(moment(selectedmisccost.MSC_DATE).format(constants.dateformat));
            $("#misccostdesc").val(selectedmisccost.MSC_DESC);
            $.when(LoadSubTypes(miscCostParentType)).done(function () {
                $("#misccosttype").val(selectedmisccost.MSC_TYPE);
            });
            $("#misccostunitprice").val(parseFloat(selectedmisccost.MSC_UNITPRICE).fixed(constants.pricedecimals));
            $("#misccostunitsalesprice").val(selectedmisccost.MSC_UNITSALESPRICE !== null
                ? parseFloat(selectedmisccost.MSC_UNITSALESPRICE).fixed(constants.pricedecimals)
                : "");
            $("#misccostcurr").val(selectedmisccost.MSC_CURR);
            $("#misccostexch").val(parseFloat(selectedmisccost.MSC_EXCH).fixed(constants.exchdecimals));
            $("#misccostqty").val(parseFloat(selectedmisccost.MSC_QTY).fixed(constants.qtydecimals));
            $("#misccostuom").val(selectedmisccost.MSC_UOM);
            $("#misccosttotal").val(parseFloat(selectedmisccost.MSC_TOTAL).fixed(constants.pricedecimals));
            $("#misccostunitprice").prop("disabled", selectedmisccost.MSC_FIXED === "+" && !!supplier);

            tooltip.show("#mcactivity", selectedmisccost.MSC_ACTIVITYDESC);
            tooltip.show("#misccostcurr", selectedmisccost.MSC_CURRDESC);
            tooltip.show("#misccostuom", selectedmisccost.MSC_UOMDESC);


            if (selectedTask.TSK_STATUS === "C") tms.Block("#misccostsform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiMiscCosts/Get",
                data: JSON.stringify(selectedmisccost.MSC_ID),
                fn: function (d) {
                    selectedmisccost = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selectedmisccost = grdMiscCosts.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.ResetUI = function () {
            selectedmisccost = null;
            tms.UnBlock("#misccostsform");
            tms.Reset("#misccosts");

            $("#mcactivity").val("");
            $("#misccostdate").val(tms.Now().format(constants.dateformat));
            $("#misccostdesc").val("");
            $("#misccostunitprice").val("");
            $("#misccostunitsalesprice").val("");
            $("#misccostcurr").val("");
            $("#misccostexch").val("1.00");
            $("#misccostqty").val("");
            $("#misccostuom").val("");
            $("#misccosttotal").val("");
            $("#misccostpart").data("id", null);
            $("#misccostpart").val("");
            $("#misccostunitprice").prop("disabled", false);
            $("#misccostpartreference").val("");


            tooltip.hide("#mcactivity");
            tooltip.hide("#misccostcurr");
            tooltip.hide("#misccostuom");
            tooltip.hide("#misccostpart");

            if (selectedTaskOrganization) {
                $("#misccostcurr").val(selectedTaskOrganization.ORG_CURRENCY);
                $("#misccosttotalcurr").val(selectedTaskOrganization.ORG_CURRENCY);
                tooltip.show("#misccostcurr", selectedTaskOrganization.ORG_CURRENCYDESC);
                tooltip.show("#misccosttotalcurr", selectedTaskOrganization.ORG_CURRENCYDESC);
            }

            if (selectedTask.TSK_STATUS === "C") tms.Block("#misccostsform");
        };
        var gridDataBound = function (e) {
            var data = grdMiscCosts.GetData();
            var sumcost = 0;
            var sumsales = 0;
            $.each(data,
                function () {
                    sumcost += parseFloat(this.MSC_UNITPRICE * this.MSC_EXCH * this.MSC_QTY) || 0;
                    sumsales += parseFloat(this.MSC_UNITSALESPRICE * this.MSC_EXCH * this.MSC_QTY) || 0;
                });
            grdMiscCostsElm.find("#grdCostSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].totalcost +
                ": </strong>" +
                sumcost.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                selectedTaskOrganization.ORG_CURRENCY +
                "</span>");
            if (!supplier)
                grdMiscCostsElm.find("#grdSalesSumValue").html("<span style=\"color:#cf192d\"><strong>" +
                    applicationstrings[lang].totalsales +
                    ": </strong>" +
                    sumsales.toLocaleString(undefined,
                        {
                            maximumFractionDigits: constants.pricedecimals,
                            minimumFractionDigits: constants.pricedecimals
                        }) +
                    " " +
                    selectedTaskOrganization.ORG_CURRENCY +
                    "</span>");
        };
        var listMiscCosts = function () {
            var grdFilter = [
                { field: "MSC_TASK", value: selectedActivity.TSA_TASK, operator: "eq" },
                { field: "MSC_ACTIVITY", value: selectedActivity.TSA_LINE, operator: "eq" },
                { field: "MSC_PTYPE", value: miscCostParentType, operator: "eq" }
            ];

            if (grdMiscCosts) {
                grdMiscCosts.ClearSelection();
                grdMiscCosts.RunFilter(grdFilter);
            } else {
                var columns = [
                    { type: "number", field: "MSC_ACTIVITY", title: gridstrings.misccosts[lang].activity, width: 150 },
                    { type: "date", field: "MSC_DATE", title: gridstrings.misccosts[lang].date, width: 150 },
                    { type: "string", field: "MSC_DESC", title: gridstrings.misccosts[lang].desc, width: 250 },
                    { type: "string", field: "MSC_PTYPE", title: gridstrings.misccosts[lang].ptype, width: 150 },
                    { type: "string", field: "MSC_TYPEDESC", title: gridstrings.misccosts[lang].type, width: 250 },
                    { type: "price", field: "MSC_UNITPRICE", title: gridstrings.misccosts[lang].unitprice, width: 150 },
                    { type: "price", field: "MSC_UNITSALESPRICE", title: gridstrings.misccosts[lang].unitsalesprice, width: 150 },
                    { type: "string", field: "MSC_CURR", title: gridstrings.misccosts[lang].curr, width: 150 },
                    { type: "qty", field: "MSC_QTY", title: gridstrings.misccosts[lang].qty, width: 150 },
                    { type: "string", field: "MSC_UOM", title: gridstrings.misccosts[lang].uom, width: 150 },
                    { type: "price", field: "MSC_TOTAL", title: gridstrings.misccosts[lang].total, width: 150 },
                    { type: "string", field: "MSC_PARTCODE", title: gridstrings.misccosts[lang].partcode, width: 150 },
                    { type: "string", field: "MSC_PARTREFERENCE", title: gridstrings.misccosts[lang].partreference, width: 150 }

                ];

                var fields = {
                    MSC_ACTIVITY: { type: "number" },
                    MSC_DATE: { type: "date" },
                    MSC_UNITPRICE: { type: "number" },
                    MSC_UNITSALESPRICE: { type: "number" },
                    MSC_QTY: { type: "number" },
                    MSC_TOTAL: { type: "number" }
                };

                if (supplier) {
                    columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["MSC_UNITSALESPRICE"]) == -1); });
                    delete fields.MSC_UNITSALESPRICE;
                }

                grdMiscCosts = new Grid({
                    keyfield: "MSC_ID",
                    columns: columns,
                    fields: fields,
                    datasource: "/Api/ApiMiscCosts/List",
                    selector: "#grdMiscCosts",
                    name: "grdMiscCosts",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "MSC_ID", dir: "desc" }],
                    change: gridChange,
                    loadall: true,
                    toolbar: {
                        left: [
                            "<div style=\"padding-right: 5px;\" class=\"pull-left\" id=\"grdCostSumValue\"></div><div class=\"pull-left\"  id=\"grdSalesSumValue\"></div>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"MiscCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
        var AddCheck = function () {
            var misccostdate = moment($("#misccostdate").val(), constants.dateformat);
            var misccostexch = $("#misccostexch").val();
            if (misccostdate < moment(selectedTask.TSK_REQUESTED).startOf("day")) {
                msgs.error(applicationstrings[lang].misccostdate);
                return false;
            }
            if (!misccostexch) {
                msgs.error(applicationstrings[lang].misccostexch);
                return false;
            }
            return true;
        };
        this.Save = function () {
            if (!tms.Check("#misccosts") || !AddCheck() || miscCostParentType === null)
                return $.Deferred().reject();

            var misccost = {
                MSC_ID: selectedmisccost ? selectedmisccost.MSC_ID : 0,
                MSC_TASK: selectedActivity.TSA_TASK,
                MSC_ACTIVITY: selectedActivity.TSA_LINE,
                MSC_DATE: moment.utc($("#misccostdate").val(), constants.dateformat),
                MSC_DESC: $("#misccostdesc").val(),
                MSC_TYPE: $("#misccosttype").val(),
                MSC_PTYPE: miscCostParentType,
                MSC_UNITPRICE: parseFloat($("#misccostunitprice").val()),
                MSC_UNITSALESPRICE: ($("#misccostunitsalesprice").val()
                    ? parseFloat($("#misccostunitsalesprice").val())
                    : null),
                MSC_CURR: $("#misccostcurr").val(),
                MSC_EXCH: $("#misccostexch").val(),
                MSC_QTY: parseFloat($("#misccostqty").val()),
                MSC_UOM: $("#misccostuom").val(),
                MSC_INVOICE: null, //($("#misccostinvoice").val() || null),
                MSC_PART: ($("#misccostpart").data("id") || null),
                MSC_PARTREFERENCE: ($("#misccostpartreference").val() || null),
                MSC_TOTAL: CalculateTotal(),
                MSC_FIXED: selectedmisccost != null ? selectedmisccost.MSC_FIXED : "-",
                MSC_CREATED: selectedmisccost != null ? selectedmisccost.MSC_CREATED : tms.Now(),
                MSC_CREATEDBY: selectedmisccost != null ? selectedmisccost.MSC_CREATEDBY : user,
                MSC_UPDATED: selectedmisccost != null ? tms.Now() : null,
                MSC_UPDATEDBY: selectedmisccost != null ? user : null,
                MSC_RECORDVERSION: selectedmisccost != null ? selectedmisccost.MSC_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiMiscCosts/Save",
                data: JSON.stringify(misccost),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.SetPartCostCount();
                    self.SetOtherCostCount();
                    spa.PricingList();
                    listMiscCosts();
                }
            });
        };
        this.Delete = function () {
            if (selectedmisccost) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiMiscCosts/DelRec",
                            data: JSON.stringify(selectedmisccost.MSC_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                spa.PricingList();
                                listMiscCosts();
                            }
                        });
                    });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnSaveMiscCost").click(self.Save);
            $("#btnAddMiscCost").click(self.ResetUI);
            $("#btnDeleteMiscCost").click(self.Delete);
            $("#btnmcactivity").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.taskactivities[lang].title,
                    listurl: "/Api/ApiTaskActivities/List",
                    keyfield: "TSA_ID",
                    codefield: "TSA_LINE",
                    textfield: "TSA_DESC",
                    returninput: "#mcactivity",
                    columns: [
                        {
                            type: "string",
                            field: "TSA_LINE",
                            title: gridstrings.taskactivities[lang].line,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "TSA_DESC",
                            title: gridstrings.taskactivities[lang].description,
                            width: 100
                        }
                    ],
                    filter: [{ field: "TSA_TASK", value: selectedTask.TSK_ID, operator: "eq" }]
                });
            });
            $("#btnmisccostuom").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.uoms[lang].title,
                    listurl: "/Api/ApiUoms/List",
                    keyfield: "UOM_CODE",
                    codefield: "UOM_CODE",
                    textfield: "UOM_DESC",
                    returninput: "#misccostuom",
                    columns: [
                        { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                        { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#misccostuom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });
            $("#mcactivity").autocomp({
                listurl: "/Api/ApiTaskActivities/List",
                geturl: "/Api/ApiTaskActivities/Get",
                termisnumeric: true,
                field: "TSA_LINE",
                textfield: "TSA_DESC",
                filter: [{ field: "TSA_TASK", func: function () { return selectedTask.TSK_ID; }, operator: "eq" }]
            });
            $("#btnmisccostpart").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    modalinfo: applicationstrings[lang].partmodalinfo,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_ID",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#misccostpart",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 400 }
                    ],
                    filter: [
                        { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                        { field: "IsContractedTaskPart", value: selectedTask.TSK_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedTaskPart", value: selectedTask.TSK_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.parts[lang].allparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    treefilter: function (id, callback) {
                        $.when(tree.GetLevels("PART")).done(function (d) {
                            var data = tree.GenerateTreeData(d.data);
                            $(id).comboTree({
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
                        $("#misccostdesc").val(d ? d.PAR_DESC : "");
                        $("#misccostuom").val(d ? d.PAR_UOM : "");
                        $("#misccostpart").data("id", d ? d.PAR_ID : null);
                        if (d)
                            tooltip.show("#misccostpart", d.PAR_DESC);
                        else
                            tooltip.hide("#misccostpart");

                        if (d) {
                            return $.when(GetContractPartPrice(d.PAR_ID)).done(function (cpp) {
                                if (cpp.data && cpp.data.length > 0) {
                                    $("#misccostpartreference").val(cpp.data[0].CPP_REFERENCE);
                                    $("#misccostunitprice").prop("disabled", supplier && cpp.data[0].CPP_UNITPURCHASEPRICE!==null);
                                    $("#misccostunitprice").val(cpp.data[0].CPP_UNITPURCHASEPRICE);
                                    if (!supplier)
                                        $("#misccostunitsalesprice").val(cpp.data[0].CPP_UNITSALESPRICE);
                                    $("#misccostcurr").val(cpp.data[0].CPP_CURR).trigger("change");
                                }
                            });
                        }
                    }
                });
            });
            $("#misccostpart").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                callback: function (d) {
                    $("#misccostdesc").val(d ? d.PAR_DESC : "");
                    $("#misccostuom").val(d ? d.PAR_UOM : "");
                    $("#misccostpart").data("id", d ? d.PAR_ID : null);
                    if (d)
                        tooltip.show("#misccostpart", d.PAR_DESC);
                    else
                        tooltip.hide("#misccostpart");

                    return $.when(GetContractPartPrice(d.PAR_ID)).done(function (cpp) {
                        if (cpp.data && cpp.data.length > 0) {
                            $("#misccostpartreference").val(cpp.data[0].CPP_REFERENCE);
                            $("#misccostunitprice").prop("disabled", supplier && cpp.data[0].CPP_UNITPURCHASEPRICE !== null);
                            $("#misccostunitprice").val(cpp.data[0].CPP_UNITPURCHASEPRICE);
                            if (!supplier)
                                $("#misccostunitsalesprice").val(cpp.data[0].CPP_UNITSALESPRICE);
                            $("#misccostcurr").val(cpp.data[0].CPP_CURR).trigger("change");
                        }
                    });
                }
            });
            $("#partisnotfound").on("change", function () {
                var $this = $(this);
                if ($this.is(":checked")) {
                    PartIsNotFound();
                } else {
                    PartIsFound();
                }
            });

            $("#misccostcurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#btnmisccostcurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#misccostcurr",
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
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (d) {
                        $("#misccostcurr").trigger("blur");
                    }
                });
            });
            $("#misccostsform input[calc-group=\"1\"]").on("change", function () {
                var total = CalculateTotal();
                $("#misccosttotal").val(total);
            });
            $("#misccostsform input[calc-group=\"2\"]").on("change", function () {
                $.when(CalculateExch()).done(function (d) {
                    if (d.data) {
                        $("#misccostexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                        $("#misccosttotal").val(CalculateTotal());
                    } else {
                        $("#misccostexch").val("");
                        $("#misccosttotal").val("");
                    }
                });
            });
        };
        this.showMiscCostModal = function () {
            return $.when(getSelectedTaskOrganization()).done(function () {
                self.ResetUI();
                listMiscCosts();

                if (miscCostParentType == "PART") {
                    $("#misccostpartcontainer").removeClass("hidden");
                    $("#partisnotfound").prop("checked", false).trigger("change");
                } else {
                    $("#misccostpartcontainer").addClass("hidden");
                    RestoreDefaultFieldStates();
                }

                LoadSubTypes(miscCostParentType);
                $("#modalMiscCost").modal("show");
            });

        };
        RegisterUIEvents();
    };
    spa = new function () {
        var self = this;
        var grdTaskActivityPricing = null;
        var selecteditem = null;
        var stateType = null;
        var grdTaskActivityPricingElm = $("#grdTaskActivityPricing");
        var grdTaskActivities = null;
        var grdelm = $("#grdTaskActivities");
        var documentsHelper;
        var commentsHelper;
        var totalpricing = 0;
        var gridfilter = [];
        var List;

        var LoadHoldReasons = function () {
            var gridreq = {
                sort: [{ field: "HDR_CODE", dir: "asc" }],
                filter: [
                    { filters: [{ field: "HDR_ACTIVE", value: "+", operator: "eq" }] },
                    { filters: [{ field: "HDR_TMS", value: "+", operator: "eq" }] }
                ]
            };

            var selectedholdreason = $("#activityclosetype").data("selected");
            var p = {
                UserGroup: usergroup,
                SelectedHoldReason: selectedholdreason,
                GridRequest: gridreq
            }

            return tms.Ajax({
                url: "/Api/ApiHoldReasons/ListByUserGroup",
                data: JSON.stringify(p),
                fn: function (d) {
                    var holdreason = $("#activityclosetype");
                    holdreason.find("option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        if (d.data[i]) {
                            strOptions += "<option value=\"" +
                                d.data[i].HDR_CODE +
                                "\">" +
                                d.data[i].HDR_DESCF +
                                "</option>";
                        }
                    }
                    holdreason.append(strOptions);

                }
            });
        };
        var loadPriorities = function () {
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
        var loadStatuses = function () {
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
        var pricingGridDataBound = function () {
            var data = grdTaskActivityPricing.GetData();
            var sumprice = 0;
            $.each(data,
                function () {
                    sumprice += parseFloat(this.TPR_TOTALPRICE * this.TPR_EXCH) || 0;
                });
            grdTaskActivityPricingElm.find("#grdtotalpricing").html("<span style=\"color:#cf192d\"><strong>" +
                applicationstrings[lang].totalpayment +
                ": </strong>" +
                sumprice.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " TL </span>");

        };
        this.GeneratePricing = function () {
            return tms.Ajax({
                url: "/Api/ApiTask/GeneratePricing",
                data: JSON.stringify(selectedTask)
            });
        }
        var UpdateTaskEquipment = function (equipment) {

            var o = {
                TSK_ID: selectedTask.TSK_ID,
                TSK_EQUIPMENT: equipment
            }
            return tms.Ajax({
                url: "/Api/ApiTask/UpdateEquipment",
                data: JSON.stringify(o),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        }
        this.PricingList = function () {
            var grdFilter = [
                { field: "TPR_TASK", value: selectedTask.TSK_ID, operator: "eq" },
                { field: "TPR_ACTIVITY", value: selectedActivity.TSA_LINE, operator: "eq" },
                { field: "TPR_TYPECODE", value: "PART", operator: "neq" }

            ];

            if (grdTaskActivityPricing) {
                grdTaskActivityPricing.ClearSelection();
                grdTaskActivityPricing.RunFilter(grdFilter);
            } else {
                var columns = [
                    {
                        type: "string",
                        field: "TPR_TYPE",
                        title: gridstrings.solutionpartnertaskpricing[lang].type,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_CODE",
                        title: gridstrings.solutionpartnertaskpricing[lang].code,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_DESC",
                        title: gridstrings.solutionpartnertaskpricing[lang].desc,
                        width: 300
                    },
                    {
                        type: "qty",
                        field: "TPR_QTY",
                        title: gridstrings.solutionpartnertaskpricing[lang].qty,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_UOM",
                        title: gridstrings.solutionpartnertaskpricing[lang].uom,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_UNITPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].unitprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_TOTALPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].totalunitprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_UNITSALESPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].unitsalesprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_TOTALSALESPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].unittotalsalesprice,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_CURR",
                        title: gridstrings.solutionpartnertaskpricing[lang].curr,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_PRICINGMETHOD",
                        title: gridstrings.solutionpartnertaskpricing[lang].from,
                        width: 150
                    },
                    {
                        type: "exch",
                        field: "TPR_EXCH",
                        title: gridstrings.solutionpartnertaskpricing[lang].exch,
                        width: 150
                    }
                ];
                var fields = {
                    TPR_QTY: { type: "number" },
                    TPR_TOTALSALESPRICE: { type: "number" },
                    TPR_UNITSALESPRICE: { type: "number" },
                    TPR_TOTALPRICE: { type: "number" },
                    TPR_UNITPRICE: { type: "number" },
                    TPR_EXCH: { type: "number" }
                };
                if (supplier) {
                    columns = $.grep(columns,
                        function (e) {
                            return ($.inArray(e.field, ["TPR_UNITSALESPRICE", "TPR_TOTALSALESPRICE"]) == -1);
                        });
                    delete fields.TPR_UNITSALESPRICE;
                    delete fields.TPR_TOTALSALESPRICE;
                }

                grdTaskActivityPricing = new Grid({
                    keyfield: "TPR_ID",
                    columns: columns,
                    fields: fields,
                    datasource: "/Api/ApiTask/TaskPricing",
                    selector: "#grdTaskActivityPricing",
                    name: "grdTaskActivityPricing",
                    height: 250,
                    filter: grdFilter,
                    toolbar: {
                        left: [
                            "<div style=\"padding-right: 5px;\" class=\"pull-left\" id=\"grdtotalpricing\"></div>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"MiscCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    loadall: true,
                    databound: pricingGridDataBound
                });
            }
        };
        var LoadDocumentTypes = function () {
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
        this.ResetUI = function () {
            selectedActivity = null;
            $("#btnCloseActivity").removeClass("btn-danger").addClass("btn-success");
            $("#btnCompleteActivityText").text(applicationstrings[lang].completeactivity);
            $("#btnCompleteActivity").removeClass("btn-danger").addClass("btn-success");
            $("#btnCloseActivityText").text(applicationstrings[lang].sendforapproval);

            $("#btnChecklist, " +
              "#btnActivityEquipmentMaintenance, " +
              "#btnActivityServiceCode, " +
              "#btnActivityDocuments, " +
              "#btnActivityComments," +
              "#btnMiscCostPart," +
              "#btnIssueReturn," +
              "#btnMiscCostServiceCodes," +
              "#btnBookedHours," +
              "#btnCloseActivity," +
              "#btnCompleteActivity," +
              "#btnTaskPricing," +
              "#btnContactInfo").prop("disabled", true);
            $("#btnActivityComments").find("#actcommentscnt").html("0");
            $("#btnActivityDocuments").find("#actdocumentscnt").html("0");
            $(".typeselected").addClass("hidden");

            $("#quolink").removeAttr("target");
            $("#quolink").removeAttr("href");
            $("#quolink").text("");
            tooltip.hide("#equipment");
            $("#warnings").addClass("hidden");
            $("#btnDownload").attr("href", "#");

            $("#tasknote").val("");
            $("#quolink").attr("hidden", true);
            $("#quomodal").attr("hidden", true);
        };
        var FillUserInterface = function () {

            tms.BeforeFill("#record");
            $("#taskid").val(selectedActivity.TSA_TASK + " - " + selectedActivity.TSA_LINE);
            $("#category").val(selectedTaskCategory.CAT_DESC);
            $("#customer").val(selectedTask.TSK_CUSTOMER);
            $("#periodictask").val(selectedTask.TSK_PTASK);
            $("#branch").val(selectedTask.TSK_BRANCH + " - " + selectedTask.TSK_BRANCHDESC);
            var tskeqp = (selectedTask.TSK_EQUIPMENTCODE ? selectedTask.TSK_EQUIPMENTCODE : "") +
                (selectedTask.TSK_EQUIPMENTTYPEDESC ? " - " + selectedTask.TSK_EQUIPMENTTYPEDESC : "");
            $("#tskeqp").val(tskeqp);
            $("#branchadress").val(selectedTask.TSK_BRANCHADDRESS);
            $("#shortdesc").val(selectedTask.TSK_SHORTDESC);
            $("#invno").val(selectedActivity.TSA_INVOICE);
            $("#tasknote").val(selectedTask.TSK_NOTE);
            $("#plndate").val(moment(selectedActivity.TSA_SCHFROM).format(constants.longdateformat));

            if (selectedTask.TSK_CUSTOMERNOTES || selectedTask.TSK_BRANCHNOTES) {
                $("#warnings").removeClass("hidden")
                    .html((selectedTask.TSK_CUSTOMERNOTES || "") + (selectedTask.TSK_BRANCHNOTES || ""));
            } else {
                $("#warnings").addClass("hidden");
            }


            if (selectedTask.TSK_QUOTATION === "+") {
                $("#quolink").attr("hidden", false);
                $("#quomodal").attr("hidden", true);

                $("#lastquotationno").removeClass("fa-times");
                $("#lastquotationno").addClass("fa-check");

                $("#quolink").attr("target", "_blank");
                $("#quolink").attr("href", "/Quotations/ListByTask/" + selectedTask.TSK_ID);
                $("#quolink").text(applicationstrings[lang].clickforseequo);
            } else {
                $("#lastquotationno").removeClass("fa-check");
                $("#lastquotationno").addClass("fa-times");

                $.when(self.CheckIfActivityCompletedOrRejected()).done(function (d) {
                    if (!d) {
                        //OPEN MODAL HERE
                        $("#quolink").attr("hidden", true);
                        $("#quomodal").attr("hidden", false);
                        $("#quolink").attr("target", "_blank");
                        $("#quolink").attr("href", "/Quotations/NewByTask/" + selectedTask.TSK_ID + (selectedActivity ? "/" + selectedActivity.TSA_LINE : ""));
                        $("#quomodal").text(applicationstrings[lang].clickherefornewquo);
                    } else {
                        $("#quolink").removeAttr("target");
                        $("#quolink").removeAttr("href");
                        $("#quolink").text("");
                        $("#quolink").attr("hidden", true);
                        $("#quomodal").attr("hidden", true);
                    }
                });
            }

            var tval = selectedActivity.TSA_SCHFROM
                ? moment(selectedActivity.TSA_SCHFROM).format(constants.longdateformat)
                : "";


            $("#plannedstart").val(tval);
            var activityStatus = (selectedActivity.TSA_COMPLETED === "+" ? applicationstrings[lang].COMPLETED : applicationstrings[lang].on) + " / " + (selectedActivity.TSA_CHK02 === "+" ? applicationstrings[lang].sent : applicationstrings[lang].notsend);

            $("#activitystatus").val(activityStatus);
            $("#created").val(selectedActivity.TSA_CREATED
                ? moment(selectedActivity.TSA_CREATED).format(constants.longdateformat)
                : "");

            var purchaseordertracktable = $("#quotationstable table tbody");
            purchaseordertracktable.find("tr.str-track").remove();
            $("#quototal").text("");
            quoLines = [];


            $(".page-header>h6").html(selectedActivity.TSA_ID + " - " + selectedActivity.TSA_DESC);

            $("#btnChecklist," +
                "#btnActivityEquipmentMaintenance," +
                "#btnActivityServiceCode," +
                "#btnActivityComments," +
                "#btnActivityDocuments," +
                "#btnBookedHours," +
                "#btnMiscCostPart," +
                "#btnIssueReturn," +
                "#btnMiscCostServiceCodes," +
                "#btnTaskPricing," + 
                "#btnContactInfo").prop("disabled", false);

            $("#btnChecklist," +
                "#btnActivityEquipmentMaintenance," +
                "#btnActivityServiceCode," +
                "#btnMiscCostPart," +
                "#btnIssueReturn," +
                "#btnCompleteActivity," +
                "#btnBookedHours," +
                "#btnCloseActivity," +
                "#btnMiscCostServiceCodes").prop("disabled", selectedTask.TSK_STATUSP === "C" || selectedActivity.TSA_CHK02 === "+");

            pstat = selectedTask.TSK_STATUSP;

            if (selectedTask.TSK_CATEGORY !== "BK")
                $("#btnActivityEquipmentMaintenance").prop("disabled", true);

            $("#btnActivityComments").find("#actcommentscnt").html(selectedTask.TSK_CMNTCOUNT);
            if (selectedTask.TSK_CMNTCOUNT > 0)
                $("#btnActivityComments").removeClass("btn-primary").addClass("btn-success");
            else
                $("#btnActivityComments").removeClass("btn-success").addClass("btn-primary");

            $("#btnActivityDocuments").find("#actdocumentscnt").html(selectedTask.TSK_DOCCOUNT);
            if (selectedTask.TSK_DOCCOUNT > 0)
                $("#btnActivityDocuments").removeClass("btn-primary").addClass("btn-success");
            else
                $("#btnActivityDocuments").removeClass("btn-success").addClass("btn-primary");

            $("#btnActivityComments").off("click").on("click", function () {
                commentsHelper.showCommentsModal({
                    subject: "TASK",
                    source: selectedTask.TSK_ID
                });
            });
            $("#btnActivityDocuments").off("click").on("click", function () {
                documentsHelper.showDocumentsModal({
                    subject: "TASK",
                    source: selectedTask.TSK_ID
                });
            });

            if (selectedActivity.TSA_COMPLETED === "+") {
                $("#btnCompleteActivity").removeClass("btn-success").addClass("btn-danger");
                $("#btnCompleteActivity").prop("disabled", true);
                $("#btnCompleteActivityText").text(applicationstrings[lang].alredycompleted);
            } else {
                $("#btnCompleteActivityText").text(applicationstrings[lang].completeactivity);
                $("#btnCompleteActivity").removeClass("btn-danger").addClass("btn-success");
            }

            if (selectedActivity.TSA_COMPLETED !== "+") {
                $("#btnCloseActivity").prop("disabled", true);
            }
            if (selectedActivity.TSA_CHK02 === "+") {
                $("#btnCloseActivity").removeClass("btn-success").addClass("btn-danger");
                $("#btnCloseActivity").prop("disabled", true);
                $("#btnCloseActivityText").text(applicationstrings[lang].alreadysent);
            } else {
                $("#btnCloseActivityText").text(applicationstrings[lang].sendforapproval);
                $("#btnCloseActivity").removeClass("btn-danger").addClass("btn-success");
            }


            aeq.SetEquipmentCount();
            asr.SetServiceCodeCount();
            msc.SetPartCostCount();
            issueReturn.SetWarehousePartCounts();
            bhrs.SetBookedHoursCount();
            msc.SetOtherCostCount();
            LoadDocumentTypes();
            $.when(self.GeneratePricing()).done(function () {
                self.PricingList();
            });
        };
        this.CheckIfActivityCompletedOrRejected = function () {
            if (!selectedActivity) return false;
            return (selectedActivity.TSA_CHK02 === "+" || selectedActivity.TSA_STATUS === "REJ");
        };
        this.LoadSelected = function (row) {
            var activity = selecteditem.TSK_TSAID;
            return tms.Ajax({
                url: "/Api/ApiTaskActivities/Get",
                data: JSON.stringify(activity),
                fn: function (d) {
                    selectedActivity = d.data;
                    return $.when(self.LoadSelectedTask()).done(function (task) {
                        selectedTask = task.data;
                        return $.when(self.LoadSelectedTaskCategory()).done(function (category) {
                            selectedTaskCategory = category.data;
                            FillUserInterface();
                            return $.when(quototask.CheckQuotation()).done(function () {
                                scr.ContextMenu();
                            });
                        });
                    });
                }
            });
        };
        this.LoadSelectedTask = function () {
            var taskid = selectedActivity.TSA_TASK;
            return tms.Ajax({
                url: "/Api/ApiTask/Get",
                data: JSON.stringify(taskid)
            });
        };
        this.LoadSelectedTaskCategory = function () {
            return tms.Ajax({
                url: "/Api/ApiCategories/Get",
                data: JSON.stringify(selectedTask.TSK_CATEGORY)
            });
        };
        var CompleteActivity = function () {
            if (selectedActivity) {
                if (!tms.Check("#completeActivity"))
                    return $.Deferred().reject();


                var o = JSON.stringify(
                    {
                        AET_TASK: selectedActivity.TSA_TASK,
                        AET_LINE: selectedActivity.TSA_LINE,
                        AET_PNOTE: $("#activityclosenote").val(),
                        AET_ENDTYPE: $("#activityclosetype").val()
                    });


                return tms.Ajax({
                    url: "/Api/ApiTaskActivities/ChangeCompletedState",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        List();
                        self.LoadSelected();
                        $("#completeActivity").modal("hide");
                        $("#activityclosenote").val("");
                    }
                });
            }
        };
        var HoldTask = function () {
            if (selectedActivity) {
                if (!tms.Check("#completeActivity"))
                    return $.Deferred().reject();


                var o = JSON.stringify(
                    {
                        AET_TASK: selectedActivity.TSA_TASK,
                        AET_LINE: selectedActivity.TSA_LINE,
                        AET_PNOTE: $("#activityclosenote").val(),
                        AET_ENDTYPE: $("#activityclosetype").val()
                    });


                return tms.Ajax({
                    url: "/Api/ApiTaskActivities/PutOnHold",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        List();
                        self.LoadSelected();
                        $("#completeActivity").modal("hide");
                        $("#activityclosenote").val("");
                    }
                });
            }
        };
        var CloseActivity = function () {
            var o = JSON.stringify(
                {
                    TSA_ID: selectedActivity.TSA_ID
                });


            return tms.Ajax({
                url: "/Api/ApiTaskActivities/CloseActivity",
                data: o,
                fn: function (d) {
                    if (d.data) {
                        msgs.success(d.data);
                        grdTaskActivities.Refresh();
                        self.LoadSelected();
                    }
                }
            });
        };
        var ResetSidebarFilter = function () {
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
            $("#priorities input").each(function (e) {
                $(this).prop("checked", false);
            });
            $("#statuses input").each(function (e) {
                $(this).prop("checked", false);
            });
        }
        var RunSidebarFilter = function () {
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

            if (datecreatedend)
                datecreatedend = datecreatedend.add(1, "days").format(constants.dateformat);
            if (apdend)
                apdend = moment(apdend, constants.dateformat).add(1, "days");
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

            var checkedstatuses = $("#statuses input:checked");
            var statuses = [];
            for (i = 0; i < checkedstatuses.length; i++) {
                item = checkedstatuses[i];
                statuses.push($(item).val());
            }

            if (mytasks) {
                gridfilter.push(
                    { field:"MYTASKS",value: user, operator: "func", logic: "and" });
            }
            if (inmyregion) {
                gridfilter.push({
                    field:"INMYREGION.TSKID",
                    value: user,
                    operator: "func",
                    logic: "and"
                });
            }
            if (deadlineval) {
                gridfilter.push({
                    field: "TASK.DEADLINE.TSKID",
                    value: parseFloat(deadlineval),
                    operator: "func",
                    logic: "and"
                });
            }

            if (priorities.length > 0)
                gridfilter.push({ field: "TSK_PRIORITY", value: priorities, operator: "in", logic: "and" });
            if (statuses.length > 0)
                gridfilter.push({ field: "TSK_STATUS", value: statuses, operator: "in", logic: "and" });
            if (datecreatedstart && datecreatedend)
                gridfilter.push({
                    field: "TSK_CREATED",
                    value: datecreatedstart,
                    value2: datecreatedend,
                    operator: "between",
                    logic: "and"
                });
            if (daterequestedstart && daterequestedend)
                gridfilter.push({
                    field: "TSK_REQUESTED",
                    value: daterequestedstart,
                    value2: daterequestedend,
                    operator: "between",
                    logic: "and"
                });
            if (datecompletedstart && datecompletedend)
                gridfilter.push({
                    field: "TSK_COMPLETED",
                    value: datecompletedstart,
                    value2: datecompletedend,
                    operator: "between",
                    logic: "and"
                });
            if (dateclosedstart && dateclosedend)
                gridfilter.push({
                    field: "TSK_CLOSED",
                    value: dateclosedstart,
                    value2: dateclosedend,
                    operator: "between",
                    logic: "and"
                });
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

            grdTaskActivities.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        }
        var gridDataBound = function () {

            grdelm.find("[data-id]").unbind("click").click(function () {
                selecteditem = grdTaskActivities.GetRowDataItem($(this));
                self.LoadSelected($(this));
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

            grdelm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                documentsHelper.showDocumentsModal({
                    subject: "TASK",
                    source: id
                });
            });

            grdelm.find("#search").off("click").on("click", function () {
                $.when(loadPriorities(), loadStatuses()).done(function () {
                    $(".sidebar.right").trigger("sidebar:open");
                });
            });
        }
        List = function (clearfilters) {
            
                gridfilter = [];
            
           
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox", logic: "and" });
            }

            grdTaskActivities = new Grid({
                keyfield: "TSK_ID",
                columns: [
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
                    { type: "number", field: "TSK_TSALINE", title: gridstrings.taskactivities[lang].line, width: 150 },
                    { type: "number", field: "TSK_ACTIVITYCOUNT", title: gridstrings.taskactivities[lang].activitycount, width: 150 },
                    {
                        type: "string",
                        field: "TSK_TSADESC",
                        title: gridstrings.taskactivities[lang].description,
                        width: 350
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
                        field: "TSK_TSACOMPLETED",
                        title: gridstrings.tasklist[lang].iscompleted,
                        width: 150
                    }, {
                        type: "string",
                        field: "TSK_TSACHK02",
                        title: gridstrings.tasklist[lang].issent,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TSK_HOLDREASONDESC",
                        title: gridstrings.tasklist[lang].holdreasondesc,
                        width: 250
                    },

                    {
                        type: "string",
                        field: "TSK_CUSTOMER",
                        title: gridstrings.tasklist[lang].customer,
                        width: 130
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
                        field: "TSK_LOCATION",
                        title: gridstrings.tasklist[lang].location,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "TSK_LOCATIONDESC",
                        title: gridstrings.tasklist[lang].locationdesc,
                        width: 250
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
                        field: "TSK_PRIORITYDESC",
                        title: gridstrings.tasklist[lang].prioritydesc,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TSK_CANCELLATIONREASONDESC",
                        title: gridstrings.tasklist[lang].cancellationreasondesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "TSK_ORGANIZATION",
                        title: gridstrings.tasklist[lang].organization,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "TSK_DEPARTMENT",
                        title: gridstrings.tasklist[lang].department,
                        width: 130
                    },
                    {
                        type: "datetime",
                        field: "TSK_CREATED",
                        title: gridstrings.tasklist[lang].created,
                        width: 250
                    },
                    { type: "string", field: "TSK_CREATEDBY", title: gridstrings.tasklist[lang].createdby, width: 250 },
                    { type: "string", field: "TSK_CREATEDBYDESC", title: gridstrings.tasklist[lang].createdbydesc, width: 250 },
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
                    { type: "string", field: "TSK_REQUESTEDBY", title: gridstrings.tasklist[lang].requestedby, width: 250 },
                    { type: "string", field: "TSK_REQUESTEDBYDESC", title: gridstrings.tasklist[lang].requestedbydesc, width: 250 },
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
                        field: "TSK_REGION",
                        title: gridstrings.tasklist[lang].region,
                        width: 250
                    },
                    {
                        type: "number",
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
                        field: "TSK_TSATRADEDESC",
                        title: gridstrings.taskactivities[lang].tradedesc,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "TSK_TSAMOBILENOTE",
                        title: gridstrings.taskactivities[lang].mobilenote,
                        width: 350
                    },
                    {
                        type: "datetime",
                        field: "TSK_TSASCHFROM",
                        title: gridstrings.taskactivities[lang].schfrom,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "TSK_TSASCHTO",
                        title: gridstrings.taskactivities[lang].schto,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "TSK_PTASK",
                        title: gridstrings.tasklist[lang].periodictask,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "TSK_TSAINVOICE",
                        title: gridstrings.taskactivities[lang].invoice,
                        width: 250
                    },
                    {
                        type: "string",
                        field: "TSK_QUOTATIONSTATUS",
                        title: gridstrings.taskactivities[lang].quotationstatus,
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
                    TSK_TSASCHFROM: { type: "date" },
                    TSK_TSASCHTO: { type: "date" },
                    TSK_TSALINE: { type: "number" },
                    TSK_TSAINVOICE: { type: "number" }
                },
                datasource: "/Api/ApiTask/ListActivities",
                selector: "#grdTaskActivities",
                name: "grdTaskActivities",
                screen: "SOLUTIONPARTNERACTIVITIES",
                height: 300,
                primarycodefield: "TSK_ID",
                primarytextfield: "TSK_SHORTDESC",
                visibleitemcount: 10,
                filter: gridfilter,
                filterlogic: "or",
                hasfiltermenu: true,
                sort: [{ field: "TSK_ID", dir: "desc" }],
                toolbarColumnMenu: true,
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskActivities.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                    ]
                },
                databound: gridDataBound
            });

        };
        this.Check = new function () {
            var acref = this;

            this.CheckIfAuthorized = function (dep) {
                //return usergroup === "ADMIN" ||
                //    $.inArray(dep, lmdepartments) !== -1 ||
                //    $.inArray("*", lmdepartments) !== -1;
                return true;
            };
            this.CheckIfLMOfAny = function () {
                return (lmdepartments.length > 0);
            };
            this.CheckIfActivityCompletedOrRejected = function () {
                if (!selectedActivity) return false;
                return (selectedActivity.TSA_COMPLETED === "+" || selectedActivity.TSA_STATUS === "REJ");
            };
            this.CheckIfActivityRejected = function () {
                if (!selectedActivity) return false;
                return (selectedActivity.TSA_STATUS === "REJ");
            };
            this.CheckIfActivityApprovedOrNA = function () {
                if (!selectedActivity) return false;
                return ($.inArray(selectedActivity.TSA_STATUS, ["APP", "NA"]) !== -1);
            };
            this.CheckIfInAssignedUsers = function () {
                if (!selectedActivity || !selectedActivity.TSA_ASSIGNEDTOARR) return false;
                var result = $.grep(selectedActivity.TSA_ASSIGNEDTOARR,
                    function (i) {
                        return i.USR_CODE === user ||
                            (i.USR_CODE === "*" && i.USR_DEPARTMENT === selectedActivity.TSA_DEPARTMENT);
                    });
                return (result && result.length > 0);
            };
        };
        var RegisterUIEvents = function () {

            $("#btnActivityEquipmentMaintenance").click(aeq.showActivityEquipmentMaintenanceModal);
            $("#btnBookedHours").click(function () {
                bhrs.showModal();
            });
            $("#btnActivityServiceCode").click(asr.showActivityServiceCodesModal);
            $("#btnMiscCostPart").click(function () {
                miscCostParentType = "PART";
                $("#msctitle").text("Malzeme Kullanımı");
                $("#alert").attr("hidden", true);
                msc.showMiscCostModal();
            });
            $("#btnIssueReturn").click(function () {
                issueReturn.showIssueReturnModel();
            });
            $("#btnMiscCostServiceCodes").click(function () {
                miscCostParentType = "SERVICE";
                $("#msctitle").text("Diğer Harcamalar");
                $('#alert').attr("hidden", false);
                msc.showMiscCostModal();
            });
            $("#btnCompleteActivity").click(function () {
                $("#completeActivity").modal("show");
            });
            $("#btnTaskPricing").click(function () {
                var columns = [
                    {
                        type: "number",
                        field: "TPR_ACTIVITY",
                        title: gridstrings.solutionpartnertaskpricing[lang].activity,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "TPR_TYPE",
                        title: gridstrings.solutionpartnertaskpricing[lang].type,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_CODE",
                        title: gridstrings.solutionpartnertaskpricing[lang].code,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_DESC",
                        title: gridstrings.solutionpartnertaskpricing[lang].desc,
                        width: 300
                    },
                    {
                        type: "qty",
                        field: "TPR_QTY",
                        title: gridstrings.solutionpartnertaskpricing[lang].qty,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_UOM",
                        title: gridstrings.solutionpartnertaskpricing[lang].uom,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_UNITPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].unitprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_TOTALPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].totalunitprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_UNITSALESPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].unitsalesprice,
                        width: 150
                    },
                    {
                        type: "price",
                        field: "TPR_TOTALSALESPRICE",
                        title: gridstrings.solutionpartnertaskpricing[lang].unittotalsalesprice,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_CURR",
                        title: gridstrings.solutionpartnertaskpricing[lang].curr,
                        width: 150
                    },
                    {
                        type: "string",
                        field: "TPR_PRICINGMETHOD",
                        title: gridstrings.solutionpartnertaskpricing[lang].from,
                        width: 150
                    },
                    {
                        type: "exch",
                        field: "TPR_EXCH",
                        title: gridstrings.solutionpartnertaskpricing[lang].exch,
                        width: 150
                    }
                ];

                var fields = {
                    TPR_QTY: { type: "number" },
                    TPR_TOTALSALESPRICE: { type: "number" },
                    TPR_UNITSALESPRICE: { type: "number" },
                    TPR_TOTALPRICE: { type: "number" },
                    TPR_UNITPRICE: { type: "number" },
                    TPR_EXCH: { type: "number" }
                };
                if (supplier) {
                    columns = $.grep(columns,
                        function (e) {
                            return ($.inArray(e.field, ["TPR_UNITSALESPRICE", "TPR_TOTALSALESPRICE"]) == -1);
                        });
                    delete fields.TPR_UNITSALESPRICE;
                    delete fields.TPR_TOTALSALESPRICE;
                }

                gridModal.show({
                    modaltitle: gridstrings.solutionpartnertaskpricing[lang].title,
                    listurl: "/Api/ApiTask/TaskPricing",
                    keyfield: "TPR_ID",
                    columns: columns,
                    fields: fields,
                    filter: [
                        { field: "TPR_TASK", value: selectedTask.TSK_ID, operator: "eq" },
                        { field: "TPR_ACTIVITY", value: selectedActivity.TSA_LINE, operator: "eq" }
                    ]
                });
            });
            $("#btnSaveCompleteActivity").click(function () {
                if (stateType === "HOLD") {
                    HoldTask();
                }
                else if (stateType === "COMPLETE") {
                    CompleteActivity();
                }
            });
            $("#btnCloseActivity").click(CloseActivity);
            $("#activityclosetype").change(function () {
                var closetype = $("#activityclosetype").val();
                if (closetype === "KESIF") {
                    $("#teklifwarning").removeClass("hidden");
                } else {
                    $("#teklifwarning").addClass("hidden");
                }
            });
            $('#statetype').off('change').on('change', function () {
                $(".typeselected").addClass("hidden");
                $("#teklifwarning").addClass("hidden");
                stateType = null;
                if (this.value === "COMPLETE") {
                    $(".typeselected").removeClass("hidden");
                    stateType = this.value;
                    var holdreason = $("#activityclosetype");
                    holdreason.find("option:not(.default)").remove();
                    var strOptions = "";
                    strOptions += " <option value=\"ACTIVITY\">" + applicationstrings[lang].activitycomplete + "</option>";
                    strOptions += " <option value=\"KESIF\">" + applicationstrings[lang].estimationcompleted + "</option>";

                    holdreason.append(strOptions);
                } else if (this.value === "HOLD") {
                    stateType = this.value;
                    $(".typeselected").removeClass("hidden");
                    LoadHoldReasons();
                }
            });
            $("#btntskeqp").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.equipments[lang].title,
                    listurl: "/Api/ApiEquipments/List",
                    keyfield: "EQP_CODE",
                    codefield: "EQP_CODE",
                    textfield: "EQP_DESC",
                    returninput: "#tskeqp",
                    columns: [
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 100 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 300 },
                        { type: "string", field: "EQP_TYPE", title: gridstrings.equipments[lang].eqptype, width: 250 },
                        { type: "string", field: "EQP_BRANDDESC", title: gridstrings.equipments[lang].branddesc, width: 250 },
                        { type: "string", field: "EQP_MODEL", title: gridstrings.equipments[lang].model, width: 250 },
                        { type: "string", field: "EQP_SERIALNO", title: gridstrings.equipments[lang].serialno, width: 250 }
                    ],
                    filter: [
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                        { field: "EQP_ORG", value: [selectedTask.TSK_ORGANIZATION, "*"], operator: "in" },
                        { field: "EQP_LOCATION", value: [selectedTask.TSK_LOCATION, "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        tooltip.hide("#equipment");
                        $("#tskeqp").data("id", (d ? d.EQP_ID : null));
                        $("#tskeqp").val(d ? d.EQP_CODE + ' - ' + d.EQP_TYPEDESC : "");
                        if (d) {
                            tooltip.show("#tskeqp", d.EQP_DESC);
                            if (d.EQP_ID != null && d.EQP_ID !== 0) {
                                //CALL UPDATE
                                UpdateTaskEquipment(d.EQP_ID);
                            }
                        }
                    }
                });
            });
            $("#btnContactInfo").click(function () {
                return tms.Ajax({
                    url: "/Api/ApiTask/GetTaskContactInfo",
                    data: JSON.stringify(selectedTask.TSK_ID),
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
            $("#btnDownload").on("click",
                function () {
                    window.location = "/Download.ashx?subject=TASK&source=" + selecteditem.TSK_ID;
                });

            $("#btnsaveplandate").on("click", function () {
                if (selecteditem) {
                    var plndate = $("#plndate").val();
                    if (plndate) {
                        selectedActivity.TSA_SCHFROM = moment.utc(plndate, constants.longdateformat);
                        selectedActivity.TSA_SCHTO = moment.utc(plndate, constants.longdateformat);
                        selectedActivity.TSA_PROJECTEDTIME = 0;
                        selectedActivity.TSA_UPDATEDBY = user;
                        selectedActivity.TSA_UPDATED = tms.Now();

                       

                        var m = {
                            TaskActivity: selectedActivity,
                            Reason: "NA"
                        };

                        return tms.Ajax({
                            url: "/Api/ApiTaskActivities/Save",
                            data: JSON.stringify(m),
                            fn: function (d) {
                                msgs.success(d.data);
                                selectedActivity = d.taskactivity;
                                $("#plannedstart").val(moment(selectedActivity.TSA_SCHFROM).format(constants.longdateformat));
                                List();
                            }
                        });
                    }
       

                }
            });

            $("#quomodal").click(function () {
                if (selectedActivity.TSA_COMPLETED === '+') {
                    msgs.error(applicationstrings[lang].tsacompleted);
                }
                else {
                    $("#modalQuotation").modal().show();
                }
                
            });
            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentcounttext: "#actdocumentscnt",
                modal: "#modaldocuments",
                documentsdiv: "#docs",
                progressbar: "#docuprogress",
                downloadbutton: "#btnDownload"
            });
            commentsHelper = new comments({
                input: "#comment",
                chkvisibletocustomer: "#visibletocustomer",
                btnaddcomment: "#addComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
                commentsdiv: "#comments"
            });

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
        this.BuildUI = function () {
            $("#btnActivityComments").click(function () {
                var id = selectedActivity.TSA_TASK;
                commentsHelper.showCommentsModal({
                    subject: "TASK",
                    source: id
                });
            });
            $("#btnActivityDocuments").click(function () {
                var id = selectedActivity.TSA_TASK;
                documentsHelper.showDocumentsModal({
                    subject: "TASK",
                    source: id
                });
            });
            self.ResetUI();
            List();
        };
        RegisterUIEvents();

    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                if (!$("#btnSave").prop("disabled")) {
                                    spa.Save();
                                }
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    f: function () {
                        if (!$("#btnNew").prop("disabled"))
                            spa.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    f: function () {
                        if (!$("#btnUndo").prop("disabled"))
                            spa.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    f: function () {
                        if (!$("#btnDelete").prop("disabled"))
                            spa.Remove();
                    }
                },
                {
                    k: "ctrl+h",
                    f: function () {
                        if (!$("#btnHistory").prop("disabled"))
                            spa.HistoryModal();
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
                    if (selectedActivity) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
        this.ContextMenu = function () {
            $.contextMenu({
                selector: "#pagediv",
                build: function ($trigger, e) {
                    if (e.target.nodeName === "DIV")
                        return {
                            zIndex: 10,
                            items: {
                                quotation: {
                                    name: applicationstrings[lang].quotations,
                                    disabled: function (key, opt) {
                                        return selectedTask.TSK_QUOTATION == "-";
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html('<span><i class="fa fa-usd" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/Quotations/ListByTask/" + selectedTask.TSK_ID, "_blank");
                                    }
                                },
                                quototask: {
                                    name: applicationstrings[lang].quototask,
                                    disabled: function (key, opt) {
                                        return (!selectedActivity || spa.CheckIfActivityCompletedOrRejected() || !selectedquotation);
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        $("#quototaskdiv").modal("show");
                                        quototask.ListQuotations();
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
                                        $itemElement.html(
                                            '<span><i class="fa fa-external-link" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
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
        };
    };

    function ready() {
        spa.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());