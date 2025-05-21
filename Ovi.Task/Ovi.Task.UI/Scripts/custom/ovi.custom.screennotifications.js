(function () {

    var notificationlist;
    var ind = 0;
    var modalscreennotification;

    var showModal = function () {
        if (ind < notificationlist.length) {
            modalscreennotification.on("shown.bs.modal", function () { $(document).off("focusin.modal"); });
            modalscreennotification.find(".modal-body").height(shared.windowHeight() / 3);
            modalscreennotification.find(".modal-title").text(notificationlist[ind].NOT_TITLE);
            modalscreennotification.find(".modal-body #content").find("*").remove();
            modalscreennotification.find(".modal-body #content").html(notificationlist[ind].NOT_CONTENT);
            modalscreennotification.data("id", notificationlist[ind].NOT_ID);
            modalscreennotification.modal("show");
        }
    }

    var listScreenNotifications = function()
    {
        var gridreq = {
            filter: {
                filters: [
                    { field: "NOT_EFFECTIVEDATE", value: tms.Now(), operator: "gte" },
                    { field: "NOT_USERGROUP", value: usergroup, operator: "eq" },
                    { field: "NOT_SCREEN", value: screen, operator: "eq" },
                    { field: "NOT_VISIBLE", value: "+", operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiScreenNotifications/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                notificationlist = d.data;
                if (notificationlist.length > 0) {
                    showModal();
                }
            }
        });
    }

    var DoNotShowNotificationAgain = function (id) {
        var def = $.Deferred();
        var donotshowagain = $("#donotshowagain").is(":checked");
        var id = modalscreennotification.data("id");
        if (donotshowagain) {
            return tms.Ajax({
                url: "/Api/ApiScreenNotifications/DoNotShow",
                data: JSON.stringify(id)
            });
        } else {
            return def.resolve();
        }
        return def.promise();
    }

    var registerUIEvents = function() {
        $("#btnscreennotification_ok").on("click", function() {
            ind++;
            $.when(DoNotShowNotificationAgain()).done(function () {
                modalscreennotification.modal("hide");
                showModal();
            });
        });
    }

    $(document).ready(function () {
        modalscreennotification = $("#modalscreennotification");
        listScreenNotifications();
        registerUIEvents();
    });
})();