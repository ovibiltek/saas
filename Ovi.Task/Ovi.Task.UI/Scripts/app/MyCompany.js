(function () {
    var selectedrecord = null;
    var regions = null;
    var tasktypes = null;
    var scr, supp, veh, usr, qua, dvr, doc;

    var screenconf = [
        {
            name: "record",
            btns:[]
        },
        {
            name: "workplacedetails",
            btns: [
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
            ]
        },
        {
            name: "vehicles",
            btns: []
        },
        {
            name: "users",
            btns: []
        },
        {
            name: "deliveries",
            btns: []
        },
        {
            name: "documentsandcertificates",
            btns: []
        },

    ];


    doc = new function () {

        var self = this;
        var selecteddoc = null;
        var grdelm = $("#grdDocumentsAndCertificates");
        var grdDocumentsAndCertificates = null;

        this.ResetUI = function () {

            selecteddoc = null;
            tms.Reset("#documentsandcertificates");

            $("#documenttype").val("");
            $("#documentdescription").val("");
            $("#documentstartdate").val("");
            $("#documentenddate").val("");

            tooltip.hide("#documenttype");

        };
        var FillUserInterface = function () {

            tms.BeforeFill("#documentsandcertificates");

            $("#documenttype").val(selecteddoc.SDC_DOCUMENTTYPE);
            $("#documentdescription").val(selecteddoc.SDC_DESCRIPTION);
            $("#documentstartdate").val(moment(selecteddoc.SDC_STARTDATE).format(constants.dateformat));
            $("#documentenddate").val(moment(selecteddoc.SDC_ENDDATE).format(constants.dateformat));

            tooltip.show("#documenttype", selecteddoc.SDC_DOCUMENTTYPEDESC);
        };
        this.Save = function () {

            if (!tms.Check("#documentsandcertificates"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                SDC_ID: selecteddoc ? selecteddoc.SDC_ID : 0,
                SDC_SUPPLIER: selectedrecord.SUP_CODE,
                SDC_DOCUMENTTYPE: $("#documenttype").val(),
                SDC_DESCRIPTION: $("#documentdescription").val(),
                SDC_STARTDATE: moment.utc($("#documentstartdate").val(), constants.dateformat),
                SDC_ENDDATE: moment.utc($("#documentenddate").val(), constants.dateformat),
                SDC_CREATED: selecteddoc != null ? selecteddoc.SDC_CREATED : tms.Now(),
                SDC_CREATEDBY: selecteddoc != null ? selecteddoc.SDC_CREATEDBY : user,
                SDC_UPDATED: selecteddoc != null ? tms.Now() : null,
                SDC_UPDATEDBY: selecteddoc != null ? user : null,
                SDC_RECORDVERSION: selecteddoc != null ? selecteddoc.SDC_RECORDVERSION : 0

            });

            return tms.Ajax({
                url: "/Api/ApiSupplierDocuments/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selecteddoc = d.r;
                    self.List();
                    FillUserInterface();
                }
            });
        };
        this.Delete = function () {
            if (selecteddoc) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiSupplierDocuments/DelRec",
                            data: JSON.stringify(selecteddoc.SDC_ID),
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
                url: "/Api/ApiSupplierDocuments/Get",
                data: JSON.stringify(selecteddoc.SDC_ID),
                fn: function (d) {
                    selecteddoc = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selecteddoc = grdDocumentsAndCertificates.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [{ field: "SDC_SUPPLIER", value: selectedrecord.SUP_CODE, operator: "eq", logic: "and" }];
            if (grdDocumentsAndCertificates) {
                grdDocumentsAndCertificates.ClearSelection();
                grdDocumentsAndCertificates.RunFilter(grdFilter);
            } else {
                grdDocumentsAndCertificates = new Grid({
                    keyfield: "SDC_ID",
                    columns: [
                        {
                            type: "string",
                            field: "SDC_DOCUMENTTYPE",
                            title: gridstrings.supplierdocuments[lang].documenttype,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SDC_DESCRIPTION",
                            title: gridstrings.supplierdocuments[lang].description,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "SDC_STARTDATE",
                            title: gridstrings.supplierdocuments[lang].startdate,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "SDC_ENDDATE",
                            title: gridstrings.supplierdocuments[lang].enddate,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SDC_CREATED",
                            title: gridstrings.supplierdocuments[lang].createdby,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SDC_CREATEDBY",
                            title: gridstrings.supplierdocuments[lang].created,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "SDC_UPDATED",
                            title: gridstrings.supplierdocuments[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SDC_UPDATEDBY",
                            title: gridstrings.supplierdocuments[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        SDC_STARTDATE: { type: "date" },
                        SDC_ENDDATE: { type: "date" },
                        USQ_CREATED: { type: "datetime" },
                        USQ_UPDATED: { type: "datetime" }
                    },
                    datasource: "/Api/ApiSupplierDocuments/List",
                    selector: "#grdDocumentsAndCertificates",
                    name: "grdDocumentsAndCertificates",
                    height: constants.defaultgridheight - 350,
                    filter: grdFilter,
                    sort: [{ field: "SDC_ID", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        var RegisterUIEvents = function () {

            $("#btnAddDocument").click(self.ResetUI);
            $("#btnSaveDocument").click(self.Save);
            $("#btnDeleteDocument").click(self.Delete);

            $("#btndocumenttype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#documenttype",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "SUPPLIERDOCUMENTTYPE", operator: "eq" }
                    ],
                });
            });

            $("#documenttype").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "SUPPLIERDOCUMENTTYPE", operator: "eq" }]
            });
           

        };

        RegisterUIEvents();

    }
    usr = new function () {

        var self = this;
        var selecteduser = null;
        var grdelm = $("#grdSupplierUsers");
        var grdSupplierUsers = null;
        var documentsHelper;
        var mobilePhoneHelper;

        this.qua = new function () {

            var self = this;
            var selectedqua = null;
            var grdelm = $("#grdUserQualifications");
            var grdUserQualifications = null;
            var documentsHelper;
            var commentsHelper;

            this.ResetUI = function () {

                selectedqua = null;
                tms.Reset("#userqualifications");

                $("#btnQuaBrowse").attr("disabled", "disabled");

                $("#qualification").val("");
                $("#qualificationdesc").val("");
                $("#quastartdate").val("");
                $("#expirationdate").val("");
                $("#certificationnumber").val("");
                $("#institutionofcourse").val("");
                $("#coursedate").val("");
                $("#durationofcourse").val("");
                $("#durationtype").val("");
                $("#costofcourse").val("");
                $("#recordcreationdate").val("");
                $("#educationplace").val("");
                $("#nameoftrainer").val("");
                $("#quacurrency").val("");
                $("#note").val("");
                $("#temporarilydisqualified").prop("checked", false);

                tooltip.hide("#qualification");
                tooltip.hide("#quacurrency");

                commentsHelper.clearComments();
                documentsHelper.clearDocuments();
            };
            var FillUserInterface = function () {

                tms.BeforeFill("#userqualifications");

                $("#btnQuaBrowse").removeAttr("disabled");

                $("#qualification").val(selectedqua.USQ_QUALIFICATION);
                $("#qualificationdesc").val(selectedqua.USQ_QUALIFICATIONDESC);
                $("#quastartdate").val(moment(selectedqua.USQ_STARTDATE).format(constants.dateformat));
                $("#expirationdate").val(moment(selectedqua.USQ_EXPIRATIONDATE).format(constants.dateformat));
                $("#note").val(selectedqua.USQ_NOTE);
                $("#temporarilydisqualified").prop("checked", selectedqua.USQ_TEMPORARILYDISQUALIFIED === "+");

                tooltip.show("#qualification", selectedqua.USQ_USRDESC);
                tooltip.show("#quacurrency", selectedqua.USQ_CURRDESC);

                $("#quadocuprogress").text("0%");
                $("#quadocuprogress").css("width", "0");

                commentsHelper.showCommentsBlock({ subject: "USERQUALIFICATION", source: selectedqua.USQ_ID });
                documentsHelper.showDocumentsBlock({ subject: "USERQUALIFICATION", source: selectedqua.USQ_ID });

            };
            this.Save = function () {

                if (!tms.Check("#userqualifications"))
                    return $.Deferred().reject();

                var o = JSON.stringify({
                    USQ_ID: selectedqua ? selectedqua.USQ_ID : 0,
                    USQ_QUALIFICATION: $("#qualification").val(),
                    USQ_USRCODE: selecteduser.USR_CODE,
                    USQ_STARTDATE: moment.utc($("#quastartdate").val(), constants.dateformat),
                    USQ_EXPIRATIONDATE: moment.utc($("#expirationdate").val(), constants.dateformat),
                    USQ_NOTE: $("#note").val(),
                    USQ_TEMPORARILYDISQUALIFIED: $("#temporarilydisqualified").prop("checked") ? "+" : "-",
                    USQ_CREATED: selectedqua != null ? selectedqua.USQ_CREATED : tms.Now(),
                    USQ_CREATEDBY: selectedqua != null ? selectedqua.USQ_CREATEDBY : user,
                    USQ_UPDATED: selectedqua != null ? tms.Now() : null,
                    USQ_UPDATEDBY: selectedqua != null ? user : null,
                    USQ_RECORDVERSION: selectedqua != null ? selectedqua.USQ_RECORDVERSION : 0

                });

                return tms.Ajax({
                    url: "/Api/ApiUserQualifications/Save",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        selectedqua = d.r;
                        self.List();
                        FillUserInterface();
                    }
                });
            };
            this.Delete = function () {
                if (selectedqua) {
                    $("#confirm").modal().off("click", "#delete").one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiUserQualifications/DelRec",
                                data: JSON.stringify(selectedqua.USQ_ID),
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
                    url: "/Api/ApiUserQualifications/Get",
                    data: JSON.stringify(selectedqua.USQ_ID),
                    fn: function (d) {
                        selectedqua = d.data;
                        FillUserInterface();
                    }
                });
            };
            var itemSelect = function (row) {
                selectedqua = grdUserQualifications.GetRowDataItem(row);
                LoadSelected();
            };
            var gridChange = function (e) {
                itemSelect(e.sender.select());
            };
            this.List = function () {
                var grdFilter = [{ field: "USQ_USRCODE", value: selecteduser.USR_CODE, operator: "eq", logic: "and" }];
                if (grdUserQualifications) {
                    grdUserQualifications.ClearSelection();
                    grdUserQualifications.RunFilter(grdFilter);
                } else {
                    grdUserQualifications = new Grid({
                        keyfield: "USQ_ID",
                        columns: [
                            {
                                type: "string",
                                field: "USQ_QUALIFICATION",
                                title: gridstrings.userqualifications[lang].quacode,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USQ_QUALIFICATIONDESC",
                                title: gridstrings.userqualifications[lang].quadesc,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USQ_USRCODE",
                                title: gridstrings.userqualifications[lang].usrcode,
                                width: 200
                            },
                            {
                                type: "date",
                                field: "USQ_STARTDATE",
                                title: gridstrings.userqualifications[lang].startdate,
                                width: 200
                            },
                            {
                                type: "date",
                                field: "USQ_EXPIRATIONDATE",
                                title: gridstrings.userqualifications[lang].expirationdate,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USQ_NOTE",
                                title: gridstrings.userqualifications[lang].note,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USQ_TEMPORARILYDISQUALIFIED",
                                title: gridstrings.userqualifications[lang].temporarilydisqualified,
                                width: 200
                            },
                            {
                                type: "datetime",
                                field: "USQ_CREATED",
                                title: gridstrings.userqualifications[lang].createdby,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USQ_CREATEDBY",
                                title: gridstrings.userqualifications[lang].created,
                                width: 200
                            },
                            {
                                type: "datetime",
                                field: "USQ_UPDATED",
                                title: gridstrings.userqualifications[lang].updated,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USQ_UPDATEDBY",
                                title: gridstrings.userqualifications[lang].updatedby,
                                width: 200
                            }
                        ],
                        fields:
                        {
                            USQ_STARTDATE: { type: "date" },
                            USQ_EXPIRATIONDATE: { type: "date" },
                            USQ_CREATED: { type: "datetime" },
                            USQ_UPDATED: { type: "datetime" }
                        },
                        datasource: "/Api/ApiUserQualifications/List",
                        selector: "#grdUserQualifications",
                        name: "grdUserQualifications",
                        height: 300,
                        filter: grdFilter,
                        sort: [{ field: "USQ_ID", dir: "desc" }],
                        change: gridChange
                    });
                }
            };
            var RegisterUIEvents = function () {

                $("#btnAddUserQualifications").click(self.ResetUI);
                $("#btnSaveUserQualifications").click(self.Save);
                $("#btnDeleteUserQualifications").click(self.Delete);

                $("#btnquacurrency").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.currencies[lang].title,
                        listurl: "/Api/ApiCurrencies/List",
                        keyfield: "CUR_CODE",
                        codefield: "CUR_CODE",
                        textfield: "CUR_DESC",
                        returninput: "#quacurrency",
                        columns: [
                            { type: "string", field: "CUR_CODE", title: gridstrings.currencies[lang].code, width: 100 },
                            { type: "string", field: "CUR_DESC", title: gridstrings.currencies[lang].description, width: 400 }
                        ],
                        filter: [
                            { field: "CUR_ACTIVE", value: "+", operator: "eq" }
                        ],

                    });
                });
                $("#btnqualifications").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.qualifications[lang].title,
                        listurl: "/Api/ApiQualifications/List",
                        keyfield: "QUL_CODE",
                        codefield: "QUL_CODE",
                        textfield: "QUL_DESC",
                        returninput: "#qualification",
                        columns: [
                            { type: "string", field: "QUL_CODE", title: gridstrings.qualifications[lang].code, width: 100 },
                            { type: "string", field: "QUL_DESC", title: gridstrings.qualifications[lang].description, width: 400 }
                        ],
                        filter: [
                            { field: "QUL_ACTIVE", value: "+", operator: "eq" }
                        ],
                        callback: function (data) {
                            $("#qualificationdesc").val(data ? data.QUL_DESC : "");
                        }
                    });
                });

                $("#quacurrency").autocomp({
                    listurl: "/Api/ApiCurrencies/List",
                    geturl: "/Api/ApiCurrencies/Get",
                    field: "CUR_CODE",
                    textfield: "CUR_DESC",
                    active: "CUR_ACTIVE"
                });
                $("#qualification").autocomp({
                    listurl: "/Api/ApiQualifications/List",
                    geturl: "/Api/ApiQualifications/Get",
                    field: "QUA_CODE",
                    textfield: "QUA_DESC",
                    active: "QUA_ACTIVE",
                    callback: function (data) {
                        $("#qualificationdesc").val(data ? data.QUA_DESC : "");
                    }
                });

                documentsHelper = new documents({
                    input: "#quafu",
                    filename: "#quafilename",
                    uploadbtn: "#btnquaupload",
                    container: "#quafupload",
                    documentsdiv: "#quadocs",
                    progressbar: "#quadocuprogress"
                });
                commentsHelper = new comments({ input: "#comment", btnaddcomment: "#addComment", commentsdiv: "#comments" });

            };

            RegisterUIEvents();
        };
        this.rec = new function () {

            var CheckNewPassword = function () {
                var strongRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
                var pwd = $("#password").val();
                if (!pwd) {
                    return false;
                } else if (!strongRegex.test(pwd)) {
                    return false;
                };
                return true;
            };
            var SaveNewPassword = function () {
                if (!CheckNewPassword()) {
                    msgs.error(applicationstrings[lang].pswdcomplexity);
                    return $.Deferred().reject();
                }

                var o = JSON.stringify({
                    USR_CODE: selecteduser.USR_CODE,
                    USR_PASSWORD: $("#password").val(),
                    USR_UPDATED: selecteduser != null ? tms.Now() : null,
                    USR_UPDATEDBY: selecteduser != null ? user : null
                });

                return tms.Ajax({
                    url: "/Api/ApiUsers/NewPassword",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        $("#password,#passwordagain").val("").attr("type", "text");
                        $("#modalpass").modal("hide");
                    }
                });
            };
            this.LoadDocumentTypes = function () {
                var gridreq = {
                    sort: [{ field: "SYC_CODE", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "USERDOCTYPE", operator: "eq" }
                        ]
                    }
                };

                return tms.Ajax({
                    url: "/Api/ApiSystemCodes/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        $("#doctype_users option:not(.default)").remove();
                        var strOptions = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strOptions += "<option value=\"" +
                                d.data[i].SYC_CODE +
                                "\">" +
                                d.data[i].SYC_DESCF +
                                "</option>";
                        }
                        $("#doctype_users").append(strOptions);
                    }
                });
            };
            var BuildModals = function () {
                $("#btnusergroup").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.usergroup[lang].title,
                        listurl: "/Api/ApiUserGroups/List",
                        keyfield: "UGR_CODE",
                        codefield: "UGR_CODE",
                        textfield: "UGR_DESC",
                        returninput: "#usergroup",
                        columns: [
                            { type: "string", field: "UGR_CODE", title: gridstrings.usergroup[lang].usergroup, width: 100 },
                            {
                                type: "string",
                                field: "UGR_DESC",
                                title: gridstrings.usergroup[lang].description,
                                width: 300
                            }
                        ],
                        filter: [
                            { field: "UGR_ACTIVE", value: "+", operator: "eq" },
                            { field: "UGR_CODE", value: "*", operator: "neq" },
                            { field: "UGR_CLASS", value: "SUPPLIER", operator: "eq" }

                        ]
                    });
                });
                $("#btnshoesize").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#shoesize",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "SHOESIZE", operator: "eq" }
                        ],
                    });
                });
                $("#btntshirtsize").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#tshirtsize",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "SIZE", operator: "eq" }
                        ],
                    });
                });
                $("#btnpantsize").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#pantsize",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "PANTSIZE", operator: "eq" }
                        ],
                    });
                });
                $("#btnpolarsize").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#polarsize",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "SIZE", operator: "eq" }
                        ],
                    });
                });
                $("#btntrade").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.trades[lang].title,
                        listurl: "/Api/ApiTrades/List",
                        keyfield: "TRD_CODE",
                        codefield: "TRD_CODE",
                        textfield: "TRD_DESC",
                        returninput: "#trade",
                        columns: [
                            { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                            { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }
                        ],
                        filter: [
                            { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                            { field: "TRD_SUPPLIER", value: supplier || suppliercode, operator: "eq" }
                        ]
                    });
                });
                $("#btnappstatus").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#appstatus",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "USERAPPSTATUS", operator: "eq" }
                        ],
                        callback: function (d) {
                            if (d && d.SYC_CODE === "IADEEDILDI") {
                                $("#divreturnreason").removeClass("hidden");
                                $("#returnreason").addClass("required");
                            }
                            else {
                                $("#divreturnreason").addClass("hidden");
                                $("#returnreason").val("").removeClass("required isempty");
                            }
                        }
                    });
                });
                $("#btnlicenseclass").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#licenseclass",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "EHLIYETSINIFI", operator: "eq" }
                        ],
                    });
                });
                $("#btnduty").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#duty",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "USRDUTY", operator: "eq" }
                        ],
                    });
                });
                $("#btnleavingreason").click(function () {
                    gridModal.show({
                        modaltitle: gridstrings.systemcodes[lang].title,
                        listurl: "/Api/ApiSystemCodes/List",
                        keyfield: "SYC_CODE",
                        codefield: "SYC_CODE",
                        textfield: "SYC_DESCF",
                        returninput: "#leavingreason",
                        columns: [
                            { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                            { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                        ],
                        filter: [
                            { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                            { field: "SYC_GROUP", value: "USRLEAVINGREASON", operator: "eq" }
                        ],
                    });
                });
            }
            var AutoComplete = function () {
                $("#shoesize").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "SHOESIZE", operator: "eq" }]
                });
                $("#tshirtsize").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "SIZE", operator: "eq" }]
                });
                $("#pantsize").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "PANTSIZE", operator: "eq" }]
                });
                $("#polarsize").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "SIZE", operator: "eq" }]
                });
                $("#usergroup").autocomp({
                    listurl: "/Api/ApiUserGroups/List",
                    geturl: "/Api/ApiUserGroups/Get",
                    field: "UGR_CODE",
                    textfield: "UGR_DESC",
                    active: "UGR_ACTIVE",
                    filter: [
                        { field: "UGR_CODE", value: "*", operator: "neq" },
                        { field: "UGR_CLASS", value: "SUPPLIER", operator: "eq" }
                    ]
                });
                $("#trade").autocomp({
                    listurl: "/Api/ApiTrades/List",
                    geturl: "/Api/ApiTrades/Get",
                    field: "TRD_CODE",
                    textfield: "TRD_DESC",
                    active: "TRD_ACTIVE",
                    filter: [
                        { field: "TRD_ORGANIZATION", relfield: "#org", includeall: true },
                        { field: "TRD_SUPPLIER", func: function () { return supplier || suppliercode }, operator: "eq" }
                    ]
                });
                $("#appstatus").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "USERAPPSTATUS", operator: "eq" }],
                    callback: function (d) {
                        if (d && d.SYC_CODE === "IADEEDILDI") {
                            $("#divreturnreason").removeClass("hidden");
                            $("#returnreason").addClass("required");
                        }
                        else {
                            $("#divreturnreason").addClass("hidden");
                            $("#returnreason").val("").removeClass("required isempty");
                        }
                    }
                });
                $("#licenseclass").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "EHLIYETSINIFI", operator: "eq" }]
                });
                $("#duty").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "USRDUTY", operator: "eq" }]
                });
                $("#leavingreason").autocomp({
                    listurl: "/Api/ApiSystemCodes/List",
                    geturl: "/Api/ApiSystemCodes/Get",
                    field: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    active: "SYC_ACTIVE",
                    filter: [{ field: "SYC_GROUP", value: "USRLEAVINGREASON", operator: "eq" }]
                });
            }
            this.ResetUI = function () {

                selecteduser = null;

                tms.Reset("#userrecord");

                $("#btnBrowse_users,#btnSendForApproval").attr("disabled", "disabled");

                $("#usrcode").val("");
                $("#desc").val("");
                $("#usergroup").val("");
                $("#trade").val("");
                $("#usremail").val("");
                $("#startdate").val("");
                $("#enddate").val("");
                $("#shoesize").val("");
                $("#tshirtsize").val("");
                $("#pantsize").val("");
                $("#polarsize").val("");
                $("#edustatus").val("");
                $("#lastgraduatedschool").val("");
                $("#lastgraduateddepartment").val("");
                $("#lastgraduateddate").val("");
                $("#birthdate").val("");
                $("#tcnumber").val("");
                $("#licenseissuedate").val("");
                $("#licenseclass").removeClass("required isempty").prop("disabled", true);
                $("#licenseissuedate").removeClass("required isempty").prop("disabled", true);
                $("#btnlicenseclass").prop("disabled", true);
                $("#drivinglicense").prop("checked", false);
                $('input[name="gtype"]').prop('checked', false);
                $("#active").prop("checked", false);
                $("#tms").prop("checked", false);
                $("#mobile").prop("checked", false);
                $("#appstatus").val("");
                $("#duty").val("");

                $("#divreturnreason").addClass("hidden");
                $("#returnreason").val("").removeClass("required isempty");
                $("#divleavingreason").addClass("hidden");
                $("#leavingreason").val("").removeClass("required isempty");

                tooltip.hide("#usergroup");
                tooltip.hide("#trade");
                tooltip.hide("#shoesize");
                tooltip.hide("#tshirtsize");
                tooltip.hide("#pantsize");
                tooltip.hide("#polarsize");
                tooltip.hide("#appstatus");
                tooltip.hide("#duty");

                documentsHelper.clearDocuments();
                mobilePhoneHelper.clear();


            }
            var FillUserInterface = function () {

                if (tms.ActiveTab("#users") === "userrecord")
                    tms.BeforeFill("#userrecord");

                $("#btnBrowse_users").removeAttr("disabled");

                if ($.inArray(selecteduser.USR_APPSTATUS, ["YENIKAYIT", "IADEEDILDI","MEVCUTKAYIT"]) !== -1)
                    $("#btnSendForApproval").removeAttr("disabled");
                else
                    $("#btnSendForApproval").attr("disabled", "disabled");

                $("#usrcode").val(selecteduser.USR_CODE);
                $("#desc").val(selecteduser.USR_DESC);
                $("#usergroup").val(selecteduser.USR_GROUP);
                $("#trade").val(selecteduser.USR_TRADE);
                $("#usremail").val(selecteduser.USR_EMAIL);
                $("#startdate").val(selecteduser.USR_STARTDATE
                    ? moment(selecteduser.USR_STARTDATE).format(constants.dateformat)
                    : null);
                $("#enddate").val(selecteduser.USR_ENDDATE
                    ? moment(selecteduser.USR_ENDDATE).format(constants.dateformat)
                    : null);

                $("input[name=gtype][value=\"" + selecteduser.USR_GENDER + "\"]").prop("checked", true);
                $("#shoesize").val(selecteduser.USR_SHOESIZE);
                $("#tshirtsize").val(selecteduser.USR_TSHIRTSIZE);
                $("#pantsize").val(selecteduser.USR_PANTSIZE);
                $("#polarsize").val(selecteduser.USR_POLARSIZE);
                $("#edustatus").val(selecteduser.USR_EDUCATIONSTATUS || "");
                $("#lastgraduatedschool").val(selecteduser.USR_LASTGRADUATEDSCHOOL);
                $("#lastgraduateddepartment").val(selecteduser.USR_LASTGRADUATEDDEPARTMENT);
                $("#lastgraduateddate").val(selecteduser.USR_LASTGRADUATEDDATE
                    ? moment(selecteduser.USR_LASTGRADUATEDDATE).format(constants.dateformat)
                    : null);
                $("#birthdate").val(selecteduser.USR_BIRTHDATE
                    ? moment(selecteduser.USR_BIRTHDATE).format(constants.dateformat)
                    : null);
                $("#tcnumber").val(selecteduser.USR_TCNUMBER);
                $("#drivinglicense").prop("checked", selecteduser.USR_DRIVINGLICENSE === '+');
                $("#appstatus").val(selecteduser.USR_APPSTATUS);
                $("#active").prop("checked", selecteduser.USR_ACTIVE === "+");
                $("#pta").prop("checked", selecteduser.USR_INTA === "+");
                $("#tms").prop("checked", selecteduser.USR_TMS === "+");
                $("#mobile").prop("checked", selecteduser.USR_MOBILE === "+");
                $("#duty").val(selecteduser.USR_DUTY);

                if (selecteduser.USR_DRIVINGLICENSE === "+") {
                    $("#licenseclass").val(selecteduser.USR_DRIVINGLICENSECLASS);
                    $("#licenseissuedate").val(selecteduser.USR_LICENSEISSUEDATE
                        ? moment(selecteduser.USR_LICENSEISSUEDATE).format(constants.dateformat)
                        : null);
                    $("#licenseclass").addClass("required").prop("disabled", false);
                    $("#licenseissuedate").addClass("required").prop("disabled", false);
                    $("#btnlicenseclass").prop("disabled", false);

                }
                else {
                    $("#licenseclass").val("");
                    $("#licenseissuedate").val("");
                    $("#licenseclass").removeClass("required").prop("disabled", true);
                    $("#licenseissuedate").removeClass("required").prop("disabled", true);
                    $("#btnlicenseclass").prop("disabled", true);

                }

                if (selecteduser.USR_APPSTATUS === "IADEEDILDI") {
                    $("#divreturnreason").removeClass("hidden");
                    $("#returnreason").val(selecteduser.USR_RETURNREASON).addClass("required");
                    tooltip.show("#returnreason", selecteduser.USR_APPSTATUSDESC);

                }
                else {
                    $("#divreturnreason").addClass("hidden");
                    $("#returnreason").val("").removeClass("required isempty");
                    tooltip.hide("#returnreason");
                }

                if (!!selecteduser.USR_ENDDATE) {
                    $("#divleavingreason").removeClass("hidden");
                    $("#leavingreason").val(selecteduser.USR_LEAVINGREASON).addClass("required");
                    tooltip.show("#leavingreason", selecteduser.USR_LEAVINGREASONDESC);
                }
                else {
                    $("#divleavingreason").addClass("hidden");
                    $("#leavingreason").val("").removeClass("required isempty");
                    tooltip.hide("#leavingreason");
                }

                tooltip.show("#usergroup", selecteduser.USR_GROUPDESC);
                tooltip.show("#trade", selecteduser.USR_TRADEDESC);
                tooltip.show("#shoesize", selecteduser.USR_SHOESIZEDESC);
                tooltip.show("#tshirtsize", selecteduser.USR_TSHIRTSIZEDESC);
                tooltip.show("#pantsize", selecteduser.USR_PANTSIZEDESC);
                tooltip.show("#polarsize", selecteduser.USR_POLARSIZEDESC);
                tooltip.show("#appstatus", selecteduser.USR_APPSTATUSDESC);
                tooltip.show("#duty", selecteduser.USR_DUTYDESC);


                documentsHelper.showDocumentsBlock({ subject: "USER", source: selecteduser.USR_CODE });
                mobilePhoneHelper.setvalue(selecteduser.USR_PHONENUMBER);


            }
            this.LoadSelected = function () {
                return tms.Ajax({
                    url: "/Api/ApiUsers/Get",
                    data: JSON.stringify(selecteduser.USR_CODE),
                    fn: function (d) {
                        selecteduser = d.data;
                        FillUserInterface();
                    }
                });
            };
            var Check = function () {

                var tcnumber = $("#tcnumber").val();
                if (tcnumber.length != 11 && tcnumber.length != 0) {
                    msgs.error(applicationstrings[lang].tcknerr);
                    return false;
                }
                var birthdate = moment($("#birthdate").val(), constants.dateformat);
                if (birthdate > tms.Now().startOf('day')) {
                    msgs.error(applicationstrings[lang].birthdateerr);
                    return false;
                }
                var licenseissuedate = moment($("#licenseissuedate").val(), constants.dateformat);
                if (licenseissuedate > tms.Now().startOf('day')) {
                    msgs.error(applicationstrings[lang].licenseissuedateerr);
                    return false;
                }
                var lastgraduateddate = moment($("#lastgraduateddate").val(), constants.dateformat);
                if (lastgraduateddate > tms.Now().startOf('day')) {
                    msgs.error(applicationstrings[lang].lastgraduateddateerr);
                    return false;
                }
                var startdate = moment($("#startdate").val(), constants.dateformat);
                var enddate = moment($("#enddate").val(), constants.dateformat);

                if (startdate > enddate) {
                    msgs.error(applicationstrings[lang].dateerr1);
                    return false;
                }

                var phoneno = mobilePhoneHelper.getvalue();
                if (!phoneno) {
                    msgs.error(applicationstrings[lang].invalidphone);
                    return false;
                }

                return true;
            }
            this.Save = function () {

                if (!tms.Check() || !Check())
                    return $.Deferred().reject();

                var o = JSON.stringify({
                    USR_CODE: $("#usrcode").val(),
                    USR_DESC: $("#desc").val(),
                    USR_GROUP: $("#usergroup").val(),
                    USR_TRADE: $("#trade").val(),
                    USR_EMAIL: $("#usremail").val(),
                    USR_STARTDATE: ($("#startdate").val() ? moment.utc($("#startdate").val(), constants.dateformat) : null),
                    USR_ENDDATE: ($("#enddate").val() ? moment.utc($("#enddate").val(), constants.dateformat) : null),
                    USR_TCNUMBER: ($("#tcnumber").val() || null),
                    USR_GENDER: ($("input[name=\"gtype\"]:checked").val() || null),
                    USR_BIRTHDATE: ($("#birthdate").val() ? moment.utc($("#birthdate").val(), constants.dateformat) : null),
                    USR_EDUCATIONSTATUS: ($("#edustatus").val() || null),
                    USR_LASTGRADUATEDSCHOOL: ($("#lastgraduatedschool").val() || null),
                    USR_LASTGRADUATEDDEPARTMENT: ($("#lastgraduateddepartment").val() || null),
                    USR_LASTGRADUATEDDATE: ($("#lastgraduateddate").val() ? moment.utc($("#lastgraduateddate").val(), constants.dateformat) : null),
                    USR_PHONENUMBER: mobilePhoneHelper.getvalue(),
                    USR_SHOESIZE: ($("#shoesize").val() || null),
                    USR_TSHIRTSIZE: ($("#tshirtsize").val() || null),
                    USR_PANTSIZE: ($("#pantsize").val() || null),
                    USR_POLARSIZE: ($("#polarsize").val() || null),
                    USR_DRIVINGLICENSE: $("#drivinglicense").prop("checked") ? "+" : "-",
                    USR_DRIVINGLICENSECLASS: ($("#licenseclass").val() || null),
                    USR_LICENSEISSUEDATE: ($("#licenseissuedate").val() ? moment.utc($("#licenseissuedate").val(), constants.dateformat) : null),
                    USR_SUPPLIER: selectedrecord.SUP_CODE,
                    USR_MOBILE: $("#mobile").prop("checked") ? "+" : "-",
                    USR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                    USR_TMS: $("#tms").prop("checked") ? "+" : "-",
                    USR_INTA: $("#pta").prop("checked") ? "+" : "-",
                    USR_APPSTATUS: $("#appstatus").val(),
                    USR_RETURNREASON: ($("#returnreason").val() || null),
                    USR_LEAVINGREASON: ($("#leavingreason").val() || null),
                    USR_DUTY: ($("#duty").val() || null),
                    USR_RECORDVERSION: selectedrecord != null ? selectedrecord.USR_RECORDVERSION : 0
                })

                return tms.Ajax({
                    url: "/Api/ApiUsers/SaveSupplierUser",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        selecteduser = {
                            USR_CODE: d.r.USR_CODE
                        };
                        return self.rec.LoadSelected();

                    }
                });
            }
            this.SendForApproval = function () {
                if (!tms.Check() || !Check())
                    return $.Deferred().reject();
                return tms.Ajax({
                    url: "/Api/ApiUsers/SendForApproval",
                    data: JSON.stringify(selecteduser.USR_CODE),
                    fn: function (d) {
                        msgs.success(d.data);
                        return self.rec.LoadSelected();
                    }
                });
            }
            this.RegisterUIEvents = function () {

                $("#btnNewUser").click(self.rec.ResetUI);
                $("#btnSaveUser").click(self.rec.Save);
                $("#btnSendForApproval").click(self.rec.SendForApproval);


                $("#btnNewPassword").click(function () {
                    $("#password,#passwordagain").val("").attr("type", "password");
                    $("#modalpass").modal("show");
                });
                $("#btnSavePswd").click(SaveNewPassword);
                $("#password,#passwordagain").keyup(function () {
                    var $this = $(this);
                    var $thisagain = $($(this).data("dblcheck"));
                    $("#btnSavePswd").prop("disabled", $this.val() !== $thisagain.val());
                    if ($this.val()) {
                        if (CheckNewPassword()) {
                            $this.css({ "background-color": "#a8fba8" });
                        } else {
                            $this.css({ "background-color": "#ffc7c7" });
                        }
                    } else {
                        $this.css({ "background-color": "" });
                    }
                });

                $("#drivinglicense").on("change", function () {
                    var v = $(this).is(":checked");
                    if (v) {
                        $("#licenseclass").addClass("required").prop("disabled", false);
                        $("#licenseissuedate").addClass("required").prop("disabled", false);
                        $("#btnlicenseclass").prop("disabled", false);

                    }
                    else {
                        $("#licenseclass").val("");
                        $("#licenseissuedate").val("");
                        $("#licenseclass").removeClass("required isempty").prop("disabled", true);
                        $("#licenseissuedate").removeClass("required isempty").prop("disabled", true);
                        $("#btnlicenseclass").prop("disabled", true);
                    }
                });

                $("#enddate").on("dp.change", function () {
                    var v = $(this).val();
                    if (!!v) {
                        $("#divleavingreason").removeClass("hidden");
                        $("#leavingreason").val("").addClass("required");
                    }
                    else {
                        $("#divleavingreason").addClass("hidden");
                        $("#leavingreason").val("").removeClass("required isempty");
                    }
                });

                BuildModals();
                AutoComplete();

                documentsHelper = new documents({
                    input: "#fu_users",
                    filename: "#filename_users",
                    uploadbtn: "#btnupload_users",
                    container: "#fupload_users",
                    documentsdiv: "#docs_users",
                    progressbar: "#docuprogress_users",
                    doctype: "#doctype_users",
                    downloadbutton: "#btnDownload_users"
                });

                mobilePhoneHelper = new mobilephone({
                    prefix: "#usrphonenumberpfx",
                    number: "#usrphonenumber"
                });

                $("#btnDownload_users").on("click",
                    function () {
                        window.location = "/Download.ashx?subject=USER&source=" + selecteduser.USR_CODE;
                    });

                $("#desc").on("keyup", function () {
                    var txt = $(this).val();
                    var txtNonTr = txt.ReplaceTrChars();
                    var code = tms.UpperFormCode(txtNonTr).split(' ').join('.');
                    $("#usrcode").val(code);
                });
            }
        }
        this.list = new function () {
            var ItemSelect = function (row) {
                selecteduser = grdSupplierUsers.GetRowDataItem(row);
                $(".page-header h6").html(selecteduser.USR_CODE + " - " + selecteduser.USR_DESC);
                scr.Configure();
                tms.Tab();
            };
            var GridChange = function (e) {
                ItemSelect(e.sender.select());
            };
            var GridDataBound = function () {
                grdelm.find("[data-id]").on("dblclick",
                    function () {
                        $(".nav-pills a[href=\"#userrecord\"]").tab("show");
                    });
                var data = grdSupplierUsers.GetData();
                for (var i = 0; i < data.length; i++) {
                    var di = data[i];
                    if (di.USR_APPSTATUS === "IADEEDILDI") {
                        grdelm.find("tr[data-id=\"" + di.USR_CODE + "\"]").css({ background: "#efcdcd", color: "#000" });
                    }
                }
            };

            this.List = function () {
                var grdFilter = [{ field: "USR_SUPPLIER", value: selectedrecord.SUP_CODE, operator: "eq", logic: "and" }];

                if (grdSupplierUsers) {
                    grdSupplierUsers.ClearSelection();
                    grdSupplierUsers.RunFilter(grdFilter);
                } else {
                    grdSupplierUsers = new Grid({
                        keyfield: "USR_CODE",
                        columns: [
                            {
                                type: "string",
                                field: "USR_SUPPLIER",
                                title: gridstrings.user[lang].supplier,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USR_TRADE",
                                title: gridstrings.user[lang].trade,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "USR_CODE",
                                title: gridstrings.user[lang].pssusercode,
                                width: 200
                            },
                            {
                                type: "string",
                                field: "USR_DESC",
                                title: gridstrings.user[lang].namesurname,
                                width: 350
                            },
                            {
                                type: "string",
                                field: "USR_APPSTATUSDESC",
                                title: gridstrings.user[lang].appstatusdesc,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "USR_RETURNREASON",
                                title: gridstrings.user[lang].returnreason,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "USR_DUTYDESC",
                                title: gridstrings.user[lang].dutydesc,
                                width: 250
                            },
                            {
                                type: "date",
                                field: "USR_BIRTHDATE",
                                title: gridstrings.user[lang].birthdate,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "USR_TCNUMBER",
                                title: gridstrings.user[lang].tcnumber,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "USR_EDUCATIONSTATUS",
                                title: gridstrings.user[lang].educationstatus,
                                width: 250
                            },
                            {
                                type: "date",
                                field: "USR_STARTDATE",
                                title: gridstrings.user[lang].jobstartdate,
                                width: 150
                            },
                            {
                                type: "date",
                                field: "USR_ENDDATE",
                                title: gridstrings.user[lang].jobenddate,
                                width: 150
                            },
                            {
                                type: "string",
                                field: "USR_LEAVINGREASONDESC",
                                title: gridstrings.user[lang].leavingreason,
                                width: 250
                            },
                            {
                                type: "string",
                                field: "USR_TMS",
                                title: gridstrings.user[lang].pssuser,
                                width: 150
                            }
                        ],
                        fields:
                        {
                            USR_STARTDATE: { type: "date" },
                            USR_ENDDATE: { type: "date" },
                            USR_BIRTHDATE: { type: "date" }
                        },
                        datasource: "/Api/ApiUsers/List",
                        selector: "#grdSupplierUsers",
                        name: "grdSupplierUsers",
                        height: constants.defaultgridheight - 110,
                        primarycodefield: "USR_CODE",
                        primarytextfield: "USR_DESC",
                        visibleitemcount: 10,
                        filter: grdFilter,
                        filterlogic: "or",
                        sort: [{ field: "USR_CODE", dir: "desc" }],
                        toolbarColumnMenu: true,
                        toolbar: {
                            right: [
                                "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].download #\" download=\"Users.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                                "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                            ]
                        },
                        databound: GridDataBound,
                        change: GridChange
                    });
                }
            }
        }

        
        var RegisterTabChange = function () {
            $("ul.nav.nav-pills a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#userlist":
                        selecteduser = null;
                        self.list.List();
                        break;
                    case "#userrecord":
                        if (!selecteduser)
                            self.rec.ResetUI();
                        else
                            self.rec.LoadSelected();
                        break;
                    case "#userqualifications":
                        self.qua.ResetUI();
                        self.qua.List(selecteduser);                      
                }
                scr.Configure();
            });
        };

        self.rec.RegisterUIEvents();
        RegisterTabChange();


    }
    veh = new function () {

        var self = this;
        var selectedvehicle = null;
        var grdelm = $("#grdSupplierVehicles");
        var grdSupplierVehicles = null;
        var documentsHelper;


        var ValidatePlate = function () {
            var regex, v;
            var val = $("#vehlicenseplate").val();
            v = val.replace(/\s+/g, "").toUpperCase();
            regex = /^(0[1-9]|[1-7][0-9]|8[01])(([A-Z])(\d{4,5})|([A-Z]{2})(\d{3,4})|([A-Z]{3})(\d{2,3}))$/;
            if (v.match(regex) == null) {
                msgs.error(applicationstrings[lang].invalidlicenseplate);
                $("#vehlicenseplate").val("");
                return false;
            }

            return true;
        }

        var ValidateYear = function() {
            var val = $("#vehmodelyear").val();
            if (val.length !== 4) {
                msgs.error(applicationstrings[lang].invalidyear);
                $("#vehmodelyear").val("");
                return false;
            }
            return true;

        }

        var CheckScreen = function () {
            if (!ValidatePlate()) {
                return false;
            }
            if (!ValidateYear()) {
                return false;
            }
            return true;
        }

        var ItemSelect = function (row) {
            selectedvehicle = grdSupplierVehicles.GetRowDataItem(row);
            self.LoadSelected();
        };

        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };

        var BuildModals = function () {
            $("#btnvehbrand").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#vehbrand",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "VEHBRAND", operator: "eq" }
                    ],
                });
            });
            $("#btnvehmodel").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#vehmodel",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "VEHMODEL", operator: "eq" }
                    ],
                });
            });
            $("#btnvehcolor").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#vehcolor",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "COLOR", operator: "eq" }
                    ],
                });
            });
            $("#btnvehownership").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#vehownership",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "OWNERSHIP", operator: "eq" }
                    ],
                });
            });
        }

        var AutoComplete = function () {
            $("#vehbrand").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "VEHBRAND", operator: "eq" }]
            });
            $("#vehmodel").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "VEHMODEL", operator: "eq" }]
            });
            $("#vehcolor").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "COLOR", operator: "eq" }]
            });
            $("#vehownership").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "OWNERSHIP", operator: "eq" }]
            });
        }

        this.ResetUI = function () {


            selectedvehicle = null;
            tms.Reset("#vehicles");

            $("#btnVehicleBrowse").attr("disabled", "disabled");

            $("#vehbrand").val("");
            $("#vehmodel").val("");
            $("#vehlicenseplate").val("");
            $("#vehmodelyear").val("");
            $("#vehcolor").val("");
            $("#vehiclewrap").prop("checked", false);
            $("#vehownership").val("");

            $("#vehiclewrapdate").val("");
            $("#vehiclewrapdate").removeClass("required");
            $("#div_vehiclewrapdate").addClass("hidden");

            tooltip.hide("#vehbrand");
            tooltip.hide("#vehmodel");
            tooltip.hide("#vehcolor");
            tooltip.hide("#vehownership");

            documentsHelper.clearDocuments();

        };

        var FillUserInterface = function () {

            tms.BeforeFill("#vehicles");

            $("#btnVehicleBrowse").removeAttr("disabled");


            $("#vehbrand").val(selectedvehicle.SVH_BRAND);
            $("#vehmodel").val(selectedvehicle.SVH_MODEL);
            $("#vehlicenseplate").val(selectedvehicle.SVH_LICENSEPLATE);
            $("#vehmodelyear").val(selectedvehicle.SVH_YEAR);
            $("#vehcolor").val(selectedvehicle.SVH_COLOR);
            $("#vehiclewrap").prop("checked", selectedvehicle.SVH_VEHICLEWRAP === "+");
            $("#vehownership").val(selectedvehicle.SVH_OWNERSHIP);

            if (selectedvehicle.SVH_VEHICLEWRAP === "+") {
                $("#vehiclewrapdate").val(moment(selectedvehicle.SVH_VEHICLEWRAPDATE).format(constants.dateformat));
                $("#vehiclewrapdate").addClass("required");
                $("#div_vehiclewrapdate").removeClass("hidden");
            }
            else {
                $("#vehiclewrapdate").val("");
                $("#vehiclewrapdate").removeClass("required");
                $("#div_vehiclewrapdate").addClass("hidden");
            }

            tooltip.show("#vehbrand", selectedvehicle.SVH_BRANDDESC);
            tooltip.show("#vehmodel", selectedvehicle.SVH_MODELDESC);
            tooltip.show("#vehcolor", selectedvehicle.SVH_COLORDESC);
            tooltip.show("#vehownership", selectedvehicle.SVH_OWNERSHIPDESC);

            documentsHelper.showDocumentsBlock({ subject: "VEHICLE", source: selectedvehicle.SVH_ID });;



        }

        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiSupplierVehicles/Get",
                data: JSON.stringify(selectedvehicle.SVH_ID),
                fn: function (d) {
                    selectedvehicle = d.data;
                    FillUserInterface();
                }
            });
        };

        this.List = function () {
            var grdFilter = [{ field: "SVH_SUPPLIER", value: selectedrecord.SUP_CODE, operator: "eq", logic: "and" }];
            if (grdSupplierVehicles) {
                grdSupplierVehicles.ClearSelection();
                grdSupplierVehicles.RunFilter(grdFilter);
            } else {
                grdSupplierVehicles = new Grid({
                    keyfield: "SVH_ID",
                    columns: [
                        {
                            type: "string",
                            field: "SVH_BRANDDESC",
                            title: gridstrings.suppliervehicles[lang].branddesc,
                            width: 100
                        },
                        {
                            type: "string",
                            field: "SVH_MODELDESC",
                            title: gridstrings.suppliervehicles[lang].modeldesc,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SVH_YEAR",
                            title: gridstrings.suppliervehicles[lang].year,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SVH_LICENSEPLATE",
                            title: gridstrings.suppliervehicles[lang].licenseplate,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SVH_COLORDESC",
                            title: gridstrings.suppliervehicles[lang].color,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SVH_VEHICLEWRAP",
                            title: gridstrings.suppliervehicles[lang].vehiclewrap,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "SVH_VEHICLEWRAPDATE",
                            title: gridstrings.suppliervehicles[lang].vehiclewrapdate,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SVH_OWNERSHIPDESC",
                            title: gridstrings.suppliervehicles[lang].ownershipdesc,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        SVH_VEHICLEWRAPDATE: { type: "date" },
                        SVH_YEAR: { type: "number" }
                    },
                    datasource: "/Api/ApiSupplierVehicles/List",
                    selector: "#grdSupplierVehicles",
                    name: "grdSupplierVehicles",
                    height: 250,
                    filter: grdFilter,
                    sort: [{ field: "SVH_ID", dir: "desc" }],
                    change: GridChange
                });
            }
        }

        this.Save = function () {

            if (!tms.Check("#vehicles") || !CheckScreen())
                return;

            var o = JSON.stringify({
                SVH_ID: (selectedvehicle != null ? selectedvehicle.SVH_ID : 0),
                SVH_SUPPLIER: selectedrecord.SUP_CODE,
                SVH_BRAND: $("#vehbrand").val(),
                SVH_MODEL: $("#vehmodel").val(),
                SVH_LICENSEPLATE: $("#vehlicenseplate").val(),
                SVH_YEAR: $("#vehmodelyear").val(),
                SVH_COLOR: $("#vehcolor").val(),
                SVH_VEHICLEWRAP: $("#vehiclewrap").prop("checked") ? "+" : "-",
                SVH_VEHICLEWRAPDATE: $("#vehiclewrap").prop("checked") ? moment.utc($("#vehiclewrapdate").val(), constants.dateformat) :null,
                SVH_OWNERSHIP: $("#vehownership").val(),
                SVH_CREATED: selectedvehicle != null ? selectedvehicle.SVH_CREATED : tms.Now(),
                SVH_CREATEDBY: selectedvehicle != null ? selectedvehicle.SVH_CREATEDBY : user,
                SVH_UPDATED: selectedvehicle != null ? tms.Now() : null,
                SVH_UPDATEDBY: selectedvehicle != null ? user : null,
                SVH_RECORDVERSION: selectedvehicle != null ? selectedvehicle.SVH_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiSupplierVehicles/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });

        }

        this.Delete = function () {
            if (selectedvehicle) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiSupplierVehicles/DelRec",
                            data: JSON.stringify(selectedvehicle.SVH_ID),
                            fn: function (d) {
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        }

        var RegisterUIEvents = function () {

            $("#btnAddVehicle").click(self.ResetUI);
            $("#btnSaveVehicle").click(self.Save);
            $("#btnDeleteVehicle").click(self.Delete);

            $("#vehiclewrap").on("change", function () {
                var v = $(this).is(":checked");
                if (v) {
                    $("#div_vehiclewrapdate").removeClass("hidden");
                    $("#vehiclewrapdate").addClass("required");
                }
                else {
                    $("#div_vehiclewrapdate").addClass("hidden");
                    $("#vehiclewrapdate").removeClass("required isempty");
                }
            });

            documentsHelper = new documents({
                input: "#fu_vehicle",
                filename: "#filename_vehicle",
                uploadbtn: "#btnupload_vehicle",
                container: "#fupload_vehicle",
                documentsdiv: "#docs_vehicle",
                progressbar: "#docuprogress_vehicle",
                imageonly : true
            });

            BuildModals();
            AutoComplete();
        }

        RegisterUIEvents();

    }
    dvr = new function () {

        var self = this;
        var selecteddvr = null;
        var grdelm = $("#grdDelivery");
        var grdDelivery = null;
        var documentsHelper;

        this.ResetUI = function () {

            selecteddvr = null;
            tms.Reset("#deliveries");

            $("#btnDvrBrowse").attr("disabled", "disabled");

            $("#deliveryuser").val("");
            $("#deliverytype").val("");
            $("#quantity").val("");
            $("#uom").val("");
            $("#deliverydate").val("");

            tooltip.hide("#deliveryuser");
            tooltip.hide("#deliverytype");
            tooltip.hide("#uom");

            documentsHelper.clearDocuments();
        };
        var FillUserInterface = function () {

            tms.BeforeFill("#deliveries");

            $("#btnDvrBrowse").removeAttr("disabled");

            $("#deliveryuser").val(selecteddvr.DEL_USER);
            $("#deliverytype").val(selecteddvr.DEL_TYPE);
            $("#quantity").val(selecteddvr.DEL_QTY);
            $("#uom").val(selecteddvr.DEL_UOM);
            $("#deliverydate").val(moment(selecteddvr.DEL_DATE).format(constants.dateformat));

            tooltip.show("#deliveryuser", selecteddvr.DEL_USERDESC);
            tooltip.show("#deliverytype", selecteddvr.DEL_TYPEDESC);
            tooltip.show("#uom", selecteddvr.DEL_UOMDESC);

            $("#dvrdocuprogress").text("0%");
            $("#dvrdocuprogress").css("width", "0");

            documentsHelper.showDocumentsBlock({ subject: "USERDELIVERY", source: selecteddvr.DEL_ID });

        };
        this.Save = function () {

            if (!tms.Check("#deliveries"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                DEL_ID: selecteddvr ? selecteddvr.DEL_ID : 0,
                DEL_SUPPLIER: selectedrecord.SUP_CODE,
                DEL_USER: $("#c").val(),
                DEL_TYPE: $("#deliverytype").val(),
                DEL_QTY: $("#quantity").val(),
                DEL_UOM: $("#uom").val(),
                DEL_DATE: moment.utc($("#deliverydate").val(), constants.dateformat),
                DEL_CREATED: selecteddvr != null ? selecteddvr.DEL_CREATED : tms.Now(),
                DEL_CREATEDBY: selecteddvr != null ? selecteddvr.DEL_CREATEDBY : user,
                DEL_UPDATED: selecteddvr != null ? tms.Now() : null,
                DEL_UPDATEDBY: selecteddvr != null ? user : null,
                DEL_RECORDVERSION: selecteddvr != null ? selecteddvr.DEL_RECORDVERSION : 0

            });

            return tms.Ajax({
                url: "/Api/ApiSupplierDelivery/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selecteddvr = d.r;
                    self.List();
                    FillUserInterface();
                }
            });
        };
        this.Delete = function () {
            if (selecteddvr) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiSupplierDelivery/DelRec",
                            data: JSON.stringify(selecteddvr.DEL_ID),
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
                url: "/Api/ApiSupplierDelivery/Get",
                data: JSON.stringify(selecteddvr.DEL_ID),
                fn: function (d) {
                    selecteddvr = d.data;
                    FillUserInterface();
                }
            });
        };
        var itemSelect = function (row) {
            selecteddvr = grdDelivery.GetRowDataItem(row);
            LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        this.List = function () {
            var grdFilter = [{ field: "DEL_SUPPLIER", value: selectedrecord.SUP_CODE, operator: "eq", logic: "and" }];
            if (grdDelivery) {
                grdDelivery.ClearSelection();
                grdDelivery.RunFilter(grdFilter);
            } else {
                grdDelivery = new Grid({
                    keyfield: "DEL_ID",
                    columns: [
                        {
                            type: "string",
                            field: "DEL_USER",
                            title: gridstrings.supplierdelivery[lang].user,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "DEL_USERDESC",
                            title: gridstrings.supplierdelivery[lang].userdesc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "DEL_TYPE",
                            title: gridstrings.supplierdelivery[lang].deliverytype,
                            width: 200
                        },
                        {
                            type: "qty",
                            field: "DEL_QTY",
                            title: gridstrings.supplierdelivery[lang].quantity,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "DEL_UOM",
                            title: gridstrings.supplierdelivery[lang].uom,
                            width: 200
                        },
                        {
                            type: "date",
                            field: "DEL_DATE",
                            title: gridstrings.supplierdelivery[lang].deliverydate,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "DEL_CREATED",
                            title: gridstrings.supplierdelivery[lang].createdby,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "DEL_CREATEDBY",
                            title: gridstrings.supplierdelivery[lang].created,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "DEL_UPDATED",
                            title: gridstrings.supplierdelivery[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "DEL_UPDATEDBY",
                            title: gridstrings.supplierdelivery[lang].updatedby,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        DEL_QTY: { type: "number" },
                        DEL_DATE: { type: "date" },
                        USQ_CREATED: { type: "datetime" },
                        USQ_UPDATED: { type: "datetime" }
                    },
                    datasource: "/Api/ApiSupplierDelivery/List",
                    selector: "#grdDelivery",
                    name: "grdDelivery",
                    height: !!supplier ? constants.defaultgridheight - 120 : 300,
                    filter: grdFilter,
                    sort: [{ field: "DEL_ID", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        var RegisterUIEvents = function () {

            $("#btnAddDelivery").click(self.ResetUI);
            $("#btnSaveDelivery").click(self.Save);
            $("#btnDeleteDelivery").click(self.Delete);

            $("#btndeliverytype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#deliverytype",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "DELIVERYTYPE", operator: "eq" }
                    ],
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
            $("#btndeliveryuser").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#deliveryuser",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_SUPPLIER", value: selectedrecord.SUP_CODE, operator: "eq" }
                    ]                    
                });
            });

            $("#deliveryuser").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [
                    { field: "USR_SUPPLIER", func: function () { return selectedrecord.SUP_CODE; }, operator: "eq" }
                ],
            });

            $("#deliverytype").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "DELIVERYTYPE", operator: "eq" }]
            });
            $("#uom").autocomp({
                listurl: "/Api/ApiUoms/List",
                geturl: "/Api/ApiUoms/Get",
                field: "UOM_CODE",
                textfield: "UOM_DESC",
                active: "UOM_ACTIVE"
            });

            documentsHelper = new documents({
                input: "#dvrfu",
                filename: "#dvrfilename",
                uploadbtn: "#btndvrupload",
                container: "#dvrfupload",
                documentsdiv: "#dvrdocs",
                progressbar: "#dvrdocuprogress"
            });

        };

        RegisterUIEvents();

    }
    supp = new function () {
        var self = this;
        var documentsHelper;
        var wpdocumentsHelper;


        var BuildModals = function () {
        };
        var AutoComplete = function () {
        };
        this.Save = function () {

            if (!tms.Check("#workplacedetails"))
                return $.Deferred().reject();

            var o = JSON.stringify(
            {
                SUP_CODE: $("#code").val().toUpper(),
                SUP_BUSINESSOWNERSHIP: ($("#businessownership").val() || null),
                SUP_M2: ($("#m2").val() || null),
                SUP_CHK02: $("#signage").prop("checked") ? "+" : "-",
                SUP_DATE01: $("#signage").prop("checked") ?
                        moment.utc($("#signagedate").val(), constants.dateformat) :
                        null
             });

            return tms.Ajax({
                url: "/Api/ApiSuppliers/UpdateCompanyInfo",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    regions = d.regions;
                    tasktypes = d.tasktypes;
                    FillUserInterface();                         }
            });
        };
        var FillUserInterface = function () {

            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.SUP_CODE);
            $("#title").val(selectedrecord.SUP_TITLE);
            $("#authorizedperson").val(selectedrecord.SUP_AUTHORIZEDPERSON);
            $("#province").data("val", selectedrecord.SUP_PROVINCE);
            $("#province").val(selectedrecord.SUP_PROVINCEDESC);
            $("#district").data("val", selectedrecord.SUP_DISTRICT);
            $("#district").val(selectedrecord.SUP_DISTRICTDESC);

            $("#fulladdress").val(selectedrecord.SUP_FULLADDRESS);
            $("#phone").val(selectedrecord.SUP_PHONE);
            $("#phone2").val(selectedrecord.SUP_PHONE2);
            $("#accountcode").val(selectedrecord.SUP_ACCOUNTCODE);
            $("#paymentperiod").val(selectedrecord.SUP_PAYMENTPERIOD);
            $("#taxoffice").val(selectedrecord.SUP_TAXOFFICE);
            $("#taxno").val(selectedrecord.SUP_TAXNO);
            $("#fax").val(selectedrecord.SUP_FAX);
            $("#email").val(selectedrecord.SUP_EMAIL);
            $("#pricingstartdate").val(selectedrecord.SUP_CONTRACTSTART
                ? moment(selectedrecord.SUP_CONTRACTSTART).format(constants.dateformat)
                : "");
            $("#pricingenddate").val(selectedrecord.SUP_CONTRACTEND
                ? moment(selectedrecord.SUP_CONTRACTEND).format(constants.dateformat)
                : "");

            $("#tfs").prop("checked", selectedrecord.SUP_CHK01 === "+");
            $("#signage").prop("checked", selectedrecord.SUP_CHK02 === "+");

            if (selectedrecord.SUP_CHK02 === "+") {
                $("#signagedate").val(moment(selectedrecord.SUP_DATE01).format(constants.dateformat));
                $("#signagedate").addClass("required");
                $("#div_signagedate").removeClass("hidden");
            }
            else {
                $("#signagedate").val("");
                $("#signagedate").removeClass("required");
                $("#div_signagedate").addClass("hidden");
            }

            $("#businessownership").val(selectedrecord.SUP_BUSINESSOWNERSHIP);
            $("#m2").val(selectedrecord.SUP_M2);


            $("#region").tagsinput("removeAll");
            if (regions && regions.length > 0) {
                for (var i = 0; i < regions.length; i++) {
                    var region = regions[i];
                    $("#region").tagsinput("add", { id: region.REG_CODE, text: region.REG_DESC }, ["ignore"]);
                }
            }

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#btnBrowse").removeAttr("disabled");
            $("#fu").prop("disabled", false);

            documentsHelper.showDocumentsBlock({ subject: "SUPPLIER", source: selectedrecord.SUP_CODE });;
            wpdocumentsHelper.showDocumentsBlock({ subject: "WPDETAILS", source: selectedrecord.SUP_CODE });;

        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiSuppliers/Get",
                data: JSON.stringify(selectedrecord.SUP_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    regions = d.regions;
                    tasktypes = d.tasktypes;
                    FillUserInterface();                   
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        supp.LoadSelected();
                        break;
                    case "#vehicles":
                        veh.ResetUI();
                        veh.List();
                        break;
                    case "#deliveries":
                        dvr.ResetUI();
                        dvr.List();
                    case "#documentsandcertificates":
                        doc.ResetUI();
                        doc.List();
                    case "#users":
                        tms.DisableEnableOnSelectionTabs("#users");
                        usr.rec.LoadDocumentTypes();
                        usr.rec.ResetUI();
                        usr.list.List();
                        $(".nav-pills a[href=\"#userlist\"]").tab("show");
                        break;

                }

                scr.Configure();
            });
        };
        var RegisterUiEvents = function () {

            $("#btnSave").click(self.Save);
            $("#btnUndo").click(self.LoadSelected);

            $("#signage").on("change", function() {
                var v = $(this).is(":checked");
                if (v) {
                    $("#div_signagedate").removeClass("hidden");
                    $("#signagedate").addClass("required");
                }
                else {
                    $("#div_signagedate").addClass("hidden");
                    $("#signagedate").removeClass("required isempty");
                }
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

            wpdocumentsHelper = new documents({
                input: "#fu_wp",
                filename: "#filename_wp",
                uploadbtn: "#btnupload_wp",
                container: "#fupload_wp",
                documentsdiv: "#docs_wp",
                progressbar: "#docuprogress_wp",
                imageonly: true
            });

            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            selectedrecord = { SUP_CODE: supplier || suppliercode };
            if (selectedrecord.SUP_CODE) {
                return $.when(self.LoadSelected()).done(function () {
                    $("#btnBrowse").removeAttr("disabled");
                });
            }
            else {
                tms.Reset();
            }
           
        };
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "workplacedetails":
                                return "#btnSave";
                            case "vehicles":
                                return "#btnSaveVehicle";
                            case "deliveries":
                                return "#btnSaveDelivery";
                            case "documentsandcertificates":
                                return "#btnSaveDocument";
                            case "users":
                                switch (tms.ActiveTab("#users")) {
                                    case "userrecord":
                                        return "#btnSaveUser";
                                    case "userqualifications":
                                        return "#btnSaveUserQualifications";
                                    default:
                                        return null;
                                };
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "workplacedetails":
                                supp.Save();
                                break;
                            case "vehicles":
                                veh.Save();
                                break;
                            case "deliveries":
                                dvr.Save();
                                break;
                            case "documentsandcertificates":
                                doc.Save();
                                break;
                            case "users":
                                switch (tms.ActiveTab("#users")) {
                                    case "userrecord":
                                        usr.rec.Save();
                                        break;
                                    case "userqualifications":
                                        usr.qua.Save();
                                        break;         
                                };                              
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "workplacedetails":
                                return "#btnNew";
                            case "vehicles":
                                return "#btnAddVehicle";
                            case "deliveries":
                                return "#btnAddDelivery";
                            case "documentsandcertificates":
                                return "#btnAddDocument";
                            case "users":
                                switch (tms.ActiveTab("#users")) {
                                    case "userrecord":
                                        return "#btnNewUser";
                                    case "userqualifications":
                                        return "#btnAddUserQualifications";      
                                    default:
                                        return null;
                                };
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "vehicles":
                                veh.ResetUI();
                                break;
                            case "deliveries":
                                dvr.ResetUI();
                                break;
                            case "documentsandcertificates":
                                doc.ResetUI();
                                break;
                            case "users":
                                switch (tms.ActiveTab("#users")) {
                                    case "userrecord":
                                        usr.rec.ResetUI();
                                        break;
                                    case "userqualifications":
                                        usr.qua.ResetUI();
                                        break;
                                };
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        supp.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "vehicles":
                                return "#btnDeleteVehicle";
                            case "deliveries":
                                return "#btnDeleteDelivery";
                            case "documentsandcertificates":
                                return "#btnDeleteDocument";
                            case "users":
                                switch (tms.ActiveTab("#users")) {
                                    case "userqualifications":
                                        return "#btnDeleteUserQualifications";            
                                    default:
                                        return null;
                                };
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                supp.Delete();
                                break;
                            case "vehicles":
                                veh.Delete();
                                break;
                            case "deliveries":
                                dvr.Delete();
                                break;
                            case "documentsandcertificates":
                                doc.Delete();
                                break;
                            case "users":
                                switch (tms.ActiveTab("#users")) {
                                    case "userqualifications":
                                        usr.qua.Delete();
                                        break;
                                };
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        supp.HistoryModal();
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
        supp.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());