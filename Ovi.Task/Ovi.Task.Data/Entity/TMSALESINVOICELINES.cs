using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMSALESINVOICELINES
    {
        public virtual int SIL_ID { get; set; }
        public virtual int SIL_SALESINVOICE { get; set; }
        public virtual long SIL_PSP { get; set; }
        public virtual char SIL_ISRETURNED { get; set; }
        public virtual DateTime SIL_CREATED { get; set; }
        public virtual string SIL_CREATEDBY { get; set; }
        public virtual DateTime? SIL_UPDATED { get; set; }
        public virtual string SIL_UPDATEDBY { get; set; }
        public virtual int SIL_RECORDVERSION { get; set; }
    }
}