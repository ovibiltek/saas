using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONDURATIONS_MAP : ClassMap<TMQUOTATIONDURATIONS>
    {
        public TMQUOTATIONDURATIONS_MAP()
        {
            Id(x => x.QSP_QUOID);
            Map(x => x.QSP_TSKID);
            Map(x => x.QSP_STATUSDESC);
            Map(x => x.QSP_B1MINUTES);
            Map(x => x.QSP_B2MINUTES);
            Map(x => x.QSP_PAMINUTES);
            Map(x => x.QSP_BYMINUTES);
            Map(x => x.QSP_HMINUTES);
            Map(x => x.QSP_H2MINUTES);
            Map(x => x.QSP_RMINUTES);
            Map(x => x.QSP_SAMINUTES);
            Map(x => x.QSP_B1);
            Map(x => x.QSP_B2);
            Map(x => x.QSP_B3);
            Map(x => x.QSP_BY);
            Map(x => x.QSP_H);
            Map(x => x.QSP_H2);
            Map(x => x.QSP_R);
            Map(x => x.QSP_SA);
        }
    }
}
