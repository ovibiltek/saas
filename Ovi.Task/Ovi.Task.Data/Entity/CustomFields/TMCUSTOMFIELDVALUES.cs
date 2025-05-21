using System;

namespace Ovi.Task.Data.Entity.CustomFields
{
    public class TMCUSTOMFIELDVALUES
    {
        public virtual long CFV_ID { get; set; }

        public virtual string CFV_SUBJECT { get; set; }

        public virtual string CFV_SOURCE { get; set; }

        public virtual string CFV_TYPE { get; set; }

        public virtual string CFV_CODE { get; set; }

        public virtual string CFV_TEXT { get; set; }

        public virtual string CFV_DESC { get; set; }

        public virtual DateTime? CFV_DATETIME { get; set; }

        public virtual decimal? CFV_NUM { get; set; }

        public virtual int CFV_RECORDVERSION { get; set; }

        public virtual DateTime? CFV_CREATED { get; set; }

        public virtual string CFV_CREATEDBY { get; set; }

        public virtual DateTime? CFV_UPDATED { get; set; }

        public virtual string CFV_UPDATEDBY { get; set; }
    }
}