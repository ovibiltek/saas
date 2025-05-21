using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPARAMETERS_MAP : ClassMap<TMPARAMETERS>
    {
        public TMPARAMETERS_MAP()
        {
            Id(x => x.PRM_CODE).Length(PropertySettings.L50);
            Map(x => x.PRM_DESC).Length(PropertySettings.L250);
            Map(x => x.PRM_VALUE).Length(PropertySettings.L250);
            Map(x => x.PRM_ISENCRYPTED);
            Map(x => x.PRM_CREATED);
            Map(x => x.PRM_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRM_UPDATED);
            Map(x => x.PRM_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRM_RECORDVERSION).Default("0");
        }
    }
}