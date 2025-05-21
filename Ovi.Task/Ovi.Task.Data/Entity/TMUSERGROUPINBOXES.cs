using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERGROUPINBOXES
    {
        public virtual long UGI_ID { get; set; }

        public virtual string UGI_USERGROUP { get; set; }

        public virtual string UGI_INBOX { get; set; }

        public virtual DateTime UGI_CREATED { get; set; }

        public virtual string UGI_CREATEDBY { get; set; }

        public virtual int UGI_RECORDVERSION { get; set; }
    }
}