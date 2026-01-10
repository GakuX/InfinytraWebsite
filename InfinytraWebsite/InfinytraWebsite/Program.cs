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

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<BandContext>();

                // Ensure DB exists / migrations applied (optional)
                // context.Database.Migrate();

                //    if (!context.Members.Any())
                //    {
                //        context.Members.AddRange(
                //            new Member
                //            {
                //                Name = "Gary Tjokro",
                //                Role = "Lead Guitar",
                //                Description = "Lead guitarist of Infinytra, focused on melodic solos and heavy riffs.",
                //                PhotoURL = "/images/garylogoimage.jpg"
                //                , Instrument = "Jackson King V",
                //                ImageURL = "/images/redmask.png"
                //            },
                //            new Member
                //            {
                //                Name = "Adan Riasat",
                //                Role = "Rhythm Guitar & Vocals",
                //                Description = "Rhythm guitarist and vocalist driving the core sound of the band.",
                //              PhotoURL = "/images/adan.jpg", Instrument ="Epiphone SG",
                //                ImageURL = "/images/purplemask.png"
                //            },
                //            new Member
                //            {
                //                Name = "Fernando Trujillo",
                //                Role = "Drums & Percussion",
                //                Description = "Drummer and percussionist bringing power and precision to Infinytra.",
                //                PhotoURL = "/images/fernando.jpg", Instrument="Drums", ImageURL= "/images/whitemask.png"
                //            },
                //            new Member
                //            {
                //                Name = "Alhassan Shnoot",
                //                Role = "Bass & Backing Vocals",
                //                Description = "Bassist providing low-end weight and backing vocals.",
                //                PhotoURL = "/images/alhassan.jpg", Instrument="Bass",
                //                ImageURL = "/images/orangemask.png"
                //            }
                //        );

                //        context.SaveChanges();
                //    }
                //}

                var members = context.Members.ToList();

                // Gary
                var gary = members.FirstOrDefault(m => m.Name == "Gary Tjokro");
                if (gary == null)
                {
                    context.Members.Add(new Member
                    {
                        Name = "Gary Tjokro",
                        Role = "Lead Guitar",
                        Description = "Lead guitarist of Infinytra, focused on melodic solos and heavy riffs.",
                        PhotoURL = "/images/garylogoimage.jpg",
                        Instrument = "Jackson King V",
                        ImageURL = "/images/redkingvjackson.png"
                    });
                }
                else
                {
                    gary.Role = "Lead Guitar";
                    gary.Description = "Lead guitarist of Infinytra, focused on melodic solos and heavy riffs.";
                    gary.PhotoURL = "/images/garylogoimage.jpg";
                    gary.Instrument = "Jackson King V";
                    gary.ImageURL = "/images/redkingvjackson.png";
                }

                // Adan
                var adan = members.FirstOrDefault(m => m.Name == "Adan Riasat");
                if (adan == null)
                {
                    context.Members.Add(new Member
                    {
                        Name = "Adan Riasat",
                        Role = "Rhythm Guitar & Vocals",
                        Description = "Rhythm guitarist and vocalist driving the core sound of the band.",
                        PhotoURL = "/images/adan.jpg",
                        Instrument = "Epiphone SG",
                        ImageURL = "/images/redsg.jpg"
                    });
                }
                else
                {
                    adan.Role = "Rhythm Guitar & Vocals";
                    adan.Description = "Rhythm guitarist and vocalist driving the core sound of the band.";
                    adan.PhotoURL = "/images/adan.jpg";
                    adan.Instrument = "Epiphone SG";
                    adan.ImageURL = "/images/redsg.jpg";
                }

                // Fernando
                var fernando = members.FirstOrDefault(m => m.Name == "Fernando Trujillo");
                if (fernando == null)
                {
                    context.Members.Add(new Member
                    {
                        Name = "Fernando Trujillo",
                        Role = "Drums & Percussion",
                        Description = "Drummer and percussionist bringing power and precision to Infinytra.",
                        PhotoURL = "/images/fernando.jpg",
                        Instrument = "Drums",
                        ImageURL = "/images/whitedrums.jpg"
                    });
                }
                else
                {
                    fernando.Role = "Drums & Percussion";
                    fernando.Description = "Drummer and percussionist bringing power and precision to Infinytra.";
                    fernando.PhotoURL = "/images/fernando.jpg";
                    fernando.Instrument = "Drums";
                    fernando.ImageURL = "/images/whitedrums.jpg";
                }

                // Alhassan
                var alhassan = members.FirstOrDefault(m => m.Name == "Alhassan Shnoot");
                if (alhassan == null)
                {
                    context.Members.Add(new Member
                    {
                        Name = "Alhassan Shnoot",
                        Role = "Bass & Backing Vocals",
                        Description = "Bassist providing low-end weight and backing vocals.",
                        PhotoURL = "/images/alhassan.jpg",
                        Instrument = "Bass",
                        ImageURL = "/images/bassal.png"
                    });
                }
                else
                {
                    alhassan.Role = "Bass & Backing Vocals";
                    alhassan.Description = "Bassist providing low-end weight and backing vocals.";
                    alhassan.PhotoURL = "/images/alhassan.jpg";
                    alhassan.Instrument = "Bass";
                    alhassan.ImageURL = "/images/bassal.png";
                }

                var orangehado = members.FirstOrDefault(m => m.Name == "Orange Hado");
                if (orangehado == null)
                {
                    context.Members.Add(new Member
                    {
                        Name = "Orange Hado",
                        Role = "Femboy slayer",
                        Description = "I love bocchi the rock and i am the biggest fan of ravels guitar",
                        PhotoURL = "/images/orangehado.jpg",
                        Instrument = "Guitar",
                        ImageURL = "/images/blackstrat.jpg"
                    });
                }
                else
                {
                    orangehado.Role = "Femboy slayer";
                    orangehado.Description = "I love bocchi the rock i am the biggest fan of ravels guitar";
                    orangehado.PhotoURL = "/images/orangehado.jpg";
                 orangehado.Instrument = "Guitar";
                orangehado.ImageURL = "/images/blackstrat.jpg";
                }

                context.SaveChanges();



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
}
