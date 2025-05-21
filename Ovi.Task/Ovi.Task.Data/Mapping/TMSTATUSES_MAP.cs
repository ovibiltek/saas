using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSTATUSES_MAP : ClassMap<TMSTATUSES>
    {
        public TMSTATUSES_MAP()
        {
            CompositeId().KeyProperty(x => x.STA_ENTITY).KeyProperty(x => x.STA_CODE);
            Map(x => x.STA_PCODE).Length(PropertySettings.L4);
            Map(x => x.STA_DESC).Length(PropertySettings.L250);
            Map(x => x.STA_DESCF).Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', STA_ENTITY + '#' + STA_CODE, STA_DESC,:SessionContext.Language)");
            Map(x => x.STA_CSS).Length(PropertySettings.L50);
            Map(x => x.STA_SHOWONSEARCH);
            Map(x => x.STA_APPROVALSTEP);
            Map(x => x.STA_NEWAPPOINTMENT);
            Map(x => x.STA_PROGRESSPAYMENT);
            Map(x => x.STA_ORDER);
            Map(x => x.STA_SQLIDENTITY).Generated.Insert();
            Map(x => x.STA_CREATED);
            Map(x => x.STA_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.STA_UPDATED);
            Map(x => x.STA_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.STA_RECORDVERSION).Default("0");
        }
    }
}