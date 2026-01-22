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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Merch>()
                .Property(m => m.NewItem)
                .HasDefaultValue(false);
        }
      

    }
}
