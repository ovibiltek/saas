using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;
namespace Ovi.Task.Data.Maps { 
    public sealed class TMSUPPLIERVEHICLES_MAP : ClassMap<TMSUPPLIERVEHICLES> 
    { 
        public TMSUPPLIERVEHICLES_MAP() 
        { 
            Id(x => x.SVH_ID); 
            Map(x => x.SVH_SUPPLIER); 
            Map(x => x.SVH_BRAND);
            Map(x => x.SVH_BRANDDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('VEHBRAND',SVH_BRAND,:SessionContext.Language)");
            Map(x => x.SVH_MODEL);
            Map(x => x.SVH_MODELDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('VEHMODEL',SVH_MODEL,:SessionContext.Language)");
            Map(x => x.SVH_LICENSEPLATE); 
            Map(x => x.SVH_YEAR); 
            Map(x => x.SVH_COLOR);
            Map(x => x.SVH_COLORDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('COLOR',SVH_COLOR,:SessionContext.Language)");
            Map(x => x.SVH_VEHICLEWRAP);
            Map(x => x.SVH_VEHICLEWRAPDATE);
            Map(x => x.SVH_OWNERSHIP);
            Map(x => x.SVH_OWNERSHIPDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('OWNERSHIP',SVH_OWNERSHIP,:SessionContext.Language)");
            Map(x => x.SVH_CREATED); 
            Map(x => x.SVH_CREATEDBY); 
            Map(x => x.SVH_UPDATED); 
            Map(x => x.SVH_UPDATEDBY); 
            Map(x => x.SVH_RECORDVERSION); 
        } 
    } 
}