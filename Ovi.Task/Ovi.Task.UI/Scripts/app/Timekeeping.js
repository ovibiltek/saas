(function () {
    var selectedrecord = null;
    var selectedstatus = null;
    var tkpid = null;
    var scr, tkp, dtl;
    var colorthreshold = 39600;
    var timekeepingdata = null;
    var exportsettings = {
        headers: true,
        footers: false,
        formats: ["xlsx"],
        filename: "timekeeping",
        bootstrap: false,
        exportButtons: false,
        position: "top",
        ignoreRows: null,
        ignoreCols: null,
        trimWhitespace: true
    };

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        },
        {
            name: "pricing",
            btns: []
        },
        {
            name: "tasks",
            btns: []
        }
    ];

    dtl = new function () {
        var self = this;
        var commentsHelper;
        var selectedtimekeepingline = null;
        var changedInfo = false;
        var lineid = 0;
        var editInfo = 0;
        var timekeepingid = 0;
        var CompareValues;
        var SaveTimekeepingLine;
        var SaveLines;
        var SaveComment;
        var EditModal;
        var InfoModal;
        var HistoryModal;
        var RefreshTableRowData;
        var RefreshTotalRow;
        var LoadTimekeepingLine;
        var TableExportAndFixedHeader;
        var BuildTimekeepingTable;
        var RegisterUIEvents;
        var BreakTime;
        var TotalRow;
        var GetStatusBadgeClass;
        var Export;
        var InfoDataBound;
        var UpdateInfo;
        var CloseInfoModal;
        var infoGridModal;
        var DeleteInfo;

        BreakTime = function (t) {
            if (t >= 39600)
                return 5400;
            else if (t >= 14400)
                return 3600;
            else
                return 0;
        }
        TotalRow = function (user, data) {
            var t_diff = 0;
            var t_normal = 0;
            var t_overtime = 0;
            var t_sum = 0;
            var t_timeonroute = 0;
            var lines = $.grep(data, function (i) {
                return (i.TKD_USER === user);
            });
            $.each(lines, function (i, e) {
                t_diff += e.TKD_DIFF - BreakTime(e.TKD_DIFF);
                t_normal += e.TKD_NORMAL - BreakTime(e.TKD_NORMAL);
                t_overtime += e.TKD_OVERTIME - BreakTime(e.TKD_OVERTIME);
                t_sum += e.TKD_SUM;
                t_timeonroute += e.TKD_TIMEONROUTE;
            });
            var strlines = "";
            strlines += "<tr data-user=\"" + user + "\" class=\"tableexport-ignore table-subtotal\" style=\"background: #ebf5f9;color: #7f7f7f;\">";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td>" + moment.duration(t_diff, "seconds").format(constants.durationformat[lang]) + "</td>";
            strlines += "<td>" + moment.duration(t_sum, "seconds").format(constants.durationformat[lang]) + "</td>";
            strlines += "<td>" + moment.duration(t_timeonroute, "seconds").format(constants.durationformat[lang]) + "</td>";
            strlines += "<td>" + moment.duration(t_normal, "seconds").format(constants.durationformat[lang]) + "</td>";
            strlines += "<td style=\"display:none\"></td>";
            strlines += "<td>" + moment.duration(t_overtime, "seconds").format(constants.durationformat[lang]) + "</td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "<td></td>";
            strlines += "</tr>";
            return strlines;
        }
        Export = function (table, tableexport) {
            $.blockUI();
            var reinit = table.floatThead("destroy");
            var exportData = tableexport.reset().getExportData()["lines"]["xlsx"];
            tableexport.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
            reinit();
            $.unblockUI();
        }
        GetStatusBadgeClass = function (status) {
            switch (status) {
                case "R":
                    return "badge badge-inverse";
                case "WA":
                    return "badge badge-info";
                case "APP":
                    return "badge badge-success";
                case "REJ":
                    return "badge badge-danger";
            }
        }
        TableExportAndFixedHeader = function () {
            var $table = $("#lines");
            $table.floatThead("destroy");
            $table.floatThead();
            $("#btnexport")
                .off("click")
                .on("click", function () {
                    var $tableexport = $table.tableExport(exportsettings);
                    Export($table, $tableexport);
                });
        }
        BuildTimekeepingTable = function (d) {
            var timekeepinglinestbl = $("#details table tbody");
            var strlines = "";
            var currentuser = "";
            var employeecount = 0;
            var wacount = ($.grep(d, function (e) { return e.TKD_STATUS === "WA"; }).length || 0);

            timekeepinglinestbl.find("*").remove();

            if (d.length > 0) {
                employeecount = 1;
                for (var i = 0; i < d.length; i++) {
                    var di = d[i];
                    var borderstyle = "";
                    var breaktime = BreakTime(di.TKD_DIFF);
                    var nbreaktime = BreakTime(di.TKD_NORMAL);
                    var obreaktime = BreakTime(di.TKD_OVERTIME);
                    var editable = (((di.TKD_APPROVER === user || user === "TMSADMIN") && di.TKD_STATUS === "WA") ||
                        (di.TKD_STATUS === "R"));

                    if (i == 0)
                        currentuser = di.TKD_USER;
                    if (currentuser !== di.TKD_USER) {
                        strlines += TotalRow(currentuser, d);
                        employeecount++;
                        borderstyle = "border-top: 2px solid #108ce2;";
                        currentuser = di.TKD_USER;
                    }
                    strlines += "<tr " + (di.TKD_DIFF >= colorthreshold ? ("style=\"background:#ffebeb;" + borderstyle + "\"") : ("style=\"" + borderstyle + "\"")) + "data-editable=\"" + (editable ? "+" : "-") + "\" data-id=\"" + di.TKD_ID + "\" data-user=\"" + di.TKD_USER + "\" data-date=\"" + di.TKD_DATE + "\">";
                    strlines += "<td class=\"tableexport-ignore\">";
                    if (di.TKD_APPROVER === user && di.TKD_STATUS === "WA") {
                        strlines += "<div class=\"checkbox checkbox-primary\" style=\"padding-left: 25px;\">" +
                            "<input type=\"checkbox\" class=\"approval-check styled\" id=\"chk" + di.TKD_ID + "\" />" +
                            "<label></label>" +
                            "</div>";
                    }
                    strlines += "</td>";
                    strlines += "<td class=\"tableexport-ignore\"><div class=\"btn-group\" role=\"group\">";
                    strlines += "<button type=\"button\" title=\"" +
                        applicationstrings[lang].list +
                        "\" class=\"btn btn-info btn-sm btn-info\"  data-lineid=\"" + di.TKD_ID + "\"><i class=\"fa fa-question-circle\" aria-hidden=\"true\"></i></button>" +
                        "<button type=\"button\" title=\"" + applicationstrings[lang].history + "\" class=\"btn btn-primary btn-sm btn-history\"><i class=\"fa fa-bolt\" aria-hidden=\"true\"></i></button>" +
                        "</div>";
                    strlines += "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + di.TKD_USER + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + di.TKD_USERDESC + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + moment(di.TKD_DATE).format(constants.dateformat) + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_EXCEPTION || "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_SHIFTDESC || "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_MINSTART !== null ? moment().startOf("day").seconds(di.TKD_MINSTART).format(constants.timeformat) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_MAXEND !== null ? moment().startOf("day").seconds(di.TKD_MAXEND).format(constants.timeformat) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_DIFF !== null ? (moment().startOf("day").seconds(di.TKD_DIFF - breaktime).format(constants.timeformat) + (breaktime != 0 ? " (+" + (breaktime / 3600) + ")" : "")) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_SUM !== null ? moment().startOf("day").seconds(di.TKD_SUM).format(constants.timeformat) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_TIMEONROUTE !== null ? moment().startOf("day").seconds(di.TKD_TIMEONROUTE).format(constants.timeformat) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_NORMAL != null ? (moment().startOf("day").seconds(di.TKD_NORMAL - nbreaktime).format(constants.timeformat) + (nbreaktime != 0 ? " (+" + (nbreaktime / 3600) + ")" : "")) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\" style=\"display:none;\">" + (di.TKD_NORMAL !== null ? moment().startOf("day").seconds(di.TKD_NORMAL - nbreaktime).format(constants.timeformat) : "") + "</td>";
                    strlines += "<td class=\"tableexport-string target\">" + (di.TKD_OVERTIME != null ? (moment().startOf("day").seconds(di.TKD_OVERTIME - obreaktime).format(constants.timeformat) + (obreaktime != 0 ? " (+" + (obreaktime / 3600) + ")" : "")) : "") + "</td>";
                    strlines += "<td><span class=\"" + GetStatusBadgeClass(di.TKD_STATUS) + "\">" + applicationstrings[lang].timekeepingitemstatus[di.TKD_STATUS] + "</span></td>";
                    strlines += "<td class=\"tableexport-string target\">" + di.TKD_APPROVERDESC + "</td>";
                    strlines += "<td class=\"tableexport-ignore\">" + "<button type=\"button\" title=\"" + applicationstrings[lang].comments + "\" class=\"btn " + (di.TKD_CMNTCOUNT > 0 ? " btn-primary" : " btn-default") + " btn-sm btn-comments\"><i class=\"fa fa-comment\"></i> <span class=\"txt\">" + di.TKD_CMNTCOUNT + "</span></button> " + "</td>";
                    strlines += "</tr>";
                }
            }
            $("#employeecount").text(employeecount);
            $("#approvalcounts").text(wacount + " / " + (d.length || 0));

            timekeepinglinestbl.html(strlines);
            timekeepinglinestbl.find(".btn-comments").off("click").on("click", function () {
                var id = $(this).closest("[data-id]").data("id");
                commentsHelper.showCommentsModal({ subject: "TKITEM", source: id });
            });
            timekeepinglinestbl.find(".btn-edit").off("click").click(EditModal);
            timekeepinglinestbl.find(".btn-info").off("click").click(function () {
                lineid = $(this).data("lineid");
                var row = $(this).closest("[data-id]");
                InfoModal(row);
            });

            timekeepinglinestbl.find(".btn-history").off("click").on("click", HistoryModal);

            timekeepinglinestbl.find("input.approval-check").on("change", function () {
                $("#checkeditemcount").text(timekeepinglinestbl.find("input.approval-check:checked").length);
            });

            TableExportAndFixedHeader();
        }
        RegisterUIEvents = function () {
            $("#isnotnull,#isnull,#continuous,#waitingmyapproval").on("change", function () {
                self.List();
            });
            $("#btnsavetimekeepingline").on("click", SaveTimekeepingLine);
            $("#checkall").on("change", function () {
                var ischecked = $(this).is(":checked");
                $("input.approval-check").prop("checked", ischecked).trigger("change");
            });
            $("#btnsavetimechange").off("click").on("click", UpdateInfo);
            $("#btndeletetime").off("click").on("click", DeleteInfo);

            $("#btnapprove,#btnreject").on("click", function () {
                var $this = $(this);
                var checkedlines = $("input.approval-check:checked");
                if (checkedlines.length == 0) {
                    msgs.error(applicationstrings[lang].selectarecord);
                }

                var lines = [];
                var newstatus = $(this).data("status");
                for (var i = 0; i < checkedlines.length; i++) {
                    var line = $(checkedlines[i]).closest("tr");
                    lines.push({
                        TKD_ID: line.data("id"),
                        TKD_STATUS: newstatus,
                        TKD_UPDATED: tms.Now(),
                        TKD_UPDATEDBY: user
                    });
                }
                $this.prop("disabled", true);
                $.when(SaveLines(lines)).always(function () {
                    $this.prop("disabled", false);
                });
            });
        }
        HistoryModal = function () {
            var row = $(this).closest("[data-id]");
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMTIMEKEEPINGLINES", operator: "eq" },
                    { field: "AUD_REFID", value: row.data("id"), operator: "eq" }
                ]
            });
        }

        UpdateInfo = function () {
            if (!tms.Check("#modaltimeedit"))
                return $.Deferred().reject();

            var startsec = moment.duration($("#starttime").val(), constants.timeformat).asSeconds();
            var endsec = moment.duration($("#endtime").val(), constants.timeformat).asSeconds();

            if (endsec < startsec) {
                msgs.error(applicationstrings[lang].startenderr);
                return $.Deferred().reject();
            }

            var o = JSON.stringify({
                Id: editInfo,
                Start: moment.duration($("#starttime").val(), constants.timeformat).asSeconds(),
                End: moment.duration($("#endtime").val(), constants.timeformat).asSeconds()
            });

            var linecomments = $("#timecomments").val();
            return $.when(LoadTimekeepingLine(timekeepingid)).done(function () {
                return $.when(SaveComment(selectedtimekeepingline.TKD_ID, linecomments)).done(function () {
                    return tms.Ajax({
                        url: "/Api/ApiBookedHours/Update",
                        data: o,
                        contentType: "application/json",
                        fn: function (d) {
                            msgs.success(d.data);
                            changedInfo = true;
                            $("#modaltimeedit").modal("hide");
                            infoGridModal.refresh();
                        }
                    });
                });
            });
        };
        DeleteInfo = function () {
            if (!tms.Check("#modaltimedelete"))
                return $.Deferred().reject();

            var linecomments = $("#timedeletecomments").val();
            return $.when(LoadTimekeepingLine(timekeepingid)).done(function () {
                return $.when(SaveComment(selectedtimekeepingline.TKD_ID, linecomments)).done(function () {
                    return tms.Ajax({
                        url: "/Api/ApiBookedHours/DelRec",
                        data: JSON.stringify(editInfo),
                        fn: function (d) {
                            changedInfo = true;
                            $("#modaltimedelete").modal("hide");
                            msgs.success(d.data);
                            infoGridModal.refresh();
                        }
                    });
                });
            });
        };
        InfoDataBound = function () {
            $(".btn-edittime").off("click").on("click", function () {
                $("#modaltimeedit").modal("show");
                editInfo = $(this).attr("id");

                $("#starttime").val(moment().startOf("day").seconds($(this).data("start")).format(constants.timeformat));
                $("#endtime").val(moment().startOf("day").seconds($(this).data("end")).format(constants.timeformat));
            });
            $(".btn-deletetime").off("click").on("click", function () {
                editInfo = $(this).attr("id");
                if (editInfo) {
                    $("#modaltimedelete").modal("show");
                }
            });
        };
        CloseInfoModal = function () {
            if (lineid && changedInfo) {
                return tms.Ajax({
                    url: "/Api/ApiTimekeepingLines/UpdateLine",
                    data: JSON.stringify(lineid),
                    fn: function (d) {
                        msgs.success(d.data);
                        self.List();
                        changedInfo = false;
                    }
                });
            }
        };
        InfoModal = function (row) {
            var code = row.data("user");
            var date = row.data("date");
            var editable = row.data("editable");
            timekeepingid = row.data("id");
            var f = [
                { field: "BOO_USER", value: code, operator: "eq" },
                { field: "BOO_DATE", value: date, operator: "eq" }
            ];

            infoGridModal = gridModal.show({
                modaltitle: gridstrings.bookedhoursview[lang].title,
                listurl: "/Api/ApiBookedHours/ListView",
                keyfield: "BOO_ID",
                codefield: "BOO_USER",
                textfield: "BOO_USRDESC",
                columns: [
                    {
                        type: "na",
                        field: "ACTIONS",
                        title: gridstrings.tasklist[lang].actions,
                        template: (editable === "+" ? "<div style=\"text-align:center;\">" +
                            "<button type=\"button\" title=\"#= applicationstrings[lang].edit #\" id=\"#= BOO_ID #\" data-end=\"#= BOO_END #\" data-start=\"#= BOO_START #\" class=\"btn  btn-info-light btn-sm btn-edittime\"><i class=\"fa fa-pencil\"></i></button> " +
                            "<button type=\"button\" title=\"#= applicationstrings[lang].delete #\" id=\"#= BOO_ID #\" class=\"btn btn-info-light btn-sm btn-deletetime\"><i class=\"fa fa-trash\"></i></button></div>" : ""),
                        filterable: false,
                        sortable: false,
                        width: 125
                    },
                    { type: "string", field: "BOO_USER", title: gridstrings.bookedhoursview[lang].user, width: 150 },
                    { type: "string", field: "BOO_USRDESC", title: gridstrings.bookedhoursview[lang].userdesc, width: 250 },
                    { type: "string", field: "BOO_TRADE", title: gridstrings.bookedhoursview[lang].trade, width: 250 },
                    { type: "string", field: "BOO_CATDESC", title: gridstrings.bookedhoursview[lang].catdesc, width: 250 },
                    { type: "number", field: "BOO_TASK", title: gridstrings.bookedhoursview[lang].task, width: 150 },
                    { type: "string", field: "BOO_TSKSHORTDESC", title: gridstrings.bookedhoursview[lang].taskshortdesc, width: 350 },
                    { type: "string", field: "BOO_BRANCH", title: gridstrings.bookedhoursview[lang].branch, width: 250 },
                    { type: "string", field: "BOO_CUSTOMER", title: gridstrings.bookedhoursview[lang].customer, width: 250 },
                    { type: "string", field: "BOO_CREATEDBY", title: gridstrings.bookedhoursview[lang].createdby, width: 250 },
                    { type: "string", field: "BOO_AUTO", title: gridstrings.bookedhoursview[lang].auto, width: 100 },
                    { type: "date", field: "BOO_DATE", title: gridstrings.bookedhoursview[lang].date, width: 200 },
                    { type: "time", field: "BOO_START", title: gridstrings.bookedhoursview[lang].start, width: 150, template: "#= BOO_START == null ? '' : moment().startOf('day').seconds(BOO_START).format(constants.timeformat) #" },
                    { type: "time", field: "BOO_END", title: gridstrings.bookedhoursview[lang].end, width: 150, template: "#= BOO_END == null ? '' : moment().startOf('day').seconds(BOO_END).format(constants.timeformat) #" },
                    { type: "string", field: "BOO_TIME", title: gridstrings.bookedhoursview[lang].time, width: 200 },
                    { type: "number", field: "BOO_MINUTES", title: gridstrings.bookedhoursview[lang].minutes, width: 200 }
                ],
                fields: {
                    BOO_DATE: { type: "date" },
                    BOO_MINUTES: { type: "number" },
                    BOO_START: { type: "time" },
                    BOO_END: { type: "time" },
                    BOO_TASK: { type: "number" }
                },
                filter: f,
                sort: [{ field: "BOO_ID", dir: "desc" }],
                gridDataBound: InfoDataBound,
                customOff: CloseInfoModal
            });
        }
        EditModal = function () {
            tms.Reset("#modaledit");

            var linecomments = $("#linecomments");
            var commentsdiv = $("#commentsdiv");
            var row = $(this).closest("[data-id]");

            linecomments.removeClass("required").removeAttr("required");
            linecomments.val("");
            commentsdiv.addClass("hidden");

            $.when(LoadTimekeepingLine(row.data("id"))).done(function (d) {
                var line = d.data;
                var linebreaktime = BreakTime(line.TKD_DIFF);
                var inormal = line.TKD_NORMAL != null
                    ? moment().startOf("day").seconds(line.TKD_NORMAL - BreakTime(line.TKD_NORMAL))
                        .format(constants.timeformat)
                    : null;
                var iovertime = line.TKD_OVERTIME != null
                    ? moment().startOf("day").seconds(line.TKD_OVERTIME - BreakTime(line.TKD_OVERTIME))
                        .format(constants.timeformat)
                    : null;
                var itimeonroute = line.TKD_TIMEONROUTE != null
                    ? moment().startOf("day").seconds(line.TKD_TIMEONROUTE)
                        .format(constants.timeformat)
                    : null;
                $("#susercode").text(line.TKD_USER);
                $("#suserdesc").text(line.TKD_USERDESC);
                $("#sdate").text(moment(line.TKD_DATE).format(constants.dateformat));
                $("#sshift").text(line.TKD_SHIFTDESC);
                $("#sminstart").text((line.TKD_MINSTART !== null ? moment().startOf("day").seconds(line.TKD_MINSTART).format(constants.timeformat) : ""));
                $("#smaxend").text((line.TKD_MAXEND !== null ? moment().startOf("day").seconds(line.TKD_MAXEND).format(constants.timeformat) : ""));
                $("#sdiff").text((line.TKD_DIFF !== null ? (moment().startOf("day").seconds(line.TKD_DIFF - linebreaktime).format(constants.timeformat) + (linebreaktime != 0 ? " (+" + (linebreaktime / 3600) + ")" : "")) : ""));
                $("#sworkinghours").text((line.TKD_SUM !== null ? moment().startOf("day").seconds(line.TKD_SUM).format(constants.timeformat) : ""));
                $("#inormal").data("ovalue", inormal).data("nvalue", inormal).val(inormal || "");
                $("#iovertime").data("ovalue", iovertime).val(iovertime || "");
                $("#itimeonroute").data("ovalue", itimeonroute).val(itimeonroute || "");
                $("#sstatus").text(applicationstrings[lang].timekeepingitemstatus[line.TKD_STATUS]);
                $("#modaledit").modal("show");
                $("#inormal,#iovertime,#itimeonroute").on("dp.change", function () {
                    var $this = $(this);
                    if (CompareValues()) {
                        commentsdiv.removeClass("hidden");
                        linecomments.addClass("required").attr("required", "required");
                        $this.data("nvalue", $this.val());
                        if ($this.attr("id") === "itimeonroute") {
                            var timeonroute_v = $("#itimeonroute").val() || 0;
                            var timeonroute_ov = $this.data("ovalue") || 0;
                            var normal_v = $("#inormal").data("nvalue");
                            var ovalue = moment.duration(timeonroute_ov, constants.timeformat).asSeconds();
                            var nvalue = moment.duration(timeonroute_v, constants.timeformat).asSeconds();
                            var normal = normal_v ? moment.duration(normal_v, constants.timeformat).asSeconds() : null;
                            var uvalue = normal + (nvalue - ovalue);
                            $("#inormal").val(moment().startOf("day").seconds(uvalue).format(constants.timeformat));
                        }
                    } else {
                        linecomments.removeClass("required").removeAttr("required");
                        commentsdiv.addClass("hidden");
                    }
                });
            });
        }
        RefreshTotalRow = function (user) {
            var t_diff = 0;
            var t_normal = 0;
            var t_overtime = 0;
            var t_sum = 0;
            var t_timeonroute = 0;

            var lines = $.grep(timekeepingdata, function (i) {
                return (i.TKD_USER === user);
            });

            $.each(lines, function (i, e) {
                t_normal += e.TKD_NORMAL - BreakTime(e.TKD_NORMAL);
                t_overtime += e.TKD_OVERTIME - BreakTime(e.TKD_OVERTIME);
            });

            var tablelines = $("#lines");
            var totalrow = tablelines.find("tr.table-subtotal[data-user=\"" + user + "\"]");

            totalrow.find("td:nth-child(14)").html(moment.duration(t_normal, "seconds").format(constants.durationformat[lang]));
            totalrow.find("td:nth-child(16)").html(moment.duration(t_overtime, "seconds").format(constants.durationformat[lang]));
        }
        RefreshTableRowData = function (d) {
            var lines = d.tkitems;
            var tablelines = $("#lines");
            for (var i = 0; i < lines.length; i++) {
                var item = lines[i];
                timekeepingdata = $.grep(timekeepingdata, function (e) { return e.TKD_ID != item.TKD_ID; });
                timekeepingdata.push(item);
                var nbreaktime = BreakTime(item.TKD_NORMAL);
                var obreaktime = BreakTime(item.TKD_OVERTIME);
                var tablerow = $(tablelines.find("tr[data-id=\"" + item.TKD_ID + "\"]"));
                tablerow.find("td:nth-child(12)").html(item.TKD_TIMEONROUTE != null ? moment().startOf("day").seconds(item.TKD_TIMEONROUTE).format(constants.timeformat) : "");
                tablerow.find("td:nth-child(13)").html((item.TKD_NORMAL != null ? (moment().startOf("day").seconds(item.TKD_NORMAL - nbreaktime).format(constants.timeformat) + (nbreaktime != 0 ? " (+" + (nbreaktime / 3600) + ")" : "")) : ""));
                tablerow.find("td:nth-child(14)").html(item.TKD_NORMAL !== null ? moment().startOf("day").seconds(item.TKD_NORMAL).format(constants.timeformat) : "");
                tablerow.find("td:nth-child(15)").html((item.TKD_OVERTIME != null ? (moment().startOf("day").seconds(item.TKD_OVERTIME - obreaktime).format(constants.timeformat) + (obreaktime != 0 ? " (+" + (obreaktime / 3600) + ")" : "")) : ""));
                tablerow.find("td:nth-child(16)").html("<span class=\"" + GetStatusBadgeClass(item.TKD_STATUS) + "\">" + applicationstrings[lang].timekeepingitemstatus[item.TKD_STATUS] + "</span>");
                var commentsbtn = $(tablerow.find("button.btn-comments"));
                commentsbtn.find("span.txt").text(item.TKD_CMNTCOUNT);
                commentsbtn.removeClass(item.TKD_CMNTCOUNT > 0 ? "btn-default" : "btn-primary").addClass(item.TKD_CMNTCOUNT > 0 ? "btn-primary" : "btn-default");
                RefreshTotalRow(item.TKD_USER);
            }
        }
        SaveComment = function (source, text) {
            if (!text)
                return $.Deferred().resolve();

            var cmnt = {
                CMN_SUBJECT: "TKITEM",
                CMN_SOURCE: source,
                CMN_TEXT: text,
                CMN_VISIBLETOCUSTOMER: "-",
                CMN_VISIBLETOSUPPLIER: "-"
            };
            return tms.Ajax({
                url: "/Api/ApiComments/Save",
                data: JSON.stringify(cmnt)
            });
        }
        SaveLines = function (lines) {
            if (lines) {
                return tms.Ajax({
                    url: "/Api/ApiTimekeepingLines/Process",
                    data: JSON.stringify(lines),
                    fn: function (d) {
                        self.List();
                    }
                });
            }
        };
        LoadTimekeepingLine = function (id) {
            return tms.Ajax({
                url: "/Api/ApiTimekeepingLines/Get",
                data: JSON.stringify(id),
                fn: function (d) {
                    selectedtimekeepingline = d.data;
                }
            });
        };
        SaveTimekeepingLine = function () {
            if (selectedtimekeepingline) {
                if (tms.Check("#modaledit")) {
                    var inormal_v = $("#inormal").val();
                    var iovertime_v = $("#iovertime").val();
                    var itimeonroute_v = $("#itimeonroute").val();
                    var inormal = inormal_v ? moment.duration(inormal_v, constants.timeformat).asSeconds() : null;
                    var iovertime = iovertime_v ? moment.duration(iovertime_v, constants.timeformat).asSeconds() : null;
                    var itimeonroute = itimeonroute_v ? moment.duration(itimeonroute_v, constants.timeformat).asSeconds() : null;
                    inormal = inormal != null ? (inormal + BreakTime(inormal)) : null;
                    iovertime = iovertime != null ? (iovertime + BreakTime(iovertime)) : null;
                    selectedtimekeepingline.TKD_NORMAL = inormal;
                    selectedtimekeepingline.TKD_OVERTIME = iovertime;
                    selectedtimekeepingline.TKD_TIMEONROUTE = itimeonroute;
                    selectedtimekeepingline.TKD_UPDATED = tms.Now();
                    selectedtimekeepingline.TKD_UPDATEDBY = user;
                    var linecomments = $("#linecomments").val();
                    return $.when(SaveComment(selectedtimekeepingline.TKD_ID, linecomments)).done(function () {
                        return tms.Ajax({
                            url: "/Api/ApiTimekeepingLines/Save",
                            data: JSON.stringify([selectedtimekeepingline]),
                            fn: function (d) {
                                $("#modaledit").modal("hide");
                                RefreshTableRowData(d);
                            }
                        });
                    });
                }
            }
        };
        CompareValues = function () {
            var hc = false;
            var inormal = $("#inormal");
            var iovertime = $("#iovertime");
            var itimeonroute = $("#itimeonroute");

            var nv = null;
            var ov = null;

            nv = itimeonroute.val();
            ov = itimeonroute.data("ovalue") || 0;
            hc = (nv !== ov);
            if (hc) return true;

            nv = inormal.val();
            ov = inormal.data("ovalue");
            hc = (ov && nv !== ov);
            if (hc) return true;

            nv = iovertime.val();
            ov = iovertime.data("ovalue");
            hc = (ov && nv !== ov);
            if (hc) return true;

            return false;
        }
        this.List = function () {
            if (selectedrecord) {
                var isnotnull = $("#isnotnull").is(":checked");
                var isnull = $("#isnull").is(":checked");
                var continuous = $("#continuous").is(":checked");
                var waitingmyapproval = $("#waitingmyapproval").is(":checked");

                var gridreq = {
                    sort: [
                        { field: "TKD_USER", dir: "asc" },
                        { field: "TKD_DATE", dir: "asc" }
                    ],
                    filter: { filters: [{ field: "TKD_TIMEKEEPING", value: selectedrecord.TKP_ID, operator: "eq" }] },
                    loadall: true
                };

                if (isnull)
                    gridreq.filter.filters.push({ field: "TKD_MINSTART", operator: "isnull" });
                if (isnotnull)
                    gridreq.filter.filters.push({ field: "TKD_MINSTART", operator: "isnotnull" });
                if (continuous) {
                    gridreq.filter.filters.push({ field: "TKD_MINSTART", value: 0, operator: "eq", logic: "or" });
                    gridreq.filter.filters.push({ field: "TKD_MAXEND", value: 86340, operator: "eq", logic: "or" });
                }
                if (waitingmyapproval) {
                    gridreq.filter.filters.push({ field: "TKD_STATUS", value: "WA", operator: "eq" });
                    gridreq.filter.filters.push({ field: "TKD_APPROVER", value: user, operator: "eq" });
                }

                return tms.Ajax({
                    url: "/Api/ApiTimekeepingLines/List",
                    data: JSON.stringify(gridreq),
                    fn: function (d) {
                        timekeepingdata = d.data;
                        BuildTimekeepingTable(d.data);
                    }
                });
            }
        }
        this.Ready = function () {
            commentsHelper = new comments({
                input: "#tkitemcomment",
                btnaddcomment: "#addTkItemComment",
                modal: "#modalcomments",
                commentcounttext: "tr[data-id=\"#source#\"] button.btn-comments span.txt",
                commentsdiv: "#tkitemcomments"
            });
        }
        RegisterUIEvents();
    };
    tkp = new function () {
        var self = this;
        var grdTimekeeping = null;
        var grdTimekeepingElm = $("#grdTimekeeping");
        var documentsHelper;
        var commentsHelper;
        var customFieldsHelper;

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMTIMEKEEPING", operator: "eq" },
                    { field: "AUD_REFID", value: tkpid, operator: "eq" }
                ]
            });
        };
        var BuildModals = function () {
            $("#btnorg").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.org[lang].title,
                    listurl: "/Api/ApiOrgs/ListUserOrganizations",
                    keyfield: "ORG_CODE",
                    codefield: "ORG_CODE",
                    textfield: "ORG_DESCF",
                    returninput: "#org",
                    columns: [
                        { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" }
                    ],
                    callback: function (data) {
                        $("#type").val("");
                        tooltip.hide("#type");
                    }
                });
            });
            $("#btntype").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#type",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        { type: "string", field: "TYP_DESC", title: gridstrings.type[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "TYP_CODE", value: "*", operator: "neq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ENTITY", value: "TIMEKEEPING", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: [$("#org").val(), "*"], operator: "in" }
                    ],
                    callback: function (data) {
                        if (data && tkpid) {
                            customFieldsHelper.loadCustomFields({
                                subject: "TIMEKEEPING",
                                source: tkpid,
                                type: data.TYP_CODE
                            });
                        }
                    }
                });
            });
            $("#btndepartment").click(function () {
                gridModal.show({
                    modaltitle: gridstrings.dep[lang].title,
                    listurl: "/Api/ApiDepartments/List",
                    keyfield: "DEP_CODE",
                    codefield: "DEP_CODE",
                    textfield: "DEP_DESC",
                    returninput: "#department",
                    columns: [
                        { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                        { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                        { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                    ],
                    filter: [
                        { field: "DEP_CODE", value: "*", operator: "neq" },
                        { field: "DEP_ACTIVE", value: "+", operator: "eq" },
                        { field: "DEP_ORG", value: [$("#org").val(), "*"], operator: "in" }
                    ]
                });
            });
        };
        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE",
                callback: function (data) {
                    $("#type").val("");
                    tooltip.hide("#type");
                    if (data) {
                        $("#org").val(data.ORG_CODE).trigger("change");
                        tooltip.show("#org", data.ORG_DESCF);
                    }
                }
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ORGANIZATION", relfield: "#org", includeall: true },
                    { field: "TYP_CODE", value: "*", operator: "neq" },
                    { field: "TYP_ENTITY", value: "TIMEKEEPING", operator: "eq" }
                ],
                callback: function (data) {
                    if (data && !tkpid) {
                        customFieldsHelper.loadCustomFields(
                            { subject: "TIMEKEEPING", source: tkpid, type: data.TYP_CODE });
                    }
                }
            });
            $("#department").autocomp({
                listurl: "/Api/ApiDepartments/List",
                geturl: "/Api/ApiDepartments/Get",
                field: "DEP_CODE",
                textfield: "DEP_DESC",
                active: "DEP_ACTIVE",
                filter: [
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    { field: "DEP_ORG", relfield: "#org", includeall: true }
                ]
            });
        };
        var LoadStatuses = function (status) {
            return tms.Ajax({
                url: "/Api/ApiStatusAuth/RetrieveStatuses",
                data: JSON.stringify({
                    Entity: "TIMEKEEPING",
                    Fromcode: status.code,
                    Typ: $("#type").val(),
                    Usergroup: usergroup,
                    RequestedBy: $("#createdby").val(),
                    CreatedBy: $("#createdby").val(),
                    SystemUser: user
                }),
                fn: function (d) {
                    var statusctrl = $("#status");
                    var strOption = "";
                    statusctrl.find("option").remove();
                    if (status.code !== "-")
                        strOption += "<option selected=\"selected\" data-pcode=\"" +
                            status.pcode +
                            "\" data-code=\"" +
                            status.code +
                            "\" value=\"" +
                            status.code +
                            "\">" +
                            status.text +
                            "</option>";
                    if (d.data.length === 0) {
                        statusctrl.removeClass("required").prop("disabled", true);
                    } else {
                        for (var i = 0; i < d.data.length; i++) {
                            var di = d.data[i];
                            strOption += "<option data-pcode=\"" +
                                di.SAU_PTO +
                                "\" data-code=\"" +
                                di.SAU_TO +
                                "\" value=\"" +
                                di.SAU_TO +
                                "\">" +
                                di.SAU_TODESC +
                                "</option>";
                        }
                        statusctrl.addClass("required").prop("disabled", false).removeAttr("frozen");
                    }
                    statusctrl.append(strOption);
                }
            });
        };
        var EvaluateCurrentStatus = function () {
            var statusctrl = $("#status");
            var selectedoption = statusctrl.find("option:selected");
            var currentcode = statusctrl.data("code");
            var currentpcode = statusctrl.data("pcode");
            var code = selectedoption.data("code");
            var pcode = selectedoption.data("pcode");
            switch (currentpcode) {
                case "C":
                    $("#cfcontainer").find("input,select,button").prop("disabled", true);
                    $("#record [disableoncomplete]").prop("disabled", true);
                    break;
                default:
                    $("#record [disableoncomplete]").prop("disabled", false);
                    break;
            }
        };

        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var customfieldvalues = customFieldsHelper.getCustomFieldScreenValues({ subject: "TIMEKEEPING", source: tkpid, type: $("#type").val() });
            var o = JSON.stringify(
                {
                    Timekeeping: {
                        TKP_ID: selectedrecord ? selectedrecord.TKP_ID : 0,
                        TKP_ORG: $("#org").val(),
                        TKP_DESC: $("#desc").val(),
                        TKP_TYPE: $("#type").val(),
                        TKP_DEPARTMENT: $("#department").val(),
                        TKP_TYPEENTITY: "TIMEKEEPING",
                        TKP_STATUSENTITY: "TIMEKEEPING",
                        TKP_STATUS: $("#status").val(),
                        TKP_STARTDATE: moment.utc($("#startdate").val(), constants.longdateformat),
                        TKP_ENDDATE: moment.utc($("#enddate").val(), constants.longdateformat),
                        TKP_DURATION: $("#duration").val(),
                        TKP_CREATED: selectedrecord != null ? selectedrecord.TKP_CREATED : tms.Now(),
                        TKP_CREATEDBY: selectedrecord != null ? selectedrecord.TKP_CREATEDBY : user,
                        TKP_UPDATED: selectedrecord != null ? tms.Now() : null,
                        TKP_UPDATEDBY: selectedrecord != null ? user : null,
                        TKP_RECORDVERSION: selectedrecord != null ? selectedrecord.TKP_RECORDVERSION : 0
                    },
                    CustomFieldValues: customfieldvalues
                });

            return tms.Ajax({
                url: "/Api/ApiTimekeeping/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    tkpid = d.r.Timekeeping.TKP_ID;
                    return self.LoadSelected();
                }
            });
        };
        this.Delete = function () {
            if (tkpid) {
                $("#confirm").modal().off("click", "#delete").one("click", "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiTimekeeping/DelRec",
                            data: JSON.stringify(tkpid),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.ResetUI = function () {
            selectedrecord = null;
            tkpid = null;

            tms.Reset("#record");

            $("#id").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#department").val("");
            $("#type").val("");

            $("#status").data("code", "-");
            $("#status").data("pcode", "Q");
            $("#status").data("text", "");
            $("#status").val("");
            $("#status").prop("disabled", false);
            $("#status option").remove();

            $("#startdate").val("");
            $("#duration").val("");
            $("#enddate").val("");
            $("#createdby").val(user);
            $("#created").val(tms.Now().format(constants.longdateformat));

            tooltip.hide("#type");
            tooltip.hide("#org");
            tooltip.hide("#department");

            $("#addComment,#fu").prop("disabled", true);
            $("#btnBrowse").attr("disabled", "disabled");

            customFieldsHelper.clearCustomFields();
            commentsHelper.clearComments();
            documentsHelper.clearDocuments();
        };
        var FillUserInterface = function () {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab();

            $("#id").val(selectedrecord.TKP_ID);
            $("#org").val(selectedrecord.TKP_ORG);
            $("#department").val(selectedrecord.TKP_DEPARTMENT);
            $("#desc").val(selectedrecord.TKP_DESC);
            $("#type").val(selectedrecord.TKP_TYPE);
            $("#startdate").val(moment(selectedrecord.TKP_STARTDATE).format(constants.dateformat));
            $("#enddate").val(moment(selectedrecord.TKP_ENDDATE).format(constants.dateformat));
            $("#duration").val(selectedrecord.TKP_DURATION);
            $("#created").val(moment(selectedrecord.TKP_CREATED).format(constants.longdateformat));
            $("#createdby").val(selectedrecord.TKP_CREATEDBY);

            $("#status").data("code", selectedstatus.STA_CODE);
            $("#status").data("pcode", selectedstatus.STA_PCODE);
            $("#status").data("text", selectedstatus.STA_DESCF);

            tooltip.show("#org", selectedrecord.TKP_ORGDESC);
            tooltip.show("#department", selectedrecord.TKP_DEPARTMENTDESC);
            tooltip.show("#type", selectedrecord.TKP_TYPEDESC);

            $("#docuprogress").text("0%");
            $("#docuprogress").css("width", "0");

            $("#btnBrowse").removeAttr("disabled");
            $("#comment,#addComment,#fu,#btnDelete").prop("disabled", false);

            commentsHelper.showCommentsBlock({ subject: "TIMEKEEPING", source: selectedrecord.TKP_ID });
            documentsHelper.showDocumentsBlock({ subject: "TIMEKEEPING", source: selectedrecord.TKP_ID });;
            $.when(customFieldsHelper.loadCustomFields({ subject: "TIMEKEEPING", source: selectedrecord.TKP_ID, type: selectedrecord.TKP_TYPE })).done(function () {
                $.when(LoadStatuses({ pcode: selectedstatus.STA_PCODE, code: selectedstatus.STA_CODE, text: selectedstatus.STA_DESCF })).done(function () {
                    EvaluateCurrentStatus();
                });
            });
        };
        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiTimekeeping/Get",
                data: JSON.stringify(tkpid),
                fn: function (d) {
                    selectedrecord = d.data;
                    selectedstatus = d.stat;
                    FillUserInterface();
                    customFieldsHelper.loadCustomFields({ subject: "TIMEKEEPING", source: tkpid, type: $("#type").val() });
                }
            });
        };
        var ItemSelect = function (row) {
            selectedrecord = grdTimekeeping.GetRowDataItem(row);
            tkpid = selectedrecord.TKP_ID;
            $(".page-header h6").html(selectedrecord.TKP_ID + " - " + selectedrecord.TKP_DESC);
            scr.Configure();
            tms.Tab();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        var GridDataBound = function () {
            grdTimekeepingElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
        };
        this.List = function () {
            var gridfilter = [];
            if (inbox) {
                gridfilter.push({ IsPersistent: true, value: inbox, value2: user, operator: "inbox" });
            }
            if (grdTimekeeping) {
                grdTimekeeping.ClearSelection();
                grdTimekeeping.RunFilter(gridfilter);
            } else {
                grdTimekeeping = new Grid({
                    keyfield: "TKP_ID",
                    columns: [
                        {
                            type: "number",
                            field: "TKP_ID",
                            title: gridstrings.timekeeping[lang].id,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TKP_DESC",
                            title: gridstrings.timekeeping[lang].desc,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "TKP_ORG",
                            title: gridstrings.timekeeping[lang].org,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TKP_ORGDESC",
                            title: gridstrings.timekeeping[lang].orgdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TKP_TYPE",
                            title: gridstrings.timekeeping[lang].type,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TKP_TYPEDESC",
                            title: gridstrings.timekeeping[lang].typedesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TKP_DEPARTMENT",
                            title: gridstrings.timekeeping[lang].department,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TKP_DEPARTMENTDESC",
                            title: gridstrings.timekeeping[lang].departmentdesc,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TKP_STATUS",
                            title: gridstrings.timekeeping[lang].status,
                            width: 150
                        },
                        {
                            type: "string",
                            field: "TKP_STATUSDESC",
                            title: gridstrings.timekeeping[lang].statusdesc,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "TKP_STARTDATE",
                            title: gridstrings.timekeeping[lang].startdate,
                            width: 250
                        },
                        {
                            type: "date",
                            field: "TKP_ENDDATE",
                            title: gridstrings.timekeeping[lang].enddate,
                            width: 250
                        },
                        {
                            type: "number",
                            field: "TKP_DURATION",
                            title: gridstrings.timekeeping[lang].duration,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "TKP_CREATED",
                            title: gridstrings.timekeeping[lang].created,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "TKP_CREATEDBY",
                            title: gridstrings.timekeeping[lang].createdby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        TKP_ID: { type: "number" },
                        TKP_STARTDATE: { type: "date" },
                        TKP_ENDDATE: { type: "date" },
                        TKP_CREATED: { type: "date" },
                        TKP_DURATION: { type: "number" }
                    },
                    datasource: "/Api/ApiTimekeeping/List",
                    selector: "#grdTimekeeping",
                    name: "grdTimekeeping",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "TKP_ID",
                    primarytextfield: "TKP_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "TKP_ID", dir: "desc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"timekeeping.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };
        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        selectedrecord = null;
                        tkp.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            tkp.ResetUI();
                        else
                            tkp.LoadSelected();
                        break;
                    case "#details":
                        $("#waitingmyapproval").prop("checked", true);
                        dtl.Ready();
                        dtl.List();
                        break;
                }

                scr.Configure();
            });
        };
        var RegisterUiEvents = function () {
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnSave").click(self.Save);
            $("#btnDelete").click(self.Delete);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);

            $("[loadstatusesonchange=\"yes\"]").on("change", function () {
                LoadStatuses({
                    code: $("#status").data("code"),
                    pcode: $("#status").data("pcode"),
                    text: $("#status").data("text")
                });
            });
            $("#duration").on("change", function () {
                var startdate = $("#startdate").val();
                var period = $(this).val();
                if (startdate) {
                    $("#enddate").val(moment(startdate, constants.dateformat).add(period - 1, "days").format(constants.dateformat));
                }
            });
            $("#startdate").on("dp.change", function () {
                var startdate = $(this).val();
                var period = $("#duration").val();
                if (period) {
                    $("#enddate").val(moment(startdate, constants.dateformat).add(period - 1, "days").format(constants.dateformat));
                }
            });

            RegisterTabChange();

            documentsHelper = new documents({
                input: "#fu",
                filename: "#filename",
                uploadbtn: "#btnupload",
                container: "#fupload",
                documentsdiv: "#docs",
                progressbar: "#docuprogress"
            });
            commentsHelper = new comments({
                input: "#comment",
                btnaddcomment: "#addComment",
                commentsdiv: "#comments"
            });
            customFieldsHelper = new customfields({ container: "#cfcontainer" });

            BuildModals();
            AutoComplete();
        };
        this.BuildUI = function () {
            RegisterUiEvents();
            self.List();
            if (!tkpid)
                $("#btnBrowse").attr("disabled", "disabled");
        };
    };
    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnSave";
                            case "pricing":
                                return "#btnSavePricing";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                tkp.Save();
                                break;
                            case "pricing":
                                prce.Save();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnNew";
                            case "pricing":
                                return "#btnAddPricing";
                            default:
                                return null;
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                tkp.ResetUI();
                                break;
                            case "pricing":
                                prce.ResetUI();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                tkp.LoadSelected();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+d",
                    e: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                return "#btnDelete";
                            case "pricing":
                                return "#btnDeletePricing";
                        }
                    },
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                tkp.Delete();
                                break;
                            case "pricing":
                                prce.Delete();
                                break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnHistory",
                    f: function () {
                        switch (tms.ActiveTab()) {
                            case "record":
                                tkp.HistoryModal();
                                break;
                        }
                    }
                }
            ]);
        };
        this.Configure = function () {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function (e) { return e.name === activeTab; })[0];
            for (var i = 0; i < tab.btns.length; i++) {
                var btni = tab.btns[i];
                if (!btni.selectionrequired)
                    $(btni.id).removeAttr("disabled");
                else {
                    if (selectedrecord) {
                        $(btni.id).removeAttr("disabled");
                    }
                }
            }
            if (tab.more && typeof (tab.more) == "function")
                return tab.more();
        };
    };

    function ready() {
        tkp.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());