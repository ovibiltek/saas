using System;namespace Ovi.Task.Data.Entity{    public class TMWAREHOUSETOWAREHOUSE    {        public virtual long WTW_ID { get; set; }
        public virtual string WTW_ORG { get; set; }
        public virtual string WTW_ORGDESC { get; set; }
        public virtual string WTW_FROM { get; set; }
        public virtual string WTW_FROMDESC { get; set; }
        public virtual string WTW_FROMBIN { get; set; }
        public virtual string WTW_FROMBINDESC { get; set; }
        public virtual string WTW_TO { get; set; }
        public virtual string WTW_TODESC { get; set; }
        public virtual string WTW_TOBIN { get; set; }
        public virtual string WTW_TOBINDESC { get; set; }
        public virtual int WTW_PART { get; set; }
        public virtual string WTW_PARTCODE { get; set; }
        public virtual string WTW_PARTDESC { get; set; }
        public virtual decimal WTW_QTY { get; set; }
        public virtual string WTW_UOM { get; set; }
        public virtual string WTW_UOMDESC { get; set; }
        public virtual decimal? WTW_UNITPRICE { get; set; }
        public virtual string WTW_CURR { get; set; }
        public virtual string WTW_CURRDESC { get; set; }
        public virtual DateTime WTW_CREATED { get; set; }
        public virtual string WTW_CREATEDBY { get; set; }
        public virtual DateTime? WTW_UPDATED { get; set; }
        public virtual string WTW_UPDATEDBY { get; set; }
        public virtual int WTW_RECORDVERSION { get; set; }    }}