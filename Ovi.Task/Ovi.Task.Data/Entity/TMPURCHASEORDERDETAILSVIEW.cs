using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERDETAILSVIEW
    {
        public virtual int POD_ID { get; set; }
        public virtual int POD_PRQID { get; set; }
        public virtual string POD_PRQSTA { get; set; }
        public virtual long POD_PART { get; set; }
        public virtual string POD_PARTDESC { get; set; }
        public virtual string POD_PARTUOM { get; set; }
        public virtual int? POD_PORID { get; set; }
        public virtual string POD_PORSTA { get; set; }
        public virtual string POD_CARGOCOMPANY { get; set; }
        public virtual DateTime? POD_CARGODATE { get; set; }
        public virtual string POD_CARGONUMBER { get; set; }
        public virtual decimal POD_TOTALORDERQTY { get; set; }
        public virtual decimal POD_TOTALENTRY { get; set; }
        public virtual decimal POD_TOTALRETURN { get; set; }
        public virtual decimal POD_WAITINGQUAN { get; set; }
        public virtual int POD_TASK { get; set; }
  
    }
}
