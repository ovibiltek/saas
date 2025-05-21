using System;

namespace Ovi.Task.Data.Entity.Supervision
{
    public class TMSUPERVISIONQUESTIONS
    {
        public virtual long SVQ_ID { get; set; }
        public virtual int SVQ_ORDER { get; set; }
        public virtual string SVQ_QUE { get; set; }
        public virtual string SVQ_CATEGORY { get; set; }
        public virtual int SVQ_WEIGHT { get; set; }
        public virtual DateTime SVQ_CREATED { get; set; }
        public virtual string SVQ_CREATEDBY { get; set; }
        public virtual DateTime? SVQ_UPDATED { get; set; }
        public virtual string SVQ_UPDATEDBY { get; set; }
        public virtual int SVQ_RECORDVERSION { get; set; }
    }
}