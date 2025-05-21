using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKACTIVITYDURATIONS
    {
        public virtual long DUR_ID { get; set; }

        public virtual long DUR_TASK { get; set; }

        public virtual long DUR_ACTIVITY { get; set; }

        public virtual string DUR_TRADE { get; set; }

        public virtual DateTime DUR_START { get; set; }

        public virtual string DUR_STARTTYPE { get; set; }

        public virtual DateTime? DUR_END { get; set; }

        public virtual string DUR_ENDDTYPE { get; set; }

        public virtual string DUR_STARTLAT { get; set; }

        public virtual string DUR_STARTLNG { get; set; }

        public virtual string DUR_ENDLAT { get; set; }

        public virtual string DUR_ENDLNG { get; set; }

        public virtual string DUR_CREATEDBY { get; set; }

        public virtual DateTime DUR_CREATED { get; set; }

        public virtual DateTime? DUR_UPDATED { get; set; }

        public virtual string DUR_UPDATEDBY { get; set; }

        public virtual int DUR_RECORDVERSION { get; set; }    }}