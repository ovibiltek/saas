var lu = (function () {
    var list = function () {
        return {
            USER: {
                modal: {
                    modaltitle: gridstrings.user[lang].title,
                    entity: "USER",
                    listurl: "/Api/ApiUsers/List",
                    geturl: "/Api/ApiUsers/Get",
                    keyfield: "USR_CODE",
                    codefield: "USR_CODE",
                    textfield: "USR_DESC",
                    multiselect: false,
                    columns: [
                        { type: "string", field: "USR_CODE", title: gridstrings.user[lang].user, width: 100 },
                        { type: "string", field: "USR_DESC", title: gridstrings.user[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "USR_ACTIVE", value: "+", operator: "eq" },
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_TYPE", value: ["CUSTOMER","SUPPLIER"], operator: "nin" }
                    ]
                },
                autocomp: {
                    listurl: "/Api/ApiUsers/List",
                    geturl: "/Api/ApiUsers/Get",
                    field: "USR_CODE",
                    textfield: "USR_DESC",
                    active: "USR_ACTIVE",
                    filter: [
                        { field: "USR_CODE", value: "*", operator: "neq" },
                        { field: "USR_TYPE", value: ["CUSTOMER", "SUPPLIER"], operator: "nin" }
                    ]
                },
                filterconf: {
                    TASK: {
                        autocomplete: [{ field: "USR_DEPARTMENT", relfield: "#taskdep", includeall: false }],
                        modal: [
                            { field: "USR_DEPARTMENT", value: $("#taskdep").val(), operator: "eq" }
                        ]
                    },
                    EQUIPMENT: {
                        autocomplete: [{ field: "USR_DEPARTMENT", relfield: "#department", includeall: false }],
                        modal: [
                            { field: "USR_DEPARTMENT", value: $("#department").val(), operator: "eq" }
                        ]
                    },
                    CUSTOMER: {
                        autocomplete: [],
                        modal: []
                    }
                }
            },
            TRADE: {
                modal: {
                    modaltitle: gridstrings.trades[lang].title,
                    entity: "TRADE",
                    listurl: "/Api/ApiTrades/List",
                    geturl: "/Api/ApiTrades/Get",
                    keyfield: "TRD_CODE",
                    codefield: "TRD_CODE",
                    textfield: "TRD_DESC",
                    multiselect: false,
                    columns: [
                        { type: "string", field: "TRD_CODE", title: gridstrings.trades[lang].code, width: 100 },
                        { type: "string", field: "TRD_DESC", title: gridstrings.trades[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TRD_ACTIVE", value: "+", operator: "eq" },
                        { field: "TRD_CODE", value: "*", operator: "neq" }

                    ]
                },
                autocomp: {
                    listurl: "/Api/ApiTrades/List",
                    geturl: "/Api/ApiTrades/Get",
                    field: "TRD_CODE",
                    textfield: "TRD_DESC",
                    active: "TRD_ACTIVE",
                    filter: [
                        { field: "TRD_CODE", value: "*", operator: "neq" }
                    ]
                },
                filterconf: {
                    TASK: {
                        autocomplete: [{ field: "TRD_DEPARTMENT", relfield: "#taskdep", includeall: false }],
                        modal: [
                            { field: "TRD_DEPARTMENT", value: $("#taskdep").val(), operator: "eq" }
                        ]
                    },
                    EQUIPMENT: {
                        autocomplete: [{ field: "TRD_DEPARTMENT", relfield: "#department", includeall: false }],
                        modal: [
                            { field: "TRD_DEPARTMENT", value: $("#department").val(), operator: "eq" }
                        ]
                    },
                    CUSTOMER: {
                        autocomplete: [],
                        modal: []
                    },
                    BRANCH: {
                        autocomplete: [],
                        modal: []
                    }
                }
            },
            DEPARTMENT: {
                modal: {
                    modaltitle: gridstrings.dep[lang].title,
                    entity: "DEPARTMENT",
                    listurl: "/Api/ApiDepartments/List",
                    geturl: "/Api/ApiDepartments/Get",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ]
                },
                autocomp: {
                    listurl: "/Api/ApiDepartments/List",
                    geturl: "/Api/ApiDepartments/Get",
                    field: "DEP_CODE",
                    textfield: "DEP_DESC",
                    active: "DEP_ACTIVE"
                },
                filterconf: {
                    TASK: {
                        autocomplete: [{ field: "DEP_ORG", relfield: "#org", includeall: true }],
                        modal: [
                            { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                            { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                        ]
                    },
                    EQUIPMENT: {
                        autocomplete: [{ field: "EQP_ORG", relfield: "#org", includeall: true }],
                        modal: [
                            { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                            { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                        ]
                    },
                    CUSTOMER: {
                        autocomplete: [{ field: "CUS_ORG", relfield: "#org", includeall: true }],
                        modal: [
                            { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                            { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                        ]
                    }
                }
            },
            ORGANIZATION: {
                modal: {
                    modaltitle: gridstrings.org[lang].title,
                    entity: "ORGANIZATION",
                    listurl: "/Api/ApiOrgs/List",
                    geturl: "/Api/ApiOrgs/Get",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ]
                },
                autocomp: {
                    listurl: "/Api/ApiOrgs/List",
                    geturl: "/Api/ApiOrgs/Get",
                    field: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    active: "ORG_ACTIVE"
                }
            },
            BRANCH: {
                modal: {
                    modaltitle: gridstrings.branches[lang].title,
                    entity: "BRANCH",
                    listurl: "/Api/ApiBranches/List",
                    geturl: "/Api/ApiBranches/Get",
                    keyfield: "BRN_CODE",
                    codefield: "BRN_CODE",
                    textfield: "BRN_DESC",
                    columns: [
                        { type: "string", field: "BRN_CUSTOMER", title: gridstrings.branches[lang].customer, width: 100 },
                        { type: "string", field: "BRN_CUSTOMERDESC", title: gridstrings.branches[lang].customerdesc, width: 300 },
                        { type: "string", field: "BRN_CODE", title: gridstrings.branches[lang].code, width: 100 },
                        { type: "string", field: "BRN_DESC", title: gridstrings.branches[lang].desc, width: 300 },
                        { type: "string", field: "BRN_REFERENCE", title: gridstrings.branches[lang].reference, width: 300 }
                    ],
                    filter: [
                        { field: "BRN_ACTIVE", value: "+", operator: "eq" }
                    ]
                },
                autocomp: {
                    listurl: "/Api/ApiBranches/List",
                    geturl: "/Api/ApiBranches/Get",
                    field: "BRN_CODE",
                    textfield: "BRN_DESC",
                    active: "BRN_ACTIVE"
                }
            },
            SUPPLIER: {
                modal: {
                    modaltitle: gridstrings.suppliers[lang].title,
                    entity: "SUPPLIER",
                    listurl: "/Api/ApiSuppliers/List",
                    geturl: "/Api/ApiSuppliers/Get",
                    keyfield: "SUP_CODE",
                    codefield: "SUP_CODE",
                    textfield: "SUP_DESC",
                    columns: [
                        { type: "string", field: "SUP_CODE", title: gridstrings.suppliers[lang].code, width: 200 },
                        { type: "string", field: "SUP_DESC", title: gridstrings.suppliers[lang].desc, width: 300 }
                    ],
                    filter: [
                        { field: "SUP_ACTIVE", value: "+", operator: "eq" }
                    ]
                },
                autocomp: {
                    listurl: "/Api/ApiSuppliers/List",
                    geturl: "/Api/ApiSuppliers/Get",
                    field: "SUP_CODE",
                    textfield: "SUP_DESC",
                    active: "SUP_ACTIVE"
                },
                filterconf: {
                    TASK: {
                        autocomplete: [{ field: "SUP_ORGANIZATION", relfield: "#org", includeall: true }],
                        modal: [
                            { field: "SUP_ACTIVE", value: "+", operator: "eq" },
                            { field: "SUP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                        ]
                    }
                }
            }
        };
    };
    return {
        list: list
    };
}());