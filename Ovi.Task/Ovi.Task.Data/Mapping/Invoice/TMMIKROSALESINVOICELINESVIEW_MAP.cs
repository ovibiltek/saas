using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Invoice;

namespace Ovi.Task.Data.Mapping.Invoice
{
    public sealed class TMMIKROSALESINVOICELINESVIEW_MAP : ClassMap<TMMIKROSALESINVOICELINESVIEW>
    {
        public TMMIKROSALESINVOICELINESVIEW_MAP()
        {
            Id(x => x.INV_ROWID); 
            Map(x => x.INV_CODE); 
            Map(x => x.INV_TASK); 
            Map(x => x.INV_TOTAL);
            Map(x => x.INV_TSKCATEGORY); 
            Map(x => x.INV_TSKDEPARTMENT); 
            Map(x => x.INV_TSKCUSTOMER); 
            Map(x => x.INV_TSKBRANCH); 
            Map(x => x.INV_TSKCATEGORYGROUP);
            Map(x => x.INV_MMIKRO);

        }
    }
}