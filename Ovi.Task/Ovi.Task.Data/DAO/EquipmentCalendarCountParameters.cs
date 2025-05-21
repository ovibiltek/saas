using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.DAO
{
    public class EquipmentCalendarCountParameters
    {
        public string Customer { get; set; }
        public string Branch { get; set; }
        public string EquipmentType { get; set; }
        public int? Equipment { get; set; }
        public int Year { get; set; }
    }
}
