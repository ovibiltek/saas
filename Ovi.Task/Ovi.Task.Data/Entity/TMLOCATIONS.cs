using System;

namespace Ovi.Task.Data.Entity
{
    public class TMLOCATIONS
    {
        public virtual string LOC_CODE { get; set; }

        public virtual string LOC_DESC { get; set; }

        public virtual string LOC_ORG { get; set; }

        public virtual string LOC_ORGDESC { get; set; }

        public virtual string LOC_DEPARTMENT { get; set; }

        public virtual string LOC_DEPARTMENTDESC { get; set; }

        public virtual string LOC_PARENT { get; set; }

        public virtual string LOC_PARENTDESC { get; set; }

        public virtual string LOC_BRANCH { get; set; }

        public virtual string LOC_BRANCHDESC { get; set; }

        public virtual string LOC_CUSTOMER { get; set; }

        public virtual string LOC_CUSTOMERDESC { get; set; }

        public virtual int? LOC_CUSTOMERBARCODELENGTH { get; set; }

        public virtual string LOC_LATITUDE { get; set; }

        public virtual string LOC_LONGITUDE { get; set; }

        public virtual string LOC_BARCODE { get; set; }

        public virtual DateTime LOC_CREATED { get; set; }

        public virtual DateTime? LOC_UPDATED { get; set; }

        public virtual string LOC_CREATEDBY { get; set; }

        public virtual string LOC_UPDATEDBY { get; set; }

        public virtual char LOC_ACTIVE { get; set; }

        public virtual int LOC_RECORDVERSION { get; set; }
    }
}