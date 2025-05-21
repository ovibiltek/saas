using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSALESINVOICERETURNLINES_MAP : ClassMap<TMSALESINVOICERETURNLINES>
    {
        public TMSALESINVOICERETURNLINES_MAP()
        {
            Id(x=>x.SIR_ID);
            Map(x=>x.SIR_PSPID);
            Map(x=>x.SIR_LINEID);
            Map(x=>x.SIR_SIVID);
            Map(x=>x.SIR_LINETOTAL);
            Map(x=>x.SIR_RETURNTOTAL);
            Map(x=>x.SIR_CREATED);
            Map(x=>x.SIR_CREATEDBY);
            Map(x=>x.SIR_UPDATED);
            Map(x=>x.SIR_UPDATEDBY);
        }
    }
}
