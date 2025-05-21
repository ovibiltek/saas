using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMADVPLNTASKACTIVITIES_MAP : ClassMap<TMADVPLNTASKACTIVITIES>
    {
        public TMADVPLNTASKACTIVITIES_MAP()
        {
            Id(x => x.TSA_ID); Map(x => x.TSA_TASK);
            Map(x => x.TSK_SHORTDESC);
            Map(x => x.TSK_ORGANIZATION);
            Map(x => x.TSK_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', TSK_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = TSK_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.TSK_PROJECT);
            Map(x => x.PRJ_DESC);
            Map(x => x.TSK_DEPARTMENT);
            Map(x => x.TSK_STATUS);
            Map(x => x.TSK_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK#' + TSK_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TSK_STATUS AND s.STA_ENTITY = 'TASK'),:SessionContext.Language)");
            Map(x => x.TSK_DEADLINE);
            Map(x => x.TSK_TYPE);
            Map(x => x.TSK_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', 'TASK#' + TSK_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = TSK_TYPE AND t.TYP_ENTITY = 'TASK') ,:SessionContext.Language)");
            Map(x => x.TSK_CATEGORY);
            Map(x => x.TSK_CATEGORYDESC).ReadOnly().Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', TSK_CATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = TSK_CATEGORY),:SessionContext.Language)");
            Map(x => x.CUS_CODE);
            Map(x => x.CUS_DESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = CUS_CODE)");
            Map(x => x.BRN_CODE);
            Map(x => x.BRN_DESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = BRN_CODE)");
            Map(x => x.TSA_LINE);
            Map(x => x.TSA_DESC);
            Map(x => x.TSK_PRIORITY);
            Map(x => x.TSA_CREATEDBY);
            Map(x => x.TSA_CREATED);
            Map(x => x.TSK_CREATED);
            Map(x => x.TSA_TRADE);
            Map(x => x.TSA_ASSIGNEDTO).Length(PropertySettings.L4001);
            Map(x => x.TSA_SCHFROM);
            Map(x => x.TSA_SCHTO);
            Map(x => x.TSA_PLANNED);
            Map(x => x.TSK_CMNTCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = TSA_TASK AND c.CMN_SUBJECT = 'TASK' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                                                                                                                     "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
            Map(x => x.TSK_DOCCOUNT).ReadOnly().Formula("dbo.GetDocumentCount('TASK', TSK_ID, :SessionContext.User)");
            Map(x => x.TSA_RECORDVERSION);
        }
    }
}