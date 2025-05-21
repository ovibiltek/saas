using System;

using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMWAITINGPERFORMANCEREPORTVIEW
    {
        public virtual int WPR_ID { get; set; }

        public virtual int WPR_TSK { get; set; }

        public virtual string WPR_TSKDESC { get; set; }

        public virtual string WPR_TSKORG { get; set; }

        public virtual string WPR_ORGDESC { get; set; }

        public virtual string WPR_CAT { get; set; }

        public virtual string WPR_CATDESC { get; set; }

        public virtual string WPR_TSKTASKTYPE { get; set; }

        public virtual string WPR_TSKTASKTYPEDESC { get; set; }

        public virtual string WPR_CUSTOMER { get; set; }

        public virtual string WPR_BRANCH { get; set; }

        public virtual string WPR_BRANCHDESC { get; set; }

        public virtual DateTime WPR_TSKREQUESTED { get; set; }

        public virtual string WPR_STATUS { get; set; }

        public virtual string WPR_STATUSDESC { get; set; }

        public virtual string WPR_HOLDREASON { get; set; }

        public virtual string WPR_FINANS { get; set; }

        public virtual string WPR_KALITE { get; set; }

        public virtual string WPR_HAKEDIS { get; set; }

        public virtual string WPR_OPERASYON { get; set; }

        public virtual string WPR_MUSTERIYONETIMI { get; set; }

        public virtual string WPR_SATINALMA { get; set; }

        public virtual string WPR_RAPORLAMA { get; set; }

    }
}

