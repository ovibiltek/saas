(function () {
    var selectedrecord = null;
    var mobilesessionid = null;
    var scr, ses, sparam;

    var screenconf = [
        {
            name: "list",
            btns: []
        },
        {
            name: "parameters",
            btns: []
        }
    ];

    sparam = new function () {
        var self = this;
        var grdmobilesessionparameters = null;
        var grdmobilesessionparametesElm = $("#grdMobileSessionParameters");

        var GridDataBound = function () {
            grdmobilesessionparametesElm.find("[data-id]").on("dblclick",
                function () {
                    //TODO: ??
                });
        };
        var GridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var List = function () {
            var gridfilter = [{ field: "SPR_SESSID", value: mobilesessionid, operator: "eq", logic: "and" }];
            if (grdmobilesessionparameters) {
                grdmobilesessionparameters.ClearSelection();
                grdmobilesessionparameters.RunFilter(gridfilter);
            } else {
                grdmobilesessionparameters = new Grid({
                    keyfield: "SPR_ID",
                    columns: [
                        {
                            type: "number",
                            field: "SPR_ID",
                            title: gridstrings.mobilesessionparametes[lang].id,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPR_SESSID",
                            title: gridstrings.mobilesessionparametes[lang].sessid,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "SPR_TYPE",
                            title: gridstrings.mobilesessionparametes[lang].type,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "SPR_DESC",
                            title: gridstrings.mobilesessionparametes[lang].desc,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPR_SUBTYPE",
                            title: gridstrings.mobilesessionparametes[lang].subtype,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SPR_REFID",
                            title: gridstrings.mobilesessionparametes[lang].refid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPR_VALUE",
                            title: gridstrings.mobilesessionparametes[lang].value,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "SPR_CREATED",
                            title: gridstrings.mobilesessionparametes[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SPR_CREATEDBY",
                            title: gridstrings.mobilesessionparametes[lang].createdby,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SPR_RECORDVERSION",
                            title: gridstrings.mobilesessionparametes[lang].recordversion,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        SPR_ID: { type: "number" },
                        SPR_CREATED: { type: "date" },
                    },
                    datasource: "/Api/ApiMobileSessionParameters/List",
                    selector: "#grdMobileSessionParameters",
                    name: "grdMobileSessionParameters",
                    height: constants.defaultgridheight - 75,
                    primarycodefield: "SPR_ID",
                    primarytextfield: "SPR_SESSID",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "SPR_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"mobilesessions.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabEvents = function () {
        };
        var RegisterUIEvents = function () {
            RegisterTabEvents();
        };
        this.Ready = function () {
            List();
        };
        RegisterUIEvents();
    };
    ses = new function () {
        var self = this;
        var grdmobilesessions = null;
        var grdmobilesessionsElm = $("#grdMobileSessions");
        var List;
        var ItemSelect = function (row) {
            selectedrecord = grdmobilesessions.GetRowDataItem(row);
            mobilesessionid = selectedrecord.SES_SESSID;

            $(".page-header h6").html(selectedrecord.SES_USER);
            scr.Configure();
            tms.Tab();
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab",
                function (e) {
                    var deferreds = [];
                    var activatedTab = e.target.hash;
                  
                    $.when.apply($, deferreds).done(function () {
                        switch (activatedTab) {
                            case "#list":
                                List();
                                break;
                            case "#parameters":
                                if (selectedrecord)
                                    sparam.Ready();
                                break;
                        }
                        scr.Configure();
                    });
                });
        };
        var RegisterUiEvents = function () {
            $(".btn").css("cursor", "pointer");
        };
        var RegisterTabEvents = function () {
            RegisterTabChange();
        };
        var GridDataBound = function () {
            grdmobilesessionsElm.find("[data-id]").on("dblclick",
                function () {
                    $(".nav-tabs a[href=\"#parameters\"]").tab("show");
                });
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        List = function () {
            var gridfilter = [];

            if (grdmobilesessions) {
                grdmobilesessions.ClearSelection();
                grdmobilesessions.RunFilter(gridfilter);
            } else {
                grdmobilesessions = new Grid({
                    keyfield: "SES_ID",
                    columns: [
                        {
                            type: "number",
                            field: "SES_ID",
                            title: gridstrings.mobilesessions[lang].sesid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SES_SESSID",
                            title: gridstrings.mobilesessions[lang].sessid,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "SES_USER",
                            title: gridstrings.mobilesessions[lang].user,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SES_PRODUCTID",
                            title: gridstrings.mobilesessions[lang].productid,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "SES_IP",
                            title: gridstrings.mobilesessions[lang].ip,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SES_BROWSER",
                            title: gridstrings.mobilesessions[lang].browser,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "SES_ISMOBILE",
                            title: gridstrings.mobilesessions[lang].ismobile,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "SES_LOGIN",
                            title: gridstrings.mobilesessions[lang].logindate,
                            width: 200
                        },
                        {
                            type: "number",
                            field: "SES_RECORDVERSION",
                            title: gridstrings.mobilesessions[lang].recordversion,
                            width: 200
                        }
                    ],
                    fields:
                    {
                        SES_ID: { type: "number" },
                        SES_PRODUCTID: { type: "number" },
                        SES_RECORDVERSION: { type: "number" }
                    },
                    datasource: "/Api/ApiMobileSessions/List",
                    selector: "#grdMobileSessions",
                    name: "grdMobileSessions",
                    height: constants.defaultgridheight - 75,
                    primarycodefield: "SES_ID",
                    primarytextfield: "SES_SESSID",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    sort: [{ field: "SES_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"mobilesessions.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            RegisterTabEvents();
            List();
        };
    };
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
            if (tab.more && typeof (tab.more) === "function")
                return tab.more();
        };
    };

    function ready() {
        ses.BuildUI();
    }

    $(document).ready(ready);
}());