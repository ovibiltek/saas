using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMAUDITCLASSES_MAP : ClassMap<TMAUDITCLASSES>
    {
        public TMAUDITCLASSES_MAP()
        {
            Id(x => x.AUC_ID);
            Map(x => x.AUC_CLASS);
            Map(x => x.AUC_DESC);
            Map(x => x.AUC_NAMESPACE);
            Map(x => x.AUC_TYPE);
            Map(x => x.AUC_CREATED);
            Map(x => x.AUC_CREATEDBY);
            Map(x => x.AUC_UPDATED);
            Map(x => x.AUC_UPDATEDBY);
            Map(x => x.AUC_RECORDVERSION);
        }
    }
}