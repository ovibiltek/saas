using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.Data.DAO
{
    public class ReportingModel
    {
        public TMREPORTING Reporting { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}