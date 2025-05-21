using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCOMMENTSVIEW_MAP : ClassMap<TMCOMMENTSVIEW>
    {
        public TMCOMMENTSVIEW_MAP()
        {
            ReadOnly();
            Id(x => x.CMN_ID);
            Map(x => x.CMN_SUBJECT);
            Map(x => x.CMN_SOURCE);
            Map(x => x.CMN_ORGANIZATION);
            Map(x => x.CMN_TEXT).Length(4001);
            Map(x => x.CMN_VISIBLETOCUSTOMER);
            Map(x => x.CMN_VISIBLETOSUPPLIER);
            Map(x => x.CMN_CREATED);
            Map(x => x.CMN_CREATEDBY);
            Map(x => x.CMN_CREATEDBYDESC);
            Map(x => x.CMN_USERPIC);
            Map(x => x.CMN_USERPICGUID);
            Map(x => x.CMN_USERTYPE);
            Map(x => x.CMN_DATESEEN);
            Map(x => x.CMN_SEENBY);
        }
    }
}