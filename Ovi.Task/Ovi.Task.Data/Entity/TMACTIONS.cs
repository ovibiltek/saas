using System;

namespace Ovi.Task.Data.Entity
{
    public class TMACTIONS
    {
        public virtual string ACT_CODE { get; set; }

        public virtual string ACT_DESC { get; set; }

        public virtual string ACT_DESCF { get; set; }

        public virtual char ACT_ACTIVE { get; set; }

        public virtual string ACT_CREATEDBY { get; set; }

        public virtual DateTime ACT_CREATED { get; set; }

        public virtual string ACT_UPDATEDBY { get; set; }

        public virtual DateTime? ACT_UPDATED { get; set; }

        public virtual int ACT_SQLIDENTITY { get; set; }

        public virtual int ACT_RECORDVERSION { get; set; }
    }
}