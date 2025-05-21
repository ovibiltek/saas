using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTRADES
    {
        public virtual string TRD_CODE { get; set; }

        public virtual string TRD_DESC { get; set; }

        public virtual string TRD_ORGANIZATION { get; set; }

        public virtual string TRD_ORGANIZATIONDESC { get; set; }

        public virtual string TRD_DEPARTMENT { get; set; }

        public virtual string TRD_DEPARTMENTDESC { get; set; }

        public virtual string TRD_WAREHOUSE { get; set; }

        public virtual string TRD_WAREHOUSEDESC { get; set; }

        public virtual string TRD_SUPPLIER { get; set; }

        public virtual string TRD_SUPPLIERDESC { get; set; }

        public virtual char TRD_USERBASEDASSIGNMENT { get; set; }

        public virtual string TRD_PRICINGCODE { get; set; }

        public virtual string TRD_PRICINGCODEDESC { get; set; }

        public virtual string TRD_EMAIL { get; set; }

        public virtual string TRD_LATITUDE { get; set; }

        public virtual string TRD_LONGITUDE { get; set; }

        public virtual char TRD_ACTIVE { get; set; }

        public virtual DateTime TRD_CREATED { get; set; }

        public virtual DateTime? TRD_UPDATED { get; set; }

        public virtual string TRD_CREATEDBY { get; set; }

        public virtual string TRD_UPDATEDBY { get; set; }

        public virtual int TRD_SQLIDENTITY { get; set; }

        public virtual int TRD_RECORDVERSION { get; set; }

        public virtual string TRD_REGION { get; set; }

        public virtual string TRD_PROVINCE { get; set; }
        public virtual string TRD_PROVINCEDESC { get; set; }
        public virtual string TRD_DISTRICTDESC { get; set; }
        public virtual string TRD_DISTRICT { get; set; }
        public virtual int TRD_CAPACITY { get; set; }

        public virtual int TRD_USEDCAPACITY { get; set; }

        public virtual string TRD_TASKTYPES { get; set; }
    }
}