using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDASHNOTIFICATIONS_MAP : ClassMap<TMDASHNOTIFICATIONS>
    {
        public TMDASHNOTIFICATIONS_MAP()
        {
            Id(x => x.DNT_ID);
            Map(x => x.DNT_ENTITY);
            Map(x => x.DNT_REFID);
            Map(x => x.DNT_CONTENT);
            Map(x => x.DNT_ISREADED);
            Map(x => x.DNT_NOTIFICATIONTYPE);
            Map(x => x.DNT_CREATED);
            Map(x => x.DNT_CREATEDBY);
            Map(x => x.DNT_UPDATED);
            Map(x => x.DNT_UPDATEDBY);
        }
    }
}

