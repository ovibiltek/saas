using System;
using System.Collections.Generic;
using System.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Ext.tr.com.shaya.boysweb;
using Ovi.Task.Helper.User;
using Ovi.Task.Data;

namespace Ovi.Task.Ext
{
    public class ShayaIntegrationHelper
    {
        private Login _lgnParameters;
        private OviUser _user;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private RepositoryTasks repositoryTasks;
        private RepositoryParameters repositoryParameters;
        private RepositoryDocuments repositoryDocuments;
        private RepositoryTaskClosingCodes repositoryTaskClosingCodes;


        public ShayaIntegrationHelper()
        {
            InitRepositories();
        }

        public ShayaIntegrationHelper(Login login, OviUser user)
        {
            InitRepositories();
            _lgnParameters = login;
            _user = user;
        }

        public ShayaIntegrationHelper(Login login)
        {
            InitRepositories();
            _lgnParameters = login;   
        }

        public void InitRepositories()
        {
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryTasks = new RepositoryTasks();
            repositoryParameters = new RepositoryParameters();
            repositoryDocuments = new RepositoryDocuments();
            repositoryTaskClosingCodes = new RepositoryTaskClosingCodes();
        }

        public UpdateWorkOrderStatusReturn UpdateWorkOrderStatus(Task task)
        {
            OrderCloseService orderCompleteService = new OrderCloseService();
            var result = orderCompleteService.UpdateWorkOrderStatus(_lgnParameters, task.IsemriNo, task.HariciSistemFormNo,"23");
            if (result.Success)
                return result;
            else
                throw new TmsException("Shaya:" + result.ErrorMessage);
        }

        public CloseWorkOrderReturn CloseWorkOrder(Ext.Task task)
        {
            OrderCloseService orderCloseService = new OrderCloseService();
            WorkOrder wo = new WorkOrder
            {
                IsemriNo = task.IsemriNo,
                HariciSistemFormNo = task.HariciSistemFormNo,
                IsBaslangicTarihi = task.IsBaslangicTarihi,
                IsBitisTarihi = task.IsBitisTarihi.Value,
                IsTamamlanmaTarihi = task.IsTamamlanmaTarihi.Value,
                HakedisAyi = task.HakedisAyi != null ? int.Parse(task.HakedisAyi) : DateTime.Now.Month,
                HakedisYili = task.HakedisYili != null ? int.Parse(task.HakedisYili) : DateTime.Now.Year,
                FaturaTipi = task.FaturaTipi != null ? task.FaturaTipi : null,
                YapilanIs = task.YapilanIs,
                ArizaCozumuKodu = task.ArizaCozumuKodu,
                ArizaNedeniKodu = task.ArizaNedeniKodu,
                KullanılanMalzemeler = task.KullanılanMalzemeler,
                Hizmetler = task.Hizmetler
            };

            var result = orderCloseService.CloseWorkOrder(_lgnParameters, wo);
            if (result.Success)
                return result;
            else
                throw new TmsException("Shaya:" + result.ErrorMessage);
        }

        public UpdateWorkOrderStatusReturn AddDocumentToWorkOrder(string reference, WorkOrderDocument doc)
        {
            OrderCloseService orderCloseService = new OrderCloseService();

            var result = orderCloseService.AddDocumentToWorkOrder(_lgnParameters, reference, doc);
            if (result.Success)
                return result;
            else
                throw new TmsException("Shaya:" + result.ErrorMessage);
        }

        public Task GetExtTask(long taskId)
        {

            var staList = new List<string>() { "K", "TAM" };
            var task = repositoryTasks.Get(taskId);

            if (!staList.Contains(task.TSK_STATUS))
                throw new Exception(MessageHelper.Get("PRO10013", "TR"));

            var ambar = repositoryParameters.Get("SH.AMBAR");
            var customFieldValues = repositoryCustomFieldValues.GetBySubjectAndSource("TASK", task.TSK_ID.ToString());

            TMCUSTOMFIELDVALUES fTip = null;
            TMCUSTOMFIELDVALUES hYil = null;
            TMCUSTOMFIELDVALUES hAy = null;

            if (customFieldValues != null)
            {
                fTip = customFieldValues.FirstOrDefault(x => x.CFV_CODE == "SH.FTIP");
                hYil = customFieldValues.FirstOrDefault(x => x.CFV_CODE == "SH.HYIL");
                hAy = customFieldValues.FirstOrDefault(x => x.CFV_CODE == "SH.HAY");
            }

            var extTask = new Ovi.Task.Ext.Task
            {
                HariciSistemFormNo = task.TSK_ID.ToString(),
                IsemriNo = task.TSK_REFERENCE,
                YapilanIs = string.IsNullOrEmpty(task.TSK_NOTE) ? task.TSK_NOTE : task.TSK_SHORTDESC,
                IsBitisTarihi = task.TSK_COMPLETED,
                IsTamamlanmaTarihi = task.TSK_CLOSED,
                IsBaslangicTarihi = task.TSK_CREATED,
                FaturaTipi = fTip != null ? fTip.CFV_DESC : null,
                HakedisYili = hYil != null ? hYil.CFV_TEXT : null,
                HakedisAyi = hAy != null ? hAy.CFV_TEXT : null,
                Ambar = ambar.PRM_VALUE
            };

            var closingCodes = repositoryTaskClosingCodes.GetByTask(task.TSK_ID);
            if (closingCodes == null)
                throw new TmsException(MessageHelper.Get("PRO10006", _user.Language));
            else
            {
                var cause = repositoryTaskClosingCodes.GetClosingCodeReference("SHAYA", "CAUSE", closingCodes.CLC_CAUSE);
                if (cause == null)
                    throw new TmsException(MessageHelper.Get("PRO10007", _user.Language));
                var action = repositoryTaskClosingCodes.GetClosingCodeReference("SHAYA", "ACTION", closingCodes.CLC_ACTION);
                if (action == null)
                    throw new TmsException(MessageHelper.Get("PRO10008", _user.Language));

                extTask.ArizaNedeniKodu = cause.CRF_REFERENCE;
                extTask.ArizaCozumuKodu = action.CRF_REFERENCE;
            }

            GridRequest gridRequest = new GridRequest()
            {
                filter = new GridFilters()
                {
                    Filters = new List<GridFilter>()
                    {
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = task.TSK_ID,
                            Operator = "eq",
                            Field = "TPR_TASK"
                        },
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = "SHAYA",
                            Operator = "eq",
                            Field = "TPR_CUSTOMER"
                        }
                    }
                }
            };

            var partList = repositoryTasks.ListPartIntegrationView(gridRequest);
            if (partList != null && partList.Count > 0)
            {
                extTask.KullanılanMalzemeler = partList.Select(x => new WorkOrderItem
                {
                    AmbarKodu = extTask.Ambar,
                    BirimFiyat = (double)x.TPR_UNITSALESPRICE,
                    ParaBirimi = x.TPR_CURR,
                    MalzemeKodu = x.TPR_PARTREF,
                    Miktar = (double)x.TPR_QTY
                }).ToArray();
            }

            var serviceList = repositoryTasks.ListServiceIntegrationView(gridRequest);
            if (serviceList != null && serviceList.Count > 0)
            {
                extTask.Hizmetler = serviceList.Select(x => new WorkOrderService
                {
                    FaturaNumarası = null,
                    BirimFiyat = (double)x.TPR_UNITSALESPRICE,
                    ParaBirimi = x.TPR_CURR,
                    HizmetKodu = x.TPR_SERVICECODEREF,
                    Miktar = (double)x.TPR_QTY
                }).ToArray();
            }

            return extTask;

        }
    }
}