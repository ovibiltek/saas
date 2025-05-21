(function () {
    var selectedrecord = null;
    var usr, scr, exc, org, shf, alv,hrp;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "exceptions",
            btns: []
        },
        {
            name: "organizations",
            btns: []
        },
        {
            name: "shift",
            btns: []
        },
        {
            name: "annualleaves",
            btns: []
        },
        {
            name: "hrpersonalinfo",
            btns: []
        }
    ];

    shf = new function () {
        var selectedshift = null;

        var LoadShifts = function () {
            var gridreq = {
                sort: [{ field: "SHF_CODE", dir: "desc" }],
                filter: { filters: [{ field: "SHF_ACTIVE", value: "+", operator: "eq" }] },
                loadall: true
            };
            return tms.Ajax({
                url: "/Api/ApiShifts/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#divshifts").find("*").remove();
                    var strshifts = "";
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        strshifts += "<button type=\"button\" class=\"btn btn-default\" data-text=\"" +
                            di.SHF_DESCRIPTION +
                            "\" data-id=\"" +
                            di.SHF_CODE +
                            "\"><i class=\"fa fa-wrench\" aria-hidden=\"true\"></i> " +
                            di.SHF_DESCRIPTION +
                            "</button>";
                    }
                    strshifts +=
                        "<button type=\"button\" class=\"btn btn-default\" data-id=\"reset\"><i class=\"fa fa-eraser\" aria-hidden=\"true\"></i> " +
                        applicationstrings[lang].reset +
                        "</button>";
                    $(strshifts).appendTo("#divshifts");
                    $("#divshifts > .btn").click(function () {
                        $(this).removeClass("btn-default").addClass("active btn-primary").siblings()
                            .removeClass("active btn-primary").addClass("btn-default");
                        selectedshift = { id: $(this).data("id"), text: $(this).data("text") };
                    });
                }
            });
        };
        var BuildMonthlyHolidays = function (params) {
            return tms.Ajax({
                url: "/Api/ApiHolidays/GetMonthlyHolidays",
                data: JSON.stringify(params),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        var day = moment(di.HOL_DATE).format(constants.dateformat2);
                        $("#shiftcalendar td.fc-day[data-date=\"" + day + "\"]")
                            .html(di.HOL_DESC)
                            .css({
                                "background-color": "#D8FDE1",
                                "text-align": "center",
                                "vertical-align": "bottom",
                                "padding-bottom": "8px"
                            }).addClass("holiday");
                    };
                }
            });
        };
        var BuildMonthlyShits = function (params) {
            return tms.Ajax({
                url: "/Api/ApiUserShifts/ListMonthlyUserShifts",
                data: JSON.stringify(params),
                fn: function (d) {
                    var sctrl = $("#shiftcalendar");
                    sctrl.fullCalendar("removeEvents");
                    var events = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        events.push({
                            id: moment(di.USH_DATE).format(constants.dateformat),
                            title: di.USH_SHIFTDESC,
                            start: di.USH_DATE,
                            d: d,
                            dbid: di.USH_ID
                        });
                    }
                    sctrl.fullCalendar("addEventSource", events);
                }
            });
        };
        var BuildMonthlyShiftCalendar = function () {
            var sctrl = $("#shiftcalendar");
            var currentdate = sctrl.fullCalendar("getDate");
            var syear = moment(currentdate, constants.dateformat).get("year");
            var smonth = moment(currentdate, constants.dateformat).month() + 1;
            var params = { Year: syear, Month: smonth, User: selectedrecord.USR_CODE };

            return $.when(BuildMonthlyHolidays(params)).done(function () {
                return BuildMonthlyShits(params);
            });
        };
        var CreateUserShift = function (us) {
            return tms.Ajax({
                url: "/Api/ApiUserShifts/Save",
                data: JSON.stringify(us)
            });
        };
        var DeleteUserShift = function (id) {
            return tms.Ajax({
                url: "/Api/ApiUserShifts/DelRec",
                data: JSON.stringify(id)
            });
        };
        var DeleteUserShifts = function (date) {
            var deferreds = [];
            var dayEvents = $("#shiftcalendar").fullCalendar("clientEvents", function (event) { return moment(event.start).isSame(date, "day"); });
            if (dayEvents.length == 0)
                return $.Deferred().resolve();
            for (var i = 0; i < dayEvents.length; i++) {
                deferreds.push(DeleteUserShift(dayEvents[i].dbid));
            }
            return $.when.apply($, deferreds).done(function () {
                return $.Deferred().resolve();
            });
        };
        this.List = function () {
            $.when(LoadShifts()).done(function () {
                $("#shiftcalendar").fullCalendar({
                    header: { left: "title", center: "", right: "prev,next" },
                    firstDay: 1,
                    eventOrder: "o",
                    fixedWeekCount: false,
                    displayEventTime: false,
                    height: 550,
                    views: { month: { eventLimit: 3 } },
                    defaultView: "month",
                    dayClick: function (date, jsEvent, view) {
                        $("#shiftcalendar td.fc-day:not(.holiday)").css("background-color", "");
                        if ($(this).is(":not(.holiday)"))
                            $(this).css("background-color", "#edf3ff");
                        if (selectedshift && selectedshift.id === "reset") {
                            $.when(DeleteUserShifts(date)).done(function () {
                                $("#shiftcalendar").fullCalendar("removeEvents", [date.format(constants.dateformat)]);
                            });
                        } else {
                            $.when(DeleteUserShifts(date)).done(function () {
                                $("#shiftcalendar").fullCalendar("removeEvents", [date.format(constants.dateformat)]);
                                $.when(CreateUserShift({
                                    USH_USER: selectedrecord.USR_CODE,
                                    USH_SHIFT: selectedshift.id,
                                    USH_DATE: date,
                                    USH_CREATED: tms.Now(),
                                    USH_CREATEDBY: user
                                })).done(function (d) {
                                    $("#shiftcalendar").fullCalendar("renderEvent",
                                        {
                                            id: date.format(constants.dateformat),
                                            title: selectedshift.text,
                                            start: date,
                                            allDay: true,
                                            dbid: d.r.USH_ID
                                        },
                                        true);
                                });
                            });
                        }
                    }
                });
                $("#shiftcalendar div.fc-toolbar .fc-center")
                    .html("<div class=\"row cal-content\"><div class=\"col-md-10\"><strong>" +
                        selectedrecord.USR_DESC +
                        "</strong></div><div class=\"col-md-2\"><div class=\"upcnt\"></div></div>");
                $("#shiftcalendar .fc-prev-button,#shiftcalendar .fc-next-button").click(BuildMonthlyShiftCalendar);
                BuildMonthlyShiftCalendar();
            });
        };
    };
    usr = new function () {
        var self = this;
        var grdUsers = null;
        var grdUsersElm = $("#grdUsers");
        var customFieldsHelper;
        var newpicselected = false;


        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");

            $("#btnBrowse").attr("disabled", "disabled");
            $("#btnRetriveFromAD").attr("disabled", "disabled");

            $("#code").val("");
            $("#desc").val("");
            $("#email").val("");
            $("#alternateemail").val("");
            $("#org").val("");
            $("#department").val("");
            $("#pricingcode").val("");
            $("#trade").val("");
            $("#usergroup").val("");
            $("#timekeepingofficer").val("");
            $("#type").val("");
            $("#password").val("");
            $("#active").prop("checked", true);
            $("#tms").prop("checked", false);
            $("#viewweeklycalendar").prop("checked", false);
            $("#mobile").prop("checked", false);
            $("#requestor").prop("checked", false);
            $("#boo").prop("checked", true);
            $("#startdate").val("");
            $("#enddate").val("");
            $("#enddate").val("");
            $("#shiftstart").val("");
            $("#shiftend").val("");
            $("#language").val("");
            $("#defaultinbox").val("");
            $("#defaultMainsection").val("");
            $("#appstatus").val("");
            $("#duty").val("");
            $("#lockcount").val("");

            $("#leavingreason").val("").removeClass("required isempty");
            $("#returnreason").val("").removeClass("required isempty");

            $("#divreturnreason").addClass("hidden");
            $("#divleavingreason").addClass("hidden");

            $("#customer").tagsinput("removeAll");
            $("#supplier").tagsinput("removeAll");
            $("#authorizeddepartments").tagsinput("removeAll");
            $(".userscrpic").attr("src", "/files/profile/default.png");

            tooltip.hide("#org");
            tooltip.hide("#pricingcode");
            tooltip.hide("#trade");
            tooltip.hide("#timekeepingofficer");
            tooltip.hide("#department");
            tooltip.hide("#usergroup");
            tooltip.hide("#language");
            tooltip.hide("#appstatus");
            tooltip.hide("#duty");


            customFieldsHelper.clearCustomFields();
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMUSERS", operator: "eq" },
                    { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {

            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");
            tms.Tab();

            $("#btnBrowse").removeAttr("disabled");
            $("#btnRetriveFromAD").removeAttr("disabled");

            $("#code").val(selectedrecord.USR_CODE);
            $("#desc").val(selectedrecord.USR_DESC);
            $("#org").val(selectedrecord.USR_ORG);
            $("#department").val(selectedrecord.USR_DEPARTMENT);
            $("#pricingcode").val(selectedrecord.USR_PRICINGCODE);
            $("#trade").val(selectedrecord.USR_TRADE);
            $("#usergroup").val(selectedrecord.USR_GROUP);
            $("#timekeepingofficer").val(selectedrecord.USR_TIMEKEEPINGOFFICER);
            $("#type").val(selectedrecord.USR_TYPE);
            $("#email").val(selectedrecord.USR_EMAIL);
            $("#alternateemail").val(selectedrecord.USR_ALTERNATEEMAIL);
            $("#language").val(selectedrecord.USR_LANG);
            $("#defaultinbox").val(selectedrecord.USR_DEFAULTINBOX);
            $("#defaultMainsection").val(selectedrecord.USR_DEFAULTHOMESECTION);
            $("#active").prop("checked", selectedrecord.USR_ACTIVE === "+");
            $("#pta").prop("checked", selectedrecord.USR_INTA === "+");
            $("#tms").prop("checked", selectedrecord.USR_TMS === "+");
            $("#mobile").prop("checked", selectedrecord.USR_MOBILE === "+");
            $("#requestor").prop("checked", selectedrecord.USR_REQUESTOR === "+");
            $("#boo").prop("checked", selectedrecord.USR_BOO === "+");
            $("#viewweeklycalendar").prop("checked", selectedrecord.USR_VIEWWEEKLYCALENDAR === "+");
            $("#appstatus").val(selectedrecord.USR_APPSTATUS);
            $("#duty").val(selectedrecord.USR_DUTY);
            $("#lockcount").val(selectedrecord.USR_LOCKCOUNT);

            $("#shiftstart").val(moment.duration(selectedrecord.USR_SHIFTSTART, "seconds")
                .format(constants.timeformat));
            $("#shiftend").val(moment.duration(selectedrecord.USR_SHIFTEND, "seconds").format(constants.timeformat));
            $("#startdate").val(selectedrecord.USR_STARTDATE
                ? moment(selectedrecord.USR_STARTDATE).format(constants.dateformat)
                : null);
            $("#enddate").val(selectedrecord.USR_ENDDATE
                ? moment(selectedrecord.USR_ENDDATE).format(constants.dateformat)
                : null);
            if (!newpicselected)
                $(".userscrpic").attr("src",
                    selectedrecord.USR_PIC
                        ? "/File.ashx?id=" + selectedrecord.USR_PIC + "&guid=" + selectedrecord.USR_PICGUID + "&type=thumbnail&width=100&height=100"
                        : "/files/profile/default.png");

            $("#authorizeddepartments").tagsinput("removeAll");
            if (selectedrecord.USR_AUTHORIZEDDEPARTMENTSARR && selectedrecord.USR_AUTHORIZEDDEPARTMENTSARR.length > 0) {
                for (var i = 0; i < selectedrecord.USR_AUTHORIZEDDEPARTMENTSARR.length; i++) {
                    var dep = selectedrecord.USR_AUTHORIZEDDEPARTMENTSARR[i];
                    $("#authorizeddepartments").tagsinput("add", { id: dep.DEP_CODE, text: dep.DEP_DESC }, ["ignore"]);
                }
            }
            $("#customer").tagsinput("removeAll");
            if (selectedrecord.USR_CUSTOMERSARR && selectedrecord.USR_CUSTOMERSARR.length > 0) {
                for (var i = 0; i < selectedrecord.USR_CUSTOMERSARR.length; i++) {
                    var cus = selectedrecord.USR_CUSTOMERSARR[i];
                    $("#customer").tagsinput("add", { id: cus.CUS_CODE, text: cus.CUS_DESC }, ["ignore"]);
                }
            }
            $("#supplier").tagsinput("removeAll");
            if (selectedrecord.USR_SUPPLIERSARR && selectedrecord.USR_SUPPLIERSARR.length > 0) {
                for (var i = 0; i < selectedrecord.USR_SUPPLIERSARR.length; i++) {
                    var sup = selectedrecord.USR_SUPPLIERSARR[i];
                    $("#supplier").tagsinput("add", { id: sup.SUP_CODE, text: sup.SUP_DESC, active: sup.SUP_ACTIVE }, ["ignore"]);
                }
            }

            if (selectedrecord.USR_APPSTATUS === "IADEEDILDI") {
                $("#divreturnreason").removeClass("hidden");
                $("#returnreason").val(selectedrecord.USR_RETURNREASON).addClass("required");
                tooltip.show("#returnreason", selectedrecord.USR_APPSTATUSDESC);

            }
            else {
                $("#divreturnreason").addClass("hidden");
                $("#returnreason").val("").removeClass("required isempty");
                tooltip.hide("#returnreason");
            }

            if (!!selectedrecord.USR_ENDDATE) {
                $("#divleavingreason").removeClass("hidden");
                $("#leavingreason").val(selectedrecord.USR_LEAVINGREASON).addClass("required");
                tooltip.show("#leavingreason", selectedrecord.USR_LEAVINGREASONDESC);

            }
            else {
                $("#divleavingreason").addClass("hidden");
                $("#leavingreason").val("").removeClass("required isempty");
                tooltip.hide("#leavingreason");
            }

            tooltip.show("#org", selectedrecord.USR_ORGDESC);
            tooltip.show("#pricingcode", selectedrecord.USR_PRICINGCODEDESC);
            tooltip.show("#trade", selectedrecord.USR_TRADEDESC);
            tooltip.show("#timekeepingofficer", selectedrecord.USR_TIMEKEEPINGOFFICERDESC);
            tooltip.show("#department", selectedrecord.USR_DEPARTMENTDESC);
            tooltip.show("#usergroup", selectedrecord.USR_GROUPDESC);
            tooltip.show("#language", selectedrecord.USR_LANGDESC);
            tooltip.show("#appstatus", selectedrecord.USR_APPSTATUSDESC);
            tooltip.show("#duty", selectedrecord.USR_DUTYDESC);

        };
        var CheckNewPassword = function () {
            var strongRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
            var pwd = $("#password").val();
            if (!pwd) {
                return false;
            } else if (!strongRegex.test(pwd)) {
                return false;
            };
            return true;
        };
        var SaveNewPassword = function () {
            if (!CheckNewPassword()) {
                msgs.error(applicationstrings[lang].pswdcomplexity);
                return $.Deferred().reject();
            }

            var o = JSON.stringify({
                USR_CODE: selectedrecord.USR_CODE,
                USR_PASSWORD: $("#password").val(),
                USR_UPDATED: selectedrecord != null ? tms.Now() : null,
                USR_UPDATEDBY: selectedrecord != null ? user : null
            });

            return tms.Ajax({
                url: "/Api/ApiUsers/NewPassword",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    $("#password,#passwordagain").val("").attr("type", "text");
                    $("#modalpass").modal("hide");
                }
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiUsers/Get",
                data: JSON.stringify(selectedrecord.USR_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({
                        subject: "USER",
                        source: selectedrecord.USR_CODE,
                        type: $("#type").val()
                    });
                }
            });
        };
        this.Delete = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiUsers/DelRec",
                            data: JSON.stringify(selectedrecord.USR_CODE),
                            fn: function (d) {
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.Save = function () {
            if (!tms.Check())
                return $.Deferred().reject();

            var customfieldvalues =
                customFieldsHelper.getCustomFieldScreenValues({
                    subject: "USER",
                    source: $("#code").val().toUpper(),
                    type: $("#type").val()
                });

            var o = JSON.stringify({
                User: {
                    USR_CODE: $("#code").val().toUpper(),
                    USR_DESC: $("#desc").val(),
                    USR_ORG: $("#org").val(),
                    USR_GROUP: $("#usergroup").val(),
                    USR_TYPE: $("#type").val(),
                    USR_DEPARTMENT: $("#department").val(),
                    USR_TRADE: ($("#trade").val() || null),
                    USR_TIMEKEEPINGOFFICER: ($("#timekeepingofficer").val() || null),
                    USR_PRICINGCODE: ($("#pricingcode").val() || null),
                    USR_CUSTOMER: ($("#customer").val() || null),
                    USR_SUPPLIER: ($("#supplier").val() || null),
                    USR_AUTHORIZEDDEPARTMENTS: ($("#authorizeddepartments").val() || null),
                    USR_LANG: $("#language").val(),
                    USR_DEFAULTINBOX: ($("#defaultinbox").val() || null),
                    USR_DEFAULTHOMESECTION: ($("#defaultMainsection").val() || null),
                    USR_APPSTATUS: $("#appstatus").val(),
                    USR_RETURNREASON: ($("#returnreason").val() || null),
                    USR_LEAVINGREASON: ($("#leavingreason").val() || null),
                    USR_LOCKCOUNT: ($("#lockcount").val() || null),
                    USR_DUTY: ($("#duty").val() || null),
                    USR_EMAIL: $("#email").val(),
                    USR_ALTERNATEEMAIL: $("#alternate").val(),
                    USR_MOBILE: $("#mobile").prop("checked") ? "+" : "-",
                    USR_REQUESTOR: $("#requestor").prop("checked") ? "+" : "-",
                    USR_BOO: $("#boo").prop("checked") ? "+" : "-",
                    USR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                    USR_TMS: $("#tms").prop("checked") ? "+" : "-",
                    USR_INTA: $("#pta").prop("checked") ? "+" : "-",
                    USR_VIEWWEEKLYCALENDAR: $("#viewweeklycalendar").prop("checked") ? "+" : "-",
                    USR_SHIFTSTART: moment.duration($("#shiftstart").val(), constants.timeformat).asSeconds(),
                    USR_SHIFTEND: moment.duration($("#shiftend").val(), constants.timeformat).asSeconds(),
                    USR_STARTDATE: ($("#startdate").val() ? moment.utc($("#startdate").val(), constants.dateformat) : null),
                    USR_ENDDATE: ($("#enddate").val() ? moment.utc($("#enddate").val(), constants.dateformat) : null),
                    USR_REGISTRATIONNUMBER: ($("#registrationnumber").val() || null),
                    USR_TITLE: ($("#title").val() || null),
                    USR_TCNUMBER: ($("#tcnumber").val() || null),
                    USR_FUSENUMBER: ($("#fusenumber").val() || null),
                    USR_GENDER: ($("input[name=\"gtype\"]:checked").val() || null),
                    USR_MARITALSTATUS: ($("input[name=\"mtype\"]:checked").val() || null),
                    USR_BIRTHDATE: ($("#birthdate").val() ? moment.utc($("#birthdate").val(), constants.dateformat) : null),
                    USR_PLACEOFBIRTH: ($("#placeofbirth").val() || null),
                    USR_BLOODGROUP: ($("#bloodgroup").val() || null),
                    USR_EDUCATIONSTATUS: ($("#edustatus").val() || null),
                    USR_LASTGRADUATEDSCHOOL: ($("#lastgraduatedschool").val() || null),
                    USR_LASTGRADUATEDDEPARTMENT: ($("#lastgraduateddepartment").val() || null),
                    USR_LASTGRADUATEDDATE: ($("#lastgraduateddate").val() ? moment.utc($("#lastgraduateddate").val(), constants.dateformat) : null),
                    USR_MILITARYSERVICE: ($("#militaryservice").val() || null),
                    USR_EMERGENCYCONTACTNAME: ($("#emergencycontactname").val() || null),
                    USR_EMERGENCYCONTACTAFFINITY: ($("#emergencycontactaffinity").val() || null),
                    USR_EMERGENCYCONTACTPHONENUMBER: ($("#emergencycontactphone").val() || null),
                    USR_PHONENUMBER: ($("#phonenumber").val() || null),
                    USR_HOMETELEPHONENUMBER: ($("#Maintelephonenumber").val() || null),
                    USR_OFFICENUMBER: ($("#officenumber").val() || null),
                    USR_PERSONALEMAIL: ($("#personalemail").val() || null),
                    USR_FULLADDRESS: ($("#fulladdress").val() || null),
                    USR_SHOESIZE: ($("#shoesize").val() || null),
                    USR_TSHIRTSIZE: ($("#tshirtsize").val() || null),
                    USR_PANTSIZE: ($("#pantsize").val() || null),
                    USR_POLARSIZE: ($("#polarsize").val() || null),
                    USR_DRIVINGLICENSE: $("#drivinglicense").prop("checked") ? "+" : "-",
                    USR_DRIVINGLICENSECLASS: ($("#licenseclass").val() || null),
                    USR_LICENSEISSUEDATE: ($("#licenseissuedate").val() ? moment.utc($("#licenseissuedate").val(), constants.dateformat) : null),
                    USR_CREATED: selectedrecord != null ? selectedrecord.USR_CREATED : tms.Now(),
                    USR_CREATEDBY: selectedrecord != null ? selectedrecord.USR_CREATEDBY : user,
                    USR_UPDATED: selectedrecord != null ? tms.Now() : null,
                    USR_UPDATEDBY: selectedrecord != null ? user : null,
                    USR_SQLIDENTITY: selectedrecord != null ? selectedrecord.USR_SQLIDENTITY : 0,
                    USR_RECORDVERSION: selectedrecord != null ? selectedrecord.USR_RECORDVERSION : 0
                },
                CustomFieldValues: customfieldvalues
            });

            return tms.Ajax({
                url: "/Api/ApiUsers/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    var hasuploadevnt = $._data($("#record")[0], "events") != undefined;
                    if (hasuploadevnt && newpicselected) {
                        $("#record").trigger("upload",
                            {
                                DOC_SOURCE: $("#code").val(),
                                DOC_SUBJECT: "USER",
                                DOC_TYPE : "PROFILFOTOGRAFI"
                            });
                    } 
                    selectedrecord = d.r;
                    FillUserInterface();
                }
            });
        };
        var UpdateProfilePic = function () {
            var o = JSON.stringify({ USR_CODE: $("#code").val() });
            return tms.Ajax({
                url: "/Api/ApiUsers/UpdateProfilePic",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                }
            });
        };
        var LoadUserTypes = function (v) {
            var gridreq = {
                sort: [{ field: "TYP_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "TYP_ENTITY", value: "USER", operator: "eq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" }
                    ]
                }
            };

            return select({
                ctrl: "#type",
                url: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                textfield: "TYP_DESC",
                data: JSON.stringify(gridreq)
            }).Fill();
        };
        var BuildModals = function () {
            $("#btnorg").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/ListUserOrganizations",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#org",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_CODE", value: "*", operator: "neq" },
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btntrade").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#trade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "TRD_DEPARTMENT", value: [$("#department").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btntimekeepingofficer").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.user[lang].title,
                    listurl: "/Api/ApiUsers/List",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    returninput: "#timekeepingofficer",
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnpricingcode").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.pricingcodes[lang].title,
                    listurl: "/Api/ApiPricingCodes/List",
                    keyfield: "PRC_CODE",
                    codefield: "PRC_CODE",
                    textfield: "PRC_DESC",
                    returninput: "#pricingcode",
                    columns: [
                        { type: "string", field: "PRC_CODE", title: gridstrings.pricingcodes[lang].code, width: 100 },
                        { type: "string", field: "PRC_DESC", title: gridstrings.pricingcodes[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "PRC_ACTIVE", value: "+", operator: "eq" },
                        { field: "PRC_GROUP", value: "USERCLASS", operator: "eq" }
                    ]
                });
            });
            $("#btndepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#department",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" },
                        { field: "DEP_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnusergroup").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.usergroup[lang].title,
                    listurl: "/Api/ApiUserGroups/List",
                    keyfield: "UGR_CODE",
                    codefield: "UGR_CODE",
                    textfield: "UGR_DESC",
                    returninput: "#usergroup",
                    columns: [
                        { type: "string", field: "UGR_CODE", title: gridstrings.usergroup[lang].usergroup, width: 100 },
                        {
                            type: "string",
                            field: "UGR_DESC",
                            title: gridstrings.usergroup[lang].description,
                            width: 300
                        }
                    ],
                    filter: [
                        { field: "UGR_ACTIVE", value: "+", operator: "eq" },
                        { field: "UGR_CODE", value: "*", operator: "neq" }
                    ]
                });
            });
            $("#btnlanguages").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.language[lang].title,
                    listurl: "/Api/ApiLanguage/List",
                    keyfield: "LNG_CODE",
                    codefield: "LNG_CODE",
                    textfield: "LNG_DESCRIPTION",
                    returninput: "#language",
                    columns: [
                        { type: "string", field: "LNG_CODE", title: gridstrings.language[lang].language, width: 100 },
                        {
                            type: "string",
                            field: "LNG_DESCRIPTION",
                            title: gridstrings.language[lang].description,
                            width: 300
                        }
                    ]
                });
            });
            $("#btnadddepartments").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#authorizeddepartments",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnaddcustomers").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.customer[lang].title,
                    listurl: "/Api/ApiCustomers/List",
                    keyfield: "CUS_CODE",
                    codefield: "CUS_CODE",
                    textfield: "CUS_DESC",
                    returninput: "#customer",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "CUS_CODE", title: gridstrings.customer[lang].code, width: 100 },
                        { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "CUS_ACTIVE", value: "+", operator: "eq" },
                        { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
            $("#btnaddsuppliers").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.suppliers[lang].title,
                    listurl: "/Api/ApiSuppliers/List",
                    keyfield: "SUP_CODE",
                    codefield: "SUP_CODE",
                    textfield: "SUP_DESC",
                    returninput: "#supplier",
                    multiselect: true,
                    columns: [
                        { type: "string", field: "SUP_CODE", title: gridstrings.suppliers[lang].code, width: 100 },
                        { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SUP_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#btnappstatus").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#appstatus",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "USERAPPSTATUS", operator: "eq" }
                    ],
                    callback: function (d) {
                        if (d && d.SYC_CODE === "IADEEDILDI") {
                            $("#divreturnreason").removeClass("hidden");
                            $("#returnreason").addClass("required");
                        }
                        else {
                            $("#divreturnreason").addClass("hidden");
                            $("#returnreason").val("").removeClass("required isempty");
                        }
                    }
                });
            });
            $("#btnduty").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#duty",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "USRDUTY", operator: "eq" }
                    ],
                });
            });
            $("#btnleavingreason").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#leavingreason",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "USRLEAVINGREASON", operator: "eq" }
                    ],
                });
            });
        }
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                filter: [
                    { field: "ORG_CODE", value: "*", operator: "neq" }
                ]
            });
            $("#department").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    { field: "DEP_ORG", relfield: "#org", includeall: true }
                ]
            });
            $("#pricingcode").autocomp({
                listurl: "/Api/ApiPricingCodes/List",
                geturl: "/Api/ApiPricingCodes/Get",
                field: "PRC_CODE",
                textfield: "PRC_DESC",
                active: "PRC_ACTIVE",
                filter: [
                    { field: "PRC_GROUP", value: "USERCLASS", operator: "eq" }
                ]
            });
            $("#usergroup").autocomp({
                listurl: "/Api/ApiUserGroups/List",
                geturl: "/Api/ApiUserGroups/Get",
                field: "UGR_CODE",
                textfield: "UGR_DESC",
                active: "UGR_ACTIVE",
                filter: [{ field: "UGR_CODE", value: "*", operator: "neq" }]
            });
            $("#trade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    { field: "TRD_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TRD_DEPARTMENT", relfield: "#department", includeall: true }
                ]
            });
            $("#customer").autocomp({
                listurl: "/Api/ApiCustomers/List",
                geturl: "/Api/ApiCustomers/Get",
                field: "CUS_CODE",
                textfield: "CUS_DESC",
                active: "CUS_ACTIVE",
                filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }]
            });
            $("#language").autocomp({
                listurl: "/Api/ApiLanguage/List",
                geturl: "/Api/ApiLanguage/Get",
                field: "LNG_CODE",
                textfield: "LNG_DESCRIPTION"
            });
            $("#timekeepingofficer").autocomp({
                listurl: "/Api/ApiUsers/List",
                geturl: "/Api/ApiUsers/Get",
                field: "USR_CODE",
                textfield: "USR_DESC",
                active: "USR_ACTIVE",
                filter: [{ field: "USR_CODE", value: "*", operator: "neq" }]
            });
            $("#appstatus").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "USERAPPSTATUS", operator: "eq" }],
                callback: function (d) {
                    if (d && d.SYC_CODE === "IADEEDILDI") {
                        $("#divreturnreason").removeClass("hidden");
                        $("#returnreason").addClass("required");
                    }
                    else {
                        $("#divreturnreason").addClass("hidden");
                        $("#returnreason").val("").removeClass("required isempty");
                    }
                }
            });
            $("#duty").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "USRDUTY", operator: "eq" }]
            });
            $("#leavingreason").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "USRLEAVINGREASON", operator: "eq" }]
            });
        };
        var RegisterUploadCtrl = function () {
            $("#fu").change(function (e) {
                loadImage(
                    e.target.files[0],
                    function (img) {
                        let fileType = img._type;
                        if (fileType) {
                            fileType = fileType.split("/")[0];
                        }       
                        if (fileType === "image") {
                            $(img).addClass("userscrpic");
                            $("#imgprv *").remove();
                            $("#imgprv").append(img);
                        }
                        
                    },
                    { maxWidth: 200 } // Options
                );
            });

            $("#fu").fileupload({
                maxNumberOfFiles: 1,
                autoUpload: false,
                add: function (e, data) {
                    console.log("add");
                    let filetype = "";
                    if (data.files.length > 0) {
                        fileType = data.files[0].type;
                        fileType = fileType.split("/")[0];
                    }
                   
                 
                    if (fileType === "image") {
                        newpicselected = data.files.length > 0;
                    }
                    else {
                        msgs.error(applicationstrings[lang].imgtyperequired);
                        //newpicselected = false;
                    }
                   
                    $("#record").unbind("upload").on("upload",
                        function (evnt, d) {
                            if (fileType === "image") {
                                data.formData = d;
                                data.submit();
                            }
                            
                        });
                }
                }).on("fileuploaddone",
                function (e, data) {
                    switch (data.result.status) {
                        case 200:
                            if (data.result.ids.length > 0) {
                                console.log("fudone");
                                $(".userscrpic").attr("src", "/File.ashx?id=" + data.result.ids[0].Id + "&guid=" + data.result.ids[0].Guid + "&type=thumbnail&width=100&height=100");
                            }
                            msgs.success(data.result.data);
                            break;
                        case 300:
                            tms.Redirect2Login();
                            break;
                        case 500:
                            msgs.error(data.result.data);
                            break;
                    }
                                                 });

        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        self.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            usr.ResetUI();
                        else
                            usr.LoadSelected();
                        break;
                    case "#exceptions":
                        exc.List();
                        exc.ResetUI();
                        break;
                    case "#annualleaves":
                        alv.List();
                        alv.ResetUI();
                        break;
                    case "#organizations":
                        org.List();
                        org.ResetUI();
                        break;
                    case "#shift":
                        shf.List();
                        break;
                    case "#hrpersonalinfo":
                        hrp.Ready();
                        break;
                }
                scr.Configure();
            });
        };
        var RegisterUiEvents = function () {
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnUndo").click(FillUserInterface);
            $("#btnHistory").click(self.HistoryModal);

            $("#btnRetriveFromAD").click(UpdateProfilePic);
            $("#btnNewPassword").click(function () {
                $("#password,#passwordagain").val("").attr("type", "password");
                $("#modalpass").modal("show");
            });
            $("#btnSavePswd").click(SaveNewPassword);
            $("#password,#passwordagain").keyup(function () {
                var $this = $(this);
                var $thisagain = $($(this).data("dblcheck"));
                $("#btnSavePswd").prop("disabled", $this.val() !== $thisagain.val());
                if ($this.val()) {
                    if (CheckNewPassword()) {
                        $this.css({ "background-color": "#a8fba8" });
                    } else {
                        $this.css({ "background-color": "#ffc7c7" });
                    }
                } else {
                    $this.css({ "background-color": "" });
                }
            });
            $("#type").on("change", function () {
                customFieldsHelper.loadCustomFields({
                    subject: "USER",
                    source: selectedrecord ? selectedrecord.USR_CODE : null,
                    type: $(this).val()
                });
            });

            $("#enddate").on("dp.change", function () {
                var v = $(this).val();
                if (!!v) {
                    $("#divleavingreason").removeClass("hidden");
                    $("#leavingreason").val(selectedrecord.USR_LEAVINGREASON).addClass("required");
                    tooltip.show("#leavingreason", selectedrecord.USR_LEAVINGREASONDESC);
                }
                else {
                    $("#divleavingreason").addClass("hidden");
                    $("#leavingreason").val("").removeClass("required isempty");
                    tooltip.hide("#leavingreason");
                }
            });

            customFieldsHelper = new customfields({ container: "#cfcontainer", screen: "USER" });

            LoadUserTypes();
            RegisterTabChange();
            BuildModals();
            AutoComplete();
            RegisterUploadCtrl();
        };
        var ItemSelect = function (row) {
            selectedrecord = grdUsers.GetRowDataItem(row);
            $(".page-header h6").html(selectedrecord.USR_CODE + " - " + selectedrecord.USR_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdUsersElm.find("[data-id]").on("dblclick",
                function () {
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
                });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdUsers) {
                grdUsers.ClearSelection();
                grdUsers.RunFilter(gridfilter);
            } else {
                grdUsers = new Grid({
                    keyfield: "USR_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "USR_CODE",
                            title: gridstrings.user[lang].user,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "USR_DESC",
                            title: gridstrings.user[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "USR_GROUP",
                            title: gridstrings.user[lang].group,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_GROUPDESC",
                            title: gridstrings.user[lang].groupdesc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "USR_TYPE",
                            title: gridstrings.user[lang].type,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "USR_TYPEDESC",
                            title: gridstrings.user[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "USR_DUTYDESC",
                            title: gridstrings.user[lang].dutydesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "USR_CUSTOMER",
                            title: gridstrings.user[lang].customer,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "USR_DEPARTMENT",
                            title: gridstrings.user[lang].department,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_TRADE",
                            title: gridstrings.user[lang].trade,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "USR_BOO",
                            title: gridstrings.user[lang].boo,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_ACTIVE",
                            title: gridstrings.user[lang].active,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_TMS",
                            title: gridstrings.user[lang].tms,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_MOBILE",
                            title: gridstrings.user[lang].mobile,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_ORG",
                            title: gridstrings.user[lang].organization,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_SUPPLIER",
                            title: gridstrings.user[lang].supplier,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_LANG",
                            title: gridstrings.user[lang].language,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_PRICINGCODE",
                            title: gridstrings.user[lang].pricingcode,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_ALTERNATEEMAIL",
                            title: gridstrings.user[lang].alternateemail,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_DEFAULTINBOX",
                            title: gridstrings.user[lang].defaultinbox,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_DEFAULTHOMESECTION",
                            title: gridstrings.user[lang].defaultMainsection,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "USR_STARTDATE",
                            title: gridstrings.user[lang].jobstartdate,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "USR_ENDDATE",
                            title: gridstrings.user[lang].jobenddate,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_LEAVINGREASONDESC",
                            title: gridstrings.user[lang].leavingreason,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "USR_VIEWWEEKLYCALENDAR",
                            title: gridstrings.user[lang].viewweeklycalendar,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_TIMEKEEPINGOFFICER",
                            title: gridstrings.user[lang].timekeepingofficer,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_EMAIL",
                            title: gridstrings.user[lang].email,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_AUTHORIZEDDEPARTMENTS",
                            title: gridstrings.user[lang].authorizeddepartments,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_APPSTATUSDESC",
                            title: gridstrings.user[lang].appstatusdesc,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "USR_CREATED",
                            title: gridstrings.user[lang].created,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_CREATEDBY",
                            title: gridstrings.user[lang].createdby,
                            width: 150
                        },
                        {
                            type: "date",
                            field: "USR_UPDATED",
                            title: gridstrings.user[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "USR_UPDATEDBY",
                            title: gridstrings.user[lang].updatedby,
                            width: 150
                        },

                    ],
                    fields:
                    {
                        USR_STARTDATE: { type: "date" },
                        USR_ENDDATE: { type: "date" },
                        USR_CREATED: { type: "date" },
                        USR_UPDATED: { type: "date" },
                    },
                    datasource: "/Api/ApiUsers/List",
                    selector: "#grdUsers",
                    name: "grdUsers",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "USR_CODE",
                    primarytextfield: "USR_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "USR_CODE", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Users.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            self.ResetUI();
            self.List();
        };
    };
    exc = new function () {
        var self = this;
        var selecteditem = null;
        var grdelm = $("#grdUserTradeExceptions");
        var grdUserTradeExceptions = null;

        var itemSelect = function (row) {
            selecteditem = grdUserTradeExceptions.GetRowDataItem(row);
            self.LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#exceptions");

            $("#exctrade").val(selecteditem.UTE_TRADE);
            $("#excstart").val(moment(selecteditem.UTE_START).format(constants.longdateformat));
            $("#excend").val(moment(selecteditem.UTE_END).format(constants.longdateformat));

            tooltip.show("#exctrade", selecteditem.UTE_TRADEDESC);
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiUserTradeExceptions/Get",
                data: JSON.stringify(selecteditem.UTE_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUserInterface();
                }
            });
        };
        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#exceptions");

            $("#exctrade").val("");
            $("#excstart").val("");
            $("#excend").val("");

            tooltip.hide("#exctrade");
        };
        this.List = function () {
            var grdFilter = [{ field: "UTE_USER", value: selectedrecord.USR_CODE, operator: "eq", logic: "and" }];
            if (grdUserTradeExceptions) {
                grdUserTradeExceptions.ClearSelection();
                grdUserTradeExceptions.RunFilter(grdFilter);
            } else {
                grdUserTradeExceptions = new Grid({
                    keyfield: "UTE_ID",
                    columns: [
                        {
                            type: "string",
                            field: "UTE_TRADE",
                            title: gridstrings.tradeexceptions[lang].trade,
                            width: 100
                        },
                        {
                            type: "datetime",
                            field: "UTE_START",
                            title: gridstrings.tradeexceptions[lang].start,
                            width: 100
                        },
                        {
                            type: "datetime",
                            field: "UTE_END",
                            title: gridstrings.tradeexceptions[lang].end,
                            width: 100
                        }
                    ],
                    fields:
                    {
                        UTE_START: { type: "date" },
                        UTE_END: { type: "date" }
                    },
                    datasource: "/Api/ApiUserTradeExceptions/List",
                    selector: "#grdUserTradeExceptions",
                    name: "grdUserTradeExceptions",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "UTE_ID", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        this.Save = function () {

            if (!tms.Check("#exceptions"))
                return;

            var o = JSON.stringify({
                UTE_ID: (selecteditem != null ? selecteditem.UTE_ID : 0),
                UTE_USER: selectedrecord.USR_CODE,
                UTE_TRADE: $("#exctrade").val(),
                UTE_START: moment.utc($("#excstart").val(), constants.longdateformat),
                UTE_END: moment.utc($("#excend").val(), constants.longdateformat),
                UTE_CREATED: selecteditem != null ? selecteditem.UTE_CREATED : tms.Now(),
                UTE_CREATEDBY: selecteditem != null ? selecteditem.UTE_CREATEDBY : user,
                UTE_UPDATED: selecteditem != null ? tms.Now() : null,
                UTE_UPDATEDBY: selecteditem != null ? user : null,
                UTE_RECORDVERSION: selecteditem != null ? selecteditem.UTE_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiUserTradeExceptions/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        tms.Ajax({
                            url: "/Api/ApiUserTradeExceptions/DelRec",
                            data: JSON.stringify(selecteditem.UTE_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddException").click(self.ResetUI);
            $("#btnSaveException").click(self.Save);
            $("#btnDeleteException").click(self.Delete);
            $("#btnexctrade").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.trades[lang].title,
                    listurl: "/Api/ApiTrades/List",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    returninput: "#exctrade",
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_ORGANIZATION", value: [selectedrecord.USR_ORG, "*"], operator: "in" }
                    ]
                });
            });
            $("#exctrade").autocomp({
                listurl: "/Api/ApiTrades/List",
                geturl: "/Api/ApiTrades/Get",
                field: "TRD_CODE",
                textfield: "TRD_DESC",
                active: "TRD_ACTIVE",
                filter: [
                    {
                        field: "TRD_ORGANIZATION",
                        func: function () { return [selectedrecord.USR_ORG, "*"]; },
                        operator: "in"
                    }
                ]
            });
        };
        RegisterUIEvents();
    };
    alv = new function () {
        var self = this;
        var selecteditem = null;
        var grdelm = $("#grdUserAnnualLeaves");
        var grdUserAnnualLeaves = null;

        var itemSelect = function (row) {
            selecteditem = grdUserAnnualLeaves.GetRowDataItem(row);
            self.LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#annualleaves");

            $("#year").val(selecteditem.UAL_YEAR);
            $("#qty").val(selecteditem.UAL_QTY);
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiUserAnnualLeaves/Get",
                data: JSON.stringify(selecteditem.UAL_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUserInterface();
                }
            });
        };
        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#annualleaves");

            $("#year").val("");
            $("#qty").val("");
        };
        this.List = function () {
            var grdFilter = [{ field: "UAL_USER", value: selectedrecord.USR_CODE, operator: "eq", logic: "and" }];
            if (grdUserAnnualLeaves) {
                grdUserAnnualLeaves.ClearSelection();
                grdUserAnnualLeaves.RunFilter(grdFilter);
            } else {
                grdUserAnnualLeaves = new Grid({
                    keyfield: "UAL_ID",
                    columns: [
                        {
                            type: "number",
                            field: "UAL_YEAR",
                            title: gridstrings.annualleaves[lang].year,
                            width: 50
                        },
                        {
                            type: "number",
                            field: "UAL_QTY",
                            title: gridstrings.annualleaves[lang].qty,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "UAL_CREATEDBY",
                            title: gridstrings.annualleaves[lang].createdby,
                            width: 50
                        },
                        {
                            type: "datetime",
                            field: "UAL_CREATED",
                            title: gridstrings.annualleaves[lang].created,
                            width: 50
                        },
                        {
                            type: "string",
                            field: "UAL_UPDATEDBY",
                            title: gridstrings.annualleaves[lang].updatedby,
                            width: 50
                        },
                        {
                            type: "datetime",
                            field: "UAL_UPDATED",
                            title: gridstrings.annualleaves[lang].updated,
                            width: 50
                        }
                    ],
                    fields:
                    {
                        UAL_YEAR: { type: "number" },
                        UAL_QTY: { type: "number" },
                        UAL_CREATED: { type: "date" },
                        UAL_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiUserAnnualLeaves/List",
                    selector: "#grdUserAnnualLeaves",
                    name: "grdUserAnnualLeaves",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "UAL_ID", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#annualleaves"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                UAL_ID: (selecteditem != null ? selecteditem.UAL_ID : 0),
                UAL_USER: selectedrecord.USR_CODE,
                UAL_YEAR: $("#year").val(),
                UAL_QTY: $("#qty").val(),
                UAL_CREATED: selecteditem != null ? selecteditem.UAL_CREATED : tms.Now(),
                UAL_CREATEDBY: selecteditem != null ? selecteditem.UAL_CREATEDBY : user,
                UAL_UPDATED: selecteditem != null ? tms.Now() : null,
                UAL_UPDATEDBY: selecteditem != null ? user : null,
                UAL_RECORDVERSION: selecteditem != null ? selecteditem.UAL_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiUserAnnualLeaves/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiUserAnnualLeaves/DelRec",
                            data: JSON.stringify(selecteditem.UAL_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddAnnualLeave").click(self.ResetUI);
            $("#btnSaveAnnualLeave").click(self.Save);
            $("#btnDeleteAnnualLeave").click(self.Delete);
        };
        RegisterUIEvents();
    };
    org = new function () {
        var self = this;
        var selecteditem = null;
        var grdelm = $("#grdUserOrganizations");
        var grdUserOrganizations = null;

        var itemSelect = function (row) {
            selecteditem = grdUserOrganizations.GetRowDataItem(row);
            self.LoadSelected();
        };
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var FillUserInterface = function () {
            tms.BeforeFill("#organizations");
            $("#userorg").val(selecteditem.UOG_ORG);
            $("#default").prop("checked", selecteditem.UOG_DEFAULT === "+");
            tooltip.show("#userorg", selecteditem.UOG_ORGDESC);
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiUserOrganizations/Get",
                data: JSON.stringify(selecteditem.UOG_ID),
                fn: function (d) {
                    selecteditem = d.data;
                    FillUserInterface();
                }
            });
        };
        this.ResetUI = function () {
            selecteditem = null;
            tms.Reset("#organizations");
            $("#userorg").val("");
            $("#default").prop("checked", false);
            tooltip.hide("#userorg");
        };
        this.List = function () {
            var grdFilter = [{ field: "UOG_USER", value: selectedrecord.USR_CODE, operator: "eq", logic: "and" }];
            if (grdUserOrganizations) {
                grdUserOrganizations.ClearSelection();
                grdUserOrganizations.RunFilter(grdFilter);
            } else {
                grdUserOrganizations = new Grid({
                    keyfield: "UOG_ID",
                    columns: [
                        {
                            type: "string",
                            field: "UOG_ORG",
                            title: gridstrings.userorganizations[lang].org,
                            width: 150
                        },
                        {
                            type: "na",
                            field: "UOG_DEFAULT",
                            title: gridstrings.userorganizations[lang].default,
                            width: 100,
                            template: "<i class=\"# if(UOG_DEFAULT == \"+\") {# fa fa-check #} else {} #\"></i>"
                        },
                        {
                            type: "datetime",
                            field: "UOG_CREATED",
                            title: gridstrings.userorganizations[lang].created,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "UOG_CREATEDBY",
                            title: gridstrings.userorganizations[lang].createdby,
                            width: 150
                        },
                        {
                            type: "datetime",
                            field: "UOG_UPDATED",
                            title: gridstrings.userorganizations[lang].updated,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "UOG_UPDATEDBY",
                            title: gridstrings.userorganizations[lang].updatedby,
                            width: 150
                        }
                    ],
                    fields:
                    {
                        UOG_CREATED: { type: "date" },
                        UOG_UPDATED: { type: "date" }
                    },
                    datasource: "/Api/ApiUserOrganizations/List",
                    selector: "#grdUserOrganizations",
                    name: "grdUserOrganizations",
                    height: 150,
                    filter: grdFilter,
                    sort: [{ field: "UOG_ID", dir: "desc" }],
                    change: gridChange
                });
            }
        };
        this.Save = function () {
            if (!tms.Check("#organizations"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                UOG_ID: (selecteditem != null ? selecteditem.UOG_ID : 0),
                UOG_USER: selectedrecord.USR_CODE,
                UOG_ORG: $("#userorg").val(),
                UOG_DEFAULT: $("#default").prop("checked") ? "+" : "-",
                UOG_CREATED: selecteditem != null ? selecteditem.UOG_CREATED : tms.Now(),
                UOG_CREATEDBY: selecteditem != null ? selecteditem.UOG_CREATEDBY : user,
                UOG_UPDATED: selecteditem != null ? tms.Now() : null,
                UOG_UPDATEDBY: selecteditem != null ? user : null,
                UOG_RECORDVERSION: selecteditem != null ? selecteditem.UOG_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiUserOrganizations/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selecteditem) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiUserOrganizations/DelRec",
                            data: JSON.stringify(selecteditem.UOG_ID),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddOrganization").click(self.ResetUI);
            $("#btnSaveOrganization").click(self.Save);
            $("#btnDeleteOrganization").click(self.Delete);
            $("#btnuserorg").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/List",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#userorg",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ]
                });
            });
            $("#userorg").autocomp({
                listurl: "/Api/ApiOrgs/List",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE"
            });
        };
        RegisterUIEvents();
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "exceptions":
                                return "#btnSaveException";
                            case "annualleaves":
                                return "#btnSaveAnnualLeave";
                            case "organizations":
                                return "#btnSaveOrganization";
                            case "hrpersonalinfo":
                                return "#btnSaveHrPersonalInfo";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                usr.Save();
                                break;
                            case "exceptions":
                                exc.Save();
                                break;
                            case "annualleaves":
                                alv.Save();
                                break;
                            case "organizations":
                                org.Save();
                                break;
                            case "hrpersonalinfo":
                                hrp.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnNew";
                            case "exceptions":
                                return "#btnAddException";
                            case "annualleaves":
                                return "#btnAddAnnualLeave";
                            case "organizations":
                                return "#btnAddOrganization";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                usr.ResetUI();
                                break;
                            case "exceptions":
                                exc.ResetUI();
                                break;
                            case "annualleaves":
                                alv.ResetUI();
                                break;
                            case "organizations":
                                org.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnUndo";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                usr.LoadSelected();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "exceptions":
                                return "#btnDeleteException";
                            case "annualleaves":
                                return "#btnDeleteAnnualLeave";
                            case "organizations":
                                return "#btnDeleteOrganization";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                usr.Delete();
                                break;
                            case "exceptions":
                                exc.Delete();
                                break;
                            case "annualleaves":
                                alv.Delete();
                                break;
                            case "organizations":
                                org.Delete();
                                break;
                        }
                    }
                }
            ]);
        };
        this.Configure = function () {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function (e) { return e.name === activeTab; })[0];
            for (var i = 0; i < tab.btns.length; i++) {
                var btni = tab.btns[i];
                if (!btni.selectionrequired)
                    $(btni.id).removeAttr("disabled");
                else {
                    if (selectedrecord) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
    };
    hrp = new function () {
        var self = this;
        var userDocumentsHelper;
        var userCommentsHelper;
        var customFieldsHelper;
        var LoadDocumentTypes;
      
        var BuildModals = function () {
            $("#btnshoesize").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#shoesize",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "SHOESIZE", operator: "eq" }
                    ],
                });
            });
            $("#btntshirtsize").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#tshirtsize",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "SIZE", operator: "eq" }
                    ],
                });
            });
            $("#btnpantsize").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#pantsize",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "PANTSIZE", operator: "eq" }
                    ],
                });
            });
            $("#btnpolarsize").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.systemcodes[lang].title,
                    listurl: "/Api/ApiSystemCodes/List",
                    keyfield: "SYC_CODE",
                    codefield: "SYC_CODE",
                    textfield: "SYC_DESCF",
                    returninput: "#polarsize",
                    columns: [
                        { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                        { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                    ],
                    filter: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "SIZE", operator: "eq" }
                    ],
                });
            });
        }
        var AutoComplete = function () {
            $("#shoesize").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "SHOESIZE", operator: "eq" }]
            });
            $("#tshirtsize").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "TSHIRTSIZE", operator: "eq" }]
            });
            $("#pantsize").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "PANTSIZE", operator: "eq" }]
            });
            $("#polarsize").autocomp({
                listurl: "/Api/ApiSystemCodes/List",
                geturl: "/Api/ApiSystemCodes/Get",
                field: "SYC_CODE",
                textfield: "SYC_DESCF",
                active: "SYC_ACTIVE",
                filter: [{ field: "SYC_GROUP", value: "POLARSIZE", operator: "eq" }]
            });
        }
        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#hrpersonalinfo");

            $("#registrationnumber").val("");
            $("#title").val("");
            $("#tcnumber").val("");
            $("#fusenumber").val("");
            $("input[name=gtype]").prop("checked", false);
            $("input[name=mtype]").prop("checked", false);
            $("#birthdate").val("");
            $("#placeofbirth").val("");
            $("#bloodgroup").val("");
            $("#edustatus").val("");
            $("#lastgraduatedschool").val("");
            $("#lastgraduateddepartment").val("");
            $("#lastgraduateddate").val("");
            $("#militaryservice").val("");
            $("#emergencycontactname").val("");
            $("#emergencycontactaffinity").val("");
            $("#emergencycontactphone").val("");
            $("#phonenumber").val("");
            $("#Maintelephonenumber").val("");
            $("#officenumber").val("");
            $("#personalemail").val("");
            $("#fulladdress").val("");
            $("#shoesize").val("");
            $("#tshirtsize").val("");
            $("#pantsize").val("");
            $("#polarsize").val("");
            $("#licenseclass").val("");
            $("#licenseissuedate").val("");

            $("#sskentrydeclaration").prop("checked", false);
            $("#isgtrainingdocument").prop("checked", false);
            $("#medicalreport").prop("checked", false);
            $("#kkdform").prop("checked", false);
            $("#criminalrecord").prop("checked", false);
            $("#identificationcard").prop("checked", false);
            $("#drivinglicense").prop("checked", false);
            $("#diploma").prop("checked", false);
            $("#qualificationcertificate").prop("checked", false);

            $("#hrbtnComments").find("#hrcomments").html("0");
            $("#hrbtnDocuments").find("#hrdocuments").html("0");

            tooltip.hide("#shoesize");
            tooltip.hide("#tshirtsize");
            tooltip.hide("#pantsize");
            tooltip.hide("#polarsize");

            customFieldsHelper.clearCustomFields();
            userCommentsHelper.clearComments();
            userDocumentsHelper.clearDocuments();
           
        };
        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "USER", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.USR_CODE, operator: "eq" }
                ]
            });
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "hrpersonalinfo")
                tms.BeforeFill("#hrpersonalinfo");
            tms.Tab();

            $("#registrationnumber").val(selectedrecord.USR_REGISTRATIONNUMBER || "");
            $("#title").val(selectedrecord.USR_TITLE || "");
            $("#tcnumber").val(selectedrecord.USR_TCNUMBER || "");
            $("#fusenumber").val(selectedrecord.USR_FUSENUMBER || "");
            $("input[name=gtype][value=" + selectedrecord.USR_GENDER + "]").prop("checked", true);
            $("input[name=mtype][value=" + selectedrecord.USR_MARITALSTATUS + "]").prop("checked", true);
            $("#birthdate").val(selectedrecord.USR_BIRTHDATE
                ? moment(selectedrecord.USR_BIRTHDATE).format(constants.dateformat)
                : null);
            $("#placeofbirth").val(selectedrecord.USR_PLACEOFBIRTH || "");
            $("#bloodgroup").val(selectedrecord.USR_BLOODGROUP || "");
            $("#edustatus").val(selectedrecord.USR_EDUCATIONSTATUS || "");
            $("#lastgraduatedschool").val(selectedrecord.USR_LASTGRADUATEDSCHOOL);
            $("#lastgraduateddepartment").val(selectedrecord.USR_LASTGRADUATEDDEPARTMENT);
            $("#lastgraduateddate").val(selectedrecord.USR_LASTGRADUATEDDATE
                ? moment(selectedrecord.USR_LASTGRADUATEDDATE).format(constants.dateformat)
                : null);
            $("#militaryservice").val(selectedrecord.USR_MILITARYSERVICE || "");
            $("#emergencycontactname").val(selectedrecord.USR_EMERGENCYCONTACTNAME || "");
            $("#emergencycontactaffinity").val(selectedrecord.USR_EMERGENCYCONTACTAFFINITY || "");
            $("#emergencycontactphone").val(selectedrecord.USR_EMERGENCYCONTACTPHONENUMBER || "");

            $("#phonenumber").val(selectedrecord.USR_PHONENUMBER || "");
            $("#Maintelephonenumber").val(selectedrecord.USR_HOMETELEPHONENUMBER || "");
            $("#officenumber").val(selectedrecord.USR_OFFICENUMBER || "");
            $("#personalemail").val(selectedrecord.USR_PERSONALEMAIL || "");
            $("#fulladdress").val(selectedrecord.USR_FULLADDRESS || "");
            $("#shoesize").val(selectedrecord.USR_SHOESIZE || "");
            $("#tshirtsize").val(selectedrecord.USR_TSHIRTSIZE || "");
            $("#pantsize").val(selectedrecord.USR_PANTSIZE || "");
            $("#polarsize").val(selectedrecord.USR_POLARSIZE || "");
            $("#licenseclass").val(selectedrecord.USR_DRIVINGLICENSECLASS || "");
            $("#licenseissuedate").val(selectedrecord.USR_LICENSEISSUEDATE
                ? moment(selectedrecord.USR_LICENSEISSUEDATE).format(constants.dateformat)
                : null);


            $("#sskentrydeclaration").prop("checked", selectedrecord.USR_SSKENTRYDECLARATION === "+");
            $("#isgtrainingdocument").prop("checked", selectedrecord.USR_ISGTRAININGDOCUMENT === "+");
            $("#medicalreport").prop("checked", selectedrecord.USR_MEDICALREPORT === "+");
            $("#kkdform").prop("checked", selectedrecord.USR_KKDFORM === "+");
            $("#criminalrecord").prop("checked", selectedrecord.USR_CRIMINALRECORD === "+");
            $("#identificationcard").prop("checked", selectedrecord.USR_IDENTIFICATIONCARD === "+");
            $("#drivinglicense").prop("checked", selectedrecord.USR_DRIVINGLICENSE === "+");
            $("#diploma").prop("checked", selectedrecord.USR_SCHOOLDIPLOMA === "+");
            $("#qualificationcertificate").prop("checked", selectedrecord.USR_QUALIFICATIONCERTIFICATE === "+");

            tooltip.show("#shoesize", selectedrecord.USR_SHOESIZEDESC);
            tooltip.show("#tshirtsize", selectedrecord.USR_TSHIRTSIZEDESC);
            tooltip.show("#pantsize", selectedrecord.USR_PANTSIZEDESC);
            tooltip.show("#polarsize", selectedrecord.USR_POLARSIZEDESC);

        };
        this.Save = function () {

            if (!tms.Check())
                return $.Deferred().reject();           

            var tcnumber = $("#tcnumber").val();
            if (tcnumber.length != 11 && tcnumber.length != 0) {
            msgs.error(applicationstrings[lang].tcknerr);
                 return $.Deferred().reject();
            }

            var gender = $("input[name=\"gtype\"]:checked").val();
            var maritalstatus = $("input[name=\"mtype\"]:checked").val();

            var o = JSON.stringify({
                        USR_CODE:selectedrecord.USR_CODE,                       
                        USR_REGISTRATIONNUMBER: ($("#registrationnumber").val() || null),
                        USR_TITLE: ($("#title").val() || null),
                        USR_TCNUMBER: ($("#tcnumber").val() || null),
                        USR_FUSENUMBER: ($("#fusenumber").val() || null),
                        USR_GENDER: (gender || null),
                        USR_MARITALSTATUS: (maritalstatus || null),
                        USR_BIRTHDATE: ($("#birthdate").val() ? moment.utc($("#birthdate").val(), constants.dateformat) : null),
                        USR_PLACEOFBIRTH: ($("#placeofbirth").val() || null),
                        USR_BLOODGROUP: ($("#bloodgroup").val() || null),
                        USR_EDUCATIONSTATUS: ($("#edustatus").val() || null),
                        USR_LASTGRADUATEDSCHOOL: ($("#lastgraduatedschool").val() || null),
                        USR_LASTGRADUATEDDEPARTMENT: ($("#lastgraduateddepartment").val() || null),
                        USR_LASTGRADUATEDDATE: ($("#lastgraduateddate").val() ? moment.utc($("#lastgraduateddate").val(), constants.dateformat) : null),
                        USR_MILITARYSERVICE: ($("#militaryservice").val() || null),
                        USR_EMERGENCYCONTACTNAME: ($("#emergencycontactname").val() || null),
                        USR_EMERGENCYCONTACTAFFINITY: ($("#emergencycontactaffinity").val() || null),
                        USR_EMERGENCYCONTACTPHONENUMBER: ($("#emergencycontactphone").val() || null),
                        USR_PHONENUMBER: ($("#phonenumber").val() || null),
                        USR_HOMETELEPHONENUMBER: ($("#Maintelephonenumber").val() || null),
                        USR_OFFICENUMBER: ($("#officenumber").val() || null),
                        USR_PERSONALEMAIL: ($("#personalemail").val() || null),
                        USR_FULLADDRESS: ($("#fulladdress").val() || null),
                        USR_SHOESIZE: ($("#shoesize").val() || null),
                        USR_TSHIRTSIZE: ($("#tshirtsize").val() || null),
                        USR_PANTSIZE: ($("#pantsize").val() || null),
                        USR_POLARSIZE: ($("#polarsize").val() || null),
                        USR_DRIVINGLICENSE: $("#drivinglicense").prop("checked") ? "+" : "-",
                        USR_DRIVINGLICENSECLASS: ($("#licenseclass").val() || null),
                        USR_LICENSEISSUEDATE: ($("#licenseissuedate").val() ? moment.utc($("#licenseissuedate").val(), constants.dateformat) : null), 
                   
                })

            return tms.Ajax({
                url: "/Api/ApiUsers/SaveUserInformation",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                }
            });
        };
        var RegisterUiEvents = function () {
            $("#btnSaveHrPersonalInfo").click(self.Save);      
        };
        this.BuildUI = function () {
            LoadDocumentTypes();
            FillUserInterface();
            userDocumentsHelper = new documents({
                input: "#hrfu",
                filename: "#hrfilename",
                uploadbtn: "#hrbtnupload",
                container: "#hrfupload",
                documentsdiv: "#hrdocs",
                progressbar: "#hrdocuprogress",
                downloadbutton: "#hrbtnDownload"
            });
            userCommentsHelper = new comments({
                input: "#hrcomment",
                //chkvisibletocustomer: "#visibletocustomer",
                //chkvisibletosupplier: "#visibletosupplier",
                btnaddcomment: "#hraddComment",
                commentsdiv: "#hrcomments"
            });

            BuildModals();
            AutoComplete();

        };
        LoadDocumentTypes = function () {
            var gridreq = {
                sort: [{ field: "SYC_CODE", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "USERDOCTYPE", operator: "eq" }
                    ]
                }
            };

            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $("#hrdoctype option:not(.default)").remove();
                    var strOptions = "";
                    for (var i = 0; i < d.data.length; i++) {
                        strOptions += "<option value=\"" +
                            d.data[i].SYC_CODE +
                            "\">" +
                            d.data[i].SYC_DESCF +
                            "</option>";
                    }
                    $("#hrdoctype").append(strOptions);
                }
            });


        };

        this.Ready = function () {
            self.BuildUI();
        }

        RegisterUiEvents();
    };

    function ready() {
        usr.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());