using FluentNHibernate.Mapping;
using NHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;


namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSCREENGUIDES_MAP : ClassMap<TMSCREENGUIDES>
    {
        public TMSCREENGUIDES_MAP(){
            Id(x => x.SCG_SCREENCODE).Length(PropertySettings.L50);
            Map(x => x.SCG_ENDUSERGUIDE).Length(PropertySettings.L4001);
            Map(x => x.SCG_ADMINGUIDE).Length(PropertySettings.L4001);
            Map(x=> x.SCG_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SCG_CREATED);
            Map(x=> x.SCG_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SCG_UPDATED);



        }
    }
}
