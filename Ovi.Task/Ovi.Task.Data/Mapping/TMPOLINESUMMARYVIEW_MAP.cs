using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPOLINESUMMARYVIEW_MAP : ClassMap<TMPOLINESUMMARYVIEW>
    {
        public TMPOLINESUMMARYVIEW_MAP()
        {
            Id(x => x.PLS_ID);
            Map(x => x.PLS_LINE);
            Map(x => x.PLS_PART);
            Map(x => x.PLS_PORID);
            Map(x => x.PLS_QTY);
            Map(x => x.PLS_REMAININGQTY);
        }
    }
}