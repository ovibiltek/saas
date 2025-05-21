using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPARTTRANS_MAP : ClassMap<TMPARTTRANS>
    {
        public TMPARTTRANS_MAP()
        {
            Id(x => x.PTR_ID);
            Map(x => x.PTR_DESCRIPTION).Length(PropertySettings.L250);
            Map(x => x.PTR_TYPE).Length(PropertySettings.L50);
            Map(x => x.PTR_ORGANIZATION).Length(PropertySettings.L50);
            Map(x => x.PTR_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', PTR_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = PTR_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.PTR_TRANSACTIONDATE);
            Map(x => x.PTR_WAREHOUSE).Length(PropertySettings.L50);
            Map(x => x.PTR_WAREHOUSEDESC).ReadOnly().Formula("dbo.GetDesc('TMWAREHOUSES','WAH_DESC', PTR_WAREHOUSE, (SELECT w.WAH_DESC FROM TMWAREHOUSES w WHERE w.WAH_CODE = PTR_WAREHOUSE), :SessionContext.Language)");
            Map(x => x.PTR_STATUS).Length(PropertySettings.L50);
            Map(x => x.PTR_INTREF).Length(PropertySettings.L50);
            Map(x => x.PTR_CREATED);
            Map(x => x.PTR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PTR_CREATEDBYDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = PTR_CREATEDBY)");
            Map(x => x.PTR_UPDATED);
            Map(x => x.PTR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PTR_RECORDVERSION).Default("0");
        }
    }
}