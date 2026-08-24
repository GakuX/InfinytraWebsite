using InfinytraWebsite.Data;
using InfinytraWebsite.Migrations;
using InfinytraWebsite.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using InfinytraWebsite.Helpers;


namespace InfinytraWebsite
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



            // Add services to the container.
            builder.Services.AddControllersWithViews();

            builder.Services.AddEndpointsApiExplorer();  // Required for Swagger
                                                         // Adds Swagger generation
            builder.Services.AddSwaggerGen();
            builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // Safety net alongside the [JsonIgnore] attributes on entity navigation properties -
        // avoids a hard crash if a future entity/endpoint introduces a reference cycle.
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            builder.Services.AddDbContext<BandContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var jwtSection = builder.Configuration.GetSection("Jwt");
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSection["Issuer"],
                        ValidAudience = jwtSection["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!))
                    };
                });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireClaim("IsAdmin", "true"));
            });

            builder.Services.AddSession(options =>
                   {
                       options.IdleTimeout = TimeSpan.FromHours(2);
                       options.Cookie.HttpOnly = true;
                       options.Cookie.IsEssential = true;
                   });

            var app = builder.Build();

            //swashbuckle package remember this
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();  // Generates the Swagger JSON
                app.UseSwaggerUI();  // Shows the Swagger webpage
            }



            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("AllowAll");  // For React later
            app.UseAuthentication();
            app.UseAuthorization();



            //session for adding item to cart
            builder.Services.AddDistributedMemoryCache();


            //service use to add items in the dataabse using the bd context

            //album with songs 

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<BandContext>();

                // Ensure database is created / migrations are applied so seeding works predictably
                try
                {
                    context.Database.Migrate();
                }
                catch
                {
                    // If migrations aren't desired in some environments, ignore failures here.
                }

                // 1
                if (!context.Albums.Any(a => a.Title == "Where Vermillion Burns"))
                {
                    var newAlbum = new Album
                    {
                        Title = "Where Vermillion Burns",
                        ImageURL = "/images/vermillion.png",
                        SongFile = string.Empty,
                        Description = "Debut album from Infinytra - Metalcore classic",
                        CreatedDate = DateTime.UtcNow
                    };

                    context.Albums.Add(newAlbum);
                    context.SaveChanges(); // persist to get Id

                    // Add songs for the new album (only if none exist for it)
                    if (!context.Songs.Any(s => s.AlbumId == newAlbum.Id))
                    {
                        context.Songs.AddRange(
                            new Song { Name = "Tears Don't Fall", FilePath = "/music/tearsdontfall.mp3", AlbumId = newAlbum.Id, Duration = "5:48", TrackNumber = 1 },
                            new Song { Name = "Rising Fire", FilePath = "/music/rising.mp3", AlbumId = newAlbum.Id, Duration = "4:20", TrackNumber = 2 },
                            new Song { Name = "Eternal Storm", FilePath = "/music/storm.mp3", AlbumId = newAlbum.Id, Duration = "5:45", TrackNumber = 3 },
                            new Song { Name = "Final Track", FilePath = "/music/final.mp3", AlbumId = newAlbum.Id, Duration = "6:00", TrackNumber = 4 }
                        );
                        context.SaveChanges();
                    }
                }



                //2
                if (!context.Albums.Any(a => a.Title == "Bullet for My Valentine"))
                {
                    var newAlbum = new Album
                    {
                        Title = "Bullet for My Valentine",
                        ImageURL = "/images/bfmvself.jpg",
                        SongFile = string.Empty,
                        Description = "2nd Album",
                        CreatedDate = DateTime.UtcNow
                    };

                    context.Albums.Add(newAlbum);
                    context.SaveChanges(); // persist to get Id

                    // Add songs for the new album (only if none exist for it)
                    if (!context.Songs.Any(s => s.AlbumId == newAlbum.Id))
                    {
                        context.Songs.AddRange(
                            new Song { Name = "Parasite", FilePath = "/music/01. Parasite.mp3", AlbumId = newAlbum.Id, Duration = "5:04", TrackNumber = 1 },
                            new Song { Name = "Knives", FilePath = "/music/02. Knives.mp3", AlbumId = newAlbum.Id, Duration = "4:16", TrackNumber = 2 },
                            new Song { Name = "My Reverie", FilePath = "/music/03. My Reverie.mp3", AlbumId = newAlbum.Id, Duration = "4:42", TrackNumber = 3 },
                            new Song { Name = "No Happy Ever After", FilePath = "/music/04. No Happy Ever After.mp3", AlbumId = newAlbum.Id, Duration = "4:08", TrackNumber = 4 },
                            new Song { Name = "Can't Escape the Waves", FilePath = "/music/05. Can't Escape The Waves.mp3", AlbumId = newAlbum.Id, Duration = "4:34", TrackNumber = 5 },
                            new Song { Name = "Bastards", FilePath = "/music/06. Bastards.mp3", AlbumId = newAlbum.Id, Duration = "5:07", TrackNumber = 6 },
                            new Song { Name = "Rainbow Veins", FilePath = "/music/07. Rainbow Veins.mp3", AlbumId = newAlbum.Id, Duration = "4:40", TrackNumber = 7 },
                            new Song { Name = "Shatter", FilePath = "/music/08. Shatter.mp3", AlbumId = newAlbum.Id, Duration = "4:26", TrackNumber = 8 },
                            new Song { Name = "Paralysed", FilePath = "/music/09. Paralysed.mp3", AlbumId = newAlbum.Id, Duration = "5:18", TrackNumber = 9 },
                            new Song { Name = "Death By A Thousand Cuts", FilePath = "/music/10. Death By A Thousand Cuts.mp3", AlbumId = newAlbum.Id, Duration = "5:32", TrackNumber = 10 }
                        );
                        context.SaveChanges();
                    }
                }
            }



                //merch
                using (var scope = app.Services.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<BandContext>();






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


                    var merchList = context.Merches.ToList();

                    // Tee
                    var tee1 = merchList.FirstOrDefault(m => m.ItemName == "Infinytra Logo Tee");
                    if (tee1 == null)
                    {
                        context.Merches.Add(new Merch
                        {
                            ItemName = "Infinytra Logo Tee",
                            ItemDescription = "Black tee with the Infinytra logo on the chest.",
                            Price = 29.99m,
                            SalePrice = 12.99m,
                            ImageURL = "/images/shirtboy.png",
                            Categories = "Shirt",
                            InStock = false,
                            NewItem = true,
                            Gender = "Male",
                            OnSale = true
                        });
                    }
                    else
                    {
                        tee1.ItemDescription = "Black tee with the Infinytra logo on the chest.";
                        tee1.Price = 29.99m;
                        tee1.SalePrice = 12.99m;
                        tee1.ImageURL = "/images/shirtboy.png";
                        tee1.Categories = "Shirt";
                        tee1.InStock = false;
                        tee1.NewItem = true;
                        tee1.Gender = "Male";
                        tee1.OnSale = true;
                    }

                    //else
                    //{
                    //    tee1.ItemDescription = "Black tee with the Infinytra logo on the chest.";
                    //    tee1.Price = 29.99m;
                    //    tee1.ImageURL = "/images/shirtboy.png";
                    //    tee1.Categories = "Shirt";
                    //    tee1.InStock = false;  
                    //    tee1.NewItem = true;   
                    //}

                    var tee2 = merchList.FirstOrDefault(m => m.ItemName == "Infinytra Girl Tank Top");
                    if (tee2 == null)
                    {
                        context.Merches.Add(new Merch
                        {
                            ItemName = "Infinytra Girl Tank Top",
                            ItemDescription = "Black tee with the Infinytra logo on the chest.",
                            Price = 24.99m,
                            ImageURL = "/images/shirtgirl.png",
                            Categories = "Shirt",
                            InStock = false,
                            NewItem = true,
                            Gender = "Female"
                        });
                    }
                    else
                    {
                        tee2.ItemDescription = "Black tee with the Infinytra logo on the chest.";
                        tee2.Price = 24.99m;
                        tee2.ImageURL = "/images/shirtgirl.png";
                        tee2.Categories = "Shirt";
                        tee2.InStock = false;
                        tee2.NewItem = true;
                    }

                    var tee3 = merchList.FirstOrDefault(m => m.ItemName == "First Album Vinyl Record");
                    if (tee3 == null)
                    {
                        context.Merches.Add(new Merch
                        {
                            ItemName = "First Album Vinyl Record",
                            ItemDescription = "Check out our debut album vinyl record!",
                            Price = 54.99m,
                            ImageURL = "/images/wanyk.png",
                            Categories = "Album",
                            InStock = false,
                            NewItem = true
                        });
                    }

                    var tee4 = merchList.FirstOrDefault(m => m.ItemName == "Infinytra Thunder Twink Hoodie");
                    if (tee4 == null)
                    {
                        context.Merches.Add(new Merch
                        {
                            ItemName = "Infinytra Thunder Twink Hoodie",
                            ItemDescription = "Our sigma album including our mascot Amir al-houssine",
                            Price = 149.99m,
                            SalePrice = 129.99m,
                            ImageURL = "/images/ttshirt.png",
                            Categories = "Hoodie",
                            InStock = true,
                            NewItem = true,
                            Gender = "Male",
                            OnSale = true
                        });
                    }
                    //else
                    //{
                    //    tee4.ItemDescription = "Our sigma album including our mascot Amir al-houssine";
                    //    tee4.Price = 149.99m;
                    //    tee4.SalePrice = 129.99m;
                    //    tee4.ImageURL = "/images/ttshirt.png";
                    //    tee4.Categories = "Hoodie";
                    //    tee4.InStock = true;
                    //    tee4.NewItem = true;
                    //    tee4.Gender = "Male";
                    //    tee4.OnSale = true;
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



                    // news posts
                    if (!context.NewsPosts.Any(n => n.Title == "\"Where Vermillion Burns\" Out Now"))
                    {
                        context.NewsPosts.Add(new NewsPost
                        {
                            Title = "\"Where Vermillion Burns\" Out Now",
                            Blurb = "Our debut album has officially dropped. Four tracks of everything we've been building toward - stream it everywhere.",
                            PostedDate = new DateTime(2026, 6, 14)
                        });
                    }

                    if (!context.NewsPosts.Any(n => n.Title == "New Single: \"Tears Don't Fall\""))
                    {
                        context.NewsPosts.Add(new NewsPost
                        {
                            Title = "New Single: \"Tears Don't Fall\"",
                            Blurb = "The opening track from the album is out as a standalone single, with a run of shows to back it up.",
                            PostedDate = new DateTime(2026, 7, 1)
                        });
                    }

                    if (!context.NewsPosts.Any(n => n.Title == "Summer Tour Announced"))
                    {
                        context.NewsPosts.Add(new NewsPost
                        {
                            Title = "Summer Tour Announced",
                            Blurb = "We're hitting the road across North America and the UK. Full dates below - more cities to be added soon.",
                            PostedDate = new DateTime(2026, 8, 1)
                        });
                    }

                    // tour dates
                    if (!context.TourDates.Any(t => t.Venue == "The Whisky a Go Go"))
                    {
                        context.TourDates.Add(new TourDate
                        {
                            ShowDate = new DateTime(2026, 6, 25),
                            Venue = "The Whisky a Go Go",
                            Location = "Los Angeles, CA"
                        });
                    }

                    if (!context.TourDates.Any(t => t.Venue == "Saint Vitus Bar"))
                    {
                        context.TourDates.Add(new TourDate
                        {
                            ShowDate = new DateTime(2026, 7, 15),
                            Venue = "Saint Vitus Bar",
                            Location = "Brooklyn, NY"
                        });
                    }

                    if (!context.TourDates.Any(t => t.Venue == "The Underworld"))
                    {
                        context.TourDates.Add(new TourDate
                        {
                            ShowDate = new DateTime(2026, 8, 5),
                            Venue = "The Underworld",
                            Location = "London, UK"
                        });
                    }

                    // admin account
                    var adminUser = context.Users.FirstOrDefault(u => u.Username == "admin");
                    if (adminUser == null)
                    {
                        context.Users.Add(new User
                        {
                            Username = "admin",
                            Email = "admin@infinytra.local",
                            PasswordHash = PasswordHasher.Hash("222222"),
                            CreatedDate = DateTime.UtcNow,
                            IsAdmin = true
                        });
                    }
                    else
                    {
                        adminUser.PasswordHash = PasswordHasher.Hash("222222");
                        adminUser.IsAdmin = true;
                    }

                    // photo gallery
                    if (!context.GalleryImages.Any())
                    {
                        context.GalleryImages.AddRange(
                            new GalleryImage { ImageURL = "/images/garylogoimage.jpg", Caption = "Gary Tjokro - Lead Guitar", Category = "Band", UploadedDate = new DateTime(2026, 5, 1) },
                            new GalleryImage { ImageURL = "/images/adan.jpg", Caption = "Adan Riasat - Rhythm Guitar & Vocals", Category = "Band", UploadedDate = new DateTime(2026, 5, 2) },
                            new GalleryImage { ImageURL = "/images/fernando.jpg", Caption = "Fernando Trujillo - Drums", Category = "Band", UploadedDate = new DateTime(2026, 5, 3) },
                            new GalleryImage { ImageURL = "/images/alhassan.jpg", Caption = "Alhassan Shnoot - Bass", Category = "Band", UploadedDate = new DateTime(2026, 5, 4) },
                            new GalleryImage { ImageURL = "/images/redkingvjackson.png", Caption = "Jackson King V", Category = "Gear", UploadedDate = new DateTime(2026, 5, 5) },
                            new GalleryImage { ImageURL = "/images/whitedrums.jpg", Caption = "Backline setup", Category = "Gear", UploadedDate = new DateTime(2026, 5, 6) },
                            new GalleryImage { ImageURL = "/images/vermillion.png", Caption = "Where Vermillion Burns - cover art", Category = "Album", UploadedDate = new DateTime(2026, 6, 14) },
                            new GalleryImage { ImageURL = "/images/poison.webp", Caption = "Tears Don't Fall - single art", Category = "Album", UploadedDate = new DateTime(2026, 7, 1) }
                        );
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
                    app.UseCors("AllowAll");
                    app.UseSession();

                    app.UseAuthentication();
                    app.UseAuthorization();

                    app.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}");
                    app.MapControllers();
                    app.Run();
                }
            }
        }
    }

