(function () {

    var auditfields = null;

    function buildAuditPropertiesBlock(d) {
        var properties = $("#properties");
        properties.find(".checkbox").remove();

        if (d.data) {
            var strPropertyList = "";
            for (var i = 0; i < d.data.length; i++) {
                strPropertyList += "<div class=\"checkbox checkbox-primary\">";
                strPropertyList += "<input class=\"styled\" type=\"checkbox\" value=\"" + d.data[i] + "\">";
                strPropertyList += "<label data-prop=\"" + d.data[i] + "\">";
                strPropertyList += d.data[i];
                strPropertyList += "</label>";
                strPropertyList += "</div>";
            }

            properties.append(strPropertyList);

            for (var j = 0; j < d.values.length; j++) {
                var v = d.values[j].AUF_PROPERTY;
                var inp = properties.find("input[value=\"" + v + "\"]");
                $(inp).prop("checked", true);
            }

            properties.find("input[type=\"checkbox\"]").on("change", function () { $(this).blur(); });

            properties.find("label").on("click",
                function () {
                    translation.modal.show({
                        filter: [
                            { field: "DES_CLASS", value: "TMAUDITFIELDS", operator: "eq" },
                            { field: "DES_PROPERTY", value: "AUF_PROPERTY", operator: "eq" },
                            { field: "DES_CODE", value: $(this).data("prop"), operator: "eq" }
                        ]
                    });
                });
        }
    }

    function loadAuditProperties(cls) {
        if (!cls) return $.Deferred().reject();

        return tms.Ajax({
            url: "/Api/ApiAudit/List",
            data: JSON.stringify(cls),
            fn: function (d) {
                auditfields = d.values;
                buildAuditPropertiesBlock(d);
            }
        });
    }

    function getCheckedAuditProperties() {
        var auditpropertyinputs = $("#properties .checkbox input");
        var propertylist = [];

        for (var i = 0; i < auditpropertyinputs.length; i++) {
            var p = $(auditpropertyinputs[i]);
            var property = p.val();
            var field = $.grep(auditfields, function(e) { return e.AUF_PROPERTY === property; })[0];

            propertylist.push({
                AUF_CLASS: $("#cls").val(),
                AUF_PROPERTY: property,
                AUF_ISSECONDARYID : field ? field.AUF_ISSECONDARYID : "-",
                AUF_ACTIVE: p.prop("checked") ? "+" : "-"
            });
        }
        return propertylist;
    }

    function save() {
        if (!tms.Check())
            return $.Deferred().reject();

        var p = getCheckedAuditProperties();
        return tms.Ajax({
            url: "/Api/ApiAudit/Save",
            data: JSON.stringify(p),
            fn: function (d) {
                msgs.success(d.data);
            }
        });
    }

    function buildUI() {
        $("input[required]:not([disabled])").addClass("required");
        $("#btnClass").click(function () {
            gridModal.show({
                modaltitle: gridstrings.table[lang].title,
                listurl: "/Api/ApiAuditClasses/List",
                keyfield: "AUC_ID",
                codefield: "AUC_CLASS",
                textfield: "AUC_DESC",
                returninput: "#cls",
                columns: [
                    { type: "string", field: "AUC_CLASS", title: gridstrings.table[lang].table, width: 100 },
                    { type: "string", field: "AUC_DESC", title: gridstrings.table[lang].description, width: 400 }
                ],
                callback: function (data) {
                    loadAuditProperties(data ? data.AUC_CLASS : null);
                }
            });
        });
        $("#cls").autocomp({
            listurl: "/Api/ApiAuditClasses/List",
            field: "AUC_CLASS",
            textfield: "AUC_DESC",
            callback: function (data) {
                loadAuditProperties(data ? data.AUC_CLASS : null);
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
    }

    function bindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    save();
                }
            }
        ]);
    }

    function ready() {
        buildUI();
        bindHotKeys();
        registerUiEvents();
    }

    $(document).ready(ready);
}());