using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCHKLISTTEMPLATES_MAP : ClassMap<TMCHKLISTTEMPLATES>
    {
        public TMCHKLISTTEMPLATES_MAP()
        {
            Id(x => x.CLT_CODE).Length(PropertySettings.L50);
            Map(x => x.CLT_DESC).Length(PropertySettings.L250);
            Map(x => x.CLT_ACTIVE);
            Map(x => x.CLT_CREATED);
            Map(x => x.CLT_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CLT_UPDATED);
            Map(x => x.CLT_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CLT_RECORDVERSION).Default("0");
            Map(x => x.CLT_ORG);
            Map(x => x.CLT_SEQUENTIAL);
        }
    }
}