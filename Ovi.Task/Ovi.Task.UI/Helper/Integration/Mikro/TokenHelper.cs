using Newtonsoft.Json;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.UI.Helper.Integration.Ziraat;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Text;
using System.Web;
using Microsoft.Ajax.Utilities;

namespace Ovi.Task.UI.Helper.Integration.Mikro
{
    public class TokenHelper
    {
        public MikroResult GetToken()
        {
            var url = ConfigurationManager.AppSettings["mikro_url"] + "/token";
            var postString = JsonConvert.SerializeObject(new
            {
                UserName = ConfigurationManager.AppSettings["mikro_username"],
                Password = ConfigurationManager.AppSettings["mikro_password"],
                ValidTime = ConfigurationManager.AppSettings["mikro_validtime"]
            });

            try
            {
                
                var responseString = "";

                var request = WebRequest.Create(url);
                var byteData = Encoding.UTF8.GetBytes(postString);
                request.ContentType = "application/json; charset=utf-8";
                request.Method = "POST";
                request.Timeout = 300000;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteData, 0, byteData.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseStream = response.GetResponseStream();
                if (responseStream != null)
                {
                    responseString = new StreamReader(responseStream).ReadToEnd();
                }

                return JsonConvert.DeserializeObject<MikroResult>(responseString);

            }
            catch (Exception exc)
            {
                throw new TmsException(string.Format("Url:{0}, Post Data:{1}, Message:{2 }", url, postString, exc.Message));
            }


        }
    }
}