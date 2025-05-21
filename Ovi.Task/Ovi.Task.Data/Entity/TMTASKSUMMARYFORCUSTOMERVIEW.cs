using System;
using Ovi.Task.Helper.Functional;
namespace Ovi.Task.Data.Entity
{
    public class TMTASKSUMMARYFORCUSTOMERVIEW
    {
        public virtual long TLN_ID { get; set; }
        public virtual string TLN_TYPE { get; set; }
        public virtual int TLN_TSK { get; set; }
        public virtual string TLN_DESC { get; set; }
        public virtual string TLN_QTY { get; set; }
        public virtual DateTime TLN_DATE { get; set; }
    }
}