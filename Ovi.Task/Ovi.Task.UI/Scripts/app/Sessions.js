(function () {
    var grdSessions = null;
    var grdSessionsElm = $("#grdSessions");
    var selectedrecord = null;

    function fillUserInterface() {
        $("#btnLogoutUser").prop("disabled", false);

        $("#sessionid").text(selectedrecord.TMS_SESSID);
        $("#sessionuser").text(selectedrecord.TMS_SESSUSER);
        $("#browser").text(selectedrecord.TMS_BROWSER);
        $("#ip").text(selectedrecord.TMS_IP);
        $("#login").text(moment(selectedrecord.TMS_LOGIN).format(constants.longdateformat));
    }

    function resetUI() {
        selectedrecord = null;
        $("#btnLogoutUser").prop("disabled", true);

        $("#sessionid").text("");
        $("#sessionuser").text("");
        $("#browser").text("");
        $("#ip").text("");
        $("#login").text("");
    }

    function remove() {
        if (selectedrecord) {
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiSessions/DelRec",
                        data: JSON.stringify(selectedrecord.TMS_ID),
                        fn: function (d) {
                            resetUI();
                            list();
                        }
                    });
                });
        }
    }

    function loadSelected(sr) {
        return tms.Ajax({
            url: "/Api/ApiSessions/Get",
            data: JSON.stringify(sr.TMS_ID),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function itemSelect(row) {
        selectedrecord = grdSessions.GetRowDataItem(row);
        loadSelected(selectedrecord);
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function gridDataBound() {
    }

    function list() {
        grdSessions = new Grid({
            keyfield: "TMS_ID",
            columns: [
                { type: "string", field: "TMS_SESSID", title: gridstrings.sessions[lang].sessid, width: 200 },
                { type: "string", field: "TMS_SESSUSER", title: gridstrings.sessions[lang].sessuser, width: 200 },
                { type: "string", field: "TMS_IP", title: gridstrings.sessions[lang].ip, width: 200 },
                { type: "string", field: "TMS_BROWSER", title: gridstrings.sessions[lang].browser, width: 200 },
                { type: "datetime", field: "TMS_LOGIN", title: gridstrings.sessions[lang].login, width: 200 },
                { type: "number", field: "TMS_SESSPRODUCTID", title: gridstrings.sessions[lang].productid, width: 200 }
            ],
            fields: {
                TMS_LOGIN: { type: "date" }
            },
            datasource: "/Api/ApiSessions/List",
            selector: "#grdSessions",
            name: "grdSessions",
            height: 370,
            primarycodefield: "TMS_ID",
            primarytextfield: "TMS_SESSID",
            filter: null,
            sort: [{ field: "TMS_ID", dir: "desc" }],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Sessions.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound,
            change: gridChange
        });
    }

    function ready() {
        list();
        $("#btnLogoutUser").click(remove);
    }

    $(document).ready(ready);
}());