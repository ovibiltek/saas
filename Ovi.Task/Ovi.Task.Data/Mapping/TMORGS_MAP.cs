using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMORGS_MAP : ClassMap<TMORGS>
    {
        public TMORGS_MAP()
        {
            Id(x => x.ORG_CODE).Length(PropertySettings.L50);
            Map(x => x.ORG_DESC).Length(PropertySettings.L250);
            Map(x => x.ORG_DESCF).Formula("dbo.GetDesc('TMORGS','ORG_DESC', ORG_CODE, ORG_DESC,:SessionContext.Language)");
            Map(x => x.ORG_EMAIL).Length(PropertySettings.L4001);
            Map(x => x.ORG_ACTIVE);
            Map(x => x.ORG_LOCATIONREQUIRED).Default("-");
            Map(x => x.ORG_AUTOCLOSETASK).Default("-");
            Map(x => x.ORG_CURRENCY).Length(PropertySettings.L50);
            Map(x => x.ORG_CURRENCYDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', ORG_CURRENCY, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = ORG_CURRENCY), :SessionContext.Language)");
            Map(x => x.ORG_CREATED);
            Map(x => x.ORG_UPDATED);
            Map(x => x.ORG_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.ORG_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.ORG_SQLIDENTITY).Generated.Insert();
            Map(x => x.ORG_RECORDVERSION).Default("0");
            Map(x => x.ORG_TSKTYPE);
            Map(x => x.ORG_TSKTYPEENTITY);
            Map(x => x.ORG_TSKTYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', ORG_TSKTYPEENTITY + '#' + ORG_TSKTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = ORG_TSKTYPE AND t.TYP_ENTITY = ORG_TSKTYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.ORG_TSKCUSTOMER);
            Map(x => x.ORG_TSKCUSTOMERDESC).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMCUSTOMERS c WHERE c.CUS_CODE = ORG_TSKCUSTOMER)");
            Map(x => x.ORG_TSKDEPARTMENT);
            Map(x => x.ORG_TSKDEPARTMENTDESC).ReadOnly().Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC', ORG_TSKDEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = ORG_TSKDEPARTMENT),:SessionContext.Language)");
            Map(x => x.ORG_TSKBRANCH);
            Map(x => x.ORG_TSKBRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = ORG_TSKBRANCH)");
        }
    }
}