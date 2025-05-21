using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.Helper.User;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.WebPages;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    public class ApiLoginController : ApiController
    {

        private RepositoryUsers repositoryUsers;
        private RepositoryParameters repositoryParameters;

        public ApiLoginController()
        {
            repositoryUsers = new RepositoryUsers();
            repositoryParameters = new RepositoryParameters();
        }

        public class CheckParams
        {
            public string Username { get; set; }

            public string Password { get; set; }
        }


        private static bool IsMobile()
        {
            var u = HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"];
            var b = new Regex(@"(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino", RegexOptions.IgnoreCase | RegexOptions.Multiline);
            var v = new Regex(@"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-", RegexOptions.IgnoreCase | RegexOptions.Multiline);
            return (b.IsMatch(u) || v.IsMatch(u.Substring(0, 4)));
        }

        [HttpPost]
        [Transaction]
        public string Check(CheckParams checkParams)
        {
            if (IsMobile())
            {
                return JsonConvert.SerializeObject(new { status = 500, data = "Please use TMS Mobile" });
            }

            var user = repositoryUsers.Get(checkParams.Username.ToUpper());
            var lockCount = repositoryParameters.Get("LOCKCOUNT");

            if (user!=null)
            {
                if (lockCount != null)
                    if (user.USR_LOCKCOUNT == int.Parse(lockCount.PRM_VALUE))
                        return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("20248", user.USR_LANG) });
                
                try
                {
                    if (UserManager.Instance.ValidateUser(checkParams.Username.ToUpper(), checkParams.Password))
                    {
                        var tmsuser = (OviUser)HttpContext.Current.Items["User"];
                        if (UserManager.Instance.CreateFormsAuthenticationCookie(tmsuser))
                        {
                            user.USR_LOCKCOUNT = 0;
                            repositoryUsers.SaveOrUpdate(user);
                            WebAppHelper.PostLoginOp(tmsuser);
                        }
                        return JsonConvert.SerializeObject(new { status = 200, page = string.IsNullOrEmpty(UserManager.Instance.User.Customer) ? "/Main/Index" : "Main/Customer" });
                    }
                }
                catch (PassException exc)
                {
                    if (lockCount != null)
                    {
                        if (user.USR_LOCKCOUNT == int.Parse(lockCount.PRM_VALUE))
                        {
                            return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("20248", user.USR_LANG) });
                        }
                        else
                        {
                            user.USR_LOCKCOUNT++;
                            repositoryUsers.SaveOrUpdate(user);
                        }
                    }
                    return JsonConvert.SerializeObject(new { status = 500, data = exc.Message });
                }
                catch (TmsException exc)
                {
                    return JsonConvert.SerializeObject(new { status = 500, data = exc.Message });
                }

            }

            return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("20249", GetTwoLetterISOLanguageName()) });
        }

        private static string GetTwoLetterISOLanguageName()
        {
            var httpCookie = HttpContext.Current.Response.Cookies["culture"];
            if (httpCookie != null)
            {
                if (!httpCookie.Value.IsEmpty())
                {
                    var culture = CultureInfo.GetCultureInfo(httpCookie.Value);
                    return culture.TwoLetterISOLanguageName.ToUpper();
                }
            }
            return "TR";

        }

    }
}