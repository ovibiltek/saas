using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public class TMPURCHASEREQUESTPOVIEW_MAP : ClassMap<TMPURCHASEREQUESTPOVIEW>
    {
        public TMPURCHASEREQUESTPOVIEW_MAP()
        {
            Id(x => x.PQL_ID);
            Map(x => x.PQL_REQ);
            Map(x => x.PQL_LINE);
            Map(x => x.PQL_PARTID);
            Map(x => x.PQL_PARTNOTE);
            Map(x => x.PQL_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_PARTCURR).ReadOnly().Formula("(SELECT p.PAR_CURR FROM TMPARTS p WHERE p.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = PQL_PARTID)");
            Map(x => x.PQL_QUANTITY);
            Map(x => x.PQL_REQUESTEDUOM);
            Map(x => x.PQL_UOMMULTI);
            Map(x => x.PQL_REQUESTEDDATE);
            Map(x => x.PQL_UNITPRICE);
            Map(x => x.PQL_CURRENCY);
            Map(x => x.PQL_EXCHANGERATE);
            Map(x => x.PQL_VATTAX);
            Map(x => x.PQL_TAX2);
            Map(x => x.PQL_CREATED);
            Map(x => x.PQL_CREATEDBY);
            Map(x => x.PQL_UPDATED);
            Map(x => x.PQL_UPDATEDBY);
            Map(x => x.PQL_RECORDVERSION);
            Map(x => x.PQL_POID);
            Map(x => x.PQL_PODESC);
            Map(x => x.PQL_POORG);
            Map(x => x.PQL_POTYPEENTITY);
            Map(x => x.PQL_POTYPE);
            Map(x => x.PQL_POSTATUS);
            Map(x => x.PQL_POSTATUSENTITY);
            Map(x => x.PQL_POTASK);
            Map(x => x.PQL_POCANCELLATIONREASON);
            Map(x => x.PQL_POWAREHOUSE);
            Map(x => x.PQL_POREQUESTEDBY);
            Map(x => x.PQL_POREQUESTED);
            Map(x => x.PQL_POSUPPLIER);
            Map(x => x.PQL_POCURRENCY);
            Map(x => x.PQL_POPAYMENTTERM);
            Map(x => x.PQL_POEXCHANGERATE);
            Map(x => x.PQL_PODELIVERYADR);
            Map(x => x.PQL_POCREATED);
            Map(x => x.PQL_POCREATEDBY);
            Map(x => x.PQL_POUPDATED);
            Map(x => x.PQL_POUPDATEDBY);
            Map(x => x.PQL_PORECORDVERSION);
        }
    }
}
