$(function () {
    var selectedrecord = null;
    var documentsHelper;
    var commentsHelper;
    var selectedrecordguide = null;
    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        $("#url").val("");
        $("#cls").val("");
        $("#controller").val("");
        $("#active").prop("checked", true);

        $("#comment,#addComment,#fu").prop("disabled", true);
        $("#btnBrowse").attr("disabled", "disabled");
        $("#enduserguide").summernote('code', " ");
        $("#adminguide").summernote('code', " ");
        selectedrecordguide = null;

        commentsHelper.clearComments();
        documentsHelper.clearDocuments();
    }

    function historyModal() {
        auditModal.show({
            filter: [
                { field: "AUD_SUBJECT", value: "TMSCREENS", operator: "eq" },
                { field: "AUD_REFID", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function translationModal() {
        translation.modal.show({
            filter: [
                { field: "DES_CLASS", value: "TMSCREENS", operator: "eq" },
                { field: "DES_PROPERTY", value: "SCR_DESC", operator: "eq" },
                { field: "DES_CODE", value: $("#code").val(), operator: "eq" }
            ]
        });
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.SCR_CODE);
        $("#desc").val(selectedrecord.SCR_DESCF);
        $("#url").val(selectedrecord.SCR_URL);
        $("#controller").val(selectedrecord.SCR_CONTROLLER);
        $("#cls").val(selectedrecord.SCR_CLASS);
        $("#active").prop("checked", selectedrecord.SCR_ACTIVE === "+");

        $(".page-header>h6").html(selectedrecord.SCR_CODE + " - " + selectedrecord.SCR_DESCF);

        $("#docuprogress").text("0%");
        $("#docuprogress").css("width", "0");

        $("#comment,#addComment,#fu").prop("disabled", false);
        $("#btnBrowse").removeAttr("disabled");

        commentsHelper.showCommentsBlock({ subject: "SCREENS", source: selectedrecord.SCR_CODE });
        documentsHelper.showDocumentsBlock({ subject: "SCREENS", source: selectedrecord.SCR_CODE });

        if (selectedrecord.SCR_HASGUIDE == '+') {

            return tms.Ajax({
                url: "/Api/ApiScreens/GetGuide",
                data: JSON.stringify(selectedrecord.SCR_CODE),
                fn: function (d) {
                    selectedrecordguide = d.data;
                    $("#enduserguide").summernote('code', selectedrecordguide.SCG_ENDUSERGUIDE);
                    $("#adminguide").summernote('code', selectedrecordguide.SCG_ADMINGUIDE);
                }
            });
        }
        else {
            $("#enduserguide").summernote('code', " ");
            $("#adminguide").summernote('code', " ");
            selectedrecordguide = null;
        }


    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiScreens/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();

            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.SCR_CODE;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete")
                    .one("click",
                        "#delete",
                        function () {
                            return tms.Ajax({
                                url: "/Api/ApiScreens/DelRec",
                                data: JSON.stringify(code),
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
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        var o = JSON.stringify({
            SCR_CODE: $("#code").val().toUpper(),
            SCR_DESC: $("#desc").val(),
            SCR_URL: $("#url").val(),
            SCR_CLASS: ($("#cls").val() || null),
            SCR_CONTROLLER: $("#controller").val(),
            SCR_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            SCR_HASGUIDE: screenGuideCheck(),
            SCR_CREATED: selectedrecord != null ? selectedrecord.SCR_CREATED : tms.Now(),
            SCR_CREATEDBY: selectedrecord != null ? selectedrecord.SCR_CREATEDBY : user,
            SCR_UPDATED: selectedrecord != null ? tms.Now() : null,
            SCR_UPDATEDBY: selectedrecord != null ? user : null,
            SCR_RECORDVERSION: selectedrecord != null ? selectedrecord.SCR_RECORDVERSION : 0
        });

        return tms.Ajax({
            url: "/Api/ApiScreens/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                saveOrDeleteGuide(selectedrecord.SCR_CODE);
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.SCR_CODE).list("refresh");

            }
        });
    }

    function screenGuideCheck() {
        var stradminguide = $("#adminguide").summernote('code').trim() || null;
        var strenduserguide = $("#enduserguide").summernote('code').trim() || null;
        return ((!!stradminguide || !!strenduserguide) ? "+" : "-");
    }

    function saveOrDeleteGuide(scrcode) {

        var stradminguide = $("#adminguide").summernote('code').trim() || null;
        var strenduserguide = $("#enduserguide").summernote('code').trim() || null;

        if (!!stradminguide || !!strenduserguide) {
            var guide_object = JSON.stringify({
                SCG_SCREENCODE: scrcode,
                SCG_ENDUSERGUIDE: strenduserguide,
                SCG_ADMINGUIDE: stradminguide,
                SCG_CREATED: selectedrecordguide != null ? selectedrecordguide.SCG_CREATED : tms.Now(),
                SCG_CREATEDBY: selectedrecordguide != null ? selectedrecordguide.SCG_CREATEDBY : user,
                SCG_UPDATED: selectedrecordguide != null ? tms.Now() : null,
                SCG_UPDATEDBY: selectedrecordguide != null ? user : null
            });

            return tms.Ajax({
                url: "/Api/ApiScreens/SaveGuide",
                data: guide_object,
                fn: function (d) {
                    selectedrecordguide = d.r;
                    $("#enduserguide").summernote('code', selectedrecordguide.SCG_ENDUSERGUIDE);
                    $("#adminguide").summernote('code', selectedrecordguide.SCG_ADMINGUIDE);
                }
            });
        }
        else {
            return tms.Ajax({
                url: "/Api/ApiScreens/DelGuide",
                data: JSON.stringify(scrcode)
            });
        }

    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
        $("#btnHistory").click(historyModal);
        $("#btnTranslations").click(translationModal);
        $("#btnClass").click(function () {
            gridModal.show({
                modaltitle: gridstrings.table[lang].title,
                listurl: "/Api/ApiAuditClasses/List",
                keyfield: "AUC_ID",
                codefield: "AUC_CLASS",
                textfield: "AUC_DESC",
                returninput: "#cls",
                columns: [
                    { type: "string", field: "AUC_CLASS", title: gridstrings.table[lang].table, width: 100 },
                    { type: "string", field: "AUC_DESC", title: gridstrings.table[lang].description, width: 400 }
                ]
            });
        });
        $("#cls").autocomp({
            listurl: "/Api/ApiAuditClasses/List",
            field: "AUC_CLASS",
            textfield: "AUC_DESC"
        });



        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentsdiv: "#docs",
            progressbar: "#docuprogress"
        });
        commentsHelper = new comments({ input: "#comment", btnaddcomment: "#addComment", commentsdiv: "#comments" });
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
            },
            {
                k: "ctrl+q",
                e: "#btnTranslations",
                f: function () {
                    translationModal();
                }
            }
        ]);
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiScreens/List",
            fields: {
                keyfield: "SCR_CODE",
                descfield: "SCR_DESCF"
            },
            sort: [{ field: "SCR_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        setSummerNote();
        registerUiEvents();
        resetUI();
        List();

    }

    function setSummerNote() {
        var changeUserAdmin = function (context) {
            var uiadmin = $.summernote.ui;
            var buttonadmin = uiadmin.button({
                contents: '<i class="fa fa-user"/>',
                tooltip: applicationstrings[lang].admin,
                click: function () {
                    $("#title").html(applicationstrings[lang].adminguide);
                    $("#endusernoter").hide();
                    $("#adminnoter").show();

                }
            });

            return buttonadmin.render();
        }

        var changeUserEnd = function (context) {
            var uiend = $.summernote.ui;
            var buttonend = uiend.button({
                contents: '<i class="fa fa-user"/>',
                tooltip: applicationstrings[lang].user,
                click: function () {
                    $("#title").html(applicationstrings[lang].enduserguide);
                    $("#endusernoter").show();
                    $("#adminnoter").hide();
                }
            });
            return buttonend.render();
        }

        $("#enduserguide").summernote({
            lang: culture,
            height: 300,
            toolbar: [
                ['mybutton', ['admin']],
                ["view", ["fullscreen", "codeview"]],
                ["style", ["style"]],
                ["font", ["bold", "italic", "underline", "clear"]],
                ["fontname", ["fontname"]],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]]
            ],
            buttons: {
                admin: changeUserAdmin
            }
        });

        $("#adminguide").summernote({
            lang: culture,
            height: 300,
            toolbar: [
                ['mybutton', ['enduser']],
                ["view", ["fullscreen", "codeview"]],
                ["style", ["style"]],
                ["font", ["bold", "italic", "underline", "clear"]],
                ["fontname", ["fontname"]],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]]
            ],
            buttons: {
                enduser: changeUserEnd
            }
        });
        $("#adminnoter").hide();
    }

    function ready() {


        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
})