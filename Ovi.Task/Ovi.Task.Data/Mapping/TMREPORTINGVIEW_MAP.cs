using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMREPORTINGVIEW_MAP : ClassMap<TMREPORTINGVIEW>
    {
        public TMREPORTINGVIEW_MAP()
        {
            Id(x => x.REP_ID);
            Map(x => x.REP_DESC);
            Map(x => x.REP_ORG);
            Map(x => x.REP_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', REP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = REP_ORG),:SessionContext.Language)");
            Map(x => x.REP_TYPE);
            Map(x => x.REP_TYPEENTITY);
            Map(x => x.REP_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', REP_TYPEENTITY + '#' + REP_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = REP_TYPE AND t.TYP_ENTITY = REP_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.REP_STATUS);
            Map(x => x.REP_STATUSENTITY);
            Map(x => x.REP_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', REP_STATUSENTITY + '#' + REP_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = REP_STATUS AND s.STA_ENTITY = REP_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.REP_TSK);
            Map(x => x.REP_TSKDESC);
            Map(x => x.REP_SUPPLIER);
            Map(x => x.REP_SUPPLIERDESC);
            Map(x => x.REP_CMNTCNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = REP_TSK AND c.CMN_SUBJECT = 'TASK' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                       "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
            Map(x => x.REP_DOCCNT);
            Map(x => x.REP_CREATED);
            Map(x => x.REP_CREATEDBY);
            Map(x => x.REP_TSKASSIGNEDTO);
            Map(x => x.REP_TSKACTTRADE);
            Map(x => x.REP_UPDATED);
            Map(x => x.REP_UPDATEDBY);
            Map(x => x.REP_RECORDVERSION);
            Map(x => x.REP_CUSCODE);
            Map(x => x.REP_CUSDESC);
            Map(x => x.REP_BRNCODE);
            Map(x => x.REP_BRNDESC);
            Map(x => x.REP_BRNREGION);
            Map(x => x.REP_TSKSTATUS);
            Map(x => x.REP_TSKSTATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK' + '#' + REP_TSKSTATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = REP_TSKSTATUS AND s.STA_ENTITY = 'TASK'),:SessionContext.Language)");
            Map(x => x.REP_TSKCATEGORY);
            Map(x => x.REP_TSKCATEGORYDESC).ReadOnly().Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', REP_TSKCATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = REP_TSKCATEGORY),:SessionContext.Language)");
            Map(x => x.REP_REGIONREPORTINGRESPONSIBLE);
            Map(x => x.REP_CUSTOMERREPORTINGRESPONSIBLE);
        }
    }
}