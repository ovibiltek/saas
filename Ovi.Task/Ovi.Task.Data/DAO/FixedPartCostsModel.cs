using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.DAO
{
    public class FixedPartCostsModel
    {
        public TMFIXEDPARTCOSTS FixedPartCosts { get; set; }

        public string[] Values { get; set; }
    }
}
