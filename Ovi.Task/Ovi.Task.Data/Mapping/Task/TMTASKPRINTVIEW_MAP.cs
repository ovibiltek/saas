using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;


namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKPRINTVIEW_MAP : ClassMap<TMTASKPRINTVIEW>
    {
        public TMTASKPRINTVIEW_MAP()
        {

            Id(x => x.TSK_ID);
            Map(x => x.TSK_REQUESTED);
            Map(x => x.TSK_SHORTDESC);
            Map(x => x.TSK_TASKTYPE);
            Map(x => x.TSK_CATEGORYDESC);
            Map(x => x.TSK_CUSDESC);
            Map(x => x.TSK_BRNADDRESS);
            Map(x => x.TSK_BRNDESC);
          
        }
    }
}
