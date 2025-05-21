using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSTOCKBYWAREHOUSEVIEW_MAP : ClassMap<TMSTOCKBYWAREHOUSEVIEW>
    {
        public TMSTOCKBYWAREHOUSEVIEW_MAP()
        {
            CompositeId().KeyProperty(x => x.STK_PART).KeyProperty(x => x.STK_WAREHOUSE);
            Map(x => x.STK_PARTCODE);
            Map(x => x.STK_PARTDESC);
            Map(x => x.STK_PARTORG);
            Map(x => x.STK_PARTUOM);
            Map(x => x.STK_PARTUOMDESC).ReadOnly().Formula("dbo.GetDesc('TMUOMS','UOM_DESC', STK_PARTUOM, (SELECT u.UOM_DESC FROM TMUOMS u WHERE u.UOM_CODE = STK_PARTUOM),:SessionContext.Language)");
            Map(x => x.STK_WAREHOUSEDESC).Formula("dbo.GetDesc('TMWAREHOUSES','WAH_DESC', STK_WAREHOUSE, (SELECT w.WAH_DESC FROM TMWAREHOUSES w WHERE w.WAH_CODE = STK_WAREHOUSE), :SessionContext.Language)");
            Map(x => x.STK_WHQTY);
            Map(x => x.STK_PARTAVGPRICE);
        }
    }
}