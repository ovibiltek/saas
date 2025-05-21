using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;

namespace Ovi.Task.UI.Helper
{
    public class ImageHelper
    {
        public static Image ResizeImage(Image image, Size size, bool preserveAspectRatio = true)
        {
            int newWidth;
            int newHeight;
            if (preserveAspectRatio)
            {
                var originalWidth = image.Width;
                var originalHeight = image.Height;
                var percentWidth = (float)size.Width / (float)originalWidth;
                var percentHeight = (float)size.Height / (float)originalHeight;
                var percent = percentHeight < percentWidth ? percentHeight : percentWidth;
                newWidth = (int)(originalWidth * percent);
                newHeight = (int)(originalHeight * percent);
            }
            else
            {
                newWidth = size.Width;
                newHeight = size.Height;
            }
            Image newImage = new Bitmap(newWidth, newHeight);
            using (var graphicsHandle = Graphics.FromImage(newImage))
            {
                graphicsHandle.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphicsHandle.DrawImage(image, 0, 0, newWidth, newHeight);
            }
            return newImage;
        }

        public static void Stamp(Image b, DateTime dt, string format)
        {
            var stampString = !string.IsNullOrEmpty(format) ? dt.ToString(format) : dt.ToString(CultureInfo.InvariantCulture);
            var g = Graphics.FromImage(b);
            Brush brush = new SolidBrush(Color.FromArgb(60, 0, 0, 0));
            g.FillRectangle(brush, 0, b.Height - 20, b.Width, 20);
            g.DrawString(stampString, new Font("Arial", 12f), Brushes.White, 2 , b.Height - 18);

        }
    }
}