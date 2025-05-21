(function () {
    var selectedrecord = null;
    var map;
    var markersArray = [];
    var center = { lat: 40.98055008615914, lng: 29.102968275547028 };
    var regions = null;
    var tasktypes = null;
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



    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");
        $("#latitude").val("");
        $("#longitude").val("");
        $("#code").val("");
        $("#desc").val("");
        $("#org").val("");
        $("#department").val("");
        $("#pricingcode").val("");
        $("#email").val("");
        $("#warehouse").val("");
        $("#supplier").val("");
        $("#userbasedassignment").prop("checked", false);
        $("#active").prop("checked", true);
        $("#capacity").val("");
        $("#region").tagsinput("removeAll");
        $("#tasktypes").tagsinput("removeAll");
        $("#province").val("");
        $("#district").val("");
        tooltip.hide("#org");
        tooltip.hide("#pricingcode");
        tooltip.hide("#department");
        tooltip.hide("#warehouse");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMTRADES", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.TRD_CODE);
        $("#desc").val(selectedrecord.TRD_DESC);
        $("#org").val(selectedrecord.TRD_ORGANIZATION);
        $("#department").val(selectedrecord.TRD_DEPARTMENT);
        $("#supplier").val(selectedrecord.TRD_SUPPLIER);
        $("#pricingcode").val(selectedrecord.TRD_PRICINGCODE);
        $("#email").val(selectedrecord.TRD_EMAIL);
        $("#warehouse").val(selectedrecord.TRD_WAREHOUSE);
        $("#userbasedassignment").prop("checked", selectedrecord.TRD_USERBASEDASSIGNMENT === "+");
        $("#active").prop("checked", selectedrecord.TRD_ACTIVE === "+");
        $("#latitude").val(selectedrecord.TRD_LATITUDE);
        $("#longitude").val(selectedrecord.TRD_LONGITUDE);
        $("#capacity").val(selectedrecord.TRD_CAPACITY);
        $("#province").val(selectedrecord.TRD_PROVINCE);
        $("#district").val(selectedrecord.TRD_DISTRICT);


        tooltip.show("#province", selectedrecord.TRD_PROVINCEDESC);
        tooltip.show("#district", selectedrecord.TRD_DISTRICTDESC);

        tooltip.show("#org", selectedrecord.TRD_ORGANIZATIONDESC);
        tooltip.show("#pricingcode", selectedrecord.TRD_PRICINGCODEDESC);
        tooltip.show("#supplier", selectedrecord.TRD_SUPPLIERDESC);
        tooltip.show("#warehouse", selectedrecord.TRD_WAREHOUSEDESC);
        tooltip.show("#department", selectedrecord.TRD_DEPARTMENTDESC);

        $("#region").tagsinput("removeAll");
        if (regions && regions.length > 0) {
            for (var i = 0; i < regions.length; i++) {
                var region = regions[i];
                $("#region").tagsinput("add", { id: region.REG_CODE, text: region.REG_DESC }, ["ignore"]);
            }
        }

        $("#tasktypes").tagsinput("removeAll");
        if (tasktypes && tasktypes.length > 0) {
            for (var i = 0; i < tasktypes.length; i++) {
                var tasktype = tasktypes[i];
                $("#tasktypes").tagsinput("add", { id: tasktype.SYC_CODE, text: tasktype.SYC_DESCRIPTION }, ["ignore"]);
            }
        }
        if (selectedrecord.TRD_LATITUDE && selectedrecord.TRD_LONGITUDE) {
            var loc = { lat: Number(selectedrecord.TRD_LATITUDE), lng: Number(selectedrecord.TRD_LONGITUDE) };
            maps.PlaceMarker(loc);
            maps.CenterMap(loc);
        }

        $(".page-header>h6").html(selectedrecord.TRD_CODE + " - " + selectedrecord.TRD_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiTrades/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                regions = d.regions;
                tasktypes = d.tasktypes;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.TRD_CODE;
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiTrades/DelRec",
                        data: JSON.stringify(code),
                        fn: function (d) {
                            msgs.success(d.data);
                            resetUI();
                            $(".list-group").list("refresh");
                        }
                    });
                });
        }
    }

    function save() {
        if (!tms.Check("#record"))
            return;

        var o = JSON.stringify({
            TRD_CODE: $("#code").val().toUpper(),
            TRD_DESC: $("#desc").val(),
            TRD_ORGANIZATION: $("#org").val(),
            TRD_DEPARTMENT: $("#department").val(),
            TRD_SUPPLIER: ($("#supplier").val() || null),
            TRD_PRICINGCODE: ($("#pricingcode").val() || null),
            TRD_WAREHOUSE: ($("#warehouse").val() || null),
            TRD_LATITUDE: ($("#latitude").val() || null),
            TRD_LONGITUDE: ($("#longitude").val() || null),
            TRD_EMAIL: ($("#email").val() || null),
            TRD_USERBASEDASSIGNMENT: $("#userbasedassignment").prop("checked") ? "+" : "-",
            TRD_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            TRD_CREATED: selectedrecord != null ? selectedrecord.TRD_CREATED : tms.Now(),
            TRD_CREATEDBY: selectedrecord != null ? selectedrecord.TRD_CREATEDBY : user,
            TRD_UPDATED: selectedrecord != null ? tms.Now() : null,
            TRD_UPDATEDBY: selectedrecord != null ? user : null,
            TRD_SQLIDENTITY: selectedrecord != null ? selectedrecord.TRD_SQLIDENTITY : 0,
            TRD_RECORDVERSION: selectedrecord != null ? selectedrecord.TRD_RECORDVERSION : 0,
            TRD_CAPACITY: $("#capacity").val(),
            TRD_REGION: ($("#region").val() || null),
            TRD_PROVINCE: ($("#province").val() || null),
            TRD_DISTRICT: ($("#district").val() || null),
            TRD_TASKTYPES: ($("#tasktypes").val() || null),
        });

        return tms.Ajax({
            url: "/Api/ApiTrades/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;          
                $(".list-group").data("id", selectedrecord.TRD_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE",
            callback: function () {
                $("#department").val("");
                tooltip.hide("#department");
            }
        });
        $("#department").autocomp({
            listurl: "/Api/ApiDepartments/List",
            geturl: "/Api/ApiDepartments/Get",
            field: "DEP_CODE",
            textfield: "DEP_DESCF",
            active: "DEP_ACTIVE",
            filter: [
                { field: "DEP_ORG", relfield: "#org", includeall: true }
            ]
        });
        $("#pricingcode").autocomp({
            listurl: "/Api/ApiPricingCodes/List",
            geturl: "/Api/ApiPricingCodes/Get",
            field: "PRC_CODE",
            textfield: "PRC_DESC",
            active: "PRC_ACTIVE",
            filter: [
                { field: "PRC_GROUP", value: "TRADECLASS", operator: "eq" }
            ]
        });
        $("#warehouse").autocomp({
            listurl: "/Api/ApiWarehouses/List",
            geturl: "/Api/ApiWarehouses/Get",
            field: "WAH_CODE",
            textfield: "WAH_DESCF",
            active: "WAH_ACTIVE",
            filter: [
                { field: "WAH_ORG", relfield: "#org", includeall: true, logic: "or" },
                { field: "WAH_PUBLIC", value: "+", operator: "eq", logic: "or" }
            ]
        });
        $("#supplier").autocomp({
            listurl: "/Api/ApiSuppliers/List",
            geturl: "/Api/ApiSuppliers/Get",
            field: "SUP_CODE",
            textfield: "SUP_DESC",
            active: "SUP_ACTIVE"
        });

        $("#province").autocomp({
            listurl: "/Api/ApiAddressSections/List",
            geturl: "/Api/ApiAddressSections/Get",
            field: "ADS_CODE",
            textfield: "ADS_DESC",
            active: "ADS_ACTIVE",
            filter: [
                { field: "ADS_TYPE", value: "IL", operator: "eq" }
            ]
        });
        $("#district").autocomp({
            listurl: "/Api/ApiAddressSections/List",
            geturl: "/Api/ApiAddressSections/Get",
            field: "ADS_CODE",
            textfield: "ADS_DESC",
            active: "ADS_ACTIVE",
            filter: [
                { field: "ADS_TYPE", value: "ILCE", operator: "eq" },
                { field: "ADS_PARENT", func: function () { return $("#province").val() }, operator: "eq" }
            ]
        });

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
                filter: [
                    { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                ],
                callback: function () {
                    $("#department").val("");
                    tooltip.hide("#department");
                }
            });
        });
        $("#btndepartment").click(function () {
            gridModal.show({
                modaltitle: gridstrings.dep[lang].title,
                listurl: "/Api/ApiDepartments/List",
                keyfield: "DEP_CODE",
                codefield: "DEP_CODE",
                textfield: "DEP_DESCF",
                returninput: "#department",
                columns: [
                    { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                    { type: "string", field: "DEP_DESCF", title: gridstrings.dep[lang].description, width: 400 }
                ],
                filter: [
                    { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                    { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                ]
            });
        });
        $("#btnpricingcode").click(function () {
            gridModal.show({
                modaltitle: gridstrings.pricingcodes[lang].title,
                listurl: "/Api/ApiPricingCodes/List",
                keyfield: "PRC_CODE",
                codefield: "PRC_CODE",
                textfield: "PRC_DESC",
                returninput: "#pricingcode",
                columns: [
                    { type: "string", field: "PRC_CODE", title: gridstrings.pricingcodes[lang].code, width: 100 },
                    { type: "string", field: "PRC_DESC", title: gridstrings.pricingcodes[lang].description, width: 300 }
                ],
                filter: [
                    { field: "PRC_ACTIVE", value: "+", operator: "eq" },
                    { field: "PRC_GROUP", value: "TRADECLASS", operator: "eq" }
                ]
            });
        });
        $("#btnwarehouse").click(function () {
            gridModal.show({
                modaltitle: gridstrings.warehouses[lang].title,
                listurl: "/Api/ApiWarehouses/List",
                keyfield: "WAH_CODE",
                codefield: "WAH_CODE",
                textfield: "WAH_DESCF",
                returninput: "#warehouse",
                columns: [
                    { type: "string", field: "WAH_CODE", title: gridstrings.warehouses[lang].code, width: 100 },
                    { type: "string", field: "WAH_DESCF", title: gridstrings.warehouses[lang].description, width: 400 }
                ],
                filter: [
                    { field: "WAH_ACTIVE", value: "+", operator: "eq", logic: "and" },
                    { field: "WAH_ORG", value: [$("#org").val(), "*"], operator: "in", logic: "or" },
                    { field: "WAH_PUBLIC", value: "+", operator: "eq", logic: "or" }
                ]
            });
        });
        $("#btnsupplier").click(function () {
            gridModal.show({
                modaltitle: gridstrings.suppliers[lang].title,
                listurl: "/Api/ApiSuppliers/List",
                keyfield: "SUP_CODE",
                codefield: "SUP_CODE",
                textfield: "SUP_DESC",
                returninput: "#supplier",
                columns: [
                    { type: "string", field: "SUP_CODE", title: gridstrings.suppliers[lang].code, width: 100 },
                    { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SUP_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });

        $("#btnaddregions").click(function () {
            gridModal.show({
                modaltitle: gridstrings.regions[lang].title,
                listurl: "/Api/ApiRegions/List",
                keyfield: "REG_CODE",
                codefield: "REG_CODE",
                textfield: "REG_DESC",
                returninput: "#region",
                multiselect: true,
                columns: [
                    { type: "string", field: "REG_CODE", title: gridstrings.regions[lang].code, width: 100 },
                    { type: "string", field: "REG_DESC", title: gridstrings.regions[lang].description, width: 400 }
                ],
                filter: [
                    { field: "REG_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });
        $("#btnaddtasktypes").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#tasktypes",
                multiselect: true,
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
                ]
            });

           
        });
        $("#btnprovince").click(function () {
            gridModal.show({
                modaltitle: gridstrings.addresssection[lang].title,
                listurl: "/Api/ApiAddressSections/List",
                keyfield: "ADS_CODE",
                codefield: "ADS_CODE",
                textfield: "ADS_DESC",
                returninput: "#province",
                columns: [
                    { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                    {
                        type: "string",
                        field: "ADS_DESC",
                        title: gridstrings.addresssection[lang].description,
                        width: 300
                    }
                ],
                filter: [
                    { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                    { field: "ADS_TYPE", value: "IL", operator: "eq" }
                ]
            });
        });
        $("#btndistrict").click(function () {
            gridModal.show({
                modaltitle: gridstrings.addresssection[lang].title,
                listurl: "/Api/ApiAddressSections/List",
                keyfield: "ADS_CODE",
                codefield: "ADS_CODE",
                textfield: "ADS_DESC",
                returninput: "#district",
                columns: [
                    { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                    {
                        type: "string",
                        field: "ADS_DESC",
                        title: gridstrings.addresssection[lang].description,
                        width: 300
                    }
                ],
                filter: [
                    { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                    { field: "ADS_TYPE", value: "ILCE", operator: "eq" },
                    { field: "ADS_PARENT", value: $("#province").val(), operator: "eq" }
                ]
            });
        });
    }

    function bindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    save();
                }
            },
            {
                k: "ctrl+r",
                e: "#btnNew",
                f: function () {
                    resetUI();
                }
            },
            {
                k: "ctrl+u",
                e: "#btnUndo",
                f: function () {
                    loadSelected();
                }
            },
            {
                k: "ctrl+d",
                e: "#btnDelete",
                f: function () {
                    remove();
                }
            },
            {
                k: "ctrl+h",
                e: "#btnHistory",
                f: function () {
                    historyModal();
                }
            },
            {
                k: "ctrl+q",
                e: "#btnTranslations",
                f: function () {
                    translationModal();
                }
            }
        ]);
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiTrades/List",
            fields: {
                keyfield: "TRD_CODE",
                descfield: "TRD_DESC"
            },
            sort: [{ field: "TRD_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        List();
        registerUiEvents();
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());