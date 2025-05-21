using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSTOCK_MAP : ClassMap<TMSTOCK>
    {
        public TMSTOCK_MAP()
        {
            CompositeId().KeyProperty(x => x.STK_WAREHOUSE).KeyProperty(x => x.STK_PART).KeyProperty(x => x.STK_BIN);
            Map(x => x.STK_AVGPRICE);
            Map(x => x.STK_QTY);
            Map(x => x.STK_BINDESC).ReadOnly().Formula("(SELECT b.BIN_DESC FROM TMBINS b WHERE b.BIN_CODE = STK_BIN AND b.BIN_WAREHOUSE = STK_WAREHOUSE)");
            Map(x => x.STK_SQLIDENTITY).Generated.Insert();
            Map(x => x.STK_CREATED);
            Map(x => x.STK_CREATEDBY);
            Map(x => x.STK_UPDATED);
            Map(x => x.STK_UPDATEDBY);
            Map(x => x.STK_RECORDVERSION).Default("0");
        }
    }
}