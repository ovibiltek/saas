using System;

namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONPART
    {
        public virtual long PAR_ID { get; set; }

        public virtual int PAR_QUOTATION { get; set; }

        public virtual int PAR_PART { get; set; }

        public virtual string PAR_BRAND { get; set; }

        public virtual string PAR_REFERENCE { get; set; }

        public virtual string PAR_PARTCODE { get; set; }

        public virtual string PAR_PARTDESC { get; set; }

        public virtual string PAR_PARTUOM { get; set; }

        public virtual decimal PAR_QTY { get; set; }

        public virtual decimal? PAR_UNITPURCHASEPRICE { get; set; }

        public virtual decimal? PAR_PURCHASEDISCOUNTRATE { get; set; }

        public virtual decimal? PAR_PURCHASEDISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? PAR_TOTALPURCHASEPRICE { get; set; }

        public virtual decimal? PAR_PURCHASEEXCH { get; set; }

        public virtual decimal? PAR_SALESEXCH { get; set; }

        public virtual string PAR_PURCHASEPRICECURR { get; set; }

        public virtual string PAR_PURCHASEPRICECURRDESC { get; set; }

        public virtual decimal? PAR_UNITSALESPRICE { get; set; }

        public virtual decimal? PAR_SALESDISCOUNTRATE { get; set; }

        public virtual decimal? PAR_SALESDISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? PAR_TOTALSALESPRICE { get; set; }

        public virtual string PAR_SALESPRICECURR { get; set; }

        public virtual string PAR_SALESPRICECURRDESC { get; set; }

        public virtual DateTime PAR_CREATED { get; set; }

        public virtual string PAR_CREATEDBY { get; set; }

        public virtual DateTime? PAR_UPDATED { get; set; }

        public virtual string PAR_UPDATEDBY { get; set; }

        public virtual int PAR_RECORDVERSION { get; set; }
    }
}