(function () {
    var grdStock = null;
    var grdStockElm = $("#grdStock");

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdStock = new Grid({
            keyfield: "STK_ID",
            columns: [
                { type: "string", field: "STK_PARTCODE", title: gridstrings.stock[lang].part, width: 200 },
                { type: "string", field: "STK_PARTDESC", title: gridstrings.stock[lang].partdesc, width: 350 },
                { type: "string", field: "STK_WAREHOUSE", title: gridstrings.stock[lang].warehouse, width: 200 },
                {
                    type: "string",
                    field: "STK_WAREHOUSEDESC",
                    title: gridstrings.stock[lang].warehousedesc,
                    width: 200
                },
                { type: "string", field: "STK_BIN", title: gridstrings.stock[lang].bin, width: 200 },
                { type: "string", field: "STK_BINDESC", title: gridstrings.stock[lang].bindesc, width: 200 },
                { type: "qty", field: "STK_QTY", title: gridstrings.stock[lang].qty, width: 200 },
                { type: "string", field: "STK_PARTUOM", title: gridstrings.stock[lang].uom, width: 200 },
                { type: "price", field: "STK_AVGPRICE", title: gridstrings.stock[lang].avgprice, width: 200 }
            ],
            fields:
            {
                STK_QTY: { type: "number" },
                STK_AVGPRICE: { type: "number" }
            },
            datasource: "/Api/ApiWarehouses/StockView",
            selector: "#grdStock",
            name: "grdStock",
            height: constants.defaultgridheight,
            sort: [{ field: "STK_BIN", dir: "asc" }],
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

    function ready() {
        list();
    }

    $(document).ready(ready);
}());