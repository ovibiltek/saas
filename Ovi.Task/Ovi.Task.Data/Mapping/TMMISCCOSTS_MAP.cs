using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMISCCOSTS_MAP : ClassMap<TMMISCCOSTS>
    {
        public TMMISCCOSTS_MAP()
        {
            Id(x => x.MSC_ID);
            Map(x => x.MSC_TASK);
            Map(x => x.MSC_ACTIVITY);
            Map(x => x.MSC_ACTIVITYDESC).ReadOnly().Formula("(SELECT ta.TSA_DESC FROM TMTASKACTIVITIES ta WHERE ta.TSA_LINE = MSC_ACTIVITY AND ta.TSA_TASK = MSC_TASK)");
            Map(x => x.MSC_DATE);
            Map(x => x.MSC_DESC);
            Map(x => x.MSC_TYPE).Length(PropertySettings.L50);
            Map(x => x.MSC_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMMISCCOSTTYPES','MCT_DESC', MSC_TYPE, (SELECT m.MCT_DESC FROM TMMISCCOSTTYPES m WHERE m.MCT_CODE = MSC_TYPE), :SessionContext.Language)");
            Map(x => x.MSC_PTYPE).Length(PropertySettings.L50);
            Map(x => x.MSC_UNITPRICE);
            Map(x => x.MSC_UNITSALESPRICE);
            Map(x => x.MSC_CURR).Length(PropertySettings.L50);
            Map(x => x.MSC_CURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', MSC_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = MSC_CURR), :SessionContext.Language)");
            Map(x => x.MSC_EXCH);
            Map(x => x.MSC_QTY);
            Map(x => x.MSC_UOM);
            Map(x => x.MSC_UOMDESC).Formula("dbo.GetDesc('TMUOMS','UOM_DESC', MSC_UOM, (SELECT u.UOM_DESC FROM TMUOMS u WHERE u.UOM_CODE = MSC_UOM),:SessionContext.Language)");
            Map(x => x.MSC_TOTAL);
            Map(x => x.MSC_INVOICE);
            Map(x => x.MSC_INVOICEDESC).ReadOnly().Formula("(SELECT i.INV_DESC FROM TMINVOICES i WHERE i.INV_CODE = MSC_INVOICE)");
            Map(x => x.MSC_PART);
            Map(x => x.MSC_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = MSC_PART)");
            Map(x => x.MSC_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = MSC_PART)");
            Map(x => x.MSC_PARTREFERENCE);
            Map(x => x.MSC_FIXED);
            Map(x => x.MSC_CREATED);
            Map(x => x.MSC_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.MSC_UPDATED);
            Map(x => x.MSC_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.MSC_RECORDVERSION).Default("0");

        }
    }
}