using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPARTIALPAYMENTS_MAP : ClassMap<TMPARTIALPAYMENTS>
    {
        public TMPARTIALPAYMENTS_MAP()
        {
            Id(x => x.PTP_ID);
            Map(x => x.PTP_DESC);
            Map(x => x.PTP_PROGRESSPAYMENT);
            Map(x => x.PTP_SALESINVOICE);
            Map(x => x.PTP_AMOUNT);
            Map(x => x.PTP_CREATED);
            Map(x => x.PTP_CREATEDBY);
            Map(x => x.PTP_UPDATED);
            Map(x => x.PTP_UPDATEDBY);
        }
    }
}
