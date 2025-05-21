using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMEMAILVIEW_MAP : ClassMap<TMEMAILVIEW>
    {
        public TMEMAILVIEW_MAP()
        {
            Id(x => x.MAIL_ID);
            Map(x => x.MAIL_GROUP);
            Map(x => x.MAIL_ORG);
            Map(x => x.MAIL_CODE);
            Map(x => x.MAIL_TYPEENTITY);
            Map(x => x.MAIL_TYPE);
            Map(x => x.MAIL_ADDRESS);
        }
    }
}