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
            keyfield: "POL_ID",
            columns: [
                { type: "number", field: "POL_PORID", title: gridstrings.purchaseorderlinesview[lang].prlporid, width: 200 },
                { type: "number", field: "POL_LINE", title: gridstrings.purchaseorderlinesview[lang].prlpurchaseorderlineid, width: 200 },
                { type: "string", field: "POL_PARTCODE", title: gridstrings.purchaseorderlinesview[lang].prlpartcode, width: 200 },
                { type: "string", field: "POL_PARTDESC", title: gridstrings.purchaseorderlinesview[lang].prlpartdesc, width: 350 },
                { type: "string", field: "POL_PARTUOM", title: gridstrings.purchaseorderlinesview[lang].prluom, width: 200 },
                { type: "number", field: "POL_QUANTITY", title: gridstrings.purchaseorderlinesview[lang].prlquantity, width: 200 },
                { type: "number", field: "POL_TASK", title: gridstrings.purchaseorderlinesview[lang].task, width: 200 },
                { type: "number", field: "POL_TASKACTIVITY", title: gridstrings.purchaseorderlinesview[lang].line, width: 200 },
                { type: "number", field: "POL_QUOTATION", title: gridstrings.purchaseorderlinesview[lang].quo, width: 200 },
                { type: "string", field: "POL_REQUESTEDUOM", title: gridstrings.purchaseorderlinesview[lang].prlrequesteduom, width: 200 },
                { type: "number", field: "POL_UOMMULTI", title: gridstrings.purchaseorderlinesview[lang].prluommulti, width: 200 },
                { type: "datetime", field: "POL_REQUESTEDDATE", title: gridstrings.purchaseorderlinesview[lang].prlrequesteddate, width: 200 },
                { type: "number", field: "POL_UNITPRICE", title: gridstrings.purchaseorderlinesview[lang].prlunitprice, width: 200 },
                { type: "string", field: "POL_CURRENCY", title: gridstrings.purchaseorderlinesview[lang].prlcurrency, width: 200 },
                { type: "number", field: "POL_EXCHANGERATE", title: gridstrings.purchaseorderlinesview[lang].prlexchangerate, width: 200 },
                { type: "number", field: "POL_VATTAX", title: gridstrings.purchaseorderlinesview[lang].prlvattax, width: 200 },
                { type: "number", field: "POL_TAX2", title: gridstrings.purchaseorderlinesview[lang].prltax2, width: 200 },
                { type: "datetime", field: "POL_CREATED", title: gridstrings.purchaseorderlinesview[lang].prlcreated, width: 200 },
                { type: "string", field: "POL_CREATEDBY", title: gridstrings.purchaseorderlinesview[lang].prlcreatedby, width: 200 },
                { type: "datetime", field: "POL_UPDATED", title: gridstrings.purchaseorderlinesview[lang].prlupdated, width: 200 },
                { type: "string", field: "POL_UPDATEDBY", title: gridstrings.purchaseorderlinesview[lang].prlupdatedby, width: 200 },
                { type: "number", field: "POL_RECORDVERSION", title: gridstrings.purchaseorderlinesview[lang].prlrecordversion, width: 200 },

                { type: "string", field: "POL_DESC", title: gridstrings.purchaseorderlinesview[lang].pordescription, width: 200 },
                { type: "string", field: "POL_ORGDESC", title: gridstrings.purchaseorderlinesview[lang].pororganization, width: 200 },
                { type: "string", field: "POL_TYPE", title: gridstrings.purchaseorderlinesview[lang].portype, width: 200 },
                { type: "string", field: "POL_STATUS", title: gridstrings.purchaseorderlinesview[lang].porstatus, width: 200 },
                { type: "number", field: "POL_QUATATION", title: gridstrings.purchaseorderlinesview[lang].porquo, width: 200 },
                { type: "string", field: "POL_QUODESC", title: gridstrings.purchaseorderlinesview[lang].porquodesc, width: 200 },
                { type: "string", field: "POL_WAREHOUSE", title: gridstrings.purchaseorderlinesview[lang].porwarehouse, width: 200 },
                { type: "string", field: "POL_REQUESTEDBY", title: gridstrings.purchaseorderlinesview[lang].porrequestedby, width: 200 },
                { type: "string", field: "POL_SUPPLIER", title: gridstrings.purchaseorderlinesview[lang].porsupplier, width: 200 },
                { type: "string", field: "POL_PORCURR", title: gridstrings.purchaseorderlinesview[lang].porcurrency, width: 200 },
                { type: "number", field: "POL_POREXCH", title: gridstrings.purchaseorderlinesview[lang].porexchangerate, width: 200 },
                { type: "datetime", field: "POL_PORCREATED", title: gridstrings.purchaseorderlinesview[lang].porcreated, width: 200 },
                { type: "string", field: "POL_PORCREATEDBY", title: gridstrings.purchaseorderlinesview[lang].porcreatedby, width: 200 },
                { type: "datetime", field: "POL_PORUPDATED", title: gridstrings.purchaseorderlinesview[lang].porupdated, width: 200 },
                { type: "string", field: "POL_PORUPDATEDBY", title: gridstrings.purchaseorderlinesview[lang].porupdatedby, width: 200 },
                { type: "number", field: "POL_PORRECORDVER", title: gridstrings.purchaseorderlinesview[lang].porrecordversion, width: 200 }
            ],
            fields:
            {
                POL_PORID: { type: "number" },
                POL_LINE: { type: "number" },
                POL_TASK: { type: "number" },
                POL_TASKACTIVITY: { type: "number" },
                POL_QUOTATION: { type: "number" },
                POL_QUANTITY: { type: "number" },
                POL_UOMMULTI: { type: "number" },
                POL_EXCHANGERATE: { type: "number" },
                POL_VATTAX: { type: "number" },
                POL_TAX2: { type: "number" },
                POL_RECORDVERSION: { type: "number" },
                POL_QUATATION: { type: "number" },
                POL_POREXCH: { type: "number" },
                POL_PORRECORDVER: { type: "number" },
                POL_REQUESTEDDATE: { type: "date" },
                POL_CREATED: { type: "date" },
                POL_UPDATED: { type: "date" },
                POL_PORCREATED: { type: "date" },
                POL_PORUPDATED: { type: "date" }
            },
            datasource: "/Api/ApiPurchaseOrderLines/GetListView",
            selector: "#grdPurchaseOrderList",
            name: "grdPurchaseOrderList",
            toolbarColumnMenu: true,
            height: constants.defaultgridheight,
            sort: [{ field: "POL_PORID", dir: "asc" }],
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