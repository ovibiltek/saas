using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMNOTIFICATIONSVIEW_MAP : ClassMap<TMNOTIFICATIONSVIEW>
    {
        public TMNOTIFICATIONSVIEW_MAP()
        {
            ReadOnly();
            Id(x => x.NOT_ID);
            Map(x => x.NOT_DESC);
            Map(x => x.NOT_TYPE);
            Map(x => x.NOT_SUBJECT);
            Map(x => x.NOT_SOURCE);
            Map(x => x.NOT_OWNER);
            Map(x => x.NOT_CREATED);
            Map(x => x.NOT_CREATEDBY);
            Map(x => x.NOT_READ);
        }
    }
}