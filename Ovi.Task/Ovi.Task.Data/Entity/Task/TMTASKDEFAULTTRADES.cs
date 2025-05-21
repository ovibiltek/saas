using System;
using Ovi.Task.Helper.Functional;
namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKDEFAULTTRADES
    {
        public virtual int DTR_ID { get; set; }
        public virtual string DTR_TASKTYPE { get; set; }
        public virtual string DTR_BRANCH { get; set; }
        public virtual string DTR_TRADE { get; set; }
        public virtual DateTime DTR_CREATED { get; set; }
        public virtual string DTR_CREATEDBY { get; set; }
        public virtual DateTime? DTR_UPDATED { get; set; }
        public virtual string DTR_UPDATEDBY { get; set; }
        public virtual int DTR_RECORDVERSION { get; set; }
    }
}