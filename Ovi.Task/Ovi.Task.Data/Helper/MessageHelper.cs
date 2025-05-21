using Ovi.Task.Data.Repositories;

namespace Ovi.Task.Data.Helper
{
    public class MessageHelper
    {
        public static string Get(string code, string language)
        {
            var repositoryMessages = new RepositoryMessages();
            var msg = repositoryMessages.Get(code, language);
            return msg != null ? msg.MSG_TEXT : string.Empty;
        }

        public static string GetNonSpecificErrMsg(string language)
        {
            return Get("10000", language);
        }
    }
}