using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.Mapping.CustomFields
{
    public sealed class TMCUSTOMFIELDAUTHVIEW_MAP : ClassMap<TMCUSTOMFIELDAUTHVIEW>
    {
        public TMCUSTOMFIELDAUTHVIEW_MAP()
        {
            ReadOnly();
            CompositeId()
                .KeyProperty(x => x.CFA_ENTITY)
                .KeyProperty(x => x.CFA_TYPE)
                .KeyProperty(x => x.CFA_CODE)
                .KeyProperty(x => x.CFA_GROUP);
            Map(x => x.CFA_OPTIONAL);
            Map(x => x.CFA_PROTECTED);
            Map(x => x.CFA_REQUIRED);
            Map(x => x.CFA_HIDDEN);
            Map(x => x.CFA_VAL);
        }
    }
}