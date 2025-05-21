var documents = function (p) {
    var ho = p;
    var files = [];
    var viewer;
    var imagergx = /(\.|\/)(gif|jpe?g|png)$/i;
    var clipboard;

    function clearDocuments(enableBrowse) {
        $(ho.documentsdiv).find("div").remove();
        if (!enableBrowse) {
            $(ho.input).attr("disabled", "disabled");
            $(ho.input).parent().addClass("disabled");
        }
        $(ho.uploadbtn).attr("disabled", "disabled");
        if (!ho.downloadbutton)
            $(ho.downloadbutton).attr("href", "#").attr("disabled", "disabled");

    }

    function resetUploadControls() {
        files = [];
        $(ho.uploadbtn).attr("disabled", true);
        $(ho.filename).find("*").remove();
        if (ho.progressbar) {
            $(ho.progressbar).css("width", "0%");
            $(ho.progressbar).text("0%");
        }
    }

    var registerDocumentsHelper = function () {
        files = [];
        $(document).bind("drop dragover", function (e) { e.preventDefault(); });
        $(document).bind("dragover", function (e) {
            var dropZone = $(ho.documentsdiv),
                timeout = window.dropZoneTimeout;
            if (timeout) {
                clearTimeout(timeout);
            } else {
                dropZone.addClass("in");
            }
            var hoveredDropZone = $(e.target).closest(dropZone);
            dropZone.toggleClass("hover", hoveredDropZone.length);
            window.dropZoneTimeout = setTimeout(function () {
                window.dropZoneTimeout = null;
                dropZone.removeClass("in");
            }, 100);
        });
        $(ho.input).fileupload({
            maxNumberOfFiles: 50,
            autoUpload: false,
            dropZone: $(ho.documentsdiv),
            pasteZone: $(ho.documentsdiv),
            change: function (e, data) {

                resetUploadControls();
                $.each(data.files, function (k, v) {
                    var filecheck = ho.imageonly ? imagergx.test(v.type) : true;
                    if (filecheck) {
                        $(ho.filename).append("<span class=\"badge badge-info\">" + v.name + "</span> ");
                    }
                });
                if (ho.progressbar) {
                    $(ho.progressbar).text("0%");
                    $(ho.progressbar).css("width", "0");
                }
            },
            add: function (e, data) {
                $.each(data.files, function (idx, file) {
                    var filecheck = ho.imageonly ? imagergx.test(file.type) : true;
                    if (filecheck) {
                        files.push(file);
                    }
                    else {
                        msgs.error(applicationstrings[lang].invalidfiletype);
                    }
                });
                if (files.length > 0)
                    $(ho.uploadbtn).removeAttr("disabled");
            },
            progressall: function (e, data) {
                if (ho.progressbar) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $(ho.progressbar).css("width", progress + "%");
                    $(ho.progressbar).text(progress + "%");
                }
            },
            drop: function (e, data) {
                $(ho.filename).find("*").remove();
                $.each(data.files, function (k, v) {
                    var filecheck = ho.imageonly ? imagergx.test(v.type) : true;
                    if (filecheck) {
                        $(ho.filename).append("<span class=\"badge badge-info\">" + v.name + "</span> ");
                    }
                });
                if (ho.progressbar) {
                    $(ho.progressbar).text("0%");
                    $(ho.progressbar).css("width", "0");
                }
            }
        });
        $(ho.container).off("upload").on("upload", function (evnt, d) {
            if (files.length > 0) {
                $(ho.input).fileupload("send", { files: files, formData: d }).success(function (d1) {
                    switch (d1.status) {
                        case 200:
                            msgs.success(d1.data);
                            return (function (a) {
                                return $.when(loadDocuments({ subject: a.subject, source: a.source }).done(function (d2) {
                                    resetUploadControls();
                                    buildDocDiv({ data: d2.data, subject: a.subject, source: a.source });
                                    files = [];
                                }));
                            }(d1));
                        case 300:
                            tms.Redirect2Login();
                            break;
                        case 500:
                            msgs.error(d1.data);
                            break;
                    }
                }).error(function (xhr) {
                    if (xhr.status)
                        msgs.error(xhr.statusText);
                });
            }           
        });

        if (ho.enableclipboardpaste) {


            document.onpaste = function (event) {
                if (clipboard) {
                    // use event.originalEvent.clipboard for newer chrome versions
                    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                    console.log(JSON.stringify(items)); // will give you the mime types
                    // find pasted image among pasted items
                    var blob = null;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf("image") === 0) {
                            blob = items[i].getAsFile();
                        }
                    }
                    // load image if there is a pasted image
                    if (blob !== null) {
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            return tms.Ajax({
                                url: "/Api/ApiDocuments/UploadFromClipboard",
                                data: JSON.stringify({
                                    Source: clipboard.source,
                                    Subject: clipboard.subject,
                                    Data: event.target.result
                                }),
                                fn: function (d) {
                                    msgs.success(d.data);
                                    return $.when(loadDocuments({ subject: clipboard.subject, source: clipboard.source }).done(function (d1) {
                                        resetUploadControls();
                                        buildDocDiv({ data: d1.data, subject: clipboard.subject, source: clipboard.source });
                                        files = [];
                                    }));
                                }
                            });
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            }
          
        }
    };

    function loadDocuments(o) {
        return tms.Ajax({
            url: "/Api/ApiDocuments/ListQuick",
            data: JSON.stringify({
                Source: o.source,
                Subject: o.subject,
                ShowAll : (o.showall || "-")
            }),
            fn: function (d) {
                $(ho.input).prop("disabled", false);
                if (ho.downloadbutton)
                    $(ho.downloadbutton).prop("disabled", d.data.length === 0);
                if (ho.documentcounttext) {
                    var doccnt = $(ho.documentcounttext.replace("#source#", o.source));
                    doccnt.text(d.data.length);
                }
            }
        });
    }

    function buildDocDiv(p) {

        $(ho.documentsdiv).find("div").remove();
        var doccountdiv = ho.documentsdiv + "_doccount";

        var totalsize = 0;
        if (p.data.length > 0) {
            totalsize = p.data.reduce((s, f) => s + (f.DOC_SIZE / 1024 / 1024), 0);
        }
        if ($(doccountdiv).length === 0) {
            $("<div id=\"" + doccountdiv.replace("#", "") + "\" class=\"well\"><strong>" + applicationstrings[lang].doccount + " : " + p.data.length + " (" + totalsize.toFixed(2) + " MB)</strong></div>").insertBefore(ho.documentsdiv);
        }
        else {
            $(doccountdiv).html("<strong>" + applicationstrings[lang].doccount + " : " + p.data.length || 0 + " (" + totalsize.toFixed(2) + " MB)</strong>");
        }

        var str = "";
        for (var i = 0; i < p.data.length; i++) {
            var doci = p.data[i];
            str += "<div data-id=\"" + doci.DOC_ID + "\" class=\"row doc\">";
            str += buildThumbnailStr(doci);
            str += "</div>";
        }

        $(ho.documentsdiv).append(str);
        $(ho.documentsdiv).find("button.btn-TM_DELDOC").on("click", function () {
            var docrow = $(this).closest(".row");
            $("#confirm").modal().off("click", "#delete").one("click", "#delete", function () {
                return tms.Ajax({
                    url: "/Api/ApiDocuments/DelRec",
                    data: JSON.stringify(docrow.data("id")),
                    fn: function (d1) {
                        msgs.success(d1.data);
                        docrow.fadeOut(500, function () { $(this).remove(); });
                        return $.when(loadDocuments({ subject: p.subject, source: p.source }).done(function (d1) {
                            buildDocDiv({ data: d1.data, subject: p.subject, source: p.source });
                        }));
                    }
                });
            });
        });
        if (ho.checkbox) {
            $(ho.documentsdiv).find("input.doc-check").on("click",
                function() {
                    var $this = $(this);
                    var isChecked = $(this).is(":checked") ? "+" : "-";
                    var docrow = $this.closest(".row");
                    return tms.Ajax({
                        url: "/Api/ApiDocuments/CheckUncheckDocument",
                        data: JSON.stringify({ 
                            CHK_DOCID: docrow.data("id"),
                            CHK_VALUE : isChecked
                        }),  
                        err: function (d) {
                            $this.prop("checked", false);
                        }
                    });

                });
        }

        var docs = $(ho.documentsdiv).get(0);
        if (viewer)
            viewer.destroy();
        viewer = new Viewer(docs, { url: "data-original", navbar: p.data.length <= 100 });

    }

    function showDocumentsModal(o) {

        clipboard = {
            subject: o.subject,
            source: o.source
        };

        return $.when(loadDocuments(o)).done(function (d) {        
            buildDocDiv({ subject: o.subject, source: o.source, data: d.data });
            $(ho.uploadbtn).off("click").on("click", function () {
                var doctype = ($(ho.doctype).val() || $("#doctype").val() || "");
                var ext = {
                    DOC_SOURCE: o.source,
                    DOC_SUBJECT: o.subject,
                    DOC_TYPE: doctype
                };
                $(ho.container).trigger("upload", ext);
            });
            $(ho.modal).modal("show");
        });
    }

    function triggerDocumentsUpload(o) {
        var doctype = ($(ho.doctype).val() || $("#doctype").val() || "");
        var ext = {
            DOC_SOURCE: o.source,
            DOC_SUBJECT: o.subject,
            DOC_TYPE: doctype
        };
        $(ho.container).trigger("upload", ext);
    }

    function showDocumentsBlock(o) {

        clipboard = {
            subject: o.subject,
            source: o.source
        };

        return $.when(loadDocuments(o)).done(function (d) {
            buildDocDiv({ subject: o.subject, source: o.source, data: d.data });
            $(ho.uploadbtn).off("click").on("click", function () {
                var doctype = ($(ho.doctype).val() || $("#doctype").val() || "");
                var ext = {
                    DOC_SOURCE: o.source,
                    DOC_SUBJECT: o.subject,
                    DOC_TYPE: doctype
                };
                $(ho.container).trigger("upload", ext);
            });
        });
    }

    function buildThumbnailStr(d) {
        var icostr = "";
        var contentType = d.DOC_CONTENTTYPE;

        var filename = d.DOC_OFN;
        if (ho.checkbox) {
            var filename =
                "<div class=\"checkbox checkbox-primary\"><input type=\"checkbox\"" + (d.DOC_CHECK === "+" ? " checked " : "") + " class=\"styled doc-check\" id=\"chk" +
                    d.DOC_ID +
                    "\" autocomplete=\"off\">" +
                    "<label>" +
                    d.DOC_OFN +
                    "</label></div>";
        }
        switch (contentType) {
            case "text/css":
                icostr += "<div class=\"col-md-3\"><div class=\"doc-thumb\"><a href=\"/File.ashx?id=" +
                    d.DOC_ID +
                    "&guid=" + d.DOC_GUID + "\"><i class=\"fa fa-file-code-o fa-4x\"></i></a></div></div>" +
                    "<div class=\"col-md-8\"><p>" +
                    filename +
                    "</p><p class=\"sub-inf\"><i class=\"fa fa-clock-o\"></i> " +
                    moment(d.DOC_CREATED).format(constants.longdateformat) +
                    "</p><p>" +
                    d.DOC_CREATEDBYDESC +
                    "</p><p>" +
                    (d.DOC_TYPEDESC ? "<span class=\"badge badge-warning\">" + d.DOC_TYPEDESC + "</span>" : "") +
                    "</p><p><span class=\"badge badge-info\">" +
                    (d.DOC_SIZE / 1024).fixed(2) + " KB" +
                    "</span></p></div>";
                break;
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                icostr += "<div class=\"col-md-3\"><div class=\"doc-thumb\"><a href=\"/File.ashx?id=" +
                    d.DOC_ID +
                    "&guid=" + d.DOC_GUID + "\"><i class=\"fa fa-file-powerpoint-o fa-4x\"></i></a></div></div><div class=\"col-md-8\"><p>" +
                    filename +
                    "</p><p class=\"sub-inf\"><i class=\"fa fa-clock-o\"></i> " +
                    moment(d.DOC_CREATED).format(constants.longdateformat) +
                    "</p><p>" +
                    d.DOC_CREATEDBYDESC +
                    "</p><p>" +
                    (d.DOC_TYPEDESC ? "<span class=\"badge badge-warning\">" + d.DOC_TYPEDESC + "</span>" : "") +
                    "</p><p><span class=\"badge badge-info\">" +
                    (d.DOC_SIZE / 1024).fixed(2) + " KB" +
                    "</span></p></div>";
                break;
            case "image/jpeg":
            case "image/png":
                var thumbnailSrc = "/File.ashx?id=" + d.DOC_ID + "&guid=" + d.DOC_GUID + "&type=thumbnail&width=50&height=50";
                var fullSizeSrc = "/File.ashx?id=" + d.DOC_ID + "&guid=" + d.DOC_GUID;

                icostr += "<div class=\"col-md-3\"><div class=\"doc-thumb\">";
                icostr += "<img data-original=\"" + fullSizeSrc + "\" class=\"thumb\" src=\"" + thumbnailSrc + "\" alt=\"" + (d.DOC_TYPEDESC || d.DOC_OFN) + "\"></img></div></div><div class=\"col-md-8\"><p>" +
                    filename +
                    "</p><p class=\"sub-inf\"><i class=\"fa fa-clock-o\"></i> " +
                    moment(d.DOC_CREATED).format(constants.longdateformat) +
                    "</p><p>" +
                    d.DOC_CREATEDBYDESC +
                    "</p><p>" +
                    (d.DOC_TYPEDESC ? "<span class=\"badge badge-warning\">" + d.DOC_TYPEDESC + "</span>" : "") +
                    "</p><p><span class=\"badge badge-info\">" +
                    (d.DOC_SIZE / 1024).fixed(2) + " KB" +
                    "</span></p></div>";
                break;
            case "application/pdf":
                icostr += "<div class=\"col-md-3\"><div class=\"doc-thumb\"><a href=\"/File.ashx?id=" +
                    d.DOC_ID +
                    "&guid=" + d.DOC_GUID + "\"><i class=\"fa fa-file-pdf-o fa-4x\"></i></a></div></div><div class=\"col-md-8\"><p>" +
                    filename +
                    "</p><p class=\"sub-inf\"><i class=\"fa fa-clock-o\"></i> " +
                    moment(d.DOC_CREATED).format(constants.longdateformat) +
                    "</p><p>" +
                    d.DOC_CREATEDBYDESC +
                    "</p><p>" +
                    (d.DOC_TYPEDESC ? "<span class=\"badge badge-warning\">" + d.DOC_TYPEDESC + "</span>" : "") +
                    "</p><p><span class=\"badge badge-info\">" +
                    (d.DOC_SIZE / 1024).fixed(2) + " KB" +
                    "</span></p></div>";
                break;
            default:
                icostr += "<div class=\"col-md-3\"><div class=\"doc-thumb\"><a href=\"/File.ashx?id=" +
                    d.DOC_ID +
                    "&guid=" + d.DOC_GUID + "\"><i class=\"fa fa-file-o fa-4x\"></i></a></div></div><div class=\"col-md-8\"><p>" +
                    filename +
                    "</p><p class=\"sub-inf\"><i class=\"fa fa-clock-o\"></i> " +
                    moment(d.DOC_CREATED).format(constants.longdateformat) +
                    "</p><p>" +
                    d.DOC_CREATEDBYDESC +
                    "</p><p>" +
                    (d.DOC_TYPEDESC ? "<span class=\"badge badge-warning\">" + d.DOC_TYPEDESC + "</span>" : "") +
                    "</p><p><span class=\"badge badge-info\">" +
                    (d.DOC_SIZE / 1024).fixed(2) + " KB" +
                    "</span></p></div>";
                break;
        }

        if (d.DOC_CREATEDBY === user || ($.inArray(usergroup,tmsparameters.AUGFORTASKDOCUMENTS.split(",")) !== -1)) {
            icostr += "<div class=\"col-md-1\" style=\"text-align:center\">";
            icostr += "<button class=\"btn btn-danger btn-TM_DELDOC\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button>";
            icostr += "</div>";
        }
        return icostr;
    }

    registerDocumentsHelper();

    return {
        showDocumentsModal: showDocumentsModal,
        showDocumentsBlock: showDocumentsBlock,
        triggerDocumentsUpload: triggerDocumentsUpload,
        clearDocuments: clearDocuments,
    };
};