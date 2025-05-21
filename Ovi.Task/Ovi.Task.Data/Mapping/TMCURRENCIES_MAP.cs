 using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCURRENCIES_MAP : ClassMap<TMCURRENCIES>
    {
        public TMCURRENCIES_MAP()
        {
            Id(x => x.CUR_CODE).Length(PropertySettings.L50);
            Map(x => x.CUR_DESC).Length(PropertySettings.L250);
            Map(x => x.CUR_ACTIVE);
            Map(x => x.CUR_CREATED);
            Map(x => x.CUR_UPDATED);
            Map(x => x.CUR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CUR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CUR_SQLIDENTITY).Generated.Insert();
            Map(x => x.CUR_RECORDVERSION).Default("0");
        }
    }
}