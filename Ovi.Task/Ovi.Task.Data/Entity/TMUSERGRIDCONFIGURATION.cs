namespace Ovi.Task.Data.Entity
{
    public class TMUSERGRIDCONFIGURATION
    {
        public virtual long UGC_ID { get; set; }

        public virtual string UGC_GRID { get; set; }

        public virtual int UGC_ORDER { get; set; }

        public virtual string UGC_FIELD { get; set; }

        public virtual char UGC_HIDDEN { get; set; }

        public virtual int UGC_WIDTH { get; set; }

        public virtual string UGC_USER { get; set; }

        public virtual int UGC_RECORDVERSION { get; set; }
    }
}