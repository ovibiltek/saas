using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.DAO
{
    public class ServiceCodesModel
    {
        public TMSERVICECODES ServiceCode { get; set; }

        public string[] Values { get; set; }
    }
}