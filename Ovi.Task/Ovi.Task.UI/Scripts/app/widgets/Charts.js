var chart = new function () {
    var colorpreset = ["#108ce2", "#ffd500", "#ff6400", "#2db329", "#e63262"];
    var colors = {};

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
                }
                else {
                    dataarr.push(["data", di]);
                }
            }
        }
        var chartoptions = {
            "data": {
                "columns": dataarr,
                "type": d.Type.toLowerCase(),
                "onclick": function (d, i) { console.log("onclick", d, i); },
                "onover": function (d, i) { console.log("onover", d, i); },
                "onout": function (d, i) { console.log("onout", d, i); },
                empty: { label: { text: applicationstrings[lang].nodata } },
                colors: colors
            },
            "legend": { "position": "right" },
            "tooltip": { "grouped": false },
            "padding": { "bottom": 10 },
            //"title": { text: d.Description, position: "top-center" },
            "bindto": ctrl
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
                        return value;
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
                width: 30
            }
        }
        var chart = bb.generate(chartoptions);
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
                    dataar[j][i + 1] = d.Data[i][data_names[j]];
                }

                labelarr[i + 1] = d.Data[i]["Label"];
            }
            dataar[data_names.length] = labelarr;
        }
        let chartoptions = {
            data: {
                x: "x",
                columns: dataar,
                type: "bar",
                label: true,
                empty: { label: { text: applicationstrings[lang].nodata } },

            },
            axis: {
                x: {
                    type: "category",
                    tick: {
                        fit: true,
                        multiline: false,
                        autorotate: true,
                        rotate: 20,
                        culling: false
                    }
                },
                y: {
                    tick: {
                        format: function (x) { return x.toLocaleString(); }
                    }
                }
            },
            //tooltip: {
            //    format: {
            //        value: function (value, ratio, id) {
            //            return ' ' + value + ' ';
            //        }
            //    }
            //},
            bar: {
                width: {
                    ratio: 0.2
                }
            },
            bindto: ctrl

        };
        let mychart = bb.generate(chartoptions);


    }

    this.BuildCompareChart = function (d, ctrl) {
        var chartoptions = {
            "data": {
                "columns": d.Data,
                "labels": true,
                "type": d.Type.toLowerCase(),
                "onclick": function (d, i) { console.log("onclick", d, i); },
                "onover": function (d, i) { console.log("onover", d, i); },
                "onout": function (d, i) { console.log("onout", d, i); },
                empty: { label: { text: applicationstrings[lang].nodata } },
                colors: colors
            },
            "size": {
                "width": 800,
                "height": 400
            },
            "legend": { "position": "right" },
            "tooltip": { "grouped": false },
            "padding": { "bottom": 10 },
            "title": { text: d.Description, position: "top-center" },
            "bindto": ctrl
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
                        return value;
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
                width: 30
            }
        }

        var chart = bb.generate(chartoptions);
    };
}