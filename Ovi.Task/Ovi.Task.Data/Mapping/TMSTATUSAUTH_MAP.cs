using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSTATUSAUTH_MAP : ClassMap<TMSTATUSAUTH>
    {
        public TMSTATUSAUTH_MAP()
        {
            Id(x => x.SAU_ID);
            Map(x => x.SAU_ENTITY).Length(PropertySettings.L50);
            Map(x => x.SAU_TYPE).Length(PropertySettings.L50);
            Map(x => x.SAU_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.SAU_FROM).Length(PropertySettings.L4);
            Map(x => x.SAU_TO).Length(PropertySettings.L4);
            Map(x => x.SAU_AUTHORIZED).Length(PropertySettings.L50);
            Map(x => x.SAU_ACTIVE);
            Map(x => x.SAU_SHOWONWORKFLOW);
            Map(x => x.SAU_CREATED);
            Map(x => x.SAU_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SAU_UPDATED);
            Map(x => x.SAU_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SAU_RECORDVERSION).Default("0");
        }
    }
}