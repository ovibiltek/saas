using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTSKSTATUSMAILCONFIG_MAP : ClassMap<TMTSKSTATUSMAILCONFIG>
    {
        public TMTSKSTATUSMAILCONFIG_MAP()
        {
            Id(x => x.TSM_ID);
            Map(x => x.TSM_CUSTOMER);
            Map(x => x.TSM_STATUS);
            Map(x => x.TSM_STATUSENTITY);
            Map(x => x.TSM_INCCATEGORIES);
            Map(x => x.TSM_EXCCATEGORIES);
            Map(x => x.TSM_SENDATTACH);
            Map(x => x.TSM_MAILTO);
            Map(x => x.TSM_BRNCSR);
            Map(x => x.TSM_BRNAUTHORIZED);
            Map(x => x.TSM_BRNREGRESPONSIBLE);
            Map(x => x.TSM_CUSPM);
            Map(x => x.TSM_CREATEDBY);
            Map(x => x.TSM_CREATED);
            Map(x => x.TSM_UPDATEDBY);
            Map(x => x.TSM_UPDATED);
            Map(x => x.TSM_RECORDVERSION);
        }
    }
}

