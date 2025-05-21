$.widget("custom.autocomp",
    $.ui.autocomplete,
    {
        options: {
            source: function (request, response) {
                var term = request.term;
                if (term.length <= 3) {
                    $.when(this._getItems(term)).done(function(d) {
                        response(d.data);
                    }).fail(function() {
                        response(null);
                    });
                } else {
                    response(null);
                }
            }
        },
        _create: function () {
            this._super();
            switch (this.options.type) {
                case "ENTITY":
                    var fentity = this.element.data("fentity");
                    var entity = this.element.data("entity");
                    if (lu) {
                        var e = lu.list()[fentity];
                        var ac = e.autocomp;
                        if (e.filterconf)
                            ac.filter = e.filterconf[entity].autocomplete;
                        this._setOptions(ac);
                    }
                    break;
                default:
                    break;
            }

            this._on(this.element,
                {
                    autocompchange: "change",
                    autocompselect: "select",
                    input: "input"
                });
        },
        _getItems: function (term) {

            var $this = this;

            // Input Text
            var prmax = {
                screen: $this.options.screen,
                filter: {
                    filters: [
                        {
                            field: $this.options.field,
                            value: term,
                            operator: $this.options.termisnumeric ? "eq" : "startswith",
                            logic: "or"
                        }
                    ]
                }
            };

            // Record Is Active Column
            if (this.options.active) {
                prmax.filter.filters.push({ field: $this.options.active, value: "+", operator: "eq", logic:"and" });
            }

            var ajaxfilterfunc = function () { return $.Deferred().resolve(); };
            var filtersarr;
            filtersarr = $this.options.filter || [];

            if ($this.options.beforeFilter && typeof $this.options.beforeFilter === "function") {

                let newFilters = $this.options.beforeFilter();
                // Mevcut diziden beforeFilter'daki field'lara sahip olan nesneleri kaldır
                let fieldsToReplace = newFilters.map(item => item.field);
                filtersarr = filtersarr.filter(item => !fieldsToReplace.includes(item.field));

                // Yeni filtreleri diziye ekle
                filtersarr = filtersarr.concat(newFilters);
            }

            if ($this.options.beforeAjaxFilter && typeof $this.options.beforeAjaxFilter === "function")
                ajaxfilterfunc = $this.options.beforeAjaxFilter;

            var $d = $.Deferred();

            $.when(ajaxfilterfunc()).done(function(d_aff) {

                if (d_aff)
                    filtersarr = $.merge(filtersarr, d_aff);

                if (filtersarr) {
                    for (var i = 0; i < filtersarr.length; i++) {
                        var dynfilter = filtersarr[i];
                        var fi;
                        fi = null;
                        if (dynfilter.dataattr)
                            fi = {
                                field: dynfilter.field,
                                value: dynfilter.includeall
                                    ? [$($this.element).data(dynfilter.dataattr), "*"]
                                    : $($this.element).data(dynfilter.dataattr),
                                operator: dynfilter.includeall ? "in" : dynfilter.operator || "eq"
                            };
                        else if (dynfilter.relfield)
                            fi = {
                                field: dynfilter.field,
                                value: dynfilter.includeall
                                    ? [$(dynfilter.relfield).val(), "*"]
                                    : $(dynfilter.relfield).val(),
                                operator: dynfilter.includeall ? "in" : dynfilter.operator || "eq"
                            };
                        else if (dynfilter.func) {
                            var v = dynfilter.func();
                            fi = {
                                field: dynfilter.field,
                                value: dynfilter.includeall ? [v, "*"] : v,
                                operator: dynfilter.includeall ? "in" : dynfilter.operator || "eq"
                            };
                        } else
                            fi = {
                                field: dynfilter.field,
                                value: dynfilter.value,
                                operator: dynfilter.operator
                            };
                        prmax.filter.filters.push(fi);
                    }
                }

                return $.when(tms.Ajax({
                    url: $this.options.listurl,
                    data: JSON.stringify(prmax),
                    quietly: true
                })).done(function(d) {
                    $d.resolve(d);
                });
            }).fail(function () {
                $d.reject();
            });

            return $d.promise();

        },
        input: function (event, ui) {
            $(event.target).attr("validationcompleted", "false");
        },
        select: function (event, ui) {

            var $this = this;
            var target = $(event.target);

            target.val(ui.item[$this.options.field]).trigger("change").trigger("autocompletechange");
            tooltip.show(target, ui.item[$this.options.textfield]);

            target.removeAttr("validationcompleted");
            target.removeClass("invalid");

            if ($this.options.callback && typeof ($this.options.callback) == "function")
                $this.options.callback(ui.item, target);

            return false;
        },
        change: function (event, ui) {
            var $this = this;
            var target = $(event.target);
            var term = target.val();
            var allowfreetext = target.data("allowfreetext");

            if (term && !allowfreetext) {
                $.when(this._getItems(term)).done(function(d) {

                    if (d && d.data.length > 0) {

                        target.val(d.data[0][$this.options.field]).trigger("change").trigger("autocompletechange");
                        tooltip.show(target, d.data[0][$this.options.textfield]);

                        target.removeAttr("validationcompleted");
                        target.removeClass("invalid");

                        if ($this.options.callback && typeof ($this.options.callback) == "function")
                            $this.options.callback(d.data[0], target);

                    } else {
                        target.addClass("invalid");
                        tooltip.hide(target);
                    }
                }).fail(function() {
                    return;
                });
            } else {
                target.removeAttr("validationcompleted");
                target.removeClass("invalid");
                tooltip.hide(target);
                if ($this.options.callback && typeof ($this.options.callback) == "function")
                    $this.options.callback(null, target);

            }

        },
        _renderItem: function (ul, item) {
            return $("<li></li>")
                .data("ui-autocomplete-item", item)
                .append("<a>" + item[this.options.textfield] + "</a>")
                .appendTo(ul);
        }
    });