using Newtonsoft.Json;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class ApiDateTimeController : ApiController
    {
        [HttpGet]
        public string GetDateTime()
        {
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = DateTime.Now
            });
        }
    }
}