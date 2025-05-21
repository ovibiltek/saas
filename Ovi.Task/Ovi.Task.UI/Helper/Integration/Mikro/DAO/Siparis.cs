using System.Collections.Generic;

namespace Ovi.Task.UI.Helper.Integration.Mikro.DAO
{
    public class Siparis
    {
        public string Seri { get; set; }
        public string Sira { get; set; }
        public string CariKodu { get; set; }
        public string SiparisNo { get; set; }
        public string AdresNo { get; set; }
        public string Tarih { get; set; }
        public string Aciklama { get; set; }
        public string DepoNo { get; set; }
        public string BelgeNo { get; set; }
        public List<SiparisDetay> Detay { get; set; }

    }
}
