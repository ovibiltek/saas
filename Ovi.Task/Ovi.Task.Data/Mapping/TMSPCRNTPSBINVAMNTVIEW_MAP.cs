using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSPCRNTPSBINVAMNTVIEW_MAP : ClassMap<TMSPCRNTPSBINVAMNTVIEW>
    {
        public TMSPCRNTPSBINVAMNTVIEW_MAP()
        {
            Id(x => x.SPI_ID);
            Map(x => x.SPI_TASK);
            Map(x => x.SPI_LINE);
            Map(x => x.SPI_TSKDESC);
            Map(x => x.SPI_TSKSTATUS);
            Map(x => x.SPI_TSKSTATUSDESC);
            Map(x => x.SPI_TSKREQUESTED);
            Map(x => x.SPI_TSKCOMPLETED);
            Map(x => x.SPI_TSKCLOSED);
            Map(x => x.SPI_INVSTATUSK);
            Map(x => x.SPI_TSKORG);
            Map(x => x.SPI_TSKCUSTOMER);
            Map(x => x.SPI_TSKCUSDESC);
            Map(x => x.SPI_BRANCH);
            Map(x => x.SPI_BRANCHDESC);
            Map(x => x.SPI_TSKCATEGORY);
            Map(x => x.SPI_TSKCATEGORYDESC);
            Map(x => x.SPI_CREATEDBY);
            Map(x => x.SPI_CREATED);
            Map(x => x.SPI_DATECOMPLETED);
            Map(x => x.SPI_SUPPLIER);
            Map(x => x.SPI_SUPDESC);
            Map(x => x.SPI_INVID);
            Map(x => x.SPI_INVCREATED);
            Map(x => x.SPI_INVNO);
            Map(x => x.SPI_INVDATE);
            Map(x => x.SPI_INVSTATUS);
            Map(x => x.SPI_INVSTATUSDESC);
            Map(x => x.SPI_TOTAL);
        }
    }
}