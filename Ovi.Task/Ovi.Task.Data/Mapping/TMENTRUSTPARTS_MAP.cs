using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMENTRUSTPARTS_MAP : ClassMap<TMENTRUSTPARTS>
    {
        public TMENTRUSTPARTS_MAP()
        {
            Id(x => x.ENP_ID);
            Map(x => x.ENP_ENTRUSTID);
            Map(x => x.ENP_ENTRUSTDESC).ReadOnly().Formula("(SELECT e.ETR_DESC FROM TMENTRUSTS e WHERE e.ETR_ID = ENP_ENTRUSTID)");
            Map(x => x.ENP_PART);
            Map(x => x.ENP_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = ENP_PART)");
            Map(x => x.ENP_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = ENP_PART)");
            Map(x => x.ENP_QUANTITY);
            Map(x => x.ENP_CREATED);
            Map(x => x.ENP_CREATEDBY);
            Map(x => x.ENP_UPDATED);
            Map(x => x.ENP_UPDATEDBY);
            Map(x => x.ENP_RECORDVERSION);
        }
    }
}