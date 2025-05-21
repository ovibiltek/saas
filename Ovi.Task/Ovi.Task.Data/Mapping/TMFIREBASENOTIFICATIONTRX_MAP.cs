using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMFIREBASENOTIFICATIONTRX_MAP : ClassMap<TMFIREBASENOTIFICATIONTRX>
    {
        public TMFIREBASENOTIFICATIONTRX_MAP()
        {
            Id(x => x.NTX_ID);
            Map(x => x.NTX_NOTIFICATION);
            Map(x => x.NTX_ERROR).Length(PropertySettings.L4001);
            Map(x => x.NTX_MSG).Length(PropertySettings.L4001);
            Map(x => x.NTX_DATESENT);
        }
    }
}