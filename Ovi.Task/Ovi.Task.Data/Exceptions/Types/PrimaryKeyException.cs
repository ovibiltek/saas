using System;

namespace Ovi.Task.Data.Exceptions.Types
{
    public class PrimaryKeyException : Exception
    {
        public PrimaryKeyException(string message) : base(message)
        {
        }
    }
}