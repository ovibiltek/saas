using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSPCRNTPSBINVAMNTVIEW
    {
        public virtual long SPI_ID { get; set; }
        public virtual int SPI_TASK { get; set; }
        public virtual int SPI_LINE { get; set; }
        public virtual string SPI_TSKDESC { get; set; }
        public virtual string SPI_TSKSTATUS { get; set; }
        public virtual string SPI_TSKSTATUSDESC { get; set; }
        public virtual DateTime SPI_TSKREQUESTED { get; set; }
        public virtual DateTime? SPI_TSKCOMPLETED { get; set; }
        public virtual DateTime? SPI_TSKCLOSED { get; set; }
        public virtual DateTime? SPI_INVSTATUSK { get; set; }
        public virtual string SPI_TSKORG { get; set; }
        public virtual string SPI_TSKCUSTOMER { get; set; }
        public virtual string SPI_TSKCUSDESC { get; set; }
        public virtual string SPI_BRANCH { get; set; }
        public virtual string SPI_BRANCHDESC { get; set; }
        public virtual string SPI_TSKCATEGORY { get; set; }
        public virtual string SPI_TSKCATEGORYDESC { get; set; }
        public virtual string SPI_CREATEDBY { get; set; }
        public virtual DateTime SPI_CREATED { get; set; }
        public virtual DateTime? SPI_DATECOMPLETED { get; set; }
        public virtual string SPI_SUPPLIER { get; set; }
        public virtual string SPI_SUPDESC { get; set; }
        public virtual int? SPI_INVID { get; set; }
        public virtual DateTime? SPI_INVCREATED { get; set; }
        public virtual string SPI_INVNO { get; set; }
        public virtual DateTime? SPI_INVDATE { get; set; }
        public virtual string SPI_INVSTATUS { get; set; }
        public virtual string SPI_INVSTATUSDESC { get; set; }
        public virtual decimal? SPI_TOTAL { get; set; }
    }
}

