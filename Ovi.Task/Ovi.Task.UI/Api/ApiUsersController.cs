using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiUsersController : ApiController
    {
        private RepositoryUsers repositoryUsers;
        private RepositoryParameters repositoryParameters;

        public ApiUsersController()
        {
            repositoryUsers = new RepositoryUsers();
            repositoryParameters = new RepositoryParameters();
        }

        private static object BuildUserJSon(TMUSERS u)
        {
            var usrpic = new RepositoryDocuments().GetSingle("USER", u.USR_CODE);
            return new
            {
                u.USR_CODE,
                u.USR_DESC,
                u.USR_ORG,
                u.USR_DEPARTMENT,
                u.USR_TRADE,
                u.USR_AUTHORIZEDDEPARTMENTS,
                u.USR_TYPE,
                u.USR_TYPEDESC,
                u.USR_PRICINGCODE,
                u.USR_PRICINGCODEDESC,
                u.USR_GROUP,
                u.USR_CUSTOMER,
                u.USR_SUPPLIER,
                u.USR_LANG,
                u.USR_DEFAULTINBOX,
                u.USR_EMAIL,
                u.USR_ALTERNATEEMAIL,
                u.USR_PASSWORD,
                u.USR_VIEWWEEKLYCALENDAR,
                u.USR_ACTIVE,
                u.USR_TMS,
                u.USR_MOBILE,
                u.USR_REQUESTOR,
                u.USR_BOO,
                u.USR_STARTDATE,
                u.USR_ENDDATE,
                u.USR_SSKENTRYDECLARATION,
                u.USR_ISGTRAININGDOCUMENT,
                u.USR_MEDICALREPORT,
                u.USR_KKDFORM,
                u.USR_CRIMINALRECORD,
                u.USR_IDENTIFICATIONCARD,
                u.USR_DRIVINGLICENSE,
                u.USR_SCHOOLDIPLOMA,
                u.USR_QUALIFICATIONCERTIFICATE,
                u.USR_REGISTRATIONNUMBER,
                u.USR_TITLE,
                u.USR_TCNUMBER,
                u.USR_FUSENUMBER,
                u.USR_GENDER,
                u.USR_MARITALSTATUS,
                u.USR_BIRTHDATE,
                u.USR_PLACEOFBIRTH,
                u.USR_BLOODGROUP,
                u.USR_EDUCATIONSTATUS,
                u.USR_LASTGRADUATEDSCHOOL,
                u.USR_LASTGRADUATEDDEPARTMENT,
                u.USR_LASTGRADUATEDDATE,
                u.USR_MILITARYSERVICE,
                u.USR_EMERGENCYCONTACTNAME,
                u.USR_EMERGENCYCONTACTAFFINITY,
                u.USR_EMERGENCYCONTACTPHONENUMBER,
                u.USR_PHONENUMBER,
                u.USR_HOMETELEPHONENUMBER,
                u.USR_OFFICENUMBER,
                u.USR_PERSONALEMAIL,
                u.USR_FULLADDRESS,
                u.USR_SHOESIZE,
                u.USR_SHOESIZEDESC,
                u.USR_TSHIRTSIZE,
                u.USR_TSHIRTSIZEDESC,
                u.USR_PANTSIZE,
                u.USR_PANTSIZEDESC,
                u.USR_POLARSIZE,
                u.USR_POLARSIZEDESC,
                u.USR_DRIVINGLICENSECLASS,
                u.USR_LICENSEISSUEDATE,
                u.USR_CREATED,
                u.USR_CREATEDBY,
                u.USR_UPDATED,
                u.USR_UPDATEDBY,
                u.USR_SQLIDENTITY,
                u.USR_RECORDVERSION,
                u.USR_TRADEDESC,
                u.USR_ORGDESC,
                u.USR_DEPARTMENTDESC,
                u.USR_GROUPDESC,
                u.USR_LANGDESC,
                u.USR_TIMEKEEPINGOFFICER,
                u.USR_TIMEKEEPINGOFFICERDESC,
                u.USR_APPSTATUS,
                u.USR_APPSTATUSDESC,
                u.USR_RETURNREASON,
                u.USR_DUTY,
                u.USR_DUTYDESC,
                u.USR_LEAVINGREASON,
                u.USR_LEAVINGREASONDESC,
                u.USR_DEFAULTHOMESECTION,
                USR_AUTHORIZEDDEPARTMENTSARR = new RepositoryDepartments().GetDepartments(u.USR_CODE, '-'),
                USR_PIC = usrpic != null ? usrpic.DOC_ID.ToString() : null,
                USR_PICGUID = usrpic != null ? usrpic.DOC_GUID : null,
                USR_CUSTOMERSARR = new RepositoryCustomers().GetCustomers(u.USR_CUSTOMER, false),
                USR_SUPPLIERSARR = new RepositorySuppliers().GetSuppliers(u.USR_SUPPLIER, false),
                u.USR_INTA,
                u.USR_LOCKCOUNT
            };
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "USR_CUSTOMER", "USR_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMUSERSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryUsers.ListView(gridRequest);
                        total = RepositoryShared<TMUSERSVIEW>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUsersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListCustomerUsers(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "USR_CUSTOMER", "USR_ORG");
                object data;

                BuildCustomerFilter(gridRequest);

                data = (gridRequest.action == "CNT") ?
                       (object)RepositoryShared<TMUSERSVIEW>.Count(gridRequest) :
                       repositoryUsers.ListView(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUsersController", "ListCustomerUsers");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }


        }

        private void BuildCustomerFilter(GridRequest gridRequest)
        {
            var customerFilter = gridRequest.filter.Filters.Where(x => x.Field != null && x.Field.ToString() == "CUSTOMER");
            var oldFilter = customerFilter as GridFilter[] ?? customerFilter.ToArray();
            var newFilter = oldFilter.Select(x => new GridFilter
            {
                Operator = "sqlfunc",
                Value = "EXISTS (SELECT 1 FROM FilterFieldMapsTable('USER', 'CUSTOMER') WHERE FMP_VALUE = '" + x.Value + "' AND FMP_CODE = USR_CODE )"
            });

            gridRequest.filter.Filters = gridRequest.filter.Filters.Except(oldFilter).ToList();
            gridRequest.filter.Filters.AddRange(newFilter);
        }

        [HttpPost]
        [Transaction]
        public string Save(UserModel nUser)
        {
            var oldUser = repositoryUsers.Get(nUser.User.USR_CODE);
            nUser.User.USR_PASSWORD = nUser.User.USR_SQLIDENTITY == 0 ? PasswordHelper.Md5Encrypt(UniqueStringId.Generate()) : oldUser.USR_PASSWORD;
            repositoryUsers.SaveOrUpdate(nUser.User, false);

            //repositoryUsers.SystemCheck();

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("USER", nUser.User.USR_CODE, nUser.CustomFieldValues);

            if (nUser.User.USR_CODE == UserManager.Instance.User.Code)
            {
                var httpCookie = HttpContext.Current.Response.Cookies["culture"];
                if (httpCookie != null)
                {
                    httpCookie.Value = new RepositoryLangs().Get(nUser.User.USR_LANG).LNG_CULTURE;
                }
                else
                {
                    HttpContext.Current.Response.Cookies.Add(new HttpCookie("culture", new RepositoryLangs().Get(nUser.User.USR_LANG).LNG_CULTURE));
                }
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10005", UserManager.Instance.User.Language), r = BuildUserJSon(nUser.User) });
        }

        [HttpPost]
        [Transaction]
        public string SaveSupplierUser(TMUSERS nUser)
        {
            var oUser = repositoryUsers.Get(nUser.USR_CODE);
            TMUSERS usr = null;

            if (oUser != null)
            {
                usr = oUser.Copy();
                usr.USR_DESC = nUser.USR_DESC;
                usr.USR_GROUP = nUser.USR_GROUP;
                usr.USR_TRADE = nUser.USR_TRADE;
                usr.USR_EMAIL = nUser.USR_EMAIL;
                usr.USR_HOMETELEPHONENUMBER = nUser.USR_HOMETELEPHONENUMBER;
                usr.USR_PHONENUMBER = nUser.USR_PHONENUMBER;
                usr.USR_STARTDATE = nUser.USR_STARTDATE;
                usr.USR_ENDDATE = nUser.USR_ENDDATE;
                usr.USR_SHOESIZE = nUser.USR_SHOESIZE;
                usr.USR_TSHIRTSIZE = nUser.USR_TSHIRTSIZE;
                usr.USR_PANTSIZE = nUser.USR_PANTSIZE;
                usr.USR_POLARSIZE = nUser.USR_POLARSIZE;
                usr.USR_EDUCATIONSTATUS = nUser.USR_EDUCATIONSTATUS;
                usr.USR_LASTGRADUATEDSCHOOL = nUser.USR_LASTGRADUATEDSCHOOL;
                usr.USR_LASTGRADUATEDDEPARTMENT = nUser.USR_LASTGRADUATEDDEPARTMENT;
                usr.USR_LASTGRADUATEDDATE = nUser.USR_LASTGRADUATEDDATE;
                usr.USR_GENDER = nUser.USR_GENDER;
                usr.USR_BIRTHDATE = nUser.USR_BIRTHDATE;
                usr.USR_TCNUMBER = nUser.USR_TCNUMBER;
                usr.USR_DRIVINGLICENSE = nUser.USR_DRIVINGLICENSE;
                usr.USR_DRIVINGLICENSECLASS = nUser.USR_DRIVINGLICENSECLASS;
                usr.USR_LICENSEISSUEDATE = nUser.USR_LICENSEISSUEDATE;
                usr.USR_RETURNREASON = nUser.USR_RETURNREASON;
                usr.USR_DUTY = nUser.USR_DUTY;
                usr.USR_LEAVINGREASON = nUser.USR_LEAVINGREASON;

                if (string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                {
                    usr.USR_ACTIVE = (nUser.USR_APPSTATUS == "ONAYLANDI") ? '+' : '-';
                    usr.USR_TMS = (nUser.USR_APPSTATUS == "ONAYLANDI" && nUser.USR_GROUP == "T1") ? '+' : '-';
                    usr.USR_INTA = (nUser.USR_APPSTATUS == "ONAYLANDI") ? '+' : '-';
                    usr.USR_MOBILE = (nUser.USR_APPSTATUS == "ONAYLANDI" && nUser.USR_GROUP == "T2") ? '+' : '-';
                    usr.USR_APPSTATUS = nUser.USR_APPSTATUS;
                    usr.USR_RETURNREASON = nUser.USR_RETURNREASON;
                }

                usr.USR_UPDATED = DateTime.Now;
                usr.USR_UPDATEDBY = UserManager.Instance.User.Code;

            }
            else
            {
                usr = new TMUSERS
                {
                    USR_CODE = nUser.USR_CODE,
                    USR_PASSWORD = PasswordHelper.Md5Encrypt(UniqueStringId.Generate()),
                    USR_ORG = "GUNDEMIR",
                    USR_DEPARTMENT = "OPERASYON",
                    USR_AUTHORIZEDDEPARTMENTS = "OPERASYON",
                    USR_TYPE = "SUPPLIER",
                    USR_LANG = "TR",
                    USR_DESC = nUser.USR_DESC,
                    USR_GROUP = nUser.USR_GROUP,
                    USR_TRADE = nUser.USR_TRADE,
                    USR_EMAIL = nUser.USR_EMAIL,
                    USR_HOMETELEPHONENUMBER = nUser.USR_HOMETELEPHONENUMBER,
                    USR_PHONENUMBER = nUser.USR_PHONENUMBER,
                    USR_STARTDATE = nUser.USR_STARTDATE,
                    USR_ENDDATE = nUser.USR_ENDDATE,
                    USR_SHOESIZE = nUser.USR_SHOESIZE,
                    USR_TSHIRTSIZE = nUser.USR_TSHIRTSIZE,
                    USR_PANTSIZE = nUser.USR_PANTSIZE,
                    USR_POLARSIZE = nUser.USR_POLARSIZE,
                    USR_EDUCATIONSTATUS = nUser.USR_EDUCATIONSTATUS,
                    USR_LASTGRADUATEDSCHOOL = nUser.USR_LASTGRADUATEDSCHOOL,
                    USR_LASTGRADUATEDDEPARTMENT = nUser.USR_LASTGRADUATEDDEPARTMENT,
                    USR_LASTGRADUATEDDATE = nUser.USR_LASTGRADUATEDDATE,
                    USR_GENDER = nUser.USR_GENDER,
                    USR_BIRTHDATE = nUser.USR_BIRTHDATE,
                    USR_TCNUMBER = nUser.USR_TCNUMBER,
                    USR_DRIVINGLICENSE = nUser.USR_DRIVINGLICENSE,
                    USR_DRIVINGLICENSECLASS = nUser.USR_DRIVINGLICENSECLASS,
                    USR_LICENSEISSUEDATE = nUser.USR_LICENSEISSUEDATE,
                    USR_DUTY = nUser.USR_DUTY,
                    USR_LEAVINGREASON = nUser.USR_LEAVINGREASON,
                    USR_CREATED = DateTime.Now,
                    USR_CREATEDBY = UserManager.Instance.User.Code
                };
                if (string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                {
                    usr.USR_ACTIVE = (nUser.USR_APPSTATUS == "ONAYLANDI") ? '+' : '-';
                    usr.USR_TMS = (nUser.USR_APPSTATUS == "ONAYLANDI" && nUser.USR_GROUP == "T1") ? '+' : '-';
                    usr.USR_INTA = (nUser.USR_APPSTATUS == "ONAYLANDI") ? '+' : '-';
                    usr.USR_MOBILE = (nUser.USR_APPSTATUS == "ONAYLANDI" && nUser.USR_GROUP == "T2") ? '+' : '-';
                    usr.USR_APPSTATUS = nUser.USR_APPSTATUS;
                    usr.USR_RETURNREASON = nUser.USR_RETURNREASON;
                    usr.USR_SUPPLIER = nUser.USR_SUPPLIER;
                }
                else
                {
                    usr.USR_SUPPLIER = UserManager.Instance.User.Supplier;
                    usr.USR_ACTIVE = '-';
                    usr.USR_TMS = '-';
                    usr.USR_INTA = '-';
                    usr.USR_MOBILE = '-';
                    usr.USR_APPSTATUS = "YENIKAYIT";
                    usr.USR_RETURNREASON = null;

                }
                usr.USR_RECORDVERSION = 0;
            }


            repositoryUsers.SaveOrUpdate(usr, false);

            //repositoryUsers.SystemCheck();

            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10005", UserManager.Instance.User.Language), r = BuildUserJSon(nUser) });
        }


        [HttpPost]
        [Transaction]
        public string SaveUserInformation(TMUSERS pUser)
        {
            var nUser = repositoryUsers.Get(pUser.USR_CODE);
            
            nUser.USR_REGISTRATIONNUMBER = pUser.USR_REGISTRATIONNUMBER;
            nUser.USR_TITLE = pUser.USR_TITLE;
            nUser.USR_TCNUMBER = pUser.USR_TCNUMBER;
            nUser.USR_FUSENUMBER = pUser.USR_FUSENUMBER;
            nUser.USR_GENDER = pUser.USR_GENDER;
            nUser.USR_MARITALSTATUS = pUser.USR_MARITALSTATUS;
            nUser.USR_BIRTHDATE = pUser.USR_BIRTHDATE;
            nUser.USR_PLACEOFBIRTH = pUser.USR_PLACEOFBIRTH;
            nUser.USR_BLOODGROUP = pUser.USR_BLOODGROUP;
            nUser.USR_EDUCATIONSTATUS = pUser.USR_EDUCATIONSTATUS;
            nUser.USR_LASTGRADUATEDSCHOOL = pUser.USR_LASTGRADUATEDSCHOOL;
            nUser.USR_LASTGRADUATEDDEPARTMENT = pUser.USR_LASTGRADUATEDDEPARTMENT;
            nUser.USR_LASTGRADUATEDDATE = pUser.USR_LASTGRADUATEDDATE;
            nUser.USR_MILITARYSERVICE = pUser.USR_MILITARYSERVICE;
            nUser.USR_EMERGENCYCONTACTNAME = pUser.USR_EMERGENCYCONTACTNAME;
            nUser.USR_EMERGENCYCONTACTAFFINITY = pUser.USR_EMERGENCYCONTACTAFFINITY;
            nUser.USR_EMERGENCYCONTACTPHONENUMBER = pUser.USR_EMERGENCYCONTACTPHONENUMBER;
            nUser.USR_PHONENUMBER = pUser.USR_PHONENUMBER;
            nUser.USR_HOMETELEPHONENUMBER = pUser.USR_HOMETELEPHONENUMBER;
            nUser.USR_OFFICENUMBER = pUser.USR_OFFICENUMBER;
            nUser.USR_PERSONALEMAIL = pUser.USR_PERSONALEMAIL;
            nUser.USR_FULLADDRESS = pUser.USR_FULLADDRESS;
            nUser.USR_SHOESIZE = pUser.USR_SHOESIZE;
            nUser.USR_TSHIRTSIZE = pUser.USR_TSHIRTSIZE;
            nUser.USR_PANTSIZE = pUser.USR_PANTSIZE;
            nUser.USR_POLARSIZE = pUser.USR_POLARSIZE;
            nUser.USR_DRIVINGLICENSE = pUser.USR_DRIVINGLICENSE;
            nUser.USR_DRIVINGLICENSECLASS = pUser.USR_DRIVINGLICENSECLASS;
            nUser.USR_LICENSEISSUEDATE = pUser.USR_LICENSEISSUEDATE;
            nUser.USR_UPDATED = DateTime.Now;
            nUser.USR_UPDATEDBY = UserManager.Instance.User.Code;

            repositoryUsers.SaveOrUpdate(nUser,true);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10015", UserManager.Instance.User.Language), r = nUser });
        }

        [HttpPost]
        [Transaction]
        public string NewPassword(TMUSERS nUser)
        {
            var usr = repositoryUsers.Get(nUser.USR_CODE);
            usr.USR_PASSWORD = PasswordHelper.Md5Encrypt(nUser.USR_PASSWORD);
            usr.USR_UPDATED = nUser.USR_UPDATED;
            usr.USR_UPDATEDBY = nUser.USR_UPDATEDBY;
            repositoryUsers.SaveOrUpdate(usr,true);

            if (nUser.USR_CODE == UserManager.Instance.User.Code)
            {
                var httpCookie = HttpContext.Current.Response.Cookies["culture"];
                if (httpCookie != null)
                {
                    httpCookie.Value = new RepositoryLangs().Get(usr.USR_LANG).LNG_CULTURE;
                }
                else
                {
                    HttpContext.Current.Response.Cookies.Add(new HttpCookie("culture", new RepositoryLangs().Get(usr.USR_LANG).LNG_CULTURE));
                }
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10308", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        [Transaction]
        public string UpdateProfilePic(TMUSERS nUser)
        {
            var userpic = UserService.GetProfilePhoto(nUser.USR_CODE);
            if (userpic != null)
            {

                var rdoc = new RepositoryDocuments();
                rdoc.DeleteDocument(nUser.USR_CODE, "USER", "PROFILEPIC");
                rdoc.SaveOrUpdate(new TMDOCSMETA
                {
                    DOC_CONTENTTYPE = "image/jpeg",
                    DOC_CREATED = DateTime.Now,
                    DOC_CREATEDBY = nUser.USR_CODE,
                    DOC_GUID = UniqueStringId.Generate(),
                    DOC_OFN = nUser.USR_CODE,
                    DOC_SOURCE = nUser.USR_CODE,
                    DOC_SUBJECT = "USER",
                    DOC_SIZE = userpic.Length,
                    DOC_TYPE = "PROFILEPIC"
                });

                var filepath = string.Format("{0}\\{1}\\{2}\\{3}", string.Format("TMSCONTENTS_{0}", DateTime.Now.Year.ToString()), "USER", nUser.USR_CODE, "userphoto.jpg");
                FileHelper.CreateFile(filepath, true, userpic);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("12000", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var usr = repositoryUsers.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = BuildUserJSon(usr) });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUsersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] string id)
        {

            var usr = repositoryUsers.Get(id);
            repositoryUsers.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10006", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string SendForApproval([FromBody] string id)
        {
            var user = repositoryUsers.Get(id);
            user.USR_APPSTATUS = "ONAYBEKLIYOR";
            repositoryUsers.SaveOrUpdate(user,true);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10678", UserManager.Instance.User.Language)
            });
        }
    }
}