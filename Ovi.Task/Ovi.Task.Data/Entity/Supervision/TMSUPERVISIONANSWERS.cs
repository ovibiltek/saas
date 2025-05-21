using System;

namespace Ovi.Task.Data.Entity.Supervision
{
    public class TMSUPERVISIONANSWERS
    {
        public virtual long SVA_ID { get; set; }
        public virtual long SVA_QUESTION { get; set; }
        public virtual string SVA_ANSWER { get; set; }
        public virtual int SVA_SCORE { get; set; }
        public virtual DateTime SVA_CREATED { get; set; }
        public virtual string SVA_CREATEDBY { get; set; }
        public virtual DateTime? SVA_UPDATED { get; set; }
        public virtual string SVA_UPDATEDBY { get; set; }
        public virtual int SVA_RECORDVERSION { get; set; }
    }
}