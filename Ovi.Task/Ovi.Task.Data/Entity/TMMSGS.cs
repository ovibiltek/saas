namespace Ovi.Task.Data.Entity
{
    public class TMMSGS
    {
        public virtual long MSG_ID { get; set; }

        public virtual string MSG_CODE { get; set; }

        public virtual string MSG_LANG { get; set; }

        public virtual string MSG_TEXT { get; set; }

        public virtual int MSG_RECORDVERSION { get; set; }
    }
}