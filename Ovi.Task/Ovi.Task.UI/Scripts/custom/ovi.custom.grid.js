function Grid(grd) {
    var _grd = grd;
    var _columns = grd.columns;
    var kdgrid = null;
    var state = null;
    var latestdatalen = 0;
    var hasmoredata;
    var sis = null;
    var self = this;
    var dataBindingFlag = true;
    var scrollbarWidth = kendo.support.scrollbar();
    var usercols = [];
    var strquery = null;
    var cubes = null;
    var cubesloaded = false;
    var scrollticker;
    var _cntrequest = null;
    var custom_filter = [];

    var CreateDataSource = function () {
        return new kendo.data.DataSource({
            transport: {
                read: {
                    url: _grd.datasource,
                    error: function (xhr, error) {
                        console.debug(xhr);
                        console.debug(error);
                    }
                },
                parameterMap: function (options) {
                    var i;
                    var filternow;

                    if (!options.filter) options.filter = { filters: [] };
                    if (!options.sort) options.sort = [];
                    if (_grd.screen)
                        options.screen = _grd.screen;

                    if (_grd.filter && _grd.filter.length > 0) {
                        for (i = 0; i < _grd.filter.length; i++) {
                            options.filter.filters = $.grep(options.filter.filters, function (e) {
                                return !(((e.field) === (_grd.filter[i].field)) && ((e.operator) === (_grd.filter[i].operator)));
                            });
                            options.filter.filters.push(_grd.filter[i]);
                        }
                    }

                    if (options.filter && options.filter.filters.length > 0) {
                        for (i = 0; i < options.filter.filters.length; i++) {
                            var col = $.grep(usercols, function (item) {
                                return (item.field) === (options.filter.filters[i].field);
                            });
                            if (col && col.length > 0) {
                                var isdate = (options.filter.filters[i].value || options.filter.filters[i].value) instanceof Date;
                                if (isdate) {
                                    switch (col[0].type) {
                                        case "time":
                                            var selecteddate = new Date(options.filter.filters[i].value);
                                            options.filter.filters[i].value = selecteddate.getHours() * 3600 + selecteddate.getMinutes() * 60;
                                            break;
                                        case "date":
                                            var selecteddate = new Date(options.filter.filters[i].value);
                                            options.filter.filters[i].value = moment(selecteddate).format(constants.dateformat);
                                            break;
                                        case "datetime":
                                            var selecteddate = new Date(options.filter.filters[i].value);
                                            options.filter.filters[i].value = moment(selecteddate).format(constants.longdateformat);
                                            break;
                                    }
                                }

                                if (col[0].fieldtype === "CF") {
                                    var operator = options.filter.filters[i].operator;
                                    options.filter.filters[i].operator = "sqlfunc";
                                    options.filter.filters[i].field = null;
                                    options.filter.filters[i].value1 = _grd.entity;
                                    options.filter.filters[i].value2 = col[0].ofield;
                                    options.filter.filters[i].value3 = ("'" + options.filter.filters[i].value + "'") || "null";
                                    options.filter.filters[i].value4 = operator;
                                    options.filter.filters[i].value = "FCFV";
                                };

                                if (_grd.parametermap && typeof (_grd.parametermap) == "function")
                                    _grd.parametermap(col[0], options.filter.filters[i], _grd.keyfield);
                            }
                        }
                    }

                    if (options.sort) {
                        for (i = 0; i < options.sort.length; i++) {
                            if (_grd.sort) {
                                _grd.sort = $.grep(_grd.sort,
                                    function (e) {
                                        return (e.field || e.field) !== (options.sort[i].field || options.sort[i].field);
                                    });
                            }
                        }
                        if (_grd.sort && _grd.sort.length > 0) {
                            for (i = 0; i < _grd.sort.length; i++) {
                                options.sort.push(_grd.sort[i]);
                            }
                        }
                    }

                    if (_grd.filterlogic)
                        options.filter.logic = _grd.filterlogic;
                    if (_grd.loadall)
                        options.loadall = true;

                    options.skip = null;
                    filternow = JSON.stringify(options.filter.filters);
                    if (strquery != filternow) {
                        strquery = filternow;
                        options.page = 1;
                        $(_grd.selector).find(".k-grid-content").animate({
                            scrollTop: 0
                        }, 100);
                    }

                    _cntrequest = Object.assign({}, options);
                    _cntrequest.action = "CNT";


                    return JSON.stringify(options);
                }
            },
            schema: {
                columns: usercols,
                grid: _grd,
                parse: function (data) { return JSON.parse(data); },
                model: { fields: _grd.fields },
                total: function (d) { return d.total; },
                data: function (d) {
                    switch (d.status) {
                        case 500:
                            msgs.error(d.data);
                            break;
                        case 300:
                            tms.Redirect2Login();
                            break;
                        case 200:
                            if (d.data) {
                                var that = this;
                                for (var i = 0; i < d.data.length; i++) {
                                    var di = d.data[i];

                                    if (_grd.customdata && typeof (_grd.customdata) == "function")
                                        _grd.customdata(di);

                                    var customfields = $.grep(that.columns, function (e) { return e.fieldtype === "CF"; });
                                    for (var j = 0; j < customfields.length; j++) {
                                        var colcf = customfields[j];
                                        var fieldname = colcf.field.replace(/[\W_]+/g, "");
                                        di[fieldname] = null;

                                        if (d.customfieldvalues) {
                                            var customFieldValues = $.grep(d.customfieldvalues, function (e) {
                                                return e.CFV_CODE === colcf.ofield && e.CFV_SOURCE == di[that.grid.keyfield];
                                            });

                                            if (customFieldValues.length > 0) {
                                                di[fieldname] = customFieldValues[0].CFV_TEXT || customFieldValues[0].CFV_DATETIME || customFieldValues[0].CFV_NUM;
                                            }
                                        }
                                    }
                                }
                            }
                            return d.data;
                    }
                }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: constants.gridpagesize,
            requestStart: function (e) {


            },
            requestEnd: function (e) {

            }
        });
    };
    var DataFieldsStr = function () {
        var strdatafields = "";
        if (_grd.datafields) {
            for (var i = 0; i < _grd.datafields.length; i++) {
                var datafield = _grd.datafields[i];
                strdatafields += " data-" + datafield.name + "=\"#= " + datafield.field + "#\"";
            }
        }
        return strdatafields;
    }
    var BuildRowTemplate = function () {
        var rowTemplate = "";
        switch (typeof _grd.keyfield) {
            case "string":
                rowTemplate = "<tr data-keytype=\"single\"" + DataFieldsStr() + " data-id=\"#= " + _grd.keyfield + " #\">";
                break;
            default:
                if (_grd.keyfield) {
                    rowTemplate = "<tr " + DataFieldsStr() + " data-keytype=\"multiple\" ";
                    var combkeys = "";
                    for (var j = 0; j < _grd.keyfield.length; j++) {
                        rowTemplate += " data-key-" + (j + 1) + "=\"#=" + _grd.keyfield[j] + "#\" ";
                        combkeys += "#=" + _grd.keyfield[j] + "#-";
                    }
                    rowTemplate += " data-id=\"" + combkeys.substring(0, combkeys.length - 1) + "\"";
                    rowTemplate += ">";
                }
                break;
        }
        for (var i = 0; i < usercols.length; i++) {
            var hidden = "";
            if (usercols[i].hidden)
                hidden = "style=\"display: none;\"";
            rowTemplate += (usercols[i].template != undefined)
                ? ("<td " + hidden + " data-type=\"" + usercols[i].type + "\">" + usercols[i].template + "</td>")
                : ("<td " + hidden + "data-type=\"" + usercols[i].type + "\">#: " + usercols[i].field + " #</td>");
        }
        rowTemplate += "</tr>";
        return rowTemplate;
    };
    var kdgriddata = function () {
        return $(_grd.selector).data("kendoExtGrid");
    };
    var GetOptions = function () {
        return _grd;
    }
    var GetNextPage = function () {
        var currentpage = kdgriddata().dataSource.page();
        state.page = currentpage + 1;
        kdgriddata().dataSource.query(state);
        kdgriddata().refresh();
    };
    var ProcessFilter = function (filter) {
        if (!_grd.filter) {
            _grd.filter = filter;
            return;
        }

        _grd.filter = $.grep(_grd.filter, function (e) { return e.IsPersistent });
        if (filter && filter.length > 0) {
            for (i = 0; i < filter.length; i++) {
                _grd.filter = $.grep(_grd.filter, function (e) {
                    return !(((e.field) === (filter[i].field)) && ((e.operator) === (filter[i].operator)));
                });
                _grd.filter.push(filter[i]);
            }
        }
    }
    this.GetData = function () {
        return kdgriddata().dataSource.view();
    }
    this.Refresh = function () {
        sis = self.GetSelectedItemSelector();
        kdgriddata().dataSource.read();
    };
    this.ClearSelection = function () {
        kdgriddata().clearSelection();
    };
    this.ClearData = function () {
        kdgriddata().dataSource.data([]);
    }
    this.SelectRowAtIndex = function (indx) {
        var row = kdgriddata().items()[indx];
        kdgriddata().select(row);
        return row;
    };
    this.GetSelectedItemSelector = function () {
        var selectedrow = kdgriddata().select();
        return selectedrow.length > 0 ? "tr[data-id=\"" + selectedrow.data("id") + "\"]" : null;
    };
    this.GetCount = function () {


        return kdgriddata().dataSource.view().length;
    };
    this.CurrentQuery = function () {
        return strquery;
    };
    this.GetSelectedDataItem = function () {
        return kdgriddata().dataItem(kdgriddata().select());
    };
    this.GetRowDataItem = function (row) {
        return kdgriddata().dataItem(row);
    };
    this.GetSelected = function () {
        return kdgriddata().select();
    };
    this.SelectRow = function (row) {
        kdgriddata().select(row);
    };
    this.RunFilter = function (filter) {
        ProcessFilter(filter);
        sis = self.GetSelectedItemSelector();
        kdgriddata().dataSource.read();
    };
    var GetRecordCount = function () {
        var total = kdgriddata().dataSource.total();
        return !total ? tms.Ajax({
            url: _grd.datasource,
            data: JSON.stringify(_cntrequest)
        }) : $.Deferred().resolve({ data: total });
        return kdgriddata().dataSource.total();
    };
    var ExportData = function () {
        var gridreq = { filter: {}, exportall: true, loadall: true };
        var f = kdgriddata().dataSource.filter();
        var s = kdgriddata().dataSource.sort();
        gridreq.filter.filters = f ? f.filters : [];
        gridreq.sort = s || [];
        var i;
        if (_grd.screen)
            gridreq.screen = _grd.screen;
        if (_grd.filter && _grd.filter.length > 0) {
            for (i = 0; i < _grd.filter.length; i++) {
                gridreq.filter.filters = $.grep(gridreq.filter.filters, function (e) {
                    return !((e.field === _grd.filter[i].field) &&
                        (e.operator === _grd.filter[i].operator));
                });
                gridreq.filter.filters.push(_grd.filter[i]);
            }
        }

        if (gridreq.filter && gridreq.filter.filters.length > 0) {
            for (i = 0; i < gridreq.filter.filters.length; i++) {
                var col = $.grep(usercols,
                    function (item) {
                        return (item.field || item.field) ===
                            (gridreq.filter.filters[i].field || gridreq.filter.filters[i].field);
                    });
                if (col && col.length > 0) {
                    var isdate = (gridreq.filter.filters[i].value || gridreq.filter.filters[i].value) instanceof Date;
                    if (isdate) {
                        switch (col[0].type) {
                            case "time":
                                var selecteddate = new Date(gridreq.filter.filters[i].value ||
                                    gridreq.filter.filters[i].value);
                                gridreq.filter.filters[i].value =
                                    selecteddate.getHours() * 3600 + selecteddate.getMinutes() * 60;
                                break;
                            case "date":
                                var selecteddate = new Date(gridreq.filter.filters[i].value ||
                                    gridreq.filter.filters[i].value);
                                gridreq.filter.filters[i].value = moment(selecteddate).format(constants.dateformat);
                                break;
                            case "datetime":
                                var selecteddate = new Date(gridreq.filter.filters[i].value ||
                                    gridreq.filter.filters[i].value);
                                gridreq.filter.filters[i].value = moment(selecteddate).format(constants.longdateformat);
                                break;
                        }
                    }
                    if (col[0].fieldtype === "CF") {
                        var operator = gridreq.filter.filters[i].operator;
                        gridreq.filter.filters[i].operator = "sqlfunc";
                        gridreq.filter.filters[i].field = null;
                        gridreq.filter.filters[i].value1 = _grd.entity;
                        gridreq.filter.filters[i].value2 = col[0].ofield;
                        gridreq.filter.filters[i].value3 = ("'" + gridreq.filter.filters[i].value + "'") || "null";
                        gridreq.filter.filters[i].value4 = operator;
                        gridreq.filter.filters[i].value = "FCFV";
                    }
                }
            }
        }

        if (gridreq.sort) {
            for (i = 0; i < gridreq.sort.length; i++) {
                _grd.sort = $.grep(_grd.sort,
                    function (e) { return (e.field || e.field) !== (gridreq.sort[i].field || gridreq.sort[i].field) });
            }
            if (_grd.sort && _grd.sort.length > 0) {
                for (i = 0; i < _grd.sort.length; i++) {
                    gridreq.sort.push(_grd.sort[i]);
                }
            }
        }

        if (_grd.filterlogic)
            gridreq.filter.logic = _grd.filterlogic;

        return tms.Ajax({ url: _grd.datasource, data: JSON.stringify(gridreq) });
    };
    var Excel = function (e) {
        msgs.info("Veriler alınıyor...");
        $.when(ExportData()).done(function (d) {

            msgs.info("Excel oluşturuluyor...");

            function GetColumnNameFromIdx(idx) {
                var ret;
                for (var ret = "", a = 1, b = 26; (idx -= a) >= 0; a = b, b *= 26) {
                    ret = String.fromCharCode(parseInt((idx % b) / a) + 65) + ret;
                }
                return ret;
            }

            var gd = kdgriddata();
            var opt = GetOptions();
            var data = d.data;
            var customfields = $.grep(gd.columns, function (e) { return e.fieldtype === "CF"; });

            // Custom field Values
            if (customfields && customfields.length > 0) {
                if (data) {
                    var customfieldvalues = _.groupBy(d.customfieldvalues, "CFV_SOURCE");
                    for (var i = 0; i < d.data.length; i++) {
                        var di = d.data[i];
                        var cfo = customfields.reduce(function (o, cfline) {
                            o[cfline.field] = null;
                            return o;
                        }, {});

                        di = $.extend(di, cfo);

                        var cfv = customfieldvalues[di[opt.keyfield]];
                        if (cfv) {
                            var cfvo = cfv.reduce(function (o, cfvline) {
                                o[cfvline.CFV_CODE.replace(/[\W_]+/g, "")] = cfvline.CFV_TEXT || cfvline.CFV_NUM || cfvline.CFV_DATETIME;
                                return o;
                            }, {});

                            di = $.extend(di, cfvo);
                        }
                    }
                }
            }

            var wb = XLSX.utils.book_new();
            var ws_data = [];

            // Header row
            var headerRow = [];
            for (var i = 0; i < gd.columns.length; i++) {
                if (gd.columns[i].type !== "na" && !gd.columns[i].hidden) {
                    headerRow.push(gd.columns[i].title || gd.columns[i].field);
                }
            }
            ws_data.push(headerRow);

            // Data rows
            for (var di = 0; di < data.length; di++) {
                var dataItem = data[di];
                var row = [];
                for (ci = 0; ci < gd.columns.length; ci++) {
                    if (gd.columns[ci].type !== "na" && !gd.columns[ci].hidden) {
                        var column = gd.columns[ci];
                        var colvalue = dataItem[column.field];
                        if (column.type === "datetime" && colvalue)
                            colvalue = moment(colvalue).format(constants.longdateformat);
                        else if (column.type === "date" && colvalue)
                            colvalue = moment(colvalue).format(constants.dateformat);
                        else if (column.type === "time" && colvalue)
                            colvalue = moment().startOf("day").seconds(colvalue).format(constants.timeformat);
                        row.push(colvalue);
                    }
                }
                ws_data.push(row);
            }

            // Convert data to worksheet
            var ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Set column widths based on maximum data length
            var colWidths = ws_data[0].map((header, colIdx) => {
                const maxLength = ws_data.reduce((max, row) => {
                    const cellValue = row[colIdx] ? row[colIdx].toString() : "";
                    return Math.max(max, cellValue.length);
                }, header.length);

                return { wch: maxLength + 2 };
            });
            ws['!cols'] = colWidths;

            // Style headers with orange color
            var range = XLSX.utils.decode_range(ws['!ref']);
            for (var col = range.s.c; col <= range.e.c; col++) {
                var cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                if (!ws[cellAddress]) continue;
                ws[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "FFA500" } } // Orange color for headers
                };
            }

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            // Save as XLSX
            var attrdownload = e.currentTarget.getAttribute("download");
            XLSX.writeFile(wb, attrdownload);
        });
    };
    var SetFilteredMembers = function (filter, members) {
        if (filter.filters) {

            for (var i = 0; i < filter.filters.length; i++) {
                SetFilteredMembers(filter.filters[i], members);
            }
        } else {
            members[filter.field] = true;
        }
    };
    var FixNoDataScrollingIssue = function (e) {
        $(".k-grid [title]").each(function () { tooltip.showwithoutwrapping($(this), $(this).attr("title")); });
        if (e.sender.dataSource.view().length == 0) {
            var contentDiv = e.sender.wrapper.children(".k-grid-content"),
                dataTable = contentDiv.children("table");
            if (!dataTable.find("tr").length) {
                dataTable.children("tbody").append("<tr colspan='" +
                    e.sender.columns.length +
                    "'><td style=\"border-bottom:0\"> </td></tr>");
                if ($.browser.msie) {
                    dataTable.width(e.sender.wrapper.children(".k-grid-header").find("table").width());
                    contentDiv.scrollLeft(1);
                }
            }
        }
    };
    var FilteredCellStyle = function (e) {
        var filter = e.sender.dataSource.filter();
        e.sender.thead.find(".k-header.k-state-active").removeClass("k-state-active");
        if (filter) {
            var filteredMembers = {};
            SetFilteredMembers(filter, filteredMembers);
            e.sender.thead.find("th[data-field]").each(function () {
                var cell = $(this);
                var filtered = filteredMembers[cell.data("field")];
                if (filtered) {
                    cell.addClass("k-state-active");
                }
            });
        }
    };
    var CustomFieldTypeToGridDataType = function (cftype) {
        if (cftype == "CHECKBOX")
            return "string";
        else if (cftype == "ENTITY")
            return "string";
        else if (cftype == "FREETEXT")
            return "string";
        else if (cftype == "LOOKUP")
            return "string";
        else if (cftype == "DATE")
            return "date";
        else if (cftype == "NUMERIC")
            return "number";
        else if (cftype == "TIME")
            return "date";

    }
    var LoadCustomFieldRelations = function () {

        if (!_grd.entity)
            return $.Deferred().resolve();

        var gridreq = {
            sort: [
                { field: "CFR_TYPE", dir: "asc" },
                { field: "CFR_GROUPORDER", dir: "asc" },
                { field: "CFR_ORDER", dir: "asc" }
            ],
            filter: {
                filters: [
                    { field: "CFR_ENTITY", value: _grd.entity, operator: "eq" },
                    { field: "CFR_AUTH", value: "H", operator: "neq" }
                ]
            },
            loadall: true
        };

        return tms.Ajax({
            url: "/Api/ApiCustomFieldRelations/GetCustomFields",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                if (d.data) {
                    if (d.data.customfields && d.data.customfields.length > 0) {
                        for (var i = 0; i < d.data.customfields.length; i++) {
                            var cf = d.data.customfields[i];
                            var cfr = $.grep(d.data.customfieldrelations, function (e) {
                                return e.CFR_CODE === cf.CFD_CODE;
                            })[0];
                            var fieldcode = cf.CFD_CODE.replace(/[\W_]+/g, "");
                            var fieldclass = cf.CFD_CLASS;
                            var coltype = CustomFieldTypeToGridDataType(cf.CFD_FIELDTYPE);
                            _columns.push({
                                fieldtype: "CF",
                                type: coltype,
                                field: fieldcode,
                                ofield: cf.CFD_CODE,
                                title: cf.CFD_DESCF + (fieldclass ? " (" + cfr.CFR_TYPEDESC + ")" : ""),
                                width: 250,
                                sortable: false
                            });

                            if ($.inArray(coltype, ["date", "number"]) !== -1) {
                                _grd.fields[fieldcode] = {
                                    type: coltype
                                };
                            }
                        }
                    }
                }
            }
        });
    }
    var LoadGridConfiguration = function () {
        var gridreq = {
            sort: [{ field: "UGC_ORDER", dir: "asc" }],
            filter: {
                filters: [
                    { field: "UGC_GRID", value: _grd.name, operator: "eq" },
                    { field: "UGC_USER", value: user, operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiUserGridConfiguration/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var usergridconfig = !!d.data;
                for (var i = 0; i < _columns.length; i++) {
                    var coli = _columns[i];
                    coli.order = i;
                    if (usergridconfig) {
                        var ucol = $.grep(d.data, function (e) { return e.UGC_FIELD === coli.field })[0];
                        if (ucol) {
                            coli.width = ucol.UGC_WIDTH;
                            coli.hidden = (ucol.UGC_HIDDEN === "+");
                            coli.order = ucol.UGC_ORDER;
                        }
                    }
                    usercols.push(coli);
                }
                usercols.sortBy(function (o) { return o.order; });
            }
        });
    };
    var SaveCube = function (cube) {
        return tms.Ajax({
            url: "/Api/ApiCubes/Save",
            data: JSON.stringify(cube)
        });
    };
    var RemoveCube = function (id) {
        return tms.Ajax({
            url: "/Api/ApiCubes/DelRec",
            data: JSON.stringify(id)
        });
    };
    var LoadCubes = function () {
        var gridreq = {
            sort: [{ field: "CUB_ID", dir: "desc" }],
            filter: {
                filters: [
                    { field: "CUB_GRID", value: _grd.name, operator: "eq" },
                    { field: "CUB_USER", value: user, operator: "eq" }
                ]
            }
        };

        return tms.Ajax({
            url: "/Api/ApiCubes/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                cubes = d.data;
            }
        });
    };
    var SaveGridConfiguration = function () {
        var confarr = [];
        for (var i = 0; i < kdgriddata().columns.length; i++) {
            var ci = kdgriddata().columns[i];
            var c = {
                UGC_GRID: kdgriddata().element.attr("id"),
                UGC_ORDER: i,
                UGC_FIELD: ci.field,
                UGC_HIDDEN: ci.hidden ? "+" : "-",
                UGC_WIDTH: ci.width,
                UGC_USER: user
            };
            confarr.push(c);
        }

        return tms.Ajax({
            url: "/Api/ApiUserGridConfiguration/Save",
            data: JSON.stringify({
                User: user,
                Grid: kdgriddata().element.attr("id"),
                UserGridConfigurationList: confarr
            }),
            fn: function (d) {
                location.reload();
            }
        });
    };
    var LoadHistory = function () {
    };


    /* Callbacks */

    var GridDataBound = function (e) {


        dataBindingFlag = true;
        var ds = e.sender.dataSource;

        state = {
            page: ds.page(),
            pageSize: ds.pageSize(),
            sort: ds.sort(),
            filter: ds.filter(),
            group: ds.group()
        };

        // Has more data to load?
        if (ds.data().length !== latestdatalen || latestdatalen === constants.gridpagesize) {
            latestdatalen = ds.data().length;
            hasmoredata = true;
        } else {
            hasmoredata = false;
        }

        // Previous selected row before load
        if (sis)
            self.SelectRow(sis);

        // Change cell content according to the data-type
        var gridtable = $(e.sender.table);
        gridtable.find("[data-type=\"string\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? value : "");
        });
        gridtable.find("[data-type=\"number\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? value : "");
        });
        gridtable.find("[data-type=\"date\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? moment(new Date($(this).text())).format(constants.dateformat) : "");
        });
        gridtable.find("[data-type=\"datetime\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? moment(new Date($(this).text())).format(constants.longdateformat) : "");
        });
        gridtable.find("[data-type=\"price\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? parseFloat(value).toLocaleString(culture, { maximumFractionDigits: constants.pricedecimals, minimumFractionDigits: constants.pricedecimals }) : "");
        });
        gridtable.find("[data-type=\"exch\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? parseFloat(value).toLocaleString(culture, { maximumFractionDigits: constants.exchdecimals, minimumFractionDigits: constants.exchdecimals }) : "");
        });
        gridtable.find("[data-type=\"qty\"]").each(function () {
            var value = $(this).text();
            $(this).text(value !== "null" ? parseFloat(value).toLocaleString(culture, false) : "");
        });

        FixNoDataScrollingIssue(e);
        FilteredCellStyle(e);

        if (_grd.hasfiltermenu && !cubesloaded) {
            $.when(LoadCubes()).done(function () {
                cubesloaded = true;
                if (cubes) {
                    var cubestr = "";
                    for (var i = 0; i < cubes.length; i++) {
                        cubestr += "<li><a data-action=\"run\" data-filterid=\"" +
                            cubes[i].CUB_ID +
                            "\"><i class=\"fa fa-filter\" aria-hidden=\"true\"></i> " +
                            cubes[i].CUB_DESC +
                            "</a></li>";
                    }
                    $("#grdCubes").append(cubestr);
                }
            });
        }

        if (_grd.databound && typeof (_grd.databound) == "function")
            _grd.databound(e);
    };
    var GridChange = function (e) {
        if (e.sender.select().length > 0)
            if (_grd.change && typeof (_grd.change) == "function")
                _grd.change(e);
    };
    var GridBuild = function () {
        var dfd = $.Deferred();
        if (_grd.build && typeof (_grd.build) == "function")
            return $.when(_grd.build(_columns)).done(function () {
                return dfd.resolve();
            });
        else
            return dfd.resolve();
        return dfd.promise();
    }

    /* Callbacks */

    var FilterRowConfiguration = function () {
        for (var i = 0; i < usercols.length; i++) {
            var c = usercols[i];
            if (c.filterable === false || c.hidden)
                continue;

            if (typeof c.filterable === "undefined") {
                c.filterable = { cell: {} };
            }

            switch (c.type) {
                case "string":
                default:
                    c.filterable.cell.operator = "contains";
                    c.filterable.cell.template = function (e) {
                        e.element.addClass("k-textbox").css({ width: "100%" });
                    };
                    break;
                case "date":
                    c.filterable.cell.operator = "eq";
                    c.filterable.cell.template = function (e) {
                        e.element.kendoDatePicker({ format: constants.kendodateformat });
                    };
                    break;
                case "time":
                    c.filterable.cell.showOperators = false;
                    c.filterable.cell.operator = "eq";
                    c.filterable.cell.template = function (e) {
                        e.element.kendoTimePicker({ format: constants.timeformat });
                    };
                    break;
                case "datetime":
                    c.filterable.cell.operator = "eq";
                    c.filterable.cell.template = function (e) {
                        e.element.kendoDateTimePicker({ format: constants.kendodatetimeformat });
                    };
                    break;
                case "number":
                    c.filterable.cell.operator = "eq";
                    c.filterable.cell.template = function (e) {
                        var numeric = e.element.kendoNumericTextBox({ spinners: false, format: "{0:0}", decimals: 2 }).data("kendoNumericTextBox");
                        numeric.wrapper.find(".k-numeric-wrap").addClass("expand-padding").find(".k-select").hide();
                    };
                case "price":
                case "qty":
                    c.filterable.cell.operator = "eq";
                    c.filterable.cell.template = function (e) {
                        var numeric = e.element.kendoNumericTextBox({ spinners: false, format: "#", decimals: 2 }).data("kendoNumericTextBox");
                        numeric.wrapper.find(".k-numeric-wrap").addClass("expand-padding").find(".k-select").hide();
                    };
                    break;
            }
        }
    };

    var InfiniteScrolling = function () {
        if (_grd.loadall)
            return;

        var content = $(_grd.selector).find(".k-grid-content");
        content.on("scroll", function (e) {
            var dataDiv = e.target;
            if (dataBindingFlag) {
                if (scrollticker) { window.clearTimeout(scrollticker); scrollticker = null; }
                scrollticker = window.setTimeout(function () {
                    if (dataDiv.scrollTop > 0 && hasmoredata && dataDiv.scrollTop >= dataDiv.scrollHeight - dataDiv.offsetHeight - scrollbarWidth) {
                        dataBindingFlag = false;
                        GetNextPage();
                    }
                }, 50);
            }
        });
    };
    var BuildToolbar = function () {
        var tb = "";
        if (_grd.toolbar) {
            var tb = "<div class=\"pull-left\">";
            if (_grd.toolbar && _grd.toolbar.left) {
                tb += "<div class=\"btn-group\">";
                for (var i = 0; i < _grd.toolbar.left.length; i++) {
                    var lefti = _grd.toolbar.left[i];
                    tb += lefti + " ";
                }
                tb += "</div>";
            }
            tb += "</div>";
            tb += "<div class=\"pull-right\">";
            if (_grd.toolbar && _grd.toolbar.right) {
                tb += "<div class=\"btn-group\">";
                for (var i = 0; i < _grd.toolbar.right.length; i++) {
                    var righti = _grd.toolbar.right[i];
                    tb += righti + " ";
                }
                if (_grd.hasfiltermenu) {
                    tb += "<div class=\"btn-group\" role=\"group\">" +
                        "<button id=\"btncube\" type=\"button\" style=\"height:14px;\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">" +
                        "<i class=\"fa fa-cube\" aria-hidden=\"true\"></i> " +
                        "<span class=\"caret\"></span>" +
                        "</button>" +
                        "<ul id=\"grdCubes\" class=\"dropdown-menu pull-right\">" +
                        "<li><a id=\"fmreset\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i> #= applicationstrings[lang].reset #</a></li>" +
                        "<li><a id=\"fmnew\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i> #= applicationstrings[lang].addnew #</a></li>" +
                        "</ul></div></div>";
                }
                tb += "</div>";
            }
            tb += "</div>";
        }
        return tb;
    };
    var GodEvent = function (e) {
        var cols = kdgriddata().columns.slice();
        if (e.newIndex) {
            cols.move(e.oldIndex, e.newIndex);
        }
    };
    var onFiltering = function (e) {

    }
    function buildCustomFilter(val, op, field) {
        let isnullop = (op == 'isnull' || op == 'isnotnull');
        let isvalundef = (val == undefined || val == '');
        let f_value = isnullop ? undefined : val;
        if (field == undefined || op == undefined)
            return;
        if (!isnullop && isvalundef) {
            let ind = custom_filter.indexOf(custom_filter.find(x => x.field == field));
            if (ind >= 0) {
                custom_filter.splice(ind, 1);
            }


            return;
        }


        let filter_object = { operator: op, value: f_value, field: field };
        let ind = custom_filter.indexOf(custom_filter.find(x => x.field == field));

        if (ind >= 0) {
            custom_filter[ind] = filter_object;

            return;
        }
        custom_filter.push(filter_object);

        return;
    }
    var RegisterEvents = function () {

        kdgrid.find(".k-textbox").unbind();
        kdgrid.find(".k-input").unbind();

        kdgrid.off("click", ".k-button").on("click", ".k-button", function () {
            let field_ = $(this).closest(".k-filtercell").attr('data-field');
            custom_filter.splice(custom_filter.indexOf(custom_filter.find(x => x.field == field_)), 1);
        });
        kdgrid.off("change", ".k-filtercell").on("change", ".k-filtercell", function (e) {
            let inp = $(this).find('[data-bind="value: value"]');
            let field_ = $(this);
            let op_ = field_.find("input.k-dropdown-operator");
            let filter_value;
            let inp_type = inp[0].attributes["data-role"].nodeValue;
            if (inp[0].className == "k-input") {
                if (inp_type == "datetimepicker" || inp_type == "datepicker") {
                    let date_value = inp[0].value;
                    switch (inp_type) {
                        case "datepicker":
                            var selecteddate = new Date(date_value);
                            date_value = moment(selecteddate).format(constants.dateformat);
                            break;
                        case "datetimepicker":
                            var selecteddate = new Date(date_value);
                            date_value = moment(selecteddate).format(constants.longdateformat);
                            break;
                    }
                    filter_value = date_value;

                } else {
                    filter_value = inp[0].kendoBindingTarget.target._text[0].value;
                }
            }

            else {
                filter_value = inp.val();
            }
            let filter_field = field_.attr('data-field');
            let filter_operator = op_.val();
            buildCustomFilter(filter_value, filter_operator, filter_field);
        });
        kdgrid.off("keypress", ".k-filtercell").on("keypress", ".k-filtercell", function (e) {
            if (e.keyCode == 13) {
                let inp = $(this).find('[data-bind="value: value"]');
                let field_ = $(this);
                let op_ = field_.find("input.k-dropdown-operator");
                if (inp[0].className == "k-input") {
                    filter_value = inp[0].kendoBindingTarget.target._text[0].value;
                }
                else {
                    filter_value = inp.val();
                }
                let filter_field = field_.attr('data-field');
                let filter_operator = op_.val();
                buildCustomFilter(filter_value, filter_operator, filter_field);
                kdgriddata().dataSource._filter = { filters: custom_filter, logic: "and" };
                kdgriddata().dataSource.read();
            }
        });


        kdgrid.off("click", "#export").on("click", "#export", Excel);
        kdgrid.off("click", "#count").on("click", "#count", function () {
            return $.when(GetRecordCount()).done(function (d) {
                msgs.info(applicationstrings[lang].recordcount + " : " + d.data + " / " + applicationstrings[lang].listcount + " : " + self.GetCount());
            });
        });
        kdgrid.off("click", "#save").on("click", "#save", SaveGridConfiguration);
        kdgrid.off("click", "#history").on("click", "#history", LoadHistory);
        kdgrid.off("click", "#fmreset").on("click", "#fmreset", function () {
            _grd.filter = $.grep(_grd.filter, function (e) { return e.IsPersistent && ((e.FilterSource || "X") !== "CUBE") });
            kdgrid.find("#btncube").removeClass("btn-info").addClass("btn-default");
            kdgrid.find("[data-action=\"run\"]").css("color", "");
            self.RunFilter(_grd.filter);
        });
        kdgrid.off("click", "#fmnew").on("click", "#fmnew", function () {
            if (cubes) {
                var strflist = "";
                for (var i = 0; i < cubes.length; i++) {
                    strflist +=
                        "<div class=\"row custom\"><a class=\"btn btn-xs btn-danger\" data-action=\"remove\" data-filterid=\"" +
                        cubes[i].CUB_ID +
                        "\"><i class=\"fa fa-remove\"></i> " +
                        cubes[i].CUB_DESC +
                        "</a><div/>";
                }
                $("#filterlist").find("*").remove();
                $("#filterlist").append(strflist);
            }

            $("#filtername").val("");
            $("#modalnewfilter").modal("show");
        });
        kdgrid.off("click", "[data-action=\"run\"]").on("click", "[data-action=\"run\"]", function () {
            var $this = $(this);
            var id = $this.data("filterid");
            if (cubes) {
                var qi = $.grep(cubes, function (e) { return e.CUB_ID === id });
                if (qi.length > 0) {
                    kdgrid.find("[data-action=\"run\"]").css("color", "");
                    kdgrid.find("#btncube").removeClass("btn-default").addClass("btn-info");
                    $this.css("color", "#2fa7cb");
                    var cubefilter = JSON.parse(qi[0].CUB_FILTER);
                    if (cubefilter) {
                        $(cubefilter).each(function (i, e) {
                            e.IsPersistent = true;
                            e.FilterSource = "CUBE";
                        });

                        self.RunFilter(cubefilter);
                    }
                }
            }
        });
        $("#modalnewfilter").off("click", "[data-action=\"remove\"]").on("click", "[data-action=\"remove\"]", function () {
            var $this = $(this);
            var id = $(this).data("filterid");
            if (cubes) {
                $.when(RemoveCube(id)).done(function () {
                    cubes = $.grep(cubes, function (e) { return e.CUB_ID !== id });
                    kdgrid.find("li > a[data-action=\"run\"][data-filterid=\"" + id + "\"]").remove();
                    $this.remove();
                    $("#modalnewfilter").modal("hide");
                });
            }
        });
        $("#modalnewfilter").off("click", "#btnSaveFilter").on("click", "#btnSaveFilter", function () {
            $.when(SaveCube({
                CUB_GRID: _grd.name,
                CUB_DESC: $("#filtername").val(),
                CUB_DEFAULT: "+",
                CUB_USER: user,
                CUB_FILTER: self.CurrentQuery()
            })).done(function () {
                $("#modalnewfilter").modal("hide");
                location.reload();
            });
        });
    };
    var BuildGrid = function () {
        $(_grd.selector).empty();
        FilterRowConfiguration();
        var ds = CreateDataSource();
        var tb = BuildToolbar();
        var o = {
            dataSource: ds,
            columns: usercols,
            rowTemplate: BuildRowTemplate(),
            height: _grd.height,
            sortable: true,
            scrollable: true,
            resizable: true,
            reorderable: true,
            filterable: { extra: false, mode: "row" },
            toolbar: tb,
            toolbarColumnMenu: (_grd.toolbarColumnMenu || false),
            selectable: _grd.selectable ? _grd.selectable : "row",
            change: function (e) { GridChange(e); },
            dataBound: GridDataBound,
            columnReorder: GodEvent,
            columnShow: GodEvent,
            columnHide: GodEvent,
            groupable: _grd.groupable,
            columnResize: GodEvent,
            filter: onFiltering
        };

        kdgrid = $(_grd.selector).kendoExtGrid(o);
        InfiniteScrolling();
        RegisterEvents();
    };

    $.when(GridBuild()).done(function () {
        $.when(LoadCustomFieldRelations()).done(function () {
            $.when(LoadGridConfiguration()).done(function () {
                BuildGrid();
            });
        });
    });

}