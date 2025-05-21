using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPARTTRANLINES_MAP : ClassMap<TMPARTTRANLINES>
    {
        public TMPARTTRANLINES_MAP()
        {
            Id(x => x.PTL_ID);
            Map(x => x.PTL_TRANSACTION);
            Map(x => x.PTL_LINE).Generated.Insert();
            Map(x => x.PTL_TRANSACTIONDESC).ReadOnly().Formula("(SELECT pt.PTR_DESCRIPTION FROM TMPARTTRANS pt WHERE pt.PTR_ID = PTL_TRANSACTION)");
            Map(x => x.PTL_TRANSACTIONDATE);
            Map(x => x.PTL_PART);
            Map(x => x.PTL_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = PTL_PART)");
            Map(x => x.PTL_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = PTL_PART)");
            Map(x => x.PTL_TYPE);
            Map(x => x.PTL_TASK);
            Map(x => x.PTL_TASKCATEGORY).ReadOnly().Formula("(SELECT dbo.GetDesc('TMCATEGORIES','CAT_DESC', c.CAT_CODE, c.CAT_DESC,:SessionContext.Language) FROM TMTASKS t, TMCATEGORIES c WHERE c.CAT_CODE = t.TSK_CATEGORY AND t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_TASKDESC).ReadOnly().Formula("(SELECT t.TSK_SHORTDESC FROM TMTASKS t WHERE t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_TASKEQPCODE).ReadOnly().Formula("(SELECT t.TSK_EQUIPMENT FROM TMTASKS t WHERE t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_TASKEQPDESC).ReadOnly().Formula("(SELECT e.EQP_DESC FROM TMEQUIPMENTS e WHERE e.EQP_ID = (SELECT t.TSK_EQUIPMENT FROM TMTASKS t WHERE t.TSK_ID = PTL_TASK))");
            Map(x => x.PTL_TASKCUSTOMER).ReadOnly().Formula("(SELECT t.TSK_CUSTOMER FROM TMTASKS t WHERE t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_TASKCUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMTASKS t, TMCUSTOMERS c WHERE c.CUS_CODE = t.TSK_CUSTOMER AND t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_TASKBRANCH).ReadOnly().Formula("(SELECT t.TSK_BRANCH FROM TMTASKS t WHERE t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_TASKBRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMTASKS t, TMBRANCHES b WHERE b.BRN_CODE = t.TSK_BRANCH AND t.TSK_ID = PTL_TASK)");
            Map(x => x.PTL_ACTIVITY);
            Map(x => x.PTL_WAREHOUSE);
            Map(x => x.PTL_WAREHOUSEDESC).ReadOnly().Formula("dbo.GetDesc('TMWAREHOUSES','WAH_DESC', PTL_WAREHOUSE, (SELECT w.WAH_DESC FROM TMWAREHOUSES w WHERE w.WAH_CODE = PTL_WAREHOUSE), :SessionContext.Language)");
            Map(x => x.PTL_BIN);
            Map(x => x.PTL_BINDESC).ReadOnly().Formula("(SELECT b.BIN_DESC FROM TMBINS b WHERE b.BIN_CODE = PTL_BIN AND b.BIN_WAREHOUSE = PTL_WAREHOUSE)");
            Map(x => x.PTL_PRICE);
            Map(x => x.PTL_QTY);
            Map(x => x.PTL_WAYBILL);
            Map(x => x.PTL_TRANSTATUS).ReadOnly().Formula("(SELECT t.PTR_STATUS FROM TMPARTTRANS t WHERE t.PTR_ID = PTL_TRANSACTION)");
            Map(x => x.PTL_CREATED);
            Map(x => x.PTL_CREATEDBY);
            Map(x => x.PTL_RECORDVERSION).Default("0");
            Map(x => x.PTL_PURCHASEORDER);
            Map(x => x.PTL_PURCHASEORDERLINE);
            Map(x => x.PTL_PARTREFERENCE);

        }
    }
 }
 