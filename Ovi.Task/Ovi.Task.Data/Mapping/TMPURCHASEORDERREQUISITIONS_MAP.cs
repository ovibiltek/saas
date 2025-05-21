using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERREQUISITIONS_MAP : ClassMap<TMPURCHASEORDERREQUISITIONS>
    {
        public TMPURCHASEORDERREQUISITIONS_MAP()
        {
            Id(x => x.PRQ_ID);
            Map(x => x.PRQ_DESCRIPTION);
            Map(x => x.PRQ_ORG);
            Map(x => x.PRQ_TYPEENTITY);
            Map(x => x.PRQ_TYPE);
            Map(x => x.PRQ_STATUS);
            Map(x => x.PRQ_STATUSENTITY);
            Map(x => x.PRQ_STATUSDESC).ReadOnly().Formula("(SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = PRQ_STATUS AND s.STA_ENTITY = PRQ_STATUSENTITY)");
            Map(x => x.PRQ_QUOTATION);
            Map(x => x.PRQ_TASK);
            Map(x => x.PRQ_TASKBRANCH).ReadOnly().Formula("(SELECT s.TSK_BRANCH FROM TMTASKS s WHERE s.TSK_ID = PRQ_TASK)");
            Map(x => x.PRQ_TASKREGION).ReadOnly().Formula("(SELECT b.BRN_REGION FROM TMBRANCHES b WHERE b.BRN_CODE = (SELECT s.TSK_BRANCH FROM TMTASKS s WHERE s.TSK_ID = PRQ_TASK))");
            Map(x => x.PRQ_TASKACTIVITY);
            Map(x => x.PRQ_REQDELADR);
            Map(x => x.PRQ_REQDELADRTYPE);
            Map(x => x.PRQ_CANCELLATIONREASON);
            Map(x => x.PRQ_WAREHOUSE);
            Map(x => x.PRQ_REQUESTEDBY);
            Map(x => x.PRQ_REQUESTED);
            Map(x => x.PRQ_SUPPLIER);
            Map(x => x.PRQ_SUPPLIERDESC).ReadOnly().Formula("(SELECT s.SUP_DESC FROM TMSUPPLIERS s WHERE s.SUP_CODE = PRQ_SUPPLIER)");
            Map(x => x.PRQ_CURRENCY);
            Map(x => x.PRQ_ORGCURR).ReadOnly().Formula("(SELECT o.ORG_CURRENCY FROM TMORGS o WHERE o.ORG_CODE = PRQ_ORG)");
            Map(x => x.PRQ_EXCHANGERATE);
            Map(x => x.PRQ_CREATED);
            Map(x => x.PRQ_CREATEDBY);
            Map(x => x.PRQ_UPDATED);
            Map(x => x.PRQ_UPDATEDBY);
            Map(x => x.PRQ_RECORDVERSION);
            Map(x => x.PRQ_REQDELPHONENUMBER);
            Map(x => x.PRQ_REQDELRELATEDPERSON);
        }
    }
}