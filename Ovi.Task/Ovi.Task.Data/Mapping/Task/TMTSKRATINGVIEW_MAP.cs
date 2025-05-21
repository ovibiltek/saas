using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTSKRATINGVIEW_MAP : ClassMap<TMTSKRATINGVIEW>
    {
        public TMTSKRATINGVIEW_MAP()
        {
            Id(x => x.RTN_TSKID);
            Map(x => x.RTN_TSKSHORTDESC);
            Map(x => x.RTN_TSKCATEGORY);
            Map(x => x.RTN_TSKCATEGORYDESC).ReadOnly().Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC', RTN_TSKCATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = RTN_TSKCATEGORY),:SessionContext.Language)");
            Map(x => x.RTN_TSKCUSTOMER);
            Map(x => x.RTN_TSKCUSTOMERDESC);
            Map(x => x.RTN_TSKBRANCH);
            Map(x => x.RTN_TSKBRANCHDESC);
            Map(x => x.RTN_TSKREGION);
            Map(x => x.RTN_AUDITED);
            Map(x => x.RTN_TSKCOMPLETED);
            Map(x => x.RTN_TSKRATING);
            Map(x => x.RTN_TSKRATINGCOMMENTS);
            Map(x => x.RTN_AUDCREATED);
            Map(x => x.RTN_AUDCREATEDBY);
            Map(x => x.RTN_REVIEW);
        }
    }
}