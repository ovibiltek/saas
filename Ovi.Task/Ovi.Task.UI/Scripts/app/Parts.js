(function () {
    var parid = null;
    var selectedrecord = null;

    var trx, stk, par, scr, fpc;
    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnCopy", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true }
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnCopy", selectionrequired: true },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "stk",
            btns: []
        },
        {
            name: "trx",
            btns: []
        },
        {
            name: "fixedpartcosts",
            btns: []
        }
    ];

    trx = new function () {
        var self = this;
        var grdPartTransactionLines = null;

        this.List = function () {
            var grdFilter = [
                { field: "PTL_PARTCODE", value: selectedrecord.PAR_CODE, operator: "eq", logic: "and" },
                { field: "PTL_TRANSTATUS", value: "APP", operator: "eq", logic: "and" }
            ];

            if (grdPartTransactionLines) {
                grdPartTransactionLines.ClearSelection();
                grdPartTransactionLines.RunFilter(grdFilter);
            } else {
                grdPartTransactionLines = new Grid({
                    keyfield: "PTL_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PTL_TRANSACTION",
                            title: gridstrings.PartTransactionLines[lang].transaction,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_TRANSACTIONDESC",
                            title: gridstrings.PartTransactionLines[lang].transactiondesc,
                            width: 350
                        },
                        {
                            type: "number",
                            field: "PTL_LINE",
                            title: gridstrings.PartTransactionLines[lang].line,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_TYPE",
                            title: gridstrings.PartTransactionLines[lang].type,
                            width: 150
                        },
                        {
                            type: "na",
                            field: "TYPEDESC",
                            title: gridstrings.PartTransactionLines[lang].typedesc,
                            template: "<div>#= gridstrings.PartTransactionLines[lang].types[PTL_TYPE] #</div>",
                            filterable: false,
                            sortable: false,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_PARTCODE",
                            title: gridstrings.PartTransactionLines[lang].partcode,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_PARTDESC",
                            title: gridstrings.PartTransactionLines[lang].partdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PTL_WAREHOUSE",
                            title: gridstrings.PartTransactionLines[lang].warehouse,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_WAREHOUSEDESC",
                            title: gridstrings.PartTransactionLines[lang].warehousedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PTL_BIN",
                            title: gridstrings.PartTransactionLines[lang].bin,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_BINDESC",
                            title: gridstrings.PartTransactionLines[lang].bindesc,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PTL_PRICE",
                            title: gridstrings.PartTransactionLines[lang].price,
                            width: 150
                        },
                        {
                            type: "qty",
                            field: "PTL_QTY",
                            title: gridstrings.PartTransactionLines[lang].quantity,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "PTL_TRANSACTIONDATE",
                            title: gridstrings.PartTransactionLines[lang].transactiondate,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PTL_CREATEDBY",
                            title: gridstrings.PartTransactionLines[lang].createdby,
                            width: 250
                        }
                    ],
                    fields: {
                        PTL_TRANSACTION: { type: "number" },
                        PTL_LINE: { type: "number" },
                        PTL_TRANSACTIONDATE: { type: "date" }
                    },
                    datasource: "/Api/ApiPartTransactionLine/List",
                    selector: "#grdPartTransactionLines",
                    name: "grdPartTransactionLines",
                    height: constants.defaultgridheight - 98,
                    filter: grdFilter,
                    sort: [{ field: "PTL_ID", dir: "desc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Lines.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
    };
    stk = new function () {
        var self = this;
        var grdStock = null;

        this.List = function () {
            var grdFilter = [{ field: "STK_PARTCODE", value: selectedrecord.PAR_CODE, operator: "eq", logic: "and" }];
            if (grdStock) {
                grdStock.ClearSelection();
                grdStock.RunFilter(grdFilter);
            } else {
                grdStock = new Grid({
                    keyfield: "STK_ID",
                    columns: [
                        { type: "string", field: "STK_PARTCODE", title: gridstrings.stock[lang].part, width: 200 },
                        { type: "string", field: "STK_PARTDESC", title: gridstrings.stock[lang].partdesc, width: 350 },
                        { type: "string", field: "STK_WAREHOUSE", title: gridstrings.stock[lang].warehouse, width: 200 },
                        { type: "string", field: "STK_WAREHOUSEDESC", title: gridstrings.stock[lang].warehousedesc, width: 200 },
                        { type: "string", field: "STK_BIN", title: gridstrings.stock[lang].bin, width: 200 },
                        { type: "string", field: "STK_BINDESC", title: gridstrings.stock[lang].bindesc, width: 200 },
                        { type: "qty", field: "STK_QTY", title: gridstrings.stock[lang].qty, width: 200 },
                        { type: "price", field: "STK_AVGPRICE", title: gridstrings.stock[lang].avgprice, width: 200 },
                        { type: "string", field: "STK_PARTUOM", title: gridstrings.stock[lang].uom, width: 200 }
                    ],
                    fields: {
                        STK_QTY: { type: "number" },
                        STK_AVGPRICE: { type: "number" }
                    },
                    datasource: "/Api/ApiWarehouses/StockView",
                    selector: "#grdStock",
                    name: "grdStock",
                    height: constants.defaultgridheight - 98,
                    filter: grdFilter,
                    sort: [{ field: "STK_BIN", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Stock.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
    };
    par = new function () {
        var self = this;
        var grdParts = null;
        var grdPartsElm = $("#grdParts");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var data = [];
        var gridfilter = [];
        var treefilter = null;

        var GetLevel = function (type) {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: "PART", operator: "eq" },
                        { field: "TLV_TYPE", value: type, operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    GenerateTree(d.data);
                }
            });
        };

        //Modal Builder
        var ChildBuilder = function (parent, list) {

            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = {
                    name: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    code: di.TLV_CODE,
                    desc: di.TLV_DESC,
                    children: []
                };
                parent.children.push(child);
                ChildBuilder(child, list);
            }
        };
        var GenerateTree = function (d) {

            data = [];
            $("#treelevel").tree("destroy");

            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    name: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    code: di.TLV_CODE,
                    desc: di.TLV_DESC,
                    children: []
                };
                ChildBuilder(parent, d);
                data.push(parent);
            }

            $("#treelevel").tree({
                data: data,
                autoOpen: false,
                dragAndDrop: false
            }).on("tree.select",
                function (event) {
                    if (event.node) {
                        var node = event.node;
                        $("#partlevel").val(node.code);
                        $("#partlevel").data("id", node.id);
                        $("#desc").val(node.desc);
                        tooltip.show("#partlevel", node.desc);
                        $("#modaltypelevels").modal("hide");
                    }
                });
        };
        //DropDownBuilder
        var ChildBuilderList = function (parent, list) {
            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { title: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID };
                if (!parent.subs) {
                    parent.subs = [];
                }
                parent.subs.push(child);
                ChildBuilderList(child, list);
            }
        };
        var GenerateTreeData = function (d) {
            var data = [];
            data.push({ title: applicationstrings[lang].clearfilter, id: 0 });
            var parentless = $.grep(d, function (item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    title: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    subs: []
                };
                ChildBuilderList(parent, d);
                data.push(parent);
            }
            return data;
        };

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPARTS", operator: "eq" },
                    { field: "AUD_REFID", value: parid, operator: "eq" }
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
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        tooltip.hide("#type");
                    }
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
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "PART", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data && parid) {
                            customFieldsHelper.loadCustomFields({
                                subject: "PART",
                                source: parid,
                                type: data.TYP_CODE
                            });
                        }
                    }
                });
            });
            $("#btnuom").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.uoms[lang].title,
                    listurl: "/Api/ApiUoms/List",
                    keyfield: "UOM_CODE",
                    codefield: "UOM_CODE",
                    textfield: "UOM_DESC",
                    returninput: "#uom",
                    columns: [
                        { type: "string", field: "UOM_CODE", title: gridstrings.uoms[lang].code, width: 100 },
                        { type: "string", field: "UOM_DESC", title: gridstrings.uoms[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "UOM_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btncurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#currency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnbrand").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.brand[lang].title,
                    listurl: "/Api/ApiBrands/List",
                    keyfield: "BRA_CODE",
                    codefield: "BRA_CODE",
                    textfield: "BRA_DESC",
                    returninput: "#brand",
                    columns: [
                        { type: "string", field: "BRA_CODE", title: gridstrings.brand[lang].code, width: 100 },
                        { type: "string", field: "BRA_DESC", title: gridstrings.brand[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "BRA_ACTIVE", value: "+", operator: "eq" }
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
                    $("#type").val("");
                    tooltip.hide("#type");
                }
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "PART", operator: "eq" }
                ],
                callback: function (data) {
                    if (data && parid) {
                        customFieldsHelper.loadCustomFields({ subject: "PART", source: parid, type: data.TYP_CODE });
                    }
                }
            });
            $("#uom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#brand").autocomp({
                listurl: "/Api/ApiBrands/List",
                geturl: "/Api/ApiBrands/Get",
                field: "BRA_CODE",
                textfield: "BRA_DESC",
                active: "BRA_ACTIVE"
            });
            $("#partlevel").autocomp({
                listurl: "/Api/ApiTypeLevels/List",
                geturl: "/Api/ApiTypeLevels/Get",
                field: "TLV_CODE",
                textfield: "TLV_DESC",
                filter: [
                    { field: "TLV_TYPEENTITY", value: "PART", operator: "eq" },
                    { field: "TLV_TYPE", func: function () { return $("#type").val() }, operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        $("#partlevel").data("id", data.TLV_ID);
                    }
                }
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.PAR_CODE);
            $("#org").val(selectedrecord.PAR_ORG);
            $("#desc").val(selectedrecord.PAR_DESC);
            $("#type").val(selectedrecord.PAR_TYPE);
            $("#uom").val(selectedrecord.PAR_UOM);
            $("#brand").val(selectedrecord.PAR_BRAND);
            $("#currency").val(selectedrecord.PAR_CURR);
            $("#unitsalesprice").val(selectedrecord.PAR_UNITSALESPRICE);
            $("#active").prop("checked", selectedrecord.PAR_ACTIVE === "+");
            $("#partlevel").val(selectedrecord.PAR_TYPELEVELCODE);
            $("#partlevel").data("id", selectedrecord.PAR_TYPELEVEL);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            tooltip.show("#org", selectedrecord.PAR_DESC);
            tooltip.show("#type", selectedrecord.PAR_TYPEDESC);
            tooltip.show("#uom", selectedrecord.PAR_UOMDESC);
            tooltip.show("#currency", selectedrecord.PAR_CURRDESC);
            tooltip.show("#partlevel", selectedrecord.PAR_TYPELEVELDESC);

            $("#btnBrowse").removeAttr("disabled");
            $("#addComment,#fu").prop("disabled", false);

            commentsHelper.showCommentsBlock({ subject: "PART", source: selectedrecord.PAR_ID });
            documentsHelper.showDocumentsBlock({ subject: "PART", source: selectedrecord.PAR_ID });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiParts/Get",
                data: JSON.stringify(parid),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({ subject: "PART", source: parid, type: $("#type").val() });
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues(
                    { subject: "PART", source: parid, type: $("#type").val() });
            var o = JSON.stringify(
                {
                    Part: {
                        PAR_ID: (parid) ? parid : 0,
                        PAR_CODE: $("#code").val().toUpper(),
                        PAR_ORG: $("#org").val(),
                        PAR_DESC: $("#desc").val(),
                        PAR_TYPE: $("#type").val(),
                        PAR_TYPEENTITY: "PART",
                        PAR_TYPELEVEL: $("#partlevel").data("id"),
                        PAR_UOM: $("#uom").val(),
                        PAR_BRAND: ($("#brand").val() || null),
                        PAR_UNITSALESPRICE: (parseFloat($("#unitsalesprice").val()) || null),
                        PAR_CURR: ($("#currency").val() || null),
                        PAR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                        PAR_CREATED: selectedrecord != null ? selectedrecord.PAR_CREATED : tms.Now(),
                        PAR_CREATEDBY: selectedrecord != null ? selectedrecord.PAR_CREATEDBY : user,
                        PAR_UPDATED: selectedrecord != null ? tms.Now() : null,
                        PAR_UPDATEDBY: selectedrecord != null ? user : null,
                        PAR_RECORDVERSION: selectedrecord != null ? selectedrecord.PAR_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiParts/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    parid = d.parid;
                    self.LoadSelected();
                }
            });
        };
        this.Copy = function () {
            var copyRecord = selectedrecord;
            selectedrecord = null;
            parid = null;

            if (tms.ActiveTab() !== "record")
                $(".nav-tabs a[href=\"#record\"]").tab("show");

            $("#code").val("");
            $("#org").val(copyRecord.PAR_ORG);
            $("#desc").val(copyRecord.PAR_DESC);
            $("#type").val(copyRecord.PAR_TYPE);
            $("#uom").val(copyRecord.PAR_UOM);
            $("#brand").val(copyRecord.PAR_BRAND);
            $("#currency").val("");
            $("#unitsalesprice").val("");
            $("#active").prop("checked", copyRecord.PAR_ACTIVE === "+");
            $("#partlevel").val(copyRecord.PAR_TYPELEVELCODE);
            $("#partlevel").data("id", copyRecord.PAR_TYPELEVEL);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            tooltip.show("#org", copyRecord.PAR_DESC);
            tooltip.show("#type", copyRecord.PAR_TYPEDESC);
            tooltip.show("#uom", copyRecord.PAR_UOMDESC);
            tooltip.show("#currency", null);
            tooltip.show("#partlevel", copyRecord.PAR_TYPELEVELDESC);

            $("#btnBrowse").removeAttr("disabled");
            $("#addComment,#fu").prop("disabled", false);

            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        this.Delete = function () {
            if (parid) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiParts/DelRec",
                            data: JSON.stringify(parid),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.ResetUI = function () {
            selectedrecord = null;
            parid = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#org").val("");
            $("#desc").val("");
            $("#type").val("");
            $("#uom").val("");
            $("#brand").val("");
            $("#currency").val("");
            $("#unitsalesprice").val("");
            $("#active").prop("checked", true);
            $("#partlevel").val("");
            $("#partlevel").data("id", null);

            tooltip.hide("#org");
            tooltip.hide("#currency");
            tooltip.hide("#type");
            tooltip.hide("#uom");
            tooltip.hide("#partlevel");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var ItemSelect = function (row) {
            selectedrecord = grdParts.GetRowDataItem(row);
            parid = selectedrecord.PAR_ID;
            scr.Configure();
            tms.Tab();
            $(".page-header h6").html(selectedrecord.PAR_ID + " - " + selectedrecord.PAR_DESC);
        };
        var GridDataBound = function (e) {
            grdPartsElm.find("[data-id]").unbind("dblclick").dblclick(function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });

            $.when(GetLevel()).done(function (d) {
                var data = GenerateTreeData(d.data);
                $("#dropdowntree").comboTree({
                    source: data,
                    isMultiple: false,
                    singleItemClick: function (selectedItem) {
                        treefilter = [...gridfilter];
                        if (parseInt(selectedItem.id) !== 0) {
                            var filter = {
                                field:"PARTLEVEL.PARID",
                                value: selectedItem.id,
                                operator: "func"
                            }
                            treefilter.push(filter);
                        }
                        grdParts.RunFilter(treefilter);
                    }
                });
            });
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var ListParts = function () {
            gridfilter = [];
            if (grdParts) {
                grdParts.ClearSelection();
                grdParts.RunFilter(treefilter || gridfilter);
            } else {
                grdParts = new Grid({
                    keyfield: "PAR_ID",
                    columns: [
                        {
                            type: "number",
                            field: "PAR_ID",
                            title: gridstrings.parts[lang].parid,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PAR_TYPELEVELCODE",
                            title: gridstrings.parts[lang].levelcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PAR_TYPELEVELDESC",
                            title: gridstrings.parts[lang].leveldesc,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PAR_CODE",
                            title: gridstrings.parts[lang].parcode,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PAR_DESC",
                            title: gridstrings.parts[lang].pardesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_BRAND",
                            title: gridstrings.parts[lang].parbrand,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_BRANDDESC",
                            title: gridstrings.parts[lang].parbranddesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_UOM",
                            title: gridstrings.parts[lang].paruom,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "PAR_UNITSALESPRICE",
                            title: gridstrings.parts[lang].parunitsalesprice,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_CURR",
                            title: gridstrings.parts[lang].parcurr,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_ACTIVE",
                            title: gridstrings.parts[lang].paractive,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_ORG",
                            title: gridstrings.parts[lang].parorg,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "PAR_ORGDESC",
                            title: gridstrings.parts[lang].parorgdesc,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PAR_TYPE",
                            title: gridstrings.parts[lang].partype,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "PAR_TYPEDESC",
                            title: gridstrings.parts[lang].partypedesc,
                            width: 100
                        },
                        {
                            type: "datetime",
                            field: "PAR_CREATED",
                            title: gridstrings.parts[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_CREATEDBY",
                            title: gridstrings.parts[lang].createdby,
                            width: 100
                        },
                        {
                            type: "datetime",
                            field: "PAR_UPDATED",
                            title: gridstrings.parts[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PAR_UPDATEDBY",
                            title: gridstrings.parts[lang].updatedby,
                            width: 100
                        }
                    ],
                    fields: {
                        PAR_CREATED: { type: "date" },
                        PAR_UPDATED: { type: "date" },
                        PAR_UNITSALESPRICE: { type: "number" }
                    },
                    datasource: "/Api/ApiParts/List",
                    selector: "#grdParts",
                    name: "grdParts",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "PAR_ID",
                    primarytextfield: "PAR_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "PAR_ID", dir: "asc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Parts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ],
                        left: [
                            "<input disabled=\"disabled\" type=\"text\" id=\"dropdowntree\" placeholder=\"" + applicationstrings[lang].filter + "\"/>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.List = function () {
            ListParts();
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var activatedTab = e.target.hash; // activated tab
                    switch (activatedTab) {
                        case "#list":
                            selectedrecord = null;
                            self.List();
                            break;
                        case "#record":
                            $("#btnSave").prop("disabled", false);
                            if (!selectedrecord)
                                self.ResetUI();
                            else
                                self.LoadSelected();
                            break;
                        case "#stock":
                            stk.List();
                            break;
                        case "#trx":
                            trx.List();
                            break;
                        case "#fixedpartcosts":
                            fpc.List();
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
            $("#btnNew").click(function () {
                self.ResetUI();
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnCopy").click(self.Copy);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnpartlevel").click(function () {
                $.when(GetLevel($("#type").val())).done(function () {
                    $(".typelevelclick").css("cursor", "pointer");
                    $("#modaltypelevels").modal();
                });
            });

            RegisterTabChange();

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });
        };
        this.BuildUI = function () {
            BuildModals();
            AutoComplete();
            RegisterUiEvents();
            scr.Configure();
            self.List();

            if (!parid)
                $("#btnBrowse").attr("disabled", "disabled");
        };
    };
    fpc = new function () {
        var self = this;
        var grdFixedPartCosts = null;
        var grdFixedPartCostsElm = $("#grdFixedPartCosts");
        var selectedfixedpartcost = null;

        var FillUserInterface = function () {
            tms.BeforeFill("#fixedpartcosts");
            $("#startdate").val(moment(selectedfixedpartcost.FPC_STARTDATE).format(constants.dateformat));
            $("#enddate").val(moment(selectedfixedpartcost.FPC_ENDDATE).format(constants.dateformat));
            $("#fixedpartcost").val(selectedfixedpartcost.FPC_PRICE);
            $("#fixedpartcostcurr").val(selectedfixedpartcost.FPC_CURR);

            tooltip.show("#fixedpartcostcurr", selectedfixedpartcost.FPC_CURRDESC);

        }

        this.ResetUI = function () {
            selectedfixedpartcost = null;
            tms.Reset("#fixedpartcosts");

            $("#startdate").val("");
            $("#enddate").val("");
            $("#fixedpartcost").val("");
            $("#fixedpartcostcurr").val("");

            tooltip.hide("#fixedpartcostcurr");
        }

        var BuildModals = function () {
            $("#btnfixedpartcostcurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#fixedpartcostcurr",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
        }

        var AutoComplete = function () {
            $("#fixedpartcostcurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
        }

        this.Save = function () {
            if (!tms.Check("#fixedpartcosts"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                FPC_ID: selectedfixedpartcost ? selectedfixedpartcost.FPC_ID : 0,
                FPC_PARID: selectedrecord.PAR_ID,
                FPC_PRICE: $("#fixedpartcost").val(),
                FPC_CURR: $("#fixedpartcostcurr").val(),
                FPC_STARTDATE: moment.utc($("#startdate").val(), constants.dateformat),
                FPC_ENDDATE: moment.utc($("#enddate").val(), constants.dateformat),
                FPC_CREATED: selectedfixedpartcost != null ? selectedfixedpartcost.FPC_CREATED : tms.Now(),
                FPC_CREATEDBY: selectedfixedpartcost != null ? selectedfixedpartcost.FPC_CREATEDBY : user,
                FPC_UPDATED: selectedfixedpartcost != null ? tms.Now() : null,
                FPC_UPDATEDBY: selectedfixedpartcost != null ? user : null,
                FPC_RECORDVERSION: selectedfixedpartcost != null ? selectedfixedpartcost.FPC_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiFixedPartCosts/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };

        this.Delete = function () {
            if (selectedfixedpartcost) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiFixedPartCosts/DelRec",
                            data: JSON.stringify(selectedfixedpartcost.FPC_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };

        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiFixedPartCosts/Get",
                data: JSON.stringify(selectedfixedpartcost.FPC_ID),
                fn: function (d) {
                    selectedfixedpartcost = d.data;
                    FillUserInterface();
                }
            });
        };

        var itemSelect = function (row) {
            selectedfixedpartcost = grdFixedPartCosts.GetRowDataItem(row);
            LoadSelected();
        };

        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };

        this.List = function () {
            var grdFilter = [{ field: "FPC_PARID", value: selectedrecord.PAR_ID, operator: "eq", logic: "and" }];
            if (grdFixedPartCosts) {
                grdFixedPartCosts.ClearSelection();
                grdFixedPartCosts.RunFilter(grdFilter);
            } else {
                grdFixedPartCosts = new Grid({
                    keyfield: "FPC_ID",
                    columns: [
                        {
                            type: "price",
                            field: "FPC_PRICE",
                            title: gridstrings.fixedpartcosts[lang].price,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "FPC_CURR",
                            title: gridstrings.fixedpartcosts[lang].curr,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "FPC_STARTDATE",
                            title: gridstrings.fixedpartcosts[lang].startdate,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "FPC_ENDDATE",
                            title: gridstrings.fixedpartcosts[lang].enddate,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "FPC_CREATED",
                            title: gridstrings.fixedpartcosts[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "FPC_CREATEDBY",
                            title: gridstrings.fixedpartcosts[lang].createdby,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "FPC_UPDATED",
                            title: gridstrings.fixedpartcosts[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "FPC_UPDATEDBY",
                            title: gridstrings.fixedpartcosts[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        FPC_PRICE: { type: "number" },
                        FPC_STARTDATE: { type: "date" },
                        FPC_ENDDATE: { type: "date" },
                        FPC_CREATED: { type: "date" },
                        FPC_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiFixedPartCosts/List",
                    selector: "#grdFixedPartCosts",
                    name: "grdFixedPartCosts",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "FPC_ID", dir: "asc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"FixedPartCosts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            };
        };

        var RegisterUiEvents = function () {
            $("#btnSaveFixedPartCosts").click(self.Save);
            $("#btnAddFixedPartCosts").click(self.ResetUI);
            $("#btnDeleteFixedPartCosts").click(self.Delete);
        }

        this.Ready = function () {
            BuildModals();
            AutoComplete();
            RegisterUiEvents();
        }
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
                                par.Save();
                                break;
                            case "fixedpartcosts":
                                if (!$("#btnFixedPartCosts").prop("disabled"))
                                    par.Save();
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
                                par.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        par.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                par.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        par.HistoryModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            $.when(par.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "stock":
                        stk.List();
                        break;
                    case "trx":
                        trx.List();
                        break;
                }
            });
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
        par.BuildUI();
        fpc.Ready();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());