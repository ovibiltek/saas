using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPERIODICTASKPARAMETERS
    {
        public virtual long PTP_ID { get; set; }

        public virtual string PTP_PTASK { get; set; }

        public virtual string PTP_LOCATION { get; set; }

        public virtual string PTP_LOCATIONDESC { get; set; }

        public virtual string PTP_EQUIPMENT { get; set; }

        public virtual string PTP_EQUIPMENTCODE { get; set; }

        public virtual string PTP_EQUIPMENTDESC { get; set; }

        public virtual string PTP_DEPARTMENT { get; set; }

        public virtual string PTP_DEPARTMENTDESC { get; set; }

        public virtual string PTP_BRANCH { get; set; }

        public virtual string PTP_BRANCHDESC { get; set; }

        public virtual DateTime PTP_PLANDATE { get; set; }

        public virtual string PTP_RESPONSIBLE { get; set; }

        public virtual string PTP_RESPONSIBLEDESC { get; set; }

        public virtual string PTP_TRADE { get; set; }

        public virtual string PTP_TRADEDESC { get; set; }

        public virtual string PTP_ACTIVE { get; set; }

        public virtual DateTime PTP_CREATED { get; set; }

        public virtual string PTP_CREATEDBY { get; set; }

        public virtual DateTime? PTP_UPDATED { get; set; }

        public virtual string PTP_UPDATEDBY { get; set; }

        public virtual int PTP_RECORDVERSION { get; set; }

        public virtual string PTP_WORKPERMIT { get; set; }

        public virtual string PTP_REPORTING { get; set; }

    }
}