using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSESSIONS
    {
        public virtual long TMS_ID { get; set; }

        public virtual string TMS_SESSID { get; set; }

        public virtual string TMS_SESSUSER { get; set; }

        public virtual int TMS_SESSPRODUCTID { get; set; }

        public virtual string TMS_IP { get; set; }

        public virtual string TMS_BROWSER { get; set; }

        public virtual DateTime TMS_LOGIN { get; set; }

        public virtual int TMS_RECORDVERSION { get; set; }
    }
}