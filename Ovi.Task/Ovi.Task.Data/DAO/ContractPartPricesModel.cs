using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class ContractPartPricesModel
    {
        public TMCONTRACTPARTPRICES PartPrice { get; set; }

        public string[] Values { get; set; }
    }
}