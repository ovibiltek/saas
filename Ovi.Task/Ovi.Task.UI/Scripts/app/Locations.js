(function () {
    var selectedrecord = null;
    var locationcode = null;
    var scr, loc, eqp;
    var map;
    var markersArray = [];
    var center = { lat: 40.98055008615914, lng: 29.102968275547028 };

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        }
    ];
    var maps = new function () {
        var self = this;

        this.CenterMap = function (location) {
            map.setCenter(location);
        };
        this.PlaceMarker = function (location) {
            deleteOverlays();
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            markersArray.push(marker);
        };

        function deleteOverlays() {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }

        window.initMap = function () {
            map = new google.maps.Map(document.getElementById("map"),
                {
                    center: center,
                    zoom: 19
                });

            self.PlaceMarker(center);
            google.maps.event.addListener(map,
                "click",
                function (event) {
                    self.PlaceMarker(event.latLng);
                    document.getElementById("latitude").value = event.latLng.lat();
                    document.getElementById("longitude").value = event.latLng.lng();
                });
        };
        $("#btnaddress").on("click",
            function () {
                var address = $("#address").val();
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': address },
                    function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var l = results[0].geometry.location;
                            self.PlaceMarker(l);
                            map.setCenter(l);
                        } else
                            msgs.error("Map Error : " + status);
                    });
            });
    };
    eqp = new function () {
        var self = this;
        var grdLocationEquipments = null;
        var grdLocationEquipmentsElm = $("#grdLocationEquipments");
        var gridfilter = [];

        function itemSelect(row) {
            grdLocationEquipmentsElm.find("[data-id]").removeClass("k-state-selected");
            row.addClass("k-state-selected");
        }
        var gridDataBound = function () {
            grdLocationEquipmentsElm.find("[data-id]").unbind("click").click(function () {
                itemSelect($(this));
            });
        };
        this.List = function () {
            gridfilter.push({ field: "EQP_LOCATION", value: selectedrecord.LOC_CODE, operator: "eq", logic: "and" });
            if (grdLocationEquipments) {
                grdLocationEquipments.ClearSelection();
                grdLocationEquipments.RunFilter(gridfilter);
            } else {
                grdLocationEquipments = new Grid({
                    keyfield: "EQP_ID",
                    columns: [
                        { type: "number", field: "EQP_ID", title: gridstrings.equipments[lang].eqpid, width: 100 },
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 150 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 350 },
                        { type: "string", field: "EQP_ORG", title: gridstrings.equipments[lang].eqporg, width: 150 },
                        {
                            type: "string",
                            field: "EQP_ORGDESC",
                            title: gridstrings.equipments[lang].eqporgdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_LOCATION",
                            title: gridstrings.equipments[lang].eqplocation,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EQP_LOCATIONDESC",
                            title: gridstrings.equipments[lang].eqplocationdesc,
                            width: 250
                        },
                        { type: "string", field: "EQP_BRANCH", title: gridstrings.equipments[lang].eqpbranch, width: 150 },
                        {
                            type: "string",
                            field: "EQP_BRANCHDESC",
                            title: gridstrings.equipments[lang].eqpbranchdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_CUSTOMER",
                            title: gridstrings.equipments[lang].eqpcustomer,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EQP_CUSTOMERDESC",
                            title: gridstrings.equipments[lang].eqpcustomerdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_REGION",
                            title: gridstrings.equipments[lang].eqpregion,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_DEPARTMENT",
                            title: gridstrings.equipments[lang].eqpdepartment,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EQP_DEPARTMENTDESC",
                            title: gridstrings.equipments[lang].eqpdepartmentdesc,
                            width: 250
                        },
                        { type: "string", field: "EQP_TYPE", title: gridstrings.equipments[lang].eqptype, width: 150 },
                        {
                            type: "string",
                            field: "EQP_TYPEDESC",
                            title: gridstrings.equipments[lang].eqptypedesc,
                            width: 250
                        },
                        { type: "string", field: "EQP_BRAND", title: gridstrings.equipments[lang].brand, width: 150 },
                        {
                            type: "string",
                            field: "EQP_BRANDDESC",
                            title: gridstrings.equipments[lang].branddesc,
                            width: 250
                        },
                        { type: "string", field: "EQP_MODEL", title: gridstrings.equipments[lang].model, width: 250 },
                        { type: "string", field: "EQP_ZONEDESC", title: gridstrings.equipments[lang].zonedesc, width: 250 },
                        { type: "string", field: "EQP_SERIALNO", title: gridstrings.equipments[lang].serialno, width: 150 },
                        {
                            type: "string",
                            field: "EQP_PARENTCODE",
                            title: gridstrings.equipments[lang].eqpparent,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EQP_PARENTDESC",
                            title: gridstrings.equipments[lang].eqpparentdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_GUARANTEESTATUS",
                            title: gridstrings.equipments[lang].guaranteestatus,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "EQP_MANUFACTURINGYEAR",
                            title: gridstrings.equipments[lang].manufacturingyear,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "EQP_INSDATE",
                            title: gridstrings.equipments[lang].insdate,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "EQP_PRICE",
                            title: gridstrings.equipments[lang].price,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_IMPORTANCELEVEL",
                            title: gridstrings.equipments[lang].importancelevel,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_PERIODICMAINTENANCEREQUIRED",
                            title: gridstrings.equipments[lang].periodicmaintenancerequired,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_REFERENCENO",
                            title: gridstrings.equipments[lang].referenceno,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_ACTIVE",
                            title: gridstrings.equipments[lang].active,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "EQP_CREATED",
                            title: gridstrings.equipments[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_CREATEDBY",
                            title: gridstrings.equipments[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "EQP_UPDATED",
                            title: gridstrings.equipments[lang].updated,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_UPDATEDBY",
                            title: gridstrings.equipments[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields: {
                        EQP_CREATED: { type: "date" },
                        EQP_UPDATED: { type: "date" },
                        EQP_MANIFATURINGYEAR: { type: "number" },
                        EQP_PRICE: { type: "number" },
                        EQP_INSDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiEquipments/List",
                    selector: "#grdLocationEquipments",
                    name: "grdLocationEquipments",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "EQP_ID",
                    primarytextfield: "EQP_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "EQP_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Equipments.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound
                });
            }
        };
    };
    loc = new function () {
        var self = this;
        var grdLocations = null;
        var grdLocationsElm = $("#grdLocations");

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMLOCATIONS", operator: "eq" },
                    { field: "AUD_REFID", value: locationcode, operator: "eq" }
                ]
            });
        };
        var BuildModals = function () {
            $("#btnorg").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/ListUserOrganizations",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#org",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: {
                        filter: {
                            filters: [
                                { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                            ]
                        }
                    }
                });
            });
            $("#btnDepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#department",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnParent").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.location[lang].title,
                    listurl: "/Api/ApiLocations/List",
                    keyfield: "LOC_CODE",
                    codefield: "LOC_CODE",
                    textfield: "LOC_DESC",
                    returninput: "#parent",
                    columns: [
                        { type: "string", field: "LOC_CODE", title: gridstrings.location[lang].location, width: 100 },
                        { type: "string", field: "LOC_DESC", title: gridstrings.location[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "LOC_ACTIVE", value: "+", operator: "eq" },
                        { field: "LOC_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        {
                            field:"PARENTLOCATION",
                            value: (selectedrecord ? selectedrecord.LOC_CODE : ""),
                            operator: "func"
                        }
                    ]
                });
            });
            $("#btnbranch").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.branches[lang].title,
                    listurl: "/Api/ApiBranches/List",
                    keyfield: "BRN_CODE",
                    codefield: "BRN_CODE",
                    textfield: "BRN_DESC",
                    returninput: "#branch",
                    columns: [
                        { type: "string", field: "BRN_CODE", title: gridstrings.branches[lang].code, width: 100 },
                        { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 400 },
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                callback: function (data) {
                    $("#department").val("");
                    tooltip.hide("#department");
                }
            });
            $("#department").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [{ field: "DEP_ORG", relfield: "#org", includealls: true }]
            });
            $("#parent").autocomp({
                listurl: "/Api/ApiLocations/List",
                geturl: "/Api/ApiLocations/Get",
                field: "LOC_CODE",
                textfield: "LOC_DESC",
                active: "LOC_ACTIVE",
                beforeFilter: function () {
                    return [
                        { field: "LOC_ORG", relfield: "#org", includeall: true },
                        {
                            field: "PARENTLOCATION",
                            value: (selectedrecord ? selectedrecord.LOC_CODE : ""),
                            operator: "func"
                        }
                    ];
                }
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [{ field: "BRN_ORG", relfield: "#org", includeall: true }]
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                LOC_CODE: $("#code").val().toUpper(),
                LOC_DESC: $("#desc").val(),
                LOC_ORG: $("#org").val(),
                LOC_DEPARTMENT: $("#department").val(),
                LOC_PARENT: ($("#parent").val() || null),
                LOC_BRANCH: ($("#branch").val() || null),
                LOC_LATITUDE: ($("#latitude").val() || null),
                LOC_LONGITUDE: ($("#longitude").val() || null),
                LOC_BARCODE: ($("#barcode").val() || null),
                LOC_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                LOC_CREATED: selectedrecord != null ? selectedrecord.LOC_CREATED : tms.Now(),
                LOC_CREATEDBY: selectedrecord != null ? selectedrecord.LOC_CREATEDBY : user,
                LOC_UPDATED: selectedrecord != null ? tms.Now() : null,
                LOC_UPDATEDBY: selectedrecord != null ? user : null,
                LOC_RECORDVERSION: selectedrecord != null ? selectedrecord.LOC_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiLocations/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                var code = selectedrecord.LOC_CODE;
                if (code != null) {
                    $("#confirm").modal().off("click", "#delete")
                        .one("click", "#delete", function () {
                            return tms.Ajax({
                                url: "/Api/ApiLocations/DelRec",
                                data: JSON.stringify(code),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                }
            }
        };
        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#department").val("");
            $("#branch").val("");
            $("#parent").val("");
            $("#latitude").val("");
            $("#longitude").val("");
            $("#barcode").val("");
            $("#active").prop("checked", true);

            tooltip.hide("#org");
            tooltip.hide("#department");
            tooltip.hide("#parent");
            tooltip.hide("#branch");
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.LOC_CODE);
            $("#desc").val(selectedrecord.LOC_DESC);
            $("#org").val(selectedrecord.LOC_ORG);
            $("#department").val(selectedrecord.LOC_DEPARTMENT);
            $("#branch").val(selectedrecord.LOC_BRANCH);
            $("#parent").val(selectedrecord.LOC_PARENT);
            $("#latitude").val(selectedrecord.LOC_LATITUDE);
            $("#longitude").val(selectedrecord.LOC_LONGITUDE);
            $("#barcode").val(selectedrecord.LOC_BARCODE);
            $("#active").prop("checked", selectedrecord.LOC_ACTIVE === "+");

            if (selectedrecord.LOC_LATITUDE && selectedrecord.LOC_LONGITUDE) {
                var loc = { lat: Number(selectedrecord.LOC_LATITUDE), lng: Number(selectedrecord.LOC_LONGITUDE) };
                maps.PlaceMarker(loc);
                maps.CenterMap(loc);
            }

            tooltip.show("#org", selectedrecord.LOC_ORGDESC);
            tooltip.show("#department", selectedrecord.LOC_DEPARTMENTDESC);
            tooltip.show("#parent", selectedrecord.LOC_PARENTDESC);
            tooltip.show("#branch", selectedrecord.LOC_BRANCHDESC);

            $(".page-header>h6").html(selectedrecord.LOC_CODE + " - " + selectedrecord.LOC_DESC);
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiLocations/Get",
                data: JSON.stringify(locationcode),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdLocations.GetRowDataItem(row);
            locationcode = selectedrecord.LOC_CODE;
            $(".page-header h6").html(selectedrecord.LOC_CODE + " - " + selectedrecord.LOC_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdLocationsElm.find("[data-id]").on("dblclick",
                function () {
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
                });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdLocations) {
                grdLocations.ClearSelection();
                grdLocations.RunFilter(gridfilter);
            } else {
                grdLocations = new Grid({
                    keyfield: "LOC_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "LOC_CODE",
                            title: gridstrings.location[lang].location,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "LOC_DESC",
                            title: gridstrings.location[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "LOC_ORG",
                            title: gridstrings.location[lang].organization,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "LOC_ORGDESC",
                            title: gridstrings.location[lang].organizationdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "LOC_DEPARTMENT",
                            title: gridstrings.location[lang].department,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "LOC_DEPARTMENTDESC",
                            title: gridstrings.location[lang].departmentdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "LOC_BRANCH",
                            title: gridstrings.location[lang].branch,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "LOC_BRANCHDESC",
                            title: gridstrings.location[lang].branchdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "LOC_CUSTOMER",
                            title: gridstrings.location[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "LOC_CUSTOMERDESC",
                            title: gridstrings.location[lang].customerdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "LOC_PARENT",
                            title: gridstrings.location[lang].parent,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "LOC_PARENTDESC",
                            title: gridstrings.location[lang].parentdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "LOC_LATITUDE",
                            title: gridstrings.location[lang].latitude,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "LOC_LONGITUDE",
                            title: gridstrings.location[lang].longitude,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "LOC_BARCODE",
                            title: gridstrings.location[lang].barcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "LOC_ACTIVE",
                            title: gridstrings.location[lang].active,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "LOC_CREATED",
                            title: gridstrings.location[lang].created,
                            width: 150
                        }, {
                            type: "string",
                            field: "LOC_CREATEDBY",
                            title: gridstrings.location[lang].createdby,
                            width: 150
                        }, {
                            type: "datetime",
                            field: "LOC_UPDATED",
                            title: gridstrings.location[lang].updated,
                            width: 150
                        }, {
                            type: "string",
                            field: "LOC_UPDATEDBY",
                            title: gridstrings.location[lang].updatedby,
                            width: 150
                        }
                    ],
                    fields: {
                        LOC_CREATED: { type: "date" },
                        LOC_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/Apilocations/List",
                    selector: "#grdLocations",
                    name: "grdLocations",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "LOC_CODE",
                    primarytextfield: "LOC_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "LOC_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"locations.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        loc.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            loc.ResetUI();
                        else
                            loc.LoadSelected();
                        break;
                    case "#equipments":
                        eqp.List();
                        break;
                }
                scr.Configure();
            });
        };
        var RegisterTabEvents = function () {
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);

            RegisterTabChange();
            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            self.List();
        };
        RegisterTabEvents();
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: "#btnSave",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                loc.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                loc.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                loc.LoadSelected();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                loc.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                loc.HistoryModal();
                                break;
                        }
                    }
                }
            ]);
        };
        this.Configure = function () {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function (e) { return e.name === activeTab; })[0];
            for (var i = 0; i < tab.btns.length; i++) {
                var btni = tab.btns[i];
                if (!btni.selectionrequired)
                    $(btni.id).removeAttr("disabled");
                else {
                    if (selectedrecord) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
    };

    function ready() {
        loc.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());