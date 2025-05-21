using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBATCHPROGRESSDATA_MAP : ClassMap<TMBATCHPROGRESSDATA>
    {
        public TMBATCHPROGRESSDATA_MAP()
        {
            Id(x => x.PRG_ID);
            Map(x => x.PRG_SESSION);
            Map(x => x.PRG_FILENAME);
            Map(x => x.PRG_BATCH);
            Map(x => x.PRG_USER);
            Map(x => x.PRG_PROGRESSDATA);
            Map(x => x.PRG_STATUS);
            Map(x => x.PRG_CREATED);
            Map(x => x.PRG_CREATEDBY);
            Map(x => x.PRG_UPDATED);
            Map(x => x.PRG_UPDATEDBY);
            Map(x => x.PRG_RECORDVERSION);
        }
    }
}