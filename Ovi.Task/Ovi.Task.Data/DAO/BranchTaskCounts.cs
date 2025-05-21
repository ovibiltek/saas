using System;

namespace Ovi.Task.Data.Entity
{
    public class BranchTaskCounts
    {
        public virtual string BTC_BRANCH { get; set; }

        public virtual string BTC_CUSTOMER { get; set; }

        public virtual string BTC_REFERENCE { get; set; }

        public virtual string BTC_DESC { get; set; }

        public virtual string BTC_BUSINESSTYPE { get; set; }

        public virtual string BTC_REGION { get; set; }

        public virtual string BTC_ADSDESC { get; set; }

        public virtual string BTC_BRANCHACTIVE { get; set; }

        public virtual int BTC_BILGICOUNT { get; set; }

        public virtual int BTC_UZAKCOUNT { get; set; }
        public virtual int BTC_DISACIKCOUNT { get; set; }
        public virtual int BTC_DISTAMAMCOUNT { get; set; }
        public virtual int BTC_DENETLEMECOUNT { get; set; }
        public virtual int BTC_DENETLEMETAMAMCOUNT { get; set; }
        public virtual int BTC_UYGULAMAACIKCOUNT { get; set; }
        public virtual int BTC_UYGULAMATAMAMCOUNT { get; set; }
        public virtual int BTC_LOJISTIKTAMAMCOUNT { get; set; }
        public virtual int BTC_LOJISTIKACIKCOUNT { get; set; }
        public virtual int BTC_BAKIMACIKCOUNT { get; set; }
        public virtual int BTC_BAKIMTAMAMCOUNT { get; set; }
        public virtual int BTC_MONTAJACIKCOUNT { get; set; }
        public virtual int BTC_MONTAJTAMAMCOUNT { get; set; }
        public virtual int BTC_ARIZAACIKCOUNT { get; set; }
        public virtual int BTC_ARIZATAMAMCOUNT { get; set; }

        
    }
}