using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMODELS_MAP : ClassMap<TMMODELS>
    {
        public TMMODELS_MAP()
        {
            Id(x => x.MDL_ID);
            Map(x => x.MDL_BRAND);
            Map(x => x.MDL_BRANDDESC).ReadOnly().Formula("dbo.GetDesc('TMBRANDS','BRA_DESC', MDL_BRAND, (SELECT b.BRA_DESC FROM TMBRANDS b WHERE b.BRA_CODE = MDL_BRAND) ,:SessionContext.Language)");
            Map(x => x.MDL_CODE);
            Map(x => x.MDL_ACTIVE);
            Map(x => x.MDL_CREATED);
            Map(x => x.MDL_CREATEDBY);
            Map(x => x.MDL_UPDATED);
            Map(x => x.MDL_UPDATEDBY);
            Map(x => x.MDL_RECORDVERSION).Default("0");
        }
    }
}