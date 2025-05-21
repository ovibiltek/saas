(function () {
    var grdCompensationList = null;
    var grdCompensationListElm = $("#grdCompensationList");

    function gridDataBound(e) {
        grdCompensationListElm.find("#search").off("click").on("click",
            function() {
                $(".sidebar.right").trigger("sidebar:open");
            });

        var data = grdCompensationList.GetData();
        var orderedlist = _.groupBy(data, "REA_ORDER");
        for (var item in orderedlist) {
            if (orderedlist.hasOwnProperty(item)) {
                var last2elm = _.last(orderedlist[item], 2);
                if (last2elm.length >= 1) {
                    var first = last2elm[0].REA_ID;
                    grdCompensationListElm.find("tr[data-id=\"" + first + "\"]").css({ background: "#3e749e", color: "#FFF" });
                }
                if (last2elm.length == 2) {
                    var second = last2elm[1].REA_ID;
                    grdCompensationListElm.find("tr[data-id=\"" + second + "\"]").css({ background: "#3e749e", color: "#FFF" });
                }
            }
        }
    }

    function list() {
        grdCompensationList = new Grid({
            keyfield: "REA_ID",
            columns: [
                { type: "number", field: "REA_ORDER", title: gridstrings.compensationlist[lang].order, width: 150 },
                {
                    type: "string",
                    field: "REA_REGCODE",
                    title: gridstrings.compensationlist[lang].region,
                    width: 350
                },
                {
                    type: "number",
                    field: "REA_TASK",
                    title: gridstrings.compensationlist[lang].taskid,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_CUSCODE",
                    title: gridstrings.compensationlist[lang].customer,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_CUSDESC",
                    title: gridstrings.compensationlist[lang].customerdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "REA_BRNCODE",
                    title: gridstrings.compensationlist[lang].branch,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_BRNDESC",
                    title: gridstrings.compensationlist[lang].branchdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "REA_LOCCODE",
                    title: gridstrings.compensationlist[lang].location,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_LOCDESC",
                    title: gridstrings.compensationlist[lang].locationdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "REA_PERIOD",
                    title: gridstrings.compensationlist[lang].readingperiod,
                    width: 350
                },
                {
                    type: "date",
                    field: "REA_DATE",
                    title: gridstrings.compensationlist[lang].date,
                    width: 350
                },
                { type: "number", field: "REA_ACTIVE", title: gridstrings.compensationlist[lang].active, width: 250 },
                {
                    type: "number",
                    field: "REA_INDUCTIVE",
                    title: gridstrings.compensationlist[lang].inductive,
                    width: 250
                },
                {
                    type: "number",
                    field: "REA_CAPACITIVE",
                    title: gridstrings.compensationlist[lang].capacitive,
                    width: 250
                },
                {
                    type: "number",
                    field: "REA_R1",
                    title: gridstrings.compensationlist[lang].iarate,
                    width: 250
                },
                {
                    type: "number",
                    field: "REA_R2",
                    title: gridstrings.compensationlist[lang].carate,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_PV",
                    title: gridstrings.compensationlist[lang].predictedvalue,
                    width: 200
                },
                {
                    type: "string",
                    field: "REA_RCONST",
                    title: gridstrings.compensationlist[lang].rateconstant,
                    width: 200
                },
                {
                    type: "na",
                    field: "REA_STATUS",
                    title: gridstrings.compensationlist[lang].status,
                    width: 150,
                    template: "<div class=\"badge # if(REA_R1C == 2 || REA_R2C == 2) {# badge-danger #} else if(REA_R1C == 1 || REA_R2C == 1) {# badge-warning #} else {# badge-success #} #\">" +
                        "#= REA_STATUS #" +
                        "</div>"
                }
            ],
            datafields: [
                {
                    name: "order",
                    field: "REA_ORDER"
                }
            ],
            fields: {
                REA_ORDER: { type: "number" },
                REA_DATE: { type: "date" },
                REA_ACTIVE: { type: "number" },
                REA_INDUCTIVE: { type: "number" },
                REA_CAPACITIVE: { type: "number" },
                REA_R1: { type: "number" },
                REA_R2: { type: "number" }
            },
            datasource: "/Api/ApiMeterReadings/ListCompensation",
            selector: "#grdCompensationList",
            name: "grdCompensationList",
            height: constants.defaultgridheight,
            primarycodefield: "REA_ID",
            filter: null,
            toolbarColumnMenu: true,
            sort: [
                { field: "REA_ORDER", dir: "asc" },
                { field: "REA_DATE", dir: "asc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"compensationlist.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"

                ]
            },
            databound: gridDataBound
        });
    }

    function resetFilter() {
        $("#date_start").val("");
        $("#date_end").val("");
    }

    function runFilter() {
        var gridfilter = [];

        var datestart = $("#date_start").val().toDate();
        var dateend = $("#date_end").val().toDate();

        if (dateend)
            dateend = dateend.add(1, "days");

        if (datestart && dateend)
            gridfilter.push({ field: "REA_DATE", value: datestart, value2: dateend, operator: "between", logic: "and" });

        if (datestart && !dateend)
            gridfilter.push({ field: "REA_DATE", value: datestart, operator: "gte", logic: "and" });

        if (!datestart && dateend)
            gridfilter.push({ field: "REA_DATE", value: dateend, operator: "lte", logic: "and" });

        grdCompensationList.RunFilter(gridfilter);
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