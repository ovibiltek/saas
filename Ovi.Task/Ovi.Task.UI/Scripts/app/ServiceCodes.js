(function () {
    var selectedrecord = null;
    var servicecodeid = null;
    var svc, scr,srs;
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
            name: "servicecodesuppliers",
            btns: []
        }
    ];

    svc = new function () {
        var self = this;
        var grdServiceCodes = null;
        var grdServiceCodesElm = $("#grdServiceCodes");
        var commentsHelper;
        var documentsHelper;
        var data = [];
        var gridfilter = [];
        var treefilter = null;

        var GenerateModalTree;
        var FillUserInterface;

        var GetLevel = function (type) {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: "SERVICECODE", operator: "eq" }
                    ]
                }
            };

            if (type)
                gridreq.filter.filters.push({ field: "TLV_TYPE", value: type, operator: "eq" });

            return tms.Ajax({
                url: "/Api/ApiTypeLevels/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    if (type)
                        GenerateModalTree(d.data);
                }
            });
        };
        //Modal Builder
        var ChildBuilder = function (parent, list) {

            var childs = $.grep(list, function (item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { name: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID, code: di.TLV_CODE, desc: di.TLV_DESC, children: [] };
                parent.children.push(child);
                ChildBuilder(child, list);
            }
        };
        GenerateModalTree = function (d) {
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
                        $("#typelevel").val(node.code);
                        $("#desc").val(node.desc);
                        $("#typelevel").data("id", node.id);;
                        tooltip.show("#typelevel", node.desc);
                        $("#modaltypelevels").modal("hide");
                    }
                });
        };
        //DropDown Builder
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

        var Remove = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiServiceCodes/DelRec",
                            data: JSON.stringify(selectedrecord.SRV_CODE),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var Save = function () {
            if (!tms.Check())
                return $.Deferred().reject();

            var o = JSON.stringify({
                SRV_CODE: (servicecodeid || 0),
                SRV_DESCRIPTION: $("#desc").val(),
                SRV_ORG: $("#org").val(),
                SRV_UOM: ($("#uom").val() || null),
                SRV_UNITPRICE: $("#unitprice").val(),
                SRV_UNITSALESPRICE: $("#unitsalesprice").val(),
                SRV_CURRENCY: $("#currency").val() ,
                SRV_TYPEENTITY: "SERVICECODE",
                SRV_TYPE: ($("#type").val() || null),
                SRV_TYPELEVEL: $("#typelevel").data("id"),
                SRV_TASKTYPE: ($("#tasktype").val() || null),
                SRV_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                SRV_PUBLIC: $("#public").prop("checked") ? "+" : "-",
                SRV_CREATED: selectedrecord != null ? selectedrecord.SRV_CREATED : tms.Now(),
                SRV_CREATEDBY: selectedrecord != null ? selectedrecord.SRV_CREATEDBY : user,
                SRV_UPDATED: selectedrecord != null ? tms.Now() : null,
                SRV_UPDATEDBY: selectedrecord != null ? user : null,
                SRV_RECORDVERSION: selectedrecord != null ? selectedrecord.SRV_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiServiceCodes/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.SRV_CODE).list("refresh");
                }
            });
        };
        var Copy = function () {
            var copyRecord = selectedrecord;
            selectedrecord = null;
            servicecodeid = null;

            if (tms.ActiveTab() !== "record")
                $(".nav-tabs a[href=\"#record\"]").tab("show");

            $("#code").val("");
            $("#desc").val(copyRecord.SRV_TYPELEVELDESC);
            $("#org").val(copyRecord.SRV_ORG);
            $("#uom").val(copyRecord.SRV_UOM);
            $("#tasktype").val(copyRecord.SRV_TASKTYPE);
            $("#type").val(copyRecord.SRV_TYPE);
            $("#typelevel").val(copyRecord.SRV_TYPELEVELCODE);
            $("#typelevel").data("id", copyRecord.SRV_TYPELEVEL);
            $("#currency").val("");
            $("#unitsalesprice").val("");
            $("#unitprice").val("");

            tooltip.show("#org", copyRecord.SRV_ORGDESC);
            tooltip.show("#uom", copyRecord.SRV_UOMDESC);
            tooltip.show("#tasktype", copyRecord.SRV_TASKTYPEDESC);
            tooltip.show("#typelevel", copyRecord.SRV_TYPELEVELDESC);
            tooltip.show("#type", copyRecord.SRV_TYPEDESC);
            tooltip.hide("#currency");

            commentsHelper.clearComments();
            documentsHelper.clearDocuments();

        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiServiceCodes/Get",
                data: JSON.stringify(servicecodeid),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        FillUserInterface = function () {

            tms.BeforeFill("#record");

            $("#code").val(selectedrecord.SRV_CODE);
            $("#desc").val(selectedrecord.SRV_DESCRIPTION);
            $("#org").val(selectedrecord.SRV_ORG);
            $("#uom").val(selectedrecord.SRV_UOM);
            $("#tasktype").val(selectedrecord.SRV_TASKTYPE);
            $("#type").val(selectedrecord.SRV_TYPE);
            $("#typelevel").val(selectedrecord.SRV_TYPELEVELCODE);
            $("#typelevel").data("id", selectedrecord.SRV_TYPELEVEL);
            $("#unitprice").val(selectedrecord.SRV_UNITPRICE);
            $("#unitsalesprice").val(selectedrecord.SRV_UNITSALESPRICE);
            $("#currency").val(selectedrecord.SRV_CURRENCY);
            $("#active").prop("checked", selectedrecord.SRV_ACTIVE === "+");
            $("#public").prop("checked", selectedrecord.SRV_PUBLIC === "+");
            $(".page-header>h6").html(selectedrecord.SRV_CODE + " - " + selectedrecord.SRV_DESCRIPTION);

            tooltip.show("#org", selectedrecord.SRV_ORGDESC);
            tooltip.show("#uom", selectedrecord.SRV_UOMDESC);
            tooltip.show("#tasktype", selectedrecord.SRV_TASKTYPEDESC);
            tooltip.show("#currency", selectedrecord.SRV_CURRENCYDESC);
            tooltip.show("#typelevel", selectedrecord.SRV_TYPELEVELDESC);
            tooltip.show("#type", selectedrecord.SRV_TYPEDESC);

            commentsHelper.showCommentsBlock({ subject: "SERVICECODE", source: selectedrecord.SRV_CODE });
            documentsHelper.showDocumentsBlock({ subject: "SERVICECODE", source: selectedrecord.SRV_CODE });

        };
        var translationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMSERVICECODES", operator: "eq" },
                    { field: "DES_PROPERTY", value: "SRV_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        }
        var historyModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMSERVICECODES", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        }
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
            $("#btntasktype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#tasktype",
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
                        { field: "TYP_ENTITY", value: "SERVICECODE", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
        }
        var AutoComplete = function () {
            $("#uom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE"
            });
            $("#tasktype").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }]
            });
            $("#currency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
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
                    { field: "TYP_ENTITY", value: "SERVICECODE", operator: "eq" }
                ]
            });
            $("#typelevel").autocomp({
                listurl: "/Api/ApiTypeLevels/List",
                geturl: "/Api/ApiTypeLevels/Get",
                field: "TLV_CODE",
                textfield: "TLV_DESC",
                filter: [
                    { field: "TLV_TYPEENTITY", value: "SERVICECODE", operator: "eq" },
                    { field: "TLV_TYPE", func: function () { return $("#type").val() }, operator: "eq" }
                ],
                callback: function (data, elm) {
                    if (data) {
                        elm.data("id", data.TLV_ID);
                    }
                }
            });
        }
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                    if (($.inArray(activatedTab, ["#list", "#record", "#servicecodesuppliers"]) === -1)) {
                        deferreds.push(por.LoadSelected(true));
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
                            case "#servicecodesuppliers":
                                srs.Ready();
                                break;

                        }
                        scr.Configure();
                    });
                });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(Save);
            $("#btnDelete").click(Remove);
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnCopy").click(Copy);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(historyModal);
            $("#btnTranslations").click(translationModal);
            $("#btntypelevel").click(function () {
                $.when(GetLevel($("#type").val())).done(function () {
                    $(".levelclick").css("cursor", "pointer");
                    $("#modaltypelevels").modal();
                });
            });
            RegisterTabChange();


            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });
        };
        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#uom").val("");
            $("#tasktype").val("");
            $("#unitsalesprice").val("");
            $("#unitprice").val("");
            $("#currency").val("");
            $("#typelevel").val("");
            $("#typelevel").data("id", null);
            $("#type").val("");
            $("#active").prop("checked", true);
            $("#public").prop("checked", false);

            tooltip.hide("#org");
            tooltip.hide("#uom");
            tooltip.hide("#tasktype");
            tooltip.hide("#typelevel");
            tooltip.hide("#type");
            tooltip.hide("#currency");

            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var ItemSelect = function (row) {
            selectedrecord = grdServiceCodes.GetRowDataItem(row);
            servicecodeid = selectedrecord.SRV_CODE;
            $(".page-header h6").html(selectedrecord.SRV_CODE + " - " + selectedrecord.SRV_DESCRIPTION);
            scr.Configure();
            tms.Tab();
        };
        var GridDataBound = function (e) {
            grdServiceCodesElm.find("[data-id]").unbind("dblclick").dblclick(function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });

            $.when(GetLevel()).done(function (d) {
                var data = GenerateTreeData(d.data);
                var levelTree = $("#dropdowntree").comboTree({
                    source: data,
                    isMultiple: false,
                    singleItemClick: function (selectedItem) {
                        treefilter = [...gridfilter];
                        if (parseInt(selectedItem.id) !== 0) {
                            var filter = {
                                field: "SERVICECODELEVEL", value: selectedItem.id, operator: "func"
                            }
                            treefilter.push(filter);
                        }
                        grdServiceCodes.RunFilter(treefilter);
                    }
                });
            });
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        this.List = function () {
            gridfilter = [];
            if (grdServiceCodes) {
                grdServiceCodes.ClearSelection();
                grdServiceCodes.RunFilter(treefilter || gridfilter);
            } else {
                grdServiceCodes = new Grid({
                    keyfield: "SRV_CODE",
                    columns: [
                        {
                            type: "number",
                            field: "SRV_CODE",
                            title: gridstrings.servicecodes[lang].code,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_DESCRIPTION",
                            title: gridstrings.servicecodes[lang].description,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SRV_ORG",
                            title: gridstrings.servicecodes[lang].org,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SRV_UOM",
                            title: gridstrings.servicecodes[lang].uom,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SRV_TASKTYPE",
                            title: gridstrings.servicecodes[lang].tasktypedescription,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SRV_TYPE",
                            title: gridstrings.servicecodes[lang].type,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SRV_TYPEDESC",
                            title: gridstrings.servicecodes[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "SRV_UNITPRICE",
                            title: gridstrings.servicecodes[lang].unitprice,
                            width: 200
                        },
                        {
                            type: "price",
                            field: "SRV_UNITSALESPRICE",
                            title: gridstrings.servicecodes[lang].unitsalesprice,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_CURRENCY",
                            title: gridstrings.servicecodes[lang].currency,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_ACTIVE",
                            title: gridstrings.servicecodes[lang].active,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_PUBLIC",
                            title: gridstrings.servicecodes[lang].public,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_TYPELEVELCODE",
                            title: gridstrings.servicecodes[lang].typelevelcode,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_TYPELEVELDESC",
                            title: gridstrings.servicecodes[lang].typelevelcodedesc,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SRV_CREATED",
                            title: gridstrings.servicecodes[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_CREATEDBY",
                            title: gridstrings.servicecodes[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SRV_UPDATED",
                            title: gridstrings.servicecodes[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRV_UPDATEDBY",
                            title: gridstrings.servicecodes[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields: {
                        SRV_CREATED: { type: "date" },
                        SRV_CODE: { type: "number" },
                        SRV_UNITPRICE: { type: "number" },
                        SRV_UNITSALESPRICE: { type: "number" },
                        SRV_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiServiceCodes/List",
                    selector: "#grdServiceCodes",
                    name: "grdServiceCodes",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "SRV_CODE",
                    primarytextfield: "SRV_DESCRIPTION",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "SRV_CODE", dir: "asc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"ServiceCodes.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
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
        this.BuildUI = function () {
            BuildModals();
            AutoComplete();
            RegisterUiEvents();
            self.List();
            scr.Configure();
        };
    };
    srs = new function () {
        var self = this;
        var grdelm = $("#grdServiceCodeSuppliers");
        var grdServiceCodeSuppliers = null;
        var selectedSupplier = null;
        var checkedlines = null;
        this.ResetUI = function () {

            selectedSupplier = null;
            tms.Reset("#servicecodesuppliers");

            $("#supplier").val("");
        };

        var FillUserInterface = function () {
            tms.BeforeFill("#servicecodesuppliers");
            $("#supplier").val(selectedSupplier.SRS_SUPPLIERCODE);
        };

        this.Save = function () {
            if (!tms.Check("#servicecodesuppliers"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                SRS_ID: selectedSupplier ? selectedSupplier.SRS_ID : 0,
                SRS_SERVICECODE: selectedrecord.SRV_CODE,
                SRS_SUPPLIERCODE: $("#supplier").val(),
                SRS_CREATED: selectedSupplier != null ? selectedSupplier.SRS_CREATED : tms.Now(),
                SRS_CREATEDBY: selectedSupplier != null ? selectedSupplier.SRS_CREATEDBY : user

            });

            return tms.Ajax({
                url: "/Api/ApiServiceCodeSuppliers/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedSupplier = d.r;
                    self.List();
                    self.ResetUI();
                }
            });
        };

        var CheckAll = function (checked) {
            var checkinputs = $("#grdServiceCodeSuppliers input[data-name=\"chkLine\"]:not(disabled)");
            for (var i = 0; i < checkinputs.length; i++) {
                $(checkinputs[i]).prop("checked", checked).trigger("change");
            }
        };

        this.Delete = function () {
            checkedlines = grdelm.find("input[data-name=\"chkLine\"]:checked");

            if (checkedlines.length > 0) {
                var linearr = [];
                for (var i = 0; i < checkedlines.length; i++) {
                    var line = $(checkedlines[i]);
                    linearr.push(line.data("id"));
                }

                var o = JSON.stringify(
                    {
                        Lines: linearr
                    });

                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiServiceCodeSuppliers/DeleteAll",
                            data: o,
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
            else {
                if (selectedSupplier) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiServiceCodeSuppliers/DelRec",
                                data: JSON.stringify(selectedSupplier.SRS_ID),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    self.ResetUI();
                                    self.List();
                                }
                            });
                        });
                }
                else {
                    msgs.error("supp del");
                    return $.Deferred().reject();
                }
            }
        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiServiceCodeSuppliers/Get",
                data: JSON.stringify(selectedSupplier.SRS_ID),
                fn: function (d) {
                    selectedSupplier = d.data;
                    FillUserInterface();
                }

            });
        };
        var itemSelect = function (row) {
            selectedSupplier = grdServiceCodeSuppliers.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var gridDataBound = function (e) {

            grdelm.find("#btnCheckAll").off("click").on("click", function () {
                var checkedStatus = !($(this).data("checked") || false);
                $(this).data("checked", checkedStatus);
                CheckAll(checkedStatus);
            });
            grdelm.find("input[data-name=\"chkLine\"]:not(disabled)").on("change", function () {
                checkedlines = grdelm.find("input[data-name=\"chkLine\"]:checked");
                $("#btnDeleteSupplier").prop("disabled", checkedlines.length === 0);
            });

        };
        this.List = function () {
            var grdFilter = [{ field: "SRS_SERVICECODE", value: selectedrecord.SRV_CODE, operator: "eq", logic: "and" }];
            if (grdServiceCodeSuppliers) {
                grdServiceCodeSuppliers.ClearSelection();
                grdServiceCodeSuppliers.RunFilter(grdFilter);
            } else {
                grdServiceCodeSuppliers = new Grid({
                    keyfield: "SRS_ID",
                    columns: [
                        {
                            type: "na",
                            title: "#",
                            field: "chkLine",
                            template:
                                "<div style=\"text-align:center;\">" +
                                "<div class=\"checkbox checkbox-primary\"><input data-name=\"chkLine\" class=\"styled\" type=\"checkbox\" data-id=\"#= SRS_ID #\" /><label></label>" +
                                "</div>",
                            filterable: false,
                            sortable: false,
                            width: 35
                        },
                        {
                            type: "number",
                            field: "SRS_SERVICECODE",
                            title: gridstrings.servicecodes[lang].code,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SRS_SUPPLIERCODE",
                            title: gridstrings.servicecodes[lang].suppliercode,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SRS_CREATED",
                            title: gridstrings.servicecodes[lang].created,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        SRS_SERVICECODE: { type: "number" },
                        SRS_CREATED: { type: "datetime" }
                       
                    },
                    datasource: "/Api/ApiServiceCodeSuppliers/List",
                    selector: "#grdServiceCodeSuppliers",
                    name: "grdServiceCodeSuppliers",
                    height: 300,
                    filter: grdFilter,
                    sort: [{ field: "SRS_ID", dir: "desc" }],
                    change: gridChange,
                    toolbarColumnMenu: true,
                    databound: gridDataBound,
                    loadall: true,
                    toolbar: {
                        left: [
                            "<button class=\"btn btn-info btn-sm\" id=\"btnCheckAll\"><i class=\"fa fa-check-square fa-fw\"></i>#=applicationstrings[lang].checkall#</button>"
                        ],
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"ServiceCodeSuppliers.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    itemclick: function (event, item) {
                       
                        self.LoadSelected();
                    }
                });
            }
        };

        var RegisterUIEvents = function () {
            $("#btnAddSupplier").click(self.ResetUI);
            $("#btnSaveSupplier").click(self.Save);
            $("#btnDeleteSupplier").click(self.Delete);
            $("#btnsupplier").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.suppliers[lang].title,
                    listurl: "Api/ApiSuppliers/List",
                    keyfield: "SUP_CODE",
                    codefield: "SUP_CODE",
                    textfield: "SUP_DESC",
                    returninput: "#supplier",
                    columns: [
                        { type: "string", field: "SUP_CODE", title: gridstrings.suppliers[lang].code, width: 100 },
                        { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 400 }
                    ],
                    filter: [
                        {field: "SUP_ACTIVE",value: "+", operator: "eq"}
                    ]

                });
            });

            $("#supplier").autocomp({
                listurl: "/Api/ApiSuppliers/List",
                geturl: "/Api/ApiSuppliers/Get",
                field: "SUP_CODE",
                textfield: "SUP_DESC",
                active: "SUP_ACTIVE"
            });


        };

        this.Ready = function () {
            self.List();
            self.ResetUI();
        };
        RegisterUIEvents();
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
                                svc.Save();
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
                                svc.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        svc.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                svc.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        svc.HistoryModal();
                    }
                },
                {
                    k: "ctrl+C",
                    e: "#btnCopy", 
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                svc.Copy();
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
            if (tab.more && typeof (tab.more) === "function")
                return tab.more();
        };
    };

    function ready() {
        svc.BuildUI();
        scr.BindHotKeys();
    }
    $(document).ready(ready);
}());