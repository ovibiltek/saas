using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPURCHASEORDERREQUISITIONLINES_MAP : ClassMap<TMPURCHASEORDERREQUISITIONLINES>
    {
        public TMPURCHASEORDERREQUISITIONLINES_MAP()
        {
            Id(x => x.PQL_ID);
            Map(x => x.PQL_REQ);
            Map(x => x.PQL_LINE);
            Map(x => x.PQL_PARTID);
            Map(x => x.PQL_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_PARTCURR).ReadOnly().Formula("(SELECT p.PAR_CURR FROM TMPARTS p WHERE p.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_PARTNOTE);
            Map(x => x.PQL_QUANTITY);
            Map(x => x.PQL_POSTATUS).ReadOnly().Formula("(SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = (SELECT po.POR_STATUS FROM TMPURCHASEORDERLINES pl INNER JOIN TMPURCHASEORDERS po ON po.POR_ID = pl.PRL_PORID WHERE pl.PRL_REQLINEID = PQL_ID AND pl.PRL_REQLINE = PQL_LINE) AND s.STA_ENTITY = 'PURCHASEORDER')");
            Map(x => x.PQL_PARUOM).ReadOnly().Formula("(SELECT T.PAR_UOM FROM TMPARTS T WHERE T.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_REQUESTEDUOM);
            Map(x => x.PQL_REQUESTEDUOMDESC).ReadOnly().Formula("(SELECT T.UOM_DESC FROM TMUOMS T WHERE T.UOM_CODE = PQL_REQUESTEDUOM)");
            Map(x => x.PQL_UOMMULTI);
            Map(x => x.PQL_REQUESTEDDATE);
            Map(x => x.PQL_UNITPRICE);
            Map(x => x.PQL_CURRENCY);
            Map(x => x.PQL_EXCHANGERATE);
            Map(x => x.PQL_VATTAX);
            Map(x => x.PQL_TAX2);
            Map(x => x.PQL_QUOTATION).ReadOnly().Formula("(SELECT T.PRQ_QUOTATION FROM TMPURCHASEORDERREQUISITIONS T WHERE T.PRQ_ID = PQL_REQ)");
            Map(x => x.PQL_TASK).ReadOnly().Formula("(SELECT T.PRQ_TASK FROM TMPURCHASEORDERREQUISITIONS T WHERE T.PRQ_ID = PQL_REQ)");
            Map(x => x.PQL_TASKACTIVITY).ReadOnly().Formula("(SELECT T.PRQ_TASKACTIVITY FROM TMPURCHASEORDERREQUISITIONS T WHERE T.PRQ_ID = PQL_REQ)");
            Map(x => x.PQL_CREATED);
            Map(x => x.PQL_CREATEDBY);
            Map(x => x.PQL_UPDATED);
            Map(x => x.PQL_UPDATEDBY);
            Map(x => x.PQL_RECORDVERSION).Default("0");
        }
    }
}
