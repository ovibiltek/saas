using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMREQUISITIONTOPOVIEW_MAP : ClassMap<TMREQUISITIONTOPOVIEW>
    {
        public TMREQUISITIONTOPOVIEW_MAP()
        {
            Id(x => x.PQC_ID);
            Map(x => x.PQC_HID);
            Map(x => x.PQC_HDESC);
            Map(x => x.PQC_HORG);
            Map(x => x.PQC_HTYPEENTITY);
            Map(x => x.PQC_HTYPE);
            Map(x => x.PQC_HSTATUS);
            Map(x => x.PQC_HSTATUSDESC);
            Map(x => x.PQC_LLINE);
            Map(x => x.PQC_TOTALPRICE);
            Map(x => x.PQC_HSTATUSENTITY);
            Map(x => x.PQC_HADR);
            Map(x => x.PQC_HQUOTATION);
            Map(x => x.PQC_HTASK);
            Map(x => x.PQC_HTASKACTIVITY);
            Map(x => x.PQC_HSUPPLIER);
            Map(x => x.PQC_HSUPDESC);
            Map(x => x.PQC_HWAREHOUSE);
            Map(x => x.PQC_HREQUESTEDBY);
            Map(x => x.PQC_LPARTCODE);
            Map(x => x.PQC_LPARTDESC);
            Map(x => x.PQC_LTYPE);
            Map(x => x.PQC_LTYPEDESC);
            Map(x => x.PQC_LPARTNOTE);
            Map(x => x.PQC_LUOM);
            Map(x => x.PQC_LREQUOM);
            Map(x => x.PQC_LQUANTITY);
            Map(x => x.PQC_LUNITPRICE);
            Map(x => x.PQC_LCURRENCY);
            Map(x => x.PQC_LVATTAX);
            Map(x => x.PQC_LTAX2);
            Map(x => x.PQC_CUSTOMERCODE);
            Map(x => x.PQC_REGION);
        }
    }
}
