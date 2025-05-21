using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class ContractEquipManPricesModel
    {
        public TMCONTRACTEQUIPMANPRICES EquipManPrice { get; set; }

        public string[] Values { get; set; }
    }
}