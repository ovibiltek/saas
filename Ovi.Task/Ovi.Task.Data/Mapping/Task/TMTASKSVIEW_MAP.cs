using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKSVIEW_MAP : ClassMap<TMTASKSVIEW>
    {
        public TMTASKSVIEW_MAP()
        {
            ReadOnly();
            Id(x => x.TSK_ID);
            Map(x => x.TSK_PRIORITY);
            Map(x => x.TSK_PRIORITYDESC).Formula("dbo.GetDesc('TMPRIORITIES','PRI_DESC', TSK_PRIORITY, (SELECT p.PRI_DESC FROM TMPRIORITIES p WHERE p.PRI_CODE = TSK_PRIORITY),:SessionContext.Language)");
            Map(x => x.TSK_STATUS);
            Map(x => x.TSK_STATUSDESC).Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK#' + TSK_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TSK_STATUS AND s.STA_ENTITY = 'TASK') ,:SessionContext.Language)");
            Map(x => x.TSK_DEPARTMENT);
            Map(x => x.TSK_USER);
            Map(x => x.TSK_YEAR);
        }
    }
}