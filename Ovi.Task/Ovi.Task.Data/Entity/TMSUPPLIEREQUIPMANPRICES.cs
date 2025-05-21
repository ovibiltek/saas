using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMSUPPLIEREQUIPMANPRICES
    {
        public virtual int SMP_ID { get; set; }
        public virtual string SMP_SUPCODE { get; set; }
        public virtual string SMP_PTKCODE { get; set; }
        public virtual string SMP_PTKDESC { get; set; }
        public virtual string SMP_EQUIPMENTTYPEENTITY { get; set; }
        public virtual string SMP_EQUIPMENTTYPE { get; set; }
        public virtual string SMP_EQUIPMENTTYPEDESC { get; set; }
        public virtual DateTime SMP_STARTDATE { get; set; }
        public virtual DateTime SMP_ENDDATE { get; set; }
        public virtual decimal SMP_UNITPRICE { get; set; }
        public virtual string SMP_CURRENCY { get; set; }
        public virtual string SMP_CURRENCYDESC { get; set; }
        public virtual DateTime SMP_CREATED { get; set; }
        public virtual string SMP_CREATEDBY { get; set; }
        public virtual DateTime? SMP_UPDATED { get; set; }
        public virtual string SMP_UPDATEDBY { get; set; }
        public virtual int SMP_RECORDVERSION { get; set; }
    }
}
