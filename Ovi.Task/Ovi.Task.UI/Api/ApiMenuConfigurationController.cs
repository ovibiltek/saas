using Newtonsoft.Json;

using System;
using System.Linq;
using System.Web.Http;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.UI.Helper;
using Ovi.Task.Data.Helper;
using Ovi.Task.UI.Models;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiMenuConfigurationController : ApiController
    {
        private RepositoryMenuConfiguration repositoryMenuConfiguration;

        public ApiMenuConfigurationController()
        {
            repositoryMenuConfiguration = new RepositoryMenuConfiguration();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMMENUCONFIGURATION>.Count(gridRequest)
                    : repositoryMenuConfiguration.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMenuConfigurationController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMENUCONFIGURATION menu)
        {
            repositoryMenuConfiguration.SaveOrUpdate(menu);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10074", UserManager.Instance.User.Language),
                r = menu
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateOrSave(TMMENUCONFIGURATION nmenu)
        {
            var menu = repositoryMenuConfiguration.GetByLang(nmenu.MNU_LANG);
            if (menu == null)
            {
                repositoryMenuConfiguration.SaveOrUpdate(nmenu);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10683", UserManager.Instance.User.Language),
                    r = nmenu
                });
            }
            else
            {
                menu.MNU_STRING = nmenu.MNU_STRING;
                repositoryMenuConfiguration.SaveOrUpdate(menu);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10683", UserManager.Instance.User.Language),
                    r = menu
                });
            }
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var menu = repositoryMenuConfiguration.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = menu
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMenuConfigurationController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetLang([FromBody] string lang)
        {
            try
            {
                var menu = repositoryMenuConfiguration.GetByLang(lang);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = menu
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMenuConfigurationController", "GetLang");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositoryMenuConfiguration.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10075", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string GetMenuByUser()
        {
            try
            {
                var menu = repositoryMenuConfiguration.GetByLang(UserManager.Instance.User.Language);
                var menuItems = MenuItemHelper.GetMenuItems(UserManager.Instance.User.UserGroup, false);
                if (menu != null)
                {
                    var editedMenu = MenuItemHelper.FilterMenuItems(menu, menuItems);

                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = editedMenu
                    });
                }
                //safe data gönder
                return JsonConvert.SerializeObject(new
                {
                    status = 200
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMenuConfigurationController", "GetMenuByUser");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string FilterMenuByUser([FromBody] MenuOptionsModel menuOptions)
        {
            try
            {
                var menu = repositoryMenuConfiguration.GetByLang(menuOptions.language);
                var menuItems = MenuItemHelper.GetMenuItems(menuOptions.usercode, false);

                if (menu != null)
                {


                    var editedMenu = MenuItemHelper.FilterMenuItems(menu, menuItems);
                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = editedMenu
                    });
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMenuConfigurationController", "FilterMenuByUser");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}