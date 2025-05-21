using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSALESINVOICELINES_MAP : ClassMap<TMSALESINVOICELINES>
    {
        public TMSALESINVOICELINES_MAP()
        {
            Id(x => x.SIL_ID);
            Map(x => x.SIL_SALESINVOICE);
            Map(x => x.SIL_PSP);
            Map(x => x.SIL_ISRETURNED);
            Map(x => x.SIL_CREATED);
            Map(x => x.SIL_CREATEDBY);
            Map(x => x.SIL_UPDATED);
            Map(x => x.SIL_UPDATEDBY);
            Map(x => x.SIL_RECORDVERSION);
        }
    }
}