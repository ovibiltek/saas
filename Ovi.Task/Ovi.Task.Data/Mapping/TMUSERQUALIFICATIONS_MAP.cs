using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Maps
{
    public sealed class TMUSERQUALIFICATIONS_MAP : ClassMap<TMUSERQUALIFICATIONS>
    {
        public TMUSERQUALIFICATIONS_MAP()
        { 
            Id(x => x.USQ_ID); 
            Map(x => x.USQ_QUALIFICATION);
            Map(x => x.USQ_QUALIFICATIONDESC).ReadOnly().Formula("(SELECT p.QUL_DESC FROM TMQUALIFICATIONS p WHERE p.QUL_CODE = USQ_QUALIFICATION)");
            Map(x => x.USQ_USRCODE); 
            Map(x => x.USQ_STARTDATE); 
            Map(x => x.USQ_EXPIRATIONDATE); 
            Map(x => x.USQ_NOTE); 
            Map(x => x.USQ_TEMPORARILYDISQUALIFIED); 
            Map(x => x.USQ_CREATED); 
            Map(x => x.USQ_CREATEDBY); 
            Map(x => x.USQ_UPDATED); 
            Map(x => x.USQ_UPDATEDBY); 
            Map(x => x.USQ_RECORDVERSION); 
        }
    }
}