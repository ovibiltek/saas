using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Project;

namespace Ovi.Task.Data.DAO
{
    public class ProjectModel
    {
        public TMPROJECTS Project { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }
}