using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERS_MAP : ClassMap<TMPURCHASEORDERS>
    {
        public TMPURCHASEORDERS_MAP()
        {
            Id(x => x.POR_ID);
            Map(x => x.POR_DESCRIPTION);
            Map(x => x.POR_ORG);
            Map(x => x.POR_TYPE);
            Map(x => x.POR_TYPEENTITY);
            Map(x => x.POR_STATUS);
            Map(x => x.POR_STATUSENTITY);
            Map(x => x.POR_STATUSDESC).ReadOnly().Formula("(SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = POR_STATUS AND s.STA_ENTITY = POR_STATUSENTITY)");
            Map(x => x.POR_CANCELLATIONREASON);
            Map(x => x.POR_WAREHOUSE);
            Map(x => x.POR_REQUESTEDBY);
            Map(x => x.POR_REQUESTEDBYEMAIL).ReadOnly().Formula("(SELECT s.USR_EMAIL FROM TMUSERS s WHERE s.USR_CODE = POR_REQUESTEDBY)");
            Map(x => x.POR_REQUESTED);
            Map(x => x.POR_SUPPLIER);
            Map(x => x.POR_SUPPLIERDESC).ReadOnly().Formula("(SELECT s.SUP_DESC FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERAUTH).ReadOnly().Formula("(SELECT s.SUP_AUTHORIZEDPERSON FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERMAIL).ReadOnly().Formula("(SELECT s.SUP_EMAIL FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERPHONE).ReadOnly().Formula("(SELECT s.SUP_PHONE FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERGSM).ReadOnly().Formula("(SELECT s.SUP_PHONE2 FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERFAX).ReadOnly().Formula("(SELECT s.SUP_FAX FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERADR).ReadOnly().Formula("(SELECT s.SUP_FULLADDRESS FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPAYMENTPERIOD).ReadOnly().Formula("(SELECT s.SUP_PAYMENTPERIOD FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER)");
            Map(x => x.POR_SUPPLIERPROVIENCE).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE  a.ADS_TYPE = 'IL' AND a.ADS_CODE =(SELECT s.SUP_PROVINCE FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER))");
            Map(x => x.POR_SUPPLIERDISTRICT).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE  a.ADS_TYPE = 'ILCE' AND a.ADS_CODE =(SELECT s.SUP_DISTRICT FROM TMSUPPLIERS s WHERE s.SUP_CODE = POR_SUPPLIER))");
            Map(x => x.POR_CURRENCY);
            Map(x => x.POR_TASK);
            Map(x => x.POR_ORGCURR).ReadOnly().Formula("(SELECT o.ORG_CURRENCY FROM TMORGS o WHERE o.ORG_CODE = POR_ORG)");
            Map(x => x.POR_PAYMENTTERM);
            Map(x => x.POR_EXCHANGERATE);
            Map(x => x.POR_DELIVERYADR);
            Map(x => x.POR_PARTTOTAL).ReadOnly().Formula("dbo.GetTotalPurchaseOrderLines(POR_ID)");
            Map(x => x.POR_TOTALTAXES).ReadOnly().Formula("dbo.GetTotalTaxPurchaseOrderLines(POR_ID)");
            Map(x => x.POR_CREATEDBY);
            Map(x => x.POR_CREATED);
            Map(x => x.POR_UPDATEDBY);
            Map(x => x.POR_UPDATED);
            Map(x => x.POR_RECORDVERSION).Default("0");
        }
    }
}
