using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMQUALIFICATIONS_MAP : ClassMap<TMQUALIFICATIONS>
    {
        public TMQUALIFICATIONS_MAP()
        {
            Id(x => x.QUL_CODE);
            Map(x => x.QUL_DESC);
            Map(x => x.QUL_ACTIVE);
            Map(x => x.QUL_CREATED);
            Map(x => x.QUL_CREATEDBY);
            Map(x => x.QUL_UPDATED);
            Map(x => x.QUL_UPDATEDBY);
            Map(x => x.QUL_RECORDVERSION);
        }
    }
}