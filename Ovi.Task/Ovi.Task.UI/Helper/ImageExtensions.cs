using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper
{
    public static class ImageExtensions
    {
        public static byte[] ToByteArray(this Image image, ImageFormat format)
        {
            var bmp = new Bitmap(image.Width, image.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            using (var g = Graphics.FromImage(bmp))
            {
                g.Clear(Color.White);
                g.DrawImage(image, new Rectangle(new Point(), image.Size), new Rectangle(new Point(), image.Size), GraphicsUnit.Pixel);
                using (var stream = new MemoryStream())
                {
                    bmp.Save(stream, format);
                    return stream.ToArray();
                }
            }
        }

    }
}