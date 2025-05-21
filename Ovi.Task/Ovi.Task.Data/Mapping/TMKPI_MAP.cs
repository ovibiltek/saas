using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMKPI_MAP : ClassMap<TMKPI>
    {
        public TMKPI_MAP()
        {
            Id(x => x.KPI_CODE).Length(PropertySettings.L50);
            Map(x => x.KPI_DESC).Length(PropertySettings.L250);
            Map(x => x.KPI_DESCF).Formula("dbo.GetDesc('TMKPI','KPI_DESC', KPI_CODE, KPI_DESC,:SessionContext.Language)");
            Map(x => x.KPI_INFO).Formula("dbo.GetDesc('TMKPI','KPI_INFO', KPI_CODE, '',:SessionContext.Language)");
            Map(x => x.KPI_TYPE).Length(PropertySettings.L50);
            Map(x => x.KPI_SQL).Length(PropertySettings.L4001);
            Map(x => x.KPI_MINVALUE);
            Map(x => x.KPI_MAXVALUE);
            Map(x => x.KPI_THRESHOLD).Length(PropertySettings.L50);
            Map(x => x.KPI_ACTIVE);
            Map(x => x.KPI_ORDER);
            Map(x => x.KPI_ISVALIDATED);
            Map(x => x.KPI_RECORDVERSION).Default("0");
            Map(x => x.KPI_SQLIDENTITY).Generated.Insert();
            Map(x => x.KPI_GROUP);
            Map(x => x.KPI_GROUPDESC).ReadOnly().Formula("dbo.GetDesc('TMSYSCODES','SYC_DESCRIPTION', KPI_GROUP, (SELECT s.SYC_DESCRIPTION FROM TMSYSCODES s WHERE s.SYC_CODE = KPI_GROUP AND s.SYC_GROUP = 'KPIGROUP'),:SessionContext.Language)");
            Map(x => x.KPI_SIZE);
            Map(x => x.KPI_USERINFO);
        }
    }
}