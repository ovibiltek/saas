using Newtonsoft.Json;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace Ovi.Task.UI.Helper.Integration.Ziraat
{
    public class ResolveParameters
    {
        public string Reference { get; set; }
        public int Status { get; set; }
        public string ResolvedBy { get; set; }
        public string ResolutionStartDate { get; set; }
        public string VendorResolutionDate { get; set; }
        public string ResolutionDetail { get; set; }
    }

    public class SendForApprovalParameters
    {
        public string Reference { get; set; }        
        public int ApprovalCode { get; set; }
        public string ApprovalReason { get; set; }
        public string SuspendDate { get; set; }
    }

    public class ZiraatIntegrationHelper
    {
        public string Resolve(ResolveParameters resolveParameters)
        {
            var postString = JsonConvert.SerializeObject(new
            {
                status = resolveParameters.Status,
                resolvedby = resolveParameters.ResolvedBy,
                resolutionstartdate = resolveParameters.ResolutionStartDate,
                vendorresolutiondate = resolveParameters.VendorResolutionDate,
                resolutiondetail = resolveParameters.ResolutionDetail
            });

            var url = ConfigurationManager.AppSettings["ziraat_resolve"] + resolveParameters.Reference;

            try
            {
                var responseString = "";
                var request = WebRequest.Create(url);
                var byteData = Encoding.UTF8.GetBytes(postString);
                request.ContentType = "application/json; charset=utf-8";
                request.Method = "PUT";
                request.Timeout = 300000;

                string username = ConfigurationManager.AppSettings["ziraat_user"];
                string password = ConfigurationManager.AppSettings["ziraat_pass"];
                string svcCredentials = Convert.ToBase64String(Encoding.UTF8.GetBytes(username + ":" + password));
                request.Headers.Add("Authorization", "Basic " + svcCredentials);

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

                return responseString;
            }
            catch(Exception exc)
            {
                throw new TmsException(string.Format("Url:{0}, Post Data:{1}, Message:{2 }", url, postString, exc.Message));
            }
        }

        public string SendForApproval(SendForApprovalParameters sendForApprovalParameters)
        {
            var postString = string.Empty;
            if (sendForApprovalParameters.ApprovalCode == 120)
            {
                postString = JsonConvert.SerializeObject(new
                {
                    approvalcode = sendForApprovalParameters.ApprovalCode,
                    approvalreason = sendForApprovalParameters.ApprovalReason
                });
            }
            else
            {
                postString = JsonConvert.SerializeObject(new
                {
                    approvalcode = sendForApprovalParameters.ApprovalCode,
                    approvalreason = sendForApprovalParameters.ApprovalReason,
                    suspenddate = sendForApprovalParameters.SuspendDate
                });
            }

            var url = ConfigurationManager.AppSettings["ziraat_sendforapproval"] + sendForApprovalParameters.Reference;

            try
            {
                var responseString = "";
                
                var request = WebRequest.Create(url);
                var byteData = Encoding.UTF8.GetBytes(postString);
                request.ContentType = "application/json; charset=utf-8";
                request.Method = "PUT";
                request.Timeout = 300000;

                string username = ConfigurationManager.AppSettings["ziraat_user"];
                string password = ConfigurationManager.AppSettings["ziraat_pass"];
                string svcCredentials = Convert.ToBase64String(Encoding.UTF8.GetBytes(username + ":" + password));
                request.Headers.Add("Authorization", "Basic " + svcCredentials);

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

                return responseString;
            }
            catch (Exception exc)
            {
                throw new TmsException(string.Format("Url:{0}, Post Data:{1}, Message:{2}", url, postString, exc.Message));
            }
        }
    }
}