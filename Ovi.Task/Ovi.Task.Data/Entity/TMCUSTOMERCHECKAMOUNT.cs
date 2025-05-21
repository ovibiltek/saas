using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMCUSTOMERCHECKAMOUNT
    {
        public virtual int CCA_ID { get; set; }
        public virtual string CCA_CUSTOMER { get; set; }
        public virtual string CCA_CATEGORY { get; set; }
        public virtual DateTime CCA_CREATED { get; set; }
        public virtual string CCA_CREATEDBY { get; set; }
        public virtual DateTime? CCA_UPDATED { get; set; }
        public virtual string CCA_UPDATEDBY { get; set; }
        public virtual int CCA_RECORDVERSION { get; set; }
    }
}