using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.DAO
{
    public class ProgressPaymentModel
    {
        public TMPROGRESSPAYMENTS ProgressPayment { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}