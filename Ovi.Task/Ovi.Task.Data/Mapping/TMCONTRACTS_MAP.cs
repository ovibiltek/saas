using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCONTRACTS_MAP : ClassMap<TMCONTRACTS>
    {
        public TMCONTRACTS_MAP()
        {
            Id(x => x.CON_ID);
            Map(x => x.CON_ORGANIZATION);
            Map(x => x.CON_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', CON_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = CON_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.CON_DESC);
            Map(x => x.CON_DETAILS);
            Map(x => x.CON_REFERENCE);
            Map(x => x.CON_TYPEENTITY);
            Map(x => x.CON_TYPE);
            Map(x => x.CON_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', CON_TYPEENTITY + '#' + CON_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = CON_TYPE AND t.TYP_ENTITY = CON_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.CON_CUSTOMER);
            Map(x => x.CON_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = CON_CUSTOMER)");
            Map(x => x.CON_SUPPLIER);
            Map(x => x.CON_SUPPLIERDESC).ReadOnly().Formula("(SELECT s.SUP_DESC FROM TMSUPPLIERS s WHERE s.SUP_CODE = CON_SUPPLIER)");
            Map(x => x.CON_MANAGER);
            Map(x => x.CON_MANAGERDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CON_MANAGER)");
            Map(x => x.CON_STARTDATE);
            Map(x => x.CON_ENDDATE);
            Map(x => x.CON_REMINDINGPERIOD);
            Map(x => x.CON_STATUSENTITY);
            Map(x => x.CON_STATUS);
            Map(x => x.CON_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'CONTRACT#' + CON_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = CON_STATUS AND s.STA_ENTITY = 'CONTRACT'),:SessionContext.Language)");
            Map(x => x.CON_CANCELLATIONREASON);
            Map(x => x.CON_CANCELLATIONREASONDESC).Formula("dbo.GetDesc('TMCANCELLATIONREASONS','CNR_DESC', 'CONTRACT#' + CON_CANCELLATIONREASON , (SELECT c.CNR_DESC FROM TMCANCELLATIONREASONS c WHERE c.CNR_ENTITY = 'CONTRACT' AND c.CNR_CODE = CON_CANCELLATIONREASON) , :SessionContext.Language)");
            Map(x => x.CON_PAYMENTDUE);
            Map(x => x.CON_RECORDVERSION).Default("0");
            Map(x => x.CON_CREATED);
            Map(x => x.CON_CREATEDBY);
            Map(x => x.CON_UPDATED);
            Map(x => x.CON_UPDATEDBY);
        }
    }
}