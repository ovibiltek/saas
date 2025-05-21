namespace Ovi.Task.Data.Entity
{
    public class TMCHKSWITCH
    {
        public virtual long CHS_ID { get; set; }

        public virtual long CHS_CHKID { get; set; }

        public virtual long CHS_TASK { get; set; }

        public virtual string CHS_USER { get; set; }

        public virtual char CHS_VALUE { get; set; }

        public virtual int CHS_RECORDVERSION { get; set; }
    }
}