using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Project;

namespace Ovi.Task.Data.Mapping.Project
{
    public sealed class TMPROJECTFINANCIALVIEW_MAP : ClassMap<TMPROJECTFINANCIALVIEW>
    {
        public TMPROJECTFINANCIALVIEW_MAP()
        {
            ReadOnly();
            CompositeId().KeyProperty(x => x.PRJ_ID).KeyProperty(x => x.PRJ_TSKID);
            Map(x => x.PRJ_DESC);
            Map(x => x.PRJ_TYPE);
            Map(x => x.PRJ_CUSTOMER);
            Map(x => x.PRJ_STATUS);
            Map(x => x.PRJ_CREATED);
            Map(x => x.PRJ_TSKTYPE);
            Map(x => x.PRJ_TSKSHORTDESC);
            Map(x => x.PRJ_LABORSUM_PLANNED);
            Map(x => x.PRJ_MISCCOST_PLANNED);
            Map(x => x.PRJ_FIXEDCOST_PLANNED);
            Map(x => x.PRJ_PART_PLANNED);
            Map(x => x.PRJ_TOOL_PLANNED);
            Map(x => x.PRJ_TOTAL_PLANNED);
            Map(x => x.PRJ_LABORSUM_OFFER);
            Map(x => x.PRJ_MISCCOST_OFFER);
            Map(x => x.PRJ_FIXEDCOST_OFFER);
            Map(x => x.PRJ_PART_OFFER);
            Map(x => x.PRJ_TOOL_OFFER);
            Map(x => x.PRJ_TOTAL_OFFER);
            Map(x => x.PRJ_LABORSUM_ACTUAL);
            Map(x => x.PRJ_MISCCOST_ACTUAL);
            Map(x => x.PRJ_PART_ACTUAL);
            Map(x => x.PRJ_TOOL_ACTUAL);
            Map(x => x.PRJ_TOTAL_ACTUAL);
            Map(x => x.PRJ_CURR);

        }
    }
}