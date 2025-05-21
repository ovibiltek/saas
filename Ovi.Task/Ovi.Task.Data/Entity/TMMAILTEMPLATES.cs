namespace Ovi.Task.Data.Entity
{
    public class TMMAILTEMPLATES
    {
        public virtual int TMP_ID { get; set; }

        public virtual int TMP_TMPID { get; set; }

        public virtual string TMP_DESCRIPTION { get; set; }

        public virtual string TMP_TRIGGER { get; set; }

        public virtual string TMP_TO { get; set; }

        public virtual string TMP_CC { get; set; }

        public virtual string TMP_BCC { get; set; }

        public virtual string TMP_CONNECTION { get; set; }

        public virtual string TMP_HTML { get; set; }

        public virtual char TMP_ACTIVE { get; set; }
    }
}