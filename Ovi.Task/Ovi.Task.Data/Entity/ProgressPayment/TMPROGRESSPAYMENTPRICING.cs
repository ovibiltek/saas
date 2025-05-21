using System;

namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TMPROGRESSPAYMENTPRICING
    {
        public virtual long PRC_ID { get; set; }

        public virtual long PRC_PSPCODE { get; set; }

        public virtual long PRC_TASK { get; set; }

        public virtual string PRC_TASKDESC { get; set; }

        public virtual string PRC_CUSTOMER { get; set; }

        public virtual string PRC_BRANCH { get; set; }

        public virtual long PRC_ACTLINE { get; set; }

        public virtual string PRC_ACTDESC { get; set; }

        public virtual string PRC_ACTTRADE { get; set; }

        public virtual string PRC_CODE { get; set; }

        public virtual string PRC_TYPE { get; set; }

        public virtual string PRC_TYPEDESC { get; set; }

        public virtual decimal PRC_QTY { get; set; }

        public virtual decimal? PRC_USERQTY { get; set; }

        public virtual string PRC_UOM { get; set; }

        public virtual decimal PRC_COST { get; set; }

        public virtual string PRC_CALCMETHOD { get; set; }

        public virtual decimal PRC_UNITPRICE { get; set; }

        public virtual decimal? PRC_USERUNITPRICE { get; set; }

        public virtual decimal PRC_CALCPRICE { get; set; }

        public virtual DateTime PRC_CREATED { get; set; }

        public virtual string PRC_CREATEDBY { get; set; }

        public virtual int PRC_RECORDVERSION { get; set; }

        public virtual int PRC_TASKCMNTCOUNT { get; set; }

        public virtual int PRC_TASKDOCCOUNT { get; set; }

        public virtual string PRC_CURR { get; set; }

        public virtual long PRC_QUOTATION { get; set; }

        public virtual decimal? PRC_RETURNPRICE { get; set; }

        public virtual long? PRC_RETURNPRICEID { get; set; }

        public virtual long? PRC_SALESINVOICE { get; set; }


        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}