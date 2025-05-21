using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.DAO
{
    public class ReviewModel
    {
        public TMTASKRATINGREVIEWS Review { get; set; }
       public string RatedBy { get; set; }
        public string Branch { get; set; }

        

    }
}
