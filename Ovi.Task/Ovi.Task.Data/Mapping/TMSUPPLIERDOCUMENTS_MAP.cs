using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Maps
{
    public sealed class TMSUPPLIERDOCUMENTS_MAP : ClassMap<TMSUPPLIERDOCUMENTS>
    {
        public TMSUPPLIERDOCUMENTS_MAP()
        {
            Id(x => x.SDC_ID);
            Map(x => x.SDC_SUPPLIER);
            Map(x => x.SDC_DOCUMENTTYPE);
            Map(x => x.SDC_DOCUMENTTYPEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SUPPLIERDOCUMENTTYPE',SDC_DOCUMENTTYPE,:SessionContext.Language)");
            Map(x => x.SDC_DESCRIPTION);
            Map(x => x.SDC_STARTDATE);
            Map(x => x.SDC_ENDDATE);
            Map(x => x.SDC_CREATED);
            Map(x => x.SDC_CREATEDBY);
            Map(x => x.SDC_UPDATED);
            Map(x => x.SDC_UPDATEDBY);
            Map(x => x.SDC_RECORDVERSION);
        }
    }
}