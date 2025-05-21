using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERGROUPKPIS_MAP : ClassMap<TMUSERGROUPKPIS>
    {
        public TMUSERGROUPKPIS_MAP()
        {
            Id(x => x.UGK_ID);
            Map(x => x.UGK_USERGROUP).Length(PropertySettings.L50);
            Map(x => x.UGK_KPI).Length(PropertySettings.L50);
            Map(x => x.UGK_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.UGK_CREATED);
            Map(x => x.UGK_RECORDVERSION).Default("0");
        }
    }
}