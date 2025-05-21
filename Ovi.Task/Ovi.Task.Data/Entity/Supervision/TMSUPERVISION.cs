using System;

namespace Ovi.Task.Data.Entity.Supervision
{
    public class TMSUPERVISION
    {
        public virtual long SPV_ID { get; set; }
        public virtual string SPV_DESC { get; set; }
        public virtual string SPV_ORG { get; set; }
        public virtual string SPV_ORGDESC { get; set; }
        public virtual string SPV_TYPEENTITY { get; set; }
        public virtual string SPV_TYPE { get; set; }
        public virtual string SPV_TYPEDESC { get; set; }
        public virtual string SPV_STATUSENTITY { get; set; }
        public virtual string SPV_STATUS { get; set; }
        public virtual string SPV_PSTATUS { get; set; }
        public virtual string SPV_STATUSDESC { get; set; }
        public virtual string SPV_REQUESTEDBY { get; set; }
        public virtual long? SPV_TASK { get; set; }
        public virtual int? SPV_ACTIVITY { get; set; }
        public virtual string SPV_TASKSHORTDESC { get; set; }
        public virtual string SPV_CUSTOMER { get; set; }
        public virtual string SPV_CUSTOMERDESC { get; set; }
        public virtual string SPV_CUSTOMERGROUP { get; set; }
        public virtual string SPV_BRANCH { get; set; }
        public virtual string SPV_BRANCHDESC { get; set; }
        public virtual string SPV_CATEGORY { get; set; }
        public virtual string SPV_CATEGORYDESC { get; set; }
        public virtual string SPV_SUPERVISOR { get; set; }
        public virtual string SPV_CANCELLATIONREASON { get; set; }
        public virtual string SPV_CANCELLATIONREASONDESC { get; set; }
        public virtual string SPV_CREATEDBY { get; set; }
        public virtual DateTime SPV_CREATED { get; set; }
        public virtual string SPV_UPDATEDBY { get; set; }
        public virtual DateTime? SPV_UPDATED { get; set;}
        public virtual int? SPV_RECORDVERSION { get; set; }

    }
}