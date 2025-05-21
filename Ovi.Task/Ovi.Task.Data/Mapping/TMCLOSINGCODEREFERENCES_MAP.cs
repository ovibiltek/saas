using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;
namespace Ovi.Task.Data.Maps { 
    public sealed class TMCLOSINGCODEREFERENCES_MAP : ClassMap<TMCLOSINGCODEREFERENCES> { 
        public TMCLOSINGCODEREFERENCES_MAP() { 
            Id(x => x.CRF_ID); 
            Map(x => x.CRF_CUSTOMER); 
            Map(x => x.CRF_TYPE); 
            Map(x => x.CRF_CODE); 
            Map(x => x.CRF_REFERENCE); 
        } 
    } 
}