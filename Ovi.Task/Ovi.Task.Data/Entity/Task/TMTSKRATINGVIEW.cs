using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTSKRATINGVIEW
    {
        public virtual int RTN_TSKID { get; set; }

        public virtual string RTN_TSKSHORTDESC { get; set; }

        public virtual string RTN_TSKCATEGORY { get; set; }

        public virtual string RTN_TSKCATEGORYDESC { get; set; }

        public virtual string RTN_TSKCUSTOMER { get; set; }

        public virtual string RTN_TSKCUSTOMERDESC { get; set; }

        public virtual string RTN_TSKBRANCH { get; set; }

        public virtual string RTN_TSKBRANCHDESC { get; set; }

        public virtual string RTN_TSKREGION { get; set; }

        public virtual char RTN_AUDITED { get; set; }

        public virtual DateTime? RTN_TSKCOMPLETED { get; set; }

        public virtual int? RTN_TSKRATING { get; set; }

        public virtual string RTN_TSKRATINGCOMMENTS { get; set; }

        public virtual DateTime? RTN_AUDCREATED { get; set; }

        public virtual string RTN_AUDCREATEDBY { get; set; }

        public virtual string RTN_REVIEW { get; set; }
    }
}