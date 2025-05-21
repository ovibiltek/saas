using System;

namespace Ovi.Task.Data.Entity
{
    public class TMFIREBASENOTIFICATIONTRX
    {
        public virtual int NTX_ID { get; set; }
        public virtual int NTX_NOTIFICATION { get; set; }
        public virtual string NTX_ERROR { get; set; }
        public virtual string NTX_MSG { get; set; }
        public virtual DateTime NTX_DATESENT { get; set; }
    }
}