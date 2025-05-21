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
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiBranchesController : ApiController
    {
        private RepositoryBranches repositoryBranches;

        public ApiBranchesController()
        {
            repositoryBranches = new RepositoryBranches();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "BRN_CUSTOMER", "BRN_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMBRANCHES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryBranches.List(gridRequest);
                        total = RepositoryShared<TMBRANCHES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBranchesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(BranchModel mBranch)
        {
            repositoryBranches.SaveOrUpdate(mBranch.Branch);
            
            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("BRANCH", mBranch.Branch.BRN_CODE, mBranch.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10102", UserManager.Instance.User.Language),
                r = mBranch
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var branch = repositoryBranches.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = branch,
                    warranties = (branch!= null ? new RepositorySystemCodes().GetCodes("BRNWARRANTY", branch.BRN_WARRANTY) : null),
                    authorizedusers = !string.IsNullOrEmpty(branch.BRN_AUTHORIZED) ? new RepositoryUsers().GetUsers(branch.BRN_AUTHORIZED) : null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBranchesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryBranches.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10103", UserManager.Instance.User.Language)
            });
        }
    }
}