using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace Ovi.Task.UI.Helper
{
    public class GridRequestHelper
    {
        public static GridRequest Filter(GridRequest gr, string fieldcustomer, string fieldorganization)
        {
            var repositoryUserOrganizations = new RepositoryUserOrganizations();
            var organizations = new JArray(repositoryUserOrganizations.ListByUser(UserManager.Instance.User.Code));

            if (gr.groupedFilters == null)
            {
                if (gr.filter == null)
                    gr.filter = new GridFilters { Filters = new List<GridFilter>() };
                if (gr.filter.Filters == null)
                    gr.filter.Filters = new List<GridFilter>();

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer) && fieldcustomer != null)
                {
                    var usercustomers = new JArray(UserManager.Instance.User.Customer.Split(','));
                    gr.filter.Filters.Add(new GridFilter { Field = fieldcustomer, Value = usercustomers, Operator = "in", Logic = "and" });
                }

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fieldorganization != null)
                    gr.filter.Filters.Add(new GridFilter { Field = fieldorganization, Value = organizations, Operator = "in", Logic = "and" });

                if (gr.filter != null && gr.filter.Filters.Count == 0)
                    gr.filter = null;
            }
            else
            {
                var f = new GridFilters { Filters = new List<GridFilter>() };

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer) && fieldcustomer != null)
                {
                    var usercustomers = new JArray(UserManager.Instance.User.Customer.Split(','));
                    f.Filters.Add(new GridFilter { Field = fieldcustomer, Value = usercustomers, Operator = "in", Logic = "and" });
                }

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fieldorganization != null)
                    f.Filters.Add(new GridFilter { Field = fieldorganization, Value = organizations, Operator = "in", Logic = "and" });

                gr.groupedFilters.Add(f);
            }

            return gr;
        }

        public static GridRequest FilterMoreSpecificV1(GridRequest gr, string fieldcustomer, string fieldorganization, string fielddepartment)
        {
            var repositoryUserOrganizations = new RepositoryUserOrganizations();
            var userorglist = repositoryUserOrganizations.ListByUser(UserManager.Instance.User.Code);
            JArray organizations = new JArray(userorglist);

            var repositoryDepartments = new RepositoryDepartments();
            var userdepartmentlist = repositoryDepartments.GetDepartments(UserManager.Instance.User.Code, '+').Select(x => x.DEP_CODE).ToArray();
            JArray userdepartments = null;
            if (userdepartmentlist != null && !userdepartmentlist.Contains("*"))
                userdepartments = new JArray(userdepartmentlist);



            if (gr.groupedFilters == null)
            {
                if (gr.filter == null)
                    gr.filter = new GridFilters { Filters = new List<GridFilter>() };
                if (gr.filter.Filters == null)
                    gr.filter.Filters = new List<GridFilter>();

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer) && fieldcustomer != null)
                {
                    var usercustomers = new JArray(UserManager.Instance.User.Customer.Split(','));
                    gr.filter.Filters.Add(new GridFilter { Field = fieldcustomer, Value = usercustomers, Operator = "in", Logic = "and" });
                }

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fieldorganization != null && organizations!=null)
                    gr.filter.Filters.Add(new GridFilter { Field = fieldorganization, Value = organizations, Operator = "in", Logic = "and" });

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fielddepartment != null && userdepartments != null)
                    gr.filter.Filters.Add(new GridFilter { Field = fielddepartment, Value = userdepartments, Operator = "in", Logic = "and" });


                if (gr.filter != null && gr.filter.Filters.Count == 0)
                    gr.filter = null;
            }
            else
            {
                var f = new GridFilters { Filters = new List<GridFilter>() };

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer) && fieldcustomer != null)
                {
                    var usercustomers = new JArray(UserManager.Instance.User.Customer.Split(','));
                    f.Filters.Add(new GridFilter { Field = fieldcustomer, Value = usercustomers, Operator = "in", Logic = "and" });
                }

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fieldorganization != null && organizations != null)
                    f.Filters.Add(new GridFilter { Field = fieldorganization, Value = organizations, Operator = "in", Logic = "and" });

                gr.groupedFilters.Add(f);
            }

            return gr;
        }

        public static GridRequest FilterMoreSpecificV2(GridRequest gr, string fieldcustomer, string fieldorganization, string fieldsupplier)
        {
            var repositoryUserOrganizations = new RepositoryUserOrganizations();
            var userorglist = new JArray(repositoryUserOrganizations.ListByUser(UserManager.Instance.User.Code));
            JArray organizations = new JArray(userorglist);

            if (gr.groupedFilters == null)
            {
                if (gr.filter == null)
                    gr.filter = new GridFilters { Filters = new List<GridFilter>() };
                if (gr.filter.Filters == null)
                    gr.filter.Filters = new List<GridFilter>();

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer) && fieldcustomer != null)
                {
                    var usercustomers = new JArray(UserManager.Instance.User.Customer.Split(','));
                    gr.filter.Filters.Add(new GridFilter { Field = fieldcustomer, Value = usercustomers, Operator = "in", Logic = "and" });
                }

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier) && fieldsupplier != null)
                {
                    var usersuppliers = new JArray(UserManager.Instance.User.Supplier.Split(','));
                    gr.filter.Filters.Add(new GridFilter { Field = fieldsupplier, Value = usersuppliers, Operator = "in", Logic = "and" });
                }

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fieldorganization != null && organizations != null)
                    gr.filter.Filters.Add(new GridFilter { Field = fieldorganization, Value = organizations, Operator = "in", Logic = "and" });

                if (gr.filter != null && gr.filter.Filters.Count == 0)
                    gr.filter = null;
            }
            else
            {
                var f = new GridFilters { Filters = new List<GridFilter>() };

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer) && fieldcustomer != null)
                {
                    var usercustomers = new JArray(UserManager.Instance.User.Customer.Split(','));
                    f.Filters.Add(new GridFilter { Field = fieldcustomer, Value = usercustomers, Operator = "in", Logic = "and" });
                }

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier) && fieldsupplier != null)
                {
                    var usersuppliers = new JArray(UserManager.Instance.User.Supplier.Split(','));
                    f.Filters.Add(new GridFilter { Field = fieldsupplier, Value = usersuppliers, Operator = "in", Logic = "and" });
                }

                if (UserManager.Instance.User.UserGroup != "ADMIN" && fieldorganization != null && organizations != null)
                    f.Filters.Add(new GridFilter { Field = fieldorganization, Value = organizations, Operator = "in", Logic = "and" });

                gr.groupedFilters.Add(f);
            }

            return gr;
        }

        public static GridRequest BuildFunctionFilter(GridRequest gr)
        {
            if (gr.filter != null)
            {
                if (gr.filter.Filters == null)
                    return gr;
                
                var funcFilters = gr.filter.Filters.Where(x => x.Operator != null && x.Operator.ToString() == "func");
                var funcFiltersArr = funcFilters as GridFilter[] ?? funcFilters.ToArray();
                var gridFuncFilters = funcFiltersArr.Select(x => new GridFilter
                {
                    
                    Operator = "sqlfunc",
                    Value = new RepositoryFunctionCodes().Get(x.Field).FUN_DESCRIPTION.Replace(":P1", x.Value.ToString()).Replace(":P2",x.Value2!= null ? x.Value2.ToString() : string.Empty),
                    Logic = x.Logic
                });
                gr.filter.Filters = gr.filter.Filters.Except(funcFiltersArr).ToList();
                if (gridFuncFilters!=null)
                    gr.filter.Filters.AddRange(gridFuncFilters);
            }
            return gr;
        }

        public static GridRequest BuildCustomFieldFilter(GridRequest gr, string keyfield)
        {
            if (gr.groupedFilters != null)
            {
            }
            else if (gr.filter != null)
            {
                var customFieldFilters = gr.filter.Filters.Where(x => x.Value != null && x.Value.ToString() == "FCFV");
                var fieldFilters = customFieldFilters as GridFilter[] ?? customFieldFilters.ToArray();
                var gridFilters = fieldFilters.Select(x => new GridFilter
                {
                    Operator = "sqlfunc",
                    Value = (x.Value4.ToString() == "isnull" ? " NOT " : "") + " EXISTS (SELECT 1 FROM dbo.FilterCustomFieldValuesTable('" + x.Value1 + "', '" + x.Value2 + "', " + x.Value3 + ", '" + x.Value4 + "') ds1  WHERE ds1.CFV_SOURCE = CAST(" + keyfield + " AS NVARCHAR))"
                });
                gr.filter.Filters = gr.filter.Filters.Except(fieldFilters).ToList();
                gr.filter.Filters.AddRange(gridFilters);

               
            }

            return gr;
        }

    }
}