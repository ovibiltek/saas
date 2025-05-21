using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCATEGORIES_MAP : ClassMap<TMCATEGORIES>
    {
        public TMCATEGORIES_MAP()
        {
            Id(x => x.CAT_CODE);
            Map(x => x.CAT_DESC);
            Map(x => x.CAT_DESCF).Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', CAT_CODE, CAT_DESC,:SessionContext.Language)");
            Map(x => x.CAT_ACTIVE);
            Map(x => x.CAT_PSP);
            Map(x => x.CAT_TSKTYPEREQUIRED);
            Map(x => x.CAT_CREATED);
            Map(x => x.CAT_CREATEDBY);
            Map(x => x.CAT_UPDATED);
            Map(x => x.CAT_UPDATEDBY);
            Map(x => x.CAT_SQLIDENTITY).Generated.Insert();
            Map(x => x.CAT_RECORDVERSION).Default("0");
            Map(x => x.CAT_ORGANIZATION);
            Map(x => x.CAT_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', CAT_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = CAT_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.CAT_GROUP);
            Map(x => x.CAT_GROUPDESC).ReadOnly().Formula("dbo.GetDesc('TMSYSCODES','SYC_DESCRIPTION', CAT_GROUP, (SELECT s.SYC_DESCRIPTION FROM TMSYSCODES s WHERE s.SYC_CODE = CAT_GROUP AND s.SYC_GROUP = 'KTG'),:SessionContext.Language)");
        }
    }
}