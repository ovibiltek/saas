(function () {
    var selectedrecord = null;
    var selectedluline = null;
    var descriptions = null;
    var grdWarehouseToWarehouse = null;
    var grdWarehouseToWarehouseElm = $("#grdWarehouseToWarehouse");
    var orgrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#part").val("");
        $("#part").data("id", null);
        $("#quantity").val("");
        $("#uom").val("");
        $("#price").val("");

        tooltip.hide("#part");
        tooltip.hide("#uom");
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMWAREHOUSETOWAREHOUSE", operator: "eq" },
                { field: "AUD_REFID", value: selectedrecord.WTW_ID, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#org").val(selectedrecord.WTW_ORG);
        $("#fromwarehouse").val(selectedrecord.WTW_FROM);
        $("#frombin").val(selectedrecord.WTW_FROMBIN);
        $("#towarehouse").val(selectedrecord.WTW_TO);
        $("#tobin").val(selectedrecord.WTW_TOBIN);
        $("#curr").val(selectedrecord.WTW_CURR);
        $("#part").val(selectedrecord.WTW_PARTCODE);
        $("#part").data("id", selectedrecord.WTW_PART);
        $("#quantity").val(parseFloat(selectedrecord.WTW_QTY).fixed(constants.qtydecimals));
        $("#uom").val(selectedrecord.WTW_UOM);
        $("#price").val(parseFloat(selectedrecord.WTW_UNITPRICE).fixed(constants.pricedecimals));

        tooltip.show("#org", selectedrecord.WTW_ORGDESC);
        tooltip.show("#fromwarehouse", selectedrecord.WTW_FROMDESC);
        tooltip.show("#frombin", selectedrecord.WTW_FROMBINDESC);
        tooltip.show("#towarehouse", selectedrecord.WTW_TODESC);
        tooltip.show("#tobin", selectedrecord.WTW_TOBINDESC);
        tooltip.show("#part", selectedrecord.WTW_PARTDESC);

        $(".page-header>h6").html(selectedrecord.WTW_FROMDESC + " - " + selectedrecord.WTW_TODESC);
    }

    function loadSelected() {
        return tms.Ajax({
            url: "/Api/ApiWarehouseToWarehouse/Get",
            data: JSON.stringify(selectedrecord.WTW_ID),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
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

    function itemSelect(row) {
        selectedrecord = grdWarehouseToWarehouse.GetRowDataItem(row);
        loadSelected();
    }

    function gridDatabound(e) {
        var datalen = grdWarehouseToWarehouse.GetCount();
        $("#btnPerformProcess").prop("disabled", datalen === 0);
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        var gridfilter = [{ field: "WTW_CREATEDBY", value: user, operator: "eq" }];
        if (grdWarehouseToWarehouse) {
            grdWarehouseToWarehouse.ClearSelection();
            grdWarehouseToWarehouse.RunFilter(gridfilter);
        } else {
            grdWarehouseToWarehouse = new Grid({
                keyfield: "WTW_ID",
                columns: [
                    { type: "string", field: "WTW_FROM", title: gridstrings.warehousetowarehouse[lang].from, width: 150 },
                    { type: "string", field: "WTW_FROMDESC", title: gridstrings.warehousetowarehouse[lang].fromdesc, width: 250 },
                    { type: "string", field: "WTW_FROMBIN", title: gridstrings.warehousetowarehouse[lang].frombin, width: 150 },
                    { type: "string", field: "WTW_TO", title: gridstrings.warehousetowarehouse[lang].to, width: 150 },
                    { type: "string", field: "WTW_TODESC", title: gridstrings.warehousetowarehouse[lang].todesc, width: 250 },
                    { type: "string", field: "WTW_TOBIN", title: gridstrings.warehousetowarehouse[lang].tobin, width: 150 },
                    { type: "string", field: "WTW_PARTCODE", title: gridstrings.warehousetowarehouse[lang].part, width: 250 },
                    { type: "string", field: "WTW_PARTDESC", title: gridstrings.warehousetowarehouse[lang].partdesc, width: 350 },
                    { type: "qty", field: "WTW_QTY", title: gridstrings.warehousetowarehouse[lang].qty, width: 250 },
                    { type: "string", field: "WTW_UOM", title: gridstrings.warehousetowarehouse[lang].uom, width: 150 },
                    { type: "price", field: "WTW_UNITPRICE", title: gridstrings.warehousetowarehouse[lang].unitprice, width: 250 },
                    { type: "string", field: "WTW_CURR", title: gridstrings.warehousetowarehouse[lang].curr, width: 250 }

                ],
                datasource: "/Api/ApiWarehouseToWarehouse/List",
                selector: "#grdWarehouseToWarehouse",
                name: "grdWarehouseToWarehouse",
                height: 330,
                primarycodefield: "WTW_ID",
                primarytextfield: "CFD_DESCF",
                filter: gridfilter,
                sort: [{ field: "WTW_ID", dir: "desc" }],
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"warehousetowarehouse.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                    ]
                },
                databound: gridDatabound,
                change: gridChange
            });
        }
    }

    function remove() {
        if (selectedrecord) {
            $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                return tms.Ajax({
                    url: "/Api/ApiWarehouseToWarehouse/DelRec",
                    data: JSON.stringify(selectedrecord.WTW_ID),
                    fn: function (d) {
                        msgs.success(d.data);
                        resetUI();
                        list();
                    }
                });
            });
        }
    }

    function save() {
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = {
            WTW_ID: selectedrecord ? selectedrecord.WTW_ID : 0,
            WTW_ORG: $("#org").val(),
            WTW_FROM: $("#fromwarehouse").val(),
            WTW_FROMBIN: $("#frombin").val(),
            WTW_TO: $("#towarehouse").val(),
            WTW_TOBIN: $("#tobin").val(),
            WTW_PART: $("#part").data("id"),
            WTW_QTY: parseFloat($("#quantity").val()),
            WTW_UOM: $("#uom").val(),
            WTW_UNITPRICE: parseFloat($("#price").val()),
            WTW_CURR: $("#curr").val(),
            WTW_CREATED: selectedrecord != null ? selectedrecord.WTW_CREATED : tms.Now(),
            WTW_CREATEDBY: selectedrecord != null ? selectedrecord.WTW_CREATEDBY : user,
            WTW_UPDATED: selectedrecord != null ? tms.Now() : null,
            WTW_UPDATEDBY: selectedrecord != null ? user : null,
            WTW_RECORDVERSION: selectedrecord != null ? selectedrecord.WTW_RECORDVERSION : 0
        };

        return tms.Ajax({
            url: "/Api/ApiWarehouseToWarehouse/Save",
            data: JSON.stringify(o),
            fn: function (d) {
                msgs.success(d.data);
                resetUI();
                list();
            }
        });
    }

    function performProcess() {
        return tms.Ajax({
            url: "/Api/ApiWarehouseToWarehouse/PerformProcess",
            fn: function (d) {
                msgs.success(d.data);
                resetUI();
                list();
            }
        });
    }

    function buildModals() {
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
                    { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d) {
                        orgrecord = d;
                        $("#curr").val(orgrecord.ORG_CURRENCY);
                    } else {
                        $("#fromwarehouse").val("");
                        $("#frombin").val("");
                        $("#towarehouse").val("");
                        $("#tobin").val("");
                        $("#curr").val("");

                        tooltip.hide("#fromwarehouse");
                        tooltip.hide("#frombin");
                        tooltip.hide("#towarehouse");
                        tooltip.hide("#tobin");
                        tooltip.hide("#curr");
                    }
                }
            });
        });
        $("#btnfromwarehouse").click(function () {
            gridModal.show({
                modaltitle: gridstrings.warehouses[lang].title,
                listurl: "/Api/ApiWarehouses/List",
                keyfield: "WAH_CODE",
                codefield: "WAH_CODE",
                textfield: "WAH_DESC",
                returninput: "#fromwarehouse",
                columns: [
                    { type: "string", field: "WAH_CODE", title: gridstrings.warehouses[lang].code, width: 100 },
                    { type: "string", field: "WAH_DESC", title: gridstrings.warehouses[lang].description, width: 300 }
                ],
                filter: [
                    { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                    { field: "WAH_ORG", value: $("#org").val(), operator: "eq" }
                ]
            });
        });
        $("#btntowarehouse").click(function () {
            gridModal.show({
                modaltitle: gridstrings.warehouses[lang].title,
                listurl: "/Api/ApiWarehouses/List",
                keyfield: "WAH_CODE",
                codefield: "WAH_CODE",
                textfield: "WAH_DESC",
                returninput: "#towarehouse",
                columns: [
                    { type: "string", field: "WAH_CODE", title: gridstrings.warehouses[lang].code, width: 100 },
                    { type: "string", field: "WAH_DESC", title: gridstrings.warehouses[lang].description, width: 300 }
                ],
                filter: [
                    { field: "WAH_ACTIVE", value: "+", operator: "eq" },
                    { field: "WAH_ORG", value: $("#org").val(), operator: "eq" }
                ]
            });
        });
        $("#btnpart").click(function () {
            gridModal.show({
                modaltitle: gridstrings.partstock[lang].title,
                listurl: "/Api/ApiWarehouses/StockByWarehouse",
                keyfield: "STK_PART",
                codefield: "STK_PARTCODE",
                textfield: "STK_PARTDESC",
                returninput: "#part",
                columns: [
                    { type: "string", field: "STK_PARTCODE", title: gridstrings.partstock[lang].parcode, width: 100 },
                    { type: "string", field: "STK_PARTDESC", title: gridstrings.partstock[lang].pardesc, width: 300 },
                    { type: "qty", field: "STK_WHQTY", title: gridstrings.partstock[lang].parqty, width: 100 },
                    { type: "string", field: "STK_PARTUOM", title: gridstrings.partstock[lang].paruom, width: 100 }
                ],
                fields:
                {
                    STK_WHQTY: { type: "number" }
                },
                filter: [
                    { field: "STK_WAREHOUSE", value: $("#fromwarehouse").val(), operator: "eq" },
                    { field: "STK_PARTORG", value: ["*", $("#org").val()], operator: "in" }
                ],
                callback: function (d) {
                    tooltip.hide("#part");
                    $("#part").data("id", (d ? d.STK_PART : null));
                    $("#partdesc").val((d ? d.STK_PARTDESC : ""));
                    $("#uom").val((d ? d.STK_PARTUOM : ""));
                    $("#price").val((d ? d.STK_PARTAVGPRICE : ""));
                    $("#quantity").val("");
                }
            });
        });
        $("#btnfrombin").click(function () {
            gridModal.show({
                modaltitle: gridstrings.bins[lang].title,
                listurl: "/Api/ApiBins/List",
                keyfield: "BIN_CODE",
                codefield: "BIN_CODE",
                textfield: "BIN_DESC",
                returninput: "#frombin",
                columns: [
                    { type: "string", field: "BIN_CODE", title: gridstrings.bins[lang].code, width: 100 },
                    { type: "string", field: "BIN_DESC", title: gridstrings.bins[lang].desc, width: 300 }
                ],
                filter: [
                    { field: "BIN_ACTIVE", value: "+", operator: "eq" },
                    { field: "BIN_WAREHOUSE", value: $("#fromwarehouse").val(), operator: "eq" }
                ]
            });
        });
        $("#btntobin").click(function () {
            gridModal.show({
                modaltitle: gridstrings.bins[lang].title,
                listurl: "/Api/ApiBins/List",
                keyfield: "BIN_CODE",
                codefield: "BIN_CODE",
                textfield: "BIN_DESC",
                returninput: "#tobin",
                columns: [
                    { type: "string", field: "BIN_CODE", title: gridstrings.bins[lang].code, width: 100 },
                    { type: "string", field: "BIN_DESC", title: gridstrings.bins[lang].desc, width: 300 }
                ],
                filter: [
                    { field: "BIN_ACTIVE", value: "+", operator: "eq" },
                    { field: "BIN_WAREHOUSE", value: $("#towarehouse").val(), operator: "eq" }
                ]
            });
        });
    }

    function autoComplete() {
        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF",
            active: "ORG_ACTIVE",
            filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }],
            callback: function (d) {
                if (d) {
                    orgrecord = d;
                    $("#curr").val(orgrecord.ORG_CURRENCY);
                } else {
                    $("#fromwarehouse").val("");
                    $("#frombin").val("");
                    $("#towarehouse").val("");
                    $("#tobin").val("");
                    $("#curr").val("");

                    tooltip.hide("#fromwarehouse");
                    tooltip.hide("#frombin");
                    tooltip.hide("#towarehouse");
                    tooltip.hide("#tobin");
                    tooltip.hide("#curr");
                }
            }
        });
        $("#fromwarehouse").autocomp({
            listurl: "/Api/ApiWarehouses/List",
            geturl: "/Api/ApiWarehouses/Get",
            field: "WAH_CODE",
            textfield: "WAH_DESC",
            filter: [{ field: "WAH_ORG", relfield: "#org", includeall: false }],
            active: "WAH_ACTIVE",
            callback: function (d) {
                if (!d) {
                    $("#frombin").val("");
                    tooltip.hide("#frombin");
                }
            }
        });
        $("#towarehouse").autocomp({
            listurl: "/Api/ApiWarehouses/List",
            geturl: "/Api/ApiWarehouses/Get",
            field: "WAH_CODE",
            textfield: "WAH_DESC",
            filter: [{ field: "WAH_ORG", relfield: "#org", includeall: false }],
            active: "WAH_ACTIVE",
            callback: function (d) {
                if (!d) {
                    $("#tobin").val("");
                    tooltip.hide("#tobin");
                }
            }
        });
        $("#part").autocomp({
            listurl: "/Api/ApiParts/List",
            geturl: "/Api/ApiParts/Get",
            field: "PAR_CODE",
            textfield: "PAR_DESC",
            active: "PAR_ACTIVE",
            filter: [{ field: "PAR_ORG", func: function () { return ["*", $("#org").val()]; }, operator: "in" }],
            callback: function (data) {
                $("#part").data("id", data.PAR_ID);
            }
        });
        $("#frombin").autocomp({
            listurl: "/Api/ApiBins/List",
            geturl: "/Api/ApiBins/Get",
            field: "BIN_CODE",
            textfield: "BIN_DESC",
            active: "BIN_ACTIVE",
            filter: [{ field: "BIN_WAREHOUSE", func: function () { return $("#fromwarehouse").val(); }, operator: "eq" }]
        });
        $("#tobin").autocomp({
            listurl: "/Api/ApiBins/List",
            geturl: "/Api/ApiBins/Get",
            field: "BIN_CODE",
            textfield: "BIN_DESC",
            active: "BIN_ACTIVE",
            filter: [{ field: "BIN_WAREHOUSE", func: function () { return $("#towarehouse").val(); }, operator: "eq" }]
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);
        $("#btnPerformProcess").click(performProcess);
        buildModals();
        autoComplete();
    }

    function buildUI() {
        resetUI();
        bindHotKeys();
        registerUiEvents();
    }

    function ready() {
        buildUI();
        list();
    }

    $(document).ready(ready);
}());