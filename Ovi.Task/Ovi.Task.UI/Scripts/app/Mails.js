(function () {
    var grdMails = null;
    var grdMailsElm = $("#grdMails");

    function gridDataBound(e) {
        $("[data-action=\"BROWSE\"]").off("click").on("click",
            function () {
                return tms.Ajax({
                    url: "/Api/ApiMails/Build",
                    data: JSON.stringify($(this).attr("data-id")),
                    fn: function (d) {
                        var modal = $("#modalmail").modal();
                        if (d.data) {
                            $("#modaltitle").text(d.data.TMP_DESCRIPTION);
                            var wrapped = $("<div>" + d.data.TMP_HTML + "</div>");
                            wrapped.find("p:last").remove();
                            modal.find(".modal-body").html("").append(wrapped.html());
                        }
                    }
                });
            });
    }

    function gridChange(e) {
    }

    function list() {
        var gridfilter = [];
        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }
        grdMails = new Grid({
            keyfield: "MA_ID",
            columns: [
                {
                    type: "na",
                    title: gridstrings.mails[lang].browse,
                    width: 100,
                    template:
                    "<button class=\"btn btn-info btn-xs\" data-action=\"BROWSE\" data-id=\"#= MA_ID #\"><i class=\"fa fa-envelope-o\"></i> #=gridstrings.mails[lang].browse#</button>"
                },
                { type: "number", field: "MA_ID", title: gridstrings.mails[lang].id, width: 200 },
                { type: "string", field: "MA_SUBJECT", title: gridstrings.mails[lang].subject, width: 450 },
                { type: "string", field: "MA_SENDER", title: gridstrings.mails[lang].sender, width: 150 },
                { type: "string", field: "MA_TOMAIL", title: gridstrings.mails[lang].tomail, width: 250 },
                { type: "number", field: "MA_TEMPLATEID", title: gridstrings.mails[lang].template, width: 250 },
                { type: "string", field: "MA_CC", title: gridstrings.mails[lang].cc, width: 250 },
                { type: "string", field: "MA_BCC", title: gridstrings.mails[lang].bcc, width: 250 },
                { type: "string", field: "MA_ERROR", title: gridstrings.mails[lang].error, width: 250 },
                { type: "datetime", field: "MA_CREATED", title: gridstrings.mails[lang].created, width: 150 },
                {
                    type: "na",
                    title: gridstrings.mails[lang].read,
                    width: 150,
                    template:
                    "<i class=\"# if(MA_UPDATED) {# fa fa-check #} else {# fa fa-spinner fa-spin fa-fw #} #\"></i>"
                }
            ],
            fields: {
                MA_ID: { type: "number" },
                MA_CREATED: { type: "date" },
                MA_TEMPLATEID: { type: "number" }
            },
            datasource: "/Api/ApiMails/List",
            selector: "#grdMails",
            name: "grdMails",
            height: constants.defaultgridheight,
            primarycodefield: "MA_ID",
            filter: gridfilter,
            sort: [{ field: "MA_ID", dir: "desc" }],
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"mails.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
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