(function () {
    var task = { TSK_ID: 0 };


    var screenconf = [
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnWorkflow", selectionrequired: true }
            ]
        }
    ];

    var tsk = new function () {
        var self = this;
        var taskDocumentsHelper;
        var selectedstatus = null;
        var customFieldsHelper;

        var GetDefaultStatus = function () {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/GetDefaultStatus",
                data: JSON.stringify({ Entity: "TASK", Type: "IC", From: "-", UsrGroup: usergroup }),
                fn: function (d) {
                    var selectedpriority = $("#priority").val();
                    selectedstatus = d.data != null ? d.data.SAU_TO : (selectedpriority === "ACIL" ? "T" : "OB");
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "TASK",
                source: task.TSK_ID,
                type: "DIS"
            });

            var department = "OPERASYON";
            if ($("#tasktype").data("parent") === "GUVENLIK")
                department = "GUVENLIK";

            var o = {
                Task: {
                    TSK_ID: (task.TSK_ID) ? task.TSK_ID : 0,
                    TSK_ORGANIZATION: $("#org").val(),
                    TSK_PROJECT: null,
                    TSK_DEPARTMENT: department ,
                    TSK_LOCATION: ($("#branch").val() || null),
                    TSK_EQUIPMENT: null,
                    TSK_EQUIPMENTREQUIRED: "-",
                    TSK_CATEGORY: "AR",
                    TSK_TYPE: ($("#tasktype").data("parent") || "DIS"),
                    TSK_TYPEENTITY: "TASK",
                    TSK_TASKTYPE: ($("#tasktype").val() || null),
                    TSK_SHORTDESC: $("#shortdesc").val(),
                    TSK_NOTE: ($("#tasknote").val() || null),
                    TSK_STATUS: selectedstatus,
                    TSK_PRIORITY: $("#priority").val(),
                    TSK_PROGRESS: 0,
                    TSK_FOLLOWED: null,
                    TSK_REQUESTEDBY: $("#requestedby").val(),
                    TSK_HIDDEN: "-",
                    TSK_DEADLINE: ($("#deadline").val()
                        ? moment.utc($("#deadline").val(), constants.dateformat)
                        : null),
                    TSK_REQUESTED: ($("#daterequested").val()
                        ? moment.utc($("#daterequested").val(), constants.longdateformat)
                        : null),
                    TSK_CLOSED: null,
                    TSK_COMPLETED: null,
                    TSK_RECORDVERSION: 0,
                    TSK_RATING: null,
                    TSK_RATINGCOMMENTS: null,
                    TSK_CUSTOMER: ($("#customer").val() || null),
                    TSK_BRANCH: ($("#branch").val() || null),
                    TSK_PSPCODE: null,
                    TSK_PRPCODE: null,
                    TSK_REFERENCE: ($("#reference").val() || null),
                    TSK_HOLDREASON: null,
                    TSK_HOLDDATE: null,
                    TSK_CANCELLATIONREASON: null,
                    TSK_CANCELLATIONDESC: null,
                    TSK_PTASK: null,
                    TSK_CHK01: "-",
                    TSK_CHK02: "-",
                    TSK_CHK03: "-",
                    TSK_CHK04: "-",
                    TSK_CHK05: "-"
                },
                CustomFieldValues: customfieldvalues
            };
            var jsonstr = JSON.stringify(o);
            return tms.Ajax({
                url: "/Api/ApiTask/Save",
                data: jsonstr,
                fn: function (d) {
                    msgs.success(d.data);
                    $("#taskno").val(d.id);
                    task.TSK_ID = d.id;
                    $("#divHeader *").prop("disabled", true);
                    $("#btnBrowse").prop("disabled", true).addClass("disabled");
                    $("#btnSave").prop("disabled", true);
                    taskDocumentsHelper.showDocumentsBlock({ subject: "TASK", source: task.TSK_ID });
                }
            });
        };


        var LoadPTaskTypes;
        var LoadPriorities;

        var BuildTaskTypesModal = function (d) {

            // SYC_PARENTDESC'e göre gruplandır
            const groupedData = d.reduce((di, item) => {
                if (!di[item.SYC_PARENTDESC]) {
                    di[item.SYC_PARENTDESC] = [];
                }
                di[item.SYC_PARENTDESC].push(item);
                return di;
            }, {});


            // HTML container'ı seç
            const $container = $('#taskTypes');
            $container.empty(); // Eski içeriği temizle

            // Her bir SYC_PARENTDESC grubu için sütun ve içerik oluştur
            $.each(groupedData, function (parentDesc, items) {
                // Her grup için bir sütun oluştur (col-md-3 her satırda 4 sütun oluşturur, istersen col-md-4 yapabilirsin)
                const $column = $('<div class="col-md-3"></div>');

                // Grup başlığını ekle
                const $groupTitle = $('<h3></h3>').text(parentDesc);
                $column.append($groupTitle);

                // Radio butonları için bir liste oluştur
                const $radioList = $('<div></div>');

                const sortedData = _.sortBy(items, (item) => {
                    return item.SYC_CODE.startsWith('DIGER') ? 1 : 0;
                });


                $.each(sortedData, function (index, item) {
                    const radioId = `radio_${item.SYC_CODE}`;
                    const $radioButton = $(`<div class="radio radio-primary">
                        <input type="radio" id="${radioId}" name="global_radio_group" data-parent="${item.SYC_PARENT}" value="${item.SYC_CODE}">
                            <label>${item.SYC_DESCRIPTION}</label>
                    </div>');'`);
                    $radioList.append($radioButton);
                });

                // Listeyi sütunun içine ekle
                $column.append($radioList);

                // Sütunu satıra ekle
                $container.append($column);
            });
        

        }

        var LoadTaskTypes = function () {


            var priority = $("#priority").val();
            var gridreq = {
                sort: [
                    { field: "SYC_ORDER", dir: "asc" },
                    { field: "SYC_CODE", dir: "asc" }
                ],
                filter: 
                    {
                        filters: [
                            { field: "SYC_PARENTGROUP", value: "TASKPTYPE", operator: "eq" }
                        ]
                    },              
            };

            if (priority === "ACIL")
                gridreq.filter.filters.push({ field: "SYC_CODE", value: "ACIL", operator: "startswith" });
            else
                gridreq.filter.filters.push({ field: "SYC_CODE", value: "ACIL", operator: "notstartswith" });


            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    BuildTaskTypesModal(d.data);
                }
            }); 

            
        }
        this.Reset = function () {
            task = { TSK_ID: 0 };
            selectedstatus = null;
            tms.Reset("#record");

            $("#taskno").val("");
            $("#shortdesc").val("");
            $("#requestedby").val(user);
            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();
            $("#priority").data("selected", ($('#divTaskType').is(':visible') ? "" : "NORMAL"));
            $("#priority").val($('#divTaskType').is(':visible') ? "" : "NORMAL");
            $("#deadline").val("");
            $("#reference").val("");
            $("#daterequested").val(tms.Now().format(constants.longdateformat)).prop("disabled", !!customer);
            $("#customer").val(!!customer ? (customer.split(",").length === 1 ? customer : "") : "");
            $("#customerdesc").val(!!customer ? (customer.split(",").length === 1 ? customerdesc : "") : "");
            $("#branch").val("");
            $("#branchdesc").val("");
            $("#datecreated").val(tms.Now().format(constants.longdateformat));
            $("#createdby").val(user);
            $("#tasknote").val("");
            $("#tasktype").val("");


            tooltip.show("#requestedby", userdesc);
            tooltip.show("#createdby", userdesc);
            tooltip.hide("#customer");
            tooltip.hide("#branch");
            tooltip.hide("#tasktype");

            $("#btncategory").prop("disabled", false);
            $("#shortdesc").prop("disabled", false);
            $("#tasknote").prop("disabled", false);
            $("#reference").prop("disabled", false);
            $("#btncustomer").prop("disabled", false);
            $("#customer").prop("disabled", false);
            $("#branch").prop("disabled", false);
            $("#btnbranch").prop("disabled", false);
            $("#priority").prop("disabled", false);
            $("#deadline").prop("disabled", false);
            $("#tasktype,#btntasktype").prop("disabled", false);

            $("#btnSave").prop("disabled", false);

            LoadPriorities();
            taskDocumentsHelper.clearDocuments(true);
            $("a>span.badge").remove();

            tms.ResetCompleted("#record");

        };
        LoadPriorities = function () {
            var gridreq = {
                sort: [{ field: "PRI_CODE", dir: "desc" }], 
                groupedFilters: [
                    {
                        filters: [
                            { field: "PRI_ACTIVE", value: "+", operator: "eq" },
                            { field: "PRI_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                        ],
                        logic: "or"
                    }
                ]
            };

            var selectedpriority = $("#priority").data("selected");
            if (selectedpriority) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "PRI_CODE", value: selectedpriority, operator: "eq" }
                    ],
                    logic: "or"
                });
            }


            return tms.Ajax({
                url: "/Api/ApiPriorities/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#priority option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option style=\"color:" +
                            d.data[i].PRI_COLOR +
                            "\" value=\"" +
                            d.data[i].PRI_CODE +
                            "\">" +
                            d.data[i].PRI_DESCF +
                            "</option>";
                    }
                    $("#priority").append(strOptions);
                    var defaultSelectedValue = $("#priority").data("selected");
                    if (defaultSelectedValue)
                        $("#priority").val(defaultSelectedValue);
                }
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
                        {
                            type: "string",
                            field: "ORG_CODE",
                            title: gridstrings.org[lang].organization,
                            width: 100
                        },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        $("#customer").val("");
                        $("#customerdesc").val("");
                        $("#branch").val("");
                        $("#branchdesc").val("");
                        tooltip.hide("#customer");
                        tooltip.hide("#branch");
                        tooltip.hide("#location");
                        $("#org").val(data.ORG_CODE).trigger("change");
                        tooltip.show("#org", data.ORG_DESCF);
                    }
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
                        {
                            type: "string",
                            field: "CUS_DESC",
                            title: gridstrings.customer[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        $("#customerdesc").val(data ? data.CUS_DESC : "");
                        $("#branch").val("");
                        $("#branchdesc").val("");
                        tooltip.hide("#branch");
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
                        { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 300 },
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" },
                        { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#branchdesc").val(data ? data.BRN_DESC : "");
                    }
                });
            });

            $("#btntasktype").click(function () {

                var isVisible = $('#divTaskType').is(':visible');
                var priority = $("#priority").val();

                if (isVisible && !priority) {
                    msgs.error(applicationstrings[lang].selectpriorityfirst);
                    return false;
                }
                $.when(LoadTaskTypes()).done(function () {
                    $("#modaltasktype").modal("show");
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
                    $("#project").val("");
                    $("#taskdep").val("");
                    $("#type").val("");
                    $("#customer").val("");
                    $("#customerdesc").val("");
                    $("#branch").val("");
                    $("#branchdesc").val("");
                    $("#location").val("");
                    tooltip.hide("#dep");
                    tooltip.hide("#project");
                    tooltip.hide("#type");
                    tooltip.hide("#customer");
                    tooltip.hide("#branch");
                    tooltip.hide("#location");
                },
                filter: [{ field: "ORG_CODE", value: "*", operator: "neq" }]
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }],
                callback: function (data) {
                    $("#customerdesc").val(data ? data.CUS_DESC : "");
                    $("#branch").val("");
                    $("#branchdesc").val("");
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
                filter: [{ field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }]
            });
            $("#tasktype").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }],
                beforeFilter: function () {
                    var priority = $("#priority").val();
                    if (priority === "ACIL")
                        return [{ field: "SYC_CODE", value: "ACIL", operator: "startswith" }];
                    else
                        return [{ field: "SYC_CODE", value: "ACIL", operator: "notstartswith" }];
                },
                callback: function (d) {
                    if (d) {
                        $("#shortdesc").val(d.SYC_DESCF);
                        $("#tasktype").data("parent", d.SYC_PARENT);
                    }
                }
            });
        };
        var RegisterUiEvents = function () {
            $(".btn").css("cursor", "pointer");
            $("#btnSave").click(function () {
                $.when(GetDefaultStatus()).done(function () {
                    var $this = $(this);
                    $.when(self.Save()).done(function () {
                        if (task.TSK_ID !== 0) {
                            if ($("#filename").children().length > 0) {
                                taskDocumentsHelper.triggerDocumentsUpload({ subject: "TASK", source: task.TSK_ID });
                                $(".btn-TM_DELDOC").remove();
                            }
                        }
                    }).always(function () {
                        $this.prop("disabled", false);
                    });
                });
            });
            $("#btnNew").click(self.Reset);
            $("#btnTaskTypeOK").click(function () {
                var selectedTaskTypeInp = $('input[type="radio"][name="global_radio_group"]:checked');
                var parent = selectedTaskTypeInp.parent();
                $("#tasktype").val(selectedTaskTypeInp.val());
                $("#tasktype").data("parent",selectedTaskTypeInp.data("parent"));
                $("#shortdesc").val(parent.find("label").text());
                $("#modaltasktype").modal("hide");

            });
            $("#priority").on("change", function () {
                $("#tasktype").val("").removeClass("isempty").removeClass("invalid");
                $("#shortdesc").val("");
            });

            LoadPriorities();
            scr.BindHotKeys();
        };
        this.BuildUI = function () {

            BuildModals();
            AutoComplete();

            customFieldsHelper = new customfields({ container: "#cfcontainer", screen: "TASK" });
            customFieldsHelper.loadCustomFields({ subject: "TASK", source: task.TSK_ID, type: "DIS" });

            taskDocumentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });

            RegisterUiEvents();
            self.Reset();
        };
    };
    var scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                            default:
                                tsk.Save();
                                break;
   
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnNew";
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                            default:
                                task.New();
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
                    if (task.TSK_ID) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };

    };

    function ready() {
        tsk.BuildUI();
    }

    $(document).ready(ready);
}());