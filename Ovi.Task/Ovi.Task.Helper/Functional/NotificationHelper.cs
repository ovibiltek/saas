using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Text;
using Google.Apis.Auth.OAuth2;
using System.Threading.Tasks;
using static System.Reflection.Assembly;
using ThreadTask = System.Threading.Tasks.Task;
using System.Web.Configuration;

namespace Ovi.Task.Helper.Functional
{
    public class NotificationHelper
    {
        public static string AssemblyDirectory
        {
            get
            {
                var codeBase = GetExecutingAssembly().CodeBase;
                var uri = new UriBuilder(codeBase);
                var path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }

        async Task<string> GetToken()
        {
            GoogleCredential credential;
            var fbadminsdkfile = WebConfigurationManager.AppSettings["fbadminsdkfile"];
            using (var stream = new FileStream(AssemblyDirectory + "/" + fbadminsdkfile,
                System.IO.FileMode.Open, System.IO.FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream).CreateScoped(
                    new string[] { "https://www.googleapis.com/auth/firebase.messaging" }
                );
            }

            var c = (ITokenAccess)credential;
            return await c.GetAccessTokenForRequestAsync();
        }

        public string SendNotify(string SystemId, string Topic, string Message, string Title, string Parameters)
        {
            try
            {
                var fbprojectid = WebConfigurationManager.AppSettings["fbprojectid"];
                var token = ThreadTask.Run(async () => await GetToken()).Result;
                var tRequest = WebRequest.Create("https://fcm.googleapis.com/v1/projects/" + fbprojectid + "/messages:send");
                tRequest.Method = "post";
                tRequest.Headers.Add("Authorization", string.Format("Bearer {0}", token));
                tRequest.ContentType = "application/json";
                var payload = new
                {
                    message = new
                    {
                        topic = Topic,
                        notification = new
                        {
                            title = Title,
                            body = Message
                        },
                        data = new
                        {
                            topic = Topic,
                            guid = UniqueStringId.Generate(),
                            systemid = SystemId,
                            parameters = Parameters
                        },
                        android = new
                        {
                            notification = new
                            {
                                sound = "default",
                                channel_id = "high_importance_channel"
                            }
                        },
                        apns = new
                        {
                            payload = new
                            {
                                aps = new
                                {
                                    sound = "default"
                                },
                            },
                        },
                    }
                };
                var postbody = JsonConvert.SerializeObject(payload);
                var byteArray = Encoding.UTF8.GetBytes(postbody);
                tRequest.ContentLength = byteArray.Length;
                using (var dataStream = tRequest.GetRequestStream())
                {
                    dataStream.Write(byteArray, 0, byteArray.Length);
                    using (var tResponse = tRequest.GetResponse())
                    {
                        using (var dataStreamResponse = tResponse.GetResponseStream())
                        {
                            if (dataStreamResponse != null)
                            {
                                using (var tReader = new StreamReader(dataStreamResponse))
                                {
                                    var sResponseFromServer = tReader.ReadToEnd();
                                    return sResponseFromServer;
                                }
                            }
                        }
                    }
                }

                return string.Empty;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }


    }
}


