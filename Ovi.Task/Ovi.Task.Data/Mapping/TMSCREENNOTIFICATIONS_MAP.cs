using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSCREENNOTIFICATIONS_MAP : ClassMap<TMSCREENNOTIFICATIONS>
    {
        public TMSCREENNOTIFICATIONS_MAP()
        {
            Id(x => x.NOT_ID);
            Map(x => x.NOT_USERGROUP).Length(PropertySettings.L50);
            Map(x => x.NOT_SCREEN).Length(PropertySettings.L50);
            Map(x => x.NOT_SCREENDESCF).Formula("dbo.GetDesc('TMSCREENS','SCR_DESC', NOT_SCREEN, (SELECT s.SCR_DESC FROM TMSCREENS s WHERE s.SCR_CODE = NOT_SCREEN),:SessionContext.Language)");
            Map(x => x.NOT_TITLE).Length(PropertySettings.L250);
            Map(x => x.NOT_CONTENT).Length(PropertySettings.L4001);
            Map(x => x.NOT_EFFECTIVEDATE);
            Map(x => x.NOT_CREATED);
            Map(x => x.NOT_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.NOT_UPDATED);
            Map(x => x.NOT_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.NOT_RECORDVERSION).Default("0");
            Map(x => x.NOT_VISIBLE).ReadOnly().Formula("(SELECT CASE WHEN EXISTS (SELECT 1 FROM TMSCREENNOTIFICATIONSTRX snt WHERE snt.NTR_USER = :SessionContext.User AND snt.NTR_NOTID = NOT_ID) THEN '-' ELSE '+' END)");
        }
    }
}