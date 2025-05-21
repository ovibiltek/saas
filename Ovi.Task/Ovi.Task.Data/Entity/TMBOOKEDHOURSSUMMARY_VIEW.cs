namespace Ovi.Task.Data.Entity
{
    public class TMBOOKEDHOURSSUMMARY_VIEW
    {
        public virtual long BOO_ID { get; set; }

        public virtual long BOO_TASK { get; set; }

        public virtual string BOO_USER { get; set; }

        public virtual char BOO_TYPE { get; set; }

        public virtual decimal BOO_HOURS { get; set; }
    }
}