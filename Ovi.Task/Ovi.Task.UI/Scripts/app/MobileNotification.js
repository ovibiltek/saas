(function () {

    var notfy;


    notfy = new function () {
        var self = this;

        var Send = function () {
            var groups = $("#groups input:checked");
            var groupList = [];

            for (var i = 0; i < groups.length; i++) {
                var p = $(groups[i]);
                groupList.push(tmsparameters.SYSTEMID + "_" + p.val());
            }

            var firebaseNotify = JSON.stringify(
                {
                    Topics: groupList,
                    Title: $("#title").val(),
                    Message: $("#message").val(),
                    Parameters: $("#parameters").val() || null,
                    User: user
                });

            return tms.Ajax({
                url: "/Api/ApiFirebaseNotification/UpdateNotificationsAsRead",
                data: firebaseNotify,
                fn: function (d) {
                    msgs.success(d.data);
                    console.log(d.result);
                }
            });
        };
        var LoadGroups = function () {
            var groups = $("#groups");
            groups.find(".checkbox").remove();

            var grdreq = {
                filter: {
                    filters: [
                        { field: "SYC_ACTIVE", value: "+", operator: "eq" },
                        { field: "SYC_GROUP", value: "TOPICS", operator: "eq" }
                    ]
                }
            };
            return tms.Ajax({
                url: "/Api/ApiSystemCodes/List",
                data: JSON.stringify(grdreq),
                fn: function (d) {
                    if (d.data) {
                        var strGroupList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strGroupList += "<div class=\"checkbox checkbox-primary\">";
                            strGroupList += "<input class=\"styled\" type=\"checkbox\" value=\"" +
                                d.data[i].SYC_CODE +
                                "\">";
                            strGroupList += "<label>";
                            strGroupList += "<strong>" + d.data[i].SYC_CODE + "</strong>" + " - " + d.data[i].SYC_DESCRIPTION;
                            strGroupList += "</label>";
                            strGroupList += "</div>";
                        }
                        groups.append(strGroupList);
                    }
                }
            });
        };
        var RegisterUiEvents = function () {
            $("#sendNotify").click(Send);
        };


        this.BuildUI = function () {
            RegisterUiEvents();
            LoadGroups();
        };
    };

    function ready() {
        notfy.BuildUI();
    }

    $(document).ready(ready);
}());