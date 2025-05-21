using System;namespace Ovi.Task.Data.Entity{    public class TMPRICINGCODEPARAMETERS    {        public virtual long PCP_ID { get; set; }
        public virtual string PCP_PRICINGCODE { get; set; }
        public virtual string PCP_CURR { get; set; }
        public virtual string PCP_CURRDESC { get; set; }
        public virtual decimal PCP_PRICE { get; set; }
        public virtual DateTime PCP_STARTDATE { get; set; }
        public virtual DateTime PCP_ENDDATE { get; set; }
        public virtual DateTime PCP_CREATED { get; set; }
        public virtual string PCP_CREATEDBY { get; set; }
        public virtual DateTime? PCP_UPDATED { get; set; }
        public virtual string PCP_UPDATEDBY { get; set; }
        public virtual int PCP_RECORDVERSION { get; set; }    }}