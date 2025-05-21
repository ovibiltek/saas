using System;namespace Ovi.Task.Data.Entity
{
    public class TMBRANDS
    {
        public virtual string BRA_CODE { get; set; }

        public virtual string BRA_DESC { get; set; }

        public virtual string BRA_DESCF { get; set; }

        public virtual char BRA_ACTIVE { get; set; }

        public virtual DateTime BRA_CREATED { get; set; }

        public virtual string BRA_CREATEDBY { get; set; }

        public virtual DateTime? BRA_UPDATED { get; set; }

        public virtual string BRA_UPDATEDBY { get; set; }

        public virtual int BRA_SQLIDENTITY { get; set; }

        public virtual int BRA_RECORDVERSION { get; set; }    }}