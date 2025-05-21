using Ovi.Task.Helper.User;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;

namespace Ovi.Task.Helper.Functional
{
    public class LDAPHelper
    {
        private readonly string _ldapDir;
        private readonly string _ldapadmin;
        private readonly string _ldapadminpass;

        private string _ldapPath { get; set; }

        public LDAPHelper(string ldapPath, string ldapDir, string ldapadmin, string ldapadminpass)
        {
            _ldapDir = ldapDir;
            _ldapadmin = ldapadmin;
            _ldapadminpass = ldapadminpass;
            _ldapPath = ldapPath;
        }

        public bool IsAuthenticated(DomainUser user)
        {
            var fullName = string.Format("{0}\\{1}", user.Domain, user.User);
            var fullNameAdmin = string.Format("{0}\\{1}", user.Domain, _ldapadmin);
            using (var context = new PrincipalContext(ContextType.Domain, user.Domain, fullNameAdmin, _ldapadminpass))
            {
                return context.ValidateCredentials(user.User, user.Password);
            }
        }

        public byte[] GetUserPhotoFromLdap(string user)
        {
            using (var entry = new DirectoryEntry(string.Format("LDAP://{0}", _ldapPath), _ldapadmin, _ldapadminpass, AuthenticationTypes.Secure))
            {
                var ds = new DirectorySearcher(entry)
                {
                    SearchScope = SearchScope.Subtree,
                    Filter = string.Format("(&(objectClass=user)(objectCategory=person)(|(SAMAccountName=*{0}*)(cn=*{0}*)(gn=*{0}*)(sn=*{0}*)))", user)
                };

                var result = ds.FindOne();
                if (result == null)
                {
                    return null;
                }

                using (var de = new DirectoryEntry(result.Path))
                {
                    var photo = de.Properties["thumbnailPhoto"].Value as byte[];
                    return photo;
                }
            }
        }
    }
}