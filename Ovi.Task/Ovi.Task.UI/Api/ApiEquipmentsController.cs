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
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions.Types;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiEquipmentsController : ApiController
    {
        private RepositoryEquipments repositoryEquipments;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private RepositorySuppliers repositorySuppliers;


        public ApiEquipmentsController()
        {
            repositoryEquipments = new RepositoryEquipments();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositorySuppliers = new RepositorySuppliers();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.BuildCustomFieldFilter(GridRequestHelper.FilterMoreSpecificV2(gridRequest, "EQP_CUSTOMER", "EQP_ORG", null), "EQP_ID");
                object data;
                IList<TMCUSTOMFIELDVALUES> customFieldValues = null;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMEQUIPMENTS>.Count(gridRequest);
                }
                else
                {
                    var lst = repositoryEquipments.List(gridRequest);
                    data = lst;
                    customFieldValues = repositoryCustomFieldValues.GetBySubjectAndSource("EQUIPMENT", lst.Select(x => x.EQP_ID.ToString()).ToArray());
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    customfieldvalues = customFieldValues
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(EqupmentModel mEquipment)
        {

            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                if (UserManager.Instance.User.Supplier.Split(',').Length > 1)
                {
                    var suppliers = repositorySuppliers.GetSuppliers(UserManager.Instance.User.Supplier, false);
                    var activesuppliers = (from supplier in suppliers
                                           where supplier.SUP_ACTIVE == "+"
                                           select supplier).ToList();
                    if (activesuppliers.Count > 1)
                        throw new TmsException(MessageHelper.Get("30092", UserManager.Instance.User.Language));
                    mEquipment.Equipment.EQP_SUPPLIER = activesuppliers.First<SUPPLIEREXT>().SUP_CODE;
                }
                else
                {
                    mEquipment.Equipment.EQP_SUPPLIER = UserManager.Instance.User.Supplier;
                }
            }

            if (mEquipment.Equipment.EQP_ID != 0)
            {
                var uEquipment = repositoryEquipments.Get(mEquipment.Equipment.EQP_ID);
                if (uEquipment.EQP_TYPE != mEquipment.Equipment.EQP_TYPE)
                {
                    repositoryCustomFieldValues.DeleteBySubjectAndSource("EQUIPMENT", uEquipment.EQP_ID.ToString());
                }
            }

            repositoryEquipments.SaveOrUpdate(mEquipment.Equipment);
            SaveCustomFieldValues(mEquipment);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10058", UserManager.Instance.User.Language),
                eqpid = mEquipment.Equipment.EQP_ID
            });
        }

        private static void SaveCustomFieldValues(EqupmentModel mEquipment)
        {
            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("EQUIPMENT", mEquipment.Equipment.EQP_ID.ToString(), mEquipment.CustomFieldValues);
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var eqp = repositoryEquipments.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = eqp
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryEquipments.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10059", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string GetTaskEquipmentListView(GridRequest gridRequest)
        {
            try
            {

                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "TSE_CUSTOMER", null);
                object data;
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKEQUIPMENTLISTVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryEquipments.GetTaskEquipmentList(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });

            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentsController", "GetTaskEquipmentListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetCalendarCounts(EquipmentCalendarCountParameters p)
        {
            try
            {
                var lines = repositoryEquipments.GetCalendarCounts(p);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lines
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentsController", "GetCalendarCount");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}