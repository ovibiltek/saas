using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCUSTOMEREQUIPMENTCONFIG_MAP : ClassMap<TMCUSTOMEREQUIPMENTCONFIG>
    {
        public TMCUSTOMEREQUIPMENTCONFIG_MAP()
        {
            Id(x => x.CEC_ID);
            Map(x => x.CEC_TSKTYPE);
            Map(x => x.CEC_TSKCAT);
            Map(x => x.CEC_CUSTOMER);
            Map(x => x.CEC_CREATED);
            Map(x => x.CEC_CREATEDBY);
            Map(x => x.CEC_UPDATED);
            Map(x => x.CEC_UPDATEDBY);
            Map(x => x.CEC_RECORDVERSION).Default("0");
            Map(x => x.CEC_TSKCATDESC).Length(PropertySettings.L250).Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', CEC_TSKCAT, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = CEC_TSKCAT) ,:SessionContext.Language)");
        }
    }
}
