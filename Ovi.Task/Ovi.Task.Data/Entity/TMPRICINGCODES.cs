using System;namespace Ovi.Task.Data.Entity{    public class TMPRICINGCODES    {        public virtual string PRC_CODE { get; set; }
        public virtual string PRC_DESC { get; set; }
        public virtual string PRC_GROUP { get; set; }
        public virtual char PRC_ACTIVE { get; set; }
        public virtual DateTime PRC_CREATED { get; set; }
        public virtual string PRC_CREATEDBY { get; set; }
        public virtual DateTime? PRC_UPDATED { get; set; }
        public virtual string PRC_UPDATEDBY { get; set; }
        public virtual int PRC_SQLIDENTITY { get; set; }
        public virtual int PRC_RECORDVERSION { get; set; }    }}