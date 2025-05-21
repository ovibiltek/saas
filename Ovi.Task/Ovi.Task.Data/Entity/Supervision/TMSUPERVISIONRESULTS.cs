using System;

namespace Ovi.Task.Data.Entity.Supervision
{
    public class TMSUPERVISIONRESULTS
    {
        public virtual int SVR_ID { get; set; }
        public virtual long SVR_SUPERVISION { get; set; }
        public virtual long SVR_QUESTION { get; set; }
        public virtual string SVR_QUESTIONDESC { get; set; }
        public virtual long? SVR_ANSWER { get; set; }
        public virtual string SVR_NOTE { get; set; }
        public virtual DateTime SVR_CREATED { get; set; }
        public virtual string SVR_CREATEDBY { get; set; }
        public virtual DateTime? SVR_UPDATED { get; set; }
        public virtual string SVR_UPDATEDBY { get; set; }
        public virtual int SVR_RECORDVERSION { get; set; }
    }
}