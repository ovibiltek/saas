using Ovi.Task.Data.DAO;
using System;
using System.Collections.Generic;

namespace Ovi.Task.UI.Models
{
    public class ActivityModel
    {
        public long TSA_ID { get; set; }

        public long TSA_TASK { get; set; }

        public long TSA_LINE { get; set; }

        public decimal? TSA_TEMPID { get; set; }

        public string TSA_DESC { get; set; }

        public string TSA_DEPARTMENT { get; set; }

        public string TSA_DEPARTMENTDESC { get; set; }

        public long? TSA_PREDECESSOR { get; set; }

        public string TSA_ASSIGNEDTO { get; set; }

        public IList<TMUSEREXT> TSA_ASSIGNEDTOARR { get; set; }

        public char TSA_LMAPPROVALREQUIRED { get; set; }

        public string TSA_STATUS { get; set; }

        public char TSA_COMPLETED { get; set; }

        public char TSA_HIDDEN { get; set; }

        public char TSA_PRIVATE { get; set; }

        public long TSA_CHKLISTPROGRESS { get; set; }

        public char TSA_CHKLISTLOCKED { get; set; }

        public char TSA_RELEASED { get; set; }

        public DateTime? TSA_SCHFROM { get; set; }

        public DateTime? TSA_SCHTO { get; set; }

        public DateTime? TSA_DATECOMPLETED { get; set; }

        public string TSA_COMPLETEDBY { get; set; }

        public DateTime TSA_CREATED { get; set; }

        public string TSA_CREATEDBY { get; set; }

        public DateTime? TSA_UPDATED { get; set; }

        public string TSA_UPDATEDBY { get; set; }

        public int TSA_RECORDVERSION { get; set; }

        public int TSA_ISVISIBLE { get; set; }

        public string TSA_TRADE { get; set; }

        public decimal? TSA_PROJECTEDTIME { get; set; }

        public long? TSA_INVOICE { get; set; }

        public char TSA_CHK01 { get; set; }

        public char TSA_CHK02 { get; set; }

        public char TSA_CHK03 { get; set; }

        public char TSA_CHK04 { get; set; }

        public char TSA_CHK05 { get; set; }

        public string TSA_MOBILENOTE { get; set; }

        public string TSA_DRAWINGNOTE { get; set; }

    }
}