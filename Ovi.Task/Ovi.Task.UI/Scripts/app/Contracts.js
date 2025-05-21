(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var contractid = null;
    var scr, cont, prce, tsk, cpp, cmp, csp;

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
            name: "partprices",
            btns: []
        },
        {
            name: "serviceprices",
            btns: []
        },
        {
            name: "contractequipmanprices",
            btns: []
        }
    ];

    prce = new function () {
        var grdPricing = null;
        var $grdPricing = $("#grdPricing");
        var selectedPricing = null;
        var self = this;

        var ShowPricingParameterDetails = function (pricingParameterCode) {
            return tms.Ajax({
                url: "/Api/ApiPricingParameters/Get",
                data: JSON.stringify(pricingParameterCode),
                fn: function (d) {
                    var pricingparameterdetails = $("#pricingparameterdetails");
                    pricingparameterdetails.find("*").remove();

                    var strdetailsblock = "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].servicefee;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_SERVICEFEE;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    strdetailsblock += "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].hourlyfee;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_HOURLYFEE;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    strdetailsblock += "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].criticaltimevalue;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_CRITICALTIMEVALUE;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    strdetailsblock += "<div class=\"row custom\">";
                    strdetailsblock += "<div class=\"col-md-4\"><strong>";
                    strdetailsblock += gridstrings.pricingparameters[lang].currency;
                    strdetailsblock += "</strong></div>";
                    strdetailsblock += "<div class=\"col-md-6\">";
                    strdetailsblock += d.data.PRP_CURRENCY;
                    strdetailsblock += "</div>";
                    strdetailsblock += "</div>";

                    pricingparameterdetails.append(strdetailsblock);
                }
            });
        }
        var FillUserInterface = function () {
            tms.BeforeFill("#pricing");

            $("#pricingcode").val(selectedPricing.PPR_PRICINGCODE);
            $("#startdate").val(moment(selectedPricing.PPR_STARTDATE).format(constants.dateformat));
            $("#enddate").val(moment(selectedPricing.PPR_ENDDATE).format(constants.dateformat));
            $("#taskcategory").val(selectedPricing.PPR_TASKCATEGORY);
            $("#periodictask").val(selectedPricing.PPR_PERIODICTASK);
            $("#pricingremindingperiod").val(selectedPricing.PPR_REMINDINGPERIOD);

            $("#allbranches").prop("checked", selectedPricing.PPR_ALLBRANCHES === "+");
            $("#note").val(selectedPricing.PPR_NOTE);

            tooltip.show("#pricingcode", selectedPricing.PPR_PRICINGDESC);
            tooltip.show("#taskcategory", selectedPricing.PPR_TASKCATEGORYDESC);
            tooltip.show("#periodictask", selectedPricing.PPR_PERIODICTASKDESC);

            if (selectedrecord.CON_TYPE === "CUSTOMER") {
                $("#divallbranches").removeClass("hidden");
                if (selectedPricing.PPR_BRANCH) {
                    $("#divbranch").removeClass("hidden");
                    $("#branch").val(selectedPricing.PPR_BRANCH);
                    tooltip.show("#branch", selectedPricing.PPR_BRANCHDESC);
                } else {
                    $("#divbranch").addClass("hidden");
                    $("#branch").val("");
                    tooltip.hide("#branch");
                }
            }

            ShowPricingParameterDetails(selectedPricing.PPR_PRICINGCODE);
            if (selectedPricing.PPR_TASKCATEGORY === "BK")
                $("#divperiodictask").removeClass("hidden");
            else
                $("#divperiodictask").addClass("hidden");
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiPricingParameterRelations/Get",
                data: JSON.stringify(selectedPricing.PPR_ID),
                fn: function (d) {
                    selectedPricing = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selectedPricing = grdPricing.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [
                { field: "PPR_ENTITY", value: "CONTRACT", operator: "eq", logic: "and" },
                { field: "PPR_CODE", value: selectedrecord.BRN_CODE, operator: "eq", logic: "and" }
            ];
            if (grdPricing) {
                grdPricing.ClearSelection();
                grdPricing.RunFilter(grdFilter);
            } else {
                grdPricing = new Grid({
                    keyfield: "PPR_ID",
                    columns: [
                        {
                            type: "string",
                            field: "PPR_PRICINGCODE",
                            title: gridstrings.pricingparameterrelations[lang].pricingcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PPR_PRICINGDESC",
                            title: gridstrings.pricingparameterrelations[lang].description,
                            width: 100
                        },
                        {
                            type: "date",
                            field: "PPR_STARTDATE",
                            title: gridstrings.pricingparameterrelations[lang].startdate,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "PPR_ENDDATE",
                            title: gridstrings.pricingparameterrelations[lang].enddate,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PPR_TASKCATEGORY",
                            title: gridstrings.pricingparameterrelations[lang].taskcategory,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PPR_TASKCATEGORYDESC",
                            title: gridstrings.pricingparameterrelations[lang].taskcategorydesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PPR_PERIODICTASK",
                            title: gridstrings.pricingparameterrelations[lang].periodictask,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PPR_PERIODICTASKDESC",
                            title: gridstrings.pricingparameterrelations[lang].periodictaskdesc,
                            width: 250
                        }
                    ],
                    datasource: "/Api/ApiPricingParameterRelations/List",
                    selector: "#grdPricing",
                    name: "grdPricing",
                    height: 150,
                    filter: grdFilter,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"prices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    sort: [{ field: "PPR_ID", dir: "asc" }],
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#pricing"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                PPR_ID: (selectedPricing != null ? selectedPricing.PPR_ID : 0),
                PPR_ENTITY: "CONTRACT",
                PPR_CODE: selectedrecord.CON_ID,
                PPR_PRICINGCODE: $("#pricingcode").val().toUpper(),
                PPR_STARTDATE: moment.utc($("#pricingstartdate").val(), constants.dateformat),
                PPR_ENDDATE: moment.utc($("#pricingenddate").val(), constants.dateformat),
                PPR_TASKCATEGORY: $("#taskcategory").val(),
                PPR_PERIODICTASK: ($("#periodictask").val() || null),
                PPR_NOTE: ($("#note").val() || null),
                PPR_REMINDINGPERIOD: ($("#pricingremindingperiod").val() || null),
                PPR_BRANCH: ($("#branch").val() || null),
                PPR_ALLBRANCHES: $("#allbranches").prop("checked") ? "+" : "-",
                PPR_CREATED: selectedPricing != null ? selectedPricing.PPR_CREATED : tms.Now(),
                PPR_CREATEDBY: selectedPricing != null ? selectedPricing.PPR_CREATEDBY : user,
                PPR_UPDATED: selectedPricing != null ? tms.Now() : null,
                PPR_UPDATEDBY: selectedPricing != null ? user : null,
                PPR_RECORDVERSION: selectedPricing != null ? selectedPricing.PPR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiPricingParameterRelations/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedPricing) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPricingParameterRelations/DelRec",
                            data: JSON.stringify(selectedPricing.PPR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                return self.List();
                            }
                        });
                    });
            }
        };
        this.ResetUI = function () {
            selectedPricing = null;
            tms.Reset("#pricing");

            $("#pricingcode").val("");
            $("#pricingstartdate").val(moment(selectedrecord.CON_STARTDATE).format(constants.dateformat));
            $("#pricingenddate").val(moment(selectedrecord.CON_ENDDATE).format(constants.dateformat));
            $("#taskcategory").val("");
            $("#note").val("");
            $("#periodictask").val("");
            $("#pricingremindingperiod").val("");

            $("#divallbranches").addClass("hidden");
            $("#divbranch").addClass("hidden");
            $("#allbranches").prop("checked", false);
            $("#branch").removeClass("required");
            $("#branch").val("");

            tooltip.hide("#branch");
            tooltip.hide("#pricingcode");
            tooltip.hide("#taskcategory");
            tooltip.hide("#periodictask");

            $("#divperiodictask").addClass("hidden");
            $("#pricingparameterdetails").find("*").remove();

            if (selectedrecord.CON_TYPE === "CUSTOMER") {
                $("#divallbranches").removeClass("hidden");
                $("#allbranches").prop("checked", true);
                $("#divbranch").addClass("hidden");
            }
        };
        var RegisterTabEvents = function () {
            $("#btnAddPricing").click(self.ResetUI);
            $("#btnSavePricing").click(self.Save);
            $("#btnDeletePricing").click(self.Delete);

            $("#pricingcode").autocomp({
                listurl: "/Api/ApiPricingParameters/List",
                geturl: "/Api/ApiPricingParameters/Get",
                field: "PRP_CODE",
                textfield: "PRP_DESC",
                active: "PRP_ACTIVE",
                filter: [{ field: "PRP_ORG", relfield: "#org", includeall: true }],
                callback: function (d) {
                    if (d)
                        ShowPricingParameterDetails(d.PRP_CODE);
                }
            });
            $("#btnpricingcode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.pricingparameters[lang].title,
                    listurl: "/Api/ApiPricingParameters/List",
                    keyfield: "PRP_CODE",
                    codefield: "PRP_CODE",
                    textfield: "PRP_DESC",
                    returninput: "#pricingcode",
                    columns: [
                        { type: "string", field: "PRP_CODE", title: gridstrings.pricingparameters[lang].code, width: 100 },
                        { type: "string", field: "PRP_DESC", title: gridstrings.pricingparameters[lang].description, width: 400 },
                        { type: "number", field: "PRP_CRITICALTIMEVALUE", title: gridstrings.pricingparameters[lang].criticaltimevalue, width: 200 },
                        { type: "price", field: "PRP_SERVICEFEE", title: gridstrings.pricingparameters[lang].servicefee, width: 200 },
                        { type: "price", field: "PRP_HOURLYFEE", title: gridstrings.pricingparameters[lang].hourlyfee, width: 200 },
                        { type: "string", field: "PRP_CURRENCY", title: gridstrings.pricingparameters[lang].currency, width: 200 }
                    ],
                    fields: {
                        PRP_CRITICALTIMEVALUE: { type: "number" },
                        PRP_SERVICEFEE: { type: "number" },
                        PRP_HOURLYFEE: { type: "number" }
                    },
                    filter: [
                        { field: "PRP_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "PRP_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (d) {
                        if (d)
                            ShowPricingParameterDetails(d.PRP_CODE);
                    }
                });
            });
            $("#btnperiodictask").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.periodictasks[lang].title,
                    listurl: "/Api/ApiPeriodicTasks/List",
                    keyfield: "PTK_CODE",
                    codefield: "PTK_CODE",
                    textfield: "PTK_DESC",
                    returninput: "#periodictask",
                    columns: [
                        {
                            type: "string",
                            field: "PTK_CODE",
                            title: gridstrings.periodictasks[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PTK_DESC",
                            title: gridstrings.periodictasks[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "PTK_ORGANIZATION", value: [selectedrecord.CON_ORGANIZATION, "*"], operator: "in" },
                        { field: "PTK_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#periodictask").autocomp({
                listurl: "/Api/ApiPeriodicTasks/List",
                geturl: "/Api/ApiPeriodicTasks/Get",
                field: "PTK_CODE",
                textfield: "PTK_DESC",
                active: "PTK_ACTIVE",
                filter: [{ field: "PTK_ORGANIZATION", func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] }, operator: "in" }]
            });
            $("#taskcategory").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                active: "CAT_ACTIVE",
                callback: function (d) {
                    $("#periodictask").val();
                    tooltip.hide("#periodictask");
                    if (d && d.CAT_CODE === "BK")
                        $("#divperiodictask").removeClass("hidden");
                    else
                        $("#divperiodictask").addClass("hidden");
                }
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [{ field: "BRN_CUSTOMER", func: function () { return selectedrecord.CON_CUSTOMER; }, operator: "eq" }]
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
                    filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }],
                    callback: function (d) {
                        $("#periodictask").val();
                        tooltip.hide("#periodictask");
                        if (d && d.CAT_CODE === "BK")
                            $("#divperiodictask").removeClass("hidden");
                        else
                            $("#divperiodictask").addClass("hidden");
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
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_CUSTOMER", value: selectedrecord.CON_CUSTOMER, operator: "eq" }
                    ]
                });
            });
            $("#allbranches").on("change", function () {
                var ischecked = $(this).is(":checked");
                if (ischecked) {
                    $("#divbranch").addClass("hidden");
                    $("#branch").removeClass("required");
                    $("#branch").val("");
                    tooltip.hide("#branch");
                } else {
                    $("#divbranch").removeClass("hidden");
                    $("#branch").addClass("required");
                }
            });
        };
        this.Ready = function () {
            self.ResetUI();
            self.List();
        };
        RegisterTabEvents();
    };
    cont = new function () {
        var self = this;
        var grdContracts = null;
        var grdContractsElm = $("#grdContracts");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCONTRACTS", operator: "eq" },
                    { field: "AUD_REFID", value: contractid, operator: "eq" }
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
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        tooltip.hide("#type");
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
                        { field: "TYP_ENTITY", value: "CONTRACT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            if (data.TYP_CODE === "CUSTOMER") {
                                $("#divcustomer").removeClass("hidden");
                                $("#divsupplier").addClass("hidden");
                                $("#customer").addClass("required");
                                $("#supplier").removeClass("required");
                            }
                            else if (data.TYP_CODE === "SUPPLIER") {
                                $("#divcustomer").addClass("hidden");
                                $("#divsupplier").removeClass("hidden");
                                $("#customer").removeClass("required");
                                $("#supplier").addClass("required");
                            }
                            if (contractid)
                                customFieldsHelper.loadCustomFields({
                                    subject: "CONTRACT",
                                    source: contractid,
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
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                callback: function (data) {
                    $("#type").val("");
                    tooltip.hide("#type");
                    if (data) {
                        $("#org").val(data.ORG_CODE).trigger("change");
                        tooltip.show("#org", data.ORG_DESCF);
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
                    { field: "TYP_ENTITY", value: "CONTRACT", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        if (data.TYP_CODE === "CUSTOMER") {
                            $("#divcustomer").removeClass("hidden");
                            $("#divsupplier").addClass("hidden");
                            $("#customer").addClass("required");
                            $("#supplier").removeClass("required");
                        }
                        else if (data.TYP_CODE === "SUPPLIER") {
                            $("#divcustomer").addClass("hidden");
                            $("#divsupplier").removeClass("hidden");
                            $("#customer").removeClass("required");
                            $("#supplier").addClass("required");
                        }
                        if (contractid)
                            customFieldsHelper.loadCustomFields({
                                subject: "CONTRACT",
                                source: contractid,
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
                filter: [
                    { field: "CUS_ORG", relfield: "#org", includeall: true }
                ]
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
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "CONTRACT",
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
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "CONTRACT", operator: "eq" },
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
                        { field: "CNR_ENTITY", value: "CONTRACT", operator: "eq" }
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
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var startdate = moment.utc($("#startdate").val(), constants.dateformat);
            var enddate = moment.utc($("#enddate").val(), constants.dateformat);

            if (enddate.diff(startdate, "days") < 0) {
                msgs.error(applicationstrings[lang].dateerrcontract);
                return dfd.reject();
            }

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues({
                    subject: "CONTRACT",
                    source: contractid,
                    type: $("#type").val()
                });
            var o = JSON.stringify(
                {
                    Contract: {
                        CON_ID: (contractid || 0),
                        CON_ORGANIZATION: $("#org").val(),
                        CON_DESC: $("#desc").val(),
                        CON_DETAILS: ($("#details").val() || null),
                        CON_REFERENCE: ($("#referenceno").val() || null),
                        CON_TYPEENTITY: "CONTRACT",
                        CON_TYPE: $("#type").val(),
                        CON_CUSTOMER: ($("#customer").val() || null),
                        CON_SUPPLIER: ($("#supplier").val() || null),
                        CON_MANAGER: ($("#manager").val() || null),
                        CON_STARTDATE: moment.utc($("#startdate").val(), constants.dateformat),
                        CON_ENDDATE: moment.utc($("#enddate").val(), constants.dateformat),
                        CON_REMINDINGPERIOD: ($("#remindingperiod").val() || null),
                        CON_STATUSENTITY: "CONTRACT",
                        CON_STATUS: $("#status").val(),
                        CON_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        CON_PAYMENTDUE: ($("#paymentdue").val() || null),
                        CON_CREATED: selectedrecord != null ? selectedrecord.CON_CREATED : tms.Now(),
                        CON_CREATEDBY: selectedrecord != null ? selectedrecord.CON_CREATEDBY : user,
                        CON_UPDATED: selectedrecord != null ? tms.Now() : null,
                        CON_UPDATEDBY: selectedrecord != null ? user : null,
                        CON_RECORDVERSION: selectedrecord != null ? selectedrecord.CON_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiContracts/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    contractid = d.r.Contract.CON_ID;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (contractid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiContracts/DelRec",
                            data: JSON.stringify(contractid),
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
            contractid = null;

            tms.Reset("#record");
            customFieldsHelper.clearCustomFields();

            $("#code").val("");
            $("#org").val("");
            $("#desc").val("");
            $("#details").val("");
            $("#referenceno").val("");
            $("#type").val("");
            $("#customer").val("");
            $("#customer").val("");
            $("#supplier").val("");
            $("#manager").val("");
            $("#startdate").val("");
            $("#enddate").val("");
            $("#remindingperiod").val("");
            $("#paymentdue").val("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            $("#divcustomer,#divsupplier").addClass("hidden");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            tooltip.hide("#type");
            tooltip.hide("#org");
            tooltip.hide("#customer");
            tooltip.hide("#supplier");
            tooltip.hide("#manager");
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#divcustomer,#divsupplier").addClass("hidden");

            $("#code").val(selectedrecord.CON_ID);
            $("#org").val(selectedrecord.CON_ORGANIZATION);
            $("#desc").val(selectedrecord.CON_DESC);
            $("#details").val(selectedrecord.CON_DETAILS);
            $("#referenceno").val(selectedrecord.CON_REFERENCE);
            $("#type").val(selectedrecord.CON_TYPE);
            $("#customer").val(selectedrecord.CON_CUSTOMER);
            $("#supplier").val(selectedrecord.CON_SUPPLIER);
            $("#manager").val(selectedrecord.CON_MANAGER);
            $("#startdate").val(moment(selectedrecord.CON_STARTDATE).format(constants.dateformat));
            $("#enddate").val(moment(selectedrecord.CON_ENDDATE).format(constants.dateformat));
            $("#remindingperiod").val(selectedrecord.CON_REMINDINGPERIOD);
            $("#paymentdue").val(selectedrecord.CON_PAYMENTDUE);
            $("#cancellationreason").data("selected", selectedrecord.PRJ_CANCELLATIONREASON);
            $("#created").val(moment(selectedrecord.CON_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.CON_CREATEDBY);

            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);

            if (selectedrecord.CON_CUSTOMER) {
                $("#divcustomer").removeClass("hidden");
            }
            else if (selectedrecord.CON_SUPPLIER) {
                $("#divsupplier").removeClass("hidden");
            }

            tooltip.show("#org", selectedrecord.CON_ORGDESC);
            tooltip.show("#type", selectedrecord.CON_TYPEDESC);
            tooltip.show("#customer", selectedrecord.CON_CUSTOMERDESC);
            tooltip.show("#supplier", selectedrecord.CON_SUPPLIERDESC);
            tooltip.show("#manager", selectedrecord.CON_MANAGERDESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            LoadCancellationReasons();
            commentsHelper.showCommentsBlock({ subject: "CONTRACT", source: selectedrecord.CON_ID });
            documentsHelper.showDocumentsBlock({ subject: "CONTRACT", source: selectedrecord.CON_ID });;
            $.when(customFieldsHelper.loadCustomFields({ subject: "CONTRACT", source: selectedrecord.CON_ID, type: selectedrecord.CON_TYPE })).done(function () {
                $.when(LoadStatuses({ pcode: selectedstatus.STA_PCODE, code: selectedstatus.STA_CODE, text: selectedstatus.STA_DESCF })).done(function () {
                    EvaluateCurrentStatus();
                });
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiContracts/Get",
                data: JSON.stringify(contractid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({
                        subject: "CONTRACT",
                        source: contractid,
                        type: $("#type").val()
                    });
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdContracts.GetRowDataItem(row);
            contractid = selectedrecord.CON_ID;
            $(".page-header h6").html(selectedrecord.CON_ID + " - " + selectedrecord.CON_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdContractsElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            var data = grdContracts.GetData();
            for (var line in data) {
                if (data.hasOwnProperty(line)) {
                    var range = moment().range(data[line].CON_STARTDATE, data[line].CON_ENDDATE);
                    if (!range.contains(tms.Now())) {
                        grdContractsElm.find("tr[data-id=\"" + data[line].CON_ID + "\"]")
                            .css({ color: "#b33e3e" });
                    } 
                }
            }
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdContracts) {
                grdContracts.ClearSelection();
                grdContracts.RunFilter(gridfilter);
            } else {
                grdContracts = new Grid({
                    keyfield: "CON_ID",
                    columns: [
                        {
                            type: "number",
                            field: "CON_ID",
                            title: gridstrings.contracts[lang].contractno,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_DESC",
                            title: gridstrings.contracts[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "CON_ORGANIZATION",
                            title: gridstrings.contracts[lang].organization,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_ORGANIZATIONDESC",
                            title: gridstrings.contracts[lang].organizationdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CON_TYPE",
                            title: gridstrings.contracts[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_TYPEDESC",
                            title: gridstrings.contracts[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CON_STATUS",
                            title: gridstrings.contracts[lang].status,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_STATUSDESC",
                            title: gridstrings.contracts[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CON_CUSTOMER",
                            title: gridstrings.contracts[lang].customer,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_CUSTOMERDESC",
                            title: gridstrings.contracts[lang].customerdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CON_SUPPLIER",
                            title: gridstrings.contracts[lang].supplier,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_SUPPLIERDESC",
                            title: gridstrings.contracts[lang].supplierdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "CON_MANAGER",
                            title: gridstrings.contracts[lang].manager,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_REFERENCE",
                            title: gridstrings.contracts[lang].referenceno,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "CON_STARTDATE",
                            title: gridstrings.contracts[lang].startdate,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "CON_ENDDATE",
                            title: gridstrings.contracts[lang].enddate,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_CANCELLATIONREASON",
                            title: gridstrings.contracts[lang].cancellationreason,
                            width: 300
                        },
                        {
                            type: "number",
                            field: "CON_PAYMENTDUE",
                            title: gridstrings.contracts[lang].paymentdue,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_CREATEDBY",
                            title: gridstrings.contracts[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "CON_CREATED",
                            title: gridstrings.contracts[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CON_UPDATEDBY",
                            title: gridstrings.contracts[lang].updatedby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "CON_UPDATED",
                            title: gridstrings.contracts[lang].updated,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        CON_ID: { type: "number" },
                        CON_STARTDATE: { type: "date" },
                        CON_ENDDATE: { type: "date" },
                        CON_PAYMENTDUE: { type: "number" },
                        CON_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiContracts/List",
                    selector: "#grdContracts",
                    name: "grdContracts",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "CON_ID",
                    primarytextfield: "CON_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [
                        { field: "CON_ENDDATE", dir: "desc" },
                        { field: "CON_ID", dir: "desc" }
                    ],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"contracts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
                        cont.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            cont.ResetUI();
                        else
                            cont.LoadSelected();
                        break;
                    case "#pricing":
                        prce.Ready();
                        break;
                    case "#partprices":
                        cpp.Ready();
                        break;
                    case "#serviceprices":
                        csp.List();
                        break;
                    case "#contractequipmanprices":
                        cmp.Ready();
                        break;
                }

                scr.Configure();
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
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#status").on("change", EvaluateCurrentStatus);
            $("[loadstatusesonchange=\"yes\"]").on("change", function () {
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

            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            self.List();
            if (!contractid)
                $("#btnBrowse").attr("disabled", "disabled");
        };
        RegisterTabEvents();
    };
    cpp = new function () {
        var grdPartPrices = null;
        var checkedlines = null;
        var $grdPartPrices = $("#grdPartPrices");
        var selectedPartPrice = null;
        var self = this;

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


        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCONTRACTPARTPRICES", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.CON_ID, operator: "eq" }
                ]
            });
        };
        var FillUI = function () {
            if (selectedPartPrice) {

                tms.BeforeFill("#partprices");
                $("#part").data("id", selectedPartPrice.CPP_PART);
                $("#part").val(selectedPartPrice.CPP_PARTCODE);
                $("#partdesc").val(selectedPartPrice.CPP_PARTDESC);
                $("#cppregion").val(selectedPartPrice.CPP_REGION);
                $("#cppbranch").val(selectedPartPrice.CPP_BRANCH);
                $("#reference").val(selectedPartPrice.CPP_REFERENCE);
                $("#partuom").val(selectedPartPrice.CPP_PARTUOM);
                $("#partunitpurchaseprice").val(selectedPartPrice.CPP_UNITPURCHASEPRICE !== null ? parseFloat(selectedPartPrice.CPP_UNITPURCHASEPRICE).fixed(constants.pricedecimals) : "");
                $("#partunitsalesprice").val(parseFloat(selectedPartPrice.CPP_UNITSALESPRICE).fixed(constants.pricedecimals));
                $("#currency").val(selectedPartPrice.CPP_CURR);

                tooltip.show("#cppregion", selectedPartPrice.CPP_REGIONDESC);
                tooltip.show("#cppbranch", selectedPartPrice.CPP_BRANCHDESC);
            }
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/Get",
                data: JSON.stringify(selectedPartPrice.CPP_ID),
                fn: function (d) {
                    selectedPartPrice = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedPartPrice = grdPartPrices.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdPartPrices input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var gridDataBound = function (e) {
            var data = grdPartPrices.GetData();
            $grdPartPrices.find("#btnPartPriceHistory").off("click").on("click", HistoryModal);
            $grdPartPrices.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
        }
        this.List = function () {
            var grdFilter = [
                { field: "CPP_CONTRACTID", value: selectedrecord.CON_ID, operator: "eq", logic: "and" }
            ];
            if (grdPartPrices) {
                grdPartPrices.ClearSelection();
                grdPartPrices.RunFilter(grdFilter);
            } else {
                grdPartPrices = new Grid({
                    keyfield: "CPP_ID",
                    columns: [
                        {
                            type: "na",
                            title: "#",
                            field: "chkLine",
                            template:
                                "<div style=\"text-align:center;\">" +
                                    "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" data-id=\"#= CPP_ID #\" /><label></label>" +
                                    "</div>",
                            filterable: false,
                            sortable: false,
                            width: 35
                        },
                        {
                            type: "string",
                            field: "CPP_PARTCODE",
                            title: gridstrings.contractpartprices[lang].partcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "CPP_PARTDESC",
                            title: gridstrings.contractpartprices[lang].partdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CPP_REGION",
                            title: gridstrings.contractpartprices[lang].region,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CPP_REGIONDESC",
                            title: gridstrings.contractpartprices[lang].regiondesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CPP_BRANCH",
                            title: gridstrings.contractpartprices[lang].branch,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CPP_BRANCHDESC",
                            title: gridstrings.contractpartprices[lang].branchdesc,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "CPP_UNITPURCHASEPRICE",
                            title: gridstrings.contractpartprices[lang].unitpurchaseprice,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "CPP_UNITSALESPRICE",
                            title: gridstrings.contractpartprices[lang].unitsalesprice,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CPP_CURR",
                            title: gridstrings.contractpartprices[lang].currency,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CPP_REFERENCE",
                            title: gridstrings.contractpartprices[lang].reference,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "CPP_CREATED",
                            title: gridstrings.contractpartprices[lang].created,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CPP_CREATEDBY",
                            title: gridstrings.contractpartprices[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "CPP_UPDATED",
                            title: gridstrings.contractpartprices[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CPP_UPDATEDBY",
                            title: gridstrings.contractpartprices[lang].updatedby,
                            width: 150
                        }
                    ],
                    fields:
                    {
                        CPP_UNITPURCHASEPRICE: { type: "number" },
                        CPP_UNITSALESPRICE: { type: "number" },
                        CPP_CREATED: { type: "date" },
                        CPP_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiContractPartPrices/List",
                    selector: "#grdPartPrices",
                    name: "grdPartPrices",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "CPP_ID", dir: "asc" }],
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"PartPrices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnPartPriceHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"

                        ]
                    },
                    change: gridChange,
                    loadall: true,
                    databound: gridDataBound
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#partprices"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                CPP_ID: (selectedPartPrice != null ? selectedPartPrice.CPP_ID : 0),
                CPP_CONTRACTID: selectedrecord.CON_ID,
                CPP_PART: $("#part").data("id"),
                CPP_UNITPURCHASEPRICE: $("#partunitpurchaseprice").val() ? parseFloat($("#partunitpurchaseprice").val()) : null,
                CPP_UNITSALESPRICE: parseFloat($("#partunitsalesprice").val()),
                CPP_REGION: ($("#cppregion").val() || null),
                CPP_BRANCH: ($("#cppbranch").val() || null),
                CPP_REFERENCE: ($("#reference").val() || null),
                CPP_CURR: $("#currency").val(),
                CPP_CREATED: selectedPartPrice != null ? selectedPartPrice.CPP_CREATED : tms.Now(),
                CPP_CREATEDBY: selectedPartPrice != null ? selectedPartPrice.CPP_CREATEDBY : user,
                CPP_UPDATED: selectedPartPrice != null ? tms.Now() : null,
                CPP_UPDATEDBY: selectedPartPrice != null ? user : null,
                CPP_RECORDVERSION: selectedPartPrice != null ? selectedPartPrice.CPP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiContractPartPrices/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            checkedlines = $grdPartPrices.find("input[data-name=\"chkLine\"]:checked");
            if (checkedlines.length > 0) {
                var linearr = [];
                for (var i = 0; i < checkedlines.length; i++) {
                    var line = $(checkedlines[i]);
                    linearr.push(line.data("id"));
                }

                var o = JSON.stringify(
                    {
                        Lines: linearr
                    });

                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function() {
                        return tms.Ajax({
                            url: "/Api/ApiContractPartPrices/DeleteAll",
                            data: o,
                            fn: function(d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            } else {
                if (selectedPartPrice) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiContractPartPrices/DelRec",
                                data: JSON.stringify(selectedPartPrice.CPP_ID),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                } else {
                    msgs.error(applicationstrings[lang].contractdelete);
                    return $.Deferred().reject();
                }
            }
           
        };
        this.ResetUI = function () {
            selectedPartPrice = null;
            tms.Reset("#partprices");

            $("#part").val("");
            $("#part").data("id", null);
            $("#partdesc").val("");
            $("#cppregion").val("");
            $("#cppbranch").val("");
            $("#reference").val("");
            $("#partuom").val("");
            $("#partunitpurchaseprice").val("");
            $("#partunitsalesprice").val("");
            $("#currency").val("");

            tooltip.hide("#cppregion");
            tooltip.hide("#cppbranch");
        };
        var AutoComplete = function () {
            $("#part").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                filter: [{ field: "PAR_ORG", func: function () { return ["*", selectedrecord.CON_ORGANIZATION]; }, operator: "in" }],
                callback: function (d) {
                    $("#part").data("id", d ? d.PAR_ID : null);
                    $("#partdesc").val(d ? d.PAR_DESC : "");
                    $("#partuom").val(d ? d.PAR_UOM : "");
                }
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#cppregion").autocomp({
                listurl: "/Api/ApiRegions/List",
                geturl: "/Api/ApiRegions/Get",
                field: "REG_CODE",
                textfield: "REG_DESC",
                active: "REG_ACTIVE",
                filter: [
                    {
                        //field: "PTK_ORGANIZATION",
                        //func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        //operator: "in"
                    }
                ]
            });
            $("#cppbranch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [
                    {
                        //field: "PTK_ORGANIZATION",
                        //func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        //operator: "in"
                    }
                ]
            });
        };
        var LookupButtons = function () {
            $("#btnpart").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.parts[lang].title,
                    listurl: "/Api/ApiParts/List",
                    keyfield: "PAR_ID",
                    codefield: "PAR_CODE",
                    textfield: "PAR_DESC",
                    returninput: "#part",
                    columns: [
                        { type: "string", field: "PAR_CODE", title: gridstrings.parts[lang].parcode, width: 100 },
                        { type: "string", field: "PAR_DESC", title: gridstrings.parts[lang].pardesc, width: 300 }
                    ],
                    filter: [{ field: "PAR_ORG", value: ["*", selectedrecord.CON_ORGANIZATION], operator: "in" }],
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
                        $("#part").data("id", (d ? d.PAR_ID : null));
                        $("#partdesc").val((d ? d.PAR_DESC : ""));
                        $("#part").val((d ? d.PAR_CODE : ""));
                        $("#partuom").val(d ? d.PAR_UOM : "");
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
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btncppregion").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.regions[lang].title,
                    listurl: "/Api/ApiRegions/List",
                    keyfield: "REG_CODE",
                    codefield: "REG_CODE",
                    textfield: "REG_DESC",
                    returninput: "#cppregion",
                    columns: [
                        {
                            type: "string",
                            field: "REG_CODE",
                            title: gridstrings.regions[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "REG_DESC",
                            title: gridstrings.regions[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        {
                            //field: "PTK_ORGANIZATION", value: [selectedrecord.CUS_ORG, "*"], operator: "in"
                            //field: "PTK_ORGANIZATION", func: function () { return selectedrecord.CUS_ORG }, includeall: true
                        },
                        { field: "REG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncppbranch").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.branches[lang].title,
                    listurl: "/Api/ApiBranches/List",
                    keyfield: "BRN_CODE",
                    codefield: "BRN_CODE",
                    textfield: "BRN_DESC",
                    returninput: "#cppbranch",
                    columns: [
                        {
                            type: "string",
                            field: "BRN_CODE",
                            title: gridstrings.branches[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "BRN_DESC",
                            title: gridstrings.branches[lang].desc,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "BRN_REGION", value: $("#cppregion").val(), operator: "eq" },
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
        };
        var RegisterTabEvents = function () {
            $("#btnAddPartPrice").click(self.ResetUI);
            $("#btnSavePartPrice").click(self.Save);
            $("#btnDeletePartPrice").click(self.Delete);

            $("#cppregion").change(function () {
                $("#cppbranch").val("");
            });

            $("#cp_fu").fileupload({
                maxNumberOfFiles: 1,
                autoUpload: false,
                add: function (e, data) {
                    data.files.map(function (i) {
                        if ($.inArray(i.type, ["text/csv", "application/vnd.ms-excel"]) === -1) {
                            msgs.error(applicationstrings[lang].onlycsv);
                        } else {
                            $("#cp_filename").html("<span class=\"badge badge-info\">" + i.name + "</span>");
                            $("#cp_btnupload").removeAttr("disabled");
                            $("#partprices").unbind("upload").on("upload", function (evnt, d) {
                                data.formData = d;
                                data.submit();
                            });
                        };
                    });
                }
            }).on("fileuploaddone", function (e, data) {
                $("#cp_filename").html("");
                switch (data.result.status) {
                    case 200:
                        msgs.success(data.result.data);
                        self.List();
                        break;
                    case 300:
                        tms.Redirect2Login();
                        break;
                    case 500:
                        msgs.error(data.result.data);
                        break;
                }
            });

            $("#cp_btnupload").on("click", function () {
                $("#partprices").trigger("upload", { Id: selectedrecord.CUS_CODE, Type: "CPP" });
            });

            AutoComplete();
            LookupButtons();
        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };
        RegisterTabEvents();
    };
    csp = new function () {
        var grdServicePrices = null;
        var $grdServicePrices = $("#grdServicePrices");
        var checkedlines = null;
        var selectedServicePrice = null;
        var self = this;

        var CheckAll = function (checked) {
            var checkinputs = $("#grdServicePrices input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        var HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCONTRACTSERVICEPRICES", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.CON_ID, operator: "eq" }
                ]
            });
        };
        var FillUI = function () {
            if (selectedServicePrice) {
                tms.BeforeFill("#serviceprices");
                $("#servicecode").val(selectedServicePrice.CSP_SERVICECODE);
                $("#cspregion").val(selectedServicePrice.CSP_REGION);
                $("#cspbranch").val(selectedServicePrice.CSP_BRANCH);
                $("#servicereference").val(selectedServicePrice.CSP_REFERENCE);
                $("#spunitpurchaseprice").val(selectedServicePrice.CSP_UNITPURCHASEPRICE);
                $("#spunitsalesprice").val(selectedServicePrice.CSP_UNITSALESPRICE);
                $("#spcurrency").val(selectedServicePrice.CSP_CURR);

                tooltip.show("#servicecode", selectedServicePrice.CSP_SERVICECODEDESC);
                tooltip.show("#cspregion", selectedServicePrice.CSP_REGIONDESC);
                tooltip.show("#cspbranch", selectedServicePrice.CSP_BRANCHDESC);
                tooltip.show("#spcurrency", selectedServicePrice.CSP_CURRDESC);
            }
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiContractServicePrices/Get",
                data: JSON.stringify(selectedServicePrice.CSP_ID),
                fn: function (d) {
                    selectedServicePrice = d.data;
                    FillUI();
                }
            });
        };
        var itemSelect = function (row) {
            selectedServicePrice = grdServicePrices.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            var data = grdServicePrices.GetData();
            $grdServicePrices.find("#btnServicePriceHistory").off("click").on("click", HistoryModal);
            $grdServicePrices.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });

            $grdServicePrices.find("#btnDeleteLines").off("click").on("click", function () {
                checkedlines = $grdServicePrices.find("input[data-name=\"chkLine\"]:checked");
                if (checkedlines.length === 0) {
                    msgs.error(applicationstrings[lang].contractservicenotselected);
                    return $.Deferred().reject();
                }

               
            });
        }
        this.List = function () {
            var grdFilter = [
                { field: "CSP_CONTRACTID", value: selectedrecord.CON_ID, operator: "eq", logic: "and" }
            ];
            if (grdServicePrices) {
                grdServicePrices.ClearSelection();
                grdServicePrices.RunFilter(grdFilter);
            } else {
                grdServicePrices = new Grid({
                    keyfield: "CSP_ID",
                    columns: [
                        {
                            type: "na",
                            title: "#",
                            field: "chkLine",
                            template:
                                "<div style=\"text-align:center;\">" +
                                    "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" data-id=\"#= CSP_ID #\" /><label></label>" +
                                    "</div>",
                            filterable: false,
                            sortable: false,
                            width: 35
                        },
                        {
                            type: "number",
                            field: "CSP_SERVICECODE",
                            title: gridstrings.contractserviceprices[lang].servicecode,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CSP_SERVICECODEDESC",
                            title: gridstrings.contractserviceprices[lang].servicecodedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CSP_REGION",
                            title: gridstrings.contractserviceprices[lang].region,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CSP_REGIONDESC",
                            title: gridstrings.contractserviceprices[lang].regiondesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CSP_REFERENCE",
                            title: gridstrings.contractserviceprices[lang].reference,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CSP_BRANCH",
                            title: gridstrings.contractserviceprices[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CSP_BRANCHDESC",
                            title: gridstrings.contractserviceprices[lang].branchdesc,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "CSP_UNITPURCHASEPRICE",
                            title: gridstrings.contractserviceprices[lang].unitpurchaseprice,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "CSP_UNITSALESPRICE",
                            title: gridstrings.contractserviceprices[lang].unitsalesprice,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CSP_CURR",
                            title: gridstrings.contractserviceprices[lang].curr,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "CSP_CREATED",
                            title: gridstrings.contractserviceprices[lang].created,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CSP_CREATEDBY",
                            title: gridstrings.contractserviceprices[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "CSP_UPDATED",
                            title: gridstrings.contractserviceprices[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "CSP_UPDATEDBY",
                            title: gridstrings.contractserviceprices[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        CSP_UNITPURCHASEPRICE: { type: "number" },
                        CSP_SERVICECODE: { type: "number" },
                        CSP_UNITSALESPRICE: { type: "number" },
                        CSP_CREATED: { type: "date" },
                        CSP_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiContractServicePrices/List",
                    selector: "#grdServicePrices",
                    name: "grdServicePrices",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "CSP_ID", dir: "asc" }],
                    loadall: true,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"ServiceCodes.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].history #\" class=\"btn btn-default btn-sm\" id=\"btnPartPriceHistory\"><i class=\"fa fa-bolt\"></i> #= applicationstrings[lang].history #</a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"

                        ]
                    },
                    change: gridChange,
                    databound: gridDataBound
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#serviceprices"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                CSP_ID: (selectedServicePrice != null ? selectedServicePrice.CSP_ID : 0),
                CSP_CONTRACTID: selectedrecord.CON_ID,
                CSP_SERVICECODE: $("#servicecode").val(),
                CSP_REGION: ($("#cspregion").val() || null),
                CSP_REFERENCE: ($("#servicereference").val() || null),
                CSP_BRANCH: ($("#cspbranch").val() || null),
                CSP_UNITPURCHASEPRICE: parseFloat($("#spunitpurchaseprice").val()),
                CSP_UNITSALESPRICE: parseFloat($("#spunitsalesprice").val()),
                CSP_CURR: $("#spcurrency").val(),
                CSP_CREATED: selectedServicePrice != null ? selectedServicePrice.CSP_CREATED : tms.Now(),
                CSP_CREATEDBY: selectedServicePrice != null ? selectedServicePrice.CSP_CREATEDBY : user,
                CSP_UPDATED: selectedServicePrice != null ? tms.Now() : null,
                CSP_UPDATEDBY: selectedServicePrice != null ? user : null,
                CSP_RECORDVERSION: selectedServicePrice != null ? selectedServicePrice.CSP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiContractServicePrices/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            checkedlines = $grdServicePrices.find("input[data-name=\"chkLine\"]:checked");
            if (checkedlines.length > 0) {
                var linearr = [];
                for (var i = 0; i < checkedlines.length; i++) {
                    var line = $(checkedlines[i]);
                    linearr.push(line.data("id"));
                }

                var o = JSON.stringify(
                    {
                        Lines: linearr
                    });

                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function() {
                        return tms.Ajax({
                            url: "/Api/ApiContractServicePrices/DeleteAll",
                            data: o,
                            fn: function(d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            } else {
                if (selectedServicePrice) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiContractServicePrices/DelRec",
                                data: JSON.stringify(selectedServicePrice.CSP_ID),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                } else {
                    msgs.error(applicationstrings[lang].contractdelete);
                    return $.Deferred().reject();
                }
            }
           
        };
        this.ResetUI = function () {
            selectedServicePrice = null;
            tms.Reset("#serviceprices");

            $("#servicecode").val("");
            $("#cspregion").val("");
            $("#cspbranch").val("");
            $("#equipmenttype").val("");
            $("#spunitpurchaseprice").val("");
            $("#servicereference").val("");
            $("#spunitsalesprice").val("");
            $("#spcurrency").val("");

            tooltip.hide("#servicecode");
            tooltip.hide("#cspregion");
            tooltip.hide("#cspbranch");
            tooltip.hide("#spcurrency");
        };
        var AutoComplete = function () {
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", func: function () { return selectedrecord.CON_ORGANIZATION }, includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
                ]
            });
            $("#servicecode").autocomp({
                listurl: "/Api/ApiServiceCodes/List",
                geturl: "/Api/ApiServiceCodes/Get",
                field: "SRV_CODE",
                textfield: "SRV_DESCRIPTIONF",
                active: "SRV_ACTIVE",
                termisnumeric: true,
                filter: [
                    { field: "SRV_ORG", func: function () { return selectedrecord.CON_ORGANIZATION }, includeall: true }
                ]
            });
            $("#spcurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#cspregion").autocomp({
                listurl: "/Api/ApiRegions/List",
                geturl: "/Api/ApiRegions/Get",
                field: "REG_CODE",
                textfield: "REG_DESC",
                active: "REG_ACTIVE",
                filter: [
                    {
                        //field: "PTK_ORGANIZATION",
                        //func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        //operator: "in"
                    }
                ]
            });
            $("#cspbranch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [
                    {
                        field: "BRN_REGION",
                        func: function () { return $("#cspregion").val() },
                        operator: "eq"
                    },
                    {
                        field: "BRN_REGION",
                        func: function () { return selectedrecord.CON_CUSTOMER },
                        operator: "eq"
                    },
                ]
            });
        };
        var LookupButtons = function () {
            $("#btnequipmenttype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#equipmenttype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [selectedrecord.CON_ORGANIZATION, "*"], operator: "in" }
                    ]
                });
            });
            $("#btnservicecode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.servicecodes[lang].title,
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
                        }
                    ],
                    fields : {
                        SRV_CODE : {type : "number"}
                    },
                    filter: [
                        { field: "SRV_ACTIVE", value: "+", operator: "eq" },
                        { field: "SRV_ORG", value: [selectedrecord.CON_ORGANIZATION, "*"], operator: "in" }
                    ]
                });
            });
            $("#btnspcurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#spcurrency",
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
                    ]
                });
            });
            $("#btncspregion").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.regions[lang].title,
                    listurl: "/Api/ApiRegions/List",
                    keyfield: "REG_CODE",
                    codefield: "REG_CODE",
                    textfield: "REG_DESC",
                    returninput: "#cspregion",
                    columns: [
                        {
                            type: "string",
                            field: "REG_CODE",
                            title: gridstrings.regions[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "REG_DESC",
                            title: gridstrings.regions[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        {
                            //field: "PTK_ORGANIZATION", value: [selectedrecord.CUS_ORG, "*"], operator: "in"
                            //field: "PTK_ORGANIZATION", func: function () { return selectedrecord.CUS_ORG }, includeall: true
                        },
                        { field: "REG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncspbranch").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.branches[lang].title,
                    listurl: "/Api/ApiBranches/List",
                    keyfield: "BRN_CODE",
                    codefield: "BRN_CODE",
                    textfield: "BRN_DESC",
                    returninput: "#cspbranch",
                    columns: [
                        {
                            type: "string",
                            field: "BRN_CODE",
                            title: gridstrings.branches[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "BRN_DESC",
                            title: gridstrings.branches[lang].desc,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "BRN_REGION", value: $("#cspregion").val(), operator: "eq" },
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_CUSTOMER", value: selectedrecord.CON_CUSTOMER, operator: "eq" }

                    ]
                });
            });
        };
        var RegisterTabEvents = function () {
            $("#btnAddServicePrices").click(self.ResetUI);
            $("#btnSaveServicePrices").click(self.Save);
            $("#btnDeleteServicePrices").click(self.Delete);
            $("#cspregion").change(function () {
                $("#cspbranch").val("");
            });

            AutoComplete();
            LookupButtons();
        };
        this.Ready = function () {
            self.List();
            self.ResetUI();
        };
        RegisterTabEvents();
    };
    cmp = new function () {
        var self = this;
        var grdelm = $("#grdContractEquipManPrices");
        var grdContractEquipManPrices = null;
        var selectedEquipmentManPrice = null;
        var checkedlines = null;

        this.ResetUI = function () {
            selectedEquipmentManPrice = null;
            tms.Reset("#contractequipmanprices");

            $("#cmpperiodictask").val("");
            $("#cmpequipmenttype").val("");
            $("#cmpregion").val("");
            $("#cmpbranch").val("");
            $("#cmpequipment").val("");
            $("#cmpunitpurchaseprice").val("");
            $("#cmpunitsalesprice").val("");
            $("#cmpcurrency").val("");
            $("#equipmentreference").val("");


            $("#cmpperiodictask").removeAttr("disabled");
            $("#btncmpperiodictask").removeAttr("disabled");

            tooltip.hide("#cmpperiodictask");
            tooltip.hide("#cmpequipmenttype");
            tooltip.hide("#cmpcurrency");
            tooltip.hide("#cmpregion");
            tooltip.hide("#cmpbranch");
            tooltip.hide("#cmpequipment");

        };

        var FillUserInterface = function () {
            tms.BeforeFill("#contractequipmanprices");

            $("#cmpperiodictask").val(selectedEquipmentManPrice.CMP_PTKCODE);
            $("#cmpequipmenttype").val(selectedEquipmentManPrice.CMP_EQUIPMENTTYPE);
            $("#cmpregion").val(selectedEquipmentManPrice.CMP_REGION);
            $("#cmpbranch").val(selectedEquipmentManPrice.CMP_BRANCH);
            $("#cmpequipment").val(selectedEquipmentManPrice.CMP_EQUIPMENTID);
            $("#cmpunitpurchaseprice").val(selectedEquipmentManPrice.CMP_UNITPURCHASEPRICE);
            $("#cmpunitsalesprice").val(selectedEquipmentManPrice.CMP_UNITSALESPRICE);
            $("#cmpcurrency").val(selectedEquipmentManPrice.CMP_CURRENCY);
            $("#equipmentreference").val(selectedEquipmentManPrice.CMP_REFERENCE);


            $("#cmpperiodictask").attr("disabled", true);
            $("#btncmpperiodictask").attr("disabled", true);


            tooltip.show("#cmpperiodictask", selectedEquipmentManPrice.CMP_PTKDESC);
            tooltip.show("#cmpequipmenttype", selectedEquipmentManPrice.CMP_EQUIPMENTTYPEDESC);
            tooltip.show("#cmpregion", selectedEquipmentManPrice.CMP_REGION);
            tooltip.show("#cmpbranch", selectedEquipmentManPrice.CMP_BRANCH);
            tooltip.show("#cmpequipment", selectedEquipmentManPrice.CMP_EQUIPMENTID);
            tooltip.show("#cmpunitpurchaseprice", selectedEquipmentManPrice.CMP_EQUIPMENTTYPEDESC);
            tooltip.show("#cmpcurrency", selectedEquipmentManPrice.CMP_CURRENCYDESC);


        };

        this.Save = function () {
            if (!tms.Check("#contractequipmanprices"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                CMP_ID: selectedEquipmentManPrice ? selectedEquipmentManPrice.CMP_ID : 0,
                CMP_CONTRACTID: selectedrecord.CON_ID,
                CMP_PTKCODE: ($("#cmpperiodictask").val() || null),
                CMP_EQUIPMENTTYPEENTITY: "EQUIPMENT",
                CMP_EQUIPMENTTYPE: $("#cmpequipmenttype").val(),
                CMP_REGION: ($("#cmpregion").val() || null),
                CMP_BRANCH: ($("#cmpbranch").val() || null),
                CMP_REFERENCE: ($("#equipmentreference").val() || null),
                CMP_EQUIPMENTID: $("#cmpequipment").val(),
                CMP_UNITPURCHASEPRICE: $("#cmpunitpurchaseprice").val(),
                CMP_UNITSALESPRICE: $("#cmpunitsalesprice").val(),
                CMP_CURRENCY: $("#cmpcurrency").val(),
                CMP_CREATED: selectedEquipmentManPrice != null ? selectedEquipmentManPrice.CMP_CREATED : tms.Now(),
                CMP_CREATEDBY: selectedEquipmentManPrice != null ? selectedEquipmentManPrice.CMP_CREATEDBY : user,
                CMP_UPDATED: selectedEquipmentManPrice != null ? tms.Now() : null,
                CMP_UPDATEDBY: selectedEquipmentManPrice != null ? user : null,
                CMP_RECORDVERSION: selectedEquipmentManPrice != null ? selectedEquipmentManPrice.CMP_RECORDVERSION : 0

            });

            return tms.Ajax({
                url: "/Api/ApiContractEquipManPrices/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedEquipmentManPrice = d.r;
                    self.List();
                    self.ResetUI();
                    //FillUserInterface();
                    //$(".list-group").data("id", selectedEquipmentManPrice.CMP_ID);
                }
            });
        };
        var CheckAll = function (checked) {
            var checkinputs = $("#grdContractEquipManPrices input[data-name=\"chkLine\"]:not(:disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked);
            }
        };
        this.Delete = function () {
            checkedlines = grdelm.find("input[data-name=\"chkLine\"]:checked");
            if (checkedlines.length > 0) {
                var linearr = [];
                for (var i = 0; i < checkedlines.length; i++) {
                    var line = $(checkedlines[i]);
                    linearr.push(line.data("id"));
                }

                var o = JSON.stringify(
                    {
                        Lines: linearr
                    });

                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function() {
                        return tms.Ajax({
                            url: "/Api/ApiContractEquipManPrices/DeleteAll",
                            data: o,
                            fn: function(d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            } else {
                if (selectedEquipmentManPrice) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function() {
                            return tms.Ajax({
                                url: "/Api/ApiContractEquipManPrices/DelRec",
                                data: JSON.stringify(selectedEquipmentManPrice.CMP_ID),
                                fn: function(d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                } else {
                    msgs.error(applicationstrings[lang].contractdelete);
                    return $.Deferred().reject();
                }
            }
        };

        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiContractEquipManPrices/Get",
                data: JSON.stringify(selectedEquipmentManPrice.CMP_ID),
                fn: function (d) {
                    selectedEquipmentManPrice = d.data;
                    FillUserInterface();
                }
            });
        };

        var itemSelect = function (row) {
            selectedEquipmentManPrice = grdContractEquipManPrices.GetRowDataItem(row);
            LoadSelected();
        };

        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {
            grdelm.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
           
        }
        this.List = function () {
            var grdFilter = [{ field: "CMP_CONTRACTID", value: selectedrecord.CON_ID, operator: "eq", logic: "and" }];
            if (grdContractEquipManPrices) {
                grdContractEquipManPrices.ClearSelection();
                grdContractEquipManPrices.RunFilter(grdFilter);
            } else {
                grdContractEquipManPrices = new Grid({
                    keyfield: "CMP_ID",
                    columns: [
                        {
                            type: "na",
                            title: "#",
                            field: "chkLine",
                            template:
                                "<div style=\"text-align:center;\">" +
                                    "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" data-id=\"#= CMP_ID #\" /><label></label>" +
                                    "</div>",
                            filterable: false,
                            sortable: false,
                            width: 35
                        },
                        {
                            type: "number",
                            field: "CMP_CONTRACTID",
                            title: gridstrings.contractequipmanprices[lang].contractid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_PTKCODE",
                            title: gridstrings.contractequipmanprices[lang].ptkcode,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_EQUIPMENTTYPE",
                            title: gridstrings.contractequipmanprices[lang].equipmenttype,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_EQUIPMENTTYPEDESC",
                            title: gridstrings.contractequipmanprices[lang].equipmenttypedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CMP_REGION",
                            title: gridstrings.contractequipmanprices[lang].region,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_REGIONDESC",
                            title: gridstrings.contractequipmanprices[lang].regiondesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_BRANCH",
                            title: gridstrings.contractequipmanprices[lang].branch,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_BRANCHDESC",
                            title: gridstrings.contractequipmanprices[lang].branchdesc,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "CMP_EQUIPMENTID",
                            title: gridstrings.contractequipmanprices[lang].equipment,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_EQUIPMENTIDDESC",
                            title: gridstrings.contractequipmanprices[lang].equipmentdesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_REFERENCE",
                            title: gridstrings.contractequipmanprices[lang].reference,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "CMP_UNITPURCHASEPRICE",
                            title: gridstrings.contractequipmanprices[lang].unitpurchaseprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "CMP_UNITSALESPRICE",
                            title: gridstrings.contractequipmanprices[lang].unitsalesprice,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_CURRENCY",
                            title: gridstrings.contractequipmanprices[lang].currency,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "CMP_CREATED",
                            title: gridstrings.contractequipmanprices[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_CREATEDBY",
                            title: gridstrings.contractequipmanprices[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "CMP_UPDATED",
                            title: gridstrings.contractequipmanprices[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CMP_UPDATEDBY",
                            title: gridstrings.contractequipmanprices[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        CMP_CONTRACTID: { type: "number" },
                        CMP_UNITPURCHASEPRICE: { type: "number" },
                        CMP_UNITSALESPRICE: { type: "number" },
                        CMP_EQUIPMENTID: { type: "number" },
                        CMP_CREATED: { type: "datetime" },
                        CMP_UPDATED: { type: "datetime" }
                    },
                    datasource: "/Api/ApiContractEquipManPrices/List",
                    selector: "#grdContractEquipManPrices",
                    name: "grdContractEquipManPrices",
                    height: 300,
                    filter: grdFilter,
                    sort: [{ field: "CMP_ID", dir: "desc" }],
                    change: gridChange,
                    toolbarColumnMenu: true,
                    databound: gridDataBound,
                    loadall: true,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"equipmenBasedPrices.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    itemclick: function (event, item) {
                        //scr.LoadSelected();
                        self.LoadSelected();
                    }
                });
            }
        };

        var RegisterUIEvents = function () {
            $("#btnAddContractEquipManPrices").click(self.ResetUI);
            $("#btnSaveContractEquipManPrices").click(self.Save);
            $("#btnDeleteContractEquipManPrices").click(self.Delete);

            $("#cmpregion").change(function () {
                $("#cmpbranch").val("");
                $("#cmpequipment").val("");
            });
            $("#cmpbranch").change(function () {
                $("#cmpequipment").val("");
            });


            $("#btncmpcurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#cmpcurrency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncmpequipmenttype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#cmpequipmenttype",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [selectedrecord.CUS_ORG, "*"], operator: "in" }
                    ]
                });
            });
            $("#btncmpperiodictask").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.periodictasks[lang].title,
                    listurl: "/Api/ApiPeriodicTasks/List",
                    keyfield: "PTK_CODE",
                    codefield: "PTK_CODE",
                    textfield: "PTK_DESC",
                    returninput: "#cmpperiodictask",
                    columns: [
                        {
                            type: "string",
                            field: "PTK_CODE",
                            title: gridstrings.periodictasks[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PTK_DESC",
                            title: gridstrings.periodictasks[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        {
                            //field: "PTK_ORGANIZATION", value: [selectedrecord.CUS_ORG, "*"], operator: "in"
                            field: "PTK_ORGANIZATION", func: function () { return selectedrecord.CUS_ORG }, includeall: true
                        },
                        { field: "PTK_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncmpregion").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.regions[lang].title,
                    listurl: "/Api/ApiRegions/List",
                    keyfield: "REG_CODE",
                    codefield: "REG_CODE",
                    textfield: "REG_DESC",
                    returninput: "#cmpregion",
                    columns: [
                        {
                            type: "string",
                            field: "REG_CODE",
                            title: gridstrings.regions[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "REG_DESC",
                            title: gridstrings.regions[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        {
                            //field: "PTK_ORGANIZATION", value: [selectedrecord.CUS_ORG, "*"], operator: "in"
                            //field: "PTK_ORGANIZATION", func: function () { return selectedrecord.CUS_ORG }, includeall: true
                        },
                        { field: "REG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncmpbranch").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.branches[lang].title,
                    listurl: "/Api/ApiBranches/List",
                    keyfield: "BRN_CODE",
                    codefield: "BRN_CODE",
                    textfield: "BRN_DESC",
                    returninput: "#cmpbranch",
                    columns: [
                        {
                            type: "string",
                            field: "BRN_CODE",
                            title: gridstrings.branches[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "BRN_DESC",
                            title: gridstrings.branches[lang].desc,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "BRN_REGION", value: $("#cmpregion").val(), operator: "eq" },
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncmpequipment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.equipments[lang].title,
                    listurl: "/Api/ApiEquipments/List",
                    keyfield: "EQP_CODE",
                    codefield: "EQP_CODE",
                    textfield: "EQP_DESC",
                    returninput: "#cmpequipment",
                    columns: [
                        {
                            type: "string",
                            field: "EQP_CODE",
                            title: gridstrings.equipments[lang].eqpcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "EQP_DESC",
                            title: gridstrings.equipments[lang].eqpdesc,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "EQP_BRANCH", value: $("#cmpbranch").val(), operator: "eq" },
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });



            $("#cmpregion").autocomp({
                listurl: "/Api/ApiRegions/List",
                geturl: "/Api/ApiRegions/Get",
                field: "REG_CODE",
                textfield: "REG_DESC",
                active: "REG_ACTIVE",
                filter: [
                    {
                        //field: "PTK_ORGANIZATION",
                        //func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        //operator: "in"
                    }
                ]
            });
            $("#cmpbranch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [
                    {
                        //field: "PTK_ORGANIZATION",
                        //func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        //operator: "in"
                    }
                ]
            });
            $("#cmpequipment").autocomp({
                listurl: "/Api/ApiEquipments/List",
                geturl: "/Api/ApiEquipments/Get",
                field: "EQP_CODE",
                textfield: "EQP_DESC",
                active: "EQP_ACTIVE",
                filter: [
                    {
                        //field: "PTK_ORGANIZATION",
                        //func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        //operator: "in"
                    }
                ]
            });
            $("#cmpperiodictask").autocomp({
                listurl: "/Api/ApiPeriodicTasks/List",
                geturl: "/Api/ApiPeriodicTasks/Get",
                field: "PTK_CODE",
                textfield: "PTK_DESC",
                active: "PTK_ACTIVE",
                filter: [
                    {
                        field: "PTK_ORGANIZATION",
                        func: function () { return [selectedrecord.CON_ORGANIZATION, "*"] },
                        operator: "in"
                    }
                ]
            });
            $("#cmpcurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", func: function () { return selectedrecord.CON_ORGANIZATION }, includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
                ]
            });

        };


        this.Ready = function () {
            self.List();
            self.ResetUI();
        }
        RegisterUIEvents();
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
                            case "pricing":
                                return "#btnSavePricing";
                            case "partprices":
                                return "#btnSavePartPrice";
                            case "serviceprices":
                                return "#btnSaveServicePrices";
                            case "contractequipmanprices":
                                return "#btnSaveContractEquipManPrices";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                cont.Save();
                                break;
                            case "pricing":
                                prce.Save();
                                break;
                            case "partprices":
                                cpp.Save();
                                break;
                            case "serviceprices":
                                csp.Save();
                                break;
                            case "contractequipmanprices":
                                cmp.Save();
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
                            case "pricing":
                                return "#btnAddPricing";
                            case "partprices":
                                return "#btnAddPartPrice";
                            case "serviceprices":
                                return "#btnAddServicePrices";
                            case "contractequipmanprices":
                                return "#btnAddContractEquipManPrices";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                cont.ResetUI();
                                break;
                            case "pricing":
                                prce.ResetUI();
                                break;
                            case "partprices":
                                cpp.ResetUI();
                                break;
                            case "serviceprices":
                                csp.ResetUI();
                                break;
                            case "contractequipmanprices":
                                cmp.ResetUI();
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
                                cont.LoadSelected();
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
                            case "pricing":
                                return "#btnDeletePricing";
                            case "partprices":
                                return "#btnDeletePartPrice";
                            case "serviceprices":
                                return "#btnDeleteServicePrices";
                            case "contractequipmanprices":
                                return "#btnDeleteContractEquipManPrices";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                cont.Delete();
                                break;
                            case "pricing":
                                prce.Delete();
                                break;
                            case "partprices":
                                cpp.Delete();
                                break;
                            case "serviceprices":
                                csp.Delete();
                                break;
                            case "contractequipmanprices":
                                cmp.Delete();
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
                                cont.HistoryModal();
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
    };

    function ready() {
        cont.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());