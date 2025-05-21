using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERLINES_MAP : ClassMap<TMPURCHASEORDERLINES>
    {
        public TMPURCHASEORDERLINES_MAP()
        {
            Id(x => x.PRL_ID);
            Map(x => x.PRL_PARTID);
            Map(x => x.PRL_PARTNOTE);
            Map(x => x.PRL_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = PRL_PARTID)");
            Map(x => x.PRL_PARTCURR).ReadOnly().Formula("(SELECT p.PAR_CURR FROM TMPARTS p WHERE p.PAR_ID = PRL_PARTID)");
            Map(x => x.PRL_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = PRL_PARTID)");
            Map(x => x.PRL_PORID);
            Map(x => x.PRL_LINE);
            Map(x => x.PRL_QUANTITY);
            Map(x => x.PRL_PARUOM).ReadOnly().Formula("(SELECT T.PAR_UOM FROM TMPARTS T WHERE T.PAR_ID = PRL_PARTID)");
            Map(x => x.PRL_REQUESTEDUOM);
            Map(x => x.PRL_REQUESTEDUOMDESC).ReadOnly().Formula("(SELECT T.UOM_DESC FROM TMUOMS T WHERE T.UOM_CODE = PRL_REQUESTEDUOM)");
            Map(x => x.PRL_UOMMULTI);
            Map(x => x.PRL_REQUESTEDDATE);
            Map(x => x.PRL_UNITPRICE);
            Map(x => x.PRL_CURRENCY);
            Map(x => x.PRL_EXCHANGERATE);
            Map(x => x.PRL_VATTAX);
            Map(x => x.PRL_TAX2);
            Map(x => x.PRL_DISCOUNT);
            Map(x => x.PRL_CARGOCOMPANY);
            Map(x => x.PRL_CARGODATE);
            Map(x => x.PRL_CARGONUMBER);
            Map(x => x.PRL_REQ);
            Map(x => x.PRL_REQLINEID);
            Map(x => x.PRL_REQLINE);
            Map(x => x.PRL_TASK);
            Map(x => x.PRL_TASKACTIVITY);
            Map(x => x.PRL_TASKACTIVITYLINE).ReadOnly().Formula("(SELECT b.TSA_LINE FROM TMTASKACTIVITIES b WHERE b.TSA_ID = PRL_TASKACTIVITY)");
            Map(x => x.PRL_TOTALVAT).ReadOnly().Formula("(CASE WHEN PRL_DISCOUNT = 0 THEN ((PRL_QUANTITY * PRL_UNITPRICE) * PRL_VATTAX)/100 ELSE  (((PRL_UNITPRICE * PRL_QUANTITY)-(PRL_UNITPRICE * PRL_QUANTITY * PRL_DISCOUNT) / 100) * PRL_VATTAX)/100 END)");
            Map(x => x.PRL_DISCOUNTEDUNITPRICE).ReadOnly().Formula("(CASE WHEN PRL_DISCOUNT = 0 THEN PRL_UNITPRICE ELSE PRL_UNITPRICE - ((PRL_UNITPRICE * PRL_DISCOUNT)/100) END)");
            Map(x => x.PRL_GRANDTOTAL).ReadOnly().Formula("(CASE WHEN PRL_DISCOUNT = 0 THEN (PRL_QUANTITY * PRL_UNITPRICE)+(((PRL_QUANTITY * PRL_UNITPRICE) * PRL_VATTAX)/100) ELSE (((PRL_UNITPRICE - ((PRL_UNITPRICE * PRL_DISCOUNT)/100))) * PRL_QUANTITY) +((((PRL_UNITPRICE * PRL_QUANTITY)-(PRL_UNITPRICE * PRL_QUANTITY * PRL_DISCOUNT) / 100) * PRL_VATTAX)/100) END)");
            Map(x => x.PRL_DISCOUNTEDTOTALPRICE).ReadOnly().Formula("(CASE WHEN PRL_DISCOUNT = 0 THEN PRL_QUANTITY * PRL_UNITPRICE ELSE ((PRL_UNITPRICE - ((PRL_UNITPRICE * PRL_DISCOUNT)/100))) * PRL_QUANTITY END)");
            Map(x => x.PRL_QUOTATION);
            Map(x => x.PRL_CREATEDBY);
            Map(x => x.PRL_CREATED);
            Map(x => x.PRL_UPDATEDBY);
            Map(x => x.PRL_UPDATED);
            Map(x => x.PRL_RECORDVERSION).Default("0");
        }
    }
}
