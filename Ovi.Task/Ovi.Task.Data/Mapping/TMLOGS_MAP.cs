using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMLOGS_MAP : ClassMap<TMLOGS>
    {
        public TMLOGS_MAP()
        {
            Id(x => x.TML_ID);
            Map(x => x.TML_BUNIT);
            Map(x => x.TML_BFUNC);
            Map(x => x.TML_MSG);
            Map(x => x.TML_DETAILS).Length(PropertySettings.L4001);
            Map(x => x.TML_CREATED);
            Map(x => x.TML_CREATEDBY);
            Map(x => x.TML_RECORDVERSION).Default("0");
        }
    }
}