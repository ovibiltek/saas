using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSALESINVOICELINESVIEW_MAP : ClassMap<TMSALESINVOICELINESVIEW>
    {
        public TMSALESINVOICELINESVIEW_MAP()
        {
            Id(x => x.PSP_CODE);
            Map(x => x.PSP_SALESINVOICE);
            Map(x => x.PSP_SALESINVOICEISRETURNED);
            Map(x => x.PSP_ORG);
            Map(x => x.PSP_ORGCURR);
            Map(x => x.PSP_TYPEENTITY);
            Map(x => x.PSP_TYPE);
            Map(x => x.PSP_CATEGORY);
            Map(x => x.PSP_CATEGORYDESC).ReadOnly().Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', PSP_CATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = PSP_CATEGORY),:SessionContext.Language)");
            Map(x => x.PSP_DESC);
            Map(x => x.PSP_STATUS);
            Map(x => x.PSP_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'PROGRESSPAYMENT#' + PSP_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = PSP_STATUS AND s.STA_ENTITY = 'PROGRESSPAYMENT'),:SessionContext.Language)");
            Map(x => x.PSP_CUSTOMER);
            Map(x => x.PSP_BRANCH);
            Map(x => x.PSP_CUSTOMERDESC);
            Map(x => x.PSP_BRANCHDESC);
            Map(x => x.PSP_TASK);
            Map(x => x.PSP_TASKTYPEENTITY);
            Map(x => x.PSP_TASKTYPE);
            Map(x => x.PSP_CREATED);
            Map(x => x.PSP_CREATEDBY);
            Map(x => x.PSP_UPDATED);
            Map(x => x.PSP_UPDATEDBY);
            Map(x => x.PSP_RECORDVERSION).Default("0");
            Map(x => x.PSP_TOTAL);
            Map(x => x.PSP_TSKTYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', PSP_TASKTYPEENTITY + '#' + PSP_TASKTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = PSP_TASKTYPE AND t.TYP_ENTITY = PSP_TASKTYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.PSP_TSKCLOSED);
            Map(x => x.PSP_TSKCOMPLETED);
            Map(x => x.PSP_BRANCHPM);
            Map(x => x.PSP_CUSTOMERPM);
            Map(x => x.PSP_BRANCHREGION);
            Map(x => x.PSP_TSKDEPARTMENT);
            Map(x => x.PSP_TSKTASKTYPE);
            Map(x => x.PSP_TSKREFERENCE);
            Map(x => x.PSP_INVOICENO);
            Map(x => x.PSP_INVOICEDATE);
        }
    }
}