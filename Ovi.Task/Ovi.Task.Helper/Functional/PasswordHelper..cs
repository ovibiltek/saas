using System.Security.Cryptography;
using System.Text;

namespace Ovi.Task.Helper.Functional
{
    public class PasswordHelper
    {
        public static string Md5Encrypt(string text)
        {
            var md5 = new MD5CryptoServiceProvider();
            var btr = Encoding.UTF8.GetBytes(text);
            btr = md5.ComputeHash(btr);
            var sb = new StringBuilder();
            foreach (var ba in btr)
            {
                sb.Append(ba.ToString("x2").ToLower());
            }
            return sb.ToString();
        }
    }
}