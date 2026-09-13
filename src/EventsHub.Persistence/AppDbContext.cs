using Eventshub.Domain;
using Microsoft.EntityFrameworkCore;

namespace Eventshub.
Persistence
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Event> Events{ get; set; }
    }
}