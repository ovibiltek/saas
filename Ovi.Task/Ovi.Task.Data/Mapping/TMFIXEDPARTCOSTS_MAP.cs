using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMFIXEDPARTCOSTS_MAP : ClassMap<TMFIXEDPARTCOSTS>
    {
        public TMFIXEDPARTCOSTS_MAP()
        {
            Id(x => x.FPC_ID);
            Map(x => x.FPC_PARID);
            Map(x => x.FPC_PARCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = FPC_PARID)");
            Map(x => x.FPC_PARDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = FPC_PARID)");
            Map(x => x.FPC_PRICE);
            Map(x => x.FPC_CURR);
            Map(x => x.FPC_CURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', FPC_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = FPC_CURR), :SessionContext.Language)");
            Map(x => x.FPC_STARTDATE);
            Map(x => x.FPC_ENDDATE);
            Map(x => x.FPC_CREATED);
            Map(x => x.FPC_CREATEDBY);
            Map(x => x.FPC_UPDATED);
            Map(x => x.FPC_UPDATEDBY);
            Map(x => x.FPC_RECORDVERSION);
        }
    }
}
