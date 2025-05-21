using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMLOCATIONS_MAP : ClassMap<TMLOCATIONS>
    {
        public TMLOCATIONS_MAP()
        {
            Id(x => x.LOC_CODE).Length(PropertySettings.L50);
            Map(x => x.LOC_DESC).Length(PropertySettings.L250);
            Map(x => x.LOC_ORG).Length(PropertySettings.L50);
            Map(x => x.LOC_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', LOC_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = LOC_ORG),:SessionContext.Language)");
            Map(x => x.LOC_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.LOC_DEPARTMENTDESC).ReadOnly().Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC',LOC_DEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = LOC_DEPARTMENT),:SessionContext.Language)");
            Map(x => x.LOC_PARENT).Length(PropertySettings.L50);
            Map(x => x.LOC_PARENTDESC).Formula("(SELECT l.LOC_DESC FROM TMLOCATIONS l WHERE l.LOC_CODE = LOC_PARENT)");
            Map(x => x.LOC_BRANCH);
            Map(x => x.LOC_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = LOC_BRANCH)");
            Map(x => x.LOC_CUSTOMER).ReadOnly().Formula("(SELECT b.BRN_CUSTOMER FROM TMBRANCHES b WHERE b.BRN_CODE = LOC_BRANCH)");
            Map(x => x.LOC_CUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMBRANCHES b, TMCUSTOMERS c WHERE b.BRN_CODE = LOC_BRANCH AND c.CUS_CODE = b.BRN_CUSTOMER)");
            Map(x => x.LOC_CUSTOMERBARCODELENGTH).ReadOnly().Formula("(SELECT c.CUS_BARCODELENGTH FROM TMBRANCHES b, TMCUSTOMERS c WHERE b.BRN_CODE = LOC_BRANCH AND c.CUS_CODE = b.BRN_CUSTOMER)");
            Map(x => x.LOC_LATITUDE);
            Map(x => x.LOC_LONGITUDE);
            Map(x => x.LOC_BARCODE);
            Map(x => x.LOC_CREATED);
            Map(x => x.LOC_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.LOC_UPDATED);
            Map(x => x.LOC_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.LOC_ACTIVE);
            Map(x => x.LOC_RECORDVERSION).Default("0");
        }
    }
}