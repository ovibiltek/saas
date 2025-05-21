using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTimekeepingLinesController : ApiController
    {
        private readonly string statusApproved = "APP";
        private readonly string statusRejected = "REJ";
        private RepositoryTimekeepingLines repositoryTimekeepingLines;
        private RepositoryTimekeepingApprovers repositoryTimekeepingApprovers;

        public ApiTimekeepingLinesController()
        {
            repositoryTimekeepingLines = new RepositoryTimekeepingLines();
            repositoryTimekeepingApprovers = new RepositoryTimekeepingApprovers();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTIMEKEEPINGLINES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTimekeepingLines.List(gridRequest);
                        total = RepositoryShared<TMTIMEKEEPINGLINES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTimekeepingLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTIMEKEEPINGLINESVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTimekeepingLines.ListView(gridRequest);
                        total = RepositoryShared<TMTIMEKEEPINGLINESVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTimekeepingLinesController", "ListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTIMEKEEPINGLINES[] lines)
        {
            repositoryTimekeepingLines.Save(lines);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10185", UserManager.Instance.User.Language),
                tkitems = lines,
            });
        }

        [HttpPost]
        [Transaction]
        public string Process(TMTIMEKEEPINGLINES[] lines)
        {
            var timekeepinglines = new List<TMTIMEKEEPINGLINES>();
            foreach (var line in lines)
            {
                var lineobject = repositoryTimekeepingLines.Get(line.TKD_ID);

                if (lineobject.TKD_APPROVER != UserManager.Instance.User.Code)
                {
                    continue;
                }

                lineobject.TKD_UPDATED = line.TKD_UPDATED;
                lineobject.TKD_UPDATEDBY = line.TKD_UPDATEDBY;
                var approvers = repositoryTimekeepingApprovers.ListByLine(line.TKD_ID);
                if (approvers != null)
                {
                    TMTIMEKEEPINGLINEAPPROVERS nextapprover = null;
                    if (line.TKD_STATUS == statusApproved)
                    {
                        nextapprover = approvers.Where(x => x.TKA_ORDER > lineobject.TKD_APPROVALLINE)
                            .Take(1)
                            .OrderBy(x => x.TKA_ORDER)
                            .SingleOrDefault();
                    }
                    else if (line.TKD_STATUS == statusRejected)
                    {
                        // Proasist Business Rule
                        // Back to the time keepeing officer
                        nextapprover = approvers.Where(x => x.TKA_ORDER == (lineobject.TKD_TIMEONROUTE.HasValue ? 20 : 10))
                            .Take(1)
                            .OrderBy(x => x.TKA_ORDER)
                            .SingleOrDefault();
                    }

                    if (nextapprover != null)
                    {
                        lineobject.TKD_APPROVALLINE = nextapprover.TKA_ORDER;
                        lineobject.TKD_APPROVER = nextapprover.TKA_USER;
                    }
                    else
                    {
                        if (line.TKD_STATUS == statusApproved)
                        {
                            lineobject.TKD_STATUS = statusApproved;
                        }
                    }

                    timekeepinglines.Add(lineobject);
                }
            }

            repositoryTimekeepingLines.Save(timekeepinglines.ToArray());
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10185", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var timekeepingline = repositoryTimekeepingLines.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = timekeepingline });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTimekeepingLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryTimekeepingLines.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10186", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        [Transaction]
        public string UpdateLine([FromBody] long id)
        {
            repositoryTimekeepingLines.UpdateLine(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10456", UserManager.Instance.User.Language) });
        }
    }
}