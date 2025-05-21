using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPRIORITIES_MAP : ClassMap<TMPRIORITIES>
    {
        public TMPRIORITIES_MAP()
        {
            Id(x => x.PRI_CODE).Length(PropertySettings.L50);
            Map(x => x.PRI_DESC).Length(PropertySettings.L250);
            Map(x => x.PRI_DESCF).Formula("dbo.GetDesc('TMPRIORITIES','PRI_DESC', PRI_CODE, PRI_DESC,:SessionContext.Language)");
            Map(x => x.PRI_ORGANIZATION).Length(PropertySettings.L50);
            Map(x => x.PRI_ORGANIZATIONDESC).ReadOnly().Length(PropertySettings.L250).Formula("dbo.GetDesc('TMORGS','ORG_DESC', PRI_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = PRI_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.PRI_COLOR).Length(PropertySettings.L50);
            Map(x => x.PRI_CSS).Length(PropertySettings.L50);
            Map(x => x.PRI_ACTIVE);
            Map(x => x.PRI_CREATED);
            Map(x => x.PRI_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRI_UPDATED);
            Map(x => x.PRI_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRI_SQLIDENTITY).Generated.Insert();
            Map(x => x.PRI_RECORDVERSION).Default("0");
        }
    }
}