(function () {
  

    function RegisterUIEvents() {

       


       
        $("#btndepartment").click(function () {
            gridModal.show({
                modaltitle: gridstrings.dep[lang].title,
                listurl: "/Api/ApiDepartments/List",
                keyfield: "DEP_CODE",
                codefield: "DEP_CODE",
                textfield: "DEP_DESC",
                returninput: "#department",
                
                columns: [
                    { type: "string", field: "DEP_CODE", title: gridstrings.dep[lang].department, width: 100 },
                    { type: "string", field: "DEP_DESC", title: gridstrings.dep[lang].description, width: 300 },
                    { type: "string", field: "DEP_ORG", title: gridstrings.dep[lang].organization, width: 100 }
                ],
                filter: [
                    { field: "DEP_CODE", value: "*", operator: "neq" },
                    
                ]
            });
        });

        

        $("#department").autocomp({
            listurl: "/Api/ApiDepartments/List",
            geturl: "/Api/ApiDepartments/Get",
            field: "DEP_CODE",
            textfield: "DEP_DESC"
        });

        $('#datepicker').datetimepicker({
           
           viewMode:"months",
            format: 'MM/YYYY'
        });

        $("#btnRun").click(function () {

            if (!tms.Check("#record")) {
                return false;
            }
        });

    }

    function Ready() {
        RegisterUIEvents();
    }

    $(document).ready(Ready);
}())