using System;

namespace Ovi.Task.Data.Entity.Task
{

    public class TMTASKACTIVITIESEXTVIEW
    {
        public virtual long TSA_ID { get; set; }

        public virtual long TSA_TASK { get; set; }

        public virtual long TSA_LINE { get; set; }

        public virtual decimal? TSA_TEMPID { get; set; }

        public virtual string TSA_DESC { get; set; }

        public virtual string TSA_DEPARTMENT { get; set; }

        public virtual long? TSA_PREDECESSOR { get; set; }

        public virtual string TSA_PREDECESSORDESC { get; set; }

        public virtual decimal? TSA_PROJECTEDTIME { get; set; }

        public virtual string TSA_TRADE { get; set; }

        public virtual string TSA_TRADEDESC { get; set; }

        public virtual string TSA_ASSIGNEDTO { get; set; }

        public virtual char TSA_LMAPPROVALREQUIRED { get; set; }

        public virtual string TSA_STATUS { get; set; }

        public virtual char TSA_COMPLETED { get; set; }

        public virtual char TSA_HIDDEN { get; set; }

        public virtual char TSA_RELEASED { get; set; }

        public virtual char TSA_PRIVATE { get; set; }

        public virtual string TSA_TASKSTATUS { get; set; }

        public virtual string TSA_TASKSTATUSDESC { get; set; }

        public virtual string TSA_TASKCUSTOMER { get; set; }

        public virtual string TSA_TASKBRANCH { get; set; }

        public virtual string TSA_TASKBRANCHDESC { get; set; }

        public virtual long TSA_CHKLISTPROGRESS { get; set; }

        public virtual char TSA_CHKLISTLOCKED { get; set; }

        public virtual DateTime? TSA_SCHFROM { get; set; }

        public virtual DateTime? TSA_SCHTO { get; set; }

        public virtual DateTime? TSA_DATECOMPLETED { get; set; }

        public virtual string TSA_COMPLETEDBY { get; set; }

        public virtual DateTime TSA_CREATED { get; set; }

        public virtual string TSA_CREATEDBY { get; set; }

        public virtual DateTime? TSA_UPDATED { get; set; }

        public virtual string TSA_UPDATEDBY { get; set; }

        public virtual char TSA_CHK01 { get; set; }

        public virtual char TSA_CHK02 { get; set; }

        public virtual char TSA_CHK03 { get; set; }

        public virtual char TSA_CHK04 { get; set; }

        public virtual char TSA_CHK05 { get; set; }

        public virtual string TSA_MOBILENOTE { get; set; }

        public virtual int TSA_RECORDVERSION { get; set; }

        public virtual int TSA_ISVISIBLE { get; set; }

        public virtual long? TSA_INVOICE { get; set; }

        public virtual string TSA_QUOTATIONSTATUS { get; set; }

        public virtual string TSA_QUOTATIONSTATUSDESC { get; set; }

        public virtual string TSA_TASKPCODE { get; set; }

        public virtual char TSA_FILTER01 { get; set; }

        public virtual char TSA_FILTER02 { get; set; }

        public virtual char TSA_FILTER03 { get; set; }

        public virtual char TSA_FILTER04 { get; set; }

        public virtual char TSA_FILTER05 { get; set; }

        public virtual char TSA_FILTER06 { get; set; }
    }

}