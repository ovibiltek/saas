(function () {
    var potw;

    potw = new function() {
        var self = this;
        var grdPurchaseOrderLines = null;
        var checkedlines = null;
        var warehouse = null;
        var org = null;
        var organizationcurr = null;

        var grdPurchaseOrderListElm = $("#grdPurchaseOrderLines");
        var GetOrgCur = function () {
            return tms.Ajax({
                url: "/Api/ApiOrgs/Get",
                data: JSON.stringify(org),
                fn: function (d) {
                    organizationcurr = d.data.ORG_CURRENCY;
                }
            });
        };
        var ResetModal = function() {
            $("#allwaybill").val("");
            $("#purchasedPartQuantity").val("");
            $("#waitingforEntryQuan").val("");
            $("#amounttobePurchase").val("");
            $("#waybill").val("");
        };
        function GridDataBound(e) {
            grdPurchaseOrderListElm.find("#btnSaveLines").off("click").on("click", function () {
                checkedlines = grdPurchaseOrderListElm.find("input[data-name=\"chkLine\"]:checked");
                if (checkedlines.length === 0) {
                    msgs.error(applicationstrings[lang].potowarehousenotselected);
                    return $.Deferred().reject();
                }
                for (var i = 1; i < checkedlines.length; i++) {
                    if ($(checkedlines[i]).data("warehouse") !== $(checkedlines[i - 1]).data("warehouse")) {
                        msgs.error(applicationstrings[lang].warehousescannotbedifferent);
                        return $.Deferred().reject();
                    }
                    if ($(checkedlines[i]).data("org") !== $(checkedlines[i - 1]).data("org")) {
                        msgs.error(applicationstrings[lang].orgsscannotbedifferent);
                        return $.Deferred().reject();
                    }
                    if ($(checkedlines[i]).data("por") !== $(checkedlines[i - 1]).data("por")) {
                        msgs.error(applicationstrings[lang].purchaseorderscannotbediff);
                        return $.Deferred().reject();
                    }
                }
                warehouse = $(checkedlines[0]).data("warehouse");
                org = $(checkedlines[0]).data("org");
                $.when(GetOrgCur()).done(function () {
                    ResetModal();

                    if (checkedlines.length > 1) {
                        $("#modaladdalltowarehouse").modal("show");
                    }
                    else if (checkedlines.length === 1) {
                        $("#modaladdtowarehouse").modal("show");
                        $("#purchasedPartQuantityuom").val($(checkedlines[0]).data("partuom"));
                        $("#waitingforEntryQuanuom").val($(checkedlines[0]).data("partuom"));
                        $("#amounttobePurchaseuom").val($(checkedlines[0]).data("partuom"));
                        $("#purchasedPartQuantity").val($(checkedlines[0]).data("partquan"));
                        $("#waitingforEntryQuan").val($(checkedlines[0]).data("remaining"));
                    }
                });
            });
        }
        function gridChange(e) {
            itemSelect(e.sender.select());
        };

        var SaveSingle = function() {
            if (!tms.Check("#modaladdtowarehouse"))
                return $.Deferred().reject();

            var linearr = [];
            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);

                var obj = {
                    PTW_PORID: line.data("por"),
                    PTW_LINE: line.data("line"),
                    PTW_PART: line.data("part"),
                    PTW_REMAINING: $("#amounttobePurchase").val(),
                    PTW_EXCH: line.data("exch"),
                    PTW_UOMMULTI: line.data("uommulti"),
                    PTW_UNITPRICE: line.data("unitprice"),
                    PTW_WAREHOUSE: line.data("warehouse"),
                    PTW_WAYBILL: $("#waybill").val()
                }
                linearr.push(obj);
            }

            var o = JSON.stringify(
                {
                    ORG: org,
                    WAREHOUSE: warehouse,
                    POTOWAREHOUSEPARAMS: linearr
                });


            return tms.Ajax({
                url: "/Api/ApiPurchaseOrders/PurchaseOrderToWarehouse",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    $("#modaladdalltowarehouse").modal("hide");
                    ResetModal();
                    self.List();
                }
            });
        };
        var SaveAll = function() {
            if (!tms.Check("#modaladdalltowarehouse"))
                return $.Deferred().reject();

            var linearr = [];
            for (var i = 0; i < checkedlines.length; i++) {
                var line = $(checkedlines[i]);

                var obj = {
                    PTW_PORID: line.data("por"),
                    PTW_LINE: line.data("line"),
                    PTW_PART: line.data("part"),
                    PTW_REMAINING: line.data("remaining"),
                    PTW_EXCH: line.data("exch"),
                    PTW_UOMMULTI: line.data("uommulti"),
                    PTW_UNITPRICE: line.data("unitprice"),
                    PTW_WAREHOUSE: line.data("warehouse"),
                    PTW_WAYBILL: $("#allwaybill").val()
                }
                linearr.push(obj);
            }

            var o = JSON.stringify(
                {
                    ORG: org,
                    WAREHOUSE: warehouse,
                    POTOWAREHOUSEPARAMS: linearr
                });


            return tms.Ajax({
                url: "/Api/ApiPurchaseOrders/PurchaseOrderToWarehouse",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    $("#modaladdalltowarehouse").modal("hide");
                    ResetModal();
                    self.List();
                }
            });
        };
        this.List = function () {
            var grdFilter = [{ field: "POL_WAITINGQUANTITY", value: 0, operator: "gt", logic: "and" }];
            if (inbox) {
                grdFilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdPurchaseOrderLines) {
                grdPurchaseOrderLines.ClearSelection();
                grdPurchaseOrderLines.RunFilter(grdFilter);
            } else {
                grdPurchaseOrderLines = new Grid({
                    keyfield: "POL_ID",
                    columns: [
                        {
                            type: "na",
                            title: "#",
                            field: "chkLine",
                            template:
                                "<div style=\"text-align:center;\">" +
                                    "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" " +
                                    "data-warehouse=\"#= POL_WAREHOUSE #\" data-por=\"#= POL_PORID #\" data-line=\"#= POL_LINE #\"" +
                                    " data-part=\"#= POL_PART #\" data-exch=\"#= POL_EXCHANGERATE #\" data-uommulti=\"#= POL_UOMMULTI #\" " +
                                    "data-unitprice=\"#= POL_UNITPRICE #\" data-org=\"#= POL_ORG #\" data-partuom=\"#= POL_PARTUOM #\" data-partquan=\"#= POL_QUANTITY #\" data-remaining=\"#= POL_WAITINGQUANTITY #\"" +
                                    "/><label></label>" +
                                    "</div>",
                            filterable: false,
                            sortable: false,
                            width: 35
                        },
                        { type: "number", field: "POL_PORID", title: gridstrings.purchaseorderlinesview[lang].prlporid, width: 150 },
                        { type: "number", field: "POL_REQLINEID", title: gridstrings.purchaseorderlinesview[lang].prlreq, width: 150 },
                        { type: "number", field: "POL_TASK", title: gridstrings.purchaseorderlinesview[lang].task, width: 150 },
                        { type: "string", field: "POL_DESC", title: gridstrings.purchaseorderlinesview[lang].pordescription, width: 200 },
                        { type: "string", field: "POL_PARTCODE", title: gridstrings.purchaseorderlinesview[lang].prlpartcode, width: 200 },
                        { type: "string", field: "POL_PARTDESC", title: gridstrings.purchaseorderlinesview[lang].prlpartdesc, width: 350 },
                        { type: "string", field: "POL_PARTUOM", title: gridstrings.purchaseorderlinesview[lang].prluom, width: 125 },
                        { type: "number", field: "POL_WAITINGQUANTITY", title: gridstrings.purchaseorderlinesview[lang].waitingquan, width: 125 },
                        { type: "string", field: "POL_ORG", title: gridstrings.purchaseorderlinesview[lang].pororganization, width: 200 },
                        { type: "string", field: "POL_WAREHOUSE", title: gridstrings.purchaseorderlinesview[lang].porwarehouse, width: 200 }
                    ],
                    fields:
                    {
                        POL_PORID: { type: "number" },
                        POL_WAITINGQUANTITY: { type: "number" }
                    },
                    datasource: "/Api/ApiPurchaseOrderLines/GetListView",
                    selector: "#grdPurchaseOrderLines",
                    name: "grdPurchaseOrderLines",
                    toolbarColumnMenu: true,
                    height: constants.defaultgridheight,
                    filter: grdFilter,
                    sort: [{ field: "POL_PORID", dir: "asc" }],
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-default btn-sm\" id=\"btnSaveLines\"><i class=\"fa fa-floppy-o fa-fw\"></i>#=applicationstrings[lang].addtoWarehouse#</button>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Stock.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound
                });
            }

          
        }
        var RegisterUIEvents = function() {
            $("#addalltowarehouse").click(SaveAll);
            $("#modalsave").click(SaveSingle);
        };

        RegisterUIEvents();
    };

    function ready() {
        potw.List();
    }

    $(document).ready(ready);
}());