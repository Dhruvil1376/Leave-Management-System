using Microsoft.EntityFrameworkCore;
using Leave_MS.Models;
namespace Leave_MS.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { }

        public DbSet<User> Users => Set<User>();

        public DbSet<Role> Roles => Set<Role>();

        public DbSet<LeaveType> LeaveTypes => Set<LeaveType>();

        public DbSet<Status> Statuses => Set<Status>();

        public DbSet<CalendarYear> CalendarYears => Set<CalendarYear>();

        public DbSet<LeaveBalance> LeaveBalances => Set<LeaveBalance>();

        public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();

        public DbSet<LeaveApproval> LeaveApprovals => Set<LeaveApproval>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>()
                .HasIndex(e => e.RoleName)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasIndex(e => e.Email)
                .IsUnique();

            modelBuilder.Entity<LeaveType>()
                .HasIndex(n => n.TypeName)
                .IsUnique();

            modelBuilder.Entity<LeaveType>()
                .HasIndex(c => c.CssClass)
                .IsUnique();

            modelBuilder.Entity<Status>()
                .HasIndex(s => s.StatusName)
                .IsUnique();
            
            modelBuilder.Entity<CalendarYear>()
                .HasIndex(c => c.CalendarYearName)
                .IsUnique();

            modelBuilder.Entity<LeaveBalance>()
                .HasOne(lb => lb.User)
                .WithMany(u => u.LeaveBalances)
                .HasForeignKey(lb => lb.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveBalance>()
                .HasOne(lb => lb.LeaveType)
                .WithMany(lt => lt.LeaveBalances)
                .HasForeignKey(lb => lb.LeaveTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveBalance>()
                .HasOne(lb => lb.CalendarYear)
                .WithMany(cy => cy.LeaveBalances)
                .HasForeignKey(lb => lb.CalendarYearId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveBalance>()
                .HasIndex(lb => new
                {
                    lb.UserId,
                    lb.LeaveTypeId,
                    lb.CalendarYearId
                })
                .IsUnique();

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.User)
                .WithMany(u => u.LeaveRequests)
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.LeaveType)
                .WithMany(lt => lt.LeaveRequests)
                .HasForeignKey(lr => lr.LeaveTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.Status)
                .WithMany(s => s.LeaveRequests)
                .HasForeignKey(lr => lr.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.User)
                .WithMany(u => u.LeaveRequests)
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.LeaveType)
                .WithMany(lt => lt.LeaveRequests)
                .HasForeignKey(lr => lr.LeaveTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.Status)
                .WithMany(s => s.LeaveRequests)
                .HasForeignKey(lr => lr.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveApproval>()
                .HasOne(la => la.LeaveRequest)
                .WithMany(lr => lr.LeaveApprovals)
                .HasForeignKey(la => la.LeaveRequestId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveApproval>()
                .HasOne(la => la.ApprovedByUser)
                .WithMany(u => u.LeaveApprovals)
                .HasForeignKey(la => la.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
