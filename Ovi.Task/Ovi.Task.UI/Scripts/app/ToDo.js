(function () {
    var commentsHelper;
    var documentsHelper;

    function toDoListView(container) {
        $(container).find("div.todolistitems *").remove();
        var startdate = $("#startdate").val();
        var enddate = $("#enddate").val();

        var q = {};

        switch (container) {
            case "#bydepartment":
                q = {
                    Department: $("#departments").val(),
                    Start: (startdate ? moment.utc(startdate, constants.dateformat) : null),
                    End: (enddate ? moment.utc(enddate, constants.dateformat) : null),
                    User: user
                };
                break;
            case "#createdbyme":
                q = {
                    Department: null,
                    Start: null,
                    End: null,
                    User: user
                };
                break;
        }

        return tms.Ajax({
            url: "/Api/ApiToDoList/Query",
            data: JSON.stringify(q),
            fn: function (d) {
                var htmlelmarr = {};
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    var stritem = "<div class=\"row custom todoitem\" data-id=\"" +
                        di.TOD_ID +
                        "\">" +
                        "<div class=\"col-md-6\">" +
                        "<div class=\"checkbox checkbox-info\">" +
                        (di.TOD_USER === user
                            ? "<input class=\"styled\" data-id=\"" +
                            di.TOD_ID +
                            "\" type=\"checkbox\" " +
                            (di.TOD_COMPLETED ? "checked" : "") +
                            "></input>"
                            : "") +
                        "<label>" +
                        (di.TOD_COMPLETED ? "<s>" : "") +
                        di.TOD_TEXT +
                        (di.TOD_COMPLETED ? "</s>" + "</label>" : "") +
                        "</div>" +
                        "</div>" +
                        "<div class=\"col-md-2\">" +
                        (di.TOD_CREATEDBY === user && !di.TOD_COMPLETED
                            ? "<button data-id=\"" +
                            di.TOD_ID +
                            "\" class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i></button>"
                            : "") +
                        "</div>" +
                        "<div class=\"col-md-4\">" +
                        "<span style=\"color:gray;\">" +
                        "<p><i class=\"fa fa-calendar-plus-o\"></i> " +
                        moment(di.TOD_DATE).format(constants.dateformat) +
                        "<p><i class=\"fa fa-user\"></i> " +
                        di.TOD_CREATEDBYDESC +
                        "</p>" +
                        "<p><i class=\"fa fa-clock-o\"></i> " +
                        moment(di.TOD_CREATED).format(constants.longdateformat) +
                        (di.TOD_COMPLETED
                            ? "<p><i class=\"fa fa-check-square\"></i> " +
                            moment(di.TOD_COMPLETED).format(constants.longdateformat) +
                            "</p>"
                            : "") +
                        "<p>" +
                        "<button type=\"button\" data-id=\"" +
                        di.TOD_ID +
                        "\" class=\"btn btn-default btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\">" +
                        di.TOD_CMNCNT +
                        "</span></button> " +
                        "<button type=\"button\" data-id=\"" +
                        di.TOD_ID +
                        "\"class=\"btn btn-default btn-sm btn-docs\"><i class=\"fa fa-file\"></i>  <span class=\"txt\">" +
                        di.TOD_DOCCNT +
                        "</span></button></p>" +
                        "</span>" +
                        "</div>" +
                        "</div>" +
                        "<hr>";

                    if (htmlelmarr[di.TOD_USER]) {
                        htmlelmarr[di.TOD_USER].row += stritem;
                        if (!di.TOD_COMPLETED)
                            htmlelmarr[di.TOD_USER].notcompleted++;
                    } else {
                        htmlelmarr[di.TOD_USER] = {};
                        htmlelmarr[di.TOD_USER].row = stritem;
                        htmlelmarr[di.TOD_USER].notcompleted = (!di.TOD_COMPLETED ? 1 : 0);
                    }
                }

                for (var usr in htmlelmarr) {
                    if (htmlelmarr.hasOwnProperty(usr)) {
                        var userbox = $(container).find("[data-usr=\"" + usr + "\"]");
                        userbox.find(".todo-notcompletedcount").html(htmlelmarr[usr].notcompleted != 0
                            ? " <span class=\"badge badge-danger\">" + htmlelmarr[usr].notcompleted + "</span>"
                            : "");
                        userbox.find(".todolistitems").append(htmlelmarr[usr].row);
                    }
                }
                $("div.todolistitems input[type=checkbox]").on("change",
                    function () {
                        updateToDoListItem({
                            TOD_ID: $(this).data("id"),
                            TOD_COMPLETED: ($(this).is(":checked") ? tms.Now() : null),
                            TOD_COMPLETEDBY: ($(this).is(":checked") ? user : null)
                        },
                            container);
                    });
                $("button.btn-danger").on("click",
                    function () {
                        var dataid = $(this).data("id");
                        if (dataid) {
                            $("#confirm").modal().off("click", "#delete")
                                .one("click",
                                "#delete",
                                function () {
                                    deleteToDoListItem(dataid, container);
                                });
                        }
                    });
                $("button.btn-docs").on("click",
                    function () {
                        var dataid = $(this).data("id");
                        if (dataid) {
                            documentsHelper.showDocumentsModal({ subject: "TODO", source: dataid });
                        }
                    });
                $("button.btn-comments").on("click",
                    function () {
                        var dataid = $(this).data("id");
                        if (dataid) {
                            commentsHelper.showCommentsModal({ subject: "TODO", source: dataid });
                        }
                    });

                if (container === "#createdbyme")
                    $(container).find("div.todo-card:not(:has(div.todoitem))").remove();
            }
        });
    }

    function add2ToDoList(todoitem, container) {
        return tms.Ajax({
            url: "/Api/ApiToDoList/Save",
            data: JSON.stringify(todoitem),
            fn: function (d) {
                msgs.success(d.data);
                $("[name=txtItem]").val("");
                $("[name=txtItemDate]").val("");
                toDoListView(container);
            }
        });
    }

    function deleteToDoListItem(id, container) {
       return tms.Ajax({
            url: "/Api/ApiToDoList/DelRec",
            data: JSON.stringify(id),
            fn: function (d) {
                msgs.success(d.data);
                toDoListView(container);
            }
        });
    }

    function updateToDoListItem(item, container) {
        return tms.Ajax({
            url: "/Api/ApiToDoList/Update",
            data: JSON.stringify(item),
            fn: function (d) {
                msgs.success(d.data);
                toDoListView(container);
            }
        });
    }

    function getDepartmentUsers(departments, container, visibleusers) {
        var gridreq = {
            filter: {
                filters: [
                    { field: "USR_DEPARTMENT", value: departments, operator: "in" },
                    { field: "USR_ACTIVE", value: "+", operator: "eq" },
                    { field: "USR_TYPE", value: "WHITECOLLAR", operator: "eq" },
                    { field: "USR_CODE", value: "*", operator: "neq" }
                ]
            },
            sort: [{ field: "USR_DESC", dir: "asc" }],
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiUsers/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strboxes = "";
                var usersbox = $(container).find("div.users");
                usersbox.find("*").remove();
                if (d.data.length > 0) {
                    var userindex = $.map(d.data, function (obj, index) { if (obj.USR_CODE === user) return index; });
                    if (userindex) {
                        d.data.move(userindex[0], 0);
                    }

                    for (var i = 0; i < d.data.length; i++) {
                        if (visibleusers && $.inArray(d.data[i].USR_CODE, visibleusers) === -1)
                            continue;

                        strboxes +=
                            "<div style=\"display: none;\"  class=\"todo-card col-lg-4 col-md-6 user\" data-usr=\"" +
                            d.data[i].USR_CODE +
                            "\">";
                        strboxes += "<div class=\"well board-box\">";
                        strboxes += "<div class=\"row custom\">";
                        strboxes += "<div class=\"col-md-12\">";
                        strboxes += tms.UserPic(d.data[i].USR_PIC);
                        strboxes += "<span class=\"todo-userdesc\">" + d.data[i].USR_DESC + "</span>";
                        strboxes += "<span class=\"todo-notcompletedcount\"></span>";
                        strboxes += "</div>";
                        strboxes += "</div>";
                        strboxes += "<div class=\"row custom\">";
                        strboxes += "<div class=\"col-md-3\" style=\"padding-right:1px;\">";
                        strboxes +=
                            "<input maxlength=\"10\" type=\"text\" ctrltype=\"datepicker\" class=\"form-control required\" name = \"txtItemDate\" >";
                        strboxes += "</div>";
                        strboxes += "<div class=\"col-md-9\">";
                        strboxes += "<div class=\"input-group\">";
                        strboxes +=
                            "<input maxlength=\"250\" type=\"text\" class=\"form-control required\" name = \"txtItem\" >";
                        strboxes += "<span class=\"input-group-btn\">";
                        strboxes +=
                            "<button class=\"btn btn-info\" type=\"button\" name=\"btnAddListItem\"><i class=\"fa fa-plus fa-fw\" ></i> " +
                            applicationstrings[lang].add +
                            "</button>";
                        strboxes += "</span>";
                        strboxes += "</div>";
                        strboxes += "</div>";
                        strboxes += "</div>";
                        strboxes += "<div class=\"row custom\">";
                        strboxes += "<div class=\"col-md-12\">";
                        strboxes += "<div class=\"todolistitems\"></div>";
                        strboxes += "</div>";
                        strboxes += "</div>";
                        strboxes += "</div>";
                        strboxes += "</div>";
                    }
                    usersbox.append(strboxes);
                    usersbox.find("input[ctrltype=\"datepicker\"]").datetimepicker({
                        format: constants.dateformat,
                        showClear: true,
                        icons: { clear: "fa fa-eraser" }
                    });
                    $("[name=btnAddListItem]").on("click",
                        function () {
                            var box = $(this).closest("[data-usr]");
                            var usr = box.data("usr");
                            var text = box.find("[name=txtItem]").val();
                            var date = moment.utc(box.find("[name=txtItemDate]").val(), constants.dateformat);
                            if (tms.Check(box)) {
                                var todoitem = {
                                    TOD_USER: usr,
                                    TOD_TEXT: text,
                                    TOD_DATE: date,
                                    TOD_CREATEDBY: user,
                                    TOD_CREATED: tms.Now()
                                };
                                add2ToDoList(todoitem, container);
                            }
                        });
                    $(".todo-card").fadeIn("slow");
                }
            }
        });
    }

    function listUsersAssignedByMe() {
        var gridreq = {
            filter: {
                filters: [
                    { field: "TOD_CREATEDBY", value: user, operator: "eq" }
                ]
            },
            sort: [{ field: "TOD_USER", dir: "asc" }],
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiToDoList/List",
            data: JSON.stringify(gridreq)
        });
    }

    function buildDepartments() {
        var gridreq = {
            filter: { filters: [{ field: "DEP_ACTIVE", value: "+", operator: "eq" }] },
            sort: [{ field: "DEP_CODE", dir: "asc" }]
        };

        return tms.Ajax({
            url: "/Api/ApiDepartments/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strdepartments = "";
                $("#departments option").remove();
                for (var i = 0; i < d.data.length; i++) {
                    strdepartments += "<option value=\"" +
                        d.data[i].DEP_CODE +
                        "\">" +
                        d.data[i].DEP_DESC +
                        "</option>";
                }
                $("#departments").append(strdepartments);
                $("#departments").val(department).trigger("change");
            }
        });
    }

    function loadToDoListAssignedByMe() {
        var gridreq = {
            filter: { filters: [{ field: "TOD_CREATEDBY", value: user, operator: "eq" }] },
            sort: [{ field: "TOD_DEPARTMENT", dir: "asc" }]
        };

        return tms.Ajax({
            url: "/Api/ApiToDoList/ListCount",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var departments = $.map(d.data, function (n, i) { return n.TOD_DEPARTMENT; });
                $.when(listUsersAssignedByMe()).done(function (du) {
                    var users = $.map(du.data, function (n, i) { return n.TOD_USER; });
                    $.when(getDepartmentUsers(departments, "#createdbyme", users)).done(function () {
                        toDoListView("#createdbyme");
                    });
                });
            }
        });
    }

    function loadToDoListByDepartment() {
        var departments = [$("#departments").val()];
        $.when(getDepartmentUsers(departments, "#bydepartment")).done(function () {
            toDoListView("#bydepartment");
        });
    }

    var RegisterTabChange = function () {
        $(document).on("shown.bs.tab",
            "a[data-toggle=\"tab\"]",
            function (e) {
                var target = $(e.target).attr("href");
                if (target === "#bydepartment") {
                    loadToDoListByDepartment();
                } else if (target === "#createdbyme") {
                    loadToDoListAssignedByMe();
                }
            });
    };

    function buildUI() {
        $("#departments").select2({
            minimumResultsForSearch: Infinity,
            dropdownAutoWidth: true
        });
        $.when(buildDepartments()).done(function () { loadToDoListByDepartment(); });
        $("#btnRefresh").click(function () { loadToDoListByDepartment(); });

        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentcounttext: "div[data-id=\"#source#\"] button.btn-docs span.txt",
            modal: "#modaldocuments",
            documentsdiv: "#docs"
        });

        commentsHelper = new comments({
            input: "#comment",
            btnaddcomment: "#addComment",
            modal: "#modalcomments",
            commentcounttext: "div[data-id=\"#source#\"] button.btn-comments span.txt",
            commentsdiv: "#comments"
        });

        RegisterTabChange();
    }

    function ready() {
        buildUI();
    }

    $(document).ready(ready);
}());