using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMINBOX_MAP : ClassMap<TMINBOX>
    {
        public TMINBOX_MAP()
        {
            Id(x => x.INB_CODE).Length(PropertySettings.L50);
            Map(x => x.INB_DESC).Length(PropertySettings.L250);
            Map(x => x.INB_DESCF).Formula("dbo.GetDesc('TMINBOX','INB_DESC', INB_CODE, INB_DESC,:SessionContext.Language)");
            Map(x => x.INB_INFO).Formula("dbo.GetDesc('TMINBOX','INB_INFO', INB_CODE, '',:SessionContext.Language)");
            Map(x => x.INB_CSS).Length(PropertySettings.L50);
            Map(x => x.INB_COLOR).Length(PropertySettings.L50);
            Map(x => x.INB_CONDITION).Length(PropertySettings.L4001);
            Map(x => x.INB_SCREEN).Length(PropertySettings.L50);
            Map(x => x.INB_GROUP).Length(PropertySettings.L50);
            Map(x => x.INB_TYPE).Length(PropertySettings.L50);
            Map(x => x.INB_SCREENDESCF).Formula("dbo.GetDesc('TMSCREENS','SCR_DESC', INB_SCREEN, (SELECT s.SCR_DESC FROM TMSCREENS s WHERE s.SCR_CODE = INB_SCREEN),:SessionContext.Language)");
            Map(x => x.INB_SQL).Length(PropertySettings.L4001);
            Map(x => x.INB_ORDER);
            Map(x => x.INB_ACTIVE);
            Map(x => x.INB_ISVALIDATED);
            Map(x => x.INB_RECORDVERSION).Default("0");
            Map(x => x.INB_SQLIDENTITY).Generated.Insert();
            Map(x => x.INB_RESULTTYPE);

        }
    }
}