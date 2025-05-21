using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKACTIVITYSERVICECODES_MAP : ClassMap<TMTASKACTIVITYSERVICECODES>
    {
        public TMTASKACTIVITYSERVICECODES_MAP()
        {
            Id(x => x.ASR_ID);
            Map(x => x.ASR_ACTIVITY);
            Map(x => x.ASR_SERVICECODE);
            Map(x => x.ASR_SERVICECODEDESC).Length(PropertySettings.L50).ReadOnly().Formula("dbo.GetDesc('TMSERVICECODES','SRV_DESCRIPTION', ASR_SERVICECODE , (SELECT s.SRV_DESCRIPTION FROM TMSERVICECODES s WHERE s.SRV_CODE = ASR_SERVICECODE) , :SessionContext.Language)");
            Map(x => x.ASR_SERVICECODEUOM).ReadOnly().Formula("(SELECT s.SRV_UOM FROM TMSERVICECODES s WHERE s.SRV_CODE = ASR_SERVICECODE)");
            Map(x => x.ASR_QUANTITY);
            Map(x => x.ASR_UNITPRICE);
            Map(x => x.ASR_UNITSALESPRICE);
            Map(x => x.ASR_ALLOWZERO);
            Map(x => x.ASR_CURRENCY);
            Map(x => x.ASR_PRICINGMETHOD);
            Map(x => x.ASR_EXCH);
            Map(x => x.ASR_CREATED);
            Map(x => x.ASR_CREATEDBY);
            Map(x => x.ASR_UPDATED);
            Map(x => x.ASR_UPDATEDBY);
            Map(x => x.ASR_RECORDVERSION);
        }
    }
}