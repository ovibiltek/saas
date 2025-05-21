using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSUPPLIERVEHICLES
    {
        public virtual int SVH_ID { get; set; }

        public virtual string SVH_SUPPLIER { get; set; }

        public virtual string SVH_BRAND { get; set; }

        public virtual string SVH_BRANDDESC { get; set; }

        public virtual string SVH_LICENSEPLATE { get; set; }

        public virtual string SVH_MODEL { get; set; }

        public virtual string SVH_MODELDESC { get; set; }

        public virtual int SVH_YEAR { get; set; }

        public virtual string SVH_COLOR { get; set; }

        public virtual string SVH_COLORDESC { get; set; }

        public virtual char SVH_VEHICLEWRAP { get; set; }

        public virtual DateTime? SVH_VEHICLEWRAPDATE { get; set; }

        public virtual string SVH_OWNERSHIP { get; set; }

        public virtual string SVH_OWNERSHIPDESC { get; set; }

        public virtual DateTime SVH_CREATED { get; set; }

        public virtual string SVH_CREATEDBY { get; set; }

        public virtual DateTime? SVH_UPDATED { get; set; }

        public virtual string SVH_UPDATEDBY { get; set; }

        public virtual int SVH_RECORDVERSION { get; set; }
    }
}