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

     builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(2);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            var app = builder.Build();


            //session for adding item to cart
            builder.Services.AddDistributedMemoryCache();
       

            //service use to add items in the dataabse using the bd context
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

                //if (!context.Merches.Any())
                //{
                //    context.Merches.AddRange(
                //        new Merch
                //        {
                //            ItemName = "Infinytra Logo Tee",
                //           ItemDescription  = "Black tee with the Infinytra logo on the chest.",
                //            Price = 29.99m,
                //            ImageURL = "/images/orangehado.jpg",
                //            Categories = "Shirt",
                //            InStock = false, NewItem = true
                //        },
                //        new Merch
                //        {
                //            ItemName = "Red Infinytra Logo Tee",
                //            ItemDescription = "Red tee with the Infinytra logo on the chest.",
                //            Price = 29.99m,
                //            ImageURL = "/images/redmask.png",
                //            Categories = "Shirt",
                //            InStock = false, NewItem = true
                //        }
                //    );


                //}

                var merchList = context.Merches.ToList();

                // Tee
                var tee1 = merchList.FirstOrDefault(m => m.ItemName == "Infinytra Logo Tee");
                if (tee1 == null)
                {
                    context.Merches.Add(new Merch
                    {
                        ItemName = "Infinytra Logo Tee",
                        ItemDescription = "Black tee with the Infinytra logo on the chest.",
                        Price = 29.99m , SalePrice = 12.99m,
                        ImageURL = "/images/shirtboy.png",
                        Categories = "Shirt",
                        InStock = false,  
                        NewItem = true    , Gender = "Male", OnSale = true
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
                app.UseSession();


                app.UseAuthorization();

                app.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                app.Run();
            }
        }
    }
}
