using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMWAREHOUSES_MAP : ClassMap<TMWAREHOUSES>
    {
        public TMWAREHOUSES_MAP()
        {
            Id(x => x.WAH_CODE).Length(PropertySettings.L50);
            Map(x => x.WAH_DESC).Length(PropertySettings.L250);
            Map(x => x.WAH_DESCF).Formula("dbo.GetDesc('TMWAREHOUSES','WAH_DESC', WAH_CODE, WAH_DESC, :SessionContext.Language)");
            Map(x => x.WAH_ORG).Length(PropertySettings.L50);
            Map(x => x.WAH_ORGDESC).Formula("dbo.GetDesc('TMORGS','ORG_DESC', WAH_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = WAH_ORG),:SessionContext.Language)");
            Map(x => x.WAH_WAREHOUSEMAN).Length(PropertySettings.L50);
            Map(x => x.WAH_WAREHOUSEMANDESC).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = WAH_WAREHOUSEMAN)");
            Map(x => x.WAH_WAREHOUSEMANGROUP).Formula("(SELECT u.USR_GROUP FROM TMUSERS u WHERE u.USR_CODE = WAH_WAREHOUSEMAN)");
            Map(x => x.WAH_PRICINGMETHOD).Length(PropertySettings.L50);
            Map(x => x.WAH_FULLADDRESS).Length(PropertySettings.L250);
            Map(x => x.WAH_PARENT).Length(PropertySettings.L50);
            Map(x => x.WAH_PARENTDESC).ReadOnly().Formula("dbo.GetDesc('TMWAREHOUSES','WAH_DESC', WAH_PARENT,(SELECT w.WAH_DESC FROM TMWAREHOUSES w WHERE w.WAH_CODE = WAH_PARENT),:SessionContext.Language)");
            Map(x => x.WAH_TOOL);
            Map(x => x.WAH_PUBLIC);
            Map(x => x.WAH_ACTIVE);
            Map(x => x.WAH_CREATED);
            Map(x => x.WAH_UPDATED);
            Map(x => x.WAH_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.WAH_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.WAH_RECORDVERSION).Default("0");
        }
    }
}