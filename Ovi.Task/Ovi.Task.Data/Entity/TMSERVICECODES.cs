using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSERVICECODES
    {
        public virtual int SRV_CODE { get; set; }

        public virtual string SRV_DESCRIPTION { get; set; }

        public virtual string SRV_DESCRIPTIONF { get; set; }

        public virtual string SRV_ORG { get; set; }

        public virtual string SRV_ORGDESC { get; set; }

        public virtual string SRV_UOM { get; set; }

        public virtual string SRV_UOMDESC { get; set; }

        public virtual string SRV_TASKTYPE { get; set; }

        public virtual string SRV_TASKTYPEDESC { get; set; }

        public virtual string SRV_TYPE { get; set; }

        public virtual string SRV_TYPEDESC { get; set; }

        public virtual string SRV_TYPEENTITY { get; set; }

        public virtual int? SRV_TYPELEVEL { get; set; }

        public virtual string SRV_TYPELEVELCODE { get; set; }

        public virtual string SRV_TYPELEVELDESC { get; set; }

        public virtual decimal SRV_UNITPRICE { get; set; }

        public virtual decimal SRV_UNITSALESPRICE { get; set; }

        public virtual string SRV_CURRENCY { get; set; }

        public virtual string SRV_CURRENCYDESC { get; set; }

        public virtual char SRV_ACTIVE { get; set; }

        public virtual char SRV_PUBLIC { get; set; }

        public virtual DateTime SRV_CREATED { get; set; }

        public virtual string SRV_CREATEDBY { get; set; }

        public virtual DateTime? SRV_UPDATED { get; set; }

        public virtual string SRV_UPDATEDBY { get; set; }

        public virtual int SRV_RECORDVERSION { get; set; }
    }
}