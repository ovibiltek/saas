using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCUSTOMERS_MAP : ClassMap<TMCUSTOMERS>
    {
        public TMCUSTOMERS_MAP()
        {
            Id(x => x.CUS_CODE).Length(PropertySettings.L50);
            Map(x => x.CUS_DESC).Length(PropertySettings.L250);
            Map(x => x.CUS_ORG).Length(PropertySettings.L50);
            Map(x => x.CUS_ORGDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', CUS_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = CUS_ORG),:SessionContext.Language)");
            Map(x => x.CUS_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.CUS_TYPE).Length(PropertySettings.L50);
            Map(x => x.CUS_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', CUS_TYPEENTITY + '#' + CUS_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = CUS_TYPE AND t.TYP_ENTITY = CUS_TYPEENTITY),:SessionContext.Language)");
            Map(x => x.CUS_TITLE).Length(PropertySettings.L250);
            Map(x => x.CUS_ACCOUNTCODE).Length(PropertySettings.L250);
            Map(x => x.CUS_PAYMENTPERIOD);
            Map(x => x.CUS_PROGRESSPAYMENTPERIOD);
            Map(x => x.CUS_PHONE01).Length(PropertySettings.L50);
            Map(x => x.CUS_PHONE02).Length(PropertySettings.L50);
            Map(x => x.CUS_FAX).Length(PropertySettings.L50);
            Map(x => x.CUS_WEB).Length(PropertySettings.L250);
            Map(x => x.CUS_CONTACTPERSON01).Length(PropertySettings.L250);
            Map(x => x.CUS_CONTACTPERSON02).Length(PropertySettings.L250);
            Map(x => x.CUS_PROVINCE).Length(PropertySettings.L50);
            Map(x => x.CUS_PROVINCEDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = CUS_PROVINCE AND a.ADS_TYPE = 'IL')");
            Map(x => x.CUS_DISTRICT).Length(PropertySettings.L50);
            Map(x => x.CUS_DISTRICTDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = CUS_DISTRICT AND a.ADS_TYPE = 'ILCE')");
            Map(x => x.CUS_TAXOFFICE).Length(PropertySettings.L50);
            Map(x => x.CUS_TAXNO).Length(PropertySettings.L50);
            Map(x => x.CUS_ADDRESS).Length(PropertySettings.L250);
            Map(x => x.CUS_PRIORITY).Length(PropertySettings.L50);
            Map(x => x.CUS_CSR).Length(PropertySettings.L250);
            Map(x => x.CUS_OO).Length(PropertySettings.L50);
            Map(x => x.CUS_OODESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CUS_OO)");
            Map(x => x.CUS_SA).Length(PropertySettings.L50);
            Map(x => x.CUS_SADESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CUS_SA)");
            Map(x => x.CUS_REPORTINGRESPONSIBLE).Length(PropertySettings.L50);
            Map(x => x.CUS_REPORTINGRESPONSIBLEDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CUS_REPORTINGRESPONSIBLE)");
            Map(x => x.CUS_PM).Length(PropertySettings.L50);
            Map(x => x.CUS_PMDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT cpm.FMP_VALUE FROM TMCUSTOMERPMVIEW cpm WHERE cpm.FMP_CODE = CUS_CODE)");
            Map(x => x.CUS_BILLINGADDRESS).Length(PropertySettings.L250);
            Map(x => x.CUS_GROUP).Length(PropertySettings.L50);
            Map(x => x.CUS_GROUPDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT g.CUG_DESC FROM TMCUSTOMERGROUPS g WHERE g.CUG_CODE = CUS_GROUP)");
            Map(x => x.CUS_ACTIVE);
            Map(x => x.CUS_CREATED);
            Map(x => x.CUS_UPDATED);
            Map(x => x.CUS_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CUS_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CUS_PPTASKCNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMTASKS t, TMSTATUSES s, TMCATEGORIES c WHERE t.TSK_CATEGORY = c.CAT_CODE  AND t.TSK_PSPCODE IS NULL AND t.TSK_CUSTOMER = CUS_CODE AND t.TSK_STATUS = s.STA_CODE AND s.STA_ENTITY = 'TASK' AND s.STA_PROGRESSPAYMENT = '+' AND c.CAT_PSP = '+' )");
            Map(x => x.CUS_SQLIDENTITY).Generated.Insert();
            Map(x => x.CUS_RECORDVERSION).Default("0");
            Map(x => x.CUS_NOTIFY).Default("-");
            Map(x => x.CUS_LASTTASKCREATED).ReadOnly().Formula("(SELECT MAX(t.TSK_CREATED) FROM TMTASKS t WHERE t.TSK_CUSTOMER = CUS_CODE)");
            Map(x => x.CUS_SECTOR);
            Map(x => x.CUS_WORKINGSTATUS);
            Map(x => x.CUS_SECTORDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SECTOR',CUS_SECTOR,:SessionContext.Language)");
            Map(x => x.CUS_WORKINGSTATUSDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('CUSWORKINGSTATUS',CUS_WORKINGSTATUS,:SessionContext.Language)");
            Map(x => x.CUS_NOTES);
            Map(x => x.CUS_BARCODELENGTH);
            Map(x => x.CUS_EMERGENCYRESPONDTIME);
            Map(x => x.CUS_PSP);
            Map(x => x.CUS_PSPDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CUS_PSP)");
            Map(x => x.CUS_PMMASTER);
            Map(x => x.CUS_PMMASTERDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = CUS_PMMASTER)");
            Map(x => x.CUS_BRANCHPREFIX);
            Map(x => x.CUS_BRANCHCOUNT);
            Map(x => x.CUS_CHECKSTARTLABORDISTANCE);
            Map(x => x.CUS_CHECKENDLABORDISTANCE);

        }
    }
}