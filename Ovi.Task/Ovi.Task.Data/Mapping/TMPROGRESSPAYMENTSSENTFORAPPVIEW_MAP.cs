using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPROGRESSPAYMENTSSENTFORAPPVIEW_MAP : ClassMap<TMPROGRESSPAYMENTSSENTFORAPPVIEW>
    {
        public TMPROGRESSPAYMENTSSENTFORAPPVIEW_MAP()
        {;
            Id(x => x.PSP_CODE);
            Map(x => x.PSP_DESC);
            Map(x => x.PSP_TASK);
            Map(x => x.PSP_CUSTOMER);
            Map(x => x.PSP_BRANCH);
            Map(x => x.PSP_TASKCATEGORY);
            Map(x => x.PSP_LASTAPPROVALSENT);
            Map(x => x.PSP_STATUS);
            Map(x => x.PSP_TOTALCOST);
            Map(x => x.PSP_TOTALPSP);
            Map(x => x.PSP_TOTALPROFIT);
            Map(x => x.PSP_CURR);
            Map(x => x.PSP_COMMENT_1);
            Map(x => x.PSP_COMMENT_2);
            Map(x => x.PSP_COMMENT_3);
            Map(x => x.PSP_COMMENT_4);
            Map(x => x.PSP_COMMENT_5);

        }
    }
}