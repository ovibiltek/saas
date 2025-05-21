using System;

namespace Ovi.Task.Data.Entity
{
    public class TMORGS
    {
        public virtual string ORG_CODE { get; set; }

        public virtual string ORG_DESC { get; set; }

        public virtual string ORG_DESCF { get; set; }

        public virtual string ORG_EMAIL { get; set; }

        public virtual string ORG_CURRENCY { get; set; }

        public virtual string ORG_CURRENCYDESC { get; set; }

        public virtual char ORG_AUTOCLOSETASK { get; set; }

        public virtual char ORG_ACTIVE { get; set; }

        public virtual char ORG_LOCATIONREQUIRED { get; set; }

        public virtual DateTime ORG_CREATED { get; set; }

        public virtual DateTime? ORG_UPDATED { get; set; }

        public virtual string ORG_CREATEDBY { get; set; }

        public virtual string ORG_UPDATEDBY { get; set; }

        public virtual int ORG_SQLIDENTITY { get; set; }

        public virtual int ORG_RECORDVERSION { get; set; }

        public virtual string ORG_TSKTYPE { get; set; }

        public virtual string ORG_TSKTYPEENTITY { get; set; }

        public virtual string ORG_TSKTYPEDESC { get; set; }

        public virtual string ORG_TSKCUSTOMER { get; set; }

        public virtual string ORG_TSKCUSTOMERDESC { get; set; }

        public virtual string ORG_TSKDEPARTMENT { get; set; }

        public virtual string ORG_TSKDEPARTMENTDESC { get; set; }

        public virtual string ORG_TSKBRANCH { get; set; }

        public virtual string ORG_TSKBRANCHDESC { get; set; }
    }
}