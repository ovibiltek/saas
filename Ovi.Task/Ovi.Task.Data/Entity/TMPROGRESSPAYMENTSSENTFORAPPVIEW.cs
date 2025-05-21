using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMPROGRESSPAYMENTSSENTFORAPPVIEW
    {
        public virtual int PSP_CODE { get; set; }
        public virtual string PSP_DESC { get; set; }
        public virtual int? PSP_TASK { get; set; }
        public virtual string PSP_CUSTOMER { get; set; }
        public virtual string PSP_BRANCH { get; set; }
        public virtual string PSP_TASKCATEGORY { get; set; }
        public virtual DateTime? PSP_LASTAPPROVALSENT { get; set; }
        public virtual string PSP_STATUS { get; set; }
        public virtual decimal? PSP_TOTALCOST { get; set; }
        public virtual decimal? PSP_TOTALPSP { get; set; }
        public virtual decimal? PSP_TOTALPROFIT { get; set; }
        public virtual string PSP_CURR { get; set; }
        public virtual string PSP_COMMENT_1 { get; set; }
        public virtual string PSP_COMMENT_2 { get; set; }
        public virtual string PSP_COMMENT_3 { get; set; }
        public virtual string PSP_COMMENT_4 { get; set; }
        public virtual string PSP_COMMENT_5 { get; set; }
    }
}