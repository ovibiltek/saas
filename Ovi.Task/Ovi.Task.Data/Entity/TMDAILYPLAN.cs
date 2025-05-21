using System;

namespace Ovi.Task.Data.Entity
{
    public class TMDAILYPLAN
    {
        public virtual long TSA_ROWID { get; set; }

        public virtual long TSA_ID { get; set; }

        public virtual long TSA_TASK { get; set; }

        public virtual long TSA_LINE { get; set; }

        public virtual string TSA_DESC { get; set; }

        public virtual string TSA_ASSIGNED { get; set; }

        public virtual DateTime TSA_SCHFROM { get; set; }

        public virtual DateTime TSA_SCHTO { get; set; }
    }
}