(function () {
    var grdAvailableTasksForPSP = null;
    var grdAvailableTasksForPSPElm = $("#grdAvailableTasksForPSP");

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdAvailableTasksForPSP = new Grid({
            keyfield: "WPT_ID",
            columns: [
                {
                    type: "string",
                    field: "WPT_CUSTOMER",
                    title: gridstrings.availabletasksforpsp[lang].customer,
                    width: 150
                },
                {
                    type: "string",
                    field: "WPT_YEARMONTH",
                    title: gridstrings.availabletasksforpsp[lang].yearmonth,
                    width: 150
                },
                { type: "string", field: "WPT_COUNT", title: gridstrings.availabletasksforpsp[lang].count, width: 250 }
            ],
            fields: {
                WPT_COUNT: { type: "number" }
            },
            datasource: "/Api/ApiProgressPayment/ListAvailableTasks",
            selector: "#grdAvailableTasksForPSP",
            name: "grdAvailableTasksForPSP",
            height: constants.defaultgridheight,
            primarycodefield: "WPT_ID",
            filter: null,
            toolbarColumnMenu: true,
            sort: [
                { field: "WPT_CUSTOMER", dir: "asc" },
                { field: "WPT_YEARMONTH", dir: "asc" }
            ],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"availabletasksforpsp.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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