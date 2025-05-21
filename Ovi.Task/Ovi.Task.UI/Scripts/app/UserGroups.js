(function () {
    var selectedrecord = null;
    var ugr, mnu, inb, scr, kpi, hrs, ntf,mnotify;

    var screenconf = [
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnTranslations", selectionrequired: true }
            ]
        },
        {
            name: "menu",
            btns: []
        },
        {
            name: "inbox",
            btns: []
        },
        {
            name: "kpi",
            btns: []
        },
        {
            name: "holdreason",
            btns: []
        },
        {
            name: "screennotifications",
            btns: []
        },
        {
            name: "mobilenotifications",
            btns: []
        }
    ];

    ugr = new function () {
        var self = this;

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#class").val("");
            $("#active").prop("checked", true);
            $("#lock").prop("checked", false);
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMUSERGROUPS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMUSERGROUPS", operator: "eq" },
                    { field: "DES_PROPERTY", value: "UGR_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.UGR_CODE);
            $("#desc").val(selectedrecord.UGR_DESC);
            $("#class").val(selectedrecord.UGR_CLASS);
            $("#active").prop("checked", selectedrecord.UGR_ACTIVE === "+");
            $("#lock").prop("checked", selectedrecord.UGR_CHECKLISTLOCK === "+");

            $(".page-header>h6").html(selectedrecord.UGR_CODE + " - " + selectedrecord.UGR_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiUserGroups/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        this.Remove = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiUserGroups/DelRec",
                            data: JSON.stringify(selectedrecord.UGR_CODE),
                            fn: function (d) {
                                $(".list-group").list("refresh");
                                self.ResetUI();
                            }
                        });
                    });
            }
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                UGR_CODE: $("#code").val().toUpper(),
                UGR_DESC: $("#desc").val(),
                UGR_CLASS: ($("#class").val() || null),
                UGR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                UGR_CHECKLISTLOCK: $("#lock").prop("checked") ? "+" : "-",
                UGR_CREATED: selectedrecord != null ? selectedrecord.UGR_CREATED : tms.Now(),
                UGR_CREATEDBY: selectedrecord != null ? selectedrecord.UGR_CREATEDBY : user,
                UGR_UPDATED: selectedrecord != null ? tms.Now() : null,
                UGR_UPDATEDBY: selectedrecord != null ? user : null,
                UGR_SQLIDENTITY: selectedrecord != null ? selectedrecord.UGR_SQLIDENTITY : 0,
                UGR_RECORDVERSION: selectedrecord != null ? selectedrecord.UGR_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiUserGroups/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.UGR_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var target = $(e.target).attr("href");
                    switch (target) {
                        case "#menu":
                            $.when(mnu.LoadScreens()).done(mnu.LoadUserGroupScreens);
                            break;
                        case "#inbox":
                            $.when(inb.LoadInboxes()).done(inb.LoadUserGroupInboxes);
                            break;
                        case "#kpi":
                            $.when(kpi.LoadKPIs()).done(kpi.LoadUserGroupKPIs);
                            break;
                        case "#holdreason":
                            $.when(hrs.LoadHoldReasons()).done(hrs.LoadUserGroupHoldReasons);
                            break;
                        case "#screennotifications":
                            $.when(ntf.List()).done(ntf.BuildUI());
                            break;
                        case "#mobilenotifications":
                            $.when(mnotify.LoadMNotifies()).done(mnotify.LoadUserGroupMNotifies);
                            break;
                    }
                    scr.Configure();
                });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Remove);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnTranslations").click(self.TranslationModal);
            RegisterTabChange();
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiUserGroups/List",
                fields: {
                    keyfield: "UGR_CODE",
                    descfield: "UGR_DESC"
                },
                sort: [{ field: "UGR_CODE", dir: "asc" }],
                itemclick: function (event, item) {
                    $.when(scr.LoadSelected()).done(function () {
                        scr.Configure();
                    });
                }
            });
        };
        this.BuildUI = function () {
            self.ResetUI();
            List();
            RegisterUiEvents();
        };
    };
    mnu = new function () {
        var self = this;

        this.LoadScreens = function () {
            var screens = $("#menu div.screens");
            screens.find("*").remove();

            var filter = { sort: [{ field: "SCR_DESCF", dir: "asc" }], loadall: true };
            return tms.Ajax({
                url: "/Api/ApiScreens/List",
                data: JSON.stringify(filter),
                fn: function (d) {
                    if (d.data) {
                        var strScreenList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strScreenList += "<div data-screen=\"" + d.data[i].SCR_CODE + "\" class=\"row custom\">";
                            strScreenList += "<div class=\"col-md-3\">";
                            strScreenList += "<div class=\"input-group\">";
                            strScreenList += "<input data-screen=\"" + d.data[i].SCR_CODE + "\"  type=\"text\" class=\"form-control\">";
                            strScreenList += "<span class=\"input-group-btn\">";
                            strScreenList += "<button data-screen=\"" + d.data[i].SCR_CODE + "\" class=\"btn btn-default btn-securityfilter\" type=\"button\"><i class=\"fa fa-search fa-fw\"></i></button>";
                            strScreenList += "</span>";
                            strScreenList += "</div>";
                            strScreenList += "</div>";
                            strScreenList += "<div class=\"col-md-9\">";
                            strScreenList += " <div class=\"checkbox checkbox-primary\">";
                            strScreenList += "<input class=\"styled\" type=\"checkbox\" value=\"" + d.data[i].SCR_CODE + "\">";
                            strScreenList += "<label>";
                            strScreenList += "<strong>" + d.data[i].SCR_CODE + "</strong>" + " - " + d.data[i].SCR_DESCF;
                            strScreenList += "</label>";
                            strScreenList += "</div>";
                            strScreenList += "</div>";
                            strScreenList += "</div>";
                        }
                        screens.append(strScreenList);

                        screens.find("input[type=\"checkbox\"]").on("change", function () {
                            $(this).blur();
                        });

                        screens.find("div.input-group input[type=\"text\"]").each(function (index) {
                            var screen = $(this).data("screen");
                            $(this).autocomp({
                                listurl: "/Api/ApiSecurityFilter/List",
                                geturl: "/Api/ApiSecurityFilter/Get",
                                field: "SCF_CODE",
                                textfield: "SCF_DESC",
                                active: "SCF_ACTIVE",
                                filter: [{ field: "SCF_SCREEN", value: screen, operator: "eq" }]
                            });
                        });

                        screens.find("button.btn-securityfilter").on("click", function () {
                            var screen = $(this).data("screen");
                            var input = $(this).closest(".input-group").find("input");
                            gridModal.show({
                                modaltitle: gridstrings.securityfilter[lang].title,
                                listurl: "/Api/ApiSecurityFilter/List",
                                keyfield: "SCF_CODE",
                                codefield: "SCF_CODE",
                                textfield: "SCF_DESC",
                                returninput: input,
                                columns: [
                                    { type: "string", field: "SCF_CODE", title: gridstrings.securityfilter[lang].code, width: 100 },
                                    { type: "string", field: "SCF_DESC", title: gridstrings.securityfilter[lang].description, width: 400 }
                                ],
                                filter: [
                                    { field: "SCF_SCREEN", value: screen, operator: "eq" },
                                    { field: "SCF_ACTIVE", value: "+", operator: "eq" }
                                ]
                            });
                        });
                    }
                }
            });
        };
        this.LoadUserGroupScreens = function () {
            var screens = $("#menu div.screens div.row");
            var filter = {
                filter: {
                    filters: [{ field: "MNU_USERGROUP", operator: "eq", value: selectedrecord.UGR_CODE }]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiMenu/List",
                data: JSON.stringify(filter),
                fn: function (d) {
                    screens.find("input[type=\"checkbox\"]").prop("checked", false);
                    screens.find("input[type=\"text\"]").val("");

                    for (var i = 0; i < screens.length; i++) {
                        var $that = $(screens[i]);
                        var screen = $that.data("screen");
                        var v = $.grep(d.data, function (e) { return e.MNU_SCREEN == screen; });
                        if (v.length > 0) {
                            var l = v[0];
                            $that.attr("data-identity", l.MNU_SQLIDENTITY);
                            $that.data("recordversion", l.MNU_RECORDVERSION);
                            var ischecked = l.MNU_ACTIVE;
                            var securityfilter = l.MNU_SECURITYFILTER;
                            var securityfilterdescription = l.MNU_SECURITYFILTERDESC;
                            var checkbox = $that.find("input[type=\"checkbox\"]");
                            var input = $that.find("input[type=\"text\"]");
                            checkbox.prop("checked", ischecked === "+");
                            input.val(securityfilter);
                            if (securityfilter)
                                tooltip.show(input, securityfilterdescription);
                        }
                    }
                }
            });
        };
        this.Save = function () {
            var screens = $("#menu div.screens div.row");
            var screenlist = [];

            for (var i = 0; i < screens.length; i++) {
                var $that = $(screens[i]);

                var scrcode = $that.data("screen");
                var securityfilter = ($that.find("input[type=\"text\"]").val() || null);
                var checked = $that.find("input[type=\"checkbox\"]").prop("checked");
                var identity = $that.data("identity") || 0;
                var recordversion = $that.data("recordversion") || 0;

                screenlist.push({
                    MNU_USERGROUP: selectedrecord.UGR_CODE,
                    MNU_SCREEN: scrcode,
                    MNU_SECURITYFILTER: securityfilter,
                    MNU_ACTIVE: checked ? "+" : "-",
                    MNU_RECORDVERSION: recordversion,
                    MNU_SQLIDENTITY: identity
                });
            }

            return tms.Ajax({
                url: "/Api/ApiMenu/Save",
                data: JSON.stringify(screenlist),
                fn: function (d) {
                    msgs.success(d.data);
                    return $.when(self.LoadScreens()).done(function () {
                        return self.LoadUserGroupScreens();
                    });
                }
            });
        };
        var RegisterUIevents = function () {
            $("#btnSaveMenu").click(self.Save);
        };
        RegisterUIevents();
    };
    ntf = new function () {
        var self = this;
        var selecteditem = null;
        var grdelm = $("#grdScreenNotifications");
        var grdScreenNotifications = null;

        var itemSelect = function (row) {
            selecteditem = grdScreenNotifications.GetRowDataItem(row);
            self.LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#screennotifications");
            $("#notificationid").val(selecteditem.NOT_ID);
            $("#screen").val(selecteditem.NOT_SCREEN);
            $("#effectivedate").val(moment(selecteditem.NOT_EFFECTIVEDATE).format(constants.dateformat));
            $("#title").val(selecteditem.NOT_TITLE);
            $("#content").summernote("code", selecteditem.NOT_CONTENT);
            tooltip.show("#screen", selecteditem.NOT_SCREENDESCF);
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiScreenNotifications/Get",
                data: JSON.stringify(selecteditem.NOT_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUserInterface();
                }
            });
        };
        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#screennotifications");
            $("#notificationid").val("");
            $("#screen").val("");
            $("#effectivedate").val("");
            $("#title").val("");
            $("#content").summernote("reset");
            tooltip.hide("#screen");
        };
        this.List = function () {
            var grdFilter = [{ field: "NOT_USERGROUP", value: selectedrecord.UGR_CODE, operator: "eq", logic: "and" }];
            if (grdScreenNotifications) {
                grdScreenNotifications.ClearSelection();
                grdScreenNotifications.RunFilter(grdFilter);
            } else {
                grdScreenNotifications = new Grid({
                    keyfield: "NOT_ID",
                    columns: [
                        {
                            type: "number",
                            field: "NOT_ID",
                            title: gridstrings.screennotifications[lang].notificationid,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "NOT_SCREEN",
                            title: gridstrings.screennotifications[lang].screen,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "NOT_TITLE",
                            title: gridstrings.screennotifications[lang].title,
                            width: 50
                        },
                        {
                            type: "date",
                            field: "NOT_EFFECTIVEDATE",
                            title: gridstrings.screennotifications[lang].effectivedate,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "NOT_CREATEDBY",
                            title: gridstrings.screennotifications[lang].createdby,
                            width: 50
                        },
                        {
                            type: "datetime",
                            field: "NOT_CREATED",
                            title: gridstrings.screennotifications[lang].created,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "NOT_UPDATEDBY",
                            title: gridstrings.screennotifications[lang].updatedby,
                            width: 50
                        },
                        {
                            type: "datetime",
                            field: "NOT_UPDATED",
                            title: gridstrings.screennotifications[lang].updated,
                            width: 50
                        }
                    ],
                    fields:
                    {
                        NOT_EFFECTIVEDATE: { type: "date" },
                        NOT_CREATED: { type: "date" },
                        NOT_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiScreenNotifications/List",
                    selector: "#grdScreenNotifications",
                    name: "grdScreenNotifications",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "NOT_ID", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#screennotifications"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                NOT_ID: (selecteditem != null ? selecteditem.NOT_ID : 0),
                NOT_USERGROUP: selectedrecord.UGR_CODE,
                NOT_SCREEN: $("#screen").val(),
                NOT_TITLE: $("#title").val(),
                NOT_CONTENT: $("#content").summernote("code"),
                NOT_EFFECTIVEDATE: moment.utc($("#effectivedate").val(), constants.dateformat),
                NOT_CREATED: selecteditem != null ? selecteditem.NOT_CREATED : tms.Now(),
                NOT_CREATEDBY: selecteditem != null ? selecteditem.NOT_CREATEDBY : user,
                NOT_UPDATED: selecteditem != null ? tms.Now() : null,
                NOT_UPDATEDBY: selecteditem != null ? user : null,
                NOT_RECORDVERSION: selecteditem != null ? selecteditem.NOT_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiScreenNotifications/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiScreenNotifications/DelRec",
                            data: JSON.stringify(selecteditem.NOT_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddNotification").click(self.ResetUI);
            $("#btnSaveNotification").click(self.Save);
            $("#btnDeleteNotification").click(self.Delete);
        };
        this.BuildUI = function () {
            $("#content").summernote({
                lang: culture,
                height: 300,
                toolbar: [
                    ["style", ["style"]],
                    ["font", ["bold", "italic", "underline", "clear"]],
                    ["fontname", ["fontname"]],
                    ["color", ["color"]],
                    ["para", ["ul", "ol", "paragraph"]],
                    ["view", ["fullscreen"]]
                ]
            });
            $("#screen").autocomp({
                listurl: "/Api/ApiScreens/List",
                geturl: "/Api/ApiScreens/Get",
                field: "SCR_CODE",
                textfield: "SCR_DESCF",
                active: "SCR_ACTIVE"
            });
            $("#btnscreen").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.screen[lang].title,
                    listurl: "/Api/ApiScreens/List",
                    keyfield: "SCR_CODE",
                    codefield: "SCR_CODE",
                    textfield: "SCR_DESCF",
                    returninput: "#screen",
                    columns: [
                        { type: "string", field: "SCR_CODE", title: gridstrings.screen[lang].screen, width: 100 },
                        { type: "string", field: "SCR_DESCF", title: gridstrings.screen[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "SCR_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
        }
        RegisterUIEvents();
    }
    inb = new function () {
        var self = this;

        this.LoadInboxes = function () {
            var inboxes = $("#inbox div.inboxes");
            inboxes.find(".checkbox").remove();

            var grdreq = {
                filter: { filters: [{ field: "INB_ACTIVE", operator: "eq", value: "+" }] },
                sort: [{ field: "INB_DESCF", dir: "asc" }],
                loadall:true
            };
            return tms.Ajax({
                url: "/Api/ApiInbox/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strInboxList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strInboxList += "<div class=\"checkbox checkbox-primary\">";
                            strInboxList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].INB_CODE +
                                "\">";
                            strInboxList += "<label>";
                            strInboxList += "<strong>" + d.data[i].INB_CODE + "</strong>" + " - " + d.data[i].INB_DESCF;
                            strInboxList += "</label>";
                            strInboxList += "</div>";
                        }
                        inboxes.append(strInboxList);
                    }
                }
            });
        };
        this.LoadUserGroupInboxes = function () {
            var inboxes = $("#inbox div.inboxes");

            if (selectedrecord) {
                var gridreq = {
                    sort: [{ field: "UGI_ID", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "UGI_USERGROUP", value: selectedrecord.UGR_CODE, operator: "eq" }
                        ]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiUserGroupInbox/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        inboxes.find("input").prop("checked", false);
                        for (var i = 0; i < d.data.length; i++) {
                            var inbox = inboxes.find("input[value=\"" + d.data[i].UGI_INBOX + "\"]");
                            inbox.prop("checked", true);
                        }
                    }
                });
            }

            return null;
        };
        this.Save = function () {
            var inboxes = $("#inbox div.inboxes input:checked");
            var inboxlist = [];

            for (var i = 0; i < inboxes.length; i++) {
                var p = $(inboxes[i]);
                inboxlist.push({
                    UGI_USERGROUP: selectedrecord.UGR_CODE,
                    UGI_INBOX: p.val(),
                    UGI_CREATED: tms.Now(),
                    UGI_CREATEDBY: user
                });
            }

            return tms.Ajax({
                url: "/Api/ApiUserGroupInbox/Save",
                data: JSON.stringify({ Id: selectedrecord.UGR_CODE, Items: inboxlist }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveInbox").click(self.Save);
        };
        RegisterUIEvents();
    };
    kpi = new function () {
        var self = this;

        this.LoadKPIs = function () {
            var kpis = $("#kpi div.kpis");
            kpis.find(".checkbox").remove();

            var grdreq = {
                filter: {
                    filters: [
                        { field: "KPI_ACTIVE", operator: "eq", value: "+" }
                    ]
                },
                sort: [{ field: "KPI_DESCF", dir: "asc" }],
                loadall:true
            };
            return tms.Ajax({
                url: "/Api/ApiKPI/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strKPIList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strKPIList += "<div class=\"checkbox checkbox-primary\">";
                            strKPIList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].KPI_CODE +
                                "\">";
                            strKPIList += "<label>";
                            strKPIList += "<strong>" + d.data[i].KPI_CODE + "</strong>" + " - " + d.data[i].KPI_DESCF;
                            strKPIList += "</label>";
                            strKPIList += "</div>";
                        }
                        kpis.append(strKPIList);
                    }
                }
            });
        };
        this.LoadUserGroupKPIs = function () {
            var kpis = $("#kpi div.kpis");

            if (selectedrecord) {
                var gridreq = {
                    sort: [{ field: "UGK_ID", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "UGK_USERGROUP", value: selectedrecord.UGR_CODE, operator: "eq" }
                        ]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiUserGroupKPI/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        kpis.find("input").prop("checked", false);
                        for (var i = 0; i < d.data.length; i++) {
                            kpis.find("input[value=\"" + d.data[i].UGK_KPI + "\"]").prop("checked", true);
                        }
                    }
                });
            }

            return null;
        };
        this.Save = function () {
            var kpis = $("#kpi div.kpis input:checked");
            var kpilist = [];

            for (var i = 0; i < kpis.length; i++) {
                var p = $(kpis[i]);
                kpilist.push({
                    UGK_USERGROUP: selectedrecord.UGR_CODE,
                    UGK_KPI: p.val(),
                    UGK_CREATED: tms.Now(),
                    UGK_CREATEDBY: user
                });
            }

            return tms.Ajax({
                url: "/Api/ApiUserGroupKPI/Save",
                data: JSON.stringify({ Id: selectedrecord.UGR_CODE, Items: kpilist }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveKPI").click(self.Save);
        };
        RegisterUIEvents();
    };
    mnotify = new function()
    {
        var self = this;

        this.LoadMNotifies = function () {
            var mnotfs = $("#mobilenotifications div.mobilenotifications");
            mnotfs.find(".checkbox").remove();

            var grdreq = {
                filter: {
                    filters: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "TOPICS", operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strGroupList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strGroupList += "<div class=\"checkbox checkbox-primary\">";
                            strGroupList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].SYC_CODE +
                                "\">";
                            strGroupList += "<label>";
                            strGroupList += "<strong>" + d.data[i].SYC_CODE + "</strong>" + " - " + d.data[i].SYC_DESCRIPTION;
                            strGroupList += "</label>";
                            strGroupList += "</div>";
                        }
                        mnotfs.append(strGroupList);
                    }
                }
            });
        };
        this.LoadUserGroupMNotifies = function()
        {
            var mnotfs = $("#mobilenotifications div.mobilenotifications");

            if (selectedrecord) {
                var gridreq = {
                    sort: [{ field: "UGM_ID", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "UGM_USERGROUP", value: selectedrecord.UGR_CODE, operator: "eq" }
                        ]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiUserGroupMobileTopic/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        mnotfs.find("input").prop("checked", false);
                        for (var i = 0; i < d.data.length; i++) {
                            mnotfs.find("input[value=\"" + d.data[i].UGM_TOPIC + "\"]").prop("checked", true);
                        }
                    }
                });
            }

            return null;

        };
        this.Save = function () {
            var mnotfs = $("#mobilenotifications div.mobilenotifications input:checked");
            var mnotfslist = [];

            for (var i = 0; i < mnotfs.length; i++) {
                var p = $(mnotfs[i]);
                mnotfslist.push({
                    UGM_USERGROUP: selectedrecord.UGR_CODE,
                    UGM_TOPIC: p.val(),
                    UGM_CREATED: tms.Now(),
                    UGM_CREATEDBY: user
                });
            }

            return tms.Ajax({
                url: "/Api/ApiUserGroupMobileTopic/Save",
                data: JSON.stringify({ Id: selectedrecord.UGR_CODE, Items: mnotfslist }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveMobileNotifications").click(self.Save);
        };

        RegisterUIEvents();

    };
    hrs = new function () {
        var self = this;

        this.LoadHoldReasons = function () {
            var holdreasons = $("#holdreason div.holdreasons");
            holdreasons.find(".checkbox").remove();

            var grdreq = {
                filter: { filters: [{ field: "HDR_ACTIVE", operator: "eq", value: "+" }] },
                sort: [{ field: "HDR_DESCF", dir: "asc" }]
            };
            return tms.Ajax({
                url: "/Api/ApiHoldReasons/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strHoldReasonList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strHoldReasonList += "<div class=\"checkbox checkbox-primary\">";
                            strHoldReasonList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].HDR_CODE +
                                "\">";
                            strHoldReasonList += "<label>";
                            strHoldReasonList += "<strong>" + d.data[i].HDR_CODE + "</strong>" + " - " + d.data[i].HDR_DESCF;
                            strHoldReasonList += "</label>";
                            strHoldReasonList += "</div>";
                        }
                        holdreasons.append(strHoldReasonList);
                    }
                }
            });
        };
        this.LoadUserGroupHoldReasons = function () {
            var holdreasons = $("#holdreason div.holdreasons");
            if (selectedrecord) {
                var gridreq = {
                    sort: [{ field: "UGH_ID", dir: "asc" }],
                    filter: {
                        filters: [{ field: "UGH_USERGROUP", value: selectedrecord.UGR_CODE, operator: "eq" }]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiUserGroupHoldReason/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        holdreasons.find("input").prop("checked", false);
                        for (var i = 0; i < d.data.length; i++) {
                            holdreasons.find("input[value=\"" + d.data[i].UGH_HOLDREASON + "\"]").prop("checked", true);
                        }
                    }
                });
            }

            return null;
        };
        this.Save = function () {
            var holdreasons = $("#holdreason div.holdreasons input:checked");
            var holdreasonlist = [];

            for (var i = 0; i < holdreasons.length; i++) {
                var p = $(holdreasons[i]);
                holdreasonlist.push({
                    UGH_USERGROUP: selectedrecord.UGR_CODE,
                    UGH_HOLDREASON: p.val(),
                    UGH_CREATED: tms.Now(),
                    UGH_CREATEDBY: user
                });
            }

            return tms.Ajax({
                url: "/Api/ApiUserGroupHoldReason/Save",
                data: JSON.stringify({ Id: selectedrecord.UGR_CODE, Items: holdreasonlist }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveHoldReason").click(self.Save);
        };
        RegisterUIEvents();
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "menu":
                                return "#btnSaveMenu";
                            case "inbox":
                                return "#btnSaveInbox";
                            case "kpi":
                                return "#btnSaveKPI";
                            case "holdreason":
                                return "#btnSaveHoldReason";
                            case "screennotifications":
                                return "#btnSaveNotification";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                ugr.Save();
                                break;
                            case "menu":
                                mnu.Save();
                                break;
                            case "inbox":
                                inb.Save();
                                break;
                            case "kpi":
                                kpi.Save();
                                break;
                            case "holdreason":
                                hrs.Save();
                                break;
                            case "screennotifications":
                                ntf.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        ugr.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        ugr.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    f: function () {
                        ugr.Remove();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        ugr.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function () {
                        ugr.TranslationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(ugr.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "menu":
                        mnu.LoadUserGroupScreens();
                        break;
                    case "inbox":
                        inb.LoadUserGroupInboxes();
                        break;
                    case "kpi":
                        kpi.LoadUserGroupKPIs();
                        break;
                    case "holdreason":
                        hrs.LoadUserGroupHoldReasons();
                        break;
                    case "screennotifications":
                        ntf.ResetUI();
                        ntf.List();
                        break;
                    case "mobilenotifications":
                        mnotify.LoadMNotifies();
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
        ugr.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());