using System;

namespace Ovi.Task.Data.Entity.CustomFields
{
    public class TMCUSTOMFIELDS
    {
        public virtual string CFD_CODE { get; set; }

        public virtual string CFD_FIELDTYPE { get; set; }

        public virtual string CFD_ENTITY { get; set; }

        public virtual string CFD_DESC { get; set; }

        public virtual string CFD_DESCF { get; set; }

        public virtual char CFD_MULTISELECTION { get; set; }

        public virtual char CFD_ALLOWFREETEXT { get; set; }

        public virtual string CFD_CLASS{ get; set; }

        public virtual string CFD_CLASSDESC { get; set; }

        public virtual char CFD_ACTIVE { get; set; }

        public virtual DateTime CFD_CREATED { get; set; }

        public virtual string CFD_CREATEDBY { get; set; }

        public virtual DateTime? CFD_UPDATED { get; set; }

        public virtual string CFD_UPDATEDBY { get; set; }

        public virtual int CFD_RECORDVERSION { get; set; }
    }
}