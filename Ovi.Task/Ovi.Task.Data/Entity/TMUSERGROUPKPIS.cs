using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERGROUPKPIS
    {
        public virtual long UGK_ID { get; set; }

        public virtual string UGK_USERGROUP { get; set; }

        public virtual string UGK_KPI { get; set; }

        public virtual DateTime UGK_CREATED { get; set; }

        public virtual string UGK_CREATEDBY { get; set; }

        public virtual int UGK_RECORDVERSION { get; set; }
    }
}