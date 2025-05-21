(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var selectedorganization = null;
    var quotationid = 0;
    var quoactivity = null;
    var partcount = 0;
    var scr, quo;

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
            name: "quotationlabors",
            btns: []
        },
        {
            name: "quotationparts",
            btns: []
        },
        {
            name: "quotationmisccosts",
            btns: []
        },
        {
            name: "quotationsum",
            btns: []
        },
        {
            name: "quotationsales",
            btns: []
        }
    ];

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
                    Line: selectedrecord.QUO_ACTIVITY,
                    User: user
                }
                listofchecked.push(o);
            }

            var p = {
                Task: selectedrecord.QUO_TASK,
                Activity: quoactivity.TSA_ID,
                Lines: listofchecked
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
                { field: "QLN_QUOTATION", value: selectedrecord.QUO_ID, operator: "eq", logic: "and" },
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
                        { field: "QUO_TASK", value: quoactivity.TSA_TASK, operator: "eq", logic: "and" },
                        { field: "QUO_ACTIVITY", value: quoactivity.TSA_LINE, operator: "eq", logic: "and" },
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
        this.GetAndCheckIfActivityCompletedOrRejected = function () {
              tms.Ajax({
               url: "/Api/ApiTaskActivities/Get",
               data: JSON.stringify($("#activity").find("option:selected").data("tsaid")),
               type: "POST",
                fn: function (d) {
                    quoactivity = d.data;
                    if (!quoactivity)
                        return false;
                    return (quoactivity.TSA_CHK02 === "+" || quoactivity.TSA_STATUS === "REJ");
                   
                }
            });
        }
        RegisterUIEvents();
    };
    var shr = new function () {
        this.CalculateExch = function (curr, basecurr) {
            if (!curr)
                return $.Deferred().reject();
            var exch = {
                CRR_CURR: curr,
                CRR_BASECURR: selectedrecord ? selectedrecord.QUO_ORGANIZATIONCURR : basecurr || (selectedorganization ? selectedorganization.ORG_CURRENCY : null),
                CRR_STARTDATE: moment()
            };
            return tms.Ajax({
                url: "/Api/ApiExchRates/QueryExch",
                data: JSON.stringify(exch)
            });
        };
    }
    var lab = new function () {
        var self = this;
        var $grdQuotationLabors = $("#grdQuotationLabors");
        var grdQuotationLabors = null;
        var selectedlabor = null;
        var selectedassignedto = null;

        var GetContractServiceCodePrice = function (servicecode) {

            var gridreq = {
                sort: [{ field: "CSP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetServicePriceForQuotation", value: selectedrecord.QUO_ID, value2: servicecode, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractServicePrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var ModifyRequiredFields = function (laborunitpurchaseprice, laborunitsalesprice) {
            if (laborunitpurchaseprice != null) {
                $("#laborpurchasepricecurr").attr("required", "required").addClass("required");
                $("#laborpurchaseexch").attr("required", "required").addClass("required");
            } else {
                $("#laborpurchasepricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#laborpurchaseexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }

            if (laborunitsalesprice != null) {
                $("#laborsalespricecurr").attr("required", "required").addClass("required");
                $("#laborsalesexch").attr("required", "required").addClass("required");
            } else {
                $("#laborsalespricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#laborsalesexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }
        }
        var ModifyPricingSection = function () {
            var laborperiod = ($("#laborperiod").val() || null);
            var laborunitpurchaseprice = ($("#laborunitpurchaseprice").val() || null);
            var laborunitsalesprice = ($("#laborunitsalesprice").val() || null);
            var laborpurchasediscountrate = ($("#laborpurchasediscountrate").val() || null);
            var laborsalesdiscountrate = ($("#laborsalesdiscountrate").val() || null);
            var laborpurchasediscountedunitprice = null;
            var laborsalesdiscountedunitprice = null;

            ModifyRequiredFields(laborunitpurchaseprice, laborunitsalesprice);

            $("#laborpurchasediscountedunitprice").val("");
            if (laborunitpurchaseprice && laborpurchasediscountrate) {
                laborpurchasediscountedunitprice = (laborunitpurchaseprice * (100 - laborpurchasediscountrate)) / 100;
                $("#laborpurchasediscountedunitprice")
                    .val(laborpurchasediscountedunitprice.fixed(constants.pricedecimals));
            }
            $("#laborsalesdiscountedunitprice").val("");
            if (laborunitsalesprice && laborsalesdiscountrate) {
                laborsalesdiscountedunitprice = (laborunitsalesprice * (100 - laborsalesdiscountrate)) / 100;
                $("#laborsalesdiscountedunitprice").val(laborsalesdiscountedunitprice.fixed(constants.pricedecimals));
            }

            $("#labortotalpurchaseprice").val("");
            if (laborperiod && laborunitpurchaseprice)
                $("#labortotalpurchaseprice")
                    .val((laborperiod * (laborpurchasediscountedunitprice || laborunitpurchaseprice)).fixed(
                        constants.pricedecimals));

            $("#labortotalsalesprice").val("");
            if (laborperiod && laborunitsalesprice)
                $("#labortotalsalesprice")
                    .val((laborperiod * (laborsalesdiscountedunitprice || laborunitsalesprice)).fixed(
                        constants.pricedecimals));
        }
        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMQUOTATIONLABOR", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.QUO_ID, operator: "eq" }
                ]
            });
        };
        this.ResetUI = function () {
            selectedlabor = null;
            tms.UnBlock("#quotationlaborsform");
            tms.Reset("#quotationlabors");

            $("#laborid").val("");
            $("#laborperiod").val("1");
            $("#labortrade").val("");
            $("#laborservicecode").val("");
            $("#assignedto").tagsinput("removeAll");
            $("#assignedtocnt").text("");
            $("#laborunitpurchaseprice").val("");
            $("#laborreference").val("");
            $("#laborpurchasediscountrate").val("");
            $("#laborpurchasediscountedunitprice").val("");
            $("#labortotalpurchaseprice").val("");
            $("#laborunitsalesprice").val("");
            $("#laborsalesdiscountrate").val("");
            $("#laborsalesdiscountedunitprice").val("");
            $("#labortotalsalesprice").val("");
            $("#laborsalespricecurr").val("");
            $("#laborpurchasepricecurr").val("");
            $("#laborpurchaseexch").val("");
            $("#laborsalesexch").val("");

            ModifyRequiredFields(null, null);

            tooltip.hide("#laborpurchasepricecurr");
            tooltip.hide("#laborsalespricecurr");
            tooltip.hide("#labortrade");
            tooltip.hide("#laborservicecode");

            $("#laborunitsalesprice").prop("disabled", false);
            $("#laborpurchasediscountrate").prop("disabled", false);
            $("#laborsalespricecurr").prop("disabled", false);
            $("#btnlaborsalespricecurr").prop("disabled", false);

            $("#laborunitpurchaseprice").prop("disabled", false);
            $("#laborsalesdiscountrate").prop("disabled", false);
            $("#laborpurchasepricecurr").prop("disabled", false);
            $("#btnlaborpurchasepricecurr").prop("disabled", false);
            $("#laborpurchaseexch").prop("disabled", false);

            if (supplier)
                $("#quotationlabors_sales").hide();

            if (selectedstatus.STA_PCODE === "C") tms.Block("#quotationlaborsform");
        }
        var FillUserInterface = function () {
            tms.UnBlock("#quotationlaborsform");
            tms.BeforeFill("#quotationlabors");

            $("#laborid").val(selectedlabor.LAB_ID);
            $("#laborperiod").val(selectedlabor.LAB_PERIOD);
            $("#laborperiodunit").val(selectedlabor.LAB_PERIODUNIT);
            $("#labortrade").val(selectedlabor.LAB_TRADE);
            $("#laborservicecode").val(selectedlabor.LAB_SERVICECODE);
            $("#laborunitpurchaseprice").val(selectedlabor.LAB_UNITPURCHASEPRICE != null
                ? selectedlabor.LAB_UNITPURCHASEPRICE.fixed(constants.pricedecimals)
                : "");
            $("#laborpurchasediscountrate").val(selectedlabor.LAB_PURCHASEDISCOUNTRATE);
            $("#laborpurchasediscountedunitprice").val(selectedlabor.LAB_PURCHASEDISCOUNTEDUNITPRICE != null
                ? selectedlabor.LAB_PURCHASEDISCOUNTEDUNITPRICE.fixed(constants.pricedecimals)
                : "");
            $("#laborunitsalesprice").val(selectedlabor.LAB_UNITSALESPRICE != null
                ? selectedlabor.LAB_UNITSALESPRICE.fixed(constants.pricedecimals)
                : "");
            $("#laborsalesdiscountrate").val(selectedlabor.LAB_SALESDISCOUNTRATE);
            $("#laborsalesdiscountedunitprice").val(selectedlabor.LAB_SALESDISCOUNTEDUNITPRICE != null
                ? selectedlabor.LAB_SALESDISCOUNTEDUNITPRICE.fixed(constants.pricedecimals)
                : "");
            $("#labortotalpurchaseprice").val(selectedlabor.LAB_TOTALPURCHASEPRICE != null
                ? selectedlabor.LAB_TOTALPURCHASEPRICE.fixed(constants.pricedecimals)
                : "");
            $("#labortotalsalesprice").val(selectedlabor.LAB_TOTALSALESPRICE != null
                ? selectedlabor.LAB_TOTALSALESPRICE.fixed(constants.pricedecimals)
                : "");
            $("#laborpurchaseexch").val(selectedlabor.LAB_PURCHASEEXCH != null
                ? selectedlabor.LAB_PURCHASEEXCH.fixed(constants.exchdecimals)
                : "");
            $("#laborsalesexch").val(selectedlabor.LAB_SALESEXCH != null
                ? selectedlabor.LAB_SALESEXCH.fixed(constants.exchdecimals)
                : "");
            $("#laborsalespricecurr").val(selectedlabor.LAB_SALESPRICECURR);
            $("#laborreference").val(selectedlabor.LAB_REFERENCE);
            $("#laborpurchasepricecurr").val(selectedlabor.LAB_PURCHASEPRICECURR);

            ModifyRequiredFields(selectedlabor.LAB_UNITPURCHASEPRICE, selectedlabor.LAB_UNITSALESPRICE);

            $("#assignedtocnt").text("");
            $("#assignedto").tagsinput("removeAll");
            if (selectedlabor.LAB_ASSIGNEDTO != null)
                for (var i = 0; i < selectedassignedto.length; i++) {
                    $("#assignedto").tagsinput("add",
                        { id: selectedassignedto[i].USR_CODE, text: selectedassignedto[i].USR_DESC },
                        ["ignore"]);
                }

            tooltip.show("#labortrade", selectedlabor.LAB_TRADEDESC);
            tooltip.show("#laborsalespricecurr", selectedlabor.LAB_SALESPRICECURRDESC);
            tooltip.show("#laborpurchasepricecurr", selectedlabor.LAB_PURCHASEPRICECURRDESC);
            tooltip.show("#laborservicecode", selectedlabor.LAB_SERVICECODEDESCRIPTION);

            if (selectedstatus.STA_PCODE === "C") tms.Block("#quotationlaborsform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiQuotationLabor/Get",
                data: JSON.stringify(selectedlabor.LAB_ID),
                fn: function (d) {
                    selectedlabor = d.data;
                    selectedassignedto = d.users;
                    FillUserInterface();
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#quotationlabors"))
                return $.Deferred().reject();

            var labor = {
                LAB_ID: selectedlabor ? selectedlabor.LAB_ID : 0,
                LAB_QUOTATION: quotationid,
                LAB_PERIOD: $("#laborperiod").val(),
                LAB_PERIODUNIT: $("#laborperiodunit").val(),
                LAB_TRADE: $("#labortrade").val(),
                LAB_SERVICECODE: $("#laborservicecode").val(),
                LAB_ASSIGNEDTO: ($("#assignedto").val() || null),
                LAB_UNITPURCHASEPRICE: ($("#laborunitpurchaseprice").val() || null),
                LAB_PURCHASEDISCOUNTRATE: ($("#laborpurchasediscountrate").val() || null),
                LAB_PURCHASEDISCOUNTEDUNITPRICE: ($("#laborpurchasediscountedunitprice").val() || null),
                LAB_TOTALPURCHASEPRICE: ($("#labortotalpurchaseprice").val() || null),
                LAB_PURCHASEEXCH: $("#laborpurchaseexch").val(),
                LAB_UNITSALESPRICE: ($("#laborunitsalesprice").val() || null),
                LAB_REFERENCE: ($("#laborreference").val() || null),
                LAB_SALESDISCOUNTRATE: ($("#laborsalesdiscountrate").val() || null),
                LAB_SALESDISCOUNTEDUNITPRICE: ($("#laborsalesdiscountedunitprice").val() || null),
                LAB_TOTALSALESPRICE: ($("#labortotalsalesprice").val() || null),
                LAB_SALESEXCH: ($("#laborsalesexch").val() || null),
                LAB_SALESPRICECURR: ($("#laborsalespricecurr").val() || null),
                LAB_PURCHASEPRICECURR: ($("#laborpurchasepricecurr").val() || null),
                LAB_CREATED: selectedlabor != null ? selectedlabor.LAB_CREATED : tms.Now(),
                LAB_CREATEDBY: selectedlabor != null ? selectedlabor.LAB_CREATEDBY : user,
                LAB_UPDATED: selectedlabor != null ? tms.Now() : null,
                LAB_UPDATEDBY: selectedlabor != null ? user : null,
                LAB_RECORDVERSION: selectedlabor != null ? selectedlabor.LAB_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiQuotationLabor/Save",
                data: JSON.stringify(labor),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        var itemSelect = function (row) {
            selectedlabor = grdQuotationLabors.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            $grdQuotationLabors.find("#btnHistory").off("").on("click", HistoryModal);
        }
        this.List = function () {
            var grdFilter = [
                { field: "LAB_QUOTATION", value: selectedrecord.QUO_ID, operator: "eq", logic: "and" }
            ];
            if (grdQuotationLabors) {
                grdQuotationLabors.ClearSelection();
                grdQuotationLabors.RunFilter(grdFilter);
            } else {
                grdQuotationLabors = new Grid({
                    keyfield: "LAB_ID",
                    columns: [
                        {
                            type: "number",
                            field: "LAB_PERIOD",
                            title: gridstrings.quotationlabors[lang].period,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "LAB_PERIODUNIT",
                            title: gridstrings.quotationlabors[lang].periodunit,
                            width: 150,
                            template: "<span>#= applicationstrings[lang].durationunit[LAB_PERIODUNIT] #</span>"
                        },
                        {
                            type: "string",
                            field: "LAB_REFERENCE",
                            title: gridstrings.quotations[lang].referenceno,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "LAB_SERVICECODE",
                            title: gridstrings.quotationlabors[lang].servicecode,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "LAB_SERVICECODEDESCRIPTION",
                            title: gridstrings.quotationlabors[lang].servicecodedescription,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "LAB_TRADE",
                            title: gridstrings.quotationlabors[lang].trade,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "LAB_ASSIGNEDTO",
                            title: gridstrings.quotationlabors[lang].assignedto,
                            width: 350
                        },
                        {
                            type: "price",
                            field: "LAB_UNITPURCHASEPRICE",
                            title: gridstrings.quotationlabors[lang].unitpurchaseprice,
                            width: 350
                        },
                        {
                            type: "price",
                            field: "LAB_PURCHASEDISCOUNTEDUNITPRICE",
                            title: gridstrings.quotationlabors[lang].discountedunitpurchaseprice,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "LAB_TOTALPURCHASEPRICE",
                            title: gridstrings.quotationlabors[lang].totalpurchaseprice,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "LAB_PURCHASEPRICECURR",
                            title: gridstrings.quotationlabors[lang].curr,
                            width: 250
                        },
                        {
                            type: "exch",
                            field: "LAB_PURCHASEEXCH",
                            title: gridstrings.quotationlabors[lang].exch,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "LAB_UNITSALESPRICE",
                            title: gridstrings.quotationlabors[lang].unitsalesprice,
                            width: 350
                        },
                        {
                            type: "price",
                            field: "LAB_SALESDISCOUNTEDUNITPRICE",
                            title: gridstrings.quotationlabors[lang].discountedunitsalesprice,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "LAB_TOTALSALESPRICE",
                            title: gridstrings.quotationlabors[lang].totalsalesprice,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "LAB_SALESPRICECURR",
                            title: gridstrings.quotationlabors[lang].curr,
                            width: 250
                        },
                        {
                            type: "exch",
                            field: "LAB_SALESEXCH",
                            title: gridstrings.quotationlabors[lang].exch,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "LAB_CREATED",
                            title: gridstrings.quotationlabors[lang].created,
                            width: 250
                        }, {
                            type: "string",
                            field: "LAB_CREATEDBY",
                            title: gridstrings.quotationlabors[lang].createdby,
                            width: 250
                        }, {
                            type: "datetime",
                            field: "LAB_UPDATED",
                            title: gridstrings.quotationlabors[lang].updated,
                            width: 250
                        }, {
                            type: "string",
                            field: "LAB_UPDATEDBY",
                            title: gridstrings.quotationlabors[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        LAB_DATE: { type: "date" },
                        LAB_PERIOD: { type: "number" },
                        LAB_UNITPURCHASEPRICE: { type: "number" },
                        LAB_TOTALPURCHASEPRICE: { type: "number" },
                        LAB_UNITSALESPRICE: { type: "number" },
                        LAB_PURCHASEDISCOUNTEDUNITPRICE: { type: "number" },
                        LAB_SALESDISCOUNTEDUNITPRICE: { type: "number" },
                        LAB_TOTALSALESPRICE: { type: "number" },
                        LAB_PURCHASEEXCH: { type: "number" },
                        LAB_SALESEXCH: { type: "number" },
                        LAB_CREATED: { type: "date" },
                        LAB_UPDATED: { type: "date" }
                    },
                    loadall: true,
                    datasource: "/Api/ApiQuotationLabor/List",
                    selector: "#grdQuotationLabors",
                    name: "grdQuotationLabors",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "LAB_ID", dir: "desc" }],
                    change: gridChange,
                    databound: gridDataBound,
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Labors.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>"
                        ]
                    }
                });
            }
        }
        this.Delete = function () {
            if (selectedlabor) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiQuotationLabor/DelRec",
                            data: JSON.stringify(selectedlabor.LAB_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var UpdateExch = function () {
            var purchasepricecurr = $("#laborpurchasepricecurr").val();
            var salespricecurr = $("#laborsalespricecurr").val();
            if (purchasepricecurr) {
                $.when(shr.CalculateExch(purchasepricecurr)).done(function (d) {
                    if (d.data) {
                        $("#laborpurchaseexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#laborpurchaseexch").val("");
                    }
                });
            }
            if (salespricecurr) {
                $.when(shr.CalculateExch(salespricecurr)).done(function (d) {
                    if (d.data) {
                        $("#laborsalesexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#laborsalesexch").val("");
                    }
                });
            }
        }

        var RgstrTabEvents = function () {
            $("#btnSaveQuotationLabor").click(self.Save);
            $("#btnAddQuotationLabor").click(self.ResetUI);
            $("#btnDeleteQuotationLabor").click(self.Delete);

            $("#btnlabortrade").click(function () {
                var filter = [
                    { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                    { field: "TRD_ORGANIZATION", value: [selectedrecord.QUO_ORGANIZATION, "*"], operator: "in" },
                    { field: "TRD_DEPARTMENT", value: ["OPERASYON", "*"], operator: "in" }
                ];

                if (selectedrecord.QUO_SUPPLIER) {
                    filter.push({
                        field: "TRD_SUPPLIER",
                        value: selectedrecord.QUO_SUPPLIER,
                        operator: "eq",
                        logic: "or"
                    });
                    filter.push({ field: "TRD_CODE", value: "*", operator: "eq", logic: "or" });
                }

                gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#labortrade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }
                    ],
                    filter: filter,
                    callback: function (data) {
                        if (data.TRD_CODE !== "*") $("#assignedto").tagsinput("removeAll");
                        $("#assignedto,#btnAssignedTo").prop("disabled", data.TRD_CODE !== "*");
                    }
                });
            });
            $("#btnlaborpurchasepricecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#laborpurchasepricecurr",
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
            $("#btnlaborsalespricecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#laborsalespricecurr",
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
            $("#btnlaborservicecode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.servicecodes[lang].title,
                    modalinfo: applicationstrings[lang].servicecodesmodalinfo,
                    listurl: "/Api/ApiServiceCodes/List",
                    keyfield: "SRV_CODE",
                    codefield: "SRV_CODE",
                    textfield: "SRV_DESCRIPTIONF",
                    returninput: "#laborservicecode",
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
                        { field: "SRV_ORG", value: [selectedrecord.QUO_ORGANIZATION, "*"], operator: "in" },
                        { field: "IsContractedQuotationServiceCode", value: selectedrecord.QUO_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.servicecodes[lang].contractedservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedQuotationServiceCode", value: selectedrecord.QUO_ID, operator: "custom" }
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
                            $(id).comboTree({
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

                        ModifyRequiredFields(null, d ? d.SRV_UNITSALESPRICE : null);
                        return $.when(GetContractServiceCodePrice(d.SRV_CODE)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#laborreference").val(r.CSP_REFERENCE);
                                if (r.CSP_UNITPURCHASEPRICE) {
                                    $("#laborunitpurchaseprice").val(r.CSP_UNITPURCHASEPRICE);
                                    $("#laborpurchasepricecurr").val(r.CSP_CURR);
                                }
                                if (r.CSP_UNITSALESPRICE) {
                                    $("#laborunitsalesprice").val(r.CSP_UNITSALESPRICE);
                                    $("#laborsalespricecurr").val(r.CSP_CURR);
                                }
                                ModifyPricingSection();
                            }
                            return UpdateExch();
                        });
                    }
                 });
            });

            $("#labortrade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    {
                        field: "TRD_ORGANIZATION",
                        func: function () { return selectedrecord.QUO_ORGANIZATION; },
                        includeall: true
                    },
                    { field: "TRD_DEPARTMENT", value: ["OPERASYON", "*"], operator: "in" }
                ],
                beforeFilter: function () {
                    if (selectedrecord.QUO_SUPPLIER)
                        return [
                            { field: "TRD_SUPPLIER", value: selectedrecord.QUO_SUPPLIER, operator: "eq", logic: "or" },
                            { field: "TRD_CODE", value: "*", operator: "eq", logic: "or" }
                        ];
                },
                callback: function (data) {
                    if (data.TRD_CODE !== "*") $("#assignedto").tagsinput("removeAll");
                    $("#assignedto,#btnAssignedTo").prop("disabled", data.TRD_CODE !== "*");
                }
            });
            $("#laborpurchasepricecurr").autocomp({
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
            $("#laborsalespricecurr").autocomp({
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
            $("#laborservicecode").autocomp({
                listurl: "/Api/ApiServiceCodes/List",
                geturl: "/Api/ApiServiceCodes/Get",
                field: "SRV_CODE",
                textfield: "SRV_DESCRIPTIONF",
                active: "SRV_ACTIVE",
                termisnumeric: true,
                filter: [{ field: "SRV_ORG", func: function () { return selectedrecord.QUO_ORGANIZATION; }, includeall: true }],
                callback : function(d) {
                    ModifyRequiredFields(null, d ? d.SRV_UNITSALESPRICE : null);
                    return $.when(GetContractServiceCodePrice(d.SRV_CODE)).done(function (p) {
                        if (p.data && p.data.length > 0) {
                            var r = p.data[0];
                            $("#laborreference").val(r.CSP_REFERENCE);
                            if (r.CSP_UNITPURCHASEPRICE) {
                                $("#laborunitpurchaseprice").val(r.CSP_UNITPURCHASEPRICE);
                                $("#laborpurchasepricecurr").val(r.CSP_CURR);
                            }
                            if (r.CSP_UNITSALESPRICE) {
                                $("#laborunitsalesprice").val(r.CSP_UNITSALESPRICE);
                                $("#laborsalespricecurr").val(r.CSP_CURR);
                            }
                            ModifyPricingSection();
                        }
                        return UpdateExch();
                    });
                }
            });

            $("#btnAssignedTo").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#assignedto",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", selectedrecord.QUO_ORGANIZATION], operator: "in" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.user[lang].allusers,
                            filter: [
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        },
                        {
                            text: gridstrings.user[lang].departmentusers,
                            filter: [
                                { field: "USR_DEPARTMENT", value: task.TSK_DEPARTMENT, operator: "eq" },
                                { field: "USR_ACTIVE", value: "+", operator: "eq" },
                                { field: "USR_CODE", value: "*", operator: "neq" }
                            ]
                        }
                    ]
                });
            });
            $("#assignedto").on("itemAdded",
                function () {
                    $("#assignedtocnt").text("(" +
                        $("#assignedto").tagsinput("items").length +
                        " " +
                        applicationstrings[lang].person +
                        ")");
                }).on("itemRemoved",
                    function () {
                        var itemcount = $("#assignedto").tagsinput("items").length;
                        $("#assignedtocnt").text(itemcount !== 0
                            ? "(" + itemcount + " " + applicationstrings[lang].person + ")"
                            : "");
                    });

            $("#labordate").on("dp.change",
                function (e) {
                    var preDate = moment(e.oldDate, constants.dateformat);
                    var newDate = moment(e.date, constants.dateformat);
                    if (preDate !== newDate) {
                        return UpdateExch();
                    }
                });
            $("#quotationlabors input[calc-group=\"1\"]").on("blur",
                function () {
                    return UpdateExch();
                });
            $("#quotationlabors input[calc-group=\"2\"]").on("blur",
                function () {
                    return UpdateExch();
                });
            $("#quotationlabors input[calc-group=\"3\"]").on("blur",
                function () {
                    return ModifyPricingSection();
                });
        }
        RgstrTabEvents();
    }
    var par = new function () {
        var self = this;
        var $grdQuotationParts = $("#grdQuotationParts");
        var grdQuotationParts = null;
        var selectedquotationpart = null;

        var GetContractPartPrice = function (part) {

            var gridreq = {
                sort: [{ field: "CPP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetPartPriceForQuotation", value: selectedrecord.QUO_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }
        var ModifyRequiredFields = function (partunitpurchaseprice, partunitsalesprice) {
            if (partunitpurchaseprice != null) {
                $("#partpurchasepricecurr").attr("required", "required").addClass("required");
                $("#partpurchaseexch").attr("required", "required").addClass("required");
            } else {
                $("#partpurchasepricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#partpurchaseexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }

            if (partunitsalesprice != null) {
                $("#partsalespricecurr").attr("required", "required").addClass("required");
                $("#partsalesexch").attr("required", "required").addClass("required");
            } else {
                $("#partsalespricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#partsalesexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }
        }
        var ModifyPricingSection = function () {
            var quotationpartqty = ($("#quotationpartqty").val() || null);
            var partunitpurchaseprice = ($("#partunitpurchaseprice").val() || null);
            var partunitsalesprice = ($("#partunitsalesprice").val() || null);
            var partpurchasediscountrate = ($("#partpurchasediscountrate").val() || null);
            var partsalesdiscountrate = ($("#partsalesdiscountrate").val() || null);
            var partpurchasediscountedunitprice = null;
            var partsalesdiscountedunitprice = null;

            ModifyRequiredFields(partunitpurchaseprice, partunitsalesprice);

            $("#partpurchasediscountedunitprice").val("");
            if (partunitpurchaseprice && partpurchasediscountrate) {
                partpurchasediscountedunitprice = (partunitpurchaseprice * (100 - partpurchasediscountrate)) / 100;
                $("#partpurchasediscountedunitprice")
                    .val(partpurchasediscountedunitprice.fixed(constants.pricedecimals));
            }

            $("#partsalesdiscountedunitprice").val("");
            if (partunitsalesprice && partsalesdiscountrate) {
                partsalesdiscountedunitprice = (partunitsalesprice * (100 - partsalesdiscountrate)) / 100;
                $("#partsalesdiscountedunitprice").val(partsalesdiscountedunitprice.fixed(constants.pricedecimals));
            }

            $("#parttotalpurchaseprice").val("");
            if (quotationpartqty && partunitpurchaseprice)
                $("#parttotalpurchaseprice")
                    .val((quotationpartqty * (partpurchasediscountedunitprice || partunitpurchaseprice)).fixed(
                        constants.pricedecimals));

            $("#parttotalsalesprice").val("");
            if (quotationpartqty && partunitsalesprice)
                $("#parttotalsalesprice")
                    .val((quotationpartqty * (partsalesdiscountedunitprice || partunitsalesprice)).fixed(
                        constants.pricedecimals));
        }
        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMQUOTATIONPART", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.QUO_ID, operator: "eq" }
                ]
            });
        };
        this.ResetUI = function () {
            selectedquotationpart = null;
            tms.UnBlock("#quotationpartsform");
            tms.Reset("#quotationparts");

            $("#partid").val("");
            $("#quopart").data("id", null);
            $("#quopart").val("");
            $("#partdesc").val("");
            $("#partuom").val("");
            $("#partreference").val("");
            $("#quotationpartqty").val("");
            $("#partunitpurchaseprice").val("");
            $("#partpurchasediscountrate").val("");
            $("#partpurchasediscountedunitprice").val("");
            $("#parttotalpurchaseprice").val("");
            $("#partunitsalesprice").val("");
            $("#partsalesdiscountrate").val("");
            $("#partsalesdiscountedunitprice").val("");
            $("#parttotalsalesprice").val("");
            $("#partsalespricecurr").val("");
            $("#partpurchasepricecurr").val("");
            $("#partpurchaseexch").val("");
            $("#partsalesexch").val("");
            $("#partbrand").val("");

            ModifyRequiredFields(null, null);

            tooltip.hide("#quopart");
            tooltip.hide("#partpurchasepricecurr");
            tooltip.hide("#partsalespricecurr");

            $("#partunitsalesprice").prop("disabled", false);
            $("#partpurchasediscountrate").prop("disabled", false);
            $("#partsalespricecurr").prop("disabled", false);
            $("#btnpartsalespricecurr").prop("disabled", false);

            $("#partunitpurchaseprice").prop("disabled", false);
            $("#partsalesdiscountrate").prop("disabled", false);
            $("#partpurchasepricecurr").prop("disabled", false);
            $("#btnpartpurchasepricecurr").prop("disabled", false);
            $("#partpurchaseexch").prop("disabled", false);

            if (supplier)
                $("#quotationparts_sales").hide();

            if (selectedstatus.STA_PCODE === "C") tms.Block("#quotationpartsform");
        }
        var FillUserInterface = function () {
            tms.UnBlock("#quotationpartsform");
            tms.BeforeFill("#quotationparts");

            $("#partid").val(selectedquotationpart.PAR_ID);
            $("#quopart").data("id", selectedquotationpart.PAR_PART);
            $("#quopart").val(selectedquotationpart.PAR_PARTCODE);
            $("#partdesc").val(selectedquotationpart.PAR_PARTDESC);
            $("#partbrand").val(selectedquotationpart.PAR_BRAND);
            $("#partreference").val(selectedquotationpart.PAR_REFERENCE);
            $("#partuom").val(selectedquotationpart.PAR_PARTUOM);
            $("#quotationpartqty").val(selectedquotationpart.PAR_QTY);
            $("#partunitpurchaseprice").val(selectedquotationpart.PAR_UNITPURCHASEPRICE != null
                ? selectedquotationpart.PAR_UNITPURCHASEPRICE.fixed(constants.pricedecimals)
                : "");
            $("#partpurchasediscountrate").val(selectedquotationpart.PAR_PURCHASEDISCOUNTRATE);
            $("#partpurchasediscountedunitprice").val(selectedquotationpart.PAR_PURCHASEDISCOUNTEDUNITPRICE != null
                ? selectedquotationpart.PAR_PURCHASEDISCOUNTEDUNITPRICE.fixed(constants.pricedecimals)
                : "");
            $("#partunitsalesprice").val(selectedquotationpart.PAR_UNITSALESPRICE != null
                ? selectedquotationpart.PAR_UNITSALESPRICE.fixed(constants.pricedecimals)
                : "");
            $("#partsalesdiscountrate").val(selectedquotationpart.PAR_SALESDISCOUNTRATE);
            $("#partsalesdiscountedunitprice").val(selectedquotationpart.PAR_SALESDISCOUNTEDUNITPRICE != null
                ? selectedquotationpart.PAR_SALESDISCOUNTEDUNITPRICE.fixed(constants.pricedecimals)
                : "");
            $("#parttotalpurchaseprice").val(selectedquotationpart.PAR_TOTALPURCHASEPRICE != null
                ? selectedquotationpart.PAR_TOTALPURCHASEPRICE.fixed(constants.pricedecimals)
                : "");
            $("#parttotalsalesprice").val(selectedquotationpart.PAR_TOTALSALESPRICE != null
                ? selectedquotationpart.PAR_TOTALSALESPRICE.fixed(constants.pricedecimals)
                : "");
            $("#partpurchaseexch").val(selectedquotationpart.PAR_PURCHASEEXCH != null
                ? parseFloat(selectedquotationpart.PAR_PURCHASEEXCH).fixed(constants.exchdecimals)
                : "");
            $("#partsalesexch").val(selectedquotationpart.PAR_SALESEXCH != null
                ? parseFloat(selectedquotationpart.PAR_SALESEXCH).fixed(constants.exchdecimals)
                : "");
            $("#partsalespricecurr").val(selectedquotationpart.PAR_SALESPRICECURR);
            $("#partpurchasepricecurr").val(selectedquotationpart.PAR_PURCHASEPRICECURR);

            ModifyRequiredFields(selectedquotationpart.PAR_UNITPURCHASEPRICE, selectedquotationpart.PAR_UNITSALESPRICE);

            tooltip.show("#quopart", selectedquotationpart.PAR_PARTCODE);
            tooltip.show("#partsalespricecurr", selectedquotationpart.PAR_SALESPRICECURRDESC);
            tooltip.show("#partpurchasepricecurr", selectedquotationpart.PAR_PURCHASEPRICECURRDESC);

            if (selectedstatus.STA_PCODE === "C") tms.Block("#quotationpartsform");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiQuotationPart/Get",
                data: JSON.stringify(selectedquotationpart.PAR_ID),
                fn: function (d) {
                    selectedquotationpart = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#quotationparts"))
                return $.Deferred().reject();

            var part = {
                PAR_ID: selectedquotationpart ? selectedquotationpart.PAR_ID : 0,
                PAR_QUOTATION: quotationid,
                PAR_PART: $("#quopart").data("id"),
                PAR_BRAND: ($("#partbrand").val() || null),
                PAR_REFERENCE: ($("#partreference").val() || null),
                PAR_QTY: $("#quotationpartqty").val(),
                PAR_UNITPURCHASEPRICE: ($("#partunitpurchaseprice").val() || null),
                PAR_PURCHASEDISCOUNTRATE: ($("#partpurchasediscountrate").val() || null),
                PAR_PURCHASEDISCOUNTEDUNITPRICE: ($("#partpurchasediscountedunitprice").val() || null),
                PAR_TOTALPURCHASEPRICE: ($("#parttotalpurchaseprice").val() || null),
                PAR_PURCHASEPRICECURR: ($("#partpurchasepricecurr").val() || null),
                PAR_PURCHASEEXCH: ($("#partpurchaseexch").val() || null),
                PAR_UNITSALESPRICE: ($("#partunitsalesprice").val() || null),
                PAR_SALESDISCOUNTRATE: ($("#partsalesdiscountrate").val() || null),
                PAR_SALESDISCOUNTEDUNITPRICE: ($("#partsalesdiscountedunitprice").val() || null),
                PAR_TOTALSALESPRICE: ($("#parttotalsalesprice").val() || null),
                PAR_SALESPRICECURR: ($("#partsalespricecurr").val() || null),
                PAR_SALESEXCH: ($("#partsalesexch").val() || null),
                PAR_CREATED: selectedquotationpart != null ? selectedquotationpart.PAR_CREATED : tms.Now(),
                PAR_CREATEDBY: selectedquotationpart != null ? selectedquotationpart.PAR_CREATEDBY : user,
                PAR_UPDATED: selectedquotationpart != null ? tms.Now() : null,
                PAR_UPDATEDBY: selectedquotationpart != null ? user : null,
                PAR_RECORDVERSION: selectedquotationpart != null ? selectedquotationpart.PAR_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiQuotationPart/Save",
                data: JSON.stringify(part),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        var itemSelect = function (row) {
            selectedquotationpart = grdQuotationParts.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            $grdQuotationParts.find("#btnHistory").off("").on("click", HistoryModal);
        }
        this.List = function () {
            var grdFilter = [
                { field: "PAR_QUOTATION", value: selectedrecord.QUO_ID, operator: "eq", logic: "and" }
            ];
            if (grdQuotationParts) {
                grdQuotationParts.ClearSelection();
                grdQuotationParts.RunFilter(grdFilter);
            } else {
                grdQuotationParts = new Grid({
                    keyfield: "PAR_ID",
                    columns: [
                        {
                            type: "string",
                            field: "PAR_PARTCODE",
                            title: gridstrings.quotationparts[lang].partcode,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_PARTDESC",
                            title: gridstrings.quotationparts[lang].partdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PAR_REFERENCE",
                            title: gridstrings.quotationparts[lang].reference,
                            width: 250
                        },
                        {
                            type: "qty",
                            field: "PAR_QTY",
                            title: gridstrings.quotationparts[lang].qty,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_PARTUOM",
                            title: gridstrings.quotationparts[lang].partuom,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PAR_UNITPURCHASEPRICE",
                            title: gridstrings.quotationparts[lang].unitpurchaseprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PAR_PURCHASEDISCOUNTEDUNITPRICE",
                            title: gridstrings.quotationparts[lang].discountedunitpurchaseprice,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PAR_TOTALPURCHASEPRICE",
                            title: gridstrings.quotationparts[lang].totalpurchaseprice,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_PURCHASEPRICECURR",
                            title: gridstrings.quotationparts[lang].curr,
                            width: 200
                        },
                        {
                            type: "exch",
                            field: "PAR_PURCHASEEXCH",
                            title: gridstrings.quotationparts[lang].exch,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PAR_UNITSALESPRICE",
                            title: gridstrings.quotationparts[lang].unitsalesprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "PAR_SALESDISCOUNTEDUNITPRICE",
                            title: gridstrings.quotationparts[lang].discountedunitsalesprice,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PAR_TOTALSALESPRICE",
                            title: gridstrings.quotationparts[lang].totalsalesprice,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PAR_SALESPRICECURR",
                            title: gridstrings.quotationparts[lang].curr,
                            width: 200
                        },
                        {
                            type: "exch",
                            field: "PAR_SALESEXCH",
                            title: gridstrings.quotationparts[lang].exch,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PAR_CREATED",
                            title: gridstrings.quotationparts[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_CREATEDBY",
                            title: gridstrings.quotationparts[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "PAR_UPDATED",
                            title: gridstrings.quotationparts[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_UPDATEDBY",
                            title: gridstrings.quotationparts[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        PAR_DATE: { type: "date" },
                        PAR_QTY: { type: "number" },
                        PAR_UNITPURCHASEPRICE: { type: "number" },
                        PAR_PURCHASEDISCOUNTEDUNITPRICE: { type: "number" },
                        PAR_TOTALPURCHASEPRICE: { type: "number" },
                        PAR_UNITSALESPRICE: { type: "number" },
                        PAR_SALESDISCOUNTEDUNITPRICE: { type: "number" },
                        PAR_TOTALSALESPRICE: { type: "number" },
                        PAR_PURCHASEEXCH: { type: "number" },
                        PAR_SALESEXCH: { type: "number" },
                        PAR_CREATED: { type: "date" },
                        PAR_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiQuotationPart/List",
                    selector: "#grdQuotationParts",
                    name: "grdQuotationParts",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "PAR_ID", dir: "desc" }],
                    change: gridChange,
                    databound: gridDataBound,
                    toolbarColumnMenu: true,
                    loadall: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"QuotationParts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>"
                        ]
                    }
                });
            }
        }
        this.Delete = function () {
            if (selectedquotationpart) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiQuotationPart/DelRec",
                            data: JSON.stringify(selectedquotationpart.PAR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var UpdateExch = function () {
            var partpurchasepricecurr = $("#partpurchasepricecurr").val();
            var partsalespricecurr = $("#partsalespricecurr").val();
            if (partpurchasepricecurr) {
                $.when(shr.CalculateExch(partpurchasepricecurr)).done(function (d) {
                    if (d.data) {
                        $("#partpurchaseexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#partpurchaseexch").val("");
                    }
                });
            }
            if (partsalespricecurr) {
                $.when(shr.CalculateExch(partsalespricecurr)).done(function (d) {
                    if (d.data) {
                        $("#partsalesexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#partsalesexch").val("");
                    }
                });
            }
        }

        var RgstrTabEvents = function () {
            $("#btnSaveQuotationPart").click(self.Save);
            $("#btnAddQuotationPart").click(self.ResetUI);
            $("#btnDeleteQuotationPart").click(self.Delete);

            $("#btnpartpurchasepricecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#partpurchasepricecurr",
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
            $("#btnpartsalespricecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#partsalespricecurr",
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
            $("#btnparts").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    modalinfo: applicationstrings[lang].partmodalinfo,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_ID",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#quopart",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 400 }
                    ],
                    filter: [
                        { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                        { field: "IsContractedQuotationPart", value: selectedrecord.QUO_ID, operator: "custom" }
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
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedQuotationPart", value: selectedrecord.QUO_ID, operator: "custom" }
                            ]
                        },
                        {
                            text: gridstrings.parts[lang].allparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    ],
                    callback: function (d) {
                        $("#partdesc").val(d ? d.PAR_DESC : "");
                        $("#partuom").val(d ? d.PAR_UOM : "");
                        $("#partbrand").val(d ? d.PAR_BRAND : "");
                        $("#quopart").data("id", d ? d.PAR_ID : null);
                        if (d)
                            tooltip.show("#quopart", d.PAR_DESC);
                        else
                            tooltip.hide("#quopart");

                        ModifyRequiredFields(null, d ? d.PAR_UNITSALESPRICE : null);
                        return $.when(GetContractPartPrice(d.PAR_ID)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#partreference").val(r.CPP_REFERENCE);
                                if (r.CPP_UNITPURCHASEPRICE) {
                                    $("#partunitpurchaseprice").val(r.CPP_UNITPURCHASEPRICE);
                                    $("#partpurchasepricecurr").val(r.CPP_CURR);
                                }
                                if (r.CPP_UNITSALESPRICE) {
                                    $("#partunitsalesprice").val(r.CPP_UNITSALESPRICE);
                                    $("#partsalespricecurr").val(r.CPP_CURR);
                                }
                                ModifyPricingSection();
                            }
                            return UpdateExch();
                        });


                    }
                });
            });

            $("#partpurchasepricecurr").autocomp({
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
            $("#partsalespricecurr").autocomp({
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
            $("#quopart").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                callback: function (d) {
                    $("#quopart").data("id", d ? d.PAR_ID : null);
                    $("#partdesc").val(d ? d.PAR_DESC : "");
                    $("#partuom").val(d ? d.PAR_UOM : "");
                    $("#partbrand").val(d ? d.PAR_BRAND : "");
                    if (d)
                        tooltip.show("#quopart", d.PAR_DESC);
                    else
                        tooltip.hide("#quopart");

                    ModifyRequiredFields(null, d ? d.PAR_UNITSALESPRICE : null);
                    return $.when(GetContractPartPrice(d.PAR_ID)).done(function (p) {
                        if (p.data && p.data.length > 0) {
                            var r = p.data[0];
                            $("#partreference").val(r.CPP_REFERENCE);
                            if (r.CPP_UNITPURCHASEPRICE) {
                                $("#partunitpurchaseprice").val(r.CPP_UNITPURCHASEPRICE);
                                $("#partpurchasepricecurr").val(r.CPP_CURR);
                            }
                            if (r.CPP_UNITSALESPRICE) {
                                $("#partunitsalesprice").val(r.CPP_UNITSALESPRICE);
                                $("#partsalespricecurr").val(r.CPP_CURR);
                            }
                            ModifyPricingSection();
                        }
                        return UpdateExch();
                    });

                }
            });
            $("#quotationparts input[calc-group=\"1\"]").on("blur",
                function () {
                    return UpdateExch();
                });
            $("#quotationparts input[calc-group=\"2\"]").on("blur",
                function () {
                    return UpdateExch();
                });
            $("#quotationparts input[calc-group=\"3\"]").on("blur",
                function () {
                    return ModifyPricingSection();
                });
        }
        RgstrTabEvents();
    }
    var mcs = new function () {
        var self = this;
        var $grdQuotationMiscCosts = $("#grdQuotationMiscCosts");
        var grdQuotationMiscCosts = null;
        var selectedquotationmisccost = null;

        var RestoreDefaultFieldStates = function () {
            $("#misccostdesc").addClass("required").prop("disabled", false).val("");
            $("#misccostuom").prop("disabled", false).addClass("required").val("");
            $("#btnmisccostuom").prop("disabled", false);

            $("#misccostpart").removeClass("required").prop("disabled", true).data("id", null).val("");
            $("#btnmisccostpart").prop("disabled", true);
            tooltip.hide("#misccostpart");

            $("#misccostservicecode").removeClass("required").prop("disabled", true).val("");
            $("#btnmisccostservicecode").prop("disabled", true);
            tooltip.hide("#misccostservicecode");
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
        var ServiceCodeIsNotFound = function () {
            RestoreDefaultFieldStates();
        }
        var ServiceCodeIsFound = function () {
            $("#misccostservicecode")
                .addClass("required")
                .prop("disabled", false)
                .val("");
            $("#btnmisccostservicecode").prop("disabled", false);
            $("#misccostdesc").removeClass("required").prop("disabled", true).val("");
            $("#misccostuom").prop("disabled", true).val("");
            $("#btnmisccostuom").prop("disabled", true);
            tooltip.hide("#misccostservicecode");
        }

        var ModifyRequiredFields = function (misccostunitpurchaseprice, misccostunitsalesprice) {
            if (misccostunitpurchaseprice != null) {
                $("#misccostpurchasepricecurr").attr("required", "required").addClass("required");
                $("#misccostpurchaseexch").attr("required", "required").addClass("required");
            } else {
                $("#misccostpurchasepricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#misccostpurchaseexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }

            if (misccostunitsalesprice != null) {
                $("#misccostsalespricecurr").attr("required", "required").addClass("required");
                $("#misccostsalesexch").attr("required", "required").addClass("required");
            } else {
                $("#misccostsalespricecurr").removeAttr("required").removeClass("required").removeClass("isempty");
                $("#misccostsalesexch").removeAttr("required").removeClass("required").removeClass("isempty");
            }
        }
        var ModifyPricingSection = function () {
            var misccostqty = ($("#misccostqty").val() || null);
            var misccostunitpurchaseprice = ($("#misccostunitpurchaseprice").val() || null);
            var misccostunitsalesprice = ($("#misccostunitsalesprice").val() || null);
            var misccostpurchasediscountrate = ($("#misccostpurchasediscountrate").val() || null);
            var misccostsalesdiscountrate = ($("#misccostsalesdiscountrate").val() || null);
            var misccostpurchasediscountedunitprice = null;
            var misccostsalesdiscountedunitprice = null;

            ModifyRequiredFields(misccostunitpurchaseprice, misccostunitsalesprice);

            $("#misccostpurchasediscountedunitprice").val("");
            if (misccostunitpurchaseprice && misccostpurchasediscountrate) {
                misccostpurchasediscountedunitprice =
                    (misccostunitpurchaseprice * (100 - misccostpurchasediscountrate)) / 100;
                $("#misccostpurchasediscountedunitprice")
                    .val(misccostpurchasediscountedunitprice.fixed(constants.pricedecimals));
            }
            $("#misccostsalesdiscountedunitprice").val("");
            if (misccostunitsalesprice && misccostsalesdiscountrate) {
                misccostsalesdiscountedunitprice = (misccostunitsalesprice * (100 - misccostsalesdiscountrate)) / 100;
                $("#misccostsalesdiscountedunitprice")
                    .val(misccostsalesdiscountedunitprice.fixed(constants.pricedecimals));
            }
            $("#misccosttotalpurchaseprice").val("");
            if (misccostqty && misccostunitpurchaseprice)
                $("#misccosttotalpurchaseprice")
                    .val((misccostqty * (misccostpurchasediscountedunitprice || misccostunitpurchaseprice)).fixed(
                        constants.pricedecimals));

            $("#misccosttotalsalesprice").val("");
            if (misccostqty && misccostunitsalesprice)
                $("#misccosttotalsalesprice")
                    .val((misccostqty * (misccostsalesdiscountedunitprice || misccostunitsalesprice)).fixed(
                        constants.pricedecimals));
        }
        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMQUOTATIONMISCCOST", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.QUO_ID, operator: "eq" }
                ]
            });
        };
        this.ResetUI = function () {
            selectedquotationmisccost = null;
            tms.UnBlock("#quotationmisccostsform");
            tms.Reset("#quotationmisccosts");

            $("#misccostid").val("");
            $("#misccostdesc").val("").prop("disabled", false).addClass("required");
            $("#misccosttypeparent").val("").trigger("change");
            $("#misccosttype").val("");
            $("#misccostqty").val("");
            $("#misccostuom").val("");
            $("#misccostunitpurchaseprice").val("");
            $("#misccostpurchasediscountrate").val("");
            $("#misccostpurchasediscountedunitprice").val("");
            $("#misccosttotalpurchaseprice").val("");
            $("#misccostunitsalesprice").val("");
            $("#misccostreference").val("");
            $("#misccostsalesdiscountrate").val("");
            $("#misccostsalesdiscountedunitprice").val("");
            $("#misccosttotalpurchaseprice").val("");
            $("#misccosttotalsalesprice").val("");
            $("#misccostsalespricecurr").val("");
            $("#misccostpurchasepricecurr").val("");
            $("#misccostpurchaseexch").val("");
            $("#misccostsalesexch").val("");
            $("#misccostbrand").removeAttr("required").removeClass("required");


            ModifyRequiredFields(null, null);

            tooltip.hide("#misccostpurchasepricecurr");
            tooltip.hide("#misccostsalespricecurr");

            $("#misccostunitsalesprice").prop("disabled", false);
            $("#misccostpurchasediscountrate").prop("disabled", false);
            $("#misccostsalespricecurr").prop("disabled", false);
            $("#btnmisccostsalespricecurr").prop("disabled", false);

            $("#misccostunitpurchaseprice").prop("disabled", false);
            $("#misccostsalesdiscountrate").prop("disabled", false);
            $("#misccostpurchasepricecurr").prop("disabled", false);
            $("#btnmisccostpurchasepricecurr").prop("disabled", false);
            $("#misccostpurchaseexch").prop("disabled", false);

            if (supplier)
                $("#quotationmisccosts_sales").hide();

            if (selectedstatus.STA_PCODE === "C") tms.Block("#quotationmisccostsform");
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
                ctrl: "#misccosttype",
                url: "/Api/ApiMiscCostTypes/List",
                keyfield: "MCT_CODE",
                textfield: "MCT_DESC",
                data: JSON.stringify(gridreq),
                callback: function (d) {
                    $("#misccosttype").val("SERVIS");
                }
            }).Fill();
        };
        var FillUserInterface = function () {

            tms.UnBlock("#quotationmisccostsform");
            tms.BeforeFill("#quotationmisccosts");

            if (selectedquotationmisccost.MSC_PTYPE === "PART") {
                $("#misccostservicecontainer").addClass("hidden");
                $("#misccostpartcontainer").removeClass("hidden");
                $("#misccostbrand").attr("required","required").addClass("required");
                if (selectedquotationmisccost.MSC_PART) {
                    PartIsFound();
                    $("#misccostpart").val(selectedquotationmisccost.MSC_PARTCODE)
                        .data("id", selectedquotationmisccost.MSC_PART);
                    $("#misccostdesc").val(selectedquotationmisccost.MSC_PARTDESCRIPTION);
                    tooltip.show("#misccostpart", selectedquotationmisccost.MSC_PARTDESCRIPTION);
                } else {
                    $("#partisnotfound").prop("checked", true).trigger("change");
                    $("#misccostdesc").val(selectedquotationmisccost.MSC_DESC);
                }
            } else {
                $("#misccostpartcontainer").addClass("hidden");
                $("#misccostservicecontainer").removeClass("hidden");
                $("#misccostbrand").removeAttr("required").removeClass("required");

                if (selectedquotationmisccost.MSC_SERVICECODE) {
                    ServiceCodeIsFound();
                    $("#misccostservicecode").val(selectedquotationmisccost.MSC_SERVICECODE);
                    $("#misccostdesc").val(selectedquotationmisccost.MSC_SERVICECODEDESCRIPTION);
                    tooltip.show("#misccostpart", selectedquotationmisccost.MSC_SERVICECODEDESCRIPTION);
                } else {
                    $("#servicecodeisnotfound").prop("checked", true).trigger("change");
                    $("#misccostdesc").val(selectedquotationmisccost.MSC_DESC);
                }
            }

            $("#misccostid").val(selectedquotationmisccost.MSC_ID);
            $("#misccosttypeparent").val(selectedquotationmisccost.MSC_PTYPE);
            $.when(LoadSubTypes(selectedquotationmisccost.MSC_PTYPE)).done(function () {
                $("#misccosttype").val(selectedquotationmisccost.MSC_TYPE);
            });
            $("#misccostqty").val(selectedquotationmisccost.MSC_QTY);
            $("#misccostbrand").val(selectedquotationmisccost.MSC_BRAND);
            $("#misccostuom").val(selectedquotationmisccost.MSC_UOM);
            $("#misccostunitpurchaseprice").val(selectedquotationmisccost.MSC_UNITPURCHASEPRICE != null
                ? selectedquotationmisccost.MSC_UNITPURCHASEPRICE.fixed(constants.pricedecimals)
                : "");
            $("#misccostpurchasediscountrate").val(selectedquotationmisccost.MSC_PURCHASEDISCOUNTRATE);
            $("#misccostpurchasediscountedunitprice").val(selectedquotationmisccost.MSC_PURCHASEDISCOUNTEDUNITPRICE
                ? selectedquotationmisccost.MSC_PURCHASEDISCOUNTEDUNITPRICE.fixed(constants.pricedecimals)
                : "");
            $("#misccostunitsalesprice").val(selectedquotationmisccost.MSC_UNITSALESPRICE != null
                ? selectedquotationmisccost.MSC_UNITSALESPRICE.fixed(constants.pricedecimals)
                : "");
            $("#misccostsalesdiscountrate").val(selectedquotationmisccost.MSC_SALESDISCOUNTRATE);
            $("#misccostsalesdiscountedunitprice").val(selectedquotationmisccost.MSC_SALESDISCOUNTEDUNITPRICE != null
                ? selectedquotationmisccost.MSC_SALESDISCOUNTEDUNITPRICE.fixed(constants.pricedecimals)
                : "");
            $("#misccosttotalpurchaseprice").val(selectedquotationmisccost.MSC_TOTALPURCHASEPRICE != null
                ? selectedquotationmisccost.MSC_TOTALPURCHASEPRICE.fixed(constants.pricedecimals)
                : "");
            $("#misccosttotalsalesprice").val(selectedquotationmisccost.MSC_TOTALSALESPRICE != null
                ? selectedquotationmisccost.MSC_TOTALSALESPRICE.fixed(constants.pricedecimals)
                : "");
            $("#misccostpurchaseexch").val(selectedquotationmisccost.MSC_PURCHASEEXCH != null
                ? parseFloat(selectedquotationmisccost.MSC_PURCHASEEXCH).fixed(constants.exchdecimals)
                : "");
            $("#misccostsalesexch").val(selectedquotationmisccost.MSC_SALESEXCH != null
                ? parseFloat(selectedquotationmisccost.MSC_SALESEXCH).fixed(constants.exchdecimals)
                : "");
            $("#misccostsalespricecurr").val(selectedquotationmisccost.MSC_SALESPRICECURR);
            $("#misccostpurchasepricecurr").val(selectedquotationmisccost.MSC_PURCHASEPRICECURR);
            $("#misccostreference").val(selectedquotationmisccost.MSC_REFERENCE);

            ModifyRequiredFields(selectedquotationmisccost.MSC_UNITPURCHASEPRICE,
                selectedquotationmisccost.MSC_UNITSALESPRICE);

            tooltip.show("#misccostsalespricecurr", selectedquotationmisccost.MSC_SALESPRICECURRDESC);
            tooltip.show("#misccostpurchasepricecurr", selectedquotationmisccost.MSC_PURCHASEPRICECURRDESC);

            if (selectedstatus.STA_PCODE === "C") tms.Block("#quotationmisccostsform");
        };

        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiQuotationMiscCost/Get",
                data: JSON.stringify(selectedquotationmisccost.MSC_ID),
                fn: function (d) {
                    selectedquotationmisccost = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#quotationmisccosts"))
                return $.Deferred().reject();

            var selectedmisccostptype = $("#misccosttypeparent").val();

            var misccost = {
                MSC_ID: selectedquotationmisccost ? selectedquotationmisccost.MSC_ID : 0,
                MSC_QUOTATION: quotationid,
                MSC_PTYPE: selectedmisccostptype,
                MSC_PART: (selectedmisccostptype == "PART" ? $("#misccostpart").data("id") || null : null),
                MSC_SERVICECODE: (selectedmisccostptype == "SERVICE" ? $("#misccostservicecode").val() || null : null),
                MSC_DESC: (selectedmisccostptype === "PART"
                    ? (!$("#misccostpart").data("id") ? $("#misccostdesc").val() : null)
                    : $("#misccostdesc").val()),
                MSC_TYPE: $("#misccosttype").val(),
                MSC_QTY: $("#misccostqty").val(),
                MSC_UOM: $("#misccostuom").val(),
                MSC_BRAND: $("#misccostbrand").val(),
                MSC_UNITPURCHASEPRICE: ($("#misccostunitpurchaseprice").val() || null),
                MSC_PURCHASEDISCOUNTRATE: ($("#misccostpurchasediscountrate").val() || null),
                MSC_PURCHASEDISCOUNTEDUNITPRICE: ($("#misccostpurchasediscountedunitprice").val() || null),
                MSC_TOTALPURCHASEPRICE: ($("#misccosttotalpurchaseprice").val() || null),
                MSC_REFERENCE: ($("#misccostreference").val() || null),
                MSC_PURCHASEPRICECURR: ($("#misccostpurchasepricecurr").val() || null),
                MSC_PURCHASEEXCH: ($("#misccostpurchaseexch").val() || null),
                MSC_UNITSALESPRICE: ($("#misccostunitsalesprice").val() || null),
                MSC_SALESDISCOUNTRATE: ($("#misccostsalesdiscountrate").val() || null),
                MSC_SALESDISCOUNTEDUNITPRICE: ($("#misccostsalesdiscountedunitprice").val() || null),
                MSC_TOTALSALESPRICE: ($("#misccosttotalsalesprice").val() || null),
                MSC_SALESPRICECURR: ($("#misccostsalespricecurr").val() || null),
                MSC_SALESEXCH: ($("#misccostsalesexch").val() || null),
                MSC_CREATED: selectedquotationmisccost != null ? selectedquotationmisccost.MSC_CREATED : tms.Now(),
                MSC_CREATEDBY: selectedquotationmisccost != null ? selectedquotationmisccost.MSC_CREATEDBY : user,
                MSC_UPDATED: selectedquotationmisccost != null ? tms.Now() : null,
                MSC_UPDATEDBY: selectedquotationmisccost != null ? user : null,
                MSC_RECORDVERSION: selectedquotationmisccost != null ? selectedquotationmisccost.MSC_RECORDVERSION : 0,
                MSC_COPY: selectedquotationmisccost != null ? selectedquotationmisccost.MSC_COPY : "-"
            };

            return tms.Ajax({
                url: "/Api/ApiQuotationMiscCost/Save",
                data: JSON.stringify(misccost),
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        var itemSelect = function (row) {
            selectedquotationmisccost = grdQuotationMiscCosts.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            var data = grdQuotationMiscCosts.GetData();
            var sumcost = 0;
            $.each(data,
                function () {
                    sumcost += parseFloat((this.MSC_PURCHASEDISCOUNTEDUNITPRICE || this.MSC_UNITPURCHASEPRICE) * this.MSC_PURCHASEEXCH * this.MSC_QTY) || 0;
                });
            $grdQuotationMiscCosts.find("#grdCostSumValue").html("<span style=\"color:#cf192d;line-height:2em;padding-left:1em;\"><strong> " +
                applicationstrings[lang].totalcost +
                ": </strong>" +
                sumcost.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                " " +
                selectedrecord.QUO_ORGANIZATIONCURR +
                "</span>");


            $grdQuotationMiscCosts.find("#btnHistory").off("").on("click", HistoryModal);
        }
        this.List = function () {
            var grdFilter = [
                { field: "MSC_QUOTATION", value: selectedrecord.QUO_ID, operator: "eq", logic: "and" }
            ];
            if (grdQuotationMiscCosts) {
                grdQuotationMiscCosts.ClearSelection();
                grdQuotationMiscCosts.RunFilter(grdFilter);
            } else {
                grdQuotationMiscCosts = new Grid({
                    keyfield: "MSC_ID",
                    columns: [
                        {
                            type: "string",
                            field: "MSC_DESC",
                            title: gridstrings.quotationmisccosts[lang].description,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "MSC_PTYPE",
                            title: gridstrings.quotationmisccosts[lang].ptype,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "MSC_TYPEDESC",
                            title: gridstrings.quotationmisccosts[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "MSC_PARTDESCRIPTION",
                            title: gridstrings.quotationmisccosts[lang].partdescription,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "MSC_SERVICECODEDESCRIPTION",
                            title: gridstrings.quotationmisccosts[lang].servicecodedescription,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "MSC_QTY",
                            title: gridstrings.quotationmisccosts[lang].qty,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "MSC_UOM",
                            title: gridstrings.quotationmisccosts[lang].uom,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "MSC_UNITPURCHASEPRICE",
                            title: gridstrings.quotationmisccosts[lang].unitpurchaseprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "MSC_PURCHASEDISCOUNTEDUNITPRICE",
                            title: gridstrings.quotationmisccosts[lang].discountedunitpurchaseprice,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "MSC_TOTALPURCHASEPRICE",
                            title: gridstrings.quotationmisccosts[lang].totalpurchaseprice,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "MSC_PURCHASEPRICECURR",
                            title: gridstrings.quotationmisccosts[lang].curr,
                            width: 200
                        },
                        {
                            type: "exch",
                            field: "MSC_PURCHASEEXCH",
                            title: gridstrings.quotationmisccosts[lang].exch,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "MSC_UNITSALESPRICE",
                            title: gridstrings.quotationmisccosts[lang].unitsalesprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "MSC_SALESDISCOUNTEDUNITPRICE",
                            title: gridstrings.quotationmisccosts[lang].discountedunitsalesprice,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "MSC_TOTALSALESPRICE",
                            title: gridstrings.quotationmisccosts[lang].totalsalesprice,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "MSC_SALESPRICECURR",
                            title: gridstrings.quotationmisccosts[lang].curr,
                            width: 200
                        },
                        {
                            type: "exch",
                            field: "MSC_SALESEXCH",
                            title: gridstrings.quotationmisccosts[lang].exch,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "MSC_CREATED",
                            title: gridstrings.quotationmisccosts[lang].created,
                            width: 200
                        }, {
                            type: "string",
                            field: "MSC_CREATEDBY",
                            title: gridstrings.quotationmisccosts[lang].createdby,
                            width: 250
                        }, {
                            type: "datetime",
                            field: "MSC_UPDATED",
                            title: gridstrings.quotationmisccosts[lang].updated,
                            width: 200
                        }, {
                            type: "string",
                            field: "MSC_UPDATEDBY",
                            title: gridstrings.quotationmisccosts[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        MSC_DATE: { type: "date" },
                        MSC_QTY: { type: "number" },
                        MSC_UNITPURCHASEPRICE: { type: "number" },
                        MSC_PURCHASEDISCOUNTEDUNITPRICE: { type: "number" },
                        MSC_TOTALPURCHASEPRICE: { type: "number" },
                        MSC_UNITSALESPRICE: { type: "number" },
                        MSC_SALESDISCOUNTEDUNITPRICE: { type: "number" },
                        MSC_TOTALSALESPRICE: { type: "number" },
                        MSC_PURCHASEEXCH: { type: "number" },
                        MSC_SALESEXCH: { type: "number" },
                        MSC_CREATED: { type: "date" },
                        MSC_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiQuotationMiscCost/List",
                    selector: "#grdQuotationMiscCosts",
                    name: "grdQuotationMiscCosts",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "MSC_ID", dir: "desc" }],
                    change: gridChange,
                    databound: gridDataBound,
                    toolbarColumnMenu: true,
                    loadall: true,
                    toolbar: {
                        left: [
                            "<div style=\"padding-right: 5px;\" class=\"pull-left\" id=\"grdCostSumValue\"></div><div class=\"pull-left\"  id=\"grdSalesSumValue\"></div>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"QuotationMiscCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>"
                        ]
                    }
                });
            }
        }
        this.Delete = function () {
            if (selectedquotationmisccost) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiQuotationMiscCost/DelRec",
                            data: JSON.stringify(selectedquotationmisccost.MSC_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var GetContractServiceCodePrice = function (servicecode) {

            var gridreq = {
                sort: [{ field: "CSP_ID", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "GetServicePriceForQuotation", value: selectedrecord.QUO_ID, value2: servicecode, operator: "custom" }
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
                        { field: "GetPartPriceForQuotation", value: selectedrecord.QUO_ID, value2: part, operator: "custom" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/List",
                data: JSON.stringify(gridreq)
            });
        }

        var UpdateExch = function () {
            var misccostpurchasepricecurr = $("#misccostpurchasepricecurr").val();
            var misccostsalespricecurr = $("#misccostsalespricecurr").val();
            if (misccostpurchasepricecurr) {
                $.when(shr.CalculateExch(misccostpurchasepricecurr)).done(function (d) {
                    if (d.data) {
                        $("#misccostpurchaseexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#misccostpurchaseexch").val("");
                    }
                });
            }
            if (misccostsalespricecurr) {
                $.when(shr.CalculateExch(misccostsalespricecurr)).done(function (d) {
                    if (d.data) {
                        $("#misccostsalesexch").val(parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals));
                    } else {
                        $("#misccostsalesexch").val("");
                    }
                });
            }
        }
        var RgstrTabEvents = function () {
            $("#btnSaveQuotationMiscCost").click(self.Save);
            $("#btnAddQuotationMiscCost").click(self.ResetUI);
            $("#btnDeleteQuotationMiscCost").click(self.Delete);

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

            $("#btnmisccostpurchasepricecurr").click(function () {
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
            $("#btnmisccostsalespricecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#misccostsalespricecurr",
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
                        { field: "IsContractedQuotationPart", value: selectedrecord.QUO_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.parts[lang].contractedparts,
                            filter: [
                                { field: "PAR_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedQuotationPart", value: selectedrecord.QUO_ID, operator: "custom" }
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
                        $("#misccostbrand").val(d ? d.PAR_BRAND : "");

                        if (d)
                            tooltip.show("#misccostpart", d.PAR_DESC);
                        else
                            tooltip.hide("#misccostpart");

                        ModifyRequiredFields(null, d ? d.PAR_UNITSALESPRICE : null);
                        return $.when(GetContractPartPrice(d.PAR_ID)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#misccostreference").val(r.CPP_REFERENCE);
                                if (r.CPP_UNITPURCHASEPRICE) {
                                    $("#misccostunitpurchaseprice").val(r.CPP_UNITPURCHASEPRICE);
                                    $("#misccostpurchasepricecurr").val(r.CPP_CURR);
                                }
                                if (r.CPP_UNITSALESPRICE) {
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
                    $("#misccostbrand").val(d ? d.PAR_BRAND : "");
                    if (d)
                        tooltip.show("#misccostpart", d.PAR_DESC);
                    else
                        tooltip.hide("#misccostpart");

                    ModifyRequiredFields(null, d ? d.PAR_UNITSALESPRICE : null);
                    return $.when(GetContractPartPrice(d.PAR_ID)).done(function (p) {
                        if (p.data && p.data.length > 0) {
                            var r = p.data[0];
                            $("#misccostreference").val(r.CPP_REFERENCE);
                            if (r.CPP_UNITPURCHASEPRICE) {
                                $("#misccostunitpurchaseprice").val(r.CPP_UNITPURCHASEPRICE);
                                $("#misccostpurchasepricecurr").val(r.CPP_CURR);
                            }
                            if (r.CPP_UNITSALESPRICE) {
                                $("#misccostunitsalesprice").val(r.CPP_UNITSALESPRICE);
                                $("#misccostsalespricecurr").val(r.CPP_CURR);
                            }
                            ModifyPricingSection();
                        }
                        return UpdateExch();
                    });
                }
            });

            $("#btnmisccostservicecode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.servicecodes[lang].title,
                    modalinfo: applicationstrings[lang].servicecodesmodalinfo,
                    listurl: "/Api/ApiServiceCodes/List",
                    keyfield: "SRV_CODE",
                    codefield: "SRV_CODE",
                    textfield: "SRV_DESCRIPTIONF",
                    returninput: "#misccostservicecode",
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
                        { field: "SRV_ORG", value: [selectedrecord.QUO_ORGANIZATION, "*"], operator: "in" },
                        { field: "IsContractedQuotationServiceCode", value: selectedrecord.QUO_ID, operator: "custom" }
                    ],
                    quickfilter: [
                        {
                            text: gridstrings.servicecodes[lang].contractedservicecodes,
                            filter: [
                                { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                                { field: "IsContractedQuotationServiceCode", value: selectedrecord.QUO_ID, operator: "custom" }
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

                        $("#misccostdesc").val(d ? d.SRV_DESCRIPTIONF : "");
                        $("#misccostuom").val(d ? d.SRV_UOM : "");
                        if (d)
                            tooltip.show("#misccostservicecode", d.SRV_DESCRIPTIONF);
                        else
                            tooltip.hide("#misccostservicecode");

                        ModifyRequiredFields(null, d ? d.SRV_UNITSALESPRICE : null);
                        return $.when(GetContractServiceCodePrice(d.SRV_CODE)).done(function (p) {
                            if (p.data && p.data.length > 0) {
                                var r = p.data[0];
                                $("#misccostreference").val(r.CSP_REFERENCE);
                                if (r.CSP_UNITPURCHASEPRICE) {
                                    $("#misccostunitpurchaseprice").val(r.CSP_UNITPURCHASEPRICE);
                                    $("#misccostpurchasepricecurr").val(r.CSP_CURR);
                                }
                                if (r.CSP_UNITSALESPRICE) {
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
            $("#misccostservicecode").autocomp({
                listurl: "/Api/ApiServiceCodes/List",
                geturl: "/Api/ApiServiceCodes/Get",
                field: "SRV_CODE",
                textfield: "SRV_DESCRIPTIONF",
                active: "SRV_ACTIVE",
                termisnumeric: true,
                filter: [{ field: "SRV_ORG", func: function () { return selectedrecord.QUO_ORGANIZATION; }, includeall: true }],
                callback: function (d) {
                    $("#misccostdesc").val(d ? d.SRV_DESCRIPTIONF : "");
                    $("#misccostuom").val(d ? d.SRV_UOM : "");
                    if (d)
                        tooltip.show("#misccostservicecode", d.SRV_DESCRIPTIONF);
                    else
                        tooltip.hide("#misccostservicecode");

                    ModifyRequiredFields(null, d ? d.SRV_UNITSALESPRICE : null);
                    return $.when(GetContractServiceCodePrice(d.SRV_CODE)).done(function (p) {
                        if (p.data && p.data.length > 0) {
                            var r = p.data[0];
                            $("#misccostreference").val(r.CSP_REFERENCE);
                            if (r.CSP_UNITPURCHASEPRICE) {
                                $("#misccostunitpurchaseprice").val(r.CSP_UNITPURCHASEPRICE);
                                $("#misccostpurchasepricecurr").val(r.CSP_CURR);
                            }
                            if (r.CSP_UNITSALESPRICE) {
                                $("#misccostunitsalesprice").val(r.CSP_UNITSALESPRICE);
                                $("#misccostsalespricecurr").val(r.CSP_CURR);
                            }
                            ModifyPricingSection();
                        }
                        return UpdateExch();
                    });
                }
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
            $("#misccostsalespricecurr").autocomp({
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
            $("#misccostdate").on("dp.change",
                function (e) {
                    var preDate = moment(e.oldDate, constants.dateformat);
                    var newDate = moment(e.date, constants.dateformat);
                    if (preDate !== newDate) {
                        return UpdateExch();
                    }
                });
            $("#quotationmisccosts input[calc-group=\"1\"]").on("blur",
                function () {
                    return UpdateExch();
                });
            $("#quotationmisccosts input[calc-group=\"2\"]").on("blur",
                function () {
                    return UpdateExch();
                });
            $("#quotationmisccosts input[calc-group=\"3\"]").on("blur",
                function () {
                    return ModifyPricingSection();
                });
            $("#misccosttypeparent").on("change",
                function () {
                    var $this = $(this);
                    $("#misccostreference").val("");
                    if ($this.val() == "PART") {
                        $("#misccostservicecontainer").addClass("hidden");
                        $("#misccostpartcontainer").removeClass("hidden");
                        $("#partisnotfound").prop("checked", false).trigger("change");
                        $("#misccostbrand").attr("required", "required").addClass("required");
                    } else if ($this.val() == "SERVICE") {
                        $("#misccostpartcontainer").addClass("hidden");
                        $("#misccostservicecontainer").removeClass("hidden");
                        $("#servicecodeisnotfound").prop("checked", false).trigger("change");
                        $("#misccostbrand").removeAttr("required").removeClass("required");

                    } else {
                        $("#misccostpartcontainer").addClass("hidden");
                        $("#misccostservicecontainer").addClass("hidden");
                        RestoreDefaultFieldStates();
                    }
                    LoadSubTypes($this.val());
                });
            $("#partisnotfound").on("change",
                function () {
                    var $this = $(this);
                    if ($this.is(":checked")) {
                        PartIsNotFound();
                    } else {
                        PartIsFound();
                    }
                });
            $("#servicecodeisnotfound").on("change",
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
    var qsm = new function () {
        var ShowAlternatives = function (task, activity) {
            if (task || activity) {
                var gridreq = {
                    sort: [{ field: "QUO_ORDER", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "QUO_ID", value: quotationid, operator: "neq" }
                        ]
                    }
                };

                if (task)
                    gridreq.filter.filters.push({ field: "QUO_TASK", value: task, operator: "eq" });
                if (activity)
                    gridreq.filter.filters.push({ field: "QUO_ACTIVITY", value: activity, operator: "eq" });

                return tms.Ajax({
                    url: "/Api/ApiQuotations/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        var otherquotations = $("#otherquotations");
                        otherquotations.find("tbody").find("*").remove();
                        if (d.data) {
                            var strrow = "";
                            for (var i = 0; i < d.data.length; i++) {
                                var di = d.data[i];
                                strrow += "<tr>";
                                strrow += "<td>" + di.QUO_ID + "</td>";
                                strrow += "<td>" + di.QUO_DESCRIPTION + "</td>";
                                strrow += "<td>" + di.QUO_SUPPLIERDESC + "</td>";
                                strrow += "<td>" + di.QUO_STATUSDESC + "</td>";
                                strrow += "<td>" +
                                    di.QUO_TOTALPURCHASE.toLocaleString(undefined,
                                        {
                                            maximumFractionDigits: constants.pricedecimals,
                                            minimumFractionDigits: constants.pricedecimals
                                        }) +
                                    "</td>";
                                strrow += "<td>" + di.QUO_ORGANIZATIONCURR + "</td>";
                                strrow += "</tr>";
                            }

                            otherquotations.find("tbody").append(strrow);
                        }
                    }
                });
            }
        }
        this.ShowSummary = function () {
            var gridreq = {
                filter: {
                    filters: [
                        { field: "QUO_ID", value: quotationid, operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiQuotations/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    if (d.data.length > 0) {
                        var d0 = d.data[0];
                        var exch = selectedrecord.QUO_EXCH || 1.00;
                        var curr = selectedrecord.QUO_CURR || selectedrecord.QUO_ORGANIZATIONCURR;
                        var cost = (d0.QUO_SERVICEPURCHASE_ORGCURR + d0.QUO_PARTPURCHASE_ORGCURR) / exch;
                        var sales = (d0.QUO_SERVICESALES_ORGCURR + d0.QUO_PARTSALES_ORGCURR) / exch;

                        $("#laborcost").text(d0.QUO_SERVICEPURCHASE_ORGCURR
                            ? (d0.QUO_SERVICEPURCHASE_ORGCURR / exch).toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                })
                            : "");
                        $("#laborsales").text(d0.QUO_SERVICESALES_ORGCURR
                            ? (d0.QUO_SERVICESALES_ORGCURR / exch).toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                })
                            : "");
                        $("#partcost").text(d0.QUO_PARTPURCHASE_ORGCURR
                            ? (d0.QUO_PARTPURCHASE_ORGCURR / exch).toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                })
                            : "");
                        $("#partsales").text(d0.QUO_PARTSALES_ORGCURR
                            ? (d0.QUO_PARTSALES_ORGCURR / exch).toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                })
                            : "");
                        $(
                            "#laborcostcurrency,#laborsalescurrency,#partcostcurrency,#partsalescurrency,#totalcostcurrency,#totalsalescurrency")
                            .text(curr);
                        $("#totalcost").text(cost
                            ? cost.toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                })
                            : "");
                        $("#totalsales").text(sales
                            ? sales.toLocaleString(undefined,
                                {
                                    maximumFractionDigits: constants.pricedecimals,
                                    minimumFractionDigits: constants.pricedecimals
                                })
                            : "");

                        $("#profitrate").text(sales && cost
                            ? "%" + Math.round((((sales - cost) / cost) * 100) * 100 / 100)
                            : "");
                        $("#ordercount").html(d0.QUO_ORDER !== 0
                            ? (applicationstrings[lang].quotationorder.format(d0.QUO_COUNT,
                                d0.QUO_ORDER,
                                d0.QUO_TASK,
                                d0.QUO_ACTIVITY || "-"))
                            : "");

                        return ShowAlternatives(d0.QUO_TASK, d0.QUO_ACTIVITY);
                    }
                }
            });
        }
    }
    var qsl = new function () {
        var purchasing = 0;
        var self = this;
        var grdquohistory = null;
        var grdquohistoryElm = $("#grdquohistory");
        var partcode = null;
        var servicecode = null;

        var BuildFilter = function () {
            var gridfilter = [{ field: "PQC_HSTATUS", value: "K", operator: "eq", logic: "and" }];

            return gridfilter;
        };
        var HistoryGridDataBound = function (e) {
            grdquohistoryElm.find("#btnShowAll").off("click").on("click", function () {
                historyList(true);
            });
        };
        var historyList= function(isall) {
            var gridfilter = [];
            if (isall === false) {
                gridfilter.push({ field: "QLN_CUSTOMER", value: selectedrecord.QUO_CUSTOMER, operator: "eq" });
            }
            if (partcode !== 0) {
                gridfilter.push({ field: "QLN_PARTCODE", value: partcode, operator: "eq" });
            } else {
                gridfilter.push({ field: "QLN_SERVICECODE", value: servicecode, operator: "eq" });
            }


            if (grdquohistory) {
                grdquohistory.ClearSelection();
                grdquohistory.RunFilter(gridfilter);
            } else {
                grdquohistory = new Grid({
                    keyfield: "QLN_NO",
                    columns: [
                        { type: "number", field: "QLN_QUOTATION", title: gridstrings.quolinehistory[lang].quo, width: 200 },
                        { type: "string", field: "QLN_STATUSDESC", title: gridstrings.quolinehistory[lang].status, width: 200 },
                        { type: "date", field: "QLN_CREATED", title: gridstrings.quolinehistory[lang].created, width: 200 },
                        { type: "string", field: "QLN_CUSTOMER", title: gridstrings.quolinehistory[lang].customer, width: 200 },
                        { type: "price", field: "QLN_UNITPURCHASEPRICE", title: gridstrings.quolinehistory[lang].unitpurchaseprice, width: 150 },
                        { type: "string", field: "QLN_PURCHASECURR", title: gridstrings.quolinehistory[lang].purchasecurr, width: 100 },
                        { type: "price", field: "QLN_UNITSALESPRICE", title: gridstrings.quolinehistory[lang].unitsalesprice, width: 150 },
                        { type: "string", field: "QLN_CURR", title: gridstrings.quolinehistory[lang].salescurr, width: 100 }
                    ],
                    fields:
                    {
                        PQL_ID: { type: "number" },
                        PQL_CREATED: { type: "date" },
                        PQL_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiQuotations/ListHistoryView",
                    selector: "#grdquohistory",
                    name: "grdquohistory",
                    height: 350,
                    primarycodefield: "QLN_NO",
                    primarytextfield: "QLN_STATUS",
                    visibleitemcount: 30,
                    filter: gridfilter,
                    sort: [{ field: "QLN_NO", dir: "desc" }],
                    toolbarColumnMenu: false,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-default btn-sm\" id=\"btnShowAll\"><i class=\"fa fa-list-alt fa-fw\"></i>#= applicationstrings[lang].showall #</button>"
                        ]
                    },
                    databound: HistoryGridDataBound
                });
            }
        }
        var RowValues = function (row) {
            var elm_funitsalesprice = row.find("input[field-id=\"funitsalesprice\"]");
            var elm_fsalesdiscount = row.find("input[field-id=\"fsalesdiscount\"]");
            var elm_fsalesdiscountedunitprice = row.find("input[field-id=\"fsalesdiscountedunitprice\"]");

            var elm_ftotal = row.find("input[field-id=\"ftotal\"]");
            var elm_fexch = row.find("input[field-id=\"fexch\"]");
            var elm_fcurr = row.find("input[field-id=\"fcurr\"]");
            var elm_fprofitmargin = row.find("span[field-id=\"fprofitmargin\"]");
            var elm_ftotalpurchase = row.find("span[field-id=\"ftotalpurchase\"]");

            var elm_fqty = row.find("span[field-id=\"fqty\"]");
            var elm_fpurchasecurr = row.find("span[field-id=\"fpurchasecurr\"]");

            var val_funitsalesprice = elm_funitsalesprice.val() ? parseFloat(elm_funitsalesprice.val()) : null;
            var val_fsalesdiscount = elm_fsalesdiscount.val() ? parseFloat(elm_fsalesdiscount.val()) : null;
            var val_ftotalpurchase = elm_ftotalpurchase.text() ? parseFloat(elm_ftotalpurchase.text()) : null;
            var val_ftotalpurchase_exch = elm_ftotalpurchase.attr("rvalue") ? parseFloat(elm_ftotalpurchase.attr("rvalue")) : null;

            var val_fexch = elm_fexch.val();
            var val_fqty = elm_fqty.text() ? parseFloat(elm_fqty.text()) : null;
            var val_fpurchasecurr = elm_fpurchasecurr.text();
            var val_fcurr = elm_fcurr.val();

            return $.when(function () {
                if (elm_funitsalesprice.attr("edited")) {
                    if (val_funitsalesprice !== null) {
                        elm_fcurr.attr("required", "required").addClass("required");
                        if (val_fpurchasecurr && !val_fcurr) {
                            elm_fcurr.val(val_fpurchasecurr);
                            return $.when(shr.CalculateExch(val_fpurchasecurr)).done(function (d) {
                                elm_fexch.val(d.data
                                    ? parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals)
                                    : "");
                                if (d.data)
                                    tooltip.show(elm_fcurr, d.data.CRR_CURRDESC);
                                val_fexch = elm_fexch.val();
                            });
                        }
                    } else {
                        elm_fcurr.removeAttr("required").removeClass("required").removeClass("isempty");
                        elm_fcurr.val("");
                        elm_fexch.val("");
                        tooltip.hide(elm_fcurr);
                    }
                }
            }()).done(function () {
                if (val_funitsalesprice != null && val_fqty != null) {
                    var t = val_funitsalesprice;
                    if (val_fsalesdiscount !== 0)
                        t = t - (t * val_fsalesdiscount / 100);

                    var totalsales = t * val_fqty;
                    var totalsales_exch = t * val_fqty * val_fexch;
                    if (totalsales !== 0) {
                        var profit = totalsales_exch - val_ftotalpurchase_exch;
                        var profitmargin = (profit / totalsales_exch) * 100;
                        var profitmarginstr = totalsales_exch ? (profit).toFixed(constants.pricedecimals) + " (" + profitmargin.toFixed(constants.pricedecimals) + "%)" : null;
                        elm_fprofitmargin.html("<strong>" + profitmarginstr + "</strong>");
                    }                  
                    elm_fsalesdiscountedunitprice.val(t.fixed(constants.pricedecimals));                   
                    elm_ftotal.val(totalsales.fixed(constants.pricedecimals));
                    elm_ftotal.attr("rvalue", totalsales_exch);
                } else {
                    elm_ftotal.val("");
                    elm_fsalesdiscountedunitprice.val("");
                    elm_ftotal.attr("rvalue","");
                }
            });
        };
        var CalculateSum = function () {
            var quotationlinestable = $("#quotationsales table tbody");
            var rows = quotationlinestable.find("tr.quotation-line");

            var laborsum = 0;
            var partsum = 0;
            var misccostsum = 0;
            var amount = 0;
            var profit = 0;
            var profitmargin = 0;
            var exch = selectedrecord.QUO_EXCH || 1.00;
            var curr = selectedrecord.QUO_CURR || selectedrecord.QUO_ORGANIZATIONCURR;

            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                var ftotale = rowsi.find("input[field-id=\"ftotal\"]");
                var fexche = rowsi.find("input[field-id=\"fexch\"]");
                var lineamount = parseFloat((ftotale.val() || "0") * (fexche.val() || "0")) / exch;

                amount += lineamount;
                switch (rowsi.data("linetype")) {
                    case "LABOR":
                        laborsum += parseFloat(lineamount);
                        break;
                    case "PART":
                        partsum += parseFloat(lineamount);
                        break;
                    case "MISCCOST":
                        misccostsum += parseFloat(lineamount);
                        break;
                }
            }

            profit = amount - purchasing;

            $("#laborsum").text(laborsum.toLocaleString(undefined,
                {
                    maximumFractionDigits: constants.pricedecimals,
                    minimumFractionDigits: constants.pricedecimals
                }) +
                " " +
                curr);
            $("#partsum").text(partsum.toLocaleString(undefined,
                {
                    maximumFractionDigits: constants.pricedecimals,
                    minimumFractionDigits: constants.pricedecimals
                }) +
                " " +
                curr);
            $("#misccostsum").text(misccostsum.toLocaleString(undefined,
                {
                    maximumFractionDigits: constants.pricedecimals,
                    minimumFractionDigits: constants.pricedecimals
                }) +
                " " +
                curr);
            $("#sales").text(amount.toLocaleString(undefined,
                {
                    maximumFractionDigits: constants.pricedecimals,
                    minimumFractionDigits: constants.pricedecimals
                }) +
                " " +
                curr);
            $("#profit")
                .text(profit.toLocaleString(undefined,
                    {
                        maximumFractionDigits: constants.pricedecimals,
                        minimumFractionDigits: constants.pricedecimals
                    }) +
                    " " +
                    curr);
                    
            $("#profitmargin")
                .text((amount !== 0 ? Math.round(((profit / amount) * 100) * 100 / 100) + "%" : ""));
        };
        var CalculateLineValues = function () {
            var quotationlinestable = $("#quotationsales table tbody");
            var rows = quotationlinestable.find("tr.quotation-line");
            for (var i = 0; i < rows.length; i++) {
                var rowsi = $(rows[i]);
                RowValues(rowsi);
            }
        };
        var BuildLinesTable = function (d) {
            var quotationlinestable = $("#quotationsales table tbody");
            quotationlinestable.find("tr.quotation-line").remove();
            var strlineslabor = "";
            var strlinespart = "";
            var strlinesmisccost = "";

            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var totalpurchase = di.QLN_QUANTITY * di.QLN_UNITPURCHASEPRICE;
                var totalsales = di.QLN_TOTALPRICE;
                var profitmargin = totalsales ? (totalsales - totalpurchase).toFixed(constants.pricedecimals) + " (" + (((totalsales - totalpurchase) / totalsales).toFixed(2) * 100) + "%)" : null;

                if (di.QLN_TYPE === "LABOR")
                {
                    strlineslabor += "<tr class=\"quotation-line quo-labor\" data-recordversion=\"" +
                        di.QLN_RECORDVERSION +
                        "\" data-linetype=\"LABOR\" data-id=\"" +
                        di.QLN_LINEID +
                        "\">";
                    strlineslabor += "<td>";
                    strlineslabor += "<a class=\"history\" data-partcode=\"" + di.QLN_PARTCODE + "\" data-servicecode=\"" + di.QLN_SERVICECODE + "\"href=\"#\"><i style=\"cursor:pointer\" class=\"fa fa-fw fa-info-circle\" aria-hidden=\"true\"></i> (" + di.QLN_SERVICECODE + ") " + di.QLN_DESCRIPTION + "</a>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor += "<span field-id=\"fqty\">" +
                        (di.QLN_QUANTITY != null ? di.QLN_QUANTITY.fixed(constants.qtydecimals) : "") +
                        "</span>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor += di.QLN_UOM;
                    strlineslabor += "</td>";
                    if (!customer) {
                        strlineslabor += "<td>";
                        strlineslabor += "<span rvalue=\"" + (di.QLN_UNITPURCHASEPRICE * di.QLN_PURCHASEEXCH) + "\" field-id=\"funitpurchaseprice\">" +
                            (di.QLN_UNITPURCHASEPRICE != null
                                ? di.QLN_UNITPURCHASEPRICE.fixed(constants.pricedecimals)
                                : "") +
                            "</span>";
                        strlineslabor += "</td>";
                        strlineslabor += "<td>";
                        strlineslabor += "<span field-id=\"fpurchasecurr\">" + (di.QLN_PURCHASECURR || "") + "</span>";
                        strlineslabor += "</td>";
                        strlineslabor += "<td>";
                        strlineslabor += "<span rvalue=\"" + (di.QLN_UNITPURCHASEPRICE * di.QLN_PURCHASEEXCH * di.QLN_QUANTITY) + "\" field-id=\"ftotalpurchase\">";
                        strlineslabor += (totalpurchase).fixed(constants.pricedecimals);
                        strlineslabor += "</span>";
                        strlineslabor += "</td>";
                    }
                    strlineslabor += "<td>";
                    strlineslabor +=
                        "<input calc-on-change valtype=\"PRICE\" field-id=\"funitsalesprice\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_UNITSALESPRICE != null ? di.QLN_UNITSALESPRICE.fixed(constants.pricedecimals) : "") +
                        "\"/>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor +=
                        "<input calc-on-change field-id=\"fsalesdiscount\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_SALESDISCOUNTRATE || "") +
                        "\"/>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor +=
                        "<input field-id=\"fsalesdiscountedunitprice\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                        ((di.QLN_UNITSALESPRICE != null && di.QLN_SALESDISCOUNTRATE)
                            ? (di.QLN_UNITSALESPRICE - (di.QLN_UNITSALESPRICE * di.QLN_SALESDISCOUNTRATE / 100)).fixed(
                                constants.pricedecimals)
                            : "") +
                        "\"/>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor += "<div class=\"input-group\">";
                    strlineslabor += "<input field-id=\"fcurr\" type=\"text\" maxlength=\"50\" class=\"form-control" +
                        (di.QLN_UNITSALESPRICE != null ? " required" : "") +
                        "\" data-tooltip=\"" +
                        (di.QLN_CURRDESC || "") +
                        "\" value=\"" +
                        (di.QLN_CURR || "") +
                        "\">";
                    strlineslabor += "<span class=\"input-group-btn\">";
                    strlineslabor +=
                        "<button class=\"btn btn-default btn-currency\" type=\"button\"><i class=\"fa fa-search fa-fw\"></i></button>";
                    strlineslabor += "</span>";
                    strlineslabor += "</div>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor +=
                        "<input field-id=\"fexch\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_EXCH != null ? di.QLN_EXCH.fixed(constants.exchdecimals) : "") +
                        "\"/>";
                    strlineslabor += "</td>";
                    strlineslabor += "<td>";
                    strlineslabor +=
                        "<input field-id=\"ftotal\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                    (totalsales != null ? totalsales.fixed(constants.pricedecimals) : "") +
                        "\"/>";
                    strlineslabor += "</td>";
                    if (!customer) {
                        strlineslabor += "<td>";
                        strlineslabor +=
                            "<span field-id=\"fprofitmargin\"><strong>" +
                            (profitmargin != null ? profitmargin : "") +
                            "</strong></span>";
                        strlineslabor += "</td>";
                    }                   
                    strlineslabor += "</tr>";
                }
                else if (di.QLN_TYPE === "PART") {
                    strlinespart += "<tr class=\"quotation-line quo-part\" data-recordversion=\"" +
                        di.QLN_RECORDVERSION +
                        "\"  data-linetype=\"PART\" data-id=\"" +
                        di.QLN_LINEID +
                        "\">";
                    strlinespart += "<td>";
                    strlinespart += "<a class=\"history\"data-partcode=\"" + di.QLN_PARTCODE + "\" data-servicecode=\"" + di.QLN_SERVICECODE + "\"href=\"#\"><i style=\"cursor:pointer\" class=\"fa fa-fw fa-info-circle\" aria-hidden=\"true\"></i> (" + di.QLN_PARTCODE + ") " + di.QLN_DESCRIPTION + "</a>";;
                    strlinespart += "</td>";
                    strlinespart += "<td>";
                    strlinespart += "<span field-id=\"fqty\">" +
                        (di.QLN_QUANTITY != null ? di.QLN_QUANTITY.fixed(constants.qtydecimals) : "") +
                        "</span>";
                    strlinespart += "</td>";
                    strlinespart += "<td>";
                    strlinespart += di.QLN_UOM;
                    strlinespart += "</td>";
                    if (!customer) {
                        strlinespart += "<td>";
                        strlinespart += "<span rvalue=\"" + (di.QLN_UNITPURCHASEPRICE * di.QLN_PURCHASEEXCH) + "\" field-id=\"funitpurchaseprice\">" +
                            (di.QLN_UNITPURCHASEPRICE != null
                                ? di.QLN_UNITPURCHASEPRICE.fixed(constants.pricedecimals)
                                : "") +
                            "</span>";
                        strlinespart += "</td>";
                        strlinespart += "<td>";
                        strlinespart += "<span field-id=\"fpurchasecurr\">" + (di.QLN_PURCHASECURR || "") + "</span>";
                        strlinespart += "</td>";
                        strlinespart += "<td>";
                        strlinespart += "<span rvalue=\"" + (di.QLN_UNITPURCHASEPRICE * di.QLN_PURCHASEEXCH * di.QLN_QUANTITY) + "\"  field-id=\"ftotalpurchase\">";
                        strlinespart += (totalpurchase).fixed(constants.pricedecimals);
                        strlinespart += "</span>";
                        strlinespart += "</td>";
                    }

                    strlinespart += "<td>";
                    strlinespart +=
                        "<input calc-on-change valtype=\"PRICE\" field-id=\"funitsalesprice\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_UNITSALESPRICE != null ? di.QLN_UNITSALESPRICE.fixed(constants.pricedecimals) : "") +
                        "\"/>";
                    strlinespart += "</td>";

                    strlinespart += "<td>";
                    strlinespart +=
                        "<input calc-on-change field-id=\"fsalesdiscount\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_SALESDISCOUNTRATE || "") +
                        "\"/>";
                    strlinespart += "</td>";
                    strlinespart += "<td>";
                    strlinespart +=
                        "<input field-id=\"fsalesdiscountedunitprice\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                        ((di.QLN_UNITSALESPRICE != null && di.QLN_SALESDISCOUNTRATE)
                            ? (di.QLN_UNITSALESPRICE - (di.QLN_UNITSALESPRICE * di.QLN_SALESDISCOUNTRATE / 100)).fixed(
                                constants.pricedecimals)
                            : "") +
                        "\"/>";
                    strlinespart += "</td>";
                    strlinespart += "<td>";
                    strlinespart += "<div class=\"input-group\">";
                    strlinespart += "<input field-id=\"fcurr\" type=\"text\" maxlength=\"50\" class=\"form-control" +
                        (di.QLN_UNITSALESPRICE != null ? " required" : "") +
                        "\" data-tooltip=\"" +
                        (di.QLN_CURRDESC || "") +
                        "\" value=\"" +
                        (di.QLN_CURR || "") +
                        "\">";
                    strlinespart += "<span class=\"input-group-btn\">";
                    strlinespart +=
                        "<button class=\"btn btn-default btn-currency\" type=\"button\"><i class=\"fa fa-search fa-fw\"></i></button>";
                    strlinespart += "</span>";
                    strlinespart += "</div>";
                    strlinespart += "</td>";
                    strlinespart += "<td>";
                    strlinespart +=
                        "<input field-id=\"fexch\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_EXCH != null ? di.QLN_EXCH.fixed(constants.exchdecimals) : "") +
                        "\"/>";
                    strlinespart += "</td>";
                    strlinespart += "<td>";
                    strlinespart +=
                        "<input field-id=\"ftotal\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                    (totalsales != null ? totalsales.fixed(constants.pricedecimals) : "") +
                        "\"/>";
                    strlinespart += "</td>";
                    if (!customer) {
                        strlinespart += "<td>";
                        strlinespart +=
                            "<span field-id=\"fprofitmargin\"><strong>" +
                            (profitmargin != null ? profitmargin : "") +
                            "</strong></span>";
                        strlinespart += "</td>";
                    }
                    strlinespart += "</tr>";
                }
                else if (di.QLN_TYPE === "MISCCOST") {
                    var misccostcode = (di.QLN_PARTCODE !== 0 ? "(" + di.QLN_PARTCODE + ") " : (di.QLN_SERVICECODE !== 0 ? "(" + di.QLN_SERVICECODE + ") " : ""));

                    strlinesmisccost += "<tr class=\"quotation-line quo-misccost\" data-recordversion=\"" +
                        di.QLN_RECORDVERSION +
                        "\"  data-linetype=\"MISCCOST\" data-id=\"" +
                        di.QLN_LINEID +
                        "\">";
                    strlinesmisccost += "<td>";
                    strlinesmisccost += "<a class=\"history\"  data-partcode=\"" + di.QLN_PARTCODE + "\" data-servicecode=\"" + di.QLN_SERVICECODE + "\" href=\"#\"><i style=\"cursor:pointer\" class=\"fa fa-fw fa-info-circle\" aria-hidden=\"true\"></i> " + misccostcode + di.QLN_DESCRIPTION + "</a>";;
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost += "<span field-id=\"fqty\">" +
                        (di.QLN_QUANTITY != null ? di.QLN_QUANTITY.fixed(constants.qtydecimals) : "") +
                        "</span>";
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost += di.QLN_UOM;
                    strlinesmisccost += "</td>";
                    if (!customer) {
                        strlinesmisccost += "<td>";
                        strlinesmisccost += "<span rvalue=\"" + (di.QLN_UNITPURCHASEPRICE * di.QLN_PURCHASEEXCH) + "\" field-id=\"funitpurchaseprice\">" +
                            (di.QLN_UNITPURCHASEPRICE != null
                                ? di.QLN_UNITPURCHASEPRICE.fixed(constants.pricedecimals)
                                : "") +
                            "</span>";
                        strlinesmisccost += "</td>";
                        strlinesmisccost += "<td>";
                        strlinesmisccost += "<span field-id=\"fpurchasecurr\">" + (di.QLN_PURCHASECURR || "") + "</span>";
                        strlinesmisccost += "</td>";
                        strlinesmisccost += "<td>";
                        strlinesmisccost += "<span rvalue=\"" + (di.QLN_UNITPURCHASEPRICE * di.QLN_PURCHASEEXCH * di.QLN_QUANTITY) + "\"  field-id=\"ftotalpurchase\">";
                        strlinesmisccost += (totalpurchase).fixed(constants.pricedecimals);
                        strlinesmisccost += "</span>";
                        strlinesmisccost += "</td>";
                    }

                    strlinesmisccost += "<td>";
                    strlinesmisccost +=
                        "<input calc-on-change valtype=\"PRICE\" field-id=\"funitsalesprice\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_UNITSALESPRICE != null ? di.QLN_UNITSALESPRICE.fixed(constants.pricedecimals) : "") +
                        "\"/>";
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost +=
                        "<input calc-on-change field-id=\"fsalesdiscount\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_SALESDISCOUNTRATE || "") +
                        "\"/>";
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost +=
                        "<input field-id=\"fsalesdiscountedunitprice\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                        ((di.QLN_UNITSALESPRICE != null && di.QLN_SALESDISCOUNTRATE)
                            ? (di.QLN_UNITSALESPRICE - (di.QLN_UNITSALESPRICE * di.QLN_SALESDISCOUNTRATE / 100)).fixed(
                                constants.pricedecimals)
                            : "") +
                        "\"/>";
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost += "<div class=\"input-group\">";
                    strlinesmisccost +=
                        "<input field-id=\"fcurr\" type=\"text\" maxlength=\"50\" class=\"form-control" +
                        (di.QLN_UNITSALESPRICE != null ? " required" : "") +
                        "\" data-tooltip=\"" +
                        (di.QLN_CURRDESC || "") +
                        "\" value=\"" +
                        (di.QLN_CURR || "") +
                        "\">";
                    strlinesmisccost += "<span class=\"input-group-btn\">";
                    strlinesmisccost +=
                        "<button class=\"btn btn-default btn-currency\" type=\"button\"><i class=\"fa fa-search fa-fw\"></i></button>";
                    strlinesmisccost += "</span>";
                    strlinesmisccost += "</div>";
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost +=
                        "<input field-id=\"fexch\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                        (di.QLN_EXCH != null ? di.QLN_EXCH.fixed(constants.exchdecimals) : "") +
                        "\"/>";
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "<td>";
                    strlinesmisccost +=
                        "<input field-id=\"ftotal\" disabled=\"disabled\" class=\"form-control\" type=\"text\" value=\"" +
                    (totalsales != null ? totalsales.fixed(constants.pricedecimals) : "") +
                        "\"/>";
                    strlinesmisccost += "</td>";
                    if (!customer) {
                        strlinesmisccost += "<td>";
                        strlinesmisccost +=
                            "<span field-id=\"fprofitmargin\"><strong>" +
                            (profitmargin != null ? profitmargin : "") +
                            "</strong></span>";
                    }
                    strlinesmisccost += "</td>";
                    strlinesmisccost += "</tr>";
                }
            }

            $(strlineslabor).insertAfter($("#sectionlabor"));
            $(strlinespart).insertAfter($("#sectionpart"));
            $(strlinesmisccost).insertAfter($("#sectionmisccost"));

            quotationlinestable.find("button.btn-currency").on("click",
                function () {
                    var $this = $(this);
                    var row = $this.closest("tr");
                    var icurr = row.find("input[field-id=\"fcurr\"]");
                    var iexch = row.find("input[field-id=\"fexch\"]");
                    var itotal = row.find("input[field-id=\"ftotal\"]");

                    gridModal.show({
                        modaltitle: gridstrings.currencies[lang].title,
                        listurl: "/Api/ApiCurrencies/List",
                        keyfield: "CUR_CODE",
                        codefield: "CUR_CODE",
                        textfield: "CUR_DESC",
                        returninput: iexch,
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
                        callback: function (c) {
                            icurr.val(c ? c.CUR_CODE : "");
                            if (c) {
                                tooltip.show(icurr, c.CUR_DESC);
                                $.when(shr.CalculateExch(c.CUR_CODE)).done(function (d) {
                                    iexch.val(d.data
                                        ? parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals)
                                        : "");
                                    CalculateSum();
                                });
                            } else {
                                tooltip.hide(icurr);
                                iexch.val("");
                                itotal.val("");
                                CalculateSum();
                            }
                        }
                    });
                });
            quotationlinestable.find("input[field-id=\"fcurr\"]").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                filter: [{ field: "CUR_CODE", value: "*", operator: "neq" }],
                callback: function (c, e) {
                    var row = e.closest("tr");
                    var iexch = row.find("input[field-id=\"fexch\"]");
                    var itotal = row.find("input[field-id=\"ftotal\"]");
                    e.val(c ? c.CUR_CODE : "");
                    if (c) {
                        tooltip.show(e, c.CUR_DESC);
                        $.when(shr.CalculateExch(c.CUR_CODE)).done(function (d) {
                            iexch.val(d.data ? parseFloat(d.data.CRR_EXCH).fixed(constants.exchdecimals) : "");
                            CalculateSum();
                        });
                    } else {
                        tooltip.hide(e);
                        iexch.val("");
                        itotal.val("");
                        CalculateSum();
                    }
                }
            });
            quotationlinestable.find("input[field-id=\"fcurr\"]").each(function () {
                var $this = $(this);
                var tooltiptext = $this.data("tooltip");
                if (tooltiptext) {
                    tooltip.show($this, tooltiptext);
                }
            });
            quotationlinestable.find("[valtype=\"PRICE\"]").on("change",
                function () {
                    var v = $(this).val() || null;
                    if (v != null) $(this).val(parseFloat(v).fixed(constants.pricedecimals));
                });
            quotationlinestable.find("input[calc-on-change]").numericInput({ allowNegative: true, allowFloat: true });
            quotationlinestable.find("input[calc-on-change]").on("change",
                function () {
                    var $this = $(this);
                    var row = $this.closest("tr");
                    row.find("input[calc-on-change]").removeAttr("edited");
                    $this.attr("edited", "+");
                    $.when(RowValues(row)).done(function () {
                        CalculateSum();
                    });
                });
            quotationlinestable.find("a.history").unbind("click").click(function () {
                partcode = $(this).data("partcode");
                servicecode = $(this).data("servicecode");

                if (partcode !== 0 || servicecode !== 0) {
                    $("#modalquohistory").modal("show");
                    historyList(false);
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#quotationsales"))
                return $.Deferred().reject();

            var quotationlinestable = $("#quotationsales table tbody");
            var rows = quotationlinestable.find("tr.quotation-line");

            var arrvalues = [];
            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]);

                var id = row.data("id");
                var linetype = row.data("linetype");
                var recordversion = row.data("recordversion");
                var elm_funitsalesprice = row.find("input[field-id=\"funitsalesprice\"]");
                var elm_fsalesdiscount = row.find("input[field-id=\"fsalesdiscount\"]");
                var elm_ftotal = row.find("input[field-id=\"ftotal\"]");
                var elm_fexch = row.find("input[field-id=\"fexch\"]");
                var elm_fcurr = row.find("input[field-id=\"fcurr\"]");

                var val_funitsalesprice = parseFloat(elm_funitsalesprice.val() || null);
                var val_fsalesdiscount = parseFloat(elm_fsalesdiscount.val() || null);
                var val_fexch = parseFloat(elm_fexch.val() || null);
                var val_ftotal = parseFloat(elm_ftotal.val() || null);
                var val_fcurr = (elm_fcurr.val() || null);

                arrvalues.push({
                    Type: linetype,
                    Id: id,
                    UnitSalesPrice: val_funitsalesprice,
                    SalesDiscount: val_fsalesdiscount,
                    Exch: val_fexch,
                    Curr: val_fcurr,
                    Total: val_ftotal,
                    Recordversion: recordversion
                });
            }

            return tms.Ajax({
                url: "/Api/ApiQuotations/SaveLines",
                data: JSON.stringify(arrvalues),
                fn: function (d) {
                    msgs.success(d.data);
                    self.List();
                }
            });
        };
        this.List = function () {
            if (selectedrecord) {
                var gridreq = {
                    filter: {
                        filters: [
                            { field: "QLN_QUOTATION", value: selectedrecord.QUO_ID, operator: "eq" }
                        ]
                    },
                    loadall: true
                };
                return tms.Ajax({
                    url: "/Api/ApiQuotations/ListLinesView",
                    data: JSON.stringify(gridreq),

                    fn: function (d) {
                        var exch = selectedrecord.QUO_EXCH || 1.00;
                        var curr = selectedrecord.QUO_CURR || selectedrecord.QUO_ORGANIZATIONCURR;
                        purchasing = 0;
                        $.each(d.data,
                            function (i, e) {
                                purchasing += e.QLN_QUANTITY * e.QLN_UNITPURCHASEPRICE * e.QLN_PURCHASEEXCH / exch;
                            });
                        $("#purchasing").text(purchasing.toLocaleString(undefined,
                            {
                                maximumFractionDigits: constants.pricedecimals,
                                minimumFractionDigits: constants.pricedecimals
                            }) +
                            " " +
                            curr);
                        BuildLinesTable(d.data);
                        CalculateLineValues();
                        CalculateSum();
                    }
                });
            }
        };
        this.ResetUI = function () {
            tms.UnBlock("#quotationsales");

            $("#laborsum").html("");
            $("#partsum").html("");
            $("#misccostsum").html("");
            $("#purchasing").html("");
            $("#sales").html("");
            $("#profit").html("");
            $("#iprofit").val("");
            $("#idiscountrate").val("");

            if (selectedstatus.STA_PCODE === "C" || !!customer)
                tms.Block("#quotationsales");
        }
        var RegisterUIEvents = function () {
            $("#iprofit").on("change",
                function () {
                    var $this = $(this);
                    var profitpercent = $this.val();
                    var quotationlinestable = $("#quotationsales table tbody");
                    var rows = quotationlinestable.find("tr.quotation-line");
                    rows.each(function () {
                        var row = $(this);
                        var funitsalesprice = row.find("input[field-id=\"funitsalesprice\"]");
                        var funitpurchaseprice = row.find("span[field-id=\"funitpurchaseprice\"]");
                        var funitpurchaseprice_v = parseFloat(funitpurchaseprice.text());
                        var salesprice =
                            (funitpurchaseprice_v + (funitpurchaseprice_v * profitpercent / 100)).fixed(
                                constants.pricedecimals);
                        funitsalesprice.val(profitpercent ? salesprice || "" : "");
                        funitsalesprice.attr("edited", "+");
                        $.when(RowValues(row)).done(function () {
                            CalculateSum();
                        });
                    });
                });
            $("#idiscountrate").on("change",
                function () {
                    var $this = $(this);
                    var discountrate = $this.val();
                    var quotationlinestable = $("#quotationsales table tbody");
                    var rows = quotationlinestable.find("tr.quotation-line");
                    rows.each(function () {
                        var row = $(this);
                        var fsalesdiscount = row.find("input[field-id=\"fsalesdiscount\"]");
                        fsalesdiscount.val(discountrate || "");
                        $.when(RowValues(row)).done(function () {
                            CalculateSum();
                        });
                    });
                });
            $("#btnSaveLines").on("click",
                function () {
                    self.Save();
                });
        };
        RegisterUIEvents();
    }

    quo = new function () {
        var self = this;
        var grdQuotations = null;
        var grdQuotationsElm = $("#grdQuotations");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var organizationcurr = null;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMQUOTATIONS", operator: "eq" },
                    { field: "AUD_REFID", value: quotationid, operator: "eq" }
                ]
            });
        };
        var LoadTaskActivities;

        var FillMailRecipients = function (recipients) {
            $("#mailrecipients").tagsinput("removeAll");
            if (recipients && recipients.length > 0) {
                for (var i = 0; i < recipients.length; i++) {
                    var user = recipients[i];
                    $("#mailrecipients").tagsinput("add", { id: user.USR_CODE, text: user.USR_DESC }, ["ignore"]);
                }
            }
        }
        function ResetSidebarFilter() {
            $("#datecreated_end").val("");
            $("#datecreated_start").val("");
            $("#appdate_start").val("");
            $("#appdate_end").val("");
        };
        function RunSidebarFilter() {
            var gridfilter = GetFilter();
            grdQuotations.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        };
        var EnableDisableTypeUI = function (typecode) {
            switch (typecode) {
                case "ALISSATIS":
                    $("#divsupplier").removeClass("hidden");
                    $("#supplier").attr("required", "required").addClass("required");
                    $("#projectdiv").addClass("hidden");
                    $("#project").removeAttr("required", "required").removeClass("required");
                    $("#taskactivitydiv").removeClass("hidden");
                    $("#project").val("");

                    break;
                case "PROJE":
                    $("#divsupplier").addClass("hidden");
                    $("#supplier").removeAttr("required").removeClass("required");
                    $("#projectdiv").removeClass("hidden");
                    $("#project").attr("required", "required").addClass("required");
                    $("#taskactivitydiv").addClass("hidden");
                    $("#task").val("");
                    $("#taskdesc").val("");
                    $("#activity").val("");
                    $("#activity option:not(.default)").remove();
                    $("#activity").prop("disabled", true);
                    break;
                default:
                    $("#divsupplier").addClass("hidden");
                    $("#supplier").removeAttr("required").removeClass("required");
                    $("#project").removeAttr("required").removeClass("required");
                    $("#projectdiv").addClass("hidden");
                    $("#taskactivitydiv").removeClass("hidden");
                    $("#supplier").val("");
                    $("#project").val("");
                    break;
            }
        }
        var UpdateExch = function () {
            var curr = $("#curr").val();
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
        }
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
                        $("#task").val("");
                        tooltip.hide("#type");
                        tooltip.hide("#task");
                        if (d) {
                            $("#curr").val(d.ORG_CURRENCY);
                            tooltip.show("#curr", d.ORG_CURRENCYDESC);
                            organizationcurr = d.ORG_CURRENCY;
                            return UpdateExch();
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
                        { field: "TYP_ENTITY", value: "QUOTATION", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            EnableDisableTypeUI(data.TYP_CODE);
                            customFieldsHelper.loadCustomFields({
                                subject: "QUOTATION",
                                source: quotationid,
                                type: data.TYP_CODE
                            });
                        }
                    }
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
                        {
                            type: "string",
                            field: "SUP_PROVINCEDESC",
                            title: gridstrings.suppliers[lang].provincedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SUP_DISTRICTDESC",
                            title: gridstrings.suppliers[lang].districtdesc,
                            width: 250
                        }
                    ],
                    filter: [
                        { field: "SUP_ACTIVE", value: "+", operator: "eq" },
                        { field: "SUP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnmanager").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#manager",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
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
                        { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (d) {
                        if (d) {
                            $("#manager").val(d.CUS_PMMASTER || user);
                            tooltip.show("#manager", d.CUS_PMMASTERDESC || userdesc);
                        } else {
                            $("#manager").val(user);
                            tooltip.show("#manager", userdesc);
                        }
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
                        { field: "TSK_STATUSP", value: "C", operator: "neq" },
                        { field: "TSK_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                    ],
                    fields: { TSK_ID: { type: "number" } },
                    callback: function (data) {
                        if (data) {
                            $("#activity").addClass("required").attr("required", "required");
                            $("#taskdesc").val(data.TSK_SHORTDESC);
                            $("#branch").val(data.TSK_BRANCHDESC);
                            $("#location").val(data.TSK_LOCATIONDESC);
                            LoadTaskActivities(data.TSK_ID);
                        } else {
                            $("#activity").removeClass("required").removeAttr("required");
                            $("#taskdesc").val("");
                            $("#activity").val("");
                            $("#activity option:not(.default)").remove();
                            $("#activity").prop("disabled", true);
                            $("#branch").val("");
                            $("#location").val("");s

                        }
                    }
                });
            });
            $("#btnproject").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.project[lang].title,
                    listurl: "/Api/ApiProjects/List",
                    keyfield: "PRJ_ID",
                    codefield: "PRJ_ID",
                    textfield: "PRJ_DESC",
                    returninput: "#project",
                    columns: [
                        { type: "number", field: "PRJ_ID", title: gridstrings.project[lang].project, width: 100 },
                        { type: "string", field: "PRJ_DESC", title: gridstrings.project[lang].description, width: 400 }
                    ],
                    fields: {
                        PRJ_ID: { type: "number" }
                    },
                    filter: [
                        { field: "PRJ_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            $("#projectdesc").val(data.PRJ_DESC);
                        } else {
                            $("#projectdesc").val("");
                        }
                    }
                });
            });
            $("#btncurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#curr",
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
            $("#btnrejectreason").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#rejectreason",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "QUOREJECTREASON", operator: "eq" }
                    ]
                });
            });
            $("#btnmailrecipients").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/ListCustomerUsers",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#mailrecipients",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUSTOMER", value: $("#customer").val(), operator: "eq" }


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
                    organizationcurr = null;
                    $("#type").val("");
                    $("#task").val("");
                    tooltip.hide("#type");
                    tooltip.hide("#task");
                    if (d) {
                        organizationcurr = d.ORG_CURRENCY;
                        $("#org").val(d.ORG_CODE).trigger("change");
                        $("#curr").val(d.ORG_CURRENCY);
                        tooltip.show("#org", d.ORG_DESCF);
                        tooltip.show("#curr", d.ORG_CURRENCYDESC);
                        return UpdateExch();
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
                    { field: "TYP_ENTITY", value: "QUOTATION", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        EnableDisableTypeUI(data.TYP_CODE);
                        customFieldsHelper.loadCustomFields({
                            subject: "QUOTATION",
                            source: quotationid,
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#supplier").autocomp({
                listurl: "/Api/ApiSuppliers/List",
                geturl: "/Api/ApiSuppliers/Get",
                field: "SUP_CODE",
                textfield: "SUP_DESC",
                active: "SUP_ACTIVE",
                filter: [
                    { field: "SUP_ORGANIZATION", relfield: "#org", includeall: true }
                ]
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
                    if (d) {
                        $("#manager").val(d.CUS_PMMASTER || user);
                        tooltip.show("#manager", d.CUS_PMMASTERDESC || userdesc);
                    } else {
                        $("#manager").val(user);
                        tooltip.show("#manager", userdesc);
                    }
                }
            });
            $("#manager").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_CODE", value: "*", operator: "neq" },
                    { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                ]
            });
            $("#rejectreason").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [
                    { field: "SYC_GROUP", value: "QUOREJECTREASON", operator: "eq" }
                ]
            });
            $("#task").autocomp({
                listurl: "/Api/ApiTask/List",
                geturl: "/Api/ApiTask/Get",
                field: "TSK_ID",
                textfield: "TSK_SHORTDESC",
                termisnumeric: true,
                filter: [
                    { field: "TSK_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TSK_STATUSP", value: "C", operator: "neq" },
                    { field: "TSK_CUSTOMER", relfield: "#customer", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        $("#activity").addClass("required").attr("required", "required");
                        $("#taskdesc").val(data.TSK_SHORTDESC);
                        $("#branch").val(data.TSK_BRANCHDESC);
                        $("#location").val(data.TSK_LOCATIONDESC);
                        LoadTaskActivities(data.TSK_ID);
                    } else {
                        $("#activity").removeClass("required").removeAttr("required");
                        $("#taskdesc").val("");
                        $("#activity").val("");
                        $("#activity option:not(.default)").remove();
                        $("#activity").prop("disabled", true);
                        $("#branch").val("");
                        $("#location").val("");
                    }
                }
            });
            $("#project").autocomp({
                listurl: "/Api/ApiProjects/List",
                geturl: "/Api/ApiProjects/Get",
                field: "PRJ_ID",
                textfield: "PRJ_DESC",
                termisnumeric: true,
                filter: [{ field: "PRJ_ORGANIZATION", relfield: "#org", includeall: true }],
                callback: function (data) {
                    if (data) {
                        $("#projectdesc").val(data.PRJ_DESC);
                    } else {
                        $("#projectdesc").val("");
                    }
                }
            });
            $("#curr").autocomp({
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
        };
        var FillTabCounts = function (id) {
            return tms.Ajax({
                url: "/Api/ApiQuotations/GetTabCounts",
                data: JSON.stringify(id),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        var tab = $("#navquotations a[href=\"" + d.data[i].TAB + "\"]");
                        tab.find("span").remove();
                        tab.append(" <span class=\"badge " +
                            (d.data[i].CNT > 0 ? " badge-danger" : "") +
                            "\">" +
                            d.data[i].CNT +
                            "</span>");
                        if (d.data[i].TAB === "#quotationparts") {
                            partcount = d.data[i].CNT;
                        }
                    }
                }
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "QUOTATION",
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
        LoadTaskActivities = function (taskid) {
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
                    $("#activity option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].TSA_LINE +
                            "\"" +
                            (d.data[i].TSA_COMPLETED === "+" ? " disabled=\"disabled\"" : "") +
                            "data-tsaid=\"" + d.data[i].TSA_ID+ "\""+
                            ">" +
                            d.data[i].TSA_LINE +
                            " - " +
                            d.data[i].TSA_DESC +
                            "</option>";
                    }
                    $("#activity").append(strOptions);
                    $("#activity").val($("#activity").data("selected"));
                    $("#activity").prop("disabled", false);
                }
            });
        };
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "QUOTATION", operator: "eq" },
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
                        { field: "CNR_ENTITY", value: "QUOTATION", operator: "eq" }
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

            $("#divcancellationreason,#divrejectreason").addClass("hidden");
            $("#cancellationreason,#rejectreason").removeAttr("required").removeClass("required");
            tooltip.hide("#rejectreason");

            if (selectedrecord) {
                switch (code) {
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        var cancellationreason = $("#cancellationreason");
                        cancellationreason.prop("disabled", code === currentcode).attr("required", "").addClass("required");
                        cancellationreason.val($("#cancellationreason").data("selected"));
                        break;
                    case "RED2":
                        $("#divrejectreason").removeClass("hidden");
                        $("#btnrejectreason").prop("disabled", code === currentcode);
                        var rejectreason = $("#rejectreason");
                        var selectedrejectreason = rejectreason.data("selected");
                        var tooltiprejectreason = rejectreason.data("tooltip");
                        rejectreason.prop("disabled", code === currentcode).attr("required", "").addClass("required");
                        rejectreason.val(selectedrejectreason);
                        tooltip.show(rejectreason, tooltiprejectreason);
                        break;
                    default:
                        $("#cancellationreason,#rejectreason").val("");
                        break;
                }
            }
        };
        this.Print = function () {
            $("#modalprint").modal("show");
        }
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues({
                    subject: "QUOTATION",
                    source: quotationid,
                    type: $("#type").val()
                });
            var o = JSON.stringify(
                {
                    Quotation: {
                        QUO_ID: (quotationid || 0),
                        QUO_ORGANIZATION: $("#org").val(),
                        QUO_DESCRIPTION: $("#desc").val(),
                        QUO_REFERENCENO: ($("#referenceno").val() || null),
                        QUO_REVNO: ($("#revision").val() || "0"),
                        QUO_TYPEENTITY: "QUOTATION",
                        QUO_TYPE: $("#type").val(),
                        QUO_CUSTOMER: $("#customer").val(),
                        QUO_CUSMAIL: $("#cusmail").val(),
                        QUO_TASK: ($("#task").val() || null),
                        QUO_ACTIVITY: ($("#activity").val() || $("#activity").data("selected")),
                        QUO_PROJECT: ($("#project").val() || null),
                        QUO_VALIDITYPERIOD: $("#validityperiod").val(),
                        QUO_SUPPLIER: !customer ? ($("#supplier").val() || null) : (selectedrecord ? selectedrecord.QUO_SUPPLIER  : null),
                        QUO_MANAGER: ($("#manager").val() || null),
                        QUO_REMINDINGPERIOD: ($("#remindingperiod").val() || null),
                        QUO_NOTE: ($("#quonote").val() || null),
                        QUO_SUPPLYPERIOD: ($("#supplyperiod").val()
                            ? moment.utc($("#supplyperiod").val(), constants.dateformat)
                            : null),
                        QUO_STATUSENTITY: "QUOTATION",
                        QUO_STATUS: $("#status").val(),
                        QUO_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        QUO_REJECTREASON: ($("#rejectreason").val() || null),
                        QUO_PAYMENTDUE: ($("#paymentdue").val() || null),
                        QUO_CURR: $("#curr").val(),
                        QUO_EXCH: $("#exch").val(),
                        QUO_MAILRECIPIENTS: ($("#mailrecipients").val() || null),
                        QUO_CREATED: selectedrecord != null ? selectedrecord.QUO_CREATED : tms.Now(),
                        QUO_CREATEDBY: selectedrecord != null ? selectedrecord.QUO_CREATEDBY : user,
                        QUO_UPDATED: selectedrecord != null ? tms.Now() : null,
                        QUO_UPDATEDBY: selectedrecord != null ? user : null,
                        QUO_RECORDVERSION: selectedrecord != null ? selectedrecord.QUO_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiQuotations/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    quotationid = d.r.Quotation.QUO_ID;
                    $("#Quotation").val(quotationid);
                    return self.LoadSelected();
                }
            });
        };
        this.CopyDocsFromTask = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify(
               {
                   Subject: "TASK",
                   Source: selectedrecord.QUO_TASK,
                   TargetSubject: "QUOTATION",
                   TargetSource: selectedrecord.QUO_ID,
               });

            return tms.Ajax({
                url: "/Api/ApiDocuments/CopyDocs",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    documentsHelper.showDocumentsBlock({ subject: "QUOTATION", source: selectedrecord.QUO_ID });
                }
            });
        };
        this.Delete = function () {
            if (quotationid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiQuotations/DelRec",
                            data: JSON.stringify(quotationid),
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
            quotationid = null;

            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);
            $("#navquotations a span").remove();

            $("#code").val("");
            $("#org").val("");
            $("#desc").val("");
            $("#details").val("");
            $("#revision").val("");
            $("#referenceno").val("");
            $("#type").val("");
            $("#supplier").val("");
            $("#quonote").val("");
            $("#manager").val(user);
            $("#customer").val("");
            $("#cusmail").val("");
            $("#task").val("");
            $("#taskdesc").val("");
            $("#project").val("");
            $("#projectdesc").val("");
            $("#activity").val("").data("selected", null);
            $("#remindingperiod").val("");
            $("#supplyperiod").val("");
            $("#paymentdue").val("");
            $("#curr").val("");
            $("#exch").val("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");
            $("#exch").prop("disabled", false).attr("required", "required").addClass("required");
            $("#rejectreason").removeAttr("required").removeClass("required");
            $("#rejectreason").val("");
            $("#branch").val("");
            $("#location").val("");
            $("#validityperiod").val("");
            $("#mailrecipients").tagsinput("removeAll");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            $("#divsupplier").addClass("hidden");
            $("#taskactivitydiv").removeClass("hidden");
            $("#projectdiv").addClass("hidden");

            tooltip.show("#manager", userdesc);
            tooltip.hide("#type");
            tooltip.hide("#customer");
            tooltip.hide("#org");
            tooltip.hide("#supplier");
            tooltip.hide("#task");
            tooltip.hide("#project");
            tooltip.hide("#curr");


            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");
            $("#btnDownload").attr("href", "#");


            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();
            organizationcurr = selectedrecord.QUO_ORGANIZATIONCURR;
            EnableDisableTypeUI(selectedrecord.QUO_TYPE);

            $("#code").val(selectedrecord.QUO_ID);
            $("#org").val(selectedrecord.QUO_ORGANIZATION);
            $("#desc").val(selectedrecord.QUO_DESCRIPTION);
            $("#referenceno").val(selectedrecord.QUO_REFERENCENO);
            $("#revision").val(selectedrecord.QUO_REVNO);
            $("#type").val(selectedrecord.QUO_TYPE);
            $("#supplier").val(selectedrecord.QUO_SUPPLIER);
            $("#manager").val(selectedrecord.QUO_MANAGER);
            $("#customer").val(selectedrecord.QUO_CUSTOMER);
            $("#cusmail").val(selectedrecord.QUO_CUSMAIL);
            $("#quonote").val(selectedrecord.QUO_NOTE);
            $("#task").val(selectedrecord.QUO_TASK);
            $("#rejectreason").data("selected", selectedrecord.QUO_REJECTREASON);
            $("#rejectreason").data("tooltip", selectedrecord.QUO_REJECTREASONDESC);
            $("#taskdesc").val(selectedrecord.QUO_TASKDESC);
            $("#project").val(selectedrecord.QUO_PROJECT);
            $("#projectdesc").val(selectedrecord.QUO_PROJECTDESC);
            $("#activity").data("selected", selectedrecord.QUO_ACTIVITY);
            $("#remindingperiod").val(selectedrecord.QUO_REMINDINGPERIOD);
            $("#supplyperiod").val(selectedrecord.QUO_SUPPLYPERIOD
                ? moment(selectedrecord.QUO_SUPPLYPERIOD).format(constants.dateformat)
                : "");
            $("#paymentdue").val(selectedrecord.QUO_PAYMENTDUE);
            $("#curr").val(selectedrecord.QUO_CURR);
            $("#exch").val(selectedrecord.QUO_EXCH ? selectedrecord.QUO_EXCH.fixed(constants.exchdecimals) : "");

            if (selectedrecord.QUO_CURR === organizationcurr) {
                $("#exch").removeClass("required").prop("disabled", true).removeAttr("required");
            } else {
                $("#exch").addClass("required").prop("disabled", false).attr("required");
            }

            $("#cancellationreason").data("selected", selectedrecord.QUO_CANCELLATIONREASON);
            $("#created").val(moment(selectedrecord.QUO_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.QUO_CREATEDBY);
            $("#branch").val(selectedrecord.QUO_BRANCHDESC);
            $("#location").val(selectedrecord.QUO_LOCATIONDESC);
            $("#validityperiod").val(selectedrecord.QUO_VALIDITYPERIOD || tmsparameters.QUOVALIDITYPERIOD );


            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);

            if (selectedrecord.QUO_TASK) {
                LoadTaskActivities(selectedrecord.QUO_TASK);
            }

            tooltip.show("#org", selectedrecord.QUO_ORGDESC);
            tooltip.show("#type", selectedrecord.QUO_TYPEDESC);
            tooltip.show("#customer", selectedrecord.QUO_CUSTOMERDESC);
            tooltip.show("#supplier", selectedrecord.QUO_SUPPLIERDESC);
            tooltip.show("#manager", selectedrecord.QUO_MANAGERDESC);
            tooltip.show("#task", selectedrecord.QUO_TASKDESC);
            tooltip.show("#project", selectedrecord.QUO_PROJECTDESC);
            tooltip.show("#curr", selectedrecord.QUO_CURRDESC);
            tooltip.show("#rejectreason", selectedrecord.QUO_REJECTREASONDESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");
            $("#btnDownload").on("click",
                function () {
                    window.location = "/Download.ashx?subject=QUOTATION&source=" + selectedrecord.QUO_ID;
                });

            commentsHelper.showCommentsBlock({ subject: "QUOTATION", source: selectedrecord.QUO_ID });
            documentsHelper.showDocumentsBlock({ subject: "QUOTATION", source: selectedrecord.QUO_ID });;
            return $.when(customFieldsHelper.loadCustomFields({
                subject: "QUOTATION",
                source: selectedrecord.QUO_ID,
                type: selectedrecord.QUO_TYPE
            })).done(function () {
                return $.when(LoadStatuses({
                    pcode: selectedstatus.STA_PCODE,
                    code: selectedstatus.STA_CODE,
                    text: selectedstatus.STA_DESCF
                })).done(function () {
                    return $.when(LoadCancellationReasons()).done(function () {
                        EvaluateCurrentStatus();
                    });
                });
            });
        };
        this.LoadSelected = function (dataonly) {
            return tms.Ajax({
                url: "/Api/ApiQuotations/Get",
                data: JSON.stringify(quotationid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    mailrecipients = d.recipients;
                    if (!dataonly) {
                        FillUserInterface();
                        FillTabCounts(selectedrecord.QUO_ID);
                        FillMailRecipients(mailrecipients);
                        customFieldsHelper.loadCustomFields({
                            subject: "QUOTATION",
                            source: quotationid,
                            type: $("#type").val()
                        });
                    }
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdQuotations.GetRowDataItem(row);
            quotationid = selectedrecord.QUO_ID;
            $("#Quotation").val(selectedrecord.QUO_ID);
            $(".page-header h6").html(selectedrecord.QUO_ID + " - " + selectedrecord.QUO_DESCRIPTION);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdQuotationsElm.find("[data-id]").on("dblclick",
                function () {
                    $.when(FillTabCounts(quotationid)).done(function () {
                        $(".nav-tabs a[href=\"#record\"]").tab("show");
                    });
                });

            grdQuotationsElm.find("#search").off("click").on("click", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
        };
        var GetColumns = function () {
            var columns = [
                {
                    type: "number",
                    field: "QUO_ID",
                    title: gridstrings.quotations[lang].quotationno,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_DESCRIPTION",
                    title: gridstrings.quotations[lang].description,
                    width: 350
                },
                {
                    type: "string",
                    field: "QUO_ORGANIZATION",
                    title: gridstrings.quotations[lang].organization,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_ORGANIZATIONDESC",
                    title: gridstrings.quotations[lang].organizationdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "QUO_TYPE",
                    title: gridstrings.quotations[lang].type,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_TYPEDESC",
                    title: gridstrings.quotations[lang].typedesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "QUO_STATUS",
                    title: gridstrings.quotations[lang].status,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_STATUSDESC",
                    title: gridstrings.quotations[lang].statusdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "QUO_SUPPLIER",
                    title: gridstrings.quotations[lang].supplier,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_SUPPLIERDESC",
                    title: gridstrings.quotations[lang].supplierdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "QUO_PMDESC",
                    title: gridstrings.quotations[lang].pm,
                    width: 200
                },
                {
                    type: "number",
                    field: "QUO_REVNO",
                    title: gridstrings.quotations[lang].revision,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_REFERENCENO",
                    title: gridstrings.quotations[lang].referenceno,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_CANCELLATIONREASON",
                    title: gridstrings.quotations[lang].cancellationreason,
                    width: 300
                },
                {
                    type: "number",
                    field: "QUO_PAYMENTDUE",
                    title: gridstrings.quotations[lang].paymentdue,
                    width: 200
                },
                {
                    type: "date",
                    field: "QUO_SUPPLYPERIOD",
                    title: gridstrings.quotations[lang].supplyperiod,
                    width: 200
                },
                {
                    type: "number",
                    field: "QUO_REMINDINGPERIOD",
                    title: gridstrings.quotations[lang].reminding,
                    width: 200
                },
                {
                    type: "price",
                    field: "QUO_PARTPURCHASE",
                    title: gridstrings.quotations[lang].partpurchase,
                    width: 200
                },
                {
                    type: "price",
                    field: "QUO_SERVICEPURCHASE",
                    title: gridstrings.quotations[lang].servicepurchase,
                    width: 200
                },
                {
                    type: "price",
                    field: "QUO_TOTALPURCHASE",
                    title: gridstrings.quotations[lang].totalpurchase,
                    width: 200
                },
                {
                    type: "price",
                    field: "QUO_PARTSALES",
                    title: gridstrings.quotations[lang].partsales,
                    width: 200
                },
                {
                    type: "price",
                    field: "QUO_SERVICESALES",
                    title: gridstrings.quotations[lang].servicesales,
                    width: 200
                },
                {
                    type: "price",
                    field: "QUO_TOTALSALES",
                    title: gridstrings.quotations[lang].totalsales,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_CURR",
                    title: gridstrings.quotations[lang].curr,
                    width: 200
                },
                {
                    type: "exch",
                    field: "QUO_EXCH",
                    title: gridstrings.quotations[lang].exch,
                    width: 200
                },
                {
                    type: "number",
                    field: "QUO_TASK",
                    title: gridstrings.quotations[lang].task,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_TASKDESC",
                    title: gridstrings.quotations[lang].taskdescription,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_TASKREFERENCE",
                    title: gridstrings.quotations[lang].taskreference,
                    width: 200
                },
                {
                    type: "number",
                    field: "QUO_PROJECT",
                    title: gridstrings.quotations[lang].project,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_PROJECTDESC",
                    title: gridstrings.quotations[lang].projectdescription,
                    width: 200
                },
                {
                    type: "number",
                    field: "QUO_ACTIVITY",
                    title: gridstrings.quotations[lang].activity,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_CUSTOMER",
                    title: gridstrings.quotations[lang].customer,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_CUSTOMERDESC",
                    title: gridstrings.quotations[lang].customerdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_BRANCH",
                    title: gridstrings.quotations[lang].branch,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_BRANCHDESC",
                    title: gridstrings.quotations[lang].branchdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_BRANCHREFERENCE",
                    title: gridstrings.quotations[lang].branchreference,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_LOCATION",
                    title: gridstrings.quotations[lang].location,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_LOCATIONDESC",
                    title: gridstrings.quotations[lang].locationdesc,
                    width: 200
                },
                {
                    type: "number",
                    field: "QUO_VALIDITYPERIOD",
                    title: gridstrings.quotations[lang].validityperiod,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_CREATEDBY",
                    title: gridstrings.quotations[lang].createdby,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "QUO_CREATED",
                    title: gridstrings.quotations[lang].created,
                    width: 200
                },
                {
                    type: "string",
                    field: "QUO_UPDATEDBY",
                    title: gridstrings.quotations[lang].updatedby,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "QUO_UPDATED",
                    title: gridstrings.quotations[lang].updated,
                    width: 200
                }
            ];
            if (customer) {
                columns = [
                    {
                        type: "number",
                        field: "QUO_ID",
                        title: gridstrings.quotations[lang].quotationno,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_BRANCHDESC",
                        title: gridstrings.quotations[lang].branchdesc,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_DESCRIPTION",
                        title: gridstrings.quotations[lang].description,
                        width: 350
                    },
                    {
                        type: "string",
                        field: "QUO_STATUSDESC",
                        title: gridstrings.quotations[lang].statusdesc,
                        width: 250
                    },
                    {
                        type: "number",
                        field: "QUO_TASK",
                        title: gridstrings.quotations[lang].task,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "QUO_ACTIVITY",
                        title: gridstrings.quotations[lang].activity,
                        width: 200
                    },
                    {
                        type: "price",
                        field: "QUO_PARTSALES",
                        title: gridstrings.quotations[lang].partsales,
                        width: 200
                    },
                    {
                        type: "price",
                        field: "QUO_SERVICESALES",
                        title: gridstrings.quotations[lang].servicesales,
                        width: 200
                    },
                    {
                        type: "price",
                        field: "QUO_TOTALSALES",
                        title: gridstrings.quotations[lang].totalsales,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_CURR",
                        title: gridstrings.quotations[lang].curr,
                        width: 200
                    },
                    {
                        type: "exch",
                        field: "QUO_EXCH",
                        title: gridstrings.quotations[lang].exch,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_CANCELLATIONREASON",
                        title: gridstrings.quotations[lang].cancellationreason,
                        width: 300
                    },
                    {
                        type: "string",
                        field: "QUO_TASKDESC",
                        title: gridstrings.quotations[lang].taskdescription,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_TASKREFERENCE",
                        title: gridstrings.quotations[lang].taskreference,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_BRANCH",
                        title: gridstrings.quotations[lang].branch,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_MANAGER",
                        title: gridstrings.quotations[lang].manager,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_CREATEDBY",
                        title: gridstrings.quotations[lang].createdby,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "QUO_CREATED",
                        title: gridstrings.quotations[lang].created,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "QUO_UPDATEDBY",
                        title: gridstrings.quotations[lang].updatedby,
                        width: 250
                    },
                    {
                        type: "datetime",
                        field: "QUO_UPDATED",
                        title: gridstrings.quotations[lang].updated,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "QUO_REVNO",
                        title: gridstrings.quotations[lang].revision,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "QUO_PAYMENTDUE",
                        title: gridstrings.quotations[lang].paymentdue,
                        width: 200
                    },
                    {
                        type: "date",
                        field: "QUO_SUPPLYPERIOD",
                        title: gridstrings.quotations[lang].supplyperiod,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "QUO_REMINDINGPERIOD",
                        title: gridstrings.quotations[lang].reminding,
                        width: 200
                    }
                ];
            }
            if (supplier) {
                columns = $.grep(columns, function (e) { return ($.inArray(e.field, ["QUO_PARTSALES", "QUO_SERVICESALES", "QUO_TOTALSALES"]) == -1); });
            }
            return columns;
        }
        var GetFields = function () {
            var fields = {
                QUO_ID: { type: "number" },
                QUO_PAYMENTDUE: { type: "number" },
                QUO_SUPPLYPERIOD: { type: "date" },
                QUO_PARTPURCHASE: { type: "number" },
                QUO_SERVICEPURCHASE: { type: "number" },
                QUO_TOTALPURCHASE: { type: "number" },
                QUO_PARTSALES: { type: "number" },
                QUO_SERVICESALES: { type: "number" },
                QUO_TOTALSALES: { type: "number" },
                QUO_CREATED: { type: "date" },
                QUO_UPDATED: { type: "date" },
                QUO_REMINDINGPERIOD: { type: "number" },
                QUO_ACTIVITY: { type: "number" },
                QUO_REVNO: { type: "number" },
                QUO_VALIDITYPERIOD: { type: "number" },
                QUO_EXCH: { type: "number" }
            };

            if (supplier) {
                delete fields.QUO_PARTSALES;
                delete fields.QUO_SERVICESALES;
                delete fields.QUO_TOTALSALES;
            }
            if (customer) {
                delete fields.QUO_PARTPURCHASE;
                delete fields.QUO_SERVICEPURCHASE;
                delete fields.QUO_TOTALPURCHASE;
            }
            return fields;
        }
        var GetFilter = function() {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
           
            var datecreatedstart = $("#datecreated_start").val().toDate();
            var datecreatedend = $("#datecreated_end").val().toDate();

            var appdatestart = $("#appdate_start").val().toDate();
            var appdateend = $("#appdate_end").val().toDate();

            var path = tms.Path();
            if (path.Action === "ListByTask" && path.Param1) {
                gridfilter.push({ IsPersistent: true, value: path.Param1, field: "QUO_TASK", operator: "eq" });
            }
            if (path.Action === "ListByProject" && path.Param1) {
                gridfilter.push({ IsPersistent: true, value: path.Param1, field: "QUO_PROJECT", operator: "eq" });
            }

            if (datecreatedstart && datecreatedend)
                gridfilter.push({ field: "QUO_CREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });

            if (appdatestart && appdateend) {
                gridfilter.push({ field: "QUO_UPDATED", value: appdatestart, value2: appdateend, operator: "between", logic: "and" });
                gridfilter.push({ field: "QUO_STATUS", value: "K", operator: "eq", logic: "and" });
            }


            return gridfilter;
        };
        this.List = function () {
            var gridfilter = GetFilter();
            var columns = GetColumns();
            var fields = GetFields();

            if (grdQuotations) {
                grdQuotations.ClearSelection();
                grdQuotations.RunFilter(gridfilter);
            } else {
                grdQuotations = new Grid({
                    keyfield: "QUO_ID",
                    columns: columns,
                    fields: fields,
                    datasource: "/Api/ApiQuotations/List",
                    selector: "#grdQuotations",
                    name: "grdQuotations",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "QUO_ID",
                    primarytextfield: "QUO_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "QUO_ID", dir: "desc" }],
                    hasfiltermenu: true,
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"quoracts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                    if (($.inArray(activatedTab, ["#list", "#record"]) === -1)) {
                        deferreds.push(quo.LoadSelected(true));
                    }
                    $.when.apply($, deferreds).done(function () {
                        switch (activatedTab) {
                            case "#list":
                                quo.ResetUI();
                                quo.List();
                                if (window.history && window.history.pushState)
                                    window.history.pushState("forward", null, "/Quotations/Index#no-back");
                                break;
                            case "#record":
                                $("#btnSave").prop("disabled", false);
                                if (!selectedrecord)
                                    quo.ResetUI();
                                else
                                    quo.LoadSelected();
                                break;
                            case "#quotationlabors":
                                lab.ResetUI();
                                lab.List();
                                break;
                            case "#quotationparts":
                                par.ResetUI();
                                par.List();
                                break;
                            case "#quotationmisccosts":
                                mcs.ResetUI();
                                mcs.List();
                                break;
                            case "#quotationsum":
                                qsm.ShowSummary();
                                break;
                            case "#quotationsales":
                                qsl.ResetUI();
                                qsl.List();
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
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(function() {
                self.LoadSelected(false);
            });
            $("#btnHistory").click(self.HistoryModal);
            $("#btnPrint").click(self.Print);
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });
            $("#status").on("change", EvaluateCurrentStatus);
            $("#filter").click(function () {
                RunSidebarFilter();
            });
            $("[loadstatusesonchange=\"yes\"]").on("change",
                function () {
                    return LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });


            $('input[name=format]').change(function () {
                var value = $('input[name=format]:checked').val();
                $("#printinfobox").addClass("hidden");
                $('#printform').attr('action', "/Reports/GenerateQUO");
                if (value === "form2") {
                    $("#printinfobox").removeClass("hidden");
                    $('#printform').attr('action', "/Reports/GenerateQUO2");
                }
            });
            RegisterTabChange();

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress",
                downloadbutton: "#btnDownload",
                checkbox : true
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments",
                chkvisibletocustomer: "#visibletocustomer",
                chkvisibletosupplier: "#visibletosupplier"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });
            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
            BuildModals();
            AutoComplete();
        };
        var NewQuotationByTask = function (tskid, activity) {
            return $.when(tms.Ajax({ url: "/Api/ApiTask/Get", data: JSON.stringify(tskid) })).done(function (d) {
                var tsk = d.data;
                $("#org").val(tsk.TSK_ORGANIZATION);
                $("#desc").val(tsk.TSK_SHORTDESC);
                $("#task").val(tsk.TSK_ID);
                $("#taskdesc").val(tsk.TSK_SHORTDESC);
                $("#customer").val(tsk.TSK_CUSTOMER);
                tooltip.show("#org", tsk.TSK_ORGANIZATIONDESC);
                tooltip.show("#task", tsk.TSK_SHORTDESC);
                tooltip.show("#customer", tsk.TSK_CUSTOMERDESC);
                $("#activity").addClass("required").attr("required", "required");
                return $.when(tms.Ajax({ url: "/Api/ApiOrgs/Get", data: JSON.stringify(tsk.TSK_ORGANIZATION) })).done(function (o) {
                    selectedorganization = o.data;
                    organizationcurr = o.data.ORG_CURRENCY;
                    return $.when(tms.Ajax({ url: "/Api/ApiCustomers/Get", data: JSON.stringify(tsk.TSK_CUSTOMER) })).done(function (c) {
                        var customer = c.data;
                        if (customer.CUS_PMMASTER) {
                            $("#manager").val(customer.CUS_PMMASTER);
                            tooltip.show("#manager", customer.CUS_PMMASTERDESC);
                        }
                        return $.when(LoadTaskActivities(tsk.TSK_ID)).done(function () {
                            if (activity)
                                $("#activity").val(activity);
                            if (supplier) {
                                return $.when(tms.Ajax({
                                    url: "/Api/ApiTypes/Get",
                                    data: JSON.stringify({ Entity: "QUOTATION", Code: "ALISSATIS" })
                                }).done(function (dt) {
                                    EnableDisableTypeUI("ALISSATIS");
                                    var typ = dt.data;
                                    $("#type").val("ALISSATIS").trigger("change");
                                    tooltip.show("#type", typ.TYP_DESC);
                                    var supplierarr = supplier.split(",");
                                    if (supplierarr.length == 1) {
                                        var supplierdescarr = supplierdesc.split(",");
                                        $("#supplier").val(supplierarr[0]);
                                        if (supplierdescarr.length == 1) {
                                            tooltip.show("#supplier", supplierdescarr[0]);
                                        }
                                    }
                                    return customFieldsHelper.loadCustomFields({
                                        subject: "QUOTATION",
                                        source: 0,
                                        type: "ALISSATIS"
                                    });
                                }));
                            }
                        });
                    });
                });
            });
        }
        var NewQuotationByProject = function (projectid) {
            return $.when(tms.Ajax({ url: "/Api/ApiProjects/Get", data: JSON.stringify(projectid) })).done(function (d) {
                var prj = d.data;
                $("#org").val(prj.PRJ_ORGANIZATION);
                $("#desc").val(prj.PRJ_DESC);
                $("#project").val(prj.PRJ_ID);
                $("#projectdesc").val(prj.PRJ_DESC);
                $("#customer").val(prj.PRJ_CUSTOMER);
                tooltip.show("#org", prj.PRJ_ORGANIZATIONDESC);
                tooltip.show("#project", prj.PRJ_DESC);
                tooltip.show("#customer", prj.PRJ_CUSTOMERDESC);
                return $.when(tms.Ajax({ url: "/Api/ApiOrgs/Get", data: JSON.stringify(prj.PRJ_ORGANIZATION) })).done(function (o) {
                    selectedorganization = o.data;
                    return $.when(tms.Ajax({ url: "/Api/ApiCustomers/Get", data: JSON.stringify(prj.PRJ_CUSTOMER) })).done(function (c) {
                        var customer = c.data;
                        if (customer.CUS_PMMASTER) {
                            $("#manager").val(customer.CUS_PMMASTER);
                            tooltip.show("#manager", customer.CUS_PMMASTERDESC);
                        }
                        return $.when(tms.Ajax({
                            url: "/Api/ApiTypes/Get",
                            data: JSON.stringify({ Entity: "QUOTATION", Code: "PROJE" })
                        }).done(function (dt) {
                            EnableDisableTypeUI("PROJE");
                            var typ = dt.data;
                            $("#type").val("PROJE").trigger("change");
                            tooltip.show("#type", typ.TYP_DESC);
                            return customFieldsHelper.loadCustomFields({
                                subject: "QUOTATION",
                                source: 0,
                                type: "PROJE"
                            });
                        }));
                    });
                });
            });
        }
        this.BuildUI = function () {
            RegisterTabEvents();
            var path = tms.Path();
            self.List();
            if (!quotationid)
                $("#btnBrowse").attr("disabled", "disabled");

            if (path.Action === "NewByTask" && path.Param1) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                NewQuotationByTask(path.Param1, path.Param2);
            } else if (path.Action === "NewByProject" && path.Param1) {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
                NewQuotationByProject(path.Param1);
            } else if (path.Action === "Record" && path.Param1) {
                quotationid = path.Param1;
                selectedrecord = 1;
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            }

        };
    }
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "quotationlabors":
                                return "#btnSaveQuotationLabor";
                            case "quotationparts":
                                return "#btnSaveQuotationPart";
                            case "quotationmisccosts":
                                return "#btnSaveQuotationMiscCost";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                quo.Save();
                                break;
                            case "quotationlabors":
                                lab.Save();
                                break;
                            case "quotationparts":
                                par.Save();
                                break;
                            case "quotationmisccosts":
                                mcs.Save();
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
                            case "quotationlabors":
                                return "#btnAddQuotationLabor";
                            case "quotationparts":
                                return "#btnAddQuotationPart";
                            case "quotationmisccosts":
                                return "#btnAddQuotationMiscCost";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                quo.ResetUI();
                                break;
                            case "quotationlabors":
                                lab.ResetUI();
                                break;
                            case "quotationparts":
                                par.ResetUI();
                                break;
                            case "quotationmisccosts":
                                mcs.ResetUI();
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
                                quo.LoadSelected();
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
                            case "quotationlabors":
                                return "#btnDeleteQuotationLabor";
                            case "quotationparts":
                                return "#btnDeleteQuotationPart";
                            case "quotationmisccosts":
                                return "#btnDeleteQuotationMiscCost";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                quo.Delete();
                                break;
                            case "quotationlabors":
                                lab.Delete();
                                break;
                            case "quotationparts":
                                par.Delete();
                                break;
                            case "quotationmisccosts":
                                mcs.Delete();
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
                                quo.HistoryModal();
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
                                task: {
                                    name: applicationstrings[lang].taskdetails,
                                    disabled: function (key, opt) {
                                        return (selectedrecord && !selectedrecord.QUO_TASK);
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-list-alt" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return true;
                                    },
                                    callback: function () {
                                        if (selectedrecord && selectedrecord.QUO_TASK) {
                                            var win = window.open("/Task/Record/" + selectedrecord.QUO_TASK, "_blank");
                                        }
                                    }
                                },
                                quototask: {
                                    name: applicationstrings[lang].quototask,
                                    disabled: function (key, opt) {
                                        return (!selectedrecord.QUO_ACTIVITY || quototask.GetAndCheckIfActivityCompletedOrRejected() || !selectedrecord);
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
                                },
                                project: {
                                    name: applicationstrings[lang].projectdetails,
                                    disabled: function (key, opt) {
                                        return (selectedrecord && !selectedrecord.QUO_PROJECT);
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-list-alt" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        if (selectedrecord && selectedrecord.QUO_PROJECT) {
                                            var win = window.open("/Projects/Record/" + selectedrecord.QUO_PROJECT, "_blank");
                                        }
                                    }
                                },
                                sep1: !customer ? "---------" : { visible: false }, 
                                purchaseorders: {
                                    name: applicationstrings[lang].purchaseorderrequisitions,
                                    disabled: function (key, opt) {
                                        if (selectedrecord == null)
                                            return true;
                                        return selectedrecord.QUO_PURCHASEORDERREQ == "-";
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
                                        var win = window.open("/PurchaseOrders/ListByQuotation/" + selectedrecord.QUO_ID);
                                    }
                                },
                                newpurchaseorder: {
                                    name: applicationstrings[lang].newpurchaseorderrequisition,
                                    disabled: function (key, opt) {
                                       

                                        if (selectedrecord && partcount > 0 && selectedstatus.STA_CODE === 'K')
                                            return false;

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
                                        return !customer;
                                    },
                                    callback: function () {
                                        var win = window.open("/PurchaseOrders/NewByQuotation/" + selectedrecord.QUO_ID, "_blank");
                                    }
                                },
                                purchaseorderdetails: {
                                    name: applicationstrings[lang].prqdetails,
                                    disabled: function (key, opt) {
                                        if (selectedrecord == null)
                                            return true;
                                        return selectedrecord.QUO_PURCHASEORDERREQ == "-";
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
                                        gridModal.show({
                                            modaltitle: applicationstrings[lang].prqdetails,
                                            listurl: "/Api/ApiPurchaseOrderRequisitions/List",
                                            keyfield: "PRQ_ID",
                                            returninput: "prqdetails",
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
                                            sort: [
                                                { field: "PRQ_ID", dir: "desc" }
                                            ],
                                            filter: [{ field: "PRQ_QUOTATION", value: selectedrecord.QUO_ID, operator: "eq", logic: "and" }],
                                        });
                                    }
                                },
                                sep2: "---------",
                                copytaskdocstoquo: {
                                    name: "Görev Dokümanlarını Kopyala",
                                    disabled: function (key, opt) {
                                        return (selectedrecord && !selectedrecord.QUO_TASK);
                                    },
                                    icon: function (opt, $itemElement, itemKey, item) {
                                        $itemElement.html(
                                            '<span><i class="fa fa-files-o" aria-hidden="true"></i> ' +
                                            item.name +
                                            "</span>");
                                        return "context-menu-icon-updated";
                                    },
                                    visible: function (key, opt) {
                                        return !customer;
                                    },
                                    callback: function () {
                                        if (selectedrecord && selectedrecord.QUO_TASK) {
                                            quo.CopyDocsFromTask();
                                        }
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
        }
    };

    function ready() {
        quo.BuildUI();
        scr.BindHotKeys();
        scr.ContextMenu();
    }

    $(document).ready(ready);
}());