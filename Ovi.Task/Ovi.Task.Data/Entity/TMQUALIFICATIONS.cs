using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMQUALIFICATIONS
    {
        public virtual string QUL_CODE { get; set; }
        public virtual string QUL_DESC { get; set; }
        public virtual char QUL_ACTIVE { get; set; }
        public virtual DateTime QUL_CREATED { get; set; }
        public virtual string QUL_CREATEDBY { get; set; }
        public virtual DateTime? QUL_UPDATED { get; set; }
        public virtual string QUL_UPDATEDBY { get; set; }
        public virtual int QUL_RECORDVERSION { get; set; }
    }
}