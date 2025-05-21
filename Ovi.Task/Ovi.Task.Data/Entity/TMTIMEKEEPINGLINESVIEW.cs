using System;namespace Ovi.Task.Data.Entity{    public class TMTIMEKEEPINGLINESVIEW    {        public virtual int TKD_TIMEKEEPING { get; set; }        public virtual string TKD_TIMEKEEPINGDESC { get; set; }        public virtual string TKD_USER { get; set; }        public virtual string TKD_USERDESC { get; set; }        public virtual DateTime TKD_DATE { get; set; }        public virtual string TKD_SHIFT { get; set; }        public virtual string TKD_EXCEPTION { get; set; }        public virtual string TKD_MINSTART { get; set; }        public virtual string TKD_MAXEND { get; set; }        public virtual string TKD_DIFF { get; set; }        public virtual string TKD_SUM { get; set; }        public virtual string TKD_TIMEONROUTE { get; set; }        public virtual string TKD_NORMAL { get; set; }        public virtual string TKD_OVERTIME { get; set; }        public virtual string TKD_STATUS { get; set; }        public virtual int? TKD_APPROVALLINE { get; set; }        public virtual string TKD_APPROVER { get; set; }        public virtual string TKD_APPROVERDESC { get; set; }        public override bool Equals(object obj)        {            var other = obj as TMTIMEKEEPINGLINESVIEW;            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TKD_TIMEKEEPING == TKD_TIMEKEEPING && other.TKD_USER == TKD_USER && other.TKD_DATE == TKD_DATE;        }        public override int GetHashCode()        {            unchecked            {                return TKD_TIMEKEEPING.GetHashCode() ^ TKD_USER.GetHashCode() ^ TKD_DATE.GetHashCode();            }        }    }}