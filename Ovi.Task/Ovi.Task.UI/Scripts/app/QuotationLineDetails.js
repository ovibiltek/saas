(function () {
    var grdQuotationLineDetails = null;
    var grdQuotationLineDetailsElm = $("#grdQuotationLineDetails");

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdQuotationLineDetails = new Grid({
            keyfield: "QLN_ID",
            columns: [
                { type: "number", field: "QLN_QUOTATION", title: gridstrings.quotationlinedetails[lang].quotation, width: 150 },
                { type: "string", field: "QLN_QUODESC", title: gridstrings.quotationlinedetails[lang].description, width: 350 },
                { type: "string", field: "QLN_QUOORG", title: gridstrings.quotationlinedetails[lang].organization, width: 250 },
                { type: "string", field: "QLN_QUOCUSTOMER", title: gridstrings.quotationlinedetails[lang].customer, width: 250 },
                { type: "string", field: "QLN_QUOTYPE", title: gridstrings.quotationlinedetails[lang].type, width: 350 },
                { type: "string", field: "QLN_QUOSUPPLIER", title: gridstrings.quotationlinedetails[lang].supplier, width: 250 },
                { type: "string", field: "QLN_QUOSTATUS", title: gridstrings.quotationlinedetails[lang].status, width: 200 },
                { type: "string", field: "QLN_STADESC", title: gridstrings.quotationlinedetails[lang].statusdesc, width: 250 },
                { type: "number", field: "QLN_QUOTASK", title: gridstrings.quotationlinedetails[lang].task, width: 350 },
                { type: "string", field: "QLN_TSKCATEGORY", title: gridstrings.quotationlinedetails[lang].category, width: 250 },
                { type: "string", field: "QLN_CATDESC", title: gridstrings.quotationlinedetails[lang].categorydesc, width: 250 },
                { type: "string", field: "QLN_TYPE", title: gridstrings.quotationlinedetails[lang].linetype, width: 250 },
                { type: "string", field: "QLN_SUBTYPE", title: gridstrings.quotationlinedetails[lang].linesubtype, width: 250 },
                { type: "string", field: "QLN_CODE", title: gridstrings.quotationlinedetails[lang].code, width: 100 },
                { type: "string", field: "QLN_DESCRIPTION", title: gridstrings.quotationlinedetails[lang].description, width: 350 },
                { type: "qty", field: "QLN_QUANTITY", title: gridstrings.quotationlinedetails[lang].quantity, width: 200 },
                { type: "string", field: "QLN_UOM", title: gridstrings.quotationlinedetails[lang].uom, width: 200 },
                { type: "price", field: "QLN_UNITPURCHASEPRICE", title: gridstrings.quotationlinedetails[lang].unitpurchaseprice, width: 200 },
                { type: "string", field: "QLN_PURCHASECURR", title: gridstrings.quotationlinedetails[lang].currency, width: 200 },
                { type: "price", field: "QLN_UNITSALESPRICE", title: gridstrings.quotationlinedetails[lang].unitsalesprice, width: 200 },
                { type: "string", field: "QLN_CURR", title: gridstrings.quotationlinedetails[lang].currency, width: 200 }             
            ],
            fields: {
                QLN_QUOTATION: { type: "number" },
                QLN_QUOTASK: { type: "number" },
                QLN_QUANTITY: { type: "number" },
                QLN_UNITPURCHASEPRICE: { type: "number" },
                QLN_UNITSALESPRICE: { type: "number" }
            },
            datasource: "/Api/ApiQuotations/ListLineDetailsView",
            selector: "#grdQuotationLineDetails",
            name: "grdQuotationLineDetails",
            height: constants.defaultgridheight,
            primarycodefield: "QLN_ID",
            filter: null,
            sort: [
                { field: "QLN_QUOTATION", dir: "desc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"quotationlinedetails.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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