using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCALENDARVIEW_MAP : ClassMap<TMCALENDARVIEW>
    {
        public TMCALENDARVIEW_MAP()
        {
            ReadOnly();
            Id(x => x.TCA_ID);
            Map(x => x.TCA_TASK);
            Map(x => x.TCA_ACTLINE);
            Map(x => x.TCA_ACTDESC);
            Map(x => x.TCA_PRIORITY).Formula("dbo.GetDesc('TMPRIORITIES','PRI_DESC', TCA_PRIORITY, (SELECT p.PRI_DESC FROM TMPRIORITIES p WHERE p.PRI_CODE = TCA_PRIORITY),:SessionContext.Language)");
            Map(x => x.TCA_PRIORITYCOLOR);
            Map(x => x.TCA_PRIORITYCSS);
            Map(x => x.TCA_ORGANIZATION);
            Map(x => x.TCA_STATUS);
            Map(x => x.TCA_PSTATUS);
            Map(x => x.TCA_STATUSDESC).Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'TASK#' + TCA_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TCA_STATUS AND s.STA_ENTITY = 'TASK'), :SessionContext.Language)");
            Map(x => x.TCA_SHORTDESC);
            Map(x => x.TCA_ACTSTATUS);
            Map(x => x.TCA_TYPE);
            Map(x => x.TCA_RELATEDUSER);
            Map(x => x.TCA_RELATEDUSERDESC);
            Map(x => x.TCA_DEPARTMENT);
            Map(x => x.TCA_TSKDEPARTMENT);
            Map(x => x.TCA_DATE);
            Map(x => x.TCA_PROGRESS);
            Map(x => x.TCA_ACTUALHOURS);
            Map(x => x.TCA_PLANNEDHOURS);
            Map(x => x.TCA_YEAR);
            Map(x => x.TCA_MONTH);
            Map(x => x.TCA_WEEK);
            Map(x => x.TCA_WEEKDAY);
            Map(x => x.TCA_HOURS);
            Map(x => x.TCA_FROM);
            Map(x => x.TCA_TO);
            Map(x => x.TCA_TSKFROM);
            Map(x => x.TCA_TSKTO);
            Map(x => x.TCA_DURSTART);
            Map(x => x.TCA_DUREND);
            Map(x => x.TCA_COMPFL);
            Map(x => x.TCA_ACTSTAT);
            Map(x => x.TCA_CREATEDBY);
            Map(x => x.TCA_REQUESTEDBY);
            Map(x => x.TCA_CUSCODE);
            Map(x => x.TCA_CUSTOMER);
            Map(x => x.TCA_BRNCODE);
            Map(x => x.TCA_BRANCH);
            Map(x => x.TCA_SUPPLIER);
        }
    }
}