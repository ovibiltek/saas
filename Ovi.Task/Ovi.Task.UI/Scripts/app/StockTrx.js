(function () {
    var grdStockTrx = null;
    var grdStockTrxElm = $("#grdStockTrx");

    function gridDataBound(e) {
        grdStockTrxElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        var grdFilter = [
            { field: "PTL_TRANSTATUS", value: "APP", operator: "eq", logic: "and" }
        ];
        grdStockTrx = new Grid({
            keyfield: "PTL_ID",
            columns: [
                {
                    type: "number",
                    field: "PTL_TRANSACTION",
                    title: gridstrings.PartTransactionLines[lang].transaction,
                    width: 150
                },
                { type: "number", field: "PTL_LINE", title: gridstrings.PartTransactionLines[lang].line, width: 150 },
                { type: "string", field: "PTL_TYPE", title: gridstrings.PartTransactionLines[lang].type, width: 150 },
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
                    type: "number",
                    field: "PTL_ACTIVITY",
                    title: gridstrings.PartTransactionLines[lang].activity,
                    width: 100
                },
                { type: "number", field: "PTL_TASK", title: gridstrings.PartTransactionLines[lang].task, width: 150 },
                {
                    type: "string",
                    field: "PTL_TASKDESC",
                    title: gridstrings.PartTransactionLines[lang].taskdescription,
                    width: 350
                },
                {
                    type: "string",
                    field: "PTL_TASKEQPCODE",
                    title: gridstrings.PartTransactionLines[lang].eqp,
                    width: 350
                },
                {
                    type: "string",
                    field: "PTL_TASKEQPDESC",
                    title: gridstrings.PartTransactionLines[lang].eqpdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "PTL_TASKCATEGORY",
                    title: gridstrings.PartTransactionLines[lang].taskcategory,
                    width: 250
                },
                {
                    type: "string",
                    field: "PTL_TASKCUSTOMER",
                    title: gridstrings.PartTransactionLines[lang].taskcustomer,
                    width: 150
                },
                {
                    type: "string",
                    field: "PTL_TASKCUSTOMERDESC",
                    title: gridstrings.PartTransactionLines[lang].taskcustomerdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "PTL_TASKBRANCH",
                    title: gridstrings.PartTransactionLines[lang].taskbranch,
                    width: 150
                },
                {
                    type: "string",
                    field: "PTL_TASKBRANCHDESC",
                    title: gridstrings.PartTransactionLines[lang].taskbranchdesc,
                    width: 250
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
                { type: "price", field: "PTL_PRICE", title: gridstrings.PartTransactionLines[lang].price, width: 150 },
                { type: "qty", field: "PTL_QTY", title: gridstrings.PartTransactionLines[lang].quantity, width: 150 },
                {
                    type: "datetime",
                    field: "PTL_TRANSACTIONDATE",
                    title: gridstrings.PartTransactionLines[lang].transactiondate,
                    width: 250
                },
                {
                    type: "string",
                    field: "PTL_CREATEDBY",
                    title: gridstrings.PartTransactionLines[lang].createdby,
                    width: 250
                }
            ],
            fields: {
                PTL_TASK: { type: "number" },
                PTL_TRANSACTION: { type: "number" },
                PTL_ACTIVITY: { type: "number" },
                PTL_LINE: { type: "number" },
                PTL_QTY: { type: "number" },
                PTL_TRANSACTIONDATE: { type: "date" }
            },
            datasource: "/Api/ApiPartTransactionLine/List",
            selector: "#grdStockTrx",
            name: "grdStockTrx",
            height: constants.defaultgridheight,
            filter: grdFilter,
            sort: [{ field: "PTL_ID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Lines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function resetFilter() {
        $("#trxdate_start").val("");
        $("#trxdate_end").val("");
    }

    function runFilter() {
        var gridfilter = [];

        var trxdatestart = $("#trxdate_start").val().toDate();
        var trxdateend = $("#trxdate_end").val().toDate();

        if (trxdateend)
            trxdateend = trxdateend.add(1, "days");

        if (trxdatestart && trxdateend)
            gridfilter.push({ field: "PTL_TRANSACTIONDATE", value: trxdatestart, value2: trxdateend, operator: "between", logic: "and" });
        if (trxdatestart && !trxdateend)
            gridfilter.push({ field: "PTL_TRANSACTIONDATE", value: trxdatestart, operator: "gte", logic: "and" });
        if (!trxdatestart && trxdateend)
            gridfilter.push({ field: "PTL_TRANSACTIONDATE", value: trxdateend, operator: "lte", logic: "and" });

        grdStockTrx.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function ready() {
        list();

        $("#filter").click(function () { runFilter(); });
        $("#clearfilter").click(function () {
            resetFilter();
            runFilter();
        });

        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    $(document).ready(ready);
}());