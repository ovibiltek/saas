using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class UserModel
    {
        public TMUSERS User { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }

        public string[] Values { get; set; }

    }
}