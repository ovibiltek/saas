using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Project;

namespace Ovi.Task.Data.Mapping.Project
{
    public sealed class TMPROJECTS_MAP : ClassMap<TMPROJECTS>
    {
        public TMPROJECTS_MAP()
        {
            Id(x => x.PRJ_ID);
            Map(x => x.PRJ_DESC).Length(PropertySettings.L250);
            Map(x => x.PRJ_ORGANIZATION).Length(PropertySettings.L50);
            Map(x => x.PRJ_ORGANIZATIONDESC).Formula("dbo.GetDesc('TMORGS','ORG_DESC', PRJ_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = PRJ_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.PRJ_ORGCURR).ReadOnly().Formula("(SELECT o.ORG_CURRENCY FROM TMORGS o WHERE o.ORG_CODE = PRJ_ORGANIZATION)");
            Map(x => x.PRJ_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.PRJ_TYPE).Length(PropertySettings.L50);
            Map(x => x.PRJ_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', PRJ_TYPEENTITY + '#' + PRJ_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = PRJ_TYPE AND t.TYP_ENTITY = PRJ_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.PRJ_STATUSENTITY).Length(PropertySettings.L50);
            Map(x => x.PRJ_STATUS).Length(PropertySettings.L50);
            Map(x => x.PRJ_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'PROJECT#' + PRJ_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = PRJ_STATUS AND s.STA_ENTITY = 'PROJECT'),:SessionContext.Language)");
            Map(x => x.PRJ_ESTIMATEDSTART);
            Map(x => x.PRJ_ESTIMATEDEND);
            Map(x => x.PRJ_CHANNEL);
            Map(x => x.PRJ_CUSTOMER);
            Map(x => x.PRJ_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = PRJ_CUSTOMER)");
            Map(x => x.PRJ_OFFERDEADLINE);
            Map(x => x.PRJ_PROVINCE);
            Map(x => x.PRJ_PROVINCEDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = PRJ_PROVINCE AND a.ADS_TYPE = 'IL')");
            Map(x => x.PRJ_DISTRICT);
            Map(x => x.PRJ_DISTRICTDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = PRJ_DISTRICT AND a.ADS_TYPE = 'ILCE')");
            Map(x => x.PRJ_REGION);
            Map(x => x.PRJ_REGIONDESC).ReadOnly().Formula("dbo.GetDesc('TMREGIONS','REG_DESC', PRJ_REGION,(SELECT r.REG_DESC FROM TMREGIONS r WHERE r.REG_CODE = PRJ_REGION),:SessionContext.Language)");
            Map(x => x.PRJ_TASKCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMTASKS t WHERE t.TSK_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_ACTIVITYCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMTASKS t, TMTASKACTIVITIES ta WHERE t.TSK_PROJECT = PRJ_ID AND ta.TSA_TASK = t.TSK_ID)");
            Map(x => x.PRJ_OFFERREVCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMPROJECTOFFERREVISIONS pr WHERE pr.PRV_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_TAX2);
            Map(x => x.PRJ_CURR);
            Map(x => x.PRJ_CURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', PRJ_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = PRJ_CURR), :SessionContext.Language)");
            Map(x => x.PRJ_EXCH);
            Map(x => x.PRJ_CANCELLATIONREASON);
            Map(x => x.PRJ_CANCELLATIONDESC);
            Map(x => x.PRJ_CANCELLATIONREASONDESC).ReadOnly().Formula("(SELECT cr.CNR_DESC FROM TMCANCELLATIONREASONS cr WHERE cr.CNR_ENTITY = 'PROJECT' AND cr.CNR_CODE = PRJ_CANCELLATIONREASON)");
            Map(x => x.PRJ_QUOCOST).ReadOnly().Formula("(SELECT pps.PPR_COST FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOTOTAL).ReadOnly().Formula("(SELECT pps.PPR_TOTAL FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOTAX2).ReadOnly().Formula("(SELECT pps.PPR_TAX2 FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOPROFIT).ReadOnly().Formula("(SELECT pps.PPR_PROFIT FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOPROFITPERCENT).ReadOnly().Formula("(SELECT pps.PPR_PROFITPERCENT FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOTATION).ReadOnly().Formula("(SELECT pps.PPR_QUOTATION FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOVAT).ReadOnly().Formula("(SELECT pps.PPR_VAT FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOTATIONFINAL).ReadOnly().Formula("(SELECT pps.PPR_QUOTATIONFINAL FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_QUOCURR).ReadOnly().Formula("(SELECT pps.PPR_CURR FROM TMPROJECTPRICINGSUMMARY pps WHERE pps.PPR_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_PAYMENTTERM).Length(PropertySettings.L50);
            Map(x => x.PRJ_CONTACTPERSON).Length(PropertySettings.L250);
            Map(x => x.PRJ_CONTACTEMAIL).Length(PropertySettings.L250);
            Map(x => x.PRJ_CONTACTPHONE).Length(PropertySettings.L50);
            Map(x => x.PRJ_PARENT);
            Map(x => x.PRJ_PARENTDESC).ReadOnly().Formula("(SELECT p.PRJ_DESC FROM TMPROJECTS p WHERE p.PRJ_ID = PRJ_PARENT)");
            Map(x => x.PRJ_HASQUOTATION).ReadOnly().Formula("(SELECT CASE WHEN COUNT(*) > 0 THEN '+' ELSE '-' END FROM TMQUOTATIONS q WHERE q.QUO_PROJECT = PRJ_ID)");
            Map(x => x.PRJ_CREATED);
            Map(x => x.PRJ_UPDATED);
            Map(x => x.PRJ_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRJ_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRJ_RECORDVERSION).Default("0");
            Map(x => x.PRJ_ORDER).ReadOnly().Formula("(SELECT CASE WHEN s.STA_PCODE <> 'C' THEN 0 ELSE 1 END FROM TMSTATUSES s WHERE s.STA_ENTITY = 'PROJECT' AND s.STA_CODE = PRJ_STATUS)");

        }
    }
}