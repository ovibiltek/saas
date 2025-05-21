using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMAVAILABLETASKSFORPSPVIEW_MAP : ClassMap<TMAVAILABLETASKSFORPSPVIEW>
    {
        public TMAVAILABLETASKSFORPSPVIEW_MAP()
        {
            Id(x => x.WPT_ID);
            Map(x => x.WPT_CUSTOMER);
            Map(x => x.WPT_YEARMONTH);
            Map(x => x.WPT_COUNT);
        }
    }
}