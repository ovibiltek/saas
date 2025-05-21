using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.Data.Mapping.Supervision
{
    public sealed class TMSUPERVISIONQUESTIONS_MAP : ClassMap<TMSUPERVISIONQUESTIONS>
    {
        public TMSUPERVISIONQUESTIONS_MAP()
        {
            Id(x => x.SVQ_ID);
            Map(x => x.SVQ_ORDER);
            Map(x => x.SVQ_QUE).Length(PropertySettings.L250);
            Map(x => x.SVQ_CATEGORY).Length(PropertySettings.L50);
            Map(x => x.SVQ_WEIGHT);
            Map(x => x.SVQ_CREATED);
            Map(x => x.SVQ_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SVQ_UPDATED);
            Map(x => x.SVQ_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SVQ_RECORDVERSION);
        }
    }
}