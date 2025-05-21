(function () {
    var scr;
    var selectedrecord = null;
    var grdTaskRatings = null;
    var grdelm = $("#grdTaskRatings");

    var GetFilter = function () {
        var gridfilter = [];

        if (inbox) {
            gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
        }

        var datecreatedstart = $("#datecreated_start").val().toDate();
        var datecreatedend = $("#datecreated_end").val().toDate();
        if (datecreatedstart && datecreatedend)
            gridfilter.push({ field: "RTN_AUDCREATED", value: datecreatedstart, value2: datecreatedend, operator: "between", logic: "and" });

        var datecompletedstart = $("#date_completed_start").val().toDate();
        var datecompletedend = $("#date_completed_end").val().toDate();
        if (datecreatedstart && datecreatedend)
            gridfilter.push({ field: "RTN_TSKCOMPLETED", value: datecompletedstart, value2: datecompletedend, operator: "between", logic: "and" });
        return gridfilter;
    };
    function ResetSidebarFilter() {
        $("#listfilterquoid").val("");
        $("#listfiltereqid").val("");
        $("#listfiltertaskid").val("");
    };
    function RunSidebarFilter() {
        var gridfilter = GetFilter();
        grdTaskRatings.RunFilter(gridfilter);
        $(".sidebar.right").trigger("sidebar:close");
    };

    function itemSelect(row) {
        selectedrecord = grdTaskRatings.GetRowDataItem(row);
        $("[data-id]").removeClass("k-state-selected");
        row.addClass("k-state-selected");
        $(".page-header h6").html(selectedrecord.RTN_TSKID + " - " + selectedrecord.RTN_TSKSHORTDESC);
    }
    //Griddeki tüm rowları tek tek gezerek review içeriğinin olup olmadığın kontrol ediyor.
    function checkReviews() {
        let childs = $("tbody").children();
        $.each(childs, function (k, v) {
            let row = grdTaskRatings.GetRowDataItem(v);
            if (row.RTN_REVIEW != null && row.RTN_REVIEW != "") {
                v.style.backgroundColor = "#77DD77"
            }
        });
    }

    function gridDataBound() {
        var data = grdTaskRatings.GetData();
        grdelm.find("#search").off("click").on("click", function () { $(".sidebar.right").trigger("sidebar:open"); });

        grdelm.find("[data-id]").unbind("click").click(function () {
            itemSelect($(this));
        });

        checkReviews();

        grdelm.contextMenu({
            selector: "tr[data-id]",
            items: {
                newsupervision: {
                    name: applicationstrings[lang].newsupervision,
                    icon: function (opt, $itemElement, itemKey, item) {
                        $itemElement.html(
                            '<span><i class="fa fa-plus-square" aria-hidden="true"></i> ' +
                            item.name +
                            "</span>");
                        return "context-menu-icon-updated";
                    },
                    disabled: function (key, opt) {
                        return selectedrecord == null;
                    },
                    callback: function () {
                        var win = window.open("/Supervision/NewByTaskRating/" + selectedrecord.RTN_TSKID, "_blank");
                    }
                },
                review: {
                    name: applicationstrings[lang].review,
                    disabled: function (key, opt) {
                        if (selectedrecord == null)
                            return true

                        if (selectedrecord.RTN_REVIEW != null && selectedrecord.RTN_REVIEW != "")
                            return true
                        return false;
                    },
                    callback: function () {
                        $("#readingModal").modal("toggle");
                        
                        $("#btnSaveReview").unbind('click').click(function () {
                            var rev_obj = {
                                Review: {
                                    TRR_TSKID: selectedrecord.RTN_TSKID,
                                    TRR_REVIEW: $("#reviewComment").val(),
                                    TRR_CREATED: tms.Now(),
                                    TRR_CREATEDBY: user,
                                    TRR_SENDMAIL: $("#sendreviewmail").prop("checked") ? "+" : "-"
                                },
                                RatedBy: selectedrecord.RTN_AUDCREATEDBY,
                                Branch: selectedrecord.RTN_TSKBRANCH
                              
                            };
                            console.log(rev_obj);
                            tms.Ajax({
                                url: "/Api/ApiTask/SaveReview",
                                data: JSON.stringify(rev_obj),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    grdTaskRatings.Refresh();
                                }
                            });
                        });
                    }
                }
            }
        });
    }

    function loadTaskRatings() {
        var gridfilter = GetFilter();

        grdTaskRatings = new Grid({
            keyfield: "RTN_TSKID",
            columns: [
                {
                    type: "number",
                    field: "RTN_TSKID",
                    title: gridstrings.taskratings[lang].taskid,
                    width: 200
                },
                {
                    type: "string",
                    field: "RTN_TSKSHORTDESC",
                    title: gridstrings.taskratings[lang].taskdesc,
                    width: 350
                },
                {
                    type: "string",
                    field: "RTN_TSKCATEGORY",
                    title: gridstrings.taskratings[lang].category,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKCATEGORYDESC",
                    title: gridstrings.taskratings[lang].categorydesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKCUSTOMER",
                    title: gridstrings.taskratings[lang].customer,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKCUSTOMERDESC",
                    title: gridstrings.taskratings[lang].customerdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKBRANCH",
                    title: gridstrings.taskratings[lang].branch,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKBRANCHDESC",
                    title: gridstrings.taskratings[lang].branchdesc,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKREGION",
                    title: gridstrings.taskratings[lang].region,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_AUDITED",
                    title: gridstrings.taskratings[lang].audited,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "RTN_TSKCOMPLETED",
                    title: gridstrings.taskratings[lang].datecompleted,
                    width: 250
                },
                {
                    type: "number",
                    field: "RTN_TSKRATING",
                    title: gridstrings.taskratings[lang].rating,
                    width: 250
                },
                {
                    type: "string",
                    field: "RTN_TSKRATINGCOMMENTS",
                    title: gridstrings.taskratings[lang].ratingcomments,
                    width: 450
                },
                {
                    type: "string",
                    field: "RTN_REVIEW",
                    title: gridstrings.taskratings[lang].review,
                    width: 450
                },
                {
                    type: "string",
                    field: "RTN_AUDCREATEDBY",
                    title: gridstrings.taskratings[lang].ratedby,
                    width: 250
                },
                {
                    type: "datetime",
                    field: "RTN_AUDCREATED",
                    title: gridstrings.taskratings[lang].daterated,
                    width: 250
                }
            ],
            fields:
            {
                RTN_TSKID: { type: "number" },
                RTN_AUDCREATED: { type: "datetime" },
                RTN_TSKCOMPLETED: { type: "datetime" },
                RTN_TSKRATING: { type: "number" }
            },
            datasource: "/Api/ApiTask/ListRatingView",
            selector: "#grdTaskRatings",
            name: "grdTaskRatings",
            height: constants.defaultgridheight,
            primarycodefield: "RTN_TSKID",
            primarytextfield: "RTN_TSKSHORTDESC",
            visibleitemcount: 10,
            filter: gridfilter,
            filterlogic: "or",
            hasfiltermenu: true,
            sort: [{ field: "RTN_TSKID", dir: "desc" }],
            toolbarColumnMenu: true,
            toolbar: {
                right: [
                    "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].filter #\" class=\"btn btn-default btn-sm\" id=\"search\"><i class=\"fa fa-search\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].download #\" download=\"TaskRatings.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                    "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                ]
            },
            databound: gridDataBound
        });
    }

    function RegisterTabEvents() {
        $("#filter").click(function () {
            RunSidebarFilter();
        });
        $("#clearfilter").click(function () {
            ResetSidebarFilter();
            RunSidebarFilter();
        });
        $(".sidebar.right").sidebar({ side: "right" });
        $("#closesiderbar").on("click", function () { $(".sidebar.right").trigger("sidebar:close"); });
    };

    function ready() {
        RegisterTabEvents();
        loadTaskRatings();
    }

    $(document).ready(ready);
}());