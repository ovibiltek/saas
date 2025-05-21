using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.Mapping.CustomFields
{
    public sealed class TMCUSTOMFIELDAUTH_MAP : ClassMap<TMCUSTOMFIELDAUTH>
    {
        public TMCUSTOMFIELDAUTH_MAP()
        {
            CompositeId().KeyProperty(x => x.CFA_ENTITY)
                .KeyProperty(x => x.CFA_TYPE)
                .KeyProperty(x => x.CFA_CODE)
                .KeyProperty(x => x.CFA_GROUP);
            Map(x => x.CFA_OPTIONAL);
            Map(x => x.CFA_PROTECTED);
            Map(x => x.CFA_REQUIRED);
            Map(x => x.CFA_SQLIDENTITY).Generated.Insert();
            Map(x => x.CFA_CREATEDBY);
            Map(x => x.CFA_CREATED);
            Map(x => x.CFA_UPDATED);
            Map(x => x.CFA_UPDATEDBY);
        }
    }
}