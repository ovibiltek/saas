using System;

namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONLABOR
    {
        public virtual long LAB_ID { get; set; }

        public virtual long LAB_QUOTATION { get; set; }

        public virtual decimal LAB_PERIOD { get; set; }

        public virtual string LAB_PERIODUNIT { get; set; }

        public virtual string LAB_TRADE { get; set; }

        public virtual string LAB_TRADEDESC { get; set; }

        public virtual int LAB_SERVICECODE { get; set; }

        public virtual string LAB_SERVICECODEDESCRIPTION { get; set; }

        public virtual string LAB_REFERENCE { get; set; }

        public virtual string LAB_ASSIGNEDTO { get; set; }

        public virtual decimal? LAB_UNITPURCHASEPRICE { get; set; }

        public virtual decimal? LAB_PURCHASEDISCOUNTRATE { get; set; }

        public virtual decimal? LAB_PURCHASEDISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? LAB_TOTALPURCHASEPRICE { get; set; }

        public virtual decimal? LAB_PURCHASEEXCH { get; set; }

        public virtual decimal? LAB_SALESEXCH { get; set; }

        public virtual string LAB_PURCHASEPRICECURR { get; set; }

        public virtual string LAB_PURCHASEPRICECURRDESC { get; set; }

        public virtual decimal? LAB_UNITSALESPRICE { get; set; }

        public virtual decimal? LAB_SALESDISCOUNTRATE { get; set; }

        public virtual decimal? LAB_SALESDISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? LAB_TOTALSALESPRICE { get; set; }

        public virtual string LAB_SALESPRICECURR { get; set; }

        public virtual string LAB_SALESPRICECURRDESC { get; set; }

        public virtual char LAB_COPY { get; set; }

        public virtual DateTime LAB_CREATED { get; set; }

        public virtual string LAB_CREATEDBY { get; set; }

        public virtual DateTime? LAB_UPDATED { get; set; }

        public virtual string LAB_UPDATEDBY { get; set; }

        public virtual int LAB_RECORDVERSION { get; set; }
    }
}