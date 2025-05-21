using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSESSIONS_MAP : ClassMap<TMSESSIONS>
    {
        public TMSESSIONS_MAP()
        {
            Id(x => x.TMS_ID);
            Map(x => x.TMS_SESSID);
            Map(x => x.TMS_SESSPRODUCTID);
            Map(x => x.TMS_SESSUSER);
            Map(x => x.TMS_IP);
            Map(x => x.TMS_BROWSER);
            Map(x => x.TMS_LOGIN);
            Map(x => x.TMS_RECORDVERSION).Default("0");
        }
    }
}