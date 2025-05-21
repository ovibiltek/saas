(function () {
    var eqpid = null;
    var selectedrecord = null;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnPrint", selectionrequired: true }

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
            name: "task",
            btns: []
        },
        {
            name: "warranty",
            btns: []
        }
    ];

    var war = new function () {

        var grdEquipmentWarranty = null;
        var grdEquipmentWarrantyElm = $("#grdEquipmentWarranty");
        var selecteditem = null;
        var self = this;

        var BuildModals = function () {
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
            $("#btnlaborcurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#laborcurrency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnpartcurrency").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#partcurrency",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
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
            $("#laborcurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
            $("#partcurrency").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE"
            });
        }

        var FillUI = function () {
            tms.BeforeFill("#warranty");

            $("#warrantyid").val(selecteditem.EWR_ID);
            $("#warrantytype").val(selecteditem.EWR_TYPE);
            $("#warrantyduration").val(selecteditem.EWR_DURATIONTYPE).trigger("change");
            $("#warrantystartusage").val(selecteditem.EWR_INITIALUSE);
            $("#warrantyendusage").val(selecteditem.EWR_ENDUSE);
            $("#warrantystartdate").val(selecteditem.EWR_DATESTART ? moment(selecteditem.EWR_DATESTART).format(constants.dateformat) : "");
            $("#warrantyenddate").val(selecteditem.EWR_DATEEND ? moment(selecteditem.EWR_DATEEND).format(constants.dateformat) : "");
            $("#endwarning").val(selecteditem.EWR_WARNING);
            $("#uom").val(selecteditem.EWR_UOM);
            $("#chklabor").prop("checked", selecteditem.EWR_CHKLABOR === "+").trigger("change");
            $("#laborlimit").val(selecteditem.EWR_LABORLIMIT);
            $("#laborcurrency").val(selecteditem.EWR_LABORCURR);
            $("#chkpart").prop("checked", selecteditem.EWR_CHKPART === "+").trigger("change");
            $("#partlimit").val(selecteditem.EWR_PARTLIMIT);
            $("#partcurrency").val(selecteditem.EWR_PARTCURR);
        }

        this.ResetUI = function () {

            selecteditem = null;
            tms.Reset("#warranty");

            $("#warrantyid").val("");
            $("#warrantytype").val("");
            $("#warrantyduration").val("").trigger("change");
            $("#warrantystartusage,\
                #warrantyendusage,\
                #uom,\
                #warrantystartdate,\
                #warrantyenddate,\
                #endwarning,\
                #laborlimit,\
                #partlimit,\
                #laborcurrency,\
                #partcurrency").val("");

            $("#chklabor").prop("checked", false);
            $("#chkpart").prop("checked", false);

        };

        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiEquipmentWarranty/DelRec",
                            data: JSON.stringify(selecteditem.EWR_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };

        this.Save = function () {
            if (!tms.Check("#warranty"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                EWR_ID: (selecteditem != null ? selecteditem.EWR_ID : 0),
                EWR_EQUIPMENT: selectedrecord.EQP_ID,
                EWR_TYPE: $("#warrantytype").val(),
                EWR_DURATIONTYPE: $("#warrantyduration").val(),
                EWR_DATESTART: $("#warrantystartdate").val() ? moment.utc($("#warrantystartdate").val(), constants.dateformat) : null,
                EWR_DATEEND: $("#warrantyenddate").val() ? moment.utc($("#warrantyenddate").val(), constants.dateformat) : null,
                EWR_WARNING: $("#endwarning").val(),
                EWR_UOM: ($("#uom").val() || null),
                EWR_INITIALUSE: ($("#warrantystartusage").val() || null),
                EWR_ENDUSE: ($("#warrantyendusage").val() || null),
                EWR_CHKLABOR: $("#chklabor").prop("checked") ? "+" : "-",
                EWR_LABORLIMIT: ($("#laborlimit").val() || null),
                EWR_LABORCURR: ($("#laborcurrency").val() || null),
                EWR_CHKPART: $("#chkpart").prop("checked") ? "+" : "-",
                EWR_PARTLIMIT: ($("#partlimit").val() || null),
                EWR_PARTCURR: ($("#partcurrency").val() || null),
                EWR_CREATED: selecteditem != null ? selecteditem.EWR_CREATED : tms.Now(),
                EWR_CREATEDBY: selecteditem != null ? selecteditem.EWR_CREATEDBY : user,
                EWR_UPDATED: selecteditem != null ? tms.Now() : null,
                EWR_UPDATEDBY: selecteditem != null ? user : null,
                EWR_RECORDVERSION: selecteditem != null ? selecteditem.EWR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiEquipmentWarranty/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        }

        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiEquipmentWarranty/Get",
                data: JSON.stringify(selecteditem.EWR_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUI();
                }
            });
        };

        var itemSelect = function (row) {
            selecteditem = grdEquipmentWarranty.GetRowDataItem(row);
            LoadSelected();
        };

        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };

        this.List = function () {
            var grdFilter = [{ field: "EWR_EQUIPMENT", value: selectedrecord.EQP_ID, operator: "eq", logic: "and" }];
            if (grdEquipmentWarranty) {
                grdEquipmentWarranty.ClearSelection();
                grdEquipmentWarranty.RunFilter(grdFilter);
            } else {
                grdEquipmentWarranty = new Grid({
                    keyfield: "EWR_ID",
                    columns: [
                        {
                            type: "string",
                            field: "EWR_TYPEDESC",
                            title: gridstrings.EquipmentWarranty[lang].type,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EWR_DURATIONTYPEDESC",
                            title: gridstrings.EquipmentWarranty[lang].durationtype,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "EWR_DATESTART",
                            title: gridstrings.EquipmentWarranty[lang].datestart,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "EWR_DATEEND",
                            title: gridstrings.EquipmentWarranty[lang].dateend,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "EWR_INITIALUSE",
                            title: gridstrings.EquipmentWarranty[lang].initialuse,
                            width: 150
                        },
                        {
                            type: "number",
                            field: "EWR_ENDUSE",
                            title: gridstrings.EquipmentWarranty[lang].enduse,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "EWR_WARNING",
                            title: gridstrings.EquipmentWarranty[lang].warning,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EWR_UOM",
                            title: gridstrings.EquipmentWarranty[lang].uom,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EWR_CHKLABOR",
                            title: gridstrings.EquipmentWarranty[lang].chklabor,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "EWR_LABORLIMIT",
                            title: gridstrings.EquipmentWarranty[lang].laborlimit,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EWR_LABORCURR",
                            title: gridstrings.EquipmentWarranty[lang].laborcurrency,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EWR_CHKPART",
                            title: gridstrings.EquipmentWarranty[lang].chkpart,
                            width: 150
                        },
                        {
                            type: "price",
                            field: "EWR_PARTLIMIT",
                            title: gridstrings.EquipmentWarranty[lang].partlimit,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "EWR_PARTCURR",
                            title: gridstrings.EquipmentWarranty[lang].partcurrency,
                            width: 150
                        },
                    ],
                    fields: {
                        EWR_ID: { type: "number" },
                        EWR_INITIALUSE: { type: "number" },
                        EWR_ENDUSE: { type: "number" },
                        EWR_DATESTART: { type: "date" },
                        EWR_DATEEND: { type: "date" },
                        EWR_WARNING: { type: "number" },
                        EWR_LIMIT: { type: "number" }
                    },
                    datasource: "/Api/ApiEquipmentWarranty/List",
                    selector: "#grdEquipmentWarranty",
                    name: "grdEquipmentWarranty",
                    height: 350,
                    filter: grdFilter,
                    sort: [{ field: "EWR_ID", dir: "asc" }],
                    change: gridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Warranty.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                        ]
                    }
                });
            }
        };

        var RegisterTabEvents = function () {

            $("#btnAddWarranty").click(self.ResetUI);
            $("#btnSaveWarranty").click(self.Save);
            $("#btnDeleteWarranty").click(self.Delete);

            $("#warrantyduration").on("change", function () {
                var v = $(this).val();
                if (v === "CALENDARDAY") {
                    $("#divusageinputs").addClass("hidden");
                    $("#divcalinputs").removeClass("hidden");
                    $("#warrantystartusage,#warrantyendusage,#uom").removeAttr("required").removeClass("required");
                    $("#warrantystartdate,#warrantyenddate").attr("required", "required").addClass("required");
                }
                else if (v === "USAGE") {
                    $("#divcalinputs").addClass("hidden");
                    $("#divusageinputs").removeClass("hidden");
                    $("#warrantystartdate,#warrantyenddate").removeAttr("required").removeClass("required");
                    $("#warrantystartusage,#warrantyendusage,#uom").attr("required", "required").addClass("required");

                }
                else {
                    $("#divusageinputs").addClass("hidden");
                    $("#divcalinputs").addClass("hidden");
                    $("#warrantystartusage,#warrantyendusage,#uom").removeAttr("required").removeClass("required");
                    $("#warrantystartdate,#warrantyenddate").removeAttr("required").removeClass("required");
                }
            });
            $("#chklabor").on("change", function () {
                var isChecked = $(this).is(":checked");
                $("#laborlimit").prop("disabled", !isChecked);
                $("#laborcurrency").prop("disabled", !isChecked);
                $("#btnlaborcurrency").prop("disabled", !isChecked);

            });
            $("#chkpart").on("change", function () {
                var isChecked = $(this).is(":checked");
                $("#partlimit").prop("disabled", !isChecked);
                $("#partcurrency").prop("disabled", !isChecked);
                $("#btnpartcurrency").prop("disabled", !isChecked);
            });


            BuildModals();
            AutoComplete();
        }

        RegisterTabEvents();
    }
    var tsk = new function () {
        var grdEquipmentsList = null;
        var grdEquipmentsListElm = $("#grdEquipmentsList");
        var commentsHelperForList;
        var documentsHelperForList;


        function gridDataBound() {
            grdEquipmentsListElm.find(".btn-comments").unbind("click").click(function () {
                var id = $(this).data("task");
                commentsHelperForList.showCommentsModal({
                    subject: "TASK",
                    source: id
                });
            });
            grdEquipmentsListElm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).data("task");
                documentsHelperForList.showDocumentsModal({
                    subject: "TASK",
                    source: id
                });
            });
        };

        function List() {
            var gridfilter = [{ field: "TSE_EQPID", value: selectedrecord.EQP_ID, operator: "eq", logic: "and" }];

            grdEquipmentsList = new Grid({
                keyfield: "TSE_ID",
                columns: [
                    {
                        type: "na",
                        field: "ACTIONS",
                        title: gridstrings.tasklist[lang].actions,
                        template: "<div style=\"text-align:center;\">" +
                            "<button type=\"button\" data-task=\"#= TSE_TSKID #\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(TSE_CMNTCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= TSE_CMNTCOUNT #</span></button> " +
                            "<button type=\"button\" data-task=\"#= TSE_TSKID #\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(TSE_DOCCOUNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= TSE_DOCCOUNT # </span></button></div>",
                        filterable: false,
                        sortable: false,
                        width: 125
                    },
                    {
                        type: "number",
                        field: "TSE_TSKID",
                        title: gridstrings.taskequipmentlist[lang].taskid,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "TSE_TSKDESC",
                        title: gridstrings.taskequipmentlist[lang].taskdesc,
                        width: 300
                    },
                    {
                        type: "string",
                        field: "TSE_TSKCAT",
                        title: gridstrings.taskequipmentlist[lang].taskcat,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_TSKCATDESC",
                        title: gridstrings.taskequipmentlist[lang].taskcatdesc,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_TSKTYPE",
                        title: gridstrings.taskequipmentlist[lang].tasktype,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_TYPE",
                        title: gridstrings.taskequipmentlist[lang].type,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_CUSTOMER",
                        title: gridstrings.taskequipmentlist[lang].customer,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_BRANCH",
                        title: gridstrings.taskequipmentlist[lang].branch,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_BRANCHDESC",
                        title: gridstrings.taskequipmentlist[lang].branchdesc,
                        width: 200
                    },
                    {
                        type: "datetime",
                        field: "TSE_CREATED",
                        title: gridstrings.taskequipmentlist[lang].created,
                        width: 200
                    },
                    {
                        type: "datetime",
                        field: "TSE_COMPLETED",
                        title: gridstrings.taskequipmentlist[lang].completed,
                        width: 200
                    },
                    {
                        type: "number",
                        field: "TSE_EQPID",
                        title: gridstrings.taskequipmentlist[lang].eqpid,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_EQPCODE",
                        title: gridstrings.taskequipmentlist[lang].eqpcode,
                        width: 200
                    },
                    {
                        type: "string",
                        field: "TSE_EQPDESC",
                        title: gridstrings.taskequipmentlist[lang].eqpdesc,
                        width: 200
                    }
                ],
                fields:
                {
                    TSE_TSKID: { type: "number" },
                    TSE_CREATED: { type: "date" },
                    TSE_COMPLETED: { type: "date" },
                    TSE_EQPID: { type: "number" }
                },
                datasource: "/Api/ApiEquipments/GetTaskEquipmentListView",
                selector: "#grdEquipmentsList",
                name: "grdEquipmentsList",
                height: constants.defaultgridheight,
                filter: gridfilter,
                sort: [{ field: "TSE_CREATED", dir: "desc" }],
                toolbar: {
                    right: [
                        "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                        "<a title=\"#= applicationstrings[lang].download #\" download=\"Stock.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                    ]
                },
                databound: gridDataBound
            });
        };
        function loadDocumentTypes() {
            var gridreq = {
                sort: [{ field: "SYC_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "DOCTYPE", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#doctype option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].SYC_CODE +
                            "\">" +
                            d.data[i].SYC_DESCF +
                            "</option>";
                    }
                    $("#doctype").append(strOptions);
                }
            });
        };
        this.BuildUI = function () {
            List();
            loadDocumentTypes();

            documentsHelperForList = new documents({
                input: "#fumodal",
                filename: "#filenameModal",
                uploadbtn: "#btnuploadModal",
                container: "#fuploadModal",
                documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
                modal: "#modaldocuments",
                documentsdiv: "#docsmodal"
            });

            commentsHelperForList = new comments({
                input: "#commentmodal",
                chkvisibletocustomer: "#visibletocustomermodal",
                chkvisibletosupplier: "#visibletosuppliermodal",
                btnaddcomment: "#addCommentmodal",
                modal: "#modalcomments",
                commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
                commentsdiv: "#commentsmodal"
            });
        };
    };
    var eqp = new function () {
        var grdEquipments = null;
        var grdEquipmentsElm = $("#grdEquipments");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;
        var defaultbarcodelength = 8;
        var data = [];
        var gridfilter = [];
        var treefilter = null;

        var GetLevel = function (type) {
            var gridreq = {
                loadall: true,
                filter: {
                    filters: [
                        { field: "TLV_TYPEENTITY", value: "EQUIPMENT", operator: "eq" },
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
                        $("#eqplevel").val(node.code);
                        $("#eqplevel").data("id", node.id);;
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
        function historyModal() {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMEQUIPMENTS", operator: "eq" },
                    { field: "AUD_REFID", value: eqpid, operator: "eq" }
                ]
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
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        $("#department").val("");
                        tooltip.hide("#type");
                        tooltip.hide("#department");
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
                        { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({ subject: "EQUIPMENT", source: null, type: data.TYP_CODE });
                        }
                    }
                });
            });
            $("#btnparentequipment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.equipments[lang].title,
                    listurl: "/Api/ApiEquipments/List",
                    keyfield: "EQP_CODE",
                    codefield: "EQP_CODE",
                    textfield: "EQP_DESC",
                    returninput: "#parentequipment",
                    columns: [
                        { type: "string", field: "EQP_CODE", title: gridstrings.equipments[lang].eqpcode, width: 100 },
                        { type: "string", field: "EQP_DESC", title: gridstrings.equipments[lang].eqpdesc, width: 400 }
                    ],
                    filter: [
                        { field: "EQP_ACTIVE", value: "+", operator: "eq" },
                        { field: "EQP_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        {
                            field: "PARENTEQUIPMENT", value: (selectedrecord ? selectedrecord.EQP_ID : 0),
                            operator: "func"
                        }
                    ],
                    callback: function (data) {
                        $("#parentequipment").data("id", data ? data.EQP_ID : null);
                    }
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
            $("#btnzone").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.zone[lang].title,
                    listurl: "/Api/ApiZones/List",
                    keyfield: "ZON_CODE",
                    codefield: "ZON_CODE",
                    textfield: "ZON_DESC",
                    returninput: "#zone",
                    columns: [
                        { type: "string", field: "ZON_CODE", title: gridstrings.zone[lang].code, width: 100 },
                        { type: "string", field: "ZON_DESC", title: gridstrings.zone[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ZON_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btndepartment").click(function () {
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
            $("#btnHistory").click(historyModal);
            $("#btnrating").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#rating",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "EQPRATING", operator: "eq" }
                    ]
                });
            });
            $("#btncustomer").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.customer[lang].title,
                    listurl: "/Api/ApiCustomers/List",
                    keyfield: "CUS_CODE",
                    codefield: "CUS_CODE",
                    textfield: "CUS_DESC",
                    returninput: "#customer",
                    columns: [
                        { type: "string", field: "CUS_CODE", title: gridstrings.customer[lang].code, width: 100 },
                        { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        $("#branch").val("");
                        $("#location").val("");
                        tooltip.hide("#branch");
                        tooltip.hide("#location");
                    }
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
                        { field: "BRN_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#location").val("");
                        tooltip.hide("#location");
                    }
                });
            });
            $("#btnlocation").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.location[lang].title,
                    listurl: "/Api/ApiLocations/List",
                    keyfield: "LOC_CODE",
                    codefield: "LOC_CODE",
                    textfield: "LOC_DESC",
                    returninput: "#location",
                    columns: [
                        { type: "string", field: "LOC_CODE", title: gridstrings.location[lang].location, width: 200 },
                        { type: "string", field: "LOC_DESC", title: gridstrings.location[lang].description, width: 400 },
                        { type: "string", field: "LOC_BRANCH", title: gridstrings.location[lang].branch, width: 200 },
                        { type: "string", field: "LOC_BRANCHDESC", title: gridstrings.location[lang].branchdesc, width: 400 },
                        { type: "string", field: "LOC_CUSTOMER", title: gridstrings.location[lang].customer, width: 200 },
                        { type: "string", field: "LOC_CUSTOMERDESC", title: gridstrings.location[lang].customerdesc, width: 400 }
                    ],
                    filter: [
                        { field: "LOC_ACTIVE", value: "+", operator: "eq" },
                        { field: "LOC_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "LOC_BRANCH", value: $("#branch").val(), operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#customer").data("BarcodeLength", data ? data.LOC_CUSTOMERBARCODELENGTH || defaultbarcodelength : null);
                    }
                });
            });
            $("#btnequipmenthealth").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#equipmenthealth",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "EQUIPMENTHEALTH", operator: "eq" }
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
                callback: function (data) {
                    $("#type").val("");
                    $("#department").val("");
                    tooltip.hide("#type");
                    tooltip.hide("#department");
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
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        customFieldsHelper.loadCustomFields({ subject: "EQUIPMENT", source: null, type: data.TYP_CODE });
                    }
                }
            });
            $("#parentequipment").autocomp({
                listurl: "/Api/ApiEquipments/List",
                geturl: "/Api/ApiEquipments/Get",
                field: "EQP_CODE",
                textfield: "EQP_DESC",
                active: "EQP_ACTIVE",
                beforeFilter: function () {
                    return [
                        { field: "EQP_ORG", relfield: "#org", includeall: true },
                        {
                            field: "PARENTEQUIPMENT", value: (selectedrecord ? selectedrecord.EQP_ID : 0),
                            operator: "func" }
                    ];
                },
                callback: function (data) {
                    $("#parentequipment").data("id", data ? data.EQP_ID : null);
                }
            });
            $("#brand").autocomp({
                listurl: "/Api/ApiBrands/List",
                geturl: "/Api/ApiBrands/Get",
                field: "BRA_CODE",
                textfield: "BRA_DESC",
                active: "BRA_ACTIVE"
            });
            $("#zone").autocomp({
                listurl: "/Api/ApiZones/List",
                geturl: "/Api/ApiZones/Get",
                field: "ZON_CODE",
                textfield: "ZON_DESC",
                active: "ZON_ACTIVE"
            });
            $("#department").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [{ field: "DEP_ORG", relfield: "#org", includealls: true }]
            });
            $("#rating").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [
                    { field: "SYC_GROUP", value: "EQPRATING", operator: "eq" }
                ]
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }],
                callback: function (data) {
                    $("#branch").val("");
                    $("#location").val("");
                    tooltip.hide("#branch");
                    tooltip.hide("#location");
                }
            });
            $("#branch").autocomp({
                listurl: "/Api/ApiBranches/List",
                geturl: "/Api/ApiBranches/Get",
                field: "BRN_CODE",
                textfield: "BRN_DESC",
                active: "BRN_ACTIVE",
                filter: [
                    { field: "BRN_ORG", relfield: "#org", includeall: true },
                    { field: "BRN_CUSTOMER", relfield: "#customer", includeall: false }
                ],
                callback: function (data) {
                    $("#location").val("");
                    tooltip.hide("#location");
                }
            });
            $("#location").autocomp({
                listurl: "/Api/ApiLocations/List",
                geturl: "/Api/ApiLocations/Get",
                field: "LOC_CODE",
                textfield: "LOC_DESC",
                active: "LOC_ACTIVE",
                filter: [
                    { field: "LOC_ORG", relfield: "#org", includeall: true },
                    { field: "LOC_BRANCH", relfield: "#branch", includeall: true }
                ],
                callback: function (data) {
                    $("#customer").data("BarcodeLength", data ? data.LOC_CUSTOMERBARCODELENGTH || defaultbarcodelength : null);
                }
            });
            $("#defmaintenancetrade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    { field: "TRD_ORGANIZATION", func: function () { return [selectedrecord.EQP_ORG, "*"] }, includeall: true },
                    { field: "TRD_DEPARTMENT", func: function () { return [$("#department").val(), "*"]; }, operator: "in" }
                ]
            });
            $("#partlevel").autocomp({
                listurl: "/Api/ApiTypeLevels/List",
                geturl: "/Api/ApiTypeLevels/Get",
                field: "TLV_CODE",
                textfield: "TLV_DESC",
                filter: [
                    { field: "TLV_TYPEENTITY", value: "EQUIPMENT", operator: "eq" },
                    { field: "TLV_TYPE", func: function () { return $("#type").val() }, operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        $("#eqplevel").data("id", data.TLV_ID);
                    }
                }
            });
            $("#equipmenthealth").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "EQUIPMENTHEALTH", operator: "eq" }]
            });
        }
        function save() {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var barcodelength = parseInt($("#customer").data("BarcodeLength"));
            if ($("#code").val().trim().length !== barcodelength) {
                msgs.error(applicationstrings[lang].eqpcodelength.format(barcodelength));
                return $.Deferred().reject();
            }

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues({
                    subject: "EQUIPMENT",
                    source: eqpid,
                    type: $("#type").val()
                });
            var o = JSON.stringify(
                {
                    Equipment: {
                        EQP_ID: (eqpid) ? eqpid : 0,
                        EQP_CODE: $("#code").val().trim().toUpper(),
                        EQP_ORG: $("#org").val(),
                        EQP_DESC: $("#desc").val(),
                        EQP_TYPE: $("#type").val(),
                        EQP_TYPEENTITY: "EQUIPMENT",
                        EQP_TYPELEVEL: $("#eqplevel").data("id"),
                        EQP_BRAND: ($("#brand").val() || null),
                        EQP_MODEL: ($("#model").val() || null),
                        EQP_SERIALNO: ($("#serialno").val() || null),
                        EQP_ZONE: ($("#zone").val() || null),
                        EQP_DEPARTMENT: $("#department").val(),
                        EQP_INSDATE: moment.utc($("#insdate").val(), constants.dateformat),
                        EQP_PARENT: ($("#parentequipment").data("id") || null),
                        EQP_LOCATION: ($("#location").val() || null),
                        EQP_DEFMAINTENANCETRADE: ($("#defmaintenancetrade").val() || null),
                        EQP_BRANCH: ($("#branch").val() || null),
                        EQP_GUARANTEESTATUS: ($("#guaranteestatus").val() || null),
                        EQP_MANUFACTURINGYEAR: ($("#manufacturingyear").val() || null),
                        EQP_PRICE: ($("#price").val() || null),
                        EQP_IMPORTANCELEVEL: ($("#importancelevel").val() || null),
                        EQP_PERIODICMAINTENANCEREQUIRED: ($("#periodicmaintenancerequired").val() || null),
                        EQP_REFERENCENO: ($("#referenceno").val() || null),
                        EQP_SUPPLIER: selectedrecord != null ? selectedrecord.EQP_SUPPLIER : (supplier || null),
                        EQP_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                        EQP_CREATED: selectedrecord != null ? selectedrecord.EQP_CREATED : tms.Now(),
                        EQP_CREATEDBY: selectedrecord != null ? selectedrecord.EQP_CREATEDBY : user,
                        EQP_UPDATED: selectedrecord != null ? tms.Now() : null,
                        EQP_UPDATEDBY: selectedrecord != null ? user : null,
                        EQP_RECORDVERSION: selectedrecord != null ? selectedrecord.EQP_RECORDVERSION : 0,
                        EQP_RATING: ($("#rating").val() || null),
                        EQP_HEALTH: ($("#equipmenthealth").val() || null)
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiEquipments/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    eqpid = d.eqpid;
                    loadSelected();
                }
            });
        }
        function remove() {
            if (eqpid) {
                $("#confirm").modal()
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiEquipments/DelRec",
                                data: JSON.stringify(eqpid),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    resetUI();
                                    loadEquipments();
                                }
                            });
                        });
            }
        }
        function resetUI() {
            selectedrecord = null;
            eqpid = null;
            tms.Reset("#record");

            $("#id").val("");
            $("#code").val("");
            $("#org").val("");
            $("#desc").val("");
            $("#eqplevel").val("");
            $("#eqplevel").data("id", null);
            $("#type").val("");
            $("#insdate").val("");
            $("#department").val("");
            $("#parentequipment").val("").data("id", null);
            $("#location").val("");
            $("#defmaintenancetrade").val("");
            $("#brand").val("");
            $("#model").val("");
            $("#zone").val("");
            $("#serialno").val("");
            $("#guaranteestatus").val("");
            $("#manufacturingyear").val("");
            $("#price").val("");
            $("#importancelevel").val("");
            $("#periodicmaintenancerequired").val("");
            $("#referenceno").val("");
            $("#active").prop("checked", true);
            $("#branch").val("");
            $("#customer").data("BarcodeLength", null).val("");
            $("#rating").val("");
            $("#equipmenthealth").val("");

            tooltip.hide("#org");
            tooltip.hide("#type");
            tooltip.hide("#department");
            tooltip.hide("#brand");
            tooltip.hide("#zone");
            tooltip.hide("#parentequipment");
            tooltip.hide("#location");
            tooltip.hide("#defmaintenancetrade");
            tooltip.hide("#branch");
            tooltip.hide("#customer");
            tooltip.hide("#rating");
            tooltip.hide("#eqplevel");
            tooltip.hide("#equipmenthealth");

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        }
        function fillUserInterface() {
            tms.BeforeFill("#record");

            $("#id").val(selectedrecord.EQP_ID);
            $("#code").val(selectedrecord.EQP_CODE);
            $("#org").val(selectedrecord.EQP_ORG);
            $("#desc").val(selectedrecord.EQP_DESC);
            $("#type").val(selectedrecord.EQP_TYPE);
            $("#eqplevel").val(selectedrecord.EQP_TYPELEVELCODE);
            $("#eqplevel").data("id", selectedrecord.EQP_TYPELEVEL);
            $("#department").val(selectedrecord.EQP_DEPARTMENT);
            $("#insdate").val(selectedrecord.EQP_INSDATE ? moment(selectedrecord.EQP_INSDATE).format(constants.dateformat) : "");
            $("#parentequipment").val(selectedrecord.EQP_PARENTCODE).data("id", selectedrecord.EQP_PARENT);
            $("#branch").val(selectedrecord.EQP_BRANCH);
            $("#customer").val(selectedrecord.EQP_CUSTOMER);
            $("#customer").data("BarcodeLength", selectedrecord.EQP_CUSTOMERBARCODELENGTH || defaultbarcodelength);
            $("#location").val(selectedrecord.EQP_LOCATION);
            $("#defmaintenancetrade").val(selectedrecord.EQP_DEFMAINTENANCETRADE);
            $("#brand").val(selectedrecord.EQP_BRAND);
            $("#model").val(selectedrecord.EQP_MODEL);
            $("#zone").val(selectedrecord.EQP_ZONE);
            $("#serialno").val(selectedrecord.EQP_SERIALNO);
            $("#guaranteestatus").val(selectedrecord.EQP_GUARANTEESTATUS || "");
            $("#manufacturingyear").val(selectedrecord.EQP_MANUFACTURINGYEAR);
            $("#price").val(selectedrecord.EQP_PRICE);
            $("#importancelevel").val(selectedrecord.EQP_IMPORTANCELEVEL || "");
            $("#periodicmaintenancerequired").val(selectedrecord.EQP_PERIODICMAINTENANCEREQUIRED || "");
            $("#referenceno").val(selectedrecord.EQP_REFERENCENO);
            $("#active").prop("checked", selectedrecord.EQP_ACTIVE === "+");
            $("#rating").val(selectedrecord.EQP_RATING);
            $("#equipmenthealth").val(selectedrecord.EQP_HEALTH);

            tooltip.show("#org", selectedrecord.EQP_ORGDESC);
            tooltip.show("#brand", selectedrecord.EQP_BRANDDESC);
            tooltip.show("#zone", selectedrecord.EQP_ZONEDESC);
            tooltip.show("#department", selectedrecord.EQP_DEPARTMENTDESC);
            tooltip.show("#type", selectedrecord.EQP_TYPEDESC);
            tooltip.show("#parentequipment", selectedrecord.EQP_PARENTDESC);
            tooltip.show("#location", selectedrecord.EQP_LOCATIONDESC);
            tooltip.show("#defmaintenancetrade", selectedrecord.EQP_DEFMAINTENANCETRADE);
            tooltip.show("#branch", selectedrecord.EQP_BRANCHDESC);
            tooltip.show("#customer", selectedrecord.EQP_CUSTOMERDESC);
            tooltip.show("#rating", selectedrecord.EQP_RATINGDESC);
            tooltip.show("#eqplevel", selectedrecord.EQP_TYPELEVELDESC);
            tooltip.show("#equipmenthealth", selectedrecord.EQP_HEALTHDESC);


            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");

            commentsHelper.showCommentsBlock({ subject: "EQUIPMENT", source: selectedrecord.EQP_ID });
            documentsHelper.showDocumentsBlock({ subject: "EQUIPMENT", source: selectedrecord.EQP_ID });;
        }
        function loadSelected() {
            return tms.Ajax({
                url: "/Api/ApiEquipments/Get",
                data: JSON.stringify(eqpid),
                fn: function (d) {
                    selectedrecord = d.data;
                    fillUserInterface();
                    customFieldsHelper.loadCustomFields({ subject: "EQUIPMENT", source: eqpid, type: $("#type").val() });
                }
            });
        }
        function itemSelect(row) {
            selectedrecord = grdEquipments.GetRowDataItem(row);
            eqpid = selectedrecord.EQP_ID;
            $(".page-header h6").html(selectedrecord.EQP_ID + " - " + selectedrecord.EQP_DESC);
            $("#btnDelete").prop("disabled", false);
            $("#btnHistory").prop("disabled", false);
            scr.Configure();
            tms.Tab();
        }
        function gridChange(e) {
            itemSelect(e.sender.select());
        }
        function gridDataBound() {
            //grdEquipmentsElm.find("[data-id]").unbind("click").click(function () {
            //    itemSelect($(this));
            //});
            grdEquipmentsElm.find("[data-id]").unbind("dblclick").dblclick(function () {
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
                                field:"EQUIPMENTLEVEL",
                                value: selectedItem.id,
                                operator: "func"
                            }
                            treefilter.push(filter);
                        }
                        grdEquipments.RunFilter(treefilter);
                    }
                });
            });
        }
        function loadEquipments() {
            gridfilter = [];

            if (grdEquipments) {
                grdEquipments.ClearSelection();
                grdEquipments.RunFilter(treefilter || gridfilter);
            } else {
                grdEquipments = new Grid({
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
                        {
                            type: "string",
                            field: "EQP_DEFMAINTENANCETRADE",
                            title: gridstrings.equipments[lang].eqpdefmaintenancetrade,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_DEFMAINTENANCETRADEDESC",
                            title: gridstrings.equipments[lang].eqpdefmaintenancetradedesc,
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
                            field: "EQP_BRNREFERENCE",
                            title: gridstrings.equipments[lang].eqpbranchreference,
                            width: 200
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
                        },
                        {
                            type: "string",
                            field: "EQP_RATINGDESC",
                            title: gridstrings.equipments[lang].rating,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "EQP_HEALTHDESC",
                            title: gridstrings.equipments[lang].equipmenthealth,
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
                    selector: "#grdEquipments",
                    name: "grdEquipments",
                    entity: "EQUIPMENT",
                    screen: "EQUIPMENTS",
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
                        ],
                        left: [
                            "<input disabled=\"disabled\" type=\"text\" id=\"dropdowntree\" placeholder=\"" + applicationstrings[lang].filter + "\"/>"
                        ]
                    },
                    databound: gridDataBound,
                    change: gridChange
                });
            }
        }
        function list() {
            $("#btnDelete,#btnHistory,#btnUndo,#btnSave").prop("disabled", true);
            loadEquipments();
        }
        function registerTabChange() {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                    $.when.apply($, deferreds).done(function () {
                        switch (activatedTab) {
                            case "#list":
                                resetUI();
                                list();
                                break;
                            case "#record":
                                $("#btnSave").prop("disabled", false);
                                if (!selectedrecord)
                                    resetUI();
                                else
                                    loadSelected();
                                break;
                            case "#task":
                                tsk.BuildUI();
                                break;
                            case "#warranty":
                                war.List();
                                break;
                        }
                        scr.Configure();
                    });
                });
        }
        function registerUiEvents() {
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    resetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(save);
            $("#btnDelete").click(remove);
            $("#btnUndo").click(loadSelected);
            $("#btneqplevel").click(function () {
                $.when(GetLevel($("#type").val())).done(function () {
                    $(".typelevelclick").css("cursor", "pointer");
                    $("#modaltypelevels").modal();
                });
            });
            $("#btndefmaintenancetrade").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#defmaintenancetrade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }

                    ],
                    filter: [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "TRD_DEPARTMENT", value: [$("#department").val(), "*"], operator: "in" }
                    ]
                });
            });

            registerTabChange();

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
                commentsdiv: "#comments",
                chkvisibletocustomer: "#visibletocustomer",
                chkvisibletosupplier: "#visibletosupplier"
            });

            customFieldsHelper = new customfields({ container: "#cfcontainer", screen: "EQUIPMENT" });
        }
        this.BuildUI = function () {
            buildModals();
            autoComplete();

            if (!eqpid)
                $("#btnBrowse").attr("disabled", "disabled");

            registerUiEvents();
            loadEquipments();

            var path = tms.Path();
            if (path.Param1) {
                return tms.Ajax({
                    url: "/Api/ApiEquipments/Get",
                    data: JSON.stringify(path.Param1),
                    fn: function (d) {
                        selectedrecord = d.data;
                        fillUserInterface();
                        customFieldsHelper.loadCustomFields({ subject: "EQUIPMENT", source: path.Param1, type: $("#type").val() });
                        $(".nav-tabs a[href=\"#record\"]").tab("show");
                    }
                });
            }
        };
    };
    var scr = new function () {
        this.bindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: "#btnSave",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                save();
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
                                resetUI();
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
                                loadSelected();
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
                                remove();
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
                                historyModal();
                                break;
                        }
                    }
                }
            ]);
        }
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
        eqp.BuildUI();
        scr.bindHotKeys();
    }

    $(document).ready(ready);
}());