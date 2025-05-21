(function () {
    var grdContractEquipManPrices = null;
    var grdContractEquipManPricesElm = $("#grdContractEquipManPrices");

    function gridDataBound(e) {
        grdContractEquipManPricesElm.find("#search").off("click")
            .on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdContractEquipManPrices = new Grid({
            keyfield: "CMP_ID",
            columns: [
                {
                    type: "number",
                    field: "CMP_CONTRACTID",
                    title: gridstrings.contractequipmanprices[lang].contractid,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_CUSTOMER",
                    title: gridstrings.contractequipmanprices[lang].customer,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_PTKCODE",
                    title: gridstrings.contractequipmanprices[lang].ptkcode,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_PTKDESC",
                    title: gridstrings.contractequipmanprices[lang].ptkcodedesc,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_EQUIPMENTTYPE",
                    title: gridstrings.contractequipmanprices[lang].equipmenttype,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_EQUIPMENTTYPEDESC",
                    title: gridstrings.contractequipmanprices[lang].equipmenttypedesc,
                    width: 200
                },
                {
                    type: "price",
                    field: "CMP_UNITPURCHASEPRICE",
                    title: gridstrings.contractequipmanprices[lang].unitpurchaseprice,
                    width: 350
                },
                {
                    type: "price",
                    field: "CMP_UNITSALESPRICE",
                    title: gridstrings.contractequipmanprices[lang].unitsalesprice,
                    width: 350
                },
                {
                    type: "string",
                    field: "CMP_CURRENCY",
                    title: gridstrings.contractequipmanprices[lang].currency,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "CMP_CREATED",
                    title: gridstrings.contractequipmanprices[lang].created,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_CREATEDBY",
                    title: gridstrings.contractequipmanprices[lang].createdby,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "CMP_UPDATED",
                    title: gridstrings.contractequipmanprices[lang].updated,
                    width: 200
                },
                {
                    type: "string",
                    field: "CMP_UPDATEDBY",
                    title: gridstrings.contractequipmanprices[lang].updatedby,
                    width: 250
                }
            ],
            fields: {
                CMP_ID: { type: "number" },
                CMP_CONTRACTID: { type: "number" },
                CMP_UNITPURCHASEPRICE: { type: "number" },
                CMP_UNITSALESPRICE: { type: "number" },
                CMP_CREATED: { type: "datetime" },
                CMP_UPDATED: { type: "datetime" }
            },
            datasource: "/Api/ApiContractEquipManPrices/List",
            selector: "#grdContractEquipManPrices",
            name: "grdContractEquipManPrices",
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