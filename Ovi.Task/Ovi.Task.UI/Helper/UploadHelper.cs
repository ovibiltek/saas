using Microsoft.Ajax.Utilities;
using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Helper.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.WebControls.WebParts;
using Ovi.Task.Data.Entity.Quotation;
using System.Text.RegularExpressions;

namespace Ovi.Task.UI.Helper
{
    public class UploadHelper
    {
        private BatchProgressDataHelper batchProgressDataHelper;
        private TMBATCHPROGRESSDATA batchProgress;
        private static int equipmentfieldcount = 16;


        public UploadHelper()
        {
            batchProgressDataHelper = new BatchProgressDataHelper();
        }

        public List<ErrLine> Process(string filename, string type, string id, List<string[]> lines)
        {

            if (batchProgressDataHelper.FileExists(filename))
                throw new Exception(MessageHelper.Get("30083", UserManager.Instance.User.Language));

            batchProgress = batchProgressDataHelper.StartBatchProgress(filename, type, string.Format("{0} / {1}", "0", lines.Count.ToString()), "1");

            if (type.StartsWith("BEQP"))
            {
                var eqpType = type.Replace("BEQP-", "");
                return ProcessEquipments(eqpType == "*" ? null : eqpType, lines);
            }

            switch (type)
            {
                case "BCOPP":
                    return ProcessBCOPP(lines);

                case "BCMP":
                    return ProcessBCMP(lines);

                case "BSRC":
                    return ProcessBSRC(lines);

                case "BCSC":
                    return ProcessBCSC(lines);

                case "BBRN":
                    return ProcessBBRN(lines);

                case "BTSK":
                    return ProcessBTSK(lines);

                case "BLOC":
                    return ProcessBLOC(lines);

                case "BPTP":
                    return ProcessBPTP(lines);

                case "BUSR":
                    return ProcessBUSR(lines);

                case "BRST":
                    return ProcessBRST(lines);
                
                case "BTPR":
                    return ProcessBTPR(lines);

                case "BDLT":
                    return ProcessBDLT(lines);

                case "BPAR":
                    return ProcessBPAR(lines);

                case "BQPR":
                    return ProcessBQPR(lines);
            }

            return null;
        }

        private List<ErrLine> ProcessBPTP(List<string[]> lines)
        {
            var errList = new List<ErrLine>();

            if (lines.Count > 0)
            {
                var i = 1;
                var lstOfPeriodicTaskParameters = new List<PeriodicTaskParametersModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 6)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var periodicTask = line[0];
                        var equipmentCode = line[1];
                        var locationCode = line[2];
                        var plandate = line[3];
                        var trade = line[4];
                        var reportingRequired = line[5];

                        if (string.IsNullOrEmpty(periodicTask) ||
                            string.IsNullOrEmpty(plandate))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        if (string.IsNullOrEmpty(equipmentCode) && string.IsNullOrEmpty(locationCode))
                        {
                            throw new Exception(MessageHelper.Get("30078", UserManager.Instance.User.Language));
                        }

                        TMEQUIPMENTS equipment = null;
                        TMLOCATIONS location = null;

                        if (!string.IsNullOrEmpty(equipmentCode))
                        {
                            equipment = new RepositoryEquipments().GetByCode(equipmentCode);
                            if (equipment == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30074", UserManager.Instance.User.Language), equipmentCode));
                            }

                            location = new RepositoryLocations().Get(equipment.EQP_LOCATION);
                            if (location == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30013", UserManager.Instance.User.Language), equipmentCode));
                            }
                        }
                        if (!string.IsNullOrEmpty(locationCode))
                        {
                            location = new RepositoryLocations().Get(locationCode);
                            if (location == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30013", UserManager.Instance.User.Language), equipmentCode));
                            }
                        }
                        var ptask = new RepositoryPeriodicTasks().Get(periodicTask);

                        TMTRADES trd1 = null;
                        if (!string.IsNullOrEmpty(trade))
                        {
                            trd1 = new RepositoryTrades().Get(trade);
                            if (trd1 == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30024", UserManager.Instance.User.Language), trade));
                            }
                        }

                        if (ptask == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30075", UserManager.Instance.User.Language), periodicTask));
                        }

                        var datePlan = OviShared.GetNullableDateTimeFromString(plandate);
                        if (!datePlan.HasValue)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30015", UserManager.Instance.User.Language), plandate) + " > " + linenumber);
                        }

                        lstOfPeriodicTaskParameters.Add(new PeriodicTaskParametersModel
                        {
                            PeriodicTaskParameter = new TMPERIODICTASKPARAMETERS
                            {
                                PTP_EQUIPMENT = equipment != null ? equipment.EQP_ID.ToString() : null,
                                PTP_BRANCH = location.LOC_BRANCH,
                                PTP_LOCATION = location.LOC_CODE,
                                PTP_DEPARTMENT = location.LOC_DEPARTMENT,
                                PTP_PLANDATE = datePlan.Value,
                                PTP_RESPONSIBLE = null,
                                PTP_TRADE = trd1 != null ? trd1.TRD_CODE : null,
                                PTP_ACTIVE = "+",
                                PTP_REPORTING = reportingRequired ?? "-",
                                PTP_CREATED = DateTime.Now,
                                PTP_CREATEDBY = UserManager.Instance.User.Code,
                                PTP_PTASK = periodicTask,
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {

                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstOfPeriodicTaskParameters.Count > 0)
                    lstError = new RepositoryPeriodicTaskParameters().Save(lstOfPeriodicTaskParameters, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);
                
            }

            return errList;
        }

        private List<ErrLine> ProcessBCOPP(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;

                var lstofpartprices = new List<ContractPartPricesModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 8)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var contractid = line[0];
                        var partcode = line[1];
                        var region = line[2];
                        var branch = line[3];
                        var reference = line[4];
                        var unitpurchaseprice = line[5];
                        var unitsalesprice = line[6];
                        var partpricecurr = line[7];
                        decimal iPurchasePrice = 0;

                        if (!Parser.ParseDecimal(unitsalesprice, out var iSalesPrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitsalesprice), i));
                        }

