using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.Data.Mapping.Supervision
{
    public sealed class TMSUPERVISIONANSWERS_MAP : ClassMap<TMSUPERVISIONANSWERS>
    {
        public TMSUPERVISIONANSWERS_MAP()
        {
            Id(x => x.SVA_ID);
            Map(x => x.SVA_QUESTION);
            Map(x => x.SVA_ANSWER).Length(PropertySettings.L250);
            Map(x => x.SVA_SCORE);
            Map(x => x.SVA_CREATED);
            Map(x => x.SVA_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SVA_UPDATED);
            Map(x => x.SVA_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SVA_RECORDVERSION);
        }
    }
}