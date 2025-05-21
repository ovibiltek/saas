(function () {
    var grdMeterReadings = null;
    var grdMeterReadingsElm = $("#grdMeterReadings");

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdMeterReadings = new Grid({
            keyfield: "REA_ID",
            columns: [
                { type: "string", field: "REA_TSKID", title: gridstrings.meterreadingsview[lang].task, width: 150 },
                {
                    type: "string",
                    field: "REA_TSKSHORTDESC",
                    title: gridstrings.meterreadingsview[lang].taskshortdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "REA_TSKCUSTOMER",
                    title: gridstrings.meterreadingsview[lang].customer,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_TSKCUSTOMERDESC",
                    title: gridstrings.meterreadingsview[lang].customerdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "REA_TSKBRANCH",
                    title: gridstrings.meterreadingsview[lang].branch,
                    width: 250
                },
                {
                    type: "string",
                    field: "REA_TSKBRANCHDESC",
                    title: gridstrings.meterreadingsview[lang].branchdesc,
                    width: 350
                },
                {
                    type: "number",
                    field: "REA_ACTIVITY",
                    title: gridstrings.meterreadingsview[lang].activity,
                    width: 350
                },
                {
                    type: "date",
                    field: "REA_DATE",
                    title: gridstrings.meterreadingsview[lang].date,
                    width: 350
                },
                { type: "number", field: "REA_ACTIVE", title: gridstrings.meterreadingsview[lang].active, width: 250 },
                {
                    type: "number",
                    field: "REA_INDUCTIVE",
                    title: gridstrings.meterreadingsview[lang].inductive,
                    width: 250
                },
                {
                    type: "number",
                    field: "REA_CAPACITIVE",
                    title: gridstrings.meterreadingsview[lang].capacitive,
                    width: 100
                },
                {
                    type: "number",
                    field: "REA_R1",
                    title: gridstrings.meterreadingsview[lang].r1,
                    width: 250
                },
                {
                    type: "number",
                    field: "REA_R2",
                    title: gridstrings.meterreadingsview[lang].r2,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "REA_CREATED",
                    title: gridstrings.meterreadingsview[lang].created,
                    width: 200
                },
                {
                    type: "string",
                    field: "REA_CREATEDBY",
                    title: gridstrings.meterreadingsview[lang].createdby,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "REA_UPDATED",
                    title: gridstrings.meterreadingsview[lang].updated,
                    width: 200
                },
                {
                    type: "string",
                    field: "REA_UPDATEDBY",
                    title: gridstrings.meterreadingsview[lang].updatedby,
                    width: 200
                }
            ],
            fields: {
                REA_ACTIVITY: { type: "number" },
                REA_DATE: { type: "date" },
                REA_ACTIVE: { type: "number" },
                REA_INDUCTIVE: { type: "number" },
                REA_CAPACITIVE: { type: "number" },
                REA_R1: { type: "number" },
                REA_R2: { type: "number" },
                REA_CREATED: { type: "date" },
                REA_UPDATED: { type: "date" }
            },
            datasource: "/Api/ApiMeterReadings/ListView",
            selector: "#grdMeterReadings",
            name: "grdMeterReadings",
            height: constants.defaultgridheight,
            primarycodefield: "REA_ID",
            filter: null,
            sort: [{ field: "REA_ID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"meterreadings.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function ready() {
        list();
    }

    $(document).ready(ready);
}());