using System;

namespace Ovi.Task.Data.Entity.Project
{
    public class TMPROJECTPRICING
    {
        public virtual long PPR_ID { get; set; }

        public virtual long PPR_PROJECT { get; set; }

        public virtual long? PPR_TASK { get; set; }

        public virtual long? PPR_ACTLINE { get; set; }

        public virtual string PPR_ACTDESC { get; set; }

        public virtual string PPR_TSKCUSTOMER { get; set; }

        public virtual string PPR_TYPE { get; set; }

        public virtual string PPR_SUBTYPE { get; set; }

        public virtual string PPR_TYPEDESC { get; set; }

        public virtual string PPR_CODE { get; set; }

        public virtual string PPR_DESC { get; set; }

        public virtual decimal PPR_QTY { get; set; }

        public virtual decimal? PPR_USERQTY { get; set; }

        public virtual string PPR_UOM { get; set; }

        public virtual decimal PPR_UNITPRICE { get; set; }

        public virtual decimal? PPR_USERUNITPRICE { get; set; }

        public virtual decimal PPR_UNITPRICEEXCH { get; set; }

        public virtual decimal PPR_CALCULATEDUNITPRICEEXCH { get; set; }

        public virtual string PPR_PROJECTCURR { get; set; }

        public virtual string PPR_CURR { get; set; }

        public virtual DateTime PPR_CREATED { get; set; }

        public virtual string PPR_CREATEDBY { get; set; }

        public virtual int PPR_RECORDVERSION { get; set; }

        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}