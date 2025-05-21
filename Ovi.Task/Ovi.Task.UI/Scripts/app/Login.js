(function () {
    $(".login-wrap").css({
        'position': "absolute",
        'left': "50%",
        'top': "50%",
        'margin-left': -$(".login-wrap").outerWidth() / 2,
        'margin-top': -$(".login-wrap").outerHeight() / 2
    });

    function login() {
        var usrname = $("#un").val();
        var pass = $("#pw").val();
        var qd = new QueryData();

        if (!usrname) {
            $("#un").addClass("isempty");
            $("#un").velocity("callout.shake");
        } else
            $("#un").removeClass("isempty");

        if (!pass) {
            $("#pw").addClass("isempty");
            $("#pw").velocity("callout.shake");
        } else
            $("#pw").removeClass("isempty");

        if (usrname && pass) {
            var cp = {
                Username: $("#un").val(),
                Password: $("#pw").val()
            };

            return tms.Ajax({
                url: "/Api/ApiLogin/Check",
                data: JSON.stringify(cp),
                fn: function (d) {
                    window.location.href = "path" in qd ? qd.path : d.page;
                }
            });
        }
    }

    function registerInpEvents() {
        $("#btnLogin").click(login);
        $("*").bind("keydown",
            "return",
            function () {
                login();
                return false;
            });
    }

    function ready() {
        registerInpEvents();
        $("[data-type=\"input\"]").focusin(function () {
            $(this).addClass("iselection");
        }).focusout(function () {
            $(this).removeClass("iselection");
        });
        $("#fakeinputs").remove();
    };

    $(document).ready(ready);
}());