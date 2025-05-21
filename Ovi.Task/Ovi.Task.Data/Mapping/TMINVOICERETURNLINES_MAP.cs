using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMINVOICERETURNLINES_MAP : ClassMap<TMINVOICERETURNLINES>
    {
        public TMINVOICERETURNLINES_MAP()
        {
            Id(x => x.IRL_ID);
            Map(x => x.IRL_INVOICECODE);
            Map(x => x.IRL_DETAILID);
            Map(x => x.IRL_RETURNINV);
            Map(x => x.IRL_TASK);
            Map(x => x.IRL_DETAILTYPE);
            Map(x => x.IRL_ACTIVITY);
            Map(x => x.IRL_RETURNTOTAL);
            Map(x => x.IRL_CREATED);
            Map(x => x.IRL_CREATEDBY);
            Map(x => x.IRL_UPDATED);
            Map(x => x.IRL_UPDATEDBY);
        }
    }
}
