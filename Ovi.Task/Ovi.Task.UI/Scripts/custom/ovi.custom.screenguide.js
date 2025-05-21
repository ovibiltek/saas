(function () {
    let guide = null;
    let enduserguide = null;
    let adminguide = null;
    let modal = null;

    function getscreenguide()
    {
        return tms.Ajax({
            url: "/Api/ApiScreens/GetGuide",
            data: JSON.stringify(screen),
            fn: function (d) {
                guide = d.data;
                if (guide != null) {
                    enduserguide = guide.SCG_ENDUSERGUIDE != null ? guide.SCG_ENDUSERGUIDE : "";
                    adminguide = guide.SCG_ADMINGUIDE != null ? guide.SCG_ADMINGUIDE : "";
                    if (usergroup != "ADMIN")
                        adminguide = "";
                    if ((enduserguide != "" && enduserguide != null) || (adminguide != "" && adminguide != null)) {
                        appendscreenguide();
                    }
                }
               
            }
        });
    }

    function appendscreenguide() {
        let tool_bar = $(".tms-page-toolbar");

        let btnuserstr = (enduserguide != "" && enduserguide != null) ? '<button type="button" id="btnShowUserGuide" class="btn btn-secondary btn-xs">' + applicationstrings[lang].user + '</button>' : " ";
        let btnadminstr = (adminguide != "" && enduserguide != null && usergroup == "ADMIN") ? '<button type="button" id="btnShowAdminGuide" class="btn btn-secondary btn-xs">' + applicationstrings[lang].admin + '</button>': " ";
        let btnstring = '<button class="btn btn-default btn-sm" title="Guide" selection-required="false" id="btnShowGuide" tabindex="-1" autocomplete="off"><i class="fa fa fa-book fa-fw"></i> ' + applicationstrings[lang].guide + '</button>'
        let modalstr = '<div class="modal fade" id="modalguide" role="dialog" aria-labelledby="modalsharedlbl" aria-hidden="true">'
                        + '<div class="modal-dialog" role="document">'
                        + '<div class="modal-content">'
                        + '<div class="modal-header">'
                        + '<div class="btn-group pull-right" role="group" >'
                        + btnuserstr
                        + btnadminstr
            + '<button type="button" id="btnModalFullScreen" class="btn btn-secondary btn-xs"> <i class="fa fa-arrows-alt"> </i> </button>'
                        + '<button type="button" class="btn btn-secondary btn-xs" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                        + '</div>'     
                        +'<h4 class="modal-title" id="modalguidetitle"></h4>'
                        +'</div>'
                        +'<div id="modalguidebody" class="modal-body">'
                        +'</div>'
                        +'<div class="modal-footer">'
            + '<button type="button" data-dismiss="modal" class="btn btn-primary btn-xs" id="modalok">' + applicationstrings[lang].ok + '</button>'
                        +'</div>'
                        +'</div>'
                        +'</div>'
                        +'</div>';
        tool_bar.find(".btn-group").append(btnstring);
        $(".container").append(modalstr);
        $("#btnShowGuide").unbind("click").on("click", openGuide);
        $("#btnShowUserGuide").unbind("click").on("click", showUserGuide);
        $("#btnShowAdminGuide").unbind("click").on("click", showAdminGuide);
        $("#btnModalFullScreen").unbind("click").on("click", function () {
            $("#modalguide").toggleClass("modal-fullscreen");
        });
    }

    function showAdminGuide() {
        $("#modalguidetitle").text(applicationstrings[lang].adminguide);
        let wrapped = $("<div>" + adminguide + "</div>");
        modal.find("#modalguidebody").html("").html(wrapped.html());
        
    }

    function showUserGuide() {
        $("#modalguidetitle").text(applicationstrings[lang].enduserguide);
        let wrapped = $("<div>" + enduserguide + "</div>");
        modal.find("#modalguidebody").html("").html(wrapped.html());
       
    }

    function openGuide() {
         modal = $("#modalguide").modal();
        if (enduserguide != "" && enduserguide != null) {
            $("#modalguidetitle").text(applicationstrings[lang].enduserguide);
            let wrapped = $("<div>" + enduserguide + "</div>");
            modal.find("#modalguidebody").html("").html(wrapped.html());
        }
        else {
            $("#modalguidetitle").text(applicationstrings[lang].adminguide);
            let wrapped = $("<div>" + adminguide + "</div>");
            modal.find("#modalguidebody").html("").html(wrapped.html());
        }
    }
    
    $(document).ready(function () {
        if ($(".tms-page-toolbar").length == 1) 
            getscreenguide();
    });
})();