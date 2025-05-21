using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{ 
    public class EquipmentModel
    {
        public TMEQUIPMENTS Equipment { get; set; }
        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
        public string[] Values { get; set; }
    }
}