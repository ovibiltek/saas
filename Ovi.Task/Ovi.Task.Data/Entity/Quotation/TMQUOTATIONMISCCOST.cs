using System;

namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONMISCCOST
    {
        public virtual long MSC_ID { get; set; }

        public virtual int MSC_QUOTATION { get; set; }

        public virtual string MSC_DESC { get; set; }

        public virtual string MSC_TYPE { get; set; }

        public virtual string MSC_TYPEDESC { get; set; }

        public virtual string MSC_BRAND { get; set; }

        public virtual string MSC_PTYPE { get; set; }

        public virtual long? MSC_PART { get; set; }

        public virtual string MSC_PARTCODE { get; set; }

        public virtual string MSC_PARTDESCRIPTION { get; set; }

        public virtual int? MSC_SERVICECODE { get; set; }

        public virtual string MSC_SERVICECODEDESCRIPTION { get; set; }

        public virtual decimal MSC_QTY { get; set; }

        public virtual string MSC_UOM { get; set; }

        public virtual decimal? MSC_UNITPURCHASEPRICE { get; set; }

        public virtual decimal? MSC_PURCHASEDISCOUNTRATE { get; set; }

        public virtual decimal? MSC_PURCHASEDISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? MSC_TOTALPURCHASEPRICE { get; set; }

        public virtual string MSC_PURCHASEPRICECURR { get; set; }

        public virtual string MSC_PURCHASEPRICECURRDESC { get; set; }

        public virtual decimal? MSC_PURCHASEEXCH { get; set; }

        public virtual decimal? MSC_UNITSALESPRICE { get; set; }

        public virtual decimal? MSC_SALESDISCOUNTRATE { get; set; }

        public virtual decimal? MSC_SALESDISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? MSC_TOTALSALESPRICE { get; set; }

        public virtual string MSC_SALESPRICECURR { get; set; }

        public virtual string MSC_SALESPRICECURRDESC { get; set; }

        public virtual string MSC_REFERENCE { get; set; }

        public virtual decimal? MSC_SALESEXCH { get; set; }

        public virtual char MSC_COPY { get; set; }

        public virtual DateTime MSC_CREATED { get; set; }

        public virtual string MSC_CREATEDBY { get; set; }

        public virtual DateTime? MSC_UPDATED { get; set; }

        public virtual string MSC_UPDATEDBY { get; set; }

        public virtual int MSC_RECORDVERSION { get; set; }
    }
}