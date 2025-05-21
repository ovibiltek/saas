using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class LocationModel
    {
        public TMLOCATIONS Location { get; set; }

        public string[] Values { get; set; }
    }
}