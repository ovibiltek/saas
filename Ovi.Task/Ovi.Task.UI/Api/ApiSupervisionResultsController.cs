using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web.Http;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiSupervisionResultsController : ApiController
    {
        private RepositorySupervisionResults repositorySupervisionResults;
        private RepositorySupervisionAnswers repositorySupervisionAnswers;


        public ApiSupervisionResultsController()
        {
            repositorySupervisionResults = new RepositorySupervisionResults();
            repositorySupervisionAnswers = new RepositorySupervisionAnswers();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSUPERVISIONRESULTS>.Count(gridRequest);
                        total = 0;
                        break;
                    default:
                        data = repositorySupervisionResults.List(gridRequest);
                        total = RepositoryShared<TMSUPERVISIONRESULTS>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data,
                    total
                });

            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupervisionResultsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListResults(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var questions = repositorySupervisionResults.List(gridRequest);
                var questionids = questions.Select(x => x.SVR_QUESTION).ToArray();
                var answers = repositorySupervisionAnswers.ListByQuestions(questionids);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = questions,
                    answers
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupervisionResultsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSUPERVISIONRESULTS nSUpervisionResult)
        {
            repositorySupervisionResults.SaveOrUpdate(nSUpervisionResult);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10424", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveList(TMSUPERVISIONRESULTS[] nSUpervisionResults)
        {
            repositorySupervisionResults.SaveList(nSUpervisionResults);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10424", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var supervisionresult = repositorySupervisionResults.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = supervisionresult });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLookupLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositorySupervisionResults.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10055", UserManager.Instance.User.Language)
            });
        }
    }
}