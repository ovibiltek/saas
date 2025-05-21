using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.Data.Mapping.Supervision
{
    public sealed class TMSUPERVISION_MAP : ClassMap<TMSUPERVISION>
    {
        public TMSUPERVISION_MAP()
        {
            Id(x => x.SPV_ID);
            Map(x => x.SPV_DESC);
            Map(x => x.SPV_ORG);
            Map(x => x.SPV_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', SPV_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = SPV_ORG),:SessionContext.Language)");
            Map(x => x.SPV_TYPEENTITY);
            Map(x => x.SPV_TYPE);
            Map(x => x.SPV_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SPV_TYPEENTITY + '#' + SPV_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = SPV_TYPE AND t.TYP_ENTITY = SPV_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.SPV_STATUSENTITY);
            Map(x => x.SPV_STATUS);
            Map(x => x.SPV_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', SPV_STATUSENTITY + '#' + SPV_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = SPV_STATUS AND s.STA_ENTITY = SPV_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.SPV_PSTATUS).ReadOnly().Formula("(SELECT s.STA_PCODE FROM TMSTATUSES s WHERE s.STA_ENTITY = 'SUPERVISION' AND s.STA_CODE = SPV_STATUS)");
            Map(x => x.SPV_REQUESTEDBY);
            Map(x => x.SPV_TASK);
            Map(x => x.SPV_ACTIVITY);
            Map(x => x.SPV_TASKSHORTDESC).ReadOnly().Formula("(SELECT t.TSK_SHORTDESC FROM TMTASKS t WHERE t.TSK_ID = SPV_TASK)");
            Map(x => x.SPV_CUSTOMER);
            Map(x => x.SPV_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = SPV_CUSTOMER)");
            Map(x => x.SPV_CUSTOMERGROUP).ReadOnly().Formula("(SELECT c.CUS_GROUP FROM TMCUSTOMERS c WHERE c.CUS_CODE = SPV_CUSTOMER)");
            Map(x => x.SPV_BRANCH);
            Map(x => x.SPV_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = SPV_BRANCH AND b.BRN_CUSTOMER = SPV_CUSTOMER)");
            Map(x => x.SPV_CATEGORY);
            Map(x => x.SPV_CATEGORYDESC).ReadOnly().Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', SPV_CATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = SPV_CATEGORY),:SessionContext.Language)");
            Map(x => x.SPV_SUPERVISOR).Length(PropertySettings.L4001);
            Map(x => x.SPV_CANCELLATIONREASON);
            Map(x => x.SPV_CANCELLATIONREASONDESC).Formula("dbo.GetDesc('TMCANCELLATIONREASONS','CNR_DESC', SPV_TYPE + '#' + SPV_CANCELLATIONREASON , (SELECT c.CNR_DESC FROM TMCANCELLATIONREASONS c WHERE c.CNR_ENTITY = SPV_TYPE AND c.CNR_CODE = SPV_CANCELLATIONREASON) , :SessionContext.Language)");
            Map(x => x.SPV_RECORDVERSION);
            Map(x => x.SPV_CREATEDBY);
            Map(x => x.SPV_CREATED);
            Map(x => x.SPV_UPDATEDBY);
            Map(x => x.SPV_UPDATED);
        }
    }
}