using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTYPES_MAP : ClassMap<TMTYPES>
    {
        public TMTYPES_MAP()
        {
            CompositeId().KeyProperty(x => x.TYP_ENTITY, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.TYP_CODE, a => { a.Length(PropertySettings.L50); });
            Map(x => x.TYP_DESC).Length(PropertySettings.L250);
            Map(x => x.TYP_DESCF).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', TYP_ENTITY + '#' + TYP_CODE, TYP_DESC,:SessionContext.Language)");
            Map(x => x.TYP_ORGANIZATION).Length(PropertySettings.L50);
            Map(x => x.TYP_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', TYP_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = TYP_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.TYP_ACTIVE);
            Map(x => x.TYP_SHOWINACTIONBOX);
            Map(x => x.TYP_AUTOCODEPREFIX);
            Map(x => x.TYP_SQLIDENTITY).Generated.Insert();
            Map(x => x.TYP_CREATED);
            Map(x => x.TYP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TYP_UPDATED);
            Map(x => x.TYP_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.TYP_RECORDVERSION).Default("0");
        }
    }
}