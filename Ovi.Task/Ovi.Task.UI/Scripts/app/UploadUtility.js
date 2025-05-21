(function () {
    var bpTimer = null;
    var isCompleted = false;

    function ListCustomFields(entity, type) {

        var gr = {
            filter: {
                Filters: [
                    { field: "CFR_ENTITY", value: entity, operator: "eq" },
                    { field: "CFR_TYPE", value: [type, "*"], operator: "in" },
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
                return d;
            }
        });


    }

    function ListEquipmentTypes() {

        var gr = {
            filter: {
                Filters: [
                    { field: "TYP_ENTITY", value: "EQUIPMENT", operator: "eq" },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" }
                ]
            },
            sort: [
                { field: "TYP_CODE", dir: "asc" }
            ],
            loadall: true
        };
        var equipments = $("#equipments");
        return tms.Ajax({
            url: "/Api/ApiTypes/List",
            data: JSON.stringify(gr),
            quietly: true,
            fn: function (d) {
                for (var i = 0; i < d.data.length; i++) {
                    var di = d.data[i];
                    equipments.append("<option value=\"BEQP-" + di.TYP_CODE + "\" data-loadcustomfields=\"true\" data-entity=\"EQUIPMENT\" data-type=\"" + di.TYP_CODE + "\">" + di.TYP_DESC + "</option>");
                }
            }
        });

    }

    function BuildHtml() {

        var d = $.Deferred();

        var selectedoption = $("#uploadtype option:selected");
        var entity = selectedoption.data("entity");
        var type = selectedoption.data("type");
        var usevalue = selectedoption.data("usevalue");
        var key = usevalue ? selectedoption.val() : (entity || selectedoption.val());
        var text = uploadutilitystrings[lang][key];

        var loadcustomfields = selectedoption.data("loadcustomfields");
        if (loadcustomfields) {
            $.when(ListCustomFields(entity, type)).done(function (dx) {
                var customfields = dx.data.customfields;
                var customfieldrelations = dx.data.customfieldrelations;
                var strcustomfiels = customfieldrelations.map(function (e) {
                    var cf = _.filter(customfields, function (itm) { return itm.CFD_CODE == e.CFR_CODE });
                    return cf[0].CFD_DESCF;
                }).join("<br/>");
                text += "<br/>" + strcustomfiels;
                d.resolve(text);
            });
        } else {
            d.resolve(text);
        }

        return d.promise();

    }

    function RegisterUiEvents() {
        $("#uploadtype").on("change", function () {
            var tval = $(this).val();
            var entity = $(this).find("option:selected").data("entity");
            var usevalue = $(this).find("option:selected").data("usevalue");
            var key = usevalue ? tval : (entity || tval);
            if (key) {
                $.when(BuildHtml()).done(function (text) {
                    $("#info").removeClass("hidden");
                    $("#info").html(text);
                    $("#btndownload").prop("disabled", false);
                });

            } else {
                $("#info").addClass("hidden");
                $("#info").html("");
                $("#btndownload").prop("disabled", true);
            }
        });
        $("#fu").fileupload({
            maxNumberOfFiles: 1,
            autoUpload: false,
            add: function (e, data) {
                $(".page-header").find("h6").html("");
                data.files.map(function (i) {
                    if ($.inArray(i.type, ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]) === -1) {
                        msgs.error(applicationstrings[lang].uploadfileextensionerr);
                    } else {
                        $("#filename").html("<span class=\"badge badge-info\">" + i.name + "</span>");
                        $("#btnupload").removeAttr("disabled");
                        $("#uploadutility").unbind("upload").on("upload", function (evnt, d) {
                            data.formData = d;
                            data.submit();
                        });
                    };
                });
            }
        }).on("fileuploaddone", function (e, data) {
            $("#filename").html("");
            $(this).prop("disabled", false);
            var result = data.result.data;
            var status = data.result.status;
            switch (status) {
                case 200:
                    if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var resultline = result[i];
                            switch (status) {
                                case 200:
                                    if (resultline.ErrLines != null && resultline.ErrLines.length > 1) {
                                        msgs.error(applicationstrings[lang].uploaderr);
                                        resultline.ErrLines[0].Values.push(applicationstrings[lang].error);
                                        tms.ExportUploadErrors(resultline.ErrLines);
                                    } else {
                                        msgs.success(resultline.Message);
                                    }
                                    break;
                                case 300:
                                    tms.Redirect2Login();
                                    break;
                                case 500:
                                    msgs.error(resultline.Message);
                                    break;
                            }
                        }
                    }
                    break;
                case 500:
                    msgs.error(result);
                    break;
            }
        });

        $("#btnupload").on("click", function () {
            var uploadtype = $("#uploadtype option:selected").val();
            if (!uploadtype) {
                msgs.error(applicationstrings[lang].uploadtypenotselected);
                return false;
            }
            $(this).prop("disabled", true);
            bpTimer = setInterval(BatchProgress, 3000);
            $("#uploadutility").trigger("upload", { type: uploadtype });
        });

        $("#btndownload").on("click", function () {
            var ut = $("#uploadtype").val();
            var filename = $("#uploadtype option:selected").text();
            var html = $("#info").html();
            var columns = html.split("<br>");
            var d = [{ Values: [] }];
            for (var i = 1; i < columns.length; i++) {
                d[0].Values.push($("<p>" + columns[i] + "</p>").text());
            }
            tms.ExportUploadErrors(d, filename);
        });
    }

    function BatchProgress() {
        var uploadtype = $("#uploadtype option:selected").val();
        return tms.Ajax({
            url: "/Api/ApiBatchProgressData/GetLastRunningByType",
            data: JSON.stringify(uploadtype),
            quietly: true,
            fn: function (d) {
                if (d.data) {
                    $(".page-header").find("h6").html("<span style=\"color:#108ce2;font-size: 14px;\">" + d.data.PRG_PROGRESSDATA + " " + applicationstrings[lang].batchprogresstatus[d.data.PRG_STATUS] + "</span>");
                    isCompleted = (d.data.PRG_STATUS === "3");
                    if (isCompleted) {
                        clearInterval(bpTimer);
                        bpTimer = null;
                    }
                }
            }
        });
    }

    $(document).ready(function () {
        var deferreds = [];
        deferreds.push(ListEquipmentTypes());
        return $.when.apply($, deferreds).done(function () {
            RegisterUiEvents();
        });
    });
})();