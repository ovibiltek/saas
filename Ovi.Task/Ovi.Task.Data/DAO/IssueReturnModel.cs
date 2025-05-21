using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.DAO
{
    public class IssueReturnModel
    {
        public TMPARTTRANS Transaction { get; set; }

        public TMPARTTRANLINES[] TransactionLines { get; set; }

        public string[] Values { get; set; }

    }
}
