using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERGROUPS_MAP : ClassMap<TMUSERGROUPS>
    {
        public TMUSERGROUPS_MAP()
        {
            Id(x => x.UGR_CODE).Length(PropertySettings.L50);
            Map(x => x.UGR_DESC).Length(PropertySettings.L250);
            Map(x => x.UGR_ACTIVE);
            Map(x => x.UGR_CHECKLISTLOCK);
            Map(x => x.UGR_CLASS);
            Map(x => x.UGR_CREATED);
            Map(x => x.UGR_UPDATED);
            Map(x => x.UGR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.UGR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.UGR_SQLIDENTITY).Generated.Insert();
            Map(x => x.UGR_RECORDVERSION).Default("0");
        }
    }
}