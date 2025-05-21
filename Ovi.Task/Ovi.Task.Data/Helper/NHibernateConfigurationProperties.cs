namespace Ovi.Task.Data.Helper
{
    public class NHibernateConfigurationProperties
    {
        public static string cache_provider_class { get; set; }
        public static string cache_use_second_level_cache { get; set; }
        public static string cache_use_query_cache { get; set; }
        public static string current_session_context_class { get; set; }
        public static string command_timeout { get; set; }
    }
}
