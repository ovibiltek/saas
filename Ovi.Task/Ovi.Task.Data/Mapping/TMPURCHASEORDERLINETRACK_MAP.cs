using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERLINETRACK_MAP : ClassMap<TMPURCHASEORDERLINETRACK>
    {
        public TMPURCHASEORDERLINETRACK_MAP()
        {
            Id(x => x.PRT_ID);
            Map(x => x.PRT_PORID);
            Map(x => x.PRT_PART);
            Map(x => x.PRT_PARTDESC);
            Map(x => x.PRT_PARTUOM);
            Map(x => x.PRT_CARGOCOMPANY);
            Map(x => x.PRT_CARGODATE);
            Map(x => x.PRT_CARGONUMBER);
            Map(x => x.PRT_TOTALENTRY);
            Map(x => x.PRT_TOTALORDERQTY);
            Map(x => x.PRT_TOTALRETURN);
            Map(x => x.PRT_WAITINGQUAN);
        }
    }
}
