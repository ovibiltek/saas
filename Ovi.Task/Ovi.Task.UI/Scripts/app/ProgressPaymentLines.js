(function () {
    var grdProgressPaymentLines = null;
    var grdProgressPaymentLinesElm = $("#grdProgressPaymentLines");

    function gridDataBound(e) {
        grdProgressPaymentLinesElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdProgressPaymentLines = new Grid({
            keyfield: "PPL_ID",
            columns: [
                { type: "number", field: "PPL_PSPCODE", title: gridstrings.psplinesview[lang].pspcode, width: 150 },
                { type: "string", field: "PPL_PSPDESC", title: gridstrings.psplinesview[lang].pspdesc, width: 150 },
                { type: "string", field: "PPL_PSPSTADESC", title: gridstrings.psplinesview[lang].statusdesc, width: 250 },
                { type: "number", field: "PPL_TASK", title: gridstrings.psplinesview[lang].task, width: 250 },
                { type: "string", field: "PPL_TASKSHORTDESC", title: gridstrings.psplinesview[lang].taskshortdesc, width: 350 },
                { type: "string", field: "PPL_TASKTYPEDESC", title: gridstrings.psplinesview[lang].tasktype, width: 250 },
                { type: "string", field: "PPL_TSKTASKTYPE", title: gridstrings.psplinesview[lang].tsktasktype, width: 200 },
                { type: "string", field: "PPL_TASKCATEGORYDESC", title: gridstrings.psplinesview[lang].taskcategory, width: 250 },
                { type: "string", field: "PPL_CUSTOMER", title: gridstrings.psplinesview[lang].customer, width: 350 },
                { type: "string", field: "PPL_CUSTOMERDESC", title: gridstrings.psplinesview[lang].customerdesc, width: 250 },
                { type: "string", field: "PPL_BRANCH", title: gridstrings.psplinesview[lang].branch, width: 250 },
                { type: "string", field: "PPL_BRANCHDESC", title: gridstrings.psplinesview[lang].branchdesc, width: 250 },
                { type: "string", field: "PPL_BRNAUTHORIZED", title: gridstrings.psplinesview[lang].authorized, width: 250 },
                { type: "number", field: "PPL_TSKACTLINE", title: gridstrings.psplinesview[lang].actline, width: 100 },
                { type: "string", field: "PPL_TYPE", title: gridstrings.psplinesview[lang].type, width: 200 },
                { type: "string", field: "PPL_TYPEDESC", title: gridstrings.psplinesview[lang].typedesc, width: 200 },
                { type: "number", field: "PPL_QTY", title: gridstrings.psplinesview[lang].qty, width: 200 },
                { type: "string", field: "PPL_UOM", title: gridstrings.psplinesview[lang].uom, width: 200 },
                { type: "price", field: "PPL_PRICE", title: gridstrings.psplinesview[lang].price, width: 200 },
                { type: "price", field: "PPL_TOTAL", title: gridstrings.psplinesview[lang].total, width: 200 },
                { type: "string", field: "PPL_CURR", title: gridstrings.psplinesview[lang].currency, width: 200 },
                { type: "datetime", field: "PPL_TSKCREATED", title: gridstrings.psplinesview[lang].tskcreated, width: 200 },
                { type: "datetime", field: "PPL_TSKCOMPLETED", title: gridstrings.psplinesview[lang].tskcompleted, width: 200 },
                { type: "datetime", field: "PPL_TSKCLOSED", title: gridstrings.psplinesview[lang].tskclosed, width: 200 },
                { type: "datetime", field: "PPL_PSPCREATED", title: gridstrings.psplinesview[lang].pspcreated, width: 200 },
                { type: "string", field: "PPL_TSKREFERENCE", title: gridstrings.psplinesview[lang].tskreference, width: 200 }
            ],
            fields: {
                PPL_PSPCODE: { type: "number" },
                PPL_TASK: { type: "number" },
                PPL_TSKACTLINE: { type: "number" },
                PPL_QTY: { type: "number" },
                PPL_PRICE: { type: "number" },
                PPL_TOTAL: { type: "number" },
                PPL_TSKCREATED: { type: "date" },
                PPL_TSKCOMPLETED: { type: "date" },
                PPL_TSKCLOSED: { type: "date" },
                PPL_PSPCREATED: { type: "date" }
            },
            datasource: "/Api/ApiProgressPayment/ListLinesView",
            selector: "#grdProgressPaymentLines",
            name: "grdProgressPaymentLines",
            height: constants.defaultgridheight,
            primarycodefield: "PPL_ID",
            filter: null,
            sort: [
                { field: "PPL_PSPCODE", dir: "desc" },
                { field: "PPL_TASK", dir: "desc" },
                { field: "PPL_TSKACTLINE", dir: "desc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"psplines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            toolbarColumnMenu: true,
            databound: gridDataBound,
            change: gridChange
        });
    }

    function resetFilter() {
        $("#taskcompleted_start").val("");
        $("#taskcompleted_end").val("");
        $("#pspcreated_start").val("");
        $("#pspcreated_end").val("");
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
            gridfilter.push({ field: "PPL_TSKCOMPLETED", value: taskcompletedstart, value2: taskcompletedend, operator: "between", logic: "and" });
        if (pspcreatedstart && pspcreatedend)
            gridfilter.push({ field: "PPL_PSPCREATED", value: pspcreatedstart, value2: pspcreatedend, operator: "between", logic: "and" });
        if (taskcompletedstart && !taskcompletedend)
            gridfilter.push({ field: "PPL_TSKCOMPLETED", value: taskcompletedstart, operator: "gte", logic: "and" });
        if (pspcreatedstart && !pspcreatedend)
            gridfilter.push({ field: "PPL_PSPCREATED", value: pspcreatedstart, operator: "gte", logic: "and" });
        if (!taskcompletedstart && taskcompletedend)
            gridfilter.push({ field: "PPL_TSKCOMPLETED", value: taskcompletedend, operator: "lte", logic: "and" });
        if (!pspcreatedstart && pspcreatedend)
            gridfilter.push({ field: "PPL_PSPCREATED", value: pspcreatedend, operator: "lte", logic: "and" });

        grdProgressPaymentLines.RunFilter(gridfilter);
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