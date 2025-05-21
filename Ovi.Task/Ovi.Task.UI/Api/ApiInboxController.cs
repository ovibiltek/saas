using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;
using static Ovi.Task.Data.Repositories.RepositoryInbox;
using LazyCache;
using System.Threading.Tasks;



namespace Ovi.Task.UI.Api
{
    public class InboxModel
    {
        public TMINBOX inbox { get; set; }

        public TMDESCRIPTIONS[] descriptions { get; set; }
    }

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiInboxController : ApiController
    {
        private RepositoryInbox repositoryInbox;
        private RepositoryUserInbox repositoryUserInbox;
        private TimeSpan cacheExpDate;
        private object _lock = new object();
        private IAppCache cache = new CachingService();
        private bool refreshInboxAlways;


        public ApiInboxController()
        {
            repositoryInbox = new RepositoryInbox();
            repositoryUserInbox = new RepositoryUserInbox();
            cacheExpDate = new TimeSpan(0, 15, 0);
            refreshInboxAlways = new RepositoryParameters().Get("REFRESHINBOXALWAYS")?.PRM_VALUE == "+";

        }

        private Task<IList<INBXCNT>> RunInbox(RunInboxParams runInboxParams) =>
            System.Threading.Tasks.Task.FromResult(
                string.IsNullOrEmpty(UserManager.Instance.User.Customer)
                ? repositoryInbox.RunInbxCnts(runInboxParams)
                : repositoryInbox.RunInbxCntsCustomer(runInboxParams)
            );

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, null, "INV_ORG", "INV_SUPPLIER");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMINBOX>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryInbox.List(gridRequest);
                        total = RepositoryShared<TMINBOX>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInboxController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(InboxModel nInbox)
        {
            repositoryInbox.SaveOrUpdate(nInbox.inbox, nInbox.inbox.INB_SQLIDENTITY == 0);
            var repositoryDescriptions = new RepositoryDescriptions();
            if (nInbox.descriptions != null)
            {
                repositoryDescriptions.SaveList(nInbox.descriptions);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10036", UserManager.Instance.User.Language),
                r = nInbox
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveUserInbox(UserInbox nUserInbox)
        {
            repositoryUserInbox.Save(nUserInbox);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20086", UserManager.Instance.User.Language),
            });
        }


        [HttpPost]
        public string ListInboxGroups()
        {
            lock (_lock)
            {
                var inboxGroupKey = string.Format("{0}_{1}", UserManager.Instance.User.Code, "INBOXGROUP");
                Task<IList<INBXGROUP>> Func() => System.Threading.Tasks.Task.FromResult(repositoryInbox.ListUserInboxes());
                var cachedinboxgroups = cache.GetOrAdd(inboxGroupKey, Func).Result;
                return JsonConvert.SerializeObject(new { status = 200, data = cachedinboxgroups, method = "cache" });
            }
        }

        [HttpPost]
        public string Run(RunInboxParams runInboxParams)
        {
            // Inbox key'i oluşturuluyor.
            var inboxKey = string.Format("{0}_{1}_{2}", UserManager.Instance.User.Code, "INBOX", runInboxParams.InboxGroup);

            // Eğer Refresh '+' veya refreshInboxAlways true ise cache'den veri siliniyor
            if (runInboxParams.Refresh == '+' || refreshInboxAlways)
            {
                cache.Remove(inboxKey); // cache'den eski veriyi kaldır
            }

            // Veriyi cache'den alıyoruz, cache'de yoksa RunInbox fonksiyonunu çalıştırıyoruz
            var inbxcounts = cache.GetOrAdd(inboxKey, async () => await RunInbox(runInboxParams)).Result;

            // Sonuçları JSON formatında döndürüyoruz
            return JsonConvert.SerializeObject(new { status = 200, data = inbxcounts, method = "cache" });
        }


        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var inbox = repositoryInbox.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = inbox });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInboxController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ValidateInbox([FromBody] string id)
        {
            try
            {
                repositoryInbox.ValidateInbox(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10085", UserManager.Instance.User.Language),
                    r = repositoryInbox.Get(id)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInboxController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10086", UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] string id)
        {
            repositoryInbox.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10037", UserManager.Instance.User.Language)
            });
        }


    }
}