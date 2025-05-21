using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Project;

namespace Ovi.Task.Data.Mapping.Project
{
    public sealed class TMPROJECTPRICING_MAP : ClassMap<TMPROJECTPRICING>
    {
        public TMPROJECTPRICING_MAP()
        {
            Id(x => x.PPR_ID);
            Map(x => x.PPR_PROJECT);
            Map(x => x.PPR_TASK);
            Map(x => x.PPR_ACTLINE);
            Map(x => x.PPR_ACTDESC).ReadOnly().Formula("(SELECT a.TSA_DESC FROM TMTASKACTIVITIES a WHERE a.TSA_TASK = PPR_TASK AND a.TSA_LINE = PPR_ACTLINE)");
            Map(x => x.PPR_TSKCUSTOMER).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMTASKS t, TMCUSTOMERS c WHERE t.TSK_CUSTOMER = c.CUS_CODE AND t.TSK_ID = PPR_TASK)");
            Map(x => x.PPR_TYPE);
            Map(x => x.PPR_SUBTYPE);
            Map(x => x.PPR_TYPEDESC);
            Map(x => x.PPR_CODE);
            Map(x => x.PPR_DESC);
            Map(x => x.PPR_QTY);
            Map(x => x.PPR_USERQTY);
            Map(x => x.PPR_UOM);
            Map(x => x.PPR_UNITPRICE);
            Map(x => x.PPR_USERUNITPRICE);
            Map(x => x.PPR_UNITPRICEEXCH).ReadOnly().Formula("(SELECT pp.PPR_UNITPRICEEXCH FROM TMPROJECTPRICINGEXCHVIEW pp WHERE pp.PPR_ID = PPR_ID)");
            Map(x => x.PPR_CALCULATEDUNITPRICEEXCH).ReadOnly().Formula("(SELECT pp.PPR_CALCULATEDUNITPRICEEXCH FROM TMPROJECTPRICINGEXCHVIEW pp WHERE pp.PPR_ID = PPR_ID)");
            Map(x => x.PPR_PROJECTCURR).ReadOnly().Formula("(SELECT pp.PPR_PROJECTCURR FROM TMPROJECTPRICINGEXCHVIEW pp WHERE pp.PPR_ID = PPR_ID)");
            Map(x => x.PPR_CURR);
            Map(x => x.PPR_CREATED);
            Map(x => x.PPR_CREATEDBY);
            Map(x => x.PPR_RECORDVERSION);
        }
    }
}