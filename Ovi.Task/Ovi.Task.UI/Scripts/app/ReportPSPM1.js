(function () {
   

    function RegisterUIEvents() {

        $("#btnorg").click(function () {
            gridModal.show({
                modaltitle: gridstrings.org[lang].title,
                listurl: "/Api/ApiOrgs/ListUserOrganizations",
                keyfield: "ORG_CODE",
                codefield: "ORG_CODE",
                textfield: "ORG_DESCF",
                returninput: "#org",
                columns: [
                    { type: "string", field: "ORG_CODE", title: gridstrings.org[lang].organization, width: 100 },
                    { type: "string", field: "ORG_DESCF", title: gridstrings.org[lang].description, width: 400 }
                ]
            });
        });
        $("#btncustomer").click(function () {
            gridModal.show({
                modaltitle: gridstrings.customer[lang].title,
                listurl: "/Api/ApiCustomers/List",
                keyfield: "CUS_CODE",
                codefield: "CUS_CODE",
                textfield: "CUS_DESC",
                returninput: "#customer",
                columns: [
                    { type: "string", field: "CUS_CODE", title: gridstrings.customer[lang].code, width: 100 },
                    { type: "string", field: "CUS_DESC", title: gridstrings.customer[lang].description, width: 300 },
                ],
                filter: [
                    { field: "CUS_ORG", value: [$("#org").val(), "*"], operator: "in" }
                ]
            });
        });
    
      
        $("#formgroup input").on("change", function () {
            $("#addsecondtable").addClass("hidden");
            if ($.inArray($('input[name=Format]:checked').val(), ["F3","F4"]) !== -1) {
                $("#addsecondtable").removeClass("hidden");
            }
        });

        $("#org").autocomp({
            listurl: "/Api/ApiOrgs/ListUserOrganizations",
            geturl: "/Api/ApiOrgs/Get",
            field: "ORG_CODE",
            textfield: "ORG_DESCF"
        });
        $("#customer").autocomp({
            listurl: "/Api/ApiCustomers/List",
            geturl: "/Api/ApiCustomers/Get",
            field: "CUS_CODE",
            textfield: "CUS_DESC",
            filter: [{ field: "CUS_ORG", relfield: "#org", includeall: true }]
        });
     

       

        $("input[name=\"Type\"]").on("change",
            function() {
                $("#onlyserviceforms").prop("checked", false);
                var selectedType = $(this).val();
                if (selectedType === "ZIP") {
                    $("#divOnlyServiceForms").removeClass("hidden");

                } else {
                    $("#divOnlyServiceForms").addClass("hidden");
                }
            });


        $("#format3").prop("checked", true).trigger("change");
        $("#zip").prop("checked", true).trigger("change");

    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())