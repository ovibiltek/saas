using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Text;
using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Invoice;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Helper.Integration.Mikro.DAO;

namespace Ovi.Task.UI.Helper.Integration.Mikro
{
    public class InvoiceHelper
    {
        private RepositoryCustomers repositoryCustomers;
        private RepositorySuppliers repositorySuppliers;
        private RepositoryInvoices repositoryInvoices;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private RepositoryTasks repositoryTasks;
        private RepositoryCategories repositoryCategories;

        private Siparis siparis = null;
        private TokenHelper tokenHelper = null;


        public InvoiceHelper()
        {
            repositorySuppliers = new RepositorySuppliers();
            repositoryCustomers = new RepositoryCustomers();
            repositoryInvoices = new RepositoryInvoices();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryTasks = new RepositoryTasks();
            repositoryCategories = new RepositoryCategories();
            tokenHelper = new TokenHelper();
        }

        public MikroResultExt Transfer(TMINVOICES invoice)
        {

            var postString = GetMikroStr(invoice);
            var url = ConfigurationManager.AppSettings["mikro_url"] + "/siparis/satinalma";

            try
            {
                var token = tokenHelper.GetToken();
                if (token == null)
                {
                    throw new TmsException("Mikro : Servis yetkilendirmesi başarısız!");
                }
                else
                {
                    if (!token.isSuccess)
                        throw new TmsException(token.Message);
                }
                var responseString = "";
                var request = WebRequest.Create(url);
                var byteData = Encoding.UTF8.GetBytes(postString);
                request.ContentType = "application/json; charset=utf-8";
                request.Method = "POST";
                request.Timeout = 300000;
                request.Headers.Add("token", token.Data);

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteData, 0, byteData.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseStream = response.GetResponseStream();
                if (responseStream != null)
                {
                    responseString = new StreamReader(responseStream).ReadToEnd();
                }

                return new MikroResultExt
                {
                    Result = JsonConvert.DeserializeObject<MikroResult>(responseString),
                    Token = token,
                    PostData = postString
                };

            }
            catch (Exception exc)
            {
                throw new TmsException(string.Format("Url:{0}, Post Data:{1}, Message:{2}", url, postString, exc.Message));
            }
        }

        public string GetMikroStr(TMINVOICES invoice)
        {
            return SatinAlmaSiparis(invoice);
        }

        public string SatinAlmaSiparis(TMINVOICES invoice)
        {

            var supplier = repositorySuppliers.Get(invoice.INV_SUPPLIER);

            if (string.IsNullOrEmpty(invoice.INV_ORDERNODESC))
                throw new TmsException(MessageHelper.Get("PRO10025", UserManager.Instance.User.Language));
            if (invoice.INV_ORDERNODESC.Count(c => c == '-') != 1)
                throw new TmsException(MessageHelper.Get("PRO10026", UserManager.Instance.User.Language));
            if (!invoice.INV_INVOICEDATE.HasValue)
                throw new TmsException(MessageHelper.Get("20219", UserManager.Instance.User.Language));
            if (string.IsNullOrEmpty(invoice.INV_INVOICE))
                throw new TmsException(MessageHelper.Get("20219", UserManager.Instance.User.Language));
            if (string.IsNullOrEmpty(supplier.SUP_ACCOUNTCODE))
                throw new TmsException(MessageHelper.Get("PRO10027", UserManager.Instance.User.Language));

            var serisira = invoice.INV_ORDERNODESC.Split('-');
            var seri = serisira[0];
            var sira = serisira[1];

            var lines = repositoryInvoices.ListMikroLines(new GridRequest
            {
                loadall = true,
                filter = new GridFilters
                {
                    Filters = new List<GridFilter>()
                    {
                        new GridFilter
                        {
                            Field = "INV_CODE",
                            Value = invoice.INV_CODE,
                            Operator = "eq"
                        }
                    }
                }
            });
            var siparisDetayList = lines
                .Select(sd => new SiparisDetay
                {
                    Adet = 1,
                    BirimFiyat = sd.INV_TOTAL.Value,
                    IskontoTutari = 0,
                    StokTipi = 2,
                    StokKodu = StokKodu(sd),
                    ProjeKodu = ProjeKodu(sd),
                    SorumlulukMerkezi = SorumlulukMerkezi(sd),
                }).ToList();


            siparis = new
                Siparis
                {
                    AdresNo = "1",
                    CariKodu = supplier.SUP_ACCOUNTCODE,
                    DepoNo = "1",
                    Seri = seri,
                    Sira = sira,
                    SiparisNo = invoice.INV_CODE.ToString(),
                    Tarih = invoice.INV_INVOICEDATE.Value.ToString(OviShared.ShortDate2,CultureInfo.InvariantCulture),
                    BelgeNo = invoice.INV_INVOICE,
                    Detay = siparisDetayList
            };

            return JsonConvert.SerializeObject(siparis);
        }

        private string StokKodu(TMMIKROINVLINESVIEW line)
        {
            if (line.INV_TSKDEPARTMENT == "TEKNIKISLETME")
                return "HK400";
            
            switch (line.INV_TSKCATEGORY)
            {
                case "PROJELI-ISLER":
                    return "HK300";
                case "YGS":
                    return "HK500";
                default:
                {
                    switch (line.INV_TSKCATEGORYGROUP)
                    {
                        case "ARIZA":
                            return "HK200";
                        case "BAKIM":
                            return "HK100";
                    }

                    break;
                }
            }

            throw new TmsException(string.Format(MessageHelper.Get("PRO10028", UserManager.Instance.User.Language), line.INV_TSKCATEGORY));

        }


        //SM001     MÜŞTERİ YÖNETİMİ VE OPERASYON
        //SM002     PROJELİ İŞLER
        //SM003     TİCARİ BİNA VE END.TESİSLER
        //SM004     SATIŞ PAZARLAMA
        //SM005     SATINALMA
        //SM006     MALİ VE İDARİ İŞLER
        //SM007     PLATFORM
        private string SorumlulukMerkezi(TMMIKROINVLINESVIEW line)
        {

            if (line.INV_TSKCATEGORY == "PROJELI-ISLER")
                return "SM002";

            switch (line.INV_TSKDEPARTMENT)
            {
                case "MUSTERIYONETIMI":
                case "OPERASYON":
                    return "SM001";
                case "TICARI.BINA.ENDUSTRIYEL.TESISLER":
                    return "SM003";
                case "SATIS-PAZARLAMA":
                    return "SM004";
                case "IDARIISLER":
                    return "SM006";
            }

            return string.Empty;
        }

        private string ProjeKodu(TMMIKROINVLINESVIEW line)
        {

            if (string.IsNullOrEmpty(line.INV_MMIKRO))
                throw new TmsException(MessageHelper.Get("PRO10024", UserManager.Instance.User.Language));
            return line.INV_MMIKRO;

        }
    }

}