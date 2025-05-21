using System;

namespace Ovi.Task.Data.Entity
{
    public class TMEQUIPMENTWARRANTY
    {
        public virtual int EWR_ID { get; set; }

        public virtual int EWR_EQUIPMENT { get; set; }

        public virtual string EWR_TYPE { get; set; }

        public virtual string EWR_TYPEDESC { get; set; }

        public virtual string EWR_DURATIONTYPE { get; set; }

        public virtual string EWR_DURATIONTYPEDESC { get; set; }

        public virtual DateTime? EWR_DATESTART { get; set; }

        public virtual DateTime? EWR_DATEEND { get; set; }

        public virtual int EWR_WARNING { get; set; }

        public virtual string EWR_UOM { get; set; }

        public virtual decimal? EWR_INITIALUSE { get; set; }

        public virtual decimal? EWR_ENDUSE { get; set; }

        public virtual char EWR_CHKLABOR { get; set; }

        public virtual char EWR_CHKPART { get; set; }

        public virtual decimal? EWR_LABORLIMIT { get; set; }

        public virtual string EWR_LABORCURR{ get; set; }

        public virtual decimal? EWR_PARTLIMIT { get; set; }

        public virtual string EWR_PARTCURR { get; set; }

        public virtual DateTime EWR_CREATED { get; set; }

        public virtual string EWR_CREATEDBY { get; set; }

        public virtual DateTime? EWR_UPDATED { get; set; }

        public virtual string EWR_UPDATEDBY { get; set; }

        public virtual int EWR_RECORDVERSION { get; set; }
    }
}