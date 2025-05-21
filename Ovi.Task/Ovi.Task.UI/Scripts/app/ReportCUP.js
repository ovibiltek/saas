(function () {
    var documentsHelper, commentsHelper;
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
        $("#btncustomergroup").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customergroups[lang].title,
                listurl: "/Api/ApiCustomerGroups/List",
                keyfield: "CUG_CODE",
                codefield: "CUG_CODE",
                textfield: "CUG_DESC",
                returninput: "#customergroup",
                columns: [
                    { type: "string", field: "CUG_CODE", title: gridstrings.customergroups[lang].code, width: 100 },
                    { type: "string", field: "CUG_DESC", title: gridstrings.customergroups[lang].description, width: 300 }
                ]
            });
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
        $("#customergroup").autocomp({
            listurl: "/Api/ApiCustomerGroups/List",
            geturl: "/Api/ApiCustomerGroups/Get",
            field: "CUG_CODE",
            textfield: "CUG_DESC"
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

        commentsHelper.showCommentsBlock({ subject: "SCREENS", source: "RPTCUP" });
        documentsHelper.showDocumentsBlock({ subject: "SCREENS", source: "RPTCUP" });

    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())