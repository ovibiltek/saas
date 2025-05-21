using System;
using System.Collections.Generic;
using file = System.IO.File;
using System.IO;
using Newtonsoft.Json;

namespace Ovi.Task.UI.Helper
{
    public static class ConfigHelper
    {
        private static Dictionary<string, string> _configValues;

        /// <summary>
        /// Verilen anahtar (key) için yapılandırma dosyasından değeri döndürür.
        /// </summary>
        /// <param name="key">Konfigürasyon dosyasındaki anahtar (key) adı</param>
        /// <returns>Anahtar mevcutsa değeri, değilse "-" döner</returns>
        public static string Get(string key)
        {
            if (_configValues == null)
            {
                LoadConfiguration();
            }

            if (_configValues == null || !_configValues.ContainsKey(key))
            {
                return "-";
            }

            return _configValues[key];
        }

        /// <summary>
        /// Konfigürasyon dosyasını (config.json) yükler ve bir sözlük (dictionary) olarak bellekte tutar.
        /// </summary>
        private static void LoadConfiguration()
        {
            try
            {
                string configFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "config.json");

                if (!file.Exists(configFilePath))
                {
                    _configValues = new Dictionary<string, string>();
                    return;
                }

                var jsonContent = file.ReadAllText(configFilePath);
                _configValues = JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonContent);
            }
            catch (Exception ex)
            {
                // Hata oluşursa boş bir sözlük oluşturur.
                Console.WriteLine("Konfigürasyon dosyası yüklenirken hata oluştu: " + ex.Message);
                _configValues = new Dictionary<string, string>();
            }
        }
    }
}