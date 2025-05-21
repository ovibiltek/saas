using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTASKRATINGREVIEWS_MAP : ClassMap<TMTASKRATINGREVIEWS>
    {
        public TMTASKRATINGREVIEWS_MAP()
        {
            Id(x => x.TRR_ID);
            Map(x => x.TRR_REVIEW).Length(PropertySettings.L500);
            Map(x => x.TRR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TRR_CREATED);
            Map(x => x.TRR_TSKID);
            Map(x => x.TRR_SENDMAIL);
        }
    }
}