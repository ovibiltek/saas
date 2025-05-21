using System;

namespace Ovi.Task.Data.Exceptions.Types
{
    public class TmsException : Exception
    {
        public TmsException(string message) : base(message)
        {
        }

        public TmsException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}