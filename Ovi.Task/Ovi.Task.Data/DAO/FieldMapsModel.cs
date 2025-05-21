using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.DAO
{
    public class FieldMapsModel
    {
        public string Entity { get; set; }

        public string Code { get; set; }

        public string Field { get; set; }

        public TMFIELDMAPS[] Lines { get; set; }
    }
}