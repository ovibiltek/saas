using System;

namespace Ovi.Task.Data.Entity
{
    public class TMEXCHRATES
    {
        public virtual long CRR_ID { get; set; }

        public virtual string CRR_CURR { get; set; }

        public virtual string CRR_CURRDESC { get; set; }

        public virtual string CRR_BASECURR { get; set; }

        public virtual string CRR_BASECURRDESC { get; set; }

        public virtual decimal CRR_EXCH { get; set; }

        public virtual DateTime CRR_STARTDATE { get; set; }

        public virtual DateTime CRR_ENDDATE { get; set; }

        public virtual DateTime CRR_CREATED { get; set; }

        public virtual DateTime? CRR_UPDATED { get; set; }

        public virtual string CRR_CREATEDBY { get; set; }

        public virtual string CRR_UPDATEDBY { get; set; }

        public virtual int CRR_RECORDVERSION { get; set; }
    }
}