(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var scr, pre;
    var presalesid = 0;
    var workflowcollapsed = true;
    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
            ]
        },
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

    pre = new function () {
        var GetFilter = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            var datecreatedstart = $("#datecreated_start").val().toDate();
            var datecreatedend = $("#datecreated_end").val().toDate();
            var dateestclosedstart = $("#dateestclosed_start").val().toDate();
            var dateestclosedend = $("#dateestclosed_end").val().toDate();
            var dateclosedstart = $("#dateclosed_start").val().toDate();
            var dateclosedend = $("#dateclosed_end").val().toDate();
         
         

            if (datecreatedend)
                datecreatedend = moment(datecreatedend, constants.dateformat).add(1, "days");
            
            if (dateestclosedend)
                dateestclosedend = dateestclosedend.add(1, "days");
           
            if (dateclosedend)
                dateclosedend = dateclosedend.add(1, "days");


            var statuses = $("#filterstatuses").multipleSelect("getSelects");

            var types = $("#filtertypes").multipleSelect("getSelects");
          

            if (statuses.length > 0)
                gridfilter.push({ field: "PRS_STATUS", value: statuses, operator: "in", logic: "and" });

            if (types.length > 0)
                gridfilter.push({ field: "PRS_TYPE", value: types, operator: "in", logic: "and" });
           

            if (datecreatedstart && datecreatedend)
                gridfilter.push({ field: "PRS_CREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });

            if (dateestclosedstart && dateestclosedend)
                gridfilter.push({ field: "PRS_ESTCLOSED", value: dateestclosedstart, value2: dateestclosedend, operator: "between", logic: "and" });

          
            if (dateclosedstart && dateclosedend)
                gridfilter.push({ field: "PRS_CLOSED", value: dateclosedstart, value2: dateclosedend, operator: "between", logic: "and" });

          
            if (datecreatedstart && !datecreatedend)
                gridfilter.push({ field: "PRS_CREATED", value: datecreatedstart, operator: "gte", logic: "and" });

            if (dateestclosedstart && !dateestclosedend)
                gridfilter.push({ field: "PRS_ESTCLOSED", value: dateestclosedstart, operator: "gte", logic: "and" });
           
            if (dateclosedstart && !dateclosedend)
                gridfilter.push({ field: "PRS_CLOSED", value: dateclosedstart, operator: "gte", logic: "and" });
            
            if (!datecreatedstart && datecreatedend)
                gridfilter.push({ field: "PRS_CREATED", value: datecreatedend, operator: "lte", logic: "and" });

            if (!dateestclosedstart && dateestclosedend)
                gridfilter.push({ field: "PRS_ESTCLOSED", value: dateestclosedend, operator: "lte", logic: "and" });
           
            if (!dateclosedstart && dateclosedend)
                gridfilter.push({ field: "PRS_CLOSED", value: dateclosedend, operator: "lte", logic: "and" });
           

            return gridfilter;
        }
        var ResetSidebarFilter = function () {
          

            $("#datecreated_start").val("");
            $("#datecreated_end").val("");

            $("#dateestclosed_start").val("");
            $("#dateestclosed_end").val("");
          

            $("#dateclosed_start").val("");
            $("#dateclosed_end").val("");
           
 
            $('[data-name="selectItem"]').each(function (e) {
                $(this).attr("checked", false);
            });
          
        }
        var RunSidebarFilter = function () {
            var gridfilter = GetFilter();
            grdPreSales.RunFilter(gridfilter);
            $(".sidebar.right").trigger("sidebar:close");
        }
        function _loadStatuses() {
            var gridreq = {
                sort: [{ field: "STA_DESCF", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "STA_ENTITY", value: "PRESALES", operator: "eq" },
                        { field: "STA_CODE", value: "-", operator: "neq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiStatuses/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                 
                   
                    let selectedOptions = $("#filterstatuses").multipleSelect("getSelects");
                    $("#filterstatuses option").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {

                        strOptions += "<option value=\"" +
                            d.data[i].STA_CODE +
                            "\">" +
                            d.data[i].STA_DESCF +
                            "</option>";
                    }

                    $("#filterstatuses").append(strOptions);
                    $("#filterstatuses").multipleSelect("refresh");
                    $("#filterstatuses").multipleSelect("setSelects", selectedOptions);
                  
                }
            });
        };
        function _loadTypes() {
            var gridreq = {
                sort: [{ field: "TYP_DESCF", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "TYP_ENTITY", value: "PRESALES", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiTypes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {


                    let selectedOptions = $("#filtertypes").multipleSelect("getSelects");
                    $("#filtertypes option").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {

                        strOptions += "<option value=\"" +
                            d.data[i].TYP_CODE +
                            "\">" +
                            d.data[i].TYP_DESCF +
                            "</option>";
                    }

                    $("#filtertypes").append(strOptions);
                    $("#filtertypes").multipleSelect("refresh");
                    $("#filtertypes").multipleSelect("setSelects", selectedOptions);

                }
            });
        };
        var BuildWorkflow = function () {
            var f = {
                filter: {
                    filters: [
                        { field: "SAU_TYPE", value: ["*", $("#type").val()], operator: "in" },
                        { field: "SAU_ENTITY", value: "PRESALES", operator: "eq" },
                        { field: "SAU_SHOWONWORKFLOW", value: "+", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiStatusAuth/ListWorkflowItems",
                data: JSON.stringify(f),
                fn: function (d) {
                    $.when(BuildStatusAuditArray()).done(function (rdat) {
                        var daud = rdat.data;
                        var prearr = $.map(daud, function (a) { return a.AUD_TO; });
                        prearr.push("T");
                        var arr = [];
                        var strworkflow = "";
                        arr = BuildWorkflowArray(d.data, "-", arr);
                        strworkflow += "<div class=\"row bs-wizard\" style=\"border-bottom:0;\">";
                        for (var i = 0; i < arr.length; i++) {
                            var audcnt = $.grep(prearr, function (e) { return (e === arr[i].Code); }).length;
                            if (arr[i].Code === $("#status").val())
                                strworkflow += "<div class=\"col-md-1 bs-wizard-step active\">";
                            else if (audcnt > 0)
                                strworkflow += "<div class=\"col-md-1 bs-wizard-step complete\">";
                            else
                                strworkflow += "<div class=\"col-md-1 bs-wizard-step disabled\">";

                            strworkflow +=
                                "<div class=\"text-center bs-wizard-stepnum\"><span class=\"badge badge-warning\">" +
                                audcnt +
                                "</span></div>";
                            strworkflow += "<div style=\"margin-right:-" +
                                arr.length +
                                "px\" class=\"progress\"><div class=\"progress-bar\"></div></div>";
                            strworkflow += "<a href=\"#\" class=\"bs-wizard-dot\"></a>";
                            strworkflow += "<div class=\"bs-wizard-info text-center\">" + arr[i].Desc + "</div>";
                            strworkflow += "</div>";
                        }
                        strworkflow += "</div>";
                        $(".workflow .row").remove();
                        $(".workflow").append(strworkflow);
                    });
                }
            });
        };
        var BuildStatusAuditArray = function () {
            var fa = {
                filter: {
                    filters: [
                        { field: "AUD_SUBJECT", value: "TMPRESALES", operator: "eq" },
                        { field: "AUD_REFID", value: selectedrecord.PRS_ID, operator: "eq" },
                        { field: "AUD_SOURCE", value: "PRS_STATUS", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiHistory/List",
                data: JSON.stringify(fa),
                quietly: true
            });
        };
        var BuildWorkflowArray = function (data, fromstatus, arr) {
            var next = $.grep(data,
                function (i) {
                    return (i.SAU_FROM === fromstatus && i.SAU_TYPE === $("#type").val());
                });

            if (next.length === 0) {
                next = $.grep(data,
                    function (i) {
                        return (i.SAU_FROM === fromstatus && i.SAU_TYPE === "*");
                    });
            }

            if (next.length !== 0) {
                arr.push({
                    Code: next[0].SAU_TO,
                    Desc: next[0].SAU_TODESC
                });
                return BuildWorkflowArray(data, next[0].SAU_TO, arr);
            } else {
                return arr;
            }
        };
        var self = this;
        var grdPreSales = null;
        var grdPreSalesElm = $("#grdPreSales");
        var documentsHelper;
        var commentsHelper;
        var listCommentsHelper;
        var listDocumentsHelper;
        var customFieldsHelper;
        var CalculateSaleProfit = function () {
            if ($("#salecost").val() && $("#salemargin").val()) {
                $("#saleprofit").val(($("#salecost").val() * $("#salemargin").val()) / 100)
            }
        };
        var CalculateQuoProfit = function () {
            if ($("#quocost").val() && $("#quomargin").val()) {
                $("#quoprofit").val(($("#quocost").val() * $("#quomargin").val()) / 100)
            }
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMPRESALES", operator: "eq" },
                    { field: "AUD_REFID", value: presalesid, operator: "eq" }
                ]
            });
        };
        var BuildModals = function () {
            $("#btnrelatedperson").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#relatedperson",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            tooltip.show("#relatedperson", data.USR_DESC);
                        }
                    }
                });
                
            });
            $("#btnrequestedby").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#requestedby",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_ORG", value: ["*", $("#org").val()], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            tooltip.show("#requestedby", data.USR_DESC);
                        }
                    }
                });
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
                        { field: "ORG_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (d) {
                        if (d) {
                            $("#type").val("");
                           
                            tooltip.hide("#type");
                         
                        }
                    }
                });
            });
            $("#btnquocurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#quocurr",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        if (data) {
                            tooltip.show("#quocurr", data.CUR_DESC);
                        }
                    }
                });
            });
            $("#btnsalecurr").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.currencies[lang].title,
                    listurl: "/Api/ApiCurrencies/List",
                    keyfield: "CUR_CODE",
                    codefield: "CUR_CODE",
                    textfield: "CUR_DESC",
                    returninput: "#salecurr",
                    columns: [
                        { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                        { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUR_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUR_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function (data) {
                        if (data) {
                            tooltip.show("#salecurr", data.CUR_DESC);
                        }
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
                        { field: "TYP_ENTITY", value: "PRESALES", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            customFieldsHelper.loadCustomFields({
                                subject: "PRESALES",
                                source: presalesid,
                                type: data.TYP_CODE
                            });
                            tooltip.show("#type", data.TYP_DESC);
                        }
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
                        { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data) {
                            tooltip.show("#customer",data.CUS_DESC);
                        }
                    }
               
                });
            });
           
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                filter: [
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ],
                callback: function (d) {
                    if (d) {
                        $("#type").val("");
                       

                        tooltip.hide("#type");
                    
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
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "PRESALES", operator: "eq" }
                ],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#type", data.TYP_DESC);
                        customFieldsHelper.loadCustomFields({
                            subject: "PRESALES",
                            source: presalesid,
                            type: data.TYP_CODE
                        });
                    }
                }
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [
                    { field: "CUS_ORG", relfield: "#org", includeall: true }
                ],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#customer", data.CUS_DESC);
                    }
                }
            });
            $("#relatedperson").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_CODE", value: "*", operator: "neq" }
                ],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#relatedperson", data.USR_DESC);
                    }
                }
            });
            $("#requestedby").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_CODE", value: "*", operator: "neq" },

                  
                ],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#requestedby", data.USR_DESC);
                    }
                }
            });
            $("#quocurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                filter: [{ field: "CUR_CODE", value: "*", operator: "neq" }],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#quocurr", data.CUR_DESC);
                    }
                }
            });
            $("#salecurr").autocomp({
                listurl: "/Api/ApiCurrencies/List",
                geturl: "/Api/ApiCurrencies/Get",
                field: "CUR_CODE",
                textfield: "CUR_DESC",
                active: "CUR_ACTIVE",
                filter: [{ field: "CUR_CODE", value: "*", operator: "neq" }],
                callback: function (data) {
                    if (data) {
                        tooltip.show("#salecurr", data.CUR_DESC);
                    }
                }
            });
     
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "PRESALES",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    RequestedBy: $("#createdby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-pcode=\"" +
                            status.pcode +
                            "\" data-code=\"" +
                            status.code +
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
                            strOption += "<option data-pcode=\"" +
                                di.SAU_PTO +
                                "\" data-code=\"" +
                                di.SAU_TO +
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
        var EvaluateCurrentStatus = function () {
            var statusctrl = $("#status");
            var selectedoption = statusctrl.find("option:selected");
            var currentcode = statusctrl.data("code");
            var currentpcode = statusctrl.data("pcode");
            var code = selectedoption.data("code");
            var pcode = selectedoption.data("pcode");
            switch (currentpcode) {
                case "C":
                    $("#cfcontainer").find("input,select,button").prop("disabled", true);
                    $("#record [disableoncomplete]").prop("disabled", true);
                    break;

                default:
                    $("#record [disableoncomplete]").prop("disabled", false);
                    break;
            }

            if (selectedrecord) {
                $("#divcancellationreason").addClass("hidden");
                $("#cancellationreason").removeAttr("required").removeClass("required");
                switch (code) {
                    case "IPT":
                        $("#divcancellationreason").removeClass("hidden");
                        $("#cancellationreason").attr("required", "").addClass("required");
                        break;
                }
            }
        };
        var LoadCancellationReasons = function () {

            var gridreq = {
                sort: [{ field: "CNR_CODE", dir: "desc" }],
                groupedFilters: [
                    {
                        filters: [
                            { field: "CNR_ENTITY", value: "PRESALES", operator: "eq" }
                        ],
                        logic: "or"
                    }
                ]
            };

            var selectedcancellationreason = $("#cancellationreason").data("selected");
            if (selectedcancellationreason) {
                gridreq.groupedFilters.push({
                    filters: [
                        { field: "CNR_CODE", value: selectedcancellationreason, operator: "eq" },
                        { field: "CNR_ENTITY", value: "PRESALES", operator: "eq" }
                    ],
                    logic: "or"
                });
            }

            return tms.Ajax({
                url: "/Api/ApiCancellationReasons/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#cancellationreason option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].CNR_CODE +
                            "\">" +
                            d.data[i].CNR_DESCF +
                            "</option>";
                    }
                    $("#cancellationreason").append(strOptions);
                    $("#cancellationreason").val(selectedcancellationreason);
                }
            });
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({
                subject: "PRESALES",
                source: presalesid
            });
            var o = JSON.stringify(
                {
                    PreSales: {
                        PRS_ID: (presalesid || 0),
                        PRS_ORG: $("#org").val(),
                        PRS_TYPEENTITY: "PRESALES",
                        PRS_TYPE: $("#type").val(),
                        PRS_DESC: $("#description").val(),
                        PRS_STATUSENTITY: "PRESALES",
                        PRS_STATUS: $("#status").val(),
                        PRS_CUSTOMER: $("#customer").val(),
                        PRS_CONTACT: $("#contact").val(),
                        PRS_CONTACTMAIL: $("#contactmail").val(),
                        PRS_CONTACTPHONE: $("#contactphone").val(),
                        PRS_RELATEDPERSON: $("#relatedperson").val(),
                        PRS_QUOCOST: $("#quocost").val(),
                        PRS_QUOPROFITMARGIN: $("#quomargin").val(),
                        PRS_QUOCURRENCY:$("#quocurr").val(), 
                        PRS_QUOPROFIT: $("#quoprofit").val(),
                        PRS_ESTCLOSED: $("#estclosed").val(),
                        PRS_CLOSED: $("#closed").val(),
                        PRS_SALESAMOUNT: $("#salecost").val(),
                        PRS_SALESPROFITMARGIN: $("#salemargin").val(),
                        PRS_SALESPROFIT: $("#saleprofit").val(),
                        PRS_SALECURRENCY: $("#salecurr").val(),
                        PRS_REQUESTEDBY: $("#requestedby").val(),
                        PRS_CANCELLATIONREASON: ($("#cancellationreason").val() || null),
                        PRS_CREATED: selectedrecord != null ? selectedrecord.PRS_CREATED : tms.Now(),
                        PRS_CREATEDBY: selectedrecord != null ? selectedrecord.PRS_CREATEDBY : user,
                        PRS_UPDATED: selectedrecord != null ? tms.Now() : null,
                        PRS_UPDATEDBY: selectedrecord != null ? user : null,
                        PRS_RECORDVERSION: selectedrecord != null ? selectedrecord.PRS_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiPreSales/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    presalesid = d.r.PreSales.PRS_ID;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (presalesid) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiPreSales/DelRec",
                            data: JSON.stringify(presalesid),
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
            presalesid = null;
            selectedstatus = null;

            tms.Reset("#record");
            $("#record [disableoncomplete]").prop("disabled", false);

            $("#presalesid").val("");
            $("#description").val("");
            $("#org").val("");
            $("#type").val("");
            $("#requestedby").val(user);
            $("#createdby").val(user);
            $("#relatedperson").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));
            $("#divcancellationreason").addClass("hidden");
            $("#cancellationreason option:not(.default)").remove();
            $("#cancellationreason").removeAttr("required").removeClass("required");
            $("#contact").val("");
            $("#contactmail").val("");
            $("#contactphone").val("");
            $("#relatedperson").val("");
            $("#quocost").val("");
            $("#quocurr").val("");
            $("#quomargin").val("");
            $("#quoprofit").val("");
            $("#estclosed").val("");
            $("#customer").val("");
            $("#closed").val("");
            $("#salecost").val("");
            $("#salecurr").val("");
            $("#salemargin").val("");
            $("#saleprofit").val("");
           
            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            tooltip.hide("#org");
            tooltip.hide("#type");
           

            $("#comment,#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#presalesid").val(selectedrecord.PRS_ID);
            $("#description").val(selectedrecord.PRS_DESC);
            $("#org").val(selectedrecord.PRS_ORG);
            $("#type").val(selectedrecord.PRS_TYPE);
            $("#status").data("code", selectedstatus.STA_CODE);
            $("#customer").val(selectedrecord.PRS_CUSTOMER);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);
            $("#contact").val(selectedrecord.PRS_CONTACT);
            $("#contactmail").val(selectedrecord.PRS_CONTACTMAIL);
            $("#contactphone").val(selectedrecord.PRS_CONTACTPHONE);
            $("#relatedperson").val(selectedrecord.PRS_RELATEDPERSON);
            $("#quocost").val(selectedrecord.PRS_QUOCOST);
            $("#quocurr").val(selectedrecord.PRS_QUOCURRENCY);
            $("#quomargin").val(selectedrecord.PRS_QUOPROFITMARGIN);
            $("#quoprofit").val(selectedrecord.PRS_QUOPROFIT);
            $("#requestedby").val(selectedrecord.PRS_REQUESTEDBY);
            $("#estclosed").val(selectedrecord.PRS_ESTCLOSED ?
                moment(selectedrecord.PRS_ESTCLOSED).format(constants.dateformat): null );
            $("#closed").val(selectedrecord.PRS_CLOSED ?
                moment(selectedrecord.PRS_CLOSED).format(constants.dateformat) : null);
            $("#salecost").val(selectedrecord.PRS_SALESAMOUNT);
            $("#salecurr").val(selectedrecord.PRS_SALECURRENCY);
            $("#salemargin").val(selectedrecord.PRS_SALESPROFITMARGIN);
            $("#saleprofit").val(selectedrecord.PRS_SALEPROFIT);
            $("#created").val(moment(selectedrecord.PRS_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.PRS_CREATEDBY);
            $("#cancellationreason").data("selected", selectedrecord.PRS_CANCELLATIONREASON);

            //tooltip.show("#org", selectedrecord.PRS_ORGDESC);
            tooltip.show("#type", selectedrecord.PRS_TYPEDESC);
            tooltip.show("#requestedby", selectedrecord.PRS_REQUESTEDBYDESC);
            tooltip.show("#relatedperson", selectedrecord.PRS_RELATEDPERSONDESC);
         
            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#comment,#addComment,#fu").prop("disabled", false);
            $("#btnBrowse").removeAttr("disabled");
            CalculateQuoProfit();
            CalculateSaleProfit();
            LoadCancellationReasons();
            commentsHelper.showCommentsBlock({ subject: "PRESALES", source: selectedrecord.PRS_ID });
            documentsHelper.showDocumentsBlock({ subject: "PRESALES", source: selectedrecord.PRS_ID });;
            return $.when(customFieldsHelper.loadCustomFields({
                subject: "PRESALES",
                source: selectedrecord.PRS_ID,
                type: selectedrecord.PRS_TYPE
            })).done(function () {
                return $.when(LoadStatuses({
                    pcode: selectedstatus.STA_PCODE,
                    code: selectedstatus.STA_CODE,
                    text: selectedstatus.STA_DESCF
                })).done(function () {
                    EvaluateCurrentStatus();
                });
            });
        };
        this.LoadSelected = function (dataonly) {
            return tms.Ajax({
                url: "/Api/ApiPreSales/Get",
                data: JSON.stringify(presalesid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    if (!dataonly) {
                        FillUserInterface();
                        BuildWorkflow();
                        workflowcollapsed = false;
                        $("#workflowgraph").collapse('show');
                    }
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdPreSales.GetRowDataItem(row);
            presalesid = selectedrecord.PRS_ID;
            $(".page-header h6").html(selectedrecord.PRS_ID + " - " + selectedrecord.PRS_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdPreSalesElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            grdPreSalesElm.find(".btn-comments").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                console.log(id);
                listCommentsHelper.showCommentsModal({
                    subject: "PRESALES",
                    source: id
                });
            });
            grdPreSalesElm.find(".btn-docs").unbind("click").click(function () {
                var id = $(this).closest("[data-id]").data("id");
                $("#btnDownload").data("id", id);
                listDocumentsHelper.showDocumentsModal({
                    subject: "PRESALES",
                    source: id,
                    showall : "+"
                });
            });

            grdPreSalesElm.find("#search").off("click").on("click", function () {
                $.when(_loadStatuses(), _loadTypes()).done(function () {
                   
                    $(".sidebar.right").trigger("sidebar:open");
                });
            });
   
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }

            if (grdPreSales) {
                grdPreSales.ClearSelection();
                grdPreSales.RunFilter(gridfilter);
            } else {
                grdPreSales = new Grid({
                    keyfield: "PRS_ID",
                    columns: [
                        {
                            type: "na",
                            field: "ACTIONS",
                            title: gridstrings.presales[lang].actions,
                            template: "<div style=\"text-align:center;\">" +
                                "<button type=\"button\" data-id=\"#= PRS_ID #\" title=\"#= applicationstrings[lang].comments #\" class=\"btn # if(PRS_CMNTCNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\"> #= PRS_CMNTCNT #</span></button> " +
                                "<button type=\"button\"  data-id=\"#= PRS_ID #\" title=\"#= applicationstrings[lang].documents #\" class=\"btn # if(PRS_DOCCNT == 0) {# btn-default #} else {# btn-info-light #}# btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">#= PRS_DOCCNT # </span></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 125
                        },
                        {
                            type: "number",
                            field: "PRS_ID",
                            title: gridstrings.presales[lang].presaleid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRS_DESC",
                            title: gridstrings.presales[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "PRS_ORG",
                            title: gridstrings.presales[lang].organization,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRS_CUSTOMER",
                            title: gridstrings.presales[lang].customer,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRS_TYPE",
                            title: gridstrings.presales[lang].type,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRS_TYPEDESC",
                            title: gridstrings.presales[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRS_STATUS",
                            title: gridstrings.presales[lang].status,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "PRS_STATUSDESC",
                            title: gridstrings.presales[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "na",
                            field: "PRS_PROGRESS",
                            title: gridstrings.presales[lang].progress,
                            width: 250,
                            template: "<div class=\"progress\">" +
                                "<div class=\"progress-bar progress-bar-striped # if(PRS_PROGRESS == 100) {# progress-bar-success #} else if(PRS_PROGRESS > 50 && PRS_PROGRESS < 100) {# progress-bar-info active #} else {# progress-bar-warning active #}#\" role=\"progressbar\" aria-valuenow=\"#= PRS_PROGRESS #\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: #= PRS_PROGRESS #%;\">" +
                                "#= PRS_PROGRESS #%" +
                                "</div>" +
                                "</div>"
                        },
                        {
                            type: "string",
                            field: "PRS_CONTACT",
                            title: gridstrings.presales[lang].contact,
                            width: 250
                        },
                      
                        {
                            type: "string",
                            field: "PRS_CONTACTMAIL",
                            title: gridstrings.presales[lang].contactmail,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRS_CONTACTPHONE",
                            title: gridstrings.presales[lang].contactphone,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRS_RELATEDPERSONDESC",
                            title: gridstrings.presales[lang].relatedperson,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PRS_QUOCOST",
                            title: gridstrings.presales[lang].quocost,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "PRS_QUOPROFITMARGIN",
                            title: gridstrings.presales[lang].quoprofitmargin,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PRS_QUOPROFIT",
                            title: gridstrings.presales[lang].quoprofit,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "PRS_ESTCLOSED",
                            title: gridstrings.presales[lang].estclosed,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "PRS_CLOSED",
                            title: gridstrings.presales[lang].closed,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PRS_SALESAMOUNT",
                            title: gridstrings.presales[lang].salecost,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "PRS_SALESPROFITMARGIN",
                            title: gridstrings.presales[lang].saleprofitmargin,
                            width: 250
                        },
                        {
                            type: "price",
                            field: "PRS_SALESPROFIT",
                            title: gridstrings.presales[lang].saleprofit,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRS_REQUESTEDBYDESC",
                            title: gridstrings.presales[lang].requestedby,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "PRS_CREATEDBY",
                            title: gridstrings.presales[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRS_CREATED",
                            title: gridstrings.presales[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "PRS_UPDATEDBY",
                            title: gridstrings.presales[lang].updatedby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "PRS_UPDATED",
                            title: gridstrings.presales[lang].updated,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        PRS_ID: { type: "number" }, 
                        PRS_CREATED: { type: "date" },
                        PRS_UPDATED: { type: "date" },
                        PRS_ESTCLOSED: { type: "date" },
                        PRS_CLOSED: { type: "date" },
                        PRS_QUOCOST: { type: "number" },
                        PRS_QUOPROFIT: { type: "number" },
                        PRS_QUOPROFITMARGIN: { type: "number" },
                        PRS_SALEPROFIT: { type: "number" },
                        PRS_SALESPROFITMARGIN: { type: "number" },
                        PRS_SALESAMOUNT: { type: "number" }
                 
                      
                    },
                    datasource: "/Api/ApiPreSales/ListView",
                    selector: "#grdPreSales",
                    name: "grdPreSales",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "PRS_ID",
                    primarytextfield: "PRS_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "PRS_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"presales.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var activatedTab = e.target.hash;
                    switch (activatedTab) {
                        case "#list":
                            pre.ResetUI();
                            pre.List();
                            if (!workflowcollapsed) {
                                $("#workflowgraph").collapse('hide');
                                workflowcollapsed = true;
                            }
                              

                            break;
                        case "#record":
                            $("#btnSave").prop("disabled", false);
                            if (!selectedrecord)
                                pre.ResetUI();
                            else {
                                pre.LoadSelected();
                               
                               
                               
                            }
                               
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
            $("#btnPrint").click(self.Print);
            $("#btnWorkflow").on("click",
                function () {
                    if (workflowcollapsed) {
                        BuildWorkflow();
                    }
                    workflowcollapsed = !workflowcollapsed;
                });

            $("#status").on("change", EvaluateCurrentStatus);
            $("[loadstatusesonchange=\"yes\"]").on("change",
                function () {
                    LoadStatuses({
                        code: $("#status").data("code"),
                        pcode: $("#status").data("pcode"),
                        text: $("#status").data("text")
                    });
                });

            RegisterTabChange();

            customFieldsHelper = new customfields({ container: "#cfcontainer" });
          
            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            RegisterTabEvents();
            self.List();
            $("#estclosed").datetimepicker({
               format:'DD-MM-YYYY'
            });
            $("#closed").datetimepicker({
              format: 'DD-MM-YYYY'
            });
            $("select[multiple]").multipleSelect({
                selectAllText: applicationstrings[lang].selectall,
                allSelected: applicationstrings[lang].allselected,
                countSelected: applicationstrings[lang].countSelected
            });

            $("#quocost").numericInput({allowFloat: true });
            $("#quoprofit").numericInput({ allowFloat: true });
            $("#salecost").numericInput({ allowFloat: true });
            $("#saleprofit").numericInput({ allowFloat: true });
            $("#quocost").change(CalculateQuoProfit);
            $("#quomargin").change(CalculateQuoProfit);
            $("#salecost").change(CalculateSaleProfit);
            $("#salemargin").change(CalculateSaleProfit);
            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename" ,
                uploadbtn: "#btnupload",
                container:  "#fupload" ,
                documentsdiv: "#docs",
                progressbar: "#docuprogress" 
            });
            listDocumentsHelper = new documents({
                input: "#listfu",
                filename: "#listfilename",
                uploadbtn: "#btnlistupload" ,
                container: "#flistupload",
                documentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-docs span.txt",
                modal: "#modaldocuments",
                documentsdiv: "#listdocs" ,
                progressbar: "#listdocuprogress",
                downloadbutton: "#btnDownload"

            });
            listCommentsHelper = new comments({
                input: "#listcomment",
              
                btnaddcomment: "#addlistComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-id=\"#source#\"] [data-type=\"na\"] button.btn-comments span.txt",
                commentsdiv: "#listcomments"
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });

            if (!selectedrecord)
                $("#btnBrowse").attr("disabled", "disabled");
            $("#filter").click(function () {
                RunSidebarFilter();
            });
            $("#clearfilter").click(function () {
                ResetSidebarFilter();
                RunSidebarFilter();
            });

            $(".sidebar.right").sidebar({ side: "right" });
            $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
            
        };
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
                                pre.Save();
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
                                pre.ResetUI();
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
                                pre.LoadSelected();
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
                                pre.Delete();
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
        pre.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());