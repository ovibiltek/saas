using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class TimekeepingModel
    {
        public TMTIMEKEEPING Timekeeping { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}