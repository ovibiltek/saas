using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.DAO
{
    public class SalesInvoiceModel
    {
        public TMSALESINVOICES SalesInvoice { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}