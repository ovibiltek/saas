using System;namespace Ovi.Task.Data.Entity
{
    public class TMMETERREADINGSVIEW
    {
        public virtual long REA_ID { get; set; }

        public virtual long REA_TSKID { get; set; }

        public virtual string REA_TSKSHORTDESC { get; set; }

        public virtual string REA_TSKCUSTOMER { get; set; }

        public virtual string REA_TSKCUSTOMERDESC { get; set; }

        public virtual string REA_TSKBRANCH { get; set; }

        public virtual string REA_TSKBRANCHDESC { get; set; }

        public virtual int REA_ACTIVITY { get; set; }

        public virtual DateTime REA_DATE { get; set; }

        public virtual decimal REA_ACTIVE { get; set; }

        public virtual decimal REA_INDUCTIVE { get; set; }

        public virtual decimal REA_CAPACITIVE { get; set; }

        public virtual decimal? REA_R1 { get; set; }

        public virtual decimal? REA_R2 { get; set; }

        public virtual int? REA_R1C { get; set; }

        public virtual int? REA_R2C { get; set; }

        public virtual DateTime REA_CREATED { get; set; }

        public virtual string REA_CREATEDBY { get; set; }

        public virtual DateTime? REA_UPDATED { get; set; }

        public virtual string REA_UPDATEDBY { get; set; }    }}