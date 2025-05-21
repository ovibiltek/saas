using System;

namespace Ovi.Task.Data.Entity
{
    public class TMBATCHPROGRESSDATA
    {
        public virtual int PRG_ID { get; set; }

        public virtual string PRG_SESSION { get; set; }

        public virtual string PRG_FILENAME { get; set; }

        public virtual string PRG_BATCH { get; set; }

        public virtual string PRG_USER { get; set; }

        public virtual string PRG_PROGRESSDATA { get; set; }

        public virtual string PRG_STATUS { get; set; }

        public virtual DateTime PRG_CREATED { get; set; }

        public virtual string PRG_CREATEDBY { get; set; }

        public virtual DateTime? PRG_UPDATED { get; set; }

        public virtual string PRG_UPDATEDBY { get; set; }

        public virtual int PRG_RECORDVERSION { get; set; }
    }
}