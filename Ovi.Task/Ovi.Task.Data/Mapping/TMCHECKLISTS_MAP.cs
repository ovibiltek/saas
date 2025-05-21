using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCHECKLISTS_MAP : ClassMap<TMCHECKLISTS>
    {
        public TMCHECKLISTS_MAP()
        {
            Id(x => x.CHK_ID).GeneratedBy.Identity();
            Map(x => x.CHK_SUBJECT).Length(PropertySettings.L50);
            Map(x => x.CHK_SOURCE);
            Map(x => x.CHK_TYPE);
            Map(x => x.CHK_TEMPLATELINEID);
            Map(x => x.CHK_LINE);
            Map(x => x.CHK_TEXT).Length(PropertySettings.L250);
            Map(x => x.CHK_NO);
            Map(x => x.CHK_RATE);
            Map(x => x.CHK_PERC);
            Map(x => x.CHK_CHECKED);
            Map(x => x.CHK_NECESSARY);
            Map(x => x.CHK_TEXTVALUE);
            Map(x => x.CHK_NUMERICVALUE);
            Map(x => x.CHK_DATETIMEVALUE);
            Map(x => x.CHK_NOTE);
            Map(x => x.CHK_TEMPLATE);
            Map(x => x.CHK_TOPIC);
            Map(x => x.CHK_TOPICDESC).ReadOnly().Formula("(SELECT t.CHT_DESCRIPTION FROM TMCHKLISTTEMPLATETOPICS t WHERE t.CHT_TEMPLATE = CHK_TEMPLATE AND t.CHT_CODE = CHK_TOPIC)");
            Map(x => x.CHK_TOPICNEWLINE).ReadOnly().Formula("(SELECT t.CHT_ALLOWNEWLINE FROM TMCHKLISTTEMPLATETOPICS t WHERE t.CHT_TEMPLATE = CHK_TEMPLATE AND t.CHT_CODE = CHK_TOPIC)");
            Map(x => x.CHK_TOPICORDER);
            Map(x => x.CHK_CREATED);
            Map(x => x.CHK_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CHK_UPDATED);
            Map(x => x.CHK_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CHK_UPDATEDBYDESC)
                .Length(PropertySettings.L250)
                .Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CHK_UPDATEDBY)");
            Map(x => x.CHK_RECORDVERSION).Default("0");
            Map(x => x.CHK_CMNCOUNT).ReadOnly().Formula("(SELECT c.CMN_COUNT FROM TMCMNCOUNTSVIEW c WHERE c.CMN_SUBJECT = 'CHECKLISTITEM' AND c.CMN_SOURCE = CHK_ID)");
            Map(x => x.CHK_DOCCOUNT).ReadOnly().Formula("dbo.GetDocumentCount('CHECKLISTITEM', CHK_ID, :SessionContext.User)");
            Map(x => x.CHK_TACID);
            Map(x => x.CHK_COMPARE);

        }
    }
}
