using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPOLINESUMMARYVIEW
    {
        public virtual int PLS_ID { get; set; }

        public virtual long PLS_PORID { get; set; }

        public virtual int PLS_LINE { get; set; }

        public virtual int PLS_PART { get; set; }

        public virtual decimal PLS_QTY { get; set; }

        public virtual decimal PLS_REMAININGQTY { get; set; }
    }
}