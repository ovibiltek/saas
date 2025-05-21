using System;

using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONDURATIONS
    {
        public virtual int QSP_QUOID { get; set; }

        public virtual int? QSP_TSKID { get; set; }

        public virtual string QSP_STATUSDESC { get; set; }

        public virtual int QSP_B1MINUTES { get; set; }

        public virtual int QSP_B2MINUTES { get; set; }

        public virtual int QSP_PAMINUTES { get; set; }

        public virtual int QSP_BYMINUTES { get; set; }

        public virtual int QSP_HMINUTES { get; set; }

        public virtual int QSP_H2MINUTES { get; set; }

        public virtual int QSP_RMINUTES { get; set; }

        public virtual int QSP_SAMINUTES { get; set; }

        public virtual string QSP_B1 { get; set; }

        public virtual string QSP_B2 { get; set; }

        public virtual string QSP_B3 { get; set; }

        public virtual string QSP_BY { get; set; }

        public virtual string QSP_H { get; set; }

        public virtual string QSP_H2 { get; set; }

        public virtual string QSP_R { get; set; }

        public virtual string QSP_SA { get; set; }

    }
}