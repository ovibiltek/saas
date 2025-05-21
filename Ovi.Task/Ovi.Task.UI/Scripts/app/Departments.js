(function () {
    var selectedrecord = null;
    var scr, dep, typ, cat;

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
            name: "tasktypes",
            btns: []
        },
        {
            name: "categories",
            btns: []
        }
    ];

    typ = new function () {
        var self = this;

        this.Save = function () {
            var deptypesarr = [];
            var deptypeinputs = $("div.type-items div.row input.typ");
            for (var i = 0; i < deptypeinputs.length; i++) {
                var dt = $(deptypeinputs[i]);
                if (dt.prop("checked"))
                    deptypesarr.push({
                        DPT_DEPCODE: selectedrecord.r.DEP_CODE,
                        DPT_TYPEENTITY: dt.data("entity"),
                        DPT_TYPECODE: dt.data("val"),
                        DPT_CREATED: tms.Now(),
                        DPT_CREATEDBY: user
                    });
            };

            return tms.Ajax({
                url: "/Api/ApiDepartmentTypes/Save",
                data: JSON.stringify({ Id: selectedrecord.r.DEP_CODE, Items: deptypesarr }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        this.LoadTypes = function () {
            var gridreq = {
                sort: [{ field: "TYP_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: ["*", "TASK"], operator: "in" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiTypes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    var tmpEntity = "";
                    var strlist = "<div class=\"type-items col-md-8\">";
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        if (tmpEntity !== di.TYP_ENTITY && i !== 0) {
                            tmpEntity = di.TYP_ENTITY;
                            strlist += "<hr />";
                        }
                        strlist += "<div class=\"row custom\">";
                        strlist += "<div class=\"col-md-1\">";
                        strlist += di.TYP_ENTITY;
                        strlist += "</div>";
                        strlist += "<div class=\"col-md-1\">";
                        strlist +=
                            "<div class=\"checkbox checkbox-primary\"><input class=\"typ styled\" type=\"checkbox\" data-entity=\"" +
                            d.data[i].TYP_ENTITY +
                            "\" data-val=\"" +
                            d.data[i].TYP_CODE +
                            "\" /><label></label></div> ";
                        strlist += "</div>";
                        strlist += "<div class=\"col-md-10\">";
                        strlist += d.data[i].TYP_DESCF;
                        strlist += "</div>";
                        strlist += "</div>";
                    }
                    strlist += "</div>";

                    var inputcontainer = $("#tasktypes .panel-body");
                    inputcontainer.find("*").remove();
                    inputcontainer.append(strlist);
                    inputcontainer.find("input.typ[data-val=\"*\"]").change(function () {
                        var chkall = $(this).is(":checked");
                        inputcontainer.find("input.typ[data-val!=\"*\"]").prop("checked", false)
                            .prop("disabled", chkall);
                    });
                }
            });
        };
        this.LoadDepartmentTaskTypes = function () {
            if (!selectedrecord) {
                return null;
            } else {
                var gridreq = {
                    sort: [{ field: "DPT_ID", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "DPT_DEPCODE", value: selectedrecord.r.DEP_CODE, operator: "eq" }
                        ]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiDepartmentTypes/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        var inputcontainer = $("#tasktypes .panel-body");
                        inputcontainer.find("input.typ").prop("checked", false).prop("disabled", false);
                        for (var i = 0; i < d.data.length; i++) {
                            inputcontainer.find("input.typ[data-val=\"" + d.data[i].DPT_TYPECODE + "\"]")
                                .prop("checked", true);
                        }
                        var chkall = inputcontainer.find("input.typ[data-val=\"*\"]").is(":checked");
                        if (chkall)
                            inputcontainer.find("input.typ[data-val!=\"*\"]").prop("checked", false)
                                .prop("disabled", chkall);
                    }
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnSaveTypes").click(self.Save);
        };
        RegisterUIEvents();
    };
    cat = new function () {
        var self = this;
        this.LoadCategories = function () {
            var categories = $("#categories div.categories");
            categories.find(".checkbox").remove();

            var grdreq = {
                filter: { filters: [{ field: "CAT_ACTIVE", operator: "eq", value: "+" }] },
                sort: [{ field: "CAT_DESCF", dir: "asc" }]
            };
            return tms.Ajax({
                url: "/Api/ApiCategories/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strCategoryList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strCategoryList += "<div class=\"checkbox checkbox-primary\">";
                            strCategoryList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].CAT_CODE +
                                "\">";
                            strCategoryList += "<label>";
                            strCategoryList += "<strong>" + d.data[i].CAT_CODE + "</strong>" + " - " + d.data[i].CAT_DESCF;
                            strCategoryList += "</label>";
                            strCategoryList += "</div>";
                        }
                        categories.append(strCategoryList);
                    }
                }
            });
        };
        this.LoadDepartmentCategories = function () {
            var categories = $("#categories div.categories");

            if (selectedrecord) {
                var gridreq = {
                    sort: [{ field: "DCT_ID", dir: "asc" }],
                    filter: {
                        filters: [
                            { field: "DCT_DEPARTMENT", value: selectedrecord.r.DEP_CODE, operator: "eq" }
                        ]
                    },
                    loadall: true
                };

                return tms.Ajax({
                    url: "/Api/ApiDepartmentCategories/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        categories.find("input").prop("checked", false);
                        for (var i = 0; i < d.data.length; i++) {
                            categories.find("input[value=\"" + d.data[i].DCT_CATEGORY + "\"]").prop("checked", true);
                        }
                    }
                });
            }

            return null;
        };
        this.Save = function () {
            var categories = $("#categories div.categories input:checked");
            var categorieslist = [];

            for (var i = 0; i < categories.length; i++) {
                var p = $(categories[i]);
                categorieslist.push({
                    DCT_DEPARTMENT: selectedrecord.r.DEP_CODE,
                    DCT_CATEGORY: p.val(),
                    DCT_CREATED: tms.Now(),
                    DCT_CREATEDBY: user
                });
            }

            return tms.Ajax({
                url: "/Api/ApiDepartmentCategories/Save",
                data: JSON.stringify({ Id: selectedrecord.r.DEP_CODE, Items: categorieslist }),
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveCategories").click(self.Save);
        };
        RegisterUIEvents();
    };
    dep = new function () {
        var self = this;
        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#manager").val("");
            $("#timekeepingofficer").val("");
            $("#authorized").tagsinput("removeAll");
            $("#authorizedcnt").text("");
            $("#active").prop("checked", true);

            tooltip.hide("#org");
            tooltip.hide("#manager");
            tooltip.hide("#timekeepingofficer");
            tooltip.hide("#authorized");
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMDEPARTMENTS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        this.TranslationModal = function () {
            translation.modal.show({
                filter: [
                    { field: "DES_CLASS", value: "TMDEPARTMENTS", operator: "eq" },
                    { field: "DES_PROPERTY", value: "DEP_DESC", operator: "eq" },
                    { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#code").val(selectedrecord.r.DEP_CODE);
            $("#desc").val(selectedrecord.r.DEP_DESC);
            $("#org").val(selectedrecord.r.DEP_ORG);
            $("#manager").val(selectedrecord.r.DEP_MANAGER);
            $("#timekeepingofficer").val(selectedrecord.r.DEP_TIMEKEEPINGOFFICER);

            $("#active").prop("checked", selectedrecord.r.DEP_ACTIVE === "+");

            tooltip.show("#org", selectedrecord.r.DEP_ORGDESC);
            tooltip.show("#manager", selectedrecord.r.DEP_MANAGERDESC);
            tooltip.show("#timekeepingofficer", selectedrecord.r.DEP_TIMEKEEPINGOFFICERDESC);

            $("#authorized").tagsinput("removeAll");
            if (selectedrecord.authorizedusers != null)
                for (var i = 0; i < selectedrecord.authorizedusers.length; i++) {
                    $("#authorized").tagsinput("add",
                        {
                            id: selectedrecord.authorizedusers[i].USR_CODE,
                            text: selectedrecord.authorizedusers[i].USR_DESC
                        },
                        ["ignore"]);
                }

            $(".page-header>h6").html(selectedrecord.r.DEP_CODE + " - " + selectedrecord.r.DEP_DESC);
        };
        this.LoadSelected = function () {
            var selecteditem = $("a.list-group-item.active");
            var code = selecteditem.data("id");
            return tms.Ajax({
                url: "/Api/ApiDepartments/Get",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d;
                    FillUserInterface();
                }
            });
        };
        this.Remove = function () {
            if (selectedrecord) {
                var code = selectedrecord.r.DEP_CODE;
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiDepartments/DelRec",
                            data: JSON.stringify(code),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                $(".list-group").list("refresh");
                            }
                        });
                    });
            }
        };
        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                DEP_CODE: $("#code").val().toUpper(),
                DEP_DESC: $("#desc").val(),
                DEP_ORG: $("#org").val(),
                DEP_MANAGER: $("#manager").val(),
                DEP_TIMEKEEPINGOFFICER: $("#timekeepingofficer").val(),
                DEP_AUTHORIZED: ($("#authorized").val() || null),
                DEP_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                DEP_CREATED: selectedrecord != null ? selectedrecord.r.DEP_CREATED : tms.Now(),
                DEP_CREATEDBY: selectedrecord != null ? selectedrecord.r.DEP_CREATEDBY : user,
                DEP_UPDATED: selectedrecord != null ? tms.Now() : null,
                DEP_UPDATEDBY: selectedrecord != null ? user : null,
                DEP_SQLIDENTITY: selectedrecord != null ? selectedrecord.r.DEP_SQLIDENTITY : 0,
                DEP_RECORDVERSION: selectedrecord != null ? selectedrecord.r.DEP_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiDepartments/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.r.DEP_CODE).list("refresh");
                }
            });
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var target = $(e.target).attr("href");
                switch (target) {
                    case "#tasktypes":
                        $.when(typ.LoadTypes()).done(function () {
                            typ.LoadDepartmentTaskTypes();
                        });
                        break;
                    case "#categories":
                        $.when(cat.LoadCategories()).done(function () {
                            cat.LoadDepartmentCategories();
                        });
                        break;
                    default:
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

            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE"
            });
            $("#manager").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [{ field: "USR_CODE", value: "*", operator: "neq" }]
            });
            $("#timekeepingofficer").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [{ field: "USR_CODE", value: "*", operator: "neq" }]
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
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnmanager").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#manager",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btntimekeepingofficer").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#timekeepingofficer",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnauthorized").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#authorized",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#authorized").on("itemAdded",
                function () {
                    $("#authorizedcnt").text("(" +
                        $("#authorized").tagsinput("items").length +
                        " " +
                        applicationstrings[lang].person +
                        ")");
                }).on("itemRemoved",
                    function () {
                        var itemcount = $("#authorized").tagsinput("items").length;
                        $("#authorizedcnt").text(itemcount !== 0
                            ? "(" + itemcount + " " + applicationstrings[lang].person + ")"
                            : "");
                    });

            RegisterTabChange();
        };
        var List = function () {
            $(".list-group").list({
                listurl: "/Api/ApiDepartments/List",
                fields: {
                    keyfield: "DEP_CODE",
                    descfield: "DEP_DESCF"
                },
                sort: [{ field: "DEP_CODE", dir: "asc" }],
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
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "types":
                                return "#btnSaveTypes";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                dep.Save();
                                break;
                            case "types":
                                typ.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: "#btnNew",
                    f: function () {
                        dep.ResetUI();
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        dep.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: "#btnDelete",
                    f: function () {
                        dep.Remove();
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        dep.HistoryModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function () {
                        dep.TranslationModal();
                    }
                }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(dep.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "tasktypes":
                        typ.LoadDepartmentTaskTypes();
                        break;
                    case "categories":
                        cat.LoadDepartmentCategories();
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
        dep.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());