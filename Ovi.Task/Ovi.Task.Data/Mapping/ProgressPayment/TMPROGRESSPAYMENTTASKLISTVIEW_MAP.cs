using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TMPROGRESSPAYMENTTASKLISTVIEW_MAP : ClassMap<TMPROGRESSPAYMENTTASKLISTVIEW>
    {
        public TMPROGRESSPAYMENTTASKLISTVIEW_MAP()
        {
            Id(x => x.TSK_ID);
            Map(x => x.TSK_ORGANIZATION);
            Map(x => x.TSK_DEPARTMENT);
            Map(x => x.TSK_PROJECT);
            Map(x => x.TSK_LOCATION);
            Map(x => x.TSK_SHORTDESC);
            Map(x => x.TSK_CUSTOMER);
            Map(x => x.TSK_BRANCH);
            Map(x => x.TSK_STATUS);
            Map(x => x.TSK_STATUSCSS);
            Map(x => x.TSK_PRIORITY);
            Map(x => x.TSK_TYPE);
            Map(x => x.TSK_TYPEENTITY);
            Map(x => x.TSK_TASKTYPE);
            Map(x => x.TSK_CATEGORY);
            Map(x => x.TSK_PROGRESS);
            Map(x => x.TSK_CHKLISTPROGRESS);
            Map(x => x.TSK_HIDDEN);
            Map(x => x.TSK_RATING);
            Map(x => x.TSK_FOLLOWED);
            Map(x => x.TSK_REQUESTEDBY);
            Map(x => x.TSK_REQUESTED);
            Map(x => x.TSK_DEADLINE);
            Map(x => x.TSK_COMPLETED);
            Map(x => x.TSK_CLOSED);
            Map(x => x.TSK_PSPCODE);
            Map(x => x.TSK_PRPCODE);
            Map(x => x.TSK_CHK01);
            Map(x => x.TSK_CHK02);
            Map(x => x.TSK_CHK03);
            Map(x => x.TSK_CHK04);
            Map(x => x.TSK_CHK05);
            Map(x => x.TSK_PTASK);
            Map(x => x.TSK_REFERENCE);
            Map(x => x.TSK_HOLDREASON);
            Map(x => x.TSK_HOLDDATE);
            Map(x => x.TSK_CANCELLATIONREASON);
            Map(x => x.TSK_CANCELLATIONDESC);
            Map(x => x.TSK_CREATEDBY);
            Map(x => x.TSK_CREATED);
            Map(x => x.TSK_UPDATEDBY);
            Map(x => x.TSK_UPDATED);
            Map(x => x.TSK_RECORDVERSION);
            Map(x => x.TSK_DATEBOOKED);
            Map(x => x.TSK_PRICINGPARAM);
            Map(x => x.TSK_CUSTOMERDESC);
            Map(x => x.TSK_BRANCHDESC);
            Map(x => x.TSK_DOCCOUNT).ReadOnly().Formula("dbo.GetDocumentCount('TASK', TSK_ID, :SessionContext.User)");
            Map(x => x.TSK_IPP);
            Map(x => x.TSK_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', TSK_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = TSK_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.TSK_CATEGORYDESC).ReadOnly().Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', TSK_CATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = TSK_CATEGORY),:SessionContext.Language)");
            Map(x => x.TSK_TASKTYPEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('TASKTYPE',TSK_TASKTYPE,:SessionContext.Language)");
            Map(x => x.TSK_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK#' + TSK_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TSK_STATUS AND s.STA_ENTITY = 'TASK'),:SessionContext.Language)");
            Map(x => x.TSK_PRIORITYDESC).ReadOnly().Formula("dbo.GetDesc('TMPRIORITIES','PRI_DESC', TSK_PRIORITY, (SELECT p.PRI_DESC FROM TMPRIORITIES p WHERE p.PRI_CODE = TSK_PRIORITY),:SessionContext.Language)");
            Map(x => x.TSK_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', TSK_TYPEENTITY + '#' + TSK_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = TSK_TYPE AND t.TYP_ENTITY = TSK_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.TSK_CMNTCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = TSK_ID AND c.CMN_SUBJECT = 'TASK' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                                                                                                                   "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
        }
    }
}