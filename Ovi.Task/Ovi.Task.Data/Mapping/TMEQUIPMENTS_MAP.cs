using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMEQUIPMENTS_MAP : ClassMap<TMEQUIPMENTS>
    {
        public TMEQUIPMENTS_MAP()
        {
            Id(x => x.EQP_ID);
            Map(x => x.EQP_CODE);
            Map(x => x.EQP_ORG);
            Map(x => x.EQP_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', EQP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = EQP_ORG),:SessionContext.Language)");
            Map(x => x.EQP_DESC);
            Map(x => x.EQP_TYPE);
            Map(x => x.EQP_TYPEENTITY);
            Map(x => x.EQP_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', EQP_TYPEENTITY + '#' + EQP_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = EQP_TYPE AND t.TYP_ENTITY = EQP_TYPEENTITY),:SessionContext.Language)");
            Map(x => x.EQP_TYPELEVEL);
            Map(x => x.EQP_TYPELEVELCODE).ReadOnly().Formula("(SELECT o.TLV_CODE FROM TMTYPELEVELS o WHERE o.TLV_ID = EQP_TYPELEVEL)");
            Map(x => x.EQP_TYPELEVELDESC).ReadOnly().Formula("(SELECT o.TLV_DESC FROM TMTYPELEVELS o WHERE o.TLV_ID = EQP_TYPELEVEL)");
            Map(x => x.EQP_BRAND);
            Map(x => x.EQP_BRANDDESC).ReadOnly().Formula("dbo.GetDesc('TMBRANDS','BRA_DESC', EQP_BRAND, (SELECT b.BRA_DESC FROM TMBRANDS b WHERE b.BRA_CODE = EQP_BRAND),:SessionContext.Language)");
            Map(x => x.EQP_SERIALNO);
            Map(x => x.EQP_MODEL);
            Map(x => x.EQP_ZONE);
            Map(x => x.EQP_ZONEDESC).ReadOnly().Formula("(SELECT z.ZON_DESC FROM TMZONES z WHERE z.ZON_CODE = EQP_ZONE)");
            Map(x => x.EQP_DEPARTMENT);
            Map(x => x.EQP_DEPARTMENTDESC).ReadOnly().Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC', EQP_DEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = EQP_DEPARTMENT),:SessionContext.Language)");
            Map(x => x.EQP_INSDATE);
            Map(x => x.EQP_PARENT);
            Map(x => x.EQP_PARENTCODE).ReadOnly().Formula("(SELECT e.EQP_CODE FROM TMEQUIPMENTS e WHERE e.EQP_ID = EQP_PARENT)");
            Map(x => x.EQP_PARENTDESC).ReadOnly().Formula("(SELECT e.EQP_DESC FROM TMEQUIPMENTS e WHERE e.EQP_ID = EQP_PARENT)");
            Map(x => x.EQP_LOCATION);
            Map(x => x.EQP_LOCATIONDESC).ReadOnly().Formula("(SELECT l.LOC_DESC FROM TMLOCATIONS l WHERE l.LOC_CODE = EQP_LOCATION)");
            Map(x => x.EQP_DEFMAINTENANCETRADE);
            Map(x => x.EQP_DEFMAINTENANCETRADEDESC).ReadOnly().Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = EQP_DEFMAINTENANCETRADE)");
            Map(x => x.EQP_BRANCH);
            Map(x => x.EQP_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = EQP_BRANCH)");
            Map(x => x.EQP_BRNREFERENCE).ReadOnly().Formula("(SELECT b.BRN_REFERENCE FROM TMBRANCHES b WHERE b.BRN_CODE = EQP_BRANCH)");
            Map(x => x.EQP_REGION).ReadOnly().Formula("(SELECT b.BRN_REGION FROM TMBRANCHES b WHERE b.BRN_CODE = EQP_BRANCH)");
            Map(x => x.EQP_CUSTOMER).ReadOnly().Formula("(SELECT c.CUS_CODE FROM TMCUSTOMERS c, TMBRANCHES b WHERE c.CUS_CODE = b.BRN_CUSTOMER AND b.BRN_CODE = EQP_BRANCH)");
            Map(x => x.EQP_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c, TMBRANCHES b WHERE c.CUS_CODE = b.BRN_CUSTOMER AND b.BRN_CODE = EQP_BRANCH)");
            Map(x => x.EQP_CUSTOMERBARCODELENGTH).ReadOnly().Formula("(SELECT c.CUS_BARCODELENGTH FROM TMCUSTOMERS c, TMBRANCHES b WHERE c.CUS_CODE = b.BRN_CUSTOMER AND b.BRN_CODE = EQP_BRANCH)");
            Map(x => x.EQP_SUPPLIER);
            Map(x => x.EQP_GUARANTEESTATUS);
            Map(x => x.EQP_MANUFACTURINGYEAR);
            Map(x => x.EQP_PRICE);
            Map(x => x.EQP_IMPORTANCELEVEL);
            Map(x => x.EQP_PERIODICMAINTENANCEREQUIRED);
            Map(x => x.EQP_REFERENCENO);
            Map(x => x.EQP_ACTIVE);
            Map(x => x.EQP_CREATED);
            Map(x => x.EQP_CREATEDBY);
            Map(x => x.EQP_UPDATED);
            Map(x => x.EQP_UPDATEDBY);
            Map(x => x.EQP_RECORDVERSION).Default("0");
            Map(x => x.EQP_RATING);
            Map(x => x.EQP_RATINGDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('EQPRATING',EQP_RATING,:SessionContext.Language)");
            Map(x => x.EQP_HEALTH);
            Map(x => x.EQP_HEALTHDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('EQUIPMENTHEALTH',EQP_HEALTH,:SessionContext.Language)");
        }
    }
}