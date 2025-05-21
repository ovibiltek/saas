using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TMPROGRESSPAYMENTS_MAP : ClassMap<TMPROGRESSPAYMENTS>
    {
        public TMPROGRESSPAYMENTS_MAP()
        {
            Id(x => x.PSP_CODE);
            Map(x => x.PSP_ORG);
            Map(x => x.PSP_ORGCURR).ReadOnly().Formula("(SELECT o.ORG_CURRENCY FROM TMORGS o WHERE o.ORG_CODE = PSP_ORG)");
            Map(x => x.PSP_TYPEENTITY);
            Map(x => x.PSP_TYPE);
            Map(x => x.PSP_DESC);
            Map(x => x.PSP_STATUS);
            Map(x => x.PSP_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'PROGRESSPAYMENT#' + PSP_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = PSP_STATUS AND s.STA_ENTITY = 'PROGRESSPAYMENT'),:SessionContext.Language)");
            Map(x => x.PSP_CUSTOMER);
            Map(x => x.PSP_BRANCH);
            Map(x => x.PSP_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = PSP_CUSTOMER)");
            Map(x => x.PSP_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = PSP_BRANCH)");
            Map(x => x.PSP_TASKTYPEENTITY);
            Map(x => x.PSP_TASKTYPE);
            Map(x => x.PSP_INVOICENO);
            Map(x => x.PSP_INVOICEDATE);
            Map(x => x.PSP_ALLOWZEROTOTAL);
            Map(x => x.PSP_CREATED);
            Map(x => x.PSP_CREATEDBY);
            Map(x => x.PSP_UPDATED);
            Map(x => x.PSP_UPDATEDBY);
            Map(x => x.PSP_RECORDVERSION).Default("0");
            Map(x => x.PSP_TOTAL);
            Map(x => x.PSP_COST);
            Map(x => x.PSP_DATECLOSED);
            Map(x => x.PSP_GROUP);

        }
    }
}