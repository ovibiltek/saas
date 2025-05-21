using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Ovi.Task.UI.Helper
{
    public static class MenuItemHelper
    {
        private static readonly string menuSuffix = "_MENU";
        private static readonly string screenSuffix = "_SCREEN";

        public static string[] GetMenuItems(string usercode, bool usecache)
        {
            var menukey = string.Concat(usercode, menuSuffix);
            if (usecache && CacheHelper.Instance.IsInCache(menukey)) return CacheHelper.Instance.GetFromCache<string[]>(menukey);

            var repositoryMenu = new RepositoryMenu();
            var menu = repositoryMenu.ListByUserGroup(UserManager.Instance.User.UserGroup)
                .Where(x => x.MNU_ACTIVE == '+')
                .Select(x => x.MNU_SCREEN)
                .ToArray();
            CacheHelper.Instance.Save2Cache(menukey, menu, DateTime.Now.AddYears(1));
            return menu;
        }

        public static TMSCREENS[] GetScreens()
        {
            var screenkey = string.Concat(UserManager.Instance.User.Code, screenSuffix);
            if (CacheHelper.Instance.IsInCache(screenkey)) return CacheHelper.Instance.GetFromCache<TMSCREENS[]>(screenkey);

            var gridRequest = new GridRequest { filter = new GridFilters { Filters = new List<GridFilter>() }, loadall = true };
            gridRequest.filter.Filters.Add(new GridFilter { Field = "SCR_ACTIVE", Value = "+", Operator = "eq", Logic = "and" });
            var repositoryScreens = new RepositoryScreens();
            var screens = repositoryScreens.List(gridRequest).ToArray();
            CacheHelper.Instance.Save2Cache(screenkey, screens, DateTime.Now.AddYears(1));
            return screens;
        }

        public static MvcHtmlString ListItem(this HtmlHelper htmlHelper, string screen, string css, string icon, string text)
        {
            var menu = GetMenuItems(UserManager.Instance.User.Code,true);
            if (menu.Length == 0) return null;
            if (!menu.Contains(screen)) return null;

            var screens = GetScreens();
            var scr = screens.SingleOrDefault(z => z.SCR_CODE == screen);


            var li = new TagBuilder("li");
            li.AddCssClass(css);
            li.InnerHtml =
                string.Format("<a href=\"{0}\">" + (!string.IsNullOrEmpty(icon) ? "<i class=\"menu-icon {1}\"></i> <span class=\"menu-text\">" : string.Empty)
                    + "{2} </span></a>", scr.SCR_URL, icon, text);

            return MvcHtmlString.Create(li.ToString());
        }

        public static bool ShowDropdown(this HtmlHelper htmlHelper, string[] screens)
        {
            var menu = GetMenuItems(UserManager.Instance.User.Code, true);
            return menu.Length != 0 && screens.Any(scr => menu.Contains(scr));
        }

        public static TMMENUCONFIGURATION FilterMenuItems(TMMENUCONFIGURATION menu, string[] menuItems)
        {

            var editedMenuStr = JArray.Parse(menu.MNU_STRING);
            var screens = editedMenuStr.SelectTokens("$..code").Select(z => (string)z).ToList();
            foreach (var screen in screens)
            {
                if (!menuItems.Contains(screen) && screen != "")
                {
                    var _item = editedMenuStr.SelectTokens("$..code").First(s => (string)s == screen);
                    _item.Parent.Parent.Remove();
                }
            }
            var _menus = editedMenuStr.SelectTokens("$..code").Where(s => (string)s == "").ToList();
            foreach (var item in _menus)
            {
                var _parent = item.Parent.Parent;
                var _child = _parent.SelectTokens("$..children");
                var statement = _child.Any(s => s.SelectTokens("$..code").Any(z => (string)z != "") == true);
                if (!statement)
                {
                    item.Parent.Parent.Remove();
                }
            }

            menu.MNU_STRING = editedMenuStr.ToString();

            return menu;
        }

        public static MvcHtmlString GetPageName(string screencode)
        {
            RepositoryMenuConfiguration repositoryMenuConfiguration = new RepositoryMenuConfiguration();
            var menu = repositoryMenuConfiguration.GetByLang(UserManager.Instance.User.Language);
            var menustring = JArray.Parse(menu.MNU_STRING);
            var is_exists = menustring.SelectTokens("$..code").Any(s => (string)s == screencode);
            
            
            if (is_exists)
            {
                var code = menustring.SelectTokens("$..code").First(s => (string)s == screencode);
                var page = code.Parent.Parent;
                var title = page.Value<string>("text");
                return MvcHtmlString.Create(title);
            }
            return null;
        }

    }
}