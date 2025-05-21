(function () {
    var grdLogs = null;
    var grdLogsElm = $("#grdLogs");
    var selectedrecord = null;

    function fillUserInterface() {
        $("#bunit").text(selectedrecord.TML_BUNIT);
        $("#bfunc").text(selectedrecord.TML_BFUNC);
        $("#msg").text(selectedrecord.TML_MSG);
        $("#logdetails").text(selectedrecord.TML_DETAILS);
        $("#created").text(moment(selectedrecord.TML_CREATED).format(constants.longdateformat));
        $("#createdby").text(selectedrecord.TML_CREATEDBY);
        $(".page-header h6").html(selectedrecord.TML_ID + " - " + selectedrecord.TML_MSG.substring(0, 40));
    }

    function loadSelected(sr) {
        return tms.Ajax({
            url: "/Api/ApiLogs/Get",
            data: JSON.stringify(sr.TML_ID),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function itemSelect(row) {
        selectedrecord = grdLogs.GetRowDataItem(row);
        loadSelected(selectedrecord);
    }

    function gridDataBound(e) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function list() {
        grdLogs = new Grid({
            keyfield: "TML_ID",
            columns: [
                { type: "string", field: "TML_BUNIT", title: gridstrings.logs[lang].bunit, width: 50 },
                { type: "string", field: "TML_BFUNC", title: gridstrings.logs[lang].bfunc, width: 50 },
                { type: "string", field: "TML_MSG", title: gridstrings.logs[lang].msg, width: 200 },
                {
                    type: "datetime",
                    field: "TML_CREATED",
                    title: gridstrings.logs[lang].created,
                    width: 200
                }
            ],
            datasource: "/Api/ApiLogs/List",
            selector: "#grdLogs",
            name: "grdLogs",
            height: 370,
            primarycodefield: "TML_ID",
            primarytextfield: "TML_MGS",
            filter: null,
            sort: [{ field: "TML_ID", dir: "desc" }],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Logs.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function ready() {
        list();
    }

    $(document).ready(ready);
}());