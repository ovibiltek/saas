using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TM_TASKCOUNTS
    {
        public virtual int TCA_COUNT { get; set; }

        public virtual string TCA_DEPARTMENT { get; set; }

        public virtual string TCA_TSKDEPARTMENT { get; set; }

        public virtual DateTime? TCA_DATE { get; set; }

        public virtual int TCA_YEAR { get; set; }

        public virtual int TCA_MONTH { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TM_TASKCOUNTS;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TCA_DEPARTMENT == TCA_DEPARTMENT && other.TCA_TSKDEPARTMENT == TCA_TSKDEPARTMENT &&
                   other.TCA_DATE == TCA_DATE;
        }

        public override int GetHashCode()
        {
            return TCA_DEPARTMENT.GetHashCode() ^ TCA_TSKDEPARTMENT.GetHashCode() ^ TCA_DATE.ToString().GetHashCode();
        }
    }
}