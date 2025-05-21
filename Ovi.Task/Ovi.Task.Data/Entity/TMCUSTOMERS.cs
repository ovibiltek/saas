using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCUSTOMERS
    {
        public virtual string CUS_CODE { get; set; }

        public virtual string CUS_DESC { get; set; }

        public virtual string CUS_ORG { get; set; }

        public virtual string CUS_TYPEENTITY { get; set; }

        public virtual string CUS_TYPE { get; set; }

        public virtual string CUS_TYPEDESC { get; set; }

        public virtual string CUS_ORGDESC { get; set; }

        public virtual string CUS_TITLE { get; set; }

        public virtual string CUS_ACCOUNTCODE { get; set; }

        public virtual int? CUS_PAYMENTPERIOD { get; set; }

        public virtual int? CUS_PROGRESSPAYMENTPERIOD { get; set; }

        public virtual string CUS_PHONE01 { get; set; }

        public virtual string CUS_PHONE02 { get; set; }

        public virtual string CUS_FAX { get; set; }

        public virtual string CUS_WEB { get; set; }

        public virtual string CUS_CONTACTPERSON01 { get; set; }

        public virtual string CUS_CONTACTPERSON02 { get; set; }

        public virtual string CUS_PROVINCE { get; set; }

        public virtual string CUS_PROVINCEDESC { get; set; }

        public virtual string CUS_DISTRICT { get; set; }

        public virtual string CUS_DISTRICTDESC { get; set; }

        public virtual string CUS_TAXOFFICE { get; set; }

        public virtual string CUS_TAXNO { get; set; }

        public virtual string CUS_ADDRESS { get; set; }

        public virtual string CUS_PRIORITY { get; set; }

        public virtual string CUS_CSR { get; set; }

        public virtual string CUS_OO { get; set; }

        public virtual string CUS_OODESC { get; set; }

        public virtual string CUS_SA { get; set; }

        public virtual string CUS_SADESC { get; set; }

        public virtual string CUS_REPORTINGRESPONSIBLE { get; set; }

        public virtual string CUS_REPORTINGRESPONSIBLEDESC { get; set; }

        public virtual string CUS_PM { get; set; }

        public virtual string CUS_PMDESC { get; set; }

        public virtual string CUS_SECTOR { get; set; }

        public virtual string CUS_SECTORDESC { get; set; }

        public virtual string CUS_GROUP { get; set; }

        public virtual string CUS_GROUPDESC { get; set; }

        public virtual string CUS_BILLINGADDRESS { get; set; }

        public virtual char CUS_ACTIVE { get; set; }

        public virtual DateTime CUS_CREATED { get; set; }

        public virtual DateTime? CUS_UPDATED { get; set; }

        public virtual string CUS_CREATEDBY { get; set; }

        public virtual string CUS_UPDATEDBY { get; set; }

        public virtual string CUS_PPTASKCNT { get; set; }

        public virtual int CUS_SQLIDENTITY { get; set; }

        public virtual int CUS_RECORDVERSION { get; set; }

        public virtual string CUS_NOTIFY { get; set; }

        public virtual string CUS_WORKINGSTATUS { get; set; }

        public virtual string CUS_WORKINGSTATUSDESC { get; set; }

        public virtual string CUS_NOTES { get; set; }

        public virtual int? CUS_BARCODELENGTH { get; set; }

        public virtual decimal? CUS_EMERGENCYRESPONDTIME { get; set; }

        public virtual DateTime? CUS_LASTTASKCREATED { get; set; }

        public virtual string CUS_PSP { get; set; }

        public virtual string CUS_PSPDESC { get; set; }

        public virtual string CUS_PMMASTER { get; set; }

        public virtual string CUS_PMMASTERDESC { get; set; }

        public virtual string CUS_BRANCHPREFIX { get; set; }

        public virtual int CUS_BRANCHCOUNT { get; set; }

        public virtual char CUS_CHECKSTARTLABORDISTANCE { get; set; }

        public virtual char CUS_CHECKENDLABORDISTANCE { get; set; }


    }
}