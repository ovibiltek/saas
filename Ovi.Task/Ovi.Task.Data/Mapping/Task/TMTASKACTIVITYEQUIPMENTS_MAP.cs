using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKACTIVITYEQUIPMENTS_MAP : ClassMap<TMTASKACTIVITYEQUIPMENTS>
    {
        public TMTASKACTIVITYEQUIPMENTS_MAP()
        {
            Id(x => x.TAE_ID);
            Map(x => x.TAE_EQPID);
            Map(x => x.TAE_EQPCODE).ReadOnly().Formula("(SELECT d.EQP_CODE FROM TMEQUIPMENTS d WHERE d.EQP_ID = TAE_EQPID)");
            Map(x => x.TAE_EQPDESC).ReadOnly().Formula("(SELECT d.EQP_DESC FROM TMEQUIPMENTS d WHERE d.EQP_ID = TAE_EQPID)");
            Map(x => x.TAE_EQPTYPE);
            Map(x => x.TAE_EQPTYPEENTITY);
            Map(x => x.TAE_QUANTITY);
            Map(x => x.TAE_UNITPRICE);
            Map(x => x.TAE_UNITSALESPRICE);
            Map(x => x.TAE_ALLOWZERO);
            Map(x => x.TAE_CURRENCY);
            Map(x => x.TAE_PRICINGMETHOD);
            Map(x => x.TAE_TSAID);
            Map(x => x.TAE_CREATED);
            Map(x => x.TAE_CREATEDBY);
            Map(x => x.TAE_UPDATED);
            Map(x => x.TAE_UPDATEDBY);
            Map(x => x.TAE_RECORDVERSION);
        }
    }
}
