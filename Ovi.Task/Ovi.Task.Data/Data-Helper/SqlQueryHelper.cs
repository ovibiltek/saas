using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Data_Helper
{
    public class SqlQueryHelper
    {
        public static string SecureSql(string sql)
        {
            return sql.Replace("CREATE ", "X")
                .Replace("DELETE ", "X")
                .Replace("TRUNCATE ", "X")
                .Replace("INSERT ", "X")
                .Replace("UPDATE ", "X")
                .Replace("DROP ", "X")
                .Replace("ALTER ", "X");
        }
    }
}
