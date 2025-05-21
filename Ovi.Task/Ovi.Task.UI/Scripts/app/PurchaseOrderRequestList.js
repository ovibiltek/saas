(function () {
    var grdPurchaseOrderList = null;
    var grdPurchaseOrderListElm = $("#grdPurchaseOrderList");

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }


    function List() {
        grdPurchaseOrderList = new Grid({
            keyfield: "PQL_ID",
            columns: [
                { type: "number", field: "PQL_ID", title: gridstrings.purchaseorderrequestlines[lang].purchaseorderlineid, width: 200 },
                { type: "number", field: "PQL_REQ", title: gridstrings.purchaseorderrequestlines[lang].reqporid, width: 200 },
                { type: "number", field: "PQL_LINE", title: gridstrings.purchaseorderrequestlines[lang].line, width: 200 },
                { type: "string", field: "PQL_PARTCODE", title: gridstrings.purchaseorderrequestlines[lang].partcode, width: 350 },
                { type: "string", field: "PQL_PARTDESC", title: gridstrings.purchaseorderrequestlines[lang].partdesc, width: 200 },
                { type: "string", field: "PQL_PARTNOTE", title: gridstrings.purchaseorderrequestlines[lang].partnote, width: 200 },
                { type: "number", field: "PQL_QUANTITY", title: gridstrings.purchaseorderrequestlines[lang].quantity, width: 200 },
                { type: "string", field: "PQL_REQUESTEDUOM", title: gridstrings.purchaseorderrequestlines[lang].requesteduom, width: 200 },
                { type: "number", field: "PQL_UOMMULTI", title: gridstrings.purchaseorderrequestlines[lang].uommulti, width: 200 },
                { type: "datetime", field: "PQL_REQUESTEDDATE", title: gridstrings.purchaseorderrequestlines[lang].requesteddate, width: 200 },
                { type: "price", field: "PQL_UNITPRICE", title: gridstrings.purchaseorderrequestlines[lang].unitprice, width: 200 },
                { type: "string", field: "PQL_CURRENCY", title: gridstrings.purchaseorderrequestlines[lang].currency, width: 200 },
                { type: "exch", field: "PQL_EXCHANGERATE", title: gridstrings.purchaseorderrequestlines[lang].exchangerate, width: 200 },
                { type: "number", field: "PQL_VATTAX", title: gridstrings.purchaseorderrequestlines[lang].vattax, width: 200 },
                { type: "number", field: "PQL_TAX2", title: gridstrings.purchaseorderrequestlines[lang].tax2, width: 200 },
                { type: "datetime", field: "PQL_CREATED", title: gridstrings.purchaseorderrequestlines[lang].created, width: 200 },
                { type: "string", field: "PQL_CREATEDBY", title: gridstrings.purchaseorderrequestlines[lang].createdby, width: 200 },
                { type: "DateTime", field: "PQL_UPDATED", title: gridstrings.purchaseorderrequestlines[lang].updated, width: 200 },
                { type: "string", field: "PQL_UPDATEDBY", title: gridstrings.purchaseorderrequestlines[lang].updatedby, width: 200 },
                { type: "number", field: "PQL_RECORDVERSION", title: gridstrings.purchaseorderrequestlines[lang].recordversion, width: 200 },

                { type: "number", field: "PQL_POID", title: gridstrings.purchaseorderrequestlines[lang].porid, width: 200 },
                { type: "string", field: "PQL_PODESC", title: gridstrings.purchaseorderrequestlines[lang].pordescription, width: 200 },
                { type: "string", field: "PQL_POORG", title: gridstrings.purchaseorderrequestlines[lang].pororganization, width: 200 },
                { type: "string", field: "PQL_POTYPE", title: gridstrings.purchaseorderrequestlines[lang].portype, width: 200 },
                { type: "string", field: "PQL_POSTATUS", title: gridstrings.purchaseorderrequestlines[lang].porstatus, width: 200 },
                { type: "number", field: "PQL_POTASK", title: gridstrings.purchaseorderrequestlines[lang].portask, width: 200 },
                { type: "string", field: "PQL_POCANCELLATIONREASON", title: gridstrings.purchaseorderrequestlines[lang].cancelreason, width: 200 },
                { type: "string", field: "PQL_POWAREHOUSE", title: gridstrings.purchaseorderrequestlines[lang].porwarehouse, width: 200 },
                { type: "string", field: "PQL_POREQUESTEDBY", title: gridstrings.purchaseorderrequestlines[lang].porrequestedby, width: 200 },
                { type: "datetime", field: "PQL_POREQUESTED", title: gridstrings.purchaseorderrequestlines[lang].porrequested, width: 200 },
                { type: "string", field: "PQL_POSUPPLIER", title: gridstrings.purchaseorderrequestlines[lang].porsupplier, width: 200 },
                { type: "datetime", field: "PQL_POCREATED", title: gridstrings.purchaseorderrequestlines[lang].porcreated, width: 200 },
                { type: "string", field: "PQL_POCREATEDBY", title: gridstrings.purchaseorderrequestlines[lang].porcreatedby, width: 200 },
                { type: "datetime", field: "PQL_POUPDATED", title: gridstrings.purchaseorderrequestlines[lang].porupdated, width: 200 },
                { type: "string", field: "PQL_POUPDATEDBY", title: gridstrings.purchaseorderrequestlines[lang].porupdatedby, width: 200 },
                { type: "number", field: "PQL_PORECORDVERSION", title: gridstrings.purchaseorderrequestlines[lang].porrecordversion, width: 200 }
            ],
            fields:
            {
                PQL_ID: { type: "number" },
                PQL_REQ: { type: "number" },
                PQL_LINE: { type: "number" },
                PQL_QUANTITY: { type: "number" },
                PQL_UOMMULTI: { type: "number" },
                PQL_REQUESTEDDATE: { type: "datetime" },
                PQL_UNITPRICE: { type: "number" },
                PQL_EXCHANGERATE: { type: "number" },
                PQL_VATTAX: { type: "number" },
                PQL_TAX2: { type: "number" },
                PQL_CREATED: { type: "datetime" },
                PQL_UPDATED: { type: "datetime" },
                PQL_RECORDVERSION: { type: "number" },
                PQL_POID: { type: "number" },
                PQL_POTASK: { type: "number" },
                PQL_POREQUESTED: { type: "number" },
                PQL_POEXCHANGERATE: { type: "number" },
                PQL_POCREATED: { type: "datetime" },
                PQL_POUPDATED: { type: "datetime" },
                PQL_PORECORDVERSION: { type: "number" }
            },
            datasource: "/Api/ApiPurchaseOrderRequisitionLines/GetListWithOrdersView",
            selector: "#grdPurchaseOrderList",
            name: "grdPurchaseOrderList",
            height: constants.defaultgridheight,
            sort: [{ field: "PQL_ID", dir: "asc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Stock.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            }
        });
    }

    $(document).ready(List);
}());