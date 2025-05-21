using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPRESALESVIEW_MAP : ClassMap<TMPRESALESVIEW>
    {
        public TMPRESALESVIEW_MAP()
        {
            Id(x => x.PRS_ID);
            Map(x => x.PRS_DESC);
            Map(x => x.PRS_ORG);
            Map(x => x.PRS_CUSTOMER);
            Map(x => x.PRS_TYPE);
            Map(x => x.PRS_TYPEENTITY);
            Map(x => x.PRS_STATUS);
            Map(x => x.PRS_STATUSENTITY);
            Map(x => x.PRS_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', PRS_TYPEENTITY + '#' + PRS_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = PRS_TYPE AND t.TYP_ENTITY = PRS_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.PRS_CMNTCNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = PRS_ID AND c.CMN_SUBJECT = 'PRESALES' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                     "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
            Map(x => x.PRS_DOCCNT);
            Map(x => x.PRS_STATUSDESC).ReadOnly().Formula("(SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = PRS_STATUS AND s.STA_ENTITY = PRS_STATUSENTITY)");
            Map(x => x.PRS_CONTACT);
            Map(x=> x.PRS_PROGRESS).ReadOnly().Formula("(SELECT s.STA_ORDER FROM TMSTATUSES s WHERE s.STA_CODE = PRS_STATUS AND s.STA_ENTITY = PRS_STATUSENTITY)");
            Map(x => x.PRS_CONTACTMAIL);
            Map(x => x.PRS_CONTACTPHONE);
            Map(x => x.PRS_RELATEDPERSON);
            Map(x => x.PRS_RELATEDPERSONDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = PRS_RELATEDPERSON)");
            Map(x => x.PRS_QUOCOST);
            Map(x => x.PRS_QUOPROFITMARGIN);
            Map(x => x.PRS_QUOPROFIT);
            Map(x => x.PRS_ESTCLOSED);
            Map(x => x.PRS_CLOSED);
            Map(x => x.PRS_SALESAMOUNT);
            Map(x => x.PRS_SALESPROFITMARGIN);
            Map(x => x.PRS_SALESPROFIT);
            Map(x => x.PRS_REQUESTEDBY);
            Map(x => x.PRS_REQUESTEDBYDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = PRS_REQUESTEDBY)");
            Map(x => x.PRS_CREATED);
            Map(x => x.PRS_CREATEDBY);
            Map(x => x.PRS_UPDATED);
            Map(x => x.PRS_UPDATEDBY);
            Map(x => x.PRS_RECORDVERSION);
            Map(x => x.PRS_CANCELLATIONREASON);
            Map(x => x.PRS_QUOCURRENCY);
            Map(x => x.PRS_SALECURRENCY);
        }
    }
}
