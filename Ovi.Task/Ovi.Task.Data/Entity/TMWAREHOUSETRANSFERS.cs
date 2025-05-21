using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMWAREHOUSETRANSFERS
    {
        public virtual long WTR_ID { get; set; }
        public virtual string WTR_ORG { get; set; }
        public virtual string WTR_FROM { get; set; }
        public virtual string WTR_FROMBIN { get; set; }
        public virtual string WTR_TO { get; set; }
        public virtual string WTR_TOBIN { get; set; }
        public virtual string WTR_CURR { get; set; }
        public virtual DateTime WTR_CREATED { get; set; }
        public virtual string WTR_CREATEDBY { get; set; }
        public virtual DateTime? WTR_UPDATED { get; set; }
        public virtual string WTR_UPDATEDBY { get; set; }
        public virtual int WTR_RECORDVERSION { get; set; }
        public virtual string WTR_TYPE { get; set; }
        public virtual string WTR_TYPEENTITY { get; set; }
        public virtual string WTR_STATUS { get; set; }
        public virtual string WTR_STATUSENTITY { get; set; }
        public virtual string WTR_DESCRIPTION { get; set; }
        public virtual string WTR_REQUESTEDBY { get; set; }
        public virtual string WTR_ORGDESC { get; set; }
        public virtual string WTR_FROMDESC { get; set; }
        public virtual string WTR_FROMBINDESC { get; set; }
        public virtual string WTR_TODESC { get; set; }
        public virtual string WTR_TOBINDESC { get; set; }

        public virtual string WTR_CURRDESC { get; set; }

        public virtual string WTR_STATUSDESC { get; set; }


    }
}
