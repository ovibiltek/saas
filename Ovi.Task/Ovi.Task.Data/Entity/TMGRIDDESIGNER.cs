using System;

namespace Ovi.Task.Data.Entity
{
    public class TMGRIDDESIGNER
    {
        public virtual int GRD_ID { get; set; }

        public virtual string GRD_SCREENCODE { get; set; }

        public virtual string GRD_CODE { get; set; }

        public virtual string GRD_TITLE { get; set; }

        public virtual string GRD_STRINGARRAY { get; set; }

        public virtual string GRD_COLUMNARRAY { get; set; }

        public virtual string GRD_INFO { get; set; }

        public virtual string GRD_BUTTONARRAY { get; set; }

        public virtual string GRD_RIGHTCLICKARRAY { get; set; }

        public virtual string GRD_KEYFIELD { get; set; }

        public virtual string GRD_PRIMARYTEXTFIELD { get; set; }

        public virtual string GRD_PRIMARYCODEFIELD { get; set; }

        public virtual string GRD_ORDERFIELD { get; set; }

        public virtual string GRD_ORDERDIRECTION { get; set; }

        public virtual DateTime? GRD_UPDATED { get; set; }

        public virtual DateTime GRD_CREATED { get; set; }

        public virtual string GRD_CREATEDBY { get; set; }

        public virtual string GRD_UPDATEDBY { get; set; }
    }
}