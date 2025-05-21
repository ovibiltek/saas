(function () {
    var grdPSPLinesWithCost = null;
    var grdPSPLinesWithCostElm = $("#grdPSPLinesWithCost");

    function gridDataBound(e) {
        grdPSPLinesWithCostElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdPSPLinesWithCost = new Grid({
            keyfield: "PPL_ID",
            columns: [
                { type: "number", field: "PPL_PSPCODE", title: gridstrings.psplineswithcostview[lang].pspcode, width: 150 },
                { type: "string", field: "PPL_PSPDESC", title: gridstrings.psplineswithcostview[lang].pspdesc, width: 350 },
                { type: "string", field: "PPL_PSPSTADESC", title: gridstrings.psplineswithcostview[lang].statusdesc, width: 250 },
                { type: "number", field: "PPL_TASK", title: gridstrings.psplineswithcostview[lang].task, width: 250 },
                { type: "string", field: "PPL_TASKSHORTDESC", title: gridstrings.psplineswithcostview[lang].taskshortdesc, width: 350 },
                { type: "string", field: "PPL_TASKTYPEDESC", title: gridstrings.psplineswithcostview[lang].tasktype, width: 250 },
                { type: "string", field: "PPL_TSKTASKTYPE", title: gridstrings.psplineswithcostview[lang].tsktasktype, width: 200 },
                { type: "string", field: "PPL_TASKCATEGORYDESC", title: gridstrings.psplineswithcostview[lang].taskcategory, width: 250 },
                { type: "string", field: "PPL_CUSTOMER", title: gridstrings.psplineswithcostview[lang].customer, width: 350 },
                { type: "string", field: "PPL_CUSTOMERDESC", title: gridstrings.psplineswithcostview[lang].customerdesc, width: 250 },
                { type: "string", field: "PPL_CUSTOMERGROUP", title: gridstrings.psplineswithcostview[lang].customergroup, width: 250 },
                { type: "string", field: "PPL_CUSTOMERGROUPDESC", title: gridstrings.psplineswithcostview[lang].customergroupdesc, width: 250 },
                { type: "string", field: "PPL_BRANCH", title: gridstrings.psplineswithcostview[lang].branch, width: 250 },
                { type: "string", field: "PPL_BRANCHDESC", title: gridstrings.psplineswithcostview[lang].branchdesc, width: 250 },
                { type: "string", field: "PPL_BRANCHREGION", title: gridstrings.psplineswithcostview[lang].branchregion, width: 250 },
                { type: "string", field: "PPL_BRANCHPROVINCE", title: gridstrings.psplineswithcostview[lang].branchprovince, width: 250 },
                { type: "string", field: "PPL_TRADE", title: gridstrings.psplineswithcostview[lang].trade, width: 250 },
                { type: "string", field: "PPL_BRNAUTHORIZED", title: gridstrings.psplineswithcostview[lang].authorized, width: 250 },
                { type: "number", field: "PPL_TSKACTLINE", title: gridstrings.psplineswithcostview[lang].actline, width: 100 },
                { type: "string", field: "PPL_TYPE", title: gridstrings.psplineswithcostview[lang].type, width: 200 },
                { type: "string", field: "PPL_TYPEDESC", title: gridstrings.psplineswithcostview[lang].typedesc, width: 200 },
                { type: "number", field: "PPL_QTY", title: gridstrings.psplineswithcostview[lang].qty, width: 200 },
                { type: "string", field: "PPL_UOM", title: gridstrings.psplineswithcostview[lang].uom, width: 200 },
                { type: "price", field: "PPL_UNITPURCHASEPRICE", title: gridstrings.psplineswithcostview[lang].unitpurchaseprice, width: 200 },
                { type: "price", field: "PPL_TOTALPURCHASEPRICE", title: gridstrings.psplineswithcostview[lang].totalpurchaseprice, width: 200 },
                { type: "price", field: "PPL_UNITSALESPRICE", title: gridstrings.psplineswithcostview[lang].unitsalesprice, width: 200 },
                { type: "price", field: "PPL_TOTALSALESPRICE", title: gridstrings.psplineswithcostview[lang].totalsalesprice, width: 200 },
                { type: "string", field: "PPL_CURR", title: gridstrings.psplineswithcostview[lang].currency, width: 200 },
                { type: "datetime", field: "PPL_TSKCREATED", title: gridstrings.psplineswithcostview[lang].tskcreated, width: 200 },
                { type: "datetime", field: "PPL_TSKCOMPLETED", title: gridstrings.psplineswithcostview[lang].tskcompleted, width: 200 },
                { type: "datetime", field: "PPL_TSKCLOSED", title: gridstrings.psplineswithcostview[lang].tskclosed, width: 200 },
                { type: "datetime", field: "PPL_PSPCREATED", title: gridstrings.psplineswithcostview[lang].pspcreated, width: 200 },
                { type: "string", field: "PPL_HASINVOICE", title: gridstrings.psplineswithcostview[lang].hasinvoice, width: 200 },
                { type: "string", field: "PPL_TSKREFERENCE", title: gridstrings.psplineswithcostview[lang].tskreference, width: 200 }
            ],
            fields: {
                PPL_PSPCODE: { type: "number" },
                PPL_TASK: { type: "number" },
                PPL_TSKACTLINE: { type: "number" },
                PPL_QTY: { type: "number" },
                PPL_UNITPURCHASEPRICE: { type: "number" },
                PPL_TOTALPURCHASEPRICE: { type: "number" },
                PPL_UNITSALESPRICE: { type: "number" },
                PPL_TOTALSALESPRICE: { type: "number" },
                PPL_TSKCREATED: { type: "date" },
                PPL_TSKCOMPLETED: { type: "date" },
                PPL_TSKCLOSED: { type: "date" },
                PPL_PSPCREATED: { type: "date" }
            },
            datasource: "/Api/ApiPSPLinesWithCost/List",
            selector: "#grdPSPLinesWithCost",
            name: "grdPSPLinesWithCost",
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

        grdPSPLinesWithCost.RunFilter(gridfilter);
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