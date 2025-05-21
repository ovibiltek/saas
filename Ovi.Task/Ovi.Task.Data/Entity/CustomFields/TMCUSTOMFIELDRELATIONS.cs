using System;

namespace Ovi.Task.Data.Entity.CustomFields
{
    public class TMCUSTOMFIELDRELATIONS
    {
        public virtual long CFR_ID { get; set; }

        public virtual string CFR_ENTITY { get; set; }

        public virtual string CFR_TYPE { get; set; }

        public virtual string CFR_TYPEDESC { get; set; }

        public virtual char CFR_AUTH { get; set; }

        public virtual string CFR_CODE { get; set; }

        public virtual string CFR_CODEDESC { get; set; }

        public virtual string CFR_GROUP { get; set; }

        public virtual string CFR_GROUPDESC { get; set; }

        public virtual int CFR_GROUPORDER { get; set; }

        public virtual int CFR_ORDER { get; set; }

        public virtual DateTime CFR_CREATED { get; set; }

        public virtual string CFR_CREATEDBY { get; set; }

        public virtual DateTime? CFR_UPDATED { get; set; }

        public virtual string CFR_UPDATEDBY { get; set; }

        public virtual int CFR_RECORDVERSION { get; set; }
    }
}