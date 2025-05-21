(function () {
    var map;
    var markersArray = [];
    var center = {
        lat: 40.98055008615914,
        lng: 29.102968275547028
    };
    var docheight = shared.documentHeight();
    var selectedplnunit;
    var oms;
    var taskmarker = null;
    var taskcircle = null;
    var filtermode = "LIST";

    var maps = new function () {
        var self = this;

        this.DeleteOverlays = function () {
            for (var i = 0; i < markersArray.length; i++) {
                oms.removeMarker(markersArray[i]);
            }
            markersArray.length = 0;
        };
        this.FillListData = function (d) {
            var data = {};
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var trade = (di.ACT_DURTRADE || di.ACT_TRADE);
                data[trade] = {
                    Count: $.grep(d, function (i) {
                        return (i.ACT_DURTRADE || i.ACT_TRADE) === trade
                    }).length,
                    Last: $.grep(d, function (i) {
                        return (i.ACT_DURTRADE || i.ACT_TRADE) === trade && i.ACT_ROWNUM === 1
                    })[0]
                }
            }
            for (var trade in data) {
                if (data.hasOwnProperty(trade)) {
                    var o = data[trade];
                    var tradeli = $("a.list-group-item[data-id=\"" + trade + "\"]");
                    tradeli.find("div.add-info").remove();
                    var str = "<p><div class=\"add-info\">" +
                        "<span class=\"badge badge-danger\"><strong>" +
                        applicationstrings[lang].actcount +
                        " : </strong>" +
                        o.Count +
                        "</span> ";
                    if (o.Last) {
                        str += "<span class=\"badge badge-info\"><strong>" +
                            applicationstrings[lang].lastaction +
                            " : </strong>" +
                            o.Last.ACT_LOCDESC + " / " + moment.duration(tms.Now2().diff(moment(o.Last.ACT_DUREND || o.Last.ACT_DURSTART), "minutes"), "minutes").humanize() +
                            "</span>";
                    }
                    str += "</div></p>";
                    tradeli.append(str);
                }
            }
        }
        this.CenterMap = function (location) {
            map.setCenter(location);
        };
        this.PlaceMarker = function (location, data) {
            var contentString = "<div style=\"width:350px;\" id=\"content\">" +
                "<div id=\"activityinfo\">" +
                "<div><h2>" +
                (data.ACT_DURTRADE || data.ACT_TRADE || "") +
                "</h2></div>" +
                "<div style=\"margin-top:10px;\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> " +
                (data.ACT_TRADEUSRS || "") +
                "</div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> <b>" +
                (data.ACT_DURSTART ? moment(data.ACT_DURSTART).format(constants.longdateformat) : "?") +
                " - " +
                (data.ACT_DUREND ? moment(data.ACT_DUREND).format(constants.longdateformat) : "?") +
                "</b></span></div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-calendar\" aria-hidden=\"true\"></i> <b>" +
                (data.ACT_SCHFROM ? moment(data.ACT_SCHFROM).format(constants.longdateformat) : "?") +
                " - " +
                (data.ACT_SCHTO ? moment(data.ACT_SCHTO).format(constants.longdateformat) : "?") +
                "</b></span></div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-location-arrow\" aria-hidden=\"true\"></i> <b>" +
                data.ACT_CUSDESC +
                "-" +
                data.ACT_BRNDESC +
                "</b></span></div>" +
                "<div style=\"margin-top:10px;\"><span><i class=\"fa fa-cog\" aria-hidden=\"true\"></i> " +
                data.ACT_TASK +
                "-" +
                data.ACT_LINE +
                ":" +
                data.ACT_DESC +
                "</span></div>" +
                "</div>";

            var markerfillcolor = (data.ACT_DURSTART && !data.ACT_DUREND) ? "#398439" : ((data.ACT_DURSTART && data.ACT_DUREND) ? "#d43f3a" : "#269abc");
            var marker = new google.maps.Marker({
                map: map,
                icon: {
                    path: fontawesome.markers.MAP_MARKER,
                    scale: 0.5,
                    strokeWeight: 0.2,
                    strokeColor: "white",
                    strokeOpacity: 1,
                    fillColor: markerfillcolor,
                    fillOpacity: 1
                },
                label: (data.ACT_DURTRADE || data.ACT_TRADE),
                animation: google.maps.Animation.DROP,
                position: location
            });
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                trade: (data.ACT_DURTRADE || data.ACT_TRADE),
                task: data.ACT_TASK,
                line: data.ACT_LINE
            });
            google.maps.event.addListener(marker, "spider_click", function (e) {
                var content = $(infowindow.content);
                if (content.find("#planinfo").length === 0) {
                    var queryparams = {
                        Trade: infowindow.trade,
                        Customer: null,
                        Type: null,
                        Category: null,
                        PeriodicTask: null,
                        Rownum: 0
                    }
                    switch (filtermode) {
                        case "LIST":
                            queryparams.DateStart = $("#datestart").val() ?
                                moment.utc($("#datestart").val(), constants.dateformat) :
                                null;
                            queryparams.DateEnd = $("#dateend").val() ?
                                moment.utc($("#dateend").val(), constants.dateformat) :
                                null;
                            break;
                        case "FIND":
                            queryparams.DateStart = $("#date").val() ?
                                moment.utc($("#date").val(), constants.dateformat) :
                                null;
                            break;
                    }

                    $.when(self.GetMapData(queryparams, false)).done(function (dd) {
                        var plndata = $.grep(dd.data,
                            function (x) {
                                return !(x.ACT_TASK === infowindow.task && x.ACT_LINE === infowindow.line)
                            });
                        if (plndata.length > 0) {
                            var strtradeplan = "<div style=\"width:350px;\" id=\"planinfo\">";
                            strtradeplan += "<h2>" + applicationstrings[lang].plannedtasks + "</h2>";
                            for (var i = 0; i < plndata.length; i++) {
                                var planrow = plndata[i];
                                strtradeplan += "<div class=\"row custom\">";
                                strtradeplan += "<div class=\"col-md-12\"><strong>";
                                strtradeplan += planrow.ACT_TASK + "-" + planrow.ACT_LINE + ":" + planrow.ACT_DESC;
                                strtradeplan += "</strong></div>";
                                strtradeplan += "</div>";
                                strtradeplan += "<div class=\"row\">";
                                strtradeplan += "<div class=\"col-md-12\"><span class=\"badge badge-info\">";
                                strtradeplan += (planrow.ACT_SCHFROM ?
                                        moment(planrow.ACT_SCHFROM).format(constants.longdateformat) :
                                        "?") +
                                    " - " +
                                    (planrow.ACT_SCHTO ?
                                        moment(planrow.ACT_SCHTO).format(constants.longdateformat) :
                                        "?");
                                strtradeplan += "</span></div>";
                                strtradeplan += "</div>";
                            }
                            strtradeplan += "</div>";
                            strtradeplan = infowindow.content + strtradeplan;
                            infowindow.setContent(strtradeplan);
                        }
                    });
                }
                infowindow.open(map, marker);
            });
            oms.addMarker(marker);
            markersArray.push(marker);
        };
        this.FillMap = function (d) {
            var continuing = $.grep(d, function (e) {
                return (!e.ACT_DUREND && e.ACT_DURSTART);
            });
            var planned = $.grep(d, function (e) {
                return (!e.ACT_DUREND && !e.ACT_DURSTART);
            });
            var completed = $.grep(d, function (e) {
                return (e.ACT_DUREND && e.ACT_DURSTART);
            });

            $(".page-header h6").html(
                applicationstrings[lang].continuing +
                " : <span class=\"badge badge-success\">" +
                continuing.length +
                "</span> " +
                applicationstrings[lang].planned +
                " : <span class=\"badge badge-info\">" +
                planned.length +
                "</span>" +
                applicationstrings[lang].completed +
                " : <span class=\"badge badge-danger\">" +
                completed.length +
                "</span>");
            self.DeleteOverlays();
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var lat = Number(di.ACT_DURENDLAT || di.ACT_DURSTARTLAT || di.ACT_LOCLATITUDE);
                var lng = Number(di.ACT_DURENDLNG || di.ACT_DURSTARTLNG || di.ACT_LOCLONGITUDE);
                self.PlaceMarker({
                    lat: lat,
                    lng: lng
                }, di);
            }
            if (taskmarker) {
                if (taskcircle)
                    taskcircle.setMap(null);
                var distance = Number($("#distance").val() || "60") * 1000;
                oms.addMarker(taskmarker);
                markersArray.push(taskmarker);
                taskcircle = new google.maps.Circle({
                    map: map,
                    radius: distance,
                    fillOpacity: 0.3,
                    fillColor: "#AA0000",
                    strokeColor: "white"
                });
                taskcircle.bindTo("center", taskmarker, "position");
            }
        };
        this.GetMapData = function (d, f) {
            return tms.Ajax({
                url: f ? "/Api/ApiTaskActivityDurationsMap/Find" : "/Api/ApiTaskActivityDurationsMap/List",
                data: JSON.stringify(d)
            });
        };
        this.InitMap = function () {
            $("#map").css("height", docheight - 150);
            map = new google.maps.Map(document.getElementById("map"), {
                center: center,
                zoom: 6
            });
            oms = new OverlappingMarkerSpiderfier(map, {
                markersWontMove: true,
                markersWontHide: true,
                basicFormatEvents: true
            });
            google.maps.event.addListenerOnce(map, "idle", function () {
                $.when(self.GetMapData({
                    Trade: null,
                    Customer: null,
                    Type: null,
                    Category: null,
                    PeriodicTask: null,
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                }, false)).done(function (d) {
                    self.FillListData(d.data);
                    self.FillMap(d.data);
                });
            });
        };
    };

    var func = new function () {
        var ListTrades = function () {
            $(".list-group").list({
                listurl: "/Api/ApiTrades/List",
                loadall: true,
                fields: {
                    keyfield: "TRD_CODE",
                    descfield: "TRD_DESC"
                },
                height: docheight - 250,
                sort: [{
                    field: "TRD_CODE",
                    dir: "asc"
                }],
                itemclick: function (event, item) {
                    var selected = $("a.list-group-item.active").data("id");
                    $.when(maps.GetMapData({
                        Trade: selected,
                        Customer: ($("#customer").val() || null),
                        Type: ($("#type").val() || null),
                        Category: ($("#category").val() || null),
                        PeriodicTask: ($("#periodictask").val() || null),
                        DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                        DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                        Rownum: null
                    }, false)).done(function (d) {
                        maps.FillMap(d.data);
                    });
                }
            });
        }
        var ListUsers = function () {
            $(".list-group").list({
                listurl: "/Api/ApiUsers/List",
                loadall: true,
                fields: {
                    keyfield: "USR_CODE",
                    descfield: "USR_DESC"
                },
                height: docheight - 250,
                sort: [{
                    field: "USR_CODE",
                    dir: "asc"
                }],
                type: "A",
                srch: {
                    filters: [{
                        field: "USR_CODE",
                        operator: "contains",
                        logic: "or"
                    },
                    {
                        field: "USR_DESC",
                        operator: "contains",
                        logic: "or"
                    }
                    ],
                    logic: "and"
                },
                predefinedfilters: [{
                    filters: [
                        {
                        field: "USR_CODE",
                        value: "*",
                        operator: "neq"
                    },
                        {
                            field: "USR_TYPE",
                            value: ["CUSTOMER"],
                            operator: "nin"
                        }
                    ],
                    logic: "and"
                }],
                itemclick: function (event, item) { }
            });
        }
        var BuildModals = function () {
            $("#btncustomer").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.customer[lang].title,
                    listurl: "/Api/ApiCustomers/List",
                    keyfield: "CUS_CODE",
                    codefield: "CUS_CODE",
                    textfield: "CUS_DESC",
                    returninput: "#customer",
                    columns: [{
                        type: "string",
                        field: "CUS_CODE",
                        title: gridstrings.customer[lang].code,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "CUS_DESC",
                        title: gridstrings.customer[lang].description,
                        width: 300
                    }
                    ],
                    filter: [{
                        field: "CUS_ACTIVE",
                        value: "+",
                        operator: "eq"
                    }]
                });
            });
            $("#btncategory").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#category",
                    columns: [{
                        type: "string",
                        field: "CAT_CODE",
                        title: gridstrings.category[lang].code,
                        width: 100
                    },
                        {
                            type: "string",
                            field: "CAT_DESCF",
                            title: gridstrings.category[lang].description,
                            width: 400
                        }
                    ],
                    filter: [{
                        field: "CAT_ACTIVE",
                        value: "+",
                        operator: "eq"
                    }]
                });
            });
            $("#btntype").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#type",
                    columns: [{
                        type: "string",
                        field: "TYP_CODE",
                        title: gridstrings.type[lang].type,
                        width: 100
                    },
                        {
                            type: "string",
                            field: "TYP_DESCF",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [{
                        field: "TYP_ENTITY",
                        value: "TASK",
                        operator: "eq"
                    },
                        {
                            field: "TYP_CODE",
                            value: "*",
                            operator: "neq"
                        }
                    ]
                });
            });
            $("#btntask").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.tasklist[lang].title,
                    listurl: "/Api/ApiTask/List",
                    keyfield: "TSK_ID",
                    codefield: "TSK_ID",
                    textfield: "TSK_SHORTDESC",
                    returninput: "#task",
                    columns: [{
                        type: "number",
                        field: "TSK_ID",
                        title: gridstrings.tasklist[lang].taskno,
                        width: 100
                    },
                        {
                            type: "string",
                            field: "TSK_SHORTDESC",
                            title: gridstrings.tasklist[lang].description,
                            width: 400
                        }
                    ],
                    fields: {
                        TSK_ID: {
                            type: "number"
                        }
                    },
                    callback: function (d) {
                        if (d) {
                            return $.when(tms.Ajax({
                                url: "/Api/ApiLocations/GET",
                                data: JSON.stringify(d.TSK_LOCATION)
                            }).done(function (dx) {
                                var locdata = dx.data;
                                if (locdata.LOC_LATITUDE && locdata.LOC_LONGITUDE) {
                                    taskmarker = new google.maps.Marker({
                                        map: map,
                                        icon: {
                                            path: fontawesome.markers.MAP_MARKER,
                                            scale: 0.5,
                                            strokeWeight: 0.2,
                                            strokeColor: "white",
                                            strokeOpacity: 1,
                                            fillColor: "#EFA44A",
                                            fillOpacity: 1
                                        },
                                        label: d.TSK_BRANCHDESC,
                                        animation: google.maps.Animation.DROP,
                                        position: {
                                            lat: Number(locdata.LOC_LATITUDE),
                                            lng: Number(locdata.LOC_LONGITUDE)
                                        }
                                    });
                                }
                            }));
                        }
                    }
                });
            });
        }
        var AutoComplete = function () {
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE"
            });
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [{
                    field: "CAT_ACTIVE",
                    value: "+",
                    operator: "eq"
                }]
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/ListByDepartment",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESCF",
                filter: [{
                    field: "TYP_ENTITY",
                    value: "TASK",
                    operator: "eq"
                },
                    {
                        field: "TYP_CODE",
                        value: "*",
                        operator: "neq"
                    }
                ]
            });
            $("#task").autocomp({
                listurl: "/Api/ApiTask/List",
                geturl: "/Api/ApiTask/Get",
                field: "TSK_ID",
                textfield: "TSK_SHORTDESC",
                termisnumeric: true,
                callback: function (d) {
                    if (d) {
                        return $.when(tms.Ajax({
                            url: "/Api/ApiLocations/GET",
                            data: JSON.stringify(d.TSK_LOCATION)
                        }).done(function (dx) {
                            var locdata = dx.data;
                            if (locdata.LOC_LATITUDE && locdata.LOC_LONGITUDE) {
                                taskmarker = new google.maps.Marker({
                                    map: map,
                                    icon: {
                                        path: fontawesome.markers.MAP_MARKER,
                                        scale: 0.5,
                                        strokeWeight: 0.2,
                                        strokeColor: "white",
                                        strokeOpacity: 1,
                                        fillColor: "#EFA44A",
                                        fillOpacity: 1
                                    },
                                    label: d.TSK_BRANCHDESC,
                                    animation: google.maps.Animation.DROP,
                                    position: {
                                        lat: Number(locdata.LOC_LATITUDE),
                                        lng: Number(locdata.LOC_LONGITUDE)
                                    }
                                });
                            }
                        }));
                    }
                }
            });
        }
        var RegisterUIEvents = function () {
            $(".sidebar.right").sidebar({
                side: "right"
            });
            $("#closesiderbar").on("click", function () {
                $(".sidebar.right").trigger("sidebar:close");
            });
            $("#search").off("click").on("click", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
            $("#modalshared").on("hidden.bs.modal", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
            $("input[type=radio][name=plnunit]").on("change", function () {
                selectedplnunit = this.value;
                $(".list-group").list("destroy");
                if (this.value == "T") {
                    ListTrades();
                } else {
                    ListUsers();
                }
            });
            $("#datestart, #dateend").val(tms.Now().format(constants.dateformat));
            $("#filter").on("click", function () {
                var activeTab = tms.ActiveTab("#filteroptions");
                if (activeTab == "list") {
                    filtermode = "LIST";
                    var chkdays = moment.duration(tms.Now2().diff(moment($("#datestart").val(), constants.dateformat))).days();
                    if (chkdays > 30) {
                        msgs.error(applicationstrings[lang].mapstartdayerr);
                        return $.Deferred().reject();
                    }
                    return $.when(maps.GetMapData({
                        Trade: null,
                        Customer: ($("#customer").val() || null),
                        Type: ($("#type").val() || null),
                        Category: ($("#category").val() || null),
                        PeriodicTask: ($("#periodictask").val() || null),
                        DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                        DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                        Rownum: null
                    }, false)).done(function (d) {
                        if (taskmarker) {
                            if (taskcircle)
                                taskcircle.setMap(null);
                            taskmarker = null;
                        }
                        maps.FillListData(d.data);
                        maps.FillMap(d.data);
                        $(".sidebar.right").trigger("sidebar:close");
                    });
                } else if (activeTab == "find") {
                    filtermode = "FIND";
                    var task = $("#task").val();
                    if (!task) {
                        msgs.error(applicationstrings[lang].selectatask);
                        return $.Deferred().reject();
                    }
                    var chkdays = moment.duration(tms.Now2().diff(moment($("#date").val(), constants.dateformat))).days();
                    if (chkdays > 0) {
                        msgs.error(applicationstrings[lang].pastdate);
                        return $.Deferred().reject();
                    }
                    return $.when(maps.GetMapData({
                        Task: task,
                        Date: $("#date").val() ? moment.utc($("#date").val(), constants.dateformat) : null,
                        Distance: ($("#distance").val() || null)
                    }, true)).done(function (d) {
                        var rows = $.grep(d.data, function (i) {
                            return $.inArray(i.ACT_ROWNUM, [0, 1]) !== -1
                        });
                        $("a.list-group-item").find("div.add-info").remove();
                        maps.FillMap(rows);
                        $(".sidebar.right").trigger("sidebar:close");
                    });
                }
            });
            $("#clearfilter").on("click", function () {
                $("#customer").val("");
                $("#task").val("");
                $("#date").val("");
                $("#distance").val("");
                $("#type").val("");
                $("#category").val("");
                $("#periodictask").val("");
                $("#datestart, #dateend").val(tms.Now().format(constants.dateformat));
                tooltip.hide("#customer,#type,#category,#periodictask,#task");
                $("a.list-group-item.active").removeClass("active");
                return $.when(maps.GetMapData({
                    Trade: null,
                    Customer: null,
                    Type: null,
                    Category: null,
                    PeriodicTask: null,
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                })).done(function (d) {
                    maps.FillListData(d.data);
                    maps.FillMap(d.data);
                    $(".sidebar.right").trigger("sidebar:close");
                });
            });

            BuildModals();
            AutoComplete();
        }
        this.BuildUI = function () {
            RegisterUIEvents();
            ListTrades();
        }
    }

    window.initMap = function () {
        maps.InitMap();
    }

    $(document).ready(function () {
        func.BuildUI();
    });
}());