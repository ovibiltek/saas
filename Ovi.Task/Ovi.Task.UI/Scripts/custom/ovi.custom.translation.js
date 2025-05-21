var translation = (function (m) {
    m.modal = (function () {
        var modal = null;
        var param = null;

        var _modalSave = function () {
            var textctrls = $("input[data-lang]");
            var vals = [];

            for (var i = 0; i < textctrls.length; i++) {
                if (!$(textctrls[i]).val())
                    continue;

                var tdes = {};
                tdes["DES_LANG"] = $(textctrls[i]).data("lang");
                tdes["DES_TEXT"] = $(textctrls[i]).val();
                for (var j = 0; j < param.filter.length; j++) {
                    tdes[param.filter[j].field] = param.filter[j].value;
                }
                vals.push(tdes);
            }

            return tms.Ajax({
                url: "Api/ApiDescriptions/Save",
                data: JSON.stringify(vals),
                quietly: true,
                fn: function (d) {
                    msgs.success(d.data);
                }
            });

            modal.modal("hide");
        };
        var _loadTranslationData = function () {
            var f = {
                filter: {
                    filters: param.filter
                }
            };

            return tms.Ajax({
                url: "Api/ApiDescriptions/List",
                data: JSON.stringify(f),
                quietly: true,
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        $("input[data-lang=\"" + d.data[i].DES_LANG + "\"]").val(d.data[i].DES_TEXT);
                    }
                }
            });
        };
        var _buildScreen = function () {
            return tms.Ajax({
                url: "/Api/ApiLanguage/List",
                quietly: true,
                data: JSON.stringify({}),
                fn: function (d) {
                    var strCtrl = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strCtrl += "<div class=\"row custom\">";
                        strCtrl += "<div class=\"col-md-2\">";
                        strCtrl += d.data[i].LNG_DESCRIPTION;
                        strCtrl += "</div>";
                        strCtrl += "<div class=\"col-md-10\">";
                        strCtrl += "<input data-lang=\"" +
                            d.data[i].LNG_CODE +
                            "\" type=\"text\" maxlength=\"250\" name=\"text\" class=\"form-control\" />";
                        strCtrl += "</div>";
                        strCtrl += "</div>";
                    }

                    var modalbody = $("#modaltranslation .modal-body");
                    modalbody.find("*").remove();
                    $("#modaltranslation .modal-body").append(strCtrl);
                    return _loadTranslationData();
                }
            });
        };
        var _registerEvents = function () {
            $("[data-action=\"save\"]").off().click(_modalSave);
        };
        var show = function (p) {
            param = p;
            $("#modaltranslation").on("shown.bs.modal", function () { $(document).off("focusin.modal"); });
            $.when(_buildScreen()).done(function () {
                modal = $("#modaltranslation").modal("show");
                _registerEvents();
            });
        };
        return {
            show: show
        };
    }());

    m.box = function () {
        var param = null;

        var setParam = function (p) {
            param = p;
        };
        var resetUI = function () {
            if (param.textarea)
                $(param.containerid).find("textarea[data-lang]").val("");
            else
                $(param.containerid).find("input[data-lang]").val("");
        };

        var loadTranslationData = function (callback) {
            var f = {
                filter: {
                    filters: param.filter
                }
            };

            return tms.Ajax({
                url: "/Api/ApiDescriptions/List",
                data: JSON.stringify(f),
                quietly: true,
                fn: function (d) {
                    if (param.textarea)
                        $(param.containerid).find("textarea[data-lang]").val("");
                    else
                        $(param.containerid).find("input[data-lang]").val("");

                    for (var i = 0; i < d.data.length; i++) {
                        if (param.textarea)
                            $(param.containerid).find("textarea[data-lang=\"" + d.data[i].DES_LANG + "\"]")
                                .val(d.data[i].DES_TEXT);
                        else
                            $(param.containerid).find("input[data-lang=\"" + d.data[i].DES_LANG + "\"]")
                                .val(d.data[i].DES_TEXT);
                    }

                    if (callback && typeof (callback) == "function")
                        callback();
                }
            });
        };

        var loadUI = function (callback) {

            var f = {};

            return tms.Ajax({
                url: "Api/ApiLanguage/List",
                data: JSON.stringify(f),
                quietly: true,
                fn: function (d) {
                    var strCtrl = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strCtrl += "<div class=\"row custom\">";
                        strCtrl += "<div class=\"col-md-2\">";
                        strCtrl += d.data[i].LNG_DESCRIPTION;
                        strCtrl += "</div>";
                        strCtrl += "<div class=\"col-md-10\">";
                        if (param.textarea)
                            strCtrl += "<textarea rows=\"5\" data-lang=\"" +
                                d.data[i].LNG_CODE +
                                "\" maxlength=\"500\" class=\"form-control\" />";
                        else
                            strCtrl += "<input data-lang=\"" +
                                d.data[i].LNG_CODE +
                                "\" type=\"text\" maxlength=\"250\" name=\"text\" class=\"form-control\" />";
                        strCtrl += "</div>";
                        strCtrl += "</div>";
                    }

                    $(param.containerid).find("*").remove();
                    $(param.containerid).append(strCtrl);

                    if (callback && typeof (callback) == "function")
                        callback();
                }
            });
        };

        return {
            setParam: setParam,
            resetUI: resetUI,
            loadTranslationData: loadTranslationData,
            loadUI: loadUI
        };
    };

    return m;
}(translation || {}));