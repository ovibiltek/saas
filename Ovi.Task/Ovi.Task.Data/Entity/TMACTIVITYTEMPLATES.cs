using System;

namespace Ovi.Task.Data.Entity
{
    public class TMACTIVITYTEMPLATES
    {
        public virtual long TAT_ID { get; set; }

        public virtual string TAT_TYPE { get; set; }

        public virtual string TAT_ENTITY { get; set; }

        public virtual string TAT_CODE { get; set; }

        public virtual string TAT_STATUS { get; set; }

        public virtual string TAT_DESC { get; set; }

        public virtual long TAT_LINE { get; set; }

        public virtual char TAT_TASKDEPARTMENT { get; set; }

        public virtual char TAT_TASKDESC { get; set; }

        public virtual string TAT_DEPARTMENT { get; set; }

        public virtual string TAT_TRADE { get; set; }

        public virtual string TAT_ASSIGNEDTO { get; set; }

        public virtual long? TAT_PREDECESSOR { get; set; }

        public virtual string TAT_PREDECESSORDESC { get; set; }

        public virtual string TAT_CHKLISTTMP { get; set; }

        public virtual char TAT_LMAPPROVALREQUIRED { get; set; }

        public virtual char TAT_HIDDEN { get; set; }

        public virtual char TAT_PRIVATE { get; set; }

        public virtual char TAT_CREATESEPARATEACTIVITY { get; set; }

        public virtual DateTime TAT_CREATED { get; set; }

        public virtual string TAT_CREATEDBY { get; set; }

        public virtual DateTime? TAT_UPDATED { get; set; }

        public virtual string TAT_UPDATEDBY { get; set; }

        public virtual int TAT_RECORDVERSION { get; set; }
    }
}