using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiChecklistsController : ApiController
    {
        public class ChecklistItemRate
        {
            public long Id { get; set; }
            public int? Rate { get; set; }
        }

        private RepositoryCheckLists repositoryCheckLists;
        private RepositoryLookupLines repositoryLookupLines;

        public ApiChecklistsController()
        {
            repositoryCheckLists = new RepositoryCheckLists();
            repositoryLookupLines = new RepositoryLookupLines();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var checklists = repositoryCheckLists.List(gridRequest);
                var lookups = checklists.Where(x => x.CHK_TYPE == "LOOKUP").Select(x => x.CHK_TEMPLATELINEID.ToString()).ToArray();

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = checklists,
                    lookuplines = (lookups.Length > 0) ? repositoryLookupLines.ListByCodes(lookups, "CHECKLIST") : null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCHECKLISTS nCheckList)
        {
            repositoryCheckLists.SaveOrUpdate(nCheckList);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10033", UserManager.Instance.User.Language),
                r = nCheckList
            });
        }


        [HttpPost]
        [Transaction]
        public string Update(TMCHECKLISTS checkListItemNew)
        {
            var checkListItemOld = repositoryCheckLists.Get(checkListItemNew.CHK_ID);

            if ((checkListItemOld.CHK_CHECKED != checkListItemNew.CHK_CHECKED
                    || checkListItemOld.CHK_NOTE != checkListItemNew.CHK_NOTE
                    || checkListItemOld.CHK_TEXTVALUE != checkListItemNew.CHK_TEXTVALUE
                    || checkListItemOld.CHK_NUMERICVALUE != checkListItemNew.CHK_NUMERICVALUE
                    || checkListItemOld.CHK_DATETIMEVALUE != checkListItemNew.CHK_DATETIMEVALUE))
            {
                checkListItemOld.CHK_UPDATED = OviShared.Truncate(DateTime.Now, TimeSpan.FromMilliseconds(1));
                checkListItemOld.CHK_UPDATEDBY = UserManager.Instance.User.Code;
                checkListItemOld.CHK_TEXTVALUE = checkListItemNew.CHK_TEXTVALUE;
                checkListItemOld.CHK_DATETIMEVALUE = checkListItemNew.CHK_DATETIMEVALUE;
                checkListItemOld.CHK_NUMERICVALUE = checkListItemNew.CHK_NUMERICVALUE;
                checkListItemOld.CHK_CHECKED = checkListItemNew.CHK_CHECKED;
                checkListItemOld.CHK_NOTE = checkListItemNew.CHK_NOTE;

                repositoryCheckLists.SaveOrUpdate(checkListItemOld);

            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10033", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveItems(TMCHECKLISTS[] pCheckListItems)
        {
            var checklist = new List<TMCHECKLISTS>();
            for (var i = 0; i < pCheckListItems.Length; i++)
            {
                var checkListItemNew = pCheckListItems[i];
                var checkListItemOld = repositoryCheckLists.Get(checkListItemNew.CHK_ID);

                if ((checkListItemOld.CHK_CHECKED != checkListItemNew.CHK_CHECKED
                    || checkListItemOld.CHK_NOTE != checkListItemNew.CHK_NOTE
                    || checkListItemOld.CHK_TEXTVALUE != checkListItemNew.CHK_TEXTVALUE
                    || checkListItemOld.CHK_NUMERICVALUE != checkListItemNew.CHK_NUMERICVALUE
                    || checkListItemOld.CHK_DATETIMEVALUE != checkListItemNew.CHK_DATETIMEVALUE))
                {
                    checkListItemOld.CHK_UPDATED = OviShared.Truncate(DateTime.Now, TimeSpan.FromMilliseconds(1));
                    checkListItemOld.CHK_UPDATEDBY = UserManager.Instance.User.Code;
                    checkListItemOld.CHK_TEXTVALUE = checkListItemNew.CHK_TEXTVALUE;
                    checkListItemOld.CHK_DATETIMEVALUE = checkListItemNew.CHK_DATETIMEVALUE;
                    checkListItemOld.CHK_NUMERICVALUE = checkListItemNew.CHK_NUMERICVALUE;
                    checkListItemOld.CHK_CHECKED = checkListItemNew.CHK_CHECKED;
                    checkListItemOld.CHK_NOTE = checkListItemNew.CHK_NOTE;

                    repositoryCheckLists.SaveOrUpdate(checkListItemOld);
                }
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10033", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string MoveChecklistItem(RepositoryCheckLists.ChecklistItem cli)
        {
            var oCheckListItem = repositoryCheckLists.Get(cli.To);
            var nCheckListItem = (TMCHECKLISTS)oCheckListItem.Clone();
            nCheckListItem.CHK_NO = cli.ToOrder;

            repositoryCheckLists.MoveChecklistItem(cli);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = "Test"
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateCheckListItemRate(ChecklistItemRate clir)
        {
            var oCheckListItem = repositoryCheckLists.Get(clir.Id);
            var nCheckListItem = (TMCHECKLISTS)oCheckListItem.Clone();

            nCheckListItem.CHK_RATE = clir.Rate;
            repositoryCheckLists.SaveOrUpdate(nCheckListItem);

            return JsonConvert.SerializeObject(new
            {
                status = 200
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var checklist = repositoryCheckLists.Get(id);

                if (checklist != null)
                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = checklist
                    });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = (string)null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryCheckLists.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10034", UserManager.Instance.User.Language)
            });
        }
    }
}