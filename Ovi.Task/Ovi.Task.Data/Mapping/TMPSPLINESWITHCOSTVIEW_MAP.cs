using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPSPLINESWITHCOSTVIEW_MAP : ClassMap<TMPSPLINESWITHCOSTVIEW>
    {
        public TMPSPLINESWITHCOSTVIEW_MAP()
        {;
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
            Map(x => x.PPL_TSKTASKTYPE);
            Map(x => x.PPL_TASKCATEGORY);
            Map(x => x.PPL_TASKCATEGORYDESC).Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', PPL_TASKCATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = PPL_TASKCATEGORY),:SessionContext.Language)");
            Map(x => x.PPL_CUSTOMER);
            Map(x => x.PPL_CUSTOMERDESC);
            Map(x => x.PPL_CUSTOMERGROUP);
            Map(x => x.PPL_CUSTOMERGROUPDESC);
            Map(x => x.PPL_BRANCH);
            Map(x => x.PPL_BRANCHDESC);
            Map(x => x.PPL_BRNAUTHORIZED);
            Map(x => x.PPL_BRANCHREGION);
            Map(x => x.PPL_BRANCHPROVINCE);
            Map(x => x.PPL_TRADE).ReadOnly().Formula("(SELECT a.TSA_TRADE FROM TMTASKACTIVITIES a WHERE a.TSA_TASK = PPL_TASK AND a.TSA_LINE = PPL_TSKACTLINE)");
            Map(x => x.PPL_HASINVOICE).ReadOnly().Formula("(CASE WHEN (SELECT TOP 1 q.QUO_ID FROM TMQUOTATIONS q WHERE q.QUO_TASK = PPL_TASK AND q.QUO_STATUS = 'K') IS NOT NULL THEN '+' ELSE '-' END)");
            Map(x => x.PPL_TSKACTLINE);
            Map(x => x.PPL_TYPE);
            Map(x => x.PPL_TYPEDESC);
            Map(x => x.PPL_QTY);
            Map(x => x.PPL_UOM);
            Map(x => x.PPL_UNITPURCHASEPRICE);
            Map(x => x.PPL_TOTALPURCHASEPRICE);
            Map(x => x.PPL_UNITSALESPRICE);
            Map(x => x.PPL_TOTALSALESPRICE);
            Map(x => x.PPL_CURR);
            Map(x => x.PPL_TSKCREATED);
            Map(x => x.PPL_TSKCOMPLETED);
            Map(x => x.PPL_TSKCLOSED);
            Map(x => x.PPL_PSPCREATED);
            Map(x => x.PPL_TSKREFERENCE);
        }
    }
}