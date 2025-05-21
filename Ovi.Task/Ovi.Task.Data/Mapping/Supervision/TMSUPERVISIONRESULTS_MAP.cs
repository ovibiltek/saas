using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Supervision;

namespace Ovi.Task.Data.Mapping.Supervision
{
    public sealed class TMSUPERVISIONRESULTS_MAP : ClassMap<TMSUPERVISIONRESULTS>
    {
        public TMSUPERVISIONRESULTS_MAP()
        {
            Id(x => x.SVR_ID);
            Map(x => x.SVR_SUPERVISION);
            Map(x => x.SVR_QUESTION);
            Map(x => x.SVR_QUESTIONDESC).ReadOnly().Formula("(SELECT s.SVQ_QUE FROM TMSUPERVISIONQUESTIONS s WHERE s.SVQ_ID =  SVR_QUESTION)");
            Map(x => x.SVR_ANSWER);
            Map(x => x.SVR_NOTE).Length(PropertySettings.L250);
            Map(x => x.SVR_CREATED);
            Map(x => x.SVR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SVR_UPDATED);
            Map(x => x.SVR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SVR_RECORDVERSION);
        }
    }
}