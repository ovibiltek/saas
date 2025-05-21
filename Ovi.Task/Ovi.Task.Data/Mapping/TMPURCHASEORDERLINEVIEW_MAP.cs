using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERLINEVIEW_MAP : ClassMap<TMPURCHASEORDERLINEVIEW>
    {
        public TMPURCHASEORDERLINEVIEW_MAP()
        {
            Id(x => x.POL_ID);
            Map(x => x.POL_PORID);
            Map(x => x.POL_PART);
            Map(x => x.POL_LINE);
            Map(x => x.POL_PARTCODE);
            Map(x => x.POL_PARTDESC);
            Map(x => x.POL_PARTUOM);
            Map(x => x.POL_QUANTITY);
            Map(x => x.POL_REQUESTEDUOM);
            Map(x => x.POL_UOMMULTI);
            Map(x => x.POL_REQUESTEDDATE);
            Map(x => x.POL_UNITPRICE);
            Map(x => x.POL_CURRENCY);
            Map(x => x.POL_EXCHANGERATE);
            Map(x => x.POL_VATTAX);
            Map(x => x.POL_TAX2);
            Map(x => x.POL_CREATED);
            Map(x => x.POL_CREATEDBY);
            Map(x => x.POL_UPDATED);
            Map(x => x.POL_UPDATEDBY);
            Map(x => x.POL_RECORDVERSION);
            Map(x => x.POL_DESC);
            Map(x => x.POL_ORG);
            Map(x => x.POL_ORGDESC);
            Map(x => x.POL_TYPE);
            Map(x => x.POL_STATUS);
            Map(x => x.POL_QUATATION);
            Map(x => x.POL_QUODESC);
            Map(x => x.POL_WAREHOUSE);
            Map(x => x.POL_REQUESTEDBY);
            Map(x => x.POL_SUPPLIER);
            Map(x => x.POL_PORCURR);
            Map(x => x.POL_POREXCH);
            Map(x => x.POL_PORCREATED);
            Map(x => x.POL_PORCREATEDBY);
            Map(x => x.POL_PORUPDATED);
            Map(x => x.POL_PORUPDATEDBY);
            Map(x => x.POL_PORRECORDVER);
            Map(x => x.POL_TASK);
            Map(x => x.POL_TASKACTIVITY);
            Map(x => x.POL_QUOTATION);
            Map(x => x.POL_WAITINGQUANTITY);
            Map(x => x.POL_REQLINEID);
            Map(x => x.POL_REQ);

        }
    }
}
