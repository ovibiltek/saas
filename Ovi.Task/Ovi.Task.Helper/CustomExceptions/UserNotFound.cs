using System;

namespace Ovi.Task.Helper.CustomExceptions
{
    public class UserNotFound : Exception
    {
        public UserNotFound(string message) : base(message)
        {
        }
    }
}