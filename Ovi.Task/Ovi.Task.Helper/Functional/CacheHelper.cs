using LazyCache;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Ovi.Task.Helper.Functional
{
    public sealed class CacheHelper
    {
        private static readonly object syncRoot = new object();
        private static IAppCache cache = new CachingService();
        private object _lock = new object();

        public static CacheHelper Instance
        {
            get
            {
                if (Nested.CacheHelper == null)
                {
                    lock (syncRoot)
                    {
                        if (Nested.CacheHelper == null)
                        {
                            Nested.CacheHelper = new CacheHelper();
                        }
                    }
                }
                return Nested.CacheHelper;
            }
        }

        private class Nested
        {
            internal static CacheHelper CacheHelper;
        }

        public void Save2Cache(string cacheKey, object savedItem, DateTime absoluteExpiration)
        {
            lock(_lock)
            {
                var co = cache.Get<object>(cacheKey);
                if (co == null)
                    cache.Add(cacheKey, savedItem, absoluteExpiration);
            }

        }

        public T GetFromCache<T>(string cacheKey) where T : class
        {
            lock (_lock)
            {
                var result = cache.Get<object>(cacheKey) as T;
                return result;
            }
        }

        public void RemoveFromCache(string cacheKey)
        {
            lock (_lock)
            {
                cache.Remove(cacheKey);
            }
        }

        public bool IsInCache(string cacheKey)
        {
            lock (_lock) { 
                var result = cache.Get<object>(cacheKey) != null;
                return result;
            }
        }
    }
}