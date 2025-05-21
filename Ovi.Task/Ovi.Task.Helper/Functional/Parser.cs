using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Helper.Functional
{
    public class Parser
    {
        public static bool ParseDecimal(string str, out decimal result)
        {
            var strNumber = str.Replace(',', '.');
            var isDecimal = decimal.TryParse(strNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out result);
            return isDecimal;
        }

        public static bool ParseInt(string str, out int result)
        {
            var strNumber = str.Replace(',', '.');
            var isInt = int.TryParse(strNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out result);
            return isInt;
        }

        public static bool ParseLong(string str, out long result)
        {
            var strNumber = str.Replace(',', '.');
            var isLong = long.TryParse(strNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out result);
            return isLong;
        }

        public static bool ParseChar(string str, out char result)
        {
            var isChar = char.TryParse(str, out result);
            return isChar;
        }
    }
}
