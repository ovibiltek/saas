using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMMOBILESESSIONPARAMETERS
    {
        public virtual int SPR_ID { get; set; }
        public virtual string SPR_SESSID { get; set; }
        public virtual string SPR_TYPE { get; set; }
        public virtual string SPR_DESC { get; set; }
        public virtual string SPR_SUBTYPE { get; set; }
        public virtual int? SPR_REFID { get; set; }
        public virtual string SPR_VALUE { get; set; }
        public virtual DateTime SPR_CREATED { get; set; }
        public virtual string SPR_CREATEDBY { get; set; }
        public virtual int SPR_RECORDVERSION { get; set; }
    }
}
