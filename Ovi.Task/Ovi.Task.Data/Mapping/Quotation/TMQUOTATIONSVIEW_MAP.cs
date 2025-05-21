using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONSVIEW_MAP : ClassMap<TMQUOTATIONSVIEW>
    {
        public TMQUOTATIONSVIEW_MAP()
        {
            Id(x => x.QUO_ID);
            Map(x => x.QUO_ORGANIZATION);
            Map(x => x.QUO_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', QUO_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = QUO_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.QUO_TYPEENTITY);
            Map(x => x.QUO_TYPE);
            Map(x => x.QUO_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', QUO_TYPEENTITY + '#' + QUO_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = QUO_TYPE AND t.TYP_ENTITY = QUO_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.QUO_DESCRIPTION);
            Map(x => x.QUO_REVNO);
            Map(x => x.QUO_REFERENCENO);
            Map(x => x.QUO_SUPPLIER);
            Map(x => x.QUO_SUPPLIERDESC);
            Map(x => x.QUO_TASK);
            Map(x => x.QUO_TASKREFERENCE);
            Map(x => x.QUO_ACTIVITY);
            Map(x => x.QUO_PROJECT);
            Map(x => x.QUO_PROJECTDESC);
            Map(x => x.QUO_MANAGER);
            Map(x => x.QUO_PM);
            Map(x => x.QUO_PMDESC);
            Map(x => x.QUO_SUPPLYPERIOD);
            Map(x => x.QUO_REMINDINGPERIOD);
            Map(x => x.QUO_STATUSENTITY);
            Map(x => x.QUO_STATUS);
            Map(x => x.QUO_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', QUO_STATUSENTITY + '#' + QUO_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = QUO_STATUS AND s.STA_ENTITY = QUO_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.QUO_CANCELLATIONREASON);
            Map(x => x.QUO_CANCELLATIONREASONDESC).Formula("dbo.GetDesc('TMCANCELLATIONREASONS','CNR_DESC', QUO_TYPE + '#' + QUO_CANCELLATIONREASON , (SELECT c.CNR_DESC FROM TMCANCELLATIONREASONS c WHERE c.CNR_ENTITY = QUO_TYPE AND c.CNR_CODE = QUO_CANCELLATIONREASON) , :SessionContext.Language)");
            Map(x => x.QUO_REJECTREASON);
            Map(x => x.QUO_REJECTREASONDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('QUOREJECTREASON',QUO_REJECTREASON,:SessionContext.Language)");
            Map(x => x.QUO_PAYMENTDUE);
            Map(x => x.QUO_CREATED);
            Map(x => x.QUO_CREATEDBY);
            Map(x => x.QUO_UPDATED);
            Map(x => x.QUO_UPDATEDBY);
            Map(x => x.QUO_RECORDVERSION);
            Map(x => x.QUO_PARTPURCHASE);
            Map(x => x.QUO_PARTSALES);
            Map(x => x.QUO_SERVICEPURCHASE);
            Map(x => x.QUO_SERVICESALES);
            Map(x => x.QUO_ORGANIZATIONCURR);
            Map(x => x.QUO_TOTALPURCHASE);
            Map(x => x.QUO_TOTALSALES);
            Map(x => x.QUO_PARTPURCHASE_ORGCURR);
            Map(x => x.QUO_PARTSALES_ORGCURR);
            Map(x => x.QUO_SERVICEPURCHASE_ORGCURR);
            Map(x => x.QUO_SERVICESALES_ORGCURR);
            Map(x => x.QUO_TOTALPURCHASE_ORGCURR);
            Map(x => x.QUO_TOTALSALES_ORGCURR);
            Map(x => x.QUO_TASKDESC);
            Map(x => x.QUO_MANAGERDESC);
            Map(x => x.QUO_CUSTOMER);
            Map(x => x.QUO_CUSTOMERDESC);
            Map(x => x.QUO_BRANCH);
            Map(x => x.QUO_BRANCHDESC);
            Map(x => x.QUO_BRANCHREFERENCE);
            Map(x => x.QUO_LOCATION);
            Map(x => x.QUO_LOCATIONDESC);
            Map(x => x.QUO_ORDER);
            Map(x => x.QUO_COUNT);
            Map(x => x.QUO_CURR);
            Map(x => x.QUO_CURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', QUO_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = QUO_CURR), :SessionContext.Language)");
            Map(x => x.QUO_EXCH);
            Map(x => x.QUO_PURCHASEORDER);
            Map(x => x.QUO_PURCHASEORDERREQ);
            Map(x => x.QUO_CONTRACT);
            Map(x => x.QUO_VALIDITYPERIOD);
            Map(x => x.QUO_ACTSCHTO);

        }
    }
}