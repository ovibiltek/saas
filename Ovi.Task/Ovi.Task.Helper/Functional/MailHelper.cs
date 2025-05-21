using DDay.iCal;
using DDay.iCal.Serialization.iCalendar;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using Attachment = System.Net.Mail.Attachment;

namespace Ovi.Task.Helper.Functional
{
    public class CreateCalendarEventParams
    {
        public string Title { get; set; }

        public string Body { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public double Duration { get; set; }

        public string Location { get; set; }

        public string EventId { get; set; }

        public bool AllDayEvent { get; set; }
    }

    public class MailHelper
    {
        public static class Smtp
        {
            public static string SmtpHost { get; set; }

            public static string SmtpUser { get; set; }

            public static string SmtpPass { get; set; }

            public static int SmtpPort { get; set; }
        }

        public class MaAttachment
        {
            public string Name { get; set; }

            public byte[] Data { get; set; }
        }

        public class Ma
        {
            public string From { get; set; }

            public string To { get; set; }

            public string Cc { get; set; }

            public string Bcc { get; set; }

            public string ReplyTo { get; set; }

            public string Subject { get; set; }

            public string MailBody { get; set; }

            public string AppointmentStr { get; set; }

            public List<MaAttachment> Attachment { get; set; }
        }

        public static void Send(Ma ma)
        {
            var client = new SmtpClient
            {
                Host = Smtp.SmtpHost,
                Port = Smtp.SmtpPort,
                Credentials = new NetworkCredential
                {
                    UserName = Smtp.SmtpUser,
                    Password = Smtp.SmtpPass
                }
            };

            var message = new MailMessage();
            if (!string.IsNullOrEmpty(ma.To))
            {
                foreach (var to in ma.To.Split(';').Where(m => !string.IsNullOrEmpty(m)).Where(to => !message.To.Contains(new MailAddress(to))))
                {
                    message.To.Add(to);
                }
            }

            if (!string.IsNullOrEmpty(ma.Cc))
            {
                foreach (var cc in ma.Cc.Split(';').Where(m => !string.IsNullOrEmpty(m)).Where(cc => !message.CC.Contains(new MailAddress(cc))))
                {
                    message.CC.Add(cc);
                }
            }

            if (!string.IsNullOrEmpty(ma.Bcc))
            {
                foreach (var bcc in ma.Bcc.Split(';').Where(m => !string.IsNullOrEmpty(m)).Where(bcc => !message.Bcc.Contains(new MailAddress(bcc))))
                {
                    message.Bcc.Add(bcc);
                }
            }

            if (!string.IsNullOrEmpty(ma.ReplyTo))
            {
                foreach (var rt in ma.ReplyTo.Split(';').Where(m => !string.IsNullOrEmpty(m)))
                {
                    message.ReplyToList.Add(rt);
                }
            }

            if (ma.Attachment != null)
            {
                foreach (var attachment in ma.Attachment)
                {
                    message.Attachments.Add(new Attachment(new MemoryStream(attachment.Data), attachment.Name));
                }
            }

            var htmlView = AlternateView.CreateAlternateViewFromString(WebUtility.HtmlDecode(ma.MailBody), new ContentType("text/html"));
            message.AlternateViews.Add(htmlView);
            if (!string.IsNullOrEmpty(ma.AppointmentStr))
            {
                var calendarType = new ContentType("text/calendar");
                var ICSview = AlternateView.CreateAlternateViewFromString(ma.AppointmentStr, calendarType);
                message.AlternateViews.Add(ICSview);

                var bytes = new byte[ma.AppointmentStr.Length * sizeof(char)];
                Buffer.BlockCopy(ma.AppointmentStr.ToCharArray(), 0, bytes, 0, bytes.Length);
                message.Attachments.Add(new Attachment(new MemoryStream(bytes), "app.ics"));
            }

            message.BodyEncoding = Encoding.UTF8;
            message.Subject = ma.Subject;
            message.SubjectEncoding = Encoding.UTF8;
            message.From = new MailAddress(ma.From);
            message.IsBodyHtml = true;
            message.BodyTransferEncoding = TransferEncoding.Unknown;

            client.Send(message);
        }

        public static string MailListStr(string[] mails)
        {
            return mails.Where(email => !string.IsNullOrEmpty(email)).Aggregate(string.Empty, (current, email) => current + (email + ";"));
        }

        public static string CreateCalendarEvent(CreateCalendarEventParams createCalendarEventParams)
        {
            var iCal = new iCalendar
            {
                Method = "PUBLISH",
                Version = "2.0"
            };

            var evt = iCal.Create<Event>();
            evt.Summary = createCalendarEventParams.Title;
            evt.Start = new iCalDateTime(createCalendarEventParams.StartDate);
            evt.End = new iCalDateTime(createCalendarEventParams.EndDate);
            evt.Description = createCalendarEventParams.Body;
            evt.Location = createCalendarEventParams.Location;
            evt.IsAllDay = createCalendarEventParams.AllDayEvent;
            evt.UID = string.IsNullOrEmpty(createCalendarEventParams.EventId) ? new Guid().ToString() : createCalendarEventParams.EventId;
            evt.Alarms.Add(new Alarm
            {
                Duration = TimeSpan.FromMinutes(10),
                Trigger = new Trigger(TimeSpan.FromMinutes(-30)),
                Action = AlarmAction.Display,
                Description = "Reminder",
            });

            return new iCalendarSerializer().SerializeToString(iCal);
        }
    }
}