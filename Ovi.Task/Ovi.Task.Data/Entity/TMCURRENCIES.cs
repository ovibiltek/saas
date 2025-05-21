using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCURRENCIES
    {
        public virtual string CUR_CODE { get; set; }

        public virtual string CUR_DESC { get; set; }

        public virtual char CUR_ACTIVE { get; set; }

        public virtual DateTime CUR_CREATED { get; set; }

        public virtual DateTime? CUR_UPDATED { get; set; }

        public virtual string CUR_CREATEDBY { get; set; }

        public virtual string CUR_UPDATEDBY { get; set; }

        public virtual int CUR_SQLIDENTITY { get; set; }

        public virtual int CUR_RECORDVERSION { get; set; }
    }
}