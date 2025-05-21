namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKPRICINGSUMMARY
    {
        public virtual long PPR_PROJECT { get; set; }

        public virtual long PPR_TASK { get; set; }

        public virtual string PPR_TASKSHORTDESC { get; set; }

        public virtual decimal? PPR_COST { get; set; }

        public virtual decimal? PPR_TOTAL { get; set; }

        public virtual decimal? PPR_TAX2 { get; set; }

        public virtual decimal? PPR_PROFIT { get; set; }

        public virtual decimal? PPR_PROFITPERCENT { get; set; }

        public virtual decimal? PPR_VAT { get; set; }

        public virtual decimal? PPR_QUOTATIONFINAL { get; set; }

        public virtual string PPR_CURR { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMTASKPRICINGSUMMARY;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.PPR_PROJECT == PPR_PROJECT && other.PPR_TASK == PPR_TASK;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return PPR_PROJECT.GetHashCode() ^ PPR_TASK.GetHashCode();
            }
        }
    }
}