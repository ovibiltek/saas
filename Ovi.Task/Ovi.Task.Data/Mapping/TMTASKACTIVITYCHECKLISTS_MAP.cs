using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTASKACTIVITYCHECKLISTS_MAP : ClassMap<TMTASKACTIVITYCHECKLISTS>
    {
        public TMTASKACTIVITYCHECKLISTS_MAP()
        {
            Id(x => x.TAC_ID);
            Map(x => x.TAC_TASK);
            Map(x => x.TAC_ACTIVITY);
            Map(x => x.TAC_ACTIVITYDESC).ReadOnly()
                .Formula("(SELECT tsa.TSA_DESC FROM TMTASKACTIVITIES tsa WHERE tsa.TSA_TASK = TAC_TASK AND tsa.TSA_LINE = TAC_ACTIVITY)");
            Map(x => x.TAC_CHKTMP);
            Map(x => x.TAC_CHKTMPDESC).ReadOnly()
                .Formula("(SELECT c.CLT_DESC FROM TMCHKLISTTEMPLATES c WHERE c.CLT_CODE = TAC_CHKTMP)");
            Map(x => x.TAC_DESCRIPTION);
            Map(x => x.TAC_CHKLISTPROGRESS);
            Map(x => x.TAC_HIDDEN);
            Map(x => x.TAC_COMPLETED);
            Map(x => x.TAC_AUTO);
            Map(x => x.TAC_SEQUENTIAL);
            Map(x => x.TAC_CREATED);
            Map(x => x.TAC_CREATEDBY);
            Map(x => x.TAC_UPDATED);
            Map(x => x.TAC_UPDATEDBY);
            Map(x => x.TAC_RECORDVERSION);
        }
    }
}