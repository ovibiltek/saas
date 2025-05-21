var comments = function (p) {

    var ho = p;

    function clearComments() {
        var commentsdiv = $(ho.commentsdiv);
        commentsdiv.find("div").remove();
    }

    function saveCmnt(o) {
        return function () {
            var cmntctrl = $(ho.input);
            var visibletocustomer = "+";
            var visibletosupplier = "+";

            if (ho.chkvisibletocustomer && $(ho.chkvisibletocustomer).length > 0)
                visibletocustomer = $(ho.chkvisibletocustomer).prop("checked") ? "+" : "-";
            if (ho.chkvisibletosupplier && $(ho.chkvisibletosupplier).length > 0)
                visibletosupplier = $(ho.chkvisibletosupplier).prop("checked") ? "+" : "-";

            if (cmntctrl.val()) {
                var cmnt = {
                    CMN_SUBJECT: o.subject,
                    CMN_SOURCE: o.source,
                    CMN_TEXT: cmntctrl.val(),
                    CMN_VISIBLETOCUSTOMER: visibletocustomer || "+",
                    CMN_VISIBLETOSUPPLIER: visibletosupplier || "+"
                };
                return tms.Ajax({
                    url: "/Api/ApiComments/Save",
                    data: JSON.stringify(cmnt),
                    fn: function (d1) {
                        msgs.success(d1.data);
                        cmntctrl.val("");
                        $(ho.chkvisibletocustomer).prop("checked", false);
                        $(ho.chkvisibletosupplier).prop("checked", false);
                        return (function (a) {
                            return $.when(loadComments(a)).done(function (d2) {
                                buildCmntDiv({ data: d2.data, subject: a.subject, source: a.source });
                                if (ho.commentcounttext) {
                                    var cmncnt = $(ho.commentcounttext.replace("#source#", a.source));
                                    cmncnt.text(d2.data.length);
                                }
                            });
                        }(d1));
                    }
                });
            } else {
                msgs.error(applicationstrings[lang].commentsrequired);
            }
        };
    }

    function getStyleByUserType(usertype) {
        switch (usertype) {
        case "M":
            return "#d70707";
            break;
        case "T":
            return "#2bb834";
            break;
        }
        return "#f47a1f";
    }

    function buildItem(cmnti) {
        var str = "";
        str += "<div data-id=\"" + cmnti.CMN_ID + "\" data-seenby=\"" + (cmnti.CMN_SEENBY || "") + "\" data-dateseen=\"" + (cmnti.CMN_DATESEEN ? moment(cmnti.CMN_DATESEEN).format(constants.longdateformat) : "") + "\" data-usertype=\"" + cmnti.CMN_USERTYPE + "\" class=\"comment-row row\">";
        str += "<div class=\"col-md-2\" style=\"text-align:center\">";
        str += tms.UserPic(cmnti.CMN_USERPIC, cmnti.CMN_USERPICGUID);
        str += "</div>";
        str += "<div class=\"col-md-9\">";
        str += "<div class=\"panel comment-entry panel-default\">";
        str += "<div class=\"panel-heading\">";
        str += "<span class=\"badge\" style=\"background:" + getStyleByUserType(cmnti.CMN_USERTYPE) + "\">" + cmnti.CMN_USERTYPE + "</span> ";
        if (cmnti.CMN_VISIBLETOCUSTOMER === "+")
            str += "<i style=\"color:red\" class=\"fa fa-eye\" aria-hidden=\"true\"></i> ";
        if (cmnti.CMN_VISIBLETOSUPPLIER === "+")
            str += "<i style=\"color:blue\" class=\"fa fa-eye\" aria-hidden=\"true\"></i> ";
        if (!!cmnti.CMN_DATESEEN)
            str += "<i style=\"color:#7dce23\" class=\"fa fa-check\" aria-hidden=\"true\"></i> ";
        str += cmnti.CMN_CREATEDBYDESC +
            " <span class=\"text-muted\"><i class=\"fa fa-clock-o\"></i> " +
            moment(cmnti.CMN_CREATED).format(constants.longdateformat) +
            "</span>";
        str += "</div>";
        str += "<div class=\"panel-body\">";
        str += "<span class=\"cmntext\">";
        str += cmnti.CMN_TEXT.replace(/\n/g, "<br>");
        str += "</span>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        if (cmnti.CMN_CREATEDBY === user || usergroup === "ADMIN") {
            str += "<div class=\"col-md-1\" style=\"text-align:center\">";
            str +=
                "<button class=\"btn btn-danger btn-delcmnt\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button>";
            str +=
                "<button style=\"margin-top:5px;\" class=\"btn btn-info btn-editcmnt\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>";
            str += "</div>";
        }
        str += "</div>";
        return str;
    }

    function buildCmntDiv(p) {
        var commentsdiv = $(ho.commentsdiv);
        commentsdiv.find("div").remove();
        var str = "";
        for (var i = 0; i < p.data.length; i++) {
            var cmnti = p.data[i];
            str+= buildItem(cmnti);
           
        }
        commentsdiv.append(str);
        commentsdiv.find("img:not(.profilepic)").css("width", "400px").css("display", "block");
        commentsdiv.find("button.btn-editcmnt").on("click",
            function () {
                var cmntrow = $(this).closest(".row");
                var txt = cmntrow.find("span.cmntext").text();
                cmntrow.find("span.cmntext")
                    .replaceWith("<textarea class=\"required\" style=\"width:100%;height:100px;\">" +
                    txt +
                    "</textarea>");
                cmntrow.find("textarea").focus();
                cmntrow.find("textarea").data("id", cmntrow.data("id")).data("txt", txt).on("blur",
                    function (e) {
                        var $this = $(this);
                        var cmntext = $this.val();
                        var pretext = $(this).data("txt");
                        if (cmntext && pretext !== cmntext) {
                            return tms.Ajax({
                                url: "/Api/ApiComments/Update",
                                data: JSON.stringify({
                                    CMN_ID: $this.data("id"),
                                    CMN_TEXT: cmntext,
                                    CMN_UPDATED: tms.Now(),
                                    CMN_UPDATEDBY: user
                                }),
                                fn: function (d1) {
                                    $this.replaceWith("<span class=\"cmntext\">" + cmntext + "</span>");
                                }
                            });
                        } else {
                            $(this).replaceWith("<span class=\"cmntext\">" + $(this).data("txt") + "</span>");
                        }
                    });
            });
        commentsdiv.find("button.btn-delcmnt").on("click",
            function () {
                var cmntrow = $(this).closest(".row");
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiComments/DelRec",
                            data: JSON.stringify(cmntrow.data("id")),
                            fn: function (d1) {
                                msgs.success(d1.data);
                                cmntrow.fadeOut(500, function () { $(this).remove(); });
                                return (function (a) {
                                    return $.when(loadComments({ source: a.source, subject: a.subject })).done(
                                        function (d2) {
                                            if (ho.commentcounttext) {
                                                var cmncnt = $(ho.commentcounttext.replace("#source#", a.source));
                                                cmncnt.text(d2.data.length);
                                            }
                                        });
                                }(p));
                            }
                        });
                    });
            });
        $.contextMenu({
            selector: "div.comment-row",
            build: function ($trigger, e) {
                return {
                    zIndex: 10,
                    items: {
                        seen: {
                            name: applicationstrings[lang].seen,
                            disabled: function (key, opt) {
                                return this.data("usertype") !== "M" || !!this.data("dateseen");
                            },
                            icon: function (opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span><i class="fa fa-eye" aria-hidden="true"></i> ' +
                                    item.name +
                                    "</span>");
                                return "context-menu-icon-updated";
                            },
                            visible: function (key, opt) {
                                return !supplier && !customer;
                            },
                            callback: function (key, opt) {
                                var $this = this;
                                return tms.Ajax({
                                    url: "/Api/ApiComments/UpdateSeen",
                                    data: JSON.stringify({
                                        CMN_ID: this.data("id"),
                                        CMN_DATESEEN: tms.Now(),
                                        CMN_SEENBY: user
                                    }),
                                    fn: function (d) {
                                        $("div.comment-row[data-id=\"" + d.data.CMN_ID + "\"]").replaceWith(buildItem(d.data));
                                    }
                                });
                            }
                        }
                    }
                };
            }
        });
    }

    function loadComments(o) {
        var gridreq = {
            sort: [{ field: "CMN_ID", dir: "desc" }],
            filter: {
                filters: [
                    { field: "CMN_SOURCE", value: o.source, operator: "eq" },
                    { field: "CMN_SUBJECT", value: o.subject, operator: "eq" }
                ]
            }
        };

        if (customer)
            gridreq.filter.filters.push({ field: "CMN_VISIBLETOCUSTOMER", value: "+", operator: "eq" });
        if (supplier)
            gridreq.filter.filters.push({ field: "CMN_VISIBLETOSUPPLIER", value: "+", operator: "eq" });

        return tms.Ajax({
            url: "/Api/ApiComments/List",
            data: JSON.stringify(gridreq)
        });
    }

    function showCommentsModal(o) {
        return $.when(loadComments(o)).done(function (d) {
            buildCmntDiv({ data: d.data, subject: o.subject, source: o.source });
            $(ho.btnaddcomment).off("click").on("click", saveCmnt(o));
            $(ho.modal).modal("show");
        });
    }

    function showCommentsBlock(o) {
        return $.when(loadComments(o)).done(function (d) {
            buildCmntDiv({ data: d.data, subject: o.subject, source: o.source });
            $(ho.btnaddcomment).off("click").on("click", saveCmnt(o));
        });
    }


    return {
        showCommentsModal: showCommentsModal,
        showCommentsBlock: showCommentsBlock,
        clearComments: clearComments
    };
};