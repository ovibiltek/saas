using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMENU_MAP : ClassMap<TMMENU>
    {
        public TMMENU_MAP()
        {
            CompositeId().KeyProperty(x => x.MNU_SCREEN)
                .KeyProperty(x => x.MNU_USERGROUP);
            Map(x => x.MNU_ACTIVE);
            Map(x => x.MNU_SECURITYFILTER);
            Map(x => x.MNU_SECURITYFILTERDESC).ReadOnly().Formula("(SELECT s.SCF_DESC FROM TMSECURITYFILTERS s WHERE s.SCF_CODE = MNU_SECURITYFILTER)");
            Map(x => x.MNU_SQLIDENTITY).Generated.Insert();
        }
    }
}