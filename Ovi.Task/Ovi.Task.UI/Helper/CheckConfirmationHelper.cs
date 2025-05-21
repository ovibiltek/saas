using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Http.Controllers;
using Ovi.Task.Data.Repositories;

namespace Ovi.Task.UI.Helper
{
    public class CheckConfirmationHelper
    {
        public static IList<RepositoryConfirmations.ConfirmationResult> CheckConfirmation(HttpActionContext actionContext)
        {
            RepositoryConfirmations.ConfirmationParams confirmationParams = new RepositoryConfirmations.ConfirmationParams();
            RepositoryConfirmations repositoryConfirmations = new RepositoryConfirmations();

            confirmationParams.Controller = actionContext.ActionDescriptor.ControllerDescriptor.ControllerName + "." + actionContext.ActionDescriptor.ActionName;

            DataTable dt = null;
            using (var stream = new StreamReader(actionContext.Request.Content.ReadAsStreamAsync().Result))
            {
                stream.BaseStream.Position = 0;
                var rawRequest = stream.ReadToEnd();
                dt = ConvertToDataTable(rawRequest);
            }

            var confirmationResult = repositoryConfirmations.RunConfirmations(confirmationParams, dt);
            return confirmationResult;

        }

        static List<JToken> GetAllTokens(JToken token)
        {
            List<JToken> tokens = new List<JToken>();

            if (token.Type == JTokenType.Object || token.Type == JTokenType.Array || token.Values().Any(x => x.HasValues))
            {

                foreach (var child in token.Children())
                {
                    tokens.AddRange(GetAllTokens(child));
                }
            }
            else
            {

                tokens.Add(token);
            }

            return tokens;
        }

        public static DataTable ConvertToDataTable(string content)
        {

            var data = (JContainer)JsonConvert.DeserializeObject(content);
            var lines = GetAllTokens(data);

            var dt = new DataTable();
            dt.Columns.Add("Field", typeof(string));
            dt.Columns.Add("Value", typeof(string));



            foreach (var line in lines)
            {
                var newrow = dt.NewRow();
                newrow["Field"] = ((JProperty)line).Name;
                newrow["Value"] = ((JProperty)line).Value.ToString();
                dt.Rows.Add(newrow);
            }

            return dt;
        }
    }
}