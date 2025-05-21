using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCALENDARVIEW
    {
        public virtual long TCA_ID { get; set; }

        public virtual long TCA_TASK { get; set; }

        public virtual long TCA_ACTLINE { get; set; }

        public virtual string TCA_ACTDESC { get; set; }

        public virtual string TCA_PRIORITY { get; set; }

        public virtual string TCA_PRIORITYCOLOR { get; set; }

        public virtual string TCA_PRIORITYCSS { get; set; }

        public virtual string TCA_ACTSTATUS { get; set; }

        public virtual string TCA_ORGANIZATION { get; set; }

        public virtual string TCA_STATUS { get; set; }

        public virtual string TCA_PSTATUS { get; set; }

        public virtual string TCA_STATUSDESC { get; set; }

        public virtual string TCA_SHORTDESC { get; set; }

        public virtual string TCA_TYPE { get; set; }

        public virtual int TCA_PROGRESS { get; set; }

        public virtual decimal TCA_ACTUALHOURS { get; set; }

        public virtual decimal TCA_PLANNEDHOURS { get; set; }

        public virtual string TCA_RELATEDUSER { get; set; }

        public virtual string TCA_RELATEDUSERDESC { get; set; }

        public virtual string TCA_DEPARTMENT { get; set; }

        public virtual string TCA_TSKDEPARTMENT { get; set; }

        public virtual int TCA_YEAR { get; set; }

        public virtual int TCA_MONTH { get; set; }

        public virtual int TCA_WEEK { get; set; }

        public virtual int TCA_WEEKDAY { get; set; }

        public virtual decimal TCA_HOURS { get; set; }

        public virtual DateTime? TCA_DATE { get; set; }

        public virtual DateTime? TCA_TSKFROM { get; set; }

        public virtual DateTime? TCA_TSKTO { get; set; }

        public virtual DateTime? TCA_FROM { get; set; }

        public virtual DateTime? TCA_TO { get; set; }

        public virtual DateTime? TCA_DURSTART { get; set; }

        public virtual DateTime? TCA_DUREND { get; set; }

        public virtual string TCA_COMPFL { get; set; }

        //public virtual char TCA_USRMSFLAG { get; set; }

        public virtual string TCA_ACTSTAT { get; set; }

        public virtual string TCA_CREATEDBY { get; set; }

        public virtual string TCA_REQUESTEDBY { get; set; }

        public virtual string TCA_CUSCODE { get; set; }

        public virtual string TCA_CUSTOMER { get; set; }

        public virtual string TCA_BRNCODE { get; set; }

        public virtual string TCA_BRANCH { get; set; }

        public virtual string TCA_SUPPLIER { get; set; }
    }
}