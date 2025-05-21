using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKACTIVITIES_MAP : ClassMap<TMTASKACTIVITIES>
    {
        public TMTASKACTIVITIES_MAP()
        {
            Id(x => x.TSA_ID);
            Map(x => x.TSA_TASK);
            Map(x => x.TSA_LINE).Generated.Insert();
            Map(x => x.TSA_TEMPID);
            Map(x => x.TSA_DESC).Length(PropertySettings.L250);
            Map(x => x.TSA_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.TSA_TRADE).Length(PropertySettings.L50);
            Map(x => x.TSA_ASSIGNEDTO).Length(PropertySettings.L500);
            Map(x => x.TSA_PREDECESSOR);
            Map(x => x.TSA_LMAPPROVALREQUIRED);
            Map(x => x.TSA_PROJECTEDTIME);
            Map(x => x.TSA_CHKLISTLOCKED);
            Map(x => x.TSA_CHKLISTPROGRESS);
            Map(x => x.TSA_SCHFROM);
            Map(x => x.TSA_SCHTO);
            Map(x => x.TSA_STATUS).Length(PropertySettings.L4);
            Map(x => x.TSA_COMPLETED);
            Map(x => x.TSA_DATECOMPLETED);
            Map(x => x.TSA_RELEASED);
            Map(x => x.TSA_HIDDEN);
            Map(x => x.TSA_PRIVATE);
            Map(x => x.TSA_CHK01);
            Map(x => x.TSA_CHK02);
            Map(x => x.TSA_CHK03);
            Map(x => x.TSA_CHK04);
            Map(x => x.TSA_CHK05);
            Map(x => x.TSA_MOBILENOTE).Length(PropertySettings.L200);
            Map(x => x.TSA_COMPLETEDBY).Length(PropertySettings.L50);
            Map(x => x.TSA_CREATED);
            Map(x => x.TSA_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TSA_UPDATED);
            Map(x => x.TSA_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.TSA_RECORDVERSION).Default("0");
            Map(x => x.TSA_INVOICE);
            Map(x => x.TSA_ISVISIBLE).ReadOnly().Formula("dbo.CheckIfActivityIsPrivate(TSA_ID,:SessionContext.User)");


        }
    }
}