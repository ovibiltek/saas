(function () {
    var grdNotifications = null;
    var grdNotificationsElm = $("#grdNotifications");

    function itemSelect(row) {
    }

    function gridChange(e) {
        itemSelect(e.sender.select());
    }

    function gridDataBound() {
    }

    function list() {
        grdNotifications = new Grid({
            keyfield: "NOT_ID",
            columns: [
                { type: "string", field: "NOT_TYPE", title: gridstrings.notifications[lang].type, width: 50 },
                { type: "string", field: "NOT_DESC", title: gridstrings.notifications[lang].desc, width: 250 },
                { type: "string", field: "NOT_SUBJECT", title: gridstrings.notifications[lang].subject, width: 100 },
                { type: "string", field: "NOT_SOURCE", title: gridstrings.notifications[lang].source, width: 100 },
                {
                    type: "datetime",
                    field: "NOT_CREATED",
                    title: gridstrings.notifications[lang].created,
                    width: 100
                },
                { type: "string", field: "NOT_CREATEDBY", title: gridstrings.notifications[lang].createdby, width: 100 }
            ],
            datasource: "/Api/ApiNotification/List",
            selector: "#grdNotifications",
            name: "grdNotifications",
            height: constants.defaultgridheight,
            primarycodefield: "NOT_ID",
            primarytextfield: "NOT_TYPE",
            filter: [{ field: "NOT_OWNER", value: user, operator: "eq", logic: "and" }],
            sort: [{ field: "NOT_ID", dir: "desc" }],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"Notifications.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
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