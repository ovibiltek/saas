using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERSVIEW
    {
        public virtual string USR_CODE { get; set; }

        public virtual string USR_DESC { get; set; }

        public virtual string USR_ORG { get; set; }

        public virtual string USR_DEPARTMENT { get; set; }

        public virtual string USR_TRADE { get; set; }

        public virtual string USR_AUTHORIZEDDEPARTMENTS { get; set; }

        public virtual string USR_GROUP { get; set; }

        public virtual string USR_GROUPDESC { get; set; }

        public virtual int? USR_PIC { get; set; }

        public virtual string USR_PICGUID { get; set; }

        public virtual string USR_CUSTOMER { get; set; }

        public virtual string USR_SUPPLIER { get; set; }

        public virtual string USR_TYPE { get; set; }

        public virtual string USR_TYPEDESC { get; set; }

        public virtual string USR_LANG { get; set; }

        public virtual string USR_PRICINGCODE { get; set; }

        public virtual string USR_DEFAULTINBOX { get; set; }

        public virtual string USR_EMAIL { get; set; }

        public virtual string USR_ALTERNATEEMAIL { get; set; }

        public virtual string USR_TIMEKEEPINGOFFICER { get; set; }

        public virtual char USR_VIEWWEEKLYCALENDAR { get; set; }

        public virtual string USR_ACTIVE { get; set; }

        public virtual char USR_TMS { get; set; }

        public virtual char USR_BOO { get; set; }

        public virtual char USR_INTA { get; set; }

        public virtual char USR_MOBILE { get; set; }

        public virtual DateTime? USR_STARTDATE { get; set; }

        public virtual DateTime? USR_ENDDATE { get; set; }

        public virtual DateTime? USR_CREATED { get; set; }

        public virtual string USR_CREATEDBY { get; set; }

        public virtual DateTime? USR_UPDATED { get; set; }

        public virtual string USR_UPDATEDBY { get; set; }

        public virtual int USR_SQLIDENTITY { get; set; }

        public virtual int USR_RECORDVERSION { get; set; }

        public virtual string USR_APPSTATUS { get; set; }

        public virtual string USR_APPSTATUSDESC { get; set; }

        public virtual string USR_EDUCATIONSTATUS { get; set; }

        public virtual string USR_TCNUMBER { get; set; }

        public virtual string USR_BIRTHDATE { get; set; }

        public virtual string USR_RETURNREASON { get; set; }

        public virtual string USR_DUTY { get; set; }

        public virtual string USR_DUTYDESC { get; set; }

        public virtual int USR_ORD { get; set; }

        public virtual string USR_LEAVINGREASON { get; set; }

        public virtual string USR_LEAVINGREASONDESC { get; set; }

        public virtual int USR_LOCKCOUNT { get; set; }

        public virtual string USR_DEFAULTHOMESECTION { get; set; }


    }
}