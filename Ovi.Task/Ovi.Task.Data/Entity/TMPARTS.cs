using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPARTS
    {
        public virtual long PAR_ID { get; set; }

        public virtual string PAR_CODE { get; set; }

        public virtual string PAR_ORG { get; set; }

        public virtual string PAR_ORGDESC { get; set; }

        public virtual string PAR_UOM { get; set; }

        public virtual string PAR_UOMDESC { get; set; }

        public virtual string PAR_BRAND { get; set; }

        public virtual string PAR_BRANDDESC { get; set; }

        public virtual string PAR_DESC { get; set; }

        public virtual string PAR_TYPEENTITY { get; set; }

        public virtual string PAR_TYPE { get; set; }

        public virtual int? PAR_TYPELEVEL { get; set; }

        public virtual string PAR_TYPELEVELCODE { get; set; }

        public virtual string PAR_TYPELEVELDESC { get; set; }

        public virtual string PAR_TYPEDESC { get; set; }

        public virtual decimal? PAR_UNITSALESPRICE { get; set; }

        public virtual string PAR_CURR { get; set; }

        public virtual string PAR_CURRDESC { get; set; }

        public virtual char PAR_ACTIVE { get; set; }

        public virtual DateTime PAR_CREATED { get; set; }

        public virtual string PAR_CREATEDBY { get; set; }

        public virtual DateTime? PAR_UPDATED { get; set; }

        public virtual string PAR_UPDATEDBY { get; set; }

        public virtual int PAR_RECORDVERSION { get; set; }
    }
}