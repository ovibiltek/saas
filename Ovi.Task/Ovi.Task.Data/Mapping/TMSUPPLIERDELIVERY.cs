using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;
namespace Ovi.Task.Data.Maps { 
    public sealed class TMSUPPLIERDELIVERY_MAP : ClassMap<TMSUPPLIERDELIVERY> 
    { 
        public TMSUPPLIERDELIVERY_MAP() 
        { 
            Id(x => x.DEL_ID);
            Map(x => x.DEL_SUPPLIER);
            Map(x => x.DEL_TYPE);
            Map(x => x.DEL_TYPEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('DELIVERY',DEL_TYPE,:SessionContext.Language)");
            Map(x => x.DEL_USER);
            Map(x => x.DEL_USERDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = DEL_USER)");
            Map(x => x.DEL_QTY); 
            Map(x => x.DEL_UOM);
            Map(x => x.DEL_UOMDESC).ReadOnly().Formula("dbo.GetDesc('TMUOMS','UOM_DESC', DEL_UOM, (SELECT u.UOM_DESC FROM TMUOMS u WHERE u.UOM_CODE = DEL_UOM),:SessionContext.Language)");
            Map(x => x.DEL_DATE); 
            Map(x => x.DEL_CREATED); 
            Map(x => x.DEL_CREATEDBY); 
            Map(x => x.DEL_UPDATED); 
            Map(x => x.DEL_UPDATEDBY); 
            Map(x => x.DEL_RECORDVERSION); 
        } 
    } 
}