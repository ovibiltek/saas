using System;
using Ovi.Task.Helper.Functional;
namespace Ovi.Task.Data.Entity
{
    public class TMENTRUSTS
    {
        public virtual int ETR_ID { get; set; }
        public virtual string ETR_DESC { get; set; }
        public virtual string ETR_ORG { get; set; }
        public virtual string ETR_ORGDESC { get; set; }
        public virtual string ETR_TYPEENTITY { get; set; }
        public virtual string ETR_TYPE { get; set; }
        public virtual string ETR_TYPEDESC { get; set; }
        public virtual string ETR_STATUSENTITY { get; set; }
        public virtual string ETR_STATUS { get; set; }
        public virtual string ETR_STATUSDESC { get; set; }
        public virtual string ETR_USER { get; set; }
        public virtual string ETR_CREATEDBY { get; set; }
        public virtual DateTime ETR_CREATED { get; set; }
        public virtual string ETR_UPDATEDBY { get; set; }
        public virtual DateTime? ETR_UPDATED { get; set; }
        public virtual int ETR_RECORDVERSION { get; set; }
    } }