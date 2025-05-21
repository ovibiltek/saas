using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TMPSPINVOICEDETAILSVIEW_MAP : ClassMap<TMPSPINVOICEDETAILSVIEW>
    {
        public TMPSPINVOICEDETAILSVIEW_MAP()
        {
            Id(x => x.PSP_CODE);
            Map(x => x.PSP_DESC);
            Map(x => x.PSP_TOTAL);
            Map(x => x.PSP_CUSTOMER);
            Map(x => x.PSP_CUSCONTACTPERSON);
            Map(x => x.PSP_TSKCOMPLETED);
            Map(x => x.PSP_COMPLETEDMY);
            Map(x => x.PSP_CREATEDBY);
            Map(x => x.PSP_CREATED);
            Map(x => x.PSP_LASTSIVDATE);
            Map(x => x.PSP_SALSALESTOTAL);
            Map(x => x.PSP_SALRETURNTOTAL);
            Map(x => x.PSP_SIVTOTAL);
            Map(x => x.PSP_LASTSIVID);
            Map(x => x.PSP_LASTINVNO);
            Map(x => x.PSP_LASTSIVTYPE);
            Map(x => x.PSP_SIVCOUNT);
        }
    }
}