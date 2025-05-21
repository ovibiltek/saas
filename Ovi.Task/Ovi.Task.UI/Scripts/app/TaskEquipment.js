(function () {
    var grdEquipmentsList = null;
    var grdEquipmentsListElm = $("#grdEquipmentsList");
    var commentsHelper;
    var documentsHelper;


    function gridDataBound() {
        grdEquipmentsListElm.find(".btn-comments").unbind("click").click(function () {
            var id = $(this).data("task");
            commentsHelper.showCommentsModal({
                subject: "TASK",
                source: id
            });
        });
        grdEquipmentsListElm.find(".btn-docs").unbind("click").click(function () {
            var id = $(this).data("task");
            documentsHelper.showDocumentsModal({
                subject: "TASK",
                source: id
            });
        });
    };
    function List() {
        grdEquipmentsList = new Grid({
            keyfield: "TSE_ID",
            columns: [
                {
                    type: "na",
                    field: "ACTIONS",
                    title: gridstrings.tasklist[lang].actions,
                    template: "<div style=\"text-align:center;\">" +
                        "<button type=\"button\" data-task=\"#= TSE_TSKID #\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(TSE_CMNTCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSE_CMNTCOUNT #</span></button> " +
                        "<button type=\"button\" data-task=\"#= TSE_TSKID #\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(TSE_DOCCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSE_DOCCOUNT # </span></button></div>",
                    filterable: false,
                    sortable: false,
                    width: 125
                },
                {
                    type: "number",
                    field: "TSE_TSKID",
                    title: gridstrings.taskequipmentlist[lang].taskid,
                    width: 100
                },
                {
                    type: "string",
                    field: "TSE_TSKDESC",
                    title: gridstrings.taskequipmentlist[lang].taskdesc,
                    width: 300
                },
                {
                    type: "string",
                    field: "TSE_TSKCAT",
                    title: gridstrings.taskequipmentlist[lang].taskcat,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TSKCATDESC",
                    title: gridstrings.taskequipmentlist[lang].taskcatdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TSKTYPE",
                    title: gridstrings.taskequipmentlist[lang].tasktype,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_TYPE",
                    title: gridstrings.taskequipmentlist[lang].type,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_CUSTOMER",
                    title: gridstrings.taskequipmentlist[lang].customer,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_BRANCH",
                    title: gridstrings.taskequipmentlist[lang].branch,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_BRANCHDESC",
                    title: gridstrings.taskequipmentlist[lang].branchdesc,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "TSE_CREATED",
                    title: gridstrings.taskequipmentlist[lang].created,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "TSE_COMPLETED",
                    title: gridstrings.taskequipmentlist[lang].completed,
                    width: 200
                },
                {
                    type: "datetime",
                    field: "TSE_ACTPLANDATE",
                    title: gridstrings.taskequipmentlist[lang].activeplandate,
                    width: 200
                },
                {
                    type: "number",
                    field: "TSE_EQPID",
                    title: gridstrings.taskequipmentlist[lang].eqpid,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPCODE",
                    title: gridstrings.taskequipmentlist[lang].eqpcode,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPTYPE",
                    title: gridstrings.taskequipmentlist[lang].eqptype,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPDESC",
                    title: gridstrings.taskequipmentlist[lang].eqpdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPBRAND",
                    title: gridstrings.taskequipmentlist[lang].eqpbrand,
                    width: 200
                },
                {
                    type: "number",
                    field: "TSE_EQPMANUFACTURINGYEAR",
                    title: gridstrings.taskequipmentlist[lang].eqpmanufacturingyear,
                    width: 200
                },
                {
                    type: "string",
                    field: "TSE_EQPKAP",
                    title: gridstrings.taskequipmentlist[lang].eqpkap,
                    width: 200
                },
            ],
            fields:
            {
                TSE_ACTPLANDATE: { type: "date" },
                TSE_TSKID: { type: "number" },
                TSE_CREATED: { type: "date" },
                TSE_COMPLETED: { type: "date" },
                TSE_EQPID: { type: "number" },
                TSE_EQPMANUFACTURINGYEAR: { type: "number" }
            },
            datasource: "/Api/ApiEquipments/GetTaskEquipmentListView",
            selector: "#grdEquipmentsList",
            name: "grdEquipmentsList",
            height: constants.defaultgridheight,
            sort: [{ field: "TSE_CREATED", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskEquipmentList.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound
        });
    };
    function loadDocumentTypes() {
        var gridreq = {
            sort: [{ field: "SYC_CODE", dir: "asc" }],
            filter: {
                filters: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "DOCTYPE", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiSystemCodes/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                $("#doctype option:not(.default)").remove();
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions += "<option value=\"" +
                        d.data[i].SYC_CODE +
                        "\">" +
                        d.data[i].SYC_DESCF +
                        "</option>";
                }
                $("#doctype").append(strOptions);
            }
        });
    };
    function Ready() {
        List();
        loadDocumentTypes();

        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
            modal: "#modaldocuments",
            documentsdiv: "#docs"
        });

        commentsHelper = new comments({
            input: "#comment",
            chkvisibletocustomer: "#visibletocustomer",
            chkvisibletosupplier: "#visibletosupplier",
            btnaddcomment: "#addComment",
            modal: "#modalcomments",
            commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
            commentsdiv: "#comments"
        });
    };

    $(document).ready(Ready);
}());