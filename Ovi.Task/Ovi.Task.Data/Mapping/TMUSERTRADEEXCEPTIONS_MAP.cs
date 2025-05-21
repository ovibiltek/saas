using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERTRADEEXCEPTIONS_MAP : ClassMap<TMUSERTRADEEXCEPTIONS>
    {
        public TMUSERTRADEEXCEPTIONS_MAP()
        {
            Id(x => x.UTE_ID);
            Map(x => x.UTE_USER).Length(PropertySettings.L50);
            Map(x => x.UTE_USERDESC).ReadOnly().Length(PropertySettings.L250).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = UTE_USER)");
            Map(x => x.UTE_TRADE).Length(PropertySettings.L50);
            Map(x => x.UTE_TRADEDESC).ReadOnly().Length(PropertySettings.L250).Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = UTE_TRADE)");
            Map(x => x.UTE_START);
            Map(x => x.UTE_END);
            Map(x => x.UTE_CREATED);
            Map(x => x.UTE_UPDATED);
            Map(x => x.UTE_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.UTE_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.UTE_RECORDVERSION).Default("0");
        }
    }
}