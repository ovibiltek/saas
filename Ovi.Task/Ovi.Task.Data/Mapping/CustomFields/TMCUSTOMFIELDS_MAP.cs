using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.Mapping.CustomFields
{
    public sealed class TMCUSTOMFIELDS_MAP : ClassMap<TMCUSTOMFIELDS>
    {
        public TMCUSTOMFIELDS_MAP()
        {
            Id(x => x.CFD_CODE).Length(PropertySettings.L50);
            Map(x => x.CFD_FIELDTYPE).Length(PropertySettings.L50);
            Map(x => x.CFD_ENTITY).Length(PropertySettings.L50);
            Map(x => x.CFD_DESC).Length(PropertySettings.L50);
            Map(x => x.CFD_DESCF).Formula("dbo.GetDesc('TMCUSTOMFIELDS','CFD_DESC', CFD_CODE, CFD_DESC, :SessionContext.Language)");
            Map(x => x.CFD_MULTISELECTION);
            Map(x => x.CFD_ALLOWFREETEXT);
            Map(x => x.CFD_ACTIVE);
            Map(x => x.CFD_CLASS);
            Map(x => x.CFD_CLASSDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('CFCLASS',CFD_CLASS,:SessionContext.Language)");
            Map(x => x.CFD_CREATED);
            Map(x => x.CFD_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CFD_UPDATED);
            Map(x => x.CFD_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CFD_RECORDVERSION).Default("0");
        }
    }
}