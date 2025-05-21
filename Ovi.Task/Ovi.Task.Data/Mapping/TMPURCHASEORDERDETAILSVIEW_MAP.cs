using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERDETAILSVIEW_MAP : ClassMap<TMPURCHASEORDERDETAILSVIEW>
    {

        public TMPURCHASEORDERDETAILSVIEW_MAP()
        {
            Id(x => x.POD_ID);
            Map(x => x.POD_PORID);
            Map(x => x.POD_PRQID);
            Map(x => x.POD_PRQSTA);
            Map(x => x.POD_PART);
            Map(x => x.POD_PARTDESC);
            Map(x => x.POD_PARTUOM);
            Map(x => x.POD_PORSTA);
            Map(x => x.POD_CARGOCOMPANY);
            Map(x => x.POD_CARGODATE);
            Map(x => x.POD_CARGONUMBER);
            Map(x => x.POD_TOTALORDERQTY);
            Map(x => x.POD_TOTALENTRY);
            Map(x => x.POD_TOTALRETURN);
            Map(x => x.POD_WAITINGQUAN);

            Map(x => x.POD_TASK);

        } 
    }
}
