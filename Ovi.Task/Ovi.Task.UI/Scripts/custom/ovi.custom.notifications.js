(function () {

    function getNotificationUrl(d) {
        var notesubject = d.NOT_SUBJECT;
        switch (notesubject) {
            case "TASK":
            case "ACTIVITY":
                return "/Task/Record/" + d.NOT_SOURCE;
            case "TODO":
                return "/ToDo/List";
            default:
                return "#";
        }
    }

    function getNotificationIcon(d) {
        var notetype = d.NOT_TYPE;
        switch (notetype) {
            case "NEWCOMMENT" :
                return "<i style=\"color:#517fa6;\" class=\"fa fa-4x fa-comments\"></i>";
            case "NEWDOC" :
                return "<i style=\"color:#8b576d;\" class=\"fa fa-4x fa-file-o\"></i>";
            case "NEWTASK" :
                return "<i style=\"color:#fea64f;\" class=\"fa fa-4x fa-tasks\"></i>";
            case "NEWTODO": 
                return "<i style=\"color:#cd53ee;\" class=\"fa fa-4x fa-list\"></i>";
            default:
                return "";
        }
    }

    function updateNotificationsAsRead(lstelm) {
        var updateNotificationsAsReadParams = {
            Subject: lstelm.data("list-subject"),
            Type: lstelm.data("list-type"),
            Owner: user
        };

        return tms.Ajax({
            url: "/Api/ApiNotification/UpdateNotificationsAsRead",
            data: JSON.stringify(updateNotificationsAsReadParams),
            fn: function (d) {
                var cntelm = $("span[data-badge-type=\"" + updateNotificationsAsReadParams.Type + "\"]");
                cntelm.text("0").removeClass().addClass("badge badge-inverse");
            }
        });
    }

    function buildNotificationList(lstelm) {
        var gridreq = {
            pageSize: 5,
            filter: {
                filters: [
                    { field: "NOT_OWNER", value: user, operator: "eq" },
                    { field: "NOT_TYPE", value: lstelm.data("list-type"), operator: "eq" }
                ]
            },
            sort: [
                { field: "NOT_READ", dir: "asc" },
                { field: "NOT_CREATED", dir: "desc" }
            ]
        };

        return tms.Ajax({
            url: "/Api/ApiNotification/List",
            quietly: true,
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strlst = "";
                lstelm.find("*").remove();
                if (d.data.length > 0) {
                    strlst += "<div class=\"notify-drop-title\">" +
                        "<div class=\"row\">" +
                        "<div class=\"col-md-6 col-sm-6 col-xs-6\">" + applicationstrings[lang].nottype[d.data[0].NOT_TYPE] + " (<b>" +
                        d.data.length +
                        "</b>)</div>" +
                        "<div class=\"col-md-6 col-sm-6 col-xs-6 text-right\"><a href=\"\" class=\"rIcon allRead\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"tümü okundu.\"><i class=\"fa fa-dot-circle-o\"></i></a></div>" +
                        "</div>" +
                        "</div>" +
                        "<div class=\"drop-content\">";

                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        strlst += "<li" + (di.NOT_READ == "-" ? " style=\"background:#f8f8e2;\"" : "") + ">" +
                            "<div class=\"col-md-3 col-sm-3 col-xs-3\"><div class=\"notify-icon\">" + getNotificationIcon(di)  + "</div></div>" +
                            "<div class=\"col-md-9 col-sm-9 col-xs-9 pd-l0\"><a href=\"" + getNotificationUrl(di) + "\">" + di.NOT_DESC + "</a><a href=\"\" class=\"rIcon " + (di.NOT_READ === "-" ? "notread" : "") + "\"><i class=\"fa fa-dot-circle-o\"></i></a>" +
                            "<p><span class=\"createdby\">" +
                            di.NOT_CREATEDBY +
                            "</span><span class=\"fromnow\"><i class=\"fa fa-clock-o\"></i> " +
                            moment(di.NOT_CREATED).format(constants.longdateformat) +
                            "</span></p>" +
                            "</div>" +
                            "</li>";
                    }

                    strlst += "</div>";
                    strlst += "<div class=\"notify-drop-footer text-center\">" +
                        "<a href=\"/Notifications\"><i class=\"fa fa-eye\"></i> " + applicationstrings[lang].showall + "</a>" +
                        "</div>";


                    lstelm.append(strlst);
                    lstelm.find("a.allRead").on("click", function () {
                        updateNotificationsAsRead(lstelm);
                    });

                }
            }
        });
    }

    function notificationUI(d) {
        var nccount = 0;
        var ndcount = 0;
        var ntcount = 0;
        var ntdcount = 0;

        var ncspan = $("[data-badge-type=\"NEWCOMMENT\"]");
        var nclist = $("[data-list-type=\"NEWCOMMENT\"]");

        var ndspan = $("[data-badge-type=\"NEWDOC\"]");
        var ndlist = $("[data-list-type=\"NEWDOC\"]");

        var ntspan = $("[data-badge-type=\"NEWTASK\"]");
        var ntlist = $("[data-list-type=\"NEWTASK\"]");

        var ntdspan = $("[data-badge-type=\"NEWTODO\"]");
        var ntdlist = $("[data-list-type=\"NEWTODO\"]");

        for (var i = 0; i < d.length; i++) {
            var notetype = d[i].NOT_TYPE;
            switch (notetype) {
                case "NEWCOMMENT":
                    nccount = d[i].NOT_COUNT;
                    break;
                case "NEWDOC":
                    ndcount = d[i].NOT_COUNT;
                    break;
                case "NEWTASK":
                    ntcount = d[i].NOT_COUNT;
                    break;
                case "NEWTODO":
                    ntdcount = d[i].NOT_COUNT;
                    break;
                default:
            }
        }

        ncspan.removeClass();
        ncspan.text(nccount);
        ncspan.addClass(nccount > 0 ? "badge badge-danger" : "badge badge-inverse");
        if (nccount === 0)
            nclist.find("li.divider").remove();

        ndspan.removeClass();
        ndspan.text(ndcount);
        ndspan.addClass(ndcount > 0 ? "badge badge-danger" : "badge badge-inverse");
        if (ndcount === 0)
            ndlist.find("li.divider").remove();

        ntspan.removeClass();
        ntspan.text(ntcount);
        ntspan.addClass(ntcount > 0 ? "badge badge-danger" : "badge badge-inverse");
        if (ntcount === 0)
            ntlist.find("li.divider").remove();

        ntdspan.removeClass();
        ntdspan.text(ntdcount);
        ntdspan.addClass(ntdcount > 0 ? "badge badge-danger" : "badge badge-inverse");
        if (ntdcount === 0)
            ntdlist.find("li.divider").remove();

        $("[data-type=\"notification\"]").on("click",
            function () {
                var $this = $(this);
                var lstelm = $this.parent().find("ul");
                var type = lstelm.data("list-type");
                var spancnt = parseInt($("span[data-badge-type=\"" + type + "\"]").text());

                buildNotificationList(lstelm); 
            });
    }

    function loadNotifications() {
        var gridreq = { filter: { filters: [{ field: "NOT_OWNER", value: user, operator: "eq" }] } };

        return tms.Ajax({
            url: "/Api/ApiNotification/GetCounts",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                notificationUI(d.data);
            }
        });
    }

    $(document).ready(function () {
        // loadNotifications();
    });
})();