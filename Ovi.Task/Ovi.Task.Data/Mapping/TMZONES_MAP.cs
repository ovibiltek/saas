using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMZONES_MAP : ClassMap<TMZONES>
    {
        public TMZONES_MAP()
        {
            Id(x => x.ZON_CODE);
            Map(x => x.ZON_DESC).Length(PropertySettings.L250);
            Map(x => x.ZON_DESCF).Formula("dbo.GetDesc('TMZONES','ZON_DESC', ZON_CODE, ZON_DESC, :SessionContext.Language)");
            Map(x => x.ZON_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.ZON_TYPE).Length(PropertySettings.L50);
            Map(x => x.ZON_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', ZON_TYPEENTITY + '#' + ZON_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = ZON_TYPE AND t.TYP_ENTITY = ZON_TYPEENTITY),:SessionContext.Language)");
            Map(x => x.ZON_ACTIVE);
            Map(x => x.ZON_CREATED);
            Map(x => x.ZON_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.ZON_UPDATED);
            Map(x => x.ZON_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.ZON_RECORDVERSION).Default("0");
            Map(x => x.ZON_SQLIDENTITY).Generated.Insert();
        }
    }
}