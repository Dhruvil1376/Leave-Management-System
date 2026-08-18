using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // ============================================================
        // 1. TOTAL NUMBER OF USERS
        // ============================================================

        [HttpGet("total-users")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var totalUsers = await _context.Users.CountAsync();

            return Ok(new
            {
                TotalUsers = totalUsers
            });
        }


        // ============================================================
        // 2. TOTAL ACTIVE USERS
        // ============================================================

        [HttpGet("active-users")]
        public async Task<IActionResult> GetActiveUsers()
        {
            var activeUsers = await _context.Users
                .CountAsync(x => x.isActive);

            return Ok(new
            {
                ActiveUsers = activeUsers
            });
        }


        // ============================================================
        // 3. TOTAL LEAVE REQUESTS
        // ============================================================

        [HttpGet("total-leave-requests")]
        public async Task<IActionResult> GetTotalLeaveRequests()
        {
            var totalLeaveRequests =
                await _context.LeaveRequests.CountAsync();

            return Ok(new
            {
                TotalLeaveRequests = totalLeaveRequests
            });
        }


        // ============================================================
        // 4. LEAVE REQUESTS BY STATUS
        // ============================================================

        [HttpGet("leave-status-summary")]
        public async Task<IActionResult> GetLeaveStatusSummary()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.Statuses,
                    lr => lr.StatusId,
                    s => s.StatusId,
                    (lr, s) => new
                    {
                        Status = s.StatusName
                    }
                )
                .GroupBy(x => x.Status)
                .Select(g => new
                {
                    Status = g.Key,
                    TotalRequests = g.Count()
                })
                .OrderByDescending(x => x.TotalRequests)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 5. LEAVE REQUESTS BY LEAVE TYPE
        // ============================================================

        [HttpGet("leave-type-summary")]
        public async Task<IActionResult> GetLeaveTypeSummary()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        LeaveType = lt.TypeName
                    }
                )
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    TotalRequests = g.Count()
                })
                .OrderByDescending(x => x.TotalRequests)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 6. LEAVE REQUESTS HANDLED BY EACH APPROVER
        // ============================================================

        [HttpGet("approver-workload")]
        public async Task<IActionResult> GetApproverWorkload()
        {
            var result = await _context.LeaveApprovals
                .Join(
                    _context.Users,
                    la => la.ApprovedBy,
                    u => u.UserId,
                    (la, u) => new
                    {
                        Approver = u.FullName
                    }
                )
                .GroupBy(x => x.Approver)
                .Select(g => new
                {
                    Approver = g.Key,
                    TotalRequests = g.Count()
                })
                .OrderByDescending(x => x.TotalRequests)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 7. LEAVE REQUESTS SUBMITTED BY EACH EMPLOYEE
        // ============================================================

        [HttpGet("employee-leave-requests")]
        public async Task<IActionResult> GetEmployeeLeaveRequests()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.Users,
                    lr => lr.UserId,
                    u => u.UserId,
                    (lr, u) => new
                    {
                        Employee = u.FullName
                    }
                )
                .GroupBy(x => x.Employee)
                .Select(g => new
                {
                    Employee = g.Key,
                    TotalRequests = g.Count()
                })
                .OrderByDescending(x => x.TotalRequests)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 8. TOP 10 EMPLOYEES BY TOTAL LEAVE DAYS
        // ============================================================

        [HttpGet("top-10-leave-users")]
        public async Task<IActionResult> GetTop10LeaveUsers()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.Users,
                    lr => lr.UserId,
                    u => u.UserId,
                    (lr, u) => new
                    {
                        Employee = u.FullName,
                        lr.TotalDays
                    }
                )
                .GroupBy(x => x.Employee)
                .Select(g => new
                {
                    Employee = g.Key,
                    TotalLeaveDays = g.Sum(x => x.TotalDays)
                })
                .OrderByDescending(x => x.TotalLeaveDays)
                .Take(10)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 9. BOTTOM 10 EMPLOYEES BY TOTAL LEAVE DAYS
        // ============================================================

        [HttpGet("bottom-10-leave-users")]
        public async Task<IActionResult> GetBottom10LeaveUsers()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.Users,
                    lr => lr.UserId,
                    u => u.UserId,
                    (lr, u) => new
                    {
                        Employee = u.FullName,
                        lr.TotalDays
                    }
                )
                .GroupBy(x => x.Employee)
                .Select(g => new
                {
                    Employee = g.Key,
                    TotalLeaveDays = g.Sum(x => x.TotalDays)
                })
                .OrderBy(x => x.TotalLeaveDays)
                .Take(10)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 10. PENDING LEAVES WHOSE START DATE HAS PASSED
        // ============================================================

        [HttpGet("overdue-leave-requests")]
        public async Task<IActionResult> GetOverdueLeaveRequests()
        {
            var result = await (
                from lr in _context.LeaveRequests

                join u in _context.Users
                    on lr.UserId equals u.UserId

                join lt in _context.LeaveTypes
                    on lr.LeaveTypeId equals lt.LeaveTypeId

                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                where s.StatusName == "Pending"
                      && lr.StartDate < DateTime.Now

                select new
                {
                    lr.LeaveRequestId,
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lr.StartDate,
                    lr.EndDate,
                    lr.TotalDays,
                    Status = s.StatusName
                }
            )
            .OrderBy(x => x.StartDate)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 11. LEAVES STARTING WITHIN NEXT 7 DAYS
        // ============================================================

        [HttpGet("upcoming-leaves")]
        public async Task<IActionResult> GetUpcomingLeaves()
        {
            var today = DateTime.Today;
            var nextSevenDays = today.AddDays(7);

            var result = await (
                from lr in _context.LeaveRequests

                join u in _context.Users
                    on lr.UserId equals u.UserId

                join lt in _context.LeaveTypes
                    on lr.LeaveTypeId equals lt.LeaveTypeId

                where lr.StartDate >= today
                      && lr.StartDate <= nextSevenDays

                select new
                {
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lr.StartDate,
                    lr.EndDate,
                    lr.TotalDays
                }
            )
            .OrderBy(x => x.StartDate)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 12. EMPLOYEES USING EACH LEAVE TYPE
        // ============================================================

        [HttpGet("leave-type-employees")]
        public async Task<IActionResult> GetLeaveTypeEmployees()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        lr.UserId,
                        LeaveType = lt.TypeName
                    }
                )
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    Employees = g
                        .Select(x => x.UserId)
                        .Distinct()
                        .Count()
                })
                .OrderByDescending(x => x.Employees)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 13. MONTH-WISE LEAVE REQUEST COUNT
        // ============================================================

        [HttpGet("monthly-leave-requests")]
        public async Task<IActionResult> GetMonthlyLeaveRequests()
        {
            var result = await _context.LeaveRequests
                .GroupBy(x => new
                {
                    Year = x.StartDate.Year,
                    Month = x.StartDate.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    TotalRequests = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 14. ROLE-WISE ACTIVE USER COUNT
        // ============================================================

        [HttpGet("role-wise-active-users")]
        public async Task<IActionResult> GetRoleWiseActiveUsers()
        {
            var result = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        u.isActive,
                        Role = r.RoleName
                    }
                )
                .Where(x => x.isActive)
                .GroupBy(x => x.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    ActiveUsers = g.Count()
                })
                .OrderByDescending(x => x.ActiveUsers)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 15. EACH ROLE WITH USERS ASSIGNED TO IT
        // ============================================================

        [HttpGet("users-by-role")]
        public async Task<IActionResult> GetUsersByRole()
        {
            var result = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        Role = r.RoleName,
                        User = u.FullName
                    }
                )
                .GroupBy(x => x.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    Users = g
                        .Select(x => x.User)
                        .ToList()
                })
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 16. ROLES HAVING MORE THAN 10 USERS
        // ============================================================

        [HttpGet("roles-more-than-10-users")]
        public async Task<IActionResult> GetRolesMoreThan10Users()
        {
            var result = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        Role = r.RoleName
                    }
                )
                .GroupBy(x => x.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    TotalUsers = g.Count()
                })
                .Where(x => x.TotalUsers > 10)
                .OrderByDescending(x => x.TotalUsers)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 17. ROLE STATISTICS
        // ============================================================

        [HttpGet("role-statistics")]
        public async Task<IActionResult> GetRoleStatistics()
        {
            var result = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        Role = r.RoleName,
                        u.isActive
                    }
                )
                .GroupBy(x => x.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    TotalUsers = g.Count(),
                    ActiveUsers = g.Count(x => x.isActive),
                    InactiveUsers = g.Count(x => !x.isActive)
                })
                .OrderByDescending(x => x.TotalUsers)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 18. LEAVES STARTING WITHIN NEXT 7 DAYS
        // ============================================================

        [HttpGet("leaves-due-within-7-days")]
        public async Task<IActionResult> GetLeavesDueWithin7Days()
        {
            var today = DateTime.Today;
            var nextSevenDays = today.AddDays(7);

            var result = await (
                from lr in _context.LeaveRequests

                join u in _context.Users
                    on lr.UserId equals u.UserId

                join lt in _context.LeaveTypes
                    on lr.LeaveTypeId equals lt.LeaveTypeId

                where lr.StartDate >= today
                      && lr.StartDate <= nextSevenDays

                select new
                {
                    lr.LeaveRequestId,
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lr.StartDate,
                    lr.EndDate,
                    lr.TotalDays,
                    DaysRemaining = EF.Functions.DateDiffDay(today, lr.StartDate)
                }
            )
            .OrderBy(x => x.StartDate)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 19. LEAVE STATISTICS FOR EACH EMPLOYEE
        // ============================================================

        [HttpGet("employee-leave-statistics")]
        public async Task<IActionResult> GetEmployeeLeaveStatistics()
        {
            var result = await (
                from lr in _context.LeaveRequests

                join u in _context.Users
                    on lr.UserId equals u.UserId

                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                select new
                {
                    Employee = u.FullName,
                    lr.TotalDays,
                    Status = s.StatusName
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalRequests = g.Count(),
                ApprovedRequests = g.Count(x => x.Status == "Approved"),
                PendingRequests = g.Count(x => x.Status == "Pending"),
                RejectedRequests = g.Count(x => x.Status == "Rejected"),
                TotalLeaveDays = g.Sum(x => x.TotalDays)
            })
            .OrderByDescending(x => x.TotalLeaveDays)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 20. LEAVE TYPE-WISE TOTAL REQUESTED DAYS
        // ============================================================

        [HttpGet("leave-type-days")]
        public async Task<IActionResult> GetLeaveTypeDays()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        LeaveType = lt.TypeName,
                        lr.TotalDays
                    }
                )
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    TotalRequestedDays = g.Sum(x => x.TotalDays),
                    TotalRequests = g.Count()
                })
                .OrderByDescending(x => x.TotalRequestedDays)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 21. TOP 10 LEAVE TYPES BY TOTAL LEAVE DAYS
        // ============================================================

        [HttpGet("top-10-leave-types")]
        public async Task<IActionResult> GetTop10LeaveTypes()
        {
            var result = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        LeaveType = lt.TypeName,
                        lr.TotalDays
                    }
                )
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    TotalLeaveDays = g.Sum(x => x.TotalDays)
                })
                .OrderByDescending(x => x.TotalLeaveDays)
                .Take(10)
                .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 22. EMPLOYEE LEAVE BALANCE STATISTICS
        // ============================================================

        [HttpGet("employee-leave-balances")]
        public async Task<IActionResult> GetEmployeeLeaveBalances()
        {
            var result = await (
                from lb in _context.LeaveBalances

                join u in _context.Users
                    on lb.UserId equals u.UserId

                select new
                {
                    Employee = u.FullName,
                    lb.AllocatedDays,
                    lb.UsedDays
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalAllocated = g.Sum(x => x.AllocatedDays),
                TotalUsed = g.Sum(x => x.UsedDays),
                TotalRemaining = g.Sum(x => x.AllocatedDays - x.UsedDays)
            })
            .OrderByDescending(x => x.TotalUsed)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 23. EMPLOYEE APPROVAL STATISTICS
        // ============================================================

        [HttpGet("employee-approval-statistics")]
        public async Task<IActionResult> GetEmployeeApprovalStatistics()
        {
            var result = await (
                from lr in _context.LeaveRequests

                join u in _context.Users
                    on lr.UserId equals u.UserId

                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                select new
                {
                    Employee = u.FullName,
                    Status = s.StatusName
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalRequests = g.Count(),
                ApprovedRequests = g.Count(x => x.Status == "Approved"),
                PendingRequests = g.Count(x => x.Status == "Pending"),
                RejectedRequests = g.Count(x => x.Status == "Rejected"),
                ApprovalPercentage = g.Count() == 0
                    ? 0
                    : g.Count(x => x.Status == "Approved") * 100.0 / g.Count()
            })
            .OrderByDescending(x => x.ApprovalPercentage)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 24. EMPLOYEES WITH LOW LEAVE BALANCE
        // ============================================================

        [HttpGet("low-leave-balances")]
        public async Task<IActionResult> GetLowLeaveBalances()
        {
            var result = await (
                from lb in _context.LeaveBalances

                join u in _context.Users
                    on lb.UserId equals u.UserId

                join lt in _context.LeaveTypes
                    on lb.LeaveTypeId equals lt.LeaveTypeId

                let remaining = lb.AllocatedDays - lb.UsedDays

                where remaining <= 2

                select new
                {
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lb.AllocatedDays,
                    lb.UsedDays,
                    RemainingDays = remaining
                }
            )
            .OrderBy(x => x.RemainingDays)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 25. MONTH-WISE APPROVED LEAVE COUNT
        // ============================================================

        [HttpGet("monthly-approved-leaves")]
        public async Task<IActionResult> GetMonthlyApprovedLeaves()
        {
            var result = await (
                from lr in _context.LeaveRequests

                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                where s.StatusName == "Approved"

                select lr
            )
            .GroupBy(x => new
            {
                Year = x.StartDate.Year,
                Month = x.StartDate.Month
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                ApprovedLeaves = g.Count(),
                TotalApprovedDays = g.Sum(x => x.TotalDays)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 26. EMPLOYEE LEAVE UTILIZATION RANKING
        // ============================================================

        [HttpGet("employee-leave-utilization")]
        public async Task<IActionResult> GetEmployeeLeaveUtilization()
        {
            var result = await (
                from lb in _context.LeaveBalances

                join u in _context.Users
                    on lb.UserId equals u.UserId

                select new
                {
                    Employee = u.FullName,
                    lb.AllocatedDays,
                    lb.UsedDays
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalAllocated = g.Sum(x => x.AllocatedDays),
                TotalUsed = g.Sum(x => x.UsedDays),
                UtilizationPercentage = g.Sum(x => x.AllocatedDays) == 0
                    ? 0
                    : g.Sum(x => x.UsedDays) * 100.0 / g.Sum(x => x.AllocatedDays)
            })
            .OrderByDescending(x => x.UtilizationPercentage)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // 27. COMPLETE EMPLOYEE LEAVE DASHBOARD STATISTICS
        // ============================================================

        [HttpGet("employee-dashboard")]
        public async Task<IActionResult> GetEmployeeDashboard()
        {
            var result = await (
                from lr in _context.LeaveRequests

                join u in _context.Users
                    on lr.UserId equals u.UserId

                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                select new
                {
                    Employee = u.FullName,
                    lr.TotalDays,
                    lr.StartDate,
                    Status = s.StatusName
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalRequests = g.Count(),
                Approved = g.Count(x => x.Status == "Approved"),
                Pending = g.Count(x => x.Status == "Pending"),
                Rejected = g.Count(x => x.Status == "Rejected"),
                TotalLeaveDays = g.Sum(x => x.TotalDays),
                AverageLeaveDays = g.Average(x => x.TotalDays),
                LastLeaveStartDate = g.Max(x => x.StartDate)
            })
            .OrderByDescending(x => x.TotalLeaveDays)
            .ToListAsync();

            return Ok(result);
        }


        // ============================================================
        // MASTER DASHBOARD
        // Returns all 27 results together
        // ============================================================

        [HttpGet("all")]
        public async Task<IActionResult> GetCompleteDashboard()
        {
            // 1
            var totalUsers = await _context.Users.CountAsync();

            // 2
            var activeUsers = await _context.Users
                .CountAsync(x => x.isActive);

            // 3
            var totalLeaveRequests = await _context.LeaveRequests.CountAsync();

            // 4
            var leaveStatusSummary = await _context.LeaveRequests
                .Join(
                    _context.Statuses,
                    lr => lr.StatusId,
                    s => s.StatusId,
                    (lr, s) => s.StatusName)
                .GroupBy(x => x)
                .Select(g => new
                {
                    Status = g.Key,
                    TotalRequests = g.Count()
                })
                .ToListAsync();

            // 5
            var leaveTypeSummary = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => lt.TypeName)
                .GroupBy(x => x)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    TotalRequests = g.Count()
                })
                .ToListAsync();

            // 6
            var approverWorkload = await _context.LeaveApprovals
                .Join(
                    _context.Users,
                    a => a.ApprovedBy,
                    u => u.UserId,
                    (a, u) => new
                    {
                        Approver = u.FullName
                    })
                .GroupBy(x => x.Approver)
                .Select(g => new
                {
                    Approver = g.Key,
                    TotalRequests = g.Count()
                })
                .ToListAsync();

            // 7
            var employeeLeaveRequests = await _context.LeaveRequests
                .Join(
                    _context.Users,
                    lr => lr.UserId,
                    u => u.UserId,
                    (lr, u) => new
                    {
                        Employee = u.FullName
                    })
                .GroupBy(x => x.Employee)
                .Select(g => new
                {
                    Employee = g.Key,
                    TotalRequests = g.Count()
                })
                .ToListAsync();

            // 8
            var top10LeaveUsers = await _context.LeaveRequests
                .Join(
                    _context.Users,
                    lr => lr.UserId,
                    u => u.UserId,
                    (lr, u) => new
                    {
                        Employee = u.FullName,
                        lr.TotalDays
                    })
                .GroupBy(x => x.Employee)
                .Select(g => new
                {
                    Employee = g.Key,
                    TotalLeaveDays = g.Sum(x => x.TotalDays)
                })
                .OrderByDescending(x => x.TotalLeaveDays)
                .Take(10)
                .ToListAsync();

            // 9
            var bottom10LeaveUsers = await _context.LeaveRequests
                .Join(
                    _context.Users,
                    lr => lr.UserId,
                    u => u.UserId,
                    (lr, u) => new
                    {
                        Employee = u.FullName,
                        lr.TotalDays
                    })
                .GroupBy(x => x.Employee)
                .Select(g => new
                {
                    Employee = g.Key,
                    TotalLeaveDays = g.Sum(x => x.TotalDays)
                })
                .OrderBy(x => x.TotalLeaveDays)
                .Take(10)
                .ToListAsync();

            // 10
            var overdueLeaveRequests = await (
                from lr in _context.LeaveRequests
                join u in _context.Users
                    on lr.UserId equals u.UserId
                join lt in _context.LeaveTypes
                    on lr.LeaveTypeId equals lt.LeaveTypeId
                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                where s.StatusName == "Pending"
                      && lr.StartDate < DateTime.Now

                select new
                {
                    lr.LeaveRequestId,
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lr.StartDate,
                    lr.EndDate,
                    lr.TotalDays
                }
            ).ToListAsync();

            // 11
            var upcomingLeaves = await (
                from lr in _context.LeaveRequests
                join u in _context.Users
                    on lr.UserId equals u.UserId
                join lt in _context.LeaveTypes
                    on lr.LeaveTypeId equals lt.LeaveTypeId

                where lr.StartDate >= DateTime.Today
                      && lr.StartDate <= DateTime.Today.AddDays(7)

                select new
                {
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lr.StartDate,
                    lr.EndDate,
                    lr.TotalDays
                }
            ).ToListAsync();

            // 12
            var leaveTypeEmployees = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        lr.UserId,
                        LeaveType = lt.TypeName
                    })
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    Employees = g.Select(x => x.UserId).Distinct().Count()
                })
                .ToListAsync();

            // 13
            var monthlyLeaveRequests = await _context.LeaveRequests
                .GroupBy(x => new
                {
                    Year = x.StartDate.Year,
                    Month = x.StartDate.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    TotalRequests = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            // 14
            var roleWiseActiveUsers = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        r.RoleName,
                        u.isActive
                    })
                .Where(x => x.isActive)
                .GroupBy(x => x.RoleName)
                .Select(g => new
                {
                    Role = g.Key,
                    ActiveUsers = g.Count()
                })
                .ToListAsync();

            // 15
            var usersByRole = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        Role = r.RoleName,
                        User = u.FullName
                    })
                .GroupBy(x => x.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    Users = g.Select(x => x.User).ToList()
                })
                .ToListAsync();

            // 16
            var rolesMoreThan10 = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => r.RoleName)
                .GroupBy(x => x)
                .Select(g => new
                {
                    Role = g.Key,
                    TotalUsers = g.Count()
                })
                .Where(x => x.TotalUsers > 10)
                .ToListAsync();

            // 17
            var roleStatistics = await _context.Users
                .Join(
                    _context.Roles,
                    u => u.RoleId,
                    r => r.RoleId,
                    (u, r) => new
                    {
                        Role = r.RoleName,
                        u.isActive
                    })
                .GroupBy(x => x.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    TotalUsers = g.Count(),
                    ActiveUsers = g.Count(x => x.isActive),
                    InactiveUsers = g.Count(x => !x.isActive)
                })
                .ToListAsync();

            // 18
            var leavesDueWithin7Days = await (
                from lr in _context.LeaveRequests
                join u in _context.Users
                    on lr.UserId equals u.UserId
                join lt in _context.LeaveTypes
                    on lr.LeaveTypeId equals lt.LeaveTypeId

                where lr.StartDate >= DateTime.Today
                      && lr.StartDate <= DateTime.Today.AddDays(7)

                select new
                {
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lr.StartDate,
                    lr.EndDate,
                    lr.TotalDays
                }
            ).ToListAsync();

            // 19
            var employeeLeaveStatistics = await (
                from lr in _context.LeaveRequests
                join u in _context.Users
                    on lr.UserId equals u.UserId
                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                select new
                {
                    Employee = u.FullName,
                    lr.TotalDays,
                    Status = s.StatusName
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalRequests = g.Count(),
                ApprovedRequests = g.Count(x => x.Status == "Approved"),
                PendingRequests = g.Count(x => x.Status == "Pending"),
                RejectedRequests = g.Count(x => x.Status == "Rejected"),
                TotalLeaveDays = g.Sum(x => x.TotalDays)
            })
            .ToListAsync();

            // 20
            var leaveTypeDays = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        LeaveType = lt.TypeName,
                        lr.TotalDays
                    })
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    TotalRequestedDays = g.Sum(x => x.TotalDays),
                    TotalRequests = g.Count()
                })
                .ToListAsync();

            // 21
            var top10LeaveTypes = await _context.LeaveRequests
                .Join(
                    _context.LeaveTypes,
                    lr => lr.LeaveTypeId,
                    lt => lt.LeaveTypeId,
                    (lr, lt) => new
                    {
                        LeaveType = lt.TypeName,
                        lr.TotalDays
                    })
                .GroupBy(x => x.LeaveType)
                .Select(g => new
                {
                    LeaveType = g.Key,
                    TotalLeaveDays = g.Sum(x => x.TotalDays)
                })
                .OrderByDescending(x => x.TotalLeaveDays)
                .Take(10)
                .ToListAsync();

            // 22
            var employeeLeaveBalances = await (
                from lb in _context.LeaveBalances
                join u in _context.Users
                    on lb.UserId equals u.UserId

                select new
                {
                    Employee = u.FullName,
                    lb.AllocatedDays,
                    lb.UsedDays
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalAllocated = g.Sum(x => x.AllocatedDays),
                TotalUsed = g.Sum(x => x.UsedDays),
                TotalRemaining = g.Sum(x => x.AllocatedDays - x.UsedDays)
            })
            .ToListAsync();

            // 23
            var employeeApprovalStatistics = await (
                from lr in _context.LeaveRequests
                join u in _context.Users
                    on lr.UserId equals u.UserId
                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                select new
                {
                    Employee = u.FullName,
                    Status = s.StatusName
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalRequests = g.Count(),
                ApprovedRequests = g.Count(x => x.Status == "Approved"),
                PendingRequests = g.Count(x => x.Status == "Pending"),
                RejectedRequests = g.Count(x => x.Status == "Rejected")
            })
            .ToListAsync();

            // 24
            var lowLeaveBalances = await (
                from lb in _context.LeaveBalances
                join u in _context.Users
                    on lb.UserId equals u.UserId
                join lt in _context.LeaveTypes
                    on lb.LeaveTypeId equals lt.LeaveTypeId

                let remaining = lb.AllocatedDays - lb.UsedDays

                where remaining <= 2

                select new
                {
                    Employee = u.FullName,
                    LeaveType = lt.TypeName,
                    lb.AllocatedDays,
                    lb.UsedDays,
                    RemainingDays = remaining
                }
            )
            .OrderBy(x => x.RemainingDays)
            .ToListAsync();

            // 25
            var monthlyApprovedLeaves = await (
                from lr in _context.LeaveRequests
                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                where s.StatusName == "Approved"

                select lr
            )
            .GroupBy(x => new
            {
                Year = x.StartDate.Year,
                Month = x.StartDate.Month
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                ApprovedLeaves = g.Count(),
                TotalApprovedDays = g.Sum(x => x.TotalDays)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

            // 26
            var employeeLeaveUtilization = await (
                from lb in _context.LeaveBalances
                join u in _context.Users
                    on lb.UserId equals u.UserId

                select new
                {
                    Employee = u.FullName,
                    lb.AllocatedDays,
                    lb.UsedDays
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalAllocated = g.Sum(x => x.AllocatedDays),
                TotalUsed = g.Sum(x => x.UsedDays),
                UtilizationPercentage = g.Sum(x => x.AllocatedDays) == 0
                    ? 0
                    : g.Sum(x => x.UsedDays) * 100.0 / g.Sum(x => x.AllocatedDays)
            })
            .OrderByDescending(x => x.UtilizationPercentage)
            .ToListAsync();

            // 27
            var employeeDashboard = await (
                from lr in _context.LeaveRequests
                join u in _context.Users
                    on lr.UserId equals u.UserId
                join s in _context.Statuses
                    on lr.StatusId equals s.StatusId

                select new
                {
                    Employee = u.FullName,
                    lr.TotalDays,
                    lr.StartDate,
                    Status = s.StatusName
                }
            )
            .GroupBy(x => x.Employee)
            .Select(g => new
            {
                Employee = g.Key,
                TotalRequests = g.Count(),
                Approved = g.Count(x => x.Status == "Approved"),
                Pending = g.Count(x => x.Status == "Pending"),
                Rejected = g.Count(x => x.Status == "Rejected"),
                TotalLeaveDays = g.Sum(x => x.TotalDays),
                AverageLeaveDays = g.Average(x => x.TotalDays),
                LastLeaveStartDate = g.Max(x => x.StartDate)
            })
            .OrderByDescending(x => x.TotalLeaveDays)
            .ToListAsync();

            // ========================================================
            // RETURN ALL 27 DASHBOARD RESULTS
            // ========================================================

            return Ok(new
            {
                Query01_TotalUsers = totalUsers,
                Query02_ActiveUsers = activeUsers,
                Query03_TotalLeaveRequests = totalLeaveRequests,
                Query04_LeaveStatusSummary = leaveStatusSummary,
                Query05_LeaveTypeSummary = leaveTypeSummary,
                Query06_ApproverWorkload = approverWorkload,
                Query07_EmployeeLeaveRequests = employeeLeaveRequests,
                Query08_Top10LeaveUsers = top10LeaveUsers,
                Query09_Bottom10LeaveUsers = bottom10LeaveUsers,
                Query10_OverdueLeaveRequests = overdueLeaveRequests,
                Query11_UpcomingLeaves = upcomingLeaves,
                Query12_LeaveTypeEmployees = leaveTypeEmployees,
                Query13_MonthlyLeaveRequests = monthlyLeaveRequests,
                Query14_RoleWiseActiveUsers = roleWiseActiveUsers,
                Query15_UsersByRole = usersByRole,
                Query16_RolesMoreThan10Users = rolesMoreThan10,
                Query17_RoleStatistics = roleStatistics,
                Query18_LeavesDueWithin7Days = leavesDueWithin7Days,
                Query19_EmployeeLeaveStatistics = employeeLeaveStatistics,
                Query20_LeaveTypeDays = leaveTypeDays,
                Query21_Top10LeaveTypes = top10LeaveTypes,
                Query22_EmployeeLeaveBalances = employeeLeaveBalances,
                Query23_EmployeeApprovalStatistics = employeeApprovalStatistics,
                Query24_LowLeaveBalances = lowLeaveBalances,
                Query25_MonthlyApprovedLeaves = monthlyApprovedLeaves,
                Query26_EmployeeLeaveUtilization = employeeLeaveUtilization,
                Query27_EmployeeDashboard = employeeDashboard
            });
        }
    }
}