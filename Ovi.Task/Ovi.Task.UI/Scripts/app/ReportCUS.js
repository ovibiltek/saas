(function () {
    var documentsHelper, commentsHelper;

    function RegisterUIEvents() {
        tooltip.show("#getAllInfo", applicationstrings[lang].cusgetallinfo);
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
        $("#btndepartment").click(function () {
            gridModal.show({
                modaltitle: gridstrings.dep[lang].title,
                listurl: "/Api/ApiDepartments/List",
                keyfield: "DEP_CODE",
                codefield: "DEP_CODE",
                textfield: "DEP_DESC",
                returninput: "#departments",
                multiselect: true,
                columns: [
                    { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                    { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                    { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                ],
                filter: [
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
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

        commentsHelper.showCommentsBlock({ subject: "SCREENS", source: "RPTCUS" });
        documentsHelper.showDocumentsBlock({ subject: "SCREENS", source: "RPTCUS" });

        $("#btnRun").click(function () {
            if (!tms.Check("#record")) {
                return false;
            }

            var customer = $("#customer").val();
            var customergroup = $("#customergroup").val();

            if (!customer && !customergroup) {
                msgs.error(applicationstrings[lang].customerselectionerr);
                return false;
            }

            var startdate = moment($("#TaskCompletedStart").val(), constants.longdateformat);
            var enddate = moment($("#TaskCompletedEnd").val(), constants.longdateformat);
            if (enddate < startdate) {
                msgs.error(applicationstrings[lang].dateerr2);
                return false;
            }

        });

    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())