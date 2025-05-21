(function () {
    var selectedrecord = null;

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#holidayid").val("");
        $("#description").val("");
        $("#type").val("");
        $("#date").val("");
        $("#start").val("");
        $("#end").val("");
        $("#year").val("");
        $("#allday").prop("checked", false);
        $("#start,#end").prop("disabled", false);
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMHOLIDAYS", operator: "eq" },
                { field: "AUD_REFID", value: $("#holidayid").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#holidayid").val(selectedrecord.HOL_ID);
        $("#description").val(selectedrecord.HOL_DESC);
        $("#type").val(selectedrecord.HOL_TYPE);
        $("#date").val(moment(selectedrecord.HOL_DATE).format(constants.dateformat));
        $("#start").val(selectedrecord.HOL_START
            ? moment().startOf("day").seconds(selectedrecord.HOL_START).format(constants.timeformat)
            : "");
        $("#end").val(selectedrecord.HOL_END
            ? moment().startOf("day").seconds(selectedrecord.HOL_END).format(constants.timeformat)
            : "");
        $("#allday").prop("checked", selectedrecord.HOL_ALLDAY === "+");
        $("#start,#end").prop("disabled", selectedrecord.HOL_ALLDAY === "+");
        if (selectedrecord.HOL_ALLDAY === "+")
            $("#start,#end").removeClass("required").removeAttr("required");
        else
            $("#start,#end").addClass("required").attr("required", "required");
        $("#year").val(moment(selectedrecord.HOL_DATE).year());

        $(".page-header>h6").html(selectedrecord.HOL_ID + " - " + selectedrecord.HOL_DESC);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var id = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiHolidays/Get",
            data: JSON.stringify(id),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function loadTypes() {
        var gridreq = {
            sort: [{ field: "HOT_CODE", dir: "desc" }],
            filter: { filters: [{ field: "HOT_ACTIVE", value: "+", operator: "eq" }] }
        };

        return tms.Ajax({
            url: "/Api/ApiHolidayTypes/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                $("#type option:not(.default)").remove();
                var strOptions = "";
                for (var i = 0; i < d.data.length; i++) {
                    strOptions += "<option style=\"color:" +
                        d.data[i].HOT_CODE +
                        "\" value=\"" +
                        d.data[i].HOT_CODE +
                        "\">" +
                        d.data[i].HOT_DESCF +
                        "</option>";
                }
                $("#type").append(strOptions);
                $("#type").val($("#type").data("selected"));
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var id = selectedrecord.HOL_ID;
            if (id != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiHolidays/DelRec",
                            data: JSON.stringify(id),
                            fn: function (d) {
                                msgs.success(d.data);
                                resetUI();
                                $(".list-group").list("refresh");
                            }
                        });
                    });
            }
        }
    }

    function save() {
        if (!tms.Check())
            return $.Deferred().reject();

        var start = $("#start").val() ? moment.duration($("#start").val(), constants.timeformat).asSeconds() : null;
        var end = $("#end").val() ? moment.duration($("#end").val(), constants.timeformat).asSeconds() : null;

        var o = JSON.stringify({
            HOL_ID: selectedrecord ? selectedrecord.HOL_ID : 0,
            HOL_DESC: $("#description").val(),
            HOL_TYPE: $("#type").val(),
            HOL_DATE: moment.utc($("#date").val(), constants.dateformat),
            HOL_START: start,
            HOL_END: end,
            HOL_ALLDAY: $("#allday").prop("checked") ? "+" : "-",
            HOL_CREATED: selectedrecord != null ? selectedrecord.HOL_CREATED : tms.Now(),
            HOL_CREATEDBY: selectedrecord != null ? selectedrecord.HOL_CREATEDBY : user,
            HOL_UPDATED: selectedrecord != null ? tms.Now() : null,
            HOL_UPDATEDBY: selectedrecord != null ? user : null,
            HOL_RECORDVERSION: selectedrecord != null ? selectedrecord.HOL_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiHolidays/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.HOL_ID).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);

        $("#allday").on("change",
            function () {
                var ischecked = $(this).is(":checked");
                $("#start,#end").prop("disabled", ischecked).val("");
                if (ischecked)
                    $("#start,#end").removeClass("required").removeAttr("required");
                else
                    $("#start,#end").addClass("required").attr("required", "required");
            });

        $("#date").on("dp.change",
            function () {
                $("#year").val(moment.utc($(this).val(), constants.dateformat).year());
            });
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiHolidays/List",
            fields: {
                keyfield: "HOL_ID",
                descfield: "HOL_DESC"
            },
            filterarr: ["HOL_DESC", "HOL_TYPE"],
            sort: [{ field: "HOL_ID", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        List();
        loadTypes();
        registerUiEvents();
    }

    function bindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    save();
                }
            },
            {
                k: "ctrl+r",
                e: "#btnNew",
                f: function () {
                    resetUI();
                }
            },
            {
                k: "ctrl+u",
                e: "#btnUndo",
                f: function () {
                    loadSelected();
                }
            },
            {
                k: "ctrl+d",
                e: "#btnDelete",
                f: function () {
                    remove();
                }
            },
            {
                k: "ctrl+h",
                e: "#btnHistory",
                f: function () {
                    historyModal();
                }
            }
        ]);
    }

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());