(function () {
    var files = [];

    var RegisterUpload = function () {
        files = [];

        $("#fu").fileupload({
            maxNumberOfFiles: 50,
            autoUpload: false,
            dropZone: $("#docs"),
            change: function (e, data) {
                $("#filename").find("*").remove();
                $.each(data.files, function (k, v) {
                    $("#filename").append("<span class=\"badge badge-info\">" + v.name + "</span> ");
                });

                $("#docuprogress").text("0%");
                $("#docuprogress").css("width", "0");
            },
            add: function (e, data) {
                if (files.length == 0)
                    $("#btnremoveallfiles").prop("disabled", false);
                $.each(data.files, function (idx, file) {
                    files.push(file);
                });
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $("#docuprogress").css("width", progress + "%");
                $("#docuprogress").text(progress + "%");
            },
            drop: function (e, data) {
                $("#filename").find("*").remove();
                $.each(data.files, function (k, v) {
                    $("#filename").append("<span class=\"badge badge-info\">" + v.name + "</span> ");
                });
                $("#docuprogress").text("0%");
                $("#docuprogress").css("width", "0");
            }
        });
    };

    function SplitAddress(adr) {
        return adr ? adr.split(";") : [];
    }

    function BuildFilter() {
        var gridreq = null;
        var org = $("#org").val();
        var customer = $("#customer").val();
        var supplier = $("#supplier").val();
        var emailsource = $("#emailsource").val();

        if (emailsource === "USER") {
            gridreq = {
                sort: [{ field: "USR_CODE", dir: "asc" }],
                filter: { filters: [] },
                loadall: true
            };

            var department = $("#department").val();
            var usergroup = $("#usergroup").val();
            var trade = $("#trade").val();
            var usertype = $("#usertype").val();

            gridreq.filter.filters.push({ field: "USR_ACTIVE", value: "+", operator: "eq" });
            if (org)
                gridreq.filter.filters.push({ field: "USR_ORG", value: org, operator: "eq" });
            if (department)
                gridreq.filter.filters.push({ field: "USR_DEPARTMENT", value: department, operator: "eq" });
            if (usergroup)
                gridreq.filter.filters.push({ field: "USR_GROUP", value: usergroup, operator: "eq" });
            if (usertype)
                gridreq.filter.filters.push({ field: "USR_TYPE", value: usertype, operator: "eq" });
            if (trade)
                gridreq.filter.filters.push({ field: "USR_TRADE", value: trade, operator: "eq" });
            if (customer)
                gridreq.filter.filters.push({ field:"USERCUSTOMER",value:customer, operator: "func", logic: "and" });
            if (supplier)
                gridreq.filter.filters.push({ field: "USERSUPPLIER", value: supplier, operator: "func", logic: "and" });

            return gridreq;
        } else {
            gridreq = {
                sort: [{ field: "MAIL_CODE", dir: "asc" }],
                filter: { filters: [] },
                loadall: true
            };

            var customertype = $("#customertype").val();
            var suppliertype = $("#suppliertype").val();

            gridreq.filter.filters.push({ field: "MAIL_GROUP", value: emailsource, operator: "eq" });
            if (org)
                gridreq.filter.filters.push({ field: "MAIL_ORG", value: org, operator: "eq" });

            if (customer) {
                gridreq.filter.filters.push({ field: "MAIL_CODE", value: customer, operator: "eq" });
            }

            if (customertype) {
                gridreq.filter.filters.push({ field: "MAIL_TYPEENTITY", value: "CUSTOMER", operator: "eq" });
                gridreq.filter.filters.push({ field: "MAIL_TYPE", value: customertype, operator: "eq" });
            }

            if (supplier) {
                gridreq.filter.filters.push({ field: "MAIL_CODE", value: supplier, operator: "eq" });
            }

            if (suppliertype) {
                gridreq.filter.filters.push({ field: "MAIL_TYPEENTITY", value: "SUPPLIER", operator: "eq" });
                gridreq.filter.filters.push({ field: "MAIL_TYPE", value: suppliertype, operator: "eq" });
            }

            return gridreq;
        }
    }

    function Import(field) {
        var gridreq = null;

        if (!tms.Check("#mailparams")) {
            return $.Deferred().reject();
        }

        var emailsource = $("#emailsource").val();
        if (emailsource === "USER") {
            gridreq = BuildFilter();
            return tms.Ajax({
                url: "/Api/ApiUsers/List",
                data: JSON.stringify(gridreq),
                fn: function(d) {
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        var addr = SplitAddress(di.USR_EMAIL);
                        for (var j = 0; j < addr.length; j++) {
                            $(field).tagsinput("add", { id: addr[j].trim(), text: addr[j].trim() }, ["ignore"]);
                        }
                    }
                }
            });
        } else {
            gridreq = BuildFilter();
            return tms.Ajax({
                url: "/Api/ApiMails/ListSysEMails",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        var addr = SplitAddress(di.MAIL_ADDRESS);
                        for (var j = 0; j < addr.length; j++) {
                            $(field).tagsinput("add", { id: addr[j].trim(), text: addr[j].trim() }, ["ignore"]);
                        }
                    }
                }
            });
        }
    }

    function BuildModals() {
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
        $("#btnusertype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.usertype[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESC",
                returninput: "#usertype",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.usertype[lang].code, width: 100 },
                    { type: "string", field: "TYP_DESC", title: gridstrings.usertype[lang].description, width: 300 }
                ],
                filter: [
                    { field: "TYP_ENTITY", value: "USER", operator: "eq" },
                    { field: "TYP_ACTIVE", value: "+", operator: "eq" }
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
                    { field: "TRD_DEPARTMENT", value: [$("#dep").val(), "*"], operator: "in" }
                ]
            });
        });
        $("#btncustomer").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customer[lang].title,
                listurl: "/Api/ApiCustomers/List",
                keyfield: "CUS_CODE",
                codefield: "CUS_CODE",
                textfield: "CUS_DESC",
                returninput: "#customer",
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
        $("#btnsupplier").click(function () {
            gridModal.show({
                modaltitle: gridstrings.suppliers[lang].title,
                listurl: "/Api/ApiSuppliers/List",
                keyfield: "SUP_CODE",
                codefield: "SUP_CODE",
                textfield: "SUP_DESC",
                returninput: "#supplier",
                columns: [
                    { type: "string", field: "SUP_CODE", title: gridstrings.suppliers[lang].code, width: 100 },
                    { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SUP_ACTIVE", value: "+", operator: "eq" },
                    { field: "SUP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                ]
            });
        });
        $("#btnformat").click(function () {
            gridModal.show({
                modaltitle: gridstrings.mailtemplates[lang].title,
                listurl: "/Api/ApiMailTemplates/List",
                keyfield: "TMP_ID",
                codefield: "TMP_TMPID",
                textfield: "TMP_DESCRIPTION",
                returninput: "#format",
                columns: [
                    { type: "number", field: "TMP_TMPID", title: gridstrings.mailtemplates[lang].id, width: 100 },
                    { type: "string", field: "TMP_DESCRIPTION", title: gridstrings.mailtemplates[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TMP_TMPID", value: "10000", operator: "gt" }
                ]
            });
        });
        select({
            ctrl: "#customertype",
            url: "/api/ApiTypes/List",
            keyfield: "TYP_CODE",
            textfield: "TYP_DESC",
            data: JSON.stringify({
                filter: {
                    filters: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "CUSTOMER", operator: "eq" }
                    ]
                }
            })
        }).Fill();
        select({
            ctrl: "#suppliertype",
            url: "/api/ApiTypes/List",
            keyfield: "TYP_CODE",
            textfield: "TYP_DESC",
            data: JSON.stringify({
                filter: {
                    filters: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "SUPPLIER", operator: "eq" }
                    ]
                }
            })
        }).Fill();
    }

    function AutoComplete() {
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
        $("#usergroup").autocomp({
            listurl: "/Api/ApiUserGroups/List",
            geturl: "/Api/ApiUserGroups/Get",
            field: "UGR_CODE",
            textfield: "UGR_DESC",
            active: "UGR_ACTIVE",
            filter: [{ field: "UGR_CODE", value: "*", operator: "neq" }]
        });
        $("#usertype").autocomp({
            listurl: "/Api/ApiTypes/List",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            active: "TYP_ACTIVE",
            filter: [
                { field: "TYP_ENTITY", value: "USER", includeall: true },
            ]
        });
        $("#trade").autocomp({
            listurl: "/Api/ApiTrades/List",
            geturl: "/Api/ApiTrades/Get",
            field: "TRD_CODE",
            textfield: "TRD_DESC",
            active: "TRD_ACTIVE",
            filter: [
                { field: "TRD_ORGANIZATION", relfield: "#org", includeall: true },
                { field: "TRD_DEPARTMENT", relfield: "#dep", includeall: true }
            ]
        });
        $("#customer").autocomp({
            listurl: "/Api/ApiCustomers/List",
            geturl: "/Api/ApiCustomers/Get",
            field: "CUS_CODE",
            textfield: "CUS_DESC",
            active: "CUS_ACTIVE",
            filter: [
                { field: "CUS_ORG", relfield: "#org", includeall: true }
            ]
        });
        $("#supplier").autocomp({
            listurl: "/Api/ApiSuppliers/List",
            geturl: "/Api/ApiSuppliers/Get",
            field: "SUP_CODE",
            textfield: "SUP_DESC",
            active: "SUP_ACTIVE",
            filter: [
                { field: "SUP_ORGANIZATION", relfield: "#org", includeall: true }
            ]
        });
        $("#addto").autocomp({
            listurl: "/Api/ApiUsers/List",
            geturl: "/Api/ApiUsers/Get",
            field: "USR_CODE",
            textfield: "USR_DESC",
            active: "USR_ACTIVE",
            filter: [
                { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
            ],
            callback: function (d) {
                if (d)
                    $("#addto").val(d.USR_EMAIL);
            }
        });
        $("#addcc").autocomp({
            listurl: "/Api/ApiUsers/List",
            geturl: "/Api/ApiUsers/Get",
            field: "USR_CODE",
            textfield: "USR_DESC",
            active: "USR_ACTIVE",
            filter: [
                { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
            ],
            callback: function (d) {
                if (d)
                    $("#addcc").val(d.USR_EMAIL);
            }
        });
    }

    function SendEMail() {
        var subject = $("#subject").val();
        var content = _.escape($("#content").summernote("code"));
        var to = $("#to").val();
        var cc = $("#cc").val();
        var format = ($("#format").val() || "X");
        var singlemail = $("#singlemail").is(":checked") ? "+" : "-";

        if (!subject) {
            msgs.error(applicationstrings[lang].subjectisempty);
            return $.Deferred().reject();
        }
        if (!content) {
            msgs.error(applicationstrings[lang].contentisempty);
            return $.Deferred().reject();
        }
        if (!to) {
            msgs.error(applicationstrings[lang].toisempty);
            return $.Deferred().reject();
        }

        var formData = {
            Subject: subject,
            Content: content,
            To: to,
            Cc: cc,
            Format: format,
            SingleMail: singlemail
        };

        if (files.length > 0) {
            $("#fu").fileupload("send", { files: files, formData: formData }).success(function(d1) {
                switch (d1.status) {
                case 200:
                    msgs.success(d1.data);
                    $("#filename").find("*").remove();
                    $("#docuprogress").text("0%");
                    $("#docuprogress").css("width", "0");

                    files = [];
                    break;
                case 300:
                    tms.Redirect2Login();
                    break;
                case 500:
                    msgs.error(d1.data);
                    break;
                }
            }).error(function(xhr) {
                if (xhr.status)
                    msgs.error(xhr.statusText);
            });
        } else {
            return tms.Ajax({
                url: "/Api/ApiMails/QuickMail",
                data: JSON.stringify(formData),
                fn: function(d) {
                    msgs.success(d.data);
                }
            });
        }
    }

    function RegisterUIEvents() {
        BuildModals();
        AutoComplete();
        RegisterUpload();

        $("#emailsource").on("change", function() {
            var $this = $(this);
            $("#customertype").val("");
            $("#suppliertype").val("");
            switch ($this.val()) {
                case "USER":
                    $("div.customer-filter, div.supplier-filter").addClass("hidden");
                    $("div.user-filter").removeClass("hidden");
                break;
                case "CUSTOMER":
                    $("div.user-filter,div.supplier-filter").addClass("hidden");
                    $("div.customer-filter").removeClass("hidden");
                    break;
                case "SUPPLIER":
                    $("div.user-filter,div.customer-filter").addClass("hidden");
                    $("div.supplier-filter").removeClass("hidden");
                    break;
                case "BRANCH":
                    $("div.user-filter,div.supplier-filter").addClass("hidden");
                    $("div.customer-filter").removeClass("hidden");
                    break;
                default:
                    $("div.user-filter,div.customer-filter, div.supplier-filter").addClass("hidden");
                    break;
            }
        });

        $("#to").on("itemAdded", function () {
            $("#tocnt").text("(" + $("#to").tagsinput("items").length + " " + applicationstrings[lang].record + ")");
            $("#clipboard").val($("#to").val());
        }).on("itemRemoved", function () {
            var itemcount = $("#to").tagsinput("items").length;
            $("#tocnt").text(itemcount !== 0 ? "(" + itemcount + " " + applicationstrings[lang].record + ")" : "");
            $("#clipboard").val($("#to").val());
        });
        $("#cc").on("itemAdded", function () {
            $("#cccnt").text("(" + $("#cc").tagsinput("items").length + " " + applicationstrings[lang].record + ")");
            $("#clipboard").val($("#cc").val());
        }).on("itemRemoved", function () {
            var itemcount = $("#cc").tagsinput("items").length;
            $("#cccnt").text(itemcount !== 0 ? "(" + itemcount + " " + applicationstrings[lang].record + ")" : "");
            $("#clipboard").val($("#cc").val());
        });
        $("#btnImportTo").on("click", function() {
            Import("#to");
        });
        $("#btnImportCc").on("click", function() {
            Import("#cc");
        });

        $("#btnRemoveAllTo").on("click", function() {
            $("#to").tagsinput("removeAll");
            $("#tocnt").text("");
        });
        $("#btnAddTo").on("click", function () {
            var addto = $("#addto").val();
            if (!addto.validateAsAnEMail()) {
                msgs.error(applicationstrings[lang].invalidemail);
                return false;
            }
            $("#to").tagsinput("add", { id: addto, text: addto }, ["ignore"]);
            $("#addto").val("");
            tooltip.hide("#addto");
        });
        $("#btnRemoveAllCc").on("click", function() {
            $("#cc").tagsinput("removeAll");
            $("#cccnt").text("");
        });
        $("#btnAddCc").on("click", function () {
            var addcc = $("#addcc").val();
            if (!addcc.validateAsAnEMail()) {
                msgs.error(applicationstrings[lang].invalidemail);
                return false;
            }
            $("#cc").tagsinput("add", { id: addcc, text: addcc }, ["ignore"]);
            $("#addcc").val("");
            tooltip.hide("#addcc");
        });
        $("#btnremoveallfiles").on("click", function() {
            files = [];
            $("#btnremoveallfiles").prop("disabled", true);
            $("#filename").find("*").remove();
        });

        $("#btnSend").on("click", SendEMail);
    }

    function contextMenu() {
        $.contextMenu({
            selector: "div.bootstrap-tagsinput",
            build: function ($trigger, e) {
                var elementid = e.target.nextElementSibling.id;
                return {
                    zIndex: 10,
                    items: {
                        copytoclipboard: {
                            name: applicationstrings[lang].copytoclipboard,
                            disabled: function (key, opt) {
                                return !$("#" + elementid).val();
                            },
                            icon: function (opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span><i class="fa fa-usd" aria-hidden="true"></i> ' + item.name + "</span>");
                                return "context-menu-icon-updated";
                            },
                            visible: function (key, opt) {
                                return !customer;
                            },
                            callback: function () {
                                $("#clipboard").val($("#clipboard").val().replace(/,/g, ";"));
                                document.querySelector("#clipboard").select();
                                document.execCommand("copy");
                            }
                        }
                    }
                };
            }
        });
    }

    function ready() {
        RegisterUIEvents();
        $("div.bootstrap-tagsinput").css({
            "height": "151px",
            "overflow": "auto"
        });
        $("#content").summernote({
            lang: culture,
            height:300,
            toolbar: [
                ["style", ["style"]],
                ["font", ["bold", "italic", "underline", "clear"]],
                ["fontname", ["fontname"]],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]],
                ["view", ["fullscreen"]]

            ]
        });
        $("div.user-filter,div.customer-filter, div.supplier-filter").addClass("hidden");
        contextMenu();
    }

    $(document).ready(ready);
}());