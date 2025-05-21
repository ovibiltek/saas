using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.DAO
{
    public class UserGridConfiguration
    {
        public TMUSERGRIDCONFIGURATION[] UserGridConfigurationList { get; set; }

        public string Grid { get; set; }

        public string User { get; set; }
    }
}