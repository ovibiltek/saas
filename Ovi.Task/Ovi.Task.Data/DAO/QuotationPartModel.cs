using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.DAO
{
    public class QuotationPartModel
    {
        public TMQUOTATIONPART Part { get; set; }

        public string[] Values { get; set; }

    }
}