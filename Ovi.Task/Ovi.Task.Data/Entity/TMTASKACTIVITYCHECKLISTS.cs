using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMTASKACTIVITYCHECKLISTS
    {
        public virtual int TAC_ID { get; set; }
        public virtual int TAC_TASK { get; set; }
        public virtual int TAC_ACTIVITY { get; set; }
        public virtual string TAC_ACTIVITYDESC { get; set; }
        public virtual string TAC_CHKTMP { get; set; }
        public virtual string TAC_CHKTMPDESC { get; set; }
        public virtual string TAC_DESCRIPTION { get; set; }
        public virtual long TAC_CHKLISTPROGRESS { get; set; }
        public virtual char TAC_HIDDEN { get; set; }
        public virtual char TAC_COMPLETED { get; set; }
        public virtual char TAC_AUTO { get; set; }
        public virtual char TAC_SEQUENTIAL { get; set; }
        public virtual DateTime TAC_CREATED { get; set; }
        public virtual string TAC_CREATEDBY { get; set; }
        public virtual DateTime? TAC_UPDATED { get; set; }
        public virtual string TAC_UPDATEDBY { get; set; }
        public virtual int TAC_RECORDVERSION { get; set; }

    }
}