using System;

namespace Ovi.Task.Data.DAO
{
    public class GENERATEPERIODICTASKSPARAMS
    {
        public string PeriodicTask { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public char Generate { get; set; }
    }
}