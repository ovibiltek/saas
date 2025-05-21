using FluentNHibernate.Mapping;using Ovi.Task.Data.Entity;namespace Ovi.Task.Data.Mapping{    public sealed class TMWAREHOUSETRANSFERLINES_MAP : ClassMap<TMWAREHOUSETRANSFERLINES>    {        public TMWAREHOUSETRANSFERLINES_MAP()        {
            Id(x => x.WTL_ID);
            Map(x => x.WTL_WTRID);            Map(x => x.WTL_LINE);            Map(x => x.WTL_PART);            Map(x => x.WTL_QTY);            Map(x => x.WTL_UNITPRICE);            Map(x => x.WTL_UOM);            Map(x => x.WTL_FRTRANS);            Map(x => x.WTL_FRTRANSLINE);            Map(x => x.WTL_TOTRANS);            Map(x => x.WTL_TOTRANSLINE);            Map(x => x.WTL_CREATED);
            Map(x => x.WTL_CREATEDBY);
            Map(x => x.WTL_UPDATED);
            Map(x => x.WTL_UPDATEDBY);
                   }    }}