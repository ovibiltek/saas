using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCOMMENTS
    {
        public virtual long CMN_ID { get; set; }

        public virtual string CMN_SUBJECT { get; set; }

        public virtual string CMN_SOURCE { get; set; }

        public virtual string CMN_ORGANIZATION { get; set; }

        public virtual string CMN_TEXT { get; set; }

        public virtual char CMN_VISIBLETOCUSTOMER { get; set; }

        public virtual char CMN_VISIBLETOSUPPLIER { get; set; }

        public virtual DateTime CMN_CREATED { get; set; }

        public virtual string CMN_CREATEDBY { get; set; }

        public virtual DateTime? CMN_UPDATED { get; set; }

        public virtual string CMN_UPDATEDBY { get; set; }

        public virtual int CMN_RECORDVERSION { get; set; }

        public virtual DateTime? CMN_DATESEEN { get; set; }

        public virtual string CMN_SEENBY { get; set; }
    }
}