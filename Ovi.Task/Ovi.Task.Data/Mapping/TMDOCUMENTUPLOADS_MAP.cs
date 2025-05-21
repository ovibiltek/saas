using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDOCUMENTUPLOADS_MAP : ClassMap<TMDOCUMENTUPLOADS>
    {
        public TMDOCUMENTUPLOADS_MAP()
        {
            Id(x => x.DUP_ID);
            Map(x => x.DUP_COUNT);
            Map(x => x.DUP_SUBJECT);
            Map(x => x.DUP_SYSTEM);
            Map(x => x.DUP_SOURCE);
            Map(x => x.DUP_SIZE);
            Map(x => x.DUP_UPLOADED);
            Map(x => x.DUP_UPLOADEDBY);
        }
    }
}