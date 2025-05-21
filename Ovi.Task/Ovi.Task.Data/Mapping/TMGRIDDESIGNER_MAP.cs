using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMGRIDDESIGNER_MAP : ClassMap<TMGRIDDESIGNER>
    {
        public TMGRIDDESIGNER_MAP()
        {
            Id(x => x.GRD_ID);
            Map(x => x.GRD_SCREENCODE).Length(PropertySettings.L4001);
            Map(x => x.GRD_CODE).Length(PropertySettings.L4001);
            Map(x => x.GRD_TITLE).Length(PropertySettings.L4001);
            Map(x => x.GRD_COLUMNARRAY).Length(PropertySettings.L4001);
            Map(x => x.GRD_STRINGARRAY).Length(PropertySettings.L4001);
            Map(x => x.GRD_INFO).Length(PropertySettings.L4001);
            Map(x => x.GRD_BUTTONARRAY).Length(PropertySettings.L4001);
            Map(x => x.GRD_RIGHTCLICKARRAY).Length(PropertySettings.L4001);
            Map(x => x.GRD_KEYFIELD).Length(PropertySettings.L4001);
            Map(x => x.GRD_PRIMARYTEXTFIELD).Length(PropertySettings.L4001);
            Map(x => x.GRD_PRIMARYCODEFIELD).Length(PropertySettings.L4001);
            Map(x => x.GRD_ORDERFIELD).Length(PropertySettings.L4001);
            Map(x => x.GRD_ORDERDIRECTION).Length(PropertySettings.L4001);
            Map(x => x.GRD_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.GRD_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.GRD_CREATED);
            Map(x => x.GRD_UPDATED);
        }
    }
}