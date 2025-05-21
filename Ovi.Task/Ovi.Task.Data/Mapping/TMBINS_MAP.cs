using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBINS_MAP : ClassMap<TMBINS>
    {
        public TMBINS_MAP()
        {
            CompositeId().KeyProperty(x => x.BIN_CODE).KeyProperty(x => x.BIN_WAREHOUSE);
            Map(x => x.BIN_DESC).Length(PropertySettings.L250);
            Map(x => x.BIN_ACTIVE);
            Map(x => x.BIN_SQLIDENTITY).Generated.Insert();
            Map(x => x.BIN_CREATED);
            Map(x => x.BIN_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.BIN_UPDATED);
            Map(x => x.BIN_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.BIN_RECORDVERSION).Default("0");
        }
    }
}