using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.Mapping.CustomFields
{
    public sealed class TMCUSTOMFIELDVALUES_MAP : ClassMap<TMCUSTOMFIELDVALUES>
    {
        public TMCUSTOMFIELDVALUES_MAP()
        {
            Id(x => x.CFV_ID);
            Map(x => x.CFV_SOURCE).Length(PropertySettings.L50);
            Map(x => x.CFV_SUBJECT);
            Map(x => x.CFV_CODE).Length(PropertySettings.L50);
            Map(x => x.CFV_TYPE).Length(PropertySettings.L50);
            Map(x => x.CFV_NUM);
            Map(x => x.CFV_DATETIME);
            Map(x => x.CFV_TEXT).Length(PropertySettings.L4001);
            Map(x => x.CFV_DESC).Formula("dbo.GetLookupLineDesc(CFV_CODE,CFV_TEXT)");
            Map(x => x.CFV_RECORDVERSION).Default("0");
            Map(x => x.CFV_CREATED);
            Map(x => x.CFV_CREATEDBY);
            Map(x => x.CFV_UPDATED);
            Map(x => x.CFV_UPDATEDBY);
        }
    }
}