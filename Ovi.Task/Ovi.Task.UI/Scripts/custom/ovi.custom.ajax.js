$.xhrPool = [];
$.isBlocked = false;
$.activeAjaxConnections = 0;

(function () {
    function Ready() {

        $(".load-bar").hide();

        if ($.blockUI) {
            $.blockUI.defaults.message = null;
        }

        $.xhrPool.abortAll = function () {
            $(this).each(function (i, jqXHR) {
                jqXHR.abort();
                $.xhrPool.splice(i, 1);
            });
        };
        $.ajaxSetup({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (e, x) {
                $.xhrPool.push(e);
                $.activeAjaxConnections++;
                if ($.activeAjaxConnections === 1) {
                    window.previousscrollposition = $(window).scrollTop();
                    if (!x.quietly) {
                        $(".load-bar").show();
                    }
                    if ($.blockUI && !$.isBlocked) {
                        $.isBlocked = true;
                        $.blockUI();
                    }
                }
            },
            complete: function (e, x) {
                var i = $.xhrPool.indexOf(e);
                if (i > -1) $.xhrPool.splice(i, 1);

                if ($.activeAjaxConnections > 0)
                    $.activeAjaxConnections--;

                if ($.activeAjaxConnections === 0) {
                    $("#wrapper").css({ visibility: "visible" });
                    if (!x.quietly)
                        $(".load-bar").hide();

                    $(window).scrollTop(window.previousscrollposition);

                    if ($.blockUI && $.isBlocked) {
                        $.isBlocked = false;
                        $.unblockUI();
                    }
                }
            },
            error: function (xhr) {
                if (xhr.status)
                    msgs.error(xhr.statusText);
            }
        });
    }

    $(document).ready(Ready);
}());