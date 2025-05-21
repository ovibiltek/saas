(function () {
    var screensdiv;

    function LoadScreens() {
        screensdiv.find("*").remove();
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
                    screensdiv.append(strScreenList);
                    screensdiv.find("input[type=\"checkbox\"]").on("change", function () {
                        $(this).blur();
                    });

                    screensdiv.find("div.input-group input[type=\"text\"]").each(function (index) {
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
                    screensdiv.find("button.btn-securityfilter").on("click", function () {
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
    }

    function LoadUserGroupScreens() {
        var screens = screensdiv.find("div.row");
        var usergroup = $("#usergroup").val();
        var filter = {
            filter: { filters: [{ field: "MNU_USERGROUP", operator: "eq", value: usergroup }] },
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

    function Save() {
        var screens = screensdiv.find("div.row");
        var screenlist = [];

        for (var i = 0; i < screens.length; i++) {
            var $that = $(screens[i]);
            var scrcode = $that.data("screen");
            var securityfilter = ($that.find("input[type=\"text\"]").val() || null);
            var checked = $that.find("input[type=\"checkbox\"]").prop("checked");
            var identity = $that.data("identity") || 0;
            var recordversion = $that.data("recordversion") || 0;

            screenlist.push({
                MNU_USERGROUP: $("#usergroup").val(),
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
                return $.when(LoadScreens()).done(function () {
                    return LoadUserGroupScreens();
                });
            }
        });
    };

    function BuildUI() {
        $("#btnUserGroup").click(function () {
            gridModal.show({
                modaltitle: gridstrings.usergroup[lang].title,
                listurl: "/Api/ApiUserGroups/List",
                keyfield: "UGR_CODE",
                codefield: "UGR_CODE",
                textfield: "UGR_DESC",
                returninput: "#usergroup",
                columns: [
                    { type: "string", field: "UGR_CODE", title: gridstrings.usergroup[lang].usergroup, width: 100 },
                    { type: "string", field: "UGR_DESC", title: gridstrings.usergroup[lang].description, width: 400 }
                ],
                filter: [
                    { field: "UGR_CODE", value: "*", operator: "neq" }
                ],
                callback: function (data) {
                    if (data) {
                        return $.when(LoadScreens()).done(function () {
                            return LoadUserGroupScreens();
                        });
                    }
                }
            });
        });
        $("#usergroup").autocomp({
            listurl: "/Api/ApiUserGroups/List",
            field: "UGR_CODE",
            textfield: "UGR_DESC",
            filter: [{ field: "UGR_CODE", value: "*", operator: "neq" }],
            callback: function (data) {
                if (data) {
                    return $.when(LoadScreens()).done(function () {
                        return LoadUserGroupScreens();
                    });
                }
            }
        });
        $("#btnSave").off("click").click(Save);
    }

    function BindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    Save();
                }
            }
        ]);
    }

    function DocumentReady() {
        screensdiv = $("div.screens");
        BuildUI();
        BindHotKeys();
    }

    $(document).ready(DocumentReady);
}());