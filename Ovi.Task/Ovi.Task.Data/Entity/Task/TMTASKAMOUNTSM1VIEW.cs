using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKAMOUNTSM1VIEW
    {
        public virtual int ANT_TASKID { get; set; }

        public virtual string ANT_TASKSHORTDESC { get; set; }

        public virtual int? ANT_ACTCOUNT { get; set; }

        public virtual string ANT_TASKORGANIZATION { get; set; }

        public virtual string ANT_TASKDEPARTMENT { get; set; }

        public virtual string ANT_TASKCUSTOMER { get; set; }

        public virtual string ANT_TASKCUSTOMERDESC { get; set; }

        public virtual string ANT_PROVINCE { get; set; }

        public virtual string ANT_BRANCH { get; set; }

        public virtual string ANT_BRANCHDESC { get; set; }

        public virtual string ANT_REGION { get; set; }

        public virtual string ANT_CUSTOMERPM { get; set; }

        public virtual string ANT_CUSTOMERGROUP { get; set; }

        public virtual string ANT_CUSTOMERTYPE { get; set; }

        public virtual string ANT_TASKSTATUS { get; set; }

        public virtual string ANT_TASKSTATUSDESC { get; set; }

        public virtual string ANT_TASKPRIORITY { get; set; }

        public virtual string ANT_TASKTYPE { get; set; }

        public virtual string ANT_TASKTASKTYPE { get; set; }

        public virtual string ANT_TASKCATEGORY { get; set; }

        public virtual int? ANT_PSPCODE { get; set; }

        public virtual string ANT_PSPSTATUS { get; set; }

        public virtual string ANT_TASKREQUESTEDBY { get; set; }

        public virtual string ANT_TASKCREATEDBY { get; set; }

        public virtual string ANT_USRGROUP { get; set; }

        public virtual DateTime ANT_TASKCREATED { get; set; }

        public virtual DateTime ANT_TASKREQUESTED { get; set; }

        public virtual DateTime? ANT_TASKDEADLINE { get; set; }

        public virtual DateTime? ANT_BOOKINGSTART { get; set; }

        public virtual DateTime? ANT_TASKHOLDDATE { get; set; }

        public virtual DateTime? ANT_TASKCOMPLETED { get; set; }

        public virtual DateTime? ANT_TASKCLOSED { get; set; }

        public virtual string ANT_TASKHOLDREASON { get; set; }

        public virtual decimal? ANT_SERVPSP { get; set; }

        public virtual decimal? ANT_PARTPSP { get; set; }

        public virtual decimal? ANT_TOTALPSP { get; set; }
    }
}