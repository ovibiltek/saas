(function () {
    var grdServicePrices = null;
    var grdServicePricesElm = $("#grdServicePrices");

    function gridDataBound(e) {
        grdServicePricesElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function list() {
        grdServicePrices = new Grid({
            keyfield: "CSP_ID",
            columns: [
                {
                    type: "number",
                    field: "CSP_CONTRACTID",
                    title: gridstrings.contractserviceprices[lang].contractid,
                    width: 200
                },
                {
                    type: "string",
                    field: "CSP_CUSTOMER",
                    title: gridstrings.contractserviceprices[lang].customer,
                    width: 200
                },
                {
                    type: "number",
                    field: "CSP_SERVICECODE",
                    title: gridstrings.contractserviceprices[lang].servicecode,
                    width: 200
                },
                {
                    type: "string",
                    field: "CSP_SERVICECODEDESC",
                    title: gridstrings.contractserviceprices[lang].servicecodedesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "CSP_REFERENCE",
                    title: gridstrings.contractserviceprices[lang].reference,
                    width: 200
                },
                {
                    type: "string",
                    field: "CSP_REGION",
                    title: gridstrings.contractserviceprices[lang].region,
                    width: 250
                },
                {
                    type: "string",
                    field: "CSP_REGIONDESC",
                    title: gridstrings.contractserviceprices[lang].regiondesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "CSP_BRANCH",
                    title: gridstrings.contractserviceprices[lang].branch,
                    width: 250
                },
                {
                    type: "string",
                    field: "CSP_BRANCHDESC",
                    title: gridstrings.contractserviceprices[lang].branchdesc,
                    width: 250
                },
                {
                    type: "price",
                    field: "CSP_UNITPURCHASEPRICE",
                    title: gridstrings.contractserviceprices[lang].unitpurchaseprice,
                    width: 150
                },
                {
                    type: "price",
                    field: "CSP_UNITSALESPRICE",
                    title: gridstrings.contractserviceprices[lang].unitsalesprice,
                    width: 150
                },
                {
                    type: "string",
                    field: "CSP_CURR",
                    title: gridstrings.contractserviceprices[lang].curr,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "CSP_CREATED",
                    title: gridstrings.contractserviceprices[lang].created,
                    width: 200
                },
                {
                    type: "string",
                    field: "CSP_CREATEDBY",
                    title: gridstrings.contractserviceprices[lang].createdby,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "CSP_UPDATED",
                    title: gridstrings.contractserviceprices[lang].updated,
                    width: 200
                },
                {
                    type: "string",
                    field: "CSP_UPDATEDBY",
                    title: gridstrings.contractserviceprices[lang].updatedby,
                    width: 250
                }
            ],
            fields: {
                CSC_ID: { type: "number" },
                CSP_SERVICECODE: { type: "number" },
                CSP_CONTRACTID: { type: "number" },
                CSP_UNITPURCHASEPRICE: { type: "number" },
                CSP_UNITSALESPRICE: { type: "number" },
                CSP_CREATED: { type: "datetime" },
                CSP_UPDATED: { type: "datetime" }
            },
            datasource: "/Api/ApiContractServicePrices/List",
            selector: "#grdServicePrices",
            name: "grdServicePrices",
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
            databound: gridDataBound
        });
    }



    function ready() {
        list();

        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    }

    $(document).ready(ready);
}());