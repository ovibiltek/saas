$(function () {
    var selectedrecord = null;
    var outputstr = null;
    var editor = null;

    function resetUI() {
        selectedrecord = null;
    }

    function fillUserInterface() {
        $("#btnUpdate").attr('disabled', true);
        $(".page-header>h6").html(selectedrecord.SCR_CODE + " - " + selectedrecord.SCR_DESCF);
        $("#text").val(selectedrecord.SCR_DESCF);
        $("#href").val(selectedrecord.SCR_URL);
        $("#code").val(selectedrecord.SCR_CODE);
    }

    function loadSelected() {
        var selecteditem = $("a.list-group-item.active");
        var code = selecteditem.data("id");
        return tms.Ajax({
            url: "/Api/ApiScreens/Get",
            data: JSON.stringify(code),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    function getMenu() {
        return tms.Ajax({
            url: "/Api/ApiMenuConfiguration/GetLang",
            data: JSON.stringify($('#languages').val()),
            fn: function (m) {
                resetUI();
                if (m.data) {
                    var loadedstr = m.data.MNU_STRING;
                    refreshScrList();
                    editor.setData(loadedstr);
                }
                else {
                    editor.setData([]);
                }
            }
        })
    }

    function refreshScrList() {
        $('a[style*="display: none"]').show();
    }

    function save() {
        var o = JSON.stringify({
            MNU_LANG: $('#languages').val(),
            MNU_STRING: editor.getString()
        });

        return tms.Ajax({
            url: "/Api/ApiMenuConfiguration/UpdateOrSave",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
            }
        });
    }

    function registerUiEvents() {
        $("#css").click(function () {
            $("#cssi").removeClass().addClass($(this).val());
        });
        $("#css").iconpicker({ hideOnSelect: true, placement: "left" }).on("iconpickerSelected", function (e) {
            $(this).val(e.iconpickerInstance.options.iconBaseClass + " " + e.iconpickerInstance.getValue(e.iconpickerValue)).trigger("change");
        });
        $('#myEditor').on("click", ".btnRemove", function (e) {
            e.preventDefault();
            var list = $(this).closest('ul');
            var item = $(this).closest('li');
            $("#confirm").modal()
                .one("click",
                    "#delete",
                    function () {
                        editor.delete(list, item);
                        refreshScrList();
                    });


        });
        $("#btnSave").click(function () {
            save();
        })

        $("#btniclear").click(function () {
            $("#css").val("");
            $("#cssi").removeClass();
        });
    }

    function List() {
        $("#list-items").list({
            listurl: "/Api/ApiScreens/List",
            fields: {
                keyfield: "SCR_CODE",
                descfield: "SCR_DESCF"
            },
            sort: [{ field: "SCR_CODE", dir: "asc" }],
            itemclick: function (event, item) {
                loadSelected();
            }
        });
    }

    function buildLanguages() {
        var gridreq = {
            sort: [{ field: "LNG_CODE", dir: "asc" }]
        };

        return tms.Ajax({
            url: "/Api/ApiLanguage/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strlanguages = "";
                $("#languages option").remove();
                for (var i = 0; i < d.data.length; i++) {
                    strlanguages += "<option value=\"" +
                        d.data[i].LNG_CODE +
                        "\">" +
                        d.data[i].LNG_DESCRIPTION +
                        "</option>";
                }
                $("#languages").append(strlanguages);
                $("#languages").val($("#languages option:first").val());

                $("#languagefilter").append(strlanguages);
                $("#languagefilter").val($("#languagefilter option:first").val());
                getMenu();
            }
        });
    }

    function buildUI() {
        $('#previewnavbar').hide();
        buildLanguages();
        registerUiEvents();
        resetUI();
        List();
        buildUserGroups();
    }

    function getMenuByUser() {
        var options = {};
        options.usercode = $('#usergroup').val();
        options.language = $('#languagefilter').val();
        return tms.Ajax({
            url: "/Api/ApiMenuConfiguration/FilterMenuByUser",
            data: JSON.stringify(options),
            fn: function (m) {
                if (m.data) {
                    outputstr = m.data.MNU_STRING;
                    $('#out').text(outputstr);
                    rendermenu();
                }
            }
        })
    }

    function buildUserGroups() {
        var gridreq = {
            sort: [{ field: "UGR_CODE", dir: "asc" }]
        };

        return tms.Ajax({
            url: "/Api/ApiUserGroups/List",
            data: JSON.stringify(gridreq),
            fn: function (d) {
                var strusers = "";
                $("#usergroup option").remove();
                for (var i = 0; i < d.data.length; i++) {
                    strusers += "<option value=\"" +
                        d.data[i].UGR_CODE +
                        "\">" +
                        d.data[i].UGR_DESC +
                        "</option>";
                }
                $("#usergroup").append(strusers);
                $("#usergroup").val($("#usergroup option:first").val());
            }
        });
    }

    function rendermenu() {
        $("#mymenu").empty();
        if (outputstr != "[]" || outputstr != "" || outputstr != null) {
            $('#previewnavbar').show();
            $('#mymenu').renderizeMenu(outputstr, {
                active: '#',
                rootClass: "nav navbar-nav navbar-left",
                menuClass: "dropdown-menu",
                submenuClass: "dropdown-menu",
                dropdownIcon: '<span class="fa fa-caret-down"></span>',
                linkHasMenuClass: 'dropdown-toggle',
                itemHasMenuClass: 'dropdown',
                menuItemHasSubmenuClass: 'dropdown-submenu'
            });
        }
    }

    function SetMenuEditor() {
        var sortableListOptions = {
            placeholderCss: { 'background-color': "#cccccc" }
        };
        editor = new MenuEditor('myEditor',
            {
                listOptions: sortableListOptions,
                maxLevel: -1
            });
        editor.setForm($('#frmEdit'));
        editor.setUpdateButton($('#btnUpdate'));

        $("#btnUpdate").click(function () {
            if ($("#text").val().trim().length == 0) {
                alert(applicationstrings.user[lang].cantaddemptymenuitem);
            }
            else {
                editor.update();
            }
        });

        $('#btnAdd').click(function () {
            if (tms.Check("#frmEdit")) {
                editor.add();
            }
        });
        $('#btnOut').click(function () {
            getMenuByUser();
        });
        $('#btnClear').click(function () {
            resetUI();
            $(".list-group-item.active").removeClass("active");
            $("#text").val("");
            $("#href").val("");
            $("#code").val("");
            $("#css").val("");
        });
        $('#languages').change(function () {
            getMenu();
        });
    }

    function ready() {
        buildUI();
        SetMenuEditor();
    }

    $(document).ready(ready);
})