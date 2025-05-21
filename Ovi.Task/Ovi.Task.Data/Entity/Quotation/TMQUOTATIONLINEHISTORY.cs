using System;

namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONLINEHISTORY
    {
        public virtual long? QLN_NO { get; set; }

        public virtual int? QLN_SERVICECODE { get; set; }

        public virtual int? QLN_PARTCODE { get; set; }

        public virtual int QLN_QUOTATION { get; set; }

        public virtual string QLN_STATUS { get; set; }

        public virtual string QLN_STATUSDESC { get; set; }

        public virtual DateTime QLN_CREATED { get; set; }

        public virtual string QLN_CUSTOMER { get; set; }

        public virtual decimal? QLN_UNITPURCHASEPRICE { get; set; }

        public virtual string QLN_PURCHASECURR { get; set; }

        public virtual decimal? QLN_PURCHASEEXCH { get; set; }

        public virtual decimal? QLN_UNITSALESPRICE { get; set; }

        public virtual string QLN_CURR { get; set; }
    }
}