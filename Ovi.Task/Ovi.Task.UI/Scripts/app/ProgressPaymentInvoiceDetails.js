(function () {
    var grdInvoiceDetails = null;
    var grdInvoiceDetailsElm = $("#grdInvoiceDetails");

    function gridDataBound(e) {
        grdInvoiceDetailsElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }
    function resetFilter() {
        $("#taskcompleted_start").val("");
        $("#taskcompleted_end").val("");
        $("#pspcreated_start").val("");
        $("#pspcreated_end").val("");
    }

    function List() {
        grdInvoiceDetails = new Grid({
            keyfield: "PSP_CODE",
            columns: [
                { type: "number", field: "PSP_CODE", title: gridstrings.progresspaymentinvoicedetails[lang].pp, width: 150 },
                { type: "string", field: "PSP_DESC", title: gridstrings.progresspaymentinvoicedetails[lang].ppdesc, width: 350 },
                { type: "price", field: "PSP_TOTAL", title: gridstrings.progresspaymentinvoicedetails[lang].pptotal, width: 150 },
                { type: "string", field: "PSP_CUSTOMER", title: gridstrings.progresspaymentinvoicedetails[lang].customer, width: 200 },
                { type: "string", field: "PSP_CUSCONTACTPERSON", title: gridstrings.progresspaymentinvoicedetails[lang].customerpm, width: 200 },
                { type: "datetime", field: "PSP_TSKCOMPLETED", title: gridstrings.progresspaymentinvoicedetails[lang].completed, width: 200 },
                { type: "string", field: "PSP_COMPLETEDMY", title: gridstrings.progresspaymentinvoicedetails[lang].completedmy, width: 150 },
                { type: "string", field: "PSP_CREATEDBY", title: gridstrings.progresspaymentinvoicedetails[lang].ppcreatedby, width: 200 },
                { type: "datetime", field: "PSP_CREATED", title: gridstrings.progresspaymentinvoicedetails[lang].ppcreated, width: 200 },
                { type: "price", field: "PSP_SALSALESTOTAL", title: gridstrings.progresspaymentinvoicedetails[lang].invoicesalestotal, width: 200 },
                { type: "price", field: "PSP_SIVTOTAL", title: gridstrings.progresspaymentinvoicedetails[lang].invoicereturntotal, width: 200 },
                { type: "number", field: "PSP_LASTSIVID", title: gridstrings.progresspaymentinvoicedetails[lang].lastinvoiceid, width: 200 },
                { type: "string", field: "PSP_LASTINVNO", title: gridstrings.progresspaymentinvoicedetails[lang].lastinvoiceno, width: 150 },
                { type: "datetime", field: "PSP_LASTSIVDATE", title: gridstrings.progresspaymentinvoicedetails[lang].lastinvoicedate, width: 200 },
                { type: "string", field: "PSP_LASTSIVTYPE", title: gridstrings.progresspaymentinvoicedetails[lang].lastinvoicetype, width: 150 },
                { type: "number", field: "PSP_SIVCOUNT", title: gridstrings.progresspaymentinvoicedetails[lang].invoicecount, width: 150 }

            ],
            fields:
            {
                PSP_CODE: { type: "number" },
                PSP_LASTSIVID: { type: "number" },
                PSP_SIVCOUNT: { type: "number" },
                PSP_SIVTOTAL: { type: "number" },
                PSP_TOTAL: { type: "number" },
                PSP_SALSALESTOTAL: { type: "number" },
                PSP_TSKCOMPLETED: { type: "datetime" },
                PSP_CREATED: { type: "datetime" }
            },
            datasource: "/Api/ApiProgressPayment/ListInvoiceDetailView",
            selector: "#grdInvoiceDetails",
            filter: null,
            name: "grdInvoiceDetails",
            height: constants.defaultgridheight,
            sort: [{ field: "PSP_CODE", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"HakedisFaturaDetayıListesi.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function runFilter() {
        var gridfilter = [];

        var taskcompletedstart = $("#taskcompleted_start").val().toDate();
        var taskcompletedend = $("#taskcompleted_end").val().toDate();
        var pspcreatedstart = $("#pspcreated_start").val().toDate();
        var pspcreatedend = $("#pspcreated_end").val().toDate();

        if (taskcompletedend)
            taskcompletedend = taskcompletedend.add(1, "days");

        if (pspcreatedend)
            pspcreatedend = pspcreatedend.add(1, "days");

        if (taskcompletedstart && taskcompletedend)
            gridfilter.push({ field: "PSP_TSKCOMPLETED", value: taskcompletedstart, value2: taskcompletedend, operator: "between", logic: "and" });
        if (pspcreatedstart && pspcreatedend)
            gridfilter.push({ field: "PSP_CREATED", value: pspcreatedstart, value2: pspcreatedend, operator: "between", logic: "and" });
        if (taskcompletedstart && !taskcompletedend)
            gridfilter.push({ field: "PSP_TSKCOMPLETED", value: taskcompletedstart, operator: "gte", logic: "and" });
        if (pspcreatedstart && !pspcreatedend)
            gridfilter.push({ field: "PSP_CREATED", value: pspcreatedstart, operator: "gte", logic: "and" });
        if (!taskcompletedstart && taskcompletedend)
            gridfilter.push({ field: "PSP_TSKCOMPLETED", value: taskcompletedend, operator: "lte", logic: "and" });
        if (!pspcreatedstart && pspcreatedend)
            gridfilter.push({ field: "PSP_CREATED", value: pspcreatedend, operator: "lte", logic: "and" });

        grdInvoiceDetails.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    }

    function ready() {
        List();

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