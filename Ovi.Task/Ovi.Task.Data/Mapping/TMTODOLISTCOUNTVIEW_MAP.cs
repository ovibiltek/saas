using FluentNHibernate.Mapping;using Ovi.Task.Data.Entity;namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTODOLISTCOUNTVIEW_MAP : ClassMap<TMTODOLISTCOUNTVIEW>
    {
        public TMTODOLISTCOUNTVIEW_MAP()        {            CompositeId().KeyProperty(x => x.TOD_DEPARTMENT).KeyProperty(x => x.TOD_CREATEDBY);
            Map(x => x.TOD_COUNT);
        }
    }}