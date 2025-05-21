(function () {
    var grdTaskCountsByBranches = null;
    var grdTaskCountsByBranchesElm = $("#grdTaskCountsByBranches");

    function gridDataBound(e) {
        grdTaskCountsByBranchesElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdTaskCountsByBranches = new Grid({
            keyfield: "TCB_CUSCODE",
            columns: [
                {
                    type: "string",
                    field: "TCB_CUSCODE",
                    title: gridstrings.taskcountsbybranches[lang].cuscode,
                    width: 150
                },
                {
                    type: "string",
                    field: "TCB_CUSDESC",
                    title: gridstrings.taskcountsbybranches[lang].cusdesc,
                    width: 350
                },
                {
                    type: "char",
                    field: "TCB_ACTIVE",
                    title: gridstrings.taskcountsbybranches[lang].active,
                    width: 100
                },
                {
                    type: "datetime",
                    field: "TCB_CREATED",
                    title: gridstrings.taskcountsbybranches[lang].created,
                    width: 150
                },
                {
                    type: "number",
                    field: "TCB_CURRENTBRANCHCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].currentbracount,
                    width: 250
                },
                {
                    type: "number",
                    field: "TCB_PASTBRANCHCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].pastbracount,
                    width: 250
                },
                {
                    type: "number",
                    field: "TCB_PREVIOUSLYBRANCHCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].prevbracount,
                    width: 250
                },
                {
                    type: "number",
                    field: "TCB_ALLACTBRANCHCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].allactbracount,
                    width: 250
                },
                {
                    type: "number",
                    field: "TCB_ALLPASSIVEBRANCHCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].allpassivebracount,
                    width: 250
                },
                {
                    type: "number",
                    field: "TCB_CURRENTTASKCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].currenttaskcount,
                    width: 350
                },
                {
                    type: "number",
                    field: "TCB_PASTTASKCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].pasttaskcount,
                    width: 350
                },
                {
                    type: "number",
                    field: "TCB_PREVIOUSLYTASKCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].prevtaskcount,
                    width: 400
                },
                {
                    type: "number",
                    field: "TCB_ALLTASKCOUNT",
                    title: gridstrings.taskcountsbybranches[lang].alltaskcount,
                    width: 350
                },
                {
                    type: "number",
                    field: "TCB_CURRENTTASKCOUNTDIFBRANCH",
                    title: gridstrings.taskcountsbybranches[lang].currenttaskcountdifbra,
                    width: 350
                },
                {
                    type: "number",
                    field: "TCB_PASTTASKCOUNTDIFBRANCH",
                    title: gridstrings.taskcountsbybranches[lang].pasttaskcountdifbra,
                    width: 350
                },
                {
                    type: "number",
                    field: "TCB_PREVIOUSLYTASKCOUNTDIFBRANCH",
                    title: gridstrings.taskcountsbybranches[lang].prevtaskcountdifbra,
                    width: 350
                },
                {
                    type: "number",
                    field: "TCB_ALLTASKDIFBRANCH",
                    title: gridstrings.taskcountsbybranches[lang].alltaskdifbra,
                    width: 350
                }
            ],
            fields: {
                TCB_ACTIVE: { type: "char" },
                TCB_CREATED: { type: "datetime" },
                TCB_PREVIOUSLYBRANCHCOUNT: { type: "number" },
                TCB_PASTBRANCHCOUNT: { type: "number" },
                TCB_CURRENTBRANCHCOUNT: { type: "number" },
                TCB_ALLACTBRANCHCOUNT: { type: "number" },
                TCB_ALLPASSIVEBRANCHCOUNT: { type: "number" },
                TCB_PREVIOUSLYTASKCOUNT: { type: "number" },
                TCB_PASTTASKCOUNT: { type: "number" },
                TCB_CURRENTTASKCOUNT: { type: "number" },
                TCB_ALLTASKCOUNT: { type: "number" },
                TCB_PREVIOUSLYTASKCOUNTDIFBRANCH: { type: "number" },
                TCB_PASTTASKCOUNTDIFBRANCH: { type: "number" },
                TCB_CURRENTTASKCOUNTDIFBRANCH: { type: "number" },
                TCB_ALLTASKDIFBRANCH: { type: "number" }
            },
            datasource: "/Api/ApiTaskCountsByBranches/List",
            selector: "#grdTaskCountsByBranches",
            name: "grdTaskCountsByBranches",
            height: constants.defaultgridheight,
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Lines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }


    function ready() {
        list();

        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    $(document).ready(ready);
}());