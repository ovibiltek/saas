using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class ContractModel
    {
        public TMCONTRACTS Contract { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}