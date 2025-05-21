(function () {
    var selectedrecord = null;


   

    function resetUI() {
        selectedrecord = null;
        tms.Reset("#record");

        $("#code").val("");
        $("#desc").val("");
        

        $("#active").prop("checked", true);

       

    }

    

   

    function fillUserInterface() {
        tms.BeforeFill("#record");

        $("#code").val(selectedrecord.FUN_CODE);
        $("#desc").val(selectedrecord.FUN_DESCRIPTION);
       
        $("#active").prop("checked", selectedrecord.FUN_ACTIVE === "+");
       


       

        $(".page-header>h6").html(selectedrecord.FUN_CODE + " - " + selectedrecord.FUN_DESCRIPTION);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        var group = selecteditem.data("group");

        return tms.Ajax({
            url: "/Api/ApiFunctionCodes/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function remove() {
        if (selectedrecord) {
            $("#confirm").modal().off("click", "#delete").one("click",
                "#delete",
                function () {
                    return tms.Ajax({
                        url: "/Api/ApiFunctionCodes/DelRec",
                        data: JSON.stringify(selectedrecord.FUN_CODE),
                        fn: function (d) {
                            msgs.success(d.data);
                            resetUI();
                            $(".list-group").list("refresh");
                        }
                    });
                });
        }
    }

    function save() {
        if (!tms.Check())
            return $.Deferred().reject();

        var o = JSON.stringify({
            FUN_CODE: $("#code").val().toUpper(),
            FUN_DESCRIPTION: $("#desc").val(),
            FUN_ACTIVE: $("#active").prop("checked") ? "+" : "-",
            FUN_CREATED: selectedrecord != null ? selectedrecord.FUN_CREATED : tms.Now(),
            FUN_CREATEDBY: selectedrecord != null ? selectedrecord.FUN_CREATEDBY : user,
            FUN_UPDATED: selectedrecord != null ? tms.Now() : null,
            FUN_UPDATEDBY: selectedrecord != null ? user : null,
            FUN_RECORDVERSION: selectedrecord != null ? selectedrecord.FUN_RECORDVERSION : 0,
            FUN_SQLIDENTITY: selectedrecord != null ? selectedrecord.FUN_SQLIDENTITY : 0
        });

        return tms.Ajax({
            url: "/Api/ApiFunctionCodes/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                selectedrecord = d.r;
                fillUserInterface();
                $(".list-group").data("id", selectedrecord.FUN_CODE).list("refresh");
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnDelete").click(remove);
        $("#btnNew").click(resetUI);
        $("#btnUndo").click(loadSelected);
      
        
    }

    function List() {
        $(".list-group").list({
            listurl: "/Api/ApiFunctionCodes/List",
            fields: {
                keyfield: "FUN_CODE",
                descfield: "FUN_DESCRIPTION"
              
            },
            sort: [{ field: "FUN_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildUI() {
        resetUI();
        List();
        registerUiEvents();
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

    function ready() {
        buildUI();
        bindHotKeys();
    }

    $(document).ready(ready);
}());