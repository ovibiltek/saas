namespace Ovi.Task.Data.DAO
{
    public class UploadData<T> where T : class
    {
        public T Data { get; set; }
        public string[] Values { get; set; }
    }
}
