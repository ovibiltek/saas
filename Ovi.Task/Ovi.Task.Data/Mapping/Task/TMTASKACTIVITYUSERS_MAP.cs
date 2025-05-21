using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKACTIVITYUSERS_MAP : ClassMap<TMTASKACTIVITYUSERS>
    {
        public TMTASKACTIVITYUSERS_MAP()
        {
            Id(x => x.TUS_ID);
            Map(x => x.TUS_TASK);
            Map(x => x.TUS_LINE);
            Map(x => x.TUS_TYPE).Length(PropertySettings.L50);
            Map(x => x.TUS_USER).Length(PropertySettings.L50);
            Map(x => x.TUS_USERDESC).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = TUS_USER)");
            Map(x => x.TUS_CREATED);
            Map(x => x.TUS_PICID).Formula("(SELECT d.DOC_ID FROM TMDOCSMETA d WHERE d.DOC_SUBJECT = 'USER' AND d.DOC_SOURCE = TUS_USER)");
            Map(x => x.TUS_RECORDVERSION).Default("0");
        }
    }
}