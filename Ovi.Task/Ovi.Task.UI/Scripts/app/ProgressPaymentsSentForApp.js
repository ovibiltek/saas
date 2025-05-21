(function () {
    var grdProgressPaymentsSentForApp = null;
    var grdProgressPaymentsSentForAppElm = $("#grdProgressPaymentsSentForApp");

    function gridDataBound(e) {
        grdProgressPaymentsSentForAppElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdRawData = new Grid({
            keyfield: "PSP_CODE",
            columns: [
                {
                    type: "string",
                    field: "PSP_DESC",
                    title: gridstrings.ProgressPaymentsSentFor[lang].desc,
                    width: 200
                },
                {
                    type: "number",
                    field: "PSP_TASK",
                    title: gridstrings.ProgressPaymentsSentFor[lang].task,
                    width: 200
                },
                {
                    type: "string",
                    field: "PSP_CUSTOMER",
                    title: gridstrings.ProgressPaymentsSentFor[lang].customer,
                    width: 200
                },
                {
                    type: "string",
                    field: "PSP_BRANCH",
                    title: gridstrings.ProgressPaymentsSentFor[lang].branch,
                    width: 200
                },
                {
                    type: "string",
                    field: "PSP_TASKCATEGORY",
                    title: gridstrings.ProgressPaymentsSentFor[lang].taskcategory,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "PSP_LASTAPPROVALSENT",
                    title: gridstrings.ProgressPaymentsSentFor[lang].lastapprovalsent,
                    width: 300
                },
                {
                    type: "string",
                    field: "PSP_STATUS",
                    title: gridstrings.ProgressPaymentsSentFor[lang].status,
                    width: 200
                },
                {
                    type: "price",
                    field: "PSP_TOTALCOST",
                    title: gridstrings.ProgressPaymentsSentFor[lang].totalcost,
                    width: 350
                },
                {
                    type: "price",
                    field: "PSP_TOTALPSP",
                    title: gridstrings.ProgressPaymentsSentFor[lang].totalpsp,
                    width: 250
                },
                {
                    type: "price",
                    field: "PSP_TOTALPROFIT",
                    title: gridstrings.ProgressPaymentsSentFor[lang].totalprofit,
                    width: 200
                },
                {
                    type: "string",
                    field: "PSP_CURR",
                    title: gridstrings.ProgressPaymentsSentFor[lang].curr,
                    width: 250
                },
                {
                    type: "string",
                    field: "PSP_COMMENT_1",
                    title: gridstrings.ProgressPaymentsSentFor[lang].comment1,
                    width: 200
                },
                {
                    type: "string",
                    field: "PSP_COMMENT_2",
                    title: gridstrings.ProgressPaymentsSentFor[lang].comment2,
                    width: 250
                },
                {
                    type: "string",
                    field: "PSP_COMMENT_3",
                    title: gridstrings.ProgressPaymentsSentFor[lang].comment3,
                    width: 200
                },
                {
                    type: "string",
                    field: "PSP_COMMENT_4",
                    title: gridstrings.ProgressPaymentsSentFor[lang].comment4,
                    width: 250
                },
                {
                    type: "string",
                    field: "PSP_COMMENT_5",
                    title: gridstrings.ProgressPaymentsSentFor[lang].comment5,
                    width: 200
                }
            ],
            fields: {
                PSP_CODE: { type: "number" },
                PSP_TASK: { type: "number" },
                PSP_LASTAPPROVALSENT: { type: "datetime" },
                PSP_TOTALCOST: { type: "number" },
                PSP_TOTALPSP: { type: "number" },
                PSP_TOTALPROFIT: { type: "number" }
            },
            datasource: "/Api/ApiProgressPaymentsSentForApp/List",
            selector: "#grdProgressPaymentsSentForApp",
            name: "grdProgressPaymentsSentForApp",
            height: constants.defaultgridheight,
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
        $("#lastapprovalsent_start").val("");
        $("#lastapprovalsent_end").val("");

    }
    function runFilter() {
        var gridfilter = [];

        var lastapprovalsentstart = $("#lastapprovalsent_start").val().toDate();
        var lastapprovalsentend = $("#lastapprovalsent_end").val().toDate();

        if (lastapprovalsentend)
            lastapprovalsentend = lastapprovalsentend.add(1, "days");

        if (lastapprovalsentstart && lastapprovalsentend)
            gridfilter.push({ field: "PSP_LASTAPPROVALSENT", value: lastapprovalsentstart, Value2: lastapprovalsentend, operator: "between", logic: "and" });
        if (lastapprovalsentstart && !lastapprovalsentend)
            gridfilter.push({ field: "PSP_LASTAPPROVALSENT", value: lastapprovalsentstart, operator: "gte", logic: "and" });
        if (!lastapprovalsentstart && lastapprovalsentend)
            gridfilter.push({ field: "PSP_LASTAPPROVALSENT", value: lastapprovalsentend, operator: "lte", logic: "and" });

        grdRawData.RunFilter(gridfilter);
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