using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class ApiIssueReturnController : ApiController
    {


        private RepositoryPartTransaction repositoryPartTransaction;
        private RepositoryPartTransactionLine repositoryPartTransactionLine;

        public ApiIssueReturnController()
        {
            repositoryPartTransaction = new RepositoryPartTransaction();
            repositoryPartTransactionLine = new RepositoryPartTransactionLine();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPARTTRANS>.Count(gridRequest)
                    : repositoryPartTransaction.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiIssueReturnController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(IssueReturnModel issueReturn)
        {
            if (repositoryPartTransaction.SaveOrUpdate(issueReturn.Transaction) != null)
            {
                foreach (var line in issueReturn.TransactionLines)
                {
                    line.PTL_TRANSACTION = issueReturn.Transaction.PTR_ID;
                    repositoryPartTransactionLine.SaveOrUpdate(line);
                }

                issueReturn.Transaction.PTR_STATUS = "APP";
                issueReturn.Transaction.PTR_UPDATED = issueReturn.Transaction.PTR_CREATED;
                issueReturn.Transaction.PTR_UPDATEDBY = issueReturn.Transaction.PTR_CREATEDBY;
                repositoryPartTransaction.SaveOrUpdate(issueReturn.Transaction);
            }

            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10118", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var parttrans = repositoryPartTransaction.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = parttrans });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiIssueReturnController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}