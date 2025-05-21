using System;

namespace Ovi.Task.Data.Entity
{
    public class TMLOOKUPLINES
    {
        public virtual long TML_ID { get; set; }

        public virtual string TML_TYPE { get; set; }

        public virtual string TML_CODE { get; set; }

        public virtual string TML_ITEMCODE { get; set; }

        public virtual string TML_ITEMDESC { get; set; }

        public virtual char TML_COMMENTS { get; set; }

        public virtual char TML_DOCUMENTS { get; set; }

        public virtual string TML_CREATEDBY { get; set; }

        public virtual DateTime TML_CREATED { get; set; }

        public virtual int TML_RECORDVERSION { get; set; }
    }
}