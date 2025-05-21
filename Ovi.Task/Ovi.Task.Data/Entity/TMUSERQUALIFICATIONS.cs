using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERQUALIFICATIONS
    {
        public virtual int USQ_ID { get; set; }

        public virtual string USQ_QUALIFICATION { get; set; }

        public virtual string USQ_QUALIFICATIONDESC { get; set; }

        public virtual string USQ_USRCODE { get; set; }

        public virtual DateTime USQ_STARTDATE { get; set; }

        public virtual DateTime USQ_EXPIRATIONDATE { get; set; }

        public virtual string USQ_NOTE { get; set; }

        public virtual char USQ_TEMPORARILYDISQUALIFIED { get; set; }

        public virtual DateTime USQ_CREATED { get; set; }

        public virtual string USQ_CREATEDBY { get; set; }

        public virtual DateTime? USQ_UPDATED { get; set; }

        public virtual string USQ_UPDATEDBY { get; set; }

        public virtual int USQ_RECORDVERSION { get; set; }
    }
}