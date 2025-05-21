using System.Globalization;

namespace Ovi.Task.Helper.Functional
{
    public class NumberHelper
    {
        public static bool ParseDecimal(string str, out decimal result)
        {
            var strNumber = str.Replace(',', '.');
            var isDecimal = decimal.TryParse(strNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out result);
            return isDecimal;
        }

        public static bool ParseDecimal(string str, int decimals, out decimal result)
        {
            var strNumber = str.Replace(',', '.');
            var isDecimal = decimal.TryParse(strNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out result);
            if (isDecimal)
                result = decimal.Round(result, decimals);

            return isDecimal;
        }

        public static bool ParseInt(string str, out int result)
        {
            var strNumber = str.Replace(',', '.');
            var isInt = int.TryParse(strNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out result);
            return isInt;
        }
    }
}
