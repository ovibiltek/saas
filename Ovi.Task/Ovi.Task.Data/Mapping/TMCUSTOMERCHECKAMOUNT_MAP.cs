using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCUSTOMERCHECKAMOUNT_MAP : ClassMap<TMCUSTOMERCHECKAMOUNT>
    {
        public TMCUSTOMERCHECKAMOUNT_MAP()
        {
            Id(x => x.CCA_ID);
            Map(x => x.CCA_CUSTOMER);
            Map(x => x.CCA_CATEGORY);
            Map(x => x.CCA_CREATED);
            Map(x => x.CCA_CREATEDBY);
            Map(x => x.CCA_UPDATED);
            Map(x => x.CCA_UPDATEDBY);
            Map(x => x.CCA_RECORDVERSION);
        }
    }
}