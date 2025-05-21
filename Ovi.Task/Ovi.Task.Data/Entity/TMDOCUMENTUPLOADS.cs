using System;

namespace Ovi.Task.Data.Entity{
    public class TMDOCUMENTUPLOADS
    {
        public virtual int DUP_ID { get; set; }

        public virtual string DUP_SUBJECT { get; set; }

        public virtual string DUP_SOURCE { get; set; }

        public virtual string DUP_SYSTEM { get; set; }

        public virtual int DUP_COUNT { get; set; }

        public virtual long DUP_SIZE { get; set; }

        public virtual DateTime DUP_UPLOADED { get; set; }

        public virtual string DUP_UPLOADEDBY { get; set; }
    }
}