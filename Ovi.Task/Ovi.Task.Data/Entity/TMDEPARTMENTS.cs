using System;

namespace Ovi.Task.Data.Entity
{
    public class TMDEPARTMENTS
    {
        public virtual string DEP_CODE { get; set; }

        public virtual string DEP_DESC { get; set; }

        public virtual string DEP_DESCF { get; set; }

        public virtual string DEP_ORG { get; set; }

        public virtual string DEP_ORGDESC { get; set; }

        public virtual string DEP_MANAGER { get; set; }

        public virtual string DEP_MANAGERDESC { get; set; }

        public virtual string DEP_TIMEKEEPINGOFFICER { get; set; }

        public virtual string DEP_TIMEKEEPINGOFFICERDESC { get; set; }

        public virtual string DEP_AUTHORIZED { get; set; }

        public virtual string DEP_ACTIVE { get; set; }

        public virtual DateTime DEP_CREATED { get; set; }

        public virtual DateTime? DEP_UPDATED { get; set; }

        public virtual string DEP_CREATEDBY { get; set; }

        public virtual string DEP_UPDATEDBY { get; set; }

        public virtual int DEP_SQLIDENTITY { get; set; }

        public virtual int DEP_RECORDVERSION { get; set; }
    }
}