using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERGROUPMOBILETOPICS
    {
        public virtual long UGM_ID { get; set; }

        public virtual string UGM_USERGROUP { get; set; }

        public virtual string UGM_TOPIC { get; set; }

        public virtual DateTime UGM_CREATED { get; set; }

        public virtual string UGM_CREATEDBY { get; set; }

        public virtual int UGM_RECORDVERSION { get; set; }
    }
}