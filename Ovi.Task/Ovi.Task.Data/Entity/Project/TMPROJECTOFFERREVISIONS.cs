using System;

namespace Ovi.Task.Data.Entity.Project
{
    public class TMPROJECTOFFERREVISIONS
    {
        public virtual long PRV_ID { get; set; }
        public virtual long PRV_PROJECT { get; set; }
        public virtual long PRV_REVNO { get; set; }
        public virtual decimal? PRV_LABORSUM { get; set; }
        public virtual decimal? PRV_MISCCOST { get; set; }
        public virtual decimal? PRV_PART { get; set; }
        public virtual decimal? PRV_TOOL { get; set; }
        public virtual decimal? PRV_FIXEDCOST { get; set; }
        public virtual decimal PRV_COST { get; set; }
        public virtual decimal PRV_PROFIT { get; set; }
        public virtual string PRV_CURR { get; set; }
        public virtual decimal PRV_EXCH { get; set; }
        public virtual decimal PRV_TOTAL { get; set; }
        public virtual DateTime PRV_UPDATED { get; set; }
        public virtual string PRV_UPDATEDBY { get; set; }
    }
}