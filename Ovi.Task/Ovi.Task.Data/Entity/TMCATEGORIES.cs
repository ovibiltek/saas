using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCATEGORIES
    {
        public virtual string CAT_CODE { get; set; }

        public virtual string CAT_DESC { get; set; }

        public virtual string CAT_DESCF { get; set; }

        public virtual char CAT_ACTIVE { get; set; }

        public virtual char CAT_PSP { get; set; }

        public virtual char CAT_TSKTYPEREQUIRED { get; set; }

        public virtual DateTime CAT_CREATED { get; set; }

        public virtual string CAT_CREATEDBY { get; set; }

        public virtual DateTime? CAT_UPDATED { get; set; }

        public virtual string CAT_UPDATEDBY { get; set; }

        public virtual int CAT_SQLIDENTITY { get; set; }

        public virtual int CAT_RECORDVERSION { get; set; }
        public virtual string CAT_ORGANIZATION { get; set; }
        public virtual string CAT_ORGANIZATIONDESC { get; set; }
        public virtual string CAT_GROUP { get; set; }
        public virtual string CAT_GROUPDESC { get; set; }
    }

}