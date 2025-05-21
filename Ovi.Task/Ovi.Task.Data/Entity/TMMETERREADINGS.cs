using System;namespace Ovi.Task.Data.Entity
{
    public class TMMETERREADINGS
    {
        public virtual long REA_ID { get; set; }

        public virtual int REA_TASK { get; set; }

        public virtual int REA_ACTIVITY { get; set; }

        public virtual string REA_ACTIVITYDESC { get; set; }

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

        public virtual string REA_UPDATEDBY { get; set; }

        public virtual int REA_RECORDVERSION { get; set; }    }}