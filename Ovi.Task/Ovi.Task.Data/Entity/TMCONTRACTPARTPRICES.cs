using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMCONTRACTPARTPRICES
    {
        public virtual int CPP_ID { get; set; }
        public virtual int CPP_CONTRACTID { get; set; }
        public virtual string CPP_CUSTOMER { get; set; }
        public virtual int CPP_PART { get; set; }
        public virtual string CPP_PARTCODE { get; set; }
        public virtual string CPP_PARTDESC { get; set; }
        public virtual string CPP_PARTUOM { get; set; }
        public virtual string CPP_REFERENCE { get; set; }
        public virtual string CPP_REGION { get; set; }
        public virtual string CPP_REGIONDESC { get; set; }
        public virtual string CPP_BRANCH { get; set; }
        public virtual string CPP_BRANCHDESC { get; set; }
        public virtual decimal? CPP_UNITPURCHASEPRICE { get; set; }
        public virtual decimal CPP_UNITSALESPRICE { get; set; }
        public virtual string CPP_CURR { get; set; }
        public virtual DateTime CPP_CREATED { get; set; }
        public virtual string CPP_CREATEDBY { get; set; }
        public virtual DateTime? CPP_UPDATED { get; set; }
        public virtual string CPP_UPDATEDBY { get; set; }
        public virtual int CPP_RECORDVERSION { get; set; }
    }
}