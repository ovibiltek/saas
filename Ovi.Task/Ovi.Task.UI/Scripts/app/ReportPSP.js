(function () {
    var documentsHelper;
    var commentsHelper;

    function RegisterUIEvents() {

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
                    { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 300 },
                ],
                filter: [
                    { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                ]
            });
        });

        $("#btnbranch").click(function () {
            gridModal.show({
                modaltitle: gridstrings.branches[lang].title,
                listurl: "/Api/ApiBranches/List",
                keyfield: "BRN_CODE",
                codefield: "BRN_CODE",
                textfield: "BRN_DESC",
                returninput: "#branch",
                columns: [
                    { type: "string", field: "BRN_CODE", title: gridstrings.branches[lang].code, width: 100 },
                    { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 300 },
                    { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                ],
                filter: [
                    { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                ]
            });
        });
        $("#btntasktype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/ListByDepartment",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESCF",
                returninput: "#tasktype",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_ENTITY", value: ["TASK", "*"], operator: "in" },
                    { field: "TYP_DEPARTMENT", value: [department, "*"], operator: "in" },
                    { field: "TYP_ORGANIZATION", value: [organization, "*"], operator: "in" }
                ],
                callback: function (data) {
                    $("#tasktype").data("entity", data.TYP_ENTITY);
                    tooltip.show("#tasktype", data.TYP_ENTITYDESC);
                }
            });
        });
        $("#btnpspstatus").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                codefield: "STA_CODE",
                textfield: "STA_DESCF",
                returninput: "#pspstatus",
                columns: [
                    { type: "string", field: "STA_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "STA_DESCF", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "STA_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" },
                    { field: "STA_CODE", value: "-", operator: "neq" }
                ]
            });
        });
        $("#btntaskcategory").click(function () {
            gridModal.show({
                modaltitle: gridstrings.category[lang].title,
                listurl: "/Api/ApiCategories/List",
                keyfield: "CAT_CODE",
                codefield: "CAT_CODE",
                textfield: "CAT_DESCF",
                returninput: "#taskcategory",
                multiselect: true,
                columns: [
                    { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                    { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                ]
            });
        });
        $("#btnAuthorizedUsers").click(function () {
            gridModal.show({
                modaltitle: gridstrings.user[lang].title,
                listurl: "/Api/ApiUsers/List",
                keyfield: "USR_CODE",
                codefield: "USR_CODE",
                textfield: "USR_DESC",
                returninput: "#authorized",
                multiselect: true,
                columns: [
                    { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                    { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                ],
                filter: [
                    { field: "USR_ACTIVE", value: "+", operator: "eq" }
                ],
            });
        });
        $("#btnBranchType").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/ListByDepartment",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESCF",
                returninput: "#branchtype",
                multiselect: true,
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_ENTITY", value :"BRANCH", operator: "eq" },
                    { field: "TYP_DEPARTMENT", value: [department, "*"], operator: "in" },
                    { field: "TYP_ORGANIZATION", value: [organization, "*"], operator: "in" }
                ],
            });
        });
        $("#btntsktasktype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#tsktasktype",
                multiselect: true,

                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
                ]
            });
        });
        $("#btn_shaya_ftip").click(function () {
            gridModal.show({
                modaltitle: gridstrings.lookup[lang].title,
                listurl: "/Api/ApiLookupLines/List",
                keyfield: "TML_ITEMCODE",
                codefield: "TML_ITEMCODE",
                textfield: "TML_ITEMDESC",
                returninput: "#shaya_ftip",
                multiselect: true,
                columns: [
                    { type: "string", field: "TML_ITEMCODE", title: gridstrings.lookup[lang].code, width: 100 },
                    { type: "string", field: "TML_ITEMDESC", title: gridstrings.lookup[lang].desc, width: 300 }
                ],
                filter: [
                    { field: "TML_CODE", value: "SH.FTIP", operator: "eq" },
                    { field: "TML_TYPE", value: "CUSTOMFIELD", operator: "eq" }
                ]
            });
        });
        $("#btn_shaya_hyil").click(function () {
            gridModal.show({
                modaltitle: gridstrings.lookup[lang].title,
                listurl: "/Api/ApiLookupLines/List",
                keyfield: "TML_ITEMCODE",
                codefield: "TML_ITEMCODE",
                textfield: "TML_ITEMDESC",
                returninput: "#shaya_hyil",
                multiselect: true,
                columns: [
                    { type: "string", field: "TML_ITEMCODE", title: gridstrings.lookup[lang].code, width: 100 },
                    { type: "string", field: "TML_ITEMDESC", title: gridstrings.lookup[lang].desc, width: 300 }
                ],
                filter: [
                    { field: "TML_CODE", value: "SH.HYIL", operator: "eq" },
                    { field: "TML_TYPE", value: "CUSTOMFIELD", operator: "eq" }
                ]
            });
        });
        $("#btn_shaya_hay").click(function () {
            gridModal.show({
                modaltitle: gridstrings.lookup[lang].title,
                listurl: "/Api/ApiLookupLines/List",
                keyfield: "TML_ITEMCODE",
                codefield: "TML_ITEMCODE",
                textfield: "TML_ITEMDESC",
                returninput: "#shaya_hay",
                multiselect: true,
                columns: [
                    { type: "string", field: "TML_ITEMCODE", title: gridstrings.lookup[lang].code, width: 100 },
                    { type: "string", field: "TML_ITEMDESC", title: gridstrings.lookup[lang].desc, width: 300 }
                ],
                filter: [
                    { field: "TML_CODE", value: "SH.HAY", operator: "eq" },
                    { field: "TML_TYPE", value: "CUSTOMFIELD", operator: "eq" }
                ]
            });
        });

      
        $("#format").on("change", function () {
            $("#addsecondtable").addClass("hidden");
            $("#shayaprms").addClass("hidden");
            var selected = $(this).val();
            if ($.inArray(selected, ["F3","F4","F5"]) !== -1) {
                $("#addsecondtable").removeClass("hidden");
            }
            if (selected === "F5") {
                $("#shayaprms").removeClass("hidden");
            }
        });

        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF"
        });
        $("#customer").autocomp({
            listurl: "/Api/ApiCustomers/List",
            geturl: "/Api/ApiCustomers/Get",
            field: "CUS_CODE",
            textfield: "CUS_DESC",
            filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }]
        });
        $("#branch").autocomp({
            listurl: "/Api/ApiBranches/List",
            geturl: "/Api/ApiBranches/Get",
            field: "BRN_CODE",
            textfield: "BRN_DESC",
            filter: [{ field: "BRN_CUSTOMER", relfield: "#customer", includeall: false }]
        });
        $("#tasktype").autocomp({
            listurl: "/Api/ApiTypes/ListByDepartment",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESCF",
            filter: [
                { field: "TYP_ENTITY", value: ["TASK", "*"], operator: "in" },
                { field: "TYP_DEPARTMENT", value: [department, "*"], operator: "in" },
                { field: "TYP_ORGANIZATION", func: function () { return [$("#org").val(), "*"] }, operator: "in" }
            ],
            callback: function (data) {
                $("#tasktype").data("entity", data.TYP_ENTITY);
                tooltip.show("#tasktype", data.TYP_ENTITYDESC);
            }
        });
        $("#pspstatus").autocomp({
            listurl: "/Api/ApiStatuses/List",
            geturl: "/Api/ApiStatuses/Get",
            field: "STA_CODE",
            textfield: "STA_DESCF",
            filter: [
                { field: "STA_ENTITY", value: "PROGRESSPAYMENT", operator: "eq" },
                { field: "STA_CODE", value: "-", operator: "neq" }
            ]
        });

        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentsdiv: "#docs",
            progressbar: "#docuprogress"
        });
        commentsHelper = new comments({ input: "#comment", btnaddcomment: "#addComment", commentsdiv: "#comments" });

        commentsHelper.showCommentsBlock({ subject: "SCREENS", source: "RPTPSP" });
        documentsHelper.showDocumentsBlock({ subject: "SCREENS", source: "RPTPSP" });

        $("input[name=\"Type\"]").on("change",
            function() {
                $("#onlyserviceforms").prop("checked", false);
                var selectedType = $(this).val();
                if (selectedType === "ZIP") {
                    $("#divOnlyServiceForms").removeClass("hidden");

                } else {
                    $("#divOnlyServiceForms").addClass("hidden");
                }
            });

    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())