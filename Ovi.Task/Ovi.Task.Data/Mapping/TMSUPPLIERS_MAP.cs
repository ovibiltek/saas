using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSUPPLIERS_MAP : ClassMap<TMSUPPLIERS>
    {
        public TMSUPPLIERS_MAP()
        {
            Id(x => x.SUP_CODE);
            Map(x => x.SUP_ORGANIZATION).Length(PropertySettings.L50);
            Map(x => x.SUP_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', SUP_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = SUP_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.SUP_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.SUP_TYPE).Length(PropertySettings.L50);
            Map(x => x.SUP_TASKTYPES);
            Map(x => x.SUP_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SUP_TYPEENTITY + '#' + SUP_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_ENTITY =  SUP_TYPEENTITY AND t.TYP_CODE = SUP_TYPE) ,:SessionContext.Language)");
            Map(x => x.SUP_DESC);
            Map(x => x.SUP_TITLE).Length(PropertySettings.L250);
            Map(x => x.SUP_REGION);
            Map(x => x.SUP_PROVINCE).Length(PropertySettings.L50);
            Map(x => x.SUP_PROVINCEDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = SUP_PROVINCE AND a.ADS_TYPE = 'IL')");
            Map(x => x.SUP_DISTRICT).Length(PropertySettings.L50);
            Map(x => x.SUP_DISTRICTDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = SUP_DISTRICT AND a.ADS_TYPE = 'ILCE')");
            Map(x => x.SUP_FULLADDRESS);
            Map(x => x.SUP_PHONE);
            Map(x => x.SUP_FAX);
            Map(x => x.SUP_EMAIL).Length(PropertySettings.L250);
            Map(x => x.SUP_AUTHORIZEDPERSON).Length(PropertySettings.L250);
            Map(x => x.SUP_PHONE2).Length(PropertySettings.L50);
            Map(x => x.SUP_ACCOUNTCODE).Length(PropertySettings.L50);
            Map(x => x.SUP_PAYMENTPERIOD);
            Map(x => x.SUP_TAXOFFICE).Length(PropertySettings.L250);
            Map(x => x.SUP_TAXNO).Length(PropertySettings.L50);
            Map(x => x.SUP_CONTRACTSTART);
            Map(x => x.SUP_CONTRACTEND);
            Map(x => x.SUP_CONTRACTRENEWALPERIOD);
            Map(x => x.SUP_CATEGORY);
            Map(x => x.SUP_CATEGORYDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SUPPLIERCATEGORY',SUP_CATEGORY,:SessionContext.Language)");  
            Map(x => x.SUP_ACTIVE);
            Map(x => x.SUP_PASSIVEREASON);
            Map(x => x.SUP_PASSIVEREASONDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SUPPASSIVEREASON',SUP_PASSIVEREASON,:SessionContext.Language)");
            Map(x => x.SUP_CREATED);
            Map(x => x.SUP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SUP_UPDATED);
            Map(x => x.SUP_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SUP_SQLIDENTITY).Generated.Insert();
            Map(x => x.SUP_RECORDVERSION).Default("0");
            Map(x => x.SUP_REQUESTEDBY);
            Map(x => x.SUP_REQUESTEDBYDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = SUP_REQUESTEDBY)");
            Map(x => x.SUP_CHK01);
            Map(x => x.SUP_CHK02);
            Map(x => x.SUP_CHK03);
            Map(x => x.SUP_CHK04);
            Map(x => x.SUP_CHK05);
            Map(x => x.SUP_DATE01);
            Map(x => x.SUP_DATE02);
            Map(x => x.SUP_DATE03);
            Map(x => x.SUP_DATE04);
            Map(x => x.SUP_DATE05);
            Map(x => x.SUP_BUSINESSOWNERSHIP);
            Map(x => x.SUP_M2);
            Map(x => x.SUP_STATUS);
            Map(x => x.SUP_STATUSDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SUPPLIERSTATUS',SUP_STATUS,:SessionContext.Language)");

        }
    }
}