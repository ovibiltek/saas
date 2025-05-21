var customfields = function (p) {
    var _buildCustomFields = function (o,data) {

        var customFieldsStr = "";
        var cfgroup = null;
        var cfarr = data.customfields;
        var cfrelations = data.customfieldrelations;

        for (var i = 0; i < cfrelations.length; i++) {

            var customfieldrelation = cfrelations[i];
            var currentcustomfieldgroup = customfieldrelation.CFR_GROUP;
            var currentcustomfieldgroupdesc = customfieldrelation.CFR_GROUPDESC;

            var cfi = $.grep(cfarr,
                function (customfielditem) {
                    return (customfieldrelation.CFR_CODE === customfielditem.CFD_CODE);
                })[0];

            var inputaddstr = "";
            var btnaddstr = "";


            switch (customfieldrelation.CFR_AUTH) {
            case "P":
                inputaddstr = "disabled";
                btnaddstr = "disabled";
                break;
            case "R":
                switch (cfi.CFD_FIELDTYPE) {
                case "CHECKBOX":
                    inputaddstr = "";
                    btnaddstr = "";
                    break;
                default:
                    inputaddstr = "required";
                    btnaddstr = "";
                    break;
                }
                break;
            }

            if (cfgroup !== currentcustomfieldgroup) {
                cfgroup = currentcustomfieldgroup;
                if (cfgroup) {
                    customFieldsStr += "<div class=\"page-header custom-field-group-title\">";
                    customFieldsStr += "<h4>" + currentcustomfieldgroupdesc + "</h4>";
                    customFieldsStr += "</div>";
                } else {
                    customFieldsStr += "<hr />";
                }
            }

            customFieldsStr += "<div class=\"row custom\">";
            customFieldsStr += "<div class=\"col-md-" + (o.col1 || "4") + "\">";
            customFieldsStr += cfi.CFD_DESCF;
            customFieldsStr += "</div>";
            customFieldsStr += "<div class=\"col-md-" + (o.col2 || "8") + "\">";

            switch (cfi.CFD_FIELDTYPE) {
            case "LOOKUP":
            case "ENTITY":
                customFieldsStr += "<div class=\"input-group\">";
                customFieldsStr += "<input " +
                    inputaddstr +
                    " type=\"text\"" +
                    (cfi.CFD_ALLOWFREETEXT === "+" ? "" : "uppercase=\"yes\"") +
                    " maxlength=\"50\" class=\"form-control\" data-allowfreetext=\"" +
                    (cfi.CFD_ALLOWFREETEXT === "+") +
                    "\"  data-entity=\"" +
                    customfieldrelation.CFR_ENTITY +
                    "\" data-ftype=\"" +
                    cfi.CFD_FIELDTYPE +
                    "\" data-fentity=\"" +
                    cfi.CFD_ENTITY +
                    "\" data-code=\"" +
                    cfi.CFD_CODE +
                    "\" id=\"txt" +
                    cfi.CFD_CODE.replace(/\./g, "") +
                    "\">";
                customFieldsStr += "<span class=\"input-group-btn\">";
                customFieldsStr += "<button " +
                    btnaddstr +
                    " class=\"btn btn-default cf-lu-btn\" data-rel=\"#txt" +
                    cfi.CFD_CODE.replace(/\./g, "") +
                    "\"  type=\"button\" id=\"btn" +
                    cfi.CFD_CODE.replace(/\./g, "") +
                    "\"><i class=\"fa " +
                    (cfi.CFD_ALLOWFREETEXT === "+" ? "fa-hand-pointer-o" : "fa-search") +
                    " fa-fw\"></i></button>";
                customFieldsStr += "</span>";
                customFieldsStr += "</div>";
                break;
            case "CHECKBOX":
                customFieldsStr += "<div class=\"checkbox checkbox-primary no-margin\"><input " +
                    inputaddstr +
                    " data-ftype=\"" +
                    cfi.CFD_FIELDTYPE +
                    "\" type=\"checkbox\" data-code=\"" +
                    cfi.CFD_CODE +
                    "\" /><label /></div>";
                break;
            case "UCASEFREETEXT":
                customFieldsStr += "<input " +
                    inputaddstr +
                    " class=\"form-control\" uppercase=\"yes\" data-ftype=\"" +
                    cfi.CFD_FIELDTYPE +
                    "\" type=\"text\" data-code=\"" +
                    cfi.CFD_CODE +
                    "\" />";
                break;
            default:
                customFieldsStr += "<input " +
                    inputaddstr +
                    " class=\"form-control\" data-ftype=\"" +
                    cfi.CFD_FIELDTYPE +
                    "\" type=\"text\" data-code=\"" +
                    cfi.CFD_CODE +
                    "\" />";
                break;
            }
            customFieldsStr += "</div>";
            customFieldsStr += "</div>";

        }


        var cfcontainer = $(p.container);
        cfcontainer.find("*").remove();
        cfcontainer.append(customFieldsStr);

        cfcontainer.find("[required]:not([disabled])").addClass("required");
        cfcontainer.find("[data-ftype=\"DATE\"]").datetimepicker({
            format: constants.dateformat,
            showClear: true,
            icons: { clear: "fa fa-eraser" }
        });
        cfcontainer.find("[data-ftype=\"DATETIME\"]").datetimepicker({
            format: constants.longdateformat,
            showClear: true,
            icons: { clear: "fa fa-eraser" }
        });
        cfcontainer.find("[data-ftype=\"TIME\"]").datetimepicker({
            format: constants.timeformat,
            showClear: true,
            icons: { clear: "fa fa-eraser" }
        });
        cfcontainer.find("[data-ftype=\"NUMERIC\"]").numericInput({ allowNegative: false, allowFloat: true });
        cfcontainer.find("[data-ftype=\"LOOKUP\"]").autocomp({
            listurl: "/Api/ApiLookupLines/List",
            geturl: "/Api/ApiLookupLines/Get",
            field: "TML_ITEMCODE",
            textfield: "TML_ITEMDESC",
            filter: [{ field: "TML_CODE", dataattr: "code", includeall: false }]
        });
        cfcontainer.find("[data-ftype=\"ENTITY\"]").autocomp({ type: "ENTITY" });

        cfcontainer.find(".cf-lu-btn").click(function () {
            var $this = $(this);
            var inp = $this.data("rel");
            var modal = null;
            var allowfreetext = $(inp).data("allowfreetext");

            if ($(inp).data("fentity")) {
                var fentity = $(inp).data("fentity");
                var e = lu.list()[fentity];
                e.modal.returninput = "#" + $(inp).attr("id");
                if (e.filterconf)
                    e.modal.filter = e.filterconf[p.screen].modal;
                gridModal.show(e.modal);
            } else {
                var columns = [];
                if (!allowfreetext)
                    columns.push({ type: "string", field: "TML_ITEMCODE", title: gridstrings.lookup[lang].code, width: 100 });

                columns.push({ type: "string", field: "TML_ITEMDESC", title: gridstrings.lookup[lang].desc, width: 300 });

                gridModal.show({
                    modaltitle: gridstrings.lookup[lang].title,
                    listurl: "/Api/ApiLookupLines/List",
                    keyfield: "TML_ITEMCODE",
                    codefield: "TML_ITEMCODE",
                    textfield: "TML_ITEMDESC",
                    returninput: inp,
                    allowfreetext: allowfreetext,
                    columns: columns,
                    filter: [
                        { field: "TML_CODE", value: $(inp).data("code"), operator: "eq" },
                        { field: "TML_TYPE", value: "CUSTOMFIELD", operator: "eq" }
                    ]
                });
            }
        });
    };
    var _loadCustomFieldValues = function (o) {
        if (o.source) {
            return tms.Ajax({
                url: "/Api/ApiCustomFields/GetCustomFieldValues",
                data: JSON.stringify({ subject: o.subject, source: o.source }),
                quietly: true,
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {

                        var cfd = d.data[i];
                        var input = $("input[data-code=\"" + cfd.CFV_CODE + "\"]");
                        var ftype = $(input).data("ftype");
                        input.data("id", cfd.CFV_ID);
                        input.data("recordversion", cfd.CFV_RECORDVERSION);

                        if (cfd.CFV_DESC)
                            tooltip.show(input, cfd.CFV_DESC);

                        if (cfd.CFV_TEXT) {
                            if (input.is(":checkbox")) {
                                input.prop("checked", cfd.CFV_TEXT === "+");
                                if (input.data("change"))
                                    input.trigger("change");
                            } else
                                input.val(cfd.CFV_TEXT);
                        } else if (cfd.CFV_NUM) {
                            input.val(cfd.CFV_NUM);
                        } else if (cfd.CFV_DATETIME) {
                            if ($(input).data("ftype") === "DATETIME")
                                input.val(moment(cfd.CFV_DATETIME).format(constants.longdateformat));
                            else if ($(input).data("ftype") === "DATE")
                                input.val(moment(cfd.CFV_DATETIME).format(constants.dateformat));
                        }
                    }
                }
            });
        }

        return $.Deferred().resolve();

    };
    var _loadCustomFields = function (o) {

        var gr = {
            filter: {
                filters: [
                    { field: "CFR_ENTITY", value: o.subject, operator: "eq" },
                    { field: "CFR_TYPE", value: [o.type, "*"], operator: "in" },
                    { field: "CFR_AUTH", value: "H", operator: "neq" }
                ]
            },
            sort: [
                { field: "CFR_GROUPORDER", dir: "asc" },
                { field: "CFR_ORDER", dir: "asc" }
            ],
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiCustomFieldRelations/GetCustomFields",
            data: JSON.stringify(gr),
            quietly: true,
            fn: function (d) {
                _buildCustomFields(o,d.data);
                return _loadCustomFieldValues(o);
            }
        });
    };
    var _clearCustomFields = function () {
        var cfcontainer = $(p.container);
        cfcontainer.find("*").remove();
    };
    var _getCustomFieldScreenValues = function (o) {
        var cfcontainer = $(p.container);
        var customfieldvalues = [];
        var customfieldinputs = cfcontainer.find("input[data-ftype]");
        for (var i = 0; i < customfieldinputs.length; i++) {
            var cf = $(customfieldinputs[i]);
            var cfo = {};
            cfo.CFV_CODE = cf.data("code");
            cfo.CFV_ID = cf.data("id");
            cfo.CFV_SUBJECT = o.subject;
            cfo.CFV_SOURCE = o.source;
            cfo.CFV_TYPE = o.type;
            cfo.CFV_TYPEENTITY = o.entity;
            cfo.CFV_RECORDVERSION = (cf.data("recordversion") || "0");
            switch (cf.data("ftype")) {
            case "FREETEXT":
            case "TIME":
                cfo.CFV_TEXT = cf.val();
                break;
            case "CHECKBOX":
                cfo.CFV_TEXT = cf.prop("checked") ? "+" : "";
                break;
            case "NUMERIC":
                cfo.CFV_NUM = (cf.val() ? parseFloat(cf.val()) : null);
                break;
            case "DATE":
                cfo.CFV_DATETIME = (cf.val() ? moment.utc(cf.val(), constants.dateformat) : null);
                break;
            case "DATETIME":
                cfo.CFV_DATETIME = (cf.val() ? moment.utc(cf.val(), constants.longdateformat) : null);
                break;
            case "LOOKUP":
            case "ENTITY":
                cfo.CFV_TEXT = cf.val();
                break;
            default:
                break;
            }

            customfieldvalues.push(cfo);

        }
        return customfieldvalues;
    };
    return {
        loadCustomFields: _loadCustomFields,
        clearCustomFields: _clearCustomFields,
        getCustomFieldScreenValues: _getCustomFieldScreenValues
    };
};