using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMAUDIT_MAP : ClassMap<TMAUDIT>
    {
        public TMAUDIT_MAP()
        {
            Id(x => x.AUD_ID);
            Map(x => x.AUD_SUBJECT).Length(PropertySettings.L50);
            Map(x => x.AUD_SOURCE).Length(PropertySettings.L50);
            Map(x => x.AUD_ACTION).Length(PropertySettings.L50);
            Map(x => x.AUD_REFID).Length(PropertySettings.L50);
            Map(x => x.AUD_FROM).Length(PropertySettings.L500);
            Map(x => x.AUD_TO).Length(PropertySettings.L500);
            Map(x => x.AUD_CREATED);
            Map(x => x.AUD_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.AUD_RECORDVERSION).Default("0");
        }
    }
}