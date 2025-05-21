using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBOOKEDHOURSVIEW_MAP : ClassMap<TMBOOKEDHOURSVIEW>
    {
        public TMBOOKEDHOURSVIEW_MAP()
        {
            Id(x => x.BOO_ID);
            Map(x => x.BOO_USER);
            Map(x => x.BOO_TRADE);
            Map(x => x.BOO_USRDESC);
            Map(x => x.BOO_CATDESC);
            Map(x => x.BOO_TASK);
            Map(x => x.BOO_TSKORG);
            Map(x => x.BOO_TSKSHORTDESC);
            Map(x => x.BOO_BRANCH);
            Map(x => x.BOO_BRANCHDESC);
            Map(x => x.BOO_CUSTOMER);
            Map(x => x.BOO_CUSTOMERDESC);
            Map(x => x.BOO_CREATEDBY);
            Map(x => x.BOO_AUTO);
            Map(x => x.BOO_DATE);
            Map(x => x.BOO_START);
            Map(x => x.BOO_END);
            Map(x => x.BOO_TIME);
            Map(x => x.BOO_MINUTES);
        }
    }
}