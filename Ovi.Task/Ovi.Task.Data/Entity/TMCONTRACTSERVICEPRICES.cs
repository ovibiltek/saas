using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCONTRACTSERVICEPRICES
    {
        public virtual int CSP_ID { get; set; }

        public virtual int CSP_CONTRACTID { get; set; }

        public virtual string CSP_CUSTOMER { get; set; }

        public virtual int CSP_SERVICECODE { get; set; }

        public virtual string CSP_SERVICECODEDESC { get; set; }

        public virtual string CSP_REFERENCE { get; set; }

        public virtual string CSP_REGION { get; set; }

        public virtual string CSP_REGIONDESC { get; set; }

        public virtual string CSP_BRANCH { get; set; }

        public virtual string CSP_BRANCHDESC { get; set; }

        public virtual decimal CSP_UNITPURCHASEPRICE { get; set; }

        public virtual decimal CSP_UNITSALESPRICE { get; set; }

        public virtual string CSP_CURR { get; set; }

        public virtual string CSP_CURRDESC { get; set; }

        public virtual DateTime CSP_CREATED { get; set; }

        public virtual string CSP_CREATEDBY { get; set; }

        public virtual DateTime? CSP_UPDATED { get; set; }

        public virtual string CSP_UPDATEDBY { get; set; }

        public virtual int CSP_RECORDVERSION { get; set; }
    }
}