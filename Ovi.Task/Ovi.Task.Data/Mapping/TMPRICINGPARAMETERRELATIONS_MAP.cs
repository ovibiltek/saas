using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPRICINGPARAMETERRELATIONS_MAP : ClassMap<TMPRICINGPARAMETERRELATIONS>
    {
        public TMPRICINGPARAMETERRELATIONS_MAP()
        {
            Id(x => x.PPR_ID).GeneratedBy.Identity();
            Map(x => x.PPR_ENTITY).Length(PropertySettings.L50);
            Map(x => x.PPR_CODE).Length(PropertySettings.L50);
            Map(x => x.PPR_PRICINGCODE).Length(PropertySettings.L50);
            Map(x => x.PPR_PRICINGDESC).ReadOnly().Formula("(SELECT p.PRP_DESC FROM TMPRICINGPARAMETERS p WHERE p.PRP_CODE = PPR_PRICINGCODE )");
            Map(x => x.PPR_STARTDATE);
            Map(x => x.PPR_ENDDATE);
            Map(x => x.PPR_ALLBRANCHES);
            Map(x => x.PPR_BRANCH);
            Map(x => x.PPR_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = PPR_BRANCH)");
            Map(x => x.PPR_REMINDINGPERIOD);
            Map(x => x.PPR_NOTE);
            Map(x => x.PPR_TASKCATEGORY).Length(PropertySettings.L50);
            Map(x => x.PPR_TASKCATEGORYDESC).Length(PropertySettings.L250).Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', PPR_TASKCATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = PPR_TASKCATEGORY) ,:SessionContext.Language)");
            Map(x => x.PPR_PERIODICTASK).Length(PropertySettings.L50);
            Map(x => x.PPR_PERIODICTASKDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMPERIODICTASKS','PTK_DESC', PPR_PERIODICTASK, (SELECT p.PTK_DESC FROM TMPERIODICTASKS p WHERE p.PTK_CODE = PPR_PERIODICTASK), :SessionContext.Language)");
            Map(x => x.PPR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PPR_CREATED);
            Map(x => x.PPR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PPR_UPDATED);
            Map(x => x.PPR_RECORDVERSION).Default("0");
        }
    }
}