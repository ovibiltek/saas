using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERGROUPMOBILETOPICS_MAP : ClassMap<TMUSERGROUPMOBILETOPICS>
    {
        public TMUSERGROUPMOBILETOPICS_MAP()
        {
            Id(x => x.UGM_ID);
            Map(x => x.UGM_USERGROUP).Length(PropertySettings.L50);
            Map(x => x.UGM_TOPIC).Length(PropertySettings.L50);
            Map(x => x.UGM_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.UGM_CREATED);
            Map(x => x.UGM_RECORDVERSION).Default("0");
        }
    }
}