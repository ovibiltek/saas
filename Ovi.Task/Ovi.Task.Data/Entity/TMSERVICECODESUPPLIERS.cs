using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSERVICECODESUPPLIERS
    {
        public virtual int SRS_ID { get; set; }
        public virtual  int SRS_SERVICECODE { get; set; }
        public virtual string SRS_SUPPLIERCODE { get; set; }
        public virtual DateTime SRS_CREATED { get; set; }
        public virtual string SRS_CREATEDBY { get; set; }
    }
}
