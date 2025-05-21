using System;
using System.Security.Principal;

namespace Ovi.Task.Helper.User
{
    [Serializable]
    public class OviUser
    {
        public string Code { get; set; }

        public string Description { get; set; }

        public string Trade { get; set; }

        public string Org { get; set; }

        public string OrgDesc { get; set; }

        public string UserGroup { get; set; }

        public string Branch { get; set; }

        public string BranchDesc { get; set; }

        public string Customer { get; set; }

        public string CustomerDesc { get; set; }

        public string Supplier { get; set; }

        public string SupplierDesc { get; set; }

        public string Department { get; set; }

        public string DepartmentLM { get; set; }

        public string DepartmentAuthorized { get; set; }

        public string DepartmentDesc { get; set; }

        public string AuthorizedDepartments { get; set; }

        public string Language { get; set; }

        public string DefaultInbox { get; set; }

        public string DefaultMainSection { get; set; }

        public string Culture { get; set; }

        public string SessionId { get; set; }

        public char LockChecklist { get; set; }

        public char ViewWeeklyCalendar { get; set; }

        public string AppLogo { get; set; }

        public string Environment { get; set; }

    }

    public class OviPrincipal : IPrincipal
    {
        public OviPrincipal(IIdentity identity)
        {
            Identity = identity;
        }

        public IIdentity Identity
        {
            get;
            private set;
        }

        public OviUser User { get; set; }

        public bool IsInRole(string role)
        {
            return true;
        }
    }
}