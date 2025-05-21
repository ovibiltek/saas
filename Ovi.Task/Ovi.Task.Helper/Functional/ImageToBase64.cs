using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Ovi.Task.Helper.Functional
{
    public class ImageToBase64
    {
        public static string ConvertImageAsBase64(string url)
        {
            using (var webClient = new WebClient())
            {
                byte[] imageBytes = webClient.DownloadData(url);
                return "data:image/png;base64," + Convert.ToBase64String(imageBytes);
            }
        }

        public string RebuildForBase64(string Source)
        {

            var htmlString = Source;
            var document = new HtmlDocument();
            document.LoadHtml(htmlString);
            document.DocumentNode.Descendants("img")
                .Where(e =>
                {
                    string src = e.GetAttributeValue("src", null) ?? "";
                    return !string.IsNullOrEmpty(src);
                })
                .ToList()
                .ForEach(x =>
                {
                    string currentSrcValue = x.GetAttributeValue("src", null);
                    string base64link = ConvertImageAsBase64(currentSrcValue);
                    string contentId = Guid.NewGuid().ToString();
                    x.SetAttributeValue("src", base64link);
                });


            var result = document.DocumentNode.OuterHtml;
            return result;
        }

    }
}
