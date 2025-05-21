namespace Ovi.Task.Data.Entity
{
    public class TMTSKCNTS
    {
        public virtual int TSK_ID { get; set; }

        public virtual string TSK_ASSIGNEDTO { get; set; }

        public virtual string TSK_STATUS { get; set; }

        public virtual string TSK_STATUSDESC { get; set; }

        public virtual int TSK_CNT { get; set; }
    }
}