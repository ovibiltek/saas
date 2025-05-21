using System;

namespace Ovi.Task.Data.Entity
{
    public class TMMAILS
    {
        public virtual long MA_ID { get; set; }

        public virtual string MA_SUBJECT { get; set; }

        public virtual string MA_SENDER { get; set; }

        public virtual string MA_TOMAIL { get; set; }

        public virtual string MA_CC { get; set; }

        public virtual string MA_BCC { get; set; }

        public virtual string MA_REPLYTO { get; set; }

        public virtual string MA_ATTACHMENTS { get; set; }

        public virtual DateTime? MA_CREATED { get; set; }

        public virtual string MA_ERROR { get; set; }

        public virtual int MA_TEMPLATEID { get; set; }

        public virtual char? MA_READ { get; set; }

        public virtual string MA_USER { get; set; }

        public virtual string MA_TABLENAME { get; set; }

        public virtual string MA_PAGE { get; set; }

        public virtual string MA_TABLEKEY { get; set; }

        public virtual string MA_ENTITY { get; set; }

        public virtual string MA_GUID { get; set; }

        public virtual char? MA_DOCS { get; set; }

        public virtual DateTime? MA_UPDATED { get; set; }
    }
}