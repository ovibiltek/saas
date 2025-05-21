var gridModal = (function () {
    var modal = null;
    var selectedrecord = null;
    var grd = null;
    var param = null;

    function _modalOk() {
        var selectedRows = grd.GetSelected();

        if (selectedRows.length > 0) {
            if (param.returninput) {
                if (param.multiselect) {
                    for (var i = 0; i < selectedRows.length; i++) {
                        selectedrecord = grd.GetRowDataItem(selectedRows[i]);
                        $(param.returninput).tagsinput("add",
                            { id: selectedrecord[param.keyfield], text: selectedrecord[param.textfield] });
                    }
                } else {
                    selectedrecord = grd.GetRowDataItem(selectedRows[0]);
                    if (param.allowfreetext) {
                        $(param.returninput).val(selectedrecord[param.textfield]);
                    } else {
                        $(param.returninput).val(selectedrecord[param.codefield]).trigger("change");
                        $(param.returninput).removeClass("invalid");
                        tooltip.show(param.returninput, selectedrecord[param.textfield]);
                    }
                }
            }

            $(param.returninput).removeAttr("validationcompleted").removeClass("invalid");
            if (param.callback && typeof (param.callback) == "function")
                param.callback(selectedrecord);
        }

        modal.modal("hide");
    }

    function _registerEvents() {
        $("#modalok").off("click").click(_modalOk);

        $("#modalshared").off("hidden.bs.modal").on("hidden.bs.modal",
            function () {
                if (param.customOff && typeof (param.customOff) == "function")
                    param.customOff();
            });
        
    }

    function _gridDataBound() {
        $("#modalshared [role=\"grid\"] [data-id]").off("dblclick").dblclick(function () {
            _modalOk();
        });

        if (param.treefilter && typeof (param.treefilter) == "function")
            param.treefilter("#dropdowntree", function (filter) {
                var newFilter = [...param.filter];
                for (var i = 0; i < filter.length; i++) {
                    newFilter.push(filter[i]);
                }
                grd.RunFilter(newFilter);
            });

        if (param.quickfilter) {
            $("#qf").css("width", "200px");
            $("#qf").select2();
            $("#qf").off().on("change",
                function () {
                    var selectedindex = this.selectedIndex;
                    grd.RunFilter(param.quickfilter[selectedindex].filter);
                });
        }
       
        if (param.gridDataBound && typeof (param.gridDataBound) == "function")
            param.gridDataBound();
    }

    function _buildModalGrid() {
        $("#modalshared #modaltitle").text(param.modaltitle);
        if (param.modalinfo) {
            var info = $("#modalshared #modalinfo");
            info.html(param.modalinfo);
            info.removeClass("hidden");
        } else {
            var info = $("#modalshared #modalinfo");
            info.html("");
            info.addClass("hidden");
        }

        var i;
        var toolbar, toolbarstr;

        toolbar = {
            left: [],
            right: []
        };

        if (!param.fields) {
            param.fields = {};
            for (i = 0; i < param.columns.length; i++) {
                var col = param.columns[i];
                param.fields[col.field] = { type: col.type };
            }
        }

        if (param.quickfilter) {
            toolbarstr = "<select style=\"height:25px\" id=\"qf\">";
            for (i = 0; i < param.quickfilter.length; i++) {
                var optionstr = "<option>" + param.quickfilter[i].text + "</option>";
                $(optionstr).data("filter", param.quickfilter[i].filter);
                toolbarstr += optionstr;
            }
            toolbarstr += "</select>";
            toolbar.right = [toolbarstr];
        }
        if (param.treefilter) {
            toolbarstr = "<input disabled=\"disabled\" type=\"text\" id=\"dropdowntree\" placeholder=\"" + applicationstrings[lang].filter + "\"/>";
            toolbar.left = [toolbarstr];
        }

        if (param.stdtoolbar) {
            toolbar.right = toolbar.right.concat(param.stdtoolbar);
        }

        var grdo = {
            selector: "#grdmodal",
            name: "modal." + param.returninput,
            datasource: param.listurl,
            keyfield: param.keyfield,
            columns: param.columns,
            filter: param.filter,
            sort: param.sort || [{ field: param.columns[0].field, dir: "asc" }],
            fields: param.fields,
            selectable: param.multiselect ? "multiple, row" : "row",
            height:  shared.windowHeight() / 2,
            toolbar: toolbar || null,
            screen : param.screen,
            databound: _gridDataBound
        };
        grd = new Grid(grdo);
    }

    function show(p) {

        param = p;

        $("#modalshared").on("shown.bs.modal", function () { $(document).off("focusin.modal"); });
        $("#modalshared .modal-body").height(shared.windowHeight() / 2);
        $("#modalshared .modal-body #grdmodal").find("*").remove();
        modal = $("#modalshared").modal("show");

        _registerEvents();
        _buildModalGrid();

        return this;

    }

    function refresh() {
        if (grd) {
            grd.Refresh();
        }
    }

    return {
        show: show,
        refresh: refresh,
        getInstance: function () { return grd }
    };
}());