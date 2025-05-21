using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMFIREBASENOTIFICATIONS_MAP : ClassMap<TMFIREBASENOTIFICATIONS>
    {
        public TMFIREBASENOTIFICATIONS_MAP()
        {
            Id(x => x.NOT_ID);
            Map(x => x.NOT_TOPIC);
            Map(x => x.NOT_TITLE);
            Map(x => x.NOT_MESSAGE).Length(4001);
            Map(x => x.NOT_PARAMETERS).Length(4001);
            Map(x => x.NOT_CREATED);
            Map(x => x.NOT_CREATEDBY);
        }
    }
}