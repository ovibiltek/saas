using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMINVOICELINESVIEW_MAP : ClassMap<TMINVOICELINESVIEW>
    {
        public TMINVOICELINESVIEW_MAP()
        {
            Id(x => x.TSA_ID);
            Map(x => x.TSA_TASK);
            Map(x => x.TSA_TSKSHORTDESC);
            Map(x => x.TSA_LINE);
            Map(x => x.TSA_DESC);
            Map(x => x.TSA_TSKREQUESTED);
            Map(x => x.TSA_TSKCOMPLETED);
            Map(x => x.TSA_TSKORGANIZATION);
            Map(x => x.TSA_TSKCUSTOMER);
            Map(x => x.TSA_TSKCUSTOMERDESC);
            Map(x => x.TSA_TSKBRANCH);
            Map(x => x.TSA_TSKBRANCHDESC);
            Map(x => x.TSA_TSKCATEGORY);
            Map(x => x.TSA_TSKCATEGORYDESC);
            Map(x => x.TSA_CREATEDBY);
            Map(x => x.TSA_CREATED);
            Map(x => x.TSA_TRADE);
            Map(x => x.TSA_DATECOMPLETED);
            Map(x => x.TSA_TSKCLOSED);
            Map(x => x.TSA_MOBILENOTE);
            Map(x => x.TSA_SUPPLIER);
            Map(x => x.TSA_TSKDOCCOUNT).ReadOnly().Formula("dbo.GetDocumentCount('TASK', TSA_TASK, :SessionContext.User)");
            Map(x => x.TSA_TSKCMNTCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = TSA_TASK AND c.CMN_SUBJECT = 'TASK' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                                                                                                            "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
            Map(x => x.TSA_TSKIPP);
            Map(x => x.TSA_MSCTOTAL);
            Map(x => x.TSA_MSCQTY);
            Map(x => x.TSA_INVOICE);
        }
    }
}