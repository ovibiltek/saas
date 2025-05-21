using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKPRINTVIEW
    {
        public virtual int TSK_ID { get; set; }
        public virtual DateTime? TSK_REQUESTED { get; set; }
        public virtual string TSK_SHORTDESC { get; set; }
        public virtual string TSK_TASKTYPE { get; set; }
        public virtual string TSK_CATEGORYDESC { get; set; }
        public virtual string TSK_CUSDESC { get; set; }
        public virtual string TSK_BRNDESC { get; set; }
        public virtual string TSK_BRNADDRESS { get; set; }
        
       
       
     

    }
}
