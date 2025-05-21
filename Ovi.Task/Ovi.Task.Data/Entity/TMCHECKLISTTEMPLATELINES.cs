using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCHECKLISTTEMPLATELINES : ICloneable
    {
        public virtual long CHK_ID { get; set; }

        public virtual string CHK_SUBJECT { get; set; }

        public virtual string CHK_SOURCE { get; set; }

        public virtual string CHK_TEXT { get; set; }

        public virtual string CHK_TYPE { get; set; }

        public virtual string CHK_TOPIC{ get; set; }

        public virtual string CHK_TOPICDESC { get; set; }

        public virtual string CHK_COMPARE { get; set; }

        public virtual long CHK_NO { get; set; }

        public virtual int? CHK_RATE { get; set; }

        public virtual char CHK_NECESSARY { get; set; }

        public virtual char CHK_ACTIVE { get; set; }


        public virtual string CHK_CREATEDBY { get; set; }

        public virtual DateTime CHK_CREATED { get; set; }

        public virtual string CHK_UPDATEDBY { get; set; }

        public virtual DateTime? CHK_UPDATED { get; set; }

        public virtual int CHK_RECORDVERSION { get; set; }

        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}