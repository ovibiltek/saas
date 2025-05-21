using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCUSTOMEREQUIPMENTCONFIG
    {
        public virtual long CEC_ID { get; set; }

        public virtual string CEC_TSKTYPE { get; set; }


        public virtual string CEC_TSKCAT { get; set; }

        public virtual string CEC_TSKCATDESC { get; set; }

        public virtual string CEC_CUSTOMER { get; set; }

        public virtual DateTime CEC_CREATED { get; set; }

        public virtual string CEC_CREATEDBY { get; set; }

        public virtual DateTime? CEC_UPDATED { get; set; }

        public virtual string CEC_UPDATEDBY { get; set; }

        public virtual int CEC_RECORDVERSION { get; set; }

    }
}

