using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBOOKEDHOURS_MAP : ClassMap<TMBOOKEDHOURS>
    {
        public TMBOOKEDHOURS_MAP()
        {
            Id(x => x.BOO_ID);
            Map(x => x.BOO_TASK);
            Map(x => x.BOO_LINE);
            Map(x => x.BOO_LINEDESC).Formula("(SELECT ta.TSA_DESC FROM TMTASKACTIVITIES ta WHERE ta.TSA_LINE = BOO_LINE AND ta.TSA_TASK = BOO_TASK)");
            Map(x => x.BOO_USER);
            Map(x => x.BOO_USERDESC).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = BOO_USER)");
            Map(x => x.BOO_TRADE);
            Map(x => x.BOO_OTYPE);
            Map(x => x.BOO_DATE);
            Map(x => x.BOO_START);
            Map(x => x.BOO_END);
            Map(x => x.BOO_CALCHOURS);
            Map(x => x.BOO_AUTO);
            Map(x => x.BOO_TYPE);
            Map(x => x.BOO_CREATED);
            Map(x => x.BOO_CREATEDBY);
            Map(x => x.BOO_UPDATED);
            Map(x => x.BOO_UPDATEDBY);
            Map(x => x.BOO_RECORDVERSION).Default("0");
        }
    }
}