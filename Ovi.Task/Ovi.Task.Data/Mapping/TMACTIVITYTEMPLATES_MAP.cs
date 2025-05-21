using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMACTIVITYTEMPLATES_MAP : ClassMap<TMACTIVITYTEMPLATES>
    {
        public TMACTIVITYTEMPLATES_MAP()
        {
            Id(x => x.TAT_ID);
            Map(x => x.TAT_TYPE).Length(PropertySettings.L50);
            Map(x => x.TAT_ENTITY).Length(PropertySettings.L50);
            Map(x => x.TAT_CODE).Length(PropertySettings.L50);
            Map(x => x.TAT_LINE);
            Map(x => x.TAT_STATUS).Length(PropertySettings.L50);
            Map(x => x.TAT_DESC).Length(PropertySettings.L250);
            Map(x => x.TAT_TASKDEPARTMENT);
            Map(x => x.TAT_TASKDESC);
            Map(x => x.TAT_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.TAT_TRADE).Length(PropertySettings.L50);
            Map(x => x.TAT_ASSIGNEDTO).Length(PropertySettings.L4001);
            Map(x => x.TAT_PREDECESSOR);
            Map(x => x.TAT_PREDECESSORDESC).ReadOnly().Formula("(SELECT a.TAT_DESC FROM TMACTIVITYTEMPLATES a WHERE a.TAT_TYPE = TAT_TYPE AND a.TAT_CODE = TAT_CODE AND a.TAT_ENTITY = TAT_ENTITY AND a.TAT_LINE = TAT_PREDECESSOR)");
            Map(x => x.TAT_CHKLISTTMP).Length(PropertySettings.L50);
            Map(x => x.TAT_LMAPPROVALREQUIRED);
            Map(x => x.TAT_HIDDEN);
            Map(x => x.TAT_PRIVATE);
            Map(x => x.TAT_CREATESEPARATEACTIVITY);
            Map(x => x.TAT_CREATED);
            Map(x => x.TAT_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TAT_UPDATED);
            Map(x => x.TAT_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.TAT_RECORDVERSION).Default("0");
        }
    }
}