using System;
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTRADES_MAP : ClassMap<TMTRADES>
    {
        public TMTRADES_MAP()
        {
            Id(x => x.TRD_CODE).Length(PropertySettings.L50);
            Map(x => x.TRD_DESC).Length(PropertySettings.L250);
            Map(x => x.TRD_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.TRD_DEPARTMENTDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC', TRD_DEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = TRD_DEPARTMENT), :SessionContext.Language)");
            Map(x => x.TRD_ORGANIZATION);
            Map(x => x.TRD_ORGANIZATIONDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', TRD_ORGANIZATION, (SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = TRD_ORGANIZATION), :SessionContext.Language)");
            Map(x => x.TRD_WAREHOUSE).Length(PropertySettings.L50);
            Map(x => x.TRD_WAREHOUSEDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMWAREHOUSES','WAH_DESC', TRD_WAREHOUSE, (SELECT w.WAH_DESC FROM TMWAREHOUSES w WHERE w.WAH_CODE = TRD_WAREHOUSE), :SessionContext.Language)");
            Map(x => x.TRD_SUPPLIER).Length(PropertySettings.L50);
            Map(x => x.TRD_SUPPLIERDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT s.SUP_DESC FROM TMSUPPLIERS s WHERE s.SUP_CODE = TRD_SUPPLIER)");
            Map(x => x.TRD_PRICINGCODE).Length(PropertySettings.L50);
            Map(x => x.TRD_PRICINGCODEDESC).ReadOnly().Formula("dbo.GetDesc('TMPRICINGCODES','PRC_DESC', TRD_PRICINGCODE,(SELECT p.PRC_DESC FROM TMPRICINGCODES p WHERE p.PRC_CODE = TRD_PRICINGCODE),:SessionContext.Language)");
            Map(x => x.TRD_REGION);
            Map(x => x.TRD_PROVINCE);
            Map(x => x.TRD_DISTRICT);
            Map(x => x.TRD_USERBASEDASSIGNMENT).Default("-");
            Map(x => x.TRD_LATITUDE).Length(PropertySettings.L250);
            Map(x => x.TRD_LONGITUDE).Length(PropertySettings.L250);
            Map(x => x.TRD_EMAIL);
            Map(x => x.TRD_ACTIVE);
            Map(x => x.TRD_CREATED);
            Map(x => x.TRD_UPDATED);
            Map(x => x.TRD_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TRD_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.TRD_SQLIDENTITY).Generated.Insert();
            Map(x => x.TRD_RECORDVERSION).Default("0");
            Map(x => x.TRD_CAPACITY);
            Map(x => x.TRD_USEDCAPACITY).ReadOnly().Formula("(SELECT t.TSA_CNT FROM TMDAILTTRADEVOLUMESVIEW t WHERE t.TSA_TRADE = TRD_CODE AND t.TSA_SCHFROM = FORMAT(GETDATE(),'yyyy-MM-dd') )");
            Map(x => x.TRD_TASKTYPES);
            Map(x => x.TRD_PROVINCEDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = TRD_PROVINCE AND a.ADS_TYPE = 'IL')");
            Map(x => x.TRD_DISTRICTDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = TRD_DISTRICT AND a.ADS_TYPE = 'ILCE')");
        }

        private object Map(Func<object, object> p)
        {
            throw new NotImplementedException();
        }
    }
}