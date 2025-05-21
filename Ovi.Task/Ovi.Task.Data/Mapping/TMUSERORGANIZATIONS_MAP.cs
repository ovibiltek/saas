using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERORGANIZATIONS_MAP : ClassMap<TMUSERORGANIZATIONS>
    {
        public TMUSERORGANIZATIONS_MAP()
        {
            Id(x => x.UOG_ID);
            Map(x => x.UOG_USER);
            Map(x => x.UOG_ORG);
            Map(x => x.UOG_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', UOG_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = UOG_ORG),:SessionContext.Language)");
            Map(x => x.UOG_DEFAULT);
            Map(x => x.UOG_CREATED);
            Map(x => x.UOG_CREATEDBY);
            Map(x => x.UOG_UPDATED);
            Map(x => x.UOG_UPDATEDBY);
            Map(x => x.UOG_RECORDVERSION).Default("0");
        }
    }
}