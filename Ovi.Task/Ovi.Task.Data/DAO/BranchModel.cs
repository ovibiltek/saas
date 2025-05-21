using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class BranchModel
    {
        public TMBRANCHES Branch { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }

        public string[] Values { get; set; }
    }
}