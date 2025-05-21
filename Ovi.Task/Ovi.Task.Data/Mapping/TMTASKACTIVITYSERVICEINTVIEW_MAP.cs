using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;
namespace Ovi.Task.Data.Maps { 
    public sealed class TMTASKACTIVITYSERVICEINTVIEW_MAP : ClassMap<TMTASKACTIVITYSERVICEINTVIEW> 
    { 
        public TMTASKACTIVITYSERVICEINTVIEW_MAP() {
            Id(x => x.TPR_ID); 
            Map(x => x.TPR_TASK); 
            Map(x => x.TPR_QTY); 
            Map(x => x.TPR_UNITSALESPRICE); 
            Map(x => x.TPR_UOM); 
            Map(x => x.TPR_CURR); 
            Map(x => x.TPR_CUSTOMER); 
            Map(x => x.TPR_SERVICECODEREF); 
        } 
    } 
}