using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMFIXEDPARTCOSTS
    {
            public virtual int FPC_ID { get; set; }
            public virtual int FPC_PARID { get; set; }
            public virtual string FPC_PARCODE { get; set; }
            public virtual string FPC_PARDESC { get; set; }
            public virtual decimal FPC_PRICE { get; set; }
            public virtual string FPC_CURR { get; set; }
            public virtual string FPC_CURRDESC { get; set; }
            public virtual DateTime? FPC_STARTDATE { get; set; }
            public virtual DateTime? FPC_ENDDATE { get; set; }
            public virtual DateTime? FPC_CREATED { get; set; }
            public virtual string FPC_CREATEDBY { get; set; }
            public virtual DateTime? FPC_UPDATED { get; set; }
            public virtual string FPC_UPDATEDBY { get; set; }
            public virtual int FPC_RECORDVERSION { get; set; }
        
    }
}
