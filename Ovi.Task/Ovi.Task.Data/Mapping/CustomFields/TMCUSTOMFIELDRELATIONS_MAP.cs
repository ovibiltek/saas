using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.Mapping.CustomFields
{
    public sealed class TMCUSTOMFIELDRELATIONS_MAP : ClassMap<TMCUSTOMFIELDRELATIONS>
    {
        public TMCUSTOMFIELDRELATIONS_MAP()
        {
            Id(x => x.CFR_ID);
            Map(x => x.CFR_ENTITY);
            Map(x => x.CFR_TYPE);
            Map(x => x.CFR_CODE);
            Map(x => x.CFR_TYPEDESC).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', CFR_ENTITY + '#' + CFR_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = CFR_TYPE AND t.TYP_ENTITY = CFR_ENTITY), :SessionContext.Language)");
            Map(x => x.CFR_CODEDESC).Formula("dbo.GetDesc('TMCUSTOMFIELDS','CFD_DESC', CFR_CODE, (SELECT c.CFD_DESC FROM TMCUSTOMFIELDS c WHERE c.CFD_CODE = CFR_CODE), :SessionContext.Language)");
            Map(x => x.CFR_AUTH).Formula("(SELECT c.CFA_VAL FROM TMCUSTOMFIELDAUTHVIEW c WHERE c.CFA_ENTITY = CFR_ENTITY AND c.CFA_TYPE = CFR_TYPE AND c.CFA_CODE = CFR_CODE AND c.CFA_GROUP =:SessionContext.UserGroup )");
            Map(x => x.CFR_GROUP);
            Map(x => x.CFR_GROUPDESC).Formula("dbo.GetDesc('TMCUSTOMFIELDGROUPS','CFG_DESC', CFR_GROUP , (SELECT c.CFG_DESC FROM TMCUSTOMFIELDGROUPS c WHERE c.CFG_CODE = CFR_GROUP), :SessionContext.Language)");
            Map(x => x.CFR_GROUPORDER).Formula("ISNULL((SELECT c.CFG_ORDER FROM TMCUSTOMFIELDGROUPS c WHERE c.CFG_CODE = CFR_GROUP),999999)");
            Map(x => x.CFR_ORDER);
            Map(x => x.CFR_CREATED);
            Map(x => x.CFR_CREATEDBY);
            Map(x => x.CFR_UPDATED);
            Map(x => x.CFR_UPDATEDBY);
            Map(x => x.CFR_RECORDVERSION).Default("0");
        }
    }
}