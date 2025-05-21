using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSERVICECODESUPPLIERS_MAP : ClassMap<TMSERVICECODESUPPLIERS>
    {
        public TMSERVICECODESUPPLIERS_MAP(){
            Id(x => x.SRS_ID);
            Map(x => x.SRS_SERVICECODE);
            Map(x => x.SRS_SUPPLIERCODE).Length(PropertySettings.L50);
            Map(x => x.SRS_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SRS_CREATED);

        }
    }
}
