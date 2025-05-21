/// <summary>Kendo UI Grid Plugin.</summary>
/// <description>Demonstrate a Kendo UI Grid Plugin with a Show/Hide Columns Pick List.</description>
/// <version>1.0</version>
/// <author>John DeVight</author>
/// <license>
/// Licensed under the MIT License (MIT)
/// You may obtain a copy of the License at
/// http://opensource.org/licenses/mit-license.html
/// </license>
(function ($, kendo) {
    var ExtGrid = kendo.ui.Grid.extend({
        options: {
            toolbarColumnMenu: false,
            name: "ExtGrid"
        },

        init: function (element, options) {
            /// <summary>
            /// Initialize the widget.
            /// </summary>

            if (options.toolbarColumnMenu === true && typeof options.toolbar === "undefined") {
                options.toolbar = [];
            }

            // Call the base class init.
            kendo.ui.Grid.fn.init.call(this, element, options);

            this._initToolbarColumnMenu();
        },

        _initToolbarColumnMenu: function () {
            /// <summary>
            /// Determine whether the column menu should be displayed, and if so, display it.
            /// </summary>

            // The toolbar column menu should be displayed.
            if (this.options.toolbarColumnMenu === true && this.element.find(".k-ext-grid-columnmenu").length === 0) {
                // Create the column menu items.
                var $menu = $("<ul></ul>");

                // Loop over all the columns and add them to the column menu.
                for (var idx = 0; idx < this.columns.length; idx++) {
                    var column = this.columns[idx];
                    // A column must have a title to be added.
                    if (column.type !== "na" && $.trim(column.title).length > 0) {
                        // Add columns to the column menu.
                        $menu.append(kendo.format("<li><input  type='checkbox' data-index='{0}' data-field='{1}' data-title='{2}' {3}>{4}</li>",
                            idx, column.field, column.title, column.hidden ? "" : "checked", column.title));
                    }
                }

                // Create a "Columns" menu for the toolbar.
                this.wrapper.find("div.k-grid-toolbar").prepend("<ul class='k-ext-grid-columnmenu' style='float:left;'><li data-role='menutitle'>" + applicationstrings[lang].columnchooser + "</li></ul>");
                this.wrapper.find("div.k-grid-toolbar ul.k-ext-grid-columnmenu li").append($menu);

                var that = this;

                this.wrapper.find("div.k-grid-toolbar ul.k-ext-grid-columnmenu").kendoMenu({
                    openOnClick: true,
                    closeOnClick: false,
                    select: function (e) {
                        // Get the selected column.
                        var $item = $(e.item), $input, columns = that.columns;
                        $input = $item.find(":checkbox");
                        if ($input.attr("disabled") || $item.attr("data-role") === "menutitle") {
                            return;
                        }

                        var column = that._findColumnByTitle($input.attr("data-title"));

                        // If checked, then show the column; otherwise hide the column.
                        if ($input.is(":checked")) {
                            that.showColumn(column);
                        } else {
                            that.hideColumn(column);
                        }
                    }
                });
            }
        },

        _findColumnByTitle: function (title) {
            /// <summary>
            /// Find a column by column title.
            /// </summary>

            var result = null;

            for (var idx = 0; idx < this.columns.length && result === null; idx++) {
                var column = this.columns[idx];
                if (column.title === title) {
                    result = column;
                }
            }

            return result;
        }
    });
    kendo.ui.plugin(ExtGrid);
    kendo.ui.Grid.prototype._positionColumnResizeHandle = function () {
        var that = this,
            indicatorWidth = that.options.columnResizeHandleWidth,
            lockedHead = that.lockedHeader ? that.lockedHeader.find("thead:first") : $();

        that.thead.add(lockedHead).on("mousemove" + ".k-grid", "th", function (e) {
            var th = $(this);

            if (th.hasClass("k-group-cell") || th.hasClass("k-hierarchy-cell")) {
                return;
            }

            function getPageZoomStyle() {
                var docZoom = parseFloat($(document.documentElement).css("zoom"));
                if (isNaN(docZoom)) {
                    docZoom = 1;
                }
                var bodyZoom = parseFloat($(document.body).css("zoom"));
                if (isNaN(bodyZoom)) {
                    bodyZoom = 1;
                }
                return 1;
            }

            var clientX = e.clientX / getPageZoomStyle(),
                winScrollLeft = $(window).scrollLeft(),
                position = th.offset().left + (!kendo.support.isRtl(this.element) ? this.offsetWidth : 0);

            if (clientX + winScrollLeft > position - indicatorWidth && clientX + winScrollLeft < position + indicatorWidth) {
                that._createResizeHandle(th.closest("div"), th);
            } else if (that.resizeHandle) {
                that.resizeHandle.hide();
            } else {
                if ((typeof cursor != "undefined") && typeof (cursor) == "function")
                    cursor(that.wrapper, "");
            }
        });
    };
})(window.kendo.jQuery, window.kendo);