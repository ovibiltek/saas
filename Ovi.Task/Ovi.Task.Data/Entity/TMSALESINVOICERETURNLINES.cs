using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMSALESINVOICERETURNLINES
    {
        public virtual long SIR_ID { get; set; }
        public virtual int SIR_PSPID { get; set; }
        public virtual int SIR_LINEID { get; set; }
        public virtual int SIR_SIVID { get; set; }
        public virtual decimal SIR_LINETOTAL { get; set; }
        public virtual decimal SIR_RETURNTOTAL { get; set; }
        public virtual DateTime SIR_CREATED { get; set; }
        public virtual string SIR_CREATEDBY { get; set; }
        public virtual DateTime? SIR_UPDATED { get; set; }
        public virtual string SIR_UPDATEDBY { get; set; }
    }
}
