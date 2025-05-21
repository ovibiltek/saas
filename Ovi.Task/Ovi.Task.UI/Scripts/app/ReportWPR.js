(function () {
    function RegisterUIEvents() {

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
        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF"
        });
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

        $("#customer").autocomp({
            listurl: "/Api/ApiCustomers/List",
            geturl: "/Api/ApiCustomers/Get",
            field: "CUS_CODE",
            textfield: "CUS_DESC",
            active: "CUS_ACTIVE",
            filter: [
                { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
            ]
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

        $("#branch").autocomp({
            listurl: "/Api/ApiBranches/ListUserOrganizations",
            geturl: "/Api/ApiBranches/Get",
            field: "BRN_CODE",
            textfield: "BRN_DESC",
            active: "BRN_ACTIVE",
            filter: [
                { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
            ]
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

        $("#tasktype").autocomp({
            listurl: "/Api/ApiSystemCodes/List",
            geturl: "/Api/ApiSystemCodes/Get",
            field: "SYC_CODE",
            textfield: "SYC_DESCF",
            active: "SYC_ACTIVE",
            filter: [
                { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
            ]
        });
        $("#btntasktype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#tasktype",
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                    { field: "SYC_GROUP", value: "TASKTYPE", operator: "eq" }
                ]
            });
        });
    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())