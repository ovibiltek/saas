using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTASKCOUNTSBYBRANCHESVIEW_MAP : ClassMap<TMTASKCOUNTSBYBRANCHESVIEW>
    {
        public TMTASKCOUNTSBYBRANCHESVIEW_MAP()
        {;
            Id(x => x.TCB_CUSCODE);
            Map(x => x.TCB_CUSDESC);
            Map(x => x.TCB_ACTIVE);
            Map(x => x.TCB_CREATED);
            Map(x => x.TCB_PREVIOUSLYBRANCHCOUNT);
            Map(x => x.TCB_PASTBRANCHCOUNT);
            Map(x => x.TCB_CURRENTBRANCHCOUNT);
            Map(x => x.TCB_ALLACTBRANCHCOUNT);
            Map(x => x.TCB_ALLPASSIVEBRANCHCOUNT);
            Map(x => x.TCB_PREVIOUSLYTASKCOUNT);
            Map(x => x.TCB_PASTTASKCOUNT);
            Map(x => x.TCB_CURRENTTASKCOUNT);
            Map(x => x.TCB_ALLTASKCOUNT);
            Map(x => x.TCB_PREVIOUSLYTASKCOUNTDIFBRANCH);
            Map(x => x.TCB_PASTTASKCOUNTDIFBRANCH);
            Map(x => x.TCB_CURRENTTASKCOUNTDIFBRANCH);
            Map(x => x.TCB_ALLTASKDIFBRANCH); }
    }
}