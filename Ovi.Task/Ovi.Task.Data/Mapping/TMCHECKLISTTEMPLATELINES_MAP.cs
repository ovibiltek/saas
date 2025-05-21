using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCHECKLISTTEMPLATELINES_MAP : ClassMap<TMCHECKLISTTEMPLATELINES>
    {
        public TMCHECKLISTTEMPLATELINES_MAP()
        {
            Id(x => x.CHK_ID).GeneratedBy.Identity();
            Map(x => x.CHK_SUBJECT).Length(PropertySettings.L50);
            Map(x => x.CHK_SOURCE).Length(PropertySettings.L50);
            Map(x => x.CHK_TEXT).Length(PropertySettings.L250);
            Map(x => x.CHK_TYPE).Length(PropertySettings.L50);
            Map(x => x.CHK_NO);
            Map(x => x.CHK_RATE);
            Map(x => x.CHK_NECESSARY);
            Map(x => x.CHK_ACTIVE);
            Map(x => x.CHK_TOPIC);
            Map(x => x.CHK_TOPICDESC).ReadOnly().Formula("(SELECT t.CHT_DESCRIPTION FROM TMCHKLISTTEMPLATETOPICS t WHERE t.CHT_TEMPLATE = CHK_SOURCE AND t.CHT_CODE = CHK_TOPIC)");
            Map(x => x.CHK_COMPARE);
            Map(x => x.CHK_CREATED);
            Map(x => x.CHK_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CHK_UPDATED);
            Map(x => x.CHK_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CHK_RECORDVERSION).Default("0");
        }
    }
}