using System;

namespace Ovi.Task.Data.Entity
{
    public class TMADDRESSSECTIONS
    {
        public virtual long ADS_ID { get; set; }

        public virtual string ADS_CODE { get; set; }

        public virtual string ADS_DESC { get; set; }

        public virtual string ADS_TYPE { get; set; }

        public virtual string ADS_PARENT { get; set; }

        public virtual string ADS_PARENTDESC { get; set; }

        public virtual string ADS_REGION { get; set; }

        public virtual string ADS_REGIONDESC { get; set; }

        public virtual char ADS_ACTIVE { get; set; }

        public virtual DateTime ADS_CREATED { get; set; }

        public virtual DateTime? ADS_UPDATED { get; set; }

        public virtual string ADS_CREATEDBY { get; set; }

        public virtual string ADS_UPDATEDBY { get; set; }

        public virtual int ADS_RECORDVERSION { get; set; }
    }
}