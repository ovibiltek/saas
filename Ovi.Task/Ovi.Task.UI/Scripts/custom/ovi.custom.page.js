window.previousscrollposition = null;

(function () {
    if (typeof Object.defineProperty === "function") {
        try {
            Object.defineProperty(Array.prototype, "sortBy", { value: sb });
        } catch (e) {
        }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();

(function () {

    function RegisterFormCodeInputKeyups() {
        $(document).on("keyup", "input.form-code", function () {
            $(this).val($(this).val()
                .replace(/[^A-Z0-9-.]+/ig, "")
                .toUpperCase());
        });
        $(document).on("keyup", "input.form-desc", function () {
            $(this).val($(this).val()
                .replace(/[^A-Z0-9- !'@#$*%&()=?>{[}\]\\-`.+,/\"]+/ig, "")
                .toUpperCase());
        });
    }

    function KeepScrollPositionOnClick() {
        $(document).on("click",
            "a,button",
            function () {
                window.previousscrollposition = $(window).scrollTop();
            });
    }

    function RegisterAbortAjaxForNavigationLinkClick() {
        $("#appnavbar a:not([href=\"#\"])").click(function (e) {
            $.xhrPool.abortAll();
        });
    }

    function RegisterGlobalTabClick() {
        $("ul.nav.nav-tabs li a, ul.nav.nav-pills li a").on("click",
            function (e) {
                var istargetdefined = $(this).attr("href") !== "#";
                var isexternal = $(this).data("external") === "+";
                var isenabled = $(this).is("[data-toggle=\"tab\"]");
                if (!isenabled && !isexternal && istargetdefined)
                    msgs.error(applicationstrings[lang].selectarecord);
            });
    }

    function SortMenu() {
        var dropdowns = $("#appmenubar ul.dropdown-menu");
        for (var i = 0; i < dropdowns.length; i++) {
            var $dd = $(dropdowns[i]);
            var $ddi = $($dd.children("li"));

            $ddi.sort(function (a, b) {
                var an = $(a).find("a").text();
                var bn = $(b).find("a").text();

                if (an > bn) {
                    return 1;
                }
                if (an < bn) {
                    return -1;
                }
                return 0;
            });

            $ddi.detach().appendTo($dd);
        }
    }

    function Title2Tooltip() {
        $("input[title]").each(function () {
            tooltip.show($(this), $(this).attr("title"));
        });
        $("a[title]").each(function () {
            tooltip.showwithoutwrapping($(this), $(this).attr("title"));
        });
    }

    function numericInput() {
        if ($.fn.numericInput) {
            var numericfields = $("[ctrltype=\"numeric\"]");
            for (var j = 0; j < numericfields.length; j++) {
                var nf = $(numericfields[j]);
                var allowFloat = ((nf.attr("allowfloat") == "true") || false);
                var allowNegative = ((nf.attr("allownegative") == "true") || false);
                nf.numericInput({ allowNegative: allowNegative, allowFloat: allowFloat });
            }
            $("[valtype=\"PRICE\"]").on("blur",
                function () {
                    var v = $(this).val();
                    if (v)
                        $(this).val(parseFloat(v).toFixed(constants.pricedecimals));
                });
            $("[valtype=\"EXCH\"]").on("blur",
                function () {
                    var v = $(this).val();
                    if (v)
                        $(this).val(parseFloat(v).toFixed(constants.exchdecimals));
                });
        }
    }

    function tagsInput() {
        if ($.fn.tagsinput) {
            $("[data-role=\"multival\"]").tagsinput({
                allowDuplicates: false,
                freeInput: false,
                itemValue: "id",
                itemText: "text",
                itemText: function (item) {
                    return (typeof item.text === 'string' || item.text instanceof String) ?
                        (item.text.length <= 40 ? item.text : item.text.substring(0, 40) + "...") : item.text;

                },
                tagClass: function (item) {
                    if (item.active === "-") {
                        return 'labelmultiple label label-danger';
                    }
                    if (item.primary == "+") {
                        return 'labelmultiple label label-danger';
                    }
                    return 'labelmultiple label label-info';
                }
            });
            $("div.bootstrap-tagsinput input").attr("readonly", "true");
        }
    }

    function dateTimePicker() {
        if ($.fn.datetimepicker) {
            moment.updateLocale(lang.toLowerCase(), { week: { dow: 1 } });
            $("[ctrltype=\"datepicker\"]").datetimepicker({
                format: constants.dateformat,
                showClear: true,
                icons: { clear: "fa fa-eraser" }
            });
            $("[ctrltype=\"datetimepicker\"]").datetimepicker({
                format: constants.longdateformat,
                showClear: true,
                icons: { clear: "fa fa-eraser" }
            });
            $("[ctrltype=\"timepicker\"]").datetimepicker({
                format: constants.timeformat,
                showClear: true,
                icons: { clear: "fa fa-eraser" }
            });
        }
    }

    function maskInput() {
        if ($.fn.mask) {
            $("[ctrltype=\"phone\"]").mask("9999999999");
            $("[ctrltype=\"Mainphone\"]").mask("9999999999");
            $(".phone-number").mask("9999999");
        }
    }

    function bootstrapSwitch() {
        if ($.fn.bootstrapSwitch) {
            $.fn.bootstrapSwitch.defaults.size = "mini";
            $.fn.bootstrapSwitch.defaults.labelText = applicationstrings[lang].follow;
            $.fn.bootstrapSwitch.defaults.onText = applicationstrings[lang].on;
            $.fn.bootstrapSwitch.defaults.offText = applicationstrings[lang].off;
        }
    }

    $(document).ready(function () {

        var timeDiff = tms.GetTimeDiff();
        window.timediff = timeDiff.timeDifference;
        window.serverutcoffset = timeDiff.serverUtcOffset;
        RegisterFormCodeInputKeyups();
        RegisterAbortAjaxForNavigationLinkClick();
        KeepScrollPositionOnClick();
        SortMenu();
        Title2Tooltip();
        RegisterGlobalTabClick();

        $(".modal").each(function () {
            $(this).on("show.bs.modal",
                function () {
                    var anim = $(this).attr("data-easein");
                    if (anim) $(this).velocity("transition." + anim);
                });
        });
        $("[required]:not([disabled])").addClass("required");
        $(":input").each(function (i) {
            var $this = $(this);
            $this.attr("tabindex", $this.is("button") ? "-1" : (i + 1));
            if (!$this.attr("autocomplete"))
                $this.attr("autocomplete", "off");
        });
        $.extend($.expr[":"], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || "").toLowerCase()
                    .indexOf((match[3] || "").toLowerCase()) >=
                    0;
            }
        });

        dateTimePicker();
        maskInput();
        numericInput();
        tagsInput();
        bootstrapSwitch();
        if ($.fn.scrollbar)
            $(".scrollbar-macosx").scrollbar();
    });

})(window);

var tms = {

    CreateGuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    },

    Now: function () {
        return moment().add(window.serverutcoffset, "m").utc().add(timediff, "ms");
    },

    Now2: function () {
        return moment().add(timediff, "ms");
    },

    Check: function (container) {

        $(":focus").blur();
        if ($("[validationcompleted=\"false\"]").length > 0) {
            return false;
        }

        var c1 = "[required], .required";
        var c2 = "div[required], div.required >.bootstrap-tagsinput";
        var c3 = "[type=\"email\"]";

        var e1 = ".invalid";
        var e2 = ".isempty";
        var e3 = ".invalid-email";


        if (container) {
            c1 = $(container).find(c1);
            c2 = $(container).find(c2);
            c3 = $(container).find(c3);
        }

        $(c1).each(function (indx, item) {
            if ($(item).is("input:visible") || $(item).is("select:visible") || $(item).is("textarea:visible")) {
                if (!$(item).val())
                    $(item).addClass("isempty");
                else
                    $(item).removeClass("isempty");
            }
        });

        $(c2).each(function (indx, item) {
            if ($(item).find("span.tag").length === 0)
                $(item).addClass("isempty");
            else
                $(item).removeClass("isempty");
        });

        $(c3).each(function (indx, item) {
            if ($(item).is("input:visible")) {
                var v = $(item).val();
                if (v) {
                    var emails = v.split(";");
                    for (var i = 0; i < emails.length; i++) {
                        var email = emails[i];
                        if (email) {
                            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
                                $(item).removeClass("invalid-email");
                            else {
                                $(item).addClass("invalid-email");
                                break;
                            }
                        }
                    }

                }
            }
        });

        if (container) {
            e1 = $(container).find(e1);
            e2 = $(container).find(e2);
            e3 = $(container).find(e3);
        }

        if ($(e1).length > 0) {
            $(e1).closest("div.row").velocity("callout.shake",
                function (e) {
                    $(this).removeAttr("style");
                });
            msgs.error(applicationstrings[lang].fillrequired);
            return false;
        }

        if ($(e2).length > 0) {
            msgs.error(applicationstrings[lang].fillrequired);
            $(e2).closest("div.row").velocity("callout.shake",
                function (e) {
                    $(this).removeAttr("style");
                });
            return false;
        }

        if ($(e3).length > 0) {
            msgs.error(applicationstrings[lang].invalidemail);
            $(e3).closest("div.row").velocity("callout.shake",
                function (e) {
                    $(this).removeAttr("style");
                });
            return false;
        }

        return true;
    },

    UserPic: function (picid, picguid) {
        if (picid && picguid)
            return "<img class=\"profilepic\" src=\"/File.ashx?id=" + picid + "&guid=" + picguid + "\" />";
        else
            return "<img class=\"profilepic\" src=\"/files/profile/default_small.png\" />";
    },

    Redirect2Login: function () {
        location.href = "/Login";
    },

    MobileAndTabletCheck: function () {
        var check = false;
        (function (a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i
                    .test(a) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
                    .test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    },
    ResetCompleted: function (container) {
        var c = $(container);
        c.trigger("ResetCompleted");
    },

    DisableEnableOnSelectionTabs: function (container) {
        var c = $(container);
        c.find("a[enable-on-selection]").removeAttr("data-toggle");
    },

    Reset: function (container) {
        var b = $("div[data-block*=\"" + container + "\"]");
        var c = $(container);
        if (container === "#record") {
            $(".page-header>h6").html("");
            $(".list-group-item.active").removeClass("active");
            $("a[enable-on-selection]").removeAttr("data-toggle");
        }

        b.find("button[selection-required=\"true\"]").prop("disabled", true);
        b.find("button[selection-required=\"false\"]").prop("disabled", false);
        c.find("button[selection-required=\"true\"]").prop("disabled", true);
        c.find("button[selection-required=\"false\"]").prop("disabled", false);
        c.find("button[disableonupdate=\"yes\"]").prop("disabled", false);
        c.find("[disableonupdate=\"yes\"]:not(button):not(label)").prop("disabled", false).addClass("required");
        c.find(".isempty,.invalid").removeClass("isempty").removeClass("invalid");
    },

    BeforeFill: function (container) {
        var b = $("div[data-block*=\"" + container + "\"]");
        var c = $(container);
        b.find("button[selection-required=\"true\"]").prop("disabled", false);
        c.find("button[selection-required=\"true\"]").prop("disabled", false);
        c.find("button[disableonupdate=\"yes\"]").prop("disabled", true);
        c.find("[disableonupdate=\"yes\"]:not(button):not(label)").prop("disabled", true).removeClass("required");
        c.find(".isempty,.invalid").removeClass("isempty").removeClass("invalid");
    },

    RegisterShortcuts: function (sca) {
        for (var i = 0; i < sca.length; i++) {
            var sc = sca[i];
            var fn = (function (sc) {
                return function () {
                    if (sc.f && typeof (sc.f) == "function") {
                        var elm = sc.e && typeof (sc.e) == "function" ? sc.e() : sc.e;
                        if (elm) {
                            var isdisabled = $(elm).is(":disabled");
                            if (!isdisabled) {
                                $(elm).prop("disabled", true);
                                return $.when(sc.f()).always(function () {
                                    $(elm).prop("disabled", false);
                                });
                            }
                        }
                    }
                };
            }(sc));
            shortcut.add(sc.k, fn);
        }
    },

    ActiveTab: function (id) {
        var target = id ? $(id).find("li.active a").attr("href") : $("ul.nav li.active a").attr("href");
        return target ? target.substr(1, target.length - 1) : "";
    },

    Tab: function (entity) {
        var scrtabs = $("a[enable-on-selection]");
        var returntofirsttab = true;

        if (entity) {
            scrtabs.removeAttr("data-toggle");
            var availableTabs = scrtabs.filter("[allowed-entities*='" + entity + "']");
            availableTabs.attr("data-toggle", "tab");
            for (var i = 0; i < availableTabs.length; i++) {
                var itab = availableTabs[i];
                var tabhref = $(itab).attr("href").substring(1);
                if (tabhref === tms.ActiveTab() || $.inArray(tms.ActiveTab(), ["record", "list"]) !== -1) {
                    returntofirsttab = false;
                    break;
                }
            }
            if (returntofirsttab) {
                $("ul.nav.nav-tabs a[href=\"#record\"]").tab("show");
            }
        } else {
            scrtabs.attr("data-toggle", "tab");
        }
    },

    Ajax: function (options) {

        return $.Deferred(function (deferred) {
            $.ajax({
                url: options.url,
                data: options.data,
                quietly: options.quietly,
                type: options.type || "POST",
                headers: options.headers || null,
                async: options.async || true,
                success: function (dat, sts, xhr) {
                    var d = JSON.parse(dat);
                    switch (d.status) {
                        case 100:
                            let confirmationList = d.data;
                            let flagcount = 0;
                            let exitflag = false;
                            if (confirmationList && confirmationList.length > 0) {
                                showNextModal();
                            }
                            $("#checkconfirmation").off("click", "#btncancelconfirmation").one("click", "#btncancelconfirmation", function () {
                                terminateConfirmationProcess();
                            });
                            $("#checkconfirmation").on("hidden.bs.modal", function () {
                                terminateConfirmationProcess();
                            });
                            function showNextModal() {
                                $("#checkconfirmationtext").text(confirmationList[flagcount]["CON_MESSAGE"]);
                                $("#checkconfirmation").modal().off("click", "#btnapproveconfirmation").one("click", "#btnapproveconfirmation", function () {
                                    flagcount += 1;
                                    if (flagcount == confirmationList.length) {

                                        completeAjax();
                                    }
                                    else if (!exitflag) {

                                        showNextModal();
                                    }
                                });
                            }
                            function terminateConfirmationProcess() {
                                deferred.resolve(d);
                            }
                            function completeAjax() {
                                options.headers = null;
                                $.when(tms.Ajax(options)).done(function (d) {
                                    $("#checkconfirmationtext").text("");
                                });
                            }
                            break;
                        case 500:
                            msgs.error(d.data);
                            if (d.focuselements) {
                                $(d.focuselements).closest("div.row").velocity("callout.shake",
                                    function (e) {
                                        $(this).removeAttr("style");
                                    });
                            }
                            if (options.err && typeof (options.err) == "function")
                                options.err(d);
                            deferred.reject(xhr);
                            break;
                        case 300:
                            tms.Redirect2Login();
                            break;
                        case 200:
                        default:
                            if (options.fn && typeof (options.fn) == "function")
                                options.fn(d);
                            deferred.resolve(d);
                            break;
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    deferred.reject(xhr);
                }
            });
        }).promise();
    },

    ProgressClass: function (val) {
        if (val <= 20)
            return "progress-bar progress-bar-danger progress-bar-striped active";
        else if (val > 20 && val <= 40)
            return "progress-bar progress-bar-warning progress-bar-striped active";
        else if (val > 40 && val <= 60)
            return "progress-bar progress-bar-info progress-bar-striped active";
        else if (val > 60 && val <= 80)
            return "progress-bar progress-bar-striped active";
        else if (val > 80)
            return "progress-bar progress-bar-success progress-bar-striped";
        else
            return "";
    },

    Path: function () {
        var pathname = window.location.pathname;
        var pathnamesectionsarr = pathname.indexOf("/") === 0 ? pathname.slice(1).split("/") : pathname.split("/");
        return {
            Controller: pathnamesectionsarr[0],
            Action: pathnamesectionsarr[1],
            Param1: pathnamesectionsarr.length >= 3 ? pathnamesectionsarr[2] : null,
            Param2: pathnamesectionsarr.length >= 4 ? pathnamesectionsarr[3] : null
        };
    },

    GetTimeDiff: function () {
        var clientTime = new Date();
        var timeDifference = 0;
        var roundTrip = 0;
        var roundTripStart = new Date();
        var serverTime = null;
        var serverUtcOffset;

        $.ajax({
            type: "GET",
            url: "/Api/ApiDateTime/GetDateTime",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (d) {
                var r = JSON.parse(d);
                roundTrip = new Date().getTime() - roundTripStart.getTime();
                serverTime = new Date(r.data);
                timeDifference = (serverTime.getTime() - roundTrip) - clientTime.getTime();
                serverUtcOffset = moment.parseZone(r.data).utcOffset();
            }
        });

        return {
            timeDifference,
            serverUtcOffset
        };
    },

    Block: function (s) {
        $(s).block({ message: null });
        var notdisabledctrls = $(s).find("button:not([disabled])[id]").map(function () { return "#" + this.id; }).get()
            .join();
        $(s).data("notdisabled", notdisabledctrls);
        $(s).find("button").attr("disabled", "disabled");
    },

    UnBlock: function (s) {
        $(s).unblock();
        var notdisabledctrls = $(s).data("notdisabled");
        if (notdisabledctrls)
            $(s).find(notdisabledctrls).removeAttr("disabled");
    },

    EnumerateDaysBetweenDates: function (startDate, endDate) {
        var dates = [];

        var currDate = moment(startDate).startOf("day");
        var lastDate = moment(endDate).startOf("day");

        while (currDate.add(1, "days").diff(lastDate) < 0) {
            console.log(currDate.toDate());
            dates.push(currDate.clone().toDate());
        }

        return dates;
    },

    ExportUploadErrors: function (d, filename) {
        function GetColumnNameFromIdx(idx) {
            let ret = "";
            for (let a = 1, b = 26; (idx -= a) >= 0; a = b, b *= 26) {
                ret = String.fromCharCode(parseInt((idx % b) / a) + 65) + ret;
            }
            return ret;
        }

        // Initialize workbook and worksheet
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // Define headers and styles
        const titles = d[0].Values;
        wsData.push(titles); // Add headers as the first row

        // Remove the first row (headers) from the data
        d.splice(0, 1);

        // Add data rows
        d.forEach((row) => {
            const rowData = [...row.Values, row.ErrMsg]; // Append error message
            wsData.push(rowData);
        });

        // Create the worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Apply styles to the header row (first row)
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = {
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: "03B8FD" }, // Light blue background
                },
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" }, // White text
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                },
            };
        }

        // Adjust column widths dynamically
        const colWidths = wsData[0].map((_, colIndex) => {
            let maxLength = 10; // Default width
            wsData.forEach((row) => {
                const value = row[colIndex];
                if (value) maxLength = Math.max(maxLength, value.toString().length);
            });
            return { wch: maxLength + 2 }; // Add padding
        });
        ws["!cols"] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "ErrorList");

        // Save the workbook as a file
        XLSX.writeFile(wb, (filename || "ErrorList") + ".xlsx");
    },



    NumericInput: function () {
        if ($.fn.numericInput) {
            var numericfields = $("[ctrltype=\"numeric\"]");
            for (var j = 0; j < numericfields.length; j++) {
                var nf = $(numericfields[j]);
                var allowFloat = ((nf.attr("allowfloat") == "true") || false);
                var allowNegative = ((nf.attr("allownegative") == "true") || false);
                nf.numericInput({ allowNegative: allowNegative, allowFloat: allowFloat });
            }
            $("[valtype=\"PRICE\"]").on("blur",
                function () {
                    var v = $(this).val();
                    if (v)
                        $(this).val(parseFloat(v).toFixed(constants.pricedecimals));
                });
            $("[valtype=\"EXCH\"]").on("blur",
                function () {
                    var v = $(this).val();
                    if (v)
                        $(this).val(parseFloat(v).toFixed(constants.exchdecimals));
                });
        }
    },

    UpperFormCode: function (str) {
        return str.replace(/[^A-Z0-9- !'@#$*%&()=?>{[}\]\\-`.+,/\"]+/ig, "").toUpperCase();
    }
};