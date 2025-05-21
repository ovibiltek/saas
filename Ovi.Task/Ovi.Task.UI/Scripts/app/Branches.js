(function () {
    var selectedrecord = null;
    var selectedcustomfields = null;
    var branchid = null;
    var scr, bnch, prce, tsk, eqp;

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
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "pricing",
            btns: []
        },
        {
            name: "tasks",
            btns: []
        }
    ];

    tsk = new function () {
        var self = this;
        var grdBranchTasks = null;
        var grdBranchTasksElm = $("#grdBranchTasks");
        var gridfilter = [];

        function itemSelect(row) {
            grdBranchTasksElm.find("[data-id]").removeClass("k-state-selected");
            row.addClass("k-state-selected");
        }
        var gridDataBound = function () {
            grdBranchTasksElm.find("[data-id]").unbind("click").click(function () {
                itemSelect($(this));
            });

            grdBranchTasksElm.contextMenu({
                selector: "div.k-grid-content tr",
                items: {
                    newtab: {
                        name: applicationstrings[lang].newtab,
                        callback: function () {
                            var id = $(this).closest("[data-id]").data("id");
                            var win = window.open("/Task/Record/" + id, "_blank");
                        }
                    }
                }
            });
        };
        this.List = function () {
            gridfilter.push({ field: "TSK_BRANCH", value: selectedrecord.BRN_CODE, operator: "eq", logic: "and" });
            if (grdBranchTasks) {
                grdBranchTasks.ClearSelection();
                grdBranchTasks.RunFilter(gridfilter);
            } else {
                if ($.inArray("*", authorizeddepartmentsarr) === -1) {
                    gridfilter.push({
                        IsPersistent: true,
                        field:"BRANCH.AUTHDEPARTMENT",
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
                }

                grdBranchTasks = new Grid({
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
                    selector: "#grdBranchTasks",
                    name: "grdBranchTasks",
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
    eqp = new function () {
        var self = this;
        var grdBranchEquipments = null;
        var grdBranchEquipmentsElm = $("#grdBranchEquipments");
        var gridfilter = [];

        function itemSelect(row) {
            grdBranchEquipmentsElm.find("[data-id]").removeClass("k-state-selected");
            row.addClass("k-state-selected");
        }
        var gridDataBound = function () {
            grdBranchEquipmentsElm.find("[data-id]").unbind("click").click(function () {
                itemSelect($(this));
            });
        };
        this.List = function () {
            gridfilter.push({ field: "EQP_BRANCH", value: selectedrecord.BRN_CODE, operator: "eq", logic: "and" });
            if (grdBranchEquipments) {
                grdBranchEquipments.ClearSelection();
                grdBranchEquipments.RunFilter(gridfilter);
            } else {
                grdBranchEquipments = new Grid({
                    keyfield: "EQP_ID",
                    columns: [
                        { type: "number", field: "EQP_ID", title: gridstrings.equipments[lang].eqpid, width: 100 },
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 150 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 350 },
                        { type: "string", field: "EQP_ORG", title: gridstrings.equipments[lang].eqporg, width: 150 },
                        { type: "string", field: "EQP_ORGDESC", title: gridstrings.equipments[lang].eqporgdesc, width: 250 },
                        { type: "string", field: "EQP_LOCATION", title: gridstrings.equipments[lang].eqplocation, width: 150 },
                        { type: "string", field: "EQP_LOCATIONDESC", title: gridstrings.equipments[lang].eqplocationdesc, width: 250 },
                        { type: "string", field: "EQP_BRANCH", title: gridstrings.equipments[lang].eqpbranch, width: 150 },
                        { type: "string", field: "EQP_BRANCHDESC", title: gridstrings.equipments[lang].eqpbranchdesc, width: 250 },
                        { type: "string", field: "EQP_CUSTOMER", title: gridstrings.equipments[lang].eqpcustomer, width: 150 },
                        { type: "string", field: "EQP_CUSTOMERDESC", title: gridstrings.equipments[lang].eqpcustomerdesc, width: 250 },
                        { type: "string", field: "EQP_REGION", title: gridstrings.equipments[lang].eqpregion, width: 250 },
                        { type: "string", field: "EQP_DEPARTMENT", title: gridstrings.equipments[lang].eqpdepartment, width: 150 },
                        { type: "string", field: "EQP_DEPARTMENTDESC", title: gridstrings.equipments[lang].eqpdepartmentdesc, width: 250 },
                        { type: "string", field: "EQP_TYPE", title: gridstrings.equipments[lang].eqptype, width: 150 },
                        { type: "string", field: "EQP_TYPEDESC", title: gridstrings.equipments[lang].eqptypedesc, width: 250 },
                        { type: "string", field: "EQP_BRAND", title: gridstrings.equipments[lang].brand, width: 150 },
                        { type: "string", field: "EQP_BRANDDESC", title: gridstrings.equipments[lang].branddesc, width: 250 },
                        { type: "string", field: "EQP_MODEL", title: gridstrings.equipments[lang].model, width: 250 },
                        { type: "string", field: "EQP_ZONEDESC", title: gridstrings.equipments[lang].zonedesc, width: 250 },
                        { type: "string", field: "EQP_SERIALNO", title: gridstrings.equipments[lang].serialno, width: 150 },
                        { type: "string", field: "EQP_PARENTCODE", title: gridstrings.equipments[lang].eqpparent, width: 150 },
                        { type: "string", field: "EQP_PARENTDESC", title: gridstrings.equipments[lang].eqpparentdesc, width: 250 },
                        { type: "string", field: "EQP_GUARANTEESTATUS", title: gridstrings.equipments[lang].guaranteestatus, width: 250 },
                        { type: "number", field: "EQP_MANUFACTURINGYEAR", title: gridstrings.equipments[lang].manufacturingyear, width: 250 },
                        { type: "datetime", field: "EQP_INSDATE", title: gridstrings.equipments[lang].insdate, width: 250 },
                        { type: "number", field: "EQP_PRICE", title: gridstrings.equipments[lang].price, width: 250 },
                        { type: "string", field: "EQP_IMPORTANCELEVEL", title: gridstrings.equipments[lang].importancelevel, width: 250 },
                        { type: "string", field: "EQP_PERIODICMAINTENANCEREQUIRED", title: gridstrings.equipments[lang].periodicmaintenancerequired, width: 250 },
                        { type: "string", field: "EQP_REFERENCENO", title: gridstrings.equipments[lang].referenceno, width: 250 },
                        { type: "string", field: "EQP_ACTIVE", title: gridstrings.equipments[lang].active, width: 250 },
                        { type: "datetime", field: "EQP_CREATED", title: gridstrings.equipments[lang].created, width: 250 },
                        { type: "string", field: "EQP_CREATEDBY", title: gridstrings.equipments[lang].createdby, width: 250 },
                        { type: "datetime", field: "EQP_UPDATED", title: gridstrings.equipments[lang].updated, width: 250 },
                        { type: "string", field: "EQP_UPDATEDBY", title: gridstrings.equipments[lang].updatedby, width: 250 }
                    ],
                    fields: {
                        EQP_CREATED: { type: "date" },
                        EQP_UPDATED: { type: "date" },
                        EQP_MANIFATURINGYEAR: { type: "number" },
                        EQP_PRICE: { type: "number" },
                        EQP_INSDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiEquipments/List",
                    selector: "#grdBranchEquipments",
                    name: "grdBranchEquipments",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "EQP_ID",
                    primarytextfield: "EQP_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "EQP_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Equipments.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
    };
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

            $("#note").val(selectedPricing.PPR_NOTE);

            tooltip.show("#pricingcode", selectedPricing.PPR_PRICINGDESC);
            tooltip.show("#taskcategory", selectedPricing.PPR_TASKCATEGORYDESC);
            tooltip.show("#periodictask", selectedPricing.PPR_PERIODICTASKDESC);

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
                { field: "PPR_ENTITY", value: "BRANCH", operator: "eq", logic: "and" },
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
                            width: 300
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
                PPR_ENTITY: "BRANCH",
                PPR_CODE: selectedrecord.BRN_CODE,
                PPR_PRICINGCODE: $("#pricingcode").val().toUpper(),
                PPR_STARTDATE: moment.utc($("#startdate").val(), constants.dateformat),
                PPR_ENDDATE: moment.utc($("#enddate").val(), constants.dateformat),
                PPR_TASKCATEGORY: $("#taskcategory").val(),
                PPR_PERIODICTASK: ($("#periodictask").val() || null),
                PPR_NOTE: ($("#note").val() || null),
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
            $("#startdate").val("");
            $("#enddate").val("");
            $("#taskcategory").val("");
            $("#note").val("");
            $("#periodictask").val("");

            tooltip.hide("#pricingcode");
            tooltip.hide("#taskcategory");
            tooltip.hide("#periodictask");

            $("#divperiodictask").addClass("hidden");
            $("#pricingparameterdetails").find("*").remove();
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
                        {
                            type: "string",
                            field: "PRP_CODE",
                            title: gridstrings.pricingparameters[lang].code,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PRP_DESC",
                            title: gridstrings.pricingparameters[lang].description,
                            width: 400
                        }
                    ],
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
                        { field: "PTK_ORGANIZATION", value: [selectedrecord.BRN_ORG, "*"], operator: "in" },
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
                filter: [
                    {
                        field: "PTK_ORGANIZATION",
                        func: function () { return [selectedrecord.BRN_ORG, "*"] },
                        operator: "in"
                    }
                ]
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
                        {
                            type: "string",
                            field: "CAT_DESCF",
                            title: gridstrings.category[lang].description,
                            width: 400
                        }
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
        };
        this.Ready = function () {
            self.ResetUI();
            self.List();
        };
        RegisterTabEvents();
    };
    bnch = new function () {
        var self = this;
        var grdBranches = null;
        var grdBranchesElm = $("#grdBranches");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMBRANCHES", operator: "eq" },
                    { field: "AUD_REFID", value: branchid, operator: "eq" }
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
            $("#btnwarranty").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#warranty",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "BRNWARRANTY", operator: "eq" }
                    ],
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
                        { field: "TYP_ENTITY", value: "BRANCH", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data && branchid) {
                            customFieldsHelper.loadCustomFields({
                                subject: "BRANCH",
                                source: branchid,
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
            $("#btnoo").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#oo",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnpm").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#pm",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" }
                    ]
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
                    ]
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
                    ]
                });
            });
            $("#btnauthorizedusers").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#authorized",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" }
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
            $("#warranty").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "BRNWARRANTY", operator: "eq" }]
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
                    { field: "TYP_ENTITY", value: "BRANCH", operator: "eq" }
                ],
                callback: function (data) {
                    if (data && !branchid) {
                        customFieldsHelper.loadCustomFields(
                            { subject: "BRANCH", source: branchid, type: data.TYP_CODE });
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
            $("#oo").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE"
            });
            $("#pm").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE"
            });
            $("#province").autocomp({
                listurl: "/Api/ApiAddressSections/List",
                geturl: "/Api/ApiAddressSections/Get",
                field: "ADS_CODE",
                textfield: "ADS_DESC",
                active: "ADS_ACTIVE",
                filter: [
                    { field: "ADS_TYPE", value: "IL", operator: "eq" }
                ]
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
                ]
            });
        };
        this.Save = function () {

            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "BRANCH",
                source: branchid,
                type: $("#type").val()
            });
            var o = JSON.stringify(
                {
                    Branch: {
                        BRN_CODE: $("#code").val().toUpper(),
                        BRN_ORG: $("#org").val(),
                        BRN_DESC: $("#desc").val(),
                        BRN_TYPE: $("#type").val(),
                        BRN_TYPEENTITY: "BRANCH",
                        BRN_CUSTOMER: $("#customer").val(),
                        BRN_CSR: ($("#csr").val() || null),
                        BRN_EMERGENCYRESPONDTIME: ($("#emergencyrespondtime").val() || null),
                        BRN_OO: ($("#oo").val() || null),
                        BRN_PM: ($("#pm").val() || null),
                        BRN_AUTHORIZED: ($("#authorized").val() || null),
                        BRN_AUTHNOTES: ($("#authnotes").val() || null),
                        BRN_CUSTOMERZONE: ($("#customerzone").val() || null),
                        BRN_WARRANTY: ($("#warranty").val() || null),
                        BRN_REGION: ($("#region").val() || null),	
                        BRN_PROVINCE: ($("#province").val() || null),
                        BRN_DISTRICT: ($("#district").val() || null),
                        BRN_NEIGHBORHOOD: ($("#neighborhood").val() || null),
                        BRN_STREET: ($("#street").val() || null),
                        BRN_DOOR: ($("#door").val() || null),
                        BRN_FULLADDRESS: ($("#fulladdress").val() || null),
                        BRN_BILLADDRESS: ($("#billaddress").val() || null),
                        BRN_NOTES: ($("#notes").val() || null),
                        BRN_BUSINESSTYPE: ($("#businesstype").val() || null),
                        BRN_REFERENCE: ($("#reference").val() || null),
                        BRN_ACCOUNTCODE: ($("#accountcode").val() || null),
                        BRN_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                        BRN_DEFAULT: $("#defaultbranch").prop("checked") ? "+" : "-",
                        BRN_MAINT: $("#maintenance").prop("checked") ? "+" : "-",
                        BRN_CREATED: selectedrecord != null ? selectedrecord.BRN_CREATED : tms.Now(),
                        BRN_CREATEDBY: selectedrecord != null ? selectedrecord.BRN_CREATEDBY : user,
                        BRN_UPDATED: selectedrecord != null ? tms.Now() : null,
                        BRN_UPDATEDBY: selectedrecord != null ? user : null,
                        BRN_RECORDVERSION: selectedrecord != null ? selectedrecord.BRN_RECORDVERSION : 0,
                        BRN_SQLIDENTITY: selectedrecord != null ? selectedrecord.BRN_SQLIDENTITY : 0
                    },
                    CustomFieldValues: customfieldvalues
                });



            return tms.Ajax({
                url: "/Api/ApiBranches/Save",
                data: o,
                headers: {
                    'confirmation': '+',
                },
                fn: function (d) {
                    msgs.success(d.data);
                    branchid = d.r.Branch.BRN_CODE;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (branchid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiBranches/DelRec",
                            data: JSON.stringify(branchid),
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
            branchid = null;

            tms.Reset("#record");
            customFieldsHelper.clearCustomFields();
            $("#code").val("");
            $("#org").val("");
            $("#desc").val("");
            $("#reference").val("");
            $("#accountcode").val("");
            $("#type").val("");
            $("#customer").val("");
            $("#csr").val("");
            $("#emergencyrespondtime").val("");
            $("#oo").val("");
            $("#pm").val("");
            $("#customerzone").val("");
            $("#fulladdress").val("");
            $("#billaddress").val("");
            $("#notes").val("");
            $("#region").val("");
            $("#province").val("");
            $("#district").val("");
            $("#neighborhood").val("");
            $("#street").val("");
            $("#door").val("");
            $("#businesstype").val("");
            $("#active").prop("checked", true);
            $("#defaultbranch").prop("checked", false);
            $("#maintenance").prop("checked", false);
            $("#warranty").tagsinput("removeAll");
            $("#authorized").tagsinput("removeAll");
            $("#authnotes").val("");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            tooltip.hide("#type");
            tooltip.hide("#region");
            tooltip.hide("#org");
            tooltip.hide("#customer");
            tooltip.hide("#oo");
            tooltip.hide("#pm");
            tooltip.hide("#province");
            tooltip.hide("#district");
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.BRN_CODE);
            $("#org").val(selectedrecord.BRN_ORG);
            $("#desc").val(selectedrecord.BRN_DESC);
            $("#type").val(selectedrecord.BRN_TYPE);
            $("#customer").val(selectedrecord.BRN_CUSTOMER);
            $("#csr").val(selectedrecord.BRN_CSR);
            $("#emergencyrespondtime").val(selectedrecord.BRN_EMERGENCYRESPONDTIME);
            $("#oo").val(selectedrecord.BRN_OO);
            $("#pm").val(selectedrecord.BRN_PM);
            $("#authnotes").val(selectedrecord.BRN_AUTHNOTES);
            $("#customerzone").val(selectedrecord.BRN_CUSTOMERZONE);
            $("#region").val(selectedrecord.BRN_REGION);
            $("#province").val(selectedrecord.BRN_PROVINCE);
            $("#accountcode").val(selectedrecord.BRN_ACCOUNTCODE);
            $("#billaddress").val(selectedrecord.BRN_BILLADDRESS);
            $("#district").val(selectedrecord.BRN_DISTRICT);
            $("#neighborhood").val(selectedrecord.BRN_NEIGHBORHOOD);
            $("#street").val(selectedrecord.BRN_STREET);
            $("#door").val(selectedrecord.BRN_DOOR);
            $("#businesstype").val(selectedrecord.BRN_BUSINESSTYPE);
            $("#reference").val(selectedrecord.BRN_REFERENCE);
            $("#fulladdress").val(selectedrecord.BRN_FULLADDRESS);
            $("#notes").val(selectedrecord.BRN_NOTES);
            $("#active").prop("checked", selectedrecord.BRN_ACTIVE === "+");
            $("#defaultbranch").prop("checked", selectedrecord.BRN_DEFAULT === "+");
            $("#maintenance").prop("checked", selectedrecord.BRN_MAINT === "+");
            tooltip.show("#org", selectedrecord.BRN_ORGDESC);
            tooltip.show("#region", selectedrecord.BRN_REGIONDESC);
            tooltip.show("#type", selectedrecord.BRN_TYPEDESC);
            tooltip.show("#customer", selectedrecord.BRN_CUSTOMERDESC);
            tooltip.show("#oo", selectedrecord.BRN_OODESC);
            tooltip.show("#pm", selectedrecord.BRN_PMDESC);
            tooltip.show("#province", selectedrecord.BRN_PROVINCEDESC);
            tooltip.show("#district", selectedrecord.BRN_DISTRICTDESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            commentsHelper.showCommentsBlock({ subject: "BRANCH", source: selectedrecord.BRN_CODE });
            documentsHelper.showDocumentsBlock({ subject: "BRANCH", source: selectedrecord.BRN_CODE });;
        };
        var FillWarranties = function (warranties) {
            $("#warranty").tagsinput("removeAll");
            if (warranties && warranties.length > 0) {
                for (var i = 0; i < warranties.length; i++) {
                    var warranty = warranties[i];
                    $("#warranty").tagsinput("add", { id: warranty.SYC_CODE, text: warranty.SYC_DESCRIPTION }, ["ignore"]);
                }
            }
        }

        var FillAuthorizedUsers = function (authorizedUsers) {
            $("#authorized").tagsinput("removeAll");
            if (authorizedUsers && authorizedUsers.length > 0) {
                for (var i = 0; i < authorizedUsers.length; i++) {
                    var user = authorizedUsers[i];
                    $("#authorized").tagsinput("add", { id: user.USR_CODE, text: user.USR_DESC }, ["ignore"]);
                }
            }
        }

        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiBranches/Get",
                data: JSON.stringify(branchid),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                    FillWarranties(d.warranties);
                    FillAuthorizedUsers(d.authorizedusers);

                    return $.when(customFieldsHelper.loadCustomFields({
                        subject: "BRANCH",
                        source: branchid,
                        type: $("#type").val()
                    })).done(function(d) {
                        selectedcustomfields = d;
                    });
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdBranches.GetRowDataItem(row);
            branchid = selectedrecord.BRN_CODE;
            $(".page-header h6").html(selectedrecord.BRN_CODE + " - " + selectedrecord.BRN_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdBranchesElm.find("[data-id]").on("dblclick",
                function () {
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
                });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdBranches) {
                grdBranches.ClearSelection();
                grdBranches.RunFilter(gridfilter);
            } else {
                grdBranches = new Grid({
                    keyfield: "BRN_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "BRN_CODE",
                            title: gridstrings.branches[lang].code,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "BRN_DESC",
                            title: gridstrings.branches[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "BRN_REFERENCE",
                            title: gridstrings.branches[lang].reference,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "BRN_ORG",
                            title: gridstrings.branches[lang].org,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_ORGDESC",
                            title: gridstrings.branches[lang].orgdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_TYPE",
                            title: gridstrings.branches[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_TYPEDESC",
                            title: gridstrings.branches[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_CUSTOMER",
                            title: gridstrings.branches[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_CUSTOMERDESC",
                            title: gridstrings.branches[lang].customerdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "BRN_CUSTOMERGROUP",
                            title: gridstrings.branches[lang].customergroup,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_CUSTOMERGROUPDESC",
                            title: gridstrings.branches[lang].customergroupdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "BRN_BUSINESSTYPE",
                            title: gridstrings.branches[lang].businesstype,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_PROVINCE",
                            title: gridstrings.branches[lang].province,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "BRN_PROVINCEDESC",
                            title: gridstrings.branches[lang].provincedesc,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_DISTRICT",
                            title: gridstrings.branches[lang].district,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "BRN_WARRANTY",
                            title: gridstrings.branches[lang].warranty,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_REGION",
                            title: gridstrings.branches[lang].region,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "BRN_REGIONDESC",
                            title: gridstrings.branches[lang].regiondesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_FULLADDRESS",
                            title: gridstrings.branches[lang].address,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "BRN_ACTIVE",
                            title: gridstrings.branches[lang].active,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_MAINT",
                            title: gridstrings.branches[lang].maintenance,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_OO",
                            title: gridstrings.branches[lang].operationauthorized,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_PM",
                            title: gridstrings.branches[lang].customermanager,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_AUTHORIZED",
                            title: gridstrings.branches[lang].customerauthorized,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_AUTHNOTES",
                            title: gridstrings.branches[lang].authnotes,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_CUSTOMERZONE",
                            title: gridstrings.branches[lang].customerzone,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "BRN_CSR",
                            title: gridstrings.branches[lang].customerauthorizedemail,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "BRN_CREATED",
                            title: gridstrings.branches[lang].created,
                            width: 150
                        }, {
                            type: "string",
                            field: "BRN_CREATEDBY",
                            title: gridstrings.branches[lang].createdby,
                            width: 150
                        }, {
                            type: "datetime",
                            field: "BRN_UPDATED",
                            title: gridstrings.branches[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_UPDATEDBY",
                            title: gridstrings.branches[lang].updatedby,
                            width: 150
                        },
                        {
                           type: "string",
                           field: "BRN_NOTES",
                           title: gridstrings.branches[lang].notes,
                           width: 150
                        },
                        {
                            type: "string",
                            field: "BRN_ACCOUNTCODE",
                            title: gridstrings.branches[lang].accountcode,
                            width: 150
                        }
                    ],
                    fields: { BRN_CREATED: { type: "date" }, BRN_UPDATED: { type: "date" } },
                    datasource: "/Api/ApiBranches/List",
                    selector: "#grdBranches",
                    name: "grdBranches",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "BRN_CODE",
                    primarytextfield: "BRN_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "BRN_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Branches.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
                        bnch.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            bnch.ResetUI();
                        else
                            bnch.LoadSelected();
                        break;
                    case "#pricing":
                        prce.Ready();
                        break;
                    case "#tasks":
                        tsk.List();
                        break;
                    case "#equipments":
                        eqp.List();
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
            customFieldsHelper = new customfields({ container: "#cfcontainer", screen: "BRANCH" });

            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            self.List();
            if (!branchid)
                $("#btnBrowse").attr("disabled", "disabled");
        };
        RegisterTabEvents();
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
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                bnch.Save();
                                break;
                            case "pricing":
                                prce.Save();
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
                                break;
                            case "pricing":
                                return "#btnAddPricing";
                                break;
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                bnch.ResetUI();
                                break;
                            case "pricing":
                                prce.ResetUI();
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
                                bnch.LoadSelected();
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
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                bnch.Delete();
                                break;
                            case "pricing":
                                prce.Delete();
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
                                bnch.HistoryModal();
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
        bnch.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());