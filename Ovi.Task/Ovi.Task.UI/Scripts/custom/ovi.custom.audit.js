var auditModal = (function () {
    function show(p) {
        gridModal.show({
            modaltitle: gridstrings.history[lang].title,
            listurl: "/Api/ApiHistory/List",
            columns: [
                { type: "na", title: gridstrings.history[lang].action, width: 150, template: "<span>#= gridstrings.history[lang].actiontypes[AUD_ACTION]#</span>" },
                { type: "string", field: "AUD_SECONDARYREFID", title: gridstrings.history[lang].id, width: 150 },
                { type: "string", field: "AUD_SOURCEDESC", title: gridstrings.history[lang].source, width: 150 },
                { type: "string", field: "AUD_FROM", title: gridstrings.history[lang].from, width: 150 },
                { type: "string", field: "AUD_TO", title: gridstrings.history[lang].to, width: 150 },
                { type: "datetime", field: "AUD_CREATED", title: gridstrings.history[lang].created, width: 150 },
                { type: "string", field: "AUD_CREATEDBY", title: gridstrings.history[lang].createdby, width: 200 }
            ],
            fields: { AUD_CREATED: { type: "date" } },
            filter: p.filter,
            sort: [
                { field: "AUD_CREATED", dir: "desc" },
                { field: "AUD_ACTION", dir: "asc" }
            ],
            loadall: true
        });
    }

    return {
        show: show
    };
}());