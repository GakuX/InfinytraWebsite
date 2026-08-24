using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Models; // make sure this matches your namespace




namespace InfinytraWebsite.Data
{
    public class BandContext : DbContext
    {
        public BandContext(DbContextOptions<BandContext> options) : base(options)
        {
        }


        public DbSet<Member> Members { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Song> Songs { get; set; }

        public DbSet<Merch> Merches { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<NewsPost> NewsPosts { get; set; }

        public DbSet<TourDate> TourDates { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<GalleryImage> GalleryImages { get; set; }

        public DbSet<Favorite> Favorites { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Merch>()
                .Property(m => m.NewItem)
                .HasDefaultValue(false);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Favorite>()
                .HasIndex(f => new { f.UserId, f.MerchId })
                .IsUnique();

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Merch)
                .WithMany()
                .HasForeignKey(f => f.MerchId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Merch)
                .WithMany()
                .HasForeignKey(r => r.MerchId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Merch)
                .WithMany()
                .HasForeignKey(oi => oi.MerchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
      

    }
}
