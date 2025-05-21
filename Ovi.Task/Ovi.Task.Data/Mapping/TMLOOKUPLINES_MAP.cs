using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMLOOKUPLINES_MAP : ClassMap<TMLOOKUPLINES>
    {
        public TMLOOKUPLINES_MAP()
        {
            Id(x => x.TML_ID);
            Map(x => x.TML_TYPE).Length(PropertySettings.L50);
            Map(x => x.TML_CODE).Length(PropertySettings.L50);
            Map(x => x.TML_ITEMCODE).Length(PropertySettings.L50);
            Map(x => x.TML_ITEMDESC).Length(PropertySettings.L250);
            Map(x => x.TML_COMMENTS);
            Map(x => x.TML_DOCUMENTS);
            Map(x => x.TML_CREATED);
            Map(x => x.TML_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TML_RECORDVERSION).Default("0");
        }
    }
}