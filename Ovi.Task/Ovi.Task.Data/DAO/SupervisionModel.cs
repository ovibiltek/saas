using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.Data.DAO
{
    public class SupervisionModel
    {
        public TMSUPERVISION Supervision { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}