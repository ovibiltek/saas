using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPRICINGPARAMETERRELATIONS
    {
        public virtual long PPR_ID { get; set; }

        public virtual string PPR_ENTITY { get; set; }

        public virtual string PPR_CODE { get; set; }

        public virtual string PPR_PRICINGCODE { get; set; }

        public virtual string PPR_PRICINGDESC { get; set; }

        public virtual char PPR_ALLBRANCHES { get; set; }

        public virtual string PPR_BRANCH { get; set; }

        public virtual string PPR_BRANCHDESC { get; set; }

        public virtual int PPR_REMINDINGPERIOD { get; set; }

        public virtual string PPR_NOTE { get; set; }

        public virtual DateTime PPR_STARTDATE { get; set; }

        public virtual DateTime PPR_ENDDATE { get; set; }

        public virtual string PPR_TASKCATEGORY { get; set; }

        public virtual string PPR_TASKCATEGORYDESC { get; set; }

        public virtual string PPR_PERIODICTASK { get; set; }

        public virtual string PPR_PERIODICTASKDESC { get; set; }

        public virtual DateTime PPR_CREATED { get; set; }

        public virtual string PPR_CREATEDBY { get; set; }

        public virtual DateTime? PPR_UPDATED { get; set; }

        public virtual string PPR_UPDATEDBY { get; set; }

        public virtual int PPR_RECORDVERSION { get; set; }
    }
}