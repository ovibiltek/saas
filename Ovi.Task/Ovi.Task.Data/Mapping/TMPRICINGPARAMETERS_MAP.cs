using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPRICINGPARAMETERS_MAP : ClassMap<TMPRICINGPARAMETERS>
    {
        public TMPRICINGPARAMETERS_MAP()
        {
            Id(x => x.PRP_CODE);
            Map(x => x.PRP_DESC).Length(PropertySettings.L250);
            Map(x => x.PRP_ORG).Length(PropertySettings.L50);
            Map(x => x.PRP_ORGDESC).ReadOnly().Length(PropertySettings.L250).Formula("dbo.GetDesc('TMORGS','ORG_DESC', PRP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = PRP_ORG),:SessionContext.Language)");
            Map(x => x.PRP_LABORTYPE).Length(PropertySettings.L50);
            Map(x => x.PRP_SERVICEFEE);
            Map(x => x.PRP_HOURLYFEE);
            Map(x => x.PRP_CRITICALTIMEVALUE);
            Map(x => x.PRP_CURRENCY).Length(PropertySettings.L50);
            Map(x => x.PRP_CURRENCYDESC).ReadOnly().Length(PropertySettings.L250).ReadOnly().Formula("(SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = PRP_CURRENCY)");
            Map(x => x.PRP_ACTIVE).Length(PropertySettings.L250);
            Map(x => x.PRP_CREATED);
            Map(x => x.PRP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRP_UPDATED);
            Map(x => x.PRP_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRP_RECORDVERSION).Default("0");
        }
    }
}