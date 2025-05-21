using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMENTRUSTEQUIPMENTS_MAP : ClassMap<TMENTRUSTEQUIPMENTS>
    {
        public TMENTRUSTEQUIPMENTS_MAP()
        {
            Id(x => x.EEQ_ID);
            Map(x => x.EEQ_ENTRUSTID);
            Map(x => x.EEQ_ENTRUSTDESC).ReadOnly().Formula("(SELECT e.ETR_DESC FROM TMENTRUSTS e WHERE e.ETR_ID = EEQ_ENTRUSTID)");
            Map(x => x.EEQ_EQUIPMENT);
            Map(x => x.EEQ_EQUIPMENTCODE).ReadOnly().Formula("(SELECT e.EQP_CODE FROM TMEQUIPMENTS e WHERE e.EQP_ID = EEQ_EQUIPMENT)");
            Map(x => x.EEQ_EQUIPMENTDESC).ReadOnly().Formula("(SELECT e.EQP_DESC FROM TMEQUIPMENTS e WHERE e.EQP_ID = EEQ_EQUIPMENT)");
            Map(x => x.EEQ_HEALTH);
            Map(x => x.EEQ_HEALTHDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('EQUIPMENTHEALTH',EEQ_HEALTH,:SessionContext.Language)");
            Map(x => x.EEQ_CREATED);
            Map(x => x.EEQ_CREATEDBY);
            Map(x => x.EEQ_UPDATED);
            Map(x => x.EEQ_UPDATEDBY);
            Map(x => x.EEQ_RECORDVERSION);
        }
    }
}