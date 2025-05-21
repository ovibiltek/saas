using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMINVOICES_MAP : ClassMap<TMINVOICES>
    {
        public TMINVOICES_MAP()
        {
            Id(x => x.INV_CODE);
            Map(x => x.INV_DESC);
            Map(x => x.INV_ORG);
            Map(x => x.INV_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', INV_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = INV_ORG),:SessionContext.Language)");
            Map(x => x.INV_ORGCURR).ReadOnly().Formula("(SELECT o.ORG_CURRENCY FROM TMORGS o WHERE o.ORG_CODE = INV_ORG)");
            Map(x => x.INV_TYPEENTITY);
            Map(x => x.INV_TYPE);
            Map(x => x.INV_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', INV_TYPEENTITY + '#' + INV_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = INV_TYPE AND t.TYP_ENTITY = INV_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.INV_STATUSENTITY);
            Map(x => x.INV_STATUS);
            Map(x => x.INV_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', INV_STATUSENTITY + '#' + INV_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = INV_STATUS AND s.STA_ENTITY = INV_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.INV_PSTATUS).ReadOnly().Formula("(SELECT s.STA_PCODE FROM TMSTATUSES s WHERE s.STA_ENTITY = 'INVOICE' AND s.STA_CODE = INV_STATUS)");
            Map(x => x.INV_SUPPLIER);
            Map(x => x.INV_SUPPLIERDESC).ReadOnly().Formula("(SELECT s.SUP_DESC FROM TMSUPPLIERS s WHERE s.SUP_CODE = INV_SUPPLIER)");
            Map(x => x.INV_SUPPLIERACCOUNT).ReadOnly().Formula("(SELECT s.SUP_ACCOUNTCODE FROM TMSUPPLIERS s WHERE s.SUP_CODE = INV_SUPPLIER)");
            Map(x => x.INV_PAYMENTPERIOD).ReadOnly().Formula("(SELECT s.SUP_PAYMENTPERIOD FROM TMSUPPLIERS s WHERE s.SUP_CODE = INV_SUPPLIER)");
            Map(x => x.INV_STARTDATE);
            Map(x => x.INV_ENDDATE);
            Map(x => x.INV_TSKCATEGORY);
            Map(x => x.INV_TSKCATEGORYDESC).ReadOnly().Formula("(SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = INV_TSKCATEGORY)");
            Map(x => x.INV_CUSTOMER);
            Map(x => x.INV_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = INV_CUSTOMER)");
            Map(x => x.INV_INVOICE);
            Map(x => x.INV_INVOICEDATE);
            Map(x => x.INV_CREATED);
            Map(x => x.INV_CREATEDBY);
            Map(x => x.INV_UPDATED);
            Map(x => x.INV_UPDATEDBY);
            Map(x => x.INV_RECORDVERSION);
            Map(x => x.INV_MATCHEDTOTAL).ReadOnly().Formula("(dbo.TM_CALCINVTOTAL(INV_CODE))");
            Map(x => x.INV_TOTAL);
            Map(x => x.INV_RETURNINVOICE);
            Map(x => x.INV_ORDERNO);
            Map(x => x.INV_ORDERNODESC).ReadOnly().Formula("(CASE WHEN INV_ORDERNO IS NOT NULL THEN 'B-'+CONVERT(nvarchar(10), INV_ORDERNO) ELSE NULL END)");
            Map(x => x.INV_INTEREST);
            Map(x => x.INV_TFS).ReadOnly().Formula("(SELECT sup.SUP_CHK01 FROM TMSUPPLIERS sup WHERE sup.SUP_CODE = INV_SUPPLIER)");
            Map(x => x.INV_TOTALWITHINTEREST);
        }
    }
}