(function () {
    var selectedrecord = null;
    var config = null;
    var grd = null;
    var grdElement = null;

    var tabconfig = {
        failures: {
            cls: "TMFAILURES",
            descfield: "FAL_DESC",
            save: "/Api/ApiFailures/Save",
            del: "/Api/ApiFailures/DelRec",
            get: "/Api/ApiFailures/Get",
            tabid: "#failures",
            inpid: "#failurecode"
        },
        causes: {
            cls: "TMCAUSES",
            descfield: "CAU_DESC",
            save: "/Api/ApiCauses/Save",
            del: "/Api/ApiCauses/DelRec",
            get: "/Api/ApiCauses/Get",
            tabid: "#causes",
            inpid: "#causecode"
        },
        actions: {
            cls: "TMACTIONS",
            descfield: "ACT_DESC",
            save: "/Api/ApiActions/Save",
            del: "/Api/ApiActions/DelRec",
            get: "/Api/ApiActions/Get",
            tabid: "#actions",
            inpid: "#actioncode"
        }
    };

    function loadFieldMaps() {
        var gridreq = null;
        switch (config.tabid) {
            case "#failures":
                gridreq = {
                    filter: {
                        filters: [
                            { field: "FMP_ENTITY", value: "FAILURE", operator: "eq" },
                            { field: "FMP_FIELD", value: "EQUIPMENTTYPE", operator: "eq" },
                            { field: "FMP_CODE", value: selectedrecord.FAL_CODE, operator: "eq" }

                        ]
                    }, loadall: true
                };
                break;
            case "#causes":
                gridreq = {
                    filter: {
                        filters: [
                            { field: "FMP_ENTITY", value: "CAUSE", operator: "eq" },
                            { field: "FMP_FIELD", value: "FAILURE", operator: "eq" },
                            { field: "FMP_CODE", value: selectedrecord.CAU_CODE, operator: "eq" }

                        ]
                    },
                    loadall: true
                };
                break;
            case "#actions":
                gridreq = {
                    filter: {
                        filters: [
                            { field: "FMP_ENTITY", value: "ACTION", operator: "eq" },
                            { field: "FMP_FIELD", value: "CAUSE", operator: "eq" },
                            { field: "FMP_CODE", value: selectedrecord.ACT_CODE, operator: "eq" }

                        ]
                    },
                    loadall: true
                };
                break;
        }
        return tms.Ajax({
            url: "/Api/ApiFieldMaps/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var modal = $("#relations");
                var inputcontainer = modal.find(".modal-data");
                inputcontainer.find("input.chk-rel").prop("checked", false).prop("disabled", false);
                for (var i = 0; i < d.data.length; i++) {
                    inputcontainer.find("input.chk-rel[data-val=\"" + d.data[i].FMP_VALUE + "\"]").prop("checked", true);
                }
            }
        });
    }

    function saveFieldMaps() {
        var selectedcode = null;
        var o = {};
        switch (config.tabid) {
            case "#failures":
                selectedcode = selectedrecord.FAL_CODE;
                o = {
                    Entity: "FAILURE",
                    Code: selectedcode,
                    field: "EQUIPMENTTYPE",
                    Lines: []
                }
                break;
            case "#causes":
                selectedcode = selectedrecord.CAU_CODE;
                o = {
                    Entity: "CAUSE",
                    Code: selectedcode,
                    field: "FAILURE",
                    Lines: []
                }
                break;
            case "#actions":
                selectedcode = selectedrecord.ACT_CODE;
                o = {
                    Entity: "ACTION",
                    Code: selectedcode,
                    field: "CAUSE",
                    Lines: []
                }
                break;
        }

        var modal = $("#relations");
        var fieldmapsarr = [];
        var relinputs = $("div.lines div.row input.chk-rel");
        for (var i = 0; i < relinputs.length; i++) {
            var ri = $(relinputs[i]);
            if (ri.prop("checked"))
                fieldmapsarr.push({
                    FMP_ENTITY: ri.data("entity"),
                    FMP_CODE: selectedcode,
                    FMP_FIELD: ri.data("field"),
                    FMP_VALUE: ri.data("val"),
                    FMP_CREATED: tms.Now(),
                    FMP_CREATEDBY: user,
                    FMP_RECORDVERSION: 0
                });
        };

        o.Lines = fieldmapsarr;
        return tms.Ajax({
            url: "/Api/ApiFieldMaps/Save",
            data: JSON.stringify(o),
            fn: function (d) {
                msgs.success(d.data);
            }
        });
    }

    function listEquipmentTypes() {
        var modal = $("#relations");
        var gridreq = {
            sort: [{ field: "TYP_CODE", dir: "asc" }],
            filter: { filters: [{ field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" }] },
            loadall: true
        };
        return tms.Ajax({
            url: "/Api/ApiTypes/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var tmpEntity = "";
                var strlist = "<div class=\"lines\">";
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    strlist += "<div class=\"row custom rel-row\">";
                    strlist += "<div class=\"col-md-1\">";
                    strlist +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"chk-rel styled\" type=\"checkbox\"" +
                        " data-entity=\"FAILURE\" data-field=\"EQUIPMENTTYPE\" data-val=\"" + d.data[i].TYP_CODE +
                        "\" /><label></label></div> ";
                    strlist += "</div>";
                    strlist += "<div class=\"col-md-11\">";
                    strlist += d.data[i].TYP_CODE + " - " + d.data[i].TYP_DESCF;
                    strlist += "</div>";
                    strlist += "</div>";
                }
                strlist += "</div>";

                var inputcontainer = modal.find(".modal-data");
                inputcontainer.find("*").remove();
                inputcontainer.append(strlist);

                modal.find(".modal-title").text(gridstrings.failures[lang].eqptyperel);
                modal.modal("show");
            }
        });
    }

    function listFailures() {
        var modal = $("#relations");
        var gridreq = {
            sort: [{ field: "FAL_CODE", dir: "asc" }],
            filter: { filters: [{ field: "FAL_ACTIVE", value: "+", operator: "eq" }] },
            loadall: true
        };
        return tms.Ajax({
            url: "/Api/ApiFailures/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var tmpEntity = "";
                var strlist = "<div class=\"lines\">";
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    strlist += "<div class=\"row custom rel-row\">";
                    strlist += "<div class=\"col-md-1\">";
                    strlist +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"chk-rel styled\" type=\"checkbox\"" +
                        "\" data-entity=\"CAUSE\" data-field=\"FAILURE\" data-val=\"" +
                        d.data[i].FAL_CODE +
                        "\" /><label></label></div> ";
                    strlist += "</div>";
                    strlist += "<div class=\"col-md-11\">";
                    strlist += d.data[i].FAL_CODE + " - " + d.data[i].FAL_DESCF;
                    strlist += "</div>";
                    strlist += "</div>";
                }
                strlist += "</div>";

                var inputcontainer = modal.find(".modal-data");
                inputcontainer.find("*").remove();
                inputcontainer.append(strlist);

                modal.find(".modal-title").text(gridstrings.causes[lang].failrel);
                modal.modal("show");
            }
        });
    }

    function listCauses() {
        var modal = $("#relations");
        var gridreq = {
            sort: [{ field: "CAU_CODE", dir: "asc" }],
            filter: { filters: [{ field: "CAU_ACTIVE", value: "+", operator: "eq" }] },
            loadall: true
        };
        return tms.Ajax({
            url: "/Api/ApiCauses/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var tmpEntity = "";
                var strlist = "<div class=\"lines\">";
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    strlist += "<div class=\"row custom rel-row\">";
                    strlist += "<div class=\"col-md-1\">";
                    strlist +=
                        "<div class=\"checkbox checkbox-primary\"><input class=\"chk-rel styled\" type=\"checkbox\"" +
                        "\" data-entity=\"ACTION\" data-field=\"CAUSE\" data-val=\"" +
                        d.data[i].CAU_CODE +
                        "\" /><label></label></div> ";
                    strlist += "</div>";
                    strlist += "<div class=\"col-md-11\">";
                    strlist += d.data[i].CAU_CODE + " - " + d.data[i].CAU_DESCF;
                    strlist += "</div>";
                    strlist += "</div>";
                }
                strlist += "</div>";

                var inputcontainer = modal.find(".modal-data");
                inputcontainer.find("*").remove();
                inputcontainer.append(strlist);

                modal.find(".modal-title").text(gridstrings.actions[lang].causerel);
                modal.modal("show");
            }
        });
    }

    function listRelations() {
        $("#modalsearch").val("");
        switch (config.tabid) {
            case "#failures":
                $.when(listEquipmentTypes()).done(function () {
                    loadFieldMaps();
                });
                break;
            case "#causes":
                $.when(listFailures()).done(function () {
                    loadFieldMaps();
                });
                //Failures
                break;
            case "#actions":
                // Causes
                $.when(listCauses()).done(function () {
                    loadFieldMaps();
                });
                break;
        }
    }

    function resetUI() {
        selectedrecord = null;
        tms.Reset(config.tabid);

        switch (config.tabid) {
            case "#failures":
                $("#failurecode").val("");
                $("#failuredesc").val("");
                $("#failureactive").prop("checked", true);
                $("#common").prop("checked", false);
                break;
            case "#causes":
                $("#causecode").val("");
                $("#causedesc").val("");
                $("#causefailure").val("");
                $("#causeactive").prop("checked", true);
                tooltip.hide("#causefailure");
                break;
            case "#actions":
                $("#actioncode").val("");
                $("#actiondesc").val("");
                $("#actionfailure").val("");
                $("#actioncause").val("");
                $("#actionactive").prop("checked", true);
                tooltip.hide("#actionfailure");
                tooltip.hide("#actioncause");
                break;
        }
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: config.cls, operator: "eq" },
                { field: "AUD_REFID", value: $(config.inpid).val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        var code = null;
        switch (config.tabid) {
            case "#failures":
                code = $("#failurecode").val();
                break;
            case "#causes":
                code = $("#causecode").val();
                break;
            case "#actions":
                code = $("#actioncode").val();
                break;
        }

        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: config.cls, operator: "eq" },
                { field: "DES_PROPERTY", value: config.descfield, operator: "eq" },
                { field: "DES_CODE", value: code, operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill(config.tabid);

        switch (config.tabid) {
            case "#failures":
                $("#failurecode").val(selectedrecord.FAL_CODE);
                $("#failuredesc").val(selectedrecord.FAL_DESC);
                $("#failureactive").prop("checked", selectedrecord.FAL_ACTIVE === "+");
                $("#common").prop("checked", selectedrecord.FAL_COMMON === "+");
                $(".page-header>h6").html(selectedrecord.FAL_CODE + " - " + selectedrecord.FAL_DESC);
                break;
            case "#causes":
                $("#causecode").val(selectedrecord.CAU_CODE);
                $("#causedesc").val(selectedrecord.CAU_DESC);
                $("#causeactive").prop("checked", selectedrecord.CAU_ACTIVE === "+");
                $(".page-header>h6").html(selectedrecord.CAU_CODE + " - " + selectedrecord.CAU_DESC);
                break;
            case "#actions":
                $("#actioncode").val(selectedrecord.ACT_CODE);
                $("#actiondesc").val(selectedrecord.ACT_DESC);
                $("#actionactive").prop("checked", selectedrecord.ACT_ACTIVE === "+");
                $(".page-header>h6").html(selectedrecord.ACT_CODE + " - " + selectedrecord.ACT_DESC);
                break;
        }
    }

    function loadSelected() {
        var code = null;
        switch (config.tabid) {
            case "#failures":
                code = selectedrecord.FAL_CODE;
                break;
            case "#causes":
                code = selectedrecord.CAU_CODE;
                break;
            case "#actions":
                code = selectedrecord.ACT_CODE;
                break;
        }

        return tms.Ajax({
            url: config.get,
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = null;
            switch (config.tabid) {
                case "#failures":
                    code = selectedrecord.FAL_CODE;
                    break;
                case "#causes":
                    code = selectedrecord.CAU_CODE;
                    break;
                case "#actions":
                    code = selectedrecord.ACT_CODE;
                    break;
            }

            if (code != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: config.del,
                            data: JSON.stringify(code),
                            fn: function (d) {
                                msgs.success(d.data);
                                resetUI();
                                list();
                            }
                        });
                    });
            }
        }
    }

    function save() {
        if (!tms.Check(config.tabid))
            return $.Deferred().reject();

        var so = null;
        switch (config.tabid) {
            case "#failures":
                so = {
                    FAL_CODE: $("#failurecode").val().toUpper(),
                    FAL_DESC: $("#failuredesc").val(),
                    FAL_COMMON: $("#common").prop("checked") ? "+" : "-",
                    FAL_ACTIVE: $("#failureactive").prop("checked") ? "+" : "-",
                    FAL_CREATED: selectedrecord != null ? selectedrecord.FAL_CREATED : tms.Now(),
                    FAL_CREATEDBY: selectedrecord != null ? selectedrecord.FAL_CREATEDBY : user,
                    FAL_UPDATED: selectedrecord != null ? tms.Now() : null,
                    FAL_UPDATEDBY: selectedrecord != null ? user : null,
                    FAL_RECORDVERSION: selectedrecord != null ? selectedrecord.FAL_RECORDVERSION : 0,
                    FAL_SQLIDENTITY: selectedrecord != null ? selectedrecord.FAL_SQLIDENTITY : 0
                };
                break;
            case "#causes":
                so = {
                    CAU_CODE: $("#causecode").val().toUpper(),
                    CAU_DESC: $("#causedesc").val(),
                    CAU_ACTIVE: $("#causeactive").prop("checked") ? "+" : "-",
                    CAU_CREATED: selectedrecord != null ? selectedrecord.CAU_CREATED : tms.Now(),
                    CAU_CREATEDBY: selectedrecord != null ? selectedrecord.CAU_CREATEDBY : user,
                    CAU_UPDATED: selectedrecord != null ? tms.Now() : null,
                    CAU_UPDATEDBY: selectedrecord != null ? user : null,
                    CAU_RECORDVERSION: selectedrecord != null ? selectedrecord.CAU_RECORDVERSION : 0,
                    CAU_SQLIDENTITY: selectedrecord != null ? selectedrecord.CAU_SQLIDENTITY : 0
                };
                break;
            case "#actions":
                so = {
                    ACT_CODE: $("#actioncode").val().toUpper(),
                    ACT_DESC: $("#actiondesc").val(),
                    ACT_ACTIVE: $("#actionactive").prop("checked") ? "+" : "-",
                    ACT_CREATED: selectedrecord != null ? selectedrecord.ACT_CREATED : tms.Now(),
                    ACT_CREATEDBY: selectedrecord != null ? selectedrecord.ACT_CREATEDBY : user,
                    ACT_UPDATED: selectedrecord != null ? tms.Now() : null,
                    ACT_UPDATEDBY: selectedrecord != null ? user : null,
                    ACT_RECORDVERSION: selectedrecord != null ? selectedrecord.ACT_RECORDVERSION : 0,
                    ACT_SQLIDENTITY: selectedrecord != null ? selectedrecord.ACT_SQLIDENTITY : 0
                };
                break;
        }

        return tms.Ajax({
            url: config.save,
            data: JSON.stringify(so),
            fn: function (d) {
                msgs.success(d.data);
                resetUI();
                list();
            }
        });
    }

    function itemSelect(row) {
        selectedrecord = grd.GetRowDataItem(row);
        switch (config.tabid) {
            case "#failures":
                $(".page-header h6").html(selectedrecord.FAL_CODE + " - " + selectedrecord.FAL_DESC);
                break;
            case "#causes":
                $(".page-header h6").html(selectedrecord.CAU_CODE + " - " + selectedrecord.CAU_DESC);
                break;
            case "#actions":
                $(".page-header h6").html(selectedrecord.ACT_CODE + " - " + selectedrecord.ACT_DESC);
                break;
        }
        loadSelected(selectedrecord);
    }

    function gridDataBound(e) {
        grdElement.find(".btn-rel").on("click", function (e) {
            var row = $(this).closest("[data-id]");
            grd.SelectRow(row);
            itemSelect(row);
            listRelations();
        });
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        switch (config.tabid) {
            case "#failures":
                grdElement = $("#grdFailures");
                grd = new Grid({
                    keyfield: "FAL_CODE",
                    columns: [
                        {
                            type: "na",
                            field: "REL",
                            title: "#",
                            template: "<div style=\"text-align:center\"><button type=\"button\" class=\"btn btn-default btn-sm btn-rel\"><i class=\"fa fa-link\"></i></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 15
                        },
                        { type: "string", field: "FAL_CODE", title: gridstrings.failures[lang].code, width: 50 },
                        { type: "string", field: "FAL_DESC", title: gridstrings.failures[lang].desc, width: 100 },
                        { type: "string", field: "FAL_ACTIVE", title: gridstrings.failures[lang].active, width: 50 },
                        { type: "string", field: "FAL_COMMON", title: gridstrings.failures[lang].common, width: 50 }

                    ],
                    datasource: "/Api/ApiFailures/List",
                    selector: "#grdFailures",
                    name: "grdFailures",
                    height: 260,
                    primarycodefield: "FAL_CODE",
                    primarytextfield: "FAL_DESC",
                    filter: null,
                    sort: [{ field: "FAL_CODE", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Failures.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound,
                    change: gridChange
                });
                break;
            case "#causes":
                grdElement = $("#grdCauses");
                grd = new Grid({
                    keyfield: "CAU_CODE",
                    columns: [
                        {
                            type: "na",
                            field: "REL",
                            title: "#",
                            template: "<div style=\"text-align:center\"><button type=\"button\" class=\"btn btn-default btn-sm btn-rel\"><i class=\"fa fa-link\"></i></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 15
                        },
                        { type: "string", field: "CAU_CODE", title: gridstrings.causes[lang].code, width: 50 },
                        { type: "string", field: "CAU_DESC", title: gridstrings.causes[lang].desc, width: 100 },
                        { type: "string", field: "CAU_ACTIVE", title: gridstrings.causes[lang].active, width: 50 }
                    ],
                    datasource: "/Api/ApiCauses/List",
                    selector: "#grdCauses",
                    name: "grdCauses",
                    height: 260,
                    primarycodefield: "CAU_CODE",
                    primarytextfield: "CAU_DESC",
                    filter: null,
                    sort: [{ field: "CAU_CODE", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Causes.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound,
                    change: gridChange
                });
                break;
            case "#actions":
                grdElement = $("#grdActions");
                grd = new Grid({
                    keyfield: "ACT_CODE",
                    columns: [
                        {
                            type: "na",
                            field: "REL",
                            title: "#",
                            template: "<div style=\"text-align:center\"><button type=\"button\" class=\"btn btn-default btn-sm btn-rel\"><i class=\"fa fa-link\"></i></button></div>",
                            filterable: false,
                            sortable: false,
                            width: 15
                        },
                        { type: "string", field: "ACT_CODE", title: gridstrings.actions[lang].code, width: 50 },
                        { type: "string", field: "ACT_DESC", title: gridstrings.actions[lang].desc, width: 100 },
                        { type: "string", field: "ACT_ACTIVE", title: gridstrings.actions[lang].active, width: 50 }
                    ],
                    datasource: "/Api/ApiActions/List",
                    selector: "#grdActions",
                    name: "grdActions",
                    height: 260,
                    primarycodefield: "ACT_CODE",
                    primarytextfield: "ACT_DESC",
                    filter: null,
                    sort: [{ field: "ACT_CODE", dir: "asc" }],
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"Actions.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    },
                    databound: gridDataBound,
                    change: gridChange
                });
                break;
        }
    }

    function buildUi() {
        $("[required]:not([disabled])").addClass("required");
        config = tabconfig.failures;
    }

    function bindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    save();
                }
            },
            {
                k: "ctrl+r",
                e: "#btnNew",
                f: function () {
                    resetUI();
                }
            },
            {
                k: "ctrl+u",
                e: "#btnUndo",
                f: function () {
                    loadSelected();
                }
            },
            {
                k: "ctrl+d",
                e: "#btnDelete",
                f: function () {
                    remove();
                }
            },
            {
                k: "ctrl+h",
                e: "#btnHistory",
                f: function () {
                    historyModal();
                }
            }
        ]);
    }

    function registerUiEvents() {
        $("#btnNew").click(resetUI);
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);
        $("#btnTranslations").click(translationModal);
        $("#modalsave").click(saveFieldMaps);
        $("#modalsearch").keyup(function () {
            var modal = $("#relations");
            modal.find(".rel-row").hide();
            var text = $(this).val();
            modal.find('.rel-row:containsi("' + text + '")').show();
        });

        $("a[data-toggle=\"tab\"]").on("shown.bs.tab",
            function (e) {
                var target = $(e.target).attr("href"); // activated tab
                switch (target) {
                    case "#failures":
                        config = tabconfig.failures;
                        break;
                    case "#causes":
                        config = tabconfig.causes;
                        break;
                    case "#actions":
                        config = tabconfig.actions;
                        break;
                }
                list();
                resetUI();
            });
    }

    function ready() {
        buildUi();
        bindHotKeys();
        registerUiEvents();
        list();
    }

    $(document).ready(ready);
}());