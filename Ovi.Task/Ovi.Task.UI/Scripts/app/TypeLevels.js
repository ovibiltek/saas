(function() {
    var selectedrecord = null;
    var selectedentity = null;
    var typelevelid = null;
    var scr, typl;

    var screenconf = [
        {
            name: "record",
            btns: [
                { id: "#btnNew", selectionrequired: false },
                { id: "#btnSave", selectionrequired: false },
                { id: "#btnUndo", selectionrequired: true },
                { id: "#btnDelete", selectionrequired: true },
                { id: "#btnHistory", selectionrequired: true }
            ]
        }
    ];

    typl = new function() {
        var self = this;
        var strlinesnestabel = "";
        var data = [];

        var FillUserInterface = function() {
            if (tms.ActiveTab() === "record")
                tms.BeforeFill("#record");

            tms.Tab(selectedrecord.TLV_ID);

            $("#typelevelid").val(selectedrecord.TLV_ID);
            $("#entity").val(selectedrecord.TLV_TYPEENTITY);
            $("#code").val(selectedrecord.TLV_CODE);
            $("#desc").val(selectedrecord.TLV_DESC);
            $("#type").val(selectedrecord.TLV_TYPE);
            $("#parent").data("id",selectedrecord.TLV_PARENT);
            $("#parent").val(selectedrecord.TLV_PARENTCODE);

            tooltip.show("#parent", selectedrecord.TLV_PARENTDESC);

            $(".page-header>h6").html(selectedrecord.TLV_CODE + " - " + selectedrecord.TLV_DESC);
        };
        this.LoadSelected = function(id) {
            var selecteditem = id;

            return tms.Ajax({
                url: "/Api/ApiTypeLevels/Get",
                data: JSON.stringify(selecteditem),
                fn: function(d) {
                    selectedrecord = d.data;
                    FillUserInterface();
                }
            });
        };
        var GetTypeLevel = function(id) {
            var dfd = $.Deferred();
            if (id == null) {
                dfd.resolve(null);
            } else {
                tms.Ajax({
                    url: "/Api/ApiTypeLevels/Get",
                    data: JSON.stringify(id),
                    fn: function(d) {
                        dfd.resolve(d.data);
                    }
                });
            }
            return dfd.promise();
        }
        var Remove = function() {
            if (selectedrecord) {

                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function() {
                        return tms.Ajax({
                            url: "/Api/ApiTypeLevels/Delete",
                            data: JSON.stringify(selectedrecord.TLV_ID),
                            fn: function(d) {
                                msgs.success(d.data);
                                self.ResetUI();
                                self.List();
                            }
                        });
                    });
            }
        };
        var Save = function() {
            if (!tms.Check("#record"))
                return $.Deferred().reject();

            var o = JSON.stringify({
                TLV_ID: (typelevelid || 0),
                TLV_CODE: $("#code").val(),
                TLV_DESC: $("#desc").val(),
                TLV_TYPEENTITY: $("#entity").val().toUpper(),
                TLV_TYPE: $("#type").val(),
                TLV_PARENT: $("#parent").data("id"),
                TLV_CREATED: selectedrecord != null ? selectedrecord.TLV_CREATED : tms.Now(),
                TLV_CREATEDBY: selectedrecord != null ? selectedrecord.TLV_CREATEDBY : user,
                TLV_UPDATED: selectedrecord != null ? tms.Now() : null,
                TLV_UPDATEDBY: selectedrecord != null ? user : null,
                TLV_RECORDVERSION: selectedrecord != null ? selectedrecord.TLV_RECORDVERSION : 0
            });

            return tms.Ajax({
                url: "/Api/ApiTypeLevels/Save",
                data: o,
                fn: function(d) {
                    msgs.success(d.data);
                    selectedrecord = d.r;
                    typelevelid = d.r.TLV_ID;
                    FillUserInterface();
                    self.List();
                }
            });
        };
        this.ResetUI = function() {
            selectedrecord = null;
            typelevelid = null;

            tms.Reset("#record");

            $("#typelevelid").val("");
            $("#entity").val(selectedentity);
            $("#code").val("");
            $("#desc").val("");
            $("#type").val("");
            $("#parent").val("");
            $("#parent").data("id", null);

            strlinesnestabel = "";

            // Hide Tooltips
            tooltip.hide("#type");
            tooltip.hide("#parent");
        };
        var RegisterUiEvents = function() {

            $("#btnSave").click(Save);
            $("#btnDelete").click(Remove);
            $("#btnNew").click(self.ResetUI);
            $("#btnUndo").click(self.LoadSelected);
            $("#btnHistory").click(self.HistoryModal);
            $("#entityforlist").change(function() {
                selectedentity = $("#entityforlist").val();
                $("#entity").val(selectedentity);
                self.List();
            });

            $("#btntype").click(function() {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypes/List",
                    keyfield: "TYP_CODE",
                    codefield: "TYP_CODE",
                    textfield: "TYP_DESC",
                    returninput: "#type",
                    columns: [
                        { type: "string", field: "TYP_CODE", title: gridstrings.type[lang].type, width: 100 },
                        {
                            type: "string",
                            field: "TYP_DESCF",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TYP_ENTITY", value: $("#entity").val().toUpper(), operator: "eq" },
                        { field: "TYP_ACTIVE", value: "+", operator: "eq" },
                        { field: "TYP_ORGANIZATION", value: ["*"], operator: "in" },
                        { field: "TYP_CODE", value: "*", operator: "neq" }
                    ],
                    callback: function(data) {
                        $("#parent").val("");
                        tooltip.hide("#parent");
                    }
                });
            });
            $("#type").autocomp({
                listurl: "/Api/ApiTypes/List",
                geturl: "/Api/ApiTypes/Get",
                field: "TYP_CODE",
                textfield: "TYP_DESC",
                active: "TYP_ACTIVE",
                filter: [
                    { field: "TYP_ENTITY", func: function() { return $("#entity").val().toUpper() }, operator: "eq" },
                    { field: "TYP_ORGANIZATION", value: ["*"], operator: "in" },
                    { field: "TYP_CODE", value: "*", operator: "neq" }
                ],
                callback: function(data) {
                    $("#parent").val("");
                    tooltip.hide("#parent");
                }
            });
            $("#btnparent").click(function() {
                gridModal.show({
                    modaltitle: gridstrings.type[lang].title,
                    listurl: "/Api/ApiTypeLevels/List",
                    keyfield: "TLV_CODE",
                    codefield: "TLV_CODE",
                    textfield: "TLV_DESC",
                    returninput: "#parent",
                    columns: [
                        { type: "string", field: "TLV_CODE", title: gridstrings.type[lang].type, width: 100 },
                        {
                            type: "string",
                            field: "TLV_DESC",
                            title: gridstrings.type[lang].description,
                            width: 400
                        }
                    ],
                    filter: [
                        { field: "TLV_TYPEENTITY", value: $("#entity").val().toUpper(), operator: "eq" },
                        { field: "TLV_TYPE", value: $("#type").val(), operator: "eq" }
                    ],
                    callback: function (d) {
                        if (d) {
                            $("#parent").data("id", d.TLV_ID);
                        }
                    }
                });
            });
            $("#parent").autocomp({
                listurl: "/Api/ApiTypeLevels/List",
                geturl: "/Api/ApiTypeLevels/Get",
                field: "TLV_CODE",
                textfield: "TLV_DESC",
                filter: [
                    { field: "TLV_TYPEENTITY", func: function () { return $("#entity").val().toUpper() }, operator: "eq" },
                    { field: "TLV_TYPE", func: function () { return $("#type").val() }, operator: "eq" }
                ],
                callback: function (d) {
                    if (d) {
                        $("#parent").data("id", d.TLV_ID);
                    }
                }
            });
            $("#entity").change(function() {
                $("#type").val("");
                $("#parent").val("");

                tooltip.hide("#type");
                tooltip.hide("#parent");
            });
        };
        var ChildBuilder = function(parent, list) {

            var childs = $.grep(list, function(item, i) { return item.TLV_PARENT === parent.id; });
            if (childs.length === 0) return;

            for (var i = 0; i < childs.length; i++) {
                var di = childs[i];
                var child = { name: di.TLV_CODE + " - " + di.TLV_DESC, id: di.TLV_ID, children: [] };
                parent.children.push(child);
                ChildBuilder(child, list);
            }
        };
        var NestableList = function(d) {
            data = [];
            $("#treelevel").tree("destroy");

            var parentless = $.grep(d, function(item, i) { return item.TLV_PARENT === null; });
            for (var i = 0; i < parentless.length; i++) {
                var di = parentless[i];
                var parent = {
                    name: di.TLV_CODE + " - " + di.TLV_DESC,
                    id: di.TLV_ID,
                    children: []
                };
                ChildBuilder(parent, d);
                data.push(parent);
            }

            $("#treelevel").tree({
                data: data,
                autoOpen: true,
                dragAndDrop: true
            }).on("tree.select",
                function(event) {
                    if (event.node) {
                        var node = event.node;
                        typelevelid = node.id;
                        self.LoadSelected(node.id);
                    }
                }).on(
                "tree.move",
                function(event) {
                    event.preventDefault();
                    var targetID = null;
                    if (event.move_info.position !== "inside") {
                        targetID = event.move_info.target_node.parent.id || null;
                    } else {
                        targetID = event.move_info.target_node.id || null;
                    }

                    $.when(self.LoadSelected(event.move_info.moved_node.id)).done(function() {
                        $.when(GetTypeLevel(targetID)).done(function(data) {
                            if (selectedrecord.TLV_TYPEENTITY ===
                                (data != null ? data.TLV_TYPEENTITY : selectedrecord.TLV_TYPEENTITY) &&
                                selectedrecord.TLV_TYPE === (data != null ? data.TLV_TYPE : selectedrecord.TLV_TYPE)) {
                                $("#savechanges").modal().off("click", "#yes").one("click",
                                    "#yes",
                                    function() {
                                        event.move_info.do_move();
                                        selectedrecord.TLV_PARENT = targetID;
                                        selectedrecord.TLV_UPDATED = tms.Now();
                                        selectedrecord.TLV_UPDATEDBY = user;

                                        return tms.Ajax({
                                            url: "/Api/ApiTypeLevels/Save",
                                            data: JSON.stringify(selectedrecord),
                                            fn: function(d) {
                                                msgs.success(d.data);
                                                selectedrecord = d.r;
                                                FillUserInterface();
                                            }
                                        });
                                    });
                            } else {
                                msgs.error(applicationstrings[lang].typeleveleeror);
                            }
                        });
                    });
                }
            );
        };
        this.List = function() {
            if (selectedentity !== null) {
                var gridreq = {
                    loadall: true,
                    filter: {
                        filters: [
                            { field: "TLV_TYPEENTITY", value: selectedentity, operator: "eq" }
                        ]
                    }
                };

                return tms.Ajax({
                    url: "/Api/ApiTypeLevels/List",
                    data: JSON.stringify(gridreq),
                    fn: function(d) {
                        if (d) {
                            NestableList(d.data);
                        }
                    }
                });
            }

        };

        this.BuildUI = function() {
            self.ResetUI();
            RegisterUiEvents();
        };
    };
    scr = new function() {
        this.BindHotKeys = function() {
            tms.RegisterShortcuts([
                {
                    k: "ctrl+s",
                    e: function() {
                        switch (tms.ActiveTab()) {
                        case "record":
                            return "#btnSave";
                        }
                    },
                    f: function() {
                        switch (tms.ActiveTab()) {
                        case "record":
                            typ.Save();
                            break;
                        }
                    }
                },
                {
                    k: "ctrl+r",
                    e: function() {
                        switch (tms.ActiveTab()) {
                        case "record":
                            return "#btnNew";
                        }
                    },
                    f: function() {
                        switch (tms.ActiveTab()) {
                        case "record":
                            typ.ResetUI();
                            break;
                        }
                    }
                },
                {
                    k: "ctrl+u",
                    e: "#btnUndo",
                    f: function() {
                        typ.LoadSelected();
                    }
                },
                {
                    k: "ctrl+d",
                    e: function() {
                        switch (tms.ActiveTab()) {
                        case "record":
                            return "#btnDelete";
                        }
                    },
                    f: function() {
                        switch (tms.ActiveTab()) {
                        case "record":
                            typ.Remove();
                            break;
                        }
                    }
                },
                {
                    k: "ctrl+h",
                    e: "#btnTranslations",
                    f: function() {
                        typ.TranslationModal();
                    }
                },
                {
                    k: "ctrl+q",
                    e: "#btnTranslations",
                    f: function() {
                        translationModal();
                    }
                }
            ]);
        };
        this.Configure = function() {
            var activeTab = tms.ActiveTab();
            $(".tms-page-toolbar button").attr("disabled", "disabled");
            var tab = $.grep(screenconf, function(e) { return e.name === activeTab; })[0];
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
        typl.BuildUI();
        scr.BindHotKeys();
    }

    $(document).ready(ready);
}());