using System;
using System.Globalization;
using TB.ComponentModel;

namespace Ovi.Task.Helper.Shared
{
    public static class OviShared
    {
        public const string ShortDate = "dd-MM-yyyy";
        public const string LongDate = "dd-MM-yyyy HH:mm:ss";
        public const string ShortTime = "HH:mm";
        public const string SqlDate = "yyyyMMdd";
        public const string ShortDate2 = "MM/dd/yyyy";

        public static string[] DateStyles = new string[] { "dd-MM-yyyy", "dd-MM-yyyy HH:mm:ss", "dd.MM.yyyy", "dd.MM.yyyy HH:mm:ss" };

        public static DateTime? GetNullableDateTimeFromString(string dt)
        {
            var isDateTime = DateTime.TryParseExact(dt, DateStyles, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result);
            return isDateTime ? (DateTime?)result : null;
        }
        public static DateTime? GetDateTimeFromString(string dt)
        {
            if (UniversalTypeConverter.CanConvertTo<DateTime>(dt))
            {
                return UniversalTypeConverter.ConvertTo<DateTime>(dt);
            }

            return null;
        }

        public static string DateTime2StringWithOffset(DateTime dt)
        {
            int hours = TimeZoneInfo.Local.BaseUtcOffset.Hours;
            string offset = string.Format("{0}{1}", ((hours > 0) ? "+" : ""), hours.ToString("00"));
            string dtString = dt.ToString("s") + offset;
            return dtString;
        }

        public static DateTime Truncate(this DateTime dateTime, TimeSpan timeSpan)
        {
            if (timeSpan == TimeSpan.Zero) return dateTime; // Or could throw an ArgumentException
            if (dateTime == DateTime.MinValue || dateTime == DateTime.MaxValue) return dateTime; // do not modify "guard" values
            return dateTime.AddTicks(-(dateTime.Ticks % timeSpan.Ticks));
        }
    }
}