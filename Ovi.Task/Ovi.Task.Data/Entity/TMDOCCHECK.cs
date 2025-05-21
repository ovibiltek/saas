using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMDOCCHECK
    {
        public virtual int CHK_ID { get; set; }
        public virtual long CHK_DOCID { get; set; }
        public virtual char CHK_VALUE { get; set; }
        public virtual DateTime CHK_CREATED { get; set; }
        public virtual string CHK_CREATEDBY { get; set; }
        public virtual DateTime? CHK_UPDATED { get; set; }
        public virtual string CHK_UPDATEDBY { get; set; }
        public virtual int CHK_RECORDVERSION { get; set; }
    }
}