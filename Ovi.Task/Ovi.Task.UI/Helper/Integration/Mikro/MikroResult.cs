using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper.Integration.Mikro
{
    public class MikroResult
    {
        public string Message { get; set; }
        public bool isSuccess { get; set; }
        public string Data { get; set; }
    }

    public class MikroResultExt
    {
        public MikroResult Result { get; set; }
       
        public MikroResult Token { get; set; }

        public string PostData { get; set; }

    }
}