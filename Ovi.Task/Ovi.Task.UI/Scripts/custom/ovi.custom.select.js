var select = function (o) {
    var Build = function (d) {
        var $ctrl = o.optgroup ? $(o.optgroup) : $(o.ctrl);

        var optionList = "";
        for (var i = 0; i < d.length; i++) {
            var code = d[i][o.keyfield];
            var desc = d[i][o.textfield];
            if (code !== "")
                optionList = optionList + "<option class=\"dynamic\"" + (o.selected && o.selected === code ? "selected=\"selected\"" : "") + " value=" + code + ">" + desc + "</option>";
        }

        $ctrl.find("option.dynamic").remove();
        $ctrl.append(optionList);
    };
    var Fill = function () {
        return tms.Ajax({
            type: o.data != null ? "POST" : "GET",
            url: o.url,
            data: o.data,
            fn: function (d) {
                Build(d.data);
                if (o.callback && typeof (o.callback) == "function")
                    o.callback(d.data);
            },
            error: function (a, b, c, d) {
                msgs.error("Something went wrong. <br/>" + a.status + " " + a.statusText);
            }
        });
    };
    return {
        Build: Build,
        Fill: Fill
    };
}