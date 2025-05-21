using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.DAO
{
    public class QuotationModel
    {
        public TMQUOTATIONS Quotation { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}