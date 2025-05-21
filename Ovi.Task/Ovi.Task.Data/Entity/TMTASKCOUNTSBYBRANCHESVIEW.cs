using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMTASKCOUNTSBYBRANCHESVIEW
    {
        public virtual string TCB_CUSCODE { get; set; }
        public virtual string TCB_CUSDESC { get; set; }
        public virtual char TCB_ACTIVE { get; set; }
        public virtual DateTime TCB_CREATED { get; set; }
        public virtual int? TCB_PREVIOUSLYBRANCHCOUNT { get; set; }
        public virtual int? TCB_PASTBRANCHCOUNT { get; set; }
        public virtual int? TCB_CURRENTBRANCHCOUNT { get; set; }
        public virtual int? TCB_ALLACTBRANCHCOUNT { get; set; }
        public virtual int? TCB_ALLPASSIVEBRANCHCOUNT { get; set; }
        public virtual int? TCB_PREVIOUSLYTASKCOUNT { get; set; }
        public virtual int? TCB_PASTTASKCOUNT { get; set; }
        public virtual int? TCB_CURRENTTASKCOUNT { get; set; }
        public virtual int? TCB_ALLTASKCOUNT { get; set; }
        public virtual int? TCB_PREVIOUSLYTASKCOUNTDIFBRANCH { get; set; }
        public virtual int? TCB_PASTTASKCOUNTDIFBRANCH { get; set; }
        public virtual int? TCB_CURRENTTASKCOUNTDIFBRANCH { get; set; }
        public virtual int? TCB_ALLTASKDIFBRANCH { get; set; }
    }
}