using System;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.DAO
{
    public class TaskModel
    {
        public TMTASKS Task { get; set; }

        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }

        public TMCOMMENTS[] Comments { get; set; }

        public string Trade { get; set; }

        public string[] Values { get; set; }

        public TMSERVICECODES ServiceCode { get; set; }

        public DateTime? ActivePlanningDate { get; set; }


    }
}