using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSTATUSAUTH
    {
        public virtual long SAU_ID { get; set; }

        public virtual string SAU_ENTITY { get; set; }

        public virtual string SAU_TYPE { get; set; }

        public virtual string SAU_DEPARTMENT { get; set; }

        public virtual string SAU_FROM { get; set; }

        public virtual string SAU_TO { get; set; }

        public virtual string SAU_AUTHORIZED { get; set; }

        public virtual char SAU_ACTIVE { get; set; }

        public virtual char SAU_SHOWONWORKFLOW { get; set; }

        public virtual DateTime SAU_CREATED { get; set; }

        public virtual string SAU_CREATEDBY { get; set; }

        public virtual DateTime? SAU_UPDATED { get; set; }

        public virtual string SAU_UPDATEDBY { get; set; }

        public virtual int SAU_RECORDVERSION { get; set; }
    }
}