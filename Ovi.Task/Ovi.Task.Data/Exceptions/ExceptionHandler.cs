using System;

namespace Ovi.Task.Data.Exceptions
{
    public class ExceptionHandler
    {
        public static Exception Process(Exception e)
        {
            return ExceptionParser.Parse(e);
        }
    }
}