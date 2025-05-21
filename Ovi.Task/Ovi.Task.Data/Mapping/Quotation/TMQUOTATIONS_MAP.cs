using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONS_MAP : ClassMap<TMQUOTATIONS>
    {
        public TMQUOTATIONS_MAP()
        {
            Id(x => x.QUO_ID);
            Map(x => x.QUO_ORGANIZATION);
            Map(x => x.QUO_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', QUO_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = QUO_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.QUO_ORGANIZATIONCURR).ReadOnly().Formula("(SELECT o.ORG_CURRENCY FROM TMORGS o WHERE o.ORG_CODE = QUO_ORGANIZATION)");
            Map(x => x.QUO_TYPEENTITY);
            Map(x => x.QUO_TYPE);
            Map(x => x.QUO_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', QUO_TYPEENTITY + '#' + QUO_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = QUO_TYPE AND t.TYP_ENTITY = QUO_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.QUO_DESCRIPTION);
            Map(x => x.QUO_REVNO).Default("1");
            Map(x => x.QUO_REFERENCENO);
            Map(x => x.QUO_SUPPLIER);
            Map(x => x.QUO_SUPPLIERDESC).ReadOnly().Formula("(SELECT s.SUP_DESC FROM TMSUPPLIERS s WHERE s.SUP_CODE = QUO_SUPPLIER)");
            Map(x => x.QUO_CUSTOMER);
            Map(x => x.QUO_CUSMAIL);
            Map(x => x.QUO_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = QUO_CUSTOMER)");
            Map(x => x.QUO_TASK);
            Map(x => x.QUO_TASKDESC).ReadOnly().Formula("(SELECT t.TSK_SHORTDESC FROM TMTASKS t WHERE t.TSK_ID = QUO_TASK)");
            Map(x => x.QUO_PROJECT);
            Map(x => x.QUO_PROJECTDESC).ReadOnly().Formula("(SELECT p.PRJ_DESC FROM TMPROJECTS p WHERE p.PRJ_ID = QUO_PROJECT)");
            Map(x => x.QUO_ACTIVITY);
            Map(x => x.QUO_MANAGER);
            Map(x => x.QUO_MANAGERDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = QUO_MANAGER)");
            Map(x => x.QUO_SUPPLYPERIOD);
            Map(x => x.QUO_REMINDINGPERIOD);
            Map(x => x.QUO_STATUSENTITY);
            Map(x => x.QUO_STATUS);
            Map(x => x.QUO_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', QUO_STATUSENTITY + '#' + QUO_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = QUO_STATUS AND s.STA_ENTITY = QUO_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.QUO_CANCELLATIONREASON);
            Map(x => x.QUO_CANCELLATIONREASONDESC).Formula("dbo.GetDesc('TMCANCELLATIONREASONS','CNR_DESC', QUO_TYPE + '#' + QUO_CANCELLATIONREASON , (SELECT c.CNR_DESC FROM TMCANCELLATIONREASONS c WHERE c.CNR_ENTITY = QUO_TYPE AND c.CNR_CODE = QUO_REJECTREASON) , :SessionContext.Language)");
            Map(x => x.QUO_REJECTREASON);
            Map(x => x.QUO_REJECTREASONDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('QUOREJECTREASON',QUO_REJECTREASON,:SessionContext.Language)");
            Map(x => x.QUO_PAYMENTDUE);
            Map(x => x.QUO_CURR);
            Map(x => x.QUO_CURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', QUO_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = QUO_CURR), :SessionContext.Language)");
            Map(x => x.QUO_EXCH);
            Map(x => x.QUO_NOTE);
            Map(x => x.QUO_CREATED);
            Map(x => x.QUO_CREATEDBY);
            Map(x => x.QUO_PURCHASEORDERREQ).ReadOnly().Formula("(CASE WHEN EXISTS (SELECT 1 FROM TMPURCHASEORDERREQUISITIONS t WHERE t.PRQ_QUOTATION = QUO_ID ) THEN '+' ELSE '-' END)");
            Map(x => x.QUO_CONTRACT).ReadOnly().Formula("(SELECT TOP 1 c.CON_ID FROM TMCONTRACTS c WHERE c.CON_CUSTOMER = QUO_CUSTOMER AND CAST(GETDATE() AS DATE) BETWEEN c.CON_STARTDATE AND c.CON_ENDDATE)");
            Map(x => x.QUO_UPDATED);
            Map(x => x.QUO_UPDATEDBY);
            Map(x => x.QUO_RECORDVERSION);
            Map(x => x.QUO_BRANCH).ReadOnly().Formula("(SELECT tsk.TSK_BRANCH FROM TMTASKS tsk WHERE tsk.TSK_ID = QUO_TASK)");
            Map(x => x.QUO_LOCATION).ReadOnly().Formula("(SELECT tsk.TSK_LOCATION FROM TMTASKS tsk WHERE tsk.TSK_ID = QUO_TASK)");
            Map(x => x.QUO_BRANCHDESC).ReadOnly().Formula("(SELECT brn.BRN_DESC FROM TMTASKS tsk, TMBRANCHES brn WHERE tsk.TSK_ID = QUO_TASK AND tsk.TSK_BRANCH = brn.BRN_CODE)");
            Map(x => x.QUO_LOCATIONDESC).ReadOnly().Formula("(SELECT loc.LOC_DESC FROM TMTASKS tsk, TMLOCATIONS loc WHERE tsk.TSK_ID = QUO_TASK AND loc.LOC_CODE = tsk.TSK_LOCATION)");
            Map(x => x.QUO_VALIDITYPERIOD);
            Map(x => x.QUO_MAILRECIPIENTS).Length(PropertySettings.L4001);

        }
    }
}