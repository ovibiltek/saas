using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCONTRACTPARTPRICES_MAP : ClassMap<TMCONTRACTPARTPRICES>
    {
        public TMCONTRACTPARTPRICES_MAP()
        {
            Id(x => x.CPP_ID);
            Map(x => x.CPP_CONTRACTID);
            Map(x => x.CPP_CUSTOMER).ReadOnly().Formula("(SELECT p.CON_CUSTOMER FROM TMCONTRACTS p WHERE p.CON_ID = CPP_CONTRACTID)");
            Map(x => x.CPP_PART);
            Map(x => x.CPP_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = CPP_PART)");
            Map(x => x.CPP_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = CPP_PART)");
            Map(x => x.CPP_PARTUOM).ReadOnly().Formula("(SELECT p.PAR_UOM FROM TMPARTS p WHERE p.PAR_ID = CPP_PART)");
            Map(x => x.CPP_REFERENCE);
            Map(x => x.CPP_REGION);
            Map(x => x.CPP_REGIONDESC).ReadOnly().Formula("dbo.GetDesc('TMREGIONS','REG_DESC', CPP_REGION,(SELECT r.REG_DESC FROM TMREGIONS r WHERE r.REG_CODE = CPP_REGION),:SessionContext.Language)");
            Map(x => x.CPP_BRANCH);
            Map(x => x.CPP_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = CPP_BRANCH)");
            Map(x => x.CPP_UNITPURCHASEPRICE);
            Map(x => x.CPP_UNITSALESPRICE);
            Map(x => x.CPP_CURR);
            Map(x => x.CPP_CREATED);
            Map(x => x.CPP_CREATEDBY);
            Map(x => x.CPP_UPDATED);
            Map(x => x.CPP_UPDATEDBY);
            Map(x => x.CPP_RECORDVERSION);
        }
    }
}