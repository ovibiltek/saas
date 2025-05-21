(function () {
    var grdContractPartPrices = null;
    var grdContractPartPricesElm = $("#grdContractPartPrices");

    function gridDataBound(e) {
        grdContractPartPricesElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }


    function list() {
        grdContractPartPrices = new Grid({
            keyfield: "CPP_ID",
            columns: [
                {
                    type: "number",
                    field: "CPP_CONTRACTID",
                    title: gridstrings.contractpartprices[lang].contractid,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_CUSTOMER",
                    title: gridstrings.contractpartprices[lang].customer,
                    width: 200
                },
                {
                    type: "number",
                    field: "CPP_PART",
                    title: gridstrings.contractpartprices[lang].part,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_PARTCODE",
                    title: gridstrings.contractpartprices[lang].partcode,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_PARTDESC",
                    title: gridstrings.contractpartprices[lang].partdesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_PARTUOM",
                    title: gridstrings.contractpartprices[lang].partuom,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_REFERENCE",
                    title: gridstrings.contractpartprices[lang].reference,
                    width: 300
                },
                {
                    type: "price",
                    field: "CPP_UNITPURCHASEPRICE",
                    title: gridstrings.contractpartprices[lang].unitpurchaseprice,
                    width: 200
                },
                {
                    type: "price",
                    field: "CPP_UNITSALESPRICE",
                    title: gridstrings.contractpartprices[lang].unitsalesprice,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_CURR",
                    title: gridstrings.contractpartprices[lang].currency,
                    width: 350
                },
                {
                    type: "datetime",
                    field: "CPP_CREATED",
                    title: gridstrings.contractpartprices[lang].created,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_CREATEDBY",
                    title: gridstrings.contractpartprices[lang].createdby,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "CPP_UPDATED",
                    title: gridstrings.contractpartprices[lang].updated,
                    width: 200
                },
                {
                    type: "string",
                    field: "CPP_UPDATEDBY",
                    title: gridstrings.contractpartprices[lang].updatedby,
                    width: 250
                }
            ],
            fields: {
                CPP_ID: { type: "number" },
                CPP_CONTRACTID: { type: "number" },
                CPP_PART: { type: "number" },
                CPP_UNITPURCHASEPRICE: { type: "number" },
                CPP_UNITSALESPRICE: { type: "number" },
                CPP_CREATED: { type: "datetime" },
                CPP_UPDATED: { type: "datetime" }
            },
            datasource: "/Api/ApiContractPartPrices/List",
            selector: "#grdContractPartPrices",
            name: "grdContractPartPrices",
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