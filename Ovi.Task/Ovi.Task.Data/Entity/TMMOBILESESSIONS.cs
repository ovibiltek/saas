using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMMOBILESESSIONS
    {
        public virtual int SES_ID { get; set; }
        public virtual string SES_SESSID { get; set; }
        public virtual string SES_USER { get; set; }
        public virtual int SES_PRODUCTID { get; set; }
        public virtual string SES_IP { get; set; }
        public virtual string SES_BROWSER { get; set; }
        public virtual char SES_ISMOBILE { get; set; }
        public virtual DateTime SES_LOGIN { get; set; }
        public virtual int SES_RECORDVERSION { get; set; }
    }
}
