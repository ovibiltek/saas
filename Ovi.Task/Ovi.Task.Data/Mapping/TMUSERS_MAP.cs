using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERS_MAP : ClassMap<TMUSERS>
    {
        public TMUSERS_MAP()
        {
            Id(x => x.USR_CODE).Length(PropertySettings.L50);
            Map(x => x.USR_DESC).Length(PropertySettings.L250);
            Map(x => x.USR_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.USR_DEPARTMENTDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = USR_DEPARTMENT)");
            Map(x => x.USR_TRADE).Length(PropertySettings.L50);
            Map(x => x.USR_TRADEDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = USR_TRADE)");
            Map(x => x.USR_CTRADE).ReadOnly().Formula("dbo.TM_GET_USERTRADE(USR_CODE)");
            Map(x => x.USR_CTRADEDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = dbo.TM_GET_USERTRADE(USR_CODE))");
            Map(x => x.USR_AUTHORIZEDDEPARTMENTS).Length(PropertySettings.L4001);
            Map(x => x.USR_TYPE).Length(PropertySettings.L50);
            Map(x => x.USR_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', 'USER#' + USR_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = USR_TYPE AND t.TYP_ENTITY = 'USER'), :SessionContext.Language)");
            Map(x => x.USR_GROUP).Length(PropertySettings.L50);
            Map(x => x.USR_GROUPDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMUSERGROUPS','UGR_DESC', USR_GROUP,(SELECT g.UGR_DESC FROM TMUSERGROUPS g WHERE g.UGR_CODE = USR_GROUP),:SessionContext.Language)");
            Map(x => x.USR_CUSTOMER).Length(PropertySettings.L4001);
            Map(x => x.USR_SUPPLIER).Length(PropertySettings.L4001);
            Map(x => x.USR_LANG).Length(PropertySettings.L50);
            Map(x => x.USR_DEFAULTINBOX).Length(PropertySettings.L50);
            Map(x => x.USR_LANGDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT l.LNG_DESCRIPTION FROM TMLANGS l WHERE l.LNG_CODE = USR_LANG)");
            Map(x => x.USR_PRICINGCODE).Length(PropertySettings.L50);
            Map(x => x.USR_PRICINGCODEDESC).ReadOnly().Formula("dbo.GetDesc('TMPRICINGCODES','PRC_DESC', USR_PRICINGCODE,(SELECT p.PRC_DESC FROM TMPRICINGCODES p WHERE p.PRC_CODE = USR_PRICINGCODE),:SessionContext.Language)");
            Map(x => x.USR_EMAIL).Length(4001);
            Map(x => x.USR_ALTERNATEEMAIL).Length(4001);
            Map(x => x.USR_ORG).Length(PropertySettings.L50);
            Map(x => x.USR_ORGDESC).Length(PropertySettings.L250).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', USR_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = USR_ORG),:SessionContext.Language)");
            Map(x => x.USR_PASSWORD);
            Map(x => x.USR_MOBILE);
            Map(x => x.USR_TMS);
            Map(x => x.USR_BOO);
            Map(x => x.USR_REQUESTOR);
            Map(x => x.USR_ACTIVE);
            Map(x => x.USR_VIEWWEEKLYCALENDAR);
            Map(x => x.USR_STARTDATE);
            Map(x => x.USR_ENDDATE);
            Map(x => x.USR_SSKENTRYDECLARATION);
            Map(x => x.USR_ISGTRAININGDOCUMENT);
            Map(x => x.USR_MEDICALREPORT);
            Map(x => x.USR_KKDFORM);
            Map(x => x.USR_CRIMINALRECORD);
            Map(x => x.USR_IDENTIFICATIONCARD);
            Map(x => x.USR_DRIVINGLICENSE);
            Map(x => x.USR_SCHOOLDIPLOMA);
            Map(x => x.USR_QUALIFICATIONCERTIFICATE);
            Map(x => x.USR_REGISTRATIONNUMBER);
            Map(x => x.USR_TITLE);
            Map(x => x.USR_TCNUMBER);
            Map(x => x.USR_FUSENUMBER);
            Map(x => x.USR_GENDER);
            Map(x => x.USR_MARITALSTATUS);
            Map(x => x.USR_BIRTHDATE);
            Map(x => x.USR_PLACEOFBIRTH);
            Map(x => x.USR_BLOODGROUP);
            Map(x => x.USR_EDUCATIONSTATUS);
            Map(x => x.USR_INTA);
            Map(x => x.USR_LASTGRADUATEDSCHOOL);
            Map(x => x.USR_LASTGRADUATEDDEPARTMENT);
            Map(x => x.USR_LASTGRADUATEDDATE);
            Map(x => x.USR_MILITARYSERVICE);
            Map(x => x.USR_EMERGENCYCONTACTNAME);
            Map(x => x.USR_EMERGENCYCONTACTAFFINITY);
            Map(x => x.USR_EMERGENCYCONTACTPHONENUMBER);
            Map(x => x.USR_PHONENUMBER);
            Map(x => x.USR_HOMETELEPHONENUMBER);
            Map(x => x.USR_OFFICENUMBER);
            Map(x => x.USR_PERSONALEMAIL);
            Map(x => x.USR_FULLADDRESS);
            Map(x => x.USR_SHOESIZE);
            Map(x => x.USR_SHOESIZEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SHOESIZE',USR_SHOESIZE,:SessionContext.Language)");
            Map(x => x.USR_TSHIRTSIZE);
            Map(x => x.USR_TSHIRTSIZEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SIZE',USR_TSHIRTSIZE,:SessionContext.Language)");
            Map(x => x.USR_POLARSIZE);
            Map(x => x.USR_POLARSIZEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('SIZE',USR_POLARSIZE,:SessionContext.Language)");
            Map(x => x.USR_PANTSIZE);
            Map(x => x.USR_PANTSIZEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('PANTSIZE',USR_PANTSIZE,:SessionContext.Language)");
            Map(x => x.USR_DRIVINGLICENSECLASS);
            Map(x => x.USR_LICENSEISSUEDATE);
            Map(x => x.USR_CREATED);
            Map(x => x.USR_CREATEDBY);
            Map(x => x.USR_UPDATED);
            Map(x => x.USR_UPDATEDBY);
            Map(x => x.USR_TIMEKEEPINGOFFICER);
            Map(x => x.USR_TIMEKEEPINGOFFICERDESC).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = USR_TIMEKEEPINGOFFICER)");
            Map(x => x.USR_SQLIDENTITY).Generated.Insert();
            Map(x => x.USR_RECORDVERSION).Default("0");
            Map(x => x.USR_APPSTATUS);
            Map(x => x.USR_APPSTATUSDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('USERAPPSTATUS',USR_APPSTATUS,:SessionContext.Language)");
            Map(x => x.USR_RETURNREASON);
            Map(x => x.USR_DUTY);
            Map(x => x.USR_DUTYDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('USRDUTY',USR_DUTY,:SessionContext.Language)");
            Map(x => x.USR_LEAVINGREASON);
            Map(x => x.USR_LEAVINGREASONDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('USRLEAVINGREASON',USR_LEAVINGREASON,:SessionContext.Language)");
            Map(x => x.USR_LOCKCOUNT);
            Map(x => x.USR_DEFAULTHOMESECTION);

        }
    }
}