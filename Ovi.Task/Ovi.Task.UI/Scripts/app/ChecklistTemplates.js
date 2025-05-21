(function () {
    var selectedrecord = null;
    var scr, chk, top, lookup;

    var screenconf = [
        {
            name: "list",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },

            ]
        },
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true },
                { id: "#btnTranslations", selectionrequired: true }
            ]
        },
        {
            name: "topics",
            btns: []
        }
    ];

    lookup = new function () {
        var grdCheckListLookupLines = null;
        var deleteCheckListLookupLine;
        var selectedCheckListLookupLine;
        var selectedCheckListItemId;

        var gridDatabound = function () {
            $(".lu-remove").unbind("click").click(function () {
                deleteCheckListLookupLine($(this).closest("tr"));
            });
        };
        var itemSelect = function (row) {
            tms.BeforeFill("#lookupvalues");
            selectedCheckListLookupLine = grdCheckListLookupLines.GetRowDataItem(row);
            $("#txtCode").val(selectedCheckListLookupLine.TML_ITEMCODE);
            $("#txtDesc").val(selectedCheckListLookupLine.TML_ITEMDESC);
            $("#chkComments").prop("checked", selectedCheckListLookupLine.TML_COMMENTS === "+");
            $("#chkDocuments").prop("checked", selectedCheckListLookupLine.TML_DOCUMENTS === "+");
        };
        var newCheckListLookupLine = function () {
            selectedCheckListLookupLine = null;
            tms.Reset("#lookupvalues");
            $("#txtCode").val("");
            $("#txtDesc").val("");
            $("#chkComments").prop("checked", false);
            $("#chkDocuments").prop("checked", false);
        }
        var gridChange = function (e) {
            itemSelect(e.sender.select());
        };
        var listCheckListLookupLines = function () {
            grdCheckListLookupLines = new Grid({
                keyfield: "TML_ID",
                columns: [
                    {
                        type: "other",
                        field: "other",
                        title: "#",
                        template: "<button class=\"btn btn-xs btn-danger lu-remove\" type=\"button\" data-id=\"#=TML_ID#\"><i class=\"fa fa-trash fa-fw\"></i></button>",
                        filterable: false,
                        sortable: false,
                        width: 40
                    },
                    { type: "string", field: "TML_ITEMCODE", title: gridstrings.lookup[lang].code, width: 200 },
                    { type: "string", field: "TML_ITEMDESC", title: gridstrings.lookup[lang].desc, width: 200 },
                    { type: "string", field: "TML_COMMENTS", title: gridstrings.lookup[lang].comments, width: 200 },
                    { type: "string", field: "TML_DOCUMENTS", title: gridstrings.lookup[lang].documents, width: 200 }
                ],
                datasource: "/Api/ApiLookupLines/List",
                selector: "#grdCheckListLookupLines",
                name: "grdCheckListLookupLines",
                height: 370,
                primarycodefield: "TML_ITEMCODE",
                primarytextfield: "TML_ITEMDESC",
                filter: [
                    { field: "TML_CODE", value: selectedCheckListItemId, operator: "eq", logic: "and" },
                    { field: "TML_TYPE", value: "CHECKLIST", operator: "eq", logic: "and" }

                ],
                sort: [{ field: "TML_ID", dir: "asc" }],
                databound: gridDatabound,
                change: gridChange
            });
        };
        deleteCheckListLookupLine = function (row) {
            selectedCheckListLookupLine = grdCheckListLookupLines.GetRowDataItem(row);
            if (selectedCheckListLookupLine) {
                $("#lookupvalues").modal("hide");
                $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                    return tms.Ajax({
                        url: "/Api/ApiLookupLines/DelRec",
                        data: JSON.stringify(selectedCheckListLookupLine.TML_ID),
                        fn: function (d) {
                            msgs.success(d.data);
                            newCheckListLookupLine();
                            listCheckListLookupLines();
                            $("#lookupvalues").modal("show");
                        }
                    });
                }).one("click", "#cancel", function () {
                    $("#lookupvalues").modal("show");
                });
            }
        };

        this.defineCheckListLookupLines = function () {
            var $this = $(this);
            var parentdiv = $this.closest(".data-container");
            selectedCheckListItemId = parentdiv.data("id");
            newCheckListLookupLine();
            listCheckListLookupLines();
            $("#lookupvalues").modal("show");
        };
        var saveCheckListLookupLine = function () {

            if (!tms.Check("#lookupvalues"))
                return $.Deferred.resolve();

            var o = {
                TML_ID: (selectedCheckListLookupLine != null ? selectedCheckListLookupLine.TML_ID : 0),
                TML_TYPE: "CHECKLIST",
                TML_CODE: selectedCheckListItemId,
                TML_ITEMCODE: $("#txtCode").val(),
                TML_ITEMDESC: $("#txtDesc").val(),
                TML_COMMENTS: $("#chkComments").prop("checked") ? "+" : "-",
                TML_DOCUMENTS: $("#chkDocuments").prop("checked") ? "+" : "-",
                TML_CREATED: selectedCheckListLookupLine != null ? selectedCheckListLookupLine.TML_CREATED : tms.Now(),
                TML_CREATEDBY: selectedCheckListLookupLine != null ? selectedCheckListLookupLine.TML_CREATEDBY : user,
                TML_RECORDVERSION: selectedCheckListLookupLine != null ? selectedCheckListLookupLine.TML_RECORDVERSION : 0
            };

            return tms.Ajax({
                url: "/Api/ApiLookupLines/Save",
                data: JSON.stringify(o),
                fn: function (d) {
                    msgs.success(d.data);
                    newCheckListLookupLine();
                    listCheckListLookupLines();
                }
            });
        };
        var RegisterUIEvents = function () {
            $("#btnSaveCheckListLookupLine").click(function () {
                var $this = $(this);
                $this.prop("disabled", true);
                return $.when(saveCheckListLookupLine()).always(function () {
                    $this.prop("disabled", false);
                });
            });
            $("#btnAddCheckListLookupLine").click(newCheckListLookupLine);
        };

        RegisterUIEvents();
    };

    chk = new function () {

        var self = this;
        var grdCheckListTemplates = null;
        var grdCheckListTemplatesElm = $("#grdCheckListTemplates");

        this.ResetUI = function () {
            selectedrecord = null;
            tms.Reset("#record");
            $("#code").val("");
            $("#desc").val("");
            $("#org").val("");
            $("#sequential").prop("checked", false);
            $("#active").prop("checked", true);
            $(".items").hide();
        }

        this.HistoryModal = function () {
            auditModal.show({
                filter: [
                    { field: "AUD_SUBJECT", value: "TMCHECKLISTTEMPLATES", operator: "eq" },
                    { field: "AUD_REFID", value: selectedrecord.CLT_CODE, operator: "eq" }
                ]
            });
        }

        var LoadCheckListItems = function () {
            var code = $("#code").val();
            if (!code)
                return null;

            var gridreq = {
                sort: [{ field: "CHK_NO", dir: "asc" }],
                filter: {
                    filters: [
                        { field: "CHK_SOURCE", value: code, operator: "eq" },
                        { field: "CHK_SUBJECT", value: "TASK", operator: "eq" },
                        { field: "CHK_ACTIVE", value: "+", operator: "eq" }
                    ]
                },
                loadall: true
            };

            return tms.Ajax({
                url: "/Api/ApiChecklistTemplateLines/List",
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $(".checklistitems").find(".row").remove();

                    var itemcount = d.data.length;
                    if (itemcount > 0) {
                        var strCheckList = "";
                        for (var i = 0; i < d.data.length; i++) {
                            strCheckList += "<div class=\"row no-padding-left custom data-container droppable\" data-id=\"" +
                                d.data[i].CHK_ID +
                                "\"><div class=\"draggable\">" +
                                "<div class=\"col-md-1\"><div class=\"checkbox checkbox-primary\"><input class=\"styled chklistitem-necessity\" type=\"checkbox\" " +
                                (d.data[i].CHK_NECESSARY === "+" ? "checked" : "") +
                                " /><label /></div></div>" +
                                "<div class=\"col-md-1\"><span style=\"color:#FFF;margin-top:5px;\" class=\"number badge badge-info\">" +
                                d.data[i].CHK_NO +
                                "</span></div>" +
                                "<div class=\"col-md-3\">" +
                                "<div class=\"row\">" +
                                "<div class=\"col-md-8\">" +
                                "<select class=\"form-control chklistitemtype\" id=\"typ-" + d.data[i].CHK_ID + "\">" +
                                "<option " + (!d.data[i].CHK_TYPE ? "selected=\"selected\"" : "") + " value=\"\">" + applicationstrings[lang].pleaseselect + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "YESNO" ? "selected=\"selected\"" : "") + " value=\"YESNO\">" + applicationstrings[lang].checklisttypes.YESNO + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "NUMERIC" ? "selected=\"selected\"" : "") + " value=\"NUMERIC\">" + applicationstrings[lang].checklisttypes.NUMERIC + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "DATE" ? "selected=\"selected\"" : "") + " value=\"DATE\">" + applicationstrings[lang].checklisttypes.DATE + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "FREETEXT" ? "selected=\"selected\"" : "") + " value=\"FREETEXT\">" + applicationstrings[lang].checklisttypes.FREETEXT + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "LOOKUP" ? "selected=\"selected\"" : "") + " value=\"LOOKUP\">" + applicationstrings[lang].checklisttypes.LOOKUP + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "CHECKBOX" ? "selected=\"selected\"" : "") + " value=\"CHECKBOX\">" + applicationstrings[lang].checklisttypes.CHECKBOX + "</option>" +
                                "<option " + (d.data[i].CHK_TYPE === "BARCODE" ? "selected=\"selected\"" : "") + " value=\"BARCODE\">" + applicationstrings[lang].checklisttypes.BARCODE + "</option>" +
                                "</select>" +
                                "</div>" +
                                "<div class=\"col-md-4\">" +
                                "<button class=\"btn btn-checklist-lookup " + (d.data[i].CHK_TYPE !== "LOOKUP" ? "hidden" : "") + "\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></button>" +
                                "<input " + (d.data[i].CHK_COMPARE ? "value=\"" + d.data[i].CHK_COMPARE + "\"" : "") + "class=\"form-control checklist-compare " + (d.data[i].CHK_TYPE !== "BARCODE" ? "hidden" : "") + "\"></input>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "<div class=\"col-md-1\"><input type =\"text\" " +
                                (d.data[i].CHK_RATE ? "manual-rate value=\"" + d.data[i].CHK_RATE + "\"" : "") +
                                " class=\"form-control input-sm chklistitemrate\" style=\"width:40px\"></input></div>" +
                                "<div class=\"col-md-4\"><span class=\"xeditable\">" +
                                d.data[i].CHK_TEXT +
                                "</span></div>" +
                                "<div class=\"col-md-2\">" +
                                "<div class=\"input-group\">" +
                                "<input type=\"text\" maxlength=\"50\" class=\"form-control chklistitem-topic\" id=\"topic-" + d.data[i].CHK_ID + "\" value=\"" + (d.data[i].CHK_TOPIC || "") + "\" tip=\"" + (d.data[i].CHK_TOPICDESC || "") + "\">" +
                                "<span class=\"input-group-btn\">" +
                                "<button class=\"btn btn-default btn-chklistitem-topic\" type=\"button\" input-id=\"#topic-" + d.data[i].CHK_ID + "\" id=\"btnTopic-" + d.data[i].CHK_ID + "\"><i class=\"fa fa-search fa-fw\"></i></button>" +
                                "</span>" +
                                "</div></div>" +
                                "</div></div></div>";
                        }

                        $(".checklistitems").append(strCheckList);
                        $(".checklistitems span.xeditable").editable({
                            mode: "inline", clear: false
                        }).on("shown",
                            function (e, editable) {
                                editable.input.$input.attr("maxlength", "250");
                            }).on("save",
                                function (e, params) {
                                    var clitem = $(e.target).closest(".data-container");
                                    var id = clitem.data("id");
                                    var newvalue = params.newValue.substring(0, 250);
                                    var checked = clitem.find("input").prop("checked") ? "+" : "-";

                                    SyncCheckListItem({
                                        CHK_SUBJECT: "TASK",
                                        CHK_SOURCE: $("#code").val(),
                                        CHK_ID: id,
                                        CHK_TEXT: newvalue,
                                        CHK_UPDATED: tms.Now(),
                                        CHK_UPDATEDBY: user,
                                        CHK_CHECKED: checked
                                    });
                                });

                        tooltip.show(".chklistitem-topic", null, null, null, "tip");
                        $(".chklistitemrate").numericInput({ allowNegative: false, allowFloat: false });
                        $(".checklistitems").contextMenu({
                            selector: "div",
                            items: {
                                audit: {
                                    name: "Audit",
                                    callback: function () {
                                        auditModal.show({
                                            filter: [
                                                { field: "AUD_SUBJECT", value: "TMCHECKLISTTEMPLATELINES", operator: "eq" },
                                                {
                                                    field: "AUD_REFID",
                                                    value: $(this).closest(".data-container").data("id"),
                                                    operator: "eq"
                                                }
                                            ]
                                        });
                                    }
                                }
                            }
                        });

                        CalcCheckListItemRates();
                        RegisterCheckListEvnt();
                        RegisterDragAndDrop();
                    }
                }
            });
        }

        var CalcCheckListItemRates = function () {
            var v_rateinputs = $(".chklistitemrate[manual-rate]");
            var e_rateinputs = $(".chklistitemrate:not([manual-rate])");

            var manual = 0;
            var auto = 0;
            var j;

            for (j = 0; j < v_rateinputs.length; j++) {
                var v_ri = $(v_rateinputs[j]);
                manual += parseInt(v_ri.val());
                v_ri.removeClass("auto").addClass("manual");
            }

            for (j = 0; j < e_rateinputs.length; j++) {
                var e_ri = $(e_rateinputs[j]);
                var autoval = parseInt((100 - manual) / e_rateinputs.length);
                auto += autoval;
                e_ri.val(autoval);
                e_ri.removeClass("manual").addClass("auto");
            }

            if (auto + manual !== 100) {
                var diff = 100 - (auto + manual);
                for (var i = 0; i < diff; i++) {
                    var aval = parseInt($(e_rateinputs[i]).val());
                    $(e_rateinputs[i]).val(aval + 1);
                }
            }
        }

        var SyncCheckListItem = function (item) {
            return tms.Ajax({
                url: "/Api/ApiChecklistTemplateLines/Sync",
                data: JSON.stringify(item),
                quietly: true,
                fn: function (d) {
                    msgs.success(d.data);
                    return LoadCheckListItems();
                }
            });
        }

        var CalcCheckListItemTotal = function (c) {
            var v_rateinputs = $(".chklistitemrate[manual-rate]").not(c);
            var total = 0;
            for (var i = 0; i < v_rateinputs.length; i++) {
                total += parseInt($(v_rateinputs[i]).val());
            }
            total += parseInt($(c).val() ? $(c).val() : 0);
            return total;
        }

        var RegisterCheckListEvnt = function () {
            $(".chklistitemtype").on("change", function () {
                var $this = $(this);
                var parentdiv = $this.closest(".data-container");
                var id = parentdiv.data("id");
                var v = $this.find("option:selected").val();
                var btnlookup = parentdiv.find("button.btn-checklist-lookup");
                var compareinput = parentdiv.find("input.checklist-compare");

 
                if (v !== "LOOKUP")
                    btnlookup.addClass("hidden");
                else
                    btnlookup.removeClass("hidden");

                if (v !== "BARCODE")
                    compareinput.addClass("hidden");
                else
                    compareinput.removeClass("hidden");

                return tms.Ajax({
                    url: "/Api/ApiChecklistTemplateLines/UpdateCheckListItem",
                    data: JSON.stringify({
                        Id: id,
                        Type: (v || null),
                        UpdateType: "ITEMTYPE"
                    }),
                    quietly: false
                });
            });
            $(".chklistitemrate").on("focus", function () {
                $(this).data("val", $(this).val());
            }).on("change", function () {
                var $this = $(this);
                if (CalcCheckListItemTotal(this) <= 100) {
                    var id = $this.closest(".data-container").data("id");
                    var val = $this.val();
                    return tms.Ajax({
                        url: "/Api/ApiChecklistTemplateLines/UpdateCheckListItem",
                        data: JSON.stringify({
                            Id: id,
                            Rate: val,
                            UpdateType: "RATE"
                        }),
                        quietly: false,
                        fn: function (d) {
                            LoadCheckListItems();
                        }
                    });
                } else {
                    msgs.error(applicationstrings[lang].chklistitemrate100);
                    $this.val($this.data("val"));
                }
            });
            $(".chklistitem-necessity").on("change", function () {
                var $this = $(this);
                var id = $this.closest(".data-container").data("id");

                return tms.Ajax({
                    url: "/Api/ApiChecklistTemplateLines/UpdateCheckListItem",
                    data: JSON.stringify({
                        Id: id,
                        Necessary: $this.is(":checked") ? "+" : "-",
                        UpdateType: "NECESSITY"
                    }),
                    quietly: false
                });
            });
            $(".btn-chklistitem-topic").on("click", function () {
                var $this = $(this);
                var id = $this.attr("input-id");
                gridModal.show({
                    modaltitle: gridstrings.checklisttemplatetopics[lang].title,
                    listurl: "/Api/ApiChecklistTemplateTopics/List",
                    keyfield: "CHT_CODE",
                    codefield: "CHT_CODE",
                    textfield: "CHT_DESCRIPTION",
                    returninput: id,
                    columns: [
                        { type: "string", field: "CHT_CODE", title: gridstrings.checklisttemplatetopics[lang].code, width: 100 },
                        { type: "string", field: "CHT_DESCRIPTION", title: gridstrings.checklisttemplatetopics[lang].description, width: 300 }
                    ],
                    filter: [
                        { field: "CHT_ACTIVE", value: "+", operator: "eq" },
                        { field: "CHT_TEMPLATE", value: selectedrecord.CLT_CODE, operator: "eq" }
                    ]
                });
            });
            $(".chklistitem-topic").autocomp({
                listurl: "/Api/ApiChecklistTemplateTopics/List",
                geturl: "/Api/ApiChecklistTemplateTopics/Get",
                field: "CHT_CODE",
                textfield: "CHT_DESCRIPTION",
                active: "CHT_ACTIVE",
                filter: [
                    { field: "CHT_TEMPLATE", value: selectedrecord.CLT_CODE, operator: "eq" }
                ]
            });
            $("button.btn-checklist-lookup").click(lookup.defineCheckListLookupLines);
            $(".chklistitem-topic").on("change", function () {
                var $this = $(this);
                var id = $this.closest(".data-container").data("id");

                return tms.Ajax({
                    url: "/Api/ApiChecklistTemplateLines/UpdateCheckListItem",
                    data: JSON.stringify({
                        Id: id,
                        Topic: ($this.val() || null),
                        UpdateType: "TOPIC"
                    }),
                    quietly: false
                });
            });
            $("input.checklist-compare").on("change", function () {
                var $this = $(this);
                var id = $this.closest(".data-container").data("id");

                return tms.Ajax({
                    url: "/Api/ApiChecklistTemplateLines/UpdateCheckListItem",
                    data: JSON.stringify({
                        Id: id,
                        Compare: ($this.val() || null),
                        UpdateType: "COMPARE"
                    }),
                    quietly: false
                });
            });
        }

        var RegisterDragAndDrop = function () {
            $(".draggable").draggable({
                snap: "true",
                revert: function (event) {
                    $(this).data("fc", !event);
                    return !event;
                }
            });

            $(".droppable").droppable({
                hoverClass: "drop-hover",
                tolerance: "intersect",
                accept: ".draggable",
                greedy: true,
                drop: function (event, ui) {
                    var code = $("#code").val();
                    var t = ui.draggable.closest(".data-container").data("id");
                    var fo = ui.draggable.closest(".data-container").find(".number").text();
                    var to = $(this).closest(".data-container").find(".number").text();
                    ui.draggable.find("span.xeditable").editable("destroy");

                    setTimeout(function () {
                        $(ui.draggable).promise().done(function () {
                            if (!ui.draggable.data("fc")) {
                                return tms.Ajax({
                                    url: "/Api/ApiChecklistTemplateLines/MoveChecklistItem",
                                    data: JSON.stringify({
                                        Subject: "TASK",
                                        Source: code,
                                        To: t,
                                        FromOrder: fo,
                                        ToOrder: to
                                    }),
                                    quietly: true,
                                    fn: function (d) {
                                        self.LoadSelected();
                                    }
                                });
                            }
                        });
                    },
                        100);
                }
            });
        }

        var FillUserInterface = function () {

            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");
            tms.Tab();

            $("#code").val(selectedrecord.CLT_CODE);
            $("#desc").val(selectedrecord.CLT_DESC);
            $("#sequential").prop("checked", selectedrecord.CLT_SEQUENTIAL === "+");
            $("#active").prop("checked", selectedrecord.CLT_ACTIVE === "+");
            $(".items").show();
            $("#org").val(selectedrecord.CLT_ORG);
            $(".page-header>h6").html(selectedrecord.CLT_CODE + " - " + selectedrecord.CLT_DESC);



            LoadCheckListItems();
        }

        this.LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiChecklistTemplates/Get",
                data: JSON.stringify(selectedrecord.CLT_CODE),
                fn: function (d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        }

        this.Remove = function () {
            if (selectedrecord) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiChecklistTemplates/DelRec",
                            data: JSON.stringify(selectedrecord.CLT_CODE),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                $(".list-group").list("refresh");
                            }
                        });
                    });
            }
        }

        this.Save = function () {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                CLT_CODE: $("#code").val().toUpper(),
                CLT_DESC: $("#desc").val(),
                CLT_SEQUENTIAL: $("#sequential").prop("checked") ? "+" : "-",
                CLT_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                CLT_ORG: $("#org").val(),
                CLT_CREATED: selectedrecord != null ? selectedrecord.CLT_CREATED : tms.Now(),
                CLT_CREATEDBY: selectedrecord != null ? selectedrecord.CLT_CREATEDBY : user,
                CLT_UPDATED: selectedrecord != null ? tms.Now() : null,
                CLT_UPDATEDBY: selectedrecord != null ? user : null,
                CLT_RECORDVERSION: selectedrecord != null ? selectedrecord.CLT_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiChecklistTemplates/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    FillUserInterface();
                    $(".list-group").data("id", selectedrecord.CLT_CODE).list("refresh");
                }
            });
        }

        var AddChklistItem = function () {
            if ($("#txtItem").val()) {
                var rowcnt = $(".checklistitems").find(".data-container").length;
                var o = JSON.stringify({
                    CHK_SUBJECT: "TASK",
                    CHK_SOURCE: $("#code").val(),
                    CHK_NO: (rowcnt + 1),
                    CHK_TEXT: $("#txtItem").val().substring(0, 250),
                    CHK_TOPIC: null,
                    CHK_NECESSARY: "-",
                    CHK_ACTIVE: "+",
                    CHK_CREATED: tms.Now(),
                    CHK_CREATEDBY: user
                });

                return tms.Ajax({
                    url: "/Api/ApiChecklistTemplateLines/Save",
                    data: o,
                    fn: function (d) {
                        msgs.success(d.data);
                        $("#txtItem").val("");
                        LoadCheckListItems();
                    }
                });
            }
        }

        var RegisterTabChange = function () {
            $("ul.nav.nav-tabs a").on("shown.bs.tab", function (e) {
                var activatedTab = e.target.hash; // activated tab
                switch (activatedTab) {
                    case "#list":
                        self.ResetUI();
                        self.List();
                        break;
                    case "#record":
                        $("#btnSave").prop("disabled", false);
                        if (!selectedrecord)
                            self.ResetUI();
                        else
                            self.LoadSelected();
                        break;
                    case "#topics":
                        top.ResetUI();
                        top.List();
                        break;
                }
                scr.Configure();
            });
        };

        var RegisterUiEvents = function () {
            $("#btnSave").click(function () {
                var $this = $(this);
                $this.prop("disabled", true);
                $.when(self.Save()).always(function () {
                    $this.prop("disabled", false);
                });
            });
            $("#btnDelete").click(function () {
                var $this = $(this);
                $this.prop("disabled", true);
                $.when(self.Remove()).always(function () {
                    $this.prop("disabled", false);
                });
            });
            $("#btnNew").click(function () {
                selectedrecord = null;
                if (tms.ActiveTab() === "record")
                    self.ResetUI();
                else
                    $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#btnAddChklistItem").click(AddChklistItem);

            RegisterTabChange();
        }

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
                        {
                            type: "string",
                            field: "ORG_CODE",
                            title: gridstrings.org[lang].organization,
                            width: 100
                        },
                        { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                    ],
                    filter: [
                        { field: "ORG_ACTIVE", value: "+", operator: "eq" },

                    ],
                });
            });
        };

        var AutoComplete = function () {
            $("#org").autocomp({
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                geturl: "/Api/ApiOrgs/Get",
                field: "ORG_CODE",
                textfield: "ORG_DESCF",
                active: "ORG_ACTIVE"

            });

        };

        var ItemSelect = function (row) {
            selectedrecord = grdCheckListTemplates.GetRowDataItem(row);
            $(".page-header h6").html(selectedrecord.CLT_CODE + " - " + selectedrecord.CLT_DESC);
            tms.Tab();
        };

        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };

        var GridDataBound = function () {
            grdCheckListTemplatesElm.find("[data-id]").on("dblclick", function () {
                $(".nav-tabs a[href=\"#record\"]").tab("show");
            });
        };

        this.List = function () {
            var gridfilter = [];
            if (grdCheckListTemplates) {
                grdCheckListTemplates.ClearSelection();
                grdCheckListTemplates.RunFilter(gridfilter);
            } else {
                grdCheckListTemplates = new Grid({
                    keyfield: "CLT_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "CLT_CODE",
                            title: gridstrings.checklisttemplates[lang].code,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CLT_DESC",
                            title: gridstrings.checklisttemplates[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "CLT_ORG",
                            title: gridstrings.checklisttemplates[lang].org,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CLT_SEQUENTIAL",
                            title: gridstrings.checklisttemplates[lang].sequential,
                            width: 250
                        },
                        {
                            type: "string",
                            field: "CLT_ACTIVE",
                            title: gridstrings.checklisttemplates[lang].active,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "CLT_CREATED",
                            title: gridstrings.checklisttemplates[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CLT_CREATEDBY",
                            title: gridstrings.checklisttemplates[lang].createdby,
                            width: 250
                        },
                        {
                            type: "datetime",
                            field: "CLT_UPDATED",
                            title: gridstrings.checklisttemplates[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CLT_UPDATEDBY",
                            title: gridstrings.checklisttemplates[lang].updatedby,
                            width: 250
                        }
                    ],
                    fields:
                    {
                        CLT_CREATED: { type: "date" },
                        CLT_UPDATED: { type: "date" },
                    },
                    datasource: "/Api/ApiChecklistTemplates/List",
                    selector: "#grdCheckListTemplates",
                    name: "grdCheckListTemplates",
                    height: constants.defaultgridheight - 125,
                    primarycodefield: "CLT_CODE",
                    primarytextfield: "CLT_DESC",
                    visibleitemcount: 10,
                    filter: gridfilter,
                    filterlogic: "or",
                    sort: [{ field: "CLT_CODE", dir: "asc" }],
                    toolbarColumnMenu: true,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"contracts.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].save #\" class=\"btn btn-default btn-sm\" id=\"save\"><i class=\"fa fa-floppy-o\"></i></a>"
                        ]
                    },
                    databound: GridDataBound,
                    change: GridChange
                });
            }
        };

        this.BuildUI = function () {
            RegisterUiEvents();
            self.ResetUI();
            self.List();
            BuildModals();
            AutoComplete();
        }

    }

    top = new function () {
        var grdTopics = null;
        var grdTopicsElm = $("#grdTopics");
        var selectedTopic = null;
        var self = this;

        this.ResetUI = function () {
            selectedTopic = null;

            tms.Reset("#topics");

            $("#topiccode").val("");
            $("#topicdescription").val("");
            $("#topicactive").prop("checked", true);
            $("#allownewline").prop("checked", false);


        };
        var FillUserInterface = function () {

            tms.BeforeFill("#topics");

            $("#topiccode").val(selectedTopic.CHT_CODE);
            $("#topicdescription").val(selectedTopic.CHT_DESCRIPTION);
            $("#topicactive").prop("checked", selectedTopic.CHT_ACTIVE === "+");
            $("#allownewline").prop("checked", selectedTopic.CHT_ALLOWNEWLINE === "+");


        };
        var LoadSelected = function () {
            return tms.Ajax({
                url: "/Api/ApiChecklistTemplateTopics/Get",
                data: JSON.stringify(selectedTopic),
                fn: function (d) {
                    selectedTopic = d.data;
                    FillUserInterface();
                }
            });
        };
        var ItemSelect = function (row) {
            selectedTopic = grdTopics.GetRowDataItem(row);
            LoadSelected();
        };
        var GridChange = function (e) {
            ItemSelect(e.sender.select());
        };
        this.Save = function () {
            if (!tms.Check("#topics"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                CHT_TEMPLATE: selectedrecord.CLT_CODE,
                CHT_CODE: $("#topiccode").val(),
                CHT_DESCRIPTION: $("#topicdescription").val(),
                CHT_ACTIVE: $("#topicactive").prop("checked") ? "+" : "-",
                CHT_ALLOWNEWLINE: $("#allownewline").prop("checked") ? "+" : "-",
                CHT_SQLIDENTITY: selectedTopic != null ? selectedTopic.CHT_SQLIDENTITY : 0,
                CHT_CREATED: selectedTopic != null ? selectedTopic.CHT_CREATED : tms.Now(),
                CHT_CREATEDBY: selectedTopic != null ? selectedTopic.CHT_CREATEDBY : user,
                CHT_UPDATED: selectedTopic != null ? tms.Now() : null,
                CHT_UPDATEDBY: selectedTopic != null ? user : null,
                CHT_RECORDVERSION: selectedTopic != null ? selectedTopic.CHT_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiChecklistTemplateTopics/Save",
                data: o,
                fn: function (d) {
                    msgs.success(d.data);
                    self.ResetUI();
                    self.List();
                }
            });
        };
        this.Delete = function () {
            if (selectedTopic) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiChecklistTemplateTopics/DelRec",
                            data: JSON.stringify(selectedTopic),
                            fn: function (d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        this.List = function () {
            var grdFilter = [{
                field: "CHT_TEMPLATE",
                value: selectedrecord.CLT_CODE,
                operator: "eq",
                logic: "and"
            }];
            if (grdTopics) {
                grdTopics.ClearSelection();
                grdTopics.RunFilter(grdFilter);
            } else {
                grdTopics = new Grid({
                    keyfield: "CHT_CODE",
                    columns: [
                        {
                            type: "string",
                            field: "CHT_CODE",
                            title: gridstrings.checklisttemplatetopics[lang].code,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CHT_DESCRIPTION",
                            title: gridstrings.checklisttemplatetopics[lang].description,
                            width: 350
                        },
                        {
                            type: "string",
                            field: "CHT_ACTIVE",
                            title: gridstrings.checklisttemplatetopics[lang].active,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CHT_ALLOWNEWLINE",
                            title: gridstrings.checklisttemplatetopics[lang].allownewline,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "CHT_CREATED",
                            title: gridstrings.checklisttemplatetopics[lang].created,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CHT_CREATEDBY",
                            title: gridstrings.checklisttemplatetopics[lang].createdby,
                            width: 200
                        },
                        {
                            type: "datetime",
                            field: "CHT_UPDATED",
                            title: gridstrings.checklisttemplatetopics[lang].updated,
                            width: 200
                        },
                        {
                            type: "string",
                            field: "CHT_UPDATEDBY",
                            title: gridstrings.checklisttemplatetopics[lang].updatedby,
                            width: 200
                        }

                    ],
                    datasource: "/Api/ApiChecklistTemplateTopics/List",
                    selector: "#grdTopics",
                    name: "grdTopics",
                    height: 350,
                    filter: grdFilter,
                    sort: [{
                        field: "CHT_CODE",
                        dir: "asc"
                    }],
                    change: GridChange,
                    toolbar: {
                        right: [
                            "<a title=\"#= applicationstrings[lang].recordcount #\" class=\"btn btn-default btn-sm\" id=\"count\"><i class=\"fa fa-eye\"></i></a>",
                            "<a title=\"#= applicationstrings[lang].download #\" download=\"checklisttemplatetopics.xlsx\" class=\"btn btn-default btn-sm\" id=\"export\"><i class=\"fa fa-file-excel-o\"></i></a>"
                        ]
                    }
                });
            }
        };
        var RegisterUIEvents = function () {
            $("#btnAddTopic").click(self.ResetUI);
            $("#btnSaveTopic").click(self.Save);
            $("#btnDeleteTopic").click(self.Delete);
        };
        RegisterUIEvents();
    };

    scr = new function () {
        this.BindHotKeys = function () {
            tms.RegisterShortcuts([{
                k: "ctrl+s",
                f: function () {
                    switch (tms.ActiveTab()) {
                        case "record":
                            if (!$("#btnSave").prop("disabled"))
                                chk.Save();
                            break;
                        case "topics":
                            if (!$("#btnSaveTopic").prop("disabled"))
                                top.Save();
                            break;
                    }
                }
            },
            {
                k: "ctrl+r",
                f: function () {
                    switch (tms.ActiveTab()) {
                        case "record":
                            if (!$("#btnNew").prop("disabled"))
                                chk.ResetUI();
                            break;
                        case "topics":
                            if (!$("#btnAddTopic").prop("disabled"))
                                top.ResetUI();
                            break;
                    }
                }
            },
            {
                k: "ctrl+u",
                f: function () {
                    if (!$("#btnUndo").prop("disabled"))
                        chk.LoadSelected();
                }
            },
            {
                k: "ctrl+d",
                f: function () {
                    switch (tms.ActiveTab()) {
                        case "record":
                            if (!$("#btnDelete").prop("disabled"))
                                chk.Delete();
                            break;
                        case "topics":
                            if (!$("#btnDeleteTopic").prop("disabled"))
                                top.Delete();
                            break;
                    }
                }
            },
            {
                k: "ctrl+h",
                f: function () {
                    if (!$("#btnHistory").prop("disabled"))
                        chk.HistoryModal();
                }
            },
            {
                k: "ctrl+q",
                f: function () {
                    if (!$("#btnTranslations").prop("disabled"))
                        chk.TranslationModal();
                }
            }
            ]);
        };
        this.LoadSelected = function () {
            return $.when(chk.LoadSelected()).done(function () {
                switch (tms.ActiveTab()) {
                    case "topics":
                        top.ResetUI();
                        top.List();
                        break;
                }
            });
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
        chk.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);


}());