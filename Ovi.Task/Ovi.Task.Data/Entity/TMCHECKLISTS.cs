using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCHECKLISTS : ICloneable
    {
        public virtual long CHK_ID { get; set; }

        public virtual string CHK_SUBJECT { get; set; }

        public virtual string CHK_SOURCE { get; set; }

        public virtual string CHK_TYPE { get; set; }

        public virtual int? CHK_TEMPLATELINEID { get; set; }

        public virtual int CHK_LINE { get; set; }

        public virtual string CHK_TEXT { get; set; }

        public virtual int CHK_NO { get; set; }

        public virtual int? CHK_RATE { get; set; }

        public virtual char CHK_PERC { get; set; }

        public virtual char CHK_CHECKED { get; set; }

        public virtual char CHK_NECESSARY { get; set; }

        public virtual decimal? CHK_NUMERICVALUE { get; set; }

        public virtual DateTime? CHK_DATETIMEVALUE { get; set; }

        public virtual string CHK_TEXTVALUE { get; set; }

        public virtual string CHK_NOTE { get; set; }

        public virtual string CHK_TEMPLATE { get; set; }

        public virtual string CHK_TOPIC { get; set; }

        public virtual string CHK_TOPICDESC { get; set; }

        public virtual int? CHK_TOPICORDER { get; set; }

        public virtual string CHK_CREATEDBY { get; set; }

        public virtual DateTime CHK_CREATED { get; set; }

        public virtual string CHK_UPDATEDBY { get; set; }

        public virtual string CHK_UPDATEDBYDESC { get; set; }

        public virtual DateTime? CHK_UPDATED { get; set; }

        public virtual int CHK_RECORDVERSION { get; set; }

        public virtual int CHK_CMNCOUNT { get; set; }

        public virtual int CHK_DOCCOUNT { get; set; }

        public virtual int? CHK_TACID { get; set; }

        public virtual char CHK_TOPICNEWLINE { get; set; }

        public virtual string CHK_COMPARE { get; set; }

        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}