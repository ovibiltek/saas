(function () {
    var selectedrecord = null;
   

    function testSql() {
        if (selectedrecord) {
            var code = selectedrecord.CON_ID;
            return tms.Ajax({
                url: "/Api/ApiConfirmations/ValidateConfirmation",
                data: JSON.stringify(code),
                fn: function (d) {
                    selectedrecord = d.r;
                    msgs.success(d.data);
                    $("#isvalidated").prop("checked", true);
                }
            });
        }
    }

    function resetUI() {
        selectedrecord = null;

        tms.Reset("#record");
        $("#title").val("");
        $("#message").val("");
        $("#sql").val("");
        $("#controller").val("");
        $("#info").val("");
        $("#parameters").val("");
        $("#active").prop("checked", true);
        $("#isvalidated").prop("checked", false);
        
    }

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#title").val(selectedrecord.CON_TITLE);
        $("#message").val(selectedrecord.CON_MESSAGE);
        $("#sql").val(selectedrecord.CON_SQL);
        $("#controller").val(selectedrecord.CON_CONTROLLER);
        $("#info").val(selectedrecord.CON_INFO);
        $("#active").prop("checked", selectedrecord.CON_ACTIVE === "+");
        $("#isvalidated").prop("checked", selectedrecord.CON_ISVALIDATED === "+");
        $(".page-header>h6").html(selectedrecord.CON_TITLE + " - " + selectedrecord.CON_ID);
        $("#parameters").val(selectedrecord.CON_PARAMS);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        console.log(code);
        return tms.Ajax({
            url: "/Api/ApiConfirmations/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
                console.log(d.data);
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            var code = selectedrecord.CON_ID;
            if (code != null) {
                $("#confirm").modal().off("click", "#delete").one("click",
                    "#delete",
                    function () {
                        return tms.Ajax({
                            url: "/Api/ApiConfirmations/DelRec",
                            data: JSON.stringify(code),
                            fn: function (d) {
                                $(".list-group").list("refresh");
                                resetUI();
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

                CON_ID: selectedrecord == null ? null : selectedrecord.CON_ID,
                CON_MESSAGE: $("#message").val(),
                CON_CONTROLLER: $("#controller").val(),
                CON_SQL: $("#sql").val(),
                CON_INFO: $("#info").val(),
                CON_ACTIVE: $("#active").prop("checked") ? "+" : "-",
                CON_ISVALIDATED: "-",
                CON_TITLE: $("#title").val(),
                CON_PARAMS: $("#parameters").val()
            
        });
        console.log(o);
        return tms.Ajax({
            url: "/Api/ApiConfirmations/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $("#isvalidated").prop("checked", false);
                $(".list-group").data("id", selectedrecord.CON_ID).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(fillUserInterface);
    
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
            }
           
            
        ]);
    }

    function buildUI() {
       
        $("#btnTestSql").click(testSql);

        $(".list-group").list({
            listurl: "/Api/ApiConfirmations/List",
            fields: {
                keyfield: "CON_ID",
                descfield: "CON_TITLE",
                otherfields: [{ field: "CON_MESSAGE", label: gridstrings.confirmation[lang].message }]

            },
            sort: [{ field: "CON_ID", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected(item);
            }
        });

        $("#btnmessage").click(function () {
            gridModal.show({
                modaltitle: gridstrings.messages[lang].title,
                listurl: "/Api/ApiMessages/List",
                keyfield: "MSG_ID",
                codefield: "MSG_CODE",
                textfield: "MSG_TEXT",
                returninput: "#message",
                columns: [
                    {
                        type: "string",
                        field: "MSG_CODE",
                        title: gridstrings.pricingparameters[lang].code,
                        width: 100
                    },
                    {
                        type: "string",
                        field: "MSG_LANG",
                        title: gridstrings.pricingparameters[lang].description,
                        width: 400
                    },
                    {
                        type: "string",
                        field: "MSG_TEXT",
                        title: gridstrings.pricingparameters[lang].description,
                        width: 400
                    }
                ]
            });
        });
        bindHotKeys();

        resetUI();
    }

    function ready() {
        buildUI();
        registerUiEvents();
    }

    $(document).ready(ready);
}());