using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCOMMENTS_MAP : ClassMap<TMCOMMENTS>
    {
        public TMCOMMENTS_MAP()
        {
            Id(x => x.CMN_ID);
            Map(x => x.CMN_SUBJECT).Length(PropertySettings.L50);
            Map(x => x.CMN_SOURCE);
            Map(x => x.CMN_ORGANIZATION).Length(PropertySettings.L50);
            Map(x => x.CMN_TEXT).Length(PropertySettings.L4001);
            Map(x => x.CMN_VISIBLETOCUSTOMER);
            Map(x => x.CMN_VISIBLETOSUPPLIER);
            Map(x => x.CMN_CREATED);
            Map(x => x.CMN_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CMN_UPDATED);
            Map(x => x.CMN_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CMN_RECORDVERSION).Default("0");
            Map(x => x.CMN_DATESEEN);
            Map(x => x.CMN_SEENBY);
        }
    }
}