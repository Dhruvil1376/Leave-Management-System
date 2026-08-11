using Leave_MS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        //## 1. Display the total number of employees registered in the system.
        [HttpGet]
        public async Task<IActionResult> TotalEmployees()
        {
            var totalEmployees = await _context.Users.CountAsync();
            return Ok(totalEmployees);
        }

        //## 2. Display the total number of employees assigned to each role.
        [HttpGet]
        public async Task<IActionResult> EmployeeByRole()
        {
            var result = await _context.Users
                .GroupBy(u => u.Role)
                .Select(g => new
                {
                    Role = g.Key,
                    EmployeeCount = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        //## 3. Display the total number of leave types available in the system.
        [HttpGet]
        public async Task<IActionResult> TotalLeaveTypes()
        {
            var totalLeaveTypes = await _context.LeaveTypes.CountAsync();
            return Ok(totalLeaveTypes);
        }

        //## 4. Show how many leave requests belong to each status category.
        [HttpGet]
        public async Task<IActionResult> LeaveRequestsByStatus()
        {
            var result = await _context.LeaveRequests
                .GroupBy(lr => lr.Status.StatusName)
                .Select(g => new
                {
                    Status = g.Key,
                    TotalRequests = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        //## 5. Show leave request count for each leave type.
        [HttpGet]
        public async Task<IActionResult> LeaveRequestByType()
        {
            var result = await _context.LeaveRequests.
                GroupBy(lr => lr.LeaveType.TypeName)
                .Select(r => new
                {
                    LeaveType = r.Key,
                    TotalRequests = r.Count()
                })
                .ToListAsync();
            return Ok(result);
        }

        //## 6. Show how many leave requests have been submitted by each employee.
        [HttpGet]
        public async Task<IActionResult> LeaveRequestByEmployee()
        {
            var result = await _context.LeaveRequests
                .GroupBy(lr => lr.User.FullName)
                .Select(r => new
                {
                    Employees = r.Key,
                    TotalRequests = r.Count()
                })
                .ToListAsync();
            return Ok(result);
        }

        //## 7. Show how many employees have taken each type of leave.
        [HttpGet]
        public async Task<IActionResult> LeaveTypeByEmployee()
        {
            var result = await _context.LeaveRequests
                .GroupBy(lt => lt.LeaveType.TypeName)
                .Select(t => new
                {
                    LeaveType = t.Key,
                    TotalEmployees = t
                    .Select(x => x.UserId)
                    .Distinct()
                    .Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        //## 10. Display all pending leave requests.


        //## 11. Display all leave requests that are currently active.
        //A leave is considered active when its status is **Approved * *and the current date falls between the Start Date and End Date.


        //## 13. Display month-wise approved leave request count.


        //## 14. Display role-wise active employee count.


        //## 15. Display each role with the employees assigned to it.


        //## 17. Display role statistics.


        //## 18. Show leave requests starting within the next 7 days.


        //## 19. Display each employee's leave statistics.

        //Display:

        //* Total leave requests
        //* Approved requests
        //* Pending requests
        //* Rejected requests
        //* Total leave days


        //## 20. Display leave-type-wise total allocated leave, used leave, and remaining leave.


        //## 21. Display the top 10 employees based on remaining leave balance.


        //## 22. Display leave statistics for each leave type.


        //## 23. Display approval statistics for each approver.

        //Display:

        //* Total approvals/actions handled
        //*Approved requests
        //* Rejected requests


        //## 24. Display employees whose leave balance is below 5 days.


        //## 25. Show year-wise approved leave request count.


        //## 26. Rank leave types based on the number of approved leave requests.


        //## 27. Display complete leave statistics for every employee.

        //Display:

        //* Total leave requests
        //* Approved requests
        //* Pending requests
        //* Rejected requests
        //* Total leave days
        //*Remaining leave balance


    }
}
