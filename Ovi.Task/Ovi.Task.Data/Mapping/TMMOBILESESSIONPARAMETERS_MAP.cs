using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMOBILESESSIONPARAMETERS_MAP : ClassMap<TMMOBILESESSIONPARAMETERS>
    {
        public TMMOBILESESSIONPARAMETERS_MAP()
        {
            Id(x => x.SPR_ID);
            Map(x => x.SPR_SESSID);
            Map(x => x.SPR_TYPE);
            Map(x => x.SPR_SUBTYPE);
            Map(x => x.SPR_REFID);
            Map(x => x.SPR_VALUE).Length(400);
            Map(x => x.SPR_DESC).Formula("dbo.TM_MOBILE_GETSESSIONPARAMETERDESC('USR',SPR_VALUE)");
            Map(x => x.SPR_CREATED);
            Map(x => x.SPR_CREATEDBY);
            Map(x => x.SPR_RECORDVERSION);
        }
    }
}
