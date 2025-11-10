using InfinytraWebsite.Data;
using InfinytraWebsite.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace InfinytraWebsite
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

     

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            builder.Services.AddDbContext<BandContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<BandContext>();

                // ✅ Only seed if no songs exist yet
                if (!context.Songs.Any())
                {
                    var album = context.Albums.FirstOrDefault();
                    if (album != null)
                    {
                        context.Songs.AddRange(
                            new Song { Name = "Intro", FilePath = "/music/intro.mp3", AlbumId = album.Id },
                            new Song { Name = "Final Track", FilePath = "/music/final.mp3", AlbumId = album.Id }
                        );
                        context.SaveChanges();
                    }
                }
            }

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
