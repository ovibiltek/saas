using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERLINETRACK
    {
        public virtual int PRT_ID { get; set; }

        public virtual int PRT_PORID { get; set; }

        public virtual string PRT_PART { get; set; }

        public virtual string PRT_PARTUOM { get; set; }

        public virtual string PRT_PARTDESC { get; set; }

        public virtual string PRT_CARGOCOMPANY { get; set; }

        public virtual DateTime? PRT_CARGODATE { get; set; }

        public virtual string PRT_CARGONUMBER { get; set; }

        public virtual decimal? PRT_TOTALORDERQTY { get; set; }

        public virtual decimal? PRT_TOTALENTRY { get; set; }

        public virtual decimal? PRT_TOTALRETURN { get; set; }

        public virtual decimal? PRT_WAITINGQUAN { get; set; }
    }
}
