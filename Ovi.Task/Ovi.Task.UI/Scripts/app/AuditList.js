(function () {
    var grdAudit = null;
    var grdAuditElm = $("#grdAudit");

    function gridDataBound(e) {
        grdAuditElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdAudit = new Grid({
            keyfield: "AUD_ID",
            columns: [
                { type: "string", field: "AUD_SUBJECT", title: gridstrings.auditlist[lang].subject, width: 150 },
                { type: "string", field: "AUD_SOURCEDESC", title: gridstrings.auditlist[lang].source, width: 250 },
                { type: "na", title: gridstrings.auditlist[lang].action, width: 150, template: "<span>#= gridstrings.history[lang].actiontypes[AUD_ACTION]#</span>" },
                { type: "string", field: "AUD_REFID", title: gridstrings.auditlist[lang].refid, width: 250 },
                { type: "string", field: "AUD_SECONDARYREFID", title: gridstrings.auditlist[lang].secondaryrefid, width: 150 },
                { type: "string", field: "AUD_FROM", title: gridstrings.auditlist[lang].from, width: 150 },
                { type: "string", field: "AUD_TO", title: gridstrings.auditlist[lang].to, width: 350 },
                { type: "datetime", field: "AUD_CREATED", title: gridstrings.auditlist[lang].created, width: 250 },
                { type: "string", field: "AUD_CREATEDBY", title: gridstrings.auditlist[lang].createdby, width: 250 }
            ],
            fields: {
                AUD_CREATED: { type: "date" }
            },
            datasource: "/Api/ApiAudit/ListLines",
            selector: "#grdAudit",
            name: "grdAudit",
            height: constants.defaultgridheight,
            primarycodefield: "AUD_ID",
            filter: null,
            sort: [{ field: "AUD_ID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"bookedhours.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
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
            gridfilter.push({ field: "AUD_CREATED", value: datestart, value2: dateend, operator: "between", logic: "and"});
        if (datestart && !dateend)
            gridfilter.push({ field: "AUD_CREATED", value: datestart, operator: "gte", logic: "and" });
        if (!datestart && dateend)
            gridfilter.push({ field: "AUD_CREATED", value: dateend, operator: "lte", logic: "and" });

        grdAudit.RunFilter(gridfilter);
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