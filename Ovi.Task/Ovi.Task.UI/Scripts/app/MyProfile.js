(function () {
    var selectedrecord = null;

    function fillUserInterface() {
        $("#btnBrowse").removeAttr("disabled");
        $("#btnRetriveFromAD").removeAttr("disabled");

        $(".isempty").removeClass("isempty");
        $("[disableonupdate=\"yes\"]:not(button)").prop("disabled", true).removeClass("required");

        $("#code").val(selectedrecord.USR_CODE);
        $("#desc").val(selectedrecord.USR_DESC);
        $("#language").val(selectedrecord.USR_LANG);
        $("#defaultinbox").val(selectedrecord.USR_DEFAULTINBOX);

        $(".userscrpic").attr("src",
            selectedrecord.USR_PIC
                ? "/File.ashx?id=" + selectedrecord.USR_PIC + "&guid=" + selectedrecord.USR_PICGUID + "&type=thumbnail&width=100&height=100"
                : "/files/profile/default.png");

        tooltip.show("#language", selectedrecord.USR_LANGDESC);
    }

    function GetProfileDetails() {
        return tms.Ajax({
            url: "/Api/ApiUsers/Get",
            data: JSON.stringify(user),
            fn: function (d) {
                selectedrecord = d.data;
                fillUserInterface();
            }
        });
    }

    var CheckNewPassword = function () {
        var strongRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
        var pwd = $("#password").val();
        if (!pwd) {
            return false;
        } else if (!strongRegex.test(pwd)) {
            return false;
        };
        return true;
    };
    var SaveNewPassword = function () {
        if (!CheckNewPassword()) {
            msgs.error(applicationstrings[lang].pswdcomplexity);
            return $.Deferred().reject();
        }

        var o = JSON.stringify({
            USR_CODE: selectedrecord.USR_CODE,
            USR_PASSWORD: $("#password").val(),
            USR_UPDATED: selectedrecord != null ? tms.Now() : null,
            USR_UPDATEDBY: selectedrecord != null ? user : null
        });

        return tms.Ajax({
            url: "/Api/ApiUsers/NewPassword",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                $("#password,#passwordagain").val("").attr("type", "text");
                $("#modalpass").modal("hide");
            }
        });
    };

    function save() {
        if (!tms.Check("#record"))
            return $.Deferred().reject();

        selectedrecord.USR_LANG = $("#language").val();
        selectedrecord.USR_DEFAULTINBOX = ($("#defaultinbox").val() || null);
        selectedrecord.USR_UPDATED = tms.Now();
        selectedrecord.USR_UPDATEDBY = user;

        var o = JSON.stringify({
            User: selectedrecord,
            CustomFieldValues: []
        });

        return tms.Ajax({
            url: "/Api/ApiUsers/Save",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
                var hasuploadevnt = $._data($("#record")[0], "events") != undefined;
                if (hasuploadevnt) {
                    $("#record").trigger("upload", {
                        DOC_SOURCE: $("#code").val(),
                        DOC_SUBJECT: "USER",
                        DOC_TYPE: "PROFILFOTOGRAFI"
                    });
                }
            }
        });
    }

    function UpdateProfilePic() {
        var o = JSON.stringify({ USR_CODE: $("#code").val() });
        return tms.Ajax({
            url: "/Api/ApiUsers/UpdateProfilePic",
            data: o,
            fn: function (d) {
                msgs.success(d.data);
            }
        });
    }

    function registerUiEvents() {
        $("#btnSave").click(save);
        $("#btnRetriveFromAD").click(UpdateProfilePic);
        $("#btnNewPassword").click(function () {
            $("#password,#passwordagain").val("").attr("type", "password");
            $("#modalpass").modal("show");
        });
        $("#btnSavePswd").click(SaveNewPassword);
        $("#password,#passwordagain").keyup(function () {
            var $this = $(this);
            var $thisagain = $($(this).data("dblcheck"));
            $("#btnSavePswd").prop("disabled", $this.val() !== $thisagain.val());

            if ($this.val()) {
                if (CheckNewPassword()) {
                    $this.css({ "background-color": "#a8fba8" });
                } else {
                    $this.css({ "background-color": "#ffc7c7" });
                }
            } else {
                $this.css({ "background-color": "" });
            }
        });
    }

    function bindHotKeys() {
        tms.RegisterShortcuts([
            {
                k: "ctrl+s",
                e: "#btnSave",
                f: function () {
                    save();
                }
            }
        ]);
    }

    function buildUI() {
        $("#btnlanguages").click(function () {
            gridModal.show({
                modaltitle: gridstrings.language[lang].title,
                listurl: "/Api/ApiLanguage/List",
                keyfield: "LNG_CODE",
                codefield: "LNG_CODE",
                textfield: "LNG_DESCRIPTION",
                returninput: "#language",
                columns: [
                    { type: "string", field: "LNG_CODE", title: gridstrings.language[lang].language, width: 100 },
                    {
                        type: "string",
                        field: "LNG_DESCRIPTION",
                        title: gridstrings.language[lang].description,
                        width: 300
                    }
                ]
            });
        });
        $("#language").autocomp({
            listurl: "/Api/ApiLanguage/List",
            geturl: "/Api/ApiLanguage/Get",
            field: "LNG_CODE",
            textfield: "LNG_DESCRIPTION"
        });
        registerUiEvents();
    }

    function Upload() {
        $("#fu").change(function (e) {
            loadImage(
                e.target.files[0],
                function (img) {
                    $(img).addClass("userscrpic");
                    $("#imgprv *").remove();
                    $("#imgprv").append(img);
                },
                { maxWidth: 200 } // Options
            );
        });

        $("#fu").fileupload({
            maxNumberOfFiles: 1,
            autoUpload: false,
            add: function (e, data) {
                $("#record").unbind("upload").on("upload",
                    function (evnt, d) {
                        data.formData = d;
                        data.submit();
                    });
            }
        }).on("fileuploaddone",
            function (e, data) {
                switch (data.result.status) {
                    case 200:
                        msgs.success(data.result.data);
                        break;
                    case 300:
                        tms.Redirect2Login();
                        break;
                    case 500:
                        msgs.error(data.result.data);
                        break;
                }
            });
    }

    function ready() {
        buildUI();
        bindHotKeys();
        Upload();
        GetProfileDetails();
    }

    $(document).ready(ready);
}());