(function () {
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
        $("#btnproject").click(function () {
            gridModal.show({
                modaltitle: gridstrings.project[lang].title,
                listurl: "/Api/ApiProjects/List",
                keyfield: "PRJ_ID",
                codefield: "PRJ_ID",
                textfield: "PRJ_DESC",
                returninput: "#Project",
                columns: [
                    { type: "string", field: "PRJ_ID", title: gridstrings.project[lang].project, width: 100 },
                    { type: "string", field: "PRJ_DESC", title: gridstrings.project[lang].description, width: 400 }
                ],
                filter: [
                    { field: "PRJ_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                ]
            });
        });
        $("#btntask").click(function () {
            gridModal.show({
                modaltitle: gridstrings.tasklist[lang].title,
                listurl: "/Api/ApiTask/List",
                keyfield: "TSK_ID",
                codefield: "TSK_ID",
                textfield: "TSK_SHORTDESC",
                returninput: "#Task",
                columns: [
                    { type: "number", field: "TSK_ID", title: gridstrings.tasklist[lang].taskno, width: 100 },
                    { type: "string", field: "TSK_SHORTDESC", title: gridstrings.tasklist[lang].description, width: 400 }
                ],
                fields:
                {
                    TSK_ID: { type: "number" }
                },
                filter: [
                    { field: "TSK_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
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
                returninput: "#Tasktype",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_ENTITY", value: ["TASK", "*"], operator: "in" },
                    { field: "TYP_DEPARTMENT", value: [department, "*"], operator: "in" },
                    { field: "TYP_ORGANIZATION", value: [organization, "*"], operator: "in" }
                ],
            });
        });
        $("#btnprojecttype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESC",
                returninput: "#ProjectType",
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "PROJECT", operator: "eq" },
                    { field: "TYP_ORGANIZATION", value: [organization, "*"], operator: "in" }
                ]
            });
        });
        $("#btnprojectstatus").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                codefield: "STA_CODE",
                textfield: "STA_DESCF",
                returninput: "#projectstatus",
                columns: [
                    { type: "string", field: "STA_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "STA_DESCF", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "STA_ENTITY", value: "PROJECT", operator: "eq" },
                    { field: "STA_CODE", value: "-", operator: "neq" }
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
        $("#Project").autocomp({
            listurl: "/Api/ApiProjects/List",
            geturl: "/Api/ApiProjects/Get",
            field: "PRJ_ID",
            textfield: "PRJ_DESC",
            termisnumeric: true,
            filter: [{ field: "PRJ_ORGANIZATION", relfield: "#org", includeall: true }]
        });
        $("#Task").autocomp({
            listurl: "/Api/ApiTasks/List",
            geturl: "/Api/ApiTasks/Get",
            field: "TSK_ID",
            textfield: "TSK_SHORTDESC",
            termisnumeric: true,
            filter: [{ field: "TSK_ORGANIZATION", relfield: "#org", includeall: true }]
        });
        $("#Tasktype").autocomp({
            listurl: "/Api/ApiTypes/ListByDepartment",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESCF",
            filter: [
                { field: "TYP_ENTITY", value: ["TASK", "*"], operator: "in" },
                { field: "TYP_DEPARTMENT", value: [department, "*"], operator: "in" },
                { field: "TYP_CODE", value: "*", operator: "neq" },
                { field: "TYP_ORGANIZATION", func: function () { return [organization, "*"] }, operator: "in" }
            ]
        });
        $("#ProjectType").autocomp({
            listurl: "/Api/ApiTypes/ListByDepartment",
            geturl: "/Api/ApiTypes/Get",
            field: "TYP_CODE",
            textfield: "TYP_DESC",
            filter: [
                { field: "TYP_ORGANIZATION", value: organization, includeall: true },
                { field: "TYP_DEPARTMENT", value: [department, "*"], operator: "in" },
                { field: "TYP_CODE", value: "*", operator: "neq" },
                { field: "TYP_ENTITY", value: "PROJECT", operator: "eq" }
            ]
        });
        $("#projectstatus").autocomp({
            listurl: "/Api/ApiStatuses/List",
            geturl: "/Api/ApiStatuses/Get",
            field: "STA_CODE",
            textfield: "STA_DESCF",
            filter: [
                { field: "STA_ENTITY", value: "PROJECT", operator: "eq" },
                { field: "STA_CODE", value: "-", operator: "neq" }
            ]
        });
    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())