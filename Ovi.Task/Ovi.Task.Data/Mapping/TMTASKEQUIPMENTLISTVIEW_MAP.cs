using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTASKEQUIPMENTLISTVIEW_MAP : ClassMap<TMTASKEQUIPMENTLISTVIEW>
    {
        public TMTASKEQUIPMENTLISTVIEW_MAP()
        {
            Id(x => x.TSE_ID);
            Map(x => x.TSE_TSKID);
            Map(x => x.TSE_TSKDESC);
            Map(x => x.TSE_TSKCAT);
            Map(x => x.TSE_TSKCATDESC);
            Map(x => x.TSE_TSKTYPE);
            Map(x => x.TSE_TYPE);
            Map(x => x.TSE_CUSTOMER);
            Map(x => x.TSE_BRANCH);
            Map(x => x.TSE_BRANCHDESC);
            Map(x => x.TSE_CREATED);
            Map(x => x.TSE_COMPLETED);
            Map(x => x.TSE_ACTPLANDATE);
            Map(x => x.TSE_DATE);
            Map(x => x.TSE_EQPID);
            Map(x => x.TSE_EQPCODE);
            Map(x => x.TSE_EQPTYPE);
            Map(x => x.TSE_EQPDESC);
            Map(x => x.TSE_DOCCOUNT).ReadOnly().Formula("dbo.GetDocumentCount('TASK', TSE_TSKID, :SessionContext.User)");
            Map(x => x.TSE_STATUS);
            Map(x => x.TSE_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK#' + TSE_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TSE_STATUS AND s.STA_ENTITY = 'TASK'),:SessionContext.Language)");

            Map(x => x.TSE_CMNTCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = TSE_TSKID AND c.CMN_SUBJECT = 'TASK' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                         "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
            Map(x => x.TSE_EQPBRAND);
            Map(x => x.TSE_EQPMANUFACTURINGYEAR);
            Map(x => x.TSE_EQPKAP);
        }
    }
}
