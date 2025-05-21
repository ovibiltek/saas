using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKS_MAP : ClassMap<TMTASKS>
    {
        public TMTASKS_MAP()
        {
            Id(x => x.TSK_ID);
            Map(x => x.TSK_ORGANIZATION);
            Map(x => x.TSK_DEPARTMENT);
            Map(x => x.TSK_PROJECT);
            Map(x => x.TSK_LOCATION);
            Map(x => x.TSK_EQUIPMENT);
            Map(x => x.TSK_EQUIPMENTREQUIRED);
            Map(x => x.TSK_CATEGORY);
            Map(x => x.TSK_TASKTYPE);
            Map(x => x.TSK_SHORTDESC);
            Map(x => x.TSK_STATUS);
            Map(x => x.TSK_PRIORITY);
            Map(x => x.TSK_TYPE);
            Map(x => x.TSK_TYPEENTITY);
            Map(x => x.TSK_PROGRESS);
            Map(x => x.TSK_HIDDEN);
            Map(x => x.TSK_REQUESTEDBY);
            Map(x => x.TSK_FOLLOWED);
            Map(x => x.TSK_REQUESTED);
            Map(x => x.TSK_RATING);
            Map(x => x.TSK_RATINGCOMMENTS);
            Map(x => x.TSK_DEADLINE);
            Map(x => x.TSK_COMPLETED);
            Map(x => x.TSK_CLOSED);
            Map(x => x.TSK_CHK01);
            Map(x => x.TSK_CHK02);
            Map(x => x.TSK_CHK03);
            Map(x => x.TSK_CHK04);
            Map(x => x.TSK_CHK05);
            Map(x => x.TSK_CREATED);
            Map(x => x.TSK_CREATEDBY);
            Map(x => x.TSK_UPDATED);
            Map(x => x.TSK_UPDATEDBY);
            Map(x => x.TSK_RECORDVERSION).Default("0");
            Map(x => x.TSK_CUSTOMER);
            Map(x => x.TSK_BRANCH);
            Map(x => x.TSK_HOLDREASON);
            Map(x => x.TSK_HOLDDATE);
            Map(x => x.TSK_PSPCODE);
            Map(x => x.TSK_PRPCODE);
            Map(x => x.TSK_PTASK);
            Map(x => x.TSK_REFERENCE);
            Map(x => x.TSK_CANCELLATIONREASON);
            Map(x => x.TSK_CANCELLATIONDESC);
            Map(x => x.TSK_NOTE);
            Map(x => x.TSK_CONTRACTID);

        }
    }
}