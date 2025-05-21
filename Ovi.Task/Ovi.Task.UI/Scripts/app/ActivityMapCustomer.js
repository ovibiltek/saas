(function () {
    var map;
    var oms;
    var markersArray = [];
    var center = { lat: 40.98055008615914, lng: 29.102968275547028 };
    var docheight = shared.documentHeight();
    var selectedplnunit;

    var maps = new function () {
        var self = this;
        var DeleteOverlays = function () {
            for (var i = 0; i < markersArray.length; i++) {
                oms.removeMarker(markersArray[i]);
            }
            markersArray.length = 0;
        };
        this.CenterMap = function (location) {
            map.setCenter(location);
        };
        this.PlaceMarker = function (location, data) {
            var contentString = "<div style=\"width:350px;\" id=\"content\">" +
                "<div id=\"activityinfo\">" +
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

            var markerfillcolor = (data.ACT_DURSTART && !data.ACT_DUREND)
                ? "#398439"
                : ((data.ACT_DURSTART && data.ACT_DUREND) ? "#d43f3a" : "#269abc");

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
                label: data.ACT_BRNDESC,
                animation: google.maps.Animation.DROP,
                position: location
            });

            var infowindow = new google.maps.InfoWindow({ content: contentString });
            google.maps.event.addListener(marker, "spider_click", function (e) { infowindow.open(map, marker); });
            oms.addMarker(marker);
            markersArray.push(marker);
        };
        this.FillMap = function (d) {
            var continuing = $.grep(d, function (e) { return (!e.ACT_DUREND && e.ACT_DURSTART); });
            var planned = $.grep(d, function (e) { return (!e.ACT_DUREND && !e.ACT_DURSTART); });
            var completed = $.grep(d, function (e) { return (e.ACT_DUREND && e.ACT_DURSTART); });

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
            DeleteOverlays();
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var lat = Number(di.ACT_DURENDLAT || di.ACT_DURSTARTLAT || di.ACT_LOCLATITUDE);
                var lng = Number(di.ACT_DURENDLNG || di.ACT_DURSTARTLNG || di.ACT_LOCLONGITUDE);
                self.PlaceMarker({ lat: lat, lng: lng }, di);
            }
        };
        this.GetMapData = function (d) {
            return tms.Ajax({
                url: "/Api/ApiTaskActivityDurationsMap/List",
                data: JSON.stringify(d)
            });
        };
        this.InitMap = function () {
            $("#map").css("height", docheight - 150);
            map = new google.maps.Map(document.getElementById("map"), { center: center, zoom: 6 });
            oms = new OverlappingMarkerSpiderfier(map,
                {
                    markersWontMove: true,
                    markersWontHide: true,
                    basicFormatEvents: true
                });
            google.maps.event.addListenerOnce(map, "idle", function () {
                $.when(self.GetMapData({
                    Trade: null,
                    Customer: customer,
                    Type: null,
                    Category: null,
                    PeriodicTask: null,
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                })).done(function (d) {
                    self.FillMap(d.data);
                });
            });
        };
    };

    var func = new function () {
        var BuildModals = function () {
            $("#btncategory").click(function () {
                $(".sidebar.right").trigger("sidebar:close");
                gridModal.show({
                    modaltitle: gridstrings.category[lang].title,
                    listurl: "/Api/ApiCategories/List",
                    keyfield: "CAT_CODE",
                    codefield: "CAT_CODE",
                    textfield: "CAT_DESCF",
                    returninput: "#category",
                    columns: [
                        { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                        { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                    ],
                    filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }]
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
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                        { field: "TYP_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
        }
        var AutoComplete = function () {
            $("#category").autocomp({
                listurl: "/Api/ApiCategories/List",
                geturl: "/Api/ApiCategories/Get",
                field: "CAT_CODE",
                textfield: "CAT_DESCF",
                filter: [{ field: "CAT_ACTIVE", value: "+", operator: "eq" }]
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/ListByDepartment",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESCF",
                filter: [
                    { field: "TYP_ENTITY", value: "TASK", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" }
                ]
            });
        }
        var RegisterUIEvents = function () {
            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
            $("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });
            $("#modalshared").on("hidden.bs.modal", function () {
                $(".sidebar.right").trigger("sidebar:open");
            });
            $("#datestart, #dateend").val(tms.Now().format(constants.dateformat));
            $("#filter").on("click", function () {
                var chkdays = moment.duration(tms.Now2().diff(moment($("#datestart").val(), constants.dateformat))).days();
                if (chkdays > 5) {
                    msgs.error(applicationstrings[lang].mapstartdayerr);
                    return $.Deferred().reject();
                }

                return $.when(maps.GetMapData({
                    Trade: null,
                    Customer: customer,
                    Type: ($("#type").val() || null),
                    Category: ($("#category").val() || null),
                    PeriodicTask: ($("#periodictask").val() || null),
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                })).done(function (d) {
                    maps.FillMap(d.data);
                    $(".sidebar.right").trigger("sidebar:close");
                });
            });
            $("#clearfilter").on("click", function () {
                $("#type").val("");
                $("#category").val("");
                $("#periodictask").val("");
                $("#datestart, #dateend").val(tms.Now().format(constants.dateformat));
                tooltip.hide("#type,#category,#periodictask");
                $("a.list-group-item.active").removeClass("active");
                return $.when(maps.GetMapData({
                    Trade: null,
                    Customer: customer,
                    Type: null,
                    Category: null,
                    PeriodicTask: null,
                    DateStart: $("#datestart").val() ? moment.utc($("#datestart").val(), constants.dateformat) : null,
                    DateEnd: $("#dateend").val() ? moment.utc($("#dateend").val(), constants.dateformat) : null,
                    Rownum: null
                })).done(function (d) {
                    maps.FillMap(d.data);
                    $(".sidebar.right").trigger("sidebar:close");
                });
            });

            BuildModals();
            AutoComplete();
        }
        this.BuildUI = function () {
            RegisterUIEvents();
        }
    }

    window.initMap = function () {
        maps.InitMap();
    }

    $(document).ready(function () {
        func.BuildUI();
    });
}());