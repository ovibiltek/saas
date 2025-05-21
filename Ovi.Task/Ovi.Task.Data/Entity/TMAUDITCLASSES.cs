using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMAUDITCLASSES
    {
        public virtual int AUC_ID { get; set; }
        public virtual string AUC_CLASS { get; set; }
        public virtual string AUC_DESC { get; set; }
        public virtual string AUC_NAMESPACE { get; set; }
        public virtual string AUC_TYPE { get; set; }
        public virtual DateTime AUC_CREATED { get; set; }
        public virtual string AUC_CREATEDBY { get; set; }
        public virtual DateTime? AUC_UPDATED { get; set; }
        public virtual string AUC_UPDATEDBY { get; set; }
        public virtual int AUC_RECORDVERSION { get; set; }
    }
}