using System;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;

namespace Ovi.Task.Data.Helper
{
    public class BatchProgressDataHelper
    {
        private RepositoryBatchProgressData repositoryBatchProgressData;
        public BatchProgressDataHelper()
        {
            repositoryBatchProgressData = new RepositoryBatchProgressData();
        }

        public bool FileExists(string filename)
        {
            return repositoryBatchProgressData.FileExists(filename);
        }

        public TMBATCHPROGRESSDATA StartBatchProgress(string filename, string batch, string progressdata, string status)
        {
            var bp = repositoryBatchProgressData.SaveOrUpdate(new TMBATCHPROGRESSDATA
            {
                PRG_ID = 0,
                PRG_FILENAME = filename,
                PRG_SESSION = ContextUserHelper.Instance.ContextUser.SessionId,
                PRG_BATCH = batch,
                PRG_USER = ContextUserHelper.Instance.ContextUser.Code,
                PRG_PROGRESSDATA = progressdata,
                PRG_STATUS = status,
                PRG_CREATED = DateTime.Now,
                PRG_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code,
                PRG_UPDATED = null,
                PRG_UPDATEDBY = null,
                PRG_RECORDVERSION = 0
            });
            return bp;
        }

        public TMBATCHPROGRESSDATA UpdateBatchProgress(TMBATCHPROGRESSDATA batchProgressData)
        {
            batchProgressData.PRG_UPDATED = DateTime.Now;
            batchProgressData.PRG_UPDATEDBY = ContextUserHelper.Instance.ContextUser.Code;
            var bp = repositoryBatchProgressData.SaveOrUpdate(batchProgressData);
            return bp;
        }
    }
}