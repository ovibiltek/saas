$.widget("custom.list",
    {
        vars: {
            latestdatalen: 0,
            page: 1,
            dataid: -1,
            dataentity: "",
            onscroll: false
        },

        options: {
            excelfilename: "list.xlsx",
            listurl: "",
            fields: null,
            srch: null,
            sort: null,
            predefinedfilters: null,
            keyfieldisvisible: true,
            textfieldvisible: true,
            hascustomfilter: false,
            type: null,
            height: null,
            filter: [],
            callback: null
        },

        _filterArray: function () {
            var $this = this;
            var srch = $("#list_search").val();
            var filters = [...$this.options.filter];

            if ($this.options.type && $this.options.type === "A" && $this.options.predefinedfilters)
                filters = $this.options.predefinedfilters.slice();

            if (srch) {
                if ($this.options.type && $this.options.type === "A") {
                    if ($this.options.srch) {
                        for (var i = 0; i < $this.options.srch.filters.length; i++) {
                            $this.options.srch.filters[i].value = srch;
                        }
                        filters.push($this.options.srch);
                    }
                } else {
                    if ($this.options.filterconf) {
                        for (var i = 0; i < $this.options.filterconf.length; i++) {
                            var f = $this.options.filterconf[i];
                            filters.push({ field: f.field, value: srch, operator: f.operator, logic: "or" });
                        }
                    } else {
                        for (var property in $this.options.fields) {
                            if ($this.options.fields.hasOwnProperty(property)) {
                                if (Object.prototype.toString.call($this.options.fields[property]) === "[object Array]") {
                                    for (var i = 0; i < $this.options.fields[property].length; i++) {
                                        var f = $this.options.fields[property][i].field;
                                        if ($this.options.filterarr && $.inArray(f, $this.options.filterarr) === -1)
                                            continue;
                                        filters.push({ field: f, value: srch, operator: "contains", logic: "or" });
                                    }
                                } else {
                                    var f = $this.options.fields[property];
                                    if ($this.options.filterarr && $.inArray(f, $this.options.filterarr) === -1)
                                        continue;
                                    filters.push({ field: f, value: srch, operator: "contains", logic: "or" });
                                }
                            }
                        }
                    }
                }
            }

            return filters;
        },

        _b64ToUint6: function (nChr) {
            return nChr > 64 && nChr < 91
                ? nChr - 65
                : nChr > 96 && nChr < 123
                    ? nChr - 71
                    : nChr > 47 && nChr < 58
                        ? nChr + 4
                        : nChr === 43
                            ? 62
                            : nChr === 47
                                ? 63
                                : 0;
        },

        _base64DecToArr: function (sBase64, nBlocksSize) {
            var $this = this;
            var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
                nInLen = sB64Enc.length,
                nOutLen = nBlocksSize
                    ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
                    : nInLen * 3 + 1 >> 2,
                taBytes = new Uint8Array(nOutLen);

            for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                nMod4 = nInIdx & 3;
                nUint24 |= $this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                if (nMod4 === 3 || nInLen - nInIdx === 1) {
                    for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++ , nOutIdx++) {
                        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                    }
                    nUint24 = 0;
                }
            }

            return taBytes;
        },

        _create: function () {
            var $this = this;
            $($this.element).height($this.options.height || constants.defaultlistheight);
            $($this.element).css("margin-right", "0");

            $("<div class=\"input-group\">" +
                "<input type=\"text\" placeholder=\"" +
                applicationstrings[lang].search +
                "\" class=\"form-control\" id=\"list_search\"/>" +
                "<span class=\"input-group-btn\">" +
                ($this.options.toolbaricons || "") +
                "<button style=\"border-radius:0\" class=\"btn btn-default\" id=\"btncount\" type=\"button\"><i class=\"fa fa-eye\"></i></button>" +
                "<button style=\"border-radius:0\" class=\"btn btn-default\" id=\"btnexport\" type=\"button\"><i class=\"fa fa-file-excel-o\"></i></button>" +
                "</span>" +
                "</div>").insertBefore($this.element.parents("div.scroll-wrapper"));
            $(document).off("keyup", "#list_search").on("keyup", "#list_search", function (e) {
                if (e.keyCode === 13) {
                    $this.vars.page = 1;
                    $this.vars.latestdatalen = 0;
                    $this._list();
                }
            });
            $(document).off("click", "#btncount").on("click", "#btncount", function () { $this._count(); });
            $(document).off("click", "#btnexport").on("click", "#btnexport", function (e) { $this._export(e); });
            $this._list();
        },

        _list: function () {
            var $this = this;
            var filters = $this._filterArray();

            var gridreq = {
                page: $this.vars.page,
                sort: $this.options.sort,
                filter: { filters: filters },
                loadall: ($this.options.loadall || false)
            };

            if ($this.options.type && $this.options.type === "A") {
                gridreq.filter = null;
                gridreq.groupedFilters = filters;
            }

            return tms.Ajax({
                url: $this.options.listurl,
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $this._buildList(d.data);
                }
            });
        },

        _count: function () {
            var $this = this;
            var filters = $this._filterArray();

            var gridreq = {
                action: "CNT",
                loadall: true,
                page: $this.vars.page,
                sort: $this.options.sort,
                filter: { filters: filters }
            };

            if ($this.options.type && $this.options.type === "A") {
                gridreq.sort = null;
                gridreq.filter = null;
                gridreq.groupedFilters = filters;
            }

            return tms.Ajax({
                url: $this.options.listurl,
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    msgs.info(applicationstrings[lang].recordcount + " : " + d.data);
                }
            });
        },

        _excel: function (e, d) {
            function GetColumnNameFromIdx(idx) {
                var ret = "";
                for (var a = 1, b = 26; (idx -= a) >= 0; a = b, b *= 26) {
                    ret = String.fromCharCode(parseInt((idx % b) / a) + 65) + ret;
                }
                return ret;
            }

            var data = d.data;
            var worksheet = XLSX.utils.json_to_sheet(data, { header: Object.keys(data[0]) });

            // Stil ayarları için header’ları renklendirme
            const headerKeys = Object.keys(data[0]);
            headerKeys.forEach((key, index) => {
                const cellAddress = GetColumnNameFromIdx(index + 1) + "1";
                worksheet[cellAddress].s = {
                    font: { name: "Arial", sz: 10, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "03B8FD" } },
                    alignment: { horizontal: "center" }
                };
            });

            // Sütun genişliklerini ayarlama
            const colWidths = headerKeys.map((key) => {
                const maxLength = Math.max(
                    ...data.map(row => (row[key] ? row[key].toString().length : 0)),
                    key.length
                );
                return { wch: maxLength + 2 };
            });
            worksheet['!cols'] = colWidths;

            // Workbook oluşturma ve kaydetme
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "S1");

            // Dosyayı kaydetme
            const fileName = this.options.excelfilename || "ExportedData.xlsx";
            XLSX.writeFile(workbook, fileName);
        },

        _export: function (e) {
            var $this = this;
            var filters = $this._filterArray();

            var gridreq = { loadall: true, sort: $this.options.sort, filter: { filters: filters } };

            if ($this.options.type && $this.options.type === "A") {
                gridreq.sort = null;
                gridreq.filter = null;
                gridreq.groupedFilters = filters;
            }

            return tms.Ajax({
                url: $this.options.listurl,
                data: JSON.stringify(gridreq),
                fn: function (d) {
                    $this._excel(e, d);
                }
            });
        },

        _buildList: function (data) {
            var $this = this;

            var elm = $(this.element);
            var scrollelm = elm.parents(".scrollbar-macosx");
            if ($this.vars.page === 1) {
                elm.find(".list-group-item").remove();
            }

            scrollelm.scrollbar("destroy");
            scrollelm.scrollbar({
                "onScroll": function (y, x) {
                    if (!$this.options.loadall && data.length !== $this.vars.latestdatalen && !$this.options.customfilter) {
                        if (y.scroll != 0 && (Math.floor(y.maxScroll - 50) - Math.floor(y.scroll) <= 0)) {
                            if (!$this.vars.onscroll) {
                                $this.vars.latestdatalen = data.length;
                                $this.vars.page++;
                                $this.vars.onscroll = true;
                                $this._list();
                                console.log($this.vars.page);
                            } else {
                                $this.vars.onscroll = false;
                            }
                        }
                    }
                }
            });

            var str = "";
            for (var i = 0; i < data.length; i++) {

                var di = data[i];
                str += "<a href=\"#\" class=\"list-group-item\"" +
                    ($this.options.fields.entityfield
                        ? " data-entity=\"" + di[$this.options.fields.entityfield] + "\""
                        : "") +
                    " data-id=\"" +
                    di[$this.options.fields.keyfield] +
                    "\" ";
                if ($this.options.fields.datafields) {
                    for (var j = 0; j < $this.options.fields.datafields.length; j++) {
                        var datafield = $this.options.fields.datafields[j];
                        str += "data-" + datafield.name + "=\"" + di[datafield.field] + "\"";
                    }                   
                }


                if ($this.options.itemstyle && typeof ($this.options.itemstyle) == "function")
                    str += $this.options.itemstyle(str, di);

                str += ">";
                if ($this.options.fields.header) {
                    str += "<h3><strong>";
                    for (var j = 0; j < $this.options.fields.header.length; j++) {
                        var f = $this.options.fields.header[j];
                        str += di[f.field] + (j < ($this.options.fields.header.length - 1) ? " - " : "");
                    }
                    str += "</strong></h3>";
                }
                if ($this.options.keyfieldisvisible)
                    str += "<h4 class=\"list-group-item-heading\"><strong>" +
                        di[$this.options.fields.keyfield] +
                        "</strong></h4>";
                if ($this.options.textfieldvisible)
                    str += "<p class=\"list-group-item-text\"><strong>" +
                        applicationstrings[lang].desc +
                        " : </strong>" +
                        di[$this.options.fields.descfield] +
                        "</p>";
                if ($this.options.fields.otherfields)
                    for (var j = 0; j < $this.options.fields.otherfields.length; j++) {
                        var f = $this.options.fields.otherfields[j];
                        var fval;
                        if (f.func && typeof (f.func) == "function")
                            fval = f.func(di);
                        else
                            fval = (di[f.field] || f.blankval || "-");

                        str += "<p><strong>" + f.label + " </strong>: " + fval + "</p>";
                    }
                str += "</a>";


            }

            elm.find(".list-group-item").remove();
            elm.append(str);
            elm.find(".list-group-item").off().on("click",
                function (e) {
                    e.preventDefault();
                    elm.find(".list-group-item.active").removeClass("active");
                    $(this).addClass("active");
                    $this._trigger("itemclick", null, $(this));
                });

            var equery = "";
            if ($this.vars.dataentity)
                equery += "[data-entity=\"" + $this.vars.dataentity + "\"]";
            if ($this.vars.dataid !== -1)
                equery += "[data-id=\"" + $this.vars.dataid + "\"]";
            if (equery)
                elm.find("a.list-group-item" + equery).addClass("active");

            if ($this.options.callback && typeof ($this.options.callback) == "function")
                $this.options.callback(elm);
        },

        refresh: function () {
            var $this = this;
            var elm = $(this.element);
            var activelgi = elm.find("a.list-group-item.active");
            $this.vars.dataid = activelgi.data("id") || elm.data("id");
            $this.vars.dataentity = activelgi.data("entity") || elm.data("entity");
            $this._list();
        },

        _destroy: function () {
            var $this = this;
            var elm = $(this.element);
            elm.find("a.list-group-item").remove();
            elm.parents("div.scroll-wrapper").prev().remove();
        }
    });