using System;


namespace Ovi.Task.Data.Entity
{
    public class TMCOMPENSATIONVIEW
    {
        public virtual int REA_ORDER { get; set; }
        public virtual string REA_PERIOD { get; set; }
        public virtual string REA_STATUS { get; set; }
        public virtual int REA_ROWNM { get; set; }
        public virtual int REA_TASK { get; set; }
        public virtual long REA_ID { get; set; }
        public virtual string REA_REGCODE { get; set; }
        public virtual string REA_CUSCODE { get; set; }
        public virtual string REA_CUSDESC { get; set; }
        public virtual string REA_BRNCODE { get; set; }
        public virtual string REA_BRNDESC { get; set; }
        public virtual string REA_LOCCODE { get; set; }
        public virtual string REA_LOCDESC { get; set; }
        public virtual DateTime REA_DATE { get; set; }
        public virtual decimal REA_ACTIVE { get; set; }
        public virtual decimal REA_INDUCTIVE { get; set; }
        public virtual decimal REA_CAPACITIVE { get; set; }
        public virtual decimal? REA_R1 { get; set; }
        public virtual decimal? REA_R2 { get; set; }
        public virtual int? REA_R1C { get; set; }
        public virtual int? REA_R2C { get; set; }
        public virtual int? REA_PV { get; set; }
        public virtual string REA_RCONST { get; set; }
    }
}