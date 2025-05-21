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
    public class ApiSuppliersController : ApiController
    {
        private RepositorySuppliers repositorySuppliers;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;

        public class TaskInfo
        {
            public int Task { get; set; }
            public int Line { get; set; }
        }

        public ApiSuppliersController()
        {
            repositorySuppliers = new RepositorySuppliers();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "SUP_ORGANIZATION");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSUPPLIERS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySuppliers.List(gridRequest);
                        total = RepositoryShared<TMSUPPLIERS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSuppliersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(SupplierModel mSupplier)
        {

            if (mSupplier.Supplier.SUP_SQLIDENTITY != 0)
            {
                var uSupplier = repositorySuppliers.Get(mSupplier.Supplier.SUP_CODE);
                if (uSupplier.SUP_TYPE != mSupplier.Supplier.SUP_TYPE)
                    repositoryCustomFieldValues.DeleteBySubjectAndSource("SUPPLIER", uSupplier.SUP_CODE);
            }

            repositorySuppliers.SaveOrUpdate(mSupplier.Supplier);
            SaveCustomFieldValues(mSupplier);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10147", UserManager.Instance.User.Language),
                r = mSupplier
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateCompanyInfo(TMSUPPLIERS mSupplier)
        {


            var supp = repositorySuppliers.Get(mSupplier.SUP_CODE);
            supp.SUP_BUSINESSOWNERSHIP = mSupplier.SUP_BUSINESSOWNERSHIP;
            supp.SUP_M2 = mSupplier.SUP_M2;
            supp.SUP_CHK02 = mSupplier.SUP_CHK02;
            supp.SUP_DATE01 = mSupplier.SUP_DATE01;
            supp.SUP_UPDATED = DateTime.Now;
            supp.SUP_UPDATEDBY = UserManager.Instance.User.Code;
            repositorySuppliers.SaveOrUpdate(supp);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10667", UserManager.Instance.User.Language),
                r = supp,
                regions = new RepositoryRegions().GetRegions(supp.SUP_REGION),
                tasktypes = new RepositorySystemCodes().GetCodes("TASKTYPE",supp.SUP_TASKTYPES)
            });
        }

        private static void SaveCustomFieldValues(SupplierModel mSupplier)
        {
            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("SUPPLIER", mSupplier.Supplier.SUP_CODE, mSupplier.CustomFieldValues);
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var supplier = repositorySuppliers.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = supplier,
                    regions = new RepositoryRegions().GetRegions(supplier.SUP_REGION),
                    tasktypes = new RepositorySystemCodes().GetCodes("TASKTYPE", supplier.SUP_TASKTYPES)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSuppliersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositorySuppliers.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10148", UserManager.Instance.User.Language)
            });
        }


        public string ListSupplierTaskTypes(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSUPPLIERTASKTYPESVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySuppliers.ListSupplierTaskTypes(gridRequest);
                        total = RepositoryShared<TMSUPPLIERTASKTYPESVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSuppliersController", "SupplierTaskTypes");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetAdrByTSA([FromBody]TaskInfo tsk)
        {
            string adr = repositorySuppliers.GetAdrByTSA(tsk.Task,tsk.Line);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = adr
            });
        }
    }
}