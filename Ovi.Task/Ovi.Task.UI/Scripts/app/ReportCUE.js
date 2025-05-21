(function () {
    var documentsHelper, commentsHelper;
    function RegisterUIEvents() {
        $("#btntaskcategory").click(function () {
            gridModal.show({
                modaltitle: gridstrings.category[lang].title,
                listurl: "/Api/ApiCategories/List",
                keyfield: "CAT_CODE",
                codefield: "CAT_CODE",
                textfield: "CAT_DESCF",
                returninput: "#taskcategory",
                multiselect: true,
                columns: [
                    { type: "string", field: "CAT_CODE", title: gridstrings.category[lang].code, width: 100 },
                    { type: "string", field: "CAT_DESCF", title: gridstrings.category[lang].description, width: 400 }
                ]
            });
        });

        documentsHelper = new documents({
            input: "#fu",
            filename: "#filename",
            uploadbtn: "#btnupload",
            container: "#fupload",
            documentsdiv: "#docs",
            progressbar: "#docuprogress"
        });
        commentsHelper = new comments({ input: "#comment", btnaddcomment: "#addComment", commentsdiv: "#comments" });

        commentsHelper.showCommentsBlock({ subject: "SCREENS", source: "RPTCUE" });
        documentsHelper.showDocumentsBlock({ subject: "SCREENS", source: "RPTCUE" });
    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())