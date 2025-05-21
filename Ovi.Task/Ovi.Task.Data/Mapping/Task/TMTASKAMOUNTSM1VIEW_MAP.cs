using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKAMOUNTSM1VIEW_MAP : ClassMap<TMTASKAMOUNTSM1VIEW>
    {
        public TMTASKAMOUNTSM1VIEW_MAP()
        {
            Id(x => x.ANT_TASKID);
            Map(x => x.ANT_TASKSHORTDESC);
            Map(x => x.ANT_ACTCOUNT);
            Map(x => x.ANT_TASKORGANIZATION);
            Map(x => x.ANT_TASKDEPARTMENT);
            Map(x => x.ANT_TASKCUSTOMER);
            Map(x => x.ANT_TASKCUSTOMERDESC);
            Map(x => x.ANT_BRANCH);
            Map(x => x.ANT_BRANCHDESC);
            Map(x => x.ANT_REGION);
            Map(x => x.ANT_PROVINCE);
            Map(x => x.ANT_CUSTOMERPM);
            Map(x => x.ANT_CUSTOMERGROUP);
            Map(x => x.ANT_CUSTOMERTYPE);
            Map(x => x.ANT_TASKSTATUS);
            Map(x => x.ANT_TASKSTATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK' + '#' + ANT_TASKSTATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = ANT_TASKSTATUS AND s.STA_ENTITY = 'TASK'),:SessionContext.Language)");
            Map(x => x.ANT_TASKPRIORITY);
            Map(x => x.ANT_TASKTYPE);
            Map(x => x.ANT_TASKTASKTYPE);
            Map(x => x.ANT_TASKCATEGORY);
            Map(x => x.ANT_PSPCODE);
            Map(x => x.ANT_PSPSTATUS);
            Map(x => x.ANT_TASKREQUESTEDBY);
            Map(x => x.ANT_TASKCREATEDBY);
            Map(x => x.ANT_USRGROUP);
            Map(x => x.ANT_TASKCREATED);
            Map(x => x.ANT_TASKREQUESTED);
            Map(x => x.ANT_TASKDEADLINE);
            Map(x => x.ANT_BOOKINGSTART);
            Map(x => x.ANT_TASKHOLDDATE);
            Map(x => x.ANT_TASKCOMPLETED);
            Map(x => x.ANT_TASKCLOSED);
            Map(x => x.ANT_TASKHOLDREASON);
            Map(x => x.ANT_SERVPSP);
            Map(x => x.ANT_PARTPSP);
            Map(x => x.ANT_TOTALPSP);
        }
    }
}