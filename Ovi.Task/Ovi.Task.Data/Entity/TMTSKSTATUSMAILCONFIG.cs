using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTSKSTATUSMAILCONFIG
    {
        public virtual long TSM_ID { get; set; }

        public virtual string TSM_CUSTOMER { get; set; }

        public virtual string TSM_STATUS { get; set; }

        public virtual string TSM_STATUSENTITY { get; set; }

        public virtual string TSM_INCCATEGORIES { get; set; }

        public virtual string TSM_EXCCATEGORIES { get; set; }

        public virtual char TSM_SENDATTACH { get; set; }

        public virtual string TSM_MAILTO { get; set; }

        public virtual char TSM_BRNCSR { get; set; }

        public virtual char TSM_BRNREGRESPONSIBLE { get; set; }

        public virtual char TSM_BRNAUTHORIZED { get; set; }

        public virtual char TSM_CUSPM { get; set; }

        public virtual string TSM_CREATEDBY { get; set; }

        public virtual DateTime TSM_CREATED { get; set; }

        public virtual string TSM_UPDATEDBY { get; set; }

        public virtual DateTime? TSM_UPDATED { get; set; }

        public virtual int TSM_RECORDVERSION { get; set; }
    }
}