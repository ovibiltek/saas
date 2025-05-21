var shared = {
    setCulture: function (culcode) {
        kendo.culture(culcode);
    },
    windowHeight: function () {
        return $(window).height();
    },
    windowWidth: function () {
        return $(window).width();
    },
    documentHeight: function () {
        var html = document.documentElement;
        var height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight);
        return height;
    },
    documentWidth: function () {
        var html = document.documentElement;
        var width = Math.max(html.clientWidth, html.scrollWidth, html.offsetWidth);
        return width;
    },
    hasScrollBar: function (css) {
        var el = $(css);
        if (el.length > 0) {
            return el[0].scrollHeight > el[0].clientHeight;
        }
        return false;
    },
    renderMenu: function () {
        return tms.Ajax({
            url: "/Api/ApiMenuConfiguration/GetMenuByUser",
            fn: function (m) {
                if (m.data) {
                    var outputstr = m.data.MNU_STRING;
                    $("#appmenu").empty();
                    if (outputstr != "[]" || outputstr != "" || outputstr != null) {

                        $('#appmenu').renderizeMenu(outputstr, {
                            active: '#',
                            rootClass: "nav navbar-nav navbar-left",
                            menuClass: "dropdown-menu",
                            submenuClass: "dropdown-menu",
                            dropdownIcon: '<span class="fa fa-caret-down"></span>',
                            linkHasMenuClass: 'dropdown-toggle',
                            itemHasMenuClass: 'dropdown',
                            menuItemHasSubmenuClass: 'dropdown-submenu'
                        });
                    }
                }
            }
        });
    }
};
var constants = (function () {
    var p = {
        'fullformat': "YYYY-MM-DD[T]HH:mm:ss",
        'dateformat': "DD-MM-YYYY",
        'dateformat2': "YYYY-MM-DD",
        'sqldateformat': "YYYYMMDD",
        'longdateformat': "DD-MM-YYYY HH:mm",
        'timeformat': "HH:mm",
        'kendodateformat': "dd-MM-yyyy",
        'kendodatetimeformat': "dd-MM-yyyy HH:mm",
        'defaultgridheight': (shared.documentHeight() - 140),
        'defaultlistheight': (shared.documentHeight() - 240),
        'gridpagesize': 30,
        'pricedecimals': 2,
        'qtydecimals': 2,
        'exchdecimals': 4,
        'durationformat': {
            'TR': "h [sa] m [dk]",
            'EN': "h [hr] m [min]"
        }
    };

    return p;
}());
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this;
};
String.prototype.toUpper = function () {
    var string = this;
    var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
    string = string.replace(/(([iışğüçö]))/g, function (letter) { return letters[letter]; });
    return string.toUpperCase();
};
String.prototype.toLower = function () {
    var string = this;
    var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
    string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter) { return letters[letter]; });
    return string.toLowerCase();
};
Array.prototype.pushUnique = function (item) {
    if (this.indexOf(item) === -1) {
        this.push(item);
    }
    return this;
};
String.prototype.validateAsAnEMail = function() {
    var string = this;
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return re.test(string);
}
String.prototype.toColor = function () {
    var colors = ["#e51c23", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#5677fc", "#03a9f4", "#00bcd4", "#009688", "#259b24", "#8bc34a", "#afb42b", "#ff9800", "#ff5722", "#795548", "#607d8b"]

    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        hash = this.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
}
String.prototype.toHex = function () {
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        hash = this.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var color = "#";
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
}
String.prototype.format = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i]);
    }
    return s;
}
String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}
String.prototype.startsWith = function (prefix) {
    return (this.substr(0, prefix.length) === prefix);
}
String.prototype.newUrl = function (sparam) {
    var location = this;
    var urlarr = location.split("?");
    if (urlarr.length == 2) {
        var url = urlarr[0] + "?";
        var sPageURL = decodeURIComponent(urlarr[1]),
            sURLVariables = sPageURL.split("&"),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split("=");
            if (sparam.indexOf(sParameterName[0]) != -1) {
                url = url + sParameterName[0] + "=" + sParameterName[1] + "&";
            }
        }
        return url.substring(0, url.length - 1);
    }
    return this;
}
Number.prototype.toLocale = function (culture, useGrouping) {
    var v = this;
    return v.toLocaleString(culture, { useGrouping: useGrouping || false});
}
String.prototype.toNumber = function () {
    var v = this;
    return Number(v.replace(".", "").replace(",", "."));
}
String.prototype.toDate = function () {
    var v = this;
    var d = moment.utc(v, constants.dateformat);
    return d.isValid() ? d : null;
}
Number.prototype.fixed = function(decimals) {
    var x = Math.pow(10, Number(decimals) + 1);
    var number = this;
    return (Number(number) + (1 / x)).toFixed(decimals);
}

String.prototype.ReplaceTrChars = function () {
    return this
        .replace(/Ğ/g, "G")
        .replace(/ğ/g, "g")
        .replace(/Ü/g, "U")
        .replace(/ü/g, "u")
        .replace(/Ş/g, "S")
        .replace(/ş/g, "s")
        .replace(/İ/g, "I")
        .replace(/ı/g, "i")
        .replace(/Ö/g, "O")
        .replace(/ö/g, "o")
        .replace(/Ç/g, "C")
        .replace(/ç/g, "c");
}




