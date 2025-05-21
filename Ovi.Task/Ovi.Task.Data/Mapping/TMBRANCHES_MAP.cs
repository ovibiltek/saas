using FluentNHibernate.Conventions.Helpers;
using FluentNHibernate.Mapping;
using NHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBRANCHES_MAP : ClassMap<TMBRANCHES>
    {
        public TMBRANCHES_MAP()
        {

            Id(x => x.BRN_CODE).GeneratedBy.Assigned();
            Map(x => x.BRN_DESC);
            Map(x => x.BRN_TYPEENTITY);
            Map(x => x.BRN_TYPE);
            Map(x => x.BRN_TYPEDESC).ReadOnly().Formula("").Formula("dbo.GetDesc('TMTYPES','TYP_DESC', BRN_TYPEENTITY + '#' + BRN_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_ENTITY =  BRN_TYPEENTITY AND t.TYP_CODE = BRN_TYPE) ,:SessionContext.Language)");
            Map(x => x.BRN_ORG);
            Map(x => x.BRN_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', BRN_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = BRN_ORG),:SessionContext.Language)");
            Map(x => x.BRN_CUSTOMER);
            Map(x => x.BRN_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = BRN_CUSTOMER)");
            Map(x => x.BRN_CUSTOMERGROUP).ReadOnly().Formula("(SELECT c.CUS_GROUP FROM TMCUSTOMERS c WHERE c.CUS_CODE = BRN_CUSTOMER)");
            Map(x => x.BRN_CUSTOMERGROUPDESC).ReadOnly().Formula("(SELECT cg.CUG_DESC FROM TMCUSTOMERS c, TMCUSTOMERGROUPS cg WHERE c.CUS_CODE = BRN_CUSTOMER AND cg.CUG_CODE = c.CUS_GROUP)");
            Map(x => x.BRN_CSR);
            Map(x => x.BRN_OO);
            Map(x => x.BRN_OODESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = BRN_OO)");
            Map(x => x.BRN_PM);
            Map(x => x.BRN_PMDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = BRN_PM)");
            Map(x => x.BRN_LOCATION).ReadOnly().Formula("(SELECT l.LOC_CODE FROM TMSINGLELOCATIONSVIEW l WHERE l.LOC_BRANCH = BRN_CODE)");
            Map(x => x.BRN_LOCATIONDESC).ReadOnly().Formula("(SELECT l.LOC_DESC FROM TMSINGLELOCATIONSVIEW l WHERE l.LOC_BRANCH = BRN_CODE)");
            Map(x => x.BRN_AUTHORIZED);
            Map(x => x.BRN_CUSTOMERZONE);
            Map(x => x.BRN_WARRANTY).Length(PropertySettings.L4001);
            Map(x => x.BRN_REGION);
            Map(x => x.BRN_REGIONDESC).ReadOnly().Formula("dbo.GetDesc('TMREGIONS','REG_DESC', BRN_REGION,(SELECT r.REG_DESC FROM TMREGIONS r WHERE r.REG_CODE = BRN_REGION),:SessionContext.Language)");
            Map(x => x.BRN_PROVINCE);
            Map(x => x.BRN_PROVINCEDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = BRN_PROVINCE AND a.ADS_TYPE = 'IL')");
            Map(x => x.BRN_DISTRICT);
            Map(x => x.BRN_DISTRICTDESC).ReadOnly().Formula("(SELECT a.ADS_DESC FROM TMADDRESSSECTIONS a WHERE a.ADS_CODE = BRN_DISTRICT AND a.ADS_TYPE = 'ILCE')");
            Map(x => x.BRN_NEIGHBORHOOD);
            Map(x => x.BRN_STREET);
            Map(x => x.BRN_DOOR);
            Map(x => x.BRN_ACCOUNTCODE);
            Map(x => x.BRN_FULLADDRESS);
            Map(x => x.BRN_BILLADDRESS);
            Map(x => x.BRN_ACTIVE);
            Map(x => x.BRN_DEFAULT);
            Map(x => x.BRN_MAINT);
            Map(x => x.BRN_CREATED);
            Map(x => x.BRN_CREATEDBY);
            Map(x => x.BRN_UPDATED);
            Map(x => x.BRN_UPDATEDBY);
            Map(x => x.BRN_PPTASKCNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMTASKS t, TMSTATUSES s WHERE t.TSK_PSPCODE IS NULL AND t.TSK_CUSTOMER = BRN_CUSTOMER AND t.TSK_BRANCH = BRN_CODE AND t.TSK_STATUS = s.STA_CODE AND s.STA_ENTITY = 'TASK' AND s.STA_PROGRESSPAYMENT = '+' )");
            Map(x => x.BRN_SQLIDENTITY).Generated.Insert();
            Map(x => x.BRN_RECORDVERSION).Default("0");
            Map(x => x.BRN_BUSINESSTYPE);
            Map(x => x.BRN_REFERENCE);
            Map(x => x.BRN_NOTES);
            Map(x => x.BRN_EMERGENCYRESPONDTIME);
            Map(x => x.BRN_AUTHNOTES);
        }
    }
}