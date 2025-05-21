using System;

namespace Ovi.Task.Data.Entity
{
    public class TMWAREHOUSETRANSFERLINES
    {
        public virtual long WTL_ID { get; set; }
        public virtual long WTL_WTRID { get; set; }

        public virtual int WTL_LINE { get; set; }

        public virtual int WTL_PART { get; set; }

        public virtual decimal WTL_QTY { get; set; }

        public virtual decimal WTL_UNITPRICE { get; set; }

        public virtual string WTL_UOM { get; set; }

        public virtual int WTL_FRTRANS { get; set; }
        public virtual int WTL_FRTRANSLINE { get; set; }
        public virtual int WTL_TOTRANS { get; set; }
        public virtual int WTL_TOTRANSLINE { get; set; }
        public virtual DateTime WTL_CREATED { get; set; }
        public virtual string WTL_CREATEDBY { get; set; }

        public virtual DateTime? WTL_UPDATED { get; set; }


        public virtual string WTL_UPDATEDBY { get; set; }

     



       
    }
}