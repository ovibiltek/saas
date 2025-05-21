using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMREPORTING
    {
        public virtual int REP_ID { get; set; }
        public virtual string REP_DESC { get; set; }
        public virtual string REP_ORG { get; set; }
        public virtual string REP_ORGDESC { get; set; }
        public virtual string REP_TYPE { get; set; }
        public virtual string REP_TYPEENTITY { get; set; }
        public virtual string REP_TYPEDESC { get; set; }
        public virtual string REP_STATUS { get; set; }
        public virtual string REP_STATUSENTITY { get; set; }
        public virtual string REP_STATUSDESC { get; set; }
        public virtual int REP_TSK { get; set; }
        public virtual string REP_TSKDESC { get; set; }
        public virtual DateTime REP_CREATED { get; set; }
        public virtual string REP_CREATEDBY { get; set; }
        public virtual DateTime? REP_UPDATED { get; set; }
        public virtual string REP_UPDATEDBY { get; set; }
        public virtual int REP_RECORDVERSION { get; set; }
    }
}