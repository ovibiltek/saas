(function () {
    var selectedrecord = null;
    var selectedlinerecord = null;
    var grdWarehouseTransfers = null;
    var grdWarehouseTransfersElm = $("#grdWarehouseTransfers");
    var orgrecord = null;
    var selectedstatus;
    var scr, wht, prt;
    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
               
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
               
            ]
        },
        {
            name: "divpart",
            btns: []
        }


    ];
  
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
                    wht.LoadSelected();
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
  

    prt = new function () {
        var grdWarehouseTransferLines = null;
        var partuom = null;
        var grdStock = null;
        var grdWarehouseTransferLinesElm = $("#grdWarehouseTransferLines");
        var self = this;
        var itemSelect = function (row) {
            selectedlinerecord = grdWarehouseTransferLines.GetRowDataItem(row);
            warehousetransferlineid = selectedlinerecord.WTL_ID;
          
            FillUserInterface();
           
        };
        var BuildModals = function () {
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
                        { field: "STK_WAREHOUSE", value: selectedrecord.WTR_FROM, operator: "eq" },
                        { field: "STK_PARTORG", value: ["*", selectedrecord.WTR_ORG], operator: "in" }
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
        };
        var AutoComplete = function () {
       
            $("#part").autocomp({
                listurl: "/Api/ApiParts/List",
                geturl: "/Api/ApiParts/Get",
                field: "PAR_CODE",
                textfield: "PAR_DESC",
                active: "PAR_ACTIVE",
                filter: [{ field: "PAR_ORG", func: function () { return ["*", selectedrecord.WTR_ORG]; }, operator: "in" }],
                callback: function (data) {
                    $("#part").data("id", data.PAR_ID);
                }
            });
        };
        var GridDataBound = function () {
           
        };
        var GridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var List = function () {
            var gridfilter = [{ field: "WTL_WTRID", value: selectedrecord.WTR_ID, operator: "eq", logic: "and" }];
            if (grdWarehouseTransferLines) {
                grdWarehouseTransferLines.ClearSelection();
                grdWarehouseTransferLines.RunFilter(gridfilter);
            } else {
                grdWarehouseTransferLines = new Grid({
                    keyfield: "WTL_LINE",
                    columns: [
                        {
                            type: "number",
                            field: "WTL_ID",
                            title: gridstrings.warehousetransferlines[lang].wtrline,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "WTL_WTRID",
                            title: gridstrings.warehousetransferlines[lang].wtrcode,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "WTL_LINE",
                            title: gridstrings.warehousetransferlines[lang].line,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "WTL_PART",
                            title: gridstrings.warehousetransferlines[lang].part,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "WTL_UOM",
                            title: gridstrings.warehousetransferlines[lang].uom,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "WTL_QTY",
                            title: gridstrings.warehousetransferlines[lang].qty,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "WTL_UNITPRICE", 
                            title: gridstrings.warehousetransferlines[lang].price,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "WTL_CREATED",
                            title: gridstrings.warehousetransferlines[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "WTL_CREATEDBY",
                            title: gridstrings.warehousetransferlines[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "WTL_UPDATED",
                            title: gridstrings.warehousetransferlines[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "WTL_UPDATEDBY",
                            title: gridstrings.warehousetransferlines[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        WTL_ID: { type: "number" },
                        WTL_LINE: { type: "number" },
                        WTL_QTY: { type: "number" },
                        WTL_UNITPRICE: { type: "number" },
                        WTL_WTRID: { type: "number" },
                        WTL_CREATED: { type: "date" },
                        WTL_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiWarehouseTransferLines/List",
                    selector: "#grdWarehouseTransferLines",
                    name: "grdWarehouseTransferLines",
                    height: 250,
                    primarycodefield: "WTL_WTRID",
                    primarytextfield: "WTL_LINE",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "WTL_LINE", dir: "asc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"warehousetransfers.xlsx\" class=\"btn btn-default btn-sm\" id=\"exwhtt\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#divpart"))
                return $.Deferred().reject();

            var wtl = JSON.stringify({
                WTL_LINE: selectedlinerecord != null ? selectedlinerecord.WTL_LINE : null,
                WTL_WTRID: selectedrecord.WTR_ID,
                WTL_PART: $("#part").data("id"),
                WTL_QTY: $("#quantity").val(),
                WTL_UOM: $("#uom").val(),
                WTL_UNITPRICE: $("#price").val(),
                WTL_CREATED: selectedlinerecord != null ? selectedlinerecord.WTL_CREATED : tms.Now(),
                WTL_CREATEDBY: selectedlinerecord != null ? selectedlinerecord.WTL_CREATEDBY : user,
                WTL_UPDATED: selectedlinerecord != null ? tms.Now() : null,
                WTL_UPDATEDBY: selectedlinerecord != null ? user : null
               
            });

            return tms.Ajax({
                url: "/Api/ApiWarehouseTransferLines/Save",
                contentType: "application/json",
                data: wtl,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    List();
                }
            });
        };
        this.Remove = function () {
            if (warehousetransferlineid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiWarehouseTransferLines/DelRec",
                            data: JSON.stringify(selectedlinerecord.WTL_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                List();
                            }
                        });
                    });
            }
        };
        var FillUserInterface = function () {
            tms.UnBlock("#partform");
            tms.BeforeFill("#divpart");

            $("#warehousetransferlineno").val(selectedlinerecord.WTL_LINE);
            $("#part").val(selectedlinerecord.WTL_PART);
            $("#part").prop("disabled", true);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
           
            $("#quantity").val(selectedlinerecord.WTL_QTY);
          
            $("#uom").val(selectedlinerecord.WTL_UOM);
           
         
            $("#price").val(selectedlinerecord.WTL_UNITPRICE);
         
            $("#btnDeletePart").prop("disabled", false);

            
        };
        var RegisterTabEvents = function () {
            $("#btnSavePart").click(self.Save);
            $("#btnAddPart").click(self.ResetUI);
            $("#btnDeletePart").click(self.Remove);
        };
        var RegisterUIEvents = function () {
            RegisterTabEvents();
            BuildModals();
            AutoComplete();
        };
        this.ResetUI = function () {
            tms.Reset("#divpart");
            $("#btnstock").prop("disabled", true);
            selectedlinerecord = null;
            warehousetransferlineid = null;
            $("#warehousetransferlineno").val("");
            $("#part").val("");
            $("#quantity").val("");
            $("#uom").val("");    
            $("#price").val("");
            $("#btnDeletePart").prop("disabled", true);
            
        };
        this.Ready = function () {
            List();
            self.ResetUI();
        };
        RegisterUIEvents();
    };
    wht = new function () {
        let self = this;
        this.ResetUI = function () {
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
        var fillUserInterface = function () {
            tms.BeforeFill("#record");
            tms.Tab();
            $("#description").val(selectedrecord.WTR_DESCRIPTION);
            $("#org").val(selectedrecord.WTR_ORG);
            $("#fromwarehouse").val(selectedrecord.WTR_FROM);
            $("#frombin").val(selectedrecord.WTR_FROMBIN);
           
            $("#type").val(selectedrecord.WTR_TYPE);
            $("#towarehouse").val(selectedrecord.WTR_TO);
            $("#tobin").val(selectedrecord.WTR_TOBIN);
            $("#curr").val(selectedrecord.WTR_CURR);
            $("#createdby").val(selectedrecord.WTR_CREATEDBY);
            $("#requestedby").val(selectedrecord.WTR_REQUESTEDBY);
            LoadStatuses({
                pcode: selectedstatus.STA_PCODE,
                code: selectedstatus.STA_CODE,
                text: selectedstatus.STA_DESCF
            });
            $("#status").val(selectedrecord.WTR_STATUS);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            tooltip.show("#org", selectedrecord.WTR_ORGDESC);
            tooltip.show("#fromwarehouse", selectedrecord.WTR_FROMDESC);
            tooltip.show("#frombin", selectedrecord.WTR_FROMBINDESC);
            tooltip.show("#towarehouse", selectedrecord.WTR_TODESC);
            tooltip.show("#tobin", selectedrecord.WTR_TOBINDESC);
           
            $(".page-header>h6").html(selectedrecord.WTR_FROMDESC + " - " + selectedrecord.WTR_TODESC);
        }
        this.LoadSelected = function (dataonly) {
            return tms.Ajax({
                url: "/Api/ApiWarehouseTransfers/Get",
                data: JSON.stringify(selectedrecord.WTR_ID),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    if (!dataonly) {
                        fillUserInterface();
                    }
                   
                }
            });
        }
        var itemSelect = function (row) {
            selectedrecord = grdWarehouseTransfers.GetRowDataItem(row);
           
            scr.Configure();
            tms.Tab();
        }
        var AutoComplete = function () {
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
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_ENTITY", value: "WAREHOUSETRANSFER", operator: "eq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d) {
                        LoadStatuses({
                            code: $("#status").data("code"),
                            pcode: $("#status").data("pcode"),
                            text: $("#status").data("text")
                        });
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
        var gridDatabound = function (e) {
            grdWarehouseTransfersElm.find("[data-id]").on("dblclick",
                function () {
                        $(".nav-tabs a[href=\"#record\"]").tab("show");
                });
         
        }
        var gridChange = function(e) {
            itemSelect(e.sender.select());
        }
        this.List = function () {
            var gridfilter = null;
            if (grdWarehouseTransfers) {
                grdWarehouseTransfers.ClearSelection();
                grdWarehouseTransfers.RunFilter(gridfilter);
            } else {
                grdWarehouseTransfers = new Grid({
                    keyfield: "WTR_ID",
                    columns: [
                        { type: "string", field: "WTR_ID", title: gridstrings.warehousetowarehouse[lang].wthcode, width: 150 },
                        { type: "string", field: "WTR_ORG", title: gridstrings.warehousetowarehouse[lang].org, width: 150 },
                        { type: "string", field: "WTR_REQUESTEDBY", title: gridstrings.warehousetowarehouse[lang].requestedby, width: 150 },
                        { type: "string", field: "WTR_STATUS", title: gridstrings.warehousetowarehouse[lang].status, width: 150 },
                        { type: "string", field: "WTR_STATUSDESC", title: gridstrings.warehousetowarehouse[lang].statusdesc, width: 150 },
                        { type: "string", field: "WTR_FROM", title: gridstrings.warehousetowarehouse[lang].from, width: 150 },
                        { type: "string", field: "WTR_FROMDESC", title: gridstrings.warehousetowarehouse[lang].fromdesc, width: 250 },
                        { type: "string", field: "WTR_FROMBIN", title: gridstrings.warehousetowarehouse[lang].frombin, width: 150 },
                        { type: "string", field: "WTR_TO", title: gridstrings.warehousetowarehouse[lang].to, width: 150 },
                        { type: "string", field: "WTR_TODESC", title: gridstrings.warehousetowarehouse[lang].todesc, width: 250 },
                        { type: "string", field: "WTR_TOBIN", title: gridstrings.warehousetowarehouse[lang].tobin, width: 150 },
                        { type: "string", field: "WTR_CURR", title: gridstrings.warehousetowarehouse[lang].curr, width: 250 }
                    ],
                    datasource: "/Api/ApiWarehouseTransfers/List",
                    selector: "#grdWarehouseTransfers",
                    name: "grdWarehouseTransfers",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "WTR_ID",
                    primarytextfield: "WTR_ID",
                    filter: gridfilter,
                    sort: [{ field: "WTR_ID", dir: "desc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"warehousetowarehouse.xlsx\" class=\"btn btn-default btn-sm\" id=\"exwhtt\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDatabound,
                    change: gridChange
                });
            }
        }
        this.ResetUI = function() {
            selectedrecord = null;
            tms.Reset("#record");
            $("#description").val("");
            $("#org").val("");
            $("#createdby").val(user);
            $("#requestedby").val(user);
            $("#fromwarehouse").val("");
            $("#frombin").val("");
            $("#towarehouse").val("");
            $("#tobin").val("");
            $("#status").val("");
            $("#type").val("");
            $("#curr").val("");
            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            LoadStatuses({
                code: $("#status").data("code"),
                pcode: $("#status").data("pcode"),
                text: $("#status").data("text")
            });
            tooltip.hide("#part");
            tooltip.hide("#uom");
        }
        this.Remove = function() {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiWarehouseTransfers/DelRec",
                        data: JSON.stringify(selectedrecord.WTR_ID),
                        fn: function (d) {
                            msgs.success(d.data);
                            self.ResetUI();
                            self.List();
                        }
                    });
                });
            }
        }
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();
            
            var o = {
                WTR_ID: selectedrecord ? selectedrecord.WTR_ID : 0,
                WTR_DESCRIPTION: $("#description").val(),
                WTR_ORG: $("#org").val(),
                WTR_FROM: $("#fromwarehouse").val(),
                WTR_FROMBIN: $("#frombin").val(),
                WTR_TO: $("#towarehouse").val(),
                WTR_TOBIN: $("#tobin").val(),
                WTR_CURR: $("#curr").val(),
                WTR_STATUSENTITY: "WAREHOUSETRANSFER",
                WTR_TYPEENTITY: "WAREHOUSETRANSFER",
                WTR_STATUS: $("#status").val(),
                WTR_TYPE: $("#type").val(),
                WTR_REQUESTEDBY: $("#requestedby").val(),
                WTR_CREATED: selectedrecord != null ? selectedrecord.WTR_CREATED : tms.Now(),
                WTR_CREATEDBY: selectedrecord != null ? selectedrecord.WTR_CREATEDBY : user,
                WTR_UPDATED: selectedrecord != null ? tms.Now() : null,
                WTR_UPDATEDBY: selectedrecord != null ? user : null,
                WTR_RECORDVERSION: selectedrecord != null ? selectedrecord.WTR_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiWarehouseTransfers/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                   
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    selectedstatus = d.stat;
                    fillUserInterface();
                    self.List();
                }
            });
        }
        var RegisterUIEvents = function () {

            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Remove);
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnUndo").click(self.LoadSelected);
        }
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                    if (($.inArray(activatedTab, ["#list", "#record", "#divpart"]) === -1)) {
                        deferreds.push(wht.LoadSelected(true));
                    }
                    $.when.apply($, deferreds).done(function () {
                        switch (activatedTab) {
                            case "#list":
                                self.ResetUI();
                                self.List();
                                break;
                            case "#record":
                                $("#btnSave").prop("disabled", false);
                                if (!selectedrecord)
                                    self.ResetUI();
                                else
                                    self.LoadSelected();
                                break;
                            case "#divpart":
                                prt.Ready();
                                break;
                        }
                        scr.Configure();
                    });
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
            $("#btntype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#type",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        {
                            type: "string",
                            field: "TYP_DESCF",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: "WAREHOUSETRANSFER", operator: "eq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "TYP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        LoadStatuses({
                            code: $("#status").data("code"),
                            pcode: $("#status").data("pcode"),
                            text: $("#status").data("text")
                        });
                       
                    }
                });
            });
        }
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "WAREHOUSETRANSFER",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    MDepartment: department,
                    TDepartment: department,
                    RequestedBy: $("#requestedby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-code=\"" +
                            status.code +
                            "\" data-pcode=\"" +
                            status.pcode +
                            "\" value=\"" +
                            status.code +
                            "\">" +
                            status.text +
                            "</option>";
                    if (d.data.length === 0) {
                        statusctrl.removeClass("required").prop("disabled", true);
                    } else {
                        for (var i = 0; i < d.data.length; i++) {
                            var di = d.data[i];
                            strOption += "<option data-code=\"" +
                                di.SAU_TO +
                                "\" data-pcode=\"" +
                                di.SAU_PTO +
                                "\" value=\"" +
                                di.SAU_TO +
                                "\">" +
                                di.SAU_TODESC +
                                "</option>";
                        }
                        statusctrl.addClass("required").prop("disabled", false).removeAttr("frozen");
                    }
                    statusctrl.append(strOption);
                }
            });
        };
        this.BuildUi = function () {
         //   RegisterTabEvents();
            RegisterUIEvents();
            RegisterTabChange();
            BuildModals();
            AutoComplete();
            self.ResetUI();
            self.List();
        }
    }
    scr = new function () {
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
        wht.BuildUi();
    }
    $(document).ready(ready);
}());