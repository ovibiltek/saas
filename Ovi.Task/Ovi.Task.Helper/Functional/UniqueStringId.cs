using System;

namespace Ovi.Task.Helper.Functional
{
    public static class UniqueStringId
    {
        public static string Generate()
        {
            const string AllowedChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var rng = new Random();
            return RandomStrings(AllowedChars, 36, 36, 1, rng);
        }


        private static string RandomStrings(string allowedChars, int minLength, int maxLength, int count, Random rng)
        {
            var chars = new char[maxLength];
            var setLength = allowedChars.Length;
            var length = rng.Next(minLength, maxLength + 1);
            for (var i = 0; i < length; ++i)
            {
                chars[i] = allowedChars[rng.Next(setLength)];
            }

            return new string(chars, 0, length);
        }


    }
}