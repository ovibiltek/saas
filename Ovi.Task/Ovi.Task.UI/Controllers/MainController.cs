using NPOI.SS.Formula.Functions;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using Ovi.Task.UI.Models;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class MainController : BaseController
    {
        public ActionResult Index(string id)
        {

            var model = new MainModel();
            var repositoryParameters = new RepositoryParameters();
            var prm = repositoryParameters.Get("YEARS");
            if (prm != null) model.years = prm.PRM_VALUE;
            return UserManager.Instance.User.Customer != null ? View("Customer", model) : View(model);
        }

        public ActionResult Dashboard()
        {
            var model = new MainModel();

            var repositoryParameters = new RepositoryParameters();
            var prm = repositoryParameters.Get("YEARS");
            if (prm != null)
                model.years = prm.PRM_VALUE;
            return UserManager.Instance.User.Customer != null ? View("Customer", model) : View(model);
        }

        public ActionResult Customer()
        {
            var model = new MainModel();
            var repositoryParameters = new RepositoryParameters();
            var prm = repositoryParameters.Get("YEARS");
            if (prm != null) model.years = prm.PRM_VALUE;
            return View(model);
        }
    }
}