var tooltip = (function () {

    var show = function (selector, text, style, position, attr) {
        hide(selector);
        $(selector).each(function (idx) {
            var inpelm = $(this);
            if (text) {
                var parentelm = inpelm.parent();
                if (!parentelm.hasClass("btn-group")) {
                    if (!inpelm.parent().is("qtip"))
                        inpelm.wrap("<qtip></qtip>");

                    var qtipelm = inpelm.parent();
                    qtipelm.qtip({
                        content: { text: text },
                        style: style || { classes: "qtip-dark" },
                        position: position || { my: "bottom center", at: "top right", target: inpelm }
                    });
                }
            }
            else if (attr) {
                var parentelm = inpelm.parent();
                if (!parentelm.hasClass("btn-group")) {
                    if (!inpelm.parent().is("qtip"))
                        inpelm.wrap("<qtip></qtip>");

                    var qtipelm = inpelm.parent();
                    var tooltxt = inpelm.attr(attr);
                    if (tooltxt) {
                        qtipelm.qtip({
                            content: { text: tooltxt },
                            style: style || { classes: "qtip-dark" },
                            position: position || { my: "bottom center", at: "top right", target: inpelm }
                        });
                    }
                }
            }
        });
    };
    var showwithoutwrapping = function (selector, text) {
        if (text) {
            var qtipelm = $(selector);
            qtipelm.qtip({
                content: { text: text },
                style: { classes: "qtip-default" },
                position: { my: "top right", at: "bottom center", target: $(selector) },
                events: {
                    show: function (event, api) {
                        var centerofwin = $(window).width() / 2;
                        var $el = $(api.elements.target[0]);
                        if ($el.offset().left <= centerofwin) {
                            $el.qtip("option", "position.my", $el.data("tooltip-my-position") || "top left");
                            $el.qtip("option", "position.at", $el.data("tooltip-at-position") || "bottom center");
                        } else {
                            $el.qtip("option", "position.my", $el.data("tooltip-my-position") || "top right");
                            $el.qtip("option", "position.at", $el.data("tooltip-at-position") || "bottom center");
                        }
                    }
                }
            });
        }
    };
    var hide = function (selector) {
        if ($(selector).data("qtip") || $(selector).parent().data("qtip")) {
            if ($(selector).parent().is("qtip")) {
                $(selector).parent().qtip("destroy", true);
                $(selector).unwrap();
            } else {
                $(selector).qtip("destroy", true);
            }
        }
    };
    var getText = function (selector) {
        if ($(selector).parent().is("qtip")) {
            return $(selector).parent().qtip("option", "content.text");
        } else {
            return $(selector).qtip("option", "content.text");
        }
    };
    return {
        show: show,
        showwithoutwrapping: showwithoutwrapping,
        hide: hide,
        getText: getText
    };
}())