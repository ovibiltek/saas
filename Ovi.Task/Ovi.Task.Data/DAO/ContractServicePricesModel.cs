using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.DAO
{
    public class ContractServicePricesModel
    {
        public TMCONTRACTSERVICEPRICES ContractServicePrice { get; set; }

        public string[] Values { get; set; }
    }
}
