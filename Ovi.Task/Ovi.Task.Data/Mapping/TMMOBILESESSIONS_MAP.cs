using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMOBILESESSIONS_MAP : ClassMap<TMMOBILESESSIONS>
    {
        public TMMOBILESESSIONS_MAP()
        {
            Id(x => x.SES_ID);
            Map(x => x.SES_SESSID);
            Map(x => x.SES_USER);
            Map(x => x.SES_PRODUCTID);
            Map(x => x.SES_IP);
            Map(x => x.SES_BROWSER);
            Map(x => x.SES_ISMOBILE);
            Map(x => x.SES_LOGIN);
            Map(x => x.SES_RECORDVERSION);
        }
    }
}
