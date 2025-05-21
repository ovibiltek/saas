using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMWAITINGPERFORMANCEREPORTVIEW_MAP : ClassMap<TMWAITINGPERFORMANCEREPORTVIEW>
    {
        public TMWAITINGPERFORMANCEREPORTVIEW_MAP()
        {
            Id(x => x.WPR_ID);
            Map(x => x.WPR_TSK);
            Map(x => x.WPR_TSKDESC);
            Map(x => x.WPR_TSKORG);
            Map(x => x.WPR_ORGDESC);
            Map(x => x.WPR_CAT);
            Map(x => x.WPR_CATDESC);
            Map(x => x.WPR_TSKTASKTYPE);
            Map(x => x.WPR_TSKTASKTYPEDESC);
            Map(x => x.WPR_CUSTOMER);
            Map(x => x.WPR_BRANCH);
            Map(x => x.WPR_BRANCHDESC);
            Map(x => x.WPR_TSKREQUESTED);
            Map(x => x.WPR_STATUS);
            Map(x => x.WPR_HOLDREASON);
            Map(x => x.WPR_STATUSDESC);
            Map(x => x.WPR_FINANS);
            Map(x => x.WPR_KALITE);
            Map(x => x.WPR_HAKEDIS);
            Map(x => x.WPR_OPERASYON);
            Map(x => x.WPR_MUSTERIYONETIMI);
            Map(x => x.WPR_SATINALMA);
            Map(x => x.WPR_RAPORLAMA);
        }
    }
}
