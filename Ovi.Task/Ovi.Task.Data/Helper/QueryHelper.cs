using System.Linq;
using System.Text.RegularExpressions;

namespace Ovi.Task.Data.Helper
{
    public static class QueryHelper
    {
        public static bool CheckIfSelectQuery(string query)
        {
            var notallowedkeyword = new string[]
                {
                    "INSERT",
                    "UPDATE",
                    "DELETE",
                    "RENAME",
                    "DROP",
                    "CREATE",
                    "TRUNCATE",
                    "ALTER",
                    "COMMIT",
                    "ROLLBACK",
                    "MERGE",
                    "CALL",
                    "EXPLAIN",
                    "LOCK",
                    "GRANT",
                    "REVOKE",
                    "SAVEPOINT",
                    "TRANSACTION",
                    "SET",
                };
            var disAllow = string.Join("|", notallowedkeyword.Select(item => item));
            return string.IsNullOrEmpty(Regex.Match(query.ToUpper(), "(" + disAllow + ")").Value);
        }
    }
}