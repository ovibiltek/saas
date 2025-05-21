using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper.Reports
{
    public class BTC
    {
        public DataTable BTCParameters(BTCParameters p)
        {
            var dtParameters = new DataTable("PARAMETERS");

            dtParameters.Columns.AddRange(new[]
            {
                new DataColumn("CUSTOMER"),
                new DataColumn("CREATED"),
                new DataColumn("REPORTEDAT", typeof(DateTime)),
                new DataColumn("REPORTEDBY")
             
            });

            var parametersRow = dtParameters.NewRow();
            parametersRow["CUSTOMER"] = p.Customer;
            parametersRow["CREATED"] = (p.TaskCreatedStart.HasValue ? p.TaskCreatedStart.Value.ToString("dd.MM.yyyy") : "") + " - " + (p.TaskCreatedEnd.HasValue ? p.TaskCreatedEnd.Value.ToString("dd.MM.yyyy") : "");
            parametersRow["REPORTEDAT"] = DateTime.Now;
            parametersRow["REPORTEDBY"] = UserManager.Instance.User.Description;

            dtParameters.Rows.Add(parametersRow);
            return dtParameters;
        }

        public DataTable BTCLines(BTCParameters p)
        {
            RepositoryBranches repositoryBranches = new RepositoryBranches();
            var lines = repositoryBranches.ListBranchTaskCounts(p.Customer,p.TaskCreatedStart,p.TaskCreatedEnd);
            if (p.Customer == "MIGROS")
            {
                var migrosBranchOrderList = repositoryBranches.GetMigrosBranchOrders();
                lines = lines.OrderBy(lineList => migrosBranchOrderList
               .FirstOrDefault(orderList => orderList.BussinessType == lineList.BTC_BUSINESSTYPE)?.Order ?? int.MaxValue).ToList();
            }
            var dtLines = new DataTable("LINES");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("BRANCH",typeof(string)),
                new DataColumn("CUSTOMER",typeof(string)),
                new DataColumn("REFERENCE",typeof(string)),
                new DataColumn("DESC",typeof(string)),
                new DataColumn("BUSINESSTYPE",typeof(string)),
                new DataColumn("REGION",typeof(string)),
                new DataColumn("ADSDESC",typeof(string)),
                new DataColumn("BRANCHACTIVE"),
                new DataColumn("BILGICOUNT",typeof(int)),
                new DataColumn("UZAKCOUNT",typeof(int)),
                new DataColumn("DISACIKCOUNT",typeof(int)),
                new DataColumn("DISTAMAMCOUNT",typeof(int)),
                new DataColumn("DENETLEMECOUNT",typeof(int)),
                new DataColumn("DENETLEMETAMAMCOUNT",typeof(int)),
                new DataColumn("UYGULAMAACIKCOUNT",typeof(int)),
                new DataColumn("UYGULAMATAMAMCOUNT",typeof(int)),
                new DataColumn("LOJISTIKTAMAMCOUNT",typeof(int)),
                new DataColumn("LOJISTIKACIKCOUNT",typeof(int)),
                new DataColumn("BAKIMACIKCOUNT",typeof(int)),
                new DataColumn("BAKIMTAMAMCOUNT",typeof(int)),
                new DataColumn("MONTAJACIKCOUNT",typeof(int)),
                new DataColumn("MONTAJTAMAMCOUNT",typeof(int)),
                new DataColumn("ARIZAACIKCOUNT",typeof(int)),
                new DataColumn("ARIZATAMAMCOUNT",typeof(int)),
            });

           

            foreach (var d in lines)
            {
                var section1Row = dtLines.NewRow();
                section1Row["BRANCH"] = d.BTC_BRANCH;
                section1Row["DESC"] = d.BTC_DESC;
                section1Row["CUSTOMER"] = d.BTC_CUSTOMER;
                section1Row["REFERENCE"] = d.BTC_REFERENCE;
                section1Row["BUSINESSTYPE"] = d.BTC_BUSINESSTYPE;
                section1Row["REGION"] = d.BTC_REGION;
                section1Row["ADSDESC"] = d.BTC_ADSDESC;
                section1Row["BRANCHACTIVE"] = d.BTC_BRANCHACTIVE;
                section1Row["BILGICOUNT"] = d.BTC_BILGICOUNT;
                section1Row["UZAKCOUNT"] = d.BTC_UZAKCOUNT;
                section1Row["DISACIKCOUNT"] = d.BTC_DISACIKCOUNT;
                section1Row["DISTAMAMCOUNT"] = d.BTC_DISTAMAMCOUNT;
                section1Row["DENETLEMECOUNT"] = d.BTC_DENETLEMECOUNT;
                section1Row["DENETLEMETAMAMCOUNT"] = d.BTC_DENETLEMETAMAMCOUNT;
                section1Row["UYGULAMAACIKCOUNT"] = d.BTC_UYGULAMAACIKCOUNT;
                section1Row["UYGULAMATAMAMCOUNT"] = d.BTC_UYGULAMATAMAMCOUNT;
                section1Row["LOJISTIKTAMAMCOUNT"] = d.BTC_LOJISTIKTAMAMCOUNT;
                section1Row["LOJISTIKACIKCOUNT"] = d.BTC_LOJISTIKACIKCOUNT;
                section1Row["BAKIMACIKCOUNT"] = d.BTC_BAKIMACIKCOUNT;
                section1Row["BAKIMTAMAMCOUNT"] = d.BTC_BAKIMTAMAMCOUNT;
                section1Row["MONTAJACIKCOUNT"] = d.BTC_MONTAJACIKCOUNT;
                section1Row["MONTAJTAMAMCOUNT"] = d.BTC_MONTAJTAMAMCOUNT;
                section1Row["ARIZAACIKCOUNT"] = d.BTC_ARIZAACIKCOUNT;
                section1Row["ARIZATAMAMCOUNT"] = d.BTC_ARIZATAMAMCOUNT;

                dtLines.Rows.Add(section1Row);
            }

            return dtLines;
        }

      


    }
}