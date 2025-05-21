using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPSPLINESVIEW_MAP : ClassMap<TMPSPLINESVIEW>
    {
        public TMPSPLINESVIEW_MAP()
        {
            Id(x => x.PPL_ID);
            Map(x => x.PPL_PSPCODE);
            Map(x => x.PPL_PSPDESC);
            Map(x => x.PPL_PRPCODE);
            Map(x => x.PPL_PRPLABORTYPE);
            Map(x => x.PPL_PRPSERVICEFEE);
            Map(x => x.PLP_PRPHOURLYFEE);
            Map(x => x.PLP_PRPCRITICALTIMEVALUE);
            Map(x => x.PLP_PRPCURRENCY);
            Map(x => x.PPL_PSPORG);
            Map(x => x.PPL_PSPSTADESC);
            Map(x => x.PPL_TASK);
            Map(x => x.PPL_TASKSHORTDESC);
            Map(x => x.PPL_TASKTYPE);
            Map(x => x.PPL_TASKTYPEDESC).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', 'TASK' + '#' + PPL_TASKTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = PPL_TASKTYPE AND t.TYP_ENTITY = 'TASK') ,:SessionContext.Language)");
            Map(x => x.PPL_TASKCATEGORY);
            Map(x => x.PPL_TASKCATEGORYDESC).Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', PPL_TASKCATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = PPL_TASKCATEGORY),:SessionContext.Language)");
            Map(x => x.PPL_TSKTASKTYPE);
            Map(x => x.PPL_CUSTOMER);
            Map(x => x.PPL_CUSTOMERDESC);
            Map(x => x.PPL_BRANCH);
            Map(x => x.PPL_BRANCHDESC);
            Map(x => x.PPL_BRNAUTHORIZED);
            Map(x => x.PPL_TSKACTLINE);
            Map(x => x.PPL_TYPE);
            Map(x => x.PPL_TYPEDESC);
            Map(x => x.PPL_QTY);
            Map(x => x.PPL_UOM);
            Map(x => x.PPL_PRICE);
            Map(x => x.PPL_TOTAL);
            Map(x => x.PPL_CURR);
            Map(x => x.PPL_TSKCREATED);
            Map(x => x.PPL_TSKCOMPLETED);
            Map(x => x.PPL_TSKCLOSED);
            Map(x => x.PPL_PSPCREATED);
            Map(x => x.PPL_TSKREFERENCE);
        }
    }
}