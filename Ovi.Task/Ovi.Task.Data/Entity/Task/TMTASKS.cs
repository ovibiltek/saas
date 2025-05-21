using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKS : ICloneable
    {
        public virtual long TSK_ID { get; set; }

        public virtual string TSK_ORGANIZATION { get; set; }

        public virtual string TSK_DEPARTMENT { get; set; }

        public virtual int? TSK_PROJECT { get; set; }

        public virtual string TSK_LOCATION { get; set; }

        public virtual long? TSK_EQUIPMENT { get; set; }

        public virtual char TSK_EQUIPMENTREQUIRED { get; set; }

        public virtual string TSK_CATEGORY { get; set; }

        public virtual string TSK_TASKTYPE { get; set; }

        public virtual string TSK_SHORTDESC { get; set; }

        public virtual string TSK_STATUS { get; set; }

        public virtual string TSK_PRIORITY { get; set; }

        public virtual string TSK_TYPE { get; set; }

        public virtual string TSK_TYPEENTITY { get; set; }

        public virtual long TSK_PROGRESS { get; set; }

        public virtual char TSK_HIDDEN { get; set; }

        public virtual string TSK_FOLLOWED { get; set; }

        public virtual string TSK_REQUESTEDBY { get; set; }

        public virtual DateTime? TSK_REQUESTED { get; set; }

        public virtual int? TSK_RATING { get; set; }

        public virtual string TSK_RATINGCOMMENTS { get; set; }

        public virtual DateTime? TSK_DEADLINE { get; set; }

        public virtual DateTime? TSK_COMPLETED { get; set; }

        public virtual DateTime? TSK_CLOSED { get; set; }

        public virtual char TSK_CHK01 { get; set; }

        public virtual char TSK_CHK02 { get; set; }

        public virtual char TSK_CHK03 { get; set; }

        public virtual char TSK_CHK04 { get; set; }

        public virtual char TSK_CHK05 { get; set; }

        public virtual string TSK_CREATEDBY { get; set; }

        public virtual DateTime TSK_CREATED { get; set; }

        public virtual string TSK_UPDATEDBY { get; set; }

        public virtual DateTime? TSK_UPDATED { get; set; }

        public virtual int TSK_RECORDVERSION { get; set; }

        public virtual string TSK_CUSTOMER { get; set; }

        public virtual string TSK_BRANCH { get; set; }

        public virtual string TSK_HOLDREASON { get; set; }

        public virtual DateTime? TSK_HOLDDATE { get; set; }

        public virtual long? TSK_PSPCODE { get; set; }

        public virtual string TSK_PRPCODE { get; set; }

        public virtual string TSK_PTASK { get; set; }

        public virtual string TSK_REFERENCE { get; set; }

        public virtual string TSK_CANCELLATIONREASON { get; set; }

        public virtual string TSK_CANCELLATIONDESC { get; set; }

        public virtual string TSK_NOTE { get; set; }

        public virtual int? TSK_CONTRACTID { get; set; }


        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}