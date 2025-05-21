(function () {
    var grdSupplierTaskTypes = null;
    var grdelm = $("#grdSupplierTaskTypes");

    function itemSelect(row) {
        var selectedrecord = grdSupplierTaskTypes.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
    }

    function gridDataBound() {
        grdelm.find("[data-id]").unbind("click").click(function () {
            itemSelect($(this));
        });
    }

    function loadSupplierTaskTypes() {
        var gridfilter = [];

        grdSupplierTaskTypes = new Grid({
            columns: [
                {
                    type: "string",
                    field: "STT_SUPACTIVE",
                    title: gridstrings.suppliertasktypes[lang].supactive,
                    width: 150
                },
                {
                    type: "string",
                    field: "STT_SUPTYPE",
                    title: gridstrings.suppliertasktypes[lang].suptype,
                    width: 130
                },
                {
                    type: "datetime",
                    field: "STT_SUPCREATED",
                    title: gridstrings.suppliertasktypes[lang].supcreated,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPCODE",
                    title: gridstrings.suppliertasktypes[lang].supcode,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPDESC",
                    title: gridstrings.suppliertasktypes[lang].supdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "STT_SUPAUTHORIZEDPERSON",
                    title: gridstrings.suppliertasktypes[lang].supauthorizedperson,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_ILCE",
                    title: gridstrings.suppliertasktypes[lang].ilce,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_IL",
                    title: gridstrings.suppliertasktypes[lang].il,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPPHONE",
                    title: gridstrings.suppliertasktypes[lang].supphone,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPPHONE2",
                    title: gridstrings.suppliertasktypes[lang].supphone2,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPEMAIL",
                    title: gridstrings.suppliertasktypes[lang].supemail,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "STT_SUPCONTRACTSTART",
                    title: gridstrings.suppliertasktypes[lang].supcontractstart,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "STT_SUPCONTRACTEND",
                    title: gridstrings.suppliertasktypes[lang].supcontractend,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPUPDATEDBY",
                    title: gridstrings.suppliertasktypes[lang].supupdatedby,
                    width: 250
                }, {
                    type: "datetime",
                    field: "STT_SUPUPDATED",
                    title: gridstrings.suppliertasktypes[lang].supupdated,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_ELEKTRIK",
                    title: gridstrings.suppliertasktypes[lang].elektrik,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_BACKUP",
                    title: gridstrings.suppliertasktypes[lang].backup,
                    width: 150
                },
                {
                    type: "string",
                    field: "STT_INSAIISLER",
                    title: gridstrings.suppliertasktypes[lang].insaiisler,
                    width: 150
                },
                {
                    type: "string",
                    field: "STT_JENERATOR",
                    title: gridstrings.suppliertasktypes[lang].jenerator,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_KEPENK",
                    title: gridstrings.suppliertasktypes[lang].kepenk,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_MEKANIK",
                    title: gridstrings.suppliertasktypes[lang].mekanik,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_MOBDEK",
                    title: gridstrings.suppliertasktypes[lang].mobilyadekorasyon,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_NAKLOJ",
                    title: gridstrings.suppliertasktypes[lang].nakliyelojistik,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SIHTES",
                    title: gridstrings.suppliertasktypes[lang].sihhitesisat,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_TEKDEN",
                    title: gridstrings.suppliertasktypes[lang].teknikdenetim,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_UPS",
                    title: gridstrings.suppliertasktypes[lang].ups,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_YANSIS",
                    title: gridstrings.suppliertasktypes[lang].yanginsistemleri,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_YGISOR",
                    title: gridstrings.suppliertasktypes[lang].ygisorumlulugu,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_YURMERASAN",
                    title: gridstrings.suppliertasktypes[lang].yuruyenmerdivenasansor,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_ZAYAK",
                    title: gridstrings.suppliertasktypes[lang].zayifakim,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPREGION",
                    title: gridstrings.suppliertasktypes[lang].supregion,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPTITLE",
                    title: gridstrings.suppliertasktypes[lang].suptitle,
                    width: 350
                },
                {
                    type: "string",
                    field: "STT_SUPORGANIZATION",
                    title: gridstrings.suppliertasktypes[lang].suporganization,
                    width: 350
                },
                {
                    type: "string",
                    field: "STT_SUPFAX",
                    title: gridstrings.suppliertasktypes[lang].supfax,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPOWNER",
                    title: gridstrings.suppliertasktypes[lang].supowner,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPACCOUNTCODE",
                    title: gridstrings.suppliertasktypes[lang].supaccountcode,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPPAYMENTPERIOD",
                    title: gridstrings.suppliertasktypes[lang].suppaymentperiod,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPTAXOFFICE",
                    title: gridstrings.suppliertasktypes[lang].suptaxoffice,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPTAXNO",
                    title: gridstrings.suppliertasktypes[lang].suptaxno,
                    width: 250
                },
                {
                    type: "number",
                    field: "STT_SUPCONTRACTRENEWALPERIOD",
                    title: gridstrings.suppliertasktypes[lang].supcontractrenewalperiod,
                    width: 250
                },
                {
                    type: "string",
                    field: "STT_SUPCREATEDBY",
                    title: gridstrings.suppliertasktypes[lang].supcreatedby,
                    width: 250
                }
            ],
            fields:
            {
                STT_SUPCONTRACTSTART: { type: "date" },
                STT_SUPCONTRACTEND: { type: "date" },
                STT_SUPCONTRACTRENEWALPERIOD: { type: "number" },
                STT_SUPCREATED: { type: "date" },
                STT_SUPUPDATED: { type: "date" }
            },
            datasource: "/Api/ApiSuppliers/ListSupplierTaskTypes",
            selector: "#grdSupplierTaskTypes",
            name: "grdSupplierTaskTypes",
            height: constants.defaultgridheight,
            visibleitemcount: 10,
            filter: gridfilter,
            filterlogic: "or",
            hasfiltermenu: true,
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"SupplierTaskTypes.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound
        });
    }

    function ready() {
        loadSupplierTaskTypes();
    }

    $(document).ready(ready);
}());