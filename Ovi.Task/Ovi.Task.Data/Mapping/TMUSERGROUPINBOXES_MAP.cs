using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERGROUPINBOXES_MAP : ClassMap<TMUSERGROUPINBOXES>
    {
        public TMUSERGROUPINBOXES_MAP()
        {
            Id(x => x.UGI_ID);
            Map(x => x.UGI_USERGROUP).Length(PropertySettings.L50);
            Map(x => x.UGI_INBOX).Length(PropertySettings.L50);
            Map(x => x.UGI_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.UGI_CREATED);
            Map(x => x.UGI_RECORDVERSION).Default("0");
        }
    }
}