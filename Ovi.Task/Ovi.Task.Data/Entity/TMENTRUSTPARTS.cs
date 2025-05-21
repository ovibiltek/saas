using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMENTRUSTPARTS
    {
        public virtual int ENP_ID { get; set; }
        public virtual int ENP_ENTRUSTID { get; set; }
        public virtual string ENP_ENTRUSTDESC { get; set; }
        public virtual int ENP_PART { get; set; }
        public virtual string ENP_PARTCODE { get; set; }
        public virtual string ENP_PARTDESC { get; set; }
        public virtual int ENP_QUANTITY { get; set; }
        public virtual DateTime ENP_CREATED { get; set; }
        public virtual string ENP_CREATEDBY { get; set; }
        public virtual DateTime? ENP_UPDATED { get; set; }
        public virtual string ENP_UPDATEDBY { get; set; }
        public virtual int ENP_RECORDVERSION { get; set; }
    }
}