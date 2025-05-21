using System;

namespace Ovi.Task.Data.Entity
{
    public class TMREGIONS
    {
        public virtual string REG_CODE { get; set; }

        public virtual string REG_DESC { get; set; }

        public virtual string REG_DESCF { get; set; }

        public virtual char REG_ACTIVE { get; set; }

        public virtual string REG_REPORTINGRESPONSIBLE { get; set; }

        public virtual string REG_PLANNINGRESPONSIBLE { get; set; }
        public virtual string REG_SUPERVISOR{ get; set; }

        public virtual string REG_RESPONSIBLE { get; set; }

        public virtual string REG_CREATEDBY { get; set; }

        public virtual DateTime REG_CREATED { get; set; }

        public virtual string REG_UPDATEDBY { get; set; }

        public virtual DateTime? REG_UPDATED { get; set; }

        public virtual int REG_RECORDVERSION { get; set; }

        public virtual int REG_SQLIDENTITY { get; set; }
    }
}