namespace Ovi.Task.Data.Entity
{
    public class TMACTUALBOOKEDHOURSBYDATE
    {
        public virtual long BOO_ID { get; set; }

        public virtual string BOO_DEPARTMENT { get; set; }

        public virtual string BOO_USER { get; set; }

        public virtual int BOO_YEAR { get; set; }

        public virtual int BOO_MONTH { get; set; }

        public virtual decimal BOO_CALCHOURS { get; set; }

        public virtual string BOO_TYPE { get; set; }
    }
}