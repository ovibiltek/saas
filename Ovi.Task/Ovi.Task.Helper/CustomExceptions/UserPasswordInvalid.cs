using System;

namespace Ovi.Task.Helper.CustomExceptions
{
    public class UserPasswordInvalid : Exception
    {
        public UserPasswordInvalid(string message) : base(message)
        {
        }
    }
}