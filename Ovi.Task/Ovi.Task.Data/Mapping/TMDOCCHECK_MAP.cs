using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDOCCHECK_MAP : ClassMap<TMDOCCHECK>
    {
        public TMDOCCHECK_MAP()
        {
            Id(x => x.CHK_ID);
            Map(x => x.CHK_DOCID);
            Map(x => x.CHK_VALUE);
            Map(x => x.CHK_CREATED);
            Map(x => x.CHK_CREATEDBY);
            Map(x => x.CHK_UPDATED);
            Map(x => x.CHK_UPDATEDBY);
            Map(x => x.CHK_RECORDVERSION);
        }
    }
}