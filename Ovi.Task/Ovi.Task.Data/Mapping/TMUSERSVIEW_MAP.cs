using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERSVIEW_MAP : ClassMap<TMUSERSVIEW>
    {
        public TMUSERSVIEW_MAP()
        {
            Id(x => x.USR_CODE);
            Map(x => x.USR_DESC);
            Map(x => x.USR_ORG);
            Map(x => x.USR_DEPARTMENT);
            Map(x => x.USR_TRADE);
            Map(x => x.USR_AUTHORIZEDDEPARTMENTS);
            Map(x => x.USR_GROUP);
            Map(x => x.USR_GROUPDESC);
            Map(x => x.USR_PIC);
            Map(x => x.USR_PICGUID);
            Map(x => x.USR_CUSTOMER);
            Map(x => x.USR_SUPPLIER);
            Map(x => x.USR_TYPE);
            Map(x => x.USR_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', 'USER#' + USR_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = USR_TYPE AND t.TYP_ENTITY = 'USER'), :SessionContext.Language)");
            Map(x => x.USR_LANG);
            Map(x => x.USR_PRICINGCODE);
            Map(x => x.USR_DEFAULTINBOX);
            Map(x => x.USR_EMAIL);
            Map(x => x.USR_ALTERNATEEMAIL);
            Map(x => x.USR_TIMEKEEPINGOFFICER);
            Map(x => x.USR_VIEWWEEKLYCALENDAR);
            Map(x => x.USR_ACTIVE);
            Map(x => x.USR_TMS);
            Map(x => x.USR_BOO);
            Map(x => x.USR_INTA);
            Map(x => x.USR_MOBILE);
            Map(x => x.USR_STARTDATE);
            Map(x => x.USR_ENDDATE);
            Map(x => x.USR_CREATED);
            Map(x => x.USR_CREATEDBY);
            Map(x => x.USR_UPDATED);
            Map(x => x.USR_UPDATEDBY);
            Map(x => x.USR_SQLIDENTITY).Generated.Insert();
            Map(x => x.USR_RECORDVERSION);
            Map(x => x.USR_APPSTATUS);
            Map(x => x.USR_APPSTATUSDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('USERAPPSTATUS',USR_APPSTATUS,:SessionContext.Language)");
            Map(x => x.USR_TCNUMBER);
            Map(x => x.USR_EDUCATIONSTATUS);
            Map(x => x.USR_BIRTHDATE);
            Map(x => x.USR_RETURNREASON);
            Map(x => x.USR_DUTY);
            Map(x => x.USR_DUTYDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('USRDUTY',USR_DUTY,:SessionContext.Language)");
            Map(x => x.USR_ORD);
            Map(x => x.USR_LEAVINGREASON);
            Map(x => x.USR_LEAVINGREASONDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('USRLEAVINGREASON',USR_LEAVINGREASON,:SessionContext.Language)");
            Map(x => x.USR_LOCKCOUNT);
            Map(x => x.USR_DEFAULTHOMESECTION);


        }
    }
}