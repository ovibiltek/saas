using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMSUPPLIERINVOICELINEDETAILSVIEW
    {
        public virtual int SIL_ID { get; set; }
        public virtual string SIL_TYPE { get; set; }
        public virtual int SIL_TASK { get; set; }
        public virtual int SIL_ACTIVITY { get; set; }
        public virtual DateTime SIL_DATE { get; set; }
        public virtual string SIL_DESC { get; set; }
        public virtual decimal SIL_QTY { get; set; }
        public virtual string SIL_UOM { get; set; }
        public virtual decimal SIL_UNITPRICE { get; set; }
        public virtual decimal SIL_TOTAL { get; set; }
        public virtual string SIL_CURR { get; set; }
    }
}