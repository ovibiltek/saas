using Ovi.Task.Helper.User;
using System.Runtime.Remoting.Messaging;
using System.Web;

namespace Ovi.Task.Data.Configuration
{
    public sealed class ContextUserHelper
    {
        private static readonly object syncRoot = new object();
        private readonly string USER_KEY = "User";

        public static ContextUserHelper Instance
        {
            get
            {
                if (Nested.ContextUserHelper == null)
                {
                    lock (syncRoot)
                    {
                        if (Nested.ContextUserHelper == null)
                        {
                            Nested.ContextUserHelper = new ContextUserHelper();
                        }
                    }
                }
                return Nested.ContextUserHelper;
            }
        }

        private ContextUserHelper()
        {
        }

        private class Nested
        {
            internal static ContextUserHelper ContextUserHelper;
        }

        public OviUser ContextUser
        {
            get
            {
                return IsInWebContext() ? WebUser : (OviUser)CallContext.GetData(USER_KEY);
            }
        }

        private OviUser WebUser
        {
            get
            {
                lock (syncRoot)
                {
                    if (HttpContext.Current.User.Identity.IsAuthenticated)
                    {
                        return ((OviPrincipal)(HttpContext.Current.User)).User;
                    }

                    if (HttpContext.Current.Items.Contains("User"))
                    {
                        return (OviUser)HttpContext.Current.Items["User"];
                    }
                }
                return null;
            }
        }

        private bool IsInWebContext()
        {
            return HttpContext.Current != null;
        }
    }
}