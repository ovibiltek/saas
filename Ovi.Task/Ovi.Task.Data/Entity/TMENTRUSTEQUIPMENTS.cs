using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMENTRUSTEQUIPMENTS
    {
        public virtual int EEQ_ID { get; set; }
        public virtual int EEQ_ENTRUSTID { get; set; }
        public virtual string EEQ_ENTRUSTDESC { get; set; }
        public virtual int EEQ_EQUIPMENT { get; set; }
        public virtual string EEQ_EQUIPMENTCODE { get; set; }
        public virtual string EEQ_EQUIPMENTDESC { get; set; }
        public virtual string EEQ_HEALTH { get; set; }
        public virtual string EEQ_HEALTHDESC { get; set; }
        public virtual DateTime EEQ_CREATED { get; set; }
        public virtual string EEQ_CREATEDBY { get; set; }
        public virtual DateTime? EEQ_UPDATED { get; set; }
        public virtual string EEQ_UPDATEDBY { get; set; }
        public virtual int EEQ_RECORDVERSION { get; set; }
    }
}