using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONLINEDETAILSVIEW_MAP : ClassMap<TMQUOTATIONLINEDETAILSVIEW>
    {
        public TMQUOTATIONLINEDETAILSVIEW_MAP()
        {
            Id(x => x.QLN_ID); 
            Map(x => x.QLN_QUOTATION); 
            Map(x => x.QLN_QUODESC); 
            Map(x => x.QLN_QUOORG); 
            Map(x => x.QLN_QUOCUSTOMER); 
            Map(x => x.QLN_QUOTYPE); 
            Map(x => x.QLN_QUOSUPPLIER); 
            Map(x => x.QLN_QUOSTATUS); 
            Map(x => x.QLN_STADESC); 
            Map(x => x.QLN_QUOTASK); 
            Map(x => x.QLN_TSKCATEGORY); 
            Map(x => x.QLN_CATDESC); 
            Map(x => x.QLN_TYPE); 
            Map(x => x.QLN_SUBTYPE); 
            Map(x => x.QLN_CODE); 
            Map(x => x.QLN_DESCRIPTION); 
            Map(x => x.QLN_QUANTITY); 
            Map(x => x.QLN_UOM); 
            Map(x => x.QLN_UNITPURCHASEPRICE); 
            Map(x => x.QLN_PURCHASECURR); 
            Map(x => x.QLN_UNITSALESPRICE); 
            Map(x => x.QLN_CURR);
        }
    }
}