(function () {

    $("#taskrating").rating("refresh", {
        showClear: false,
        showCaption: false,
        clearCaption: "",
        size: "xl"
    });


    $("#saverating").on("click", function () {
        var path = tms.Path();
        var taskId = path.Param2;
        var rating = parseFloat($("#taskrating").val());
        if (rating === 0) {
            msgs.error(applicationstrings[lang].erremptyrating);
            return $.Deferred().reject();
        }

        var task = JSON.stringify({
            Id: taskId
        });

        return $.when(tms.Ajax({ url: "/Api/ApiRateTask/Get", data: task })).done(function (d) {
            var task = d.data;
            var ratingcomments = $("#ratingcomments").val();
            if (rating) {
                task.TSK_RATING = rating;
                task.TSK_RATINGCOMMENTS = ratingcomments;
                return $.when(tms.Ajax({ url: "/Api/ApiRateTask/SaveRating", data: JSON.stringify(task) })).done(function (ds) {
                    msgs.success(ds.data);
                    $("#saverating,#ratingcomments").prop("disabled", true);
                    $("#taskrating").rating("refresh",
                        {
                            displayOnly: true

                        });
                    return 0;
                });
            }
        });
    });
}());