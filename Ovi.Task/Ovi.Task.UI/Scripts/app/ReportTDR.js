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

       

        $("#btntype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.type[lang].title,
                listurl: "/Api/ApiTypes/List",
                keyfield: "TYP_CODE",
                codefield: "TYP_CODE",
                textfield: "TYP_DESCF",
                returninput: "#type",
                multiselect: true,
                columns: [
                    { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                    { type: "string", field: "TYP_DESCF", title: gridstrings.type[lang].description, width: 400 }
                ],
                filter: [
                    { field: "TYP_ENTITY", value: 'TASK', operator: "eq" }
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

        $("#btnregion").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customer[lang].title,
                listurl: "/Api/ApiRegions/List",
                keyfield: "REG_CODE",
                codefield: "REG_CODE",
                textfield: "REG_DESC",
                returninput: "#region",
                columns: [
                    { type: "string", field: "REG_CODE", title: gridstrings.customer[lang].code, width: 100 },
                    { type: "string", field: "REG_DESC", title: gridstrings.customer[lang].description, width: 300 },
                ],
                
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
                returninput: "#department",
                
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

        $("#btncategory").click(function () {
            gridModal.show({
                modaltitle: gridstrings.category[lang].title,
                listurl: "/Api/ApiCategories/List",
                keyfield: "CAT_CODE",
                codefield: "CAT_CODE",
                textfield: "CAT_DESCF",
                returninput: "#category",
                multiselect: true,
                columns: [
                    { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                    { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                ]
            });
        });

        $("#btntasktype").click(function () {
            gridModal.show({
                modaltitle: gridstrings.systemcodes[lang].title,
                listurl: "/Api/ApiSystemCodes/List",
                keyfield: "SYC_CODE",
                codefield: "SYC_CODE",
                textfield: "SYC_DESCF",
                returninput: "#tasktype",
                multiselect: true,
                columns: [
                    { type: "string", field: "SYC_CODE", title: gridstrings.systemcodes[lang].code, width: 100 },
                    { type: "string", field: "SYC_DESCF", title: gridstrings.systemcodes[lang].desc, width: 400 }
                ],
                filter: [
                    { field: "SYC_GROUP", value: "TASKTYPE", operator:"eq", }
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
                ],
                filter: [
                    { field: "BRN_ORG", value: [$("#org").val(), "*"], operator: "in" },
                    { field: "BRN_CUSTOMER", value: $("#customer").val(), operator: "eq" }
                ]
            });
        });

        $("#btnprovince").click(function () {
            gridModal.show({
                modaltitle: gridstrings.addresssection[lang].title,
                listurl: "/Api/ApiAddressSections/List",
                keyfield: "ADS_CODE",
                codefield: "ADS_CODE",
                textfield: "ADS_DESC",
                returninput: "#province",
                columns: [
                    { type: "string", field: "ADS_CODE", title: gridstrings.addresssection[lang].code, width: 100 },
                    {
                        type: "string",
                        field: "ADS_DESC",
                        title: gridstrings.addresssection[lang].description,
                        width: 300
                    }
                ],
                filter: [
                    { field: "ADS_ACTIVE", value: "+", operator: "eq" },
                    { field: "ADS_TYPE", value: "IL", operator: "eq" }
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
                    { field: "SUP_ACTIVE", value: "+", operator: "eq" }
                ]
            });
        });

        $("#btnstatus").click(function () {
            gridModal.show({
                modaltitle: gridstrings.status[lang].title,
                listurl: "/Api/ApiStatuses/List",
                keyfield: "STA_CODE",
                codefield: "STA_CODE",
                textfield: "STA_DESC",
                returninput: "#status",
                multiselect: true,
                columns: [
                    { type: "string", field: "STA_CODE", title: gridstrings.status[lang].status, width: 100 },
                    { type: "string", field: "STA_DESCF", title: gridstrings.status[lang].description, width: 400 }
                ],
                filter: [
                    { field: "STA_ENTITY", value: "TASK", operator: "eq" }
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

        $("#region").autocomp({
            listurl: "/Api/ApiRegions/List",
            geturl: "/Api/ApiRegions/Get",
            field: "REG_CODE",
            textfield: "REG_DESC"
           
        });

        $("#customergroup").autocomp({
            listurl: "/Api/ApiCustomerGroups/List",
            geturl: "/Api/ApiCustomerGroups/Get",
            field: "CUG_CODE",
            textfield: "CUG_DESC"
        });

        $("#btnRun").click(function () {

            if (!tms.Check("#record")) {
                return false;
            }

            var completedstartdate = moment($("#TaskCompletedStart").val(), constants.longdateformat);
            var completedenddate = moment($("#TaskCompletedEnd").val(), constants.longdateformat);
            if (completedenddate < completedstartdate) {
                msgs.error(applicationstrings[lang].dateerr2);
                return false;
            }

            var startdate = moment($("#TaskCreatedStart").val(), constants.longdateformat);
            var enddate = moment($("#TaskCreatedEnd").val(), constants.longdateformat);
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