                        if (!string.IsNullOrEmpty(unitpurchaseprice))
                        {
                            if (!Parser.ParseDecimal(unitpurchaseprice, out iPurchasePrice))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitpurchaseprice), i));
                            }
                        }

                        if (!Parser.ParseInt(contractid, out var iContractId))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), contractid), i));
                        }

                        var con = new RepositoryContracts().Get(iContractId);
                        var part = new RepositoryParts().GetByCode(partcode);
                        var curr = new RepositoryCurrencies().Get(partpricecurr);

                        TMBRANCHES brn = null;
                        if (!string.IsNullOrEmpty(branch))
                        {
                            brn = new RepositoryBranches().Get(branch);
                            if (brn == null)
                            {
                                throw new Exception(string.Format(
                                    MessageHelper.Get("30016", UserManager.Instance.User.Language), contractid));
                            }
                        }

                        TMREGIONS reg = null;
                        if (!string.IsNullOrEmpty(region))
                        {
                            reg = new RepositoryRegions().Get(region);
                            if (reg == null)
                            {
                                throw new Exception(string.Format(
                                    MessageHelper.Get("30009", UserManager.Instance.User.Language), contractid));
                            }
                        }

                        if (con == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30046", UserManager.Instance.User.Language), contractid));
                        }

                        if (part == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30001", UserManager.Instance.User.Language), partcode));
                        }

                        if (curr == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), partpricecurr));
                        }

                        if (part != null && part.PAR_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), partcode) + " > PAR_ACTIVE > " + linenumber);
                        }

                        lstofpartprices.Add(new ContractPartPricesModel
                        {
                            PartPrice = new TMCONTRACTPARTPRICES
                            {
                                CPP_CONTRACTID = (int)con.CON_ID,
                                CPP_PART = (int)part.PAR_ID,
                                CPP_REGION = (brn != null && !string.IsNullOrEmpty(brn.BRN_REGION)) ? brn.BRN_REGION : (reg?.REG_CODE),
                                CPP_BRANCH = brn?.BRN_CODE,
                                CPP_UNITPURCHASEPRICE = !String.IsNullOrEmpty(unitpurchaseprice) ? (decimal?)iPurchasePrice : null,
                                CPP_UNITSALESPRICE = iSalesPrice,
                                CPP_REFERENCE = reference,
                                CPP_CURR = partpricecurr,
                                CPP_CREATEDBY = UserManager.Instance.User.Code,
                                CPP_CREATED = DateTime.Now,
                                CPP_UPDATEDBY = null,
                                CPP_UPDATED = null,
                                CPP_RECORDVERSION = 0
                            },
                            Values = line
                        });

                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofpartprices.Count > 0)
                    lstError = new RepositoryContractPartPrices().Save(lstofpartprices, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

               
            }

            return errList;
        }

        private List<ErrLine> ProcessBSRC(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;
                var lstofservicecodes = new List<ServiceCodesModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 10)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var description = line[0];
                        var organization = line[1];
                        var uom = line[2];
                        var type = line[3];
                        var typelevels = line[4];
                        var unitprice = line[5];
                        var currency = line[6];
                        var unitsalesprice = line[7];
                        var tasktype = line[8];
                        var active = line[9];

                        if (!Parser.ParseChar(active, out var iActive))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), active), i));
                        }

                        if (!Parser.ParseDecimal(unitprice, out var iUnitPrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitprice), i));
                        }

                        if (!Parser.ParseDecimal(unitsalesprice, out var iUnitSalesPrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitsalesprice), i));
                        }

                        var tyl = new RepositoryTypeLevels().GetByCode(typelevels);
                        var curr = new RepositoryCurrencies().Get(currency);

                        if (description == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30050", UserManager.Instance.User.Language), description));
                        }

                        if (organization == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization));
                        }

                        if (uom == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30047", UserManager.Instance.User.Language), uom));
                        }

                        if (type == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30008", UserManager.Instance.User.Language), type));
                        }

                        if (unitprice == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30048", UserManager.Instance.User.Language), unitprice));
                        }

                        if (unitsalesprice == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30048", UserManager.Instance.User.Language), unitsalesprice));
                        }

                        if (curr == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), currency));
                        }

                        if (active == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30046", UserManager.Instance.User.Language), active));
                        }

                        if (tyl == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30049", UserManager.Instance.User.Language), typelevels));
                        }

                        lstofservicecodes.Add(new ServiceCodesModel()
                        {
                            ServiceCode = new TMSERVICECODES()
                            {
                                SRV_DESCRIPTION = description,
                                SRV_ORG = organization,
                                SRV_UOM = uom,
                                SRV_TYPE = type,
                                SRV_TYPEENTITY = "SERVICECODE",
                                SRV_TYPELEVEL = tyl.TLV_ID,
                                SRV_TASKTYPE = tasktype != null ? tasktype : null,
                                SRV_UNITSALESPRICE = iUnitSalesPrice,
                                SRV_UNITPRICE = iUnitPrice,
                                SRV_CURRENCY = currency,
                                SRV_ACTIVE = iActive,
                                SRV_CREATEDBY = UserManager.Instance.User.Code,
                                SRV_CREATED = DateTime.Now,
                                SRV_UPDATEDBY = null,
                                SRV_UPDATED = null,
                                SRV_RECORDVERSION = 0
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {

                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofservicecodes.Count > 0)
                    lstError = new RepositoryServiceCodes().Save(lstofservicecodes, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);
                
            }

            return errList;
        }

        private List<ErrLine> ProcessBCMP(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;
                var lstofequipmanprices = new List<ContractEquipManPricesModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 10)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var contractid = line[0];
                        var periodictask = line[1];
                        var equiptype = line[2];
                        var region = line[3];
                        var branch = line[4];
                        var equipmentid = line[5];
                        var reference = line[6];
                        var unitpurchaseprice = line[7];
                        var unitsalesprice = line[8];
                        var currency = line[9];

                        if (!Parser.ParseDecimal(unitpurchaseprice, out var iUnitPurchasePrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitpurchaseprice), i));
                        }

                        if (!Parser.ParseDecimal(unitsalesprice, out var iUnitSalesPrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitsalesprice), i));
                        }

                        if (!Parser.ParseInt(contractid, out var iContractId))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), contractid), i));
                        }

                        var con = new RepositoryContracts().Get(iContractId);
                        var ptk = new RepositoryPeriodicTasks().Get(periodictask);
                        var curr = new RepositoryCurrencies().Get(currency);
                        var typ = new RepositoryTypes().Get(new TMTYPES { TYP_ENTITY = "EQUIPMENT", TYP_CODE = equiptype });
                        var equip = new RepositoryEquipments().GetByCode(equipmentid);

                        TMBRANCHES brn = null;
                        if (!string.IsNullOrEmpty(branch))
                        {
                            brn = new RepositoryBranches().Get(branch);
                            if (brn == null)
                            {
                                throw new Exception(string.Format(
                                    MessageHelper.Get("30016", UserManager.Instance.User.Language), contractid));
                            }
                        }

                        TMREGIONS reg = null;
                        if (!string.IsNullOrEmpty(region))
                        {
                            reg = new RepositoryRegions().Get(region);
                            if (reg == null)
                            {
                                throw new Exception(string.Format(
                                    MessageHelper.Get("30009", UserManager.Instance.User.Language), contractid));
                            }
                        }

                        if (con == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30046", UserManager.Instance.User.Language), contractid));
                        }

                        if (curr == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), currency));
                        }

                        if (typ == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30008", UserManager.Instance.User.Language), equiptype));
                        }

                        if (typ != null && typ.TYP_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), equiptype) + " > TYP_ACTIVE > " + linenumber);
                        }

                        if (equip != null && equip.EQP_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), equipmentid) + " > EQP_ACTIVE > " + linenumber);
                        }

                        if (equip != null)
                        {
                            branch = equip.EQP_BRANCH;
                            var bran = new RepositoryBranches().Get(branch);
                            region = bran.BRN_REGION;
                        }

                        lstofequipmanprices.Add(new ContractEquipManPricesModel
                        {
                            EquipManPrice = new TMCONTRACTEQUIPMANPRICES
                            {
                                CMP_CONTRACTID = (int)con.CON_ID,
                                CMP_PTKCODE = ptk != null ? ptk.PTK_CODE : null,
                                CMP_EQUIPMENTTYPE = equiptype,
                                CMP_EQUIPMENTTYPEENTITY = "EQUIPMENT",
                                CMP_UNITPURCHASEPRICE = iUnitPurchasePrice,
                                CMP_REGION = (brn != null && !string.IsNullOrEmpty(brn.BRN_REGION)) ? brn.BRN_REGION : (reg?.REG_CODE),
                                CMP_BRANCH = brn?.BRN_CODE,
                                CMP_EQUIPMENTID = string.IsNullOrEmpty(equipmentid) ? (int?)null : Convert.ToInt32(equipmentid),
                                CMP_REFERENCE = reference,
                                CMP_UNITSALESPRICE = iUnitSalesPrice,
                                CMP_CURRENCY = currency,
                                CMP_CREATEDBY = UserManager.Instance.User.Code,
                                CMP_CREATED = DateTime.Now,
                                CMP_UPDATEDBY = null,
                                CMP_UPDATED = null,
                                CMP_RECORDVERSION = 0
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofequipmanprices.Count > 0)
                    lstError = new RepositoryContractEquipManPrices().Save(lstofequipmanprices, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);
                
            }

            return errList;
        }

        private List<ErrLine> ProcessBCSC(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;
                var lstofcontractserviceprices = new List<ContractServicePricesModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 8)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var contractid = line[0];
                        var servicecode = line[1];
                        var region = line[2];
                        var branch = line[3];
                        var unitpurchaseprice = line[4];
                        var unitsalesprice = line[5];
                        var curr = line[6];
                        var reference = line[7];

                        if (!Parser.ParseInt(servicecode, out var iServiceCode))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), servicecode), i));
                        }

                        if (!Parser.ParseInt(contractid, out var iContractId))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), contractid), i));
                        }

                        if (!Parser.ParseDecimal(unitpurchaseprice, out var iUnitPurchasePrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitpurchaseprice), i));
                        }

                        if (!Parser.ParseDecimal(unitsalesprice, out var iUnitSalesPrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitsalesprice), i));
                        }

                        var con = new RepositoryContracts().Get(iContractId);
                        var sco = new RepositoryServiceCodes().Get(iServiceCode);
                        var currency = new RepositoryCurrencies().Get(curr);

                        TMBRANCHES brn = null;
                        if (!string.IsNullOrEmpty(branch))
                        {
                            brn = new RepositoryBranches().Get(branch);
                            if (brn == null)
                            {
                                throw new Exception(string.Format(
                                    MessageHelper.Get("30016", UserManager.Instance.User.Language), contractid));
                            }
                        }

                        TMREGIONS reg = null;
                        if (!string.IsNullOrEmpty(region))
                        {
                            reg = new RepositoryRegions().Get(region);
                            if (reg == null)
                            {
                                throw new Exception(string.Format(
                                    MessageHelper.Get("30009", UserManager.Instance.User.Language), contractid));
                            }
                        }

                        if (con == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30046", UserManager.Instance.User.Language), contractid));
                        }

                        if (sco == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30045", UserManager.Instance.User.Language), servicecode));
                        }

                        if (currency == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), curr));
                        }

                        if (sco != null && sco.SRV_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), iServiceCode) + " > SRV_ACTIVE > " + linenumber);
                        }

                        lstofcontractserviceprices.Add(new ContractServicePricesModel
                        {
                            ContractServicePrice = new TMCONTRACTSERVICEPRICES()
                            {
                                CSP_CONTRACTID = (int)con.CON_ID,
                                CSP_SERVICECODE = iServiceCode,
                                CSP_REGION = (brn != null && !string.IsNullOrEmpty(brn.BRN_REGION)) ? brn.BRN_REGION : (reg?.REG_CODE),
                                CSP_BRANCH = brn?.BRN_CODE,
                                CSP_UNITPURCHASEPRICE = iUnitPurchasePrice,
                                CSP_UNITSALESPRICE = iUnitSalesPrice,
                                CSP_CURR = curr,
                                CSP_REFERENCE = reference,
                                CSP_CREATEDBY = UserManager.Instance.User.Code,
                                CSP_CREATED = DateTime.Now,
                                CSP_UPDATEDBY = null,
                                CSP_UPDATED = null,
                                CSP_RECORDVERSION = 0
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofcontractserviceprices.Count > 0)
                    lstError = new RepositoryContractServicePrices().Save(lstofcontractserviceprices, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

            }

            return errList;
        }

        private List<ErrLine> ProcessBBRN(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines != null && lines.Count > 0)
            {
                var i = 1;
                var lstofbranches = new List<BranchModel>();

                //var duplicates = lines.GroupBy(x => x[0])
                //    .Where(g => !string.IsNullOrEmpty(g.Key) && g.Count() > 1)
                //    .Select(y => y.Key)
                //    .ToList();

                //if (duplicates.Count > 0)
                //{
                //    throw new Exception(MessageHelper.Get("30018", UserManager.Instance.User.Language));
                //}

                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 19)
                        {
                            throw new Exception(string.Format(
                                MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var branchdesc = line[0].Trim();
                        var organization = line[1].Trim();
                        var branchtype = line[2].Trim();
                        var customer = line[3].Trim();
                        var operationsOfficer = !string.IsNullOrEmpty(line[4]) ? line[4].Trim() : null;
                        var projectmanager = !string.IsNullOrEmpty(line[5]) ? line[5].Trim() : null;
                        var authorized = !string.IsNullOrEmpty(line[6]) ? line[6].Trim() : null;
                        var csr = !string.IsNullOrEmpty(line[7]) ? line[7].Trim() : null;
                        var region = line[8];
                        var province = line[9].Trim().PadLeft(2, '0');
                        var district = !string.IsNullOrEmpty(line[10]) ? line[10].Trim().PadLeft(4, '0') : null;
                        var neighborhood = !string.IsNullOrEmpty(line[11]) ? line[11].Trim() : null;
                        var street = !string.IsNullOrEmpty(line[12]) ? line[12].Trim() : null;
                        var doorno = !string.IsNullOrEmpty(line[13]) ? line[13].Trim() : null;
                        var fulladdress = !string.IsNullOrEmpty(line[14]) ? line[14].Trim() : null;
                        var active = line[15];
                        var reference = line[16];
                        var maint = !string.IsNullOrEmpty(line[17]) ? line[17] : "-";
                        var customerzone = !string.IsNullOrEmpty(line[18]) ? line[18].Trim() : null;


                        if (!Parser.ParseChar(active, out var iActive) && !new[] { "+", "-" }.Contains(active))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), active), i));
                        }

                        if (!Parser.ParseChar(maint, out var iMaint) && !new[] { "+", "-" }.Contains(maint))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), maint), i));
                        }

                        if (string.IsNullOrEmpty(branchdesc) ||
                            string.IsNullOrEmpty(organization) ||
                            string.IsNullOrEmpty(branchtype) ||
                            string.IsNullOrEmpty(customer) ||
                            string.IsNullOrEmpty(region) ||
                            string.IsNullOrEmpty(province))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}",
                                MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        var org = new RepositoryOrgs().Get(organization);
                        var cus = new RepositoryCustomers().Get(customer);
                        var typ = new RepositoryTypes().Get(new TMTYPES { TYP_ENTITY = "BRANCH", TYP_CODE = branchtype });

                        if (!string.IsNullOrEmpty(operationsOfficer))
                        {
                            var oo = new RepositoryUsers().Get(operationsOfficer);
                            if (oo == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30004", UserManager.Instance.User.Language),
                                        operationsOfficer) + " > " + linenumber);
                            }
                        }

                        if (!string.IsNullOrEmpty(projectmanager))
                        {
                            var pm = new RepositoryUsers().Get(projectmanager);
                            if (pm == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30004", UserManager.Instance.User.Language), projectmanager) + " > " + linenumber);
                            }
                        }

                        if (!string.IsNullOrEmpty(district))
                        {
                            var dis = new RepositoryAddressSections().Get(new TMADDRESSSECTIONS
                            { ADS_CODE = district, ADS_TYPE = "ILCE" });
                            if (dis == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30005", UserManager.Instance.User.Language), district) + " > " + linenumber);
                            }
                        }

                        var rgn = new RepositoryRegions().Get(region);
                        var pro = new RepositoryAddressSections().Get(new TMADDRESSSECTIONS { ADS_CODE = province, ADS_TYPE = "IL" });

                        if (org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > " + linenumber);
                        }

                        if (cus == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30003", UserManager.Instance.User.Language), customer) + " > " + linenumber);
                        }

                        if (typ == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30008", UserManager.Instance.User.Language), branchtype));
                        }

                        if (rgn == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30009", UserManager.Instance.User.Language), region) + " > " + linenumber);
                        }

                        if (pro == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30010", UserManager.Instance.User.Language), province) + " > " + linenumber);
                        }

                        lstofbranches.Add(new BranchModel
                        {
                            Branch = new TMBRANCHES
                            {
                                BRN_DESC = branchdesc,
                                BRN_ORG = organization,
                                BRN_TYPE = branchtype,
                                BRN_TYPEENTITY = "BRANCH",
                                BRN_CUSTOMER = customer,
                                BRN_OO = operationsOfficer,
                                BRN_PM = projectmanager,
                                BRN_CSR = csr,
                                BRN_AUTHORIZED = authorized,
                                BRN_REGION = region,
                                BRN_PROVINCE = province,
                                BRN_DISTRICT = district,
                                BRN_NEIGHBORHOOD = neighborhood,
                                BRN_STREET = street,
                                BRN_DOOR = doorno,
                                BRN_FULLADDRESS = fulladdress,
                                BRN_ACTIVE = iActive,
                                BRN_CREATED = DateTime.Now,
                                BRN_CREATEDBY = UserManager.Instance.User.Code,
                                BRN_UPDATED = null,
                                BRN_UPDATEDBY = null,
                                BRN_SQLIDENTITY = 0,
                                BRN_REFERENCE = reference,
                                BRN_MAINT = iMaint,
                                BRN_CUSTOMERZONE = customerzone
                            },
                            CustomFieldValues = null,
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofbranches.Count > 0)
                    lstError = new RepositoryBranches().Save(lstofbranches, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);
               
            }

            return errList;
        }

        private List<ErrLine> ProcessBTSK(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;
                var lstoftasks = new List<TaskModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 24)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var organization = line[0];
                        var department = line[1];
                        var type = line[2];
                        var category = line[3];
                        var tasktype = !string.IsNullOrEmpty(line[4]) ? line[4] : null;
                        var description = line[5];
                        var customer = line[6];
                        var branch = line[7];
                        var location = line[8];
                        var priority = line[9];
                        var deadline = !string.IsNullOrEmpty(line[10]) ? line[10] : null;
                        var requestedby = !string.IsNullOrEmpty(line[11]) ? line[11] : null;
                        var comments = !string.IsNullOrEmpty(line[12]) ? line[12] : null;
                        var trade = !string.IsNullOrEmpty(line[13]) ? line[13] : null;
                        var reportingrequired = !string.IsNullOrEmpty(line[14]) ? line[14] : null;
                        var waitingforworkrequest = !string.IsNullOrEmpty(line[15]) ? line[15] : null;
                        var periodictask = !string.IsNullOrEmpty(line[16]) ? line[16] : null;
                        var servicecode = !string.IsNullOrEmpty(line[17]) ? line[17] : null;
                        var reportingsupplier = !string.IsNullOrEmpty(line[18]) ? line[18] : null;
                        var equipment = !string.IsNullOrEmpty(line[19]) ? line[19] : null;
                        var activeplanningdate = !string.IsNullOrEmpty(line[20]) ? line[20] : null;
                        var reference = !string.IsNullOrEmpty(line[21]) ? line[21] : null;
                        var contract = !string.IsNullOrEmpty(line[22]) ? line[22] : null;
                        var taskdetails = !string.IsNullOrEmpty(line[23]) ? line[23] : null;

                        if (string.IsNullOrEmpty(organization) ||
                            string.IsNullOrEmpty(department) ||
                            string.IsNullOrEmpty(type) ||
                            string.IsNullOrEmpty(category) ||
                            string.IsNullOrEmpty(description) ||
                            string.IsNullOrEmpty(customer) ||
                            string.IsNullOrEmpty(branch) ||
                            string.IsNullOrEmpty(location) ||
                            string.IsNullOrEmpty(priority) ||
                            string.IsNullOrEmpty(requestedby))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        TMCONTRACTS contr = null;
                        if (!string.IsNullOrEmpty(contract))
                        {
                            if (!Parser.ParseInt(contract, out var iContract))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), contract), i));
                            }

                            contr = new RepositoryContracts().Get(iContract);
                        }

                        var org = new RepositoryOrgs().Get(organization);
                        var dep = new RepositoryDepartments().Get(department);
                        var typ = new RepositoryTypes().Get(new TMTYPES { TYP_ENTITY = "TASK", TYP_CODE = type });
                        var cat = new RepositoryCategories().Get(category);
                        var cus = new RepositoryCustomers().Get(customer);
                        var brn = new RepositoryBranches().Get(branch);
                        var loc = new RepositoryLocations().Get(location);
                        var pri = new RepositoryPriorities().Get(priority);
                        var req = new RepositoryUsers().Get(requestedby);

                        if (org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > ORG_CODE > " + linenumber);
                        }

                        if (dep != null && !new[] { organization, "*" }.Contains(dep.DEP_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > DEP_ORG > " + linenumber);
                        }

                        if (typ != null && !new[] { organization, "*" }.Contains(typ.TYP_ORGANIZATION))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > TYP_ORGANIZATION > " + linenumber);
                        }

                        if (cus != null && !new[] { organization, "*" }.Contains(cus.CUS_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > CUS_ORG > " + linenumber);
                        }

                        if (brn != null && !new[] { organization, "*" }.Contains(brn.BRN_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > BRN_ORG > " + linenumber);
                        }

                        if (loc != null && !new[] { organization, "*" }.Contains(loc.LOC_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > LOC_ORG > " + linenumber);
                        }

                        if (req != null && !new[] { organization, "*" }.Contains(req.USR_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > USR_ORG > " + linenumber);
                        }

                        if (org != null && org.ORG_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > ORG_ACTIVE > " + linenumber);
                        }

                        if (dep != null && dep.DEP_ACTIVE != "+")
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), department) + " > DEP_ACTIVE > " + linenumber);
                        }

                        if (typ != null && typ.TYP_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), type) + " > TYP_ACTIVE > " + linenumber);
                        }

                        if (cus != null && cus.CUS_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), customer) + " > CUS_ACTIVE > " + linenumber);
                        }

                        if (brn != null && brn.BRN_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), branch) + " > BRN_ACTIVE > " + linenumber);
                        }

                        if (loc != null && loc.LOC_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), location) + " > LOC_ACTIVE > " + linenumber);
                        }

                        if (req != null && req.USR_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), requestedby) + " > USR_ACTIVE > " + linenumber);
                        }

                        if (dep == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30011", UserManager.Instance.User.Language), department) + " > DEP_CODE > " + linenumber);
                        }

                        if (typ == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30008", UserManager.Instance.User.Language), type) + " > TYP_CODE > " + linenumber);
                        }

                        if (cat == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30012", UserManager.Instance.User.Language), category) + " > CAT_CODE > " + linenumber);
                        }

                        if (cus == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30003", UserManager.Instance.User.Language), customer) + " > CUS_CODE > " + linenumber);
                        }

                        if (brn == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30016", UserManager.Instance.User.Language), branch) + " > BRN_CODE > " + linenumber);
                        }

                        if (loc == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30013", UserManager.Instance.User.Language), location) + " > LOC_CODE > " + linenumber);
                        }

                        if (pri == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30014", UserManager.Instance.User.Language), priority) + " > PRI_CODE > " + linenumber);
                        }

                        if (req == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30004", UserManager.Instance.User.Language), requestedby) + " > USR_CODE > " + linenumber);
                        }

                        if (contr != null && contr.CON_CUSTOMER != cus.CUS_CODE)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30081", UserManager.Instance.User.Language), contr.CON_CUSTOMER, cus.CUS_CODE) + " > " + linenumber);
                        }

                        if (contr != null && DateTime.Now.Ticks > contr.CON_ENDDATE.Ticks)
                        {
                            throw new Exception(MessageHelper.Get("30082", UserManager.Instance.User.Language) + " > " + linenumber);
                        }

                        if (!string.IsNullOrEmpty(tasktype))
                        {
                            var ttyp = new RepositorySystemCodes().Get(new TMSYSCODES { SYC_GROUP = "TASKTYPE", SYC_CODE = tasktype });
                            if (ttyp == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30017", UserManager.Instance.User.Language), tasktype) + " > TSK_TASKTYPE > " + linenumber);
                            }
                        }

                        //if (cat.CAT_CODE == "BK" && string.IsNullOrEmpty(periodictask))
                        //{
                        //    throw new Exception(string.Format(MessageHelper.Get("30053", UserManager.Instance.User.Language), tasktype) + " > TSK_PTASK > " + linenumber);
                        //}*

                        if (!string.IsNullOrEmpty(periodictask))
                        {
                            var ptsk = new RepositoryPeriodicTasks().Get(periodictask);
                            if (ptsk == null || (ptsk != null && ptsk.PTK_ACTIVE != '+'))
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30044", UserManager.Instance.User.Language), tasktype) + " > TSK_PTASK > " + linenumber);
                            }
                        }

                        if (!string.IsNullOrEmpty(trade))
                        {
                            var trd = new RepositoryTrades().Get(trade);
                            if (trd == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30024", UserManager.Instance.User.Language), trade) + " > TRD_CODE > " + linenumber);
                            }

                            if (trd != null && trd.TRD_ACTIVE != '+')
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), trade) + " > TRD_ACTIVE > " + linenumber);
                            }
                        }

                        TMEQUIPMENTS eqp = null;
                        if (!string.IsNullOrEmpty(equipment))
                        {
                            eqp = new RepositoryEquipments().GetByCode(equipment);
                            if (eqp == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("20113", UserManager.Instance.User.Language), equipment) + " > TSK_EQUIPMENT > " + linenumber);
                            }

                            if (eqp != null && eqp.EQP_ACTIVE != '+')
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), equipment) + " > EQP_ACTIVE > " + linenumber);
                            }

                            if (eqp != null && eqp.EQP_BRANCH != branch)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30058", UserManager.Instance.User.Language), branch) + " > EQP_BRANCH > " + linenumber);
                            }
                        }

                        TMSERVICECODES srvcode = null;
                        if (!string.IsNullOrEmpty(servicecode))
                        {
                            int vServiceCode;
                            if (!int.TryParse(servicecode, out vServiceCode))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), servicecode), i));
                            }

                            srvcode = new RepositoryServiceCodes().Get(vServiceCode);
                            if (srvcode == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30045", UserManager.Instance.User.Language), servicecode) + " > SRV_CODE > " + linenumber);
                            }
                        }

                        DateTime? deadlinedate = null;
                        if (!string.IsNullOrEmpty(deadline))
                        {
                            deadlinedate = OviShared.GetDateTimeFromString(deadline);
                            if (!deadlinedate.HasValue)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30015", UserManager.Instance.User.Language), deadline) + " > " + linenumber);
                            }
                        }

                        DateTime? plandate = null;
                        if (!string.IsNullOrEmpty(activeplanningdate))
                        {
                            plandate = OviShared.GetDateTimeFromString(activeplanningdate);
                            if (!plandate.HasValue)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30015", UserManager.Instance.User.Language), activeplanningdate) + " > " + linenumber);
                            }
                        }

                        TMCOMMENTS[] taskcomments = null;
                        if (!string.IsNullOrEmpty(comments))
                        {
                            taskcomments = new[]
                            {
                                new TMCOMMENTS
                                {
                                    CMN_SUBJECT = "TASK",
                                    CMN_SOURCE = null,
                                    CMN_ORGANIZATION = organization,
                                    CMN_TEXT = comments,
                                    CMN_CREATED = DateTime.Now,
                                    CMN_CREATEDBY = UserManager.Instance.User.Code,
                                    CMN_VISIBLETOCUSTOMER = '+',
                                    CMN_VISIBLETOSUPPLIER = '+',
                                    CMN_RECORDVERSION = 0,
                                    CMN_UPDATED = null,
                                    CMN_UPDATEDBY = null
                                }
                            };
                        }

                        if (!string.IsNullOrEmpty(reportingsupplier))
                        {
                            var supplier = new RepositorySuppliers().Get(reportingsupplier);
                            if (supplier == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30039", UserManager.Instance.User.Language), reportingsupplier) + " > SUPPLIER > " + linenumber);
                            }
                        }

                        var taskcustomfieldvalues = TaskCustomFieldValues(reportingrequired, waitingforworkrequest, type, reportingsupplier);
                        lstoftasks.Add(new TaskModel
                        {
                            Task = new TMTASKS
                            {
                                TSK_ORGANIZATION = organization,
                                TSK_DEPARTMENT = department,
                                TSK_SHORTDESC = description,
                                TSK_NOTE = taskdetails,
                                TSK_TYPE = type,
                                TSK_CATEGORY = category,
                                TSK_TYPEENTITY = "TASK",
                                TSK_TASKTYPE = tasktype,
                                TSK_PRIORITY = priority,
                                TSK_CUSTOMER = customer,
                                TSK_BRANCH = branch,
                                TSK_LOCATION = location,
                                TSK_REQUESTEDBY = requestedby,
                                TSK_STATUS = "T",
                                TSK_REQUESTED = DateTime.Now,
                                TSK_CREATED = DateTime.Now,
                                TSK_CREATEDBY = UserManager.Instance.User.Code,
                                TSK_DEADLINE = deadlinedate,
                                TSK_UPDATED = null,
                                TSK_UPDATEDBY = null,
                                TSK_PTASK = periodictask,
                                TSK_HIDDEN = '-',
                                TSK_CHK01 = '-',
                                TSK_CHK02 = '-',
                                TSK_CHK03 = '-',
                                TSK_CHK04 = '-',
                                TSK_CHK05 = '-',
                                TSK_REFERENCE = reference,
                                TSK_EQUIPMENT = (eqp != null ? eqp.EQP_ID : (long?)null),
                                TSK_CONTRACTID = (contr != null ? contr.CON_ID : (int?)null)
                            },
                            Comments = taskcomments,
                            Trade = trade,
                            CustomFieldValues = taskcustomfieldvalues.ToArray(),
                            ServiceCode = srvcode,
                            Values = line,
                            ActivePlanningDate = plandate
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstoftasks.Count > 0)
                    lstError = new RepositoryTasks().Save(lstoftasks, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);


            }

            return errList;
        }

        private List<ErrLine> ProcessBUSR(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;
                var lstofusers = new List<UserModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 24)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var usercode = line[0].ToUpper();
                        var description = line[1];
                        var organization = line[2].ToUpper();
                        var department = line[3].ToUpper();
                        var authorizeddepartments = !string.IsNullOrEmpty(line[4]) ? line[4] : null;
                        var usergroup = line[5].ToUpper();
                        var trade = line[6].ToUpper();
                        var usertype = line[7];
                        var timekeepingofficer = !string.IsNullOrEmpty(line[8]) ? line[8] : null;
                        var language = line[9];
                        var pricingcode = !string.IsNullOrEmpty(line[10]) ? line[10] : null;
                        var email = line[11];
                        var customer = !string.IsNullOrEmpty(line[12]) ? line[12] : null;
                        var supplier = !string.IsNullOrEmpty(line[13]) ? line[13] : null;
                        var alternativeemail = !string.IsNullOrEmpty(line[14]) ? line[14] : null;
                        var startdate = !string.IsNullOrEmpty(line[15]) ? line[15] : null;
                        var enddate = !string.IsNullOrEmpty(line[16]) ? line[16] : null;
                        var viewweeklycalendar = !string.IsNullOrEmpty(line[17]) ? Convert.ToChar(line[17]) : '-';
                        var tms = !string.IsNullOrEmpty(line[18]) ? Convert.ToChar(line[18]) : '-';
                        var mobile = !string.IsNullOrEmpty(line[19]) ? Convert.ToChar(line[19]) : '-';
                        var requestor = !string.IsNullOrEmpty(line[20]) ? Convert.ToChar(line[20]) : '-';
                        var active = !string.IsNullOrEmpty(line[21]) ? Convert.ToChar(line[21]) : '-';
                        var pass = !string.IsNullOrEmpty(line[22]) ? line[22] : null;
                        var branch = !string.IsNullOrEmpty(line[23]) ? line[23] : null;

                        if (string.IsNullOrEmpty(usercode) ||
                            string.IsNullOrEmpty(description) ||
                            string.IsNullOrEmpty(organization) ||
                            string.IsNullOrEmpty(department) ||
                            string.IsNullOrEmpty(usergroup) ||
                            string.IsNullOrEmpty(trade) ||
                            string.IsNullOrEmpty(usertype) ||
                            string.IsNullOrEmpty(language) ||
                            string.IsNullOrEmpty(email) ||
                            string.IsNullOrEmpty(pass))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        var org = new RepositoryOrgs().Get(organization);
                        var dep = new RepositoryDepartments().Get(department);
                        var ugr = new RepositoryUserGroups().Get(usergroup);
                        var lng = new RepositoryLangs().Get(language);
                        var trd = new RepositoryTrades().Get(trade);

                        if (org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > ORG_CODE > " + linenumber);
                        }

                        if (dep != null && !new[] { organization, "*" }.Contains(dep.DEP_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > DEP_ORG > " + linenumber);
                        }

                        if (org != null && org.ORG_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > ORG_ACTIVE > " + linenumber);
                        }

                        if (dep != null && dep.DEP_ACTIVE != "+")
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), department) + " > DEP_ACTIVE > " + linenumber);
                        }

                        if (ugr != null && ugr.UGR_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), usergroup) + " > UGR_ACTIVE > " + linenumber);
                        }

                        if (trd != null && trd.TRD_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), trade) + " > TRD_ACTIVE > " + linenumber);
                        }

                        if (org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > USR_ORG > " + linenumber);
                        }

                        if (dep == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30011", UserManager.Instance.User.Language), department) + " > USR_DEPARTMENT > " + linenumber);
                        }

                        if (ugr == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30035", UserManager.Instance.User.Language), usergroup) + " > USR_GROUP > " + linenumber);
                        }

                        if (lng == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30036", UserManager.Instance.User.Language), language) + " > USR_LANG > " + linenumber);
                        }

                        if (trd == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30024", UserManager.Instance.User.Language), trade) + " > USR_TRADE > " + linenumber);
                        }

                        if (!string.IsNullOrEmpty(timekeepingofficer))
                        {
                            var tko = new RepositoryUsers().Get(timekeepingofficer);
                            if (tko == null || (tko != null && tko.USR_ACTIVE != '+'))
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30004", UserManager.Instance.User.Language), timekeepingofficer) + " > USR_TIMEKEEPINGOFFICER > " + linenumber);
                            }
                        }

                        if (!string.IsNullOrEmpty(pricingcode))
                        {
                            var prccode = new RepositoryPricingCodes().Get(pricingcode);
                            if (prccode == null || (prccode != null && prccode.PRC_ACTIVE != '+'))
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30037", UserManager.Instance.User.Language), timekeepingofficer) + " > USR_PRICINGCODE > " + linenumber);
                            }
                        }

                        if (!new[] { "BLUECOLLAR", "CUSTOMER", "INTERN", "OTHER", "SUPPLIER", "WHITECOLLAR" }.Contains(usertype))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30038", UserManager.Instance.User.Language), usertype) + " > " + linenumber);
                        }

                        DateTime? dtstart = null;
                        if (!string.IsNullOrEmpty(startdate))
                        {
                            dtstart = OviShared.GetDateTimeFromString(startdate);
                            if (!dtstart.HasValue)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30015", UserManager.Instance.User.Language), startdate) + " > " + linenumber);
                            }
                        }

                        DateTime? dtend = null;
                        if (!string.IsNullOrEmpty(enddate))
                        {
                            dtend = OviShared.GetDateTimeFromString(enddate);
                            if (!dtend.HasValue)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30015", UserManager.Instance.User.Language), enddate) + " > " + linenumber);
                            }
                        }

                        if (!string.IsNullOrEmpty(supplier))
                        {
                            var suppliers = supplier.Split(',');
                            foreach (var supp in suppliers)
                            {
                                var osupplier = new RepositorySuppliers().Get(supp);
                                if (osupplier == null || (osupplier != null && osupplier.SUP_ACTIVE != '+'))
                                {
                                    throw new Exception(string.Format(MessageHelper.Get("30039", UserManager.Instance.User.Language), supp) + " > USR_SUPPLIER > " + linenumber);
                                }
                            }
                        }

                        if (!string.IsNullOrEmpty(authorizeddepartments))
                        {
                            var authdepartments = authorizeddepartments.Split(',');
                            foreach (var authdepartment in authdepartments)
                            {
                                var odepartment = new RepositoryDepartments().Get(authdepartment);
                                if (odepartment == null || (odepartment != null && odepartment.DEP_ACTIVE != "+"))
                                {
                                    throw new Exception(string.Format(MessageHelper.Get("30011", UserManager.Instance.User.Language), authdepartment) + " > USR_AUTHORIZEDDEPARTMENTS > " + linenumber);
                                }
                            }
                        }

                        if (!string.IsNullOrEmpty(customer))
                        {
                            var customers = customer.Split(',');
                            foreach (var cust in customers)
                            {
                                var ocustomer = new RepositoryCustomers().Get(cust);
                                if (ocustomer == null || (ocustomer != null && ocustomer.CUS_ACTIVE != '+'))
                                {
                                    throw new Exception(string.Format(MessageHelper.Get("30003", UserManager.Instance.User.Language), cust) + " > USR_CUSTOMER > " + linenumber);
                                }
                            }
                        }

                        var usrcustomfieldvalues = new List<TMCUSTOMFIELDVALUES>();
                        if (!string.IsNullOrEmpty(branch))
                        {

                            var brn = new RepositoryBranches().Get(branch);
                            if (brn == null || (brn != null && brn.BRN_ACTIVE != '+'))
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30016", UserManager.Instance.User.Language), branch) + " > SUBE > " + linenumber);
                            }

                            usrcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                            {
                                CFV_ID = 0,
                                CFV_SUBJECT = "USER",
                                CFV_SOURCE = usercode,
                                CFV_CODE = "SUBE",
                                CFV_TYPE = "CUSTOMER",
                                CFV_TEXT = branch,
                                CFV_DATETIME = null,
                                CFV_NUM = null,
                                CFV_RECORDVERSION = 0
                            });
                        }

                        var passPattern = @"^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$";
                        var options = RegexOptions.Singleline;
                        var m = Regex.Match(pass, passPattern, options);

                        if (!m.Success)
                        {
                            throw new Exception(MessageHelper.Get("20250", UserManager.Instance.User.Language) + " > USR_PASSWORD > " + linenumber);
                        }


                        lstofusers.Add(new UserModel
                        {
                            User = new TMUSERS
                            {
                                USR_CODE = usercode,
                                USR_PASSWORD = PasswordHelper.Md5Encrypt(UniqueStringId.Generate()),
                                USR_DESC = description,
                                USR_ORG = organization,
                                USR_DEPARTMENT = department,
                                USR_TRADE = trade,
                                USR_AUTHORIZEDDEPARTMENTS = authorizeddepartments,
                                USR_TYPE = usertype,
                                USR_GROUP = usergroup,
                                USR_CUSTOMER = customer,
                                USR_SUPPLIER = supplier,
                                USR_LANG = language,
                                USR_DEFAULTINBOX = "PERSONAL",
                                USR_EMAIL = email,
                                USR_ALTERNATEEMAIL = alternativeemail,
                                USR_PRICINGCODE = pricingcode,
                                USR_ACTIVE = active,
                                USR_TMS = tms,
                                USR_MOBILE = mobile,
                                USR_REQUESTOR = requestor,
                                USR_VIEWWEEKLYCALENDAR = viewweeklycalendar,
                                USR_STARTDATE = dtstart,
                                USR_ENDDATE = dtend,
                                USR_CREATED = DateTime.Now,
                                USR_CREATEDBY = UserManager.Instance.User.Code,
                                USR_TIMEKEEPINGOFFICER = timekeepingofficer,
                                USR_RECORDVERSION = 0
                            },
                            Values = line,
                            CustomFieldValues = usrcustomfieldvalues.ToArray()

                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofusers.Count > 0)
                {
                    lstError = new RepositoryUsers().Save(lstofusers, batchProgress);
                }

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

                
            }

            return errList;
        }

        private List<ErrLine> ProcessBLOC(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines.Count > 0)
            {
                var i = 1;
                var lstoflocations = new List<LocationModel>();

                var duplicates = lines.GroupBy(x => x[0])
                    .Where(g => !string.IsNullOrEmpty(g.Key) && g.Count() > 1)
                    .Select(y => y.Key)
                    .ToList();

                if (duplicates.Count > 0)
                {
                    throw new Exception(MessageHelper.Get("30018", UserManager.Instance.User.Language));
                }

                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 10)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var locationcode = line[0].Trim();
                        var locationdesc = line[1].Trim();
                        var organization = line[2].Trim();
                        var department = line[3].Trim();
                        var branchcode = line[4].Trim();
                        var parentlocation = !string.IsNullOrEmpty(line[5]) ? line[5].Trim() : null;
                        var lat = !string.IsNullOrEmpty(line[6]) ? line[6].Trim() : null;
                        var lng = !string.IsNullOrEmpty(line[7]) ? line[7].Trim() : null;
                        var barcode = !string.IsNullOrEmpty(line[8]) ? line[8].Trim() : null;
                        var active = line[9];

                        if (!Parser.ParseChar(active, out var iActive))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), active), i));
                        }

                        if (string.IsNullOrEmpty(locationcode) ||
                            string.IsNullOrEmpty(locationdesc) ||
                            string.IsNullOrEmpty(organization) ||
                            string.IsNullOrEmpty(department) ||
                            string.IsNullOrEmpty(branchcode))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}",
                                MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        var brn = new RepositoryBranches().Get(branchcode);
                        var org = new RepositoryOrgs().Get(organization);
                        var dep = new RepositoryDepartments().Get(department);
                        var loc = new RepositoryLocations().Get(locationcode);

                        if (!string.IsNullOrEmpty(parentlocation))
                        {
                            var ploc = new RepositoryLocations().Get(parentlocation);
                            if (ploc == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30013", UserManager.Instance.User.Language),
                                                        parentlocation) + " > " + linenumber);
                            }
                        }

                        if (loc != null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30033", UserManager.Instance.User.Language), branchcode) + " > " + linenumber);
                        }

                        if (brn == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30016", UserManager.Instance.User.Language), branchcode) + " > " + linenumber);
                        }

                        if (org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > " + linenumber);
                        }

                        if (dep == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30011", UserManager.Instance.User.Language), department) + " > " + linenumber);
                        }

                        lstoflocations.Add(new LocationModel
                        {
                            Location = new TMLOCATIONS
                            {
                                LOC_CODE = locationcode,
                                LOC_DESC = locationdesc,
                                LOC_ORG = organization,
                                LOC_BRANCH = branchcode,
                                LOC_DEPARTMENT = department,
                                LOC_PARENT = parentlocation,
                                LOC_LATITUDE = lat,
                                LOC_LONGITUDE = lng,
                                LOC_BARCODE = barcode,
                                LOC_CREATED = DateTime.Now,
                                LOC_CREATEDBY = UserManager.Instance.User.Code,
                                LOC_ACTIVE = iActive
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstoflocations.Count > 0)
                    lstError = new RepositoryLocations().Save(lstoflocations, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

            }

            return errList;
        }

        private List<ErrLine> ProcessBRST(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            var columncount = 5;
            if (lines.Count > 0)
            {
                var i = 1;
                var lstofissuereturnparts = new List<InventoryReceiptModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != columncount)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        var emptycounts = line.Count(x => x.Equals(string.Empty));
                        if (emptycounts == columncount)
                        {
                            continue;
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var transactionstr = line[0];
                        var partcode = line[1];
                        var bin = line[2];
                        var quantity = line[3];
                        var price = line[4];

                        if (string.IsNullOrEmpty(transactionstr) ||
                            string.IsNullOrEmpty(partcode) ||
                            string.IsNullOrEmpty(bin) ||
                            string.IsNullOrEmpty(quantity) ||
                            string.IsNullOrEmpty(price))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        int vTransaction;
                        decimal vPrice;
                        decimal vQty;

                        if (!int.TryParse(transactionstr, out vTransaction))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), transactionstr), i));
                        }

                        if (!decimal.TryParse(price, out vPrice))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), price), i));
                        }

                        if (!decimal.TryParse(quantity, out vQty))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), quantity), i));
                        }

                        var trx = new RepositoryPartTransaction().Get(vTransaction);
                        var part = new RepositoryParts().GetByCode(partcode);
                        var bino = new RepositoryBins().Get(new TMBINS { BIN_WAREHOUSE = trx.PTR_WAREHOUSE, BIN_CODE = bin });

                        if (trx.PTR_ID != 0 && trx.PTR_STATUS != "N")
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), trx.PTR_ID) + " > PTR_STATUS > " + linenumber);
                        }

                        if (part != null && part.PAR_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), partcode) + " > PAR_ACTIVE > " + linenumber);
                        }

                        if (bino != null && bino.BIN_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), bin) + " > BIN_ACTIVE > " + linenumber);
                        }

                        if (trx.PTR_ID == 0)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30040", UserManager.Instance.User.Language), transactionstr) + " > " + linenumber);
                        }

                        if (part == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30001", UserManager.Instance.User.Language), partcode));
                        }

                        if (bino == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30026", UserManager.Instance.User.Language), bin) + " > " + linenumber);
                        }

                        lstofissuereturnparts.Add(new InventoryReceiptModel
                        {
                            IssueReturn = new InventoryReceiptPart
                            {
                                Part = part.PAR_ID,
                                Bin = bino.BIN_CODE,
                                Price = vPrice,
                                Quantity = vQty,
                                Transaction = trx.PTR_ID,
                                Warehouse = trx.PTR_WAREHOUSE,
                                Type = trx.PTR_TYPE
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofissuereturnparts.Count > 0)
                    lstError = new RepositoryPartTransactionLine().Save(lstofissuereturnparts, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

                
            }

            return errList;
        }

        private List<ErrLine> ProcessBTPR(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            var columncount = 8;
            if (lines.Count > 0)
            {
                var i = 1;
                var lstofissuereturnparts = new List<IssueReturnModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != columncount)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        var emptycounts = line.Count(x => x.Equals(string.Empty));
                        if (emptycounts == columncount)
                        {
                            continue;
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var taskid = line[0];
                        var activity = line[1];
                        var transactiontype = line[2];
                        var warehouse = line[3];
                        var partcode = line[4];
                        var partreference = line[5];
                        var bincode = line[6];
                        var quantity = line[7];

                        if (string.IsNullOrEmpty(taskid) ||
                            string.IsNullOrEmpty(activity) ||
                            string.IsNullOrEmpty(transactiontype) ||
                            string.IsNullOrEmpty(warehouse) ||
                            string.IsNullOrEmpty(partcode) ||
                            string.IsNullOrEmpty(bincode) ||
                            string.IsNullOrEmpty(quantity))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        int vTask;
                        int vActivity;
                        decimal vQty;

                        if (!int.TryParse(taskid, out vTask))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), taskid), i));
                        }
                        if (!int.TryParse(activity, out vActivity))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), activity), i));
                        }

                        if (!decimal.TryParse(quantity, out vQty))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), quantity), i));
                        }

                        var task = new RepositoryTasks().Get(vTask);
                        var part = new RepositoryParts().GetByCode(partcode);
                        var bino = new RepositoryBins().Get(new TMBINS { BIN_WAREHOUSE = warehouse, BIN_CODE = bincode });

                        if (task == null)
                        {
                            throw new Exception(MessageHelper.Get("10191", UserManager.Instance.User.Language));
                        }

                        if (part == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30001", UserManager.Instance.User.Language), partcode));
                        }
                        if (part != null && part.PAR_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), partcode) + " > PAR_ACTIVE > " + linenumber);
                        }

                        if (bino == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30026", UserManager.Instance.User.Language), bincode) + " > " + linenumber);
                        }
                        if (bino != null && bino.BIN_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), bincode) + " > BIN_ACTIVE > " + linenumber);
                        }

                        if (!new[] { "I", "RT" }.Contains(transactiontype))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), transactiontype), i));
                        }

                        var avgprice = new StockHelper().GetAvgPrice(new StockEntry
                        {
                            Trxtype = transactiontype,
                            Warehouse = warehouse,
                            Bin = bincode,
                            Part = part.PAR_ID
                        });

                        lstofissuereturnparts.Add(new IssueReturnModel
                        {
                            Transaction = new TMPARTTRANS {
                                PTR_DESCRIPTION =  task.TSK_SHORTDESC,
                                PTR_TYPE = transactiontype,
                                PTR_ORGANIZATION = task.TSK_ORGANIZATION,
                                PTR_TRANSACTIONDATE =  DateTime.Now,
                                PTR_WAREHOUSE = warehouse,
                                PTR_STATUS = "N",
                                PTR_CREATED = DateTime.Now,
                                PTR_CREATEDBY = UserManager.Instance.User.Code
                            },
                            TransactionLines = new[]
                            {
                                new TMPARTTRANLINES
                                {
                                    PTL_ID = 0,
                                    PTL_TRANSACTIONDATE = DateTime.Now,
                                    PTL_PART = part.PAR_ID,
                                    PTL_PARTREFERENCE= partreference,
                                    PTL_TYPE = transactiontype,
                                    PTL_TASK = task.TSK_ID,
                                    PTL_ACTIVITY = vActivity,
                                    PTL_WAREHOUSE = warehouse,
                                    PTL_BIN = bincode,
                                    PTL_QTY = vQty,
                                    PTL_PRICE = avgprice.HasValue ? avgprice.Value : 0,
                                    PTL_CREATED = DateTime.Now,
                                    PTL_CREATEDBY = UserManager.Instance.User.Code 
                                }
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofissuereturnparts.Count > 0)
                    lstError = new RepositoryPartTransaction().Save(lstofissuereturnparts, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);


            }

            return errList;
        }

        private List<ErrLine> ProcessBDLT(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            var columncount = 1;
            if (lines.Count > 0)
            {
                var i = 1;
                var lstoftasks = new List<TaskModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != columncount)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        var emptycounts = line.Count(x => x.Equals(string.Empty));
                        if (emptycounts == columncount)
                        {
                            continue;
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var taskid = line[0];
                       

                        if (string.IsNullOrEmpty(taskid))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        int vTask; 
                        if (!int.TryParse(taskid, out vTask))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), taskid), i));
                        }
                        
                        var task = new RepositoryTasks().Get(vTask);
                        if (task == null)
                        {
                            throw new Exception(MessageHelper.Get("10191", UserManager.Instance.User.Language));
                        }


                        lstoftasks.Add(new TaskModel
                        {
                            Task = new TMTASKS
                            {
                                TSK_ID = task.TSK_ID
                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
     
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstoftasks.Count > 0)
                    lstError = new RepositoryTasks().Delete(lstoftasks, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);


            }

            return errList;
        }

        private List<ErrLine> ProcessBPAR(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines != null && lines.Count > 0)
            {
                var i = 1;
                
                var lstofparts = new List<PartModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 9)
                        {
                            throw new Exception(string.Format(
                                MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var organization = !string.IsNullOrEmpty(line[0]) ? line[0].Trim() : null;
                        var type = !string.IsNullOrEmpty(line[1]) ? line[1].Trim() : null;
                        var hieararchy = !string.IsNullOrEmpty(line[2]) ? line[2].Trim() : null;
                        var description = !string.IsNullOrEmpty(line[3]) ? line[3].Trim() : null;
                        var brand = !string.IsNullOrEmpty(line[4]) ? line[4].Trim() : null;
                        var uom = !string.IsNullOrEmpty(line[5]) ? line[5].Trim() : null;
                        var unitsalesprice = !string.IsNullOrEmpty(line[6]) ? line[6].Trim() : null;
                        var currency = !string.IsNullOrEmpty(line[7]) ? line[7].Trim() : null;
                        var active = !string.IsNullOrEmpty(line[8]) ? line[8].Trim() : "+";

                        if (string.IsNullOrEmpty(organization) ||
                            string.IsNullOrEmpty(type) ||
                            string.IsNullOrEmpty(hieararchy) ||
                            string.IsNullOrEmpty(uom))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}",
                                MessageHelper.Get("30020", UserManager.Instance.User.Language), linenumber, lines.Count));
                        }


                        if (!Parser.ParseChar(active, out var iActive) && !new[] { "+", "-" }.Contains(active))
                        {
                            throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), active), i));
                        }

                        decimal? vUnitSalesPrice = null;
                        if (!string.IsNullOrEmpty(unitsalesprice))
                        {
                            if (!NumberHelper.ParseDecimal(unitsalesprice, out var pUnitSalesPrice))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitsalesprice), i));
                            }
                            vUnitSalesPrice = pUnitSalesPrice;
                        }
              

                        var o_org = new RepositoryOrgs().Get(organization);
                        var o_typ = new RepositoryTypes().Get(new TMTYPES() {TYP_CODE = type, TYP_ENTITY = "PART"});
                        var o_hry = new RepositoryTypeLevels().GetByCode(hieararchy);
                        var o_uom = new RepositoryUoms().Get(uom);
                        
                        TMCURRENCIES o_curr = null;
                        if (!string.IsNullOrEmpty(currency))
                        {
                            o_curr = new RepositoryCurrencies().Get(currency);
                            if (o_curr == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), currency) + " > " + linenumber);
                            }
                        }

                        if (o_org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > " + linenumber);
                        }
                        if (o_typ == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30008", UserManager.Instance.User.Language), type));
                        }
                        if (o_hry == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30104", UserManager.Instance.User.Language), hieararchy) + " > " + linenumber);
                        }
                        if (o_uom == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30047", UserManager.Instance.User.Language), uom) + " > " + linenumber);
                        }

                        lstofparts.Add(new PartModel
                        {
                            Part = new TMPARTS
                            {
                                PAR_DESC = string.IsNullOrEmpty(description) ? o_hry.TLV_DESC  : description,
                                PAR_ORG = o_org.ORG_CODE,
                                PAR_TYPEENTITY = "PART",
                                PAR_TYPE = o_typ.TYP_CODE,
                                PAR_BRAND = brand,
                                PAR_UOM = o_uom.UOM_CODE,
                                PAR_UNITSALESPRICE = vUnitSalesPrice,
                                PAR_CURR = o_curr!=null && vUnitSalesPrice.HasValue ? o_curr.CUR_CODE : null,
                                PAR_TYPELEVEL = o_hry.TLV_ID,
                                PAR_CREATED = DateTime.Now,
                                PAR_CREATEDBY = UserManager.Instance.User.Code,
                                PAR_ACTIVE = iActive,
                                PAR_RECORDVERSION = 0

                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofparts.Count > 0)
                    lstError = new RepositoryParts().Save(lstofparts, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

            }

            return errList;
        }

        private List<ErrLine> ProcessBQPR(List<string[]> lines)
        {
            var errList = new List<ErrLine>();
            if (lines != null && lines.Count > 0)
            {
                var i = 1;

                var lstofquoparts = new List<QuotationPartModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != 13)
                        {
                            throw new Exception(string.Format(
                                MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var quotation = !string.IsNullOrEmpty(line[0]) ? line[0].Trim() : null;
                        var partcode = !string.IsNullOrEmpty(line[1]) ? line[1].Trim() : null;
                        var brand = !string.IsNullOrEmpty(line[2]) ? line[2].Trim() : null;
                        var qty = !string.IsNullOrEmpty(line[3]) ? line[3].Trim() : null;
                        var partreference = !string.IsNullOrEmpty(line[4]) ? line[4].Trim() : null;
                        var unitpurchaseprice = !string.IsNullOrEmpty(line[5]) ? line[5].Trim() : null;
                        var purchasediscountrate = !string.IsNullOrEmpty(line[6]) ? line[6].Trim() : null;
                        var purchasecurrency = !string.IsNullOrEmpty(line[7]) ? line[7].Trim() : null;
                        var purchaseexch = !string.IsNullOrEmpty(line[8]) ? line[8].Trim() : null;
                        var unitsalesprice = !string.IsNullOrEmpty(line[9]) ? line[9].Trim() : null;
                        var salesdiscountrate = !string.IsNullOrEmpty(line[10]) ? line[10].Trim() : null;
                        var salescurrency = !string.IsNullOrEmpty(line[11]) ? line[11].Trim() : null;
                        var salesexch = !string.IsNullOrEmpty(line[12]) ? line[12].Trim() : null;

                        if (string.IsNullOrEmpty(quotation) ||
                            string.IsNullOrEmpty(partcode) ||
                            string.IsNullOrEmpty(brand) ||
                            string.IsNullOrEmpty(qty))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}",
                                MessageHelper.Get("30020", UserManager.Instance.User.Language), linenumber, lines.Count));
                        }

    
                        if (!NumberHelper.ParseInt(quotation, out var quotationId))
                            throw new Exception(string.Format("{0} => {1}",
                                string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), quotation), i));
    

                        if (!NumberHelper.ParseDecimal(qty, out var vQty))
                            throw new Exception(string.Format("{0} => {1}",
                                string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), qty), i));


                        decimal? vUnitPurchasePrice = null;
                        if (!string.IsNullOrEmpty(unitpurchaseprice))
                        {
                            if (!NumberHelper.ParseDecimal(unitpurchaseprice, out var pUnitPurchasePrice))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitpurchaseprice), i));
                            }
                            vUnitPurchasePrice = pUnitPurchasePrice;
                        }

                        int? vPurchaseDiscountRate = null;
                        if (!string.IsNullOrEmpty(purchasediscountrate))
                        {
                            if (!NumberHelper.ParseInt(purchasediscountrate, out var pPurchaseDiscountRate))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), purchasediscountrate), i));
                            }
                            vPurchaseDiscountRate = pPurchaseDiscountRate;
                        }

                        decimal? vPurchaseExch = null;
                        if (!string.IsNullOrEmpty(purchaseexch))
                        {
                            if (!NumberHelper.ParseDecimal(purchaseexch, out var pPurchaseExch))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), purchaseexch), i));
                            }
                            vPurchaseExch = pPurchaseExch;
                        }

                        decimal? vUnitSalesPrice = null;
                        if (!string.IsNullOrEmpty(unitsalesprice))
                        {
                            if (!NumberHelper.ParseDecimal(unitsalesprice, out var pUnitSalesPrice))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), unitsalesprice), i));
                            }
                            vUnitSalesPrice = pUnitSalesPrice;
                        }

                        int? vSalesDiscountRate = null;
                        if (!string.IsNullOrEmpty(salesdiscountrate))
                        {
                            if (!NumberHelper.ParseInt(salesdiscountrate, out var pSalesDiscountRate))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), salesdiscountrate), i));
                            }
                            vSalesDiscountRate = pSalesDiscountRate;
                        }

                        decimal? vSalesExch = null;
                        if (!string.IsNullOrEmpty(salesexch))
                        {
                            if (!NumberHelper.ParseDecimal(salesexch, out var pSalesExch))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), salesexch), i));
                            }
                            vSalesExch = pSalesExch;
                        }


                        var o_part = new RepositoryParts().GetByCode(partcode);
                        var o_quo = new RepositoryQuotations().Get(quotationId);

                        TMCURRENCIES o_purchasecurr = null;
                        if (!string.IsNullOrEmpty(purchasecurrency))
                        {
                            o_purchasecurr = new RepositoryCurrencies().Get(purchasecurrency);
                            if (o_purchasecurr == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), purchasecurrency) + " > " + linenumber);
                            }
                        }

                        TMCURRENCIES o_salescurr = null;
                        if (!string.IsNullOrEmpty(salescurrency))
                        {
                            o_salescurr = new RepositoryCurrencies().Get(salescurrency);
                            if (o_salescurr == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30002", UserManager.Instance.User.Language), salescurrency) + " > " + linenumber);
                            }
                        }

                        if (o_quo == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30105", UserManager.Instance.User.Language), quotation) + " > " + linenumber);
                        }
                        if (o_part == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30001", UserManager.Instance.User.Language), partcode));
                        }


                        if (o_part != null && o_part.PAR_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), partcode) + " > PAR_ACTIVE > " + linenumber);
                        }



                        var f_unitPurchasePrice = vUnitPurchasePrice.HasValue && vPurchaseDiscountRate.HasValue
                            ? vUnitPurchasePrice * ((decimal)(1 - (vPurchaseDiscountRate * 1.0 / 100)))
                            : vUnitPurchasePrice;


                        var f_unitSalesPrice = vUnitSalesPrice.HasValue && vSalesDiscountRate.HasValue
                            ? vUnitSalesPrice * (1 - ((decimal)(vSalesDiscountRate * 1.0 / 100)))
                            : vUnitSalesPrice;

                        if (o_purchasecurr != null && !vPurchaseExch.HasValue)
                        {
                            var latestexch = new RepositoryExchRates().GetLatestExchRate(new TMEXCHRATES
                            {
                                CRR_CURR = o_purchasecurr.CUR_CODE,
                                CRR_BASECURR = o_quo.QUO_ORGANIZATIONCURR
                            });
                            if (latestexch != null) vPurchaseExch = latestexch.CRR_EXCH;
                        }

                        if (o_salescurr != null && !vSalesExch.HasValue)
                        {
                            var latestexch = new RepositoryExchRates().GetLatestExchRate(new TMEXCHRATES
                            {
                                CRR_CURR = o_salescurr.CUR_CODE,
                                CRR_BASECURR = o_quo.QUO_ORGANIZATIONCURR
                            });
                            if (latestexch != null) vSalesExch = latestexch.CRR_EXCH;
                        }

                        lstofquoparts.Add(new QuotationPartModel
                        {
                            Part = new TMQUOTATIONPART
                            {
                                PAR_QUOTATION = quotationId,
                                PAR_PART = (int)o_part.PAR_ID,
                                PAR_BRAND = brand,
                                PAR_QTY = vQty,
                                PAR_UNITPURCHASEPRICE = vUnitPurchasePrice,
                                PAR_PURCHASEDISCOUNTRATE = vPurchaseDiscountRate,
                                PAR_PURCHASEEXCH = vPurchaseExch,
                                PAR_PURCHASEDISCOUNTEDUNITPRICE = f_unitPurchasePrice,
                                PAR_PURCHASEPRICECURR = o_purchasecurr!=null ? o_purchasecurr.CUR_CODE : null,
                                PAR_UNITSALESPRICE = vUnitSalesPrice,
                                PAR_SALESDISCOUNTRATE = vSalesDiscountRate,
                                PAR_SALESEXCH = vSalesExch,
                                PAR_SALESDISCOUNTEDUNITPRICE = f_unitSalesPrice,
                                PAR_SALESPRICECURR = o_salescurr != null ? o_salescurr.CUR_CODE : null,
                                PAR_REFERENCE = partreference,
                                PAR_CREATED = DateTime.Now,
                                PAR_CREATEDBY = UserManager.Instance.User.Code,
                                PAR_RECORDVERSION = 0,
                                PAR_UPDATED = null,
                                PAR_UPDATEDBY = null,
                                PAR_TOTALPURCHASEPRICE = f_unitPurchasePrice.HasValue ? f_unitPurchasePrice * vQty : null,
                                PAR_TOTALSALESPRICE = f_unitSalesPrice.HasValue ? f_unitSalesPrice * vQty : null,

                            },
                            Values = line
                        });
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                        i++;
                    }
                }

                List<ErrLine> lstError = null;
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstofquoparts.Count > 0)
                    lstError = new RepositoryQuotationPart().Save(lstofquoparts, batchProgress);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError != null)
                    errList.AddRange(lstError);

            }

            return errList;
        }


        private List<ErrLine> ProcessEquipments(string equipmentType, List<string[]> lines)
        {
            var type = equipmentType;
            string capacity = null;

            var typeisspecified = !string.IsNullOrEmpty(equipmentType);
            if (string.IsNullOrEmpty(type))
            {
                equipmentfieldcount = 18;
            }

            IList<TMCUSTOMFIELDRELATIONS> customfieldmappings = null;
            IList<TMCUSTOMFIELDS> customfields = null;
            if (!string.IsNullOrEmpty(type))
            {
                var repositoryCustomFieldRelations = new RepositoryCustomFieldRelations();
                var repositoryCustomFields = new RepositoryCustomFields();

                JArray jTypes = new JArray { "*", type };
                customfieldmappings = repositoryCustomFieldRelations.List(new GridRequest
                {
                    loadall = true,
                    filter = new GridFilters
                    {
                        Filters = new List<GridFilter>
                        {
                            new GridFilter { Field = "CFR_ENTITY", Value = "EQUIPMENT", Operator = "eq" },
                            new GridFilter { Field = "CFR_TYPE", Value = jTypes, Operator = "in" },
                            new GridFilter { Field = "CFR_AUTH", Value = "H", Operator = "neq" }
                        }
                    },
                    sort = new List<GridSort>
                    {
                        new GridSort { Field = "CFR_GROUPORDER", Dir = "asc"},
                        new GridSort { Field = "CFR_ORDER", Dir = "asc" }
                    }
                });
                var fields = customfieldmappings.DistinctBy(x => x.CFR_CODE).Select(x => x.CFR_CODE).ToList();
                customfields = repositoryCustomFields.ListByCodes(fields.ToArray<object>());
            }

            var errList = new List<ErrLine>();
            var columncount = equipmentfieldcount + (customfieldmappings != null ? customfieldmappings.Count : 0);

            if (lines.Count > 0)
            {
                var i = 1;
                var lstofequipments = new List<EquipmentModel>();
                foreach (var line in lines)
                {
                    try
                    {
                        if (line.Length != columncount)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30000", UserManager.Instance.User.Language), i, line.Length));
                        }

                        var emptycounts = line.Count(x => x.Equals(string.Empty));
                        if (emptycounts == columncount)
                        {
                            continue;
                        }

                        if (i == 1)
                        {
                            i++;
                            errList.Add(new ErrLine
                            {
                                Values = line,
                                LineType = "HDR",
                                ErrMsg = null
                            });
                            continue;
                        }

                        var linenumber = (i - 1);
                        var equipmentcode = line[0];
                        var organization = line[1];
                        var department = line[2];
                        var description = line[3];
                        var brand = line[4];
                        var model = line[5];
                        var serialno = line[6];
                        var guaranteestatus = line[7];
                        var periodic_maintenance_required = line[8];
                        var reference = !string.IsNullOrEmpty(line[9]) ? line[9] : null;
                        var installationdate = !string.IsNullOrEmpty(line[10]) ? line[10] : null;
                        var parentequipment = !string.IsNullOrEmpty(line[11]) ? line[11] : null;
                        var customer = line[12];
                        var branch = line[13];
                        var location = line[14];
                        var active = Convert.ToChar(line[15]);

                        if (string.IsNullOrEmpty(type))
                        {
                            type = line[16];
                            capacity = line[17];
                        }

                        if (string.IsNullOrEmpty(equipmentcode) ||
                            string.IsNullOrEmpty(organization) ||
                            string.IsNullOrEmpty(department) ||
                            string.IsNullOrEmpty(description) ||
                            string.IsNullOrEmpty(brand) ||
                            string.IsNullOrEmpty(model) ||
                            string.IsNullOrEmpty(serialno) ||
                            string.IsNullOrEmpty(guaranteestatus) ||
                            string.IsNullOrEmpty(periodic_maintenance_required) ||
                            string.IsNullOrEmpty(customer) ||
                            string.IsNullOrEmpty(branch) ||
                            string.IsNullOrEmpty(location) ||
                            string.IsNullOrEmpty(type) ||
                            !new[] { '+', '-' }.Contains(active))
                        {
                            throw new Exception(string.Format("{0} => {1} / {2}", MessageHelper.Get("30020", UserManager.Instance.User.Language), i, lines.Count));
                        }

                        var org = new RepositoryOrgs().Get(organization);
                        var dep = new RepositoryDepartments().Get(department);
                        var cus = new RepositoryCustomers().Get(customer);
                        var brn = new RepositoryBranches().Get(branch);
                        var loc = new RepositoryLocations().Get(location);
                        var bnd = new RepositoryBrands().Get(brand);
                        var typ = new RepositoryTypes().Get(new TMTYPES { TYP_CODE = type, TYP_ENTITY = "EQUIPMENT" });

                        TMEQUIPMENTS pEquipment = null;
                        if (!string.IsNullOrEmpty(parentequipment))
                        {
                            pEquipment = new RepositoryEquipments().GetByCode(parentequipment);
                        }

                        IList<TMCUSTOMFIELDVALUES> equipmentcustomfieldvalues = new List<TMCUSTOMFIELDVALUES>();
                        if (typeisspecified)
                        {
                            equipmentcustomfieldvalues = BuildCustomFieldList(customfields, customfieldmappings, line, linenumber);
                        };

                        if (org == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > " + linenumber);
                        }

                        if (dep != null && !new[] { organization, "*" }.Contains(dep.DEP_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > DEP_ORG > " + linenumber);
                        }

                        if (cus != null && !new[] { organization, "*" }.Contains(cus.CUS_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > CUS_ORG > " + linenumber);
                        }

                        if (brn != null && !new[] { organization, "*" }.Contains(brn.BRN_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > BRN_ORG > " + linenumber);
                        }

                        if (loc != null && !new[] { organization, "*" }.Contains(loc.LOC_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > LOC_ORG > " + linenumber);
                        }

                        if (pEquipment != null && !new[] { organization, "*" }.Contains(pEquipment.EQP_ORG))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > EQP_ORG > " + linenumber);
                        }

                        if (typ != null && !new[] { organization, "*" }.Contains(typ.TYP_ORGANIZATION))
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30007", UserManager.Instance.User.Language), organization) + " > TYP_ORGANIZATION > " + linenumber);
                        }

                        if (org != null && org.ORG_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > " + linenumber);
                        }

                        if (dep != null && dep.DEP_ACTIVE != "+")
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > DEP_ACTIVE > " + linenumber);
                        }

                        if (cus != null && cus.CUS_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > CUS_ACTIVE > " + linenumber);
                        }

                        if (brn != null && brn.BRN_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > BRN_ACTIVE > " + linenumber);
                        }

                        if (loc != null && loc.LOC_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > LOC_ACTIVE > " + linenumber);
                        }

                        if (bnd != null && bnd.BRA_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > BRA_ACTIVE > " + linenumber);
                        }

                        if (pEquipment != null && pEquipment.EQP_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), organization) + " > EQP_ACTIVE > " + linenumber);
                        }

                        if (typ != null && typ.TYP_ACTIVE != '+')
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30025", UserManager.Instance.User.Language), type) + " > " + linenumber);
                        }

                        if (dep == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30011", UserManager.Instance.User.Language), department) + " > " + linenumber);
                        }

                        if (cus == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30003", UserManager.Instance.User.Language), customer) + " > " + linenumber);
                        }

                        if (brn == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30016", UserManager.Instance.User.Language), branch) + " > " + linenumber);
                        }

                        if (loc == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30013", UserManager.Instance.User.Language), location) + " > " + linenumber);
                        }

                        if (bnd == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30093", UserManager.Instance.User.Language), brand) + " > " + linenumber);
                        }

                        if (typ == null)
                        {
                            throw new Exception(string.Format(MessageHelper.Get("30008", UserManager.Instance.User.Language), type) + " > " + linenumber);
                        }

                        if ((brn.BRN_CUSTOMER != cus.CUS_CODE))
                        {
                            throw new Exception(MessageHelper.Get("30094", UserManager.Instance.User.Language) + " > " + linenumber);
                        }

                        if (!string.IsNullOrEmpty(capacity))
                        {
                            var o_cf = new RepositoryLookupLines().GetLine("CUSTOMFIELD", "KAP", capacity);
                            if (o_cf == null)
                            {
                                throw new Exception(string.Format(MessageHelper.Get("30096", UserManager.Instance.User.Language), capacity) + " > " + linenumber);
                            }

                            equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                            {
                                CFV_ID = 0,
                                CFV_SUBJECT = "EQUIPMENT",
                                CFV_CODE = "KAP",
                                CFV_TYPE = typ.TYP_CODE,
                                CFV_TEXT = capacity,
                                CFV_DATETIME = null,
                                CFV_NUM = null,
                                CFV_RECORDVERSION = 0
                            });
                        }

                        lstofequipments.Add(new EquipmentModel
                        {
                            Equipment = new TMEQUIPMENTS
                            {
                                EQP_CODE = equipmentcode,
                                EQP_ORG = organization,
                                EQP_DEPARTMENT = department,
                                EQP_DESC = description,
                                EQP_TYPE = typ.TYP_CODE,
                                EQP_TYPEENTITY = "EQUIPMENT",
                                EQP_INSDATE = installationdate != null ? OviShared.GetDateTimeFromString(installationdate) : (DateTime?)null,
                                EQP_ACTIVE = active,
                                EQP_BRANCH = branch,
                                EQP_LOCATION = location,
                                EQP_BRAND = brand,
                                EQP_CUSTOMER = customer,
                                EQP_SERIALNO = serialno,
                                EQP_MODEL = model,
                                EQP_PARENT = pEquipment != null ? pEquipment.EQP_ID : default(long?),
                                EQP_GUARANTEESTATUS = guaranteestatus,
                                EQP_PERIODICMAINTENANCEREQUIRED = periodic_maintenance_required,
                                EQP_REFERENCENO = reference,
                                EQP_CREATED = DateTime.Now,
                                EQP_CREATEDBY = UserManager.Instance.User.Code,
                            },
                            CustomFieldValues = equipmentcustomfieldvalues.ToArray()
                            
                        });

                        batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i - 1).ToString(), lines.Count.ToString());
                        batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                    }
                    catch (Exception exc)
                    {
                        errList.Add(new ErrLine
                        {
                            Values = line,
                            LineType = "LINE",
                            ErrMsg = exc.Message
                        });
                    }
                    finally
                    {
                        i++;
                    }
                }

                List<ErrLine> lstError = null;         
                batchProgress.PRG_STATUS = "2";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                
                if (lstofequipments.Count > 0)
                     lstError = new RepositoryEquipments().Save(lstofequipments);

                batchProgress.PRG_STATUS = "3";
                batchProgressDataHelper.UpdateBatchProgress(batchProgress);

                if (lstError!=null)
                    errList.AddRange(lstError);
            }

            return errList;
        }

        private static List<TMCUSTOMFIELDVALUES> BuildCustomFieldList(
         IList<TMCUSTOMFIELDS> customfields,
         IList<TMCUSTOMFIELDRELATIONS> customfieldmappings,
         string[] line,
         int linenumber)
        {
            var equipmentcustomfieldvalues = new List<TMCUSTOMFIELDVALUES>();
            var cfindex = 0;
            foreach (var cf in customfieldmappings)
            {
                var index = equipmentfieldcount + cfindex;
                var customfieldvalue = !string.IsNullOrEmpty(line[index]) ? line[index] : null;
                var customfield = customfields.FirstOrDefault(x => (x.CFD_CODE == cf.CFR_CODE));

                if (!string.IsNullOrEmpty(customfieldvalue))
                {
                    switch (customfield.CFD_FIELDTYPE)
                    {
                        case "LOOKUP":
                            {
                                var o_cf = new RepositoryLookupLines().GetLine("CUSTOMFIELD", cf.CFR_CODE, customfieldvalue);
                                if (o_cf == null)
                                {
                                    throw new Exception(string.Format(MessageHelper.Get("30096", UserManager.Instance.User.Language), customfieldvalue) + " > " + linenumber);
                                }

                                equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                                {
                                    CFV_ID = 0,
                                    CFV_SUBJECT = cf.CFR_ENTITY,
                                    CFV_SOURCE = null,
                                    CFV_CODE = cf.CFR_CODE,
                                    CFV_TYPE = cf.CFR_TYPE,
                                    CFV_TEXT = customfieldvalue,
                                    CFV_DATETIME = null,
                                    CFV_NUM = null,
                                    CFV_RECORDVERSION = 0
                                });
                                break;
                            }
                        case "ENTITY":
                            {
                                if (!new EntityHelper().CheckEntity(customfield.CFD_ENTITY, customfieldvalue))
                                {
                                    throw new Exception(string.Format(MessageHelper.Get("30096", UserManager.Instance.User.Language), customfieldvalue) + " > " + linenumber);
                                }

                                equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                                {
                                    CFV_ID = 0,
                                    CFV_SUBJECT = cf.CFR_ENTITY,
                                    CFV_SOURCE = null,
                                    CFV_CODE = cf.CFR_CODE,
                                    CFV_TYPE = cf.CFR_TYPE,
                                    CFV_TEXT = customfieldvalue,
                                    CFV_DATETIME = null,
                                    CFV_NUM = null,
                                    CFV_RECORDVERSION = 0
                                });
                                break;
                            }
                        case "FREETEXT":
                            {
                                equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                                {
                                    CFV_ID = 0,
                                    CFV_SUBJECT = cf.CFR_ENTITY,
                                    CFV_SOURCE = null,
                                    CFV_CODE = cf.CFR_CODE,
                                    CFV_TYPE = cf.CFR_TYPE,
                                    CFV_TEXT = customfieldvalue,
                                    CFV_DATETIME = null,
                                    CFV_NUM = null,
                                    CFV_RECORDVERSION = 0
                                });
                                break;
                            }
                        case "NUMERIC":
                            if (!NumberHelper.ParseDecimal(customfieldvalue, out _))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), customfieldvalue), linenumber));
                            }

                            equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                            {
                                CFV_ID = 0,
                                CFV_SUBJECT = cf.CFR_ENTITY,
                                CFV_SOURCE = null,
                                CFV_CODE = cf.CFR_CODE,
                                CFV_TYPE = cf.CFR_TYPE,
                                CFV_TEXT = null,
                                CFV_DATETIME = null,
                                CFV_NUM = decimal.Parse(customfieldvalue),
                                CFV_RECORDVERSION = 0
                            });
                            break;

                        case "CHECKBOX":
                            if (!new[] { "+", "-" }.Contains(customfieldvalue))
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), customfieldvalue), linenumber));
                            }

                            equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                            {
                                CFV_ID = 0,
                                CFV_SUBJECT = cf.CFR_ENTITY,
                                CFV_SOURCE = null,
                                CFV_CODE = cf.CFR_CODE,
                                CFV_TYPE = cf.CFR_TYPE,
                                CFV_TEXT = customfieldvalue,
                                CFV_DATETIME = null,
                                CFV_NUM = null,
                                CFV_RECORDVERSION = 0
                            });
                            break;

                        case "DATETIME":
                        case "DATE":
                        case "TIME":
                            var datetime = OviShared.GetNullableDateTimeFromString(customfieldvalue);
                            if (!datetime.HasValue)
                            {
                                throw new Exception(string.Format("{0} => {1}", string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), customfieldvalue), linenumber));
                            }

                            equipmentcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                            {
                                CFV_ID = 0,
                                CFV_SUBJECT = cf.CFR_ENTITY,
                                CFV_SOURCE = null,
                                CFV_CODE = cf.CFR_CODE,
                                CFV_TYPE = cf.CFR_TYPE,
                                CFV_TEXT = null,
                                CFV_DATETIME = OviShared.GetDateTimeFromString(customfieldvalue),
                                CFV_NUM = null,
                                CFV_RECORDVERSION = 0
                            });

                            break;
                    }
                }

                cfindex++;
            }

            return equipmentcustomfieldvalues;
        }

        private static List<TMCUSTOMFIELDVALUES> TaskCustomFieldValues(string cf_reportingrequired, string cf_waitingforworkpermit, string type, string cf_reportingsupplier)
        {
            var taskcustomfieldvalues = new List<TMCUSTOMFIELDVALUES>();
            if (!string.IsNullOrEmpty(cf_reportingrequired) && cf_reportingrequired == "+")
            {
                taskcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                {
                    CFV_ID = 0,
                    CFV_SUBJECT = "TASK",
                    CFV_SOURCE = null,
                    CFV_CODE = "RAPORC",
                    CFV_TYPE = type,
                    CFV_TEXT = cf_reportingrequired,
                    CFV_DATETIME = null,
                    CFV_NUM = null,
                    CFV_RECORDVERSION = 0
                });
            }

            if (!string.IsNullOrEmpty(cf_waitingforworkpermit) && cf_waitingforworkpermit == "+")
            {
                taskcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                {
                    CFV_ID = 0,
                    CFV_SUBJECT = "TASK",
                    CFV_SOURCE = null,
                    CFV_CODE = "ISIZNIBEK",
                    CFV_TYPE = type,
                    CFV_TEXT = cf_waitingforworkpermit,
                    CFV_DATETIME = null,
                    CFV_NUM = null,
                    CFV_RECORDVERSION = 0
                });
            }

            if (!string.IsNullOrEmpty(cf_reportingsupplier))
            {
                taskcustomfieldvalues.Add(new TMCUSTOMFIELDVALUES
                {
                    CFV_ID = 0,
                    CFV_SUBJECT = "TASK",
                    CFV_SOURCE = null,
                    CFV_CODE = "RAPORTED",
                    CFV_TYPE = type,
                    CFV_TEXT = cf_reportingsupplier,
                    CFV_DATETIME = null,
                    CFV_NUM = null,
                    CFV_RECORDVERSION = 0
                });
            }

            return taskcustomfieldvalues;
        }
    }
}