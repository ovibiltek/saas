using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class CustomerModel
    {
        public TMCUSTOMERS Customer { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }


    }
}