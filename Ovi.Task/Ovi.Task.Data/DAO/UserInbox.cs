using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.DAO
{
    public class UserInbox
    {
        public string User { get; set; }

        public string InboxGroup { get; set; }

        public TMUSERINBOX[] Items { get; set; }
    }
}