(function () {

    var grdSPInvoiceAmount = null;
    var grdSPInvoiceAmountElm = $("#grdSPInvoiceAmount");

    function GridDataBound(e) {
        grdSPInvoiceAmountElm.find("#search").off("click").on("click", function ()
        {
            $(".sidebar.right").trigger("sidebar:open");
        });
    }

    function ResetSidebarFilter() {
        $("#approvedate_start").val("");
        $("#approvedate_end").val("");
        $("#completed_start").val("");
        $("#completed_end").val("");
        $("#instruction_start").val("");
        $("#instruction_end").val("");
        $("#invoice_start").val("");
        $("#invoice_end").val("");
    }

    function RunSidebarFilter() {
        var gridfilter = GetFilter();
        grdSPInvoiceAmount.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function itemSelect(row) {
        var selectedrecord = grdSPInvoiceAmount.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $(".page-header h6").html(selectedrecord.SPI_TASK + " - " + selectedrecord.SPI_TSKDESC);
    }

    function GridChange(e) {
        itemSelect(e.sender.select());
    }

    function GetFilter() {

        var gridfilter = [];

        var approvestart = $("#approvedate_start").val().toDate();
        var approveend = $("#approvedate_end").val().toDate();
        var completedstart = $("#completed_start").val().toDate();
        var completedend = $("#completed_end").val().toDate();
        var instructionstart = $("#instruction_start").val().toDate();
        var instructionend = $("#instruction_end").val().toDate();
        var invoicestart = $("#invoice_start").val().toDate();
        var invoiceend = $("#invoice_end").val().toDate();

        if (approveend) approveend = approveend.add(1, "days");
        if (completedend) completedend = completedend.add(1, "days");
        if (instructionend) instructionend = instructionend.add(1, "days");
        if (invoiceend) invoiceend = invoiceend.add(1, "days");

        if (approvestart && approveend)
            gridfilter.push({ field: "SPI_INVSTATUSK", value: approvestart, value2: approveend, operator: "between", logic: "and" });
        if (approvestart && !approveend)
            gridfilter.push({ field: "SPI_INVSTATUSK", value: approvestart, operator: "gte", logic: "and" });
        if (!approvestart && approveend)
            gridfilter.push({ field: "SPI_INVSTATUSK", value: approveend, operator: "lte", logic: "and" });

        if (completedstart && completedend)
            gridfilter.push({ field: "SPI_TSKCOMPLETED", value: completedstart, value2: completedend, operator: "between", logic: "and" });
        if (completedstart && !completedend)
            gridfilter.push({ field: "SPI_TSKCOMPLETED", value: completedstart, operator: "gte", logic: "and" });
        if (!completedstart && completedend)
            gridfilter.push({ field: "SPI_TSKCOMPLETED", value: completedend, operator: "lte", logic: "and" });

        if (instructionstart && instructionend)
            gridfilter.push({ field: "SPI_INVCREATED", value: instructionstart, value2: instructionend, operator: "between", logic: "and" });
        if (instructionstart && !instructionend)
            gridfilter.push({ field: "SPI_INVCREATED", value: instructionstart, operator: "gte", logic: "and" });
        if (!instructionstart && instructionend)
            gridfilter.push({ field: "SPI_INVCREATED", value: instructionend, operator: "lte", logic: "and" });

        if (invoicestart && invoiceend)
            gridfilter.push({ field: "SPI_INVDATE", value: invoicestart, value2: invoiceend, operator: "between", logic: "and" });
        if (invoicestart && !invoiceend)
            gridfilter.push({ field: "SPI_INVDATE", value: invoicestart, operator: "gte", logic: "and" });
        if (!invoicestart && invoiceend)
            gridfilter.push({ field: "SPI_INVDATE", value: invoiceend, operator: "lte", logic: "and" });

        return gridfilter;
    }

    function List() {

        var gridfilter = GetFilter();
        if (grdSPInvoiceAmount) {
            grdSPInvoiceAmount.ClearSelection();
            grdSPInvoiceAmount.RunFilter(gridfilter);
        }
        else
        {
            grdSPInvoiceAmount = new Grid({
                keyfield: "SPI_ID",
                columns: [
                    { type: "number", field: "SPI_TASK", title: gridstrings.spinvoiceamountlist[lang].task, width: 100 },
                    { type: "number", field: "SPI_LINE", title: gridstrings.spinvoiceamountlist[lang].line, width: 100 },
                    { type: "string", field: "SPI_TSKDESC", title: gridstrings.spinvoiceamountlist[lang].tskdesc, width: 300 },
                    { type: "string", field: "SPI_TSKSTATUS", title: gridstrings.spinvoiceamountlist[lang].tskstatus, width: 100 },
                    { type: "string", field: "SPI_TSKSTATUSDESC", title: gridstrings.spinvoiceamountlist[lang].tskstatusdesc, width: 200 },
                    { type: "datetime", field: "SPI_TSKREQUESTED", title: gridstrings.spinvoiceamountlist[lang].tskrequested, width: 200 },
                    { type: "datetime", field: "SPI_TSKCOMPLETED", title: gridstrings.spinvoiceamountlist[lang].tskcompleted, width: 200 },
                    { type: "datetime", field: "SPI_TSKCLOSED", title: gridstrings.spinvoiceamountlist[lang].tksclosed, width: 200 },
                    { type: "datetime", field: "SPI_INVSTATUSK", title: gridstrings.spinvoiceamountlist[lang].statusk, width: 200 },
                    { type: "string", field: "SPI_TSKORG", title: gridstrings.spinvoiceamountlist[lang].tskorg, width: 200 },
                    { type: "string", field: "SPI_TSKCUSTOMER", title: gridstrings.spinvoiceamountlist[lang].tskcustomer, width: 200 },
                    { type: "string", field: "SPI_TSKCUSDESC", title: gridstrings.spinvoiceamountlist[lang].tskcusdesc, width: 200 },
                    { type: "string", field: "SPI_BRANCH", title: gridstrings.spinvoiceamountlist[lang].tskbranch, width: 200 },
                    { type: "string", field: "SPI_BRANCHDESC", title: gridstrings.spinvoiceamountlist[lang].tskbranchdesc, width: 200 },
                    { type: "string", field: "SPI_TSKCATEGORY", title: gridstrings.spinvoiceamountlist[lang].tskcat, width: 200 },
                    { type: "string", field: "SPI_TSKCATEGORYDESC", title: gridstrings.spinvoiceamountlist[lang].tskcatdesc, width: 200 },
                    { type: "string", field: "SPI_CREATEDBY", title: gridstrings.spinvoiceamountlist[lang].tskcreatedby, width: 200 },
                    { type: "datetime", field: "SPI_CREATED", title: gridstrings.spinvoiceamountlist[lang].tskcreated, width: 200 },
                    { type: "datetime", field: "SPI_DATECOMPLETED", title: gridstrings.spinvoiceamountlist[lang].tskdatecomp, width: 200 },
                    { type: "string", field: "SPI_SUPPLIER", title: gridstrings.spinvoiceamountlist[lang].supp, width: 200 },
                    { type: "string", field: "SPI_SUPDESC", title: gridstrings.spinvoiceamountlist[lang].suppdesc, width: 300 },
                    { type: "number", field: "SPI_INVID", title: gridstrings.spinvoiceamountlist[lang].invid, width: 200 },
                    { type: "datetime", field: "SPI_INVCREATED", title: gridstrings.spinvoiceamountlist[lang].invcreated, width: 200 },
                    { type: "string", field: "SPI_INVNO", title: gridstrings.spinvoiceamountlist[lang].invno, width: 200 },
                    { type: "datetime", field: "SPI_INVDATE", title: gridstrings.spinvoiceamountlist[lang].invdate, width: 200 },
                    { type: "string", field: "SPI_INVSTATUS", title: gridstrings.spinvoiceamountlist[lang].invstatus, width: 200 },
                    { type: "string", field: "SPI_INVSTATUSDESC", title: gridstrings.spinvoiceamountlist[lang].invstatusdesc, width: 200 },
                    { type: "price", field: "SPI_TOTAL", title: gridstrings.spinvoiceamountlist[lang].invtotal, width: 200 }
                ],
                fields:
                {
                    SPI_TASK: { type: "number" },
                    SPI_LINE: { type: "number" },
                    SPI_TSKREQUESTED: { type: "datetime" },
                    SPI_TSKCOMPLETED: { type: "datetime" },
                    SPI_INVSTATUSK: { type: "datetime" },
                    SPI_TSKCLOSED: { type: "datetime" },
                    SPI_CREATED: { type: "datetime" },
                    SPI_DATECOMPLETED: { type: "datetime" },
                    SPI_INVID: { type: "number" },
                    SPI_INVCREATED: { type: "datetime" },
                    SPI_INVDATE: { type: "datetime" },
                    SPI_TOTAL: { type: "number" }
                },
                datasource: "/Api/ApiInvoice/ListSPInvoiceAmount",
                selector: "#grdSPInvoiceAmount",
                name: "grdSPInvoiceAmount",
                height: constants.defaultgridheight,
                sort: [{ field: "SPI_ID", dir: "asc" }],
                toolbarColumnMenu: true,
                databound: GridDataBound,
                change: GridChange,
                filter: gridfilter,
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"SPInvoiceList.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                    ]
                }

            });
        }
    }

    function Ready() {
        List();

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

    $(document).ready(Ready);
}());