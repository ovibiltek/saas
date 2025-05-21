(function () {
    $("#record").on("ResetCompleted",
        function () {
            var defaultdepartment = "";
            var defaulttype = "";
            var defaultcustomer = "";
            var defaultbranch = "";

            if (organization === "*")
                 return $.Deferred().resolve();

            return $.when(tms.Ajax({ url: "/Api/ApiOrgs/Get", data: JSON.stringify(organization) }).done(function (d) {
                defaultdepartment = d.data.ORG_TSKDEPARTMENT;
                defaulttype = d.data.ORG_TSKTYPE;
                defaultcustomer = d.data.ORG_TSKCUSTOMER;
                defaultbranch = d.data.ORG_TSKBRANCH;

                $("#org").val(d.data.ORG_CODE);
                tooltip.show("#org", d.data.ORG_DESC);

                if (department !== "*") {
                    $("#taskdep").val(department);
                    tooltip.show("#taskdep", departmentdesc);
                }

                if (defaultdepartment) {
                    $("#taskdep").val(defaultdepartment);
                    tooltip.show("#taskdep", d.data.ORG_TSKDEPARTMENTDESC);
                }
                if (defaulttype) {
                    $("#type").val(defaulttype);
                    tooltip.show("#type", d.data.ORG_TSKTYPEDESC);
                }
                if (defaultcustomer) {
                    $("#customer").val(defaultcustomer);
                    $("#customerdesc").val(d.data.ORG_TSKCUSTOMERDESC);
                    tooltip.show("#customer", d.data.ORG_TSKCUSTOMERDESC);
                }

                if (branch) {
                    $("#branch").val(branch);
                    $("#branchdesc").val(branchdesc);
                    tooltip.show("#branch", branchdesc);
                }
                else if (defaultbranch) {
                    $("#branch").val(defaultbranch);
                    $("#branchdesc").val(d.data.ORG_TSKBRANCHDESC);
                    tooltip.show("#branch", d.data.ORG_TSKBRANCHDESC);
                }
            }));
        });
}()); 