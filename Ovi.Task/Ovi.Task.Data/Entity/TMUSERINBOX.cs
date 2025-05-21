namespace Ovi.Task.Data.Entity
{
    public class TMUSERINBOX
    {
        public virtual long UIN_ID { get; set; }

        public virtual string UIN_USER { get; set; }

        public virtual string UIN_INBOX { get; set; }

        public virtual int UIN_ORDER { get; set; }

        public virtual char UIN_VISIBLE { get; set; }

        public virtual char UIN_SHOWNONZERO { get; set; }
    }
}