using System;

namespace Ovi.Task.Data.Entity
{
    public class TMDOCSMETA
    {
        public virtual long DOC_ID { get; set; }

        public virtual string DOC_OFN { get; set; }

        public virtual string DOC_PATH { get; set; }

        public virtual string DOC_GUID { get; set; }

        public virtual string DOC_TYPE { get; set; }

        public virtual string DOC_TYPEDESC { get; set; }

        public virtual string DOC_SUBJECT { get; set; }

        public virtual string DOC_SOURCE { get; set; }

        public virtual long? DOC_LINK { get; set; }

        public virtual long DOC_SIZE { get; set; }

        public virtual string DOC_CONTENTTYPE { get; set; }

        public virtual DateTime DOC_CREATED { get; set; }

        public virtual string DOC_CREATEDBY { get; set; }

        public virtual string DOC_CREATEDBYDESC { get; set; }

        public virtual int DOC_RECORDVERSION { get; set; }

        public virtual string DOC_CHECK { get; set; }

    }
}