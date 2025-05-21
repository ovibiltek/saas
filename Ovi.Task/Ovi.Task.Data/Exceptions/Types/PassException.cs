using System;

namespace Ovi.Task.Data.Exceptions.Types
{
    public class PassException : Exception
    {
        public PassException(string message) : base(message)
        {
        }

        public PassException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}