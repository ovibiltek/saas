using System;

namespace Ovi.Task.Data.Entity
{
    public class TMINVOICELINESVIEW
    {
        public virtual long TSA_ID { get; set; }

        public virtual long TSA_TASK { get; set; }

        public virtual string TSA_TSKSHORTDESC { get; set; }

        public virtual int TSA_LINE { get; set; }

        public virtual string TSA_DESC { get; set; }

        public virtual DateTime TSA_TSKREQUESTED { get; set; }

        public virtual DateTime? TSA_TSKCOMPLETED { get; set; }

        public virtual string TSA_TSKORGANIZATION { get; set; }

        public virtual string TSA_TSKCUSTOMER { get; set; }

        public virtual string TSA_TSKCUSTOMERDESC { get; set; }

        public virtual string TSA_TSKBRANCH { get; set; }

        public virtual string TSA_TSKBRANCHDESC { get; set; }

        public virtual string TSA_TSKCATEGORY { get; set; }

        public virtual string TSA_TSKCATEGORYDESC { get; set; }

        public virtual string TSA_CREATEDBY { get; set; }

        public virtual DateTime TSA_CREATED { get; set; }

        public virtual string TSA_TRADE { get; set; }

        public virtual DateTime? TSA_DATECOMPLETED { get; set; }

        public virtual DateTime? TSA_TSKCLOSED { get; set; }

        public virtual string TSA_MOBILENOTE { get; set; }

        public virtual string TSA_SUPPLIER { get; set; }

        public virtual int? TSA_TSKDOCCOUNT { get; set; }

        public virtual int? TSA_TSKCMNTCOUNT { get; set; }

        public virtual string TSA_TSKIPP { get; set; }

        public virtual decimal? TSA_MSCTOTAL { get; set; }

        public virtual decimal? TSA_MSCQTY { get; set; }

        public virtual long? TSA_INVOICE { get; set; }

    }
}