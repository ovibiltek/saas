using System;

namespace Ovi.Task.Data.Entity
{
    public class TMBRANCHES
    {

        public virtual string BRN_CODE { get; set; }

        public virtual string BRN_DESC { get; set; }

        public virtual string BRN_TYPEENTITY { get; set; }

        public virtual string BRN_TYPE { get; set; }

        public virtual string BRN_TYPEDESC { get; set; }

        public virtual string BRN_LOCATION { get; set; }

        public virtual string BRN_LOCATIONDESC { get; set; }

        public virtual string BRN_ORG { get; set; }

        public virtual string BRN_ORGDESC { get; set; }

        public virtual string BRN_CUSTOMER { get; set; }

        public virtual string BRN_CUSTOMERDESC { get; set; }

        public virtual string BRN_CUSTOMERGROUP { get; set; }

        public virtual string BRN_CUSTOMERGROUPDESC { get; set; }

        public virtual string BRN_ACCOUNTCODE { get; set; }

        public virtual string BRN_CSR { get; set; }

        public virtual string BRN_OO { get; set; }

        public virtual string BRN_OODESC { get; set; }

        public virtual string BRN_PM { get; set; }

        public virtual string BRN_PMDESC { get; set; }

        public virtual string BRN_AUTHORIZED { get; set; }

        public virtual string BRN_CUSTOMERZONE { get; set; }

        public virtual string BRN_WARRANTY { get; set; }

        public virtual string BRN_REGION { get; set; }

        public virtual string BRN_REGIONDESC { get; set; }

        public virtual string BRN_PROVINCE { get; set; }

        public virtual string BRN_PROVINCEDESC { get; set; }

        public virtual string BRN_DISTRICT { get; set; }

        public virtual string BRN_DISTRICTDESC { get; set; }

        public virtual string BRN_NEIGHBORHOOD { get; set; }

        public virtual string BRN_STREET { get; set; }

        public virtual string BRN_DOOR { get; set; }

        public virtual string BRN_FULLADDRESS { get; set; }

        public virtual string BRN_BILLADDRESS { get; set; }

        public virtual char BRN_ACTIVE { get; set; }

        public virtual char BRN_DEFAULT { get; set; }

        public virtual char BRN_MAINT { get; set; }

        public virtual DateTime BRN_CREATED { get; set; }

        public virtual string BRN_CREATEDBY { get; set; }

        public virtual DateTime? BRN_UPDATED { get; set; }

        public virtual string BRN_UPDATEDBY { get; set; }

        public virtual string BRN_PPTASKCNT { get; set; }

        public virtual int BRN_SQLIDENTITY { get; set; }

        public virtual int BRN_RECORDVERSION { get; set; }

        public virtual string BRN_BUSINESSTYPE { get; set; }

        public virtual string BRN_REFERENCE { get; set; }

        public virtual string BRN_NOTES { get; set; }
        
        public virtual decimal? BRN_EMERGENCYRESPONDTIME { get; set; }

        public virtual string BRN_AUTHNOTES { get; set; }

    }
}