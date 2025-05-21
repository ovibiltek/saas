using FluentNHibernate.Mapping;using Ovi.Task.Data.Entity;namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSTOCKVIEW_MAP : ClassMap<TMSTOCKVIEW>
    {
        public TMSTOCKVIEW_MAP()
        {
            Id(x => x.STK_ID);
            Map(x => x.STK_PART);
            Map(x => x.STK_PARTCODE);
            Map(x => x.STK_PARTDESC);
            Map(x => x.STK_PARTUOM);
            Map(x => x.STK_WAREHOUSE);
            Map(x => x.STK_WAREHOUSEDESC);
            Map(x => x.STK_BIN);
            Map(x => x.STK_BINDESC);
            Map(x => x.STK_QTY);
            Map(x => x.STK_AVGPRICE);
        }
    }}