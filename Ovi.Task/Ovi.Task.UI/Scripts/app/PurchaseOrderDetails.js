(function () {
    var grdPurchaseOrderDetails = null;
    var grdPurchaseOrderDetailsElm = $("#grdPurchaseOrderDetails");

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdPurchaseOrderDetails = new Grid({
            keyfield: "POD_PORID",
            columns: [
                { type: "number", field: "POD_PRQID", title: gridstrings.purchaseorderdetails[lang].prqid, width: 150 },
                { type: "string", field: "POD_PRQSTA", title: gridstrings.purchaseorderdetails[lang].prqstatus, width: 150 },
                { type: "number", field: "POD_PART", title: gridstrings.purchaseorderdetails[lang].partno, width: 150 },
                { type: "string", field: "POD_PARTDESC", title: gridstrings.purchaseorderdetails[lang].partdesc, width: 250 },
                { type: "string", field: "POD_PARTUOM", title: gridstrings.purchaseorderdetails[lang].uom, width: 150 },
                { type: "number", field: "POD_PORID", title: gridstrings.purchaseorderdetails[lang].po, width: 150 },
                { type: "string", field: "POD_PORSTA", title: gridstrings.purchaseorderdetails[lang].postatus, width: 200 },
                { type: "string", field: "POD_CARGOCOMPANY", title: gridstrings.purchaseorderdetails[lang].cargocompany, width: 250 },
                { type: "date", field: "POD_CARGODATE", title: gridstrings.purchaseorderdetails[lang].cargodate, width: 150 },
                { type: "string", field: "POD_CARGONUMBER", title: gridstrings.purchaseorderdetails[lang].cargonumber, width: 150 },
                { type: "number", field: "POD_TOTALORDERQTY", title: gridstrings.purchaseorderdetails[lang].totalorderqty, width: 150 },
                { type: "number", field: "POD_TOTALENTRY", title: gridstrings.purchaseorderdetails[lang].entryqty, width: 150 },
                { type: "number", field: "POD_TOTALRETURN", title: gridstrings.purchaseorderdetails[lang].returnqty, width: 150 },
                { type: "number", field: "POD_WAITINGQUAN", title: gridstrings.purchaseorderdetails[lang].waitqty, width: 150 },
                ],
            fields: {
                POD_PRQID: { type: "number" },
                POD_PART: { type: "number" },
                POD_PORID: { type: "number" },
                POD_TOTALORDERQTY: { type: "number" },
                POD_TOTALENTRY: { type: "number" },
                POD_TOTALRETURN: { type: "number" },
                POD_WAITINGQUAN: { type: "number" },
                POD_CARGODATE: { type: "date" }
            },

            datasource: "/Api/ApiPurchaseOrderDetails/List",
            selector: "#grdPurchaseOrderDetails",
            name: "grdPurchaseOrderDetails",
            height: constants.defaultgridheight,
            primarycodefield: "POD_PORID",
            filter: [{ field: "POD_WAITINGQUAN", value: 0, operator: "gt", logic: "and" }],
            sort: [
                { field: "POD_PORID", dir: "desc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"PurchaseOrderRequisitonDetails.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            toolbarColumnMenu: true,
            databound: gridDataBound,
            change: gridChange
        });
    }

    function ready() {
        list();     
    }

    $(document).ready(ready);
}());