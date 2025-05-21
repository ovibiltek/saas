using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSALESINVOICES_MAP : ClassMap<TMSALESINVOICES>
    {
        public TMSALESINVOICES_MAP()
        {
            Id(x => x.SIV_CODE);
            Map(x => x.SIV_ORG);
            Map(x => x.SIV_TYPEENTITY);
            Map(x => x.SIV_TYPE);
            Map(x => x.SIV_SALESINVOICE);
            Map(x => x.SIV_DESC);
            Map(x => x.SIV_STATUSENTITY);
            Map(x => x.SIV_STATUS);
            Map(x => x.SIV_CUSTOMER);
            Map(x => x.SIV_BRANCH);
            Map(x => x.SIV_ORDERNO);
            Map(x => x.SIV_PSPTYPEENTITY);
            Map(x => x.SIV_PSPTYPE);
            Map(x => x.SIV_PSPCREATEDSTART);
            Map(x => x.SIV_PSPCREATEDEND);
            Map(x => x.SIV_INVOICENO);
            Map(x => x.SIV_INVOICEDATE);
            Map(x => x.SIV_INVOICEDESCRIPTION);
            Map(x => x.SIV_PRINTTYPE);
            Map(x => x.SIV_CREATED);
            Map(x => x.SIV_CREATEDBY);
            Map(x => x.SIV_UPDATED);
            Map(x => x.SIV_UPDATEDBY);
            Map(x => x.SIV_RECORDVERSION);
            Map(x => x.SIV_RETURNCAUSE);
            Map(x => x.SIV_RETURNCAUSEENTITY);
            Map(x => x.SIV_RETURNCAUSEDESC);
            Map(x => x.SIV_INTEREST);
            Map(x => x.SIV_TOTAL).ReadOnly().Formula("((SELECT ISNULL(SUM(SIV.PSP_TOTAL),0) FROM TMSALESINVOICELINESVIEW SIV WHERE SIV.PSP_SALESINVOICE = SIV_CODE) + (SELECT ISNULL(SUM(P.PTP_AMOUNT),0) FROM TMPARTIALPAYMENTS P WHERE P.PTP_SALESINVOICE = SIV_CODE) - (SELECT ISNULL(SUM(SRL.SIR_RETURNTOTAL),0) FROM TMSALESINVOICERETURNLINES SRL	WHERE SRL.SIR_SIVID = SIV_CODE))");
            Map(x => x.SIV_CUSTOMERPM).ReadOnly().Formula("(SELECT cpm.FMP_VALUE FROM TMCUSTOMERPMVIEW cpm WHERE cpm.FMP_CODE = SIV_CUSTOMER)");
            Map(x => x.SIV_CUSPAYMENTPERIOD).ReadOnly().Formula("(SELECT c.CUS_PAYMENTPERIOD FROM TMCUSTOMERS c WHERE c.CUS_CODE = SIV_CUSTOMER)");
            Map(x => x.SIV_BRANCHPM).ReadOnly().Formula("(SELECT usr4.USR_DESC FROM  TMBRANCHES b LEFT OUTER JOIN TMUSERS AS usr4 ON usr4.USR_CODE = b.BRN_PM WHERE b.BRN_CODE = SIV_BRANCH)");
            Map(x => x.SIV_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', SIV_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = SIV_ORG),:SessionContext.Language)");
            Map(x => x.SIV_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SIV_TYPEENTITY + '#' + SIV_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = SIV_TYPE AND t.TYP_ENTITY = SIV_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.SIV_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', SIV_STATUSENTITY + '#' + SIV_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = SIV_STATUS AND s.STA_ENTITY = SIV_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.SIV_PSTATUS).ReadOnly().Formula("(SELECT s.STA_PCODE FROM TMSTATUSES s WHERE s.STA_ENTITY = SIV_STATUSENTITY AND s.STA_CODE = SIV_STATUS)");
            Map(x => x.SIV_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = SIV_CUSTOMER)");
            Map(x => x.SIV_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = SIV_BRANCH AND b.BRN_CUSTOMER = SIV_CUSTOMER)");
            Map(x => x.SIV_ACCOUNTCODE).ReadOnly().Formula("(ISNULL((SELECT b.BRN_ACCOUNTCODE FROM TMBRANCHES b WHERE b.BRN_CODE = SIV_BRANCH),(SELECT c.CUS_ACCOUNTCODE FROM TMCUSTOMERS c WHERE c.CUS_CODE = SIV_CUSTOMER)))");
            Map(x => x.SIV_PSPTYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SIV_PSPTYPEENTITY + '#' + SIV_PSPTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = SIV_PSPTYPE AND t.TYP_ENTITY = SIV_PSPTYPEENTITY) ,:SessionContext.Language)");
        }
    }
}