(function () {
    
    var AutoComplete = function () {
        $("#relatedperson").autocomp({
            listurl: "/Api/ApiUsers/List",
            geturl: "/Api/ApiUsers/Get",
            field: "USR_CODE",
            textfield: "USR_DESC",
            active: "USR_ACTIVE",
            filter: [
                { field: "USR_CODE", value: "*", operator: "neq" },
                { field: "USR_TYPE", value: "WHITECOLLAR", operator: "eq" }
            ],
            callback: function (data) {
                if (data) {
                    tooltip.show("#relatedperson", data.USR_DESC);
                    dynamicChart.ResetChartTab("#kpi");
                    dynamicChart.GenerateCharts("CRMDASHBOARD", "#kpi", data.USR_CODE);
                }
            }
        });
    }
    var BuildModals = function () {
        $("#btnrelatedperson").click(function () {
            gridModal.show({
                modaltitle: gridstrings.user[lang].title,
                listurl: "/Api/ApiUsers/List",
                keyfield: "USR_CODE",
                codefield: "USR_CODE",
                textfield: "USR_DESC",
                returninput: "#relatedperson",
                columns: [
                    { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                    { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                ],
                filter: [
                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                    { field: "USR_TYPE", value: "WHITECOLLAR", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#relatedperson", data.USR_DESC);
                        /* dynamicChart.ResetChartTab("#kpi");*/
                        dynamicChart.CustomSearch(data.USR_CODE);
                    }
                }
            });

        });
    }   
  


    function ready() {
        
        dynamicChart.ResetChartTab("#kpi");
        dynamicChart.GenerateCharts("CRMDASHBOARD", "#kpi", "*");
        BuildModals();
        AutoComplete();
        $("#btnclearrelatedperson").click(function () {
            $("#relatedperson").val("");
            tooltip.hide("#relatedperson");
            dynamicChart.CustomSearch("*");
        });
    }

    $(document).ready(ready);
}());