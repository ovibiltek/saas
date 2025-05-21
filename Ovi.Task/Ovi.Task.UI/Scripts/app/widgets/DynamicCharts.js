var dynamicChart = new function () {
    var colorpreset = ["#108ce2", "#ffd500", "#ff6400", "#2db329", "#e63262"];
    var colors = {};
    let chartlist = [];
    let size_counter = 0;
    let _variable;
    let self = this;

    function FormatKPICode(code) {
        return code.replace(".", "");
    }

    this.BuildChart = function (d, ctrl) {
        var dataarr = [];
        if (d.Data && d.Data.length > 0) {
            for (var i = 0; i < d.Data.length; i++) {
                var di = d.Data[i];
                if (Object.prototype.toString.call(di) === "[object Array]") {
                    var name = (di[0].length > 15 ? di[0].substring(0, 15) + "..." : di[0]) + " (" + di[1] + ")";
                    dataarr.push([name, di[1]]);
                    if (colorpreset[i])
                        colors[name] = colorpreset[i];
                } else {
                    dataarr.push(["data", di]);
                }
            }
        }
        var chartoptions = {
            "data": {
                "columns": dataarr,
                "type": d.Type.toLowerCase(),
                "onclick": function(d, i) {  },
                "onover": function(d, i) {  },
                "onout": function(d, i) {  },
                empty: { label: { text: applicationstrings[lang].nodata } },
                colors: colors
            },
            "legend": { "position": "right" },
            "tooltip": { "grouped": false },
            "padding": { "bottom": 10 },
            "bindto": FormatKPICode(ctrl)
        };

        if (d.Type == "GAUGE") {
            chartoptions.color = {
                pattern: [
                    "#FF0000",
                    "#F97600",
                    "#F6C600",
                    "#60B044"
                ],
                threshold: { values: d.Threshold ? d.Threshold.split(",") : [30, 60, 90, 100] }
            };
            chartoptions.gauge = {
                fullCircle: false,
                label: {
                    show: false,
                    format: function (value, ratio) {
                        return  value;
                    },
                    extents: function (value, isMax) {
                        return (isMax ? "Max:" : "Min:") + value;
                    }
                },
                expand: true,
                expand: {
                    duration: 20
                },
                min: d.MinValue || 0,
                max: d.MaxValue || 100,
                units: "%",
                width: 40
            }
        }
        var chart = bb.generate(chartoptions);
        chartlist.push(chart);
    }

    this.BuildBarChart = function (d, ctrl) {
        
        let dataar = [];
           
        if (d.Data && d.Data.length > 0) {
            let data_names = Object.keys(d.Data[0]);
            data_names = data_names.filter(x => x != "Label");
            
            let labelarr = [];
            for (var i = 0; i < data_names.length; i++) {
                dataar[i] = [data_names[i]];
            }
            labelarr[0] = "x";
            for (let i = 0; i < d.Data.length; i++) {
                for (var j = 0; j < data_names.length; j++) {
                    dataar[j][i+1] = d.Data[i][data_names[j]];
                }
               
                labelarr[i+1] = d.Data[i]["Label"];
            }
            dataar[data_names.length] = labelarr;
        }
            let chartoptions = {
                data: {
                   x: "x",
                   columns: dataar,
                   type: "bar",
                   empty: { label: { text: applicationstrings[lang].nodata } }
                },               
                axis: {
                    x: {
                        type: "category"
                    }
                },
                bar: {
                    width: {
                        ratio: 0.2
                    }
                },
                bindto: FormatKPICode(ctrl)

            };
            let mychart = bb.generate(chartoptions);
            chartlist.push(mychart);
       
      
    }

    this.BuildChartTab = function (chartid, chartdata, tab) {


        let initbuild = true;
        if ($(tab).contents().length !== 0) {
            initbuild = false;
        }
        chartdata.Size = chartdata.Size == null ? 6 : chartdata.Size;
        chartdata.UserInfo = chartdata.UserInfo ? chartdata.UserInfo : "";
        size_counter += chartdata.Size;
        let chart_tab_str = "";
        chart_tab_str = '<div class="col-md-' + chartdata.Size + '">'
            + '<div class="chart panel panel-default" data-id="' + chartid + '" id="panel-' + chartid +'">'
            + '<div class="panel-heading">'
            + '<div class="row">'
            + '<div class="col-md-10">'
            + '<h4><i class="fa fa-bar-chart"></i> ' +chartdata.Description+ '</h4>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="panel-body" style="padding:5px;height:300px;">'
            + '<div style="height:275px;" id="' + FormatKPICode(chartid) + '">'
           
            + '</div > '
            + '<div style="float: right"><p>' + chartdata.UserInfo+ '</p> </div>'
            + '</div>'
            + '</div>'
            + '</div>';
       
        if (initbuild) {
            let inputstr = "";
            inputstr += ' <div class="row"  id="filterrow">' +
                ' <div class="col-md-12">' +
                '<div class="page-header">' +
                '<h5>' + applicationstrings[lang].daterange + '</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-2">' +
                '<input type="text" ctrltype="datepicker"  class=" form-control" id="datestart">' +
                '</div>' +
                '<div class="col-md-2">' +
                '<input type="text" ctrltype="datepicker"  class=" form-control" id="dateend">' +
                '</div>' +
                '<div class="col-md-1">' +
                '<button class="btn btn-default btn-sm" id="searchkpi">' + applicationstrings[lang].search + ' </button>' +
                '</div>' +
                '</div>';


            $(tab).append(inputstr);

            $("#datestart").datetimepicker({
                format: constants.dateformat,
                showClear: true,
                icons: { clear: "fa fa-eraser" }
            });

            $("#dateend").datetimepicker({
                format: constants.dateformat,
                showClear: true,
                icons: { clear: "fa fa-eraser" }
            });
            $("#searchkpi").off("click").on("click", self.SearchAgain);
        }
        if (size_counter / 12 > 1.0 || initbuild) {
            chart_tab_str = '<div class="row custom">' + chart_tab_str + '</div>';
            size_counter = chartdata.Size;
            $(tab).append(chart_tab_str);

        } else {
           $($(tab)[0].lastChild).append(chart_tab_str);
        }
       
    }

    this.ResetChartTab = function (tab) {
        $(tab).html("");
    }

    //variable değerini sayfayı tekrar yüklemeden değişitirmek için kullanılır.
    this.CustomSearch = function (customVariable) {
       
        _variable = customVariable;
        self.SearchAgain();
    }

    this.SearchAgain = function () {
        
        for (var i = 0; i < chartlist.length; i++) {
            let chart = chartlist[i];
            
                tms.Ajax({
                    url: "/Api/ApiKPI/GetData",
                    data: JSON.stringify({
                        KPI: chart.element.attributes[1].value,
                        FromDate: $("#datestart").val().toDate(),
                        ToDate: $("#dateend").val().toDate(),
                        Param: _variable
                    }),
                    fn: function (d) {
                        if (d.data.Data && d.data.Data.length > 0) {
                            if (d.data.Type.toLowerCase() === "bar") {
                                let dataar = [[], []];
                                let data_names = Object.keys(d.data.Data[0]);
                                data_names = data_names.filter(x => x != "Label");
                                let labelarr = [];
                                for (var k = 0; k < data_names.length; k++) {
                                    dataar[k][0] = data_names[k];
                                }
                                labelarr[0] = "x";
                                for (let k = 0; k < d.data.Data.length; k++) {
                                    for (var j = 0; j < data_names.length; j++) {
                                        dataar[j][k + 1] = d.data.Data[k][data_names[j]];
                                    }
                                    labelarr[k + 1] = d.data.Data[k]["Label"];
                                }
                                dataar[data_names.length] = labelarr;
                                let chartoptions = {
                                    columns: dataar,
                                    type: "bar",
                                    unload: true
                                };
                                chart.load(chartoptions);
                            }
                            else {
                                var dataarr = [];
                                if (d.data.Data && d.data.Data.length > 0) {
                                    for (var i = 0; i < d.data.Data.length; i++) {
                                        var di = d.data.Data[i];
                                        if (Object.prototype.toString.call(di) === "[object Array]") {
                                            var name = (di[0].length > 15 ? di[0].substring(0, 15) + "..." : di[0]) + " (" + di[1] + ")";
                                            dataarr.push([name, di[1]]);
                                            if (colorpreset[i])
                                                colors[name] = colorpreset[i];
                                        } else {
                                            dataarr.push(["data", di]);
                                        }
                                    }
                                }
                                var chartoptions = {
                                    columns: dataarr,
                                    unload: true
                                };

                                if (d.Type == "GAUGE") {
                                    chartoptions.color = { 
                                        threshold: { values: d.Threshold ? d.Threshold.split(",") : [30, 60, 90, 100] }
                                    };
                                    chartoptions.gauge = {           
                                        min: d.MinValue || 0,
                                        max: d.MaxValue || 100,  
                                    }
                                }
                                chart.load(chartoptions);
                            }
                           
                        }
                        else {
                            chart.unload();
                        }

                    }

                });
             
        }
    }

    function GetChartData(code, variable, tab,) {
        let todate = tms.Now();
        let fromdate = moment().utc().startOf("year");
        $("#dateend").val(todate.format(constants.dateformat));
        $("#datestart").val(fromdate.format(constants.dateformat));
        return tms.Ajax({
            url: "/Api/ApiKPI/GetData",
            data: JSON.stringify({
                KPI: code,
                ToDate: todate,
                FromDate: fromdate,
                Param: variable
            }),
            fn: function (d) {
                if (d.data.Type == "BAR")
                    dynamicChart.BuildBarChart(d.data, "#" + code);
                else
                    dynamicChart.BuildChart(d.data, "#" + code);
 
            }
        });
    }

    this.GenerateCharts = function (groupcode, tab, variable = null  ) {
       return tms.Ajax({
           url: "/Api/ApiKPI/ListByUserAndGroup",
           data: JSON.stringify({
               kpigroup: groupcode,
               user: user
           }),
           fn: function (d) {               
                if (d.data) {
                    _variable = variable;
                    let data = d.data;
                    for (var i = 0; i < data.length; i++) {
                        self.BuildChartTab(data[i].KPI_CODE, { Size: data[i].KPI_SIZE, Description: data[i].KPI_DESC , UserInfo: data[i].KPI_USERINFO }, tab)
                    }
                    for (var i = 0; i < data.length; i++) {
                        GetChartData(data[i].KPI_CODE, variable, tab);
                    }
                }               
            }
        });
    }
}