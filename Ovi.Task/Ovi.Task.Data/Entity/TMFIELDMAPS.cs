using System;

namespace Ovi.Task.Data.Entity
{
    public class TMFIELDMAPS
    {
        public virtual long FMP_ID { get; set; }

        public virtual string FMP_ENTITY { get; set; }

        public virtual string FMP_CODE { get; set; }

        public virtual string FMP_FIELD { get; set; }

        public virtual string FMP_VALUE { get; set; }

        public virtual DateTime FMP_CREATED { get; set; }

        public virtual string FMP_CREATEDBY { get; set; }

        public virtual int FMP_RECORDVERSION { get; set; }
    }
}