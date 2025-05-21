using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUNPLANNEDTASKS_MAP : ClassMap<TMUNPLANNEDTASKS>
    {
        public TMUNPLANNEDTASKS_MAP()
        {
            ReadOnly();
            CompositeId().KeyProperty(x => x.TSK_DEPARTMENT)
                .KeyProperty(x => x.TSK_USER)
                .KeyProperty(x => x.TSK_ID)
                .KeyProperty(x => x.TSK_ACTLINE);
            Map(x => x.TSK_SHORTDESC);
            Map(x => x.TSK_ORGANIZATION);
            Map(x => x.TSK_CUSTOMER);
            Map(x => x.TSK_BRANCH);
            Map(x => x.TSK_ACTDESC);
            Map(x => x.TSK_STATUS);
            Map(x => x.TSK_STATUSDESC);
            Map(x => x.TSK_CREATEDBYUSERTYPE);
        }
    }
}