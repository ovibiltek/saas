using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTSKCNTS_MAP : ClassMap<TMTSKCNTS>
    {
        public TMTSKCNTS_MAP()
        {
            Id(x => x.TSK_ID);
            Map(x => x.TSK_ASSIGNEDTO);
            Map(x => x.TSK_CNT);
            Map(x => x.TSK_STATUS);
            Map(x => x.TSK_STATUSDESC).Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', TSK_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TSK_STATUS AND s.STA_ENTITY = 'TASK'),:SessionContext.Language)");
        }
    }
}