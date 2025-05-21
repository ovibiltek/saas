using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMADDRESSSECTIONS_MAP : ClassMap<TMADDRESSSECTIONS>
    {
        public TMADDRESSSECTIONS_MAP()
        {
            Id(x => x.ADS_ID);
            Map(x => x.ADS_CODE);
            Map(x => x.ADS_DESC);
            Map(x => x.ADS_TYPE);
            Map(x => x.ADS_PARENT);
            Map(x => x.ADS_PARENTDESC).Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = ADS_PARENT)").ReadOnly();
            Map(x => x.ADS_REGION);
            Map(x => x.ADS_REGIONDESC).ReadOnly().Formula("dbo.GetDesc('TMREGIONS','REG_DESC', ADS_REGION,(SELECT r.REG_DESC FROM TMREGIONS r WHERE r.REG_CODE = ADS_REGION),:SessionContext.Language)");
            Map(x => x.ADS_ACTIVE);
            Map(x => x.ADS_CREATED);
            Map(x => x.ADS_CREATEDBY);
            Map(x => x.ADS_UPDATED);
            Map(x => x.ADS_UPDATEDBY);
            Map(x => x.ADS_RECORDVERSION).Default("0");
        }
    }
}