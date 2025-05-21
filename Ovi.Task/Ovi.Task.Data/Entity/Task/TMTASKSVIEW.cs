namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKSVIEW
    {
        public virtual long TSK_ID { get; set; }

        public virtual string TSK_PRIORITY { get; set; }

        public virtual string TSK_PRIORITYDESC { get; set; }

        public virtual string TSK_STATUS { get; set; }

        public virtual string TSK_STATUSDESC { get; set; }

        public virtual string TSK_DEPARTMENT { get; set; }

        public virtual string TSK_USER { get; set; }

        public virtual int TSK_YEAR { get; set; }
    }
}