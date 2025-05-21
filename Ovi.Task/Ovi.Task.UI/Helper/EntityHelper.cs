
using Ovi.Task.Data.Repositories;

namespace Ovi.Task.UI.Helper
{
    public class EntityHelper
    {
        public bool CheckEntity(string entity, string value)
        {
            switch (entity)
            {
                case "USER":
                    {
                        var repositoryUsers = new RepositoryUsers();
                        var user = repositoryUsers.Get(value);
                        return (user != null && user.USR_ACTIVE == '+');
                    }
                case "DEPARTMENT":
                    {
                        var repositoryDepartments = new RepositoryDepartments();
                        var department = repositoryDepartments.Get(value);
                        return (department != null && department.DEP_ACTIVE == "+");
                    }
                case "ORGANIZATION":
                    {
                        var repositoryOrgs = new RepositoryOrgs();
                        var organization = repositoryOrgs.Get(value);
                        return (organization != null && organization.ORG_ACTIVE == '+');
                    }
                case "TRADE":
                    {
                        var repositoryTrades = new RepositoryTrades();
                        var trade = repositoryTrades.Get(value);
                        return (trade != null && trade.TRD_ACTIVE == '+');
                    }
                default:
                    return false;
            }
        }
    }
}