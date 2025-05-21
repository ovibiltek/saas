using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMNOTIFICATIONS_MAP : ClassMap<TMNOTIFICATIONS>
    {
        public TMNOTIFICATIONS_MAP()
        {
            Id(x => x.NOT_ID);
            Map(x => x.NOT_DESC).Length(PropertySettings.L250);
            Map(x => x.NOT_TYPE).Length(PropertySettings.L50);
            Map(x => x.NOT_SUBJECT).Length(PropertySettings.L50);
            Map(x => x.NOT_SOURCE);
            Map(x => x.NOT_CREATED);
            Map(x => x.NOT_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.NOT_READ);
            Map(x => x.NOT_RECORDVERSION).Default("0");
        }
    }
